app.factory("productLineitemFactory", function (webServiceAPI, clientService) {
    return {
        get: clientService.get,
        post: clientService.post,
        url: webServiceAPI.GR + "GoodsReceive",
        getId: function (model) {
            var urlRequest = this.url + "/ProductLineitemPopup";
            return clientService.post(urlRequest,model);
        },
    }
});