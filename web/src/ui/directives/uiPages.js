(function()
{
    var uiPages = function()
    {
        return {
            restrict: 'A',
            link: function(scope, element, attr){
                $('.list-group-item label').click(function() {
                    $(this).find(':input').focus();
                });

                $('body').on('focus', '.list-group-item :input', function() {
                    $('.list-group-item').removeClass('focused');
                    $(this).parents('.list-group-item').addClass('focused');
                });

                $('body').on('blur', '.list-group-item :input', function() {
                    $(this).parents('.list-group-item').removeClass('focused');
                });

            }
        }
    }

    angular.module('singular.ui').directive('uiPages',[uiPages]);
}());