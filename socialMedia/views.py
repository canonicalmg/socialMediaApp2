from django.http import HttpResponse, HttpResponseRedirect
from django.template import loader
from django.contrib.auth.models import User
from .models import profile, profilePhotos, profilePrimaryPic, wallPost, postComment, postLike
from django.contrib.auth import authenticate,login, logout
import json
from .forms import DocumentForm, loginForm
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.core.urlresolvers import reverse
from django.http import JsonResponse
from django.db.models import Q


def signUpLogIn(request):
    if request.user.is_authenticated():
        #send them to /home
        return HttpResponseRedirect("home")
    else:
        #display sign in/sign up
        #template = loader.get_template('signUpLogin.html')
        template = loader.get_template('headerLogin.html')
        logForm = loginForm()
        context = {
            'loginForm': logForm
        }
        return HttpResponse(template.render(context, request))

def home(request):
    if request.user.is_authenticated():
        template = loader.get_template('home.html')
        userWallPosts = wallPost.objects.filter().order_by('-pk')
        sendThesePosts = []
        for j in userWallPosts:
            currentUser = User.objects.get(username=j.postSender.username)
            currentProfile = profile.objects.get(user=currentUser)
            profilePrimary = profilePrimaryPic.objects.get(profile=currentProfile)
            postComments = postComment.objects.filter(post=j)
            likers = j.getLikers()
            likersArray = []
            for x in likers:
                likersArray.append(x.user.username)
            try:
                postLike.objects.get(user=request.self)
                isLiked = True
            except:
                isLiked = False
            sendThesePosts.append([j.postSender.username, j.content, j.created_at.strftime("%I:%M %B %d, %Y"), j.postReceiver.username, profilePrimary.profilePic.picLocation.url, postComments, j.pk, isLiked, j.likes, likersArray])
        context = {'wallPosts': sendThesePosts}
        return HttpResponse(template.render(context, request))
    else:
        #login
        return HttpResponseRedirect("/")

def editProfile(request):
    if request.user.is_authenticated():
        #proceed
        template = loader.get_template('editProfile.html')
        context = {
            'test':"test"
        }
        useThis = str("Hello")
        currentProfile = profile.objects.get(user=request.user)
        profilePrimary = profilePrimaryPic.objects.get(profile=currentProfile)
        profileSecondary = profilePhotos.objects.filter(profile=currentProfile)
        sendThesePics = []
        for j in profileSecondary:
            sendThesePics.append([j.picLocation.url, j.desc, j.pk])
        return HttpResponse(template.render({"primaryPic": profilePrimary.profilePic.picLocation.url, "secondaryPics": sendThesePics, "aboutMe": currentProfile.aboutMe, "title":request.user.username + "(" + request.user.first_name + ")"}, request))
    else:
        #login
        return HttpResponseRedirect("/")

def uploadPic(request):
    # Handle file upload
    print "entered?"
    if request.method == 'POST':
        form = DocumentForm(request.POST, request.FILES)
        if form.is_valid():
            currentProfile = profile.objects.get(user=request.user)
            profileSecondaryPic = profilePhotos(profile=currentProfile,desc=request.POST['description2'], picLocation=request.FILES['docfile'])
            #newdoc = Document(docfile = request.FILES['docfile'])
            profileSecondaryPic.save()

            # Redirect to the document list after POST
            return HttpResponseRedirect(reverse('editProfile'))
    else:
        form = DocumentForm() # A empty, unbound form

    # Load documents for the list page
    documents = profilePhotos.objects.all()

    # Render list page with the documents and the form
    return render_to_response(
        'uploadPic.html',
        {'documents': documents, 'form': form},
        context_instance=RequestContext(request)
    )

def newUserSignUp(request):
    print "entered"
    if request.is_ajax():
        if request.method == "POST":
            data = request.POST.getlist("data[]")
            isUser = User.objects.filter(username=str(data[2]))
            print "user=",len(isUser)
            if len(isUser) is 0:
                newUser = User.objects.create_user(str(data[2]), str(data[4]), str(data[3]))
                newUser.first_name = str(data[0])
                newUser.last_name = str(data[1])
                newUser.save()

                userName = str(data[2])
                #create profile
                newUser = User.objects.get(username = userName )
                print "newUser", newUser
                newProfile = profile(user=newUser)
                newProfile.save()

                #create profilePic
                newProfile = profile.objects.get(user=newUser)
                print "newProfile", newProfile
                newPhoto = profilePhotos(profile=newProfile, desc="Temporary Photo", picLocation="/images/blank.jpg")
                newPhoto.save()

                #create profilePrimaryPic
                newPhoto = profilePhotos.objects.get(profile=newProfile)
                print "newPhoto", newPhoto
                newPrimary = profilePrimaryPic(profile=newProfile, profilePic=newPhoto)
                newPrimary.save()


                user = authenticate(username= userName, password=str(data[3]))
                if user is not None:
                    if user.is_active:
                        login(request, user)
                        return HttpResponse("return this string")
                #template = loader.get_template('home.html')
                return HttpResponse("return this string")
                #context = {}
                #return HttpResponse(template.render(context, request))
            else:
                return HttpResponse("Error: Username already exists.")


def headerSignIn(request):
    print "entered"
    if request.is_ajax():
        if request.method == "POST":
            data = request.POST.getlist("data[]")
            user = authenticate(username=str(data[0]), password=str(data[1]))
            if user is not None:
                if user.is_active:
                    login(request, user)
                    return HttpResponse("return this string")
            else:
                return HttpResponse("Does not match")

def headerSignInFacebook(request):
    print "entered"
    if request.is_ajax():
        if request.method == "POST":
            data = request.POST.get("data")
            print "data", data
            userProfile = profile.objects.filter(faceBookID=data).first()
            print "profile", userProfile
            user = userProfile.user
            print "user", user
            #user = authenticate(username=user.username, password=user.password)
            print "user2", user
            user.backend = 'django.contrib.auth.backends.ModelBackend'
            if user is not None:
                if user.is_active:
                    login(request, user)
                    return HttpResponse("return this string")

def headerSignOut(request):
    print "entered"
    if request.is_ajax():
        logout(request)
        return HttpResponse("return this string")

def userProfile(request, string):
    if User.objects.filter(username=string).exists():
        #title, primary pic, about me
        try:
            template = loader.get_template('userProfile.html')
            currentUser = User.objects.get(username=string)
            currentProfile = profile.objects.get(user=currentUser)
            profilePrimary = profilePrimaryPic.objects.get(profile=currentProfile)

            userWallPosts = wallPost.objects.filter(postReceiver=currentUser).order_by('-pk')
            sendThesePosts = []
            for j in userWallPosts:
                sendingUser = User.objects.get(username=j.postSender.username)
                sendingProfile = profile.objects.get(user=sendingUser)
                #profilePrimary = profilePrimaryPic.objects.get(profile=currentProfile)
                #profilePrimary = profilePrimaryPic.objects.get(profile=j.postSender.profile.profileprimarypic_set.first())
                postComments = postComment.objects.filter(post=j)
                likers = j.getLikers()
                likersArray = []
                for x in likers:
                    likersArray.append(x.user.username)
                try:
                    postLike.objects.get(user=request.self)
                    isLiked = True
                except:
                    isLiked = False
                sendThesePosts.append([j.postSender, j.content, j.created_at.strftime("%I:%M %B %d, %Y"),sendingProfile.getPrimaryPicURL(), postComments, j.pk, isLiked, j.likes, likersArray ])

            return HttpResponse(template.render(
                {"primaryPic": profilePrimary.profilePic.picLocation.url, 'wallPosts': sendThesePosts,
                "aboutMe": currentProfile.aboutMe, "title": currentUser.username + "(" + currentUser.first_name + ")"},
                request))
        except:
            return HttpResponse("Error, Profile not initialized properly")
    else:
        return HttpResponse("User does not exist")

def writeToWall(request, string):
    if request.is_ajax():
        if request.method == "POST":
            print "entered"

            data = request.POST.getlist("data[]")
            if string == data[1]:
                currentUser = User.objects.get(username=string)
                newPost = wallPost(postSender=request.user, postReceiver=currentUser, content=data[0])
                newPost.save()
            return HttpResponse("done")

def getWallPosts(request, string):
    if request.is_ajax():
        if request.method == "GET":
            print "entered"
            currentUser = User.objects.get(username=string)
            userWallPosts = wallPost.objects.filter(postReceiver=currentUser).order_by('-pk')
            sendThesePosts = []
            for j in userWallPosts:
                sendThesePosts.append([j.postSender.username, j.content, j.created_at.strftime("%I:%M %B %d, %Y"), str(j.postSender.profile.getPrimaryPicURL())])
            #return HttpResponse(sendThesePosts)
            return JsonResponse({'posts': sendThesePosts})

def changeDescription(request):
    if request.is_ajax():
        if request.method == "POST":
            data = request.POST.get("data")
            print "entered", data
            currentProfile = profile.objects.get(user=request.user)
            currentProfile.aboutMe = data
            currentProfile.save()
            return HttpResponse("done")

def changePrimaryPic(request):
    if request.is_ajax():
        if request.method == "POST":
            data = request.POST.get("data")
            print "entered", data
            currentProfile = profile.objects.get(user=request.user)
            selectedPhoto = profilePhotos.objects.get(pk=data, profile=currentProfile)
            primary = profilePrimaryPic.objects.get(profile=currentProfile)
            primary.profilePic = selectedPhoto
            primary.save()
            return HttpResponse("done")

def commentToPost(request):
    if request.is_ajax():
        if request.method == "POST":
            data = request.POST.getlist("data[]")
            currentWallPost = wallPost.objects.get(pk=int(data[1]))
            newComment = postComment(post=currentWallPost, commentSender=request.user, content=data[0] )
            newComment.save()
            return HttpResponse("done")

def searchUsers(request):
    if request.is_ajax():
        if request.method == "POST":
            data = request.POST.get("data")
            selectedUser = User.objects.filter(Q(username__contains=data) | Q(first_name__contains=data) | Q(last_name__contains=data))
            print "seluser=", selectedUser
            if len(selectedUser) is not 0:
                userArray = []
                for x in selectedUser:
                    try:
                        print "current user = ", x.username
                        userProfile = profile.objects.get(user=x)
                        userArray.append([x.username, x.first_name, x.last_name, userProfile.getPrimaryPicURL()])
                    except:
                        print "User has no profile"
                return JsonResponse({'users': userArray})
            else:
                return JsonResponse({'error' : "No result found"})

def syncWithFacebook(request):
    if request.is_ajax():
        if request.method == "POST":
            data = request.POST.get("data")
            try:
                existingProfile = profile.objects.filter(faceBookID=data).first()
                print existingProfile
                if existingProfile is not request.user:
                    return HttpResponse("Profile already linked")
                else:
                    currentProfile = profile.objects.get(user=request.user)
                    currentProfile.faceBookID = data
                    currentProfile.save()
                    return HttpResponse("done")
            except:
                currentProfile = profile.objects.get(user=request.user)
                currentProfile.faceBookID = data
                currentProfile.save()
                return HttpResponse("done")

def likePost(request):
    if request.is_ajax():
        if request.method == "POST":
            data = request.POST.get("data")
            currentPost = wallPost.objects.get(pk=data)
            for x in currentPost.getLikers():
                print x.user.username
            print data
            try:
                print "decrementing"
                hasLiked = postLike.objects.get(user=request.user, postActual=currentPost)
                hasLiked.delete()
                currentPost.decLikes()
                return HttpResponse("Decremented Like")
            except:
                print "incrementing"
                willLike = postLike(user=request.user, postActual=currentPost)
                willLike.save()
                currentPost.incLikes()
                return HttpResponse("Incremented Like")

