(function () {
    'use strict'

    app.component('virtualWarehousePreview', {
        controllerAs: '$vm',
        controller: vwPreviewCtrl,
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/virtualWarehouse/preview/vwpreview.html";
        },
        bindings: {
        },
        controller: vwPreviewCtrl
    })
})();

function vwPreviewCtrl($scope, $http, localStorageService, vwPreviewFactory,$translate) {
    var $vm = this;
    var apiFactory = vwPreviewFactory;

   
    this.$onInit = function () {

        // $scope.statusLoadTopView = topScene.statusLoadTopView;
 
         $vm.productItem = $vm.productItem || {};
         $vm.productId = '';
 
         $vm.ownerItem = $vm.ownerItem || {};
         $vm.ownerId = '';

         rackScene.factory = vwPreviewFactory;
         floorScene.factory = vwPreviewFactory;
        
         $scope.statusLoadTop = "";
         $scope.statusLoadSide = "";
         
         $scope.search = function(){
            $scope.statusLoadTop = $translate.instant('DATALOADING');
        
            if($scope.ownerId == ''){
                $vm.ownerId = '';
            }

            if($scope.productId == ''){
                $vm.productId = '';
            }

             topScene.searchLayout(topScene.scene, $vm.productId, $scope.status_Selected);
         }
 
         $scope.sideSceneTrigger = function (data) {
             $scope.statusLoadSide = $translate.instant('DATALOADING');
             $scope.topSelected = data;
             $scope.clearData();
             var sideScene = rackScene.scene || floorScene.scene;
           
             rackScene.config = configSide;
             floorScene.config = configSide;
             if (sideScene) {
                 if (sideScene.scene.isActive(rackScene.key)) {
                     sideScene = rackScene.scene;
                 }
                 else if (sideScene.scene.isActive(floorScene.key)) {
                     sideScene = floorScene.scene;
                 }
 
                 if (data) {
                     switch (data.type) {
                         case 'rack':
                            rackScene.Bay = $translate.instant('BAY');
                            rackScene.Aisle = $translate.instant('AISLE');
                            rackScene.Level = $translate.instant('LEVEL');
                          
                             sideScene.scene.switch(rackScene.key);
                             rackScene.eventTrigger(data, sideScene);
                             break;
                         case 'floor':
                             sideScene.scene.switch(floorScene.key);
                             floorScene.eventTrigger(data, sideScene);
                             break;
                         default:
                             break;
                     }
                 }
             }
         };
 
        $scope.clearData = function(){
             $scope.item = null;
             rackScene.rackData = [];
             floorScene.floorData = {};
        }
 
         $scope.rackTrigger = function (data) {
 
             $('#refresh').click();
             $scope.item = data;
             var wah = $vm.warehouseList.filter(function (o) {
                 return o.warehouse_Index == $scope.warehouse_Selected
             });
             $scope.item.warehouse = wah[0].warehouse_Name;
             apiFactory.loadRoom({ warehouseIndex: $scope.warehouse_Selected }).then(function (res) {
                 if (res.data && res.data.status == "SUCCESS") {
                     $vm.roomList = res.data.items;
                     $scope.item.room = $vm.roomList[0].room_Name;
                 }
             });
 
             apiFactory.getDetailBinBalanceRack({ location_index: data.location_index }).then(function (res) {
                 if (res.data && res.data.status == "SUCCESS") {
                     var binItems = res.data.items;
                     $scope.item.location_id = binItems[0].location_id;
                     $scope.item.location_Bay_Desc = binItems[0].location_Bay_Desc;
                     $scope.item.location_Level_Desc = binItems[0].location_Level_Desc;
                     $scope.item.location_Position_Desc = binItems[0].location_Position_Desc;
                     $scope.item.location_Position_Desc = binItems[0].location_Position_Desc;
                 }
             });
             
             setTimeout(function() {
                 apiFactory.FilterProductByLocationId({ location_Id: $scope.item.location_id }).then(function (res) {
                     if (res.data && res.data.status == "SUCCESS") {
                         $scope.item.product = res.data.items;
                     }
                 });
             }, 500);
         }
 
         $scope.floorTrigger = function (data) {
             $('#refresh').click();
             $scope.item = data;
 
             var wah = $vm.warehouseList.filter(function (o) {
                 return o.warehouse_Index == $scope.warehouse_Selected
             });
             $scope.item.warehouse = wah[0].warehouse_Name;
             apiFactory.loadRoom({ warehouseIndex: $scope.warehouse_Selected }).then(function (res) {
                 if (res.data && res.data.status == "SUCCESS") {
                     $vm.roomList = res.data.items;
                     $scope.item.room = $vm.roomList[0].room_Name;
                 }
             });
 
             // apiFactory.getDetailBinBalance({ location_id: data.location_id }).then(function (res) {
             //     if (res.data && res.data.status == "SUCCESS") {
             //         var binItems = res.data.items;
             //         if(binItems.length > 0) {                      
             //             $scope.item.tagNo = binItems[0].product_Id;
             //             $scope.item.unit = binItems[0].productConversion_Name;
             //             $scope.item.qty = binItems[0].binBalance_QtyBal;
             //         }
             //     }
             // });
 
             apiFactory.FilterProductByLocationId({ location_id: data.location_id }).then(function (res) {
                 if (res.data && res.data.status == "SUCCESS") {
                     $scope.item.product = res.data.items;
                     
                 }
             });
         }

        $scope.statusLoadTopFinish = function(){
            debugger;
            $scope.statusLoadTop = "";
        }

        $scope.statusLoadSideFinish = function(){
            debugger;
            $scope.statusLoadSide = "";
        }


        topScene.sideEventTrigger = $scope.sideSceneTrigger;
        topScene.statusLoadTopFinish = $scope.statusLoadTopFinish;
        topScene.factory = vwPreviewFactory;

        rackScene.rackTrigger = $scope.rackTrigger;
        rackScene.statusLoadSideFinish =  $scope.statusLoadSideFinish;

        floorScene.floorTrigger = $scope.floorTrigger;
         apiFactory.loadWarehouse({}).then(function (res) {
             if (res.data && res.data.status == "SUCCESS") {
                 $vm.warehouseList = res.data.items;
 
                 if ($vm.warehouseList.length > 0) {
                     topScene.warehouseIndex = $vm.warehouseList[0].warehouse_Index;
                     $scope.warehouse_Selected = $vm.warehouseList[0].warehouse_Index;
                 }
             }
         });
 
         apiFactory.loadItemStatus({}).then(function (res) {
             if (res.data && res.data.status == "SUCCESS") {
                 $vm.statusList = res.data.items;
             }
         });
     };
 
     $scope.$on('$destroy', function () {
         gameTop.destroy(true);
         gameSide.destroy(true);
     });
 
     $scope.$watch("warehouse_Selected", function (newValue, oldValue) {
         $scope.statusLoadTop = $translate.instant('DATALOADING');
         $scope.clearData();
         
         if ($vm.warehouseList) {
             var selectedItem = $vm.warehouseList.filter(function (item) {
                 return item.warehouse_Index == newValue;
             });
 
             if (selectedItem.length > 0) {
                 topScene.warehouseIndex = selectedItem[0].warehouse_Index;
                 topScene.warehouseName = selectedItem[0].warehouse_Name;
                 topScene.reLoadLayout(topScene.scene);
             }
         }
     });
 
     $vm.productAutoCompleteFunc = function (value) {
         return apiFactory.loadProduct({product_Id: value}).then(function (res) {
             return res.data.items;
         });
     }

     $vm.ownerAutoCompleteFunc = function (value) {
        return apiFactory.loadOwner({owner_Id: value}).then(function (res) {
            return res.data.items;
        });
    }
 
     var configTop = {
         type: Phaser.AUTO,
        // width: 1154,
         width: 1554,
         height: 760,
         parent: 'gameTopViewContainer',
         scale: {
             mode: Phaser.Scale.FIT,
             autoCenter: Phaser.Scale.CENTER_HORIZONTALLY
         },
         scene: [topScene],
         physics: {
             default: 'arcade',
             arcade: {
                 gravity: {
                     y: 0
                 },
                 debug: false
             }
         }
     }
 
     var configSide = {
         type: Phaser.AUTO,
         width: 1554,
         height: 450,
         parent: 'gameSideViewContainer',
         scale: {
             mode: Phaser.Scale.FIT,
             autoCenter: Phaser.Scale.CENTER_HORIZONTALLY
         },
         scene: [rackScene, floorScene],
         physics: {
             default: 'arcade',
             arcade: {
                 gravity: {
                     y: 0
                 },
                 debug: false
             }
         }
     }
 
     var gameTop = new Phaser.Game(configTop);
     var gameSide = new Phaser.Game(configSide);
 
     $scope.zoomin = function () {
         if ($scope.zoom < 5) {
             $scope.zoom += 1;
         }
     }
 
     $scope.zoomout = function () {
         if ($scope.zoom > 1) {
             $scope.zoom -= 1
         }
     }
}