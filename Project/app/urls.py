from django.urls import path
from . import views
from .views import EnrollmentListCreateAPIView

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
    
    # Enrollment HTML
    path('enrollments/', views.enrollment_list, name='enrollment-list'),
    path('enrollments/<int:enrollment_id>/', views.enrollment_detail, name='enrollment-detail'),
    path('enrollments/<int:enrollment_id>/edit/', views.edit_enrollment, name='edit-enrollment'),
    path('api/enrollments/', EnrollmentListCreateAPIView.as_view(), name='enrollment-list-create'),

]
