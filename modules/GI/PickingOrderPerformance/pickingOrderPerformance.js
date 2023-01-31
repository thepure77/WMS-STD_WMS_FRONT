(function () {
    'use strict'

    app.component('pickingOrderPerformance', {
        controllerAs: '$vm',
        templateUrl: "modules/GI/PickingOrderPerformance/pickingOrderPerformance.html",
        controller: function ($scope, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, $q, dpMessageBox, pickingOrderFactory) {
            
            var service = pickingOrderFactory;

            $scope.model = {};

            $scope.search = function () {
                pageLoading.show();

                // $scope.model = testdata();

                service.pickingPerformanceSearch($scope.filterModel).then(function (res) {
                    
                    $scope.model = res.data;
                    // pageLoading.hide();
                }).catch(function () {
                    // pageLoading.hide();
                    dpMessageBox.alert({
                        ok: 'OK',
                        titile: 'Error',
                        message: "Page load failed."
                    });
                });
            }

            $scope.refresh_Sec = function () {
                clearTimeout(_refresh);
                _refresh = setInterval(function(){ $scope.search(); }, $scope.refreshSec * 1000);
            }

            var _clock = setInterval(function () {
                function r(el, deg) {
                    el.setAttribute('transform', 'rotate(' + deg + ' 50 50)')
                }
                var d = new Date()
                r(sec, 6 * d.getSeconds())
                r(min, 6 * d.getMinutes())
                r(hour, 30 * (d.getHours() % 12) + d.getMinutes() / 2)
            }, 1000)

            var _refresh = setInterval(function(){ $scope.search(); }, 60000);

            $scope.$on('$destroy', function() {
                clearTimeout(_refresh);
                clearTimeout(_clock);
            });

            $scope.$watch('filterModel.PickDate', function (value) {
                $scope.search();
            });

            function init() {
                $scope.filterModel = {
                    PickDate: $filter('date')(new Date(),'yyyyMMdd'), //'20190212'
                    PickTime: ''
                };

                service.RoundList().then(function success(res) {
                    $scope.RoundList = res.data;
                });

                $scope.refreshSec = "60";
            }
            init();



            function testdata(){
                return {
                    "pickDate": "20200226",
                    "pickTime": "รอบที่ 1",
                    "orderQty": 119,
                    "pickingRouteViewModel": [
                      {
                        "route": "สายเกษตร",
                        "routeOrderQty": 17,
                        "pickingRouteOrderViewModel": [
                          {
                            "order": "6792",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200216792",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          },
                          {
                            "order": "7445",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200217445",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          },
                          {
                            "order": "7615",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200217615",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          },
                          {
                            "order": "7633",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200217633",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          },
                          {
                            "order": "7643",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200217643",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          },
                          {
                            "order": "7682",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200217682",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          },
                          {
                            "order": "7685",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200217685",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          },
                          {
                            "order": "7694",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200217694",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          },
                          {
                            "order": "7704",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200217704",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          },
                          {
                            "order": "7711",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200217711",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          },
                          {
                            "order": "7712",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200217712",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          },
                          {
                            "order": "7730",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200217730",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          },
                          {
                            "order": "7736",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200217736",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          },
                          {
                            "order": "7769",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200217769",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          },
                          {
                            "order": "7786",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200217786",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          },
                          {
                            "order": "7865",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200217865",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          },
                          {
                            "order": "R15372",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "R1FC432200215372",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          }
                        ],
                        "pickingRouteOrderViewModel2": [],
                        "udF_3": null,
                        "seq": null,
                        "routeTime": null
                      },
                      {
                        "route": "สายดินแดง",
                        "routeOrderQty": 17,
                        "pickingRouteOrderViewModel": [
                          {
                            "order": "4318",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200214318",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          },
                          {
                            "order": "6113",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200216113",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          },
                          {
                            "order": "6116",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200216116",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          },
                          {
                            "order": "6119",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200216119",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          },
                          {
                            "order": "6122",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200216122",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          },
                          {
                            "order": "6124",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200216124",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          },
                          {
                            "order": "6126",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200216126",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          },
                          {
                            "order": "6131",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200216131",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          },
                          {
                            "order": "6133",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200216133",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          },
                          {
                            "order": "6136",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200216136",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          },
                          {
                            "order": "6137",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200216137",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          },
                          {
                            "order": "6139",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200216139",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          },
                          {
                            "order": "6403",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200216403",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          },
                          {
                            "order": "6437",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200216437",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          },
                          {
                            "order": "6446",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200216446",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          },
                          {
                            "order": "R13164",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "R1FC432200213164",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          },
                          {
                            "order": "R15455",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "R1FC432200215455",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          }
                        ],
                        "pickingRouteOrderViewModel2": [],
                        "udF_3": null,
                        "seq": null,
                        "routeTime": null
                      },
                      {
                        "route": "สายพระประแดง",
                        "routeOrderQty": 6,
                        "pickingRouteOrderViewModel": [
                          {
                            "order": "4500",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200214500",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          },
                          {
                            "order": "8396",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200218396",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          },
                          {
                            "order": "8648",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200218648",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          },
                          {
                            "order": "8695",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200218695",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          },
                          {
                            "order": "8745",
                            "overallStatus": "6",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200218745",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          },
                          {
                            "order": "8967",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200218967",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          }
                        ],
                        "pickingRouteOrderViewModel2": [],
                        "udF_3": null,
                        "seq": null,
                        "routeTime": null
                      },
                      {
                        "route": "สายสุขุมวิท (พระราม 3)",
                        "routeOrderQty": 22,
                        "pickingRouteOrderViewModel": [
                          {
                            "order": "7341",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200217341",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          },
                          {
                            "order": "7599",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200217599",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          },
                          {
                            "order": "7605",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200217605",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          },
                          {
                            "order": "7716",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200217716",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          },
                          {
                            "order": "7729",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200217729",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          },
                          {
                            "order": "7751",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200217751",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          },
                          {
                            "order": "7795",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200217795",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          },
                          {
                            "order": "7801",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200217801",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          },
                          {
                            "order": "7819",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200217819",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          },
                          {
                            "order": "7898",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200217898",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          },
                          {
                            "order": "7928",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200217928",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          },
                          {
                            "order": "7945",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200217945",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          },
                          {
                            "order": "7976",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200217976",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          },
                          {
                            "order": "8040",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200218040",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          },
                          {
                            "order": "8082",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200218082",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          },
                          {
                            "order": "8118",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200218118",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          },
                          {
                            "order": "8150",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200218150",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          },
                          {
                            "order": "8152",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200218152",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          },
                          {
                            "order": "8164",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200218164",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          },
                          {
                            "order": "8165",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200218165",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          },
                          {
                            "order": "8178",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200218178",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          },
                          {
                            "order": "8181",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200218181",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          }
                        ],
                        "pickingRouteOrderViewModel2": [],
                        "udF_3": null,
                        "seq": null,
                        "routeTime": null
                      },
                      {
                        "route": "สายพระรามสอง",
                        "routeOrderQty": 10,
                        "pickingRouteOrderViewModel": [
                          {
                            "order": "7586",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200217586",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          },
                          {
                            "order": "8347",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200218347",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          },
                          {
                            "order": "8388",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200218388",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          },
                          {
                            "order": "8433",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200218433",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          },
                          {
                            "order": "8466",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200218466",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          },
                          {
                            "order": "8468",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200218468",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          },
                          {
                            "order": "8517",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200218517",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          },
                          {
                            "order": "8533",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200218533",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          },
                          {
                            "order": "8536",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200218536",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          },
                          {
                            "order": "8551",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200218551",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          }
                        ],
                        "pickingRouteOrderViewModel2": [],
                        "udF_3": null,
                        "seq": null,
                        "routeTime": null
                      },
                      {
                        "route": "สายบางรัก",
                        "routeOrderQty": 18,
                        "pickingRouteOrderViewModel": [
                          {
                            "order": "7627",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200217627",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          },
                          {
                            "order": "7934",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200217934",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          },
                          {
                            "order": "7948",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200217948",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          },
                          {
                            "order": "8007",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200218007",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          },
                          {
                            "order": "8008",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200218008",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          },
                          {
                            "order": "8010",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200218010",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          },
                          {
                            "order": "8011",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200218011",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          },
                          {
                            "order": "8052",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200218052",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          },
                          {
                            "order": "8069",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200218069",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          },
                          {
                            "order": "8084",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200218084",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          },
                          {
                            "order": "8094",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200218094",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          },
                          {
                            "order": "8195",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200218195",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          },
                          {
                            "order": "R17598",
                            "overallStatus": "6",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "1"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "1"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "1"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "1"
                              }
                            ],
                            "planGoodsIssue_No": "R1FC432200217598",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          },
                          {
                            "order": "R17776",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "R1FC432200217776",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          },
                          {
                            "order": "R17813",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "R1FC432200217813",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          },
                          {
                            "order": "R17820",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "R1FC432200217820",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          },
                          {
                            "order": "R17827",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "R1FC432200217827",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          },
                          {
                            "order": "R25708",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "R2FC432200215708",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          }
                        ],
                        "pickingRouteOrderViewModel2": [],
                        "udF_3": null,
                        "seq": null,
                        "routeTime": null
                      },
                      {
                        "route": "สายพระนคร",
                        "routeOrderQty": 10,
                        "pickingRouteOrderViewModel": [
                          {
                            "order": "5596",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200215596",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          },
                          {
                            "order": "7559",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200217559",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          },
                          {
                            "order": "7642",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200217642",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          },
                          {
                            "order": "7659",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200217659",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          },
                          {
                            "order": "7826",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200217826",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          },
                          {
                            "order": "7836",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200217836",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          },
                          {
                            "order": "7890",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200217890",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          },
                          {
                            "order": "8060",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200218060",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          },
                          {
                            "order": "8098",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200218098",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          },
                          {
                            "order": "8218",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200218218",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          }
                        ],
                        "pickingRouteOrderViewModel2": [],
                        "udF_3": null,
                        "seq": null,
                        "routeTime": null
                      },
                      {
                        "route": "สายสาทร",
                        "routeOrderQty": 19,
                        "pickingRouteOrderViewModel": [
                          {
                            "order": "7435",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200217435",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          },
                          {
                            "order": "8130",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200218130",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          },
                          {
                            "order": "8355",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200218355",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          },
                          {
                            "order": "8373",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200218373",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          },
                          {
                            "order": "8406",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200218406",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          },
                          {
                            "order": "8429",
                            "overallStatus": "6",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "1"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "1"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "1"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "1"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200218429",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          },
                          {
                            "order": "8430",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200218430",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          },
                          {
                            "order": "8480",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200218480",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          },
                          {
                            "order": "8507",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200218507",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          },
                          {
                            "order": "8563",
                            "overallStatus": "6",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "1"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "1"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "1"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "1"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200218563",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          },
                          {
                            "order": "8589",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200218589",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          },
                          {
                            "order": "8645",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200218645",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          },
                          {
                            "order": "8663",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200218663",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          },
                          {
                            "order": "8668",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200218668",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          },
                          {
                            "order": "8712",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200218712",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          },
                          {
                            "order": "8725",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200218725",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          },
                          {
                            "order": "8772",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200218772",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          },
                          {
                            "order": "8778",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200218778",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          },
                          {
                            "order": "R18563",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "R1FC432200218563",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": "Normal"
                          }
                        ],
                        "pickingRouteOrderViewModel2": [],
                        "udF_3": null,
                        "seq": null,
                        "routeTime": null
                      },
                      {
                        "route": "สายอื่นๆ",
                        "routeOrderQty": 0,
                        "pickingRouteOrderViewModel": [
                          {
                            "order": null,
                            "overallStatus": null,
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": null,
                            "roundName": null,
                            "udf_2": null,
                            "documentType_Id": null
                          }
                        ],
                        "pickingRouteOrderViewModel2": [],
                        "udF_3": null,
                        "seq": null,
                        "routeTime": null
                      },
                      {
                        "route": "EXPRESS",
                        "routeOrderQty": 91,
                        "pickingRouteOrderViewModel": [
                          {
                            "order": "9032",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200219032",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": null
                          },
                          {
                            "order": "9038",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200219038",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": null
                          },
                          {
                            "order": "9039",
                            "overallStatus": null,
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "2"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200219039",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": null
                          },
                          {
                            "order": "9052",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200219052",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": null
                          },
                          {
                            "order": "9072",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200219072",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": null
                          },
                          {
                            "order": "9078",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200219078",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": null
                          },
                          {
                            "order": "9092",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200219092",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": null
                          },
                          {
                            "order": "9108",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200219108",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": null
                          },
                          {
                            "order": "9109",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200219109",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": null
                          },
                          {
                            "order": "9111",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200219111",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": null
                          },
                          {
                            "order": "9119",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200219119",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": null
                          },
                          {
                            "order": "9140",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200219140",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": null
                          },
                          {
                            "order": "9165",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200219165",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": null
                          },
                          {
                            "order": "9178",
                            "overallStatus": "2",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200219178",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": null
                          },
                          {
                            "order": "9199",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200219199",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": null
                          },
                          {
                            "order": "9232",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200219232",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": null
                          },
                          {
                            "order": "9235",
                            "overallStatus": "2",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200219235",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": null
                          },
                          {
                            "order": "9265",
                            "overallStatus": "2",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200219265",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": null
                          },
                          {
                            "order": "9269",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200219269",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": null
                          },
                          {
                            "order": "9281",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200219281",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": null
                          },
                          {
                            "order": "9283",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200219283",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": null
                          },
                          {
                            "order": "9289",
                            "overallStatus": "2",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200219289",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": null
                          },
                          {
                            "order": "9293",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200219293",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": null
                          },
                          {
                            "order": "9294",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200219294",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": null
                          },
                          {
                            "order": "9297",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200219297",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": null
                          },
                          {
                            "order": "9305",
                            "overallStatus": "6",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200219305",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": null
                          },
                          {
                            "order": "9323",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200219323",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": null
                          },
                          {
                            "order": "9328",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200219328",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": null
                          },
                          {
                            "order": "9330",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200219330",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": null
                          },
                          {
                            "order": "9350",
                            "overallStatus": "2",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200219350",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": null
                          },
                          {
                            "order": "9355",
                            "overallStatus": "2",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200219355",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": null
                          },
                          {
                            "order": "9357",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200219357",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": null
                          },
                          {
                            "order": "9358",
                            "overallStatus": "7",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200219358",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": null
                          },
                          {
                            "order": "9360",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200219360",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": null
                          },
                          {
                            "order": "9361",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200219361",
                            "roundName": null,
                            "udf_2": "Y",
                            "documentType_Id": null
                          },
                          {
                            "order": "9364",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200219364",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": null
                          },
                          {
                            "order": "9366",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200219366",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": null
                          },
                          {
                            "order": "9369",
                            "overallStatus": null,
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "2"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200219369",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": null
                          },
                          {
                            "order": "9373",
                            "overallStatus": "6",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200219373",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": null
                          },
                          {
                            "order": "9375",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200219375",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": null
                          },
                          {
                            "order": "9405",
                            "overallStatus": "2",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200219405",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": null
                          },
                          {
                            "order": "9418",
                            "overallStatus": "2",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200219418",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": null
                          },
                          {
                            "order": "9419",
                            "overallStatus": "2",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200219419",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": null
                          },
                          {
                            "order": "9421",
                            "overallStatus": "2",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200219421",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": null
                          },
                          {
                            "order": "9427",
                            "overallStatus": "2",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200219427",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": null
                          },
                          {
                            "order": "9431",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200219431",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": null
                          },
                          {
                            "order": "9432",
                            "overallStatus": "6",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200219432",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": null
                          },
                          {
                            "order": "9460",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200219460",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": null
                          },
                          {
                            "order": "9481",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200219481",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": null
                          },
                          {
                            "order": "9492",
                            "overallStatus": "2",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200219492",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": null
                          },
                          {
                            "order": "9494",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200219494",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": null
                          },
                          {
                            "order": "9499",
                            "overallStatus": "2",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200219499",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": null
                          },
                          {
                            "order": "9515",
                            "overallStatus": null,
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "2"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200219515",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": null
                          },
                          {
                            "order": "9520",
                            "overallStatus": "2",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200219520",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": null
                          },
                          {
                            "order": "9532",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200219532",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": null
                          },
                          {
                            "order": "9543",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200219543",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": null
                          },
                          {
                            "order": "9544",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200219544",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": null
                          },
                          {
                            "order": "9546",
                            "overallStatus": "2",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200219546",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": null
                          },
                          {
                            "order": "9553",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200219553",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": null
                          },
                          {
                            "order": "9556",
                            "overallStatus": "2",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200219556",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": null
                          },
                          {
                            "order": "9558",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200219558",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": null
                          },
                          {
                            "order": "9568",
                            "overallStatus": null,
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "2"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200219568",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": null
                          },
                          {
                            "order": "9592",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200219592",
                            "roundName": null,
                            "udf_2": "Y",
                            "documentType_Id": null
                          },
                          {
                            "order": "9594",
                            "overallStatus": null,
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "2"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200219594",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": null
                          },
                          {
                            "order": "9601",
                            "overallStatus": null,
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "4"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200219601",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": null
                          },
                          {
                            "order": "9618",
                            "overallStatus": null,
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "2"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "2"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200219618",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": null
                          },
                          {
                            "order": "9628",
                            "overallStatus": null,
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "2"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "2"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "4"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200219628",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": null
                          },
                          {
                            "order": "9633",
                            "overallStatus": null,
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "2"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "2"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200219633",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": null
                          },
                          {
                            "order": "9637",
                            "overallStatus": null,
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "2"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "2"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200219637",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": null
                          },
                          {
                            "order": "9650",
                            "overallStatus": "2",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200219650",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": null
                          },
                          {
                            "order": "9652",
                            "overallStatus": null,
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "2"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200219652",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": null
                          },
                          {
                            "order": "9663",
                            "overallStatus": null,
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "2"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "2"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200219663",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": null
                          },
                          {
                            "order": "9670",
                            "overallStatus": null,
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "2"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200219670",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": null
                          },
                          {
                            "order": "9677",
                            "overallStatus": "2",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "3"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200219677",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": null
                          },
                          {
                            "order": "9689",
                            "overallStatus": null,
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "2"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200219689",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": null
                          },
                          {
                            "order": "9693",
                            "overallStatus": null,
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "2"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "2"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "2"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200219693",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": null
                          },
                          {
                            "order": "9704",
                            "overallStatus": null,
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "1"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "1"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "1"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "1"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200219704",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": null
                          },
                          {
                            "order": "9708",
                            "overallStatus": null,
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "1"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "1"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "1"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "1"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200219708",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": null
                          },
                          {
                            "order": "9710",
                            "overallStatus": null,
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "1"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "1"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "1"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "1"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200219710",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": null
                          },
                          {
                            "order": "9720",
                            "overallStatus": null,
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "1"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "1"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "1"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "1"
                              }
                            ],
                            "planGoodsIssue_No": "FC432200219720",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": null
                          },
                          {
                            "order": "R18497",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "R1FC432200218497",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": null
                          },
                          {
                            "order": "R18543",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "R1FC432200218543",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": null
                          },
                          {
                            "order": "R18556",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "R1FC432200218556",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": null
                          },
                          {
                            "order": "R18596",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "R1FC432200218596",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": null
                          },
                          {
                            "order": "R18897",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "R1FC432200218897",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": null
                          },
                          {
                            "order": "R18902",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "R1FC432200218902",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": null
                          },
                          {
                            "order": "R18919",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "R1FC432200218919",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": null
                          },
                          {
                            "order": "R18925",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "R1FC432200218925",
                            "roundName": null,
                            "udf_2": "Y",
                            "documentType_Id": null
                          },
                          {
                            "order": "R18927",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "R1FC432200218927",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": null
                          },
                          {
                            "order": "R18944",
                            "overallStatus": "3",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "-"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "5"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "-"
                              }
                            ],
                            "planGoodsIssue_No": "R1FC432200218944",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": null
                          },
                          {
                            "order": "R19358",
                            "overallStatus": "6",
                            "pickingRouteOrderDetailViewModel": [
                              {
                                "zone": "A",
                                "pickingStatus": "1"
                              },
                              {
                                "zone": "B",
                                "pickingStatus": "1"
                              },
                              {
                                "zone": "C",
                                "pickingStatus": "1"
                              },
                              {
                                "zone": "F",
                                "pickingStatus": "1"
                              }
                            ],
                            "planGoodsIssue_No": "R1FC432200219358",
                            "roundName": null,
                            "udf_2": "",
                            "documentType_Id": null
                          }
                        ],
                        "pickingRouteOrderViewModel2": [],
                        "udF_3": null,
                        "seq": null,
                        "routeTime": null
                      }
                    ]
                  }
            }
        }
    })
})();