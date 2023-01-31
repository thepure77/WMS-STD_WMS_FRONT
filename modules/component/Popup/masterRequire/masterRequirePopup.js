
(function () {
    'use strict'
    app.directive('masterRequire', ['ngAuthSettings', '$window', 'commonService', 'pageLoading', '$timeout',
        function (ngAuthSettings, $window, commonService, pageLoading, $timeout) {
            return {
                restrict: 'E',
                controllerAs: '$ctrl',
                templateUrl: "modules/component/Popup/masterRequire/masterRequirePopup.html",
                scope: {
                    onShow: '=',
                    delegates: '=?',
                    invokes: '=?',
                    config: '=?'
                },
                controller: ['$scope', '$http', '$q', 'ngAuthSettings', '$state', 'pageLoading', '$window', 'commonService', '$timeout', '$translate', 'localStorageService', '$interval', 'dpMessageBox', 'taskcyclecountFactory',
                    function ($scope, $http, $q, ngAuthSettings, $state, pageLoading, $window, commonService, $timeout, $translate, localStorageService, $interval, dpMessageBox, taskcyclecountFactory) {
                        $scope.delegates = {};
                        $scope.invokes = $scope.invokes || {};
                        $scope.config = $scope.config || {};
                        var viewModel = taskcyclecountFactory;
                        $scope.chk = {};
                        $scope.masterRequire = {};

                        $scope.filterModel = {};
                        $scope.onShow = false;
                        $scope.onHide = function (param) {
                        };
                        $scope.onClose = function () {
                            $scope.masterRequire = {};
                            $scope.onShow = false;
                        };
                        $scope.$watchCollection('onShow', function (newVal, oldVal) {
                            if (newVal !== oldVal) {
                            }
                        });
                        $scope.model = {
                            masterRequireId: ''
                        };
                        $scope.toggleSearch = function () {
                            $scope.model.advanceSearch = $scope.model.advanceSearch === false ? true : false;
                        };
                        $scope.delegates.search = function () {
                            if ($scope.model.advanceSearch)
                                $scope.filter();
                            else
                                $scope.find();
                        }

                        $scope.delegates = function (param) {

                            $scope.chk.isExpDate = param.isExpDate;
                            $scope.chk.isMfgDate = param.isMfgDate;
                            $scope.chk.isLot = param.isLot;
                            $scope.chk.productItemLife_D = param.productItemLife_D;
                            $scope.chk.productItemLife_M = param.productItemLife_M;
                            $scope.chk.productItemLife_Y = param.productItemLife_Y;
                            $scope.masterRequire.isExpDate = param.isExpDate;
                            $scope.masterRequire.isMfgDate = param.isMfgDate;
                            $scope.masterRequire.isLot = param.isLot;
                            if ($scope.masterRequire.isLot == 1)
                            {
                                $scope.masterRequire.lot = param.product_Lot;
                            }
                            if($scope.chk.isMfgDate == 1)
                            {
                                $scope.masterRequire.mFG_Date = param.defaultdate;
                            }
                            
                        }

                        $scope.$watch('masterRequire.mFG_Date', function () {
                            let today = new Date();debugger;
                            var year = parseInt(($scope.masterRequire.mFG_Date.substring(0, 4)));
                            var month = parseInt(($scope.masterRequire.mFG_Date.substring(4, 6)));
                            var day = parseInt(($scope.masterRequire.mFG_Date.substring(6, 8)));
                            var newDate = year + '-' + month + '-' + day;
                            var EnewDate = new Date(newDate);
                            //$scope.maxDate = moment(today.setDate(today.getDate()));
                            if (EnewDate > today) {$scope.masterRequire.mFG_Date = {};
                                dpMessageBox.alert(
                                    {
                                        ok: 'Close',
                                        title: 'ALERT',
                                        message: 'กรุณาเลือก วันที่น้อยกว่าหรือเท่ากับ ปัจจุบัน'
                                    }
                                )
                                return "";
                            }
                            else{
                            if ($scope.chk.isMfgDate == 1 && $scope.chk.isExpDate == 0) {
                                if ($scope.masterRequire.mFG_Date != undefined) {
                                    // var newDate = new Date($scope.masterRequire.mFG_Date.setMonth(date.getMonth()+$scope.chk.productItemLife_M))
                                    // var year = parseInt(($scope.masterRequire.mFG_Date.substring(0, 4)));
                                    // var month = parseInt(($scope.masterRequire.mFG_Date.substring(4, 6)));
                                    // var day = parseInt(($scope.masterRequire.mFG_Date.substring(6, 8)));
                                    // var newDate = year + '-' + month + '-' + day;
                                    // var EnewDate = new Date(newDate);
                                    EnewDate.setDate(EnewDate.getDate() + $scope.chk.productItemLife_D);
                                    EnewDate.setUTCFullYear(EnewDate.getUTCFullYear() + $scope.chk.productItemLife_Y);
                                    EnewDate.setMonth(EnewDate.getMonth() + $scope.chk.productItemLife_M);
                                    debugger
                                    var mm = EnewDate.getMonth() + 1;
                                    var yyyy = EnewDate.getFullYear();
                                    var dd = EnewDate.getDate();

                                    if (dd < 10) dd = '0' + dd;
                                    if (mm < 10) mm = '0' + mm;
                                    $scope.masterRequire.eXP_Date = yyyy + '' + mm + '' + dd;
                                    if ($scope.masterRequire.mFG_Date != $scope.masterRequire.eXP_Date) {
                                        dpMessageBox.alert(
                                            {
                                                ok: 'Close',
                                                title: 'ALERT',
                                                message: age(new Date(newDate),EnewDate)
                                            }
                                        )
                                    }
                                }
                            }}
                        });

                        function age(dob, today) { 
                            debugger
                            var today = today || new Date(), 
                                result = { 
                                  years: 0, 
                                  months: 0, 
                                  days: 0, 
                                  toString: function() { 
                                    return (this.years ? this.years + ' ปี ' : '') 
                                      + (this.months ? this.months + ' เดือน ' : '') 
                                      + (this.days ? this.days + ' วัน' : '');
                                  }
                                };
                            result.months = 
                              ((today.getFullYear() * 12) + (today.getMonth() + 1))
                              - ((dob.getFullYear() * 12) + (dob.getMonth() + 1));
                            if (0 > (result.days = today.getDate() - dob.getDate())) {
                                var y = today.getFullYear(), m = today.getMonth();
                                m = (--m < 0) ? 11 : m;
                                result.days += 
                                  [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m] 
                                    + (((1 == m) && ((y % 4) == 0) && (((y % 100) > 0) || ((y % 400) == 0))) 
                                        ? 1 : 0);
                                --result.months;
                            }
                            result.years = (result.months - (result.months % 12)) / 12;
                            result.months = (result.months % 12);
                            return 'หมดอายุใน '+result.days+' วัน '+result.months+' เดือน '+result.years+' ปี';
                        }

                        Date.prototype.yyyymmdd = function () {
                            var mm = this.getMonth() + 1; // getMonth() is zero-based
                            var dd = this.getDate();

                            return [this.getFullYear(),
                            (mm > 9 ? '' : '0') + mm,
                            (dd > 9 ? '' : '0') + dd
                            ].join('');
                        };

                        $scope.selected = function () {
                            if ($scope.chk.isMfgDate == 1) {
                                if ($scope.masterRequire.mFG_Date == null
                                    || $scope.masterRequire.mFG_Date == undefined
                                    || $scope.masterRequire.mFG_Date == "") {
                                    dpMessageBox.alert(
                                        {
                                            ok: 'Close',
                                            title: 'ALERT',
                                            message: 'MSG_Alert_MFGDATE'
                                        }
                                    )
                                    return "";
                                }
                                // $scope.onShow = true;
                            }
                            if ($scope.chk.isExpDate == 1) {
                                if ($scope.masterRequire.eXP_Date == null
                                    || $scope.masterRequire.eXP_Date == undefined
                                    || $scope.masterRequire.eXP_Date == "") {
                                    dpMessageBox.alert(
                                        {
                                            ok: 'Close',
                                            title: 'ALERT',
                                            message: 'MSG_Alert_EXPDATE'
                                        }
                                    )
                                    return "";
                                }
                                // $scope.onShow = true;
                            }

                            if ($scope.chk.isLot == 1) {
                                if ($scope.masterRequire.lot == null
                                    || $scope.masterRequire.lot == undefined
                                    || $scope.masterRequire.lot == "") {
                                    dpMessageBox.alert(
                                        {
                                            ok: 'Close',
                                            title: 'ALERT',
                                            message: 'MSG_Alert_ProductLot'
                                        }
                                    )
                                    return "";
                                }
                                // $scope.onShow = true;
                            }
                            if ($scope.invokes.selected != undefined)
                                $scope.invokes.selected($scope.masterRequire);
                            $scope.masterRequire = {};
                            $scope.onShow = false;

                        }


                        var init = function () {
                        };

                        init();
                        // Local Function
                        // end
                    }
                ],
                link: function ($scope, $element, $attributes) { }
            };
        }
    ]);
}());
