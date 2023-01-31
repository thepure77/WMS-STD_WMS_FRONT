(function () {
    'use strict'

    app.component('ruleputawayForm', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/masterData/masterRuleputaway/component/ruleputawayForm.html";
        },
        bindings: {
            onShow: '=?',
            filterModel: '=?',
            searchResultModel: '=?',
        },
        controller: function ($scope, $q, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, ruleputawayFactory, webServiceAPI) {
            var $vm = this;

            $scope.onShow = false;
            var defer = {};
            var viewModel = ruleputawayFactory;

            $scope.Cancel = true;
            $scope.update = false;
            $scope.create = true;
            $scope.getCheck = false;
            $scope.filterItemModel = {};

            $vm.onShow = function (param) {
                defer = $q.defer();
                if ($scope.filterModel != null) {
                    $scope.filterModel = {};
                }
                $scope.onShow = true;
                if (param != undefined) {
                    pageLoading.show();
                    $scope.create = false;
                    viewModel.find(param.ruleputaway_Index).then(function (res) {
                        pageLoading.hide();
                        $scope.filterModel = res.data;
                        $scope.update = true;
                        if ($scope.filterModel.isActive == 0) {
                            $scope.getCheck = false;
                        } else {
                            $scope.getCheck = true;
                        }
                        $scope.buttons.add = false;
                        $scope.buttons.update = true;
                    });
                } else {
                    $scope.update = false
                    $scope.create = true;
                    $scope.getCheck = true;
                    $scope.filterModel.isActive = 1;
                    $scope.buttons.add = true;
                    $scope.buttons.update = false;
                    $scope.filterModel.ruleputaway_Id = "";
                }
                return defer.promise;
            };

            $vm.triggerSearch = function () {
                pageLoading.show();
                viewModel.filter($scope.filterModel).then(function (res) {
                    pageLoading.hide();
                    $vm.searchResultModel = res.data.itemsRuleputaway;
                });
            };
            $scope.buttons = {
                add: true,
                update: false,
                back: true
            };
            $scope.menu = [
                {
                    "step": "1",
                    "active": "active",
                    "completed": "",
                    "name": "Create Header"
                },
                {
                    "step": "2",
                    "active": "",
                    "completed": "",
                    "name": "Create Detail"
                },
                {
                    "step": "3",
                    "active": "",
                    "completed": "",
                    "name": "Preview"
                }
            ];

            $scope.defaultStep = function () {

                $scope.menu[0].active = "active";
                $scope.menu[0].completed = "";

                $scope.menu[0].active = "active";
                $scope.menu[0].completed = "";
                $scope.menu_width = 0 * 50;
                $scope.menu_name = $scope.menu[0].name;

                $scope.menu[1].active = "";
                $scope.menu[1].completed = "";
                $scope.menu_name = $scope.menu[1].name;

                $scope.menu[2].active = "";
                $scope.menu[2].completed = "";
                $scope.menu_name = $scope.menu[2].name;
            }

            $scope.next = function () {

                for (var i = 0; i < $scope.menu.length; i++) {
                    if (i == 0) {

                        if ($scope.filterModel.ruleputaway_Id != "") {
                            if (!$scope.filterModel.ruleputaway_Id.match(/^([a-z0-9])+$/i)) {
                                dpMessageBox.alert({
                                    ok: 'Close',
                                    title: 'Validate',
                                    message: 'Ruleputaway ID is required !!'
                                })
                                return "";
                            } else {
                                $scope.filterModel.ruleputaway_Id = $scope.filterModel.ruleputaway_Id;
                            }
                        }

                        if ($scope.filterModel.ruleputaway_Name == undefined || $scope.filterModel.ruleputaway_Name == "") {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'Validate',
                                message: 'Ruleputaway Name is required !!'
                            })
                            return "";
                        }

                        if ($scope.filterModel.ruleputaway_Seq == undefined || $scope.filterModel.ruleputaway_Seq == "") {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'Validate',
                                message: 'Ruleputaway Sequence is required !!'
                            })
                            return "";
                        }
                       
                    }
                    
                    if (i == 1) {
                        if ($scope.filterModel.listRuleputawayItemViewModel == undefined || $scope.filterModel.listRuleputawayItemViewModel.length == 0) {
                            dpMessageBox.alert(
                                {
                                    ok: 'Close',
                                    title: 'Error',
                                    message: 'Error: Add at least 1 Item'
                                }
                            )
                            return "";
                        }
                    }

                    if ($scope.menu[i].active == "active") {
                        $scope.menu[i].active = "";
                        $scope.menu[i].completed = "completed";
                        i++;
                        $scope.menu[i].active = "active";
                        $scope.menu_width = i * 50; //กำหนดความกว้างของเส้นเชื่อม
                        $scope.menu_name = $scope.menu[i].name;
                    }
                }
            }

            $scope.previous = function () {

                for (var i = 0; i < $scope.menu.length; i++) {
                    if ($scope.menu[i].active == "active") {
                        $scope.menu[i].active = "";
                        $scope.menu[i].completed = "";

                        i--;
                        $scope.menu[i].active = "active";
                        $scope.menu[i].completed = "";
                        $scope.menu_width = i * 50; //กำหนดความกว้างของเส้นเชื่อม
                        $scope.menu_name = $scope.menu[i].name;
                    }
                }
            }
       
            $scope.addsItem = function (param) {
                
                if (param.key != null) {
                    let str = param.key.split(" - ")
                    param.ruleputawayCondition_Id = str[0]
                    param.ruleputawayCondition_Name = str[1]
                }
                if (param.ruleputawayCondition_Id == undefined || param.ruleputawayCondition_Id == "") {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'Validate',
                            message: 'Please Choose Ruleputaway Condition !'
                        }
                    )
                    return "";
                }

                if (param.ruleputawayCondition_Name == undefined ||param.ruleputawayCondition_Name == "") {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'Validate',
                            message: 'Please Choose Ruleputaway Condition !'
                        }
                    )
                    return "";
                }
             
                //if (!angular.isNumber(parseFloat($scope.filterItemModel.qty))) {
                if (!(!isNaN(parseFloat(param.ruleputawaySuggest_Seq)) && angular.isNumber(parseFloat(param.ruleputawaySuggest_Seq)))) {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'Validate',
                            message: 'Please insert number Sequence !'
                        }
                    )
                    return "";
                } else {
                    if (parseFloat(param.ruleputawaySuggest_Seq) <= 0) {
                        dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: 'Validate',
                                message: 'Please insert number more than 0 !'
                            }
                        )
                        return "";
                    }
                }

                if ($scope.filterModel.listRuleputawayItemViewModel == undefined) {
                    $scope.filterModel.listRuleputawayItemViewModel = $scope.filterModel.listRuleputawayItemViewModel || []
                    $scope.filterModel.listRuleputawayItemViewModel.push(angular.copy(param));
                    $scope.filterItemModel.ruleputawayCondition_Index = null;
                    $scope.filterItemModel.key = null;
                    $scope.filterItemModel.ruleputawayCondition_Id = null;
                    $scope.filterItemModel.ruleputawayCondition_Name = null;
                    $scope.filterItemModel.ruleputawaySuggest_Seq = null;
                }
                else if (param.rowItemIndex != undefined) {

                    $scope.filterModel.listRuleputawayItemViewModel[param.rowItemIndex].ruleputawayCondition_Index = $scope.filterItemModel.ruleputawayCondition_Index;
                    $scope.filterModel.listRuleputawayItemViewModel[param.rowItemIndex].key = $scope.filterItemModel.key;
                    $scope.filterModel.listRuleputawayItemViewModel[param.rowItemIndex].ruleputawayCondition_Id = $scope.filterItemModel.ruleputawayCondition_Id;
                    $scope.filterModel.listRuleputawayItemViewModel[param.rowItemIndex].ruleputawayCondition_Name = $scope.filterItemModel.ruleputawayCondition_Name;
                    $scope.filterModel.listRuleputawayItemViewModel[param.rowItemIndex].ruleputawaySuggest_Seq = param.ruleputawaySuggest_Seq;

                    $scope.filterItemModel.ruleputawayCondition_Index = null;
                    $scope.filterItemModel.key = null;
                    $scope.filterItemModel.ruleputawayCondition_Id = null;
                    $scope.filterItemModel.ruleputawayCondition_Name = null;
                    $scope.filterItemModel.ruleputawaySuggest_Seq = null;
                    $scope.filterItemModel.rowItemIndex = undefined;

                }
                else {
                    $scope.filterModel.listRuleputawayItemViewModel.push(angular.copy(param));
                    $scope.filterItemModel.ruleputawayCondition_Index = null;
                    $scope.filterItemModel.key = null;
                    $scope.filterItemModel.ruleputawayCondition_Id = null;
                    $scope.filterItemModel.ruleputawayCondition_Name = null;
                    $scope.filterItemModel.ruleputawaySuggest_Seq = null;
                }
            }

            $scope.editItem = function (index) {

                $scope.index = index;
                $scope.filterItemModel.ruleputawayCondition_Index = $scope.filterModel.listRuleputawayItemViewModel[index].ruleputawayCondition_Index;
                $scope.filterItemModel.key = $scope.filterModel.listRuleputawayItemViewModel[index].ruleputawayCondition_Id + " - " + $scope.filterModel.listRuleputawayItemViewModel[index].ruleputawayCondition_Name;
                $scope.filterItemModel.ruleputawayCondition_Id = $scope.filterModel.listRuleputawayItemViewModel[index].ruleputawayCondition_Id;
                $scope.filterItemModel.ruleputawayCondition_Name = $scope.filterModel.listRuleputawayItemViewModel[index].ruleputawayCondition_Name;
                $scope.filterItemModel.ruleputawaySuggest_Seq = $scope.filterModel.listRuleputawayItemViewModel[index].ruleputawaySuggest_Seq;

                $scope.filterItemModel.rowItemIndex = index;
            }

            $scope.deleteItem = function (param, index) {
                param.splice(index, 1);
            }

            //Validate & confirm Add
            $scope.add = function () {
                var model = $scope.filterModel;
                //ใช้ userName จาก localStorage
                model.create_By = $scope.userName;
                $scope.validateMsg = "";
                if (model.ruleputaway_Id != "") {
                    if (!model.ruleputaway_Id.match(/^([a-z0-9])+$/i)) {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Validate',
                            message: 'Ruleputaway ID is required !!'
                        })
                        return "";
                    } else {
                        model.ruleputaway_Id = model.ruleputaway_Id;
                    }
                }
                if (model.ruleputaway_Name == undefined || model.ruleputaway_Name == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Validate',
                        message: 'Ruleputaway Name is required !!'
                    })
                    return "";
                }  

                if (!(!isNaN(parseFloat(model.ruleputaway_Seq)) && angular.isNumber(parseFloat(model.ruleputaway_Seq)))) {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'Validate',
                            message: 'Please insert number Sequence !'
                        }
                    )
                    return "";
                } else {
                    if (parseFloat(model.ruleputaway_Seq) <= 0) {
                        dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: 'Validate',
                                message: 'Please insert number more than 0 !'
                            }
                        )
                        return "";
                    }
                }


                if ($scope.filterModel.listRuleputawayItemViewModel == undefined || $scope.filterModel.listRuleputawayItemViewModel.length == 0) {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'Error',
                            message: 'Error: Add at least 1 Item'
                        }
                    )
                    return "";
                }
                else {
                    dpMessageBox.confirm({
                        ok: 'Yes',
                        cancel: 'No',
                        title: 'Confirm ?',
                        message: 'Do you want to save !'
                    }).then(function () {
                        pageLoading.show();
                        Add(model).then(function success(res) {

                            pageLoading.hide();
                            if (res.data == "Done") {
                                defer.resolve('1');
                                $scope.filterModel = {};
                                $scope.defaultStep();
                            }
                            if (res.data == "Fail") {
                                dpMessageBox.alert({
                                    ok: 'Close',
                                    title: 'Validate',
                                    message: 'Ruleputaway ID is Dupplicate !!'
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

            //API AutoComplete
            $scope.autoComplete = {
                ruleputawayCondition: "Autocomplete/autoRuleputawayCondition",
                

            };

            $scope.url = {
                Master: webServiceAPI.Master,
            };

            var init = function () {
                $scope.userName = localStorageService.get('userTokenStorage');
                $scope.filterModel = {};
            };
            init();

        }
    })
})();