/**
 * Calculadora Web Estilo macOS
 * 
 * Esta clase implementa una calculadora completamente funcional
 * con diseño inspirado en la calculadora de macOS.
 * 
 * Características:
 * - Operaciones aritméticas básicas (+, -, ×, ÷)
 * - Funciones especiales (AC, +/-, %)
 * - Soporte para entrada por teclado
 * - Manejo de errores y validaciones
 * - Interfaz visual con retroalimentación
 */
class Calculator {
    /**
     * Constructor de la calculadora
     * Inicializa el estado y configura los event listeners
     */
    constructor() {
        // Referencia al elemento de visualización
        this.display = document.querySelector('.display-text');
        
        // Referencia a todos los botones de la calculadora
        this.buttons = document.querySelectorAll('.btn');
        
        // Estado de la calculadora
        this.currentInput = '0';          // Entrada actual mostrada
        this.previousInput = null;        // Entrada anterior para cálculos
        this.operator = null;             // Operador seleccionado
        this.waitingForNewInput = false;  // Flag para nueva entrada
        
        // Configurar los event listeners
        this.initEventListeners();
    }
    
    /**
     * Inicializa todos los event listeners
     * Configura eventos para botones y teclado
     */
    initEventListeners() {
        // Event listener para clics en botones
        this.buttons.forEach(button => {
            button.addEventListener('click', this.handleButtonClick.bind(this));
        });
        
        // Event listener para entrada por teclado
        document.addEventListener('keydown', this.handleKeyboard.bind(this));
    }
    
    /**
     * Maneja los clics en los botones de la calculadora
     * @param {Event} event - Evento de clic
     */
    handleButtonClick(event) {
        const button = event.target;
        
        // Determinar si es un número o una acción
        if (button.dataset.number) {
            this.inputNumber(button.dataset.number);
        } else if (button.dataset.action) {
            this.handleAction(button.dataset.action);
        }
        
        // Actualizar la interfaz
        this.updateDisplay();
        this.updateOperatorButtons();
    }
    
    /**
     * Maneja la entrada por teclado
     * @param {KeyboardEvent} event - Evento de teclado
     */
    handleKeyboard(event) {
        const key = event.key;
        
        // Mapear teclas a acciones de la calculadora
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
            event.preventDefault(); // Prevenir búsqueda en navegador
            this.handleAction('divide');
        } else if (key === 'Enter' || key === '=') {
            this.handleAction('equals');
        } else if (key === 'Escape' || key === 'c' || key === 'C') {
            this.handleAction('clear');
        } else if (key === '%') {
            this.handleAction('percent');
        }
        
        // Actualizar la interfaz
        this.updateDisplay();
        this.updateOperatorButtons();
    }
    
    /**
     * Procesa la entrada de un número
     * @param {string} number - Dígito ingresado
     */
    inputNumber(number) {
        if (this.waitingForNewInput) {
            // Comenzar nueva entrada después de una operación
            this.currentInput = number;
            this.waitingForNewInput = false;
        } else {
            // Agregar dígito a la entrada actual
            this.currentInput = this.currentInput === '0' ? number : this.currentInput + number;
        }
    }
    
    /**
     * Maneja las acciones de los botones especiales
     * @param {string} action - Tipo de acción a ejecutar
     */
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
    
    /**
     * Reinicia la calculadora a su estado inicial
     * Función del botón AC (All Clear)
     */
    clear() {
        this.currentInput = '0';
        this.previousInput = null;
        this.operator = null;
        this.waitingForNewInput = false;
    }
    
    /**
     * Cambia el signo del número actual
     * Función del botón +/-
     */
    toggleSign() {
        if (this.currentInput !== '0') {
            this.currentInput = this.currentInput.startsWith('-') 
                ? this.currentInput.slice(1)      // Quitar signo negativo
                : '-' + this.currentInput;        // Agregar signo negativo
        }
    }
    
    /**
     * Convierte el número actual a porcentaje
     * Función del botón %
     */
    percent() {
        const value = parseFloat(this.currentInput);
        this.currentInput = (value / 100).toString();
    }
    
    /**
     * Agrega un punto decimal al número actual
     * Función del botón punto decimal
     */
    addDecimal() {
        if (this.waitingForNewInput) {
            // Comenzar nuevo número decimal
            this.currentInput = '0.';
            this.waitingForNewInput = false;
        } else if (this.currentInput.indexOf('.') === -1) {
            // Agregar punto decimal si no existe
            this.currentInput += '.';
        }
        // Si ya existe un punto decimal, no hacer nada
    }
    
    /**
     * Establece el operador para la próxima operación
     * @param {string} newOperator - Tipo de operador (add, subtract, multiply, divide)
     */
    setOperator(newOperator) {
        // Si ya hay una operación pendiente, calcularla primero
        if (this.previousInput !== null && !this.waitingForNewInput) {
            this.calculate();
        }
        
        // Configurar nuevo operador
        this.operator = newOperator;
        this.previousInput = this.currentInput;
        this.waitingForNewInput = true;
    }
    
    /**
     * Ejecuta el cálculo de la operación actual
     * Función del botón = y operaciones en cadena
     */
    calculate() {
        // Verificar que hay una operación completa
        if (this.operator && this.previousInput !== null) {
            const prev = parseFloat(this.previousInput);
            const current = parseFloat(this.currentInput);
            let result;
            
            // Ejecutar la operación correspondiente
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
                    // Manejar división por cero
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
            
            // Formatear y mostrar el resultado
            this.currentInput = this.formatResult(result);
            this.operator = null;
            this.previousInput = null;
            this.waitingForNewInput = true;
        }
    }
    
    /**
     * Formatea el resultado para una visualización óptima
     * @param {number} result - Resultado numérico a formatear
     * @returns {string} Resultado formateado como cadena
     */
    formatResult(result) {
        // Manejar números muy grandes (notación científica)
        if (Math.abs(result) > 999999999) {
            return result.toExponential(6);
        }
        
        // Eliminar decimales innecesarios y redondear
        const formatted = parseFloat(result.toFixed(10));
        return formatted.toString();
    }
    
    /**
     * Actualiza el texto mostrado en la pantalla
     * Incluye formateo automático y ajuste de fuente
     */
    updateDisplay() {
        let displayValue = this.currentInput;
        
        // Limitar la longitud del display para evitar desbordamiento
        if (displayValue.length > 9) {
            const num = parseFloat(displayValue);
            if (Math.abs(num) >= 1000000000) {
                // Usar notación científica para números muy grandes
                displayValue = num.toExponential(3);
            } else {
                // Truncar a 9 caracteres
                displayValue = displayValue.substring(0, 9);
            }
        }
        
        // Actualizar el contenido del display
        this.display.textContent = displayValue;
        
        // Ajustar el tamaño de fuente según la longitud
        if (displayValue.length > 7) {
            this.display.style.fontSize = '36px';
        } else if (displayValue.length > 6) {
            this.display.style.fontSize = '42px';
        } else {
            this.display.style.fontSize = '48px';
        }
    }
    
    /**
     * Actualiza el estado visual de los botones de operadores
     * Resalta el operador actualmente seleccionado
     */
    updateOperatorButtons() {
        // Remover estado activo de todos los operadores
        const operatorButtons = document.querySelectorAll('.btn.operator');
        operatorButtons.forEach(btn => btn.classList.remove('active'));
        
        // Resaltar el operador actual si existe
        if (this.operator) {
            const activeButton = document.querySelector(`[data-action="${this.operator}"]`);
            if (activeButton) {
                activeButton.classList.add('active');
            }
        }
    }
}

/**
 * Inicialización de la aplicación
 * Crea una nueva instancia de la calculadora cuando el DOM esté listo
 */
document.addEventListener('DOMContentLoaded', () => {
    new Calculator();
});
