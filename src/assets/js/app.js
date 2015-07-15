function removeFluff (array) {
    if (!Array.isArray(array)) {
        return;
    }

    for (var i = 0; i < array.length ; i++) {
        array[i] = array[i].replace("•", "").trim();
    }
}

function handleCurrency (string) {
    if (string.toLowerCase() === "free") {
        return "Free";
    }
    else if (string.charAt(0) !== "$") {
        return "$" + string;
    }

    return string;
}

var model = {
    trips: []
};

var tripPlanner = angular.module("tripPlanner", []);

tripPlanner.run(function () {
    if (localStorage.getItem("tripPlan") !== null) {
        model = JSON.parse(localStorage.getItem("tripPlan"));
    }
});

tripPlanner.controller("TripController", function ($scope) {
    $scope.planner = model;
    $scope.trip = {};
    $scope.editing = -1;

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