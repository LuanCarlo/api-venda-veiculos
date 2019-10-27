(function()
{
    var elClick = function()
    {
        return {
            restrict: 'A',
            link: function($scope, $element, $attributes){
                $element.bind('click', function(){
                    alert('oi clicou');
                });
            }
        };
    }

    angular.module('singular.ui').directive('elClick',[elClick]);
}());
