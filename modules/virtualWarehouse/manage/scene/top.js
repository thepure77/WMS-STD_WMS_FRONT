var topSceneManage = {
    key: 'sceneTop',
    layoutItem: [],
    zoom: 1,
    camera: {},
    containerGrp: {},
    graphics: {},
    warehouseIndex: null,
    warehouseName: null,
    toolArea: 150,
    factory: {},
    updateCallback: null,
    rackEventTrigger: null,
    floorEventTrigger: null,
    labelEventTrigger: null,
    selectedItem: [],
    scene: null,
    pathToolsTop: "",
    preload: function () {
        topSceneManage.scene = this;
        scene = this;
        scene.load.image('grid_tiles', './assets/img/vwm/tile-grid.png');
        scene.load.svg('rack_bar', './assets/img/vwm/empty.svg', { width: 30, height: 30 });
        scene.load.svg('floor_area', './assets/img/vwm/floor.svg', { width: 30, height: 30 });
        scene.load.image('label_text', './assets/img/vwm/label-text.png');
        scene.load.image('human', './assets/img/vwm/human.png');
        topSceneManage.containerGrp = scene.add.group();
      //  topSceneManage.graphics = scene.add.graphics();

        pathToolsTop = './assets/data/topTools.json';
    },
    create: function () {
        topSceneManage.scene = this;
        scene = this;

        topSceneManage.createTileMap(scene);
        topSceneManage.createTools(scene);    // Call Api Get Data 
        topSceneManage.loadData(scene);
        topSceneManage.createDragEvent(scene);
        topSceneManage.createPointerDownEvent(scene);
        topSceneManage.createPointerUpEvent(scene);

        topSceneManage.camera = scene.cameras.main.setBounds(0, 0, 3392, 2048);
        this.cameras.main.setBounds(0, 0, 3392, 2048);
        this.physics.world.setBounds(0, 0, 3392, 2048);

        cursors = this.input.keyboard.createCursorKeys();
        keyEnter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);


        human = this.physics.add.image(70, 300, 'human');
        human.setScale(0.15);
        scene.cameras.main.startFollow(human, true, 0.08, 0.08,);  
        scene.cameras.main.setZoom(4);
    },
    update: function () {  
        // topSceneManage.scene = this;
        // scene = this;

        topSceneManage.zoomUpdate();  
        if (topSceneManage.staUpdate == 1) {
            topSceneManage.destroySprite();
            if(topSceneManage.containerGrp.getChildren().length == 0){
                topSceneManage.createSprite(scene);
                topSceneManage.staUpdate = 0;
            } 
        }

        if(Phaser.Input.Keyboard.JustDown(keyEnter)){ 
            topSceneManage.createRackByHuman();
        }

        if (cursors.left.isDown && human.x > 0)
        {
           // human.setAngle(-180);
            human.x -= 5;
        }
        else if (cursors.right.isDown && human.x < 3392)
        {
           // human.setAngle(0);
            human.x += 5;
        }
    
        if (cursors.up.isDown && human.y > 0)
        {
           // human.setAngle(-90);
            human.y -= 5;
        }
        else if (cursors.down.isDown && human.y < 2048)
        {
             //  human.setAngle(90);
            human.y += 5;
        }
    }, destroySprite () {
       
       // if(topSceneManage.graphics){
            for(var i = 0; i < topSceneManage.containerGrp.getChildren().length;i++){
                var spriteGrp = topSceneManage.containerGrp.getChildren()[i];   
                spriteGrp.destroy();  
             }
       // }
    },
    createTileMap: function (scene) {
        // var y = 6;
        // var x = 9;
        var y = 20;
        var x = 28;

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
        const tiles = map.addTilesetImage('grid_tiles');
        const layer = map.createStaticLayer(0, tiles, topSceneManage.toolArea, 1);

        layer.setScale(2);
        layer.depth = -1;
    },
    createTools: function (scene) {
        topSceneManage.factory.get(pathToolsTop)
            .then(function (res) {
                for (var i = 0; i < res.data.length; i++) {
                    var spriteData = res.data[i];

                    var spriteType = '';
                    var spriteName = '';

                    switch (spriteData.type) {
                        case 'rack-bar-tool':
                            spriteType = 'rack_bar';
                            spriteName = 'rack-bar-tool';
                            break;
                        case 'floor-area-tool':
                            spriteType = 'floor_area';
                            spriteName = 'floor-area-tool';
                            break;
                        case 'label-text-tool':
                            spriteType = 'label_text';
                            spriteName = 'label-text-tool';
                        default:
                            break;
                    }

                    var topToolItem = scene.add.sprite(spriteData.position.x, spriteData.position.y, spriteType);
                    topToolItem.name = spriteName;

                    if (spriteData.type == 'label-text-tool') {
                        topToolItem.setScale(1.2);
                    }

                    topToolItem.setInteractive();
                    scene.input.setDraggable(topToolItem);
                }
            });
    },
    loadData: function (scene) {
        topSceneManage.factory.loadLayout(topSceneManage.warehouseIndex).then(function (res) {
            if (res.data && res.data.status == "SUCCESS") {
                topSceneManage.layoutItem = res.data.layoutItem || [];
              //  topSceneManage.createSprite(scene);
                    topSceneManage.staUpdate = 1;
            }
        });
    },
    reLoadLayout: function (scene) {
        topSceneManage.factory.loadLayout(topSceneManage.warehouseIndex).then(function (res) {
            if (res.data && res.data.status == "SUCCESS") {
                topSceneManage.layoutItem = res.data.layoutItem || [];
               // topSceneManage.containerGrp.clear(true);
              //  topSceneManage.createSprite(scene);
                topSceneManage.staUpdate = 1;
            }
        });
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
            if (gameObject.lastPosition &&
                (gameObject.lastPosition.x != gameObject.x || gameObject.lastPosition.y != gameObject.y)
            ) {
                switch (gameObject.type) {
                    case "rack":
                        if (gameObject.layout_Index != 'undefined'); {
                            var rackmodel = {
                                warehouseIndex: topSceneManage.warehouseIndex,
                                warehouseName: topSceneManage.warehouseName,
                                layout_Index: gameObject.layout_Index,
                                level: gameObject.level,
                                bay: gameObject.bay,
                                deep: gameObject.deep,
                                aisle: (gameObject.aisle == null ? '' : gameObject.aisle),
                                type: gameObject.type,
                                x: gameObject.x - topSceneManage.toolArea,
                                y: gameObject.y,
                                angle: gameObject.angle,
                                status: 1,     // Status 0 Add ,  1 Update
                            };
                           
                            topSceneManage.factory.updateTopRackLocaton(rackmodel).then(function (res) {
                                if (res.data && res.data.status == "SUCCESS") {
                                    topSceneManage.layoutItem = res.data.layoutItem || [];
                                    staUpdate = 1;
                                    if (topSceneManage.updateCallback != null) {
                                        topSceneManage.updateCallback();
                                    }
                                }
                            });
                        }
                        break;
                    case "floor":
                        if (gameObject.layout_Index != 'undefined'); {
                            var floorModel = {
                                layout_Index: gameObject.layout_Index,
                                type: gameObject.type,
                                x: gameObject.x - topSceneManage.toolArea,
                                y: gameObject.y,
                                angle: gameObject.angle,
                                height: gameObject.heightY,
                                width: gameObject.widthX,
                                aisle: gameObject.aisle,
                                status: 1,     // Status 0 Add ,  1 Update
                            };
                       
                            topSceneManage.factory.updateTopRackLocaton(floorModel).then(function (res) {
                                if (res.data && res.data.status == "SUCCESS") {
                                    topSceneManage.layoutItem = res.data.layoutItem || [];
                                    staUpdate = 1;
                                    if (topSceneManage.updateCallback != null) {
                                        topSceneManage.updateCallback();
                                    }
                                }
                            });
                        }
                        break;
                    case "label":
                        if (gameObject.layout_Index != 'undefined'); {
                            var labelModel = {
                                layout_Index: gameObject.layout_Index,
                                type: gameObject.type,
                                x: gameObject.x - topSceneManage.toolArea,
                                y: gameObject.y,
                                angle: gameObject.angle,
                                height: gameObject.heightY,
                                width: gameObject.widthX,
                                status: 1,     // Status 0 Add ,  1 Update
                            };
                            apiFactory.updateTopRackLocaton(labelModel).then(function (res) {
                                if (res.data && res.data.status == "SUCCESS") {
                                    topSceneManage.layoutItem = res.data.layoutItem || [];
                                    staUpdate = 1;
                                    if (topSceneManage.updateCallback != null) {
                                        topSceneManage.updateCallback();
                                    }
                                }
                            });
                        }
                        break;
                    default:
                }
            }

        });
    },
    createPointerUpEvent: function (scene) {
        scene.input.mouse.disableContextMenu();
        scene.input.on('pointerup', function (pointer, gameObject) {
            if (gameObject.length == 0) return;

            if (gameObject[0].lastPosition
                && gameObject[0].lastPosition.x == gameObject[0].x
                && gameObject[0].lastPosition.y == gameObject[0].y
            ) {
                // ปิดการ Click Left for HomePro
                // //Left Click
                // if (gameObject[0] && gameObject[0].type) {
                //     switch (gameObject[0].type) {
                //         case 'rack':
                //             // sideRackStatus = 1;
                //             topSceneManage.selectedItem.push({
                //                 layout_Index: gameObject[0].layout_Index,
                //                 level: gameObject[0].level,
                //                 bay: gameObject[0].bay,
                //                 deep: gameObject[0].deep,
                //                 aisle: (gameObject[0].aisle == null ? 1 : gameObject[0].aisle),
                //                 type: gameObject[0].type,
                //                 x: gameObject[0].x,
                //                 y: gameObject[0].y,
                //                 status: 1,     // Status 0 Add ,  1 Update
                //             });
                            
                //             this.input.stopPropagation();
                //             this.scene.switch('sceneRack');
                //              var sceneRack = this.scene.get('sceneRack');
                //             // sceneRack.create();
                           
                //             break;
                //         case 'floor':
                //             topSceneManage.selectedItem.push({
                //                 layout_Index: gameObject[0].layout_Index,
                //                 level: gameObject[0].level,
                //                 bay: gameObject[0].bay,
                //                 deep: gameObject[0].deep,
                //                 aisle: gameObject[0].aisle,
                //                 type: gameObject[0].type,
                //                 x: gameObject[0].x,
                //                 y: gameObject[0].y,
                //                 status: 1,     // Status 0 Add ,  1 Update
                //             });

                //             this.input.stopPropagation();
                //             this.scene.switch('sceneFloor');
                //             break;
                //         default:
                //             return;
                //     }
                // }
            }
            else {
                //Drag Tool
                switch (gameObject[0].name) {
                    case 'rack-bar-tool':
                        // Popup Dialog for render
                        if (typeof topSceneManage.rackEventTrigger === "function") {
                            var model = {
                                warehouseIndex: topSceneManage.warehouseIndex,
                                warehouseName: topSceneManage.warehouseName,
                                type: 'rack',
                                aisle: '',
                                level: 1,
                                bay: 1,
                                deep: 1,
                                pallet: 2,
                                totalBin: 2,
                                x: gameObject[0].x - topSceneManage.toolArea,
                                y: gameObject[0].y,
                                angle: 0,
                                status: 0,     // Status 0 Add ,  1 Update
                            };
                            debugger;
                            this.scene.pause();
                            topSceneManage.rackEventTrigger(model);
                        }

                        gameObject[0].x = gameObject[0].lastPosition.x;
                        gameObject[0].y = gameObject[0].lastPosition.y;
                        gameObject[0].lastPosition = null;
                        break;

                    case 'floor-area-tool':
                        // Popup Dialog for render
                        if (typeof topSceneManage.floorEventTrigger === "function") {

                            var model = {
                                warehouseIndex: topSceneManage.warehouseIndex,
                                warehouseName: topSceneManage.warehouseName,
                                type: 'floor',
                                x: gameObject[0].x - topSceneManage.toolArea,
                                y: gameObject[0].y,
                                height: 1,
                                width: 1,
                                angle: 0,
                                status: 0,     // Status 0 Add ,  1 Update
                            };

                            this.scene.pause();
                            topSceneManage.floorEventTrigger(model);
                        }

                        gameObject[0].x = gameObject[0].lastPosition.x;
                        gameObject[0].y = gameObject[0].lastPosition.y;
                        gameObject[0].lastPosition = null;
                        break;
                    case 'label-text-tool':
                        // Popup Dialog for render

                        if (typeof topSceneManage.labelEventTrigger === "function") {

                            var model = {
                                warehouseIndex: topSceneManage.warehouseIndex,
                                warehouseName: topSceneManage.warehouseName,
                                type: 'label',
                                plain_Text: '',
                                x: gameObject[0].x - topSceneManage.toolArea,
                                y: gameObject[0].y,
                                angle: 0,
                                status: 0,     // Status 0 Add ,  1 Update
                            };

                            this.scene.pause();
                            topSceneManage.labelEventTrigger(model);
                        }

                        gameObject[0].x = gameObject[0].lastPosition.x;
                        gameObject[0].y = gameObject[0].lastPosition.y;
                        gameObject[0].lastPosition = null;
                        break;
                    default:
                        return;
                }
            }
        }, scene);
    },
    createPointerDownEvent: function (scene) {
        scene.input.mouse.disableContextMenu();
        scene.input.on('pointerdown', function (pointer, gameObject) {
            if (pointer.rightButtonDown()) {
                if (gameObject.length > 0) {

                    switch (gameObject[0].type) {
                        case 'rack':
                            var model = {
                                warehouseIndex: topSceneManage.warehouseIndex,
                                warehouseName: topSceneManage.warehouseName,
                                layout_Index: gameObject[0].layout_Index,
                                level: gameObject[0].level,
                                bay: gameObject[0].bay,
                                deep: gameObject[0].deep,
                                aisle: gameObject[0].aisle,
                                type: gameObject[0].type,
                                x: gameObject[0].x - topSceneManage.toolArea,
                                y: gameObject[0].y,
                                angle: gameObject[0].angle,
                                pallet: gameObject[0].pallet,
                                totalBin: gameObject[0].totalBin,
                                zoneIndex: gameObject[0].zoneIndex,
                                locationTypeIndex: gameObject[0].locationType_Index,
                                roomIndex: gameObject[0].room_Index,
                                prefix: gameObject[0].prefix,
                                lr: gameObject[0].lr,
                                noStartBay: gameObject[0].noStartBay,
                                status: 1,     // Status 0 Add ,  1 Update
                            };

                            if (typeof topSceneManage.rackEventTrigger === "function") {
                                topSceneManage.rackEventTrigger(model);
                            }
                            break;

                        case 'floor':
                         
                            var model = {
                                warehouseIndex: topSceneManage.warehouseIndex,
                                warehouseName: topSceneManage.warehouseName,
                                layout_Index: gameObject[0].layout_Index,
                                type: gameObject[0].type,
                                x: gameObject[0].x - topSceneManage.toolArea,
                                y: gameObject[0].y,
                                angle: gameObject[0].angle,
                                aisle: gameObject[0].aisle,
                                height: gameObject[0].heightY,
                                width: gameObject[0].widthX,
                                zoneIndex: gameObject[0].zoneIndex,
                                locationTypeIndex: gameObject[0].locationType_Index,
                                roomIndex: gameObject[0].room_Index,
                                status: 1,     // Status 0 Add ,  1 Update
                            };

                            if (typeof topSceneManage.floorEventTrigger === "function") {
                                topSceneManage.floorEventTrigger(model);
                            }
                            break;

                        case 'label':
                            var model = {
                                layout_Index: gameObject[0].layout_Index,
                                type: gameObject[0].type,
                                x: gameObject[0].x - topSceneManage.toolArea,
                                y: gameObject[0].y,
                                angle: gameObject[0].angle,
                                height: 1,
                                width: 1,
                                plain_Text: gameObject[0].plain_Text,
                                status: 1,     // Status 0 Add ,  1 Update
                            };

                            if (typeof topSceneManage.labelEventTrigger === "function") {
                                topSceneManage.labelEventTrigger(model);
                            }
                            break;
                        default:
                            return;
                    }
                }
            }
        }, scene);
    },
    createSprite: function (scene) {

        for (var i = 0; i < topSceneManage.layoutItem.length; i++) {

            var layout = topSceneManage.layoutItem[i];
            var containerTop = scene.add.container(layout.x + topSceneManage.toolArea, layout.y);
            containerTop.layout_Index = layout.layout_Index;
            containerTop.type = layout.type;
            containerTop.bay = parseInt(layout.bay);
            containerTop.level = parseInt(layout.level);
            containerTop.deep = parseInt(layout.deep);
            containerTop.angle = parseInt(layout.angle);
            containerTop.widthX = layout.width;
            containerTop.heightY = layout.height;
            containerTop.totalBin = layout.totalBin;
            containerTop.pallet = layout.pallet;
            containerTop.zoneIndex = layout.zoneIndex;
            containerTop.locationType_Index = layout.locationType_Index;
            containerTop.room_Index = layout.room_Index;
            containerTop.aisle = layout.aisle;
            containerTop.prefix = layout.prefix;
            containerTop.lr = layout.lr;
            containerTop.noStartBay = layout.noStartBay;
            var oItems = layout.sprite_items;
            var spriteForRow = parseInt(layout.bay);
            var nX = 0;
            var nY = 0;
            var sizeWidth = 0;

            switch (layout.type) {
                case 'rack':
                    for (n = spriteForRow; n >= 0; n--) {
                        if (n == spriteForRow) {
                            // var spriteItem = oItems[oItems.length - 1];
                            var filterItem = oItems.filter(function (item) {
                                return item.type == 'label';
                            });

                            var text1 = scene.add.text(-55, -10, filterItem[0].plain_Text, { font: "16px Arial", fill: "#111211", align: "center" });
                            nX = 0;
                            sizeWidth += 75;
                            containerTop.aisle = filterItem[0].plain_Text;
                            containerTop.add(text1);
                        } else {
                            var spriteItem = oItems[n];
                            var topSpriteItem = scene.add.sprite(nX, nY, spriteItem.type);
                          //  var topSpriteฺฺBay = scene.add.sprite(nX, nY, spriteItem.);

                            nX += topSpriteItem.width;
                            sizeWidth += topSpriteItem.width;
                            containerTop.add(topSpriteItem);
                        }
                    }
                    containerTop.setSize(sizeWidth, 32, 0, 0);
                    containerTop.setInteractive({useHandCursor: true});
                    containerTop.setAngle(layout.angle);
                    scene.input.setDraggable(containerTop);
                    topSceneManage.containerGrp.add(containerTop);
                    break;
                case 'floor':
                    var spriteItem = oItems[0];
                    var topSpriteItem = scene.add.sprite(nX, nY, spriteItem.type);
                    containerTop.add(topSpriteItem);
                    // containerTop.scaleX = layout.width;
                    // containerTop.scaleY = layout.height;
                    // //  containerTop.setSize(32 * parseInt(layout.width), 32 * parseInt(layout.height) , 0, 0);
                    // containerTop.setSize(32, 32, 0, 0);

                    containerTop.scaleX = layout.width;
                    containerTop.scaleY = layout.height;
                    //  containerTop.setSize(32 * parseInt(layout.width), 32 * parseInt(layout.height) , 0, 0);
                    containerTop.setSize(layout.width , layout.height);
                   

                    var nWidth = layout.width;
                    var nheight = layout.height;
                    if(nWidth < 20){
                        deep = 1;
                        nWidth = 20;
                    }

                    if(nheight < 10){
                        nheight = 10;
                    }
                    containerTop.setSize(nWidth,nheight);
                    containerTop.setInteractive({ useHandCursor: true },new Phaser.Geom.Rectangle(0, 0, nWidth, nheight), Phaser.Geom.Rectangle.Contains);

                   // containerTop.setInteractive({useHandCursor: true});
                    containerTop.setAngle(layout.angle);
                    scene.input.setDraggable(containerTop);
                    topSceneManage.containerGrp.add(containerTop);
                    break;
                case 'label':
                   
                    var spriteItem = oItems[0];
                    var text1 = scene.add.text(0, 0, spriteItem.plain_Text, { font: "16px Arial", fill: "#111211", align: "center" });

                    containerTop.add(text1);
                    containerTop.setSize(128, 32, 0, 0);
                    containerTop.setInteractive();
                    containerTop.setAngle(layout.angle);
                    containerTop.plain_Text = spriteItem.plain_Text;
                    scene.input.setDraggable(containerTop);

                    topSceneManage.containerGrp.add(containerTop);
                    break;
                default:
                    break;
            }
        }
    },
    clearContainer: function () {
        topSceneManage.containerGrp.clear(true);
    },
    zoomIn: function () {
        if (topSceneManage.zoom < 5) {
            topSceneManage.zoom += 1;
        }
    },
    zoomOut: function () {
        if (topSceneManage.zoom > 1) {
            topSceneManage.zoom -= 1
        }
    }, zoomUpdate: function () {
        topSceneManage.camera.zoomTo(
            topSceneManage.zoom, //zoom distance   
            1000 // duration/speed of zoom
        );
    },createRackByHuman : function(){
        if(human.x > topSceneManage.toolArea){
            if (typeof topSceneManage.rackEventTrigger === "function") {
                var model = {
                    warehouseIndex: topSceneManage.warehouseIndex,
                    warehouseName: topSceneManage.warehouseName,
                    type: 'rack',
                    aisle: '',
                    level: 1,
                    bay: 1,
                    deep: 1,
                    pallet: 2,
                    totalBin: 2,
                    x: human.x - topSceneManage.toolArea,
                    y: human.y,
                    angle: 0,
                    status: 0,     // Status 0 Add ,  1 Update
                };
              
               // topSceneManage.scene.pause();
                topSceneManage.rackEventTrigger(model);
            }
        }  
    }
}
