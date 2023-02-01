'use strict'
app.component('taskTransferReplenish', {
    controllerAs: '$vm',
    templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
        return "modules/Tranfer/TaskTransferReplenish/taskTransferReplenish.html";

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
    controller: function ($scope, $filter, $q, $compile, $http, /*ngAuthSettings,*/ $state, /*authService,*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox,taskTransferFactory, taskTransferReplenishFactory, webServiceAPI, logsFactory) {
        var $vm = this;
        var XFindItem = $filter('findItemList');
        var Progressbar = pageLoading;
        $scope.items = $scope.items || [];
        var viewModel = taskTransferFactory;
        var viewModelReplenish = taskTransferReplenishFactory;
        var item = $vm.searchResultModel;
        $scope.showColumnSetting = false;

        var validatestatus1 = "";
        var validatestatus3 = [];
        var validateChk = [];
        var validateDelete = [];
        var validateMsg = [];
        $scope.maxSize = 5;
        $scope.filterModel = {};
        $vm.isFilter = true;


        // $scope.putaway = function (param) {
        //     if ($scope.onShow) {
        //         $vm.isFilter = false;
        //         $scope.onShow(param).then(function (result) {
        //             $scope.filterTask ();
        //             $vm.isFilter = true;
        //         }).catch(function (error) {
        //             defer.reject({ 'Message': error });
        //         });
        //     }
        // };

        $scope.filterTask = function (param) {
            $scope.filterModel.username = $scope.userName;
            if (param != undefined) {
                $scope.filterModel.key = param.key;

            }

            viewModelReplenish.filterTaskReplenish($scope.filterModel).then(function (res) {
                
                // $vm.filterModel.totalRow = res.data.pagination.totalRow;
                // $vm.filterModel.currentPage = res.data.pagination.currentPage;
                $scope.searchResultModel = res.data;

                angular.forEach($scope.searchResultModel, function (v, k) {
                    if($scope.searchResultModel[k].documentType_Name == 'Transfer ByPass Sorter on demand')
                    $scope.searchResultModel[k].location_Name = 'TRAN-01';
                });
            });
        }

        $scope.text_truncate = function(str, length, ending) {
       
            if (ending == null) {
              ending = '...';
            }
               
            if (str.length > length) {
              return str.substring(0, length - ending.length) + ending;
            } else {
              return str;
            }
        };


        $scope.select = function (param) {
            let data = $scope.searchResultModel.find(c => c.isUser);
            if (data) {
                data.isUser = false;
            }
            param.isUser = true;
        }

        $scope.chkIsuse = function (param) {
            if (param.isUser) {
                return "#99FF66"
            }
        }

        $scope.bgColorType = function (documentType_Name) {
            if (documentType_Name == "Transfer ByPass Sorter" || documentType_Name == "Auto Replenishment from ASRS" || documentType_Name == "Transfer ByPass Sorter on demand") {
                return "#FDEDEC"
            }
        }

        $scope.accepted = function (param) {
            $scope.filterModel.userAssign = $scope.userName;
            $scope.filterModel.update = 0;
            let data = $scope.searchResultModel.find(c => c.isUser);
            if (!data) {
                return dpMessageBox.alert(
                    {
                        ok: 'Close',
                        title: 'ALERT',
                        message: "กรุณา เลือก Task"
                    }
                )
            }
            else {
                debugger
                $scope.filterModel.goodsTransfer_No = data.goodsTransfer_No;
                data.IsReplenish = true;
                viewModel.setParam(data);
                $state.go('wms.scan_ref_Transfer_no_summary', {});
            }
            

            // pageLoading.show();
            // viewModel.checkUserassign($scope.filterModel).then(function (res) {
            //     pageLoading.hide();
            //     if (res.data.msg == true) {
            //         if ($scope.onShow) {
            //             $vm.isFilter = false;
            //             $scope.onShow(data).then(function (result) {
            //                 $scope.filterTask();
            //                 $vm.isFilter = true;
            //             }).catch(function (error) {
            //                 defer.reject({ 'Message': error });
            //             });
            //         }
            //     }
            //     else {
            //         dpMessageBox.confirm({
            //             ok: 'Yes',
            //             cancel: 'No',
            //             title: 'ALERT',
            //             message: 'มีคนใช้งานอยู่ต้องการทำแทนหรือไม่'
            //         }).then(function success() {
            //             pageLoading.show();
            //             $scope.filterModel.update = 1;
            //             viewModel.checkUserassign($scope.filterModel).then(function (res) {
            //                 pageLoading.hide();
            //                 if ($scope.onShow) {
            //                     $vm.isFilter = false;
            //                     $scope.onShow(data).then(function (result) {
            //                         $scope.filterTask();
            //                         $vm.isFilter = true;
            //                     }).catch(function (error) {
            //                         defer.reject({ 'Message': error });
            //                     });
            //                 }
            //             });

            //         }, function error(res) {
            //         });
            //     }
            // })


        }





        var MessageBox = dpMessageBox;

        $scope.show = {
            action: true,
            pagination: true,
            checkBox: false
        }
        $scope.model = {
            currentPage: 1,
            numPerPage: 50,
            totalRow: 0
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

        $scope.changeTableSize = function (perPage, tab) {
            if (tab == 1) {
                $scope.colortab1 = "#97bee7";
                $scope.colortab2 = "#FFFFFF";

                $scope.fronttab1 = "#FFFFFF";
                $scope.fronttab2 = "#97bee7";

            }
            else if (tab == 2) {
                $scope.colortab1 = "#FFFFFF";
                $scope.colortab2 = "#97bee7";

                $scope.fronttab1 = "#97bee7";
                $scope.fronttab2 = "#FFFFFF";
            }

            $scope.selected = tab;

            let ChangeTable = 1;
            $scope.model = {};
            $scope.model = $vm.filterModel;
            if (perPage != null || perPage != undefined) {
                $scope.model.perPage = perPage;
                console.log($scope.model.perPage)
                console.log(perPage)
            }

            var p = $scope.model;
            serchPage(p);
        }

        function serchPage(data) {

            if (data != null) {

                pageLoading.show();
                viewModel.filterTaskReplenish(data).then(function (res) {
                    pageLoading.hide();
                    if (res.data.length != 0 && res.data.length != undefined) {
                        $vm.filterModel.totalRow = res.data[0].count;
                        $scope.searchResultModel = res.data;

                    }
                    else {
                        if (res.data.pagination != null) {
                            // $vm.filterModel.totalRow = res.data.pagination.totalRow;
                            // $vm.filterModel.currentPage = res.data.pagination.currentPage;1
                            $scope.searchResultModel = res.data.itemsTaskPutaway;
                            // let dataList = $vm.searchResultModel;
                            // for (var i = 0; i <= dataList.length - 1; i++) {
                            //     $vm.searchResultModel[i].row = i + 1;
                            // }
                            // $vm.searchDataRow = dataList.length;
                        }
                    }
                })
            }
        }

        $scope.autoComplete = {
            basicSearch: "Putaway/autobasicSuggestion",
            autoGT: "AutoGoodsTransfer/autoGoodsTransferNo2",
        };

        $scope.url = {
            Putaway: webServiceAPI.Putaway,
            GT: webServiceAPI.GT,
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

        function validate(param) {
            var msg = "";
            return msg;
        }

        function insertLogsUser() {
            var userLogin = JSON.parse(localStorage.userlogin);
            var logs = {};
            //logs.log_Index
            //logs.userGroup_Index
            //logs.userGroup_Id
            logs.userGroup_Name = localStorage['userGroupName'];
            logs.user_Index = userLogin.user_Index;
            logs.user_Id = userLogin.user_Id;
            logs.user_Name = userLogin.user_Name;
            logs.first_Name = userLogin.first_Name;
            logs.last_Name = userLogin.last_Name;
            logs.menu_Index = "AB361CA7-1431-4478-9BF1-11BF2A55693B";
            //logs.menuType_Index
            //logs.menu_Id
            logs.menu_Name = "จัดการสินค้า ขาเข้า";
            logs.sub_Menu_Index = "2E52D04C-8F87-4D31-A33D-0307DA09F777"
            //logs.sub_MenuType_Index
            //logs.sub_Menu_Id
            logs.sub_Menu_Name = "การจัดเก็บสินค้า";
            logs.operations = "";
            //logs.ref_Document_Index
            //logs.ref_Document_No
            //logs.request_URL
            //logs.request_Body
            //logs.isActive
            //logs.isDelete
            //logs.isSystem
            logsFactory.SaveLogs(logs).then(function (res) {

            })
        };

        $scope.clearData = function () {
            $scope.searchResultModel = {};
            $scope.filterModel = {};
        }

        var init = function () {
            $scope.userName = localStorageService.get('userTokenStorage');
            $scope.selected = 1;
            $scope.filterTask();
            insertLogsUser();
            // $scope.changeTableSize(50,1)
        };
        init();

    }
});