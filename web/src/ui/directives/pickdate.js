/**
 * Created by Marcony on 28/11/14.
 */
(function()
{
    var Directive = function($timeout)
    {
        return {
            restrict: "A",
            scope: {
                confirmClick: "&"
            },
            link: function(scope, element, attrs){

                $input = element.pickadate({
                    container: document.body,
                    selectYears: 180,
                    selectMonths: true,
                    format: 'dd/mm/yyyy'
                });

                var picker = $input.pickadate('picker');

                $timeout(function(){
                    attrs.$observe('endate', function(val){
                        if (val != undefined) {
                            picker.set('select', val, {format: 'dd/mm/yyyy'});
                        }
                    })
                },500)

            }
        }
    };

    angular.module("singular.ui").directive("pickdate",['$timeout',Directive]);
}());