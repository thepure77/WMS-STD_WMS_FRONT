(function () {
    'use strict'

    app.component('giForm', {
        controllerAs: '$vm',
        templateUrl: "modules/GI/GI/component/giForm.html",
        bindings: {               
            onShow: '=?',
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?',
            isFilter: '=?',
            isLoading: '=?', 
        },
        controller: function ($scope, $q, pageLoading, dpMessageBox, goodIssueFactory,goodsIssueItemFactory) {
            var $vm = this;

            var defer = {};
            $scope.filterModel ={};

            var viewModel = goodIssueFactory;
            $scope.filterModel.listGoodIssueViewModelItem = [];

            // 
            $vm.isFilterTable = true;
            $scope.onShow = false;
       

            //Component life cycle
            $vm.$onInit = function () {
                $scope.filterModel = {};
                $scope.filterModel.goodsIssueDate = getToday()
                $scope.selected = 1;
                $scope.click = 1;
            }
            $scope.selectedTab = function(tab) {
                $scope.selected = tab;
            }

            $scope.clickTab = function(tab) {
                $scope.click = tab;
            }

            $vm.onShow = function (param) {
                
                defer = $q.defer();
                if ($scope.filterModel != null) {
                    // $scope.filterModel = {};
                }
                $scope.onShow = true;
                if (param != undefined) {
                    viewModel.getId(param.goodsIssueIndex).then(function (res) {
                        $scope.filterModel = res.data;
                        $scope.buttons.add = false;
                        $scope.buttons.update = true;

                        var model = {};
                        model.goodsIssueIndex = param.goodsIssueIndex;
                        model.PickTicketNo = param.pickTicketNo;

                        goodsIssueItemFactory.getByGoodIssueId(model).then(function (res) {
                            $scope.filterModel.listGoodIssueViewModelItem = res.data;
                            $scope.buttons.add = false;
                            $scope.buttons.update = true;
                            // for (let index = 0; index < $scope.filterModel.listGoodsIssueItemViewModels.length; index++) {

                            //     $scope.filterModel.listGoodsIssueItemViewModels[index].RefDocumentNo = $scope.filterModel.planGoodsReceiveNo;

                            // }
                        });                        
                    });
                }
                else {
                    $scope.buttons.add = true;
                    $scope.buttons.update = false;
                }
                return defer.promise;
            };

            $vm.addItem = function (param, index) {    
                if ($scope.isLoading) {
                    $vm.isFilterTable = false;
                    $scope.isLoading(param, index).then(function (result) {                                                 
                        $vm.isFilterTable = true;
                        $scope.filterModel.listGoodsIssueItemViewModels = $scope.filterModel.listGoodsIssueItemViewModels || []
                        if (result != '-99') {
                            if (result.goodsIssueIndex == undefined)
                                result.flagUpdate = true;
                            $scope.filterModel.listGoodsIssueItemViewModels.push(angular.copy(result));
                        }
                    }).catch(function (error) {
                        defer.reject({ 'Message': error });
                    });
                }
            }

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

                for (let index = 0; index < model.listGoodsIssueItemViewModels.length; index++) {

                    model.listGoodsIssueItemViewModels[index].RefDocumentNo = model.planGoodsIssueNo;
                    model.listGoodsIssueItemViewModels[index].RefDocumentIndex = model.listGoodsIssueItemViewModels[index].planGoodsIssueIndex;
                    model.listGoodsIssueItemViewModels[index].RefDocumentItemIndex = model.listGoodsIssueItemViewModels[index].planGoodsIssueItemIndex;
                    model.listGoodsIssueItemViewModels[index].goodsIssueRemark = model.listGoodsIssueItemViewModels[index].documentRemark;
                }
                console.log(model);
                dpMessageBox.confirm({
                    ok: 'Yes',
                    cancel: 'No',
                    title: 'Confirm ?',
                    message: 'Do you want to save !'
                }).then(function () {
                    Add(model).then(function success(res) {
                        $vm.filterModel = res.config.data;
                        $vm.searchResultModel = res.config.data;
                        // $state.reload($state.current.name);
                    }, function error(param) {
                        dpMessageBox.alert(param).then(function (param) { }, function (param) { });
                    });
                });
                defer.resolve();
            }

            $scope.edit = function () {
                var model = $scope.filterModel;
                dpMessageBox.confirm({
                    ok: 'Yes',
                    cancel: 'No',
                    title: 'Confirm ?',
                    message: 'Do you want to save !'
                }).then(function () {
                    Edit(model).then(function success(res) {
                        $vm.filterModel = res.config.data;
                        $vm.searchResultModel = res.config.data;
                    }, function error(param) {
                        dpMessageBox.alert(param).then(function (param) { }, function (param) { });
                    });
                });
                defer.resolve();
            }

            $scope.deleteItem = function (param, index) {
                param.splice(index, 1);
            }
            $scope.editItem = function (param, index) { 
                var owner = $scope.filterModel.ownerIndex;  
                if ($scope.isLoading) {
                    $vm.isFilterTable = false;
                    $scope.isLoading(param, index, owner).then(function (result) {
                        $vm.isFilterTable = true;
                        $scope.filterModel.listGoodsIssueItemViewModels[result.index] = result;
                        console.log($scope.filterModel);
                    }).catch(function (error) {
                        defer.reject({ 'Message': error });
                    });
                }
            }

            $scope.back = function () {
                $scope.filterModel = {};
                defer.resolve('-99');
            }
            function validate(param) {
                var msg = "";

                return msg;
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

            $scope.filterModels = function () {
                $scope.filterModel.isActive = 1;
                $scope.filterModel.isDelete = 0;
                $scope.filterModel.isSystem = 0;
                $scope.filterModel.StatusId = 0;
            };


            function Add(param) {
                let deferred = $q.defer();
                let item = $scope.filterModels();
                item = param;
                viewModel.add(item).then(
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
                viewModel.edit(param).then(
                    function success(results) {
                        deferred.resolve(results);
                    },
                    function error(response) {
                        deferred.reject(response);
                    }
                );
                return deferred.promise;
            }
            function validate(param) {
                var msg = "";
                return msg;
            }

            $scope.back = function () {
                
                $scope.filterModel = {};
                defer.resolve('1');
            }




            $scope.popupOwner = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {
                    $scope.popupOwner.onShow = !$scope.popupOwner.onShow;
                    $scope.popupOwner.delegates.ownerPopup(param, index);
                },
                config: {
                    title: "owner"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.filterModel.ownerIndex = angular.copy(param.ownerIndex);
                        $scope.filterModel.ownerId = angular.copy(param.ownerId);
                        $scope.filterModel.ownerName = angular.copy(param.ownerName);

                    }
                }
            };

            $scope.popupSoldTo = {
                onShow: false,
                delegates: {},
                onClick: function (index) {
                    if ($scope.filterModel.ownerIndex != null) {
                        index = $scope.filterModel.ownerIndex;
                    };
                    $scope.popupSoldTo.onShow = !$scope.popupSoldTo.onShow;
                    $scope.popupSoldTo.delegates.soldToPopup(index);
                },
                config: {
                    title: "SoldTo"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.filterModel.soldToIndex = angular.copy(param.soldToIndex);
                        $scope.filterModel.soldToId = angular.copy(param.soldToId);
                        $scope.filterModel.soldToName = angular.copy(param.soldToName);

                    }
                }
            };

            $scope.popupShipTo = {
                onShow: false,
                delegates: {},
                onClick: function (index) {
                    if ($scope.filterModel.soldToIndex != null) {
                        index = $scope.filterModel.soldToIndex;
                    };

                    $scope.popupShipTo.onShow = !$scope.popupShipTo.onShow;
                    $scope.popupShipTo.delegates.shipToPopup(index);
                },
                config: {
                    title: "shipTo"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.filterModel.shipToIndex = angular.copy(param.shipToIndex);
                        $scope.filterModel.shipToId = angular.copy(param.shipToId);
                        $scope.filterModel.shipToName = angular.copy(param.shipToName);

                    }
                }
            };


            function getToday() {
                var today = new Date();

                var mm = today.getMonth() + 1;
                var yyyy = today.getUTCFullYear();
                var dd = today.getDate();


                if (dd < 10) dd = '0' + dd;
                if (mm < 10) mm = '0' + mm;

                return yyyy.toString() + mm.toString() + dd.toString();
            }

            var init = function () {
                $scope.filterModel = {};
                $scope.filterModel.goodsIssueDate = getToday()
                console.log($scope.filterModel.goodsIssueDate);


            };



            init();

        }
    })
})();