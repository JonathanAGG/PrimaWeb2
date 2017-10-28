$( document ).ready(function() {
    var admin = amplify.store( "prismaAdmin");
    if(admin === undefined){
    	window.location.href = "login.html";
    }
    else{
    	console.log(admin);
    	$( 'body' ).removeClass('hidden');
    	$( '#userName' ).text(admin.name);
    }
});

function buscar() {
	alert('Hahaha sea más serio mae no se puede buscar nada.');
}

function getAdmins() {
	// adminsCount
}