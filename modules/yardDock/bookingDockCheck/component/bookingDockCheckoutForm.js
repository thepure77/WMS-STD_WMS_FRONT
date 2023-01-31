(function () {
    'use strict'
    app.component('bookingDockCheckoutForm', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/yardDock/bookingDockCheck/component/bookingDockCheckoutForm.html";
        },
        bindings: {
            onShow: '=?',
            searchResultModel: '=?',
            filterModel: '=?'
        },
        controller: function ($scope, $q, $filter, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, dpMessageBox, localStorageService, bookingDockCheckoutFactory, locationFactory, webServiceAPI) {
            var $vm = this;
            $scope.getCheck = false;
            $scope.onShow = false;
            $scope.disabled = 1;
            var defer = {};
            var viewModel = bookingDockCheckoutFactory;
            $scope.Cancel = true;
            $scope.update = false;

            $vm.onShow = function (param, action) {
                defer = $q.defer();
                $scope.checkOut = true;
                $scope.onShow = true;
                if (action == 'checkedout') {
                    $scope.filterModel = param
                    viewModel.filter($scope.filterModel).then(function (res) {
                        pageLoading.hide();
                        $scope.filterModel = res.data;
                        $scope.filterModel.checkOut_Date = getTodayFromGet();
                        $scope.filterModel.checkOut_Time = getTime();
                    });

                }
                else {

                }
                return defer.promise;
            };

            $scope.back = function () {
                $scope.filterModel = {}
                $state.go('wms.bk_dock_check');
            }

            $scope.buttons = {
                add: true,
                update: false,
                back: true
            };

            $scope.url = {
                Master: webServiceAPI.Master,
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
            $scope.scan = function () {
                var deferred = $q.defer();
                var model = {};
                model.appointment_Id = $scope.filterModel.appointment_Id;
                var checkLanguage = checkedlang()
                var messagebox = {}
                if (checkLanguage.name == 'TH') {
                    messagebox.text = 'ไม่พบ เลขที่ Appointment'
                    messagebox.alert = 'แจ้งเตือน'
                }
                else {
                    messagebox.text = 'Appointment Id Not Found'
                    messagebox.alert = 'Information'
                }

                pageLoading.show();
                viewModel.scan(model).then(
                    function success(res) {
                        pageLoading.hide();
                        $scope.bookingDockPopup.onClick(res.data);
                    },
                    function error(response) {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: messagebox.alert,
                            message: messagebox.text
                        })
                        deferred.reject(response);
                    });
                return deferred.promise;
            }
            function checkedlang() {
                $scope.switLang = {}
                if ($window.localStorage['LANGUAGE'] == "th") {
                    $scope.switLang.name = 'TH'
                } else {
                    $scope.switLang.name = 'EN'
                }
                return $scope.switLang;
            }
            $scope.add = function () {
                $scope.isBlock = true;
                var deferred = $q.defer();
                var checkLanguage = checkedlang()
                var messagebox = {}
                if (checkLanguage.name == 'TH') {
                    messagebox.text = 'คุณต้องการเช็คเอ้าหรือไม่'
                    messagebox.success = 'เช็คเอ้าเรียบร้อย'
                    messagebox.error = 'ไม่สามารถเช็คเอ้าได้'
                    messagebox.dock = 'กรุณาเลือกเลขที่เอกสาร'
                    messagebox.date = 'กรุณาเลือกวันที่เข้าท่าสินค้า'
                    messagebox.checkout = 'กรุณาเลือกเวลาเข้าท่าสินค้า'
                    messagebox.alert = 'แจ้งเตือน'
                }
                else {
                    messagebox.text = 'Do you want to Check Out ?'
                    messagebox.success = 'Scan Check-Out success'
                    messagebox.error = 'Checkout error'
                    messagebox.dock = 'Dock is Required !'
                    messagebox.date = 'Checkout Date is Required !'
                    messagebox.checkout = 'Checkout Time is Required !'
                    messagebox.alert = 'Information'
                }

                if ($scope.filterModel.dock_Id == undefined || $scope.filterModel.dock_Id == "") {
                    $scope.isBlock = false;
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: messagebox.alert,
                            message: messagebox.dock
                        }
                    )
                    return "";
                }
                if ($scope.filterModel.checkOut_Date == undefined || $scope.filterModel.checkOut_Date == "") {
                    $scope.isBlock = false;
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: messagebox.alert,
                            message: messagebox.date
                        }
                    )
                    return "";
                }
                if ($scope.filterModel.checkOut_Time == undefined || $scope.filterModel.checkOut_Time == "") {
                    $scope.isBlock = false;
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: messagebox.alert,
                            message: messagebox.checkout
                        }
                    )
                    return "";
                }

                var get_date = $scope.filterModel.checkOut_Date;
                var newdate = convertDateFilter($scope.filterModel.checkOut_Date);
                $scope.filterModel.checkOut_Date = newdate;
                $scope.filterModel.Create_By = $scope.userName

                
                dpMessageBox.confirm({
                    ok: 'Yes',
                    cancel: 'No',
                    title: messagebox.alert,
                    message: messagebox.text
                }).then(function () {
                    pageLoading.show();
                    viewModel.add($scope.filterModel).then(
                        function success(res) {
                            if (res.data.resultIsUse) {
                                $scope.isBlock = false;
                                pageLoading.hide();
                                dpMessageBox.alert({
                                    ok: 'Close',
                                    title: messagebox.alert,
                                    message: messagebox.success
                                })
                                $state.go('wms.bk_dock_check');
                            } else {
                                $scope.isBlock = false;
                                $scope.filterModel.checkOut_Date = get_date;
                                dpMessageBox.alert({
                                    ok: 'Close',
                                    title: messagebox.alert,
                                    message: res.data.resultMsg
                                })
                                deferred.reject(response);
                            }

                        },
                        function error(response) {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: messagebox.alert,
                                message: messagebox.error
                            })
                            deferred.reject(response);
                        });
                    return deferred.promise;
                });
            }

            $scope.bookingDockPopup = {
                onShow: false,
                delegates: {},
                onClick: function (param) {
                    $scope.bookingDockPopup.onShow = !$scope.bookingDockPopup.onShow;
                    $scope.bookingDockPopup.delegates(param);
                },
                config: {
                    title: "bookingDockPopup"
                },
                invokes: {
                    selected: function (param) {
                        $scope.filter(param);
                    }
                }
            };

            $scope.filter = function (param) {
                var deferred = $q.defer();
                var model = {};
                model = param;
                pageLoading.show();
                viewModel.filter(model).then(
                    function success(res) {
                        pageLoading.hide();
                        $scope.filterModel = res.data;
                        $scope.filterModel.checkOut_Date = getToday();
                        if ($scope.filterModel.checkOut_Date != undefined) {
                            var newdate = format($scope.filterModel.checkOut_Date);
                            $scope.filterModel.checkOut_Date = newdate;
                        }
                        $scope.filterModel.checkOut_Time = getTime();

                        var date = dateformate(res.data.appointment_Date)
                        $scope.filterModel.appointment_Date = date;
                    },
                    function error(response) {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'ALERT',
                            message: response.Message.Message

                        })
                        deferred.reject(response);
                    });
                return deferred.promise;
            }

            function convertDate(param) {
                var year = param.substring(0, 4);
                var month = param.substring(4, 6);
                var day = param.substring(6, 8);
                month = parseInt(month) - 1;
                var a = new Date(year, month, day);
                return a;
            }
            function format(param) {
                var date = param.split('/');
                var newdate = date[2] + date[1] + date[0]
                return newdate;
            }
            function convertDateFilter(param) {
                var year = param.substring(0, 4);
                var month = param.substring(4, 6);
                var day = param.substring(6, 8);
                // month = parseInt(month) - 1;
                // day = parseInt(day) + 1;
                // var a = new Date(year, month, day);
                var a = year + '-' + month + '-' + day + 'T00:00:00Z'
                return a;
            }
            function getTodayFromGet() {
                var today = new Date();
                var mm = today.getMonth() + 1;
                var yyyy = today.getUTCFullYear();
                var dd = today.getDate();

                if (dd < 10) dd = '0' + dd;
                if (mm < 10) mm = '0' + mm;

                return yyyy.toString() + mm.toString() + dd.toString();
            }

            function getToday() {
                var today = new Date();
                var mm = today.getMonth() + 1;
                var yyyy = today.getUTCFullYear();
                var dd = today.getDate();

                if (dd < 10) dd = '0' + dd;
                if (mm < 10) mm = '0' + mm;

                return dd.toString() + '/' + mm.toString() + '/' + yyyy.toString();
            }

            function getTime() {
                var Minute = new Date().getMinutes();
                var Hour = new Date().getHours();

                if (Minute < 10) Minute = '0' + Minute;

                return Hour.toString() + ':' + Minute.toString()
            }

            function dateformate(param) {
                var date = param.slice(0, 10).split('-');
                var newdate = date[2] + "/" + date[1] + "/" + date[0];
                return newdate;
            }

            var init = function () {
                $scope.isBlock = false;
                $scope.getModel = viewModel.getdata();
                if ($scope.getModel == "") {
                    $scope.getModel = {};
                }
                $scope.getModel.status = viewModel.getAction();
                if ($scope.getModel != undefined && $scope.getModel != "") {
                    $scope.getModel.status = viewModel.getAction();
                }
                $scope.userName = localStorageService.get('userTokenStorage');
                $scope.filterModel = {};
                if ($scope.getModel != undefined && $scope.getModel != "") {
                    if ($scope.getModel.status == "checkedout") {
                        $scope.onShow = true;
                        $vm.onShow($scope.getModel, $scope.getModel.status);
                    }
                }
                $scope.filterModel.dateProduct = getToday();
            };

            init();
        }
    })
})();