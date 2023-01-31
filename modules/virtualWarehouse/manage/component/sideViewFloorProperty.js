//'use_strict';

// export default function sideViewFloorProperty() {
//     return {
//         controllerAs: '$vm',
//         controller: sideViewFloorPropertyCtrl,
//         template: require('./sideViewFloorProperty.html'),
//         bindings: {
//             model: '=?',
//             trigger: '=?',
//             callback: '=?'
//         }
//     };



(function () {
    'use strict'

    app.component('sideViewFloorProperty', {
        controllerAs: '$vm',
        controller: sideViewFloorPropertyCtrl,
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/virtualWarehouse/manage/component/sideViewFloorProperty.html";
        },
        bindings: {
            model: '=?',
            trigger: '=?',
            callback: '=?'
        },
        controller: sideViewFloorPropertyCtrl
    })
})();

function sideViewFloorPropertyCtrl($scope, $http, localStorageService, vwManageFactory) {
    var $vm = this;
    var apiFactory = vwManageFactory;

    this.$onInit = function () {
        $vm.model = $vm.model || [];
        $vm.dbModel = $vm.dbModel || {};
        $vm.selectedLocationName = '';
        $vm.location = [];
    };

    $scope.$on('$destroy', function () { });

    $vm.save = function () {
        // var mapModel = {
        //     "sprite_Index": $vm.model.sprite_Index,
        //     "location_Id": $vm.dbModel.location_Id,
        //     "location_Index": $vm.dbModel.location_Index,
        //     "location_Bay": $vm.model.location_Bay,
        //     "location_Depth": $vm.model.location_Depth,
        //     "location_Level": $vm.model.location_Level
        //   }
        
        // apiFactory.sideViewRackSave(mapModel).then(
        //     function (res) {
        //         console.log(res);
        //     },
        //     function (err) {

        //     });
        $scope.onClose();
    };

    $vm.Add = function(){
        debugger;
        console.log($vm.dbModel);
        if($vm.dbModel.location_Index != undefined){
            $vm.location.push($vm.dbModel);
            $vm.dbModel = {};
        }
    };

    $vm.locationAutoCompleteFunc = function (value) {
        return apiFactory.findLocationName(value).then(function (response) {
            return response.data.items;
        });
    }

    $vm.trigger = function () {
        debugger;
        $vm.selectedLocationName = {};
        $vm.dbModel = {};
        $('#side-sidefloor-modal-form').modal('show');
        
        // $vm.model.rackNo = 2;
    }

    $scope.onClose = function () {
        $('#side-sidefloor-modal-form').modal('hide');
        $vm.callback();
    }

    $vm.save = function(){
        var dataFloor = {
            "sprite_Index": $vm.model.sprite_Index,
            "spriteLocation_items": $vm.location
        };

        apiFactory.SideFloorManageSave(dataFloor).then(
            function (res) {
                if (typeof $vm.callback === 'function') {
                    $vm.callback(res.data);
                }
            },
            function (err) { }
        );
        $scope.onClose();
    }
}
