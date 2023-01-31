'use strict'
app.component('configPiecepickItemTableList', {
    controllerAs: '$vm',
    templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
        return "modules/replenishment/configPiecepickItem/component/configPiecepickItemTableList.html";
    },
    bindings: {
        searchResultModel: '=?',
        filterModel: '=?',
        triggerSearch: "=?",
        triggerCreate: '=?',
        isFilter: '=?'
    },
    controller: function ($scope, $filter, $q, $compile, $http, /*ngAuthSettings,*/ $state, /*authService,*/ pageLoading, $window, commonService, localStorageService, dpMessageBox,configPiecepickItemFactory) {
        var $vm = this;
        var XFindItem = $filter('findItemList');
        var Progressbar = pageLoading;
        var viewModel = configPiecepickItemFactory;
        $scope.items = [];
        $scope.items = $scope.items || [];
        // setting column
        $scope.showColumnSetting = false;
        $scope.maxSize = 5;
        
        $vm.triggerCreate = function() {
            if ($scope.onShow) {
                $vm.isFilter = false;
                $scope.onShow().then(function(result) {
                    $vm.isFilter = true;
                    $vm.triggerSearch();
                }).catch(function(error) {
                    defer.reject({ 'Message': error });
                });
            }
        };
        $scope.editItem = function(param) {
            if ($scope.onShow) {
                $vm.isFilter = false;
                $scope.onShow(param).then(function(result) {
                    $vm.isFilter = true;
                    $vm.triggerSearch();
                }).catch(function(error) {
                    defer.reject({ 'Message': error });
                });
            }
        }

        $scope.model = {
            currentPage: 1,
            numPerPage: 30,
            totalRow: 0,
        };

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

        $scope.changePage = function () {
            var page = $vm.filterModel;
            var all = {
                currentPage: 0,
                numPerPage: 0
            };
            if ($vm.filterModel.currentPage != 0) {
                page.currentPage = page.currentPage;
            }
            serchPage(page);
        }
        $scope.changeTableSize = function (perPage,tab) {

            if (tab == 1) {
                $scope.colortab1 = "#0088cc";
                $scope.colortab2 = "#FFFFFF";

                $scope.fronttab1 = "#FFFFFF";
                $scope.fronttab2 = "#0088cc";

            }
            else if (tab == 2) {
                $scope.colortab1 = "#FFFFFF";
                $scope.colortab2 = "#0088cc";

                $scope.fronttab1 = "#0088cc";
                $scope.fronttab2 = "#FFFFFF";
            }

            $scope.selected = tab;

            let ChangeTable = 1;
            
            $scope.model = $vm.filterModel;
            if (perPage != null || perPage != undefined) {
                $scope.model.perPage = perPage;
            }

            var p = $scope.model;

            serchPage(p);
        }

        function serchPage(data) {

            if (data != null) {

                pageLoading.show();
                debugger
                viewModel.filter(data).then(function (res) {
                    pageLoading.hide();
                    if (res.data.length != 0 && res.data.length != undefined) {
                        $vm.filterModel.totalRow = res.data[0].count;
                        $vm.searchResultModel = res.data;

                    }
                    else {
                        if (res.data.pagination != null) {
                            $vm.filterModel.totalRow = res.data.pagination.totalRow;
                            $vm.filterModel.perPage = res.data.pagination.perPage;
                            $vm.filterModel.currentPage = res.data.pagination.currentPage;
                            $vm.searchResultModel = res.data.itemsConfigPiecepickItem;

                        }
                    }
                })
            }
        }

        $scope.delete = function(param) {
            debugger
            var model = param;
            model.log_udf_2 = getToday();
            model.log_udf_3 = getTime();
            model.operations = "Delete";
            param.create_By = $scope.userName;
            if (param.plan_By_Location == 'No') {
                param.plan_By_Location = 0;
                // $scope.filterModel.chkallLocation = false;
            }
            else if (param.plan_By_Location == 'All') {
                param.plan_By_Location = 2;
                // $scope.filterModel.chkallLocation = true;
            }
            else{
                param.plan_By_Location = 1;
            }

            if (param.plan_By_Product == 'No') {
                param.plan_By_Product = 0;
                // $scope.filterModel.chkAllProduct = false;
            }
            else if (param.plan_By_Product == 'All') {
                param.plan_By_Product = 2;
                // $scope.filterModel.chkAllProduct = true;
            }else{
                param.plan_By_Product = 1;
            }

            if (param.isActive == 'InActive') {
                param.isActive = 1;
                // $scope.filterModel.isActive = true;
            }
            else {
                param.isActive = 0;
                // $scope.filterModel.isActive = false;
            }
            dpMessageBox.confirm({
                ok: 'Yes',
                cancel: 'No',
                title: 'แจ้งเตือน',
                message: 'คุณต้องการลบข้อมูลใช่หรือไม่'
            }).then(function success() {
                debugger
                viewModel.getDelete(param).then(function success(res) {
                    debugger
                    model.log_udf_4 = getToday();
                    model.log_udf_5 = getTime();
                    model.operations = model.operations+" : Success";
                    viewModel.savelogsRequest(model).then(function () {
                    });
                    if (res.data == true) {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'แจ้งเตือน',
                            message: 'ลบข้อมูลสำเร็จ'
                        })
                    }
                    $vm.triggerSearch();
                }, function error(res) {});
            });
        };
        // $scope.items = [];
        // $scope.items = $scope.items || [];
        // var viewModel = productTypeFactory;
        // // setting column
        // $scope.showColumnSetting = false;
        // $scope.auto = {
        //     province: {
        //         url: 'domesticLoadingItems/SuggestProvince/',
        //         text: ''
        //     }

        // };

        // $vm.triggerCreate = function () {
        //     if($scope.onShow)
        //     {
        //         $vm.isFilter = false;
        //         $scope.onShow().then(function (result) {
        //             $vm.isFilter = true;
                    
        //         }).catch(function(error) {
        //             defer.reject({ 'Message': error });
        //         });
        //     }
        // };
        // $scope.editItem = function (param) {
        //     if ($scope.onShow) {
        //         $vm.isFilter = false;
        //         $scope.onShow(param).then(function (result) {
        //             $vm.isFilter = true;

        //         }).catch(function (error) {
        //             defer.reject({ 'Message': error });
        //         });
        //     }
        // }

        // var MessageBox = dpMessageBox;
        // $scope.dragHead = '';
        // $scope.dragImageId = "dragtable";
        // $scope.revisionList = {};
        // $scope.handleDrop = function (draggedData, targetElem) {

        //     var swapArrayElements = function (array_object, index_a, index_b) {
        //         var temp = array_object[index_a];
        //         array_object[index_a] = array_object[index_b];
        //         array_object[index_b] = temp;
        //     };
        //     var srcInd = $scope.tblHeader.findIndex(x => x.name === draggedData);
        //     var destInd = $scope.tblHeader.findIndex(x => x.name === targetElem.textContent);
        //     swapArrayElements($scope.tblHeader, srcInd, destInd);
        // };
        // $scope.handleDrag = function (columnName) {
        //     $scope.dragHead = columnName.replace(/["']/g, "");
        // };

        // $scope.show = {
        //     action: true,
        //     pagination: true,
        //     checkBox: false
        // }
        // $scope.pageMode = 'Master';

        // var init = function () {
        //     if ($scope.config.pageMode == "Search") {
        //         $scope.pageMode = "Search";
        //     }
        // }



        // $scope.showColumnSetting = false;
        // var _header = [
        //     { name: "Owner Type Status", show: true },
        //     { name: "Owner Name", show: true },



        // ];

        // $scope.toggleSetting = function () {
        //     $scope.showColumnSetting = $scope.showColumnSetting === false ? true : false;
        // };


        // const _storageName = 'domestic-plantselected-tbl';
        // $scope.column = {
        //     toggleSetting: function () {
        //         $scope.showColumnSetting = $scope.showColumnSetting === false ? true : false;
        //         // if( $scope.showReset = $scope.showReset === false ? true : false){

        //         //     $scope.column.reset();
        //         // }
        //     },
        //     update: function () {
        //         let obj = $scope.tblHeader;
        //         localStorageService.set(_storageName, obj);
        //     },
        //     reset: function () {

        //         $scope.column.getConfig();
        //     },
        //     getConfig: function () {

        //         let config = localStorageService.get(_storageName);

        //         $scope.tblHeader = angular.copy(_header);
        //     }
        // };
        // $scope.$watch('tblHeader', function (n, o) {
        //     if (n) {
        //         localStorageService.set(_storageName, n);
        //     }
        // }, true);

        // function isNumber(n) {
        //     return !isNaN(parseFloat(n)) && isFinite(n);
        // }
        
        // //var viewModel = domesticPlantSelectedFactory.order;

        // //var _viewModel = domesticPlantSelectedFactory.planSelected;

        // $scope.model = {
        //     currentPage: 1,
        //     numPerPage: 30,
        //     totalRow: 0,
        //     advanceSearch: false
        // };

        // $scope.calColor = function (value) {
        //     // if (isNumber(value)) {
        //     //     if (value > 10) return '#C1FDC2';
        //     //     else if (value > 0) return '#FBFDC0';
        //     //     else return '#FF7777';
        //     // }
        //     if (value) {
        //         if (value > 10) return '#C1FDC2';
        //         else if (value > 0) return '#FBFDC0';
        //         else return '#FF7777';
        //     }

        //     return '';
        // };

        // // coload toggle
        // $scope.showCoload = false;
        // $scope.pageOption = [{
        //     'value': 30
        // }, {
        //     'value': 50
        // },
        // {
        //     'value': 100
        // },
        // {
        //     'value': 500
        // },
        // ];      

        // $scope.pagging = {
        //     totalRow: 0,
        //     currentPage: 1,
        //     numPerPage: $vm.filterModel.numPerPage,
        //     num: 1,
        //     maxSize: 2,
        //     perPage: $vm.filterModel.numPerPage,
        //     change: function () {
        //         $vm.filterModel.currentPage = this.currentPage - 1;
        //         if ($vm.triggerSearch) {
        //             $vm.triggerSearch();
        //         }
        //     },
        //     changeSize: function () {
        //         $vm.filterModel.numPerPage = $scope.pagging.perPage
        //         $vm.triggerSearch();
        //     }
        // }

        // $scope.delete = function (param) {
        //     dpMessageBox.confirm({
        //         title: 'InformaTion',
        //         message: 'Do you want to Cancel ?'
        //     }).then(function success() {
        //         viewModel.getDelete(param.productTypeIndex).then(function success(res) {
        //             $vm.triggerSearch();
        //         }, function error(res) { });
        //     });
        // };
        // function validate(param) {
        //     var msg = "";
        //     return msg;
        // }

        // $scope.autoComplete = {
        //     material: 'domesticDeliveryPlan/MaterialCode/',
        //     suggestionTrucktype: 'domesticPlantSelected/SuggestTrucktype/',
        // }



        // var initForm = function () {
        //     $scope.showCoload = true;
        //     $scope.selectedItem = {};
        //     $scope.orderByField = 'orderNo';
        //     $scope.period = {};
        //     $scope.search = {};

        // };
        var init = function () {
            $scope.userName = localStorageService.get('userTokenStorage');
            // $scope.column.getConfig();
            //initForm();
            //loadConfig();
            //$scope.listviewFunc.filter();
            // example data
        };
        init();

    }
});