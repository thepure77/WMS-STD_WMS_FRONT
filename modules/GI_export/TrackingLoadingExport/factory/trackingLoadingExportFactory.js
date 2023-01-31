(function () {
    'use strict';
    app.factory("trackingLoadingExportFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.GI  + "TrackingLoading",


                scan_shipment: function (model) {
                    var urlRequest = this.url + "/findShipment";
                    return clientService.post(urlRequest, model);
                },
                savetracking: function (model) {
                    var urlRequest = this.url + "/savetracking";
                    return clientService.post(urlRequest, model);
                },
            }
        });

})();