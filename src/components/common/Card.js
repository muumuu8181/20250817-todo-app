// src/components/common/Card.js
export class Card {
    constructor(config = {}) {
        this.title = config.title || '';
        this.content = config.content || '';
        this.footer = config.footer || '';
    }
    
    render() {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            ${this.title ? `<div class="card-header">${this.title}</div>` : ''}
            <div class="card-body">${this.content}</div>
            ${this.footer ? `<div class="card-footer">${this.footer}</div>` : ''}
        `;
        return card;
    }
}
