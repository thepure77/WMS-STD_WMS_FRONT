(function () {
    'use strict';
    app.factory("ruleConditionOperationPopupFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.Master + "RuleConditionOperationPopup",
                filter: function (model) {
                    var urlRequest = this.url + "/filterruleconditionoperationpopup";
                    return clientService.post(urlRequest, model);
                },
                getId: function (model) {
                    var urlRequest = this.url + "/" + model;
                    return clientService.get(urlRequest);
                },
                getDelete: function (model) {
                    var urlRequest = this.url + "/" + model;
                    return clientService.delete(urlRequest);
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
                    var urlRequest = this.url+ "/search";
                    return clientService.post(urlRequest, model);
                },
            }
        });

})();