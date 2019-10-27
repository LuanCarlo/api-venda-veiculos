(function()
{
    var uiScrollTo = function($location, $anchorScroll)
    {
        return {
            restrict: 'AC',
            link: function(scope, el, attr) {
                el.on('click', function(e) {
                    $location.hash(attr.uiScrollTo);
                    $anchorScroll();
                });
            }
        };
    }

    angular.module('singular.ui').directive('uiScrollTo',['$location', '$anchorScroll', uiScrollTo]);
}());