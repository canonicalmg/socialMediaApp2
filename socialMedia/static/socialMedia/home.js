
$("#writeToWallHome").click(function(e) {
    e.preventDefault();
    //get wall text
    var wallText = $("#wallTextArea").val();
    var userID = userName;
    //var userID = window.location.pathname.split("/user/")[1];
    //userID = userID.replace('/','');
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


$('#postBag').easyPaginate({
    paginateElement: '.wallPost',
    elementsPerPage: 10,
    effect: 'climb'
});

function likeComment(pk){
    console.log("clicked");
    $.ajax({
                 type:"POST",
                 url:"/likePost",
                 headers : {
                        "X-CSRFToken": getCookie("csrftoken")
                    },
                 data: {
                        'data': pk,
                        },
                 success: function(data){
                     console.log(data);
                     if(data == "Incremented Like"){
                         $("#postLike"+pk).html(parseInt($("#postLike"+pk).html()) + 1);
                         console.log($("#postLike"+pk).html());
                     }
                     else if(data == "Decremented Like"){
                        $("#postLike"+pk).html(parseInt($("#postLike"+pk).html()) - 1);
                     }

                 }
            });
}