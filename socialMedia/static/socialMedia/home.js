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