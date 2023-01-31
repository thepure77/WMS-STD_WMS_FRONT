'use strict'
app.component('chute', {
    controllerAs: '$vm',
    templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
        return "modules/RollCage/Chute/Chute.html";

    },
    bindings: {
        isLoading: '=?',
        searchResultModel: '=?',
        filterModel: '=?',
        triggerSearch: "=?",
        triggerCreate: '=?',
        isFilter: '=?',
        searchDataRow: '=?'
    },
    controller: function ($scope, $filter, $q, $compile, $http, /*ngAuthSettings,*/ $state, /*authService,*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, chuteFactory, webServiceAPI, logsFactory) {
        var $vm = this;
        var XFindItem = $filter('findItemList');
        var Progressbar = pageLoading;
        $scope.items = $scope.items || [];
        var viewModel = chuteFactory;
        var item = $vm.searchResultModel;
        $scope.showColumnSetting = false;
        $scope.maxSize = 5;
        $scope.filterModel = {};








        var MessageBox = dpMessageBox;
        function getToday() {
            var today = new Date();

            var mm = today.getMonth() + 1;
            var yyyy = today.getUTCFullYear();
            var dd = today.getDate();


            if (dd < 10) dd = '0' + dd;
            if (mm < 10) mm = '0' + mm;

            return yyyy.toString() + mm.toString() + dd.toString();
        }

        function validate(param) {
            var msg = "";
            return msg;
        }

        $scope.LoginChute = function () {
            if($scope.dropdownchute.model != undefined)
            {
                $window.localStorage['isChute'] =  JSON.stringify($scope.dropdownchute.model);
                dpMessageBox.alert({
                    ok: 'Close',
                    title: 'แจ้งเตือน',
                    message: "Login"
                })
            } 
            else{
                dpMessageBox.alert({
                    ok: 'Close',
                    title: 'แจ้งเตือน',
                    message: "โปรดเลือก Chute "
                })
            }
        };

        $scope.CancelChute = function () {
            var Cancel = {};
            $window.localStorage['isChute'] =  JSON.stringify(Cancel);
            dpMessageBox.alert({
                ok: 'Close',
                title: 'แจ้งเตือน',
                message: "Logout"
            })
        };


        $scope.dropdownchute = function () {
            viewModel.dropdownchute($scope.filterModel).then(function (res) {
                $scope.dropdownchute = res.data;

                if ($scope.isChute != null) {

                    var dropdownchute = $scope.dropdownchute
                    const resultschute = dropdownchute.filter((dropdownchute) => {
                        return dropdownchute.chute_Index == $scope.isChute.chute_Index;
                    })
                    $scope.dropdownchute.model = resultschute[0];

                }
            });
        };

        var init = function () {
            
            $scope.dropdownchute();
            $scope.userName = localStorageService.get('userTokenStorage');
            //$scope.isChute = JSON.parse(localStorage.isChute);
            $scope.isChute = angular.fromJson($window.localStorage['isChute']);
        };
        init();

    }
});