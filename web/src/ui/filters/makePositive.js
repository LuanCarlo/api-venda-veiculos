(function()
{
    'use strict';

    /* Filters */
    angular.module('singular.ui')
        .filter('makePositive', function() {
            return function(num) {
                return Math.abs(num);
            }
        });
}());