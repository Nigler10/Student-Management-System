from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from app.views import StudentViewSet, SubjectViewSet, EnrollmentViewSet, GradeViewSet

router = DefaultRouter()
router.register(r'students', StudentViewSet)
router.register(r'subjects', SubjectViewSet)
router.register(r'enrollments', EnrollmentViewSet)
router.register(r'grades', GradeViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),  # API endpoints live under /api/
    path('', include('app.urls')),       # HTML views (index, create, detail pages)
]
