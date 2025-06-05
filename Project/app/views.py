from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from app.models import SECTION_CHOICES
from rest_framework import viewsets, generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.conf import settings
from .models import Student, Subject, Enrollment, Grade
from .serializers import (
    StudentDetailSerializer, StudentCreateSerializer,
    SubjectDetailSerializer, SubjectSerializer,
    EnrollmentDetailSerializer, EnrollmentListSerializer, EnrollmentCreateSerializer, EnrollmentGradeBreakdownSerializer,
    GradeSerializer, GradeDetailSerializer, GradeUpdateSerializer
)

# API Views
class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return StudentCreateSerializer
        return StudentDetailSerializer

class SubjectViewSet(viewsets.ModelViewSet):
    queryset = Subject.objects.all()

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return SubjectDetailSerializer
        return SubjectSerializer

class EnrollmentViewSet(viewsets.ModelViewSet):
    queryset = Enrollment.objects.all()
    serializer_class = EnrollmentDetailSerializer  # default

    def get_queryset(self):
        queryset = Enrollment.objects.all()
        student_id = self.request.query_params.get('student')
        subject_id = self.request.query_params.get('subject')

        if student_id:
            queryset = queryset.filter(student__id=student_id)
        if subject_id:
            queryset = queryset.filter(subject__id=subject_id)
        return queryset

    def get_serializer_class(self):
        if self.action == 'list':
            return EnrollmentListSerializer
        elif self.action == 'create':
            return EnrollmentCreateSerializer
        elif self.action == 'update' or self.action == 'partial_update':
            return EnrollmentCreateSerializer  # optional, in case you support editing
        return EnrollmentDetailSerializer

    def perform_create(self, serializer):
        enrollment = serializer.save()

        # Get all unique grades associated with the subject (not per student)
        existing_grades = Grade.objects.filter(
            enrollment__subject=enrollment.subject
        ).values('grade_type', 'title', 'max_score').distinct()

        # Clone those grades for this new enrollment
        for grade_data in existing_grades:
            Grade.objects.create(
                enrollment=enrollment,
                grade_type=grade_data['grade_type'],
                title=grade_data['title'],
                max_score=grade_data['max_score'],
                score=None  # new grade has no score yet
            )

class EnrollmentGradeBreakdownView(generics.RetrieveAPIView):
    queryset = Enrollment.objects.all()
    serializer_class = EnrollmentGradeBreakdownSerializer

class EnrollmentGradeDetailView(APIView):
    def get(self, request, enrollment_id):
        enrollment = get_object_or_404(Enrollment, id=enrollment_id)
        grades = Grade.objects.filter(enrollment=enrollment)

        # Assuming subject_weight is available per grade (e.g., stored or computed)
        serialized_grades = GradeDetailSerializer(grades, many=True).data

        return Response({
            'grades': serialized_grades,
            'subject_name': enrollment.subject_display if hasattr(enrollment, 'subject_display') else str(enrollment.subject),
            'subject_code': enrollment.subject.code if hasattr(enrollment.subject, 'code') else str(enrollment.subject),
        })

class GradeViewSet(viewsets.ModelViewSet):
    queryset = Grade.objects.all()
    serializer_class = GradeSerializer

    def get_queryset(self):
        queryset = Grade.objects.all()
        enrollment_id = self.request.query_params.get('enrollment')
        subject_id = self.request.query_params.get('subject')

        if enrollment_id:
            queryset = queryset.filter(enrollment__id=enrollment_id)
        elif subject_id:
            queryset = queryset.filter(enrollment__subject__id=subject_id)

        return queryset

    def get_serializer_class(self):
        if self.action in ['update', 'partial_update']:
            return GradeUpdateSerializer
        return GradeSerializer

# HTML Views (Student)
def index(request):
    return render(request, "app/index.html")

def create_student(request):
    return render(request, 'student/student_create.html')

def student_detail(request, student_id):
    student = get_object_or_404(Student, pk=student_id)
    return render(request, 'student/student_detail.html', {'student_id': student.id})

def edit_student(request, student_id):
    student = get_object_or_404(Student, pk=student_id)
    return render(request, 'student/student_edit.html', {'student_id': student.id})

# HTML Views (Subject)

def subject_list(request):
    return render(request, 'subject/subject_list.html')

def subject_detail(request, subject_id):
    subject = get_object_or_404(Subject, pk=subject_id)
    return render(request, 'subject/subject_detail.html', {'subject_id': subject.id})

def create_subject(request):
    return render(request, 'subject/subject_create.html')

def edit_subject(request, subject_id):
    subject = get_object_or_404(Subject, pk=subject_id)
    return render(request, 'subject/subject_edit.html', {'subject_id': subject.id})

def subject_weights_view(request, subject_code):
    subject = get_object_or_404(Subject, code=subject_code.upper())
    return JsonResponse({
        'quiz_weight': float(subject.quiz_weight),
        'activity_weight': float(subject.activity_weight),
        'exam_weight': float(subject.exam_weight)
    })

# HTML Views (Enrollment)

def enrollment_list(request):
    return render(request, 'enrollment/enrollment_list.html')

def enrollment_detail(request, enrollment_id):
    enrollment = get_object_or_404(Enrollment, pk=enrollment_id)
    return render(request, 'enrollment/enrollment_detail.html', {'enrollment_id': enrollment.id})

def enrollment_create_view(request):
    section_choices = SECTION_CHOICES
    students = Student.objects.all()
    subjects = Subject.objects.all()
    return render(request, 'enrollment/enrollment_create.html', {
        'section_choices': section_choices,
        'students': students,
        'subjects': subjects
    })

def edit_enrollment(request, enrollment_id):
    enrollment = get_object_or_404(Enrollment, pk=enrollment_id)
    return render(request, 'enrollment/enrollment_edit.html', {'enrollment_id': enrollment.id})

# HTML Views (Grade)
def grade_create_view(request):
    return render(request, 'grade/grade_create.html')

def enrollment_grades_page(request, enrollment_id):
    return render(request, 'grade/grade_detail.html', {'enrollment_id': enrollment_id})

def grade_edit_view(request, grade_id):
    return render(request, 'grade/grade_edit.html', {'grade_id': grade_id})
