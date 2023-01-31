(function () {
    'use strict';
    app.factory("tagOutFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
            var getData1 ;
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.GI + "TagOut",
                urlDropdown: webServiceAPI.GI + "DropdownGoodsIssue",
                urlLogsRequest: webServiceAPI.LogsUser + "Logs/insertLogsRequest",

                tagOutfilter: function (model){
                    var urlRequest = this.url+ "/tagOutfilter";
                    return clientService.post(urlRequest, model);
                }, 
                tagOutPopup: function (model){
                    var urlRequest = this.url+ "/tagOutPopup";
                    return clientService.post(urlRequest, model);
                }, 
                ReportTagout: function (model) {
                    var urlRequest = this.url + "/ReportTagout";
                    return clientService.popupReport(urlRequest, model);
                },
                dropdownUser: function (model){
                    var urlRequest = this.urlDropdown+ "/dropdownUser";
                    return clientService.post(urlRequest, model);
                }, 
                Savetag: function (model){
                    var urlRequest = this.url+ "/Savetag";
                    return clientService.post(urlRequest, model);
                },
                Deletetag: function (model){
                    var urlRequest = this.url+ "/Deletetag";
                    return clientService.post(urlRequest, model);
                }, 
                printtote: function (model){
                    var urlRequest = this.url+ "/printtote";
                    return clientService.post(urlRequest, model);
                }, 
            }
        });
})();