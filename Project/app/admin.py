from django.contrib import admin
from app.models import Student, Subject, Enrollment, Grade

admin.site.register(Student)
admin.site.register(Subject)
admin.site.register(Enrollment)
admin.site.register(Grade)
