var openLawApp = angular.module('openLaw', [])
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
        //$scope.select = function (event) {
        //    if (event.preventDefault) event.preventDefault();
        //    url = this.href.substr(1);
        //    console.log(event.target.getAttribute('href'));
        //};
    })
    .controller('bookletList', function ($scope, $http, $rootScope) {
        console.log($rootScope);
        $http.jsonp('http://law.resource.org.il/booklet/knesset/19/?callback=JSON_CALLBACK').success(function (data) {
            $scope.booklets = data.content;
        });
    });

openLawApp.config(function ($locationProvider) {
    // Configure existing providers
    $locationProvider.html5Mode(true);
});

(function ($) {
    $(document).ready(function () {
        $(".box").on("click", "header", function (event) {
            $this = $(this);
            $this.parents(".box").toggleClass('open');
        });
        $(".select-link").on("click", "", function (event) {
            $this = $(this);
            $(".select-link.selected").removeClass("selected");
            $this.addClass("selected");
        });
    });
})(jQuery);
