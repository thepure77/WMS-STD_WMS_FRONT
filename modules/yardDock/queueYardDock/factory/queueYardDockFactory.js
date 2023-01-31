(function () {
    'use strict';
    app.factory("queueYardDockFactory",
        function ($q, $http, ngAuthSettings, localStorageService, webServiceAPI, clientService) {
            var getData;
            var getDefault;
            
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.YardDock + "appointment",

                filter: function (model){
                    var urlRequest = this.url+ "/list_queue";
                    return clientService.post(urlRequest, model);
                },
                FilterDock: function (model){
                    var urlRequest = this.url+ "/list_dock";
                    return clientService.post(urlRequest, model);
                },
                FilterTime: function (model){
                    var urlRequest = this.url+ "/list_time";
                    return clientService.post(urlRequest, model);
                },
                getApprove: function (model){
                    var urlRequest = this.url+ "/Approve_Q";
                    return clientService.post(urlRequest, model);
                },
                printOutQ: function (model){
                    var urlRequest = this.url+ "/printOutQ";
                    //return clientService.post(urlRequest, model);

                    return clientService.popupReport(urlRequest, model);

                },
                ListDockForAppointmentreAssign: function (model){
                    var urlRequest = this.url+ "/ListDockForAppointmentQ";
                    return clientService.post(urlRequest, model);
                },
                
            }
        });

})();