var floorSceneManage = {
    key: 'sceneFloor',
    camera: {},
    factory: {},
    paddingTop : 10,
    paddingLeft : 10,
    spaceTop :32,
    selectedLayout: [],
    floorData:{},
    config:{},
    spriteFloorGrp: {},
    preload: function() {
        this.load.image('back_tiles', './src/assets/img/vwm/tile-grid-view.png');
        this.load.image('back_to_top', './src/assets/img/vwm/floor-grid.png');
        this.load.svg('floor_ground', './src/assets/img/vwm/rack_orange.svg', { width: 80, height: 4 });
        this.load.image('floor_product_item', './src/assets/img/vwm/floor-product-item.png');
    },
    create: function() {
        var scene = this;

        floorSceneManage.createBackToTopButton(scene);
        floorSceneManage.createTileMap(scene);
        // createSideFloorSprite(this);
        sideFloorStatus = 1;

        floorSceneManage.createDragEvent(scene);
        floorSceneManage.createPointerUpEvent(scene);
        floorSceneManage.createPointerDownEvent(scene);
        floorSceneManage.camera = scene.cameras.main.setBounds(0, 0, 640, 340);
        floorSceneManage.spriteFloorGrp = scene.add.group();
    },
    update: function() {
        if (sideFloorStatus == 1) {
            var scene = this;
            setTimeout(() => {
                floorSceneManage.spriteFloorGrp.clear(scene);
            }, 500);


            setTimeout(() => {
                floorSceneManage.createSprite(scene);
            }, 500);
            sideFloorStatus = 0;
        }
    },
    createTileMap: function(scene) {
        var y = 12 - (floorSceneManage.spaceTop / 16);
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
        const layer = map.createStaticLayer(0, tiles, floorSceneManage.paddingLeft, floorSceneManage.paddingTop + floorSceneManage.spaceTop);
        layer.setScale(2);
        layer.depth = -1;
    },
    createSprite: function(scene) {
        if(floorSceneManage.selectedLayout.length > 0){
            var dataIndex = floorSceneManage.selectedLayout[0].layout_Index;
            floorSceneManage.factory.GetLayoutByindex(dataIndex).then(function (res) {
                if (res.data && res.data.status == "SUCCESS") {
                    floorSceneManage.floorData = res.data.layoutItem;
                    floorSceneManage.renderSprite(scene);
                }
            });
        }
    },
    renderSprite: function(scene) {
        //create ground
        var groundX = 80;
        var groundY = 700;
        var groundSpriteWidth = 80;
      
        for (var i = 0; i < 20; i++) {
            var ground = scene.add.sprite(groundX + (i * groundSpriteWidth), groundY, 'floor_ground');
            floorSceneManage.spriteFloorGrp.add(ground);
        }

        var oFloor = floorSceneManage.floorData[0];

        if (oFloor.sprite_items.length > 0) {
            var floorItem = oFloor.sprite_items[0];

            var box = scene.add.sprite((floorSceneManage.config.width / 2), groundY - 78, 'floor_product_item');
            box.setScale(4);
            box.location_Level = 1;
            box.location_Bay = 1;
            box.location_Depth = 1;
            box.sprite_Index = floorItem.sprite_Index;
            box.setInteractive();
            scene.input.setDraggable(box);
            floorSceneManage.spriteFloorGrp.add(box);

        }



        // for (var i = 0; i < $vm.sideFloorData.length; i++) {
        //     var spriteData = $vm.sideFloorData[i];

        //     switch (spriteData.type) {
        //         case "floor-product-item":
        //             var productItem = scene.add.sprite(spriteData.position.x + paddingLeft, spriteData.position.y + paddingTop, 'floor_product_item');
        //             productItem.setScale(2.0);
        //             productItem.setInteractive();

        //             scene.input.setDraggable(productItem);

        //             break;
        //         case "floor-ground":
        //             var ground = scene.add.sprite(spriteData.position.x + paddingLeft, spriteData.position.y + paddingTop, 'floor_ground');
        //             ground.setScale(3.0);
        //             break;
        //         default:
        //             break;
        //     }
        // }
    },
    createDragEvent: function(scene) {
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
    createPointerUpEvent: function(scene) {
        scene.input.mouse.disableContextMenu();

        scene.input.on('pointerup', function (pointer, gameObject) {
            if (gameObject.length > 0) {
                if (gameObject[0].lastPosition) {
                    if (gameObject[0].lastPosition.x == gameObject[0].x
                        && gameObject[0].lastPosition.y == gameObject[0].y
                    ) {

                    }
                    else {

                    }
                }
                else {
                    switch (gameObject[0].texture.key) {
                        case 'back_to_top':
                            this.input.stopPropagation();
                            this.scene.switch('sceneTop');
                            break;
                        default:
                            return;
                    }
                }
            }
        }, scene);
    },
    createPointerDownEvent: function(scene) {
        scene.input.mouse.disableContextMenu();

        scene.input.on('pointerdown', function (pointer, gameObject) {
            if (pointer.rightButtonDown()) {
                if (gameObject.length > 0) {

                    if (typeof $scope.popupObj.sidefloor.trigger === "function") {
                        $scope.popupObj.sidefloor.model = {
                            location_Level: 1,
                            location_Bay: 1,
                            location_Depth: 1,
                            aisle: (gameObject[0].aisle == null ? 1 : gameObject[0].aisle),
                            type: gameObject[0].type,
                            x: gameObject[0].x,
                            y: gameObject[0].y,
                            sprite_Index: gameObject[0].sprite_Index,
                            status: 1,     // Status 0 Add ,  1 Update
                        };
                        $('#refreshTop').click();
                        $scope.popupObj.sidefloor.trigger();
                    }
                }
            }
        }, scene);
    },
    createBackToTopButton: function(scene) {
        var backToTop = scene.add.sprite(floorSceneManage.paddingLeft + 16, floorSceneManage.paddingTop + 16, 'back_to_top');
        backToTop.setInteractive();
    }
};

