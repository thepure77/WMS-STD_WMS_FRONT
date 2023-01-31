(function () {
    'use strict';
    app.factory("ownerPopFactoryPlanGi",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.PlanGI + "PlanGoodsIssue",
                popupSearch: function (model) {
                    var urlRequest = this.url+ "/Ownerfilter";
                    return clientService.post(urlRequest, model);
                },
                
            }
        });

})();