(function () {
    'use strict';
    app.component('userFilter', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/masterData/masterUser/component/userFilter.html";
        },
        bindings: {
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?'
        },
        controller: function ($scope, $q, $http, $filter, $state, $window, $element, $timeout, $translate, /*ngAuthSettings,*/ pageLoading, commonService, userFactory, webServiceAPI) {
            var $vm = this;

            // ----------------------------------------------------
            // This default object
            // var xString = commonService.string;
            // var xObject = commonService.objects;
            // var loading = commonService.loading;
            var MessageBox = commonService.messageBox;
            var viewModel = userFactory;
            $scope.filterModel = {};
            $scope.exportModel = {};
            $vm.filterModel = {
                currentPage: 1,
                PerPage: 50,
                totalRow: 0,
            };
            
            $scope.clearFilter = function (){
                $scope.filterModel = {};
                $scope.searchFilter();
                $scope.exportModel = {};
                
            }
            $scope.hide = function () {
                $scope.header.advanceSearch = $scope.header.advanceSearch === false ? true : false;
                $scope.header.advanceSearch = $scope.header.advanceSearch;
            };
            
            $vm.triggerSearch = function () {
                $vm.filterModel = $vm.filterModel || {};
                pageLoading.show();
                viewModel.filter($vm.filterModel).then(function (res) {
                    pageLoading.hide();
                    if (res.data.length != 0) {
                        $vm.filterModel.perPage = $vm.filterModel.PerPage;
                        $vm.filterModel.totalRow = res.data.pagination.totalRow;
                        $vm.filterModel.currentPage = res.data.pagination.currentPage;

                        if (res.data.pagination != null || res.data.pagination != undefined) {
                            $vm.filterModel.totalRow = res.data.pagination.totalRow;
                        }

                        $vm.searchResultModel = res.data.itemsUser;
                    }
                    else {
                        $vm.searchResultModel = res.data.itemsUser;
                    }
                });
            };

            $scope.searchFilter = function (param) {
                $scope.filterModel = $scope.filterModel || {};
                $scope.filterModel.PerPage = $vm.filterModel.PerPage;
                $scope.filterModel.currentPage = $vm.filterModel.currentPage;
                pageLoading.show();
                viewModel.filter($scope.filterModel).then(function (res) {
                    pageLoading.hide();

                    if (res.data.length != 0) {
                        $scope.filterModel.perPage = $vm.filterModel.PerPage;
                        $vm.filterModel.totalRow = res.data.pagination.totalRow;

                        if (res.data.pagination != null || res.data.pagination != undefined) {
                            $vm.filterModel.totalRow = res.data.pagination.totalRow;
                            $vm.filterModel.key = res.data.pagination.key;

                        }

                        $vm.searchResultModel = res.data.itemsUser;
                    }
                    else {

                        $vm.searchResultModel = res.data.itemsUser;
                    }
                });
            };

            $scope.filter = function () {

                $vm.triggerSearch();
            };

            $scope.getSearchParams = function () {
                return angular.copy($vm.filterModel);
            };

            $scope.autoComplete = {
                //user: "Autocomplete/autoUser",
                user: "Autocomplete/autoSearchUser",
            };

            $scope.export = function () {
                pageLoading.show();
                $scope.exportModel.key = $vm.filterModel.key;
                $scope.exportModel.PerPage = 0;
                viewModel.Export($scope.exportModel).then(function (res) {
                    //pageLoading.hide();
                    if (res.data.length != 0) {
                        $vm.ResultModelExcel = res.data.itemsUser;

                        var createXLSLFormatObj = [];
                        var xlsHeader = ["ลำดับ","รหัสผู้ใช้งาน", "ชื่อผู้ใช้งาน","ชื่อ-สกุล","กลุ่มสิทธิ์","ผู้สร้าง","วันที่สร้างเอกสาร","ผู้แก้ไข","วันที่แก้ไข","ผู้ยกเลิก","วันที่ยกเลิก","สถานะ"];

                        /* XLS Rows Data */
                        var xlsRows = [];
                        $vm.ResultModelExcel.forEach(e => {
                            xlsRows.push({
                                "ลำดับ":e.numBerOf,
                                "รหัสผู้ใช้งาน": e.user_Id,
                                "ชื่อผู้ใช้งาน": e.user_Name,
                                "ชื่อ-สกุล": e.fullname,
                                "กลุ่มสิทธิ์":e.userGroup_Name,
                                "ผู้สร้าง":e.create_By,
                                "วันที่สร้างเอกสาร": e.create_Date,   
                                "ผู้แก้ไข": e.update_By,   
                                "วันที่แก้ไข": e.update_Date,   
                                "ผู้ยกเลิก": e.cancel_By,   
                                "วันที่ยกเลิก": e.cancel_Date,
                                "สถานะ":e.activeStatus,
                                 
                            });
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
                        JSONToCSVConvertor(createXLSLFormatObj, "ผู้ใช้งาน");
                    } else {
                        $vm.ResultModelExcel = res.data.itemsUser;
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

            $scope.url = {
                Master: webServiceAPI.Master,
            };

            $scope.$watch("filterModel.user_Name", function () {
                if ($scope.filterModel.user_Name != undefined) {
                    $vm.filterModel.user_Name = $scope.filterModel.user_Name;
                }
            });

            // ----------------------------------------------------
            // This local function
            function initialize() {
            };

            this.$onInit = function () {
                initialize();
            };

            this.$onDestroy = function () {
            };

            $scope.$on('$destroy', function () {
                $vm.$onDestroy();
            });
        }
    });

})();