app.directive('autocompleteStr', function() {
    return {
        restrict: 'E',
        scope: {
            acModel: '=ngModel',
            sourceurl: '=?',
            value: '=?',
            selected:'=?',
            isDisabled: '=?'
        },
        controller: function($scope, $http, webServiceAPI, $timeout) {
          
            $scope.data = {};

            // fetch data to autocomplete txt
            $scope.loadMatchList = function(val) {
                
                var requestUrl = $scope.sourceurl;

                var data = { key: val };

               
                $scope.data.key=val;

                
                return $http.post(webServiceAPI + requestUrl,$scope.data).then(function(response) {

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

                if($scope.selected){
                    $scope.selected($item);
                }
                     
            }

            $scope.onChange = function() {
               // $scope.acModel = null;
               $scope.acModel=$scope.value;
            }
        },
        link: function(scope, attrt, element) {

        },
        templateUrl: 'modules/widgets/autocompleteTxt/autocompleteTxt.html'
    }
});

