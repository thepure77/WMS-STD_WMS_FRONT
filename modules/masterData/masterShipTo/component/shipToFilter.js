(function () {
    'use strict';
    app.component('shipToFilter', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/masterData/masterShipTo/component/shipToFilter.html";
        },
        bindings: {
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?'
        },
        controller: function ($scope, $q, $http, $filter, $state, $window, $element, $timeout, $translate, /*ngAuthSettings,*/ pageLoading, commonService,shipToFactory,soldToFactory,webServiceAPI) {
            var $vm = this;

            // ----------------------------------------------------
            // This default object
            var xString = commonService.string;
            var xObject = commonService.objects;
            var loading = commonService.loading;
            var MessageBox = commonService.messageBox;
            var viewModel = shipToFactory;
            var viewModelSoldTo = soldToFactory;
            $scope.filterModel = {};
            $vm.filterModel = {
                currentPage: 1,
                PerPage: 50,
                totalRow: 0,
            };
            $scope.header = {
                advanceSearch: false
            };

            $scope.clearFilter = function (){
                $scope.filterModel = {};
                $scope.searchFilter();
                $scope.exportModel();
            }
            $scope.hide = function () {
                $scope.header.advanceSearch = $scope.header.advanceSearch === false ? true : false;
                $scope.header.advanceSearch = $scope.header.advanceSearch;
            };

            $scope.convertDate = function () {               
                  if ($scope.filterModel.dateCreate != null) {
                  var str_load = $scope.filterModel.dateCreate;
        
                  var DStart_load = str_load.substring(0, 2);
                  var MStart_load = str_load.substring(5, 3);
                  var YStart_load = str_load.substring(10, 6);
        
                  $scope.filterModel.create_date = YStart_load.toString() + MStart_load.toString() + DStart_load.toString();
        
                  var DEnd_load = str_load.substring(15, 13);
                  var MEnd_load = str_load.substring(18, 16);
                  var YEnd_load = str_load.substring(25, 19);
        
                  $scope.filterModel.create_date_to = YEnd_load.toString() + MEnd_load.toString() + DEnd_load.toString();
                  }                
              };  

            $scope.model = {
                shipToId: "",
                shipToName: "",    
                shipToTypeName: "",             
            };
               //export data
               $scope.export = function () {
                pageLoading.show();
                $scope.convertDate();
                $scope.filterModel = $scope.filterModel || {};
                viewModel.Export($scope.filterModel).then(function (res) {
                    //pageLoading.hide();
                    debugger
                    if (res.data.length != 0) {
                        $vm.ResultModelExcel = res.data.itemsShipTo;

                        var createXLSLFormatObj = [];

                        /* XLS Head Columns */
                        var xlsHeader = ["ลำดับ",
                        "รหัสสถานที่จัดส่ง",
                        "ชื่อผู้รับสินค้า/สาขา",
                        "ชื่อจัดส่งที่ 2",
                        "ประเภทสถานที่จัดส่ง",
                        "รหัสภาษี",
                        "อีเมล",
                        "เบอร์โทรสาร",
                        "เบอร์โทรศัทพ์",
                        "เบอร์โทรศัพท์มือถือ",
                        "บาร์โค้ด",
                        "ผู้ติดต่อ",
                        "ผู้ติดต่อ 2",
                        "ผู้ติดต่อ 3",
                        "โทรศัพท์ผู้ติดต่อ",
                        "โทรศัพท์ผู้ติดต่อ 2",
                        "โทรศัพท์ผู้ติดต่อ 3",
                        "อีเมลผู้ติดต่อ",
                        "อีเมลผู้ติดต่อ 2",
                        "อีเมลผู้ติดต่อ 3",
                        "ที่อยู่ผู้รับสินค้า/สาขา",
                        "แขวง/ตำบล",
                        "เขต/อำเภอ",
                        "จังหวัด",
                        "ประเทศ",
                        "รหัสไปรษณีย์",
                        "หมายเหตุ",
                        "ผู้สร้าง",
                        "วันที่สร้างเอกสาร",
                        "ผู้แก้ไข",
                        "วันที่แก้ไข",
                        // "ผู้ยกเลิก",
                        // "วันที่ยกเลิก",
                        "สถานะ",
                        "ธุรกิจ",];

                        /* XLS Rows Data */
                        var xlsRows = [];
                        var number = 1;
                        debugger
                        $vm.ResultModelExcel.forEach(e => {
                            xlsRows.push({
                                "ลำดับ":e.numBerOf,
                                "รหัสสถานที่จัดส่ง": e.shipTo_Id,
                                "ชื่อผู้รับสินค้า/สาขา": e.shipTo_Name,
                                "ชื่อจัดส่งที่ 2":e.shipTo_SecondName,
                                "ประเภทสถานที่จัดส่ง":e.shipToType_Name,
                                "รหัสภาษี":e.shipTo_TaxID,
                                "อีเมล":e.shipTo_Email,
                                "เบอร์โทรสาร":e.shipTo_Fax,
                                "เบอร์โทรศัทพ์":e.shipTo_Tel,
                                "เบอร์โทรศัพท์มือถือ":e.shipTo_Mobile,
                                "บาร์โค้ด":e.shipTo_Barcode,
                                "ผู้ติดต่อ":e.contact_Person,
                                "ผู้ติดต่อ 2":e.contact_Person2,
                                "ผู้ติดต่อ 3":e.contact_Person3,
                                "โทรศัพท์ผู้ติดต่อ":e.contact_Tel,
                                "โทรศัพท์ผู้ติดต่อ 2":e.contact_Tel2,
                                "โทรศัพท์ผู้ติดต่อ 3":e.contact_Tel3,
                                "อีเมลผู้ติดต่อ":e.contact_Email,
                                "อีเมลผู้ติดต่อ 2":e.contact_Email2,
                                "อีเมลผู้ติดต่อ 3":e.contact_Email3,
                                "ที่อยู่ผู้รับสินค้า/สาขา":e.shipTo_Address,
                                "แขวง/ตำบล":e.subDistrict_Name,
                                "เขต/อำเภอ":e.district_Name,
                                "จังหวัด":e.province_Name,
                                "ประเทศ":e.country_Name,
                                "รหัสไปรษณีย์":e.postcode_Name,
                                "หมายเหตุ":e.remark,
                                "ผู้สร้าง": e.create_By,   
                                "วันที่สร้างเอกสาร": e.create_Date,   
                                "ผู้แก้ไข": e.update_By,   
                                "วันที่แก้ไข": e.update_Date,   
                                // "ผู้ยกเลิก": e.create_By,   
                                // "วันที่ยกเลิก": e.cancel_Date,
                                "สถานะ":e.activeStatus,
                                "ธุรกิจ":e.businessUnit_Name,
                               
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
                        JSONToCSVConvertor(createXLSLFormatObj, "ShipTo");
                    } else {
                        $vm.ResultModelExcel = res.data.itemsShipTo;
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
            $scope.searchFilter = function (param) {
                if ($scope.filterModel.dateCreate != null) {
                    $scope.convertDate();
                  }
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
                            $vm.filterModel.create_date = $scope.filterModel.create_date;
                            $vm.filterModel.create_date_to = $scope.filterModel.create_date_to;
                            $vm.filterModel.changeSet = $scope.filterModel.changeSet;

                        }

                        $vm.searchResultModel = res.data.itemsShipTo;
                    }
                    else {

                        $vm.searchResultModel = res.data.itemsShipTo;
                    }
                });
            };
            $scope.filter = function () {
                $vm.triggerSearch();
            };

            $vm.triggerSearch = function () {
                $vm.filterModel =  $vm.filterModel || {};                
                pageLoading.show();
                viewModel.filter($vm.filterModel).then(function (res) {
                    pageLoading.hide();
                    if (res.data.length != 0) {
                        $vm.filterModel.perPage = $vm.filterModel.PerPage;
                        $vm.filterModel.totalRow = res.data.pagination.totalRow;
                        $vm.filterModel.currentPage = res.data.pagination.currentPage;
                        if (res.data.paginations != null || res.data.paginations != undefined) {
                            $vm.filterModel.totalRow = res.data.pagination.totalRow;
                        }

                        $vm.searchResultModel = res.data.itemsShipTo;

                    }
                    else {
                        $vm.searchResultModel = res.data.itemsShipTo;
                    }
                });
            };
            
            $scope.getSearchParams = function () {
                return angular.copy($vm.filterModel);
            };

            $scope.url = {
                Master: webServiceAPI.Master,
            };
            $scope.autoComplete = {
                shipToName: "autoShipTo/autoSearchShipToFilter"
            };
            
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
            function formatDate() {
                var today = new Date();
                var mm = today.getMonth() + 1;
                var yyyy = today.getUTCFullYear();
                var dd = today.getDate();
                if (dd < 10) dd = '0' + dd;
                if (mm < 10) mm = '0' + mm;
        
                return dd.toString() + "/" + mm.toString() + "/" + yyyy.toString() + " - " + dd.toString() + "/" + mm.toString() + "/" + yyyy.toString();
            };
  

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
                
                viewModelSoldTo.set();

                $scope.filterModel = {};

                $scope.filterModel.dateCreate = formatDate();
            };

            this.$onDestroy = function () {
            };

            $scope.$on('$destroy', function () {
                $vm.$onDestroy();
            });
        }
    });

})();