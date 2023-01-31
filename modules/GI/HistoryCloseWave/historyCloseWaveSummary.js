(function () {
    'use strict';
    app.component('historyCloseWaveSummary', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/GI/HistoryCloseWave/historyCloseWaveSummary.html";
        },
        controller: function ($scope, $q, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, historyCloseWaveFactory, webServiceAPI) {
            var $vm = this;
            var defer = {};
            var viewModel = historyCloseWaveFactory;
            var viewWCSModel = historyCloseWaveFactory;

            $scope.filterModel = {
                callroll: false,
                buttoncall: false,
            };

            $scope.header = {
                callroll: false,
                buttoncall: false,
            };

            $scope.autoComplete = {
                GoodsIssue_No: "AutoGoodsIssue/autoGoodIssueNo",
                user: "Autocomplete/autoSearchUser",
            };

            $scope.url = {
                GI: webServiceAPI.GI,
                Master: webServiceAPI.Master,
            };

            $scope.hide = true;

            $scope.HistoryCloseWaveSearch = function () {
                pageLoading.show();
                debugger;
                if($('input[name="datefilter"]').val().length > 0)
                {
                  $scope.filterModel.waveComplete_Date = $('input[name="datefilter"]').val();
                }
                if ($scope.filterModel.waveComplete_Date != null) {
                    $scope.convertDate();
                }
                viewModel.HistoryCloseWaveSearchSearch($scope.filterModel).then(function (res) {
                    debugger
                    $scope.filterModellist = {};
                    $scope.filterModellist = res.data;
                    pageLoading.hide();

                });
                debugger;
            };

            $scope.CloseWave = function () {
                var model = $scope.filterModel;
                model.docNo = $scope.filterModel.waveNo;
                model.updateBy = $scope.userName;
                model.remark = $scope.filterModel.remark;
                pageLoading.hide();
                debugger;
    
                dpMessageBox.confirm({
                    ok: 'Yes',
                    cancel: 'No',
                    title: 'ยืนยันข้อมูล ?',
                    message: 'คุณต้องการปิด wave : [ ' + model.docNo + ' ] ใช่หรือไม่ ?'
                }).then(function () {
                    pageLoading.show();
                    viewWCSModel.Complete_Wave_45(model).then(function (res) {
                        
                        if (res.data.status == 10) {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'Information.',
                                message: 'ปิด wave สำเร็จ : ' + res.data.message.description
                            })  
    
                            $scope.filterModel.goodsIssue_No = null;
                            $scope.filterModel = {};
                            $scope.WCS_waveno = false;
                        } else 
                        {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'Information.',
                                message: "ปิด wave ไม่สำเร็จ : " + res.data.message.description
                            }) 
                        }
    
                        pageLoading.hide();
                    });
                });
            }

            $scope.convertDate = function () {

                if ($scope.filterModel.waveComplete_Date != null) {
                    var str = $scope.filterModel.waveComplete_Date;

                    var DStart = str.substring(0, 2);
                    var MStart = str.substring(5, 3);
                    var YStart = str.substring(10, 6);

                    $scope.filterModel.waveComplete_Date_Start = YStart.toString() + MStart.toString() + DStart.toString();

                    var DEnd = str.substring(15, 13);
                    var MEnd = str.substring(18, 16);
                    var YEnd = str.substring(25, 19);

                    $scope.filterModel.waveComplete_Date_End = YEnd.toString() + MEnd.toString() + DEnd.toString();
                }
            };

            function getToday() {
                var today = new Date();
                var mm = today.getMonth() + 1;
                var yyyy = today.getUTCFullYear();
                var dd = today.getDate();
                if (dd < 10) dd = '0' + dd;
                if (mm < 10) mm = '0' + mm;
        
                return dd.toString() + "/" + mm.toString() + "/" + yyyy.toString() + " - " + dd.toString() + "/" + mm.toString() + "/" + yyyy.toString();;
              }

            $vm.$onInit = function () {
                $vm = this;
                debugger;
                $scope.filterModel = {};    
                $scope.filterModel.waveComplete_Date = getToday();

            }

        }
    })
})();