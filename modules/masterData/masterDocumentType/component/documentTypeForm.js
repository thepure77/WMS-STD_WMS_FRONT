(function () {
    'use strict'

    app.component('masterDocumentTypeForm', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/masterData/masterDocumentType/component/documentTypeForm.html";
        },
        bindings: {
            onShow: '=?',
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?'
        },
        controller: function ($scope, $q, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, documentTypeFactory) {
            var $vm = this;

            $scope.onShow = false;
            var defer = {};
            var viewModel = documentTypeFactory;

            $scope.Cancel = true;
            $scope.update = false;
            $scope.create = true;
            $scope.getCheck = false;

            $vm.onShow = function (param) {
                defer = $q.defer();
                if ($scope.filterModel != null) {
                    $scope.filterModel = {};
                }
                $scope.onShow = true;
                if (param != undefined) {
                    pageLoading.show();
                    $scope.create = false;
                    viewModel.find(param.documentType_Index).then(function (res) {
                        pageLoading.hide();
                        $scope.filterModel = res.data;
                        $scope.update = true;
                        ConvertData();
                        if ($scope.filterModel.isActive == 0) {
                            $scope.getCheck = false;
                        } else {
                            $scope.getCheck = true;
                        }

                    });
                } else {
                    $scope.filterModel.documentType_Id = "";
                    $scope.update = false
                    $scope.create = true;
                    $scope.getCheck = true;
                    $scope.filterModel.isActive = 1;
                    $scope.actionFormat = "1";
                    $scope.actionFormatDoc1 = "0";
                    $scope.actionFormatDoc2 = "0";
                    $scope.actionFormatDoc3 = "0";
                    $scope.actionFormatRunning = "0";
                    $scope.disable1 = false;
                    $scope.disable2 = false;
                    $scope.disable3 = false;
                    $scope.s1 = true;
                    $scope.s2 = true;
                    $scope.s3 = true;
                }
                return defer.promise;
            };

            $vm.triggerSearch = function () {
                pageLoading.show();
                viewModel.filter($scope.filterModel).then(function (res) {
                    pageLoading.hide();
                    $vm.searchResultModel = res.data.itemsDocumentType;
                });
            };

            $scope.popupProcess = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {
                    $scope.popupProcess.onShow = !$scope.popupProcess.onShow;
                    $scope.popupProcess.delegates.processPopupV2(param, index);
                },
                config: {
                    title: "ProcessType"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.filterModel.process_Index = angular.copy(param.process_Index);
                        $scope.filterModel.process_Id = angular.copy(param.process_Id);
                        $scope.filterModel.process_Name = angular.copy(param.process_Name);
                        $scope.filterModel.key = angular.copy(param.process_Id) + " - " + angular.copy(param.process_Name);

                    }
                }
            };

            $scope.selectFormat = function () {
                var item = $scope.actionFormat;
                if (item != 1) {
                    $scope.filterModel.format_Date = item;
                }
            };
            $scope.selectFormatRunning = function () {
                var item = $scope.actionFormatRunning;
                if (item != 0) {
                    $scope.filterModel.format_Running = item;
                }
            };
            $scope.selectFormatDoc1 = function () {
                if ($scope.actionFormatDoc2 == "[Format_Text]" || $scope.actionFormatDoc3 == "[Format_Text]") {
                    $scope.s1 = false;
                } else {
                    $scope.s1 = true;
                }
                if ($scope.actionFormatDoc2 == "[Format_Date]" || $scope.actionFormatDoc3 == "[Format_Date]") {
                    $scope.s2 = false;
                } else {
                    $scope.s2 = true;
                }
                if ($scope.actionFormatDoc2 == "[Format_Running]" || $scope.actionFormatDoc3 == "[Format_Running]") {
                    $scope.s3 = false;
                } else {
                    $scope.s3 = true;
                }
                var item = $scope.actionFormatDoc1;
                if (item != 0) {
                    $scope.filterModel.formatDocument_1 = item;
                    if (item == "[Format_Text]") {
                        $scope.s1 = false;
                    }
                    if (item == "[Format_Date]") {
                        $scope.s2 = false;
                    }
                    if (item == "[Format_Running]") {
                        $scope.s3 = false;
                    }
                }
            };
            $scope.selectFormatDoc2 = function () {
                var item = $scope.actionFormatDoc2;

                if ($scope.actionFormatDoc1 == "[Format_Text]" || $scope.actionFormatDoc3 == "[Format_Text]") {
                    $scope.s1 = false;
                } else {
                    $scope.s1 = true;
                }
                if ($scope.actionFormatDoc1 == "[Format_Date]" || $scope.actionFormatDoc3 == "[Format_Date]") {
                    $scope.s2 = false;
                } else {
                    $scope.s2 = true;
                }
                if ($scope.actionFormatDoc1 == "[Format_Running]" || $scope.actionFormatDoc3 == "[Format_Running]") {
                    $scope.s3 = false;
                } else {
                    $scope.s3 = true;
                }
                if (item != 0) {
                    $scope.filterModel.formatDocument_2 = item;
                    if (item == "[Format_Text]") {
                        $scope.s1 = false;
                    }
                    if (item == "[Format_Date]") {
                        $scope.s2 = false;
                    }
                    if (item == "[Format_Running]") {
                        $scope.s3 = false;
                    }
                }
            };
            $scope.selectFormatDoc3 = function () {
                var item = $scope.actionFormatDoc3;

                if ($scope.actionFormatDoc1 == "[Format_Text]" || $scope.actionFormatDoc2 == "[Format_Text]") {
                    $scope.s1 = false;
                } else {
                    $scope.s1 = true;
                }
                if ($scope.actionFormatDoc1 == "[Format_Date]" || $scope.actionFormatDoc2 == "[Format_Date]") {
                    $scope.s2 = false;
                } else {
                    $scope.s2 = true;
                }
                if ($scope.actionFormatDoc1 == "[Format_Running]" || $scope.actionFormatDoc2 == "[Format_Running]") {
                    $scope.s3 = false;
                } else {
                    $scope.s3 = true;
                }
                if (item != 0) {
                    $scope.filterModel.formatDocument_3 = item;
                    if (item == "[Format_Text]") {
                        $scope.s1 = false;
                    }
                    if (item == "[Format_Date]") {
                        $scope.s2 = false;
                    }
                    if (item == "[Format_Running]") {
                        $scope.s3 = false;
                    }
                }
            };

            $scope.enableMe = false;
            $scope.detectcheck = function (item) {
                if (item == 1) {
                    if ($scope.filterModel.isResetByYear) {
                        $scope.filterModel.isResetByYear = true;
                    }

                    $scope.filterModel.isResetByMonth = false;
                    $scope.filterModel.isResetByDay = false;
                    $scope.disable2 = true;
                    $scope.disable3 = true;
                }
                if (item == 2) {
                    if ($scope.filterModel.isResetByMonth) {
                        $scope.filterModel.isResetByMonth = true;
                    }
                    $scope.filterModel.isResetByYear = false
                    $scope.filterModel.isResetByDay = false
                    $scope.disable1 = true;
                    $scope.disable3 = true;

                }
                if (item == 3) {
                    if ($scope.filterModel.isResetByDay) {
                        $scope.filterModel.isResetByDay = true;
                    }

                    $scope.filterModel.isResetByYear = false;
                    $scope.filterModel.isResetByMonth = false;
                    $scope.disable1 = true;
                    $scope.disable2 = true;
                }
                if ($scope.filterModel.isResetByYear != true && $scope.filterModel.isResetByMonth != true && $scope.filterModel.isResetByDay != true) {
                    $scope.disable1 = false;
                    $scope.disable2 = false;
                    $scope.disable3 = false;
                }
            }

            function ConvertData() {
                let param = $scope.filterModel;
                if ($scope.filterModel.isResetByYear == 1) {
                    $scope.filterModel.isResetByYear = true
                    $scope.detectcheck('1');
                }
                else {
                    $scope.filterModel.isResetByYear = false
                }

                if ($scope.filterModel.isResetByMonth == 1) {
                    $scope.filterModel.isResetByMonth = true
                    $scope.detectcheck('2');
                }
                else {
                    $scope.filterModel.isResetByMonth = false
                }

                if ($scope.filterModel.isResetByDay == 1) {
                    $scope.filterModel.isResetByDay = true
                    $scope.detectcheck('3');
                }
                else {
                    $scope.filterModel.isResetByDay = false
                }
                if (param.format_Date != null) {
                    $scope.actionFormat = param.format_Date;
                }
                if (param.format_Running != null) {
                    $scope.actionFormatRunning = param.format_Running;
                }
                if (param.format_Document != null) {
                    let str = param.format_Document.split(" ")
                    $scope.actionFormatDoc1 = str[0]
                    $scope.actionFormatDoc2 = str[1]
                    $scope.actionFormatDoc3 = str[2]
                }
            }

            function checkData(param) {
                if (param.formatDocument_1 && param.formatDocument_2 && param.formatDocument_3 != undefined) {
                    let formatDoc = param.formatDocument_1 + ' ' + param.formatDocument_2 + ' ' + param.formatDocument_3;
                    param.format_Document = formatDoc;
                }

                if (param.isResetByYear) {
                    param.isResetByYear = 1
                } else {
                    param.isResetByYear = 0
                };

                if (param.isResetByMonth) {
                    param.isResetByMonth = 1
                } else {
                    param.isResetByMonth = 0
                };

                if (param.isResetByDay) {
                    param.isResetByDay = 1
                } else {
                    param.isResetByDay = 0
                };

            };

            //Validate & confirm Add
            $scope.add = function () {
                console.log($scope.filterModel.isResetByYear);
                console.log($scope.filterModel.isResetByMonth);
                console.log($scope.filterModel.isResetByDay);
                var model = $scope.filterModel;
                //ใช้ userName จาก localStorage
                model.create_By = $scope.userName;
                $scope.validateMsg = "";
                if (model.documentType_Id != "") {
                    if (!model.documentType_Id.match(/^([a-z0-9])+$/i)) {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'แจ้งเตือน',
                            message: 'รหัสประเภทเอกสารไม่ถูกต้อง'
                        })
                        return "";
                    } else {
                        model.documentType_Id = model.documentType_Id;
                    }
                }
                if (model.documentType_Name == undefined || model.documentType_Name == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'แจ้งเตือน',
                        message: 'กรุณากรอกชื่อประเภทเอกสาร'
                    })
                    return "";
                }
                if (model.process_Index == undefined || model.process_Index == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'แจ้งเตือน',
                        message: 'กรุณาเลือกเมนู'
                    })
                    return "";
                } 
                if (model.format_Text == undefined || model.format_Text == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'แจ้งเตือน',
                        message: 'กรุณากรอกรูปแบบอักษร'
                    })
                    return "";
                }
                if ($scope.actionFormat == undefined || $scope.actionFormat == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'แจ้งเตือน',
                        message: 'Date is required !!'
                    })
                    return "";
                }
                if ($scope.actionFormatRunning == undefined || $scope.actionFormatRunning == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'แจ้งเตือน',
                        message: 'Running is required !!'
                    })
                    return "";
                }
                if ($scope.actionFormatDoc1 == undefined || $scope.actionFormatDoc1 == "0") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'แจ้งเตือน',
                        message: 'กรุณาเลือกรูปแบบเอกสาร'
                    })
                    return "";
                }
                if ($scope.actionFormatDoc2 == undefined || $scope.actionFormatDoc2 == "0") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'แจ้งเตือน',
                        message: 'กรุณาเลือกรูปแบบเอกสาร'
                    })
                    return "";
                }
                if ($scope.actionFormatDoc3 == undefined || $scope.actionFormatDoc3 == "0") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'แจ้งเตือน',
                        message: 'กรุณาเลือกรูปแบบเอกสาร'
                    })
                    return "";
                }
                if ($scope.filterModel.isResetByYear == undefined || $scope.filterModel.isResetByYear == null) {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'แจ้งเตือน',
                        message: 'กรุณาเลือกการตั้งใหม่โดย'
                    })
                    return "";
                }
                if ($scope.filterModel.isResetByMonth == undefined || $scope.filterModel.isResetByMonth == null) {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'แจ้งเตือน',
                        message: 'กรุณาเลือกการตั้งใหม่โดย'
                    })
                    return "";
                }
                if ($scope.filterModel.isResetByDay == undefined || $scope.filterModel.isResetByDay == null) {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'แจ้งเตือน',
                        message: 'กรุณาเลือกการตั้งใหม่โดย'
                    })
                    return "";
                }
                if ($scope.filterModel.isResetByDay == false && $scope.filterModel.isResetByMonth == false && $scope.filterModel.isResetByYear == false) {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'แจ้งเตือน',
                        message: 'กรุณาเลือกการตั้งใหม่โดย'
                    })
                    return "";
                }else {
                    dpMessageBox.confirm({
                        ok: 'Yes',
                        cancel: 'No',
                        title: 'ยืนยันข้อมูล',
                        message: 'คุณต้องการบันทึกข้อมูลใช่หรือไม่'
                    }).then(function () {
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
                                    message: 'รหัสประเภทเอกสารซ้ำ'
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
            $scope.back = function () {
                defer.resolve('1');
            }

            //function Add
            function Add(param) {
                var deferred = $q.defer();
                checkData(param);
                viewModel.SaveChangesDocumentType(param).then(
                    function success(results) {
                        deferred.resolve(results);
                    },
                    function error(response) {
                        deferred.resolve(response);
                    }
                );
                return deferred.promise;
            }


            var init = function () {
                $scope.userName = localStorageService.get('userTokenStorage');
                $scope.filterModel = {};
            };
            init();

        }
    })
})();












            // $vm.onShow = function (param) {
            //     defer = $q.defer();
            //     if ($scope.filterModel != null) {
            //         $scope.filterModel = {};
            //     }
            //     $scope.onShow = true;
            //     if (param != undefined) {
            //         pageLoading.show();
            //         $scope.create = false;
            //         viewModel.getId(param).then(function (res) {
            //             pageLoading.hide();
            //             $scope.filterModel = res.data[0];
            //             ConvertData();
            //             if ($scope.filterModel.formatDocument != null) {
            //                 let str = $scope.filterModel.formatDocument.split(" ")
            //                 $scope.filterModel.formatDocument_1 = str[0]
            //                 $scope.filterModel.formatDocument_2 = str[1]
            //                 $scope.filterModel.formatDocument_3 = str[2]
            //             }
            //             $scope.update = true;
            //         });
            //     }
            //     else {
            //         $scope.actionFormat = "1";
            //         $scope.actionFormatDoc1 = "0";  
            //         $scope.actionFormatDoc2 = "0";
            //         $scope.actionFormatDoc3 = "0";
            //         $scope.actionFormatRunning = "0";
            //         $scope.update = false
            //         $scope.create = true;
            //     }
            //     return defer.promise;
            // };
            // $vm.triggerSearch = function () {
            //     $vm.filterModel = $vm.filterModel || {};
            //     pageLoading.show();
            //     viewModel.filter().then(function (res) {
            //         pageLoading.hide();
            //         $vm.filterModel = res.data;
            //         $vm.searchResultModel = res.data;

            //     });
            // };

            // $scope.add = function () {
            //     var model = $scope.filterModel;
            //     $scope.validateMsg = "";
            //     validate(model).then(function (result) {
            //         if (result) {
            //             $scope.validateMsg = result;
            //             dpMessageBox.alert(
            //                 {
            //                     ok: 'Close',
            //                     title: 'Validate',
            //                     message: result
            //                 }
            //             )
            //         }
            //         else {
            //             dpMessageBox.confirm({
            //                 ok: 'Yes',
            //                 cancel: 'No',
            //                 title: 'Confirm ?',
            //                 message: 'Do you want to save !'
            //             }).then(function () {
            //                 pageLoading.show();

            //                 Add(model).then(function success(res) {
            //                     pageLoading.hide();
            //                     $state.reload($state.current.name);
            //                 }, function error(param) {
            //                     dpMessageBox.alert(param).then(function (param) { }, function (param) { });
            //                 });
            //             });

            //             defer.resolve();
            //         }
            //     })
            //     // $scope.filterModel = {};
            // }

            // $scope.edit = function () {
            //     var model = $scope.filterModel;
            //     $scope.validateMsg = "";
            //     validate(model).then(function (result) {
            //         if (result) {
            //             $scope.validateMsg = result;
            //             dpMessageBox.alert(
            //                 {
            //                     ok: 'Close',
            //                     title: 'Validate',
            //                     message: result
            //                 }
            //             )
            //         }
            //         else {
            //             dpMessageBox.confirm({
            //                 ok: 'Yes',
            //                 cancel: 'No',
            //                 title: 'Confirm ?',
            //                 message: 'Do you want to save !'
            //             }).then(function () {
            //                 pageLoading.show();                            
            //                 Edit(model).then(function success(res) {
            //                     pageLoading.hide();
            //                     $state.reload($state.current.name);
            //                 }, function error(param) {
            //                     dpMessageBox.alert(param).then(function (param) { }, function (param) { });
            //                 });
            //             });

            //             defer.resolve();
            //         }
            //     })
            // }

            // function validate(param) {
            //     let defer = $q.defer();
            //     let msg = "";
            //     if (param.processName == null) {
            //         msg = ' Process is required !'
            //         defer.resolve(msg);
            //     }
            //     else if (param.documentTypeName == null){
            //         msg = ' DocumentType Name is required !'
            //         defer.resolve(msg);
            //     }
            //     else if ( $scope.actionFormat == 1){
            //         msg = ' DateFormat is required !'
            //         defer.resolve(msg);
            //     }
            //     else if ( $scope.actionFormatRunning == 0){
            //         msg = ' Running  is required !'
            //         defer.resolve(msg);
            //     }
            //     else if ( $scope.actionFormatDoc1 == 0 || $scope.actionFormatDoc2 == 0 || $scope.actionFormatDoc3 == 0 ){
            //         msg = ' Format Document  is required !'
            //         defer.resolve(msg);
            //     }
                // if (param.workAreaIndex == dataList[i].workAreaIndex) {
                //     msg = 'WorkArea' + " " + param.workArea + ' Dupicated ! Choose New WorkArea'
                //     defer.resolve(msg);

                // }

            //     defer.resolve(msg);

            //     return defer.promise;
            // }
            // $scope.back = function () {
            //     defer.resolve('');
            // }
            // $scope.show = {
            //     main: true,
            //     transport: false,
            //     warehouse: false
            // };
            // $scope.buttons = {
            //     add: true,
            //     update: false,
            //     back: true
            // };
            // $scope.popupProcess = {
            //     onShow: false,
            //     delegates: {},
            //     onClick: function (param, index) {                    
            //         $scope.popupProcess.onShow = !$scope.popupProcess.onShow;
            //         $scope.popupProcess.delegates.processPopup(param, index);
            //     },
            //     config: {
            //         title: "ProcessType"
            //     },
            //     invokes: {
            //         add: function (param) { },
            //         edit: function (param) { },
            //         selected: function (param) {
            //             $scope.filterModel.processIndex = angular.copy(param.processIndex);
            //             $scope.filterModel.processId = angular.copy(param.processId);
            //             $scope.filterModel.processName = angular.copy(param.processId) + " - " + angular.copy(param.processName);

            //         }
            //     }
            // };
            // $scope.selectFormat = function () {
            //     var item = $scope.actionFormat;
            //     if (item != 1) {
            //         $scope.filterModel.formatDate = item;
            //     }
            // };
            // $scope.selectFormatRunning = function () {
            //     var item = $scope.actionFormatRunning;
            //     if (item != 0) {
            //         $scope.filterModel.formatRunning = item;
            //     }
            // };
            // $scope.selectFormatDoc1 = function () {
            //     var item = $scope.actionFormatDoc1;                
            //     if (item != 0) {
            //         $scope.filterModel.formatDocument_1 = item;
            //     }
            // };
            // $scope.selectFormatDoc2 = function () {
            //     var item = $scope.actionFormatDoc2;
            //     if (item != 0) {
            //         $scope.filterModel.formatDocument_2 = item;
            //     }
            // };
            // $scope.selectFormatDoc3 = function () {
            //     var item = $scope.actionFormatDoc3;
            //     if (item != 0) {
            //         $scope.filterModel.formatDocument_3 = item;
            //     }
            // };

            // $scope.enableMe = false;
            // $scope.detectcheck = function (item) {
            //     if (item == 1) {
            //         if ($scope.filterModel.isResetByYear) {
            //             $scope.filterModel.isResetByYear = true;
            //         }

            //         $scope.filterModel.isResetByMonth = false;
            //         $scope.filterModel.isResetByDay = false;
            //         $scope.disable2 = true;
            //         $scope.disable3 = true;
            //     }
            //     if (item == 2) {
            //         if ($scope.filterModel.isResetByMonth) {
            //             $scope.filterModel.isResetByMonth = true;
            //         }
            //         $scope.filterModel.isResetByYear = false
            //         $scope.filterModel.isResetByDay = false
            //         $scope.disable1 = true;
            //         $scope.disable3 = true;

            //     }
            //     if (item == 3) {
            //         if ($scope.filterModel.isResetByDay) {
            //             $scope.filterModel.isResetByDay = true;
            //         }

            //         $scope.filterModel.isResetByYear = false;
            //         $scope.filterModel.isResetByMonth = false;
            //         $scope.disable1 = true;
            //         $scope.disable2 = true;
            //     }
            //     if ($scope.filterModel.isResetByYear != true && $scope.filterModel.isResetByMonth != true && $scope.filterModel.isResetByDay != true) {
            //         $scope.disable1 = false;
            //         $scope.disable2 = false;
            //         $scope.disable3 = false;
            //     }

            // }
            // function ConvertData() {
            //     let param = $scope.filterModel;
            //     if ($scope.filterModel.isResetByYear == 1) {
            //         $scope.filterModel.isResetByYear = true
            //     }
            //     else {
            //         $scope.filterModel.isResetByYear = false
            //     }

            //     if ($scope.filterModel.isResetByMonth == 1) {
            //         $scope.filterModel.isResetByMonth = true
            //     }
            //     else {
            //         $scope.filterModel.isResetByMonth = false
            //     }

            //     if ($scope.filterModel.isResetByDay == 1) {
            //         $scope.filterModel.isResetByDay = true
            //     }
            //     else {
            //         $scope.filterModel.isResetByDay = false
            //     }
            //     if (param.formatDate != null) {
            //         $scope.actionFormat = param.formatDate;
            //     }
            //     if (param.formatRunning != null) {
            //         $scope.actionFormatRunning = param.formatRunning;
            //     }
            //     if (param.formatDocument != null) {
            //         let str = param.formatDocument.split(" ")
            //         $scope.actionFormatDoc1 = str[0]
            //         $scope.actionFormatDoc2 = str[1]
            //         $scope.actionFormatDoc3 = str[2]
            //     }

            // }
            // function checkData(param) {
            //     if (param.formatDocument_1 && param.formatDocument_2 && param.formatDocument_3 != undefined) {
            //         let formatDoc = param.formatDocument_1 + ' ' + param.formatDocument_2 + ' ' + param.formatDocument_3;
            //         param.formatDocument = formatDoc;
            //     }

            //     if (param.isResetByYear) {
            //         param.isResetByYear = 1
            //     } else {
            //         param.isResetByYear = 0
            //     };

            //     if (param.isResetByMonth) {
            //         param.isResetByMonth = 1
            //     } else {
            //         param.isResetByMonth = 0
            //     };

            //     if (param.isResetByDay) {
            //         param.isResetByDay = 1
            //     } else {
            //         param.isResetByDay = 0
            //     };

            // };

            // function Add(param) {
            //     let deferred = $q.defer();
            //     checkData(param);
            //     viewModel.add(param).then(
            //         function success(results) {
            //             deferred.resolve(results);
            //         },
            //         function error(response) {
            //             deferred.reject(response);
            //         }
            //     );
            //     return deferred.promise;
            // }
            // function Edit(param) {
            //     var deferred = $q.defer();
            //     checkData(param);
            //     viewModel.edit(param).then(
            //         function success(results) {
            //             $state.reload($state.current.name);
            //             deferred.resolve(results);
            //         },
            //         function error(response) {
            //             deferred.reject(response);
            //         }
            //     );
            //     return deferred.promise;
            // }
            // var init = function () {

            //     $scope.filterModel = {};
            // };
            // init();
//         }
//     })
// })();