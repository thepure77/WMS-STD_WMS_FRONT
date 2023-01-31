(function () {
    'use strict';
    app.factory("configSkuFactory",
        function ($q, $http, ngAuthSettings, localStorageService, webServiceAPI, clientService) {
            var getData1;
            var getDataitem;
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.Master_V2 + "EquipmentStatus",
               
                
                
                filter: function (model) {
                    var urlRequest = this.url + "/filter";
                    return clientService.post(urlRequest, model);
                },
                updateCrane_status: function (model) {
                    var urlRequest = this.url + "/updateCrane_status";
                    return clientService.post(urlRequest, model);
                },
            }
        });

   
})();
