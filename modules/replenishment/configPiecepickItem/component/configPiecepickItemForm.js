(function () {
    'use strict'

    app.component('configPiecepickItemForm', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/replenishment/configPiecepickItem/component/configPiecepickItemForm.html";
        },
        bindings: {
            onShow: '=?',
            searchResultModel: '=?',
            filterModel: '=?',
        },
        controller: function ($scope, $q, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, configPiecepickItemFactory, webServiceAPI) {
            var $vm = this;

            $scope.onShow = false;
            var defer = {};
            var viewModel = configPiecepickItemFactory;
            $scope.Cancel = true;
            $scope.update = false;
            $scope.create = true;
            $scope.getCheck = false;
            $scope.dataimport = [];
            $scope.fileName = "";

            $vm.onShow = function(param) {
                defer = $q.defer();
                if ($scope.filterModel != null) {
                    $scope.filterModel = {};
                }
                $scope.onShow = true;
                if (param != undefined) {
                    pageLoading.show();
                    $scope.create = false;
                    $scope.fileName = "";
                    $scope.dataimport = [];
                    viewModel.find(param.replenishment_Index).then(function(res) {
                        pageLoading.hide();
                        $scope.filterModel = res.data;
                        $scope.update = true;
                        if ($scope.filterModel.isActive == 0) {
                            $scope.getCheck = false;
                        } else {
                            $scope.getCheck = true;
                        }
                    });
                } else {
                    $scope.filterModel.businessUnit_Id = "";
                    $scope.update = false
                    $scope.create = true;
                    $scope.getCheck = true;
                    $scope.filterModel.isActive = 1;
                    $scope.fileName = "";
                    $scope.dataimport = [];
                }
                return defer.promise;
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

            function getTime() {
                var Minute = new Date().getMinutes();
                var Hour = new Date().getHours();

                if (Minute < 10) Minute = '0' + Minute;

                return Hour.toString() + ':' + Minute.toString()
            }

            $vm.triggerSearch = function() {
                pageLoading.show();
                viewModel.filter($scope.filterModel).then(function(res) {
                    pageLoading.hide();
                    $vm.searchResultModel = res.data.itemsConfigPiecepickItem;
                });
            };
            
            $scope.delete = function() {
                debugger
                var model = $scope.filterModel;
                model.create_By = $scope.userName;
                if (model.location_Name == undefined || model.location_Name == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Validate',
                        message: 'Location is required !!'
                    })
                    return "";
                }
                if (model.qty == undefined || model.qty == "" || model.qty < 0) {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Validate',
                        message: 'Max_Qty is required !!'
                    })
                    return "";
                }
                if (model.min_Qty == undefined || model.min_Qty == "" || model.min_Qty < 0) {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Validate',
                        message: 'Min_Qty is required !!'
                    })
                    return "";
                }

                if (model.plan_By_Location == 'No') {
                    model.plan_By_Location = 0;
                    // $scope.filterModel.chkallLocation = false;
                }
                else if (model.plan_By_Location == 'All') {
                    model.plan_By_Location = 2;
                    // $scope.filterModel.chkallLocation = true;
                }
                else{
                    model.plan_By_Location = 1;
                }
    
                if (model.plan_By_Product == 'No') {
                    model.plan_By_Product = 0;
                    // $scope.filterModel.chkAllProduct = false;
                }
                else if (model.plan_By_Product == 'All') {
                    model.plan_By_Product = 2;
                    // $scope.filterModel.chkAllProduct = true;
                }else{
                    model.plan_By_Product = 1;
                }
    
                if (model.isActive == 'InActive') {
                    model.isActive = 1;
                    // $scope.filterModel.isActive = true;
                }
                else {
                    model.isActive = 0;
                    // $scope.filterModel.isActive = false;
                }
                model.log_udf_2 = getToday();
                model.log_udf_3 = getTime();
                model.operations = "Update";
                dpMessageBox.confirm({
                    ok: 'Yes',
                    cancel: 'No',
                    title: 'แจ้งเตือน',
                    message: 'คุณต้องการอัพเดทข้อมูลใช่หรือไม่'
                }).then(function success() {
                    debugger
                    model.log_udf_4 = getToday();
                    model.log_udf_5 = getTime();
                    model.operations = model.operations+" : Success";
                    $scope.logmodel = model;
                    viewModel.savelogsRequest($scope.logmodel).then(function () {
                    });
                    viewModel.checkLocation(model).then(function success(res) {
                    debugger
                    model.log_udf_4 = getToday();
                    model.log_udf_5 = getTime();
                    model.operations = model.operations+" : Success";
                    $scope.logmodel = model;
                    viewModel.savelogsRequest($scope.logmodel).then(function () {
                    });
                        if (res.data == "Fail") {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'แจ้งเตือน',
                                message: 'กรุณาตรวจสอบ เนื่องจาก SKU หรือ Location นี้มีการใช้งานอยู่่ '
                            })
                        }else
                        {
                            viewModel.getDelete(model).then(function success(res) 
                            {
                                if (res.data == true) {
                                }
                            }).then(function success(res)
                            {
                                
                                    Add(model).then(function success(res) {

                                        pageLoading.hide();
                                        if (res.data == "Done") {
                                            defer.resolve('1');
                                            $scope.filterModel = {};
                                        }
                                        else
                                        if(res.data = "Fail"){
                                            model.log_udf_4 = getToday();
                                            model.log_udf_5 = getTime();
                                            model.operations = model.operations+" : Fail";
                                            viewModel.savelogsRequest(model).then(function () {
                                            });
                                            dpMessageBox.alert({
                                                ok: 'Close',
                                                title: 'แจ้งเตือน',
                                                message: 'กรุณาตรวจสอบ เนื่องจาก SKU หรือ Location นี้มีการใช้งานอยู่่ '
                                            })
                                            return "";
                                        }
                                    }, function error(param) {
                                        model.log_udf_4 = getToday();
                                        model.log_udf_5 = getTime();
                                        model.operations = model.operations+" : Fail";
                                        viewModel.savelogsRequest(model).then(function () {
                                        });
                                        dpMessageBox.alert({
                                            ok: 'Close',
                                            title: 'error',
                                            message: 'Save error'
                                        })
                                    });
                            })
                        }
                        $vm.triggerSearch();
                    }, function error(res) {});
                });
            };
            // $scope.delete = function() {
            //     debugger
            //     var model = $scope.filterModel;
            //     model.create_By = $scope.userName;
            //     if (model.plan_By_Location == 'No') {
            //         model.plan_By_Location = 0;
            //         // $scope.filterModel.chkallLocation = false;
            //     }
            //     else if (model.plan_By_Location == 'All') {
            //         model.plan_By_Location = 2;
            //         // $scope.filterModel.chkallLocation = true;
            //     }
            //     else{
            //         model.plan_By_Location = 1;
            //     }
    
            //     if (model.plan_By_Product == 'No') {
            //         model.plan_By_Product = 0;
            //         // $scope.filterModel.chkAllProduct = false;
            //     }
            //     else if (model.plan_By_Product == 'All') {
            //         model.plan_By_Product = 2;
            //         // $scope.filterModel.chkAllProduct = true;
            //     }else{
            //         model.plan_By_Product = 1;
            //     }
    
            //     if (model.isActive == 'InActive') {
            //         model.isActive = 1;
            //         // $scope.filterModel.isActive = true;
            //     }
            //     else {
            //         model.isActive = 0;
            //         // $scope.filterModel.isActive = false;
            //     }
            //     dpMessageBox.confirm({
            //         ok: 'Yes',
            //         cancel: 'No',
            //         title: 'แจ้งเตือน',
            //         message: 'คุณต้องการอัพเดทข้อมูลใช่หรือไม่'
            //     }).then(function success() {
            //         viewModel.getDelete(model).then(function success(res) {
            //             if (res.data == true) {
            //                 dpMessageBox.alert({
            //                     ok: 'Close',
            //                     title: 'แจ้งเตือน',
            //                     message: 'ลบข้อมูลสำเร็จ'
            //                 })
            //             }
            //             $vm.triggerSearch();
            //         }, function error(res) {});
            //     });
            // };


            //Validate & confirm Add            
            $scope.add = function() {
                var model = $scope.filterModel;
                //ใช้ userName จาก localStorage
                model.create_By = $scope.userName;
                $scope.validateMsg = "";
                if (model.location_Name == undefined || model.location_Name == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Validate',
                        message: 'Location is required !!'
                    })
                    return "";
                }
                if (model.qty == undefined || model.qty == "" || model.qty < 0) {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Validate',
                        message: 'Max_Qty is required !!'
                    })
                    return "";
                }
                if (model.min_Qty == undefined || model.min_Qty == "" || model.min_Qty < 0) {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Validate',
                        message: 'Min_Qty is required !!'
                    })
                    return "";
                }
                else {
                    dpMessageBox.confirm({
                        ok: 'Yes',
                        cancel: 'No',
                        title: 'ยืนยันข้อมูล',
                        message: 'คุณต้องการบันทึกข้อมูลใช่หรือไม่'
                    }).then(function() {
                        pageLoading.show();
                        Add(model).then(function success(res) {

                            pageLoading.hide();
                            if (res.data == "Done") {
                                defer.resolve('1');
                                $scope.filterModel = {};
                            }
                            else
                            if(res.data = "Fail"){
                                dpMessageBox.alert({
                                    ok: 'Close',
                                    title: 'แจ้งเตือน',
                                    message: 'กรุณาตรวจสอบ เนื่องจาก SKU หรือ Location นี้มีการใช้งานอยู่่ '
                                })
                                return "";
                            }
                        }, function error(param) {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'error',
                                message: 'Save error'
                            })
                        });
                    });
                }
            }

            //ย้อนกลับ
            $scope.back = function() {
                defer.resolve('1');
                var model = $scope.filterModel;
                model.product_Id = null;
                model.location_Id = null;
                model.ProductConversion_Name = null;
            }

            //function Add
            function Add(param) {
                var deferred = $q.defer();
                viewModel.SaveChanges(param).then(
                    function success(results) {
                        deferred.resolve(results);
                    },
                    function error(response) {
                        deferred.resolve(response);
                    }
                );
                return deferred.promise;
            }

            ///function import csv
            // $scope.Upload = function (file, param) {
            //     $scope.SelectedFile = file;
            //     if(!$scope.SelectedFile)
            //     {
            //        return;
            //     }
            //     var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv)$/;
            //     if (regex.test($scope.SelectedFile.name.toLowerCase())) {
            //       if (typeof (FileReader) != "undefined") {
            //         var reader = new FileReader();
            //         reader.readAsText(file, 'windows-874');
            //         if (reader.readAsBinaryString) 
            //         {
            //             reader.onload   = function (e) {
            //             var rows = e.target.result.split("\n").slice(1);
            //             let number = 'C';
            //             let dataInsert = {};
            //             dataInsert.Import_Type = viewModel.get();
            //             dataInsert.Import_FileName = $scope.SelectedFile.name;
            //             dataInsert.Import_By = localStorageService.get('userTokenStorage');
            //             dataInsert.Import_Case = $scope.filterModel.select;
            //             dataInsert.data = [];
            //             dataInsert.columns = [];

            //             for (var i = 0; i < rows.length; i++) {
            //               let data = rows[i].split(',');
            //               if (data[0]) {
            //                 let ItemData = {};
            //                 for (let index = 0; index < data.length; index++) {
            //                   let numberindex = number + index.toString();
            //                   ItemData[numberindex] = data[index];
            //                 }
            //                 dataInsert.data.push(ItemData);
            //               }
            //             }
            //             $scope.$apply(function () {
            //                 $scope.dataimport = [];
            //                 if(dataInsert.data.length > 0)
            //                 {
            //                     angular.forEach(dataInsert.data, function (value,key) {
            //                         var data_array = {};
            //                         data_array.product_Id =  value.C0.replace('	','').replace('"','').replace('"','').trim();
            //                         data_array.product_Name = value.C1.replace('	','').replace('	','').replace('"','').replace('"','').trim();
            //                         data_array.location_Name = value.C2.replace('	','').replace('	','').replace('"','').replace('"','').trim().toUpperCase();
            //                         data_array.qty = value.C3.replace('	','').replace('	','').replace('"','').replace('"','').replace(/[^0-9\.\-]+/g,'').trim();
            //                         data_array.min_Qty = value.C4.replace('	','').replace('	','').replace('"','').replace('"','').replace(/[^0-9\.\-]+/g,'').trim();
            //                         data_array.sale_Unit = value.C5.replace('	','').replace('	','').replace('"','').replace('"','').trim();
            //                         data_array.create_By = $scope.userName;
            //                         $scope.dataimport.push(data_array);
            //                     });
            //                 }
            //                 $scope.fileName =  dataInsert.Import_FileName;
            //             });
            //           }
            //            //reader.readAsBinaryString($scope.SelectedFile);
            //         }
            //       } else {
            //         $window.alert("This browser does not support HTML5.");
            //       }
            //     } else {
            //       $window.alert("Please upload a valid CSV file.");
            //     }
            //   };


             ///function import xlsx
            $scope.Upload = function (file, param) {       
                $scope.SelectedFile = file;
                if(!$scope.SelectedFile)
                {
                   return;
                }
                var regex = /^([ก-๙a-zA-Z0-9\s_\\.\-:])+(.xlsx)$/;
                if (regex.test($scope.SelectedFile.name.toLowerCase())) 
                {
                  if (typeof (FileReader) != "undefined") 
                  {
                    var reader = new FileReader();
                    reader.readAsArrayBuffer(file); 
                    if (reader.readAsArrayBuffer) 
                    {
                        reader.onload   = function (e) {
                            this.arrayBuffer = reader.result;    
                            var data = new Uint8Array(this.arrayBuffer);    
                            var arr = new Array();    
                            for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);    
                            var bstr = arr.join("");  
                            var workbook = XLSX.read(bstr, {type:"binary"}); 
                            var firstSheet = workbook.SheetNames[0];
                            var XL_row_object = XLS.utils.sheet_to_json(workbook.Sheets[firstSheet])
                            var schemaExcel = XLS.utils.sheet_to_json(workbook.Sheets[firstSheet], { header: 1, defval: '', range: 0 })
        
                            var dtRow = [];
                            var dtColumn = [];
                            for (let i = 0; i <= XL_row_object.length - 1; i++) 
                            {
                                dtColumn = [];
                                for (let j = 0; j <= schemaExcel[0].length - 1; j++) 
                                {
                                    dtColumn[j] = "";
                                    if (schemaExcel[i + 1][j] == undefined || schemaExcel[i + 1][j] == "" || schemaExcel[i + 1][j] == null) 
                                    {
                                    schemaExcel[i + 1][j] = "";
                                    }
                                    dtColumn[j] = schemaExcel[i + 1][j];
                                }
                                dtRow.push(angular.copy(dtColumn));
                            }

                            let rows = dtRow;
                            let number = 'C';
                            let dataInsert = {};
                            dataInsert.Import_Type = viewModel.get();
                            dataInsert.Import_FileName = $scope.SelectedFile.name;
                            dataInsert.Import_By = localStorageService.get('userTokenStorage');
                            dataInsert.Import_Case = $scope.filterModel.select;
        
                            dataInsert.data = [];
                            dataInsert.columns = [];
        
                            for (var i = 0; i < rows.length; i++) 
                            {
                                let data = [];
                                Object.keys(rows[i]).forEach(element => {
                                    data.push(rows[i][element])
                                });
                                let ItemData = {};
                                for (let index = 0; index < data.length; index++) 
                                {
                                    let numberindex = number + index.toString();
                                    ItemData[numberindex] = data[index];
                                }
                                dataInsert.data.push(ItemData);
                            }
                            
                            $scope.$apply(function () {
                                $scope.dataimport = [];
                                if(dataInsert.data.length > 0)
                                {
                                    angular.forEach(dataInsert.data, function (value,key) {
                                        var data_array = {};
                                        // data_array.product_Id =  value.C0.replace('	','').replace('"','').replace('"','').trim();
                                        // data_array.product_Name = value.C1.replace('	','').replace('	','').replace('"','').replace('"','').trim();
                                        // data_array.location_Name = value.C2.replace('	','').replace('	','').replace('"','').replace('"','').trim().toUpperCase();
                                        // data_array.qty = value.C3.replace('	','').replace('	','').replace('"','').replace('"','').replace(/[^0-9\.\-]+/g,'').trim();
                                        // data_array.min_Qty = value.C4.replace('	','').replace('	','').replace('"','').replace('"','').replace(/[^0-9\.\-]+/g,'').trim();
                                        // data_array.sale_Unit = value.C5.replace('	','').replace('	','').replace('"','').replace('"','').trim();
                                        // data_array.create_By = $scope.userName;
                                        data_array.product_Id =  value.C0.replaceAll(' ','').trim();
                                        data_array.product_Name = value.C1;
                                        data_array.location_Name = value.C2.replaceAll(' ','').trim();
                                        data_array.qty = value.C3.replace(/[^0-9\.\-]+/g,'').trim();
                                        data_array.min_Qty = value.C4.replace(/[^0-9\.\-]+/g,'').trim();
                                        data_array.sale_Unit = value.C5;
                                        data_array.create_By = $scope.userName;
                                        $scope.dataimport.push(data_array);
                                    });
                                }
                                $scope.fileName =  dataInsert.Import_FileName;
                            });
                        };
                      reader.onerror = function (ex) {
                        console.log(ex);
                      };
                      //reader.readAsArrayBuffer($scope.SelectedFile);
                    }
                  } 
                  else 
                  {
                    $window.alert("This browser does not support HTML5.");
                  }
                } 
                else 
                {
                  $window.alert("Please upload a valid xlsx file.");
                }
              };

              ////Save import
              $scope.saveimport = function() {
                var model = $scope.dataimport;
                $scope.validateMsg = "";

                if(model.filter( c => c.product_Id == "").length > 0)
                {
                    return dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Validate',
                        message: 'ProductId is required !!'
                    });
                }

                if(model.filter( c => c.location_Name == "").length > 0)
                {
                    return dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Validate',
                        message: 'Location is required !!'
                    });
                }

                if(model.filter( c => c.qty == "" || c.qty < 0).length > 0)
                {
                    return dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Validate',
                        message: 'Max_Qty is required !!'
                    });
                }

                if(model.filter( c => c.min_Qty == "" || c.min_Qty < 0).length > 0)
                {
                    return dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Validate',
                        message: 'Min_Qty is required !!'
                    });
                }

                dpMessageBox.confirm({
                    ok: 'Yes',
                    cancel: 'No',
                    title: 'ยืนยันข้อมูล',
                    message: 'คุณต้องการบันทึกข้อมูลใช่หรือไม่'
                }).then(function() {
                    pageLoading.show();
                    viewModel.saveimport(model).then(function success(res) {
                        pageLoading.hide();
                        if (res.data == "Done") {
                            defer.resolve('1');
                            $scope.filterModel = {};
                        }
                        else
                        {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'แจ้งเตือน',
                                message: res.data
                            })
                        }
                    }, function error(err) {
                        pageLoading.hide();
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'error',
                            message: err.Message.Message
                        })
                    });
                });
                
            }

            $scope.clear = function () {
                $scope.dataimport = [];
                $scope.fileName = "";
            }

            $scope.$watch("filterModel.product_Id + filterModel.product_Name", function () {
                if ($scope.filterModel.product_Index == "" || $scope.filterModel.product_Index == undefined) {
                  $scope.filterModel.product_Id = '';
                  $scope.filterModel.product_Name = '';
                  $scope.filterModel.sale_Unit = '';
                  $scope.filterModel.qty = '';
                  $scope.filterModel.min_Qty = '';
                  $scope.filterModel.location_Name = '';
                  $scope.filterModel.ProductConversion_Name = '';
                }
            });

            $scope.autoComplete = {
                SKU: "Autocomplete/autoSku",
                AutoLocation: "Autocomplete/autoLocation",
                AutoProduct: "Autocomplete/autoProduct",
                AutoProductId: "Autocomplete/autoProductId",
            };

            $scope.url = {
                Master: webServiceAPI.Master,
                Replenishment:webServiceAPI.Replenishment
            };
            
            var init = function() {
                $scope.userName = localStorageService.get('userTokenStorage');
                $scope.filterModel = {};
            };
            init();
        }
    })
})();