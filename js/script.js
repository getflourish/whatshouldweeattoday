"use strict";

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

    $scope.add = function() {
        var f = {
            "name": $scope.newfood,
            "type": $scope.newtype,
            "url": $scope.newurl,
            "archived": false,
            "votes": [],
        }
        $scope.data.push(f);
        $scope.save();
        $scope.newfood = "";
        $scope.newtype = "";
        $scope.newurl = "";
    }

    $scope.downvote = function(item) {
        item.archived = true;
        $scope.save();
    }

    $scope.init = function() {
        $scope.loadData();
        $scope.setupKeys();
    }

    $scope.hideServices = function() {
        $scope.viewServices = false;
    }

    $scope.getMaxVotes = function() {
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

    $scope.loadData = function() {

        var dataRef = new Firebase("https://wswet.firebaseio.com/");
        $scope.data = $firebase(dataRef);

        var servicesRef = new Firebase("https://wswet.firebaseio.com/services");
        $scope.services = $firebase(servicesRef);

        servicesRef.on('value', function(snapshot) {
            $scope.numServices = snapshot.numChildren();
        });

        var votersRef = new Firebase("https://wswet.firebaseio.com/voters");
        $scope.voters = $firebase(votersRef);

        var notvotersRef = new Firebase("https://wswet.firebaseio.com/notvoters");
        $scope.notvoters = $firebase(notvotersRef);

        $scope.getMaxVotes();
    }

    $scope.remove = function(item) {
        $scope.data.splice($scope.data.indexOf(item), 1);
        $scope.save();
    }

    $scope.reset = function() {

        for (var i = 0; i < $scope.numServices; i++) {
            var ref = new Firebase("https://wswet.firebaseio.com/services/" + i + "/votes");
            var s = $firebase(ref);
            s.$remove();
            console.log("re,pve")
        }
        console.log("after")
        console.log($scope.services);

        $scope.notvoters.$set(["Flo", "Florian", "Manek", "Mladen"]);
        $scope.voters.$set({});
    }

    $scope.upvote = function(item) {
        item.archived = false;
        $scope.save();
    }

    $scope.save = function() {

    }

    $scope.showServices = function() {
        $scope.viewServices = true;
    }

    $scope.startvoting = function(name) {
        if (name) $scope.yourname = name;
        if ($scope.blocked == false) {
            $scope.votemode = true;
            $scope.blocked = false;
            $scope.showServices();
        }
    }

    $scope.stopvoting = function() {
        $scope.votemode = false;
        $scope.hideServices();
        $scope.getMaxVotes();
        $scope.voted = true;

        $scope.notvoters.$remove($scope.yourname);

    }

    $scope.setupKeys = function() {
        key('space', function() {
            alert('Hello!')
        });
    }

    $scope.vote = function(id) {

        var dataRef = new Firebase('https://wswet.firebaseio.com/services/' + id + '/votes');
        var s = $firebase(dataRef);

        // loop through service votes to check if user already voted
        var keys = s.$getIndex();
        keys.forEach(function(key, i) {
            if (s[key] === $scope.yourname) {
                console.log("already in")
            } else {
                s.$add($scope.yourname);
            }
        });

    }

    $scope.validate = function() {
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