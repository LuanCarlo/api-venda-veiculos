(function()
{
    var lightbox = function($animate)
    {
        return {
            link: function ($scope, $element, $attrs) {
                $element.magnificPopup({
                    type: 'ajax',
                    gallery:{
                        enabled:true
                    }
                    // other options
                });
            }
        };
    }

    angular.module('singular.ui').directive('lightbox',[lightbox]);
}());