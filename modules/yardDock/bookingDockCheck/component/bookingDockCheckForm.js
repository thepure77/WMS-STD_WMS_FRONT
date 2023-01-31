(function () {
    'use strict'
    app.component('bookingDockCheckForm', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/yardDock/bookingDockCheck/component/bookingDockCheckForm.html";
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
            var viewModelCheckOut = bookingDockCheckoutFactory;

            $scope.Cancel = true;

            $vm.onShow = function (param, action) {
                defer = $q.defer();
                if ($scope.filterModel != null) {
                    $scope.filterModel = {};
                }
                $scope.onShow = true;
                //Update
                if (param != undefined && action == "checkedIn") {
                    $scope.showCheckIn = true;
                    $scope.filterModel = param
                    if ($scope.filterModel.appointment_Date != null) {
                        var ds = dateformate($scope.filterModel.appointment_Date);
                        $scope.filterModel.appointment_Date = ds;
                        $scope.filterModel.checkIn_Date = getToday();
                        $scope.filterModel.checkIn_Time = getTime();
                    }
                }
                else {
                    viewModelCheckOut.set(param, action)
                    viewModelCheckOut.getAction(param, action)
                    $state.go('wms.booking_dock_checkout_form');
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

            //Add 
            $scope.add = function () {
                var model = $scope.filterModel;
                if (model.checkIn_Date != undefined) {
                    var newdate = convertDateCheckIn(model.checkIn_Date);
                    model.checkIn_Date = newdate;
                }
                var checkLanguage = checkedlang()
                var messagebox = {}
                if (checkLanguage.name == 'TH') {
                    messagebox.text = 'คุณต้องการเช็คอินหรือไม่'
                    messagebox.success = 'เช็คอินเรียบร้อย'
                    messagebox.error = 'ไม่สามารถเช็คอินได้'
                    messagebox.alert = 'แจ้งเตือน'
                }
                else {
                    messagebox.text = 'Do you want to Check In ?'
                    messagebox.success = 'CheckIn success'
                    messagebox.error = 'Checkin error'
                    messagebox.alert = 'Information'
                }

                model.create_By = $scope.userName;
                $scope.validateMsg = "";
                //Validate
                dpMessageBox.confirm({
                    ok: 'Yes',
                    cancel: 'No',
                    title: messagebox.alert,
                    message: messagebox.text
                }).then(function () {
                    pageLoading.show();
                    debugger
                    Add(model).then(function success(res) {
                        pageLoading.hide();
                        debugger
                        if(!res.data.resultIsUse){
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: messagebox.alert,
                                message: res.data.resultMsg
                            })
                        }
                        else{
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: messagebox.alert,
                                message: messagebox.success
                            })
                        }
                       
                        $scope.filterModel = {};
                        defer.resolve('1');

                    }, function error(param) {
                        dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: messagebox.alert,
                                message: messagebox.error
                            }
                        )
                    });
                });
            }
            $scope.back = function () {
                $scope.filterModel = {}
                if ($scope.getModel != undefined) {
                    $state.go('wms.bk_dock_check');
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
                var deferred = $q.defer();
                viewModel.saveCheckin(param).then(
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