angular.module('openLaw', [])
    .controller('MyController', ['$scope', function ($scope) {
        $scope.greetMe = 'Yehuda';
    }])
    .controller('bookletList', function ($scope, $http) {
        $http.jsonp('http://law.resource.org.il/booklet/year/2014/?callback=JSON_CALLBACK').success(function (data) {
            $scope.booklets = data.content;
        });
    });
