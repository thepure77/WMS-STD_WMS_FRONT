(function () {
    'use strict';
    app.factory("reportSignerPopupFactory",
        function ($q, $http, ngAuthSettings, localStorageService, webServiceAPI, clientService) {
            var getData;

            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.Master,
                urlGR: webServiceAPI.GR + "GoodsReceive",

                filter: function (model) {
                    var urlRequest = this.url + "/filter";
                    return clientService.get(urlRequest, model);
                },
                findUser: function (model) {
                    var urlRequest = this.urlGR + "/findUser";
                    return clientService.post(urlRequest, model);
                },
            }
        });

})();