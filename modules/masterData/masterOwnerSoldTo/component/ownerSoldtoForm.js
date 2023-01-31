(function () {
    'use strict'

    app.component('ownerSoldtoForm', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/masterData/masterOwnerSoldTo/component/ownerSoldtoForm.html";
        },
        bindings: {
            onShow: '=?',
            filterModel: '=?',
            triggerSearch: "=?",
        },
        controller: function ($scope, $q, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, dpMessageBox,ownerSoldToFactory,webServiceAPI) {
            var $vm = this;

            $scope.onShow = false;
            var defer = {};
            var viewModel = ownerSoldToFactory;
            $scope.Cancel = true;
            $scope.update = false;
            $scope.create = true;
            $scope.getCheck = false;

            $vm.onShow = function (param) {
                defer = $q.defer();
                if ($scope.filterModel != null) {
                    $scope.filterModel = {};
                }
                $scope.onShow = true;
                if (param != undefined) {
                    pageLoading.show();
                    $scope.create = false;
                    viewModel.find(param.ownerSoldTo_Index).then(function (res) {
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
                    $scope.filterModel.ownerSoldTo_Id = "";
                }
                return defer.promise;
            };

            $vm.triggerSearch = function () {
                pageLoading.show();
                viewModel.filter($scope.filterModel).then(function (res) {
                    pageLoading.hide();
                    $vm.searchResultModel = res.data.itemsOwnerSoldTo;
                });
            };

            //Validate & confirm Add
            $scope.add = function () {
                var model = $scope.filterModel;
                //ใช้ userName จาก localStorage
                model.create_By = $scope.userName;
                $scope.validateMsg = "";
                if (model.ownerSoldTo_Id != "") {
                    if (!model.ownerSoldTo_Id.match(/^([a-z0-9])+$/i)) {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Validate',
                            message: 'Owner SoldTo ID is required !!'
                        })
                        return "";
                    } else {
                        model.ownerSoldTo_Id = model.ownerSoldTo_Id;
                    }
                }
                if (model.owner_Index == undefined || model.owner_Index == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Validate',
                        message: 'Owner Index is required !!'
                    })
                    return "";
                }
                if (model.soldTo_Index == undefined || model.soldTo_Index == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Validate',
                        message: 'Owner SoldTo is required !!'
                    })
                    return "";
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
                            if (res.data == "Done") {
                                defer.resolve('1');
                                $scope.filterModel = {};
                            }
                            if (res.data == "Fail") {
                                dpMessageBox.alert({
                                    ok: 'Close',
                                    title: 'Validate',
                                    message: 'OwnerSold ID is Dupplicate !!'
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
            $scope.back = function () {
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

            //sourceurl autocomplete
            $scope.autoComplete = {
                owner: "Autocomplete/autoOwnerAndOwnerId",
                soldTo: "Autocomplete/autoSoldToAndSoldToId",
            };

            //url webServiceAPI.Master
            $scope.url = {
                Master: webServiceAPI.Master,
            };

            var init = function () {
                $scope.userName = localStorageService.get('userTokenStorage');
                $scope.filterModel = {};
            };
            init();


            // $scope.Cancel = true;
            // $scope.update = false;
            // $scope.create = true;
            // $vm.onShow = function (param) {                
            //     defer = $q.defer();
            //     if($scope.filterModel != null){
            //         $scope.filterModel = {};
            //     }
            //     $scope.onShow = true;
            //     if (param != undefined) {
            //         pageLoading.show();      
            //         $scope.create = false;                    
            //         viewModel.getId(param.ownerSoldToIndex).then(function (res) {
            //             pageLoading.hide();
            //             $scope.filterModel = res.data[0];
            //             $scope.update = true;
            //         });
            //     }
            //     else {
            //         $scope.update = false
            //         $scope.create = true;
            //     }

            //     return defer.promise;
            // };
            // $vm.triggerSearch = function () {
            //     $vm.filterModel = $vm.filterModel || {};
            //     pageLoading.show();
            //     viewModel.filter().then(function (res) {
            //         pageLoading.hide();
            //         $vm.filterModel = res.data;
            //         $vm.searchResultModel = res.data;
            //     });
            // };

            // $scope.add = function(){                
            //     var model = $scope.filterModel;
            //     $scope.validateMsg = "";
            //     validate(model).then(function (result) {
            //         if (result) {
            //             $scope.validateMsg = result;
            //             dpMessageBox.alert(
            //                 {
            //                     ok: 'Close',
            //                     title: 'Validate',
            //                     message: result
            //                 }
            //             )
            //         }
            //         else {
            //             dpMessageBox.confirm({
            //                 ok: 'Yes',
            //                 cancel: 'No',
            //                 title: 'Confirm ?',
            //                 message: 'Do you want to save !'
            //             }).then(function () {
            //                 pageLoading.show();
            //                 Add(model).then(function success(res) {
            //                     pageLoading.hide();
            //                     $state.reload($state.current.name);
            //                 }, function error(param) {
            //                     dpMessageBox.alert(param).then(function (param) { }, function (param) { });
            //                 });
            //             });

            //             defer.resolve();
            //         }
            //     });
            //     $scope.filterModel = {};   
            // }

            // $scope.edit = function(){                
            //     var model = $scope.filterModel;
            //     $scope.validateMsg = "";
            //     validate(model).then(function (result) {
            //         if (result) {
            //             $scope.validateMsg = result;
            //             dpMessageBox.alert(
            //                 {
            //                     ok: 'Close',
            //                     title: 'Validate',
            //                     message: result
            //                 }
            //             )
            //         }
            //         else {
            //             dpMessageBox.confirm({
            //                 ok: 'Yes',
            //                 cancel: 'No',
            //                 title: 'Confirm ?',
            //                 message: 'Do you want to save !'
            //             }).then(function () {
            //                 pageLoading.show();
            //                 Edit(model).then(function success(res) {
            //                     pageLoading.hide();
            //                     $state.reload($state.current.name);
            //                 }, function error(param) {
            //                     dpMessageBox.alert(param).then(function (param) { }, function (param) { });
            //                 });
            //             });

            //             defer.resolve();
            //         }
            //     });
            // }
            // $scope.back = function(){
            //     defer.resolve('1');
            // }    

            // function validate(param) {
            //     let defer = $q.defer();
            //     let msg = "";
            //     if (param.ownerName == null) {
            //         msg = ' Owner is required !'
            //         defer.resolve(msg);
            //     }
            //     else if (param.soldToName == null){
            //         msg = ' SoldTo is required !'
            //         defer.resolve(msg);
            //     }
            //     defer.resolve(msg);

            //     return defer.promise;
            // }

            // $scope.show = {
            //     main: true,
            //     transport: false,
            //     warehouse: false
            // };
            // $scope.buttons = {
            //     add: true,
            //     update: false,
            //     back: true
            // };
            // function Add(param) {
            //     let deferred = $q.defer();
            //     viewModel.add(param).then(
            //         function success(results) {
            //             deferred.resolve(results);
            //         },
            //         function error(response) {
            //             deferred.reject(response);
            //         }
            //     );
            //     return deferred.promise;
            // }
            // function Edit(param) {
            //     var deferred = $q.defer();
            //     viewModel.edit(param).then(
            //         function success(results) {
            //             deferred.resolve(results);
            //         },
            //         function error(response) {
            //             deferred.reject(response);
            //         }
            //     );
            //     return deferred.promise;
            // }

            // $scope.popupSoldTo = {
            //     onShow: false,
            //     delegates: {},
            //     onClick: function (param, index) {
            //         $scope.popupSoldTo.onShow = !$scope.popupSoldTo.onShow;
            //         $scope.popupSoldTo.delegates.soldToPopup(param, index);
            //     },
            //     config: {
            //         title: "soldTo"
            //     },
            //     invokes: {
            //         add: function (param) { },
            //         edit: function (param) { },
            //         selected: function (param) {
            //             $scope.filterModel.soldToIndex = angular.copy(param.soldToIndex);
            //             $scope.filterModel.soldToId = angular.copy(param.soldToId);
            //             $scope.filterModel.soldToName = angular.copy(param.soldToId) + " - " + angular.copy(param.soldToName);

            //         }
            //     }
            // };

            // $scope.popupOwner= {
            //     onShow: false,
            //     delegates: {},
            //     onClick: function (param, index) {
            //         $scope.popupOwner.onShow = !$scope.popupOwner.onShow;
            //         $scope.popupOwner.delegates.ownerPopup(param, index);
            //     },
            //     config: {
            //         title: "owner"
            //     },
            //     invokes: {
            //         add: function (param) { },
            //         edit: function (param) { },
            //         selected: function (param) {
            //             $scope.filterModel.ownerIndex = angular.copy(param.ownerIndex);
            //             $scope.filterModel.ownerId = angular.copy(param.ownerId);
            //             $scope.filterModel.ownerName = angular.copy(param.ownerId) +  " - " + angular.copy(param.ownerName);

            //         }
            //     }
            // };

            // var init = function () {
            //     $scope.filterModel = {};
            // };
            // init();
        }
    })
})();