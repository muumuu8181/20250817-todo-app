// src/components/common/Button.js
export class Button {
    constructor(config = {}) {
        this.text = config.text || 'Button';
        this.onClick = config.onClick || (() => {});
        this.className = config.className || 'btn';
        this.type = config.type || 'primary';
    }
    
    render() {
        const button = document.createElement('button');
        button.textContent = this.text;
        button.className = `${this.className} btn-${this.type}`;
        button.addEventListener('click', this.onClick);
        return button;
    }
}
