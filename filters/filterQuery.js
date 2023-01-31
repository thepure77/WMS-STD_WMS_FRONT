'use strict';

app.filter('getPage', function() {
    return function(contents, selectedPage) {

        if (contents) {
            return contents.slice(selectedPage);
        } else {
            return '';
        }
    };
})

/*
    filter query
*/

app.filter('findItem', function() {
    return function(oItem) {
        var items = oItem.items;
        var expression = oItem.expression;

        var arr = expression.split(' ');
        var filed = arr[0];
        var operation = arr[1].toLowerCase();
        var searchText = arr[2];
        if (arr.length > 3) {
            var a = expression.split(operation + ' ');
            searchText = a[1].toLowerCase();
        }
        var i = 0,
            len = items.length;
        for (; i < len; i++) {
            if (items[i][filed] == searchText) {
                return { 'index': i, 'item': items[i] };
            }
        }
        return null;
    }
});


app.filter('getIdList', function() {
    return function(oItem) {
        // $filter('findItemList')({ items: items, field: 'field',value:'2' }); 
        var input = oItem.items;
        var field = oItem.field;
        var value = oItem.value;

        var result = [];

        var i = 0,
            len = input.length;
        for (; i < len; i++) {
            if (input[i][field] == value) {
                result.push(input[i].id);
            }
        }
        return result;
    }
});

app.filter('findItemList', function() {
    return function(oItem) {
        // $filter('findItemList')({ items: items, field: 'field',value:'2' }); 
        var input = oItem.items;
        var field = oItem.field;
        var value = oItem.value;
        var result = [];
        var i = 0,
            len = input.length;
        for (; i < len; i++) {
            if (input[i][field] == value) {
                result.push(input[i]);
            }
        }
        return result;
    }
});
app.filter('getItem', function() {
    return function(oItem) {
        // $filter('getItem')({ items: items, filed: 'field',value:'2' });
        var input = oItem.items;
        var filed = oItem.filed;
        var value = oItem.value;


        var i = 0,
            len = input.length;
        for (; i < len; i++) {
            if (input[i][filed] == value) {
                return { 'index': i, 'value': input[i] };
            }
        }
        return null;
    }
});

app.factory('query', ['$filter', function($filter) {
    var _public = {};

    _public.find = function(params) {
        var items = params.in;
        var expression = params.where;

        // var o = $filter('getItem')({ 'items': from, filed: scope.key, value: cursor.sorting });

        var o = $filter('filterExpression')({ 'items': items, 'expression': expression });

        if (o != null)
            return o[0];


        return null;
    }

    _public.where = function(params) {
        var items = params.in;
        var expression = params.where;

        var o = $filter('filterExpression')({ 'items': items, 'expression': expression });
        return o;
    }

    _public.switch = function() {
        var items = params.in;
        var form = params.form;
        var to = params.to;

        items = $filter('move')({ "items": items, "form": form, "to": to });

        return items;
    }

    return _public;

}]);


app.directive('parseInt', function(){
    return {
        require: 'ngModel',
        link: function(scope, ele, attr, ctrl){
            ctrl.$parsers.unshift(function(viewValue){
                return parseInt(viewValue, 10);
            });
        }
    };
});