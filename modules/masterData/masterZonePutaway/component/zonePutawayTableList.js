'use strict'
app.component('zonePutawayTableList', {
    controllerAs: '$vm',
    templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
        return "modules/masterData/masterZonePutaway/component/zonePutawayTableList.html";
    },
    bindings: {
        searchResultModel: '=?',
        filterModel: '=?',
        triggerSearch: "=?",
        triggerCreate: '=?',
        isFilter: '=?'
    },
    controller: function ($scope, $filter, $q, $compile, $http, /*ngAuthSettings,*/ $state, /*authService,*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox,zonePutawayFactory) {
        var $vm = this;
        var XFindItem = $filter('findItemList');
        var Progressbar = pageLoading;
        // $scope.items = [];
        // $scope.items = $scope.items || [];
        var viewModel = zonePutawayFactory;

        $scope.items = [];
        $scope.items = $scope.items || [];
        // setting column
        $scope.showColumnSetting = false;
        $scope.maxSize = 5;
        
        $vm.triggerCreate = function () {
            if ($scope.onShow) {
                $vm.isFilter = false;
                $scope.onShow().then(function (result) {
                    $vm.isFilter = true;
                    $vm.triggerSearch();
                }).catch(function (error) {
                    defer.reject({ 'Message': error });
                });
            }
        };
        $scope.editItem = function (param) {
            if ($scope.onShow) {
                $vm.isFilter = false;
                $scope.onShow(param).then(function (result) {
                    $vm.isFilter = true;
                    $vm.triggerSearch();
                }).catch(function (error) {
                    defer.reject({ 'Message': error });
                });
            }
        }

        $scope.model = {
            currentPage: 1,
            numPerPage: 30,
            totalRow: 0,
        };

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
            debugger
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
                            $vm.searchResultModel = res.data.itemsZonePutaway;

                        }
                    }
                })
            }
        }
      
        $scope.delete = function (param) {
            dpMessageBox.confirm({
                ok: 'Yes',
                cancel: 'No',
                title: 'แจ้งเตือน',
                message: 'คุณต้องการลบข้อมูลใช่หรือไม่'
            }).then(function success() {
                viewModel.getDelete(param).then(function success(res) {
                    if (res.data == true) {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'แจ้งเตือน',
                            message: 'ลบข้อมูลสำเร็จ'
                        })
                    }
                    $vm.triggerSearch();
                }, function error(res) { });
            });
        };

        var init = function () {
            // $scope.filterModel = {};
        };
        init();

        // $scope.showColumnSetting = false;


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
        //         $scope.onShow(param.zoneIndex).then(function (result) {
        //             $vm.isFilter = true;

        //         }).catch(function (error) {
        //             defer.reject({ 'Message': error });
        //         });
        //     }
        // }


        // var MessageBox = dpMessageBox;

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

        // $scope.toggleSetting = function () {
        //     $scope.showColumnSetting = $scope.showColumnSetting === false ? true : false;
        // };

        // $scope.$watch('tblHeader', function (n, o) {
        //     if (n) {
        //         localStorageService.set(_storageName, n);
        //     }
        // }, true);

        // function isNumber(n) {
        //     return !isNaN(parseFloat(n)) && isFinite(n);
        // }
        


        // $scope.model = {
        //     currentPage: 1,
        //     numPerPage: 30,
        //     totalRow: 0,
        //     advanceSearch: false
        // };

        // $scope.calColor = function (value) {
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
        //         ok: 'Yes',
        //         cancel: 'No',
        //         title: 'InformaTion',
        //         message: 'Do you want to Cancel ?'
        //     }).then(function success() {
        //         viewModel.getDelete(param.zoneIndex).then(function success(res) {
        //             $vm.triggerSearch();
        //         }, function error(res) { });
        //     });
        // };

        // function validate(param) {
        //     var msg = "";
        //     return msg;
        // }
        // var initForm = function () {
        // };
        // var init = function () {

        // };
        // init();

    }
});