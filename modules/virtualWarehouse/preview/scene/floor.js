var floorScene = {
    key: 'floorScene',
    paddingTop: 1,
    paddingLeft: 1,
    camera: {},
    spriteGrp: {},
    scene: null,
    floorData:{},
    config:{},
    floorTrigger:null,
    floorUpdate:0,
    preload: function () {
        floorScene.scene = this;
        var scene = floorScene.scene;

        scene.load.image('back_tiles', './assets/img/vwm/tile-grid-view.png');
        scene.load.image('back_to_top', './assets/img/vwm/floor-grid.png');
        scene.load.image('floor_ground', './assets/img/vwm/floor-ground.png');
        scene.load.image('floor_product_item', './assets/img/vwm/floor-product-item.png');
       
    },
    create: function () {
        floorScene.scene = this;
        var scene = floorScene.scene;
        floorScene.createTileMap(scene);
        floorScene.createTileMap(scene);
        floorScene.createSprite(scene);
        floorScene.createSideFloorPointerEvent(scene);

        floorScene.camera = scene.cameras.main.setBounds(0, 0, 640, 340);
        floorScene.spriteGrp = scene.add.group();
      
    },
    update: function () {
        if(floorScene.floorUpdate == 1){
          
            floorScene.spriteGrp.clear(true);
            floorScene.renderSprite(floorScene.scene);
            floorScene.floorUpdate = 0;
        }
    },
    createTileMap: function (scene) {
        // var y = 34;
        // var x = 64;
        var y = 47;
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
        const layer = map.createStaticLayer(0, tiles, floorScene.paddingLeft, floorScene.paddingTop);
    },
    createSprite: function (scene) {
        //  floorScene.createGround(scene);
        // $http.get('src/app/virtual-warehouse/data/sideFloorSprite.json')
        //     .success(function (data) {
        //         floorScene.LayoutItem = data || [];
        //         floorScene.renderSprite(scene);
        //     });
    },
    createGround: function (scene) {
        //create ground
        var groundX = 50;
        var groundY = 420;
        var groundSpriteWidth = 25;

        for (var i = 0; i < 36; i++) {
            var ground = scene.add.sprite(groundX + (i * groundSpriteWidth), groundY, 'floor_ground');
        }
    },
    renderSprite: function (scene) {
       
         //create ground
         var groundX = 80;
         var groundY = 700;
         var groundSpriteWidth = 80;

        if(floorScene.spriteGrp != {}){
            floorScene.spriteGrp.clear(true);           
        }

        for (var i = 0; i < 18; i++) {
            var ground = scene.add.sprite(groundX + (i * groundSpriteWidth), groundY, 'floor_ground');
            floorScene.spriteGrp.add(ground);           
        }

        var oFloor = floorScene.floorData[0];
    
        if (oFloor.sprite_items.length > 0) {
            var floorItem = oFloor.sprite_items[0];

            if(floorItem.location_id == null) {
                var box = scene.add.sprite((floorScene.config.width / 2), groundY - 76, 'floor-product-item-Empty');
            }else{
                var box = scene.add.sprite((floorScene.config.width / 2), groundY - 76, 'floor_product_item');
            }

           
            box.setScale(4);
            box.location_Level = 1;
            box.location_Bay = 1;
            box.location_Depth = 1;

            box.sprite_Index = floorItem.sprite_Index;
            box.location_id = floorItem.location_id;
            //box.setInteractive();
            box.setInteractive({ useHandCursor: true },new Phaser.Geom.Rectangle(0, 0, box.width, box.height), Phaser.Geom.Rectangle.Contains);
            floorScene.spriteGrp.add(box);
        } 
    },
    eventTrigger: function(data, scene){
        var layout_Index = data.layout_Index;
        floorScene.factory.GetLayoutByindex(layout_Index).then(function (res) {
            debugger;
            if (res.data && res.data.status == "SUCCESS") {
                floorScene.floorData = res.data.layoutItem
                floorScene.floorUpdate = 1;
            }
        });
    },
    createSideFloorPointerEvent: function (scene) {
        scene.input.mouse.disableContextMenu();
        scene.input.on('pointerup', function (pointer, gameObject) {
            if (gameObject.length > 0) {
                var data = {
                    warehouse: '',
                    room: '',
                    location_id : gameObject[0].location_id
                };  
               
                if (typeof floorScene.floorTrigger === 'function') {
                    floorScene.floorTrigger(data);
                }
            }
        }, scene);
    }
};