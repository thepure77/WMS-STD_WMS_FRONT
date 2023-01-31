(function () {
    'use strict';
    app.factory("locationPartialFactory",
        function ($q, $http, ngAuthSettings, localStorageService, webServiceAPI, clientService) {
            var getData1;
            var getDataitem;
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.GT + "TransferBypassController",
                
                checkWaveWCS_location: function (model) {
                    var urlRequest = this.url + "/filter";
                    return clientService.post(urlRequest, model);
                },
                create_bypass: function (model) {
                    var urlRequest = this.url + "/confirmTranferBypass";
                    return clientService.post(urlRequest, model);
                },
                getlocation: function (model) {
                    var urlRequest = this.url + "/getlocation";
                    return clientService.post(urlRequest, model);
                },


            }
        });
})();
