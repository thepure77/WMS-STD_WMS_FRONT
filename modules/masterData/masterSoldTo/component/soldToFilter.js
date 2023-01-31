(function () {
    'use strict';
    app.component('soldToFilter', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/masterData/masterSoldTo/component/soldToFilter.html";
        },
        bindings: {
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?'
        },
        controller: function ($scope, $q, $http, $filter, $state, $window, $element, $timeout, $translate, /*ngAuthSettings,*/ pageLoading, commonService,soldToFactory,shipToFactory,ownerFactory,webServiceAPI,dpMessageBox) {
            var $vm = this;

            // ----------------------------------------------------
            // This default object
            var xString = commonService.string;
            var xObject = commonService.objects;
            var loading = commonService.loading;
            var MessageBox = commonService.messageBox;
            var viewModel = soldToFactory;
            var viewModelOwner = ownerFactory;
            var viewModelShipTo = shipToFactory;
            $scope.getuseDate = false;
            $scope.filterModel = {};
            $scope.exportModel = {};
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
                $scope.exportModel = {};
                $scope.searchFilter();
            }
            $scope.hide = function () {
                $scope.header.advanceSearch = $scope.header.advanceSearch === false ? true : false;
                $scope.header.advanceSearch = $scope.header.advanceSearch;
            };
            $scope.model = {
                soldToId: "",
                soldToName: "",    
                soldToTypeName: "",             
            };
            $scope.searchFilter = function (param) {
                $scope.convertDate();
                // $vm.filterModel = $scope.filterModel;
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
                            $vm.filterModel.createdatesoldto_date = $scope.filterModel.createdatesoldto_date
                            $vm.filterModel.createdatesoldto_date_to = $scope.filterModel.createdatesoldto_date_to

                        }

                        $vm.searchResultModel = res.data.itemsSoldTo;
                    }
                    else {

                        $vm.searchResultModel = res.data.itemsSoldTo;
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
                            $vm.filterModel.totalRow = paginations.totalRow;
                        }

                        $vm.searchResultModel = res.data.itemsSoldTo;

                    }
                    else {
                        $vm.searchResultModel = res.data.itemsSoldTo;
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
                soldToName: "autoSoldTo/autoSearchSoldToFilter"
            };
            

            
            // ----------------------------------------------------
            // This local function
            $vm.setDateFormate = function (v) {
                try {
                    return $filter("dateFormate")(v);
                } catch (e) {
                    return "-";
                }
            }

            $scope.exportExcel = {

                export: function () {
                  dpMessageBox.confirm({
                    title: 'Confirm.',
                    message: 'Do you want to download?'
                  }).then(function success() {
                    $scope.export();
                  })
                },
              }
            $scope.export = function () {
                pageLoading.show();
                // $scope.convertDate();
                $scope.convertDate();
                $scope.exportModel = $scope.filterModel || {};
                $scope.exportModel.key = $vm.filterModel.key;
                $scope.exportModel.PerPage = 0;
                // $scope.filterModel = $scope.filterModel || {};
                viewModel.Export($scope.filterModel).then(function (res) {
                    //pageLoading.hide();
                    if (res.data.length != 0) {
                        $vm.ResultModelExcel = res.data.itemsSoldTo;

                        var createXLSLFormatObj = [];
                        var xlsHeader = ["No.", "SoldTo ID", "SoldTo Name", "SoldTo SecondName" , "SoldTo Type" , "SoldTo Tax ID" , "SoldTo Email" , "SoldTo Fax" , "SoldTo Tel" , 
                                        "SoldTo Mobile", "SoldTo Barcode" , "Contact Person" , "Contact Person 2" , "Contact Person 3" , "Contact Tel" , "Contact Tel 2" , 
                                        "Contact Tel 3", "Contact E-mail" , "Contact E-mail 2" , "Contact E-mail 3" , "SoldTo Address" , "Sub District",
                                        "District" , "Province" , "Country" , "Postcode" , "Ref No1" , "Ref No2" , "Ref No3" , "Ref No4" , "Ref No5",
                                        "Remark", "Create By","Create Date","Update By","Update Date"];

                        /* XLS Rows Data */
                        var xlsRows = [];
                        $vm.ResultModelExcel.forEach(e => {
                            xlsRows.push({
                                "No.":e.row_Count,
                                "SoldTo ID":e.soldTo_Id, 
                                "SoldTo Name":e.soldTo_Name, 
                                "SoldTo SecondName":e.soldTo_SecondName, 
                                "SoldTo Type":e.soldToType_Name, 
                                "SoldTo Tax ID":e.soldTo_TaxID, 
                                "SoldTo Email":e.soldTo_Email, 
                                "SoldTo Fax":e.soldTo_Fax, 
                                "SoldTo Tel":e.soldTo_Tel, 
                                "SoldTo Mobile":e.soldTo_Mobile, 
                                "SoldTo Barcode":e.soldTo_Barcode, 
                                "Contact Person":e.contact_Person, 
                                "Contact Person 2":e.contact_Person2, 
                                "Contact Person 3":e.contact_Person3, 
                                "Contact Tel":e.contact_Tel, 
                                "Contact Tel 2":e.contact_Tel2, 
                                "Contact Tel 3":e.contact_Tel3, 
                                "Contact E-mail":e.contact_Email, 
                                "Contact E-mail 2":e.contact_Email2, 
                                "Contact E-mail 3":e.contact_Email3, 
                                "SoldTo Address":e.soldTo_Address, 
                                "Sub District":e.subDistrict_Name,
                                "District":e.district_Name, 
                                "Province":e.province_Name, 
                                "Country":e.country_Name, 
                                "Postcode":e.postcode_Name, 
                                "Ref No1":e.ref_No1, 
                                "Ref No2":e.ref_No2, 
                                "Ref No3":e.ref_No3, 
                                "Ref No4":e.ref_No4, 
                                "Ref No5":e.ref_No5,
                                "Remark":e.remark,
                                "Create By":e.create_By,
                                "Create Date":e.create_Date,
                                "Update By":e.update_By,
                                "Update Date":e.update_Date,

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
                        JSONToCSVConvertor(createXLSLFormatObj, "SoldTo");
                    } else {
                        $vm.ResultModelExcel = res.data.itemsSoldTo;
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
            
            if ($scope.filterModel.createdatesoldto != null) {
                var str = $scope.filterModel.createdatesoldto;
    
                var DStart = str.substring(0, 2);
                var MStart = str.substring(5, 3);
                var YStart = str.substring(10, 6);
            
                $scope.filterModel.createdatesoldto_date = YStart.toString() + MStart.toString() + DStart.toString();
    
                var DEnd = str.substring(15, 13);
                var MEnd = str.substring(18, 16);
                var YEnd = str.substring(25, 19);
    
                $scope.filterModel.createdatesoldto_date_to = YEnd.toString() + MEnd.toString() + DEnd.toString();
            }
            };

            $scope.changeSet = function () {
                debugger
                 if ($scope.filterModel.useDate === 1){
                    // $scope.notuseDate();
                    $scope.filterModel.createdatesoldto = " ";
                 }
                 if ($scope.filterModel.useDate === 0){
                    // $scope.useDate();
                    $scope.filterModel.createdatesoldto = formatDate();
                 }
        
              }


            function initialize() {
            };

            this.$onInit = function () {
                initialize();
                viewModelOwner.set()
                viewModelShipTo.set();
                $scope.filterModel.createdatesoldto = formatDate();
            };

            this.$onDestroy = function () {
            };

            $scope.$on('$destroy', function () {
                $vm.$onDestroy();
            });
        }
    });

})();