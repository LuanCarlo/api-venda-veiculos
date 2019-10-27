/**
 * inputMask
 */

(function()
{
    var Directive = function()
    {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                ngModel: '='
            },
            template: '<span>' +
            '<input type="hidden" ng-model="ngModel"/>' +
            '<input type="text" class="form-control"  name="name">' +
            '</span>',
            require: '?ngModel',
            link : function(scope, elem, attrs, ngModel){
                var txtEl = elem.find(':text');
                scope.name = attrs.name;

                txtEl.attr('name',attrs.name);
                txtEl.attr('required', attrs.required);

                ngModel.$render = function(){
                    if(ngModel.$viewValue){

                        if (typeof ngModel.$viewValue == 'string') {
                            if (ngModel.$viewValue.indexOf('/') != -1 ){
                                var dt = moment(ngModel.$viewValue,'DD/MM/YYYY').format('DD/MM/YYYY');                            
                            } else {
                                dt = 'Invalid date';
                            }
                        } else {
                            dt = ngModel.$viewValue.format('DD/MM/YYYY');
                        }    

                        if (dt != 'Invalid date'){
                            txtEl.val(dt);
                        } else {
                            dt = moment(ngModel.$viewValue,'YYYY-MM-DD').format('DD/MM/YYYY');
                            txtEl.val(dt);
                        }

                    }else{
                        txtEl.val(null);
                    }

                    //scope.$apply();
                }
//

                function updateModel(){
                    ngModel.$setViewValue(moment(txtEl.val(),'DD/MM/YYYY'));//.format('YYYY-MM-DD'));
                    ngModel.$render();
                    //scope.$apply();
                }

                txtEl.inputmask('d/m/y', {
                    placeholder:'dd/mm/aaaa',
                    clearIncomplete: true,
                    oncomplete: function(){
                        updateModel();
                    },
                    onincomplete: function(){
//                        console.log(moment(ngModel.$viewValue).format('DD/MM/YYYY'));
//                        txtEl.val(moment(ngModel.$viewValue).format('DD/MM/YYYY'));
                        ngModel.$setViewValue(null);
                        ngModel.$render();
                        //scope.$apply();

                    }
                });

            }
        }
    };

    angular.module("singular.ui").directive("inputDate",[Directive]);
}());
