var Todo = require('./models/todo');

module.exports = function(app) {

	// get all todos
	app.get('/api/todos', function(req, res) {

		Todo.find(function(err, todos) {
			if (err)
				res.send(err)

			res.json(todos);
		});
	});

	app.get('/api/todos/:year/:month/:day', function(req, res) {
		
			Todo
			.find()
			.where('activityYear').equals(req.params.year)
			.where('activityMonth').equals(req.params.month)
			.where('activityDay').equals(req.params.day)
			.exec(function(err, todos) {

				if (err)
					res.send(err)

				res.json(todos); 
			});

	});

	app.get('/api/todos/month', function(req, res) {
		var today = getToday();
		
		console.log(today);
		if(today.month == 1){
			today.year--;
			today.month = 12;
		}
		else{
			today.month--;
		}
		console.log(today);

		Todo.find()
		.where('activityMonth').gte(today.month).lte()
		.exec(function(err, todos) {

		
			if (err)
				res.send(err)

			res.json(todos);
		});
	});

	app.get('/api/todos/year', function(req, res) {
		// use mongoose to get all todos in the database
		Todo.find(function(err, todos) {

			// if there is an error retrieving, send the error. nothing after res.send(err) will execute
			if (err)
				res.send(err)

			res.json(todos); // return all todos in JSON format
		});
	});

	app.get('/api/todos/week', function(req, res) {
		// use mongoose to get all todos in the database
		Todo.find(function(err, todos) {

			// if there is an error retrieving, send the error. nothing after res.send(err) will execute
			if (err)
				res.send(err)

			res.json(todos); // return all todos in JSON format
		});
	});



	// create todo and send back all todos after creation
	app.post('/api/todos', function(req, res) {

		// create a todo, information comes from AJAX request from Angular
		Todo.create({
			activityName : req.body.activityName,
			activityTime: req.body.activityTime,
			activityDay: req.body.activityDay,
			activityMonth: req.body.activityMonth,
			activityYear: req.body.activityYear
		}, function(err, todo) {
			if (err)
				res.send(err);

			// return all todos for the date that was added
			Todo
			.find()
			.where('activityYear').equals(req.body.activityYear)
			.where('activityMonth').equals(req.body.activityMonth)
			.where('activityDay').equals(req.body.activityDay)
			.exec(function(err, todos) {
				if (err)
					res.send(err)

				res.json(todos); 
			});

		});

	});

	// delete a todo
	app.delete('/api/todos/:todo_id', function(req, res) {
		Todo.remove({
			_id : req.params.todo_id
		}, function(err, todo) {
			if (err)
				res.send(err);

			var today = getToday();
			Todo
			.find()
			.where('activityYear').equals(today.year)
			.where('activityMonth').equals(today.month)
			.where('activityDay').equals(today.day)
			.exec(function(err, todos) {
				if (err)
					res.send(err)

				res.json(todos); 
			});
		});
	});

	app.post('/api/todos/update/:todo_id', function(req, res){
		var query = { 
			_id : req.params.todo_id
		}

		var options = { multi: true };

		Todo.update(query, { activityName: req.body.activityName, activityTime: req.body.activityTime }, options, function(err, numAffected) {
				if (err)
					res.send(err)

				Todo
				.find()
				.where('activityYear').equals(req.body.activityYear)
				.where('activityMonth').equals(req.body.activityMonth)
				.where('activityDay').equals(req.body.activityDay)
				.exec(function(err, todos) {
					if (err)
						res.send(err)

					res.json(todos); 
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