// src/components/common/List.js
export class List {
    constructor(config = {}) {
        this.items = config.items || [];
        this.renderItem = config.renderItem || (item => item.toString());
        this.className = config.className || 'list';
    }
    
    render() {
        const list = document.createElement('ul');
        list.className = this.className;
        
        this.items.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = this.renderItem(item);
            list.appendChild(li);
        });
        
        return list;
    }
}
