(function () {
    'use strict';
    app.factory("vwManageTopFactory", function (localStorageService, webServiceAPI, clientService) {
        return {
            storageName: "userTokenStorage",
            get: clientService.get,
            post: clientService.post,
            url: webServiceAPI.VirtualWarehousePreview + "",
           

            loadZone: function (model) {
                var urlRequest = this.url + "Zone";
                return clientService.post(urlRequest, model);
            },
            loadRoom: function (model) {
                var urlRequest = this.url + "Room";
                return clientService.post(urlRequest, model);
            },
            loadLocationType: function (model) {
                var urlRequest = this.url + "LocationType";
                return clientService.post(urlRequest, model);
            },
            loadLayout: function (warehouseIndex) {
                var urlRequest = this.url + "TopManageLoadLayout/" + warehouseIndex;
                return clientService.get(urlRequest);
            },
            saveTopRack: function (model) {
                var urlRequest = this.url + "TopManageSaveRack";
                return clientService.post(urlRequest, model);
            },
            updateTopRack: function (model) {
                var urlRequest = this.url + "TopManageUpdateRack";
                return clientService.post(urlRequest, model);
            },
            saveTopFloor: function (model) {
                var urlRequest = this.url + "TopManageSaveFloor";
                return clientService.post(urlRequest, model);
            },
            TopManageItemUpdate: function (model) {
                var urlRequest = this.url + "TopManageItemUpdate";
                return clientService.post(urlRequest, model);
            },
            updateTopRackLocaton : function (model) {
                var urlRequest = this.url + "TopManageLayoutUpdate";
                return clientService.post(urlRequest, model);
            },
            GetLayoutByindex : function (model) {
                var urlRequest = this.url + "SideRackManageLayout/"+ model;
                return clientService.get(urlRequest, model);
            },
            sideViewRackSave : function (model) {
                var urlRequest = this.url + "SideViewRackSave";
                return clientService.post(urlRequest, model);
            } ,
            laySpriteUpDate : function (model) {
                var urlRequest = this.url + "TopViewSave/LayoutSpriteUpDate";
                return clientService.post(urlRequest, model);
            }, 
            inActive: function (model) {
                var urlRequest = this.url + "TopManageLayoutDelete";
                return clientService.post(urlRequest, model);
            } , 
            SideFloorManageSave: function (model) {
                var urlRequest = this.url + "SideFloorManageSave";
                return clientService.post(urlRequest, model);
            }, LocationAisle: function (model) {
                var urlRequest = this.url + "LocationAisle";
                return clientService.post(urlRequest, model);
            }

        }
    });
})();