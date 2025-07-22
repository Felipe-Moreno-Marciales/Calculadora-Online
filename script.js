/**
 * Calculadora Web Estilo macOS
 * Versión corregida para eliminar el estado activo persistente en los operadores.
 */
class Calculator {
    constructor() {
        this.display = document.querySelector('.display-text');
        this.buttons = document.querySelectorAll('.btn');
        this.initEventListeners();
        this.clear(); // Inicia la calculadora en un estado limpio
    }

    initEventListeners() {
        this.buttons.forEach(button => {
            button.addEventListener('click', () => this.handleButtonClick(button));
        });
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }

    handleButtonClick(button) {
        if (button.dataset.number) {
            this.inputNumber(button.dataset.number);
        } else if (button.dataset.action) {
            this.handleAction(button.dataset.action);
        }
        this.updateDisplay();
    }

    handleKeyboard(event) {
        const key = event.key;
        // Se busca el botón que corresponde a la tecla presionada
        const button = document.querySelector(`[data-key="${key}"], [data-key="${key.toLowerCase()}"]`);
        if (button) {
            event.preventDefault(); // Previene comportamientos por defecto del navegador
            this.handleButtonClick(button);
        }
    }

    inputNumber(number) {
        if (this.waitingForNewInput) {
            this.currentInput = number;
            this.waitingForNewInput = false;
        } else {
            this.currentInput = this.currentInput === '0' ? number : this.currentInput + number;
        }
    }

    handleAction(action) {
        switch (action) {
            case 'clear': this.clear(); break;
            case 'toggle-sign': this.toggleSign(); break;
            case 'percent': this.percent(); break;
            case 'decimal': this.addDecimal(); break;
            case 'add':
            case 'subtract':
            case 'multiply':
            case 'divide':
                this.setOperator(action);
                break;
            case 'equals': this.calculate(); break;
        }
    }

    clear() {
        this.currentInput = '0';
        this.previousInput = null;
        this.operator = null;
        this.waitingForNewInput = false;
        
        // **ÚNICA MODIFICACIÓN NECESARIA**
        // Se eliminan todas las demás llamadas a esta función.
        // Solo se usa al limpiar para garantizar un estado inicial correcto.
        this.removeActiveStateFromOperators();
        this.updateDisplay();
    }

    toggleSign() {
        if (this.currentInput !== '0') {
            this.currentInput = this.currentInput.startsWith('-') ? this.currentInput.slice(1) : '-' + this.currentInput;
        }
    }

    percent() {
        this.currentInput = (parseFloat(this.currentInput) / 100).toString();
    }

    addDecimal() {
        if (this.waitingForNewInput) {
            this.currentInput = '0.';
            this.waitingForNewInput = false;
        } else if (!this.currentInput.includes('.')) {
            this.currentInput += '.';
        }
    }

    setOperator(newOperator) {
        if (this.operator && !this.waitingForNewInput) {
            this.calculate();
        }
        this.previousInput = this.currentInput;
        this.operator = newOperator;
        this.waitingForNewInput = true;
    }

    calculate() {
        if (this.operator && this.previousInput !== null) {
            const prev = parseFloat(this.previousInput);
            const current = parseFloat(this.currentInput);
            let result;

            switch (this.operator) {
                case 'add': result = prev + current; break;
                case 'subtract': result = prev - current; break;
                case 'multiply': result = prev * current; break;
                case 'divide':
                    if (current === 0) {
                        alert('Error: División por cero');
                        this.clear();
                        return;
                    }
                    result = prev / current;
                    break;
                default: return;
            }

            this.currentInput = this.formatResult(result);
            this.operator = null;
            this.previousInput = null;
            this.waitingForNewInput = true;
        }
    }

    formatResult(result) {
        const resultString = result.toString();
        if (resultString.length > 9 && resultString.includes('.')) {
            return parseFloat(result.toPrecision(6)).toString();
        }
        if (resultString.length > 9) {
            return result.toExponential(3);
        }
        return resultString;
    }

    updateDisplay() {
        let displayValue = this.currentInput;
        if (displayValue.length > 9 && !displayValue.includes('e')) {
            displayValue = displayValue.substring(0, 9);
        }
        this.display.textContent = displayValue;
        this.display.style.fontSize = displayValue.length > 6 ? '2.5rem' : '3.5rem';
    }

    // He renombrado la función para que su propósito sea inequívoco.
    // Esta es la única función que toca la clase 'active'.
    removeActiveStateFromOperators() {
        document.querySelectorAll('.btn.operator').forEach(btn => {
            btn.classList.remove('active');
        });
    }
}

// Para que el teclado funcione, asegúrate de que tu HTML tenga los `data-key`.
// Ejemplo: <button class="btn operator" data-action="add" data-key="+">+</button>
document.addEventListener('DOMContentLoaded', () => new Calculator());
