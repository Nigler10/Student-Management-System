from django.db import models

GRADE_TYPE_CHOICES = (
    ('activity', 'Activity'),
    ('quiz', 'Quiz'),
    ('exam', 'Exam'),
)

class Student(models.Model):
    first_name = models.CharField(max_length=100)
    middle_name = models.CharField(max_length=100, blank=True, null=True)
    last_name = models.CharField(max_length=100)
    student_id = models.CharField(max_length=20, unique=True)
    email = models.EmailField(unique=True)

    def __str__(self):
        return f"{self.last_name}, {self.first_name} {self.middle_name}"

class Subject(models.Model):
    title = models.CharField(max_length=100)
    code = models.CharField(max_length=10, unique=True)

    def __str__(self):
        return self.title

class Enrollment(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('student', 'subject')

    def __str__(self):
        return f"{self.student} enrolled in {self.subject}"

class Grade(models.Model):
    enrollment = models.ForeignKey(Enrollment, on_delete=models.CASCADE)
    grade_type = models.CharField(max_length=10, choices=GRADE_TYPE_CHOICES)
    title = models.CharField(max_length=100)  # e.g., "Quiz 1"
    score = models.FloatField()

    def __str__(self):
        return f"{self.enrollment} - {self.grade_type} - {self.title}: {self.score}"
