(function()
{
    var setNgAnimate = function($animate)
    {
        return {
            link: function ($scope, $element, $attrs) {
                $scope.$watch( function() {
                    return $scope.$eval($attrs.setNgAnimate, $scope);
                }, function(valnew, valold){
                    $animate.enabled(!!valnew, $element);
                });
            }
        };
    }

    angular.module('singular.ui').directive('setNgAnimate',['$animate', setNgAnimate]);
}());