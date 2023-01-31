'use strict'
app.component('tranferTableList', {
    controllerAs: '$vm',
    templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
        return "modules/Tranfer/Tranfer/component/tranferTableList.html";
    },
    bindings: {
        isLoading: '=?',
        searchResultModel: '=?',
        filterModel: '=?',
        triggerSearch: "=?",
        triggerCreate: '=?',
        isFilter: '=?'
    },
    controller: function ($scope, $filter, $q, $compile, $http, /*ngAuthSettings,*/ $state, /*authService,*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, goodIssueFactory) {
        var $vm = this;
        var XFindItem = $filter('findItemList');
        var Progressbar = pageLoading;
        $scope.items = [];
        $scope.items = $scope.items || [];
        var viewModel = goodIssueFactory;
        // setting column
        $scope.showColumnSetting = false;

        $vm.$onInit = function () {
            $scope.pagging = {
                totalRow: 0,
                currentPage: 1,
                numPerPage: $vm.filterModel.numPerPage,
                num: 1,
                maxSize: 2,
                perPage: 20,
                change: function () {
                    $vm.filterModel.currentPage = this.currentPage - 1;
                    if ($vm.triggerSearch) {
                        //$vm.triggerSearch();
                    }
                },
                changeSize: function () {
                    $vm.filterModel.numPerPage = $scope.pagging.perPage
                    //$vm.triggerSearch();
                }
            }
        }

        $vm.triggerCreate = function () {
            if ($scope.onShow) {
                $vm.isFilter = false;
                $scope.onShow().then(function (result) {
                    $vm.isFilter = true;

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
                }).catch(function (error) {
                    defer.reject({ 'Message': error });
                });
            }
        }


        var MessageBox = dpMessageBox;
        $scope.dragHead = '';
        $scope.dragImageId = "dragtable";
        $scope.revisionList = {};
        $scope.handleDrop = function (draggedData, targetElem) {

            var swapArrayElements = function (array_object, index_a, index_b) {
                var temp = array_object[index_a];
                array_object[index_a] = array_object[index_b];
                array_object[index_b] = temp;
            };
            var srcInd = $scope.tblHeader.findIndex(x => x.name === draggedData);
            var destInd = $scope.tblHeader.findIndex(x => x.name === targetElem.textContent);
            swapArrayElements($scope.tblHeader, srcInd, destInd);
        };
        $scope.handleDrag = function (columnName) {
            $scope.dragHead = columnName.replace(/["']/g, "");
        };

        $scope.show = {
            action: true,
            pagination: true,
            checkBox: false
        }
        $scope.pageMode = 'Master';

        var init = function () {
            if ($scope.config.pageMode == "Search") {
                $scope.pageMode = "Search";
            }
        }



        $scope.showColumnSetting = false;
        var _header = [
            { name: "Owner Type Status", show: true },
            { name: "Owner Name", show: true },



        ];

        $scope.toggleSetting = function () {
            $scope.showColumnSetting = $scope.showColumnSetting === false ? true : false;
        };


        const _storageName = 'domestic-plantselected-tbl';
        $scope.column = {
            toggleSetting: function () {
                $scope.showColumnSetting = $scope.showColumnSetting === false ? true : false;
                // if( $scope.showReset = $scope.showReset === false ? true : false){

                //     $scope.column.reset();
                // }
            },
            update: function () {
                let obj = $scope.tblHeader;
                localStorageService.set(_storageName, obj);
            },
            reset: function () {

                $scope.column.getConfig();
            },
            getConfig: function () {

                let config = localStorageService.get(_storageName);

                $scope.tblHeader = angular.copy(_header);
            }
        };
        $scope.$watch('tblHeader', function (n, o) {
            if (n) {
                localStorageService.set(_storageName, n);
            }
        }, true);

        function isNumber(n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        }


        $scope.model = {
            currentPage: 1,
            numPerPage: 30,
            totalRow: 0,
            advanceSearch: false
        };

        $scope.calColor = function (value) {
            // if (isNumber(value)) {
            //     if (value > 10) return '#C1FDC2';
            //     else if (value > 0) return '#FBFDC0';
            //     else return '#FF7777';
            // }
            if (value) {
                if (value > 10) return '#C1FDC2';
                else if (value > 0) return '#FBFDC0';
                else return '#FF7777';
            }

            return '';
        };

        // coload toggle
        $scope.showCoload = false;
        $scope.pageOption = [{
            'value': 30
        }, {
            'value': 50
        },
        {
            'value': 100
        },
        {
            'value': 500
        },
        ];



        $scope.delete = function (param) {

            dpMessageBox.confirm({
                title: 'InformaTion',
                message: 'Do you want to Cancel ?'
            }).then(function success() {
                viewModel.getDelete(param.goodsReceiveIndex).then(function success(res) {
                    $vm.triggerSearch();
                }, function error(res) { });
            });
        };

        $scope.GoodsReceiveConfirm = function (param) {
            
            dpMessageBox.confirm({
                ok: 'Yes',
                cancel: 'No',
                title: 'InformaTion',
                message: 'Do you want to Confirm ?'
            }).then(function success() {                
                viewModel.GoodsReceiveConfirm(param).then(function success(res) {
                    
                }, function error(res) { });
            });
        };

        // $scope.GoodsReceiveConfirm = function (index) {
        //     var model = index;
        //     dpMessageBox.confirm({
        //         ok: 'Yes',
        //         cancel: 'No',
        //         title: 'Confirm ?',
        //         message: 'Do you want to Confirm !'
        //     }).then(function () {
        //         Confirm(model).then(function success(res) {
        //             // $vm.filterModel = res.config.data;
        //             $vm.searchResultModel = res.config.data;
        //             
        //         }, function error(param) {
        //             dpMessageBox.alert(param).then(function (param) { }, function (param) { });
        //         });
        //     });
        // }

        // function Confirm(param) {
        //     var deferred = $q.defer();
        //     viewModel.GoodsReceiveConfirm(param).then(
        //         function success(results) {
        //             
        //             deferred.resolve(results);
        //         },
        //         function error(response) {
        //             deferred.reject(response);
        //         }
        //     );
        //     return deferred.promise;
        // }
        function validate(param) {
            var msg = "";
            return msg;
        }

        function validate(param) {
            var msg = "";
            return msg;
        }

        $scope.autoComplete = {
            material: 'domesticDeliveryPlan/MaterialCode/',
            suggestionTrucktype: 'domesticPlantSelected/SuggestTrucktype/',
        }

        var initForm = function () {
        };
        var init = function () {
            $scope.column.getConfig();
            //initForm();
            //loadConfig();
            //$scope.listviewFunc.filter();
            // example data
        };
        init();

    }
});