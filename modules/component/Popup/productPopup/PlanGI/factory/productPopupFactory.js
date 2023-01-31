(function () {
    'use strict';
    app.factory("productPopupFactoryPlanGi",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.PlanGI + "PlanGoodsIssue",
                getProduct: function (model) {     
                    
                    var urlRequest = this.url + "/Productfilter";
                    return clientService.post(urlRequest, model);
                },
            }
        });

})();