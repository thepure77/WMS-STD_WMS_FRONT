(function () {
    'use strict';
    app.factory("vwPreviewFactory", function (localStorageService, webServiceAPI, clientService) {
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
            topPreviewData: function (model) {
                var urlRequest = this.url + "TopPreviewLoadLayout/" + model;
                return clientService.get(urlRequest);
            },
            topPreviewSearch: function (model) {
                var urlRequest = this.url + "TopPreviewLoadLayout";
                return clientService.post(urlRequest, model);
            },
            GetLayoutByindex: function (model) {
                var urlRequest = this.url + "SideViewRackLoadLayout/" + model;
                return clientService.get(urlRequest, model);
            },
            loadRoom: function (model) {
                var urlRequest = this.url + "Room";
                return clientService.post(urlRequest, model);
            },
            loadProduct: function (model) {
                var urlRequest = this.url + "Product";
                return clientService.post(urlRequest, model);
            },
            loadItemStatus: function (model) {
                var urlRequest = this.url + "ItemStatus";
                return clientService.post(urlRequest, model);
            },
            getDetailBinBalance: function (model) {
                var urlRequest = this.url + "GetDetailBinbalance";
                return clientService.post(urlRequest, model);
            },
            FilterProductByLocationId: function (model) {
                var urlRequest = this.url + "FilterProductByLocationId";
                return clientService.post(urlRequest, model);
            },
            getDetailBinBalanceRack: function (model) {
                var urlRequest = this.url + "getDetailBinBalanceRack";
                return clientService.post(urlRequest, model);
            }, updateDataWarehouse : function (model) {
                var urlRequest = this.urlTemp + "TopPreviewLoadTemp";
                return clientService.get(urlRequest);
            },loadOwner: function (model) {
                var urlRequest = this.url + "Owner";
                return clientService.post(urlRequest, model);
            }
        }
    });
})();