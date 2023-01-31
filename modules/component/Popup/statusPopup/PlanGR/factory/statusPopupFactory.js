(function () {
    'use strict';
    app.factory("statusPopupPlanFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.PlanGR + "PlanGoodsReceive",
                popupFilter: function (model) {    
                    var urlRequest = this.url + "/Statusfilter";
                    return clientService.post(urlRequest,model);                    
                },               
            }
        });

})();