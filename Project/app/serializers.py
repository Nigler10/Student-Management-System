from rest_framework import serializers
from .models import Student, Subject, Enrollment, Grade

class GradeSerializer(serializers.ModelSerializer):
    enrollment = serializers.PrimaryKeyRelatedField(queryset=Enrollment.objects.all())

    class Meta:
        model = Grade
        fields = ['id', 'enrollment', 'grade_type', 'title', 'score']

class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = ['id', 'title', 'code']

class EnrollmentSerializer(serializers.ModelSerializer):
    student = serializers.PrimaryKeyRelatedField(queryset=Student.objects.all())
    subject_id = serializers.PrimaryKeyRelatedField(
        queryset=Subject.objects.all(), source='subject', write_only=True
    )
    subject = SubjectSerializer(read_only=True)
    grades = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Enrollment
        fields = ['student', 'subject_id', 'subject', 'grades']

    def get_grades(self, obj):
        grades = Grade.objects.filter(enrollment=obj)
        return GradeSerializer(grades, many=True).data

class StudentDetailSerializer(serializers.ModelSerializer):
    enrollments = serializers.SerializerMethodField()

    class Meta:
        model = Student
        fields = ['id', 'first_name', 'middle_name', 'last_name', 'student_id', 'email', 'enrollments']

    def get_enrollments(self, obj):
        enrollments = Enrollment.objects.filter(student=obj)
        return EnrollmentSerializer(enrollments, many=True).data
