var openLawApp = angular.module("openLaw", ["ngRoute", "ngLocale"])
    .directive("boxHeader", function () {
        return {
            link: function ($scope, $element) {
                $element.on("click", function ($event) {
                    $element.parents(".box").toggleClass("open");
                });
            },
            restrict: "C"
        };
    })
    .directive("ngDump", function () {
        return {
            link: function ($scope, $element) {
                $element.html(JSON.stringify($scope.booklet, undefined, 2));
            },
            restrict: "C"
        };
    })
    .directive("searchForm", function () {
        return {
            link: function ($scope, $element, $attrs) {
                $element.on("submit", function ($event) {
                    $event.preventDefault();
                });
            },
            restrict: "A"
        };
    })
    .controller("selector", function ($scope) {
        $scope.years = [];
        startYear = 2005;
        for (currentYear = startYear; currentYear <= new Date().getFullYear(); currentYear++) {
            $scope.years.push(currentYear);
        }
        $scope.knessetList = [];
        latestKnesset = 19;
        for (currentKnesset = 1; currentKnesset <= latestKnesset; currentKnesset++) {
            $scope.knessetList.push(currentKnesset);
        }
    })
    .controller("bookletList", function ($scope, $routeParams, $http, $location) {
        if ($routeParams.selector == undefined || $routeParams.selection == undefined) {
            return;
        }

        angular.element(".select-link.selected").removeClass("selected");
        angular.element('.select-link[href="' + $location.path() + '"]').addClass("selected");

        url = "http://law.resource.org.il/v0/booklet/:selector/:selection?callback=JSON_CALLBACK"
            .replace(":selector", $routeParams.selector)
            .replace(":selection", $routeParams.selection);
        $http.jsonp(url).success(function (data) {
            $scope.booklets = data.response;
        });
    })
    .controller("search", function ($scope, $routeParams, $http) {

    });

openLawApp.config(function ($routeProvider, $locationProvider) {
    // Configure existing providers
    $locationProvider.html5Mode(true);
    $routeProvider
        .when("/booklet/:selector/:selection", {
            templateUrl: "partials/booklet-list.html",
            controller: "bookletList"
        })
        .when("/booklet/search", {
            template: "",
            controller: "search"
        })
        .otherwise({
            redirectTo: "/booklet/year/" + new Date().getFullYear()
        });
});
