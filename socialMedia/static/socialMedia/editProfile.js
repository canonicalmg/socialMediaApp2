function getCookie(c_name) {
        if(document.cookie.length > 0) {
            c_start = document.cookie.indexOf(c_name + "=");
            if(c_start != -1) {
                c_start = c_start + c_name.length + 1;
                c_end = document.cookie.indexOf(";", c_start);
                if(c_end == -1) c_end = document.cookie.length;
                return unescape(document.cookie.substring(c_start,c_end));
            }
        }
        return "";
    }
var csrftoken = getCookie('csrftoken');
function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

$("#signOutSubmit").click(function(e) {
    e.preventDefault();
    console.log("signing out");
    //ajax request to server
        $.ajax({
                 type:"GET",
                 url:"/headerSignOut/",
                 headers : {
                        "X-CSRFToken": getCookie("csrftoken")
                    },
                 success: function(){
                     console.log("done");
                     window.location.replace("/");
                 }
        });
});

$("#editDesc").click(function(e){
   e.preventDefault();
    if($("#editDesc").text() == "Edit Description"){
        var currentText = $("#descActual").text();
        console.log(currentText);
        $("#descActual").remove();
        $("#editDesc").text("Save");
        $("#profileDesc").prepend("<textarea id='newDesc' class='form-control' rows='3' placeholder='" + currentText + "'></textarea>");
    }
    else if($("#editDesc").text() == "Save"){
        $("#editDesc").text("Edit Description");
        var newText = $("#newDesc").val();
        $("#newDesc").remove();
        $("#profileDesc").prepend("<p id='descActual'>" + newText + "</p>");
        $.ajax({
                 type:"POST",
                 url:"/editProfile/changeDescription",
                 headers : {
                        "X-CSRFToken": getCookie("csrftoken")
                    },
                 data: {
                        'data': newText,
                        },
                 success: function(){
                     console.log("done");
                 }
            });
    }
});

$(".secondaryPic").click(function(e){
   e.preventDefault();
    console.log("clicked");
    $("#dialogBox").append("<p>Make this picture your default?</p>");
    var id= (this.id).split("secondary")[1];
    var picSrc = (this.src).split("/images/")[1];
    var originalPrimary = ($("#primaryPicActual")[0].src).split("/images/")[1];
    console.log(picSrc, id, originalPrimary);
    if(picSrc != originalPrimary){
        $("#primaryPicActual")[0].src = "/images/" + picSrc;
        $("#profileDesc").prepend("<div id='yesNoBox' style='display:inline-flex;'> <p>Make this your new default profile pic?</p>"
                                    + "<p><a id='confirmNew' class='btn btn-success' role='button'>Yes</a></p>"
                                    + "<p><a id='denyNew' class='btn btn-success' role='button'>No</a></p>"
                                    + "</div>");

        $("#confirmNew").click(function(e){
           e.preventDefault();
            console.log("clicked yes");
            $("#yesNoBox").remove();
            //ajax request to swap
            $.ajax({
                 type:"POST",
                 url:"/editProfile/changePrimaryPic",
                 headers : {
                        "X-CSRFToken": getCookie("csrftoken")
                    },
                 data: {
                        'data': id,
                        },
                 success: function(){
                     console.log("done");
                 }
            });
        });
        $("#denyNew").click(function(e){
           e.preventDefault();
            console.log("clicked no");
            $("#yesNoBox").remove();
            $("#primaryPicActual")[0].src = "/images/" + originalPrimary;
        });
    }
});

$("#syncWithFacebook").click(function(e){
   e.preventDefault();
    $("#dialogBox").show();
    

    function statusChangeCallback(response) {
    console.log('statusChangeCallback');
    console.log(response);
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
      // Logged into your app and Facebook.
      testAPI();
    } else if (response.status === 'not_authorized') {
      // The person is logged into Facebook, but not your app.
      document.getElementById('status').innerHTML = 'Please log ' +
        'into this app.';
    } else {
      // The person is not logged into Facebook, so we're not sure if
      // they are logged into this app or not.
      document.getElementById('status').innerHTML = 'Please log ' +
        'into Facebook.';
    }
  }

  // This function is called when someone finishes with the Login
  // Button.  See the onlogin handler attached to it in the sample
  // code below.
  function checkLoginState() {
    FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
    });
  }

  window.fbAsyncInit = function() {
  FB.init({
    appId      : '1138826532806219',
    cookie     : true,  // enable cookies to allow the server to access
                        // the session
    xfbml      : true,  // parse social plugins on this page
    version    : 'v2.5' // use graph api version 2.5
  });

  // Now that we've initialized the JavaScript SDK, we call
  // FB.getLoginStatus().  This function gets the state of the
  // person visiting this page and can return one of three states to
  // the callback you provide.  They can be:
  //
  // 1. Logged into your app ('connected')
  // 2. Logged into Facebook, but not your app ('not_authorized')
  // 3. Not logged into Facebook and can't tell if they are logged into
  //    your app or not.
  //
  // These three cases are handled in the callback function.

  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });

  };

  // Load the SDK asynchronously
  (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));

  // Here we run a very simple test of the Graph API after login is
  // successful.  See statusChangeCallback() for when this call is made.
  function testAPI() {
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me', function(response) {
        console.log(response);
      console.log('Successful login for: ' + response.name);
      document.getElementById('status').innerHTML =
        'Thanks for syncing your account, ' + response.name + '!';
        $("#dialogBox").empty();

        $.ajax({
                 type:"POST",
                 url:"/editProfile/syncWithFacebook",
                 headers : {
                        "X-CSRFToken": getCookie("csrftoken")
                    },
                 data: {
                        'data': response.id,
                        },
                 success: function(){
                     console.log("done");
                 }
            });
    });
  }

});

function checkLoginState() {
    FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
    });
  }

function statusChangeCallback(response) {
    console.log('statusChangeCallback');
    console.log(response);
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
      // Logged into your app and Facebook.
      testAPI();
    } else if (response.status === 'not_authorized') {
      // The person is logged into Facebook, but not your app.
      document.getElementById('status').innerHTML = 'Please log ' +
        'into this app.';
    } else {
      // The person is not logged into Facebook, so we're not sure if
      // they are logged into this app or not.
      document.getElementById('status').innerHTML = 'Please log ' +
        'into Facebook.';
    }
  }

function testAPI() {
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me', function(response) {
        console.log(response);
      console.log('Successful login for: ' + response.name);
      document.getElementById('status').innerHTML =
        'Thanks for syncing your account, ' + response.name + '!';
        $("#dialogBox").empty();

        $.ajax({
                 type:"POST",
                 url:"/editProfile/syncWithFacebook",
                 headers : {
                        "X-CSRFToken": getCookie("csrftoken")
                    },
                 data: {
                        'data': response.id,
                        },
                 success: function(){
                     console.log("done");
                 }
            });
    });
  }