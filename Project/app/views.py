from django.shortcuts import render, get_object_or_404
from app.models import SECTION_CHOICES
from rest_framework import viewsets
from django.conf import settings
from .models import Student, Subject, Enrollment, Grade
from .serializers import (
    StudentDetailSerializer, StudentCreateSerializer,
    SubjectDetailSerializer, SubjectSerializer,
    EnrollmentDetailSerializer, EnrollmentListSerializer, EnrollmentCreateSerializer,
     GradeSerializer
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


class GradeViewSet(viewsets.ModelViewSet):
    queryset = Grade.objects.all()
    serializer_class = GradeSerializer

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
