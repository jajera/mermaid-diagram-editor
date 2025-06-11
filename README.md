# 🧜‍♀️ Mermaid Diagram Editor

A fully client-side web tool for writing and previewing Mermaid.js diagrams with live rendering, export options, and offline usability. Perfect for creating flowcharts, sequence diagrams, state diagrams, and more!

## ✨ Features

### 📝 Live Editor & Preview

- **Real-time rendering**: Diagrams update automatically as you type
- **Debounced rendering**: Optimized with ~300ms delay to avoid performance issues
- **Syntax highlighting**: Monospace font for better code readability
- **Character counter**: Track your diagram code length

### 🔄 Interactive Preview

- **Zoom controls**: Zoom in/out on diagrams for better viewing
- **Refresh button**: Manual refresh option (Ctrl+Enter shortcut)
- **Error handling**: Clear error messages for syntax issues
- **Responsive design**: Works on desktop and mobile devices

### 📋 Built-in Templates

Quick start with pre-made examples:

- **Flowchart**: Basic decision flow diagram
- **Sequence Diagram**: Communication between entities
- **State Diagram**: State transitions and lifecycle
- **Class Diagram**: Object-oriented design diagrams
- **Gantt Chart**: Project timeline visualization

### 💾 Export Options

- **PNG Export**: High-quality raster images using html2canvas
- **SVG Export**: Vector graphics for scalable diagrams
- **Copy to Clipboard**: Copy source code or SVG markup

### 🎨 Theming

- **Dark/Light Mode**: Toggle between themes
- **System Preference**: Automatically detects your system theme
- **Persistent Settings**: Remembers your theme preference

### 💾 Auto-Save & Persistence

- **Auto-save**: Automatically saves your work every 2 seconds
- **Session Recovery**: Restores your last session on page reload
- **Local Storage**: All data stays in your browser

### 🚀 Offline Ready

- **No Backend Required**: Runs entirely in your browser
- **GitHub Pages Compatible**: Deploy anywhere static sites are supported
- **Fast Loading**: All dependencies included locally

## 🛠️ Installation & Usage

### Quick Start

1. Clone this repository:

   ```bash
   git clone https://github.com/jajera/mermaid-diagram-editor.git
   cd mermaid-diagram-editor
   ```

2. Open `index.html` in your web browser or serve it using a local server:

   ```bash
   # Using Python
   python -m http.server 8000

   # Using Node.js (http-server)
   npx http-server

   # Using PHP
   php -S localhost:8000
   ```

3. Start creating diagrams!

### GitHub Pages Deployment

1. Fork this repository
2. Go to repository settings → Pages
3. Select source branch (usually `main`)
4. Your editor will be available at `https://jajera.github.io/mermaid-diagram-editor`

## 📖 Usage Guide

### Creating Your First Diagram

1. Select a template from the sidebar dropdown
2. Edit the code in the left panel
3. Watch the preview update in real-time
4. Use the export buttons to save your diagram

### Keyboard Shortcuts

- **Ctrl+Enter**: Refresh preview
- **Tab**: Insert 2 spaces for indentation

### Export Formats

- **PNG**: Perfect for presentations and documents
- **SVG**: Ideal for web use and further editing
- **Source**: Copy the Mermaid code to use elsewhere

## 🏗️ Project Structure

```plaintext
mermaid-diagram-editor/
├── index.html          # Main application HTML
├── style.css           # Styling and themes
├── script.js           # Core JavaScript functionality
├── libs/               # JavaScript libraries
│   ├── mermaid.min.js     # Mermaid.js for diagram rendering
│   ├── html2canvas.min.js # PNG export functionality
│   └── FileSaver.min.js   # File download helper
├── README.md           # This file
└── LICENSE             # MIT License
```

## 🔧 Technologies Used

- **[Mermaid.js](https://mermaid.js.org/)** - Diagram rendering engine
- **[html2canvas](https://html2canvas.hertzen.com/)** - PNG export functionality
- **[FileSaver.js](https://github.com/eligrey/FileSaver.js/)** - File download utilities
- **Vanilla JavaScript** - No frameworks, pure web technologies
- **CSS Custom Properties** - Modern theming system
- **Local Storage API** - Data persistence

## 🎯 Supported Diagram Types

The editor supports all Mermaid.js diagram types:

- **Flowcharts** - Decision flows and processes
- **Sequence Diagrams** - Interactions between actors
- **State Diagrams** - State machines and transitions
- **Class Diagrams** - Object-oriented design
- **Gantt Charts** - Project timelines
- **Git Graphs** - Version control workflows
- **Entity Relationship** - Database design
- **User Journey** - User experience flows
- **And more!** - Full Mermaid.js compatibility

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b amazing-feature`
3. **Make your changes**
4. **Test thoroughly**
5. **Commit your changes**: `git commit -m 'Add amazing feature'`
6. **Push to the branch**: `git push origin amazing-feature`
7. **Open a Pull Request**

### Development Guidelines

- Keep the codebase simple and dependency-free
- Maintain compatibility with modern browsers
- Follow existing code style and conventions
- Test on both desktop and mobile devices

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Mermaid.js Team** - For the amazing diagramming library
- **Contributors** - Thank you to all who help improve this project
- **Community** - For feedback and feature requests

## 🐛 Bug Reports & Feature Requests

Found a bug or have a feature idea? Please open an issue on GitHub:

1. Check if the issue already exists
2. Provide a clear description
3. Include steps to reproduce (for bugs)
4. Add screenshots if helpful

## 🚀 Roadmap

Planned features for future releases:

- [ ] **Collaborative Editing** - Share diagrams with others
- [ ] **Version History** - Track changes over time
- [ ] **Custom Themes** - Create your own color schemes
- [ ] **Diagram Library** - Save and organize diagrams
- [ ] **Advanced Export** - PDF and other formats
- [ ] **Plugin System** - Extend functionality

---

## Made with ❤️ for the developer community

Start creating beautiful diagrams today! 🎨
