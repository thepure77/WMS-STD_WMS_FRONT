(function () {
    'use strict';
    app.factory("goodIssueFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.GI + "GoodIssue",
                filter: function (model) {
                    var urlRequest = this.url + "/filter";
                    return clientService.get(urlRequest, model);
                },
                getId: function (model) {
                    var urlRequest = this.url + "/" + model;
                    return clientService.get(urlRequest);
                },
                add: function (model) {                        
                    var urlRequest = this.url;
                    return clientService.post(urlRequest, model);
                },
                edit: function (model) {                        
                    var urlRequest = this.url;
                    return clientService.post(urlRequest, model);
                },  
                search: function (model) {
                    var urlRequest = this.url+ "/Search";
                    return clientService.post(urlRequest, model);
                },    
                giSearch: function (model) {
                    var urlRequest = this.url+ "/GISearch" + "/";
                    return clientService.post(urlRequest, model);
                },  
                Undo: function (model) {
                    var urlRequest = this.url + "/Undo" + "/" + model;
                    return clientService.get(urlRequest);
                }, 
                Cancel: function (model,user) {
                    var urlRequest = this.url + "/Cancel" + "/" + model + "/"+ user;
                    return clientService.get(urlRequest);
                },  
                confirm: function (model) {
                    var urlRequest = this.url + "/ConfirmGoodsIssue";
                    return clientService.post(urlRequest, model);
                },          
            }
        });

})();