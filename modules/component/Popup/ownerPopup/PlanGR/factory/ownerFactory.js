(function () {
    'use strict';
    app.factory("ownerPopFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.PlanGR + "PlanGoodsReceive",
                popupSearch: function (model) {
                    var urlRequest = this.url+ "/Ownerfilter";
                    return clientService.post(urlRequest, model);
                },
                
            }
        });

})();