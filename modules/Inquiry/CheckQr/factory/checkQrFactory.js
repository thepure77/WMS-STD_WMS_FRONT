(function () {
    'use strict';
    app.factory("checkQrFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.Rollcage  + "RollCage",


                findCheckQRScanSummary: function (model) {
                    var urlRequest = this.url + "/findCheckQRScanSummary";
                    return clientService.post(urlRequest, model);
                },
                cuttingPallet: function (model) {
                    var urlRequest = this.url + "/cuttingPallet";
                    return clientService.post(urlRequest, model);
                },
            }
        });

})();