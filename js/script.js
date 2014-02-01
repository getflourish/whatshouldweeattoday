var app = angular.module('app', ['ui.sortable']);

app.controller('AppController', function($http, $scope, $rootScope, $timeout) {

	// load some data

	$scope.data = {};	

	$scope.add = function () {
		var f = {
			"name":$scope.newfood,
			"type":$scope.newtype,
			"url":$scope.newurl,
			"archived":false
		}
		$scope.data.push(f);
		$scope.save();
		$scope.newfood = "";
		$scope.newtype = "";
		$scope.newurl = "";
	}

	$scope.downvote = function (index) {
		$scope.data[index].archived = true;
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
		$scope.data.splice(index, 1);
		$scope.save();
	}

	$scope.upvote = function (index) {
		$scope.data[index].archived = false;
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
