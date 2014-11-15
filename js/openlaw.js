var openLawApp = angular.module("openLaw", ["ngRoute", "ngLocale", "pascalprecht.translate"])
    .directive("boxHeader", function () {
        return {
            link: function ($scope, $element) {
                $element.on("click", function ($event) {
                    angular.element($element.parents(".box")[0]).toggleClass("open");
                });
            },
            restrict: "C"
        };
    })
    .directive("ngDump", function () {
        return {
            link: function ($scope, $element, $attrs) {
                console.log("attrs", $attrs);
                console.log("scope", $scope);
                $element.html(JSON.stringify($scope[$attrs.dump], undefined, 2));
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
    .directive("moreInfo", function () {
        return {
            link: function ($scope, $element, $attrs) {
                //console.log($attrs);
                angular.element("> .box-header", $element).bind("click", function ($event) {
                    $content = angular.element("> .content", $element);
                    if (!$element.hasClass("open")) {
                        return;
                    }
                    $scope.$apply("loadMoreInfo("+$attrs.bookletId+")");
                });
            },
            restrict: "C"
        };
    })
    .directive("moreInfoContent", function () {
        return {
            link: function ($scope, $element, $attrs) {

            },
            templateUrl: "partials/booklet-parts.html",
            restrict: "C"
        };
    })
    .controller("moreInfo", function ($scope, $http) {
        $scope.parts = null;
        $scope.loadMoreInfo = function($bookletId) {
            if ($scope.parts) {
                return;
            }
            url = "http://law.resource.org.il/v0/booklet/:bookletId?part=1&callback=JSON_CALLBACK"
                .replace(":bookletId", $bookletId);
            $http.jsonp(url).success(function (data) {
                if (data.error.length) {
                    return;
                }
                $scope.parts = data.response.parts || [];
            });
        };
    })
    .controller("selector", function ($scope, $translate) {
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

openLawApp.config(function ($routeProvider, $locationProvider, $translateProvider) {
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
    $translateProvider
        .translations("he", translations)
        .preferredLanguage("he");
});
