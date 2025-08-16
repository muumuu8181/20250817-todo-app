// src/components/common/Alert.js
export class Alert {
    constructor(config = {}) {
        this.message = config.message || '';
        this.type = config.type || 'info'; // info, success, warning, error
        this.dismissible = config.dismissible !== false;
        this.autoHide = config.autoHide || 0;
    }
    
    render() {
        const alert = document.createElement('div');
        alert.className = `alert alert-${this.type}`;
        
        const icon = {
            info: 'ℹ️',
            success: '✅',
            warning: '⚠️',
            error: '❌'
        }[this.type];
        
        alert.innerHTML = `
            <span class="alert-icon">${icon}</span>
            <span class="alert-message">${this.message}</span>
            ${this.dismissible ? '<button class="alert-close">&times;</button>' : ''}
        `;
        
        if (this.dismissible) {
            alert.querySelector('.alert-close').addEventListener('click', () => {
                alert.remove();
            });
        }
        
        if (this.autoHide > 0) {
            setTimeout(() => alert.remove(), this.autoHide);
        }
        
        return alert;
    }
    
    show() {
        const alertContainer = document.getElementById('alert-container') || 
                              (() => {
                                  const container = document.createElement('div');
                                  container.id = 'alert-container';
                                  container.className = 'alert-container';
                                  document.body.appendChild(container);
                                  return container;
                              })();
        
        alertContainer.appendChild(this.render());
    }
    
    static success(message, autoHide = 3000) {
        new Alert({ message, type: 'success', autoHide }).show();
    }
    
    static error(message) {
        new Alert({ message, type: 'error' }).show();
    }
    
    static warning(message) {
        new Alert({ message, type: 'warning' }).show();
    }
    
    static info(message) {
        new Alert({ message, type: 'info' }).show();
    }
}