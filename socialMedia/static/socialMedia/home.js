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