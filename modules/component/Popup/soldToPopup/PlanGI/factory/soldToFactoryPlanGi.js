(function () {
    'use strict';
    app.factory("soldToFactoryPlanGi",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.PlanGI + "PlanGoodsIssue",
                popupSearch: function (model) {
                    var urlRequest = this.url+ "/SoldTofilter";
                    return clientService.post(urlRequest, model);
                },
                
            }
        });

})();