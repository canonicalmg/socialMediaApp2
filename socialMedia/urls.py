from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.signUpLogIn, name='signUp'),
    url(r'^home$', views.home, name='home'),
    url(r'^commentToPost$', views.commentToPost, name='commentToPost'),
    url(r'^searchUsers$', views.searchUsers, name='searchUsers'),
    url(r'^editProfile$', views.editProfile, name='editProfile'),
    url(r'^editProfile/uploadPic$', views.uploadPic, name='uploadPic'),
    url(r'^editProfile/changeDescription$', views.changeDescription, name='changeDescription'),
    url(r'^editProfile/changePrimaryPic$', views.changePrimaryPic, name='changePrimaryPic'),
    url(r'^editProfile/syncWithFacebook$', views.syncWithFacebook, name='syncWithFacebook'),
    url(r'^user/(?P<string>[\w\-]+)/$', views.userProfile),
    url(r'^user/(?P<string>[\w\-]+)/writeToWall/$', views.writeToWall, name='writeToWall'),
    url(r'^user/(?P<string>[\w\-]+)/getWallPosts/$', views.getWallPosts, name='getWallPosts'),
    url(r'^newUserSignUp/$', views.newUserSignUp, name='newUserSignUp'),
    url(r'^headerSignIn/$', views.headerSignIn, name='headerSignIn'),
    url(r'^headerSignInFacebook/$', views.headerSignInFacebook, name='headerSignInFacebook'),
    url(r'^headerSignOut/$', views.headerSignOut, name='headerSignOut'),
]