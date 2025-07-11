class Calculator {
    constructor() {
        this.display = document.querySelector('.display-text');
        this.buttons = document.querySelectorAll('.btn');
        this.currentInput = '0';
        this.previousInput = null;
        this.operator = null;
        this.waitingForNewInput = false;
        
        this.initEventListeners();
    }
    
    initEventListeners() {
        this.buttons.forEach(button => {
            button.addEventListener('click', this.handleButtonClick.bind(this));
        });
        
        // Agregar soporte para teclado
        document.addEventListener('keydown', this.handleKeyboard.bind(this));
    }
    
    handleButtonClick(event) {
        const button = event.target;
        
        if (button.dataset.number) {
            this.inputNumber(button.dataset.number);
        } else if (button.dataset.action) {
            this.handleAction(button.dataset.action);
        }
        
        this.updateDisplay();
        this.updateOperatorButtons();
    }
    
    handleKeyboard(event) {
        const key = event.key;
        
        if (key >= '0' && key <= '9') {
            this.inputNumber(key);
        } else if (key === '.') {
            this.handleAction('decimal');
        } else if (key === '+') {
            this.handleAction('add');
        } else if (key === '-') {
            this.handleAction('subtract');
        } else if (key === '*') {
            this.handleAction('multiply');
        } else if (key === '/') {
            event.preventDefault();
            this.handleAction('divide');
        } else if (key === 'Enter' || key === '=') {
            this.handleAction('equals');
        } else if (key === 'Escape' || key === 'c' || key === 'C') {
            this.handleAction('clear');
        } else if (key === '%') {
            this.handleAction('percent');
        }
        
        this.updateDisplay();
        this.updateOperatorButtons();
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
            case 'clear':
                this.clear();
                break;
            case 'toggle-sign':
                this.toggleSign();
                break;
            case 'percent':
                this.percent();
                break;
            case 'decimal':
                this.addDecimal();
                break;
            case 'add':
            case 'subtract':
            case 'multiply':
            case 'divide':
                this.setOperator(action);
                break;
            case 'equals':
                this.calculate();
                break;
        }
    }
    
    clear() {
        this.currentInput = '0';
        this.previousInput = null;
        this.operator = null;
        this.waitingForNewInput = false;
    }
    
    toggleSign() {
        if (this.currentInput !== '0') {
            this.currentInput = this.currentInput.startsWith('-') 
                ? this.currentInput.slice(1) 
                : '-' + this.currentInput;
        }
    }
    
    percent() {
        const value = parseFloat(this.currentInput);
        this.currentInput = (value / 100).toString();
    }
    
    addDecimal() {
        if (this.waitingForNewInput) {
            this.currentInput = '0.';
            this.waitingForNewInput = false;
        } else if (this.currentInput.indexOf('.') === -1) {
            this.currentInput += '.';
        }
    }
    
    setOperator(newOperator) {
        if (this.previousInput !== null && !this.waitingForNewInput) {
            this.calculate();
        }
        
        this.operator = newOperator;
        this.previousInput = this.currentInput;
        this.waitingForNewInput = true;
    }
    
    calculate() {
        if (this.operator && this.previousInput !== null) {
            const prev = parseFloat(this.previousInput);
            const current = parseFloat(this.currentInput);
            let result;
            
            switch (this.operator) {
                case 'add':
                    result = prev + current;
                    break;
                case 'subtract':
                    result = prev - current;
                    break;
                case 'multiply':
                    result = prev * current;
                    break;
                case 'divide':
                    if (current === 0) {
                        alert('Error: División por cero');
                        this.clear();
                        return;
                    }
                    result = prev / current;
                    break;
                default:
                    return;
            }
            
            // Formatear el resultado
            this.currentInput = this.formatResult(result);
            this.operator = null;
            this.previousInput = null;
            this.waitingForNewInput = true;
        }
    }
    
    formatResult(result) {
        // Manejar números muy grandes o muy pequeños
        if (Math.abs(result) > 999999999) {
            return result.toExponential(6);
        }
        
        // Eliminar decimales innecesarios
        const formatted = parseFloat(result.toFixed(10));
        return formatted.toString();
    }
    
    updateDisplay() {
        // Limitar la longitud del display
        let displayValue = this.currentInput;
        
        if (displayValue.length > 9) {
            const num = parseFloat(displayValue);
            if (Math.abs(num) >= 1000000000) {
                displayValue = num.toExponential(3);
            } else {
                displayValue = displayValue.substring(0, 9);
            }
        }
        
        this.display.textContent = displayValue;
        
        // Ajustar el tamaño de la fuente si es necesario
        if (displayValue.length > 7) {
            this.display.style.fontSize = '36px';
        } else if (displayValue.length > 6) {
            this.display.style.fontSize = '42px';
        } else {
            this.display.style.fontSize = '48px';
        }
    }
    
    updateOperatorButtons() {
        // Remover la clase active de todos los botones de operador
        const operatorButtons = document.querySelectorAll('.btn.operator');
        operatorButtons.forEach(btn => btn.classList.remove('active'));
        
        // Agregar la clase active al operador actual
        if (this.operator) {
            const activeButton = document.querySelector(`[data-action="${this.operator}"]`);
            if (activeButton) {
                activeButton.classList.add('active');
            }
        }
    }
}

// Inicializar la calculadora cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new Calculator();
});