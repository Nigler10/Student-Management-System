from django.urls import path
from . import views
from .views import StudentDetailAPIView

urlpatterns = [
    path('', views.index, name='index'),
    path('students/<int:student_id>/', views.student_detail, name='student-detail'),
    path('api/students/<int:pk>/', StudentDetailAPIView.as_view(), name='api-student-detail'),
]
