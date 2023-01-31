(function () {
    'use strict';
    app.factory("goodsIssuePopupFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {

            var getData1 ;

            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.GI + "PopupGoodsIssue",
                search: function (model) {     
                    var urlRequest = this.url + "/popupGoodsIssuefilter";
                    return clientService.post(urlRequest, model);
                },
            }
        });

})();