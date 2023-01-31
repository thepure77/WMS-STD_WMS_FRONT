(function () {
    'use strict';
    app.component('rebuildIndexForm', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/GI/RebuildIndex/component/rebuildIndexForm.html";
        },
        bindings: {
            scanReceive: '=?',
            onShow: '=?'
        },
        controller: function ($scope, $q, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, rebuildIndexFactory, webServiceAPI) {
            var $vm = this;
            var defer = {};
            var viewModel = rebuildIndexFactory;

            $scope.filterModel = {
                callroll: false,
                buttoncall: false,
            };

            $scope.header = {
                callroll: false,
                buttoncall: false,
            };

            $scope.autoComplete = {
                //user: "Autocomplete/autoUser",
                user: "Autocomplete/autoSearchUser",
            };

            $scope.url = {
                Master: webServiceAPI.Master,
            };

            $scope.hide = true;

            $scope.RebuildSearch = function () {
                pageLoading.show();
                debugger;
                if($('input[name="datefilter"]').val().length > 0)
                {
                  $scope.filterModel.rebuild_date = $('input[name="datefilter"]').val();
                }
                if ($scope.filterModel.rebuild_date != null) {
                    $scope.convertDate();
                }
                viewModel.RebuildSearch($scope.filterModel).then(function (res) {
                    debugger
                    $scope.filterModellist = {};
                    $scope.filterModellist = res.data;
                    // if(res.data.length > 0)
                    // {
                    //     $scope.filterModellist.isuse_rebuild = res.data[0].isuse_rebuild;
                    // }
                    pageLoading.hide();
                    debugger;
                });
            };
            
            $scope.rebuildIndex = function () {
                dpMessageBox.confirm({
                    ok: 'OK',
                    cancel: 'Close',
                    title: 'MSG_SURE_data',
                    message: 'Do you want to Rebuild'
                }).then(function () {
                    pageLoading.show();
                    $scope.mess = 'Processing';
                    $scope.filterModel.Rebuild_By = localStorageService.get('userTokenStorage');
                    viewModel.rebuildIndex($scope.filterModel).then(function (res) {
                        $scope.mess = 'Done';
                        // $scope.filterModellist = {};
                        if (res.data.resultIsUse) {
                            pageLoading.hide();
                            $scope.RebuildSearch();
                            return dpMessageBox.alert(
                                {
                                    ok: 'Close',
                                    title: 'แจ้งเตือน',
                                    message: 'Complete'
                                }
                            )
                        } else {
                            pageLoading.hide()
                            return dpMessageBox.alert(
                                {
                                    ok: 'Close',
                                    title: 'แจ้งเตือน',
                                    message: res.data.resultMsg
                                }
                            )
                        }
                    },
                        function error(param) {
                            pageLoading.hide()
                            $scope.Run = false;
                            return dpMessageBox.alert(
                                {
                                    ok: 'Close',
                                    title: 'แจ้งเตือน',
                                    message: 'กรุณาติดต่อ Admin'
                                }
                            )
                        });
                },
                    function error(param) {
                        pageLoading.hide()
                        // return dpMessageBox.alert(
                        //     {
                        //         ok: 'Close',
                        //         title: 'แจ้งเตือน',
                        //         message: 'กรุณาติดต่อ Admin'
                        //     }
                        // )
                    });

            };
///////////////////////////////////////////////////////////////////////////////////////
            $scope.exportFile = {

                Export: function () {
                  dpMessageBox.confirm({
                    title: 'Confirm.',
                    message: 'Do you want to download?'
                  }).then(function success() {
                    Export();
                  })
                },
              }

              function Export() {
                  debugger
                if ($scope.filterModel.date != null) {
                  $scope.convertDate();
                }
                pageLoading.show();
                var deferred = $q.defer();
                $scope.filterModel.excelName = "Rebuild";
                viewModel.Export($scope.filterModel).then(
                  function success(results) {
                    pageLoading.hide();
                    deferred.resolve(results);
                  },
                  function error(response) {

                    dpMessageBox.alert({
                      title: 'Information.',
                      message: "Connect Service Fail."
                    })
                    deferred.reject(response);
                  }
                );
                return deferred.promise;
              }

            $scope.url = {
                GI: webServiceAPI.GI,
                Master: webServiceAPI.Master,
                 PlanGI: webServiceAPI.PlanGI,
                 Master_V2: webServiceAPI.Master_V2,
            };
///////////////////////////////////////////////////////////////////////////////////////
            $scope.convertDate = function () {

                if ($scope.filterModel.rebuild_date != null) {
                    var str = $scope.filterModel.rebuild_date;

                    var DStart = str.substring(0, 2);
                    var MStart = str.substring(5, 3);
                    var YStart = str.substring(10, 6);

                    $scope.filterModel.Rebuild_Date_Start = YStart.toString() + MStart.toString() + DStart.toString();

                    var DEnd = str.substring(15, 13);
                    var MEnd = str.substring(18, 16);
                    var YEnd = str.substring(25, 19);

                    $scope.filterModel.Rebuild_Date_End = YEnd.toString() + MEnd.toString() + DEnd.toString();
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
                $scope.filterModel.rebuild_date = getToday();
                $scope.RebuildSearch();

            }

        }
    })
})();