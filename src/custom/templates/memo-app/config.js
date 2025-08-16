// src/custom/templates/memo-app/config.js
export const MEMO_CONFIG = {
    name: "メモアプリ",
    version: "1.0",
    collection: "memos",
    
    fields: {
        title: { type: "text", required: true },
        content: { type: "textarea", required: true },
        tags: { type: "array", itemType: "text" },
        category: { type: "select", options: ["personal", "work", "idea", "other"] },
        createdAt: { type: "datetime", auto: true },
        updatedAt: { type: "datetime", auto: true }
    },
    
    ui: {
        theme: {
            primaryColor: "#FF9800",
            secondaryColor: "#FFC107"
        },
        layout: {
            columns: 2,
            showSidebar: true
        }
    }
};