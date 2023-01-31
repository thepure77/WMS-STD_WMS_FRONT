(function () {
    'use strict';
    app.factory("invoiceFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.BinBalance + "Invoice",
                urlDropDown: webServiceAPI.BinBalance + "PickBinbalance",
                urlDropdownMaster: webServiceAPI.Master + "Currency",
                
                filterInvoice: function (model){
                    var urlRequest = this.url+ "/filterInvoice";
                    return clientService.post(urlRequest, model);
                },   
                loadtransction: function (model){
                    var urlRequest = this.url+ "/loadtransction";
                    return clientService.post(urlRequest, model);
                }, 
                cal: function (model){
                    var urlRequest = this.url+ "/cal";
                    return clientService.post(urlRequest, model);
                }, 
                dropDownStorageCharge: function (model){
                    var urlRequest = this.urlDropDown+ "/dropDownStorageCharge";
                    return clientService.post(urlRequest, model);
                },     
                dropdownDocumentType: function (model){
                    var urlRequest = this.urlDropDown+ "/dropdownDocumentType";
                    return clientService.post(urlRequest, model);
                }, 
                dropdownCurrency: function (model){
                    var urlRequest = this.urlDropdownMaster+ "/currencydropdown";
                    return clientService.post(urlRequest, model);
                },  
                groupInvoice: function (model){
                    var urlRequest = this.url+ "/groupInvoice";
                    return clientService.post(urlRequest, model);
                }, 
                groupStorage: function (model){
                    var urlRequest = this.url+ "/groupStorage";
                    return clientService.post(urlRequest, model);
                },      
                saveInvoice: function (model){
                    var urlRequest = this.url+ "/saveInvoice";
                    return clientService.post(urlRequest, model);
                },    
                filterInvoiceItem: function (model){
                    var urlRequest = this.url+ "/filterInvoiceItem";
                    return clientService.post(urlRequest, model);
                },                  
                deleteInvoiceItem: function (model){
                    var urlRequest = this.url+ "/deleteInvoiceItem";
                    return clientService.post(urlRequest, model);
                },   
                loadMemo: function (model){
                    var urlRequest = this.url+ "/loadMemo";
                    return clientService.post(urlRequest, model);
                },
                dropdownServiceCharge: function (model){
                    var urlRequest = this.urlDropDown+ "/dropDownServiceCharge";
                    return clientService.post(urlRequest, model);
                },   
                dropDownServiceChargeFix: function (model){
                    var urlRequest = this.urlDropDown+ "/dropDownServiceChargeFix";
                    return clientService.post(urlRequest, model);
                },  
                ExportStorage: function(model) {
                    var urlRequest = this.url+ "/ExportStorage";
                    return clientService.downloadExcel(urlRequest, model);
                },   
                ExportInvoice: function(model) {
                    var urlRequest = this.url+ "/ExportInvoice";
                    return clientService.downloadExcel(urlRequest, model);
                },   
                deleteInvoice: function(model) {
                    var urlRequest = this.url+ "/deleteInvoice";
                    return clientService.post(urlRequest, model);
                },           


            }
        });
})();