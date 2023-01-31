'use strict'
app.component('masterGridPageTableList', {
    controllerAs: '$vm',
    templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
        return "modules/masterData/masterGridPage/component/gridPageTableList.html";
    },
    bindings: {
        searchResultModel: '=?',
        filterModel: '=?',
        triggerSearch: "=?",
        triggerCreate: '=?',
        isFilter: '=?'
    },
    controller: function ($scope, $filter, $q, $compile, $http, /*ngAuthSettings,*/ $state, /*authService,*/ pageLoading, $window, commonService, localStorageService, $timeout, dpMessageBox,gridPageFactory) {
        var $vm = this;
        var XFindItem = $filter('findItemList');
        var Progressbar = pageLoading;
        $scope.items = [];
        $scope.items = $scope.items || [];
        let viewModel = gridPageFactory;
        $vm.triggerCreate = function () {
            
            if($scope.onShow)
            {
                $vm.isFilter = false;
                $scope.onShow().then(function (result) {
                    $vm.isFilter = true;
                    
                }).catch(function(error) {
                    defer.reject({ 'Message': error });
                });
            }
        };
        $scope.editItem = function (param) {
            if ($scope.onShow) {
                $vm.isFilter = false;                
                $scope.onShow(param.documentTypeIndex).then(function (result) {
                    $vm.isFilter = true;

                }).catch(function (error) {
                    defer.reject({ 'Message': error });
                });
            }
        }
        $scope.show = {
            action: true,
            pagination: true,
            checkBox: false
        }
        
        $scope.model = {
            currentPage: 1,
            numPerPage: 30,
            totalRow: 0,
            advanceSearch: false
        };
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

        $scope.pagging = {
            totalRow: 0,
            currentPage: 1,
            numPerPage: $vm.filterModel.numPerPage,
            num: 1,
            maxSize: 2,
            perPage: $vm.filterModel.numPerPage,
            change: function () {
                $vm.filterModel.currentPage = this.currentPage - 1;
                if ($vm.triggerSearch) {
                    $vm.triggerSearch();
                }
            },
            changeSize: function () {
                $vm.filterModel.numPerPage = $scope.pagging.perPage
                $vm.triggerSearch();
            }
        }

        $scope.delete = function (param) {
            dpMessageBox.confirm({
                ok:'Yes',
                cancel:'No',
                title: 'InformaTion',
                message: 'Do you want to Cancel ?'
            }).then(function success() {
                viewModel.getDelete(param.documentTypeIndex).then(function success(res) {
                    $vm.triggerSearch();
                }, function error(res) { });
            });
        };
        
        var init = function () {
            $scope.filterModel = {};
        };

        init();

    }
});