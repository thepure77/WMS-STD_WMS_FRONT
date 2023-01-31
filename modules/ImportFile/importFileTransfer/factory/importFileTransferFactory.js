(function () {
    'use strict';
    app.factory("importFileTransferFactory",
        function ($q, $http, ngAuthSettings, localStorageService, webServiceAPI, clientService) {
            var data
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.GT,
                set: function (model) {
                    data = model;
                },
                get: function () {
                    return data
                },
                importsTransfer: function (model) {
                    var urlRequest = this.url + "/ImportGoodsTransfer/validateImportTranfer";
                    return clientService.post(urlRequest, model);
                },
                confirmTransfer: function (model) {
                    var urlRequest = this.url + "/ImportGoodsTransfer/confirmImportTranfer";
                    return clientService.post(urlRequest, model);
                }
                // api/ImportGoodsTransfer/validateImportTranfer
            }
        });

})();