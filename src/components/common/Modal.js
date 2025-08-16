// src/components/common/Modal.js
export class Modal {
    constructor(config = {}) {
        this.title = config.title || 'Modal';
        this.content = config.content || '';
        this.onClose = config.onClose || (() => {});
    }
    
    render() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${this.title}</h2>
                    <span class="modal-close">&times;</span>
                </div>
                <div class="modal-body">${this.content}</div>
            </div>
        `;
        
        modal.querySelector('.modal-close').addEventListener('click', () => {
            this.close();
        });
        
        return modal;
    }
    
    show() {
        document.body.appendChild(this.render());
    }
    
    close() {
        const modal = document.querySelector('.modal');
        if (modal) {
            modal.remove();
            this.onClose();
        }
    }
}
