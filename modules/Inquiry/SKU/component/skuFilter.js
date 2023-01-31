(function () {
    'use strict';
    app.component('skuFilter', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/Inquiry/SKU/component/skuFilter.html";
        },
        bindings: {
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?',
            filterSearch: '=?'
        },
        controller: function ($scope, $q, $http, $filter, $state, $window, $element, $timeout, $translate, /*ngAuthSettings,*/ pageLoading, localStorageService, dpMessageBox, commonService, inquirySkuFactory) {
            var $vm = this;
            // ----------------------------------------------------
            // This default object
            var xString = commonService.string;
            var xObject = commonService.objects;
            var loading = commonService.loading;
            var MessageBox = commonService.messageBox;
            var viewModel = inquirySkuFactory;
            var model = $scope.filterModel;
            $vm.triggerSearch = function () {
                $vm.filterModel = $vm.filterModel || {};

                // $vm.filterModel.goodsReceiveDate = getToday();
                pageLoading.show();
                viewModel.search($vm.filterModel).then(function (res) {

                    pageLoading.hide();
                    if (res.data.items.length != 0) {

                        $scope.filterModel.perPage = $vm.filterModel.perPage;
                        $scope.filterModel.currentPage = $vm.filterModel.currentPage;
                        $vm.filterModel.totalRow = res.data.pagination.totalRow;
                        $vm.filterModel.currentPage = res.data.pagination.currentPage;
                        $vm.filterModel.perPage = res.data.pagination.perPage;
                        $vm.filterModel.numPerPage = res.data.pagination.perPage;
                        $vm.filterModel.maxSize = 5;

                        if (res.paginations != null || res.paginations != undefined) {
                            $vm.filterModel.totalRow = paginations.totalRow;
                        }

                        $vm.searchResultModel = res.data.items;
                    }
                    else {

                        $vm.searchResultModel = res.data.items;
                    }
                });
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



            $scope.searchFilter = function (param) {
                var deferred = $q.defer();
                viewModel.search(param).then(
                    function success(res) {
                        deferred.resolve(res);
                    },
                    function error(response) {
                        deferred.reject(response);
                    });

                return deferred.promise;
            }
            $scope.filterSearch = function () {

                $scope.filterModel = $scope.filterModel || {};
                $scope.filterModel.currentPage = $vm.filterModel.currentPage;
                $scope.filterModel.perPage = $vm.filterModel.perPage;
                $scope.filterModel.columnName = $vm.filterModel.columnName;
                $scope.filterModel.orderby = $vm.filterModel.orderby;
                $scope.searchFilter($scope.filterModel).then(function success(res) {
                    $vm.searchResultModel = res.data.items;
                    $vm.filterModel = $scope.filterModel;
                    $vm.filterModel.totalRow = res.data.pagination.totalRow;
                    $vm.filterModel.currentPage = res.data.pagination.currentPage;
                    $vm.filterModel.perPage = res.data.pagination.perPage;
                    $vm.filterModel.numPerPage = res.data.pagination.perPage;
                    $vm.filterModel.maxSize = 5;



                }, function error(res) { });
            }

            $scope.clearSearch = function (param) {
                $scope.filterModel = {};
                $scope.filterModel.create_Date = getToday();
                $scope.filterModel.create_DateTo = getToday();
                $state.reload();
                $window.scrollTo(0, 0);
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
                // $vm.triggerSearch();
                $scope.filterModel = {};
                $scope.userName = localStorageService.get('userTokenStorage');
                $scope.filterModel.perPage = $vm.filterModel.perPage;
                $scope.filterModel.currentPage = $vm.filterModel.currentPage;
                $scope.filterModel.create_Date = getToday();
                $scope.filterModel.create_DateTo = getToday();

            };

            this.$onDestroy = function () {
            };

            $scope.$on('$destroy', function () {
                $vm.$onDestroy();
            });

            $scope.exportData = function () {

                // if ($vm.searchResultModel.length == 0) {
                //     return MessageBox.alert({
                //         ok: 'Close',
                //         title: 'Information',
                //         message: 'กรุณาค้นหาข้อมูล'
                //     })
                // }
                pageLoading.show();
                let filter = {};
                filter.productId = $scope.filterModel.productId;
                filter.productName = $scope.filterModel.productName;
                $scope.searchFilter($scope.filterModel).then(function success(res) {
                    if (res.data.items.length == 0) {
                        return MessageBox.alert({
                            ok: 'Close',
                            title: 'Information',
                            message: 'ไม่พบข้อมูล'
                        })
                    }

                    var createXLSLFormatObj = [];

                    /* XLS Head Columns */
                    var xlsHeader = ["No.", "Article ID", "Article Name", "Tag No", "Location", "Stock on Hand", "Stock Allocated", "Stock Available", "ArticleConversion Name","Vendor ID","Vendor Name","TIxHI","Factor"];

                    /* XLS Rows Data */
                    var xlsRows = [];
                    var number = 1;
                    res.data.items.forEach(e => {
                        xlsRows.push({
                            "No.": number
                            , "Article ID": e.productId
                            , "Article Name": e.productName.replace('"', "''")
                            , "Tag No": e.tagNo
                            , "Location": e.locationName
                            , "Stock on Hand": e.stockONHand
                            , "Stock Allocated": e.stockAllocated
                            , "Stock Available": e.stockAvailable
                            , "ArticleConversion Name": e.productConversionName
                            , "Vendor ID": e.owner_Id
                            , "Vendor Name": e.owner_Name
                            , "TIxHI": e.productConversion_Ref1 + "*" +e.productConversion_Ref2
                            , "Factor": e.productConversion_Ref3
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
                    JSONToCSVConvertor(createXLSLFormatObj);
                }, function error(res) { pageLoading.hide();});
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
                var fileName = "Stock_Article_" + datetime;
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


        }
    });

})();