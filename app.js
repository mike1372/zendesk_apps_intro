
(function() {

  return {

    events: {
    	'userGetRequest.done': 'this.showInfo',
  		'userGetRequest.fail': 'this.showError',
      'app.activated': 'getInfo'
    },

    requests: {
		  userGetRequest: function(id) {
		    return {
		      url: '/api/v2/users/' + id + '.json',
		      type:'GET',
		      dataType: 'json'
		    };
		  },
		  orgGetRequest: function(id) {
		    return {
		      url: '/api/v2/organizations/' + id + '.json',
		      type:'GET',
		      dataType: 'json'
		    };
		  }
		},

    showInfo: function(data) {
    	this.formatDates(data);
    	if (data.user.organization_id == null) {
		    this.switchTo('requester', data);
		  } else {
		    this.ajax('orgGetRequest', data.user.organization_id).then(
				  function(org_data) {
					  data.user.organization_name = org_data.organization.name;
					  this.switchTo('requester', data);
					},
				  function() {
					  this.showError();
					}
				);
		  }
    },

    showError: function() {
		  this.switchTo('error');
		},

		formatDates: function(data) {
		  var cdate = new Date(data.user.created_at);
		  var ldate = new Date(data.user.last_login_at);
		  data.user.created_at = cdate.toLocaleDateString();
		  data.user.last_login_at = ldate.toLocaleString();
		  return data;
		},

    getInfo: function() {
	  	var id = this.ticket().requester().id();
	  	this.ajax('userGetRequest', id);
		},

    sayHello: function() {
      var currentUser = this.currentUser().name();
      this.switchTo('hello', {username: currentUser});
    }

};  
}());
