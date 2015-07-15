function removeFluff (array) {
    for (var i = 0; i < array.length ; i++) {
        array[i] = array[i].replace("•", "").trim();
    }
}

var model = {
    trips: []
};

var tripModel = {
    date: '',
    name: '',
    desc: '',
    location: '',
    includes: [],
    excludes: [],
    studentPrice: 0,
    nonStudentPrice: 0,
    level: 0
}

var tripPlanner = angular.module("tripPlanner", []);

tripPlanner.run(function () {
    if (localStorage.getItem("tripPlan") !== null) {
        model = JSON.parse(localStorage.getItem("tripPlan"));
    }
});

tripPlanner.controller("TripController", function ($scope) {
    $scope.planner = model;
    $scope.trip = tripModel;

    $scope.deleteTrip = function (index) {
        this.planner.trips.splice(index, 1);

        this.saveTrips();
    }

    $scope.addTrip = function () {
        removeFluff(this.trip.excludes);
        removeFluff(this.trip.includes);

        $scope.planner.trips.push($scope.trip);
        $scope.trip = tripModel;

        this.saveTrips();
    }

    $scope.saveTrips = function () {
        localStorage.setItem("tripPlan", JSON.stringify(this.planner));
    }
});