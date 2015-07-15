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
    $scope.editing = -1;

    $scope.addTrip = function () {
        removeFluff(this.trip.excludes);
        removeFluff(this.trip.includes);

        if ($scope.editing >= 0) {
            $scope.planner.trips[$scope.editing] = $scope.trip;
        }
        else {
            $scope.planner.trips.push($scope.trip);
        }

        $scope.trip = {};
        $scope.editing = -1;

        this.saveTrips();
    }

    $scope.deleteTrip = function (index) {
        $scope.planner.trips.splice(index, 1);

        this.saveTrips();
    }

    $scope.editTrip = function (index) {
        $scope.editing = index;

        $scope.trip = this.planner.trips[index];
    }

    $scope.exportTrips = function () {
        console.log(JSON.stringify($scope.planner));
    }

    $scope.saveTrips = function () {
        localStorage.setItem("tripPlan", JSON.stringify(this.planner));
    }
});