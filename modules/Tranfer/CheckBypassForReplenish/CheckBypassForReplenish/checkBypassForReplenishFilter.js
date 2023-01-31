
(function () {
    'use strict';
    app.component('checkBypassForReplenishFilter', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/Tranfer/CheckBypassForReplenish/CheckBypassForReplenish/checkBypassForReplenishFilter.html";
        },
        bindings: {
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?'
        },
        controller: function ($scope, $q, $http, $filter, $state, $window, $element, $timeout, $translate, /*ngAuthSettings,*/ pageLoading, commonService, checkBypassForReplenishFactory, webServiceAPI) {
            var $vm = this;

            // ----------------------------------------------------
            // This default object
            // var xString = commonService.string;
            // var xObject = commonService.objects;
            // var loading = commonService.loading;
            // var MessageBox = commonService.messageBox;
            var viewModel = checkBypassForReplenishFactory;
            $scope.filterModel = {};
            $scope.exportModel = {};
            $vm.filterModel = {
                currentPage: 1,
                PerPage: 50,
                totalRow: 0,
            };

            $vm.triggerSearch = function () {
                debugger
                $vm.filterModel = $vm.filterModel || {};
                pageLoading.show();
                viewModel.filter($vm.filterModel).then(function (res) {
                    pageLoading.hide();
                    if (res.data.itemsCheckBypassForReplenish.length != 0) {
                        debugger
                        $vm.filterModel.perPage = $vm.filterModel.PerPage;
                        $vm.filterModel.totalRow = res.data.pagination.totalRow;
                        $vm.filterModel.currentPage = res.data.pagination.currentPage;
                        if (res.data.pagination != null || res.data.pagination != undefined) {
                            $vm.filterModel.totalRow = res.data.pagination.totalRow;
                        }
                        $vm.searchResultModel = res.data.itemsCheckBypassForReplenish;
                    }
                    else {
                        $vm.searchResultModel = res.data.itemsCheckBypassForReplenish;
                    }
                });
            };

            $scope.searchFilter = function (param) {
                debugger
                $scope.filterModel = $scope.filterModel || {};
                $scope.filterModel.PerPage = $vm.filterModel.PerPage;
                $scope.filterModel.currentPage = $vm.filterModel.currentPage;
                $vm.filterModel.status = $scope.filterModel.status || {};
                $vm.filterModel.replenishmentLocation = $scope.filterModel.replenishmentLocation || "";
                pageLoading.show();
                viewModel.filter($scope.filterModel).then(function (res) {
                    pageLoading.hide();
                    if (res.data.itemsCheckBypassForReplenish.length != 0) {
                        debugger
                        $vm.filterModel.perPage = $vm.filterModel.perPage;
                        $vm.filterModel.totalRow = res.data.pagination.totalRow;

                        if (res.data.pagination != null || res.data.pagination != undefined) {
                            $vm.filterModel.totalRow = res.data.pagination.totalRow;
                            $vm.filterModel.key = res.data.pagination.key;
                        }

                        $vm.searchResultModel = res.data.itemsCheckBypassForReplenish;
                    }
                    else {
                        $vm.searchResultModel = res.data.itemsCheckBypassForReplenish;
                    }
                });
            };

            $scope.filter = function () {
                $vm.triggerSearch();
            };

            $scope.getSearchParams = function () {debugger
                return angular.copy($vm.filterModel);
            };

            $scope.url = {
                Master: webServiceAPI.Master,
            };

            $scope.status = [
                {
                    value: 0,
                    display: "Not Empty"
                },
                {
                    value: 1,
                    display: "Empty"
                }
            ];

            $scope.export = function () {
                pageLoading.show();
                $scope.exportModel = $scope.filterModel || {};
                $scope.exportModel.key = $vm.filterModel.key;
                $scope.exportModel.PerPage = 0;
                viewModel.Export($scope.exportModel).then(function (res) {
                    //pageLoading.hide();
                    if (res.data.length != 0) {
                        $vm.ResultModelExcel = res.data.itemsCheckBypassForReplenish;

                        var createXLSLFormatObj = [];

                        /* XLS Head Columns */
                        var xlsHeader = ["Product ID", "Product Name", "Replenishment Location", "Location Name", "Tag No", "MaxQty", "MinQty", "piecePickQty", "Qty Bal", "Qty Reserve", "Qty Remain","Sale Unit", "EXP Date","ShelfLife","AgeRemain","ERP Location","ItemStatus"];

                        /* XLS Rows Data */
                        var xlsRows = [];
                        var number = 1;
                        debugger
                        $vm.ResultModelExcel.forEach(e => {
                            xlsRows.push({
                                "Product ID": e.product_Id,
                                "Product Name": e.product_Name,
                                "Replenishment Location": e.replenishmentLocation,
                                "Location Name": e.location_Name,
                                "Tag No": e.tag_No,
                                "MaxQty": e.maxQty,
                                "MinQty": e.minQty,
                                "piecePickQty": e.piecePickQty,
                                "Qty Bal": e.sU_BinBalance_QtyBal,
                                "Qty Reserve": e.sU_BinBalance_QtyReserve,
                                "Qty Remain": e.sU_Qty_Remain,
                                "Sale Unit": e.saleUnit,
                                "EXP Date": e.goodsReceive_EXP_Date,
                                "ShelfLife": e.shelfLife,
                                "AgeRemain": e.ageRemain,
                                "ERP Location": e.eRP_Location,
                                "ItemStatus": e.itemStatus_Name,
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
                        JSONToCSVConvertor(createXLSLFormatObj, "CheckBypassForReplenish");
                    } else {
                        $vm.ResultModelExcel = res.data.itemsCheckBypassForReplenish;
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

            $vm.setDateFormate = function(v) {
                try {
                    return $filter("dateFormate")(v);
                } catch (e) {
                    return "-";
                }
            }
            
            $scope.autoComplete = {
                product: "Autocomplete/autoSearchProduct",
            };

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