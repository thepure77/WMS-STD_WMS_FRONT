(function () {
    'use strict';
    app.component('returnToteSummary', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/GI/ReturnTote/returnToteSummary/returnToteSummary.html";
        },
        bindings: {
            scanReceive: '=?',
            onShow: '=?'
        },
        controller: function ($scope, $q, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, returnToteFactory, webServiceAPI) {
            var $vm = this;
            $scope.disabled = 1;
            $scope.update = 0;
            $scope.showDoc = false;
            var viewModel = returnToteFactory;
            
            $scope.filterModel = {
                callroll: false,
                buttoncall: false,
            };

            $scope.clickTab = function (tab) {
                $scope.click = tab;
            }

            $scope.ScanShipment = function (param) {
                $scope.isblock = true;
                pageLoading.show()
                if ($scope.filterModel.shipment_no == undefined) {
                    $scope.isblock = false;
                    setTimeout(() => {
                        var focusElem = jQuery('input[ng-model="filterModel.shipment_no"]');
                        focusElem[0].focus();

                    }, 200);
                    
                    return dpMessageBox.alert({
                        ok: 'Yes',
                        title: 'Information.',
                        message: "กรุณากรอก Shipment"
                    })
                    
                }
                let models = $scope.filterModel;
                models.user = $scope.userName;
                viewModel.Scanshipment(models).then(function success(res) {
                    $scope.isblock = false;
                    pageLoading.hide();
                    if (res.data.resultIsUse) {
                        $scope.filterModel.truckLoad_Date = res.data.truckLoad_Date;
                        $scope.filterModel.vehicle_Registration = res.data.vehicle_Registration;
                        $scope.filterModel.docReturn = res.data.docReturn;
                        $scope.filterModel.return_docReturn = res.data.return_docReturn;
                        $scope.filterModel.truckLoad_Index = res.data.truckLoad_Index;

                        $scope.filterModel.returntoteitemLists = res.data.returntoteitemLists;
                        $scope.tran_returntoteitemLists = res.data.tran_returntoteitemLists;
                        $scope.filterModel.select_returntoteitemLists = [];
                        $scope.update = 1;
                        $scope.showDoc = true;
                    } else {
                        $scope.isblock = false;
                        dpMessageBox.alert({
                            ok: 'Yes',
                            title: 'Information.',
                            message: res.data.resultMsg
                        })
                        $scope.showDoc = false;
                        $scope.filterModel.truckLoad_Date = undefined;
                        $scope.filterModel.vehicle_Registration = undefined;
                        $scope.filterModel.docReturn = undefined;
                        $scope.filterModel.return_docReturn = undefined;
                        $scope.filterModel.truckLoad_Index = undefined;

                        $scope.filterModel.returntoteitemLists = undefined;
                        $scope.tran_returntoteitemLists = undefined;
                        $scope.filterModel.select_returntoteitemLists = [];
                    }
                },
                    function error(res) {
                        $scope.isblock = false;
                    });
            }

            $scope.SavereturnTote = function (param) {
                if ($scope.filterModel.shipment_no == undefined) {
                    dpMessageBox.alert({
                        ok: 'Yes',
                        title: 'Information.',
                        message: "กรุณากรอก Shipment"
                    })
                    setTimeout(() => {
                        var focusElem = jQuery('input[ng-model="filterModel.shipment_no"]');
                        focusElem[0].focus();
                    }, 200);
                }
                let models = $scope.filterModel;
                models.user = $scope.userName;
                models.returntoteitemLists = $scope.filterModel.select_returntoteitemLists;
                viewModel.SavereturnTote(models).then(function success(res) {
                    if (res.data.resultIsUse) {
                        dpMessageBox.alert({
                            ok: 'Yes',
                            title: 'Information.',
                            message: "บันทึกสำเร็จ"
                        })
                        $scope.ScanShipment($scope.filterModel);
                    } else {
                        dpMessageBox.alert({
                            ok: 'Yes',
                            title: 'Information.',
                            message: res.data.resultMsg
                        })
                    }
                },
                    function error(res) {
                    });
            }

            $scope.deleteItem = function (param, select) {
                for (let index = 0; index < $scope.filterModel.returntoteitemLists.length; index++) {
                    if ($scope.filterModel.returntoteitemLists[index].truckReturn_Index == param[select].truckReturn_Index) {
                        $scope.filterModel.returntoteitemLists[index].return_Tote_Qty_XX = $scope.filterModel.returntoteitemLists[index].return_Tote_Qty_XX - (param[select].return_qty + param[select].return_qty_damage);

                        if ($scope.filterModel.select_returntoteitemLists.length > 0) {
                            $scope.filterModel.return_docReturn_XX = parseInt($scope.filterModel.return_docReturn_XX) - param[select].re_doc
                        } else {
                            $scope.filterModel.return_docReturn_XX = parseInt($scope.filterModel.return_docReturn)
                        }
                    }
                }
                param.splice(select, 1);
            }

            $scope.$watch("update", function () {
                if ($scope.update == 1) {
                    for (let index = 0; index < $scope.filterModel.returntoteitemLists.length; index++) {
                        let getupdate = $scope.filterModel.select_returntoteitemLists.filter(c => c.truckReturn_Index == $scope.filterModel.returntoteitemLists[index].truckReturn_Index)
                        if (getupdate.length > 0) {
                            $scope.filterModel.returntoteitemLists[index].return_Tote_Qty_XX = parseInt($scope.filterModel.returntoteitemLists[index].return_Tote_Qty) + getupdate.sum("return_qty") + getupdate.sum("return_qty_damage");
                        } else {
                            $scope.filterModel.returntoteitemLists[index].return_Tote_Qty_XX = parseInt($scope.filterModel.returntoteitemLists[index].return_Tote_Qty) + parseInt($scope.filterModel.returntoteitemLists[index].return_qty_damage);
                        }
                    }
                    if ($scope.filterModel.select_returntoteitemLists.length > 0) {
                        $scope.filterModel.return_docReturn_XX = parseInt($scope.filterModel.return_docReturn) + $scope.filterModel.select_returntoteitemLists.sum("re_doc")
                    } else {
                        $scope.filterModel.return_docReturn_XX = parseInt($scope.filterModel.return_docReturn)
                    }
                }
                $scope.update = 0;
            });

            $scope.remarkPopup = {
                onShow: false,
                delegates: {},
                onClick: function () {
                    $scope.remarkPopup.onShow = !$scope.remarkPopup.onShow;
                    $scope.remarkPopup.delegates($scope.filterModel);
                },
                config: {
                    title: ""
                },
                invokes: {
                    add: function () { },
                    edit: function () { },
                    selected: function (param) {
                        if ($scope.filterModel.select_returntoteitemLists == undefined) {
                            $scope.filterModel.select_returntoteitemLists = $scope.filterModel.select_returntoteitemLists || []
                            $scope.filterModel.select_returntoteitemLists.push(angular.copy(param));
                            $scope.update = 1;
                        }
                        else {
                            $scope.filterModel.select_returntoteitemLists.push(angular.copy(param));
                            $scope.update = 1;
                        }
                    }
                }
            };

            // Array.prototype.sum = function (prop) {
            //     var total = 0
            //     for (var i = 0, _len = this.length; i < _len; i++) {
            //         total += this[i][prop]
            //     }
            //     return total
            // }

            function getToday() {
                var today = new Date();
                var mm = today.getMonth() + 1;
                var yyyy = today.getUTCFullYear();
                var dd = today.getDate();
                if (dd < 10) dd = '0' + dd;
                if (mm < 10) mm = '0' + mm;
                return yyyy.toString() + mm.toString() + dd.toString();
            }

            $scope.reportReturntote = {
                onShow: false,
                delegates: {},
                onClick: function () {
                    $scope.reportReturntote.onShow = !$scope.reportReturntote.onShow;
                    $scope.reportReturntote.delegates();
                },
                config: {
                    title: ""
                },
                invokes: {
                    add: function () { },
                    edit: function () { },
                    selected: function () {
    
                    }
                }
            };

            $vm.$onInit = function () {
                $vm = this;
                $scope.userName = localStorageService.get('userTokenStorage');
                $scope.filterModel.truckLoad_Return_Date = getToday();
                $scope.click = 1;
                $scope.isblock = false;

            }
        }
    })
})();