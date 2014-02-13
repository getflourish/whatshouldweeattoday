var app = angular.module('app', ['ui.sortable', 'firebase']);

app.controller('AppController', function($http, $scope, $rootScope, $timeout, $firebase) {

	// load some data

	$scope.data = {};	
	$scope.blocked = false;
	$scope.maxVotes;
	$scope.voters;
	$scope.notvoters;
	$scope.yourname = "";
	$scope.viewServices = false;
	$scope.voted = false;
	$scope.voter;

	$scope.votemode = false;

	$scope.add = function () {
		var f = {
			"name":$scope.newfood,
			"type":$scope.newtype,
			"url":$scope.newurl,
			"archived":false,
			"votes":[],
		}
		$scope.data.push(f);
		$scope.save();
		$scope.newfood = "";
		$scope.newtype = "";
		$scope.newurl = "";
	}

	$scope.downvote = function (item) {
		item.archived = true;
		$scope.save();
	}

	$scope.init = function () {
		$scope.loadData();
		$scope.setupKeys();
	}

	$scope.hideServices = function () {
		$scope.viewServices = false;
	}

	$scope.getMaxVotes = function () {
		var max = 0;
		var service = null;

		for (var i = 0; i < $scope.services.length; i++) {
			if ($scope.services[i].votes.length > max) {
				service = $scope.services[i];
				max = $scope.services[i].votes.length;
			}
		}

		$scope.maxVotes = service;

	}

	$scope.loadData = function () {
		$http.get('php/load.php').success(function(data) {
			$scope.data = data;
			$scope.services = data.services;
			$scope.voters = data.voters;
			$scope.notvoters = data.notvoters;
			$scope.getMaxVotes();
		});
	}

	$scope.remove = function (item) {
		$scope.data.splice($scope.data.indexOf(item),1);
		$scope.save();
	}

	$scope.reset = function () {
		for (var i = 0; i < $scope.services.length; i++) {
			$scope.services[i].votes = [];
		}
		$scope.voters = [];
		$scope.notvoters = ["Flo", "Florian", "Manek", "Mladen"];
		$scope.save();
	}

	$scope.upvote = function (item) {
		item.archived = false;
		$scope.save();
	}

	$scope.save = function () {
		
		$scope.data.services = $scope.services;
		$scope.data.voters = $scope.voters;
		$scope.data.notvoters = $scope.notvoters;

		$http.post('php/save.php', $scope.data).success(function(data) {
		});			
	}

	$scope.showServices = function () {
		$scope.viewServices = true;
	}

	$scope.startvoting = function (name) {
		if (name) $scope.yourname = name;
		if ($scope.blocked == false) {
			$scope.votemode = true;
			$scope.blocked = false;
			$scope.showServices();
		}
	}

	$scope.stopvoting = function () {
		$scope.votemode = false;
		$scope.hideServices();
		$scope.getMaxVotes();
		$scope.voted = true;
		$scope.notvoters.splice($scope.notvoters.indexOf($scope.yourname), 1);
		$scope.save();
	}

	$scope.setupKeys = function () {
		key('space', function(){ alert('Hello!') });
	}

	$scope.vote = function (item) {

		if ($scope.voters.indexOf($scope.yourname) == -1) {
			$scope.voters.push($scope.yourname);
		}

		if (item.votes) {
			// check for cheating
			if (item.votes.indexOf($scope.yourname) == -1) {
				item.votes.push($scope.yourname);		
			}
		} else {
			item.votes = [];
			item.votes.push($scope.yourname);
		}
		$scope.save();
	}

	$scope.validate = function () {
		if ($scope.voters) {
			if ($scope.voters.indexOf($scope.yourname) != -1) {
				$scope.message = "Du hast bereits abgestimmt!";
				$scope.blocked = true;
			} else {
				$scope.message = "";
				$scope.blocked = false;	

			}
		}
	}

	$scope.init();

});
