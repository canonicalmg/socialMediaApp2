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

function postTemplate(data){
    var name = data[0];
    var content = data[1];
    var date = data[2];
    var url = data[3];
    console.log("template: ", name, content, date)
    var returnTemplate = "<div class='wallPost'>"
                        + "<div class='postSender'>"
                        + "<p>from: <a href='/user/"+ name + "'>  " + name + "</a></p>"
                        + "<img src='"+ url + "' class='img-rounded' width='100' height='100'>"
                        + "</div>"
                        + "<div class='postContent'>"
                        + "<p> " + content + "</p>"
                        + "</div>"
                        + "<div class='postDate'>"
                        + "<p> " + date + "</p>"
                        + "</div>"
                        + "</div>";
    return returnTemplate;
}

function retrievePosts(userID){
    console.log("retrieving posts");
    $.ajax({
                 type:"GET",
                 url:"/user/" + userID + "/getWallPosts/",
                 headers : {
                        "X-CSRFToken": getCookie("csrftoken")
                    },
                 success: function(data){
                     console.log("done");
                     console.log(data);
                     console.log(data.posts);
                     $("#postBagProfile").empty();
                     for(var i=0; i < data.posts.length; i++){
                         $("#postBagProfile").append(postTemplate(data.posts[i]));
                     }
                     $('.easyPaginateNav').remove();
                     $('#postBagProfile').easyPaginate({
                        paginateElement: '.wallPost',
                        elementsPerPage: 5,
                        effect: 'climb'
                    });
                 }
            });
}

$("#writeToWall").click(function(e) {
    e.preventDefault();
    //get wall text
    var wallText = $("#wallTextArea").val();
    var userID = window.location.pathname.split("/user/")[1];
    userID = userID.replace('/','');
    $.ajax({
                 type:"POST",
                 url:"/user/" + userID + "/writeToWall/",
                 headers : {
                        "X-CSRFToken": getCookie("csrftoken")
                    },
                 data: {
                        'data': [wallText, userID],
                        },
                 success: function(){
                     console.log("done");
                     //retrievePosts(userID);
                     window.location.reload()
                 }
            });
});

function postNewComment(pk){
    var comment = $("#wallCommentVal" + pk).val();
     $.ajax({
                 type:"POST",
                 url:"/commentToPost",
                 headers : {
                        "X-CSRFToken": getCookie("csrftoken")
                    },
                 data: {
                        'data': [comment, pk],
                        },
                 success: function(){
                     window.location.reload()
                 }
            });
}

$('#postBagProfile').easyPaginate({
    paginateElement: '.wallPost',
    elementsPerPage: 5,
    effect: 'climb'
});
