$( document ).ready(function() {
    amplify.store( "prismaAdmin", null );
});

function signUser() {
	var email = $('#email').val();
	var password = $('#password').val();

	$('#button').addClass('hidden');
	
	var setHeader = function (req) { 
		req.setRequestHeader('content-type', 'application/json'); 
		req.setRequestHeader('accept', 'application/json');   
	};
	
	var data = JSON.stringify({email:email, password:password});

	$.ajax({
	  type: "POST",
	  url: "login",
	  beforeSend: setHeader,
	  data: data,
	  success: function(res){
		amplify.store( "prismaAdmin", res );
		$('#button').removeClass('hidden');
		window.location.href = "index.html";

	  },
	  error: function (error) {
	  	console.log(error.responseJSON);
	    $('#button').removeClass('hidden');
	  	alert(error.responseJSON.error);
	  }
	});
}