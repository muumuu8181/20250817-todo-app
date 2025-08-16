// src/components/common/Input.js
export class Input {
    constructor(config = {}) {
        this.type = config.type || 'text';
        this.placeholder = config.placeholder || '';
        this.value = config.value || '';
        this.onChange = config.onChange || (() => {});
        this.className = config.className || 'form-input';
    }
    
    render() {
        const input = document.createElement('input');
        input.type = this.type;
        input.placeholder = this.placeholder;
        input.value = this.value;
        input.className = this.className;
        input.addEventListener('change', this.onChange);
        return input;
    }
}
