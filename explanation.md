# Angularjs custom directive to calculate the value of the entered mathematical expression
 
Angular custom directive for simple mathematical expressions .

 Add a new dependency in your module
angular.module('mathematicEvaluator', ['evaluate-math-expression'])
```

In your webpage add the direcive.

```html
<html ng-app="mathematicEvaluator">

<evaluate-math-exp></evaluate-math-exp>

</html>