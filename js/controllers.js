'use strict';

//Initialize Controller
angular.module('jitteryApp.controllers', [])
//Controllers
.controller('ReviewListCtrl', function ($scope, $http) {

  // Set our reviews object to be empty by default.
  $scope.reviews = [];
  $scope.reviewCount = [
    { "name": "After Dinner", "count": 0, "sum": 0, "average": 0},
    { "name": "Bourque Newswatch", "count": 0, "sum": 0, "average": 0},
    { "name": "CN Tower of Power", "count": 0, "sum": 0, "average": 0},
    { "name": "Connoisseur Estates", "count": 0, "sum": 0, "average": 0},
    { "name": "Columbian", "count": 0, "sum": 0, "average": 0},
    { "name": "Fordnation Blend", "count": 0, "sum": 0, "average": 0},
    { "name": "Hawaii Kona", "count": 0, "sum": 0, "average": 0},
    { "name": "House Blend", "count": 0, "sum": 0, "average": 0},
    { "name": "Italian Roast", "count": 0, "sum": 0, "average": 0},
    { "name": "Lionel Roastie", "count": 0, "sum": 0, "average": 0},
    { "name": "Mocca-Java", "count": 0, "sum": 0, "average": 0},
    { "name": "Reggae Blend", "count": 0, "sum": 0, "average": 0},
    { "name": "Ruth Roast", "count": 0, "sum": 0, "average": 0},
    { "name": "Toronto Blend", "count": 0, "sum": 0, "average": 0},
    { "name": "Tropic of Coffee", "count": 0, "sum": 0, "average": 0},
    { "name": "World Tour Blend", "count": 0, "sum": 0, "average": 0}
  ]
  // JSONP to get the current ratings.
  $http.jsonp('http://jitteryjoes.myplanetfellowship.com/api/ratings.jsonp?callback=JSON_CALLBACK').
  success(function(data, status) {
  	$scope.reviews = data;
    for (var i = 0; i < $scope.reviews.length; i++) {
      var coffeeType = $scope.reviews[i].item;
      var coffeeRating = $scope.reviews[i].rating;
      for (var k = 0; k < $scope.reviewCount.length; k++) {
        if (coffeeType == $scope.reviewCount[k].name) {
          $scope.reviewCount[k].count++;
          $scope.reviewCount[k].sum += parseInt(coffeeRating);
          $scope.reviewCount[k].average = $scope.reviewCount[k].sum / $scope.reviewCount[k].count;
        };
      };
    };
    $scope.reviewCount.sort(function(a, b){
      return b.average-a.average
    })
    $scope.top3 = [];
    for (var i = 0; i < 3; i++) {
      $scope.top3.push($scope.reviewCount[i])
    };
  });

  // Add a new rating to the list.
  $scope.addNewRating = function () {
    // Get the form data from the scope.
    var review = $scope.review;

    // Prepare the data.
    var nodeData = {
    	'type': 'review',
    	'field_review_comment': {'und': [{'value': review.comment} ]},
    	'field_review_rating': {'und': [{'value': review.rating} ]},
    	'field_review_item': {'und': {'value': review.item}},
    	'field_origin_app': {'und': [{'value': 'EMU'}]}
    };

    // POST the data and create a node.
    $http({url: 'http://jitteryjoes.myplanetfellowship.com/api/node.json', method: 'POST', data: nodeData}).
    success(function(data, status) {
        // Setup data object.
        var review = $scope.review;
        // Add our app id and date in seconds.
        review.app = 'EMU';
        var d = new Date();
        review.node_created = (d.getTime() / 1000);

        // Add the review to the reviews array.
        $scope.reviews.unshift (review);

        // Reset form vars.
        $scope.review = {};
      });
  }

  // Set our "signupSent" flag to false by default.
  $scope.signupSent = false;

  // Add a newsletter signup.
  $scope.addNewSignup = function () {
    // Get the form data from the scope.
    var user = $scope.user;

    // Prepare the data.
    var nodeData = {
    	'type': 'signup',
    	'field_user_name': {'und': [{'value': user.name} ]},
    	'field_user_email': {'und': [{'value': user.email} ]},
    	'field_origin_app': {'und': [{'value': 'EMU'}]}
    };

    // POST the data and create a node.
    $http({url: 'http://jitteryjoes.myplanetfellowship.com/api/node.json', method: 'POST', data: nodeData}).
    success(function(data, status) {
        // Set our "signupSent" flag.
        $scope.signupSent = true;
      });
  }
});