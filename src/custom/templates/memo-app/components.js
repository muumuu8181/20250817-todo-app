// src/custom/templates/memo-app/components.js
import { Card } from '../../components/common/Card.js';
import { Button } from '../../components/common/Button.js';
import { Input } from '../../components/common/Input.js';

export class MemoCard extends Card {
    constructor(memo) {
        const tagsHtml = memo.tags ? memo.tags.map(tag => 
            `<span class="tag">${tag}</span>`
        ).join(' ') : '';
        
        super({
            title: memo.title,
            content: `
                <p class="memo-content">${memo.content}</p>
                <div class="memo-tags">${tagsHtml}</div>
                <div class="memo-meta">
                    <span class="category">${memo.category || 'other'}</span>
                    <span class="date">${new Date(memo.createdAt).toLocaleDateString()}</span>
                </div>
            `,
            footer: new Button({
                text: 'Edit',
                onClick: () => this.editMemo(memo)
            }).render().outerHTML
        });
        this.memo = memo;
    }
    
    editMemo(memo) {
        // メモ編集処理を実装
        console.log('Editing memo:', memo.title);
    }
}

export class MemoEditor {
    constructor(memo = null) {
        this.memo = memo || {
            title: '',
            content: '',
            tags: [],
            category: 'other'
        };
    }
    
    render() {
        const container = document.createElement('div');
        container.className = 'memo-editor';
        
        const titleInput = new Input({
            type: 'text',
            placeholder: 'メモのタイトル',
            value: this.memo.title,
            onChange: (e) => { this.memo.title = e.target.value; }
        });
        
        const contentArea = document.createElement('textarea');
        contentArea.placeholder = 'メモの内容';
        contentArea.value = this.memo.content;
        contentArea.className = 'memo-content-editor';
        contentArea.addEventListener('change', (e) => {
            this.memo.content = e.target.value;
        });
        
        const categorySelect = document.createElement('select');
        categorySelect.className = 'memo-category-select';
        ['personal', 'work', 'idea', 'other'].forEach(cat => {
            const option = document.createElement('option');
            option.value = cat;
            option.textContent = cat;
            if (cat === this.memo.category) option.selected = true;
            categorySelect.appendChild(option);
        });
        
        const saveButton = new Button({
            text: this.memo.createdAt ? 'Update' : 'Save',
            onClick: () => this.saveMemo()
        });
        
        container.appendChild(titleInput.render());
        container.appendChild(contentArea);
        container.appendChild(categorySelect);
        container.appendChild(saveButton.render());
        
        return container;
    }
    
    saveMemo() {
        // メモ保存処理を実装
        console.log('Saving memo:', this.memo);
    }
}