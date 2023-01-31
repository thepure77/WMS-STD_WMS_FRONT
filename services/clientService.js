app.factory("clientService", ["$q", "$http", function ($q, $http) {

    var modules = {};
    var corsConfig = {
        headers: { "Access-Control-Allow-Origin": "*" }
    };

    modules.get = function (url) {
        var defer = $q.defer();
        $http.get(url, corsConfig).then(function (result) {
            if (result.status === 200) {
                defer.resolve(result);
            } else {
                defer.reject({ 'Message': result.Message });
            }
        }).catch(function (error) {
            defer.reject({ 'Message': error });
        });
        return defer.promise;
    }

    modules.posts =  function (url, data) {
        var defer = $q.defer();

         $http.post(url, data, corsConfig).then(function (result) {

            if (result.status === 200) {
                defer.resolve(result);
            } else {
                defer.reject({ 'Message': result.Message });
            }
        }).catch(function (error) {
            defer.reject({ 'Message': error });
        });

        return defer.promise;
    }



    modules.post = function (url, data) {
        var defer = $q.defer();

        $http.post(url, data, { timeout: 3600000 }).then(function (result) {

            if (result.status === 200) {
                defer.resolve(result);
            } else {
                defer.reject({ 'Message': result.data });
            }
        }).catch(function (error) {
            defer.reject({ 'Message': error });
        });

        return defer.promise;
    }

    modules.popupReport = function (url, data) {
        var defer = $q.defer();

        $http.post(url, data, { responseType: "arraybuffer", "Access-Control-Allow-Origin": "*" }).then(function (result) {

            if (result.status === 200) {
                defer.resolve(result);
            } else {
                var decodedString = String.fromCharCode.apply(null, new Uint8Array(result.data));
         
                defer.reject({ 'Message':decodedString });
                // defer.reject({ 'Message': result.Message });
            }
        }).catch(function (error) {
            defer.reject({ 'Message': error });
        });

        return defer.promise;
    }

    modules.downloadExcel = function (url, data) {
        var defer = $q.defer();
        $http.post(url, data, { responseType: 'arraybuffer', "Access-Control-Allow-Origin": "*" }).then(function (result) {
            if (result.status === 200) {
                var blob = new Blob([result.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
                var objectUrl = URL.createObjectURL(blob);
                window.open(objectUrl);

                var name = Math.round(new Date() / 1000);
                let a = $("<a />", { href: objectUrl, download: name }).appendTo("body").get(0).click();
                defer.resolve(result);
            } else {
                defer.reject({ 'Message': result.Message });
            }
        }).catch(function (error) {
            defer.reject({ 'Message': error });
        });

        return defer.promise;
    }

    modules.downloadPDF = function (url, data) {
        var defer = $q.defer();
        $http.post(url, data, { responseType: 'arraybuffer' }).then(function (result) {

            if (result.status === 200) {
                var blob = new Blob([result.data], { type: "octet/stream" });
                var objectUrl = URL.createObjectURL(blob);
                //window.open(objectUrl);

                //var name = Math.round(new Date() / 1000);

                var dt = new Date();

                var dtString = `${
                    dt.getFullYear().toString().padStart(4, '0')}${
                    (dt.getMonth() + 1).toString().padStart(2, '0')}${
                    dt.getDate().toString().padStart(2, '0')}_${
                    dt.getHours().toString().padStart(2, '0')}${
                    dt.getMinutes().toString().padStart(2, '0')
                    }`

                var name;
                name = data.PdfName + '_' + dtString + '.' + 'pdf';

                let a = $("<a />", { href: objectUrl, download: name }).appendTo("body").get(0).click();
                defer.resolve(result);
            } else {
                defer.reject({ 'Message': result.Message });
            }
        }).catch(function (error) {
            defer.reject({ 'Message': error });
        });

        return defer.promise;
    }

    modules.downloadExcel = function (url, data) {
        var defer = $q.defer();
        $http.post(url, data, { responseType: 'arraybuffer' }).then(function (result) {

            if (result.status === 200) {
                var blob = new Blob([result.data], { type: "octet/stream" });
                var objectUrl = URL.createObjectURL(blob);
                //window.open(objectUrl);

                //var name = Math.round(new Date() / 1000);

                var dt = new Date();

                var dtString = `${
                    dt.getFullYear().toString().padStart(4, '0')}${
                    (dt.getMonth() + 1).toString().padStart(2, '0')}${
                    dt.getDate().toString().padStart(2, '0')}_${
                    dt.getHours().toString().padStart(2, '0')}${
                    dt.getMinutes().toString().padStart(2, '0')
                    }`

                var name;
                name = data.excelName + '_' + dtString + '.' + 'xls';

                // if(result.config.data.excelName == 'LocationDetails')
                // {
                //     name = result.config.data.excelName + '_' + dtString + '.' + result.config.data.reportType;
                // }
                // if(result.config.data.excelName == 'PutawaySuggestionLocation')
                // {
                //     name = result.config.data.excelName + '_' + dtString + '.' + result.config.data.reportType;
                // }
                // if(result.config.data.excelName == 'StockMovement')
                // {
                //     name = result.config.data.excelName + '_' + dtString + '.' + result.config.data.reportType;
                // }

                let a = $("<a />", { href: objectUrl, download: name }).appendTo("body").get(0).click();
                defer.resolve(result);
            } else {
                defer.reject({ 'Message': result.Message });
            }
        }).catch(function (error) {
            defer.reject({ 'Message': error });
        });

        return defer.promise;
    }

    modules.downloadExcel2 = function (url, data) {
        var defer = $q.defer();
        $http.post(url, data, { responseType: 'arraybuffer' }).then(function (result) {

            if (result.status === 200) {
                var blob = new Blob([result.data], { type: "octet/stream" });
                var objectUrl = URL.createObjectURL(blob);
                //window.open(objectUrl);

                //var name = Math.round(new Date() / 1000);

                var dt = new Date();

                var dtString = `${
                    dt.getFullYear().toString().padStart(4, '0')}${
                    (dt.getMonth() + 1).toString().padStart(2, '0')}${
                    dt.getDate().toString().padStart(2, '0')}_${
                    dt.getHours().toString().padStart(2, '0')}${
                    dt.getMinutes().toString().padStart(2, '0')
                    }`

                var name;
                name = data.excelName + '_' + dtString + '.' + 'xls';

                // if(result.config.data.excelName == 'LocationDetails')
                // {
                //     name = result.config.data.excelName + '_' + dtString + '.' + result.config.data.reportType;
                // }
                // if(result.config.data.excelName == 'PutawaySuggestionLocation')
                // {
                //     name = result.config.data.excelName + '_' + dtString + '.' + result.config.data.reportType;
                // }
                // if(result.config.data.excelName == 'StockMovement')
                // {
                //     name = result.config.data.excelName + '_' + dtString + '.' + result.config.data.reportType;
                // }

                let a = $("<a />", { href: objectUrl, download: name }).appendTo("body").get(0).click();
                defer.resolve(result);
            } else {
                defer.reject({ 'Message': result.Message });
            }
        }).catch(function (error) {
            defer.reject({ 'Message': error });
        });

        return defer.promise;
    }

    modules.put = function (url, data) {
        var defer = $q.defer();

        $http.put(url, data, corsConfig).then(function (result) {

            if (result.status === 200) {
                defer.resolve(result);
            } else {
                defer.reject({ 'Message': result.Message });
            }
        }).catch(function (error) {
            defer.reject({ 'Message': error });
        });

        return defer.promise;
    }

    modules.delete = function (url) {
        var defer = $q.defer();

        $http.delete(url, corsConfig).then(function (result) {

            if (result.status === 200) {
                defer.resolve(result);
            } else {
                defer.reject({ 'Message': result.Message });
            }
        }).catch(function (error) {
            defer.reject({ 'Message': error });
        });

        return defer.promise;
    }

    return modules;

}]);