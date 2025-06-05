from django.urls import path
from . import views
from .views import EnrollmentGradeBreakdownView, EnrollmentGradeDetailView, subject_weights_view

urlpatterns = [
    # Student HTML
    path('', views.index, name='index'),
    path('students/<int:student_id>/', views.student_detail, name='student-detail'),
    path('students/create/', views.create_student, name='create-student'),
    path('students/<int:student_id>/edit/', views.edit_student, name='edit-student'),

    # Subject HTML
    path('subjects/', views.subject_list, name='subject-list'),
    path('subjects/<int:subject_id>/', views.subject_detail, name='subject-detail'),
    path('subjects/create/', views.create_subject, name='create-subject'),
    path('subjects/<int:subject_id>/edit/', views.edit_subject, name='edit-subject'),
    
    path('api/subjects/<str:subject_code>/weights/', subject_weights_view, name='subject-weights'),

    # Enrollment HTML
    path('enrollments/', views.enrollment_list, name='enrollment-list'),
    path('enrollments/create/', views.enrollment_create_view, name='enrollment_create'),
    path('enrollments/<int:enrollment_id>/', views.enrollment_detail, name='enrollment-detail'),
    path('enrollments/<int:enrollment_id>/edit/', views.edit_enrollment, name='edit-enrollment'),
    path('enrollments/<int:enrollment_id>/grades/', views.enrollment_grades_page, name='enrollment-grades-page'),

    path('api/enrollments/<int:pk>/grade-breakdown/', EnrollmentGradeBreakdownView.as_view()),
    path('api/enrollments/<int:enrollment_id>/grades/', EnrollmentGradeDetailView.as_view(), name='enrollment-grade-detail'),

    # Grade HTML
    path('grades/create/', views.grade_create_view, name='grade-create'),
    path('grades/<int:grade_id>/edit/', views.grade_edit_view, name='grade-edit'),
]
