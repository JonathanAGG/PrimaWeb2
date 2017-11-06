$( document ).ready(function() {
    var admin = amplify.store( "prismaAdmin");
    if(admin === undefined){
    	window.location.href = "login.html";
    }
    else{
        $('[data-toggle="tooltip"]').tooltip(); 
        var adminInfo = admin.email+':'+admin.token;
        getAdmins(adminInfo);
    	$( 'body' ).removeClass('hidden');
    	$( '#userName' ).text(admin.name);
    }
});

function buscar() {
	alert('Hahaha sea más serio mae no se puede buscar nada.');
}

function getAdmins(token) {
    var setHeader = function (req) { 
        req.setRequestHeader('content-type', 'application/json'); 
        req.setRequestHeader('accept', 'application/json');   
        req.setRequestHeader('authorization', token);  
    };
    
    $.ajax({
      type: "GET",
      url: "admins",
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

function newAdmin() {
    var newName = $('#newName').val(),
        newEmail = $('#newEmail').val(),
        newPass = $('#newPass').val();

    var data = JSON.stringify({name:newName, email:newEmail, password:newPass});

    var admin = amplify.store( "prismaAdmin");
    var token = admin.email+':'+admin.token;

    var setHeader = function (req) { 
        req.setRequestHeader('content-type', 'application/json'); 
        req.setRequestHeader('accept', 'application/json');   
        req.setRequestHeader('authorization', token);  
    };
    
    $.ajax({
      type: "POST",
      url: "admin",
      beforeSend: setHeader,
      data: data,
      success: function(res){
        $('#closeButton').click();
        setTimeout(function() {
            var newRow = $("<tr>");
            var cols = "";

            cols += '<td>'+newName+'</td>';
            cols += '<td>'+newEmail+'</td>';

            newRow.append(cols);
            $('#table').append(newRow);
            //getAdmins(token);    
        }, 500);
        
      },
      error: function (error) {
        alert(error.responseJSON.error);
      }
    });   
}