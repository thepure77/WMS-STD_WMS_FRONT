(function() {
    'use strict';
    app.component('userGroupMenuFilter', {
        controllerAs: '$vm',
        templateUrl: function($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/masterData/masterUserGroupMenu/component/userGroupMenuFilter.html";
        },
        bindings: {
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?'
        },
        controller: function($scope, $q, $http, $filter, $state, $window, $element, $timeout, $translate, /*ngAuthSettings,*/ pageLoading, commonService, userGroupMenuFactory, webServiceAPI) {
            var $vm = this;

            // ----------------------------------------------------
            // This default object
            var xString = commonService.string;
            var xObject = commonService.objects;
            var loading = commonService.loading;
            var MessageBox = commonService.messageBox;
            var viewModel = userGroupMenuFactory;
            $scope.getuseDate = false;
            $scope.exportModel = {};
            $scope.filterModel = {};
            $vm.filterModel = {
                currentPage: 1,
                PerPage: 50,
                totalRow: 0,
            };
            
            $vm.triggerSearch = function() {
                $vm.filterModel = $vm.filterModel || {};
                pageLoading.show();
                viewModel.filter($vm.filterModel).then(function(res) {
                    console.log(res)
                    pageLoading.hide();
                    if (res.data.length != 0) {
                        $vm.filterModel.perPage = res.data.pagination.perPage;
                        $vm.filterModel.totalRow = res.data.pagination.totalRow;
                        $vm.filterModel.currentPage = res.data.pagination.currentPage;
                        if (res.data.pagination != null || res.data.pagination != undefined) {
                            $vm.filterModel.totalRow = res.data.pagination.totalRow;
                        }

                        $vm.searchResultModel = res.data.itemsUserGroupMenu;
                    } else {
                        $vm.searchResultModel = res.data.itemsUserGroupMenu;
                    }
                });
            };

            $scope.searchFilter = function(param) {
                debugger
                $scope.convertDate();
                $scope.filterModel = $scope.filterModel || {};
                $scope.filterModel.PerPage = $vm.filterModel.PerPage;
                $scope.filterModel.currentPage = $vm.filterModel.currentPage;
                pageLoading.show();
                viewModel.filter($scope.filterModel).then(function(res) {
                    console.log(res)
                    pageLoading.hide();

                    if (res.data.length != 0) {
                        $scope.filterModel.perPage = $vm.filterModel.PerPage;
                        $vm.filterModel.totalRow = res.data.pagination.totalRow;

                        if (res.data.pagination != null || res.data.pagination != undefined) {
                            $vm.filterModel.totalRow = res.data.pagination.totalRow;
                            $vm.filterModel.key = res.data.pagination.key;
                            $vm.filterModel.createdate_date = $scope.filterModel.createdate_date
                            $vm.filterModel.createdate_date_to = $scope.filterModel.createdate_date_to
                        }

                        $vm.searchResultModel = res.data.itemsUserGroupMenu;
                    } else {

                        $vm.searchResultModel = res.data.itemsUserGroupMenu;
                    }
                });
            };
            
            $vm.setDateFormate = function (v) {
                try {
                    return $filter("dateFormate")(v);
                } catch (e) {
                    return "-";
                }
            }

            $scope.export = function () {
                pageLoading.show();
                $scope.convertDate();
                $scope.exportModel = $scope.filterModel || {};
                $scope.exportModel.key = $vm.filterModel.key;
                $scope.exportModel.PerPage = 0;
                viewModel.Export($scope.exportModel).then(function (res) {
                    //pageLoading.hide();
                    if (res.data.length != 0) {
                        $vm.ResultModelExcel = res.data.itemsUserGroupMenu;

                        var createXLSLFormatObj = [];
                        var xlsHeader = ["No.","User Group Menu Id", "User Group Name","Menu", "Create By","Create Date","Update By","Update Date"];

                        /* XLS Rows Data */
                        var xlsRows = [];
                        var number = 1;
                        debugger;
                        $vm.ResultModelExcel.forEach(e => {
                            xlsRows.push({
                                "No.":e.numBerOf,
                                "User Group Menu Id": e.userGroupMenu_Id,
                                "User Group Name": e.userGroup_Name,
                                "Menu": e.menu_Name,
                                "Create By":e.create_By,
                                "Create Date":e.create_Date,
                                "Update By":e.update_By,
                                "Update Date":e.update_Date,
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
                        JSONToCSVConvertor(createXLSLFormatObj, "UserGroupMenu");
                    } else {
                        $vm.ResultModelExcel = res.data.itemsUserGroupMenu;
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

            function formatDate() {
                var today = new Date();
                var mm = today.getMonth() + 1;
                var yyyy = today.getUTCFullYear();
                var dd = today.getDate();
                if (dd < 10) dd = '0' + dd;
                if (mm < 10) mm = '0' + mm;
        
                return dd.toString() + "/" + mm.toString() + "/" + yyyy.toString() + " - " + dd.toString() + "/" + mm.toString() + "/" + yyyy.toString();
            };

            $scope.convertDate = function () {
            
            if ($scope.filterModel.createdate != null) {
                var str = $scope.filterModel.createdate;
    
                var DStart = str.substring(0, 2);
                var MStart = str.substring(5, 3);
                var YStart = str.substring(10, 6);
            
                $scope.filterModel.createdate_date = YStart.toString() + MStart.toString() + DStart.toString();
    
                var DEnd = str.substring(15, 13);
                var MEnd = str.substring(18, 16);
                var YEnd = str.substring(25, 19);
    
                $scope.filterModel.createdate_date_to = YEnd.toString() + MEnd.toString() + DEnd.toString();
            }
            };

            $scope.changeSet = function () {
                debugger
                 if ($scope.filterModel.useDate === 1){
                    // $scope.notuseDate();
                    $scope.filterModel.createdate = " ";
                 }
                 if ($scope.filterModel.useDate === 0){
                    // $scope.useDate();
                    $scope.filterModel.createdate = formatDate();
                 }
        
              }

            $scope.filter = function() {

                $vm.triggerSearch();
            };

            $scope.getSearchParams = function() {
                return angular.copy($vm.filterModel);
            };

            $scope.autoComplete = {
                userGroupMenu: "Autocomplete/autoSearchUserGroupMenu",
            };

            $scope.url = {
                Master: webServiceAPI.Master,
            };
            
            function initialize() {};

            this.$onInit = function() {
                initialize();
                $scope.filterModel.createdate = formatDate();
            };

            this.$onDestroy = function() {};

            $scope.$on('$destroy', function() {
                $vm.$onDestroy();
            });
        }
    });

})();