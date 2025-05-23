from django.urls import path
from . import views

urlpatterns = [
    # Student HTML
    path('', views.index, name='index'),
    path('students/<int:student_id>/', views.student_detail, name='student-detail'),
    path('students/create/', views.create_student, name='create-student'),
    path('students/<int:student_id>/edit/', views.edit_student, name='edit-student'),

    # Subject HTML
    path('subjects/create/', views.create_subject, name='create-subject'),
    path('subjects/', views.subject_list, name='subject-list'),
    path('subjects/<int:subject_id>/', views.subject_detail, name='subject-detail'),
]
