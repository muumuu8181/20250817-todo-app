// src/custom/templates/todo-app/components.js
import { Card } from '../../components/common/Card.js';
import { Button } from '../../components/common/Button.js';

export class TodoItem extends Card {
    constructor(todo) {
        super({
            title: todo.title,
            content: `Priority: ${todo.priority}`,
            footer: new Button({
                text: todo.completed ? 'Completed' : 'Complete',
                onClick: () => this.toggleComplete(todo)
            }).render().outerHTML
        });
        this.todo = todo;
    }
    
    toggleComplete(todo) {
        todo.completed = !todo.completed;
        // データベース更新処理
    }
}