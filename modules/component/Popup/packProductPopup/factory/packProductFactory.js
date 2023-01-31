app.factory("packProductFactory", function (webServiceAPI, clientService) {
    return {
        get: clientService.get,
        post: clientService.post,
        url: webServiceAPI.Pack + "Pack",
        getId: function (model) {
            var urlRequest = this.url + "/ProductLineitemPopup";
            return clientService.post(urlRequest,model);
        },
    }
});