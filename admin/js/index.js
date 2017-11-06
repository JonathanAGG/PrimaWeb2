$( document ).ready(function() {
    var admin = amplify.store( "prismaAdmin");
    if(admin === undefined){
    	window.location.href = "login.html";
    }
    else{
    	$( 'body' ).removeClass('hidden');
    	$( '#userName' ).text(admin.name);

    	var adminInfo = admin.email+':'+admin.token;
    	getAdmins(adminInfo);
    	getInfo(adminInfo);
    	getEvents(adminInfo);
	    

	    // set the date we're counting down to
		var target_date = new Date('Nov, 18, 2017').getTime();
		 
		// variables for time units
		var days, hours, minutes, seconds;
		 
		// get tag element
		var countdown = document.getElementById('countdown');
		 
		// update the tag with id "countdown" every 1 second
		setInterval(function () {
		 
		    // find the amount of "seconds" between now and target
		    var current_date = new Date().getTime();
		    var seconds_left = (target_date - current_date) / 1000;
		 
		    // do some time calculations
		    days = parseInt(seconds_left / 86400);
		    seconds_left = seconds_left % 86400;
		     
		    hours = parseInt(seconds_left / 3600);
		    seconds_left = seconds_left % 3600;
		     
		    minutes = parseInt(seconds_left / 60);
		    seconds = parseInt(seconds_left % 60);
		     
		    // format countdown string + set tag value
		    countdown.innerHTML = '<span class="days">' + days +  ' <b>Days</b></span> <span class="hours">' + hours + ' <b>Hours</b></span> <span class="minutes">'
		    + minutes + ' <b>Minutes</b></span> <span class="seconds">' + seconds + ' <b>Seconds</b></span>';  
		 
		}, 1000);
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
	  	$('#adminsCount').text(res.length);
	  },
	  error: function (error) {
	  	alert(error.responseJSON.error);
	  }
	});
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
	  	$('#participantsCount').text(res.length);
	  },
	  error: function (error) {
	  	alert(error.responseJSON.error);
	  }
	});
}

function getEvents(token) {
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
	  	$('#eventsCount').text(res.length);
	  },
	  error: function (error) {
	  	alert(error.responseJSON.error);
	  }
	});
}