var app = angular.module('app', ['ui.sortable']);

app.controller('AppController', function($http, $scope, $rootScope, $timeout) {

	// load some data

	$scope.data = {};	

	$scope.add = function () {
		var f = {
			"name":$scope.newfood,
			"type":$scope.newtype,
			"url":$scope.newurl
		}
		$scope.data.push(f);
		$scope.save();
	}

	$scope.downvote = function (index) {
		if(confirm('War das essen wirklich so schlecht?')) {
			$scope.data[index].archived = true;
		}
		$scope.save();
	}

	$scope.init = function () {
		$scope.loadData();
		$scope.setupKeys();
	}

	$scope.loadData = function () {
		$http.get('php/load.php').success(function(data) {
			$scope.data = data;
		});
	}

	$scope.remove = function (index) {
		if(confirm('Doch wieder nach oben?')) {
			$scope.data[index].archived = false;
		}
		$scope.save();
	}

	$scope.save = function () {
		$http.post('php/save.php', $scope.data).success(function(data) {
		});			
	}

	$scope.setupKeys = function () {
		key('space', function(){ alert('Hello!') });
	}

	$scope.init();

});