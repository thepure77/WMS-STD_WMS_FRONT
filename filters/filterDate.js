// commonDateTime

'use strict';
app.filter('dateFormate', function (commonDateTime) {
    return function (obj) {
        try {
            if (obj) {
                return commonDateTime.toString(obj);
            } else {
                return '-';
            }
        } catch (e) {
            return '-';
        }
    };
});

app.filter('dateTimeFormate', function (commonDateTime) {
    return function (obj) {
        try {
            if (obj) {

                return commonDateTime.toDateTimeString(obj);
            } else {
                return '-';
            }
        } catch (e) {
            return '-';
        }
    };
});

app.filter('TimeFormat', function () {
    return function (obj) {
        try {
            if (obj) {
                return obj.substring(11, 16);
            } else {
                return '-';
            }
        } catch (e) {
            return '-';
        }
    };
});

app.filter('dateFormat', function ($filter) {
    var angularDateFilter = $filter('date');
    return function (date) {
        return angularDateFilter(date, 'dd/MM/yyyy');
    }
});

app.filter('convertTime', function ($filter) {
    var angularDateFilter = $filter('date');
    return function (date) {
        return angularDateFilter(date, 'HH:mm');
    }
});


app.filter('chargeFormat', function ($filter) {
    return function (obj) {
        try {
            let _serviceCharge = parseFloat(obj.rate).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");


            if (obj.pricing != undefined && obj.pricing.length > 0) {
                _serviceCharge = parseFloat(obj.pricing[0].rate).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
            }

            if (_serviceCharge == 'NaN') {
                _serviceCharge = 'N/A';
            }
            return _serviceCharge;
        } catch (e) {
            return 'N/A';
        }
    };
});

app.filter('operationFormat', function ($filter) {
    return function (obj) {
        try {

            let rate = parseFloat(obj.rate).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");

            if (!obj.calculateFormatName) {
                item.rate = 'N/A';
            }

            switch (obj.calculateFormatName) {
                case 'บวก':
                    rate = '+ ' + rate;
                    break;
                case 'ลบ':
                    rate = '- ' + rate;
                    break;
                case 'คูณ':
                    rate = 'x ' + rate;
                    break;
                case 'หาร':
                    rate = '/ ' + rate;
                    break;
                case 'เปอร์เซ็นต์':
                    rate = rate + '%';
                    break;
                default:
                    break;
            }

            return rate;
        } catch (e) {
            return 'N/A';
        }
    };
});

app.filter('klCurrency', function ($filter) {
    return function (obj) {
        try {
            let _serviceCharge = "N/A";


            if ((obj !== undefined) && obj) {
                _serviceCharge = obj.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")
            }

            return _serviceCharge;
        } catch (e) {

            return 'N/A';
        }
    };
});

app.filter('convertM3', function ($filter) {
    return function (obj) {
        try {
            if (obj) {
                var data = (parseFloat(obj) / 1000000)
                return data.toString();
            } else {
                return '0';
            }
        } catch (e) {
            return '0';
        }
    };
});

