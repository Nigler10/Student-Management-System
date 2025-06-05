from django.db import models
from django.core.validators import RegexValidator
from django.core.exceptions import ValidationError

SECTION_CHOICES = [
    ('HM', 'Headless Mami'),
    ('HQ', 'Holy Quintet'),
    ('WPS', 'Walpurgisnacht Section'),
    ('KMS', 'Kyubey Monitoring Squad'),
]

SEX_CHOICES = [
    ('M', 'Male'),
    ('F', 'Female'),
]

phone_validator = RegexValidator(
    regex=r'^09\d{2} \d{3} \d{4}$',
    message='Contact number must be in the format: 0912 345 6789'
)

class Student(models.Model):
    first_name = models.CharField(max_length=100)
    middle_name = models.CharField(max_length=100, blank=True, null=True)
    last_name = models.CharField(max_length=100)
    student_id = models.CharField(max_length=20, unique=True)
    email = models.EmailField(unique=True)
    section = models.CharField(max_length=10, choices=SECTION_CHOICES)
    birthdate = models.DateField()
    sex = models.CharField(max_length=1, choices=SEX_CHOICES)
    contact_number = models.CharField(max_length=13, validators=[phone_validator])

    def __str__(self):
        return f"{self.last_name}, {self.first_name} {self.middle_name or ''}"

class Subject(models.Model):
    title = models.CharField(max_length=100)
    code = models.CharField(max_length=10, unique=True)
    quiz_weight = models.DecimalField(max_digits=5, decimal_places=2, default=25.00)
    activity_weight = models.DecimalField(max_digits=5, decimal_places=2, default=25.00)
    exam_weight = models.DecimalField(max_digits=5, decimal_places=2, default=50.00)
    grading_locked = models.BooleanField(default=False)

    def clean(self):
        total = self.quiz_weight + self.activity_weight + self.exam_weight
        if total != 100:
            raise ValidationError("Grade distribution must total 100%.")

    def save(self, *args, **kwargs):
        self.code = self.code.upper()
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.title} - {self.code}"

class Enrollment(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    date_enrolled = models.DateField(auto_now_add=True)
    is_active = models.BooleanField(default=True)  # Optional toggle for unenroll

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['student', 'subject'], name='unique_enrollment')
        ]

    def __str__(self):
        return f"{self.student} → {self.subject}"

GRADE_TYPE_CHOICES = (
    ('activity', 'Activity'),
    ('quiz', 'Quiz'),
    ('exam', 'Exam'),
)

class Grade(models.Model):
    enrollment = models.ForeignKey(Enrollment, on_delete=models.CASCADE)
    grade_type = models.CharField(max_length=10, choices=GRADE_TYPE_CHOICES)
    title = models.CharField(max_length=100)
    max_score = models.FloatField()
    score = models.FloatField(blank=True, null=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['enrollment', 'grade_type', 'title'], name='unique_grade_per_student')
        ]

    def clean(self):
        if self.score is not None and self.max_score is not None:
            if self.score > self.max_score:
                raise ValidationError("Score cannot exceed max score.")

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.enrollment} - {self.grade_type} - {self.title}: {self.score or '-'} / {self.max_score}"
