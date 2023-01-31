(function () {
    'use strict';
    app.factory("routeFactoryPlanGi",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.PlanGI + "PlanGoodsIssue",
                filter: function (model) {
                    var urlRequest = this.url + "/Routefilter";
                    return clientService.post(urlRequest, model);
                },  
                search: function (model) {
                    var urlRequest = this.url+ "/Routefilter";
                    return clientService.post(urlRequest, model);
                },
                
            }
        });

})();