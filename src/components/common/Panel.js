// src/components/common/Panel.js
export class Panel {
    constructor(config = {}) {
        this.id = config.id || `panel-${Date.now()}`;
        this.title = config.title || 'Panel';
        this.content = config.content || '';
        this.collapsed = config.collapsed || false;
        this.number = config.number || 1;
        this.type = config.type || 'default';
    }
    
    render() {
        const panel = document.createElement('div');
        panel.className = `panel panel-${this.type}`;
        panel.setAttribute('data-panel-id', this.id);
        panel.innerHTML = `
            <div class="panel-header">
                <span class="panel-number">[${this.number}]</span>
                <span class="panel-title">${this.title}</span>
                <button class="panel-toggle" onclick="this.parentElement.parentElement.classList.toggle('collapsed')">
                    ${this.collapsed ? '▶' : '▼'}
                </button>
            </div>
            <div class="panel-body ${this.collapsed ? 'hidden' : ''}">
                ${this.content}
            </div>
        `;
        
        if (this.collapsed) {
            panel.classList.add('collapsed');
        }
        
        return panel;
    }
    
    setContent(content) {
        this.content = content;
        const body = document.querySelector(`[data-panel-id="${this.id}"] .panel-body`);
        if (body) {
            body.innerHTML = content;
        }
    }
    
    toggle() {
        const panel = document.querySelector(`[data-panel-id="${this.id}"]`);
        if (panel) {
            panel.classList.toggle('collapsed');
            const body = panel.querySelector('.panel-body');
            body.classList.toggle('hidden');
        }
    }
}

// パネル管理システム
export class PanelManager {
    constructor() {
        this.panels = new Map();
        this.counter = 0;
    }
    
    createPanel(config) {
        this.counter++;
        const panel = new Panel({
            ...config,
            number: this.counter
        });
        this.panels.set(panel.id, panel);
        return panel;
    }
    
    getPanel(id) {
        return this.panels.get(id);
    }
    
    getAllPanels() {
        return Array.from(this.panels.values());
    }
    
    renderAll(container) {
        const wrapper = document.createElement('div');
        wrapper.className = 'panels-container';
        wrapper.innerHTML = `
            <div class="panels-header">
                パネル数: ${this.panels.size}
            </div>
        `;
        
        this.panels.forEach(panel => {
            wrapper.appendChild(panel.render());
        });
        
        if (container) {
            container.appendChild(wrapper);
        }
        
        return wrapper;
    }
}