from django.urls import path
from . import views
from .views import StudentDetailAPIView

urlpatterns = [
    path('', views.index, name='index'),
    path('students/<int:student_id>/', views.student_detail, name='student-detail'),
    path('students/create/', views.create_student, name='create-student'),
    path('students/<int:student_id>/edit/', views.edit_student, name='edit-student'),
    
    path('api/students/<int:pk>/', StudentDetailAPIView.as_view(), name='api-student-detail'),
]
