(function () {
    'use strict';
    app.component('reworkRollCageSummary', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/RollCage/reworkRollCage/reworkRollCageSummary/reworkRollCageSummary.html";
        },
        bindings: {
            scanReceive: '=?',
            onShow: '=?'
        },
        controller: function ($scope, $q, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, reworkRollCageFactory, webServiceAPI) {
            var $vm = this;
            var defer = {};
            var viewModel = reworkRollCageFactory;

            $scope.url = {
                GR: webServiceAPI.GR,
            };

            $scope.filterModel = {
                callroll: false,
                buttoncall: false,
            };

            $scope.header = {
                callroll: false,
                buttoncall: false,
            };

            $scope.menu = [
                {
                    "step": "1",
                    "active": "active",
                    "completed": "",
                    "name": "Call Full Roll Cage"
                },
                {
                    "step": "2",
                    "active": "",
                    "completed": "",
                    "name": "Scan Out",
                },
                {
                    "step": "3",
                    "active": "",
                    "completed": "",
                    "name": "Send Empty Roll Cage"
                },
                {
                    "step": "3",
                    "active": "",
                    "completed": "",
                    "name": "Scan Load to Truck"
                }
            ];

            $scope.select = function (param) {

                $scope.filterModel.rollCage_Id = param.rollcage_id;
                $scope.filterModel.chute_No = param.chute_no;
                
                let data = $scope.listfilterModel.find(c => c.isUser);
                if (data) {
                    data.isUser = false;
                }
                param.isUser = true;
                $scope.isSelect = true;
            }

            $scope.chkIsuse = function (param) {
                if (param.isUser) {
                    return "#99FF66"
                }
            }

            $scope.next = function () {
                // let i = $scope.menu.indexOf($scope.menu.find(c => c.active == "active"));
                // $scope.menu[i].active = "";
                // $scope.menu[i].completed = "completed";
                // $scope.menu[i + 1].active = "active";
                // $scope.menu_width = (i + 1) * 100; //?????????????????????????????????????????????????????????????????????????????????
                // $scope.click = 1;
                // if ($scope.menu[1].active == "active") {
                //     $scope.filterModel2 = angular.copy($scope.filterModel);
                // }
                // else if ($scope.menu[2].active == "active") {
                // }

                $scope.filterModel.formPage = "RE";
                viewModel.setParam($scope.filterModel)
                $state.go('wms.scan_in_rework', { a: "" });
            }

            $scope.ScanLocation = function (param) {
                if ($scope.filterModel.location == undefined) {
                    dpMessageBox.alert({
                        ok: 'Yes',
                        title: 'Information.',
                        message: "??????????????? location ????????????????????????"
                    })
                    setTimeout(() => {
                        var focusElem = jQuery('input[ng-model="filterModel.location"]');
                        focusElem[0].focus();

                    }, 200);
                }
                let models = $scope.filterModel;
                if ($scope.filterModel.location != undefined) {
                    viewModel.scanLocation(models).then(function success(res) {

                        if (res.data.mess != null) {
                            if (res.data.mess == 'E') {
                                dpMessageBox.confirm({
                                    ok: 'Yes',
                                    cancel: 'No',
                                    title: '???????????????????????????????????? ?',
                                    message: 'Location ????????????????????????????????????????????? ??????????????????????????????????????????????????????????????????????????????'
                                }).then(function success() {
                                    $scope.filterModel.again = true;
                                    $scope.confirmlocation = true;
                                    setTimeout(() => {
                                        var focusElem = jQuery('input[ng-model="filterModel.shipment_no"]');
                                        focusElem[0].focus();

                                    }, 200);
                                }, function error(param) {
                                    // $scope.filterModel.location = undefined;
                                    $scope.filterModel.again = false;
                                    $scope.confirmlocation = true;
                                    setTimeout(() => {
                                        var focusElem = jQuery('input[ng-model="filterModel.shipment_no"]');
                                        focusElem[0].focus();

                                    }, 200);
                                });
                            } else {
                                dpMessageBox.alert({
                                    ok: 'Yes',
                                    title: 'Information.',
                                    message: res.data.mess
                                })
                                $scope.filterModel.location = undefined;
                                $scope.confirmlocation = false;
                                setTimeout(() => {
                                    var focusElem = jQuery('input[ng-model="filterModel.location"]');
                                    focusElem[0].focus();

                                }, 200);
                            }
                        } else {
                            $scope.filterModel.again = false;
                            $scope.confirmlocation = true;
                            setTimeout(() => {
                                var focusElem = jQuery('input[ng-model="filterModel.shipment_no"]');
                                focusElem[0].focus();
                            }, 200);
                        }
                    },
                        function error(res) {
                        });
                }
            }

            // $scope.ScanLocation = function (param) {
            //     if ($scope.filterModel.location == undefined) {
            //         dpMessageBox.alert({
            //             ok: 'Yes',
            //             title: 'Information.',
            //             message: "??????????????? location ????????????????????????"
            //         })
            //         setTimeout(() => {
            //             var focusElem = jQuery('input[ng-model="filterModel.location"]');
            //             focusElem[0].focus();

            //         }, 200);
            //     }
            //     let models = $scope.filterModel;
            //     if ($scope.filterModel.location != undefined) {
            //         viewModel.scanLocation(models).then(function success(res) {

            //             if (res.data.mess != null) {
            //                 if (res.data.mess == 'E') {
            //                     dpMessageBox.confirm({
            //                         ok: 'Yes',
            //                         cancel: 'No',
            //                         title: '???????????????????????????????????? ?',
            //                         message: 'Location ????????????????????????????????????????????? ??????????????????????????????????????????????????????????????????????????????'
            //                     }).then(function success() {
            //                         $scope.filterModel.again = true;
            //                         setTimeout(() => {
            //                             var focusElem = jQuery('input[ng-model="filterModel.shipment_no"]');
            //                             focusElem[0].focus();

            //                         }, 200);
            //                     }, function error(param) {
            //                         // $scope.filterModel.location = undefined;
            //                         $scope.filterModel.again = false;
            //                         setTimeout(() => {
            //                             var focusElem = jQuery('input[ng-model="filterModel.location"]');
            //                             focusElem[0].focus();

            //                         }, 200);
            //                     });
            //                 } else {
            //                     dpMessageBox.alert({
            //                         ok: 'Yes',
            //                         title: 'Information.',
            //                         message: res.data.mess
            //                     })
            //                     setTimeout(() => {
            //                         var focusElem = jQuery('input[ng-model="filterModel.location"]');
            //                         focusElem[0].focus();

            //                     }, 200);
            //                 }
            //             } else {
            //                 $scope.filterModel.again = false;
            //                 setTimeout(() => {
            //                     var focusElem = jQuery('input[ng-model="filterModel.shipment_no"]');
            //                     focusElem[0].focus();
            //                 }, 200);
            //             }
            //         },
            //             function error(res) {
            //             });
            //     }
            // }

            $scope.scanEmptyLocation = function (param) {
                if ($scope.filterModel.location == undefined) {
                    dpMessageBox.alert({
                        ok: 'Yes',
                        title: 'Information.',
                        message: "??????????????? location ????????????????????????"
                    })
                    setTimeout(() => {
                        var focusElem = jQuery('input[ng-model="filterModel.location"]');
                        focusElem[0].focus();

                    }, 200);
                }
                let models = $scope.filterModel;
                if ($scope.filterModel.location != undefined) {
                    viewModel.scanEmptyLocation(models).then(function success(res) {

                        if (res.data.mess != null) {
                            if (res.data.mess != null) {
                                dpMessageBox.alert({
                                    ok: 'Yes',
                                    title: 'Information.',
                                    message: res.data.mess
                                })
                                setTimeout(() => {
                                    var focusElem = jQuery('input[ng-model="filterModel.location"]');
                                    focusElem[0].focus();

                                }, 200);
                            }
                        }else{
                            $scope.confirmEmptyDock = true;
                        }
                    },
                        function error(res) {
                        });
                }
            }

            $scope.ScanShipment = function (param) {
                // if ($scope.filterModel.location == undefined) {
                //     dpMessageBox.alert({
                //         ok: 'Yes',
                //         title: 'Information.',
                //         message: "??????????????? location ????????????????????????"
                //     })
                //     setTimeout(() => {
                //         var focusElem = jQuery('input[ng-model="filterModel.location"]');
                //         focusElem[0].focus();

                //     }, 200);
                // } else if ($scope.filterModel.shipment_no == undefined) {
                //     dpMessageBox.alert({
                //         ok: 'Yes',
                //         title: 'Information.',
                //         message: "??????????????? shipment ????????????????????????"
                //     })
                //     setTimeout(() => {
                //         var focusElem = jQuery('input[ng-model="filterModel.shipment_no"]');
                //         focusElem[0].focus();

                //     }, 200);
                // }

                let models = $scope.filterModel;
                viewModel.Scanshipment(models).then(function success(res) {

                    if (res.data.length > 0) {
                        
                        $scope.filterModeldata = {};
                        $scope.filterModeldata.document_Status = res.data[0].document_Status;
                        $scope.filterModeldata.route_Name = res.data[0].route_Name;
                        $scope.filterModeldata.bill_amount = res.data[0].bill_amount;
                        $scope.filterModeldata.qty_tagBox = res.data[0].qty_tagBox;
                        $scope.filterModeldata.qty_tagTote = res.data[0].qty_tagTote;
                        $scope.filterModeldata.qty_tagTote = res.data[0].qty_tagTote;
                        $scope.listfilterModel = {}
                        $scope.listfilterModel = res.data;
                        if ($scope.filterModel.again) {
                            
                            $scope.nextfrist = false;
                            $scope.select($scope.listfilterModel[0]);
                            $scope.getfrist = $scope.listfilterModel[0];
                            if ($scope.listfilterModel[0].checkall) {
                                $scope.checkall = true;
                            }
                        }
                    } else {
                        dpMessageBox.alert({
                            ok: 'Yes',
                            title: 'Information.',
                            message: "??????????????? shipment ????????????????????????"
                        })
                    }
                },
                    function error(res) {
                    });

            }

            $scope.callroll = function (param) {

                if (param != undefined) {
                    let data = $scope.listfilterModel.find(c => c.isUser);
                    
                    // $scope.filterModel.rollCage_Id = data.rollcage_id;
                    // $scope.filterModel.chute_No = data.chute_no;

                    $scope.getfrist = {};
                    $scope.getfrist = data;
                    $scope.getfrist.location = $scope.filterModel.location;
                    $scope.getfrist.shipment_no = $scope.filterModel.shipment_no;
                    $scope.getfrist.qty_tagBox = $scope.filterModeldata.qty_tagBox;
                    $scope.getfrist.qty_tagTote = $scope.filterModeldata.qty_tagTote;

                    viewModel.CallRollCage($scope.getfrist).then(function success(res) {
                        $scope.nextfrist = false;
                    },
                        function error(res) {
                        });


                } else {
                    if ($scope.filterModel.location == undefined) {
                        dpMessageBox.alert({
                            ok: 'Yes',
                            title: 'Information.',
                            message: "??????????????????????????? Location"
                        })
                        setTimeout(() => {
                            var focusElem = jQuery('input[ng-model="filterModel.location"]');
                            focusElem[0].focus();

                        }, 200);
                    } else if ($scope.filterModel.shipment_no == undefined) {
                        dpMessageBox.alert({
                            ok: 'Yes',
                            title: 'Information.',
                            message: "????????????????????????????????????????????? Shipment"
                        })
                        setTimeout(() => {
                            var focusElem = jQuery('input[ng-model="filterModel.shipment_no"]');
                            focusElem[0].focus();

                        }, 200);
                    }
                }
            };

            $scope.clickTab = function (tab) {
                $scope.click = tab;
            }

            $scope.scanrollcage = function () {

                if ($scope.getfrist.rollcage_id != $scope.filterModel.rollcage_id) {
                    dpMessageBox.alert({
                        ok: 'Yes',
                        title: 'Information.',
                        message: "RollCage ???????????????????????????"
                    })
                    setTimeout(() => {
                        var focusElem = jQuery('input[ng-model="filterModel.rollcage_id"]');
                        focusElem[0].focus();

                    }, 200);
                }else{
                    $scope.Ismatch = true;
                }
            }

            $scope.confirmrollcage = function () {

                $scope.filterModelscan = {};
                $scope.block = true;
                $scope.filterModelscan.qty_tagBox = "0/" + $scope.getfrist.carton
                $scope.filterModelscan.qty_tagTote = "0/" + $scope.getfrist.tote_box
                $scope.filterModel.rollCage_Index = $scope.getfrist.rollCage_Index;
                $scope.filterModel.location = $scope.getfrist.location;
                $scope.filterModel.truckLoad_No = $scope.getfrist.truckLoad_No;
                if ($scope.checkall) {
                    $scope.confirmalltag = true;
                }else{
                    viewModel.updateActiveRollCageBuff($scope.filterModel).then(function success(res) {
                        
    
                    },
                        function error(res) {
                        });
                }

            }

            $scope.Scantagout = function (param) {

                let models = $scope.filterModel;
                models.user = $scope.userName;
                viewModel.Scantagout(models).then(function success(res) {
                    if (res.data.mess == null) {
                        $scope.filterModelscan = res.data;
                        $scope.confirmalltag = res.data.scan_all;
                        $scope.filterModel.tagout_no = null;
                        $scope.filterModel.location = '';
                    } else {
                        $scope.filterModel.tagout_no = null;
                        dpMessageBox.alert({
                            ok: 'Yes',
                            title: 'Information.',
                            message: res.data.mess
                        })
                    }

                },
                    function error(res) {
                    });
            }

            $scope.movePallet = function (param) {
                let models = $scope.filterModel;
                models.user = $scope.userName;
                viewModel.movePallet(models).then(function success(res) {
                    
                    if (res.data.status != null) {
                        $scope.block = false;
                        $scope.nextfrist = true;
                        $scope.confirmalltag = false;
                        $scope.checkall = false;
                        $scope.Ismatch = false;
                        $scope.confirmEmptyDock = false;
                        $scope.confirmlocation = false;
                        $scope.filterModel = {};
                        $scope.listfilterModel = {};
                        $scope.filterModeldata = {};
                        $scope.filterModelscan = {};
                        $scope.back();
                    }else{
                        
                    }
                },
                    function error(res) {
                    });
            }

            $scope.back = function () {
                let i = $scope.menu.indexOf($scope.menu.find(c => c.active == "active"));
                $scope.menu[i].active = "";
                $scope.menu[i].completed = "";
                $scope.menu[i - 2].active = "active";
                $scope.menu_width = (i - 1) * 50; //?????????????????????????????????????????????????????????????????????????????????
            }

            $scope.ClearAll = function () {
                $scope.filterModel.location = "";
                $scope.filterModel.shipment_no = "";
                $scope.listfilterModel = {};
                $scope.filterModel.buttoncall = true;
                $scope.isSelect = false;
                $scope.nextfrist = true;
                document.getElementById("scanLocation").focus();
            }

            $vm.$onInit = function () {
                $vm = this;
                $scope.block = false;
                $scope.nextfrist = true;
                $scope.confirmalltag = false;
                $scope.checkall = false;
                $scope.Ismatch = false;
                $scope.confirmEmptyDock = false;
                $scope.confirmlocation = false;
                $scope.userName = localStorageService.get('userTokenStorage');
                $scope.click = 1;
                $scope.isSelect = false;
                setTimeout(() => {
                    var focusElem = jQuery('input[ng-model="filterModel.location"]');
                    focusElem[0].focus();

                }, 200);
            }







        }
    })
})();