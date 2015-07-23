function copyTextToClipboard(text) {
    var textArea = document.createElement("textarea");

    //
    // *** This styling is an extra step which is likely not required. ***
    //
    // Why is it here? To ensure:
    // 1. the element is able to have focus and selection.
    // 2. if element was to flash render it has minimal visual impact.
    // 3. less flakyness with selection and copying which **might** occur if
    //    the textarea element is not visible.
    //
    // The likelihood is the element won't even render, not even a flash,
    // so some of these are just precautions. However in IE the element
    // is visible whilst the popup box asking the user for permission for
    // the web page to copy to the clipboard.
    //

    // Place in top-left corner of screen regardless of scroll position.
    textArea.style.position = 'fixed';
    textArea.style.top = 0;
    textArea.style.left = 0;

    // Ensure it has a small width and height. Setting to 1px / 1em
    // doesn't work as this gives a negative w/h on some browsers.
    textArea.style.width = '2em';
    textArea.style.height = '2em';

    // We don't need padding, reducing the size if it does flash render.
    textArea.style.padding = 0;

    // Clean up any borders.
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';

    // Avoid flash of white box if rendered for any reason.
    textArea.style.background = 'transparent';


    textArea.value = text;

    document.body.appendChild(textArea);

    textArea.select();

    try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        console.log('Copying text command was ' + msg);
    } catch (err) {
        console.log('Oops, unable to copy');
    }

    document.body.removeChild(textArea);
}

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

    $scope.copyTripTitle = function (index) {
        var value = $("#trip-title-" + index).html();

        copyTextToClipboard(value);
    };

    $scope.copyTripBody = function (index) {
        var value = $("#trip-body-" + index).html();

        copyTextToClipboard(value);
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