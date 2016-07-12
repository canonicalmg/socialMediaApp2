// using jQuery
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

$("#signUpButton").click(function(){
    $("#main1").hide();
    $("#join1").hide();
    $("#join2").show();
    $("#main2").show();
});

$("#cancelSignUp").click(function(){
    $("#main2").hide();
    $("#join2").hide();
    $("#join1").show();
    $("#main1").show();
});



$("#signInSubmit").click(function(e) {
    e.preventDefault();
    //var email = $("#signInEmail").val() || null;
    //var pass = $("#signInPass").val() || null;
    var email = $("#id_userName").val() || null;
    var pass = $("#id_password").val() || null;
    if((email != null) && (pass != null)){
       headerSignIn(email,pass);
    }
});

function headerSignIn(email, pass){
    var userData = [email, pass];
        $.ajax({
                 type:"POST",
                 url:"/headerSignIn/",
                 headers : {
                        "X-CSRFToken": getCookie("csrftoken")
                    },
                 data: {
                        'data': userData,
                        },
                 success: function(data){
                     $("#dialogBoxLogin").empty();
                     if(data == "Does not match"){
                         $("#dialogBoxLogin").append("<p style='color:white;'>Username and password do not match our records</p>");
                         return 0;
                     }
                     else {
                         console.log("done");
                         window.location.replace("/home#");
                     }
                 }
        });
}

$("#submitSignUp").click(function(e) {
    e.preventDefault();
    $("#errorCode").empty();
    //gather info
    var firstName = $("#signUpFirstName").val() || null;
    var lastName = $("#signUpLastName").val() || null;
    var email = $("#signUpEmail").val() || null;
    var email2 = $("#signUpEmail2").val() || null;
    var pass = $("#signUpPassword").val() || null;
    var passCon = $("#signUpPasswordCon").val();

    //validate info
    if(firstName == null){
        $("#errorCode").append("<p>Please fill in your first name!</p>");
        return false;
    }
    if(lastName == null){
        $("#errorCode").append("<p>Please fill in your last name!</p>");
        return false;
    }
    if(email == null){
        $("#errorCode").append("<p>Please fill in your email!</p>");
        return false;
    }
    if(passCon == null){
        $("#errorCode").append("<p>Please fill in your password!</p>");
        return false;
    }
    if(passCon != pass){
        $("#errorCode").append("<p>Error: Passwords do not match</p>");
        return false;
    }
    var userData = [firstName, lastName, email, passCon, email2];
    //ajax request to server
    token = $("#change_password-form").find('input[name=csrfmiddlewaretoken]').val()
    $.ajax({
                 type:"POST",
                 url:"/newUserSignUp/",
                 headers : {
                        "X-CSRFToken": getCookie("csrftoken")
                    },
                 data: {
                        'data': userData,
                        },
                 success: function(data){
                     if(data == "Error: Username already exists."){
                         console.log("Error: Username already exists.");
                         $("#errorCode").append("<p>A user with that username already exists!</p>");
                         return false;
                     }
                     else {
                         console.log("done");
                         window.location.replace("/home#");
                     }
                 }
            });




    //redirect to home
});

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
      xfbml      : true,
      version    : 'v2.6'
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
    //statusChangeCallback(response);
  });

  };

  // Load the SDK asynchronously
  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "//connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));

  // Here we run a very simple test of the Graph API after login is
  // successful.  See statusChangeCallback() for when this call is made.
  function testAPI() {
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me', function(response) {
      console.log('Successful login for: ' + response.name);
      document.getElementById('status').innerHTML =
        'Thanks for logging in, ' + response.name + '!';
        console.log(response);
        $.ajax({
                 type:"POST",
                 url:"/headerSignInFacebook/",
                 headers : {
                        "X-CSRFToken": getCookie("csrftoken")
                    },
                 data: {
                        'data': response.id,
                        },
                 success: function(){
                     console.log("done");
                     window.location.replace("/home#");
                 }
        });
    });
}