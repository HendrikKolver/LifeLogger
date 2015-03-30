var scotchTodo = angular.module('scotchTodo', []);

function mainController($scope, $http, $window) {
	$scope.formData = {};

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
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	};

	// delete a todo after checking it
	$scope.deleteTodo = function(id) {
		var confirm = $window.confirm("Are you sure you wish to delete this activity?");
	    if (confirm != true) {
	        return;
	    }

		$http.delete('/api/todos/' + id)
			.success(function(data) {
				$scope.todos = data;
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	};

	$scope.editActivity = function(id){
		$scope.editId = id;
	}

	$scope.completeEdit = function(todo){
		$http.post('/api/todos/update/'+todo._id, todo)
		.success(function(data) {
				$scope.editId = null;
				$scope.todos = data;
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
		
	}

	$scope.cancelEdit = function(id){
		$scope.editId = null;
	}

	$scope.totalTime = function(timeframe){

		var totalTime = 0;
		angular.forEach($scope.todos, function(value,key){
			totalTime += value.activityTime;
		})
		return totalTime;
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

	$scope.today = $scope.getToday();
	$http.get('/api/todos/'+$scope.today.year+'/'+$scope.today.month+'/'+$scope.today.day)
		.success(function(data) {
			$scope.todos = data;
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});

}
