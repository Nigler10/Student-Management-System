from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets, generics
from .models import Student, Subject, Enrollment, Grade
from .serializers import StudentDetailSerializer, SubjectSerializer, EnrollmentDetailSerializer, GradeSerializer

# API Serializer
class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentDetailSerializer

class SubjectViewSet(viewsets.ModelViewSet):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer

class EnrollmentViewSet(viewsets.ModelViewSet):
    queryset = Enrollment.objects.all()
    serializer_class = EnrollmentDetailSerializer

class GradeViewSet(viewsets.ModelViewSet):
    queryset = Grade.objects.all()
    serializer_class = GradeSerializer

# biyuws
def index(request):
    return render(request, "app/index.html")

#Sprint 2
class StudentDetailAPIView(generics.RetrieveAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentDetailSerializer

def student_detail(request, student_id):
    student = get_object_or_404(Student, pk=student_id)
    return render(request, 'app/student_detail.html', {'student_id': student.id})

