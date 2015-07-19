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
    $scope.deleting = -1;

    $scope.$watch('tripFile', function () {
        $scope.upload($scope.tripFile);
    });

    $scope.upload = function (files) {
        if (files && files.length) {
            var uploadedTrips = files[0];
            var reader = new FileReader();

            reader.onload = function () {
                $scope.planner = JSON.parse(reader.result);
                $scope.saveTrips();
                $scope.$apply();
            };

            reader.readAsText(uploadedTrips);
        }
    };

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
    };

    $scope.deletePendingTrip = function () {
        $scope.planner.trips.splice($scope.deleting, 1);

        this.saveTrips();
    };

    $scope.deleteTrip = function (index) {
        $scope.deleting = index;
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