$( document ).ready(function() {
    var admin = amplify.store( "prismaAdmin");
    if(admin === undefined){
    	window.location.href = "login.html";
    }
    else{
        $('[data-toggle="tooltip"]').tooltip(); 
        var adminInfo = admin.email+':'+admin.token;
        getInfo(adminInfo);
    	$( 'body' ).removeClass('hidden');
    	$( '#userName' ).text(admin.name);
    }
});

function buscar() {
	alert('Hahaha sea más serio mae no se puede buscar nada.');
}

function getInfo(token) {
    var setHeader = function (req) { 
        req.setRequestHeader('content-type', 'application/json'); 
        req.setRequestHeader('accept', 'application/json');   
        req.setRequestHeader('authorization', token);  
    };
    
    $.ajax({
      type: "GET",
      url: "info",
      beforeSend: setHeader,
      success: function(res){
        console.log(res);
        $('#table').bootstrapTable({
            data: res
        });
      },
      error: function (error) {
        alert(error.responseJSON.error);
      }
    });
}