angular.module('openLaw', [])
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
        $scope.select = function(event) {
            if (event.preventDefault) event.preventDefault();
            //url = this.href.substr(1);
            //console.log(event.target.getAttribute('href'));
        };
    })
    .controller('bookletList', function ($scope, $http) {
        //$http.jsonp('http://law.resource.org.il/booklet/knesset/12/?callback=JSON_CALLBACK').success(function (data) {
        //    $scope.booklets = data.content;
        //});
    });
