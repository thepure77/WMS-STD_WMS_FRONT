var rackSceneManage = {
    key: 'sceneRack',
    camera: {},
    factory: {},
    spriteRackGrp: {},
    paddingTop : 10,
    paddingLeft : 10,
    spaceTop :32,
    selectedLayout: [],
    rackData:{},
    config:{},
    sideRackStatus:1,
    rackSideEventTrigger:null,
    preload: function () {
        this.load.image('back_tiles', './src/assets/img/vwm/tile-grid-view.png');
        this.load.image('back_to_top', './src/assets/img/vwm/floor-grid.png');
        this.load.svg('floor_ground', './src/assets/img/vwm/rack_orange.svg', { width: 80, height: 4 });
        this.load.svg('rack_pillar', './src/assets/img/vwm/rack_blue.svg', { width: 80, height: 4 });
        this.load.svg('rack_init', './src/assets/img/vwm/empty.svg', { width: 32, height: 32 });
        this.load.svg('rack_mapped', './src/assets/img/vwm/used.svg', { width: 32, height: 32 });
        this.load.svg('rack_unuse', './src/assets/img/vwm/block.svg', { width: 32, height: 32 });
    },
    create: function () {

        // console.log('Create');
         var scene = this;
         rackSceneManage.createBackToTopButton(scene);
         rackSceneManage.createSideTileMap(scene);
 
         rackSceneManage.sideRackStatus = 1;
         rackSceneManage.createSideRackSprite(scene);
         rackSceneManage.createDragEvent(scene);
         rackSceneManage.createPointerUpEvent(scene);
         rackSceneManage.createPointerDownEvent(scene);
         rackSceneManage.camera = scene.cameras.main.setBounds(0, 0, 640, 340);
         rackSceneManage.spriteRackGrp = scene.add.group();
     },
     update: function () {
        rackSceneManage.scene = this;
        scene = this;
    
     
      if (rackSceneManage.sideRackStatus == 1) {
         var nProcess = 1
    
             if(nProcess == 1){
                 rackSceneManage.destroySprite(scene);
                 if(rackSceneManage.spriteRackGrp.getChildren().length == 0){                   
                     rackSceneManage.renderSideRackSprite(scene);
                     nProcess = 0;
                 }
             }
    
         rackSceneManage.sideRackStatus = 0;
     }
 
     }, destroySprite: function (scene) {
         rackSceneManage.spriteRackGrp.clear(true);
         // if(rackScene.spriteRackGrp.getChildren().length > 0 || rackScene.spriteRackGrp){
         //     rackScene.spriteRackGrp.
         //     for(var i = 0; i < rackScene.spriteRackGrp.getChildren().length;i++){
         //         var spriteGrp = rackScene.spriteRackGrp.getChildren()[i];   
         //         spriteGrp.destroy();  
         //     }
 
         // }
         
         // while (i < rackScene.spriteRackGrp.getChildren().length) {
         //     var spriteGrp = rackScene.spriteRackGrp.getChildren()[i];   
         //     spriteGrp.destroy();
         //     i++;  
         //   }         
         console.log(rackSceneManage.spriteRackGrp.getChildren().length);
     }, processUpdate:function(scene){
 
      
      
     },
     createSideRackSprite: function (scene) {    
        
        if(rackSceneManage.selectedLayout.length > 0){
             var dataIndex = rackSceneManage.selectedLayout[0].layout_Index;
             rackSceneManage.factory.GetLayoutByindex(dataIndex).then(function (res) {
                 console.log('Datarender' + JSON.stringify(rackSceneManage.rackData));
                 if (res.data && res.data.status == "SUCCESS") {
                     rackSceneManage.rackData = res.data.layoutItem;
                     rackSceneManage.sideRackStatus = 1;
                 }
             });
         }
     },
     renderSideRackSprite: function (scene) {
         var groundX = 80;
         var groundY = 720;
         var groundSpriteWidth = 80;
         rackSceneManage.spriteRackGrp.clear(true);
 
          //==========  สร้าง พื้น  ======== //
         for (var i = 0; i < 20; i++) {
             var ground = scene.add.sprite(groundX + (i * groundSpriteWidth), groundY, 'floor_ground');
             rackSceneManage.spriteRackGrp.add(ground);
         }
       
         var oRack = rackSceneManage.rackData[0];
 
         if (oRack != null) {
             var levelRack = oRack.level;   // Rows
             var bayRack = oRack.bay;       // Columns
             var pallet = oRack.pallet;       // Columns
 
            // var bayRackX = (parseInt(rackSceneManage.config.width) / 2) - ((parseInt(oRack.bay) / 2) * 50) + 2;
             var bayRackX = (parseInt(rackSceneManage.config.width) / 2) - (((parseInt(oRack.bay) * (parseInt(pallet)) / 2) * 50)) + 8;
 
             var bayRackY = 680;
             var bayRackWidth = 50;
             // สร้างพื้น สำหรับกล่อง
             for (var y = 0; y < parseInt(levelRack) - 1; y++) {
                 for (var x = 0; x < parseInt(bayRack) * parseInt(pallet); x++) {
                     var floor_ground = scene.add.sprite(parseInt(bayRackX) + (x * parseInt(bayRackWidth)), bayRackY, 'floor_ground');
                     floor_ground.scaleX = 1;
                     rackSceneManage.spriteRackGrp.add(floor_ground);
                 }
                 bayRackY -= 40;
             }
 
             //==========  สร้างเสา  ==========//
             var bayPillarX = bayRackX - 20;
             var bayPillarY = 700;
 
             // สร้าง แนวนอน
             for (var n = 0; n < parseInt(bayRack); n++) {
                 bayPillarY = 700;
                 var spriteItem = oRack.sprite_items[n];
                 // if ((spriteItem.left_pillar == true) || (n == parseInt(bayRack))) {
                 //     // สร้าง แนวตั้ง    (n == parseInt(bayRack)   สร้างเสาปิด
                 //     for (var i = 0; i < parseInt(levelRack) - 1; i++) {
                 //         var pillar1 = scene.add.sprite(parseInt(bayPillarX), parseInt(bayPillarY), 'rack_pillar');
                 //         pillar1.setAngle(90);
                 //         pillar1.scaleX = 0.5;
                 //         rackSceneManage.spriteRackGrp.add(pillar1);
 
                 //         if ((parseInt(levelRack) - 2) > i) {
                 //             bayPillarY -= 40;
                 //         } else {
                 //             bayPillarY -= 20;
                 //         }
                 //     }
 
                 //     var pillar1 = scene.add.sprite(parseInt(bayPillarX), parseInt(bayPillarY), 'rack_pillar');
                 //     pillar1.setAngle(90);
                 //     pillar1.scaleX = 0.5;
                 //     rackSceneManage.spriteRackGrp.add(pillar1);
                 //     // bayPillarY -= 40;
                 // }
                 //bayPillarX += 50;
 
                 for (var i = 0; i < parseInt(levelRack) - 1; i++) {
                     var pillar1 = scene.add.sprite(parseInt(bayPillarX), parseInt(bayPillarY), 'rack_pillar');
                     pillar1.setAngle(90);
                     pillar1.scaleX = 0.5;
                     rackSceneManage.spriteRackGrp.add(pillar1);
 
                     if ((parseInt(levelRack) - 2) > i) {
                         bayPillarY -= 40;
                     } else {
                         bayPillarY -= 20;
                     }
                 }
 
                 var pillar1 = scene.add.sprite(parseInt(bayPillarX), parseInt(bayPillarY), 'rack_pillar');
                 pillar1.setAngle(90);
                 pillar1.scaleX = 0.5;
                 rackSceneManage.spriteRackGrp.add(pillar1);
                 // bayPillarY -= 40;
             
                 bayPillarX += 100;
 
             }
 
             // วนทำเสาปิด
             bayPillarY = 700;
             for (var i = 0; i < parseInt(levelRack) - 1; i++) {
                 var pillar1 = scene.add.sprite(parseInt(bayPillarX), parseInt(bayPillarY), 'rack_pillar');
                 pillar1.setAngle(90);
                 pillar1.scaleX = 0.5;
                 rackSceneManage.spriteRackGrp.add(pillar1);
                 if ((parseInt(levelRack) - 2) > i) {
                     bayPillarY -= 40;
                 } else {
                     bayPillarY -= 20;
                 }
             }
             var pillar1 = scene.add.sprite(parseInt(bayPillarX), parseInt(bayPillarY), 'rack_pillar');
             pillar1.setAngle(90);
             pillar1.scaleX = 0.5;
             rackSceneManage.spriteRackGrp.add(pillar1);
 
 
 
             //==========  สร้างกล่อง  ==========//
             var boxY = 700;
             var nSpriteIndex = 0;    // Index for set sprite_index
             var nSeq = 0;
             // แนวตั้ง  
             for (var y = 0; y < parseInt(levelRack); y++) {
               //  var boxX = (parseInt(rackSceneManage.config.width) / 2) - ((parseInt(oRack.bay) / 2) * 50) + 14;
                 var boxX = ((parseInt(rackSceneManage.config.width) / 2) - (((parseInt(oRack.bay) * (parseInt(oRack.pallet)) / 2) * 50) + 14)) - 25;
                 for (var x = 0; x < parseInt(bayRack); x++) {
                     // เนวนอน
                     var spriteItem = oRack.sprite_items[nSeq];
                     nSeq++;
                     var nameType = 'rack_init';
                     switch (spriteItem.status) {
                         case "2":
                             nameType = 'rack_unuse';
                             break;
                         case "1":
                             nameType = 'rack_mapped';
                             break;
                         default:
                             break;
                     }
 
                     // var box = scene.add.sprite(parseInt(boxX) + (x * parseInt(50)), parseInt(boxY), nameType);
                     // box.location_Level = parseInt(y) + 1;
                     // box.location_Bay = parseInt(x) + 1;
                     // box.location_Depth = 1;
                     // box.sprite_Index = spriteItem.sprite_Index;
                     // box.setInteractive();
                     // rackSceneManage.spriteRackGrp.add(box);
 
                     var itemLocations = spriteItem.itemLocations;
                   
                     for (i = 0; i < itemLocations.length; i++) {
                         boxX += 50;
                         var box = scene.add.sprite(parseInt(boxX), parseInt(boxY), nameType);
                       //  box.location_Level = spriteItem.location_Level
                       //  box.location_Bay = spriteItem.location_Bay
                       //  box.location_Depth = 1;
                         box.location_index = itemLocations[i].location_index;
                        // box.location_id = spriteItem.location_id;
                         box.aisle = oRack.name;
                         box.setInteractive({ useHandCursor: true }, new Phaser.Geom.Rectangle(0, 0, box.width, box.height), Phaser.Geom.Rectangle.Contains);
                         rackSceneManage.spriteRackGrp.add(box);
                     }
                 }
                 boxY -= 40;
             }
         }
     },
     createBackToTopButton: function (scene) {
         var backToTop = scene.add.sprite(rackSceneManage.paddingLeft + 16, rackSceneManage.paddingTop + 16, 'back_to_top');
         backToTop.setInteractive();
     },
     createSideTileMap: function (scene) {
       //  var y = 6 - (rackSceneManage.spaceTop / 16);
      //   var x = 10;
 
         var y = 12 - (rackSceneManage.spaceTop / 16);
         var x = 13;
         var level = [];
 
         for (var i = 0; i < y; i++) {
             var row = [];
             for (var j = 0; j < x; j++) {
                 row[j] = 0;
             }
             level.push(row);
         }
 
         // When loading from an array, make sure to specify the tileWidth and tileHeight
         const map = scene.make.tilemap({ data: level, tileWidth: 64, tileHeight: 64 });
         const tiles = map.addTilesetImage('back_tiles');
         const layer = map.createStaticLayer(0, tiles, rackSceneManage.paddingLeft, rackSceneManage.paddingTop + rackSceneManage.spaceTop);
         layer.setScale(2);
         layer.depth = -1;
     },
     createDragEvent: function (scene) {
         scene.input.on('dragstart', function (pointer, gameObject, dragX, dragY) {
             gameObject.lastPosition = {
                 x: gameObject.x,
                 y: gameObject.y
             };
         });
 
         scene.input.on('drag', function (pointer, gameObject, dragX, dragY) {
             gameObject.x = dragX;
             gameObject.y = dragY;
         });
 
         scene.input.on('dragend', function (pointer, gameObject) {
             switch (gameObject.type) {
                 case "rack":
                     if (gameObject.layout_Index != 'undefined'); {
                         $scope.popupObj.rack.model = {
                             layout_Index: gameObject.layout_Index,
                             level: gameObject.level,
                             bay: gameObject.bay,
                             deep: gameObject.deep,
                             aisle: (gameObject.aisle == null ? 1 : gameObject.aisle),
                             type: gameObject.type,
                             x: gameObject.x,
                             y: gameObject.y,
                             angle: gameObject.angle,
                             status: 1,     // Status 0 Add ,  1 Update
                         };
                         updateTopRackLocation();
                     }
                     break;
                 case "floor":
                     if (gameObject.layout_Index != 'undefined'); {
                         $scope.popupObj.floor.model = {
                             layout_Index: gameObject.layout_Index,
                             level: 1,
                             bay: 1,
                             deep: 1,
                             aisle: 1,
                             type: gameObject.type,
                             x: gameObject.x,
                             y: gameObject.y,
                             angle: gameObject.angle,
                             height: gameObject.heightY,
                             width: gameObject.widthX,
                             status: 1,     // Status 0 Add ,  1 Update
                         };
                         updateTopFloorLocation();
                     }
                     break;
                 case "label":
                     if (gameObject.layout_Index != 'undefined'); {
                         $scope.popupObj.label.model = {
                             layout_Index: gameObject.layout_Index,
                             level: 1,
                             bay: 1,
                             deep: 1,
                             aisle: 1,
                             type: gameObject.type,
                             x: gameObject.x,
                             y: gameObject.y,
                             angle: gameObject.angle,
                             height: gameObject.heightY,
                             width: gameObject.widthX,
                             status: 1,     // Status 0 Add ,  1 Update
                         };
                         updateTopLabelLocation();
                     }
                     break;
                 default:
             }
         });
     },
     createPointerUpEvent: function (scene) {
         scene.input.mouse.disableContextMenu();
 
         scene.input.on('pointerup', function (pointer, gameObject) {
             if (gameObject.length > 0) {
                 if (gameObject[0].lastPosition) {
                     if (gameObject[0].lastPosition.x == gameObject[0].x
                         && gameObject[0].lastPosition.y == gameObject[0].y
                     ) {
                         console.log('click left');
                     }
                     else {
 
                     }
                 }
                 else {
                     switch (gameObject[0].texture.key) {
                         case 'back_to_top':
                             // this.input.stopPropagation();
                             // rackSceneManage.selectedLayout.pop();
                             // rackSceneManage.sideRackStatus = 1;
                             // this.scene.switch('sceneTop');
                             location.reload();
                             break;
                         case 'rack-bar-not-empty':
                             console.log('Click left Box');
                             break;
                         default:
                             return;
                     }
                 }
             }
         }, scene);
     },
     createPointerDownEvent: function (scene) {
         scene.input.mouse.disableContextMenu();
 
         scene.input.on('pointerdown', function (pointer, gameObject) {
             if (pointer.rightButtonDown()) {
 
                 // if (typeof $scope.popupObj.siderack.trigger === "function") {
                 //     $scope.popupObj.siderack.model = {
                 //         location_Level: gameObject[0].location_Level,
                 //         location_Bay: gameObject[0].location_Bay,
                 //         location_Depth: gameObject[0].location_Depth,
                 //         aisle: (gameObject[0].aisle == null ? 1 : gameObject[0].aisle),
                 //         type: gameObject[0].type,
                 //         x: gameObject[0].x,
                 //         y: gameObject[0].y,
                 //         sprite_Index: gameObject[0].sprite_Index,
                 //         status: 1,     // Status 0 Add ,  1 Update
                 //     };
                 //     $('#refreshTop').click();
                 //     $scope.popupObj.siderack.trigger();
                 // }
 
                 var model = {
                     location_Level: gameObject[0].location_Level,
                     location_Bay: gameObject[0].location_Bay,
                     location_Depth: gameObject[0].location_Depth,
                     aisle: (gameObject[0].aisle == null ? 1 : gameObject[0].aisle),
                     type: gameObject[0].type,
                     x: gameObject[0].x,
                     y: gameObject[0].y,
                     sprite_Index: gameObject[0].sprite_Index,
                     status: 1,     // Status 0 Add ,  1 Update
                 };
 
                 console.log(model);
 
 
                 if (typeof rackSceneManage.rackSideEventTrigger === "function") {
                     rackSceneManage.rackSideEventTrigger(model);
                 }
 
             }
         }, scene);
     }
}
