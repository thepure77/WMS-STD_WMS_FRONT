app.directive('acpBaggingGcNo', function() {
    return {
        restrict: 'E',
        scope: {
            acModel: '=ngModel',
            value: '=',
            isDisabled: '=?'
        },
        controller: function($scope, $http, webServiceAPI, $timeout) {
          
            $scope.data = {};
            // fetch data to autocomplete txt
            $scope.loadMatchList = function(val) {
                console.log('xxx');
                
                var requestUrl = 'planBagging/gcNoSuggrestion/'+ encodeURIComponent(val);    
                return $http.get(webServiceAPI + requestUrl).then(function(response) {
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
                $scope.acModel = angular.copy($item.name);
            }

            $scope.onChange = function() {
                $scope.acModel = null;
            }
        },
        link: function(scope, attrt, element) {

        },
        templateUrl: 'modules/ModuleOms/widgets/acpBaggingGcNo/view.html'
    }
});

