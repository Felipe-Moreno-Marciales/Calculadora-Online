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
        if (button.dataset.number) {
            this.inputNumber(button.dataset.number);
        } else if (button.dataset.action) {
            this.handleAction(button.dataset.action);
        }
        
        // CAMBIO: Ya no es necesario llamar a updateOperatorButtons desde aquí.
        this.updateDisplay();
    }

    handleKeyboard(event) {
        // Mapeo de teclas a botones para reutilizar la lógica
        const keyMap = {
            '0': '0', '1': '1', '2': '2', '3': '3', '4': '4', '5': '5', '6': '6', '7': '7', '8': '8', '9': '9',
            '.': 'decimal', ',': 'decimal',
            '+': 'add',
            '-': 'subtract',
            '*': 'multiply',
            '/': 'divide',
            '%': 'percent',
            'Enter': 'equals', '=': 'equals',
            'Escape': 'clear', 'c': 'clear',
            'Backspace': 'delete' // Opcional: para manejar borrado
        };
        const action = keyMap[event.key];
        
        if (action) {
            event.preventDefault();
            const button = document.querySelector(`[data-action="${action}"]`) || document.querySelector(`[data-number="${action}"]`);
            if (button) this.handleButtonClick(button);
        }
    }

    inputNumber(number) {
        // CORRECCIÓN: Al introducir un número, se debe limpiar el estado del operador
        // para que la siguiente operación en cadena funcione correctamente.
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
        // CAMBIO: Nos aseguramos de que ningún botón quede activo al limpiar.
        this.updateOperatorButtons(null);
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
        // CAMBIO: Inmediatamente después de establecer un operador,
        // llamamos a la función que quita el resaltado.
        this.updateOperatorButtons(null);
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
        // CAMBIO: Nos aseguramos de que ningún botón quede activo al calcular.
        this.updateOperatorButtons(null);
    }

    formatResult(result) {
        const resultString = result.toString();
        if (resultString.length > 9) {
            // Usar toPrecision para un redondeo más inteligente
            return parseFloat(result.toPrecision(6)).toString();
        }
        return resultString;
    }

    updateDisplay() {
        let displayValue = this.currentInput;
        if (displayValue.length > 9) {
            // Truncar para visualización si es muy largo y no es exponencial
            if (!displayValue.includes('e')) {
                 displayValue = displayValue.substring(0, 9);
            }
        }
        this.display.textContent = displayValue;
        this.display.style.fontSize = displayValue.length > 6 ? '2.5rem' : '3.5rem';
    }

    /**
     * CAMBIO: Esta función ahora solo sirve para *quitar* la clase 'active'.
     * Ya no la añade. Esto elimina el estado resaltado persistente.
     * @param {string | null} activeOperator - Se ignora, pero se mantiene por compatibilidad de llamadas.
     */
    updateOperatorButtons(activeOperator) {
        document.querySelectorAll('.btn.operator').forEach(btn => {
            btn.classList.remove('active');
        });
    }
}

document.addEventListener('DOMContentLoaded', () => new Calculator());

