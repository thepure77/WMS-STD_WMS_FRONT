(function () {
    'use strict';
    app.factory("warehousePlanFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.PlanGR + "PlanGoodsReceive",
                popupSearch: function (model) {
                    var urlRequest = this.url+ "/Warehousefilter";
                    return clientService.post(urlRequest, model);
                },
            }
        });

})();