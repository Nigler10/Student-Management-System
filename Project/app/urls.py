from django.urls import path
from . import views

urlpatterns = [
    path('home/', views.index, name='index'),
    path('students/<int:pk>/', views.student_detail_page, name='student-detail'),
    path('api/students/<int:pk>/', views.student_detail_api),
]
