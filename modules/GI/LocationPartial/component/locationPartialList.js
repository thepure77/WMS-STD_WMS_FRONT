'use strict'
app.component('locationPartialList', {
    controllerAs: '$vm',
    templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
        return "modules/GI/LocationPartial/component/locationPartialList.html";
    },
    bindings: {
        isLoading: '=?',
        searchResultModel: '=?',
        filterModel: '=?',
        triggerSearch: "=?",
        triggerCreate: '=?',
        isFilter: '=?',
        searchDataLocation: '=?',
        filterModelLo: '=?',

    },
    controller: function ($scope, $filter, $q, $compile, $http, /*ngAuthSettings,*/ $state, /*authService,*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, locationPartialFactory) {
        var $vm = this;
        $scope.maxSize = 5;
        $scope.filterModel = {};
        $vm.isShow = false
        var viewModel = locationPartialFactory;

        $scope.show = {
            action: true,
            pagination: true,
            checkBox: false
        }

        $scope.model = {
            totalRow: 0
        }
        $scope.checkbox = {
            Show: true
        };


        $scope.detectCheckAll = function () {
            debugger
            if ($scope.checkAll === true) {
                for (var c = 0; c <= $vm.searchResultModel.checklocation_PPmodel.length; c++) {
                    if ($vm.searchResultModel.checklocation_PPmodel[c].tag_No != null) {
                        $vm.searchResultModel.checklocation_PPmodel[c].selected = true;
                        $scope.hide(c);
                    }

                }
            } else {
                for (var c = 0; c <= $vm.searchResultModel.checklocation_PPmodel.length - 1; c++) {
                    if ($vm.searchResultModel.checklocation_PPmodel[c].tag_No != null) {
                        $vm.searchResultModel.checklocation_PPmodel[c].selected = false;
                        $scope.hide(c);
                    }
                }
            }
        }

        $scope.hide = function (param) {

            var setHideButton = false;
            for (var c = 0; c <= $vm.searchResultModel.checklocation_PPmodel.length - 1; c++) {
                if (!setHideButton) {

                    if ($vm.searchResultModel.checklocation_PPmodel[c].selected == true) {
                        setHideButton = true;
                    }

                }
            }
            $scope.checkbox.Show = (setHideButton == true) ? false : true;
        };

        

        var init = function () {
            $scope.userName = localStorageService.get('userTokenStorage');
        };
        init();

    }
});