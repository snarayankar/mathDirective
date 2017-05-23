    var myApp = angular.module('evaluate-math-expression', []) ;

    /*Creating a custom directive which wil be used to evaluate the math expression*/
    myApp.directive('evaluateMathExp', function() {
        var customDirective = {};
            customDirective.restrict   = 'E'; /* restrict this directive to elements */
            customDirective.controller = 'EvalController'; /* controller this directive function belongs */
            // For simplicity adding this inline, we can also move this to a HTML file and do a templateurl
            customDirective.template   = '<form name="myForm"> <div class=""> '
                              +'Please enter the math expression to be computed: '
                                +'<input type="text" name="inputExpression" id="inputExpression" ng-model="enteredMathExpression" '
                                //+'ng-pattern="/^[0-9]+-/*/" 
                                +'required>'
                                +'<span class="help-block" ng-if="myForm.inputExpression.$invalid"> Please Enter the math expression</span>'
                                +'<span ng-show="myForm.inputExpression.$error.pattern">Not valid number!</span>'
                                +' </div><u>Example: 2+3*4+5-4/2</u></BR> </BR>'
                                +'<div><button type="button" class="btn btn-primary" ng-click="doEvaluateEnteredExpression(enteredMathExpression)"'
                                +' ng-disabled="myForm.inputExpression.$invalid"> Calculate</button> &nbsp;'
                                +' <button type="button" class="btn btn-danger" ng-click="resetValues()"> Reset</button></div> </BR></BR>'
                            +'<div class="alert alert-success" ng-if="computedValue!==null"> The computed value is: {{computedValue}}</div> </div> </form>';
        return customDirective;
    });

    //I have used the $scope variable below, currently i am using controllerAs in my existing project, normally would do vm.mathDir = this; and then all of the stuff would be part of vm.mathDir

    //Register the evaluateMathExp controller for the directive
    myApp.controller('EvalController',function docal($scope){
        //This is the regular expression that will be used to evaluate the valid input characters
        $scope.regex = '[0-9]+-/*';
        //This is the computed value which gets displayed after the expression is evaluated
        $scope.computedValue=null;
        //Creating 2 arrays
        //1. Operators Array 
        $scope.operations = [];
        //1. Numbers Array 
        $scope.inputValues = [];

        //Reset Function: Wipe out all the variables and let the user enter new values
        $scope.resetValues = function () {
            $scope.enteredMathExpression = null;
            $scope.computedValue=null;
            $scope.operations = [];
            $scope.inputValues = [];
        }

        //This function is used to validate the entered expression
        $scope.validateExpression = function(inputExpression) {
            //remove all unwanted spaces
            inputExpression = inputExpression.replace(/[\s]/g, '');
            if(inputExpression.length>0){
                //if(inputExpression.indexOf('+') !== -1;)
            }    
        }

        //This is the function that gets called when we click the "Calculate" button
         $scope.doEvaluateEnteredExpression = function (inputExpression){
             //Assuming every alternate value is a inputExpression & operation
             if(angular.isDefined(inputExpression) && inputExpression!==null){
                 inputExpression = inputExpression.replace(/[\s]/g, '');
                 
                 //Loop thro the input value, since every alternate key is operator & number - we will insert the values in 2 seperate arrays
                 angular.forEach(inputExpression, function(value, key) {    
                     if(key%2 === 1){
                         $scope.operations.push(value);
                     } else {
                         $scope.inputValues.push(value);
                     }
                     key = key+1;
                 });
                 
                 //console.log("before $scope.operations", $scope.operations);
                 //console.log("before $scope.inputValues", $scope.inputValues);
                 
                 //1st iteration of loops to evaluate * or /, if the operator is * or / then we compute the value  - delete the next value and replace the value with the computed value
                 angular.forEach($scope.operations, function(operation, key){
                     value = parseInt($scope.inputValues[key]);
                     switch(operation){
                         case '/':
                            $scope.computedValue = value / parseInt($scope.inputValues[key+1]);
                            $scope.inputValues.splice(key,0);
                            $scope.inputValues.splice(key,1);
                            $scope.operations.splice(key,1);
                            $scope.inputValues[key] = $scope.computedValue;
                         break;
                             
                         case '*':
                            $scope.computedValue = value * parseInt($scope.inputValues[key+1]);
                            $scope.inputValues.splice(key,0);
                            $scope.inputValues.splice(key,1);
                            $scope.operations.splice(key,1);
                            $scope.inputValues[key] = $scope.computedValue;
                            break;
                             
                         default:
                             //no operation required
                             break;
                     }
                 });

                 //similar to the above loop, we perform all the operations, / and * if entered consecutively then we need to take care of that scenario here
                angular.forEach($scope.operations, function(operation, key){
                     var value=0;
                     if(key===0){
                         value = parseInt($scope.inputValues[key]);
                     } else {
                         value = $scope.computedValue;
                     }
                    
                     switch(operation){
                         case '+':
                            $scope.computedValue = value + parseInt($scope.inputValues[key+1]);
                            break;
                         
                         case '-':
                            $scope.computedValue = value - parseInt($scope.inputValues[key+1]);
                            break;
                         
                         case '/':
                            $scope.computedValue = value / parseInt($scope.inputValues[key+1]);                                                                
                            break;
                         
                         case '*':
                            $scope.computedValue = value * parseInt($scope.inputValues[key+1]);
                            break;
                     }
                 });
                 //two way binding, so no need to return anything
             }
        }
    });