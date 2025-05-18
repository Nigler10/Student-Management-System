from rest_framework import serializers
from .models import Student, Subject, Enrollment, Grade

class GradeSerializer(serializers.ModelSerializer):
    enrollment_display = serializers.StringRelatedField(source='enrollment', read_only=True)
    class Meta:
        model = Grade
        fields = ['id', 'enrollment', 'enrollment_display', 'title', 'grade_type', 'score']

class EnrollmentDetailSerializer(serializers.ModelSerializer):
    student = serializers.PrimaryKeyRelatedField(queryset=Student.objects.all())
    student_display = serializers.StringRelatedField(source='student', read_only=True)
    subject = serializers.PrimaryKeyRelatedField(queryset=Subject.objects.all())
    subject_title = serializers.CharField(source='subject.title')
    grades = serializers.SerializerMethodField()

    class Meta:
        model = Enrollment
        fields = ['id', 'student', 'student_display', 'subject', 'subject_title', 'grades']

    def get_grades(self, obj):
        grades = Grade.objects.filter(enrollment=obj)
        return GradeSerializer(grades, many=True).data

class StudentDetailSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    enrollments = EnrollmentDetailSerializer(source='enrollment_set', many=True)

    class Meta:
        model = Student
        fields = ['id', 'student_id', 'email', 'first_name', 'middle_name', 'last_name', 'full_name', 'enrollments']

    def get_full_name(self, obj):
        return f"{obj.last_name}, {obj.first_name} {obj.middle_name or ''}".strip()
        
class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = ['id', 'title', 'code']
