(function () {
    'use strict';
    app.factory("goodsReceivePopupFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {

            var getData1 ;

            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.GR + "GoodsReceive",
                search: function (model) {     
                    var urlRequest = this.url + "/popupGoodsReceivefilter";
                    return clientService.post(urlRequest, model);
                },
            }
        });

})();