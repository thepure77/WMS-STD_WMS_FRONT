(function () {
    'use strict';
    app.factory("poPopupFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {

            var getData1 ;

            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.PlanGR + "PopupPlanGoodsReceive",
                search: function (model) {     
                    var urlRequest = this.url + "/PlanPOfilterPopup";
                    return clientService.post(urlRequest, model);
                },
            }
        });

})();