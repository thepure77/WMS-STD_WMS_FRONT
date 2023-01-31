(function () {
    'use strict';
    app.factory("userTruckFactory",
        function ($q, $http, ngAuthSettings, localStorageService, webServiceAPI, clientService) {
            var getUser;
            var getData1;

            return {
                storageName: "userTokenStorage",
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.Master + "User",

                filter: function (model){
                    var urlRequest = this.url+ "/filter";
                    return clientService.post(urlRequest, model);
                }, 
                SaveChanges: function (model) {
                    var urlRequest = this.url+ "/SaveChanges";
                    return clientService.post(urlRequest, model);
                },
                find: function (model) {
                    var urlRequest = this.url + "/find/" + model;
                    return clientService.get(urlRequest);
                },
                getDelete: function (model) {
                    var urlRequest = this.url+ "/Delete";
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
                addUser: function (model) {
                    var urlRequest = this.url+ "/addUser";
                    return clientService.post(urlRequest, model);
                },
                setParam: function (model){
                    localStorageService.set(this.storageName, model);
                },
                getParam: function (){
                    return localStorageService.get(this.storageName);
                },
                reset: function(){
                    localStorageService.remove(this.storageName);
                },
                checkStatusUser: function (model) {
                    var urlRequest = this.url+ "/checkStatusUser";
                    return clientService.post(urlRequest, model);
                },
                getToken: function (model) {
                    var urlRequest = "http://kascoit.ddns.me:99/authapi/api/RefreshToken";
                    return clientService.post(urlRequest, model);
                },

                setParam2: function (model) {
                    getData1 = model;
                },
                getParam2: function () {
                    return getData1;
                },
                
            }
        });

})();