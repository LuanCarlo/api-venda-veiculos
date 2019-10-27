(function()
{
    /**
     * AutoFocus, diretiva responsável por colocar foco automático em um campo.
     *
     * @returns {{restrict: string, link: Function}}
     *
     * @constructor
     */
    var AutoFocus = function($timeout)
    {
        return {
            restrict: 'A',
            link: function(scope, element, attrs){
                $timeout(function(){
                    $(element).focus();
                },700);

            }
        }
    };

    angular.module('singular.ui').directive('autofocus', ['$timeout', AutoFocus]);

}());