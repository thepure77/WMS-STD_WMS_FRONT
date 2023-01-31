
(function () {
    'use strict'
    app.directive('returnTotePopup', ['ngAuthSettings', '$window', 'commonService', 'pageLoading', '$timeout',
        function (ngAuthSettings, $window, commonService, pageLoading, $timeout) {
            return {
                restrict: 'E',
                controllerAs: '$ctrl',
                templateUrl: "modules/GI/ReturnTote/returnToteSummary/returnTotePopup.html",
                scope: {
                    onShow: '=',
                    delegates: '=?',
                    invokes: '=?',
                    config: '=?'
                },
                controller: ['$scope', '$http', '$q', 'ngAuthSettings', '$state', 'pageLoading', '$window', 'commonService', '$timeout', '$translate', 'localStorageService', '$interval', 'webServiceAPI', 'dpMessageBox',
                    function ($scope, $http, $q, ngAuthSettings, $state, pageLoading, $window, commonService, $timeout, $translate, localStorageService, $interval, webServiceAPI, dpMessageBox) {
                        $scope.delegates = {};
                        $scope.invokes = $scope.invokes || {};
                        $scope.config = $scope.config || {};
                        $scope.onShow = false;
                        $scope.ResultData = {};
                        $scope.model = {};

                        $scope.onClose = function () {
                            $scope.onShow = false;
                        };

                        $scope.delegates = function (param) {
                            $scope.checkdoc = false;
                            $scope.filterModel = param;
                            $scope.dropdownsize = [];
                            $scope.defult = {}
                            $scope.filterModelitem = {}
                            $scope.filterModel.returntoteitemLists.model = undefined;
                            $scope.dropdownsizeXX($scope.filterModel.returntoteitemLists);
                        }

                        $scope.dropdownsizeXX = function (param) {
                            $scope.dropdownsize = param;
                        };

                        $scope.$watch("dropdownsize.model", function () {
                            if ($scope.dropdownsize.model != undefined) {
                                debugger
                                if ($scope.dropdownsize.model.return_Tote_Size == 'Doc') {
                                    $scope.checkdoc = true;
                                }else{
                                    $scope.checkdoc = false;
                                }
                                $scope.defult = {}
                                $scope.defult.return_Tote_MAX = parseInt($scope.dropdownsize.model.return_Tote_MAX) - $scope.dropdownsize.model.return_Tote_Qty_XX
                                $scope.defult.doccount = parseInt($scope.filterModel.docReturn) - $scope.filterModel.return_docReturn_XX;
                            }
                            $scope.update = 0;
                        });

                        $scope.$watch("filterModelitem.return_qty", function () {
                            if ($scope.filterModelitem.return_qty != undefined) {
                                if ($scope.filterModelitem.return_qty < 0) {
                                    $scope.filterModelitem.return_qty = 0;
                                }
                            }
                        });

                        $scope.$watch("filterModelitem.return_qty_damage", function () {
                            if ($scope.filterModelitem.return_qty_damage != undefined) {
                                if ($scope.filterModelitem.return_qty_damage < 0) {
                                    $scope.filterModelitem.return_qty_damage = 0;
                                }
                            }
                        });

                        $scope.$watch("filterModelitem.re_doc", function () {
                            if ($scope.filterModelitem.re_doc != undefined) {
                                if ($scope.filterModelitem.re_doc < 0) {
                                    $scope.filterModelitem.re_doc = 0;
                                }
                            }
                        });


                        $scope.addsItem = function () {
                            if ($scope.filterModelitem.return_qty == undefined) {
                                $scope.filterModelitem.return_qty = 0
                            }
                            if ($scope.filterModelitem.return_qty_damage == undefined) {
                                $scope.filterModelitem.return_qty_damage = 0
                            }
                            if ($scope.filterModelitem.re_doc == undefined) {
                                $scope.filterModelitem.re_doc = 0
                            }
                            if ($scope.filterModel.returntoteitemLists.model != undefined) {
                                if ($scope.filterModelitem != undefined) {
                                    if ($scope.filterModelitem.return_qty < 0 || $scope.filterModelitem.return_qty_damage < 0 || $scope.filterModelitem.re_doc < 0) {
                                        dpMessageBox.alert({
                                            ok: 'Yes',
                                            title: 'Information.',
                                            message: "ไม่สามารถกรอกจำนวนติดลบได้ "
                                        })
                                        $scope.filterModelitem.return_qty = undefined;
                                        $scope.filterModelitem.return_qty_damage = undefined;
                                        $scope.filterModelitem.re_doc = undefined;
                                        $scope.filterModelitem.model = undefined;
                                        $scope.filterModelitem.remark = undefined;
                                    } else if ($scope.filterModelitem.return_qty == 0 && $scope.filterModelitem.return_qty_damage == 0 && $scope.filterModelitem.re_doc == 0) {
                                        dpMessageBox.alert({
                                            ok: 'Yes',
                                            title: 'Information.',
                                            message: "กรุณากรอก จำนวน "
                                        })
                                        $scope.filterModelitem.return_qty = undefined;
                                        $scope.filterModelitem.return_qty_damage = undefined;
                                        $scope.filterModelitem.re_doc = undefined;
                                        $scope.filterModelitem.model = undefined;
                                        $scope.filterModelitem.remark = undefined;
                                    } else if ($scope.filterModel.returntoteitemLists.model.return_Tote_MAX < $scope.filterModelitem.return_qty + $scope.filterModelitem.return_qty_damage) {
                                        dpMessageBox.alert({
                                            ok: 'Yes',
                                            title: 'Information.',
                                            message: "ไม่สามารถกรอกจำนวน มากจำนวนที่มีอยู่ได้"
                                        })
                                        $scope.filterModelitem.return_qty = undefined;
                                        $scope.filterModelitem.return_qty_damage = undefined;
                                        $scope.filterModelitem.re_doc = undefined;
                                        $scope.filterModelitem.model = undefined;
                                        $scope.filterModelitem.remark = undefined;
                                    } else if ($scope.defult.doccount < $scope.filterModelitem.re_doc) {
                                        dpMessageBox.alert({
                                            ok: 'Yes',
                                            title: 'Information.',
                                            message: "ไม่สามารถกรอกจำนวนคืนเอกสาร มากจำนวนที่มีอยู่ได้"
                                        })
                                        $scope.filterModelitem.return_qty = undefined;
                                        $scope.filterModelitem.return_qty_damage = undefined;
                                        $scope.filterModelitem.model = undefined;
                                        $scope.filterModelitem.re_doc = undefined;
                                        $scope.filterModelitem.remark = undefined;
                                    } else {
                                        let getvalidate = $scope.filterModel.select_returntoteitemLists.filter(c => c.truckReturn_Index == $scope.filterModel.returntoteitemLists.model.truckReturn_Index);
                                        if (getvalidate.length > 0) {

                                            if ((parseInt(getvalidate[0].return_Tote_MAX) - parseInt(getvalidate[0].return_Tote_Qty)) < getvalidate.sum("return_qty") + getvalidate.sum("return_qty_damage") + $scope.filterModelitem.return_qty + $scope.filterModelitem.return_qty_damage) {
                                                dpMessageBox.alert({
                                                    ok: 'Yes',
                                                    title: 'Information.',
                                                    message: "ไม่สามารถกรอกจำนวน มากจำนวนที่มีอยู่ได้"
                                                })
                                                $scope.filterModelitem.return_qty = undefined;
                                                $scope.filterModelitem.return_qty_damage = undefined;
                                                $scope.filterModelitem.re_doc = undefined;
                                                $scope.filterModelitem.model = undefined;
                                                $scope.filterModelitem.remark = undefined;
                                            } else {
                                                $scope.filterModel.returntoteitemLists.model.return_qty = ($scope.filterModelitem.return_qty == null ? 0 : $scope.filterModelitem.return_qty);
                                                $scope.filterModel.returntoteitemLists.model.return_qty_damage = ($scope.filterModelitem.return_qty_damage == null ? 0 : $scope.filterModelitem.return_qty_damage);
                                                $scope.filterModel.returntoteitemLists.model.re_doc = ($scope.filterModelitem.re_doc == null ? 0 : $scope.filterModelitem.re_doc);
                                                $scope.filterModel.returntoteitemLists.model.truckLoad_Return_Status = $scope.filterModelitem.truckLoad_Return_Status;
                                                $scope.invokes.selected($scope.filterModel.returntoteitemLists.model);
                                                $scope.filterModelitem = {};
                                                $scope.onShow = false;
                                            }
                                        } else {
                                            if ((parseInt($scope.filterModel.returntoteitemLists.model.return_Tote_MAX) - parseInt($scope.filterModel.returntoteitemLists.model.return_Tote_Qty)) < ($scope.filterModelitem.return_qty + $scope.filterModelitem.return_qty_damage)) {
                                                dpMessageBox.alert({
                                                    ok: 'Yes',
                                                    title: 'Information.',
                                                    message: "ไม่สามารถกรอกจำนวน มากจำนวนที่มีอยู่ได้"
                                                })
                                                $scope.filterModelitem.return_qty = undefined;
                                                $scope.filterModelitem.return_qty_damage = undefined;
                                                $scope.filterModelitem.re_doc = undefined;
                                                $scope.filterModelitem.model = undefined;
                                                $scope.filterModelitem.remark = undefined;
                                            } else {

                                                $scope.filterModel.returntoteitemLists.model.return_qty = ($scope.filterModelitem.return_qty == null ? 0 : $scope.filterModelitem.return_qty);
                                                $scope.filterModel.returntoteitemLists.model.return_qty_damage = ($scope.filterModelitem.return_qty_damage == null ? 0 : $scope.filterModelitem.return_qty_damage);
                                                $scope.filterModel.returntoteitemLists.model.re_doc = ($scope.filterModelitem.re_doc == null ? 0 : $scope.filterModelitem.re_doc);
                                                $scope.filterModel.returntoteitemLists.model.truckLoad_Return_Status = $scope.filterModelitem.truckLoad_Return_Status;
                                                $scope.filterModel.returntoteitemLists.model.remark = $scope.filterModelitem.remark;
                                                $scope.invokes.selected($scope.filterModel.returntoteitemLists.model);
                                                $scope.filterModelitem = {};
                                                $scope.onShow = false;
                                            }
                                        }
                                    }
                                } else {
                                    dpMessageBox.alert({
                                        ok: 'Yes',
                                        title: 'Information.',
                                        message: "กรุณากรอก จำนวน "
                                    })
                                }
                            } else {
                                dpMessageBox.alert({
                                    ok: 'Yes',
                                    title: 'Information.',
                                    message: "กรุณาเลือกขนาด ที่จะทำการรับคืน"
                                })
                                $scope.filterModel.return_qty = undefined;
                            }
                        }

                        // Array.prototype.sum = function (prop) {
                        //     var total = 0
                        //     for (var i = 0, _len = this.length; i < _len; i++) {
                        //         total += this[i][prop]
                        //     }
                        //     return total
                        // }

                        $scope.Close = function () {
                            $scope.filterModelitem = undefined
                            $scope.onShow = false;
                            $scope.filterItemModel = {};
                        }

                        var init = function () {
                        };

                        init();

                    }
                ],
                link: function ($scope, $element, $attributes) { }
            };
        }
    ]);
}());
