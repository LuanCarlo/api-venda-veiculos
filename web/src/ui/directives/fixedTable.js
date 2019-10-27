(function()
{
    var fixedTableDirective = function()
    {
        return {
            restrict: "A",
            compile: function(tElement, tAttrs) {
                return function(scope, element, attrs) {
                    var ctWidth = $('#agenda-container').width(),
                        ctHeight = $('#agenda-container').height();

                    element.width(ctWidth);
                    $('.xy-inner').height(ctHeight);

                };
            }
        };
    }

    angular.module('singular.ui').directive('fixedTable',[fixedTableDirective]);
}());
