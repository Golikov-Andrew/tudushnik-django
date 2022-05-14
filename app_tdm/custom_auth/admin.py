from django.contrib import admin

from . import models

@admin.register(models.AuthUser)
class AuthUserAdmin(admin.ModelAdmin):
    list_display = ('id','email','display_name','created_at')
