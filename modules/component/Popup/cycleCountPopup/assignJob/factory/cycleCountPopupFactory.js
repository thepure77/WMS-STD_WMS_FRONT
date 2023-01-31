(function () {
    'use strict';
    app.factory("cycleCountPopupFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {

            var getData1 ;

            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.Cyclecount + "AssignJob",
                search: function (model) {     
                    var urlRequest = this.url + "/popupCyclecountfilter";
                    return clientService.post(urlRequest, model);
                },
            }
        });

})();