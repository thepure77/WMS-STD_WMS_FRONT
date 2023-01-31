

/*
         Operator   : [== eq, != ne, < lt, > gt, <= ge, >= le,contrain in]
         Expression : field in value

         -- in : contrains
          $filter('filterExpression')(items, 'fieldName in [value]');
          $filter('filterExpression')(items, 'fieldName in [value1,value1]');

         -- eq
         $filter('filterExpression')(items, 'field eq value');

         -- ne
         $filter('filterExpression')(items, 'field ne value');

         -- lt
         $filter('filterExpression')(items, 'field lt value');

         -- le
         $filter('filterExpression')(items, 'field le value');
 
         -- gt
         $filter('filterExpression')(items, 'field gt value');

         -- ge
         $filter('filterExpression')(items, 'field ge value');

*/


'use strict';

app.filter('filterExpression', function () {

    return function (oOptions) {

        var items = oOptions.items;
        var expression = oOptions.expression;

        var arr = expression.split(' ');

        var filtered = [];
        var label = arr[0];
        var operation = arr[1].toLowerCase();
        var searchText = arr[2];

         if (arr.length > 3) {
            var a = expression.split(operation + ' ');
            searchText = a[1].toLowerCase();
        }

        switch (operation) {
            case "eq":
                return eqExpression(items, label, searchText);
                break;
            case "ne":
                return neExpression(items, label, searchText);
                break;
            case "le":
                return leExpression(items, label, searchText);
                break;
            case "lt":
                return ltExpression(items, label, searchText);
                break;
            case "gt":
                return gtExpression(items, label, searchText);
                break;
            case "ge":
                return geExpression(items, label, searchText);
                break;
            case "in":
                return inExpression(items, expression);
                break;
            default:
                return inExpression(items, expression);
                break;
        }

        return filtered;
    }

    function eqExpression(items, lable, searchText) {
        var filtered = [];

        // if (angular.isObject(items)) {
        if (angular.isArray(items)) {
            for (var i = 0; i < items.length; i++) {
                if (items[i][lable].toLowerCase() == searchText)
                    filtered.push(items[i]);
            }
        } else {
            angular.forEach(items, function (item) {
                if (item[lable].toLowerCase() == searchText)
                    filtered.push(item);
            });

        }
        if (filtered.length == 0) {
            filtered = null;
        }
        return filtered;
    }

    function neExpression(items, lable, searchText) {
        var filtered = [];
        angular.forEach(items, function (item) {
            if (item[label].toLowerCase() != searchText)
                filtered.push(item);
        });
        if (filtered.length == 0) {
            filtered = null;
        }
        return filtered;
    }

    function ltExpression(items, lable, searchText) {
        var filtered = [];
        angular.forEach(items, function (item) {
            if (item[label].toLowerCase() < searchText)
                filtered.push(item);
        });
        if (filtered.length == 0) {
            filtered = null;
        }
        return filtered;
    }

    function leExpression(items, lable, searchText) {
        var filtered = [];
        angular.forEach(items, function (item) {
            if (item[label].toLowerCase() >= searchText)
                filtered.push(item);
        });
        if (filtered.length == 0) {
            filtered = null;
        }
        return filtered;
    }

    function gtExpression(items, lable, searchText) {
        var filtered = [];
        angular.forEach(items, function (item) {
            if (item[label].toLowerCase() > searchText)
                filtered.push(item);
        });
        if (filtered.length == 0) {
            filtered = null;
        }
        return filtered;
    }

    function geExpression(items, lable, searchText) {
        var filtered = [];
        angular.forEach(items, function (item) {
            if (item[label].toLowerCase() <= searchText)
                filtered.push(item);
        });
        if (filtered.length == 0) {
            filtered = null;
        }
        return filtered;
    }

    function inExpression(items, expression) {
        var filtered = [];
        var arr = expression.split(' ');
        var label = arr[0];
        var operation = arr[1].toLowerCase();
        var searchText = arr[2].toLowerCase();

        var text = searchText.replace('[', '');
        text = text.replace(']', '');
        // s = s.split(',');

        angular.forEach(items, function (item) {
            if (item[label].toLowerCase().indexOf(text) >= 0)
                filtered.push(item);
        });

        if (filtered.length == 0) {
            filtered = null;
        }
        return filtered;
    }

});

app.filter("trustHTML", ['$sce', function ($sce) {
    return function (htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    }
}]);