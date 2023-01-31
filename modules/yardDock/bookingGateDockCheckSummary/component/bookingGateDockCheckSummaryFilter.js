(function () {
    'use strict';
    app.component('bookingGateDockCheckSummaryFilter', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/yardDock/bookingGateDockCheckSummary/component/bookingGateDockCheckSummaryFilter.html";
        },
        bindings: {
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?'
        },
        controller: function ($scope, $q, $http, $filter, $state, $window, $element, $timeout, $translate, /*ngAuthSettings,*/ pageLoading, dpMessageBox, bookingGateDockCheckSummaryFactory, bkYardDockFactory, webServiceAPI) {
            var $vm = this;

            // ----------------------------------------------------
            // This default object
            var viewModel = bookingGateDockCheckSummaryFactory;
            $scope.filterModel = {};
            $vm.filterModel = {
                currentPage: 1,
                PerPage: 50,
                totalRow: 0,
            };

            $scope.clearFilter = function () {
                $scope.filterModel = {};
                $scope.searchFilter();
            }
            $scope.hide = function () {
                $scope.header.advanceSearch = $scope.header.advanceSearch === false ? true : false;
                $scope.header.advanceSearch = $scope.header.advanceSearch;
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

            $scope.searchFilter = function (param) {
                $scope.filterModel = param;
                if ($scope.filterModel.datePeriod != undefined) {
                    dateformate($scope.filterModel.datePeriod);
                }
                var checkLanguage = checkedlang()
                var messagebox = {}

                if (checkLanguage.name == 'TH') {
                    messagebox.text = 'เลขที่ Appointment ต้องไม่เป็นค่าว่าง';
                     messagebox.alert = 'แจ้งเตือน';
                      messagebox.error = 'เกิดข้อผิดพลาด'
                }
                else {
                    messagebox.text = 'Apoointment No is required !';
                    messagebox.alert = 'Information';
                    messagebox.error = 'Error'
                }
                pageLoading.show();
                viewModel.filter($scope.filterModel).then(function success(res) {
                        $vm.searchResultModel = res.data;
                        
                    
                }, function error(param) {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: messagebox.error,
                            message: param.Message.Message
                        }
                    )
                });
            };
            $scope.filter = function () {
                $vm.triggerSearch();
            };

            $vm.triggerSearch = function () {
                $vm.filterModel = $vm.filterModel || {};
                pageLoading.show();
                viewModel.filter($vm.filterModel).then(function (res) {
                    pageLoading.hide();
                    if (res.data.length != 0) {

                        $vm.searchResultModel = res.data;
                        
                        $scope.activityTypes();
                    }
                });
            };

            function groupBy(list, keyGetter) {
                const map = new Map();
                list.forEach((item) => {
                    const key = keyGetter(item);
                    const collection = map.get(key);
                    if (!collection) {
                        map.set(key, [item]);
                    } else {
                        collection.push(item);
                    }
                });
                return map;
            }

            function convertDate(param) {
                var year = param.substring(0, 4);
                var month = param.substring(4, 6);
                var day = param.substring(6, 8);
                month = parseInt(month) - 1;
                var a = new Date(year, month, day);
                return a;
            }
            function convertDateFilter(param) {
                var year = param.substring(0, 4);
                var month = param.substring(4, 6);
                var day = param.substring(6, 8);
                var a = year + '-' + month + '-' + day + 'T00:00:00Z'
                return a;
            }

            function convertDateFilterEnd(param) {
                var year = param.substring(0, 4);
                var month = param.substring(4, 6);
                var day = param.substring(6, 8);
                var a = year + '-' + month + '-' + day + 'T23:59:59Z'
                return a;
            }
            function dateformate(param) {
                var date = param.split(' - ');
                var array1 = date[0].split('/');
                var ds = array1[2] + array1[1] + array1[0]
                $scope.filterModel.appointment_Date = convertDateFilter(ds);
                var array2 = date[1].split('/');
                var de = array2[2] + array2[1] + array2[0]
                $scope.filterModel.appointment_Date_To = convertDateFilterEnd(de);
            }

            $scope.getSearchParams = function () {
                return angular.copy($vm.filterModel);
            };

            $scope.url = {
                Master: webServiceAPI.Master,
            };

            $scope.selectSort = [
                {
                    value: "PlanGoodsReceive_No",
                    display: "ท่ารับสินค้า"
                },
                {
                    value: "PlanGoodsReceive_Date",
                    display: "คลัง"
                },
                {
                    value: "DocumentType_Name",
                    display: "เลขที่ Appointment"
                },
                {
                    value: "ProcessStatus_Name",
                    display: "เลขที่เอกสาร"
                },
                {
                    value: "Create_By",
                    display: "กิจกรรม"
                },
                {
                    value: "Create_By",
                    display: "บรืษัท"
                },
                {
                    value: "Create_By",
                    display: "สถานะ"
                }
            ];

            
            $scope.status = [
                {
                    value: "0",
                    display: "เช็คอิน"
                },
                {
                    value: "1",
                    display: "เช็คเอ้า"
                }
            ];
            // ----------------------------------------------------
            // This local function
            $vm.setDateFormate = function (v) {
                try {
                    return $filter("dateFormate")(v);
                } catch (e) {
                    return "-";
                }
            }
            $scope.activityTypes = function () {
                var criteria = {};
                var viewModelDock = bkYardDockFactory;
                viewModelDock.activityType(criteria).then(function success(res) {
                    $scope.activityModel = res.data;
                    $scope.activityModel.forEach(c => {
                        c.documentType_Name = c.documentType_Name
                    });

                    angular.forEach($vm.searchResultModel, function (value, key) {
                        if (value.documentType_Index != undefined) {
                            const _documenttype = $scope.activityModel.filter(elem => elem.documentType_Index == value.documentType_Index);
                            if (_documenttype.length > 0) {
                                value.documentType_Name = _documenttype[0].documentType_Name;
                            }
                        }

                    })
                }, function error(res) {

                });


            }

            function initialize() {
            };

            this.$onInit = function () {
                initialize();
            };

            this.$onDestroy = function () {
            };

            $scope.$on('$destroy', function () {
                $vm.$onDestroy();
            });
        }
    });

})();