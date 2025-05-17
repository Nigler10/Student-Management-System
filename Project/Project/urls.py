from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from app.views import StudentViewSet, SubjectViewSet, EnrollmentViewSet, GradeViewSet

router = routers.DefaultRouter()
router.register(r'students', StudentViewSet)
router.register(r'subjects', SubjectViewSet)
router.register(r'enrollments', EnrollmentViewSet)
router.register(r'grades', GradeViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/', include('app.urls')),  # already added for API
    path('', include('app.urls')),      # now including app views
]
