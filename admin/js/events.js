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
      url: "events",
      beforeSend: setHeader,
      success: function(res){
        console.log(res);
        for (var i = res.length - 1; i >= 0; i--) {
          res[i]['left'] = res[i].max - res[i].signed.length - res[i].entered.length;
        }
        $('#table').bootstrapTable({
            data: res
        });
      },
      error: function (error) {
        alert(error.responseJSON.error);
      }
    });
}

function newEvent() {
    var newCode = $('#newCode').val(),
        newDescription = $('#newDescription').val(),
        newMax = parseInt($('#newMax').val());

    var data = JSON.stringify({_id:newCode, description:newDescription, max:newMax, signed:[], entered:[]});

    var admin = amplify.store( "prismaAdmin");
    var token = admin.email+':'+admin.token;

    var setHeader = function (req) { 
        req.setRequestHeader('content-type', 'application/json'); 
        req.setRequestHeader('accept', 'application/json');   
        req.setRequestHeader('authorization', token);  
    };
    
    $.ajax({
      type: "POST",
      url: "event",
      beforeSend: setHeader,
      data: data,
      success: function(res){
        $('#closeButton').click();
        $('#newCode').val('');
        $('#newDescription').val('');
        $('#newMax').val(1);
        setTimeout(function() {
            var newRow = $("<tr>");
            var cols = "";

            cols += '<td>'+newCode+'</td>';
            cols += '<td>'+newDescription+'</td>';
            cols += '<td>'+newMax+'</td>';
            cols += '<td>'+newMax+'</td>';
            cols += '<td><a class="edit" title="Edit"  data-toggle="modal" data-target="#editModal"><i class="glyphicon glyphicon-edit"  data-toggle="tooltip" title="Editar!"></i></a></td>';

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

function editEvent() {
    var editDesc = $('#editDesc').val(),
        editMax = parseInt($('#editMax').val()),
        editSigned = $('#editSigned').val().split(','),
        editEntered = $('#editEntered').val().split(','),
        editButton = $('#editButton').val();  

    var data = JSON.stringify({_id:editButton, description:editDesc, max:editMax, signed:editSigned, entered:editEntered});

    var admin = amplify.store( "prismaAdmin");
    var token = admin.email+':'+admin.token;

    var setHeader = function (req) { 
        req.setRequestHeader('content-type', 'application/json'); 
        req.setRequestHeader('accept', 'application/json');   
        req.setRequestHeader('authorization', token);  
    };
    
    $.ajax({
      type: "PUT",
      url: "event",
      beforeSend: setHeader,
      data: data,
      success: function(res){
        $('#closeEdit').click();
        setTimeout(function() {
            location.reload(); 
        }, 500);
        
      },
      error: function (error) {
        alert(error.responseJSON.error);
      }
    }); 
}

function actionFormatter(value, row, index) {
    return [
        '<a class="edit" title="Edit"  data-toggle="modal" data-target="#editModal">',
        '<i class="glyphicon glyphicon-edit"  data-toggle="tooltip" title="Editar!"></i>',
        '</a>'
    ].join('');
}

window.actionEvents = {
    'click .edit': function (e, value, row, index) {
        $('#ModalTitle').text('Editar evento ' + row._id);
        $('#editDesc').val(row.description);
        $('#editMax').val(row.max);
        $('#editSigned').val(row.signed);
        $('#editEntered').val(row.entered);
        $('#editButton').val(row._id);
    }
};