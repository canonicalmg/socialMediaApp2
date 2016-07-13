from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.signUpLogIn, name='signUp'),
    url(r'^home$', views.home, name='home'),
    url(r'^incomingSMS$', views.incomingSMS, name='incomingSMS'),
    url(r'^commentToPost$', views.commentToPost, name='commentToPost'),
    url(r'^likePost$', views.likePost, name='likePost'),
    url(r'^searchUsers$', views.searchUsers, name='searchUsers'),
    url(r'^sendSMS$', views.sendSMS, name='sendSMS'),
    url(r'^editProfile$', views.editProfile, name='editProfile'),
    url(r'^editProfile/uploadPic$', views.uploadPic, name='uploadPic'),
    url(r'^editProfile/changeDescription$', views.changeDescription, name='changeDescription'),
    url(r'^editProfile/changePrimaryPic$', views.changePrimaryPic, name='changePrimaryPic'),
    url(r'^editProfile/syncWithFacebook$', views.syncWithFacebook, name='syncWithFacebook'),
    url(r'^editProfile/addChangePhoneNumber$', views.addChangePhoneNumber, name='addChangePhoneNumber'),
    url(r'^user/(?P<string>[\w\-]+)/$', views.userProfile),
    url(r'^user/(?P<string>[\w\-]+)/writeToWall/$', views.writeToWall, name='writeToWall'),
    url(r'^user/(?P<string>[\w\-]+)/getWallPosts/$', views.getWallPosts, name='getWallPosts'),
    url(r'^newUserSignUp/$', views.newUserSignUp, name='newUserSignUp'),
    url(r'^headerSignIn/$', views.headerSignIn, name='headerSignIn'),
    url(r'^headerSignIn2/$', views.headerSignIn2, name='headerSignIn2'),
    url(r'^headerSignInFacebook/$', views.headerSignInFacebook, name='headerSignInFacebook'),
    url(r'^headerSignOut/$', views.headerSignOut, name='headerSignOut'),
]