const NUMBERS = document.querySelectorAll('.number'),
      MATHOPERATIONS = document.querySelectorAll('.math-operation'),
      mathOperationsArray = ['+', '-', '*', '/'],
      calculations = document.getElementById('calculations'),
      currentCalculations = document.getElementById('current-calculations'),
      clearAll = document.getElementById('clear'),
      clearCurrentCalculations = document.getElementById('clear-entry'),
      dot = document.getElementById('dot'),
      historyButton = document.getElementById('history-button'),
      modal = document.querySelector('.modal'),
      modalClose = document.querySelector('.modal-close'),
      history = document.getElementById('history'),
      historySpace = document.querySelector('.history'),
      backspace = document.getElementById('backspace'),
      percentage = document.getElementById('percentage'),
      oneDivided = document.getElementById('one-divided'),
      square = document.getElementById('square'),
      squareRoot = document.getElementById('square-root'),
      changeArithmeticSign = document.getElementById('change-arithmetic-sign'),
      clearHistory = document.querySelector('.clear-history');

let isLastCharOperation = false,
    isLastCharDot = false,
    numberOne,
    numberTwo,
    result,
    isResult = false,
    historyArray = [],
    helper = [],
    historyExists = false,
    isPercentage = false,
    isOneDivided = false,
    isSquared = false,
    isSquareRooted = false,
    isNegated = false;

currentCalculations.innerText = '0';

NUMBERS.forEach((number) => {
    number.addEventListener('click', () => {
        
        if (isResult && isEqualsInCalculations()) {
            calculations.innerText = '';
        }

        if (currentCalculations.innerText === '0') {
            currentCalculations.innerText = '';
        }

        if (isLastCharOperation) {
            currentCalculations.innerText = '';
        }

        if (currentCalculations.innerText.length < 16) {
            currentCalculations.innerText += number.innerText;
        }

        isLastCharOperation = false;
        isLastCharDot = false;
        isResult = false;
    })
})

MATHOPERATIONS.forEach((operation) => {
    operation.addEventListener('click', () => {
        if (isOperationInCalculations()) {
            if (!isEqualsInCalculations()) {
                numberTwo = Number(currentCalculations.innerText);
            }

            result = calculateTheResult();

            if (operation.innerText === '=') {
                if (isEqualsInCalculations()) {
                    numberOne = result;
                    result = calculateTheResult();
                    calculations.innerText = numberOne + operationInCalculations() + numberTwo + '=';
                    currentCalculations.innerText = result;
                    helper = [calculations.innerText, result]
                    pushToHistory();
                    historyExists = true;
                } else if (isPercentage || isOneDivided || isSquared || isSquareRooted) {
                    if (!isOperationInCalculations) {
                        helper = [calculations.innerText, '=', result];
                        pushToHistory();
                        historyExists = true;
                        calculations.innerText += '=';
                        currentCalculations.innerText = result;
                    } 
                    isPercentage = false;
                    isOneDivided = false;
                    isSquared = false;
                    isSquareRooted = false;
                } else {
                    helper = [calculations.innerText, numberTwo, '=', result];
                    pushToHistory();
                    historyExists = true;
                    calculations.innerText += numberTwo + '=';
                    currentCalculations.innerText = result;
                }
                isResult = true;
            } else if (!isResult) {
                numberOne = result;
                currentCalculations.innerText = result;
                isResult = true;
                helper = [calculations.innerText, numberTwo, '=', result]
                calculations.innerText = result + operation.innerText;
                pushToHistory();
                console.log('test');
                historyExists = true;
            } else {
                numberOne = result;
                currentCalculations.innerText = result;
                isResult = false;
                calculations.innerText = numberOne + operation.innerText;
            }
            
        } else {
            if (!isLastCharOperation) {
                if (isPercentage || isOneDivided || isSquared || isSquareRooted) {
                    calculations.innerText += operation.innerText;
                    isPercentage = false;
                    isOneDivided = false;
                    isSquared = false;
                    isSquareRooted = false;
                } else {
                numberOne = Number(currentCalculations.innerText);
                calculations.innerText = numberOne + operation.innerText;
                }
            } else {
                if (isNegated) {
                    numberOne = Number(currentCalculations.innerText);
                    isResult = false;
                }
                calculations.innerText = numberOne + operation.innerText;
            }
            
        }
        isLastCharOperation = true;
        if (numberTwo === 0 && operationInCalculations() === '/') {
            currentCalculations.innerText = 'Error, cannot divide by 0';
        }
    })
})

dot.addEventListener('click', () => {
    if (!isLastCharDot) {
        currentCalculations.innerText += '.';
    }
    isLastCharDot = true;
})

clearAll.addEventListener('click', () => {
    calculations.innerText = '';
    currentCalculations.innerText = '0';
})

clearCurrentCalculations.addEventListener('click', () => {
    currentCalculations.innerText = '0';
})

historyButton.addEventListener('click', () => {
    if (modal.classList.contains('hidden')) {
        modal.classList.remove('hidden');
    }
})

modalClose.addEventListener('click', () => {
    if (!modal.classList.contains('hidden')) {
        modal.classList.add('hidden');
    }
})

backspace.addEventListener('click', () => {
    if (currentCalculations.innerText !== '0') {
        currentCalculations.innerText = currentCalculations.innerText.slice(0, (currentCalculations.innerText.length - 1));
    }
    if (currentCalculations.innerText === '') {
        currentCalculations.innerText = '0';
    }
})

percentage.addEventListener('click', () => {
    if (isOperationInCalculations()) {
        if (operationInCalculations() === '+' || operationInCalculations() === '-') {
            numberTwo = numberOne * (Number(currentCalculations.innerText) / 100);
        } else {
            numberTwo = (Number(currentCalculations.innerText) / 100);
        }
        currentCalculations.innerText = numberTwo;
        calculations.innerText += numberTwo;
    }
    isPercentage = true;
})

oneDivided.addEventListener('click', () => {
    if (currentCalculations.innerText === '0') {
        currentCalculations.innerText = 'Error, cannot divide by 0';
    } else if (!isOperationInCalculations()) {
        calculations.innerText = '1/(' + currentCalculations.innerText + ')';
        numberOne = 1 / Number(currentCalculations.innerText);
        currentCalculations.innerText = numberOne;
    } else {
        calculations.innerText += '1/(' + currentCalculations.innerText + ')';
        numberTwo = 1 / Number(currentCalculations.innerText);
        currentCalculations.innerText = numberTwo;
    }
    isOneDivided = true;
})

square.addEventListener('click', () => {
    if (!isOperationInCalculations()) {
        calculations.innerText = 'sqr(' + currentCalculations.innerText + ')';
        numberOne = Number(currentCalculations.innerText) ** 2;
        currentCalculations.innerText = numberOne;
    } else {
        calculations.innerText += 'sqr(' + currentCalculations.innerText + ')';
        numberTwo = Number(currentCalculations.innerText) ** 2;
        currentCalculations.innerText = numberTwo;
    }
    isSquared = true;
})

squareRoot.addEventListener('click', () => {
    if (!isOperationInCalculations()) {
        calculations.innerText = '√(' + currentCalculations.innerText + ')';
        numberOne = Number(currentCalculations.innerText) ** (1 / 2);
        currentCalculations.innerText = numberOne;
    } else {
        calculations.innerText += '√(' + currentCalculations.innerText + ')';
        numberTwo = Number(currentCalculations.innerText) ** (1 / 2);
        currentCalculations.innerText = numberTwo;
    }
    isSquareRooted = true;
})

changeArithmeticSign.addEventListener('click', () => {
    if (currentCalculations.innerText !== '0') {
        if (currentCalculations.innerText.indexOf('-') === -1) {
            currentCalculations.innerText = '-' + currentCalculations.innerText;
        } else {
            currentCalculations.innerText = currentCalculations.innerText.slice(1, currentCalculations.innerText.length);
        }
        if (isResult) {
            calculations.innerText = 'negate(' + result + ')';
        }
    }
    isNegated = true;
})

clearHistory.addEventListener('click', (e) => {
    e.preventDefault();
    history.innerHTML = "No history yet";
    historyExists = false;
})

function isOperationInCalculations() {
    for (let i = 0; i < calculations.innerText.length; i++) {
        
        if (mathOperationsArray.includes(calculations.innerText[i])) {
            return true;
        }
    }
    return false;
}

function operationInCalculations() {
    if (calculations.innerText[0] === '-') {
        for (let i = 1; i < calculations.innerText.length; i++) {
            if (mathOperationsArray.includes(calculations.innerText[i])) {
                return calculations.innerText[i];
            }
        }
    } else {
        for (let i = 0; i < calculations.innerText.length; i++) {
            if (mathOperationsArray.includes(calculations.innerText[i])) {
                return calculations.innerText[i];
            }
        }
    }  
}

function isEqualsInCalculations() {
    for (let i = 0; i < calculations.innerText.length; i++) {
        if (calculations.innerText[i] === '=') {
            return true;
        }
    }
    return false;
}

function calculateTheResult() {
    switch (operationInCalculations()) {
        case '+':
            result = numberOne + numberTwo;
            break;
        case '-':
            result = numberOne - numberTwo;
            break;
        case '*':
            result = numberOne * numberTwo;
            break;
        case '/':
            if (numberTwo === 0) {
                currentCalculations.innerText = 'Error, cannot divide by 0';
                break;
            } else {
                result = numberOne / numberTwo;
                break;
            }
    }
    return result;
}

function pushToHistory() {
    let historyListElement = document.createElement('li');
    let spanResult = document.createElement('span');
    let historyText = document.createTextNode(helper.slice(0, helper.length - 1).join(''));
    let resultText = document.createTextNode(helper[helper.length - 1]);
    historyListElement.appendChild(historyText);
    spanResult.appendChild(resultText);
    historyListElement.appendChild(spanResult);
    if (!historyExists) {
        history.innerHTML = '';
    } 
    history.appendChild(historyListElement);

}