(function()
{
    var allowPatternDirective = function()
    {
        return {
            restrict: "A",
            compile: function(tElement, tAttrs) {
                return function(scope, element, attrs) {
                    // I handle key events
                    element.bind("keypress", function(event) {

                        var keyCode = event.which || event.keyCode; // I safely get the keyCode pressed from the event.
                        var keyCodeChar = String.fromCharCode(keyCode); // I determine the char from the keyCode.

                        if (keyCode == 8){
                            return;
                        }

                        // If the keyCode char does not match the allowed Regex Pattern, then don't allow the input into the field.
                        if (!keyCodeChar.match(new RegExp(attrs.allowPattern, "i"))) {
                            event.preventDefault();
                            return false;
                        }

                    });
                };
            }
        };
    }

    angular.module('singular.ui').directive('allowPattern',[allowPatternDirective]);
}());
