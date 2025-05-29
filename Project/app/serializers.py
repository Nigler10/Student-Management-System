from rest_framework import serializers
from .models import Student, Subject, Enrollment, Grade
from app.models import SECTION_CHOICES

# Student Serializers

class StudentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = [
            'student_id', 'first_name', 'middle_name', 'last_name', 'email',
            'section', 'birthdate', 'sex', 'contact_number'
        ]

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
            'id', 'student_id', 'email',
            'first_name', 'middle_name', 'last_name',
            'section', 'birthdate', 'sex', 'contact_number',
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
        fields = [
            'id', 'title', 'code',
            'quiz_weight', 'activity_weight', 'exam_weight',
            'grading_locked'
        ]

    def update(self, instance, validated_data):
        # Prevent changes to grade weights if locked
        if instance.grading_locked:
            for field in ['quiz_weight', 'activity_weight', 'exam_weight']:
                if field in validated_data:
                    raise serializers.ValidationError(
                        f"Cannot modify {field} once grading is locked."
                    )
        return super().update(instance, validated_data)

class SubjectDetailSerializer(serializers.ModelSerializer):
    enrolled_students = serializers.SerializerMethodField()

    class Meta:
        model = Subject
        fields = [
            'id', 'title', 'code',
            'quiz_weight', 'activity_weight', 'exam_weight',
            'grading_locked', 'enrolled_students'
        ]

    def get_enrolled_students(self, obj):
        students = Student.objects.filter(
            enrollment__subject=obj
        ).distinct().order_by('last_name', 'first_name')
        return EnrolledStudentSerializer(students, many=True).data

# Enrollment Serializers

class EnrollmentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enrollment
        fields = ['id', 'student', 'subject', 'is_active']

    def validate(self, data):
        # Prevent duplicate active enrollments
        if Enrollment.objects.filter(
            student=data['student'], subject=data['subject']
        ).exists():
            raise serializers.ValidationError("This student is already enrolled in this subject.")
        return data

class EnrollmentListSerializer(serializers.ModelSerializer):
    student_display = serializers.StringRelatedField(source='student')
    subject_display = serializers.StringRelatedField(source='subject')

    class Meta:
        model = Enrollment
        fields = [
            'id', 'student', 'student_display',
            'subject', 'subject_display',
            'date_enrolled', 'is_active'
        ]

class EnrollmentDetailSerializer(serializers.ModelSerializer):
    student_display = serializers.SerializerMethodField()
    subject_display = serializers.SerializerMethodField()
    section_name = serializers.SerializerMethodField()
    student_id = serializers.IntegerField(source='student.id')

    class Meta:
        model = Enrollment
        fields = ['id', 'student_display', 'subject_display', 'section_name', 'date_enrolled', 'is_active', 'student_id']

    def get_student_display(self, obj):
        return str(obj.student)

    def get_subject_display(self, obj):
        return str(obj.subject)

    def get_section_name(self, obj):
        from app.models import SECTION_CHOICES
        return dict(SECTION_CHOICES).get(obj.student.section, obj.student.section)

class EnrollmentToggleActiveSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enrollment
        fields = ['is_active']

# Grade Serializers

class GradeSerializer(serializers.ModelSerializer):
    enrollment_display = serializers.StringRelatedField(source='enrollment', read_only=True)

    class Meta:
        model = Grade
        fields = ['id', 'enrollment', 'enrollment_display', 'title', 'grade_type', 'score']
