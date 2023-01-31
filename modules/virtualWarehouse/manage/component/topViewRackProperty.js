// 'use_strict';

// export default function topViewRackProperty() {
//     return {
//         controllerAs: '$vm',
//         controller: topViewRackPropertyCtrl,
//         template: require('./topViewRackProperty.html'),
//         bindings: {
//             trigger: '=?',
//             callback: '=?'
//         }
//     };

(function () {
    'use strict'
    app.component('topViewRackProperty', {
        controllerAs: '$vm',
        controller: topViewRackPropertyCtrl,
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/virtualWarehouse/manage/component/topViewRackProperty.html";
        },
        bindings: {
            trigger: '=?',
            callback: '=?'
        },
        controller: topViewRackPropertyCtrl
    })
})();

function topViewRackPropertyCtrl($scope, $http, vwManageTopFactory) {
    var $vm = this;
    var apiFactory = vwManageTopFactory;

    this.$onInit = function () {
        $vm.model = {};
    };

    $scope.$on('$destroy', function () { });

    $scope.$watch("model.bay", function (newValue, oldValue) {
        if (newValue && newValue != oldValue) {
            $vm.model.totalBin = $vm.model.bay * $vm.model.level * $vm.model.pallet;
        }
        else {
            $vm.model.totalBin = 0;
        }
    });

    $scope.$watch("model.level", function (newValue, oldValue) {
        if (newValue && newValue != oldValue) {
            $vm.model.totalBin = $vm.model.bay * $vm.model.level * $vm.model.pallet;
        }
        else {
            $vm.model.totalBin = 0;
        }
    });

    $scope.$watch("model.pallet", function (newValue, oldValue) {
        if (newValue && newValue != oldValue) {
            $vm.model.totalBin = $vm.model.bay * $vm.model.level * $vm.model.pallet;
        }
        else {
            $vm.model.totalBin = 0;
        }
    });

    $vm.trigger = function (model) {
       
        $('#top-rack-modal-form').modal('show');
        $vm.model = model;
        $scope.model = $vm.model;

        apiFactory.loadZone({}).then(function (res) {
            if (res.data && res.data.status == "SUCCESS") {
                $vm.zoneList = res.data.items;
                if ($vm.zoneList && $vm.zoneList.length > 0) {
                    if($vm.model.status == 1){
                        var filterItem = $vm.zoneList.filter(function (item) {
                            return item.zone_Index == $vm.model.zoneIndex.toUpperCase();
                        });
                        $vm.model.zoneIndex = $vm.model.zoneIndex.toUpperCase() || filterItem.zone_Index.toUpperCase();
                    }else{
                        $vm.model.zoneIndex = $vm.zoneList[0].zone_Index.toUpperCase();
                    }                      
                }
            }
        });

        apiFactory.loadRoom({ warehouseIndex: model.warehouseIndex }).then(function (res) {
            debugger;
            if (res.data && res.data.status == "SUCCESS") {
                $vm.roomList = res.data.items;
                if ($vm.roomList && $vm.roomList.length > 0) {
                    if($vm.model.status == 1){
                        var filterItem = $vm.roomList.filter(function (item) {
                            return item.room_Index == $vm.model.roomIndex.toUpperCase();
                        });
                        $vm.model.roomIndex = $vm.model.roomIndex.toUpperCase() || filterItem.room_Index.toUpperCase();
                    }else{
                         $vm.model.roomIndex = $vm.model.roomIndex || $vm.roomList[0].room_Index;
                    }                      
                }
            }
        });

        apiFactory.loadLocationType({}).then(function (res) {
            if (res.data && res.data.status == "SUCCESS") {
                $vm.locationTypeList = res.data.items;

                if ($vm.locationTypeList && $vm.locationTypeList.length > 0) {

                    if($vm.model.status == 1){
                        var filterItem = $vm.locationTypeList.filter(function (item) {
                            return item.locationType_Index == $vm.model.locationTypeIndex.toUpperCase();
                        });
                        $vm.model.locationTypeIndex = $vm.model.locationTypeIndex.toUpperCase() || filterItem.locationType_Index.toUpperCase();
                    }else{
                        $vm.model.locationTypeIndex = $vm.locationTypeList[0].locationType_Index.toUpperCase();

                    }        
                }
            }
        });

        $('#refreshTopRack').click();
    }

    $vm.save = function () {
      
        if ($vm.model.status == 1) {
            apiFactory.updateTopRack($vm.model).then(function (res) {
                if (typeof $vm.callback === 'function') {
                    $vm.callback(res.data);
                }
            },
                function (err) {
                    $vm.callback();
                });

        } else {
            apiFactory.saveTopRack($vm.model).then(function (res) {
                if (typeof $vm.callback === 'function') {
                    $vm.callback(res.data);
                }
            },
                function (err) {
                    $vm.callback();
                });

        }


        $('#top-rack-modal-form').modal('hide');
    };

    $vm.delete = function () {
        var model = $vm.model;
        apiFactory.inActive(model).then(
            function (res) {
                if (typeof $vm.callback === 'function') {
                    $vm.callback(res.data);
                }
            },
            function (err) {

            });
        $('#top-rack-modal-form').modal('hide');
    };

    $scope.onClose = function () {
        $('#top-rack-modal-form').modal('hide');
        $vm.callback();
    }

    $scope.refreshTopRack = function () { }

    $vm.locationAisleAutoCompleteFunc = function (value) {
        console.log(value);

        return apiFactory.LocationAisle({locationLock_Id: value}).then(function (response) {
            return response.data.items;
        });
    }
}
