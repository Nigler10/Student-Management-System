from django.db import models
from django.core.validators import RegexValidator

SECTION_CHOICES = [
    ('PMMM', 'Puella Magi Madoka Magica'),
    ('MGHS', 'Mitakihara Girls High School'),
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

    # Newly added fields:
    section = models.CharField(max_length=10, choices=SECTION_CHOICES)
    birthdate = models.DateField()
    sex = models.CharField(max_length=1, choices=SEX_CHOICES)
    contact_number = models.CharField(max_length=13, validators=[phone_validator])

    def __str__(self):
        return f"{self.last_name}, {self.first_name} {self.middle_name or ''}"

class Subject(models.Model):
    title = models.CharField(max_length=100)
    code = models.CharField(max_length=10, unique=True)

    def save(self, *args, **kwargs):
        self.code = self.code.upper()  # 💥 Auto-uppercase
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

class Enrollment(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('student', 'subject')

    def __str__(self):
        return f"{self.student} enrolled in {self.subject}"

GRADE_TYPE_CHOICES = (
    ('activity', 'Activity'),
    ('quiz', 'Quiz'),
    ('exam', 'Exam'),
)

class Grade(models.Model):
    enrollment = models.ForeignKey(Enrollment, on_delete=models.CASCADE)
    grade_type = models.CharField(max_length=10, choices=GRADE_TYPE_CHOICES)
    title = models.CharField(max_length=100)  # e.g., "Quiz 1"
    score = models.FloatField()

    def __str__(self):
        return f"{self.enrollment} - {self.grade_type} - {self.title}: {self.score}"

