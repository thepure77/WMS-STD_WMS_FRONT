'use strict';

app.filter('deleteItem', function () {
    return function (oItem) {
        try {
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

            var index = -1;
            var i = 0, len = items.length;
            for (; i < len; i++) {
                if (items[i][filed] == searchText) {
                    index = i;
                    break;
                }
            }

            if (index != -1) {
                items.splice(index,1);
                return true;
            }
        } catch (e) {
            console.log(e);
            return false;
        }
        return true;
    }

})

app.filter('removeItem', function () {
    return function (oItem) {
        try {
            // $filter('getItem')({ items: items, filed: 'field',value:'2' });
            var input = oItem.items;
            var filed = oItem.filed;
            var value = oItem.value;

            var index = -1;
            var i = 0, len = input.length;
            for (; i < len; i++) {
                if (input[i][filed] == value) {
                    index = i;
                    break;
                }
            }

            if (index != -1) {
                input.splice(index);
                return true;
            }
        } catch (e) {
            console.log(e);
            return false;
        }
        return true;
    }

})

app.filter('move', function () {
    return function (oItem) {
        var items = oItem.items;
        var old_index = oItem.form;
        var new_index = oItem.to;

        while (old_index < 0) {
            old_index += items.length;
        }
        while (new_index < 0) {
            new_index += items.length;
        }
        if (new_index >= items.length) {
            var k = new_index - items.length;
            while ((k--) + 1) {
                items.push(undefined);
            }
        }
        items.splice(new_index, 0, items.splice(old_index, 1)[0]);
        return items; // for testing purposes
        /*
        Array.prototype.move = function (old_index, new_index) {
    while (old_index < 0) {
        old_index += this.length;
    }
    while (new_index < 0) {
        new_index += this.length;
    }
    if (new_index >= this.length) {
        var k = new_index - this.length;
        while ((k--) + 1) {
            this.push(undefined);
        }
    }
    this.splice(new_index, 0, this.splice(old_index, 1)[0]);
    return this; // for testing purposes
};
        */
    }
});
