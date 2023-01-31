app.directive('autocomplete', function() {
    return {
        restrict: 'E',
        scope: {
            acModel: '=ngModel',
            sourceurl: '=?',
            value: '=',
            isDisabled: '=?',
            contract:'=?'
        },
        controller: function($scope, $http, webServiceAPI, $timeout) {
            $scope.sourceurl = $scope.sourceurl || {};
            $scope.data = {};

            // fetch data to autocomplete txt
            $scope.loadMatchList = function(val) {
                var requestUrl = $scope.sourceurl;
                var data = { key: val };
                $scope.data.key=val;

                
                return $http.post(webServiceAPI + requestUrl+val).then(function(response) {

                    var responseData = response.data;
                    if (responseData.length == 0) {
                        $timeout(function() {
                            $scope.noResults = false;
                        }, 1000);
                    }
                    return responseData.map(function(item) {
                        return item;
                    });
                });
            }

            $scope.onSelect = function($item, $model, $label) {
                
                $scope.acModel = angular.copy($item.id);
                $scope.value = angular.copy($item.name);
                if ($item.contract != undefined) {
                    $scope.contract = angular.copy($item.contract);
                }
            }

            $scope.onChange = function() {
                $scope.acModel = null;
                $scope.contract = null;
            }
        },
        link: function(scope, attrt, element) {

        },
        templateUrl: 'modules/widgets/autocompleteTxt/autocompleteTxt.html'
    }
});

