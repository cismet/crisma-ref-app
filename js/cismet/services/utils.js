angular.module(
    'de.cismet.smartAdmin.services'
).factory(
    'de.cismet.smartAdmin.services.utils',
    [
        function () {
            'use strict';

            var updateArray;

            /** 
             * Transforms the array arr into the array newArr by comparing the objects of the arrays and removing/adding
             * to the target array arr. This means that arr will be mutated while newArr remains the same.
             * 
             * requires equal function to be defined on the objects within the arrays 
             * 
             * @param {Array} arr the array to be transformed into newArr
             * @param {Array} newArr the new content of arr
             */
            updateArray = function (arr, newArr) {
                var eqFunc, i, found;

                found = false;
                newArr.forEach(function (vo) {
                    found = arr.some(function (vi) {
                        return vi.equals(vo);
                    });

                    if (!found) {
                        arr.push(vo);
                    }
                });

                eqFunc = function (v) { return v.equals(arr[i]); };
                found = false;
                for (i = arr.length - 1; i >= 0; --i) {
                    found = newArr.some(eqFunc);

                    if (!found) {
                        arr.splice(i, 1);
                    }
                }
            };

            return {
                updateArray: updateArray
            };
        }
    ]
);