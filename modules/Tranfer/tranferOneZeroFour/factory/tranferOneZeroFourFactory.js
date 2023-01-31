(function () {
    'use strict';
    app.factory("tranferOneZeroFourFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.GT  + "TransferCheckpallet",
                urlWCS: webServiceAPI.WCS  + "ASRSIssuing",

                checkpallet104: function (model) {
                    var urlRequest = this.url + "/checkpallet104" ;
                    return clientService.post(urlRequest, model);
                },
                call104: function (model) {
                    var urlRequest = this.urlWCS + "/CREATE_WMS_TBL_IF_WMS_ASRS_SO_CALL104" ;
                    return clientService.post(urlRequest, model);
                },

                callback: function (model) {
                    var urlRequest = this.urlWCS + "/CREATE_WMS_TBL_IF_WMS_ASRS_SO_SEND104" ;
                    return clientService.post(urlRequest, model);
                },

                entercall104: function (model) {
                    var urlRequest = this.url + "/entercall104" ;
                    return clientService.post(urlRequest, model);
                },
                
                
            }
        });

})();