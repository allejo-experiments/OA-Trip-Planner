var model = {
    trips: []
};

var tripPlanner = angular.module("tripPlanner", ['ngImgCrop', 'ngFileUpload'], function ($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
});

tripPlanner.run(function () {
    if (localStorage.getItem("tripPlan") !== null) {
        model = JSON.parse(localStorage.getItem("tripPlan"));
    }
});

tripPlanner.controller("TripController", function ($scope) {
    $scope.planner = model;
    $scope.trip = {};
    $scope.editing = -1;
    $scope.tripFile = null;

    $scope.$watch('tripFile', function () {
        if ($scope.tripFile && $scope.tripFile.length) {
            var trips = $scope.tripFile[0];
            var fr = new FileReader();

            fr.onload = function(e) {
                $scope.planner = JSON.parse(e.target.result);
            };

            fr.readAsText(trips);
            this.saveTrips();
        }
    });

    $scope.addTrip = function () {
        removeFluff(this.trip.excludes);
        removeFluff(this.trip.includes);

        $scope.trip.studentPrice = handleCurrency($scope.trip.studentPrice);
        $scope.trip.nonStudentPrice = handleCurrency($scope.trip.nonStudentPrice);

        if ($scope.editing >= 0) {
            $scope.planner.trips[$scope.editing] = $scope.trip;
        }
        else {
            $scope.planner.trips.push($scope.trip);
        }

        this.clearTrips();
        this.saveTrips();

        $('#tripEditor').modal('toggle');
    };

    $scope.deleteTrip = function (index) {
        $scope.planner.trips.splice(index, 1);

        this.saveTrips();
    };

    $scope.editTrip = function (index) {
        $scope.editing = index;
        $scope.editor = true;

        $scope.trip = this.planner.trips[index];
    };

    $scope.downloadTrips = function () {
        download("trips.json", JSON.stringify(this.planner));
    };

    $scope.saveTrips = function () {
        localStorage.setItem("tripPlan", JSON.stringify(this.planner));
    };

    $scope.clearTrips = function () {
        $scope.editing = -1;
        $scope.editor = false;
        $scope.trip = {};
    };
});