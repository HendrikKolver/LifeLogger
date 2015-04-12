var Activity = require('./models/activity');

module.exports = function(app) {

	// get all activities
	app.get('/api/activities', function(req, res) {

		Activity.find(function(err, activities) {
			if (err)
				res.send(err)

			res.json(activities);
		});
	});

	app.get('/api/activities/:year/:month/:day', function(req, res) {
		
			Activity
			.find()
			.where('activityYear').equals(req.params.year)
			.where('activityMonth').equals(req.params.month)
			.where('activityDay').equals(req.params.day)
			.exec(function(err, activities) {

				if (err)
					res.send(err)

				res.json(activities); 
			});

	});

	app.get('/api/activities/month', function(req, res) {
		
		var timestamp = new Date().getTime();
		console.log(timestamp);
		Activity.find()
		.where('activityTimestamp').gte(timestamp-2678400000)
		.exec(function(err, activities) {

			var acumulatedActivities = [];

			activities.forEach(function(activity) {
				var found = false;
				for(var i =0; i<acumulatedActivities.length;i++){
					if(acumulatedActivities[i].activityName === activity.activityName){
			    		found = true;
			    		acumulatedActivities[i].activityTime += activity.activityTime;
			    		break;
			    	}
				}

				if(!found){
					acumulatedActivities.push(activity);
				}
			});

		
			if (err)
				res.send(err)

			res.json(acumulatedActivities);
		});
	});


	// create activity and send back all activities after creation
	app.post('/api/activities', function(req, res) {

		// create a activity, information comes from AJAX request from Angular
		console.log(req.body.activityTimestamp);
		Activity.create({
			activityName : req.body.activityName,
			activityTime: req.body.activityTime,
			activityDay: req.body.activityDay,
			activityMonth: req.body.activityMonth,
			activityYear: req.body.activityYear,
			activityTimestamp: req.body.activityTimestamp
		}, function(err, activity) {
			if (err)
				res.send(err);

			// return all activities for the date that was added
			Activity
			.find()
			.where('activityYear').equals(req.body.activityYear)
			.where('activityMonth').equals(req.body.activityMonth)
			.where('activityDay').equals(req.body.activityDay)
			.exec(function(err, activities) {
				if (err)
					res.send(err)

				res.json(activities); 
			});

		});

	});

	// delete a activity
	app.delete('/api/activities/:activity_id', function(req, res) {
		Activity.remove({
			_id : req.params.activity_id
		}, function(err, activity) {
			if (err)
				res.send(err);

			var today = getToday();
			Activity
			.find()
			.where('activityYear').equals(today.year)
			.where('activityMonth').equals(today.month)
			.where('activityDay').equals(today.day)
			.exec(function(err, activities) {
				if (err)
					res.send(err)

				res.json(activities); 
			});
		});
	});

	app.post('/api/activities/update/:activity_id', function(req, res){
		var query = { 
			_id : req.params.activity_id
		}

		var options = { multi: true };

		Activity.update(query, { activityName: req.body.activityName, activityTime: req.body.activityTime }, options, function(err, numAffected) {
				if (err)
					res.send(err)

				Activity
				.find()
				.where('activityYear').equals(req.body.activityYear)
				.where('activityMonth').equals(req.body.activityMonth)
				.where('activityDay').equals(req.body.activityDay)
				.exec(function(err, activities) {
					if (err)
						res.send(err)

					res.json(activities); 
				});
		});
	
	});

	function getToday(){
		var today = new Date();

		var dateObject = {
			'day' : today.getDate(),
			'month' : today.getMonth()+1, //January is 0!
			'year' : today.getFullYear()
		}

		return dateObject;
	}

	// application -------------------------------------------------------------
	app.get('*', function(req, res) {
		res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
	});
};