// src/components/common/Loading.js
export class Loading {
    constructor(config = {}) {
        this.text = config.text || 'Loading...';
        this.type = config.type || 'spinner';
        this.size = config.size || 'medium';
    }
    
    render() {
        const loading = document.createElement('div');
        loading.className = `loading loading-${this.size}`;
        
        if (this.type === 'spinner') {
            loading.innerHTML = `
                <div class="spinner"></div>
                <span class="loading-text">${this.text}</span>
            `;
        } else if (this.type === 'bar') {
            loading.innerHTML = `
                <div class="loading-bar">
                    <div class="loading-bar-progress"></div>
                </div>
                <span class="loading-text">${this.text}</span>
            `;
        } else if (this.type === 'dots') {
            loading.innerHTML = `
                <div class="loading-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <span class="loading-text">${this.text}</span>
            `;
        }
        
        return loading;
    }
    
    show() {
        const loading = this.render();
        loading.id = 'global-loading';
        document.body.appendChild(loading);
    }
    
    hide() {
        const loading = document.getElementById('global-loading');
        if (loading) loading.remove();
    }
}