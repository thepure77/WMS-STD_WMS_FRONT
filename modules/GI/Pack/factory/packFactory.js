(function () {
    'use strict';
    app.factory("packFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.Pack + "Pack",
                search: function (model) {
                    var urlRequest = this.url+ "/giSearch";
                    return clientService.post(urlRequest, model);
                },   
                selectItem: function (model) {
                    var urlRequest = this.url+ "/selectItem";
                    return clientService.post(urlRequest, model);
                }, 
                scanBarcode: function (model) {
                    var urlRequest = this.url+ "/scanBarcode";
                    return clientService.post(urlRequest, model);
                }, 
                CreatePackHeader: function (model) {
                    var urlRequest = this.url+ "/CreatePackHeader";
                    return clientService.post(urlRequest, model);
                }, 
                findPackItem: function (model) {
                    var urlRequest = this.url+ "/findPackItem";
                    return clientService.post(urlRequest, model);
                }, 
                ClosePack: function (model) {
                    var urlRequest = this.url+ "/ClosePack";
                    return clientService.popupReport(urlRequest, model);
                },
                getPack: function (model) {
                    var urlRequest = this.url+ "/getPack";
                    return clientService.post(urlRequest, model);
                },
                getPackItem: function (model) {
                    var urlRequest = this.url+ "/getPackItem";
                    return clientService.post(urlRequest, model);
                },
                printPack: function (model) {
                    var urlRequest = this.url+ "/printPack";
                    return clientService.popupReport(urlRequest, model);
                },
                deletePack: function (model) {
                    var urlRequest = this.url+ "/deletePack";
                    return clientService.post(urlRequest, model);
                },
                checkScanBarcode: function (model) {
                    var urlRequest = this.url+ "/checkScanBarcode";
                    return clientService.post(urlRequest, model);
                }, 
                filterPack: function (model) {
                    var urlRequest = this.url+ "/filterPack";
                    return clientService.post(urlRequest, model);
                },
                deleteIsPack: function (model) {
                    var urlRequest = this.url+ "/deleteIsPack";
                    return clientService.post(urlRequest, model);
                },
                filterSum: function (model) {
                    var urlRequest = this.url+ "/filterSum";
                    return clientService.post(urlRequest, model);
                },
            }
        });

})();