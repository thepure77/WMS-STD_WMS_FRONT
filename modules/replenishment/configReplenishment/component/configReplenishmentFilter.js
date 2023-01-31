
(function () {
    'use strict';
    app.component('configReplenishmentFilter', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/replenishment/configReplenishment/component/configReplenishmentFilter.html";
        },
        bindings: {
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?'
        },
        controller: function ($scope, $q, $http, $filter, $state, $window, $element, $timeout, $translate, /*ngAuthSettings,*/ pageLoading, commonService, replenishmentFactory, webServiceAPI) {
            var $vm = this;

            // ----------------------------------------------------
            // This default object
            var viewModel = replenishmentFactory;


            $scope.filterModel = {};
            $vm.filterModel = {
                currentPage: 1,
                PerPage: 50,
                totalRow: 0,
            };

            $scope.dropdownActive = [
                { model: "None", value: null },
                { model: "Active", value: 1 },
                { model: "InActive", value: 0 }
            ];


            $scope.DropdownDay = [
                { model: "None", value: null },
                { model: "Include", value: true },
                { model: "Exclude", value: false }
            ];


            $scope.filterModel.isMonday = null;
            $scope.filterModel.isTuesday = null;
            $scope.filterModel.isWednesday = null;
            $scope.filterModel.isThursday = null;
            $scope.filterModel.isFriday = null;
            $scope.filterModel.isSaturday = null;
            $scope.filterModel.isSunday = null;

            $scope.header = {
                advanceSearch: false
            };
            $scope.hide = function () {
                $scope.header.advanceSearch = $scope.header.advanceSearch === false ? true : false;
                $scope.header.advanceSearch = $scope.header.advanceSearch;
            };
            $scope.searchFilter = function (param) {
                var models = $scope.filterModel;
                models.PerPage = $vm.filterModel.PerPage;
                models.currentPage = $vm.filterModel.currentPage;
                pageLoading.show();

                if (models.planPeriod != null && models.planPeriod != undefined && models.planPeriod != "") {
                    convertDate(models.planPeriod, 'planPeriod');
                }

                if ($scope.header.advanceSearch) {
                    if (models.planPeriod2 != null && models.planPeriod2 != undefined && models.planPeriod2 != "") {
                        convertDate(models.planPeriod2, 'planPeriod');
                    }
                    if (models.Create_Date_txt != null && models.Create_Date_txt != undefined && models.planPeriod2 != "") {
                        convertDate(models.Create_Date_txt, 'Create_Date_txt');
                    }
                }


                viewModel.filter(models).then(function (res) {
                    pageLoading.hide();
                    if (res.data.replenishmentViewModels.length != 0) {
                        $scope.filterModel.perPage = $vm.filterModel.PerPage;
                        $vm.filterModel.totalRow = res.data.pagination.totalRow;
                        $vm.filterModel.currentPage = res.data.pagination.currentPage;
                        if (res.paginations != null || res.paginations != undefined) {
                            $vm.filterModel.totalRow = paginations.totalRow;
                        }
                        $vm.searchResultModel = res.data.replenishmentViewModels;
                        angular.forEach($vm.searchResultModel, function (value, key) {
                            if (value.isActive == 1) {
                                value.isActive = "Active";
                            }
                            else {
                                value.isActive = "InActive";
                            }
                            if (value.plan_By_Product == 0) {
                                value.plan_By_Product = "No"
                            }
                            else if (value.plan_By_Product == 1) {
                                value.plan_By_Product = "Yes"
                            }
                            else {
                                value.plan_By_Product = "All"
                            }

                            if (value.plan_By_Location == 0) {
                                value.plan_By_Location = "No"
                            }
                            else if (value.plan_By_Location == 1) {
                                value.plan_By_Location = "Yes"
                            }
                            else {
                                value.plan_By_Location = "All"
                            }

                        });
                    }
                    else {
                        $vm.searchResultModel = res.data.replenishmentViewModels;
                        angular.forEach($vm.searchResultModel, function (value, key) {
                            if (value.isActive == 1) {
                                value.isActive = "Active";
                            }
                            else {
                                value.isActive = "InActive";
                            }
                            if (value.plan_By_Product == 0) {
                                value.plan_By_Product = "No"
                            }
                            else if (value.plan_By_Product == 1) {
                                value.plan_By_Product = "Yes"
                            }
                            else {
                                value.plan_By_Product = "All"
                            }

                            if (value.plan_By_Location == 0) {
                                value.plan_By_Location = "No"
                            }
                            else if (value.plan_By_Location == 1) {
                                value.plan_By_Location = "Yes"
                            }
                            else {
                                value.plan_By_Location = "All"
                            }

                        });
                    }

                });
            };

            $scope.selectSort = [
                {
                    value: "Replenishment_Id",
                    display: "ใบจัดส่งสินค้า (เลข plan)	"
                },
                {
                    value: "Create_Date",
                    display: "วันที่ใบจัดส่งสินค้า	"
                },
                {
                    value: "Create_Date",
                    display: "วันที่สร้างเอกสาร	"
                }
            ];

            $scope.status = [
                {
                    value: 0,
                    display: "InActive"
                },
                {
                    value: 1,
                    display: "Active"
                }
            ];
            
            $scope.dateformat = function (param) {
                $("input").on("change", function () {
                    this.setAttribute(
                        "data-date",
                        moment(this.value, "YYYY-MM-DD")
                            .format(this.getAttribute("data-date-format"))
                    )
                }).trigger("change")
            }
            function convertDate(date, dateType) {
                var res = date.split(" - ");
                if (res.length == 2) {

                    var day = res[0].substring(0, 2);
                    var month = res[0].substring(3, 5);
                    var year = res[0].substring(6, 10);

                    var day1 = res[1].substring(0, 2);
                    var month1 = res[1].substring(3, 5);
                    var year1 = res[1].substring(6, 10);

                    if (dateType == "planPeriod") {
                        $scope.filterModel.trigger_Date = year + "-" + month + "-" + day; ///""'de;
                        $scope.filterModel.trigger_Date_End = year1 + "-" + month1 + "-" + day1;
                    }
                    else{
                        $scope.filterModel.create_Date = year + "-" + month + "-" + day; ///""'de;
                        $scope.filterModel.create_Date_End = year1 + "-" + month1 + "-" + day1;
                    } 
                }
                else {
                    var year = res[0].substring(0, 4);
                    var month = res[0].substring(4, 6);
                    var day = res[0].substring(6, 8);

                    if (dateType == "Create_Date_txt") {
                        $scope.filterModel.create_Date = year + "-" + month + "-" + day;
                    }
                    else {
                        $scope.filterModel.trigger_Date = year + "-" + month + "-" + day;
                    }
                }


                // var day1 = res[0].substring(0, 2);
                // var month1 = res[0].substring(3, 5);
                // var year1 = res[0].substring(6, 10);

                // var de = new Date(year1, month1, day1);
                // if (dateType == "Create_Date_txt") {
                //     $scope.filterModel.Create_Date_End =   year1+"-"+ month1+"-"+  day1 ; ///""'de;
                // } else {
                //     $scope.filterModel.Trigger_Date_End =  year1+"-"+ month1+"-"+  day1 ;
                // }
            }

            $vm.triggerSearch = function () {

                $vm.filterModel = $vm.filterModel || {};
                pageLoading.show();
                viewModel.filter($vm.filterModel).then(function (res) {
                    pageLoading.hide();
                    $scope.filterModel.planPeriod = null;
                    if (res.data.replenishmentViewModels.length != 0) {
                        $scope.filterModel.perPage = $vm.filterModel.PerPage;
                        $vm.filterModel.totalRow = res.data.pagination.totalRow;
                        $vm.filterModel.currentPage = res.data.pagination.currentPage;
                        if (res.paginations != null || res.paginations != undefined) {
                            $vm.filterModel.totalRow = paginations.totalRow;
                        }
                        $vm.searchResultModel = res.data.replenishmentViewModels;
                    }
                    else {
                        $vm.searchResultModel = res.data.replenishmentViewModels;
                    }

                    if ($vm.searchResultModel != undefined || $vm.searchResultModel != null) {
                        // convert Int to Text
                        angular.forEach($vm.searchResultModel, function (value, key) {
                            if (value.isActive == 1) {
                                value.isActive = "Active";
                            }
                            else {
                                value.isActive = "InActive";
                            }
                            if (value.plan_By_Product == 0) {
                                value.plan_By_Product = "No"
                            }
                            else if (value.plan_By_Product == 1) {
                                value.plan_By_Product = "Yes"
                            }
                            else {
                                value.plan_By_Product = "All"
                            }

                            if (value.plan_By_Location == 0) {
                                value.plan_By_Location = "No"
                            }
                            else if (value.plan_By_Location == 1) {
                                value.plan_By_Location = "Yes"
                            }
                            else {
                                value.plan_By_Location = "All"
                            }

                        });
                    }
                });
            };

            $scope.getSearchParams = function () {
                return angular.copy($vm.filterModel);
            };

            $scope.url = {
                Master: webServiceAPI.Master,
            };
            $scope.autoComplete = {
                replenishment_Id: "autoEquipment/autoSearchEquipmentFilter"
            };

            $scope.clearSearch = function () {
                $scope.filterModel = {};
                $scope.searchFilter();
            }

            // ----------------------------------------------------
            // This local function
            $vm.setDateFormate = function (v) {
                try {
                    return $filter("dateFormate")(v);
                } catch (e) {
                    return "-";
                }
            }
            function getTime() {
                var Minute = new Date().getMinutes();
                var Hour = new Date().getHours();
                if (Minute < 10) Minute = '0' + Minute;

                return Hour.toString() + ':' + Minute.toString()
            }
            function initialize() {

                $scope.filterModel = {};
                /*      $scope.filterModel.planPeriod = null;
                     $scope.filterModel.Create_Date_txt = null;
                     $scope.filterModel.planPeriod2 = null; */
                /* 
                $scope.filterModel.planPeriod = null;
                $scope.filterModel.Create_Date_txt = null; */
                // $scope.filterModel.trigger_Time = getTime();
                // $scope.filterModel.trigger_Time_End = getTime();
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