(function () {
    'use strict';
    app.factory("reasonCodeStockFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.Transfer + "TransferStockAdjustment",
                filter: function (model) {
                    var urlRequest = this.url + "/filterReasonCode";
                    return clientService.get(urlRequest, model);
                }
                
            }
        });

})();