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
    student_name = serializers.SerializerMethodField()
    section_name = serializers.SerializerMethodField()
    subject_name = serializers.SerializerMethodField()
    subject_code = serializers.SerializerMethodField()
    enrolled_on = serializers.DateField(source='date_enrolled', format='%Y-%m-%d')
    student_id = serializers.IntegerField(source='student.id')

    class Meta:
        model = Enrollment
        fields = ['id','student_name','section_name','subject_name','subject_code','enrolled_on','student_id']

    def get_student_name(self, obj):
        middle = f" {obj.student.middle_name}" if obj.student.middle_name else ""
        return f"{obj.student.last_name}, {obj.student.first_name}{middle}"

    def get_section_name(self, obj):
        from app.models import SECTION_CHOICES
        return dict(SECTION_CHOICES).get(obj.student.section, obj.student.section)

    def get_subject_name(self, obj):
        return obj.subject.title

    def get_subject_code(self, obj):
        return obj.subject.code

class EnrollmentToggleActiveSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enrollment
        fields = ['is_active']

# serializers.py
# serializers.py

class EnrollmentGradeBreakdownSerializer(serializers.ModelSerializer):
    quiz_weight = serializers.DecimalField(source='subject.quiz_weight', max_digits=5, decimal_places=2)
    activity_weight = serializers.DecimalField(source='subject.activity_weight', max_digits=5, decimal_places=2)
    exam_weight = serializers.DecimalField(source='subject.exam_weight', max_digits=5, decimal_places=2)
    grades = serializers.SerializerMethodField()
    final_grade = serializers.SerializerMethodField()

    class Meta:
        model = Enrollment
        fields = ['id', 'quiz_weight', 'activity_weight', 'exam_weight', 'grades', 'final_grade']

    def get_grades(self, obj):
        from app.models import Grade
        grade_types = ['quiz', 'activity', 'exam']
        result = {}
        for grade_type in grade_types:
            grades = Grade.objects.filter(enrollment=obj, grade_type=grade_type)
            total_score = sum(g.score or 0 for g in grades)
            total_max = sum(g.max_score or 0 for g in grades)
            percentage = (total_score / total_max * 100) if total_max > 0 else 0
            result[grade_type] = round(percentage, 2)
        return result

    def get_final_grade(self, obj):
        grades = self.get_grades(obj)
        try:
            return round(
                grades.get('quiz', 0) * float(obj.subject.quiz_weight) / 100 +
                grades.get('activity', 0) * float(obj.subject.activity_weight) / 100 +
                grades.get('exam', 0) * float(obj.subject.exam_weight) / 100,
                2
            )
        except Exception:
            return None

# Grade Serializers
class GradeCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Grade
        fields = [
            'id', 'enrollment', 'grade_type', 'title', 'max_score', 'score'
        ]

    def validate(self, data):
        score = data.get('score')
        max_score = data.get('max_score')
        if score is not None and max_score is not None and score > max_score:
            raise serializers.ValidationError("Score cannot exceed max score.")
        return data

class GradeSerializer(serializers.ModelSerializer):
    enrollment_display = serializers.StringRelatedField(source='enrollment', read_only=True)

    class Meta:
        model = Grade
        fields = [
            'id', 'enrollment', 'enrollment_display',
            'grade_type', 'title', 'max_score', 'score'
        ]

class GradePerStudentSerializer(serializers.ModelSerializer):
    subject_title = serializers.SerializerMethodField()
    weight = serializers.SerializerMethodField()
    score_percentage = serializers.SerializerMethodField()

    class Meta:
        model = Grade
        fields = [
            'id', 'title', 'grade_type',
            'score', 'max_score', 'score_percentage',
            'weight', 'subject_title'
        ]

    def get_subject_title(self, obj):
        return obj.enrollment.subject.title

    def get_weight(self, obj):
        subject = obj.enrollment.subject
        weights = {
            'quiz': subject.quiz_weight,
            'activity': subject.activity_weight,
            'exam': subject.exam_weight,
        }
        return float(weights.get(obj.grade_type, 0))

    def get_score_percentage(self, obj):
        if obj.score is None or obj.max_score in (None, 0):
            return None
        return round((obj.score / obj.max_score) * 100, 2)

class GradeDetailSerializer(serializers.ModelSerializer):
    grade_type = serializers.CharField(source='get_grade_type_display')
    
    class Meta:
        model = Grade
        fields = ['id', 'title', 'grade_type', 'score', 'max_score']

class GradeBulkUpdateSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    score = serializers.FloatField()
    max_score = serializers.FloatField()

    def validate(self, data):
        if data['score'] > data['max_score']:
            raise serializers.ValidationError("Score cannot exceed max_score.")
        if data['score'] < 0 or data['max_score'] <= 0:
            raise serializers.ValidationError("Invalid score or max_score.")
        return data

class GradeUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Grade
        fields = ['id', 'enrollment', 'grade_type', 'title', 'max_score', 'score']

    def validate(self, data):
        score = data.get('score')
        max_score = data.get('max_score')
        if score is not None and max_score is not None and score > max_score:
            raise serializers.ValidationError("Score cannot exceed max score.")
        return data
