(function () {
    'use strict';
    app.factory("goodsTransferPopupFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {

            var getData1 ;

            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.GT + "PopupGoodsTransfer",
                search: function (model) {     
                    var urlRequest = this.url + "/popupGoodsTransferfilter";
                    return clientService.post(urlRequest, model);
                },
            }
        });

})();