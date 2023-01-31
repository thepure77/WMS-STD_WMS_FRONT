(function () {
    'use strict';
    app.factory("itemStatusFactoryPlanGi",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.PlanGI + "PlanGoodsIssue",
                filter: function (model) {
                    var urlRequest = this.url+ "/itemStatusfilter";
                    return clientService.post(urlRequest, model);
                },
                search: function (model) {
                    var urlRequest = this.url+ "/itemStatusfilter";
                    return clientService.post(urlRequest, model);
                }
            }
        });

})();