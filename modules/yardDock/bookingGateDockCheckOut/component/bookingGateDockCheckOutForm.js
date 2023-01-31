(function () {
    'use strict'
    app.component('bookingGateDockCheckOutForm', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/yardDock/bookingGateDockCheckOut/component/bookingGateDockCheckOutForm.html";
        },
        bindings: {
            onShow: '=?',
            searchResultModel: '=?',
            filterModel: '=?'
        },
        controller: function ($scope, $q, $filter, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, dpMessageBox, localStorageService, bookingDockCheckFactory, bookingDockCheckoutFactory, webServiceAPI) {
            var $vm = this;
            $scope.getCheck = false;
            $scope.onShow = false;
            var defer = {};
            $scope.disabled = 1;
            var viewModel = bookingDockCheckFactory;

            $scope.Cancel = true;

            $vm.onShow = function (param, action) {
                defer = $q.defer();
                if ($scope.filterModel != null) {
                    $scope.filterModel = {};
                }
                $scope.onShow = true;
                //Update
                $scope.showCheckIn = true;
                $scope.filterModel = param
                if ($scope.filterModel.appointment_Date != null) {
                    var ds = dateformate($scope.filterModel.appointment_Date);
                    $scope.filterModel.appointment_Date = ds;
                    $scope.filterModel.checkOut_Date = getToday();
                    $scope.filterModel.checkOut_Time = getTime();
                }

                return defer.promise;
            };

            $vm.triggerSearch = function () {
                pageLoading.show();
                viewModel.filter($scope.filterModel).then(function (res) {
                    pageLoading.hide();
                    $vm.searchResultModel = res.data.itemsWorkArea;
                });
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

            //Add 
            $scope.add = function () {
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
                    messagebox.text = 'Do you want to Check In ?'
                    messagebox.success = 'Scan Check-Out success'
                    messagebox.error = 'Checkout error'
                    messagebox.dock = 'Dock is Required !'
                    messagebox.date = 'Checkout Date is Required !'
                    messagebox.checkout = 'Checkout Time is Required !'
                    messagebox.alert = 'Information'
                }

                var newdate = convertDateFilter($scope.filterModel.checkOut_Date);
                $scope.filterModel.checkOut_Date = newdate;
                $scope.filterModel.Create_By = $scope.userName
                
                pageLoading.show();
                viewModel.addout($scope.filterModel).then(
                    function success(res) {
                        pageLoading.hide();
                        if(res.data != undefined){
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: messagebox.alert,
                                message: res.data
                            })
                        }
                        else{
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: messagebox.alert,
                                message: messagebox.error
                            })
                        }
                        $scope.filterModel = {};
                        defer.resolve('99');
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
            }
            
            $scope.back = function () {
                $scope.filterModel = {}
                if ($scope.getModel != undefined) {
                    defer.resolve('1');
                }
                else {
                    defer.resolve('1');
                }

            }
            function getToday() {
                var today = new Date();
                var mm = today.getMonth() + 1;
                var yyyy = today.getUTCFullYear();
                var dd = today.getDate();

                if (dd < 10) dd = '0' + dd;
                if (mm < 10) mm = '0' + mm;

                return yyyy.toString() + mm.toString() + dd.toString();
            }

            function getTime() {
                var Minute = new Date().getMinutes();
                var Hour = new Date().getHours();

                if (Minute < 10) Minute = '0' + Minute;

                return Hour.toString() + ':' + Minute.toString()
            }

            function formatDate(date) {

                var d = new Date(date),
                    month = '' + (d.getMonth() + 1),
                    day = '' + d.getDate(),
                    year = d.getFullYear();

                if (month.length < 2)
                    month = '0' + month;
                if (day.length < 2)
                    day = '0' + day;

                return [year, month, day].join('');
            }

            function convertDate(param) {
                debugger
                var year = param.substring(0, 4);
                var month = param.substring(4, 6);
                var day = param.substring(6, 8);
                month = parseInt(month) - 1;
                var a = new Date(year, month, day);
                return a;
            }
            function convertDateCheckIn(param) {
                var year = param.substring(0, 4);
                var month = param.substring(4, 6);
                var day = param.substring(6, 8);
                var a = year + '-' + month + '-' + day + 'T00:00:00Z'
                return a;
            }
            function Add(param) {
                debugger
                var deferred = $q.defer();
                viewModel.saveGateCheckin(param).then(
                    function success(results) {
                        deferred.resolve(results);
                    },
                    function error(response) {
                        deferred.resolve(response);
                    }
                );
                return deferred.promise;
            }
            function dateformate(param) {
                var date = param.slice(0, 10).split('-');
                var newdate = date[2] + "/" + date[1] + "/" + date[0];
                return newdate;
            }
            $scope.buttons = {
                add: true,
                update: false,
                back: true
            };

            //API AutoComplete
            $scope.url = {
                Master: webServiceAPI.Master,
            };
            var init = function () {
                $scope.getModel = viewModel.get()

                $scope.userName = localStorageService.get('userTokenStorage');
                $scope.filterModel = {};
                if ($scope.getModel != undefined) {
                    if ($scope.getModel.status == "scanning") {
                        $scope.onShow = true;
                        $vm.onShow($scope.getModel, 'checkedIn');
                    }
                }
            };


            init();
        }
    })
})();