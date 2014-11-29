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
            restrict: "C"
        };
    })
    .directive("moreInfo", function () {
        return {
            link: function ($scope, $element, $attrs) {
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
    .directive("modalWindow", function ($rootScope) {
        return {
            link: function ($scope, $element, $attrs) {
                if ($scope.window.isResizable) {
                    angular.element("a.resize", $element).removeClass("hide");
                }
                if ($scope.window.isMinimizable) {
                    angular.element("a.minimize", $element).removeClass("hide");
                }

                angular.element("a.close", $element).on("click", function($event) {
                    $rootScope.$emit("externalContent.close", angular.element("iframe", $element).attr("src"));
                    $element.parent().remove();
                });
                angular.element("a.resize", $element).on("click", function($event) {
                    console.log("Attrs:", $attrs);
                    console.log("Element:", $element);
                    if ($element.attr("data-fullscreen") != "true") {
                        $element.attr("data-fullscreen", "true");
                    } else {
                        $element.attr("data-fullscreen", "false");
                    }
                });
                angular.element("a.minimize", $element).on("click", function($event) {
                    $element.addClass("hide");
                });
            },
            restrict: "C"
        };
    })
    .directive("windowItem", function () {
        return {
            link: function ($scope, $element, $attrs) {

            },
            templateUrl: "partials/modal.html",
            transclude: true,
            restrict: "C"
        };
    })
    .directive("externalContent", function () {
        return {
            link: function ($scope, $element, $attrs) {
                $element.on("click", function ($event) {
                    $event.preventDefault();
                    $url = $element.attr("href");
                    $scope.$apply("newWindow('" + $url + "')");
                });
            },
            controller: "externalContent",
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
        if (
            ($routeParams.selector == undefined || $routeParams.selection == undefined)
            && ($routeParams.booklet == undefined)
        ) {
            return;
        }

        $bySelection = $routeParams.selector != undefined && $routeParams.selection != undefined;
        $byBooklet   = $routeParams.booklet != undefined;

        angular.element(".select-link.selected").removeClass("selected");
        if ($bySelection) {
            angular.element('.select-link[href="' + $location.path() + '"]').addClass("selected");
            url = "http://law.resource.org.il/v0/booklet/:selector/:selection?callback=JSON_CALLBACK"
                .replace(":selector", $routeParams.selector)
                .replace(":selection", $routeParams.selection);
        } else if ($byBooklet) {
            url = "http://law.resource.org.il/v0/booklet/:booklet?callback=JSON_CALLBACK"
                .replace(":booklet", $routeParams.booklet);
        }
        $http.jsonp(url).success(function (data) {
            $scope.booklets = Array.isArray(data.response) ? data.response : [data.response];
        });
    })
    .controller("search", function ($scope, $routeParams, $http) {

    })
    .controller("externalContent", function ($scope, $rootScope) {
        $scope.newWindow = function(url, fullscreen) {
            $rootScope.$emit("externalContent.open", url, fullscreen);
        };
    })
    .controller("windowManager", function ($scope, $rootScope, $sce) {
        $scope.windows = {};
        var opener = $rootScope.$on("externalContent.open", function (event, url, fullscreen) {
            $scope.windows[url] = {
                isResizable: true,
                isMinimizable: true,
                isIframe: true,
                content: $sce.trustAsResourceUrl(url),
                header: "Some title"
            };
        });
        var closer = $rootScope.$on("externalContent.close", function (event, url) {
            delete $scope.windows[url];
        });
        $scope.$on("$destroy", opener);
    });

openLawApp.config(function ($routeProvider, $locationProvider, $translateProvider) {
    // Configure existing providers
    $locationProvider.html5Mode(true);
    $routeProvider
        .when("/booklet/:selector/:selection", {
            templateUrl: "partials/booklet-list.html",
            controller: "bookletList"
        })
        .when("/booklet/:booklet",{
            templateUrl: "partials/booklet-list.html",
            controller: "bookletList"
        })
        .when("/booklet/search", {
            template: "partials/booklet-list.html",
            controller: "search"
        })
        .otherwise({
            redirectTo: "/booklet/year/" + new Date().getFullYear()
        });
    $translateProvider
        .translations("he", translations)
        .preferredLanguage("he");
});
