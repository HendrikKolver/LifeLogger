var scotchTodo = angular.module('scotchTodo', []);

function mainController($scope, $http) {
	$scope.formData = {};

	// when landing on the page, get all todos and show them
	$http.get('/api/todos')
		.success(function(data) {
			$scope.todos = data;
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});

	// when submitting the add form, send the text to the node API
	$scope.createTodo = function() {
		if(!$scope.formData.activityDay){
			var today = $scope.getToday();
			$scope.formData.activityDay = today.day;
			$scope.formData.activityMonth = today.month;
			$scope.formData.activityYear = today.year;
		}
		$http.post('/api/todos', $scope.formData)
			.success(function(data) {
				$scope.formData = {}; // clear the form so our user is ready to enter another
				$scope.todos = data;
				console.log(data);
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	};

	// delete a todo after checking it
	$scope.deleteTodo = function(id) {
		$http.delete('/api/todos/' + id)
			.success(function(data) {
				$scope.todos = data;
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	};

	$scope.totalTime = function(timeframe){
		var today = $scope.getToday();
		switch(timeframe){
			case "today":{
				var totalTime = 0;
				angular.forEach($scope.todos, function(value,key){
					if(today.day === value.activityDay && today.month === value.activityMonth && today.year === value.activityYear)
						totalTime += value.activityTime;
				})
				return totalTime;
				break;
			}
			case "Month":{
				var totalTime = 0;
				angular.forEach($scope.todos, function(value,key){
					if(today.month === value.activityMonth && today.year === value.activityYear)
						totalTime += value.activityTime;
				})
				return totalTime;
				break;
			}
			case "Year":{
				var totalTime = 0;
				angular.forEach($scope.todos, function(value,key){
					if(today.year === value.activityYear)
						totalTime += value.activityTime;
				})
				return totalTime;
				break;
			}
		}
	};

	$scope.getToday = function(){
		var today = new Date();

		var dateObject = {
			'day' : today.getDate(),
			'month' : today.getMonth()+1, //January is 0!
			'year' : today.getFullYear()
		}

		return dateObject;
	}

}
