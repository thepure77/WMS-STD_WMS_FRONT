app.component("reworkPalletInspection", {
    controllerAs: '$vm',
    templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
        return "modules/GR/reworkPalletInspection/reworkPalletInspection.html";

    },
    bindings: {
        isLoading: '=?',
        onShow: '=?',
        searchResultModel: '=?',
        filterModel: '=?',
        triggerSearch: '=?',
        triggerCreate: '=?',
        isFilter: '=?',
    },
    controller: function ($scope, $q, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, dpMessageBox,reworkPalletInspectionFactory) {
        var $vm = this;
        var defer = {};
        $scope.filterModel = {};
        var viewModel = reworkPalletInspectionFactory;
        
        $vm.isFilterTable = true;
        $scope.onShow = false;
        $scope.TaskModel = {};
        $scope.disabled = 0;
        // var _viewModel = locationFactory;
        $vm.$onInit = function () {
            $scope.userName = localStorageService.get('userTokenStorage');
            $scope.filterModel.isCheckPass = false;
            // document.getElementById("lpnNo").focus();
        }
        $scope.filterModel = {
            isSku: false
        };

        $scope.ScanReworkTag = function () {
            $scope.filterModel = $scope.filterModel || {};
            $scope.log_udf_2 =getToday();
            $scope.log_udf_3 =getTime();

            pageLoading.show();
            viewModel.checkReworkTag($scope.filterModel).then(function success(res) {
                pageLoading.hide();
                if (res.data.status == 10) {
                    $scope.filterModel.isCheckPass = true;
                }
                else {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'แจ้งเตือน',
                        message: res.data.message.description
                    })
                    $scope.filterModel.palletID = "";
                    $scope.filterModel.isCheckPass = false;
                    document.getElementById("lpnNo").focus();
                }
            },
            function error(res) {

            });
        }

        $scope.confirm = function () {
            $scope.filterModel = $scope.filterModel || {};
            $scope.filterModel.log_udf_2 =$scope.log_udf_2 ;
            $scope.filterModel.log_udf_3 =$scope.log_udf_3;
            $scope.filterModel.log_udf_4 =getToday();
            $scope.filterModel.log_udf_5 =getTime();
            $scope.filterModel.operations = "Rework Pallet Inspection "+ $scope.filterModel.palletID + " ";

            pageLoading.show();
            viewModel.createReworkTag($scope.filterModel).then(function success(res) {
                pageLoading.hide();
                if (res.data.status == 10) {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'แจ้งเตือน',
                        message: res.data.message.description
                    })

                    $scope.filterModel.operations = $scope.filterModel.operations + res.data.message.description;
                    viewModel.savelogsRequest($scope.filterModel).then(function () {
                    });
                }
                else {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'แจ้งเตือน',
                        message: res.data.message.description
                    })

                    $scope.filterModel.operations = $scope.filterModel.operations + res.data.message.description;
                    viewModel.savelogsRequest($scope.filterModel).then(function () {
                    });
                }
                $scope.filterModel.palletID = "";
                $scope.filterModel.isCheckPass = false;
                document.getElementById("lpnNo").focus();
            },
            function error(res) {
                $scope.filterModel.palletID = "";
                $scope.filterModel.isCheckPass = false;
                document.getElementById("lpnNo").focus();
            });
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

        $("#lpnNo").bind("focus", function () {
            setTimeout(() => {
                $("#lpnNo").removeAttr("readonly");
            }, 200);
        }).bind("blur", function () {
            $("#lpnNo").attr("readonly", "readonly");
        });

        $("#confirmLocation").bind("focus", function () {
            setTimeout(() => {
                $("#confirmLocation").removeAttr("readonly");
            }, 200);
        }).bind("blur", function () {
            $("#confirmLocation").attr("readonly", "readonly");
        });



    }
})