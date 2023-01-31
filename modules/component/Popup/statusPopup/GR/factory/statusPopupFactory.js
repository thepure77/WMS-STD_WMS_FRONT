(function () {
    'use strict';
    app.factory("statusPopupGrFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.GR + "GoodsReceive",
                popupFilter: function (model) {    
                    var urlRequest = this.url + "/Statusfilter";
                    return clientService.post(urlRequest,model);                    
                },               
            }
        });

})();