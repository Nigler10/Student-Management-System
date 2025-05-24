from rest_framework import serializers
from .models import Student, Subject, Enrollment, Grade

# Student Serializers

class StudentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ['student_id', 'first_name', 'middle_name', 'last_name', 'email']

class EnrolledStudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ['id', 'first_name', 'middle_name', 'last_name']

class StudentDetailSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    enrollments = serializers.SerializerMethodField()

    class Meta:
        model = Student
        fields = [
            'id', 'student_id', 'email', 'first_name', 'middle_name', 'last_name',
            'full_name', 'enrollments'
        ]

    def get_full_name(self, obj):
        return f"{obj.last_name}, {obj.first_name} {obj.middle_name or ''}".strip()

    def get_enrollments(self, obj):
        enrollments = obj.enrollment_set.select_related('subject').prefetch_related('grade_set')
        return EnrollmentDetailSerializer(enrollments, many=True).data

# Subject Serializers

class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = ['id', 'title', 'code']

class SubjectDetailSerializer(serializers.ModelSerializer):
    enrolled_students = serializers.SerializerMethodField()

    class Meta:
        model = Subject
        fields = ['id', 'title', 'code', 'enrolled_students']

    def get_enrolled_students(self, obj):
        students = Student.objects.filter(enrollment__subject=obj).distinct().order_by('last_name', 'first_name')
        return EnrolledStudentSerializer(students, many=True).data

# Enrollment Serializers

class EnrollmentDetailSerializer(serializers.ModelSerializer):
    student = serializers.PrimaryKeyRelatedField(queryset=Student.objects.all())
    student_display = serializers.StringRelatedField(source='student', read_only=True)

    subject = serializers.PrimaryKeyRelatedField(queryset=Subject.objects.all())
    subject_display = serializers.StringRelatedField(source='subject', read_only=True)

    grades = serializers.SerializerMethodField()

    class Meta:
        model = Enrollment
        fields = [
            'id', 'student', 'student_display',
            'subject', 'subject_display',
            'grades'
        ]

    def get_grades(self, obj):
        grades = obj.grade_set.all()
        return GradeSerializer(grades, many=True).data

# Grade Serializers

class GradeSerializer(serializers.ModelSerializer):
    enrollment_display = serializers.StringRelatedField(source='enrollment', read_only=True)

    class Meta:
        model = Grade
        fields = ['id', 'enrollment', 'enrollment_display', 'title', 'grade_type', 'score']
