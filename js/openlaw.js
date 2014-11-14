var openLawApp = angular.module('openLaw', ['ngRoute'])
    .directive('selectLink', function() {
        return {
            link: function($scope, $element, $attrs) {
                $element.on('click', function($event) {
                    angular.element('.select-link.selected').removeClass('selected');
                    $element.addClass('selected');
                });
            },
            restrict: 'C'
        };
    })
    .directive('ngDump', function() {
        return {
            link: function ($scope, $element, $attrs) {
                $element.html(JSON.stringify($scope.booklet, undefined, 2));
                //console.log($scope);
            },
            restrict: 'C'
        };
    })
    .controller('selector', function ($scope) {
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
    .controller('bookletList', function ($scope, $routeParams, $http) {
        //console.log('routeParams', typeof $routeParams);
        if ($routeParams.selector == undefined || $routeParams.selection == undefined) {
            return;
        }

        url = 'http://law.resource.org.il/v0/booklet/:selector/:selection?callback=JSON_CALLBACK'
            .replace(':selector', $routeParams.selector)
            .replace(':selection', $routeParams.selection);
        $http.jsonp(url).success(function (data) {
            $scope.booklets = data.response;
        });
    });

openLawApp.config(function ($routeProvider, $locationProvider) {
    // Configure existing providers
    $locationProvider.html5Mode(true);
    $routeProvider
        .when("/booklet/:selector/:selection", {
            templateUrl: 'partials/booklet-list.html',
            controller: 'bookletList'
        })
        .otherwise({
            redirectTo: '/booklet/year/' + new Date().getFullYear()
        });
});

(function ($) {
    $(document).ready(function () {
        $(".box-list, .main-content").on("click", "header", function (event) {
            $this = $(this);
            $this.parents(".box").toggleClass('open');
        });
    });
})(jQuery);
