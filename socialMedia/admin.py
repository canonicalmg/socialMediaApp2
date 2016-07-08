from django.contrib import admin
from .models import profile, profilePhotos, profilePrimaryPic, wallPost, postComment
# Register your models here.

admin.site.register(profile)
admin.site.register(profilePhotos)
admin.site.register(profilePrimaryPic)
admin.site.register(wallPost)
admin.site.register(postComment)