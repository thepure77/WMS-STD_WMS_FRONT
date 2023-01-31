
(function () {
    'use strict'
    app.directive('reportSignerPGIPopup', function () {
        return {
            restrict: 'E',
            controllerAs: '$ctrl',
            templateUrl: "modules/component/Popup/reportSignerPGIPopup/reportSignerPGIPopup.html",
            scope: {
                delegates: '=',
                invokes: '=',
                config: '=',
                paginations: '=?',
                onShow: '='
            },
            controller: ['$scope', 'commonService', '$filter', 'dpMessageBox', 'webServiceAPI', 'planGoodsIssueFactory', function ($scope, commonService, $filter, dpMessageBox, webServiceAPI, planGoodsIssueFactory) {
                $scope.invokes = $scope.invokes || {};
                $scope.config = $scope.config || {};
                $scope.config.paginations = $scope.config.paginations || {};
                $scope.items = $scope.items || [];
                $scope.onShow = false;
                var viewModel = planGoodsIssueFactory;
                $scope.pageMode = 'Implement your config !';
                $scope.delegate = {
                    set: function (model) {
                        $scope.items = model;


                        viewModel.findUser($scope.items).then(function success(res) {
                            if (res.data.length < 0) {
                                $scope.items.isRepresentative = false;
                                $scope.items.representative_Name = null;

                                $scope.items.isEndorser = false;
                                $scope.items.endorser_Name = null;
                                $scope.items.endorser_pos_Name = null;

                                $scope.items.isTransferor = false;
                                $scope.items.transferor_Name = null;
                                $scope.items.transferor_pos_Name = null;

                                $scope.items.isTransfer_Approver = false;
                                $scope.items.transfer_Approver_Name = null;
                                $scope.items.transfer_Approver_pos_Name = null;

                                $scope.items.isRecorder = false;
                                $scope.items.recorder_Name = null;
                                $scope.items.recorder_pos_Name = null;
                            }
                            else {
                                var listModel = res.data;
                                const resultRepresentative = listModel.find(c => c.signatoryType_Name == 'representative');
                                const resultEndorser = listModel.find(c => c.signatoryType_Name == 'endorser');
                                const resultTransferor = listModel.find(c => c.signatoryType_Name == 'transferor');
                                const resultTransfer_Approver = listModel.find(c => c.signatoryType_Name == 'transfer_Approver');
                                const resultRecorder = listModel.find(c => c.signatoryType_Name == 'recorder');

                                if (resultRepresentative != undefined) {
                                    $scope.items.representative_Name = resultRepresentative.first_Name;
                                }

                                if (resultEndorser != undefined) {
                                    $scope.items.endorser_Name = resultEndorser.first_Name;
                                    $scope.items.endorser_pos_Name = resultEndorser.position_Name;
                                }


                                if (resultTransferor != undefined) {
                                    $scope.items.transferor_Name = resultTransferor.first_Name;
                                    $scope.items.transferor_pos_Name = resultTransferor.position_Name;
                                }


                                if (resultTransfer_Approver != undefined) {

                                    $scope.items.transfer_Approver_Name = resultTransfer_Approver.first_Name;
                                    $scope.items.transfer_Approver_pos_Name = resultTransfer_Approver.position_Name;
                                }


                                if (resultRecorder != undefined) {
                                    $scope.items.recorder_Name = resultRecorder.first_Name;
                                    $scope.items.recorder_pos_Name = resultRecorder.position_Name;
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

                $scope.$watch("items.endorser_Name", function () {
                    if (!$scope.items.endorser_Name) {
                        $scope.items.endorser_pos_Name = "";
                    }
                });

                $scope.$watch("items.transferor_Name", function () {
                    if (!$scope.items.transferor_Name) {
                        $scope.items.transferor_pos_Name = "";
                    }
                });

                $scope.$watch("items.transfer_Approver_Name", function () {
                    if (!$scope.items.transfer_Approver_Name) {
                        $scope.items.transfer_Approver_pos_Name = "";
                    }
                });

                $scope.$watch("items.recorder_Name", function () {
                    if (!$scope.items.recorder_Name) {
                        $scope.items.recorder_pos_Name = "";
                    }
                });

                $scope.url = {
                    master: webServiceAPI.Master
                };

                init();

            }],
            link: function ($scope, $element, $attributes) { }
        }
    });
}());
