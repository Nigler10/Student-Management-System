from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets
from .models import Student, Subject, Enrollment, Grade
from .serializers import StudentDetailSerializer, SubjectSerializer, EnrollmentSerializer, GradeSerializer

# API Serializer
class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentDetailSerializer

class SubjectViewSet(viewsets.ModelViewSet):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer

class EnrollmentViewSet(viewsets.ModelViewSet):
    queryset = Enrollment.objects.all()
    serializer_class = EnrollmentSerializer

class GradeViewSet(viewsets.ModelViewSet):
    queryset = Grade.objects.all()
    serializer_class = GradeSerializer

# biyuws
def index(request):
    return render(request, "app/index.html")


def student_detail_page(request, pk):
    return render(request, 'app/student_detail.html')

@api_view(['GET'])
def student_detail_api(request, pk):
    student = get_object_or_404(Student, pk=pk)
    serializer = StudentDetailSerializer(student)
    return Response(serializer.data)

