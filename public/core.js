var lifeLogger = angular.module('lifeLogger', ['ngRoute']);

lifeLogger.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/addActivities', {
        templateUrl: 'views/addActivities.html',
        controller: 'addActivityCtrl'
      }).
      when('/viewMonth', {
        templateUrl: 'views/viewMonth.html',
        controller: 'viewMonthCtrl'
      }).
      when('/statistics', {
        templateUrl: 'views/viewStatistics.html',
        controller: 'viewStatisticsCtrl'
      }).
      otherwise({
        redirectTo: '/addActivities'
      });
  }]);



lifeLogger.controller('addActivityCtrl',['$scope', '$http', '$window',
	function($scope, $http, $window) {
		//console.log("here");
	$scope.formData = {};
	$scope.focusInput=true;

	$(".nav").find(".active").removeClass("active");
   	$('.addActivityNav').addClass("active");


	$scope.createActivity = function() {
		if(!$scope.formData.activityDay){
			var today = $scope.getToday();
			$scope.formData.activityDay = today.day;
			$scope.formData.activityMonth = today.month;
			$scope.formData.activityYear = today.year;
			$scope.formData.activityTimestamp = new Date().getTime();
		}
		$http.post('/api/activities', $scope.formData)
			.success(function(data) {
				$scope.focusInput=true;
				$scope.formData = {};
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

}]);

lifeLogger.controller('viewMonthCtrl',['$scope', '$http',function($scope, $http) {

	$(".nav").find(".active").removeClass("active");
   	$('.monthViewNav').addClass("active");

	$scope.formData = {};

	$scope.totalTime = function(timeframe){

		var totalTime = 0;
		angular.forEach($scope.activities, function(value,key){
			totalTime += value.activityTime;
		})
		return totalTime;
	};

	$http.get('/api/activities/month')
		.success(function(data) {
			$scope.activities = data;
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});

}]);

lifeLogger.controller('viewStatisticsCtrl',['$scope', '$http',function($scope, $http) {

	$(".nav").find(".active").removeClass("active");
   	$('.statisticsNav').addClass("active");

	$scope.formData = {};

	$scope.totalTime = function(timeframe){

		var totalTime = 0;

		angular.forEach($scope.activities, function(value,key){
			totalTime += value.activityTime;
		})
		return totalTime;
	};

	$scope.top5Activities = function(){
		var top5Activities = [];
		var allActivities = $scope.activities.slice(0);

		if(allActivities.length <=5){
			top5Activities = allActivities;
			return top5Activities;
		}


		while(top5Activities.length < 5){
			console.log($scope.activities.length);
			var maxTime = 0;
			var maxItemName = 0;
			var currentTopActivity;
			angular.forEach(allActivities, function(value,key){
				if(value.activityTime > maxTime){
					currentTopActivity = value;
					maxTime = value.activityTime;
				}
			});

			top5Activities.push(currentTopActivity);
  
			var index = allActivities.indexOf(currentTopActivity);
			allActivities.splice(index, 1);
		}

		return top5Activities;
		
	}

	$http.get('/api/activities/month')
		.success(function(data) {
			$scope.activities = data;
			$scope.top5Activities = $scope.top5Activities();
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});

}]);

lifeLogger.directive('focusMe', function($timeout) {
  return {
    scope: { trigger: '=focusMe' },
    link: function(scope, element) {
      scope.$watch('trigger', function(value) {
        if(value === true) { 
            element[0].focus();
            scope.trigger = false;
        }
      });
    }
  };
});


