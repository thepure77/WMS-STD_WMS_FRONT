app.directive('autoComple', function () {
    return {
        restrict: 'E',
        scope: {
            acModel: '=ngModel',
            sourceurl: '=?',
            value: '=?',
            selected: '=?',
            isDisabled: '=?',
            api: '=?',
            code: '=?',
            id: '=?',
            index:'=?',
            name:'=?',
            key2:'=?',
            key3:'=?',
            key4:'=?',
            key5:'=?',
            address:'=?',
            value1:'=?',
            value2:'=?',
            value3:'=?',
            value4:'=?',
            value5:'=?',
            value6:'=?',
            value7:'=?',

        },
        controller: function ($scope, $http, webServiceAPI, $timeout) {
            $scope.data = {};
            // fetch data to autocomplete txt
            $scope.loadMatchList = function (val) {
                var requestUrl = $scope.sourceurl;
                var apiUrl = $scope.api;
                var data = { key: val };

                $scope.data.chk = $scope.code;
                $scope.data.key = val;
                $scope.data.key2 = $scope.key2;
                $scope.data.key3 = $scope.key3;
                $scope.data.key4 = $scope.key4;
                $scope.data.key5 = $scope.key5;
                $scope.data.index = $scope.index;
                return $http.post(apiUrl + requestUrl, $scope.data).then(function (response) {
                    return response.data;
                });
            }

            $scope.onSelect = function ($item, $model, $label) {
                $scope.acModel = angular.copy($item.index);
                $scope.id = angular.copy($item.id);
                $scope.name = angular.copy($item.name);
                $scope.key = angular.copy($item.key);
                $scope.key4 = angular.copy($item.key4);
                $scope.key5 = angular.copy($item.key5);
                $scope.address = angular.copy($item.address);
                $scope.value1 = angular.copy($item.value1);
                $scope.value2 = angular.copy($item.value2);
                $scope.value3 = angular.copy($item.value3);
                $scope.value4 = angular.copy($item.value4);
                $scope.value5 = angular.copy($item.value5);
                $scope.value6 = angular.copy($item.value6);
                $scope.value7 = angular.copy($item.value7);
                if ($scope.selected) {
                    $scope.selected($item);
                }

            }

            $scope.onChange = function () {
                // $scope.acModel = null;
                $scope.acModel = $scope.value;
            }
        },
        link: function (scope, attrt, element) {
        },
        templateUrl: 'widgets/auto/autocomple.html'
    }
});

app.directive('autoCompleId', function () {
    return {
        restrict: 'E',
        scope: {
            acModel: '=ngModel',
            sourceurl: '=?',
            value: '=?',
            selected: '=?',
            isDisabled: '=?',
            api: '=?',
            code: '=?',
            id: '=?',
            index:'=?',
            name:'=?',
            key2:'=?',
            key3:'=?',
            key4:'=?',
            key5:'=?',
            address:'=?',
            value1:'=?',
            value2:'=?',
            value3:'=?',
            value4:'=?',
            value5:'=?',
            value6:'=?',
            value7:'=?',

        },
        controller: function ($scope, $http, webServiceAPI, $timeout) {
            $scope.data = {};
            // fetch data to autocomplete txt
            $scope.loadMatchList = function (val) {
                var requestUrl = $scope.sourceurl;
                var apiUrl = $scope.api;
                var data = { key: val };

                $scope.data.chk = $scope.code;
                $scope.data.key = val;
                $scope.data.key2 = $scope.key2;
                $scope.data.key3 = $scope.key3;
                $scope.data.key4 = $scope.key4;
                $scope.data.key5 = $scope.key5;
                $scope.data.index = $scope.index;
                return $http.post(apiUrl + requestUrl, $scope.data).then(function (response) {
                    return response.data.map(function(d) {
                        let id = d.name;
                        let name = d.id;
                        d.id = id;
                        d.name = name;
                        return d;
                    })
                });
            }

            $scope.onSelect = function ($item, $model, $label) {
                $scope.acModel = angular.copy($item.index);
                $scope.id = angular.copy($item.id);
                $scope.name = angular.copy($item.name);
                $scope.key = angular.copy($item.key);
                $scope.key5 = angular.copy($item.key5);
                $scope.address = angular.copy($item.address);
                $scope.value1 = angular.copy($item.value1);
                $scope.value2 = angular.copy($item.value2);
                $scope.value3 = angular.copy($item.value3);
                $scope.value4 = angular.copy($item.value4);
                $scope.value5 = angular.copy($item.value5);
                $scope.value6 = angular.copy($item.value6);
                $scope.value7 = angular.copy($item.value7);

                if ($scope.selected) {
                    $scope.selected($item);
                }

            }

            $scope.onChange = function () {
                // $scope.acModel = null;
                $scope.acModel = $scope.value;
            }
        },
        link: function (scope, attrt, element) {
        },
        templateUrl: 'widgets/auto/autocomple.html'
    }
});

