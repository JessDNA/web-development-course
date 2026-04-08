export function calc(num1,num2,operador) {
    switch (operador) {
    case '+':
      return parseInt(num1) + parseInt(num2);
    case '-':
      return num1 - num2;
    case '*':
      return num1 * num2;
    case '/':
      return num1 / num2;
  }
}

export function calcWithEval(num1, num2, operator) {
  return eval(num1 + operator + num2);
}


