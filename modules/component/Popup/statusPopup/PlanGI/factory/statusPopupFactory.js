(function () {
    'use strict';
    app.factory("statusPopupFactoryPlanGi",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.PlanGI + "PlanGoodsIssue",
                popupFilter: function (model) {    
                    var urlRequest = this.url + "/Statusfilter";
                    return clientService.post(urlRequest,model);                    
                },               
            }
        });

})();