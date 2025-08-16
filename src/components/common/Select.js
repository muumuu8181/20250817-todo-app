// src/components/common/Select.js
export class Select {
    constructor(config = {}) {
        this.options = config.options || [];
        this.value = config.value || '';
        this.onChange = config.onChange || (() => {});
        this.placeholder = config.placeholder || 'Select...';
        this.multiple = config.multiple || false;
    }
    
    render() {
        const select = document.createElement('select');
        select.className = 'select';
        if (this.multiple) select.multiple = true;
        
        if (this.placeholder && !this.multiple) {
            const placeholder = document.createElement('option');
            placeholder.value = '';
            placeholder.textContent = this.placeholder;
            placeholder.disabled = true;
            placeholder.selected = !this.value;
            select.appendChild(placeholder);
        }
        
        this.options.forEach(option => {
            const opt = document.createElement('option');
            opt.value = option.value || option;
            opt.textContent = option.label || option;
            if (opt.value === this.value) opt.selected = true;
            select.appendChild(opt);
        });
        
        select.addEventListener('change', (e) => {
            this.value = e.target.value;
            this.onChange(this.value);
        });
        
        return select;
    }
}