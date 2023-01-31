var rackScene = {
    key: 'rackScene',
    paddingTop: 1,
    paddingLeft: 1,
    camera: {},
    spriteGrp: {},
    rackData: [],
    factory: {},
    scene: null,
    config: {},
    rackUpdate: 0,
    rackitem: {},
    rackTrigger: null,
    Bay : "",
    Aisle : "",
    Level : "",
    statusLoadSideFinish : "",
    preload: function () {
        rackScene.scene = this;
        var scene = rackScene.scene;

        scene.load.image('back_tiles', './assets/img/vwm/tile-grid-view.png');
        scene.load.image('back_to_top', './assets/img/vwm/floor-grid.png');
        scene.load.image('rack_ground', './assets/img/vwm/floor-ground.png');
        scene.load.svg('floor_ground', './assets/img/vwm/rack_orange.svg', { width: 80, height: 4 });

        scene.load.svg('rack_pillar', './assets/img/vwm/rack_blue.svg', { width: 80, height: 4 });
        scene.load.svg('rack_init', './assets/img/vwm/empty.svg', { width: 20, height: 20 });
        scene.load.svg('rack_mapped', './assets/img/vwm/used.svg', { width: 20, height: 20 });
        scene.load.svg('rack_notempty', './assets/img/vwm/Item_used.svg', { width: 20, height: 20 });

        scene.load.svg('rack_unuse', './assets/img/vwm/block.svg', { width: 20, height: 20 });
        scene.load.image('rack_close', './assets/img/vwm/close.png',{ width: 20, height: 20 });
    },
    create: function () {
        rackScene.scene = this;
        var scene = rackScene.scene;
        rackScene.createTileMap(scene);
        //rackScene.createSprite(this);
        //createSideRackPointerEvent(scene);

        rackScene.createPointerEvent(scene)
        rackScene.camera = scene.cameras.main.setBounds(0, 0, 640, 340);
        rackScene.spriteGrp = scene.add.group();
    },
    update: function () {

        if (rackScene.rackUpdate == 1) {
            rackScene.scene = this;
            rackScene.spriteGrp.clear(true);
            rackScene.renderSprite(rackScene.scene);
            rackScene.rackUpdate = 0;
        }


    },
    createTileMap: function (scene) {
        // var y = 34;
        // var x = 64;
        var y = 28;
        var x = 97;
        var level = [];

        for (var i = 0; i < y; i++) {
            var row = [];
            for (var j = 0; j < x; j++) {
                row[j] = 0;
            }

            level.push(row);
        }
        // When loading from an array, make sure to specify the tileWidth and tileHeight
        const map = scene.make.tilemap({ data: level, tileWidth: 16, tileHeight: 16 });
        const tiles = map.addTilesetImage("back_tiles");
        const layer = map.createStaticLayer(0, tiles, rackScene.paddingLeft, rackScene.paddingTop);
    },
    renderSprite: function (scene) {
        var groundX = 60;
        var groundY = 400;
        var groundSpriteWidth = 80;
        rackScene.spriteGrp.clear(true);
        for (var i = 0; i < 19; i++) {
            var ground = scene.add.sprite(groundX + (i * groundSpriteWidth), groundY, 'floor_ground');
            rackScene.spriteGrp.add(ground);
        }
       debugger;
        var oRack = rackScene.rackData[0];
        if (oRack != null) {
            debugger;
            var levelRack = oRack.level;   // Rows
          //  var bayRack = oRack.bay;       // Columns
            var bayRack = parseInt(oRack.sprite_items.length / parseInt(oRack.level));       // Columns
            var pallet = oRack.pallet;       // 
            //==========  สร้าง พื้น  ======== //
            var bayRackX = (parseInt(rackScene.config.width) / 2) - (((parseInt(bayRack) * (parseInt(pallet)) / 2) * 25));

            //var boxX = ((parseInt(rackScene.config.width) / 2) - ((parseInt(oRack.bay) / 2) * 50) + 14) - 50;
            var bayRackY = 360;
            var bayRackWidth = 24;
            for (var y = 0; y < parseInt(levelRack) - 1; y++) {
                for (var x = 0; x < parseInt(bayRack) * parseInt(pallet); x++) {
                    var floor_ground = scene.add.sprite(parseInt(bayRackX) + (x * parseInt(bayRackWidth)), bayRackY, 'floor_ground');
                    floor_ground.scaleX = 1;
                    rackScene.spriteGrp.add(floor_ground);
                }
                bayRackY -= 40;
            }

            //==========  สร้างเสา  ==========//
            var bayPillarX = bayRackX - 27;
            var bayPillarY = 380;

            // สร้าง แนวนอน
            for (var n = 0; n < parseInt(bayRack); n++) {
                bayPillarY = 380;
                var spriteItem = oRack.sprite_items[n];
              
                // สร้าง แนวตั้ง    (n == parseInt(bayRack)   สร้างเสาปิด
                for (var i = 0; i < parseInt(levelRack) - 1; i++) {
                    var pillar1 = scene.add.sprite(parseInt(bayPillarX), parseInt(bayPillarY), 'rack_pillar');
                    pillar1.setAngle(90);
                    pillar1.scaleX = 0.5;
                    rackScene.spriteGrp.add(pillar1);

                    if ((parseInt(levelRack) - 2) > i) {
                        bayPillarY -= 40;
                    } else {
                        bayPillarY -= 20;
                    }
                }

                var pillar1 = scene.add.sprite(parseInt(bayPillarX), parseInt(bayPillarY), 'rack_pillar');
                pillar1.setAngle(90);
                pillar1.scaleX = 0.5;
                rackScene.spriteGrp.add(pillar1);
                // bayPillarY -= 40;
                
                bayPillarX += 50;
            }

            // วนทำเสาปิด
            bayPillarY = 380;
            for (var i = 0; i < parseInt(levelRack) - 1; i++) {
                var pillar1 = scene.add.sprite(parseInt(bayPillarX), parseInt(bayPillarY), 'rack_pillar');
                pillar1.setAngle(90);
                pillar1.scaleX = 0.5;
                rackScene.spriteGrp.add(pillar1);
                if ((parseInt(levelRack) - 2) > i) {
                    bayPillarY -= 40;
                } else {
                    bayPillarY -= 20;
                }
            }
            var pillar1 = scene.add.sprite(parseInt(bayPillarX), parseInt(bayPillarY), 'rack_pillar');
            pillar1.setAngle(90);
            pillar1.scaleX = 0.5;
            rackScene.spriteGrp.add(pillar1);

            //==========  สร้างกล่อง  ==========//
            var boxY = 380;
            var nSpriteIndex = 0;    // Index for set sprite_index
            var nSeq = 0;
            // แนวตั้ง  
            for (var y = 0; y < parseInt(levelRack); y++) {
                var boxX = ((parseInt(rackScene.config.width) / 2) - (((parseInt(bayRack) * (parseInt(pallet)) / 2) * 25) + 14)) - 25;

                for (var x = 0; x < parseInt(bayRack); x++) {
                    // เนวนอน
                    var spriteItem = oRack.sprite_items[nSeq];
                    nSeq++;
                    var nameType = 'rack_init';
                    var itemLocations = spriteItem.itemLocations;
                    debugger;
                    for (i = 0; i < itemLocations.length; i++) {
                        boxX += 25;

                        if(itemLocations[i].isClose){
                            nameType = 'rack_close';
                        }else{
                            if (itemLocations[i].isBlock) {
                                nameType = 'rack_unuse';
                            } else if (itemLocations[i].isEmpty) {
                                nameType = 'rack_init';
                            } else {
                                nameType = 'rack_mapped';
                            }

                        }
                        var box = scene.add.sprite(parseInt(boxX), parseInt(boxY), nameType);                 
                        box.location_index = itemLocations[i].location_index;                    
                        box.aisle = oRack.name;
                        box.setInteractive({ useHandCursor: true }, new Phaser.Geom.Rectangle(0, 0, box.width, box.height), Phaser.Geom.Rectangle.Contains);
                        rackScene.spriteGrp.add(box);
                    }
                }
                boxY -= 40;
            }
 
            // สร้าง Label กำกับ  Level
            var LabelLevelX = ((parseInt(rackScene.config.width) / 2) - (((parseInt(bayRack) * (parseInt(pallet)) / 2) * 25) + 14)) - 100;
            var LabelLevelY = 370;
            for(var l = 0; l < parseInt(levelRack); l++) {
               
                var labelLevel = scene.add.text(LabelLevelX, LabelLevelY, rackScene.Level  + " " + (l + 1), { font: "16px Arial", fill: "#111211", align: "center" });
                rackScene.spriteGrp.add(labelLevel);
                LabelLevelY -= 40;
            }

             // สร้าง Label กำกับ  Bay
             var LabelBayX = ((parseInt(rackScene.config.width) / 2) - (((parseInt(bayRack) * (parseInt(pallet)) / 2) * 25) + 14));
             var LabelBayY = 370 - (40 * parseInt(levelRack));
            
             for(var b = 0; b < parseInt(bayRack); b++) {
               
                 var labelBay = scene.add.text(LabelBayX, LabelBayY,  oRack.sprite_items[b].location_Bay, { font: "16px Arial", fill: "#111211", align: "center" });
                 rackScene.spriteGrp.add(labelBay);
                 LabelBayX += 50;
             }

             // สร้าง Header title head bay
             var LabelBayHeadX = ((parseInt(rackScene.config.width) / 2) - 100);
             var LabelBayHeadY = LabelLevelY - 40;
             var labelBay = scene.add.text(LabelBayHeadX, LabelBayHeadY, rackScene.Bay , { font: "18px Arial", fill: "#111211", align: "center" });
             rackScene.spriteGrp.add(labelBay);


            // สร้าง Aisle name title head
            var LabelAisleX = ((parseInt(rackScene.config.width) / 2) - 100);
            var LabelAisleY = LabelBayHeadY - 40;
            var labelAisle = scene.add.text(LabelAisleX, LabelAisleY,   rackScene.Aisle + " " + oRack.name, { font: "18px Arial", fill: "#111211", align: "center" });
            rackScene.spriteGrp.add(labelAisle);
        }

    },
    eventTrigger: function (data, scene) {
        var layout_Index = data.layout_Index;
        rackScene.factory.GetLayoutByindex(layout_Index).then(function (res) {
            if (res.data && res.data.status == "SUCCESS") {
                rackScene.rackData = res.data.layoutItem;
                rackScene.rackUpdate = 1;
            }
            rackScene.statusLoadSideFinish();
        });
    },
    createPointerEvent: function (scene) {
        scene.input.mouse.disableContextMenu();
        scene.input.on('pointerup', function (pointer, gameObject) {
            if (gameObject.length > 0) {              
                var data = {
                    location_index : gameObject[0].location_index,
                    location_id: gameObject[0].location_id,
                    level: gameObject[0].location_Level,
                    bay: gameObject[0].location_Bay,
                    deep: 1,
                    aisle: gameObject[0].aisle,
                    warehouse: '',
                    room: ''
                };
                if (typeof rackScene.rackTrigger === 'function') {
                    rackScene.rackTrigger(data);
                }
            }
        }, scene);
    }
}