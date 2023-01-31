
(function () {
    'use strict'
    app.directive('tagOutForm', ['ngAuthSettings', '$window', 'commonService', 'pageLoading', '$timeout',
        function (ngAuthSettings, $window, commonService, pageLoading, $timeout) {
            return {
                restrict: 'E',
                controllerAs: '$ctrl',
                templateUrl: "modules/GI/TagOut/tagOutForm.html",
                scope: {
                    onShow: '=',
                    delegates: '=?',
                    invokes: '=?',
                    config: '=?',
                    searchResultModel: '=?',
                    filterModel: '=?'
                },
                controller: ['$scope', '$http', '$q', 'ngAuthSettings', '$state', 'pageLoading', '$window', 'commonService', '$timeout', '$translate', 'localStorageService', 'dpMessageBox', 'bookingAssignDockFactory',
                    function ($scope, $http, $q, ngAuthSettings, $state, pageLoading, $window, commonService, $timeout, $translate, localStorageService, dpMessageBox, bookingAssignDockFactory) {

                        $scope.delegates = $scope.delegates || {};
                        $scope.invokes = $scope.invokes || {};
                        $scope.config = $scope.config || {};
                        $scope.onShow = false;
                        var $vm = this;
                        var viewModel = bookingAssignDockFactory;
                        $scope.onHide = function () {
                        };

                        $scope.onClose = function () {
                            $scope.onShow = false;
                            $window.localStorage.setItem("displayHead", "");
                            $window.localStorage.setItem("marginHead", "");
                            $window.localStorage.setItem("marginmenu", "120px");
                        };

                        $scope.bkItem = {}

                        $scope.dataItem = [];
                        $scope.delegate = {
                            set: function (param) {
                                $scope.filterModel = {}

                            }
                        }
                        $scope.delegates = $scope.delegate;

                        $vm.onShow = function (param) {
                            defer = $q.defer();
                            $scope.filterModel = {};
                            $scope.onShow = true;
                            //Update
                            return defer.promise;
                        };

                        function checkedlang() {
                            $scope.switLang = {}
                            if ($window.localStorage['LANGUAGE'] == "th") {
                                $scope.switLang.name = 'TH'
                            } else {
                                $scope.switLang.name = 'EN'
                            }
                            return $scope.switLang;
                        }
                        $scope.save = function () {
                            debugger
                            var items = $scope.filterModel;
                            items.messagebox = {}
                            $scope.bkItem = {};
                            if ($scope.invokes.add) {
                                var checkLanguage = checkedlang()
                                var messagebox = {}

                                if (checkLanguage.name == 'TH') {
                                    messagebox.text = 'บันทึกข้อมูลเสร็จสิ้น';
                                    messagebox.error = 'ไม่พบข้อมูล';
                                    messagebox.plan = 'กรุณากรอกเลขที่เอกสาร !';
                                    messagebox.qty = 'กรุณากรอกจำนวน !';
                                    messagebox.loca = 'กรุณาเลือก locationtype !';
                                    messagebox.alert = 'แจ้งเตือน'
                                    items.messagebox.text = messagebox.text;
                                    items.messagebox.error = messagebox.error;
                                }
                                else {
                                    messagebox.text = 'Save Success';
                                    messagebox.error = 'Data not found';
                                    messagebox.plan = 'Please Input Plan Gi No !';
                                    messagebox.qty = 'Please Input Qty label !';
                                    messagebox.loca = 'Please select locationtype !';
                                    messagebox.alert = 'Information'
                                    items.messagebox.text = messagebox.text;
                                    items.messagebox.error = messagebox.error;
                                }
                                //Validate
                                if (items.plangi_no == undefined || items.plangi_no == "") {
                                    dpMessageBox.alert({
                                        ok: 'Close',
                                        title: messagebox.alert,
                                        message: messagebox.plan
                                    })
                                    return "";
                                }
                                if (items.value == undefined || items.value == "") {
                                    dpMessageBox.alert({
                                        ok: 'Close',
                                        title: messagebox.alert,
                                        message: messagebox.loca
                                    })
                                    return "";
                                }
                                if (items.qtylabel == undefined || items.qtylabel == "") {
                                    dpMessageBox.alert({
                                        ok: 'Close',
                                        title: messagebox.alert,
                                        message: messagebox.qty
                                    })
                                    return "";
                                }

                                $scope.invokes.add(items);
                            }
                        }

                        function initial() {
                            $scope.filterModel = {};
                        }

                        initial();
                    }
                ],
                link: function ($scope, $element, $attributes) { }
            };
        }]);
}());