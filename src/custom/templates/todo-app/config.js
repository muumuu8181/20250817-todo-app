// src/custom/templates/todo-app/config.js
export const TODO_CONFIG = {
    name: "TODOアプリ",
    version: "1.0",
    collection: "todos",
    
    fields: {
        title: { type: "text", required: true },
        completed: { type: "boolean", default: false },
        priority: { type: "select", options: ["low", "medium", "high"] },
        dueDate: { type: "date" }
    },
    
    ui: {
        theme: {
            primaryColor: "#4CAF50",
            secondaryColor: "#2196F3"
        }
    }
};