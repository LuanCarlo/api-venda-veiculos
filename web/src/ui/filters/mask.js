(function()
{
    'use strict';

    /**
     * Serviço que fornece a api para conexão.
     *
     * @param $http
     * @param UI
     *
     * @constructor
     */
    var MaskFilter = function(MaskService)
    {
        return function(text, mask) {
            var result,
                maskService = MaskService.create();

            if (!text){
                return;
            }
            if (!angular.isObject(mask)) {
                mask = { mask: mask }
            }

            maskService.generateRegex(mask);

            return maskService.getViewValue(text).withDivisors();
        }
    }

    angular.module('singular.ui').filter('mask', ['MaskService', MaskFilter]);
}());