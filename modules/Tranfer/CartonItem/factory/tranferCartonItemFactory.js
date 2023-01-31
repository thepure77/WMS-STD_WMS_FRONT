(function () {
    'use strict';
    app.factory("tranferCartonItemFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.Transfer + "TransferItem",
                Save: function (model) {
                    var urlRequest = this.url + "/SaveData";
                    return clientService.post(urlRequest, model);
                },    

                            
            }
        });

})();