// 'use_strict';

// export default function topViewFloorProperty() {
//     return {
//         controllerAs: '$vm',
//         controller: topViewFloorPropertyCtrl,
//         template: require('./topViewFloorProperty.html'),
//         bindings: {
//             trigger: '=?',
//             callback: '=?'
//         }
//     };

(function () {
    'use strict'
    app.component('topViewFloorProperty', {
        controllerAs: '$vm',
        controller: topViewFloorPropertyCtrl,
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/virtualWarehouse/manage/component/topViewFloorProperty.html";
        },
        bindings: {
            trigger: '=?',
            callback: '=?'
        },
        controller: topViewFloorPropertyCtrl
    })
})();


function topViewFloorPropertyCtrl($scope, $http, localStorageService, vwManageTopFactory) {
    var $vm = this;
    var apiFactory = vwManageTopFactory;

    this.$onInit = function () {
        $vm.model = {};
        $vm.locationAisleItem = $vm.locationAisleItem || {};
        $vm.locationlockId = '';
    };

    $vm.locationAisleAutoCompleteFunc = function (value) {
        return apiFactory.LocationAisle({locationLock_Id: value}).then(function (response) {
            return response.data.items;
        });
    }

    $scope.$on('$destroy', function () { });

    $vm.trigger = function (model) {
        $('#top-floor-modal-form').modal('show');
        debugger;
        $vm.model = model;
        $scope.model = $vm.model;
        $vm.locationlockId = $vm.model.aisle;

        apiFactory.loadZone({}).then(function (res) {
            if (res.data && res.data.status == "SUCCESS") {
                $vm.zoneList = res.data.items;

                if ($vm.zoneList && $vm.zoneList.length > 0) {
                    
                    if($vm.model.status == 1){
                        $vm.model.zoneIndex = $vm.model.zoneIndex.toUpperCase() || filterItem.zone_Index.toUpperCase();
                    }else{
                            $vm.model.zoneIndex = $vm.zoneList[0].zone_Index.toUpperCase();
                    }
                }
            }
        });

        apiFactory.loadRoom({ warehouseIndex: model.warehouseIndex }).then(function (res) {
            if (res.data && res.data.status == "SUCCESS") {
                $vm.roomList = res.data.items;

                if ($vm.roomList && $vm.roomList.length > 0) {
                    
                    if($vm.model.status == 1){
                        $vm.model.roomIndex = $vm.model.roomIndex.toUpperCase() || filterItem.room_Index.toUpperCase();
                    }else{
                            $vm.model.roomIndex = $vm.roomList[0].room_Index.toUpperCase();
                    }
                }
            }
        });

        apiFactory.loadLocationType({}).then(function (res) {
            if (res.data && res.data.status == "SUCCESS") {
                $vm.locationTypeList = res.data.items;

                if ($vm.locationTypeList && $vm.locationTypeList.length > 0) {

                    if($vm.model.status == 1){
                        $vm.model.locationTypeIndex = $vm.model.locationTypeIndex.toUpperCase() || filterItem.locationType_Index.toUpperCase();
                    }else{
                        $vm.model.locationTypeIndex = $vm.locationTypeList[0].locationType_Index.toUpperCase();

                    }
                }
            }
        });

        $('#refreshTopFloor').click();
    }

    $vm.save = function () {
    
        var saveModel = $vm.model;
        if (saveModel.status == "0") {
            apiFactory.saveTopFloor(saveModel).then(
                function (res) {
                    if (typeof $vm.callback === 'function') {
                        $vm.callback(res.data);
                    }
                },
                function (err) {

                });
        } else {
            
            apiFactory.updateTopFloor(saveModel).then(
                function (res) {
                    if (typeof $vm.callback === 'function') {
                        $vm.callback(res.data);
                    }
                },
                function (err) {

                });
        }

        $scope.onClose();
    };

    $scope.onClose = function () {
        $('#top-floor-modal-form').modal('hide');
        $vm.callback();
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
        $('#top-floor-modal-form').modal('hide');
    };   
}
