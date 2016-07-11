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
                     //FB.logout();
                     window.location.replace("/");
                     function fbLogoutUser() {
                        FB.getLoginStatus(function(response) {
                            if (response && response.status === 'connected') {
                                FB.logout(function(response) {
                                    document.location.reload();
                                });
                            }
                        });
}
                     fbLogoutUser();
                 }
        });
});

function userTemplate(user){
    var username = user[0];
    var firstName = user[1];
    var lastName = user[2];
    var image = user[3];
    var templateString = "<figure class='snip1344'><img src=" + image + " class='background'/><img src=" + image + " class='profile'/>"
                        + "<figcaption>"
                        + "<h3>" + firstName + " " + lastName + "<a href='/user/"+ username +"/'> @" + username + "</a></h3>"
                        + "</figcaption>"
                        + "</figure>";
    return templateString;
}

$("#userSearch").click(function(e){
    console.log("entered");
   e.preventDefault();
    var searchTerm = $("#srch-term").val();
    console.log(searchTerm);
    $.ajax({
                 type:"POST",
                 url:"/searchUsers",
                 headers : {
                        "X-CSRFToken": getCookie("csrftoken")
                    },
                 data: {
                        'data': searchTerm,
                        },
                 success: function(data){
                     $(".snip1344").remove();
                     $(".modal-body").empty();
                     if(data.error == "No result found"){
                         console.log("No result found in search");
                         $(".modal-body").append("<p>No Users Found</p>");
                     }
                     else {
                         $("#myModalLabel").text("Search results for: " + searchTerm);
                         for (var i = 0; i < data.users.length; i++) {
                             $(".modal-body").append(userTemplate(data.users[i]));
                         }
                     }
                 }
            });

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
      //testAPI();
        $("#signOutSubmit").click(function(e) {
    e.preventDefault();
    console.log("signing out");
           // FB.logout(FB.getAccessToken());
});
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
