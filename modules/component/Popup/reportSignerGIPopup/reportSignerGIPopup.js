
(function () {
    'use strict'
    app.directive('reportSignerGIPopup', function () {
        return {
            restrict: 'E',
            controllerAs: '$ctrl',
            templateUrl: "modules/component/Popup/reportSignerGIPopup/reportSignerGIPopup.html",
            scope: {
                delegates: '=',
                invokes: '=',
                config: '=',
                paginations: '=?',
                onShow: '='
            },
            controller: ['$scope', 'commonService', '$filter', 'dpMessageBox','webServiceAPI','goodIssueFactory', function ($scope, commonService, $filter, dpMessageBox,webServiceAPI,goodIssueFactory) {
                $scope.invokes = $scope.invokes || {};
                $scope.config = $scope.config || {};
                $scope.config.paginations = $scope.config.paginations || {};
                $scope.items = $scope.items || [];
                $scope.onShow = false;
                var viewModel = goodIssueFactory;
                $scope.pageMode = 'Implement your config !';
                $scope.delegate = {
                    set: function (model) {
                        $scope.items = model;
                        viewModel.findUser($scope.items).then(function success(res) {
                            if (res.data.length < 0) {

                                $scope.items.isRecipent = false;
                                $scope.items.recipent_Name = null;
                                $scope.items.recipent_pos_Name =  null;

                                $scope.items.isRecorder = false;
                                $scope.items.recorder_Name =  null;
                                $scope.items.recorder_pos_Name = null;

                                $scope.items.isDemand_Payment = false;
                                $scope.items.demand_Payment_Name = null;
                                $scope.items.demand_Payment_pos_Name =  null;

                                $scope.items.isPayment = false;
                                $scope.items.payment_Name =  null;
                                $scope.items.payment_pos_Name = null;
                            }
                            else {
                                var listModel = res.data;
                                const resultRecipent= listModel.find(c => c.signatoryType_Name == 'recipent');
                                const resultRecorder = listModel.find(c => c.signatoryType_Name == 'recorder');
                                const resultDemand_Payment = listModel.find(c => c.signatoryType_Name == 'demand_Payment');
                                const resultPayment = listModel.find(c => c.signatoryType_Name == 'payment');

                                if (resultRecipent != undefined) {
                                    $scope.items.recipent_Name = resultRecipent.first_Name;
                                    $scope.items.recipent_pos_Name = resultRecipent.position_Name;

                                }

                                if (resultRecorder != undefined) {
                                    $scope.items.recorder_Name = resultRecorder.first_Name;
                                    $scope.items.recorder_pos_Name = resultRecorder.position_Name;
                                }


                                if (resultDemand_Payment != undefined) {
                                    $scope.items.demand_Payment_Name = resultDemand_Payment.first_Name;
                                    $scope.items.demand_Payment_pos_Name = resultDemand_Payment.position_Name;
                                }

                                if (resultPayment != undefined) {
                                    $scope.items.payment_Name = resultPayment.first_Name;
                                    $scope.items.payment_pos_Name = resultPayment.position_Name;
                                }
                            }

                        }, function error(res) { });
                    },
                    filter: function (model) {
                        $scope.items = model.dataModel;
                    },
                    delete: function (index) { },
                    selected: function (index) { },
                    edit: function (index) { },
                    add: function (model) {
                        var a = eFindItem({ items: $scope.items, filed: 'id', value: model.id });
                        if (!xObj.IsArray($scope.items)) {
                            $scope.items = [];
                        }
                        if (a == null)
                            $scope.items.push(model);
                    }
                };
                $scope.delegates = $scope.delegate;
                $scope.Yes = function () {
                    // if (!$scope.items.isRecipent && !$scope.items.isRecorder) {
                    //     return   dpMessageBox.alert({
                    //         title: 'Information.',
                    //         message: "กรุณนาเลือกข้อมูล"
                    //     })
                    // }
                    $scope.onShow = false;
                    debugger
                    if ($scope.invokes.selected)
                        $scope.invokes.selected($scope.items);
                }
                $scope.onClose = function (param) {
                    var a = $scope.items;
                    $scope.onShow = false;
                };
                var init = function () {
                    $scope.items = {};
                    $scope.items.isRecipent = false;
                    $scope.items.isRecorder = false;
                }

                $scope.autoComplete = {
                    username: "Autocomplete/autoUserName",
                };

                $scope.url = {
                    master: webServiceAPI.Master
                };

           
                $scope.$watch("items.demand_Payment_Name", function () {
                    if (!$scope.items.demand_Payment_Name) {
                        $scope.items.demand_Payment_pos_Name = "";
                    }
                });

             
                $scope.$watch("items.payment_Name", function () {
                    if (!$scope.items.payment_Name) {
                        $scope.items.payment_pos_Name = "";
                    }
                });

            
                $scope.$watch("items.recipent_Name", function () {
                    if (!$scope.items.recipent_Name) {
                        $scope.items.recipent_pos_Name = "";
                    }
                });

                $scope.$watch("items.recorder_Name", function () {
                    if (!$scope.items.recorder_Name) {
                        $scope.items.recorder_pos_Name = "";
                    }
                });

                init();

            }],
            link: function ($scope, $element, $attributes) { }
        }
    });
}());
