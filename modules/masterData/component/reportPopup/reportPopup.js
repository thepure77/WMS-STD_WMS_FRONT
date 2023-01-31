
(function () {
    'use strict'
    app.directive('reportPopup', ['ngAuthSettings', '$window', 'commonService', 'pageLoading', '$timeout',
        function (ngAuthSettings, $window, commonService, pageLoading, $timeout) {
            return {
                restrict: 'E',
                controllerAs: '$ctrl',
                templateUrl: "modules/masterData/component/reportPopup/reportPopup.html",
                scope: {
                    onShow: '=',
                    delegates: '=?',
                    invokes: '=?',
                    config: '=?'
                },
                controller: ['$scope', '$http', '$q', 'ngAuthSettings', '$state', 'pageLoading', '$window', 'commonService', '$timeout', '$translate', 'localStorageService', '$interval','reportFactory','$sce','webServiceAPI','dpMessageBox',
                    function ($scope, $http, $q, ngAuthSettings, $state, pageLoading, $window, commonService, $timeout, $translate, localStorageService, $interval,reportFactory,$sce,webServiceAPI,MessageBox) {
                        $scope.delegates = {};
                        $scope.invokes = $scope.invokes || {};
                        $scope.config = $scope.config || {};
                        var viewModel = reportFactory;

                        $scope.onShow = false;
                        $scope.onHide = function (param) {
                        };
                        $scope.onClose = function () {
                            $scope.onShow = false;
                        };
                        $scope.$watchCollection('onShow', function (newVal, oldVal) {
                            if (newVal !== oldVal) {
                            }
                        });
                        $scope.model = {
                            currentPage: 0,
                            numPerPage: 5,
                            totalRow: 0,
                            key: '',
                            advanceSearch: false
                        };
                        $scope.toggleSearch = function () {
                            $scope.model.advanceSearch = $scope.model.advanceSearch === false ? true : false;
                        };
                        $scope.delegates.search = function () {
                            if ($scope.model.advanceSearch)
                                $scope.filter();
                            else
                                $scope.find();
                        }
                        // $scope.delegates.reportPopup = function (index,name) {
                            
                        //     var data = {};
                        //     data.reportName = name
                        //     if(name == "pickingslip")
                        //         data.tagOutPickNo  = index
                        //     else if (name == "goodsreceiveNote")
                        //         data.goodsReceiveNo = index
                        //     else if (name == "loadmanifest")
                        //         data.truckLoadNo = index
                        //     else if (name == "blindLPNlabel")
                        //         data.blindLPNlabel = index
                        //     else if (name == "cartonlabel")
                        //         data.Reportcartonlabel = index

                        //     data.serviceType = "PDF";
                        //     //var url = webServiceAPI.Report + "Report/get2";
                        //     viewModel.gettest(data).then(function(result) {
                        //         debugger
                        //         var file = new Blob([result.data], {
                        //             type: "application/pdf"
                        //           });
                        //           var fileURL = URL.createObjectURL(file);
                        //           $scope.expdf = $sce.trustAsResourceUrl(fileURL);
                        //     //   var path = result.data.replace(
                        //     //     "C:\\inetpub\\wwwroot\\TOP_WMS",
                        //     //     "http:\\\\kascoit.ddns.net:99\\TOP_WMS\\"
                        //     //   );
                        //     //   $scope.expdf = $sce.trustAsResourceUrl(path);
                        //     });
                        // }
                        // $scope.delegates.reportPopup = function(result) {   
                        //     // var file = new Blob([result.data], {
                        //     //     type: "octet/stream"
                        //     //   });
                        //     //   var fileURL = URL.createObjectURL(file);
                        //     //   $scope.expdf = $sce.trustAsResourceUrl(fileURL);
                        // }

                        // $scope.delegates.reportPopup = function(index,name) {        
                        //     pageLoading.show();
                        //     $scope.criteriaView = {};
                        //     $scope.criteriaView.reportName = name;
                        //     if(name == "pickingslip")
                        //         $scope.criteriaView.tagOutPickNo  = index
                        //     else if (name == "goodsreceiveNote")
                        //         $scope.criteriaView.goodsReceiveNo = index
                        //     else if (name == "loadmanifest")
                        //         $scope.criteriaView.truckLoadNo = index
                        //     else if (name == "blindLPNlabel")
                        //         $scope.criteriaView.blindLPNlabel = index
                        //     else if (name == "cartonlabel")
                        //         $scope.criteriaView.Reportcartonlabel = index

                        //     $scope.criteriaView.serviceType = "PDF";
                        //     var url = webServiceAPI.Report + "Report/getreport";
                        //     var promise = $http.post(url, $scope.criteriaView, {
                        //       responseType: "arraybuffer"
                        //     });
                        //     promise
                        //       .then(
                        //         function success(result) {
                        //           if (result.status === 200) {
                        //               var file = new Blob([result.data], {
                        //                 type: "application/pdf"
                        //               });
                        //               var fileURL = URL.createObjectURL(file);
                        //               $scope.expdf = $sce.trustAsResourceUrl(fileURL);
                        //             pageLoading.hide();
                        //           } else {
                        //             MessageBox.alert({
                        //               titile: "Message",
                        //               message: "ไม่พบข้อมูล"
                        //             });
                        //             $scope.expdf ={};
                        //             pageLoading.hide();
                        //           }
                        //         },
                        //         function error(result) {
                        //           MessageBox.alert({
                        //             titile: "Message",
                        //             message: "ไม่พบข้อมูล"
                        //           });
                        //           $scope.expdf ={};
                        //           pageLoading.hide();
                        //         }
                        //       )
                        //       .catch(function(error) {
                        //         pageLoading.hide();
                        //       });
                        //   };
                        
                        $scope.delegates.reportPopup = function(result) {   
                            var file = new Blob([result.data], {
                                type: "application/pdf"
                            });
                            var fileURL = URL.createObjectURL(file);
                            $scope.expdf = $sce.trustAsResourceUrl(fileURL);
                        };

                        $scope.delegates.edit = function (index) { }
                        $scope.create = function () {
                            if ($scope.invokes.add != undefined)
                                $scope.invokes.add();
                        }
                        $scope.datalist = {
                            delegates: {},
                            config: {
                                paginations: {},
                                currentPage: $scope.model.currentPage,
                                numPerPage: $scope.model.numPerPage,
                                totalRow: 0,
                            },
                            items: {},
                            invokes: {
                                page: function (param) {
                                    $scope.shipTo = $scope.shipTo || {};
                                    $scope.shipTo.currentPage = param.currentPage;
                                    $scope.shipTo.numPerPage = param.numPerPage;
                                    $scope.search($scope.shipTo).then(function success(res) {
                                        $scope.datalist.config.paginations = res.data.pagination;
                                        $scope.datalist = res.data;
                                        if ($scope.datalist.delegates.set)
                                            $scope.datalist.delegates.set(res.data, res.data.pagination);
                                    }, function error(res) { });
                                },
                                delete: function (param) {
                                    if ($scope.invokes.delete != undefined)
                                        $scope.invokes.delete(param);
                                },
                                edit: function (param) {
                                    if ($scope.invokes.edit != undefined)
                                        $scope.invokes.edit(param);
                                },
                                selected: function (param) {
                                    if ($scope.invokes.selected != undefined)
                                        $scope.invokes.selected(param);
                                    $scope.onShow = false;
                                }
                            }
                        };
                        var init = function () {

                            $q.all([
                            ]).then(function (values) {
                                var results = values;
                            }, function (reasons) {
                                var results = reasons;
                            });
                        };

                        init();
                        // Local Function
                        // end
                    }
                ],
                link: function ($scope, $element, $attributes) { }
            };
        }
    ]);
}());
