const display = document.getElementById('display');
let currentInput = '0';
let operator = null;
let previousInput = null;
let operatorClicked = false;

function updateDisplay() {
    display.innerText = currentInput;
}

// --- FUNCIÓN AÑADIDA ---
// Esta función elimina la clase 'active' de todos los botones de operador.
function removeActiveOperator() {
    const operators = document.querySelectorAll('.operator');
    operators.forEach(op => {
        op.classList.remove('active');
    });
}

function appendNumber(number) {
    // --- LÓGICA AÑADIDA ---
    // Si se hace clic en un número, quitamos el resaltado del operador.
    removeActiveOperator();

    if (operatorClicked) {
        currentInput = number;
        operatorClicked = false;
    } else {
        if (currentInput === '0' && number !== '.') {
            currentInput = number;
        } else {
            currentInput += number;
        }
    }
    updateDisplay();
}

function appendOperator(op) {
    // --- LÓGICA AÑADIDA ---
    // Antes de activar un nuevo operador, desactivamos cualquier otro.
    removeActiveOperator();
    // Buscamos todos los botones y añadimos la clase al que coincida con 'op'
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        if (btn.innerText === op) {
            btn.classList.add('active');
        }
    });
    
    if (operator !== null && !operatorClicked) {
        calculate();
    }
    previousInput = currentInput;
    operator = op;
    operatorClicked = true;
}

function calculate() {
    // --- LÓGICA AÑADIDA ---
    // Al calcular, también quitamos el resaltado.
    removeActiveOperator();

    if (operator === null || previousInput === null) {
        return;
    }

    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);

    if (isNaN(prev) || isNaN(current)) {
        return;
    }

    let result;
    switch (operator) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            if (current === 0) {
                currentInput = 'Error';
                updateDisplay();
                return;
            }
            result = prev / current;
            break;
        case '%':
            result = prev % current;
            break;
        default:
            return;
    }
    currentInput = result.toString();
    operator = null;
    previousInput = null;
    operatorClicked = false;
    updateDisplay();
}

function clearDisplay() {
    // --- LÓGICA AÑADIDA ---
    // Al limpiar, también quitamos el resaltado.
    removeActiveOperator();
    currentInput = '0';
    operator = null;
    previousInput = null;
    operatorClicked = false;
    updateDisplay();
}

function deleteLast() {
    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
    } else {
        currentInput = '0';
    }
    updateDisplay();
}

// Inicializa la calculadora
updateDisplay();
