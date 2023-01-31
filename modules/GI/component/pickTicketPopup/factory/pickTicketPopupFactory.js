app.factory("pickTicketFactory", function (webServiceAPI, clientService) {
    return {
        get: clientService.get,
        post: clientService.post,
        url: webServiceAPI.GI + "GoodIssue",
        FilterPick: function (model) {
            var urlRequest = this.url + "/filterPick";
            return clientService.post(urlRequest,model);
        },
    }
});