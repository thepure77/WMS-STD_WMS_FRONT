app.directive('autocompleteTxt', function() {
    return {
        restrict: 'E',
        scope: {
            acModel: '=ngModel',
            sourceurl: '=',
            value: '=',
            isDisabled: '=?'
        },
        controller: function($scope, $http, webServiceAPI, $timeout) {
            $scope.sourceurl = $scope.sourceurl || {};
            // fetch data to autocomplete txt
            $scope.loadMatchList = function(val) {
                
                var requestUrl = $scope.sourceurl;
                var data = { key: val };
                return $http.post(webServiceAPI + requestUrl, data).then(function(response) {

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
            }

            $scope.onChange = function() {
                $scope.acModel = null;
            }
        },
        link: function(scope, attrt, element) {

        },
        templateUrl: 'modules/widgets/autocompleteTxt/autocompleteTxt.html'
    }
});


app.directive('autocompleteTxt2', function() {
    return {
        restrict: 'E',
        scope: {
            acModel: '=ngModel',
            sourceurl: '=',
            value: '=',
            isDisabled: '=?'
        },
        controller: function($scope, $http, webServiceAPI, $timeout) {
            $scope.sourceurl = $scope.sourceurl || {};
            // fetch data to autocomplete txt
            $scope.loadMatchList = function(val) {
                
                var requestUrl = $scope.sourceurl;
                var data = { key: val };
                return $http.post(requestUrl, data).then(function(response) {

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
            }

            $scope.onChange = function() {
                $scope.acModel = null;
            }
        },
        link: function(scope, attrt, element) {

        },
        templateUrl: 'modules/widgets/autocompleteTxt/autocompleteTxt.html'
    }
});

app.directive('autocompleteChip', function() {
    return {
        restrict: 'E',
        scope: {
            acModel: '=ngModel',
            sourceurl: '=',
            isDisabled: '='
        },
        controller: function($scope, $http, webServiceAPI, $timeout) {
            $scope.sourceurl = $scope.sourceurl || {};
            // fetch data to autocomplete txt
            $scope.loadMatchList = function(val) {

                var requestUrl = $scope.sourceurl;
                var data = { key: val };
                return $http.post(webServiceAPI + requestUrl, data).then(function(response) {

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

            };

        },
        link: function(scope, attrt, element) {

        },
        templateUrl: 'modules/widgets/autocompleteTxt/autocompleteChip.html'
    }
});

app.directive('autocompleteMat', function() {
    return {
        restrict: 'E',
        scope: {
            acModel: '=ngModel',
            sourceurl: '=',
            desc: '=?',
            grade: '=?',
            value: '=',
            isDisabled: '=?'
        },
        controller: function($scope, $http, webServiceAPI, $timeout, clientService) {
            $scope.sourceurl = $scope.sourceurl || {};
            // fetch data to autocomplete txt
            $scope.loadMatchList = function(val) {
                
                var requestUrl = webServiceAPI + $scope.sourceurl;
                var data = {
                    key: val
                }
                
                return clientService.post(requestUrl, data).then(function(response) {

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
                $scope.desc = angular.copy($item.materialDesciption);
                
                if ($item.gradeName != undefined) {
                    $scope.grade = angular.copy($item.gradeName);
                }
            };

            $scope.onChange = function() {
                $scope.acModel = null;
                $scope.desc = null;
                $scope.grade = null;
            }

        },
        link: function(scope, attrt, element) {

        },
        templateUrl: 'modules/widgets/autocompleteTxt/autocompleteMat.html'
    }
});


app.directive('autoComplete', function () {
    return {
        restrict: 'E',
        scope: {
            sourceurl: '=?',
            isDisabled: '=?',
            id: '=?value',
            name: '=?text',
            set: '=?',
            get: '=?',
            selected: '=?onSelect',
            config: '=?',
            delegate: '=?',
            xConfig: '=?configX'
        },
        controller: function ($scope, $http, webServiceAPI, $timeout) {
            $scope.value = "";


            var field;
            var http;
            var text;
            $scope.styles = {};
$scope.xName='name';
            if ($scope.config != undefined) {
                var field = $scope.config.field == undefined ? 'id' : $scope.config.field;
                var http = $scope.config.http || 'post';
                var text = $scope.config.text || 'key';

                $scope.mPlaceHolder = $scope.config.placeholder || '';
                if ($scope.config.width != undefined) {
                    $scope.styles = {
                        'width': $scope.config.width + 'px'
                    }
                }
            }

            $scope.delegates = $scope.delegate || {};
            $scope.sourceurl = $scope.sourceurl || {};


            if ($scope.xConfig != undefined) {

                var _config = $scope.xConfig.config;
                if (_config != undefined) {
                    http = _config.http || 'post';
                    field = _config.field == undefined ? 'id' : _config.field;
                    $scope.xName =  _config.display ||  _config.display;
                    $scope.mPlaceHolder = _config.placeholder || '';
                    $scope.sourceurl = _config.url || '';

                    if (_config.width != undefined) {
                        $scope.styles = {
                            'width': _config.width + 'px',
                        }
                    } else {
                        $scope.styles = {
                            'width': '100%',
                        }
                    }



                }

                $scope.id = $scope.xConfig.value;
                $scope.name = $scope.xConfig.name;

            }

            $scope.isLoad = true;
            $scope.set = function (item) {
                //// 
                ;
                $scope.value = item.text;
                $scope.name = item.text;
                $scope.id = item[field];

                // $scope.isLoad = false;

            };
            $scope.get = function () {
                return { field: $scope.id, 'Text': $scope.name };
            };

            $scope.delegates.clear = function () {
                $scope.value = '';
            }
            $scope.delegates.setText = function (text) {
                $scope.value = text;
            }
            $scope.onTextChange = function (value) {
                $scope.name = value;
            }

            // fetch data to autocomplete txt
            $scope.loadMatchList = function (val) {
                $scope.name = val;

                if ($scope.xConfig != undefined) {
                    $scope.id = "";
                    $scope.xConfig.value = "";
                    $scope.xConfig.name = $scope.name;
                }

                if ($scope.isLoad == false) {
                    return;
                }

                var requestUrl = $scope.sourceurl;
                if (http == "post") {
                    var data = {
                        key: val,
                        currentPage: 1,
                        numPerPage: 10,
                        advanceSearch: true
                    }
                }

                if (http == "post") {
                    if ($scope.post) {
                        return $scope.post( requestUrl, val);
                    } else {
                        return $http.post( requestUrl, data).then(function (response) {

                            var responseData = response.data.items;

                            if (responseData.length == 0) {
                                $timeout(function () {
                                    $scope.noResults = false;
                                }, 1000);
                            }

                            return responseData.map(function (item) {

                                return item;
                            });
                        });
                    }
                }
                else {
                    return $http.get( requestUrl + val).then(function (response) {

                        var responseData = response.data;

                        if (responseData.length == 0) {
                            $timeout(function () {
                                $scope.noResults = false;
                            }, 1000);
                        }

                        return responseData.map(function (item) {

                            return item;
                        });
                    });
                }
            }

            $scope.onSelect = function ($item, $model, $label) {
                $scope.name = $label;
                $scope.id = $item[field];


                if ($scope.xConfig != undefined) {
                    $scope.xConfig.value = $scope.id;
                    $scope.xConfig.name = $scope.name;
                }

                if ($scope.selected)
                    $scope.selected($item, $model, $label);

            };



            $scope.$watch("id", function (news, olds) {
                if (news != null || news != undefined) {

                    if ($scope.xConfig != undefined) {
                        $scope.xConfig.value = $scope.id;
                    }
                }
            }, true);


            $scope.$watch("name", function (news, olds) {
                if (news != null || news != undefined) {
                    $scope.value = $scope.name;
                    if ($scope.xConfig != undefined) {
                        $scope.xConfig.name = $scope.name;
                    }
                }
            }, true);

            if ($scope.xConfig != undefined) {


                $scope.xConfig.get = $scope.get;
                $scope.xConfig.set = $scope.set;
                $scope.xConfig.binding = $scope.binding;

                $scope.xConfig.setText = $scope.delegates.setText;
                $scope.xConfig.clear = $scope.delegates.clear;




                // $scope.xConfig.delegate = $scope.delegates;

                // Invokes
                $scope.selected = $scope.xConfig.selected;
                if (http == "post") {
                    $scope.post = $scope.xConfig.post;
                }

                /*
                            url: 'liner/suggestion/',
                            value: '',
                            text: '',
                            set: null,
                            get: null,
                            selected: function (item, items, text) {
                                $scope.fclRfq.linerId = item.id
                            },
                            config: {
                                field: 'code',
                                http: 'get',
                                placeholder: 'Liner'
                            },
                            delegate: {

                            }
                */

            }

        },
        link: function (scope, attrt, element) {

        },
        templateUrl: 'modules/widgets/autocompleteTxt/xAutocomplete.html'
    }
});

