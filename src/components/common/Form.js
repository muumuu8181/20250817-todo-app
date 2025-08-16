// src/components/common/Form.js
export class Form {
    constructor(config = {}) {
        this.fields = config.fields || [];
        this.onSubmit = config.onSubmit || (() => {});
        this.submitText = config.submitText || 'Submit';
        this.id = `form-${Date.now()}`;
    }
    
    render() {
        const form = document.createElement('form');
        form.id = this.id;
        form.className = 'form';
        
        this.fields.forEach(field => {
            const fieldWrapper = document.createElement('div');
            fieldWrapper.className = 'form-field';
            
            const label = document.createElement('label');
            label.textContent = field.label;
            label.htmlFor = field.name;
            
            let input;
            switch(field.type) {
                case 'textarea':
                    input = document.createElement('textarea');
                    break;
                case 'select':
                    input = document.createElement('select');
                    if (field.options) {
                        field.options.forEach(opt => {
                            const option = document.createElement('option');
                            option.value = opt.value || opt;
                            option.textContent = opt.label || opt;
                            input.appendChild(option);
                        });
                    }
                    break;
                default:
                    input = document.createElement('input');
                    input.type = field.type || 'text';
            }
            
            input.name = field.name;
            input.id = field.name;
            input.className = 'form-control';
            if (field.required) input.required = true;
            if (field.value) input.value = field.value;
            
            fieldWrapper.appendChild(label);
            fieldWrapper.appendChild(input);
            form.appendChild(fieldWrapper);
        });
        
        const submitBtn = document.createElement('button');
        submitBtn.type = 'submit';
        submitBtn.className = 'btn btn-primary';
        submitBtn.textContent = this.submitText;
        
        form.appendChild(submitBtn);
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            this.onSubmit(data);
        });
        
        return form;
    }
    
    getData() {
        const form = document.getElementById(this.id);
        if (form) {
            const formData = new FormData(form);
            return Object.fromEntries(formData);
        }
        return {};
    }
}