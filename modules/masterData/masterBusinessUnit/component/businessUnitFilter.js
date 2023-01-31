(function () {
    'use strict';
    app.component('businessUnitFilter', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/masterData/masterBusinessUnit/component/businessUnitFilter.html";
        },
        bindings: {
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?'
        },
        controller: function ($scope, $q, $http, $filter, $state, $window, $element, $timeout, $translate, /*ngAuthSettings,*/ pageLoading, commonService,businessUnitFactory, webServiceAPI) {
            var $vm = this;

            // ----------------------------------------------------
            // This default object
            var xString = commonService.string;
            var xObject = commonService.objects;
            var loading = commonService.loading;
            var MessageBox = commonService.messageBox;
            var viewModel = businessUnitFactory;
            $scope.getuseDate = false;
            $scope.filterModel = {};
            $vm.filterModel = {
                currentPage: 1,
                PerPage: 50,
                totalRow: 0,
            };
            $scope.exportModel = {};
            $scope.clearFilter = function (){
                $scope.filterModel = {};
                $scope.searchFilter();
            }
            $scope.hide = function () {
                $scope.header.advanceSearch = $scope.header.advanceSearch === false ? true : false;
                $scope.header.advanceSearch = $scope.header.advanceSearch;
            };
            
            $vm.triggerSearch = function() {
                $vm.filterModel = $vm.filterModel || {};
                pageLoading.show();
                debugger
                viewModel.filter($vm.filterModel).then(function(res) {
                    pageLoading.hide();
                    if (res.data.length != 0) {
                        $vm.filterModel.perPage = res.data.pagination.perPage;
                        $vm.filterModel.totalRow = res.data.pagination.totalRow;
                        $vm.filterModel.currentPage = res.data.pagination.currentPage;
                        if (res.data.pagination != null || res.data.pagination != undefined) {
                            $vm.filterModel.totalRow = res.data.pagination.totalRow;
                        }

                        $vm.searchResultModel = res.data.itemsBusinessUnit;
                    } else {
                        $vm.searchResultModel = res.data.itemsBusinessUnit;
                    }
                });
            };

            $scope.searchFilter = function(param) {
                $scope.convertDate();
                $scope.filterModel = $scope.filterModel || {};
                $scope.filterModel.PerPage = $vm.filterModel.PerPage;
                $scope.filterModel.currentPage = $vm.filterModel.currentPage;
                pageLoading.show();
                viewModel.filter($scope.filterModel).then(function(res) {
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

                        $vm.searchResultModel = res.data.itemsBusinessUnit;
                    } else {

                        $vm.searchResultModel = res.data.itemsBusinessUnit;
                    }
                });
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
                businessUnit: "Autocomplete/autoSearchBusinessUnit",
            };

            $scope.url = {
                Master: webServiceAPI.Master,
            };

            $scope.export = function () {
                pageLoading.show();
                $scope.exportModel = $scope.filterModel || {};
                $scope.exportModel.key = $vm.filterModel.key;
                $scope.exportModel.PerPage = 0;
                viewModel.Export($scope.exportModel).then(function (res) {
                    //pageLoading.hide();
                    if (res.data.length != 0) {
                        $vm.ResultModelExcel = res.data.itemsBusinessUnit;

                        var createXLSLFormatObj = [];

                        /* XLS Head Columns 
                    resultItem.create_Date = item.Create_Date != null ? item.Create_Date.Value.ToString("dd/MM/yyyy HH:mm:ss") : "";
                    resultItem.update_By = item.Update_By == null ? "" : item.Update_By; 
                    resultItem.update_Date = item.Update_Date != null ? item.Update_Date.Value.ToString("dd/MM/yyyy HH:mm:ss") : "";
                    resultItem.cancel_By = item.Cancel_By == null ? "" : item.Cancel_By;
                    resultItem.cancel_Date = item.Cancel_Date != null ? item.Cancel_Date.Value.ToString("dd/MM/yyyy HH:mm:ss") : "";*/
                        var xlsHeader = ["ลำดับ","Business Unit ID", "Business Unit Name","Ref No1","Ref No2","Remark", "สร้างโดย", "วันที่สร้าง", "แก้ไขโดย", "วันที่แก้ไข"];
                        /* XLS Rows Data */
                        var xlsRows = [];
                        var number = 1;
                        debugger;
                        $vm.ResultModelExcel.forEach(e => {
                            xlsRows.push({
                                "ลำดับ":e.numBerOf,
                                "Business Unit ID": e.businessUnit_Id,
                                "Business Unit Name": e.businessUnit_Name,
                                "Business Unit Name Second	": e.businessUnit_SecondName,   
                                "Ref No1": e.ref_No1,   
                                "Ref No2": e.ref_No2,
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
                        JSONToCSVConvertor(createXLSLFormatObj, "BusinessUnit");
                    } else {
                        $vm.ResultModelExcel = res.data.itemsBusinessUnit;
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

            // $scope.toggleSearch = function () {
            //     $vm.filterModel.advanceSearch = !$vm.filterModel.advanceSearch;
            // };

            // $scope.filter = function () {
            //     $vm.triggerSearch();
            // };

            // $vm.triggerSearch = function () {
            //     $vm.filterModel =  $vm.filterModel || {};                
            //     pageLoading.show();                                                                      
            //     viewModel.filter().then(function (res) {
            //         pageLoading.hide();
            //         $vm.filterModel = res.data;
            //         $vm.searchResultModel = res.data;
            //     });
            // };
            
            // $scope.getSearchParams = function () {
            //     return angular.copy($vm.filterModel);
            // };
            
            // $scope.autoComplete = {
            //     orderNo: "domesticLoadingItems/orderNo",
            //     SoNo: "domesticLoadingItems/SoNo",
            //     Plant: "domesticLoadingItems/Plant",
            //     OMSJobNo: "domesticLoadingItems/OMSJobNo",
            //     Material: "domesticLoadingItems/Material",
            //     Lot: "domesticLoadingItems/Lot",
            //     Customer: "domesticLoadingItems/Customer",
            //     DSNo: "domesticLoadingItems/DSNo",
            //     coloadNo: "domesticLoadingItems/coloadNo",
            //     basic: "DomesticPlantSelected/basicSuggestion",
            //     materialCode: "ExportPlantSelected/materialCode",
            // };

            
            // ----------------------------------------------------
            // This local function
            $vm.setDateFormate = function (v) {
                try {
                    return $filter("dateFormate")(v);
                } catch (e) {
                    return "-";
                }
            }

            function initialize() {
            };

            this.$onInit = function () {
                initialize();
                $scope.filterModel.createdate = formatDate();
            };

            this.$onDestroy = function () {
            };

            $scope.$on('$destroy', function () {
                $vm.$onDestroy();
            });
        }
    });

})();