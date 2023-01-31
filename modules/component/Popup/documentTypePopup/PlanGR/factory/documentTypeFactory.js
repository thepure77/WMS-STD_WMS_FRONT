(function () {
    'use strict';
    app.factory("documentTypePlanFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.PlanGR + "PlanGoodsReceive",
                popupPlanGRSearch: function (model) {
                    var urlRequest = this.url+ "/DocumentTypefilter";
                    return clientService.post(urlRequest, model);
                },

            }
        });

})();