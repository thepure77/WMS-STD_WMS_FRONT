var topScene = {
    key: 'sceneTop',
    zoom: 1,
    camera: {},
    spritesGrp: {},
    containerGrp: {},
    warehouseIndex: {},
    paddingLeft: 1,
    paddingTop: 1,
    layoutItem: {},
    factory: {},
    selectedItem: [],
    rackUpdate: 0,
    floorUpdate: 0,
    sideEventTrigger: null,
    layoutRack: {},
    layoutFloor: {},
    scene: null,
    statusUpdate:0,
    human : null,
    statusLoadTopFinish : "",
    preload: function () {
        topScene.scene = this;
        scene = this;

        scene.load.svg('rack_not_empty', './assets/img/vwm/used.svg', { width: 30, height: 30 });
        scene.load.image('grid_tiles', './assets/img/vwm/tile-grid-view.png');
        scene.load.svg('rack_empty', './assets/img/vwm/empty.svg', { width: 30, height: 30 });
        scene.load.svg('rack_block', './assets/img/vwm/block.svg', { width: 30, height: 30 });
        scene.load.svg('floor_area', './assets/img/vwm/floor.svg', { width: 30, height: 30 });
        scene.load.image('human', './assets/img/vwm/human.png');
        topScene.containerGrp = scene.add.group();
    },
    create: function () {
        topScene.scene = this;
        var scene = this;
        topScene.createTileMap(scene);
        topScene.loadData(scene);
        topScene.camera = scene.cameras.main.setBounds(0, 0, 3392, 2048);
        this.cameras.main.setBounds(0, 0, 3392, 2048);
        this.physics.world.setBounds(0, 0, 3392, 2048);


        //this.cameras.main.setBounds(0, 0, 3392, 100);
        //this.physics.world.setBounds(0, 0, 3392, 240);
        cursors = this.input.keyboard.createCursorKeys();
        human = scene.add.image(30, 500, 'human');
        human.setScale(0.15);
        scene.cameras.main.startFollow(human, true, 0.08, 0.08);    
        scene.cameras.main.setZoom(4);
    },
    update: function () {
        topScene.zoomUpdate();   
        if(topScene.statusUpdate == 1){
            topScene.destroySprite();
            if(topScene.containerGrp.getChildren().length == 0){
                topScene.createSprite(scene);
                topScene.createPointerEvent(scene);
                topScene.statusUpdate = 0;
            }       
        }

        if (cursors.left.isDown && human.x > 0)
        {
          //  human.setAngle(-180);
            human.x -= 5;
        }
        else if (cursors.right.isDown && human.x < 3392)
        {
          //  human.setAngle(0);
            human.x += 5;
        }
    
        if (cursors.up.isDown && human.y > 0)
        {
         //   human.setAngle(-90);
            human.y -= 5;
        }
        else if (cursors.down.isDown && human.y < 2048)
        {
            human.y += 5;
           // human.setAngle(90);
        }
    },
    destroySprite () {
        if(topScene.containerGrp){
            for(var i = 0; i < topScene.containerGrp.getChildren().length;i++){
                var spriteGrp = topScene.containerGrp.getChildren()[i];  
                spriteGrp.destroy();  
             }
        }
    },
    loadData: function (scene) {
        topScene.factory.topPreviewData(topScene.warehouseIndex).then(function (res) {
            if (res.data && res.data.status == "SUCCESS") {
                topScene.layoutItem = res.data.layoutItem || [];
               topScene.statusUpdate = 1;
            }
        });
    },
    reLoadLayout: function (scene) {
     //   topScene.statusLoadTopView = "Please wait  loading data top view ...";
        topScene.factory.topPreviewData(topScene.warehouseIndex).then(function (res) {
            if (res.data && res.data.status == "SUCCESS") {
                topScene.layoutItem = res.data.layoutItem || [];
                topScene.statusUpdate = 1;
                topScene.statusLoadTopFinish();
            }
        });
    },
    searchLayout: function (scene, productId, ownerId) {
        var model = {
            warehouseIndex: topScene.warehouseIndex,
            product_id: productId,
            owner_id: ownerId
        };

        // return topScene.factory.topPreviewSearch(model).then(function (res) {
        //     debugger;
        //     if (res.data && res.data.status == "SUCCESS") {
        //         topScene.layoutItem = res.data.layoutItem || [];
        //         topScene.statusUpdate = 1;
        //     }
        //     return "";
        // });

         topScene.factory.topPreviewSearch(model).then(function (res) {
            if (res.data && res.data.status == "SUCCESS") {
                topScene.layoutItem = res.data.layoutItem || [];
                topScene.statusUpdate = 1;
              
            }
            topScene.statusLoadTopFinish();
        });

    },
    createTileMap: function (scene) {
        // var y = 35;
        // var x = 72;
        var y = 130;
        var x = 220;
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
        const tiles = map.addTilesetImage("grid_tiles");
        const layer = map.createStaticLayer(0, tiles, topScene.paddingLeft, topScene.paddingTop);
    },
    createSprite: function (scene) {
        topScene.containerGrp = scene.add.group();
        for (var i = 0; i < topScene.layoutItem.length; i++) {
            var layout = topScene.layoutItem[i];
            var containerTop = scene.add.container(layout.x, layout.y);
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

            var oItems = layout.sprite_items.sort(function (a, b) {
                var keyA = a.seq,
                    keyB = b.seq;
                // Compare the 2 dates
                if (keyA < keyB) return -1;
                if (keyA > keyB) return 1;
                return 0;
            });
           
            //var spriteฺBay = parseInt(layout.bay);
            //var spritelevel = parseInt(layout.level);
            var lr = layout.lr;
            var nX = 0;
            var nY = 0;
            var sizeWidth = 0;

            switch (layout.type) {
                case 'rack':               
                    var filterItem = oItems.filter(function (item) {
                        return item.type == 'label';
                    });

                    var text1 = scene.add.text(-55, -10, filterItem[0].plain_Text, { font: "16px Arial", fill: "#111211", align: "center" });
                    nX = 0;
                    sizeWidth += 75;
                    containerTop.aisle = filterItem[0].plain_Text;
                    containerTop.add(text1);  
                    
                    var ItemsTop = oItems.filter(function (item) {
                        return item.type != 'label';
                    });
                    var nStatus = 0;   // 0 : rack_empty , 1 : rack_not_empty , 2: rack_block
                
                    for(l = 0; l < ItemsTop.length;l++){
                        var topSpriteItem = null;
                        var topSpriteText = "";

                        if(ItemsTop[l].isBlock) {
                            nStatus = 2;
                        } else {    
                            if(ItemsTop[l].isEmpty){
                                nStatus = 0; 
                            } else {
                                nStatus = 1;
                            }
                        }

                        switch(nStatus) {
                            case 2:
                                topSpriteItem = scene.add.sprite(nX, nY, "rack_block");                               
                              break;
                            case 1:
                                topSpriteItem = scene.add.sprite(nX, nY, "rack_not_empty");
                              break;
                            default:
                                topSpriteItem = scene.add.sprite(nX, nY, "rack_empty");       
                        }

                        if(layout.angle == "90"){
                            topSpriteText = scene.add.text(nX -6, nY + 5, ItemsTop[l].location_Bay,{ font: "12px Arial", fill: "#000000", align: "center",wordWrap: true });
                            topSpriteText.setAngle(-90);
                        } else{
                            topSpriteText = scene.add.text(nX -6, nY - 7, ItemsTop[l].location_Bay,{ font: "12px Arial", fill: "#000000", align: "center",wordWrap: true });
                        }                      
                        nX += topSpriteItem.width;
                        sizeWidth += topSpriteItem.width;                       
                        containerTop.add(topSpriteItem);
                        containerTop.add(topSpriteText);

                    }

                    containerTop.setSize(sizeWidth, 32, 0, 0);
                    containerTop.setInteractive({useHandCursor: true});
                    containerTop.setAngle(layout.angle);
                    topScene.containerGrp.add(containerTop);

                    if($("html").hasClass("sidebar-left-collapsed")){   
                        $("html").removeClass("sidebar-left-collapsed");
                       setTimeout(function(){ $("html").addClass("sidebar-left-collapsed"); }, 500);           
                    }else{
                       $("html").addClass("sidebar-left-collapsed"); 
                       setTimeout(function(){ $("html").removeClass("sidebar-left-collapsed"); }, 500);     
                    }
                    break;
                case 'floor':
                    var spriteItem = oItems[0];
                    var topSpriteItem = scene.add.sprite(nX, nY, spriteItem.type);
                    containerTop.add(topSpriteItem);
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
                    containerTop.setAngle(layout.angle);
                    topScene.containerGrp.add(containerTop);
                    break;
                case 'label':
                    var spriteItem = oItems[0];
                    var text1 = scene.add.text(0, 0, spriteItem.plain_Text, { font: "16px Arial", fill: "#111211", align: "center" });

                    containerTop.add(text1);
                    containerTop.setSize(128, 32, 0, 0);
                    containerTop.setInteractive();
                    containerTop.setAngle(layout.angle);
                    containerTop.plain_Text = spriteItem.plain_Text;

                    topScene.containerGrp.add(containerTop);
                    break;
                default:
                    break;
            }
        }
    },
    createPointerEvent: function (scene) {
        scene.input.mouse.disableContextMenu();

        scene.input.on('pointerup', function (pointer, gameObject) {
            if (gameObject.length > 0) {
               
                switch (gameObject[0].type) {
                    case 'rack':
                        
                        var data = {
                            layout_Index: gameObject[0].layout_Index,
                            level: gameObject[0].level,
                            bay: gameObject[0].bay,
                            deep: gameObject[0].deep,
                            aisle: (gameObject[0].aisle == null ? '' : gameObject[0].aisle),
                            type: gameObject[0].type,
                            x: gameObject[0].x,
                            y: gameObject[0].y,
                            status: 1,     // Status 0 Add ,  1 Update
                        };

                        if (typeof topScene.sideEventTrigger === 'function') {
                            topScene.sideEventTrigger(data);
                        }
                       // window.scrollTo(0,document.body.scrollHeight);
                       $("html, body").animate({ 
                        scrollTop: $( 
                          'html, body').get(0).scrollHeight 
                        }, 500);
                        break;
                    case 'floor':
                        var data = {
                            layout_Index: gameObject[0].layout_Index,
                            level: gameObject[0].level,
                            bay: gameObject[0].bay,
                            deep: gameObject[0].deep,
                            aisle: (gameObject[0].aisle == null ? '' : gameObject[0].aisle),
                            type: gameObject[0].type,
                            x: gameObject[0].x,
                            y: gameObject[0].y,
                            status: 1,     // Status 0 Add ,  1 Update
                        };

                        if (typeof topScene.sideEventTrigger === 'function') {
                            topScene.sideEventTrigger(data);
                        }
                        //window.scrollTo(0,document.body.scrollHeight);
                        break;
                    default:
                        return;
                }
            }

        }, scene);
    },
    zoomUpdate: function () {
        topScene.camera.zoomTo(
            topScene.zoom, //zoom distance   
            1000 // duration/speed of zoom
        );
    }
}