(function () {
    'use strict';
    app.factory("shipToFactoryPlanGi",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                    url: webServiceAPI.PlanGI + "PlanGoodsIssue",
                    popupSearch: function (model) {
                        var urlRequest = this.url+ "/ShipTofilter";
                        return clientService.post(urlRequest, model);
                    },
                    filter: function (model) {     
                        var urlRequest = this.url+ "/ShipTofilter";
                        return clientService.post(urlRequest, model);
                    },
            }
        });

})();