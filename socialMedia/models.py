from __future__ import unicode_literals
from django.contrib.auth.models import User

from django.db import models

# Create your models here.

class profile(models.Model):
    #user = models.ForeignKey(User, unique=True)
    user = models.OneToOneField(User)
    aboutMe = models.CharField(max_length=300, blank=True)
    faceBookID = models.CharField(max_length=30, blank=True)

    def __unicode__(self):
        return self.user.first_name

    def getPrimaryPicURL(self):
        primaryPic = self.profileprimarypic_set.first()
        if primaryPic:
            return primaryPic.profilePic.picLocation.url
        else:
            return "#"

    #class Meta:
        #verbose_name = self.user.firstName

class profilePhotos(models.Model):
    profile = models.ForeignKey(profile)
    desc = models.CharField(max_length=300, blank=True)
    picLocation = models.ImageField(upload_to='', null=True)

    def __unicode__(self):
        return self.picLocation.url + " " + self.desc

class profilePrimaryPic(models.Model):
    profile = models.ForeignKey(profile, unique=True)
    profilePic = models.ForeignKey(profilePhotos, blank=True)

class wallPost(models.Model):
    postSender = models.ForeignKey(User, related_name='%(class)s_requests_created')
    postReceiver = models.ForeignKey(User)
    created_at = models.DateTimeField(auto_now_add=True)
    content = models.CharField(max_length=500, blank=True)

    def __unicode__(self):
        return self.postSender.username + " -> " + self.postReceiver.username + ":" + str(self.pk)

class postComment(models.Model):
    post = models.ForeignKey(wallPost)
    commentSender = models.ForeignKey(User)
    created_at = models.DateTimeField(auto_now_add=True)
    content = models.CharField(max_length=500, blank=True)

    def __unicode__(self):
        return self.commentSender.username + " -> " + self.post.postReceiver.username + "COMMENT" + str(self.post.pk) + "-" + str(self.pk)