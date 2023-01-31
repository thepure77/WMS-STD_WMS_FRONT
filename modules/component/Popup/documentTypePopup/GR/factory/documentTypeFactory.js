(function () {
    'use strict';
    app.factory("documentTypeGrFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.GR + "GoodsReceive",
                popupPlanGRSearch: function (model) {
                    var urlRequest = this.url+ "/DocumentTypefilter";
                    return clientService.post(urlRequest, model);
                },

            }
        });

})();