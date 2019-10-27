/**
 * inputMask
 */

(function()
{
    var Directive = function()
    {
        return {
            restrict: 'A',
            link: function(scope, el, attrs){
                $(el).inputmask(scope.$eval(attrs.inputMask));
                $(el).on('change', function(){
                    scope.$eval(attrs.ngModel + "='" + el.val() + "'");
                });
            }
        }
    };

    angular.module("singular.ui").directive("inputMask",[Directive]);
}());
