(function () {
    'use strict'

    app.component('masterGridPageForm', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/masterData/masterGridPage/component/gridPageForm.html";
        },
        bindings: {
            onShow: '=?',
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?'
        },
        controller: function ($scope, $q, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, gridPageFactory) {
            var $vm = this;

            $scope.onShow = false;
            var defer = {};
            var viewModel = gridPageFactory;
            $scope.Cancel = true;
            $scope.update = false;
            $scope.create = true;
            $vm.onShow = function (param) {
                defer = $q.defer();
                if ($scope.filterModel != null) {
                    $scope.filterModel = {};
                }
                $scope.onShow = true;
                if (param != undefined) {
                    pageLoading.show();
                    $scope.create = false;
                    viewModel.getId(param).then(function (res) {
                        pageLoading.hide();
                        $scope.filterModel = res.data[0];
                        ConvertData();
                        if ($scope.filterModel.formatDocument != null) {
                            let str = $scope.filterModel.formatDocument.split(" ")
                            $scope.filterModel.formatDocument_1 = str[0]
                            $scope.filterModel.formatDocument_2 = str[1]
                            $scope.filterModel.formatDocument_3 = str[2]
                        }
                        $scope.update = true;
                    });
                }
                else {
                    $scope.actionFormat = "1";
                    $scope.actionFormatDoc1 = "0";  
                    $scope.actionFormatDoc2 = "0";
                    $scope.actionFormatDoc3 = "0";
                    $scope.actionFormatRunning = "0";
                    $scope.update = false
                    $scope.create = true;
                }
                return defer.promise;
            };
            $vm.triggerSearch = function () {
                $vm.filterModel = $vm.filterModel || {};
                pageLoading.show();
                viewModel.filter().then(function (res) {
                    pageLoading.hide();
                    $vm.filterModel = res.data;
                    $vm.searchResultModel = res.data;

                });
            };

            $scope.add = function () {
                var model = $scope.filterModel;
                $scope.validateMsg = "";
                validate(model).then(function (result) {
                    if (result) {
                        $scope.validateMsg = result;
                        dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: 'Validate',
                                message: result
                            }
                        )
                    }
                    else {
                        dpMessageBox.confirm({
                            ok: 'Yes',
                            cancel: 'No',
                            title: 'Confirm ?',
                            message: 'Do you want to save !'
                        }).then(function () {
                            pageLoading.show();
                            
                            Add(model).then(function success(res) {
                                pageLoading.hide();
                                $state.reload($state.current.name);
                            }, function error(param) {
                                dpMessageBox.alert(param).then(function (param) { }, function (param) { });
                            });
                        });

                        defer.resolve();
                    }
                })
                // $scope.filterModel = {};
            }

            $scope.edit = function () {
                var model = $scope.filterModel;
                $scope.validateMsg = "";
                validate(model).then(function (result) {
                    if (result) {
                        $scope.validateMsg = result;
                        dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: 'Validate',
                                message: result
                            }
                        )
                    }
                    else {
                        dpMessageBox.confirm({
                            ok: 'Yes',
                            cancel: 'No',
                            title: 'Confirm ?',
                            message: 'Do you want to save !'
                        }).then(function () {
                            pageLoading.show();                            
                            Edit(model).then(function success(res) {
                                pageLoading.hide();
                                $state.reload($state.current.name);
                            }, function error(param) {
                                dpMessageBox.alert(param).then(function (param) { }, function (param) { });
                            });
                        });

                        defer.resolve();
                    }
                })
            }

            function validate(param) {
                let defer = $q.defer();
                let msg = "";
                if (param.processName == null) {
                    msg = ' Process is required !'
                    defer.resolve(msg);
                }
                else if (param.documentTypeName == null){
                    msg = ' DocumentType Name is required !'
                    defer.resolve(msg);
                }
                else if ( $scope.actionFormat == 1){
                    msg = ' DateFormat is required !'
                    defer.resolve(msg);
                }
                else if ( $scope.actionFormatRunning == 0){
                    msg = ' Running  is required !'
                    defer.resolve(msg);
                }
                else if ( $scope.actionFormatDoc1 == 0 || $scope.actionFormatDoc2 == 0 || $scope.actionFormatDoc3 == 0 ){
                    msg = ' Format Document  is required !'
                    defer.resolve(msg);
                }
                // if (param.workAreaIndex == dataList[i].workAreaIndex) {
                //     msg = 'WorkArea' + " " + param.workArea + ' Dupicated ! Choose New WorkArea'
                //     defer.resolve(msg);

                // }

                defer.resolve(msg);

                return defer.promise;
            }
            $scope.back = function () {
                defer.resolve('');
            }
            $scope.show = {
                main: true,
                transport: false,
                warehouse: false
            };
            $scope.buttons = {
                add: true,
                update: false,
                back: true
            };
            $scope.popupProcess = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {                    
                    $scope.popupProcess.onShow = !$scope.popupProcess.onShow;
                    $scope.popupProcess.delegates.processPopup(param, index);
                },
                config: {
                    title: "ProcessType"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.filterModel.processIndex = angular.copy(param.processIndex);
                        $scope.filterModel.processId = angular.copy(param.processId);
                        $scope.filterModel.processName = angular.copy(param.processId) + " - " + angular.copy(param.processName);

                    }
                }
            };
            $scope.selectFormat = function () {
                var item = $scope.actionFormat;
                if (item != 1) {
                    $scope.filterModel.formatDate = item;
                }
            };
            $scope.selectFormatRunning = function () {
                var item = $scope.actionFormatRunning;
                if (item != 0) {
                    $scope.filterModel.formatRunning = item;
                }
            };
            $scope.selectFormatDoc1 = function () {
                var item = $scope.actionFormatDoc1;                
                if (item != 0) {
                    $scope.filterModel.formatDocument_1 = item;
                }
            };
            $scope.selectFormatDoc2 = function () {
                var item = $scope.actionFormatDoc2;
                if (item != 0) {
                    $scope.filterModel.formatDocument_2 = item;
                }
            };
            $scope.selectFormatDoc3 = function () {
                var item = $scope.actionFormatDoc3;
                if (item != 0) {
                    $scope.filterModel.formatDocument_3 = item;
                }
            };

            $scope.enableMe = false;
            $scope.detectcheck = function (item) {
                if (item == 1) {
                    if ($scope.filterModel.isResetByYear) {
                        $scope.filterModel.isResetByYear = true;
                    }

                    $scope.filterModel.isResetByMonth = false;
                    $scope.filterModel.isResetByDay = false;
                    $scope.disable2 = true;
                    $scope.disable3 = true;
                }
                if (item == 2) {
                    if ($scope.filterModel.isResetByMonth) {
                        $scope.filterModel.isResetByMonth = true;
                    }
                    $scope.filterModel.isResetByYear = false
                    $scope.filterModel.isResetByDay = false
                    $scope.disable1 = true;
                    $scope.disable3 = true;

                }
                if (item == 3) {
                    if ($scope.filterModel.isResetByDay) {
                        $scope.filterModel.isResetByDay = true;
                    }

                    $scope.filterModel.isResetByYear = false;
                    $scope.filterModel.isResetByMonth = false;
                    $scope.disable1 = true;
                    $scope.disable2 = true;
                }
                if ($scope.filterModel.isResetByYear != true && $scope.filterModel.isResetByMonth != true && $scope.filterModel.isResetByDay != true) {
                    $scope.disable1 = false;
                    $scope.disable2 = false;
                    $scope.disable3 = false;
                }

            }
            function ConvertData() {
                let param = $scope.filterModel;
                if ($scope.filterModel.isResetByYear == 1) {
                    $scope.filterModel.isResetByYear = true
                }
                else {
                    $scope.filterModel.isResetByYear = false
                }

                if ($scope.filterModel.isResetByMonth == 1) {
                    $scope.filterModel.isResetByMonth = true
                }
                else {
                    $scope.filterModel.isResetByMonth = false
                }

                if ($scope.filterModel.isResetByDay == 1) {
                    $scope.filterModel.isResetByDay = true
                }
                else {
                    $scope.filterModel.isResetByDay = false
                }
                if (param.formatDate != null) {
                    $scope.actionFormat = param.formatDate;
                }
                if (param.formatRunning != null) {
                    $scope.actionFormatRunning = param.formatRunning;
                }
                if (param.formatDocument != null) {
                    let str = param.formatDocument.split(" ")
                    $scope.actionFormatDoc1 = str[0]
                    $scope.actionFormatDoc2 = str[1]
                    $scope.actionFormatDoc3 = str[2]
                }

            }
            function checkData(param) {
                if (param.formatDocument_1 && param.formatDocument_2 && param.formatDocument_3 != undefined) {
                    let formatDoc = param.formatDocument_1 + ' ' + param.formatDocument_2 + ' ' + param.formatDocument_3;
                    param.formatDocument = formatDoc;
                }

                if (param.isResetByYear) {
                    param.isResetByYear = 1
                } else {
                    param.isResetByYear = 0
                };

                if (param.isResetByMonth) {
                    param.isResetByMonth = 1
                } else {
                    param.isResetByMonth = 0
                };

                if (param.isResetByDay) {
                    param.isResetByDay = 1
                } else {
                    param.isResetByDay = 0
                };

            };

            function Add(param) {
                let deferred = $q.defer();
                checkData(param);
                viewModel.add(param).then(
                    function success(results) {
                        deferred.resolve(results);
                    },
                    function error(response) {
                        deferred.reject(response);
                    }
                );
                return deferred.promise;
            }
            function Edit(param) {
                var deferred = $q.defer();
                checkData(param);
                viewModel.edit(param).then(
                    function success(results) {
                        $state.reload($state.current.name);
                        deferred.resolve(results);
                    },
                    function error(response) {
                        deferred.reject(response);
                    }
                );
                return deferred.promise;
            }
            var init = function () {

                $scope.filterModel = {};
            };
            init();
        }
    })
})();