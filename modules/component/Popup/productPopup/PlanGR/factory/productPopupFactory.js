(function () {
    'use strict';
    app.factory("productPopupFactoryPlan",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.PlanGR + "PopupPlanGoodsReceive",
                getProduct: function (model) {     
                    var urlRequest = this.url + "/PopupProductfilter";
                    return clientService.post(urlRequest, model);
                },
            }
        });

})();