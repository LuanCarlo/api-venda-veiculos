(function()
{
    var charLimitDirective = function()
    {
        return {
            restrict: 'A',
            link: function($scope, $element, $attributes){
                var limit = $attributes.charLimit;

                $element.bind('keyup', function(event){
                    var element = $element.parent().parent();

                    element.toggleClass('warning', limit - $element.val().length <= 10);
                    element.toggleClass('error', $element.val().length > limit);

                    if ($element.val().length > parseInt(limit)){
                        var str = $element.val().substr(0,parseInt(limit));
                        $element.val(str);
                    }

                });


                $element.bind('keypress', function(event){
                    // Once the limit has been met or exceeded, prevent all keypresses from working
                    if ($element.val().length >= parseInt(limit)){
                        // Except backspace
                        if (event.keyCode != 8){
                            event.preventDefault();
                        }
                    }
                });
            }
        };
    }

    angular.module('singular.ui').directive('charLimit',[charLimitDirective]);
}());
