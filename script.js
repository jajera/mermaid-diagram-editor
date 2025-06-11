class MermaidEditor {
    constructor() {
        this.debounceTimer = null;
        this.autoSaveTimer = null;
        this.currentZoom = 1;
        this.isRendering = false;

        // Initialize elements
        this.initializeElements();

        // Initialize Mermaid
        this.initializeMermaid();

        // Setup event listeners
        this.setupEventListeners();

        // Load saved data
        this.loadFromStorage();

        // Initialize theme
        this.initializeTheme();

        // Start auto-save
        this.startAutoSave();

        // Load default template if editor is empty
        if (!this.editor.value.trim()) {
            this.loadTemplate('flowchart');
        }
    }

    initializeElements() {
        // Editor and preview
        this.editor = document.getElementById('editor');
        this.preview = document.getElementById('preview');

        // Controls
        this.templateSelect = document.getElementById('templateSelect');
        this.themeToggle = document.getElementById('themeToggle');
        this.clearBtn = document.getElementById('clearBtn');
        this.copySourceBtn = document.getElementById('copySourceBtn');
        this.copySvgBtn = document.getElementById('copySvgBtn');
        this.exportPngBtn = document.getElementById('exportPngBtn');
        this.exportSvgBtn = document.getElementById('exportSvgBtn');
        this.refreshBtn = document.getElementById('refreshBtn');
        this.zoomInBtn = document.getElementById('zoomInBtn');
        this.zoomOutBtn = document.getElementById('zoomOutBtn');

        // Status and info
        this.charCount = document.getElementById('charCount');
        this.lastSaved = document.getElementById('lastSaved');
        this.renderStatus = document.getElementById('renderStatus');
        this.errorBar = document.getElementById('errorBar');
        this.errorMessage = document.getElementById('errorMessage');
        this.closeError = document.getElementById('closeError');

        // Modal
        this.confirmModal = document.getElementById('confirmModal');
        this.confirmMessage = document.getElementById('confirmMessage');
        this.confirmOk = document.getElementById('confirmOk');
        this.confirmCancel = document.getElementById('confirmCancel');
    }

    initializeMermaid() {
        mermaid.initialize({
            startOnLoad: false,
            theme: 'default',
            securityLevel: 'loose',
            fontFamily: 'SF Mono, Monaco, Cascadia Code, Roboto Mono, Consolas, Courier New, monospace',
            flowchart: {
                useMaxWidth: true,
                htmlLabels: true
            },
            sequence: {
                useMaxWidth: true,
                wrap: true
            },
            gantt: {
                useMaxWidth: true
            }
        });
    }

    setupEventListeners() {
        // Editor events
        this.editor.addEventListener('input', () => {
            this.updateCharCount();
            this.debouncedRender();
        });

        this.editor.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'Enter') {
                e.preventDefault();
                this.renderDiagram();
            }

            // Handle tab key for indentation
            if (e.key === 'Tab') {
                e.preventDefault();
                const start = this.editor.selectionStart;
                const end = this.editor.selectionEnd;
                this.editor.value = this.editor.value.substring(0, start) + '  ' + this.editor.value.substring(end);
                this.editor.selectionStart = this.editor.selectionEnd = start + 2;
            }
        });

        // Template selection
        this.templateSelect.addEventListener('change', (e) => {
            if (e.target.value) {
                this.loadTemplate(e.target.value);
                e.target.value = ''; // Reset selection
            }
        });

        // Theme toggle
        this.themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });

        // Action buttons
        this.clearBtn.addEventListener('click', () => {
            this.confirmAction('Are you sure you want to clear the editor?', () => {
                this.clearEditor();
            });
        });

        this.copySourceBtn.addEventListener('click', () => {
            this.copyToClipboard(this.editor.value, 'Source code copied to clipboard!');
        });

        this.copySvgBtn.addEventListener('click', () => {
            this.copySvgToClipboard();
        });

        // Export buttons
        this.exportPngBtn.addEventListener('click', () => {
            this.exportAsPng();
        });

        this.exportSvgBtn.addEventListener('click', () => {
            this.exportAsSvg();
        });

        // Preview controls
        this.refreshBtn.addEventListener('click', () => {
            this.renderDiagram();
        });

        this.zoomInBtn.addEventListener('click', () => {
            this.zoomIn();
        });

        this.zoomOutBtn.addEventListener('click', () => {
            this.zoomOut();
        });

        // Error bar
        this.closeError.addEventListener('click', () => {
            this.hideError();
        });

        // Modal events
        this.confirmCancel.addEventListener('click', () => {
            this.hideModal();
        });

        // Close modal on background click
        this.confirmModal.addEventListener('click', (e) => {
            if (e.target === this.confirmModal) {
                this.hideModal();
            }
        });
    }

    updateCharCount() {
        const count = this.editor.value.length;
        this.charCount.textContent = `${count} character${count !== 1 ? 's' : ''}`;
    }

    debouncedRender() {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => {
            this.renderDiagram();
        }, 300);
    }

    async renderDiagram() {
        if (this.isRendering) return;

        const code = this.editor.value.trim();
        if (!code) {
            this.showPlaceholder();
            return;
        }

        this.isRendering = true;
        this.updateRenderStatus('Rendering...', 'text-warning');

        try {
            // Clear previous diagram
            this.preview.innerHTML = '';

            // Generate unique ID for this render
            const id = 'mermaid-' + Date.now();

            // Render the diagram
            const { svg } = await mermaid.render(id, code);

            // Display the rendered SVG
            this.preview.innerHTML = svg;

            // Apply current zoom
            this.applyZoom();

            this.updateRenderStatus('Ready', 'text-success');
            this.hideError();

        } catch (error) {
            console.error('Mermaid render error:', error);
            this.showError(`Syntax Error: ${error.message || 'Invalid Mermaid syntax'}`);
            this.updateRenderStatus('Error', 'text-danger');
        } finally {
            this.isRendering = false;
        }
    }

    showPlaceholder() {
        this.preview.innerHTML = `
            <div class="preview-placeholder">
                <p>Your Mermaid diagram will appear here</p>
                <p>Start typing in the editor or select a template to begin</p>
            </div>
        `;
        this.updateRenderStatus('Ready', '');
    }

    updateRenderStatus(status, className = '') {
        this.renderStatus.textContent = status;
        this.renderStatus.className = className;
    }

    showError(message) {
        this.errorMessage.textContent = message;
        this.errorBar.classList.remove('hidden');
        this.errorBar.classList.add('fade-in');
    }

    hideError() {
        this.errorBar.classList.add('hidden');
        this.errorBar.classList.remove('fade-in');
    }

    loadTemplate(templateName) {
        const templates = {
            flowchart: `graph TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D --> B
    C --> E[End]`,

            sequence: `sequenceDiagram
    participant A as Alice
    participant B as Bob
    participant J as John

    A->>B: Hello Bob, how are you?
    B-->>A: Fine, thanks! And you?
    A->>J: Hi John!
    J-->>A: Hello Alice!
    B->>J: What's up?
    J-->>B: All good!`,

            state: `stateDiagram-v2
    [*] --> Idle
    Idle --> Processing : start
    Processing --> Success : complete
    Processing --> Error : fail
    Success --> [*]
    Error --> Idle : retry
    Error --> [*] : abort`,

            class: `classDiagram
    class Animal {
        +String name
        +int age
        +eat()
        +sleep()
    }
    class Dog {
        +String breed
        +bark()
    }
    class Cat {
        +String color
        +meow()
    }
    Animal <|-- Dog
    Animal <|-- Cat`,

            gantt: `gantt
    title Project Timeline
    dateFormat YYYY-MM-DD
    section Planning
    Research        :a1, 2024-01-01, 30d
    Design          :a2, after a1, 20d
    section Development
    Backend         :b1, after a2, 45d
    Frontend        :b2, after a2, 40d
    Testing         :b3, after b1, 15d
    section Deployment
    Deploy          :c1, after b3, 10d`
        };

        if (templates[templateName]) {
            this.editor.value = templates[templateName];
            this.updateCharCount();
            this.renderDiagram();
        }
    }

    clearEditor() {
        this.editor.value = '';
        this.updateCharCount();
        this.showPlaceholder();
        this.saveToStorage();
    }

    async copyToClipboard(text, successMessage) {
        try {
            await navigator.clipboard.writeText(text);
            this.showTemporaryMessage(successMessage);
        } catch (error) {
            console.error('Copy failed:', error);
            this.showError('Failed to copy to clipboard');
        }
    }

    async copySvgToClipboard() {
        const svgElement = this.preview.querySelector('svg');
        if (!svgElement) {
            this.showError('No diagram to copy');
            return;
        }

        const svgString = new XMLSerializer().serializeToString(svgElement);
        await this.copyToClipboard(svgString, 'SVG copied to clipboard!');
    }

    exportAsPng() {
        const svgElement = this.preview.querySelector('svg');
        if (!svgElement) {
            this.showError('No diagram to export');
            return;
        }

        this.updateRenderStatus('Exporting PNG...', 'text-warning');

        // Create a temporary container for html2canvas
        const container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.left = '-9999px';
        container.style.background = 'white';
        container.style.padding = '20px';

        const clonedSvg = svgElement.cloneNode(true);
        container.appendChild(clonedSvg);
        document.body.appendChild(container);

        html2canvas(container, {
            backgroundColor: '#ffffff',
            scale: 2,
            logging: false
        }).then(canvas => {
            document.body.removeChild(container);

            // Download the image
            canvas.toBlob(blob => {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `mermaid-diagram-${Date.now()}.png`;
                a.click();
                URL.revokeObjectURL(url);

                this.updateRenderStatus('Ready', 'text-success');
            });
        }).catch(error => {
            document.body.removeChild(container);
            console.error('PNG export failed:', error);
            this.showError('Failed to export PNG');
            this.updateRenderStatus('Ready', '');
        });
    }

    exportAsSvg() {
        const svgElement = this.preview.querySelector('svg');
        if (!svgElement) {
            this.showError('No diagram to export');
            return;
        }

        const svgString = new XMLSerializer().serializeToString(svgElement);
        const blob = new Blob([svgString], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `mermaid-diagram-${Date.now()}.svg`;
        a.click();
        URL.revokeObjectURL(url);
    }

    zoomIn() {
        this.currentZoom = Math.min(3, this.currentZoom + 0.2);
        this.applyZoom();
    }

    zoomOut() {
        this.currentZoom = Math.max(0.2, this.currentZoom - 0.2);
        this.applyZoom();
    }

    applyZoom() {
        const svgElement = this.preview.querySelector('svg');
        if (svgElement) {
            svgElement.style.transform = `scale(${this.currentZoom})`;
        }
    }

    initializeTheme() {
        const savedTheme = localStorage.getItem('mermaid-editor-theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const theme = savedTheme || (prefersDark ? 'dark' : 'light');

        this.setTheme(theme);

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('mermaid-editor-theme')) {
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        });
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.themeToggle.textContent = theme === 'light' ? '🌙' : '☀️';
        localStorage.setItem('mermaid-editor-theme', theme);

        // Update Mermaid theme
        const mermaidTheme = theme === 'dark' ? 'dark' : 'default';
        mermaid.initialize({
            ...mermaid.globalConfig,
            theme: mermaidTheme
        });

        // Re-render if there's content
        if (this.editor.value.trim()) {
            this.renderDiagram();
        }
    }

    startAutoSave() {
        this.autoSaveTimer = setInterval(() => {
            this.saveToStorage();
        }, 2000);
    }

    saveToStorage() {
        const data = {
            content: this.editor.value,
            timestamp: Date.now(),
            zoom: this.currentZoom
        };

        localStorage.setItem('mermaid-editor-content', JSON.stringify(data));
        this.updateLastSaved();
    }

    loadFromStorage() {
        try {
            const saved = localStorage.getItem('mermaid-editor-content');
            if (saved) {
                const data = JSON.parse(saved);
                this.editor.value = data.content || '';
                this.currentZoom = data.zoom || 1;
                this.updateCharCount();
                this.updateLastSaved();

                if (this.editor.value.trim()) {
                    this.renderDiagram();
                }
            }
        } catch (error) {
            console.error('Failed to load from storage:', error);
        }
    }

    updateLastSaved() {
        try {
            const saved = localStorage.getItem('mermaid-editor-content');
            if (saved) {
                const data = JSON.parse(saved);
                const date = new Date(data.timestamp);
                this.lastSaved.textContent = `Last saved: ${date.toLocaleTimeString()}`;
            }
        } catch (error) {
            this.lastSaved.textContent = 'Never saved';
        }
    }

    confirmAction(message, callback) {
        this.confirmMessage.textContent = message;
        this.confirmModal.classList.remove('hidden');
        this.confirmModal.classList.add('fade-in');

        // Remove any existing event listeners
        this.confirmOk.replaceWith(this.confirmOk.cloneNode(true));
        this.confirmOk = document.getElementById('confirmOk');

        this.confirmOk.addEventListener('click', () => {
            this.hideModal();
            callback();
        });
    }

    hideModal() {
        this.confirmModal.classList.add('hidden');
        this.confirmModal.classList.remove('fade-in');
    }

    showTemporaryMessage(message) {
        const originalStatus = this.renderStatus.textContent;
        const originalClass = this.renderStatus.className;

        this.updateRenderStatus(message, 'text-success');

        setTimeout(() => {
            this.renderStatus.textContent = originalStatus;
            this.renderStatus.className = originalClass;
        }, 2000);
    }

    // Cleanup on page unload
    destroy() {
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
        }
        if (this.autoSaveTimer) {
            clearInterval(this.autoSaveTimer);
        }
        this.saveToStorage();
    }
}

// Initialize the editor when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.mermaidEditor = new MermaidEditor();
});

// Save on page unload
window.addEventListener('beforeunload', () => {
    if (window.mermaidEditor) {
        window.mermaidEditor.destroy();
    }
});

// Handle service worker for offline functionality (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment to enable service worker
        // navigator.serviceWorker.register('/sw.js');
    });
}
