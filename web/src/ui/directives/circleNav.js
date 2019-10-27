(function()
{
    var circleNav = function()
    {
        return {
            link: function(scope, element, attributes) {
                var angleStart = -360;

                function rotate(li, d) {
                    $({
                        d: angleStart
                    }).animate({
                        d: d
                    }, {
                        step: function(now) {
                            $(li)
                                .css({
                                    transform: 'rotate(' + now + 'deg)'
                                })
                                .find('label')
                                .css({
                                    transform: 'rotate(' + (-now) + 'deg)'
                                });
                        },
                        duration: 0
                    });
                }

                function toggleOptions(s) {
                    $(s).toggleClass('open');
                    var li = $(s).find('li');
                    var deg = $(s).hasClass('half') ? 180 / (li.length - 1) : 360 / li.length;
                    for (var i = 0; i < li.length; i++) {
                        var d = $(s).hasClass('half') ? (i * deg) - 90 : i * deg;
                        $(s).hasClass('open') ? rotate(li[i], d) : rotate(li[i], angleStart);
                    }
                }

                $(element).click(function(e) {
                    //toggleOptions('.circle-selector');
                });

                setTimeout(function() {
                    toggleOptions('.circle-selector');
                }, 1200);

            }
        };
    }

    angular.module('singular.ui').directive('circleNav',[circleNav]);
}());