(function()
{
    var uiFocus = function($timeout, $parse)
    {
        return {
            link: function(scope, element, attr) {
                var model = $parse(attr.uiFocus);
                scope.$watch(model, function(value) {
                    if(value === true) {
                        $timeout(function() {
                            element[0].focus();
                        },200);
                    }
                });
                element.bind('blur', function() {
                    scope.$apply(model.assign(scope, false));
                });
            }
        };
    }

    angular.module('singular.ui').directive('uiFocus',['$timeout', '$parse', uiFocus]);
}());

