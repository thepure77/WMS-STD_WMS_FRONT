(function () {
    'use strict';
    app.component('configUserGroupMenuFilter', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/masterData/configUserGroupMenu/component/configUserGroupMenuFilter.html";
        },
        bindings: {
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?'
        },
        controller: function ($scope, $q, $http, $filter, $state, $window, $element, $timeout, $translate, /*ngAuthSettings,*/ pageLoading, commonService, configUserGroupMenuFactory, webServiceAPI, dpMessageBox,localStorageService) {
            var $vm = this;

            // ----------------------------------------------------
            // This default object
            var xString = commonService.string;
            var xObject = commonService.objects;
            var loading = commonService.loading;
            var MessageBox = commonService.messageBox;
            var viewModel = configUserGroupMenuFactory;
            $scope.exportModel = {};
            $scope.filterModel = {};
            $vm.filterModel = {
                currentPage: 1,
                PerPage: 50,
                totalRow: 0,
            };

            function getUserGroupMenu() {
                viewModel.getUserGroupMenu({}).then(function (res) {
                    $scope.dropdownUserGroupMenu = res.data;
                });
            };

            $vm.triggerSearch = function () {
            };

            $scope.searchFilter = function (param) {

                $scope.filterModel = $scope.filterModel || {};
                $scope.filterModel.PerPage = $vm.filterModel.PerPage;
                $scope.filterModel.currentPage = $vm.filterModel.currentPage;

                if ($scope.dropdownUserGroupMenu.model) {
                    $scope.filterModel.userGroup_Index = $scope.dropdownUserGroupMenu.model.userGroup_Index;
                    $scope.filterModel.userGroup_Id = $scope.dropdownUserGroupMenu.model.userGroup_Id;
                    $scope.filterModel.userGroup_Name = $scope.dropdownUserGroupMenu.model.userGroup_Name;
                }
                else {

                    $scope.filterModel.userGroup_Index = null;
                    $scope.filterModel.userGroup_Id = null;
                    $scope.filterModel.userGroup_Name = null;

                    // return dpMessageBox.alert({
                    //     ok: 'Close',
                    //     title: 'Success',
                    //     message: 'กรุณา เลือก User Group'
                    // });
                }

                pageLoading.show();
                viewModel.filterConfigUserGroupMenu($scope.filterModel).then(function (res) {
                    pageLoading.hide();
                    if (res.data.items) {
                        $scope.filterModel.perPage = $vm.filterModel.PerPage;
                        $vm.filterModel.totalRow = res.data.pagination.totalRow;

                        if (res.data.pagination != null || res.data.pagination != undefined) {
                            $vm.filterModel.totalRow = res.data.pagination.totalRow;
                        }

                        $vm.searchResultModel = res.data.items;
                    } else {

                        $vm.searchResultModel = {};
                    }
                }).catch(function (error) {
                    return dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Success',
                        message: 'Error'
                    });
                });
            };

            $scope.filter = function () {
                $vm.triggerSearch();
            };

            $scope.getSearchParams = function () {
                return angular.copy($vm.filterModel);
            };

            $scope.autoComplete = {
                wave: "Autocomplete/autoSearchWave",
            };

            $scope.url = {
                Master: webServiceAPI.Master,
            };

            $scope.export = function () {
                $scope.filterModel = $scope.filterModel || {};
                $scope.filterModel.PerPage = $vm.filterModel.PerPage;
                $scope.filterModel.currentPage = $vm.filterModel.currentPage;

                if ($scope.dropdownUserGroupMenu.model) {
                    $scope.filterModel.userGroup_Index = $scope.dropdownUserGroupMenu.model.userGroup_Index;
                    $scope.filterModel.userGroup_Id = $scope.dropdownUserGroupMenu.model.userGroup_Id;
                    $scope.filterModel.userGroup_Name = $scope.dropdownUserGroupMenu.model.userGroup_Name;
                }
                else {

                    // $scope.filterModel.userGroup_Index = null;
                    // $scope.filterModel.userGroup_Id = null;
                    // $scope.filterModel.userGroup_Name = null;

                    return dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Success',
                        message: 'กรุณา เลือก User Group'
                    });
                }
                pageLoading.show();
                $scope.exportModel.key = $vm.filterModel.key;
                $scope.exportModel.userGroup_Index = $scope.filterModel.userGroup_Index;
                $scope.exportModel.userGroupMenu_Id = $scope.filterModel.userGroup_Id;
                $scope.exportModel.userGroupMenu_Name = $scope.filterModel.userGroup_Name;
                $scope.exportModel.PerPage = 0;
                viewModel.Export($scope.exportModel).then(function (res) {
                    
                    //pageLoading.hide();
                    if (res.data.length != 0) {
                        $vm.ResultModelExcel = res.data.itemsConfigUserGroupMenu;

                        var createXLSLFormatObj = [];

                        /* XLS Head Columns 
                    resultItem.create_Date = item.Create_Date != null ? item.Create_Date.Value.ToString("dd/MM/yyyy HH:mm:ss") : "";
                    resultItem.update_By = item.Update_By == null ? "" : item.Update_By; 
                    resultItem.update_Date = item.Update_Date != null ? item.Update_Date.Value.ToString("dd/MM/yyyy HH:mm:ss") : "";
                    resultItem.cancel_By = item.Cancel_By == null ? "" : item.Cancel_By;
                    resultItem.cancel_Date = item.Cancel_Date != null ? item.Cancel_Date.Value.ToString("dd/MM/yyyy HH:mm:ss") : "";*/
                        var xlsHeader = ["ลำดับ","	User Group Id", "User Group Name","Menu Third Name","สร้างโดย", "วันที่สร้าง", "แก้ไขโดย", "วันที่แก้ไข"];

                        /* XLS Rows Data */
                        var xlsRows = [];
                        var number = 1;
                        $vm.ResultModelExcel.forEach(e => {
                            xlsRows.push({
                                "ลำดับ":e.numBerOf,
                                "User Group Menu Id": e.menu_Name,
                                "User Group Name": e.menu_SecondName,
                                "Menu Third Name": e.menu_ThirdName,
                                "สร้างโดย": e.create_By,
                                "วันที่สร้าง": e.create_Date,
                                "แก้ไขโดย": e.update_By,
                                "วันที่แก้ไข": e.update_Date,
                            });
                            number++
                        });

                        var today = new Date();
                        var mm = today.getMonth() + 1;
                        var yyyy = today.getUTCFullYear();
                        var dd = today.getDate();
                        var Minute = today.getMinutes();
                        var Hour = today.getHours();

                        if (Minute < 10) Minute = '0' + Minute;

                        if (dd < 10) dd = '0' + dd;
                        if (mm < 10) mm = '0' + mm;
                        
                
                        var datetime = yyyy.toString() + mm.toString() + dd.toString() + Hour.toString() + Minute.toString();

                        createXLSLFormatObj.push(xlsHeader);
                        $.each(xlsRows, function (index, value) {
                            var innerRowData = [];
                            $.each(value, function (ind, val) {
                                innerRowData.push(val);
                            });
                            createXLSLFormatObj.push(innerRowData);
                        });
                        pageLoading.hide();
                        JSONToCSVConvertor(createXLSLFormatObj, "UserGroup");
                    } else {
                        $vm.ResultModelExcel = res.data.itemsConfigUserGroupMenu;
                    }
                });


            }
            function JSONToCSVConvertor(JSONData, ShowLabel) {
                //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
                var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;

                var CSV = '';

                //1st loop is to extract each row
                for (var i = 0; i < arrData.length; i++) {
                    var row = "";

                    //2nd loop will extract each column and convert it in string comma-seprated
                    for (var index in arrData[i]) {
                        row += '"' + arrData[i][index] + '",';
                    }

                    row.slice(0, row.length - 1);

                    //add a line break after each row
                    CSV += row + '\r\n';
                }

                if (CSV == '') {
                    alert("Invalid data");
                    return;
                }

                var today = new Date();
                var mm = today.getMonth() + 1;
                var yyyy = today.getUTCFullYear();
                var dd = today.getDate();
                var Minute = today.getMinutes();
                var Hour = today.getHours();

                if (Minute < 10) Minute = '0' + Minute;

                if (dd < 10) dd = '0' + dd;
                if (mm < 10) mm = '0' + mm;

                var datetime = yyyy.toString() + mm.toString() + dd.toString() + Hour.toString() + Minute.toString();
                //Generate a file name
                var fileName = ShowLabel + "_" + datetime;
                //this will remove the blank-spaces from the title and replace it with an underscore

                //Initialize file format you want csv or xls
                var uri = 'data:text/csv;charset=utf-8,%EF%BB%BF' + encodeURIComponent(CSV);

                // Now the little tricky part.
                // you can use either>> window.open(uri);
                // but this will not work in some browsers
                // or you will not get the correct file extension    

                //this trick will generate a temp <a /> tag
                var link = document.createElement("a");
                link.href = uri;

                //set the visibility hidden so it will not effect on your web-layout
                link.style = "visibility:hidden";
                link.download = fileName + ".csv";

                //this part will append the anchor tag and remove it after automatic click
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }

            $scope.confirm = function () {
                dpMessageBox.confirm({
                    ok: 'Yes',
                    cancel: 'No',
                    title: 'ยืนยัน',
                    message: 'คุณต้องการบันทึกข้อมูลใช่หรือไม่'
                }).then(function () {
                    pageLoading.show();
                    if ($vm.searchResultModel.length > 0) {
                        let obj = { items: $vm.searchResultModel,username:localStorageService.get('userTokenStorage')};
                        viewModel.confirm(obj).then(function (res) {
                            pageLoading.hide();
                            return dpMessageBox.alert({
                                ok: 'Close',
                                title: 'แจ้งเตือน',
                                message: res.data
                            });
                        }).catch(function (error) {
                            return dpMessageBox.alert({
                                ok: 'Close',
                                title: 'แจ้งเตือน',
                                message: 'Error'
                            });
                        });
                    }
                    else {
                        return dpMessageBox.alert({
                            ok: 'Close',
                            title: 'แจ้งเตือน',
                            message: 'กรุณาเลือกกลุ่มสิทธิ์'
                        });
                    }
                });
            }

            // ----------------------------------------------------
            // This local function
            $vm.setDateFormate = function (v) {
                try {
                    return $filter("dateFormate")(v);
                } catch (e) {
                    return "-";
                }
            }

            this.$onInit = function () {
                getUserGroupMenu();
            };

        }
    });

})();