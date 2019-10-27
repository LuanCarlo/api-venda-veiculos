(function()
{
    'use strict';

    /* Filters */
    angular.module('singular.ui')
        .filter('fromNow', function() {
            return function(date) {
                return moment(date).fromNow();
            }
        });
}());