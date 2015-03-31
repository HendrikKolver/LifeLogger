var lifeLogger = angular.module('lifeLogger', []);

function mainController($scope, $http, $window) {
	$scope.formData = {};

	// when submitting the add form, send the text to the node API
	$scope.createActivity = function() {
		if(!$scope.formData.activityDay){
			var today = $scope.getToday();
			$scope.formData.activityDay = today.day;
			$scope.formData.activityMonth = today.month;
			$scope.formData.activityYear = today.year;
		}
		$http.post('/api/activities', $scope.formData)
			.success(function(data) {
				$scope.formData = {}; // clear the form so our user is ready to enter another
				$scope.activities = data;
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	};

	// delete a activity after checking it
	$scope.deleteActivity = function(id) {
		var confirm = $window.confirm("Are you sure you wish to delete this activity?");
	    if (confirm != true) {
	        return;
	    }

		$http.delete('/api/activities/' + id)
			.success(function(data) {
				$scope.activities = data;
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	};

	$scope.editActivity = function(id){
		$scope.editId = id;
	}

	$scope.completeEdit = function(activity){
		$http.post('/api/activities/update/'+activity._id, activity)
		.success(function(data) {
				$scope.editId = null;
				$scope.activities = data;
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
		angular.forEach($scope.activities, function(value,key){
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
	$http.get('/api/activities/'+$scope.today.year+'/'+$scope.today.month+'/'+$scope.today.day)
		.success(function(data) {
			$scope.activities = data;
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});

}
