(function () {
    'use strict'

    app.component('zoneForm', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/masterData/masterZone/component/zoneForm.html";
        },
        bindings: {
            onShow: '=?',
            filterModel: '=?',
            searchResultModel: '=?',
        },
        controller: function ($scope, $q, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, zoneFactory) {
            var $vm = this;

            $scope.onShow = false;
            var defer = {};
            var viewModel = zoneFactory;

            $scope.Cancel = true;
            $scope.update = false;
            $scope.create = true;
            $scope.getCheck = false;

            $vm.onShow = function(param) {
                defer = $q.defer();
                if ($scope.filterModel != null) {
                    $scope.filterModel = {};
                }
                $scope.onShow = true;
                if (param != undefined) {
                    pageLoading.show();
                    $scope.create = false;
                    viewModel.find(param.zone_Index).then(function(res) {
                        pageLoading.hide();
                        $scope.filterModel = res.data;
                        $scope.update = true;
                        if ($scope.filterModel.isActive == 0) {
                            $scope.getCheck = false;
                        } else {
                            $scope.getCheck = true;
                        }
                    });
                } else {
                    $scope.update = false
                    $scope.create = true;
                    $scope.getCheck = true;
                    $scope.filterModel.isActive = 1;
                    $scope.filterModel.zone_Id = "";
                }
                return defer.promise;
            };

            $vm.triggerSearch = function() {
                pageLoading.show();
                viewModel.filter($scope.filterModel).then(function(res) {
                    pageLoading.hide();
                    $vm.searchResultModel = res.data.itemsZone;
                });
            };

            //Validate & confirm Add
            $scope.add = function() {
                var model = $scope.filterModel;
                //ใช้ userName จาก localStorage
                model.create_By = $scope.userName;
                $scope.validateMsg = "";
                if (model.zone_Id != "") {
                    if (!model.zone_Id.match(/^([a-z0-9])+$/i)) {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Validate',
                            message: 'Zone ID is required !!'
                        })
                        return "";
                    } else {
                        model.zone_Id = model.zone_Id;
                    }
                }
                if (model.zone_Name == undefined || model.zone_Name == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Validate',
                        message: 'Zone Name is required !!'
                    })
                    return "";
                } else {
                    dpMessageBox.confirm({
                        ok: 'Yes',
                        cancel: 'No',
                        title: 'Confirm ?',
                        message: 'Do you want to save !'
                    }).then(function() {
                        pageLoading.show();
                        Add(model).then(function success(res) {

                            pageLoading.hide();
                            if (res.data == "Done") {
                                defer.resolve('1');
                                $scope.filterModel = {};
                            }
                            if (res.data == "Fail") {
                                dpMessageBox.alert({
                                    ok: 'Close',
                                    title: 'Validate',
                                    message: 'Zone ID is Dupplicate !!'
                                })
                                return "";
                            }
                        }, function error(param) {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'error',
                                message: 'Save error'
                            })
                        });
                    });
                }
            }

            //ย้อนกลับ
            $scope.back = function() {
                defer.resolve('1');
            }

            //function Add
            function Add(param) {
                var deferred = $q.defer();
                viewModel.SaveChanges(param).then(
                    function success(results) {
                        deferred.resolve(results);
                    },
                    function error(response) {
                        deferred.resolve(response);
                    }
                );
                return deferred.promise;
            }

            var init = function() {
                $scope.userName = localStorageService.get('userTokenStorage');
                $scope.filterModel = {};
            };
            init();
        //     $scope.Cancel = true;
        //     $scope.update = false;
        //     $scope.create = true;
        //     $vm.onShow = function (param) {
        //         defer = $q.defer();
        //         if($scope.filterModel != null){
        //             $scope.filterModel = {};
        //         }
        //         $scope.onShow = true;
        //         if (param != undefined) {
        //             pageLoading.show();
        //             $scope.create = false;  
        //             viewModel.getId(param).then(function (res) {
        //                 pageLoading.hide();
        //                 $scope.filterModel = res.data[0];
        //                 $scope.update = true;
        //             });
        //         }
        //         else {
        //             $scope.update = false
        //             $scope.create = true;
        //         }
        //         return defer.promise;
        //     };
        //     $vm.triggerSearch = function () {
        //         $vm.filterModel = $vm.filterModel || {};
        //         pageLoading.show();
        //         viewModel.filter().then(function (res) {
        //             pageLoading.hide();
        //             $vm.filterModel = res.data;
        //             $vm.searchResultModel = res.data;
        //         });
        //     };


        //     $scope.show = {
        //         main: true,
        //         transport: false,
        //         warehouse: false
        //     };
        //     $scope.add = function () {
        //         var model = $scope.filterModel;
        //         $scope.validateMsg = "";
        //         validate(model).then(function (result) {
        //             if (result) {
        //                 $scope.validateMsg = result;
        //                 dpMessageBox.alert(
        //                     {
        //                         ok: 'Close',
        //                         title: 'Validate',
        //                         message: result
        //                     }
        //                 )
        //             }
        //             else {
        //                 dpMessageBox.confirm({
        //                     ok: 'Yes',
        //                     cancel: 'No',
        //                     title: 'Confirm ?',
        //                     message: 'Do you want to save !'
        //                 }).then(function () {
        //                     pageLoading.show();
        //                     Add(model).then(function success(res) {
        //                         pageLoading.hide();
        //                         $state.reload($state.current.name);
        //                     }, function error(param) {
        //                         dpMessageBox.alert(param).then(function (param) { }, function (param) { });
        //                     });
        //                 });

        //                 defer.resolve();
        //             }
        //         });
        //         $scope.filterModel = {};
        //     }

        //     $scope.edit = function () {
        //         var model = $scope.filterModel;
        //         $scope.validateMsg = "";
        //         validate(model).then(function (result) {
        //             if (result) {
        //                 $scope.validateMsg = result;
        //                 dpMessageBox.alert(
        //                     {
        //                         ok: 'Close',
        //                         title: 'Validate',
        //                         message: result
        //                     }
        //                 )
        //             }
        //             else {
        //                 dpMessageBox.confirm({
        //                     ok: 'Yes',
        //                     cancel: 'No',
        //                     title: 'Confirm ?',
        //                     message: 'Do you want to save !'
        //                 }).then(function () {
        //                     pageLoading.show();
        //                     Edit(model).then(function success(res) {
        //                         pageLoading.hide();
        //                         $state.reload($state.current.name);
        //                     }, function error(param) {
        //                         dpMessageBox.alert(param).then(function (param) { }, function (param) { });
        //                     });
        //                 });

        //                 defer.resolve();
        //             }
        //         });
        //     }


        //     $scope.back = function () {
        //         defer.resolve('1');
        //     }

        //     function validate(param) {
        //         let defer = $q.defer();
        //         let msg = "";
        //         if (param.zoneName == undefined) {
        //             msg = ' Zone Name is required !'
        //             defer.resolve(msg);
        //         } 
        //         defer.resolve(msg);

        //         return defer.promise;
        //     }

        //     function Add(param) {
        //         let deferred = $q.defer();
        //         let item = param;
        //         viewModel.add(item).then(
        //             function success(results) {
        //                 deferred.resolve(results);
        //             },
        //             function error(response) {
        //                 deferred.reject(response);
        //             }
        //         );
        //         return deferred.promise;
        //     }
        //     function Edit(param) {
        //         var deferred = $q.defer();
        //         viewModel.edit(param).then(
        //             function success(results) {
        //                 deferred.resolve(results);
        //             },
        //             function error(response) {
        //                 deferred.reject(response);
        //             }
        //         );
        //         return deferred.promise;
        //     }

        //     var init = function () {
        //         $scope.filterModel = {};
        //     };
        //     init();
        }
    })
})();