(function () {
    'use strict';
    app.factory("vwManageFactory", function (localStorageService, webServiceAPI, clientService) {
        return {
            storageName: "userTokenStorage",
            get: clientService.get,
            post: clientService.post,
            url: webServiceAPI.VirtualWarehousePreview + "",
            urlTemp: webServiceAPI.VirtualWarehouseTemp + "",

            loadWarehouse: function (model) {
                var urlRequest = this.url + "Warehouse";
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
                var urlRequest = this.url + "TopManageInactiveLayout";
                return clientService.post(urlRequest, model);
            } , 
            SideFloorManageSave: function (model) {
                var urlRequest = this.url + "SideFloorManageSave";
                return clientService.post(urlRequest, model);
            }, updateDataWarehouse : function (model) {
                var urlRequest = this.urlTemp + "TopPreviewLoadTemp";
                return clientService.get(urlRequest);
            }
        }
    });
})();