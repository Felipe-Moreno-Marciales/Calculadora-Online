/**
 * Calculadora Web Estilo macOS
 * 
 * Esta clase implementa una calculadora completamente funcional
 * con diseño inspirado en la calculadora de macOS.
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
        document.addEventListener('keydown', this.handleKeyboard.bind(this));
    }

    handleButtonClick(button) {
        // CAMBIO: Se limpian los operadores activos ANTES de procesar el nuevo clic.
        // Esto asegura que al tocar un número, el operador anterior se desactive.
        if (button.dataset.number || button.dataset.action === 'equals' || button.dataset.action === 'clear') {
            this.updateOperatorButtons(null);
        }

        if (button.dataset.number) {
            this.inputNumber(button.dataset.number);
        } else if (button.dataset.action) {
            this.handleAction(button.dataset.action);
        }

        this.updateDisplay();
    }

    handleKeyboard(event) {
        const key = event.key;
        const button = document.querySelector(`[data-key="${key}"]`);
        if (button) {
            event.preventDefault();
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
        this.updateOperatorButtons(null); // Asegura que no haya operadores activos
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
        
        // CAMBIO: Se actualiza el estado visual del operador JUSTO después de seleccionarlo.
        this.updateOperatorButtons(this.operator);
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
        if (resultString.length > 9) {
            return result.toPrecision(6);
        }
        return resultString;
    }

    updateDisplay() {
        let displayValue = this.currentInput;
        if (displayValue.length > 9) {
            displayValue = parseFloat(displayValue).toPrecision(6);
        }
        this.display.textContent = displayValue;
        this.display.style.fontSize = displayValue.length > 6 ? '2.5rem' : '3.5rem';
    }

    updateOperatorButtons(activeOperator) {
        document.querySelectorAll('.btn.operator').forEach(btn => {
            // CAMBIO: La lógica es más simple. Si el 'data-action' del botón coincide con
            // el operador activo pasado a la función, se añade la clase. Si no, se quita.
            if (btn.dataset.action === activeOperator) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => new Calculator());
