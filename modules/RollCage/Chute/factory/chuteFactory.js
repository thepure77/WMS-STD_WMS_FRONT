(function () {
    'use strict';
    app.factory("chuteFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.Rollcage + "RollCage",
                urlDropdown: webServiceAPI.Rollcage + "DropdownRollCage",

                dropdownchute: function (model) {
                    var urlRequest = this.urlDropdown +"/dropdownChute";
                    return clientService.post(urlRequest, model);
                },
            }
        });

})();