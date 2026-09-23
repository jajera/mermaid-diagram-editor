(() => {
    'use strict';

    const STORAGE_KEY = 'mermaid-editor-v2';
    const THEME_KEY = 'mermaid-editor-theme';
    const NODE_W = 148;
    const NODE_H = 56;
    const GRID_SIZE = 18;

    const TEMPLATES = {
        flowchart: `flowchart TD
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
        er: `erDiagram
    CUSTOMER ||--o{ ORDER : places
    ORDER ||--|{ LINE-ITEM : contains
    CUSTOMER {
        string name
        string email
    }
    ORDER {
        int orderNumber
        date created
    }
    LINE-ITEM {
        string product
        int quantity
    }`,
        c4: `C4Context
    title System Context — Online Store
    Person(customer, "Customer", "Buys products")
    System(store, "Online Store", "Provides shopping and checkout")
    System_Ext(payment, "Payment Gateway", "Handles card payments")
    System_Ext(email, "Email System", "Sends receipts")
    Rel(customer, store, "Uses")
    Rel(store, payment, "Processes payments")
    Rel(store, email, "Sends emails")`,
        c4container: `C4Container
    title Container diagram — Online Store
    Person(customer, "Customer", "Buys products")
    System_Boundary(store, "Online Store") {
        Container(web, "Web App", "React", "Provides shopping UI")
        Container(api, "API", "Node.js", "Handles business logic")
        ContainerDb(db, "Database", "PostgreSQL", "Stores orders")
    }
    System_Ext(payment, "Payment Gateway", "Handles card payments")
    Rel(customer, web, "Uses", "HTTPS")
    Rel(web, api, "Calls", "JSON/HTTPS")
    Rel(api, db, "Reads/Writes")
    Rel(api, payment, "Processes payments")`,
        architecture: `architecture-beta
    group api(cloud)[API]
    service web(server)[Web App] in api
    service db(database)[Database] in api
    service cache(server)[Cache] in api
    web:R --> L:db
    web:R --> L:cache`,
        block: `block-beta
columns 3
  frontend["Frontend"]:2
  space
  api["API"]
  db[("Database")]:2
  frontend --> api
  api --> db`,
        mindmap: `mindmap
  root((Mermaid Editor))
    Sketch
      Nodes
      Edges
      Templates
    Export
      PNG
      SVG
      Source
    Themes
      Dark
      Light
      Auto`,
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
    Deploy          :c1, after b3, 10d`,
        journey: `journey
    title Customer checkout
    section Browse
      Visit site: 5: Customer
      Search product: 4: Customer
    section Buy
      Add to cart: 3: Customer
      Pay: 2: Customer, Staff
    section After
      Receive email: 5: Customer
      Leave review: 3: Customer`,
        git: `gitGraph
    commit id: "init"
    branch develop
    checkout develop
    commit id: "feature work"
    checkout main
    merge develop id: "release"
    commit id: "hotfix"`,
        timeline: `timeline
    title Product milestones
    section 2024
      Q1 : Kickoff
           : Alpha
      Q2 : Beta
    section 2025
      Q1 : Launch
      Q2 : Growth`,
        kanban: `kanban
    Todo
      [Design UI]
      [Write docs]
    Doing
      [Implement API]
    Done
      [Setup repo]`,
        requirement: `requirementDiagram
    requirement auth_req {
        id: 1
        text: Users must authenticate
        risk: high
        verifymethod: test
    }
    element login_page {
        type: simulation
    }
    login_page - satisfies -> auth_req`,
        ishikawa: `ishikawa
  cause Low Conversion
    People: Missing training
    Process: Slow checkout
    Technology: Flaky payments
    Materials: Unclear pricing`,
        pie: `pie showData
    title Traffic sources
    "Direct" : 35
    "Search" : 40
    "Referral" : 15
    "Social" : 10`,
        quadrant: `quadrantChart
    title Reach vs engagement
    x-axis Low reach --> High reach
    y-axis Low engagement --> High engagement
    quadrant-1 Expand
    quadrant-2 Promote
    quadrant-3 Monitor
    quadrant-4 Improve
    Campaign A: [0.3, 0.6]
    Campaign B: [0.7, 0.8]
    Campaign C: [0.45, 0.25]
    Campaign D: [0.8, 0.35]`,
        xy: `xychart
    title "Monthly active users"
    x-axis [jan, feb, mar, apr, may, jun]
    y-axis "Users" 0 --> 1200
    bar [320, 480, 610, 720, 880, 1050]
    line [300, 450, 590, 700, 860, 1020]`,
        sankey: `sankey
Visit,Signup,40
Visit,Bounce,60
Signup,Trial,25
Signup,Paid,15
Trial,Paid,8
Trial,Churn,17`,
        radar: `radar-beta
    title Team skills
    axis coding["Coding"], design["Design"], ops["Ops"], talk["Communication"]
    curve me["Me"]{4, 3, 2, 4}
    curve team["Team"]{3, 4, 3, 3}
    max 5
    min 0`,
        treemap: `treemap-beta
"Budget"
  "Engineering": 45
  "Marketing": 25
  "Sales": 20
  "Ops": 10`,
        packet: `packet-beta
0-15: "Source Port"
16-31: "Destination Port"
32-63: "Sequence Number"
64-95: "Acknowledgment"`,
        wardley: `wardley-beta
title Online Store
evolution genesis -> custom -> product -> commodity
component Customer [0.95, 0.70] label [-20, 20]
component Website [0.70, 0.60] label [-20, 20]
component Checkout [0.55, 0.45] label [-20, 20]
component Database [0.35, 0.30] label [-20, 20]
Customer -> Website
Website -> Checkout
Checkout -> Database`,
        venn: `venn-beta
  title Team overlap
  set Frontend
  set Backend
  set Design
  union Frontend,Backend["APIs"]
  union Frontend,Design["UI"]
  union Frontend,Backend,Design["Product"]`,
        treeView: `treeView-beta
  my-project/
    src/
      index.js
      utils.js
    package.json
    README.md`,
        eventmodeling: `eventmodeling
tf 01 ui CartUI
tf 02 cmd AddItem
tf 03 evt ItemAdded
tf 04 rmo CartItems
tf 05 ui CartUI`,
        cynefin: `cynefin-beta
  title Incident Response
  complex
    "Investigate root cause"
    "Run chaos experiment"
  complicated
    "Expert review needed"
  clear
    "Apply known fix"
  chaotic
    "Page on-call"
  confusion
    "Unknown failure"
  complex --> complicated : "Pattern identified"
  clear --> chaotic : "Complacency"`,
        usecase: `usecase-beta
direction LR
actor Customer
actor Support
systemBoundary Storefront
  Browse("Browse catalogue")
  Checkout("Checkout")
end
systemBoundary Fulfilment
  Track("Track delivery")
end
Customer --> Browse
Customer --> Checkout
Customer --> Track
Support --> Track
Checkout ..> : include Browse`,
        swimlane: `swimlane-beta LR
  subgraph Customer
    start([Start])
    order[Place order]
  end
  subgraph Warehouse
    pack[Pack items]
  end
  subgraph Delivery
    ship[Ship]
    done([Done])
  end
  start --> order --> pack --> ship --> done`,
        agentflow: `agentflow-beta TB
  flow reviewer["Review Agent"]
    changes["Gather changes"]@{ shape: input }
    analyse["Analyse diff"]@{ shape: task }
    lint["run_linter"]@{ shape: tool }
    ok["Clean?"]@{ shape: decision }
    changes --> analyse --> lint --> ok
  end`,
        railroadEbnf: `railroad-ebnf-beta
title "Arithmetic Expression"
expression = term ( ( "+" | "-" ) term )* ;
term = factor ( ( "*" | "/" ) factor )* ;
factor = number | "(" expression ")" ;
number = digit+ ;
digit = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" ;`,
        railroadAbnf: `railroad-abnf-beta
title "Email Address"
address = local-part "@" domain ;
local-part = 1*( ALPHA / DIGIT / "." / "-" ) ;
domain = label *( "." label ) ;
label = 1*( ALPHA / DIGIT / "-" ) ;`,
        railroadPeg: `railroad-peg-beta
title Calculator
Expression <- Term (("+" / "-") Term)* ;
Term <- Factor (("*" / "/") Factor)* ;
Factor <- Number / "(" Expression ")" ;
Number <- Digit+ ;
Digit <- "0" / "1" / "2" / "3" / "4" / "5" / "6" / "7" / "8" / "9" ;`,
        railroadIr: `railroad-beta
title Choice
rule = choice(terminal("a"), terminal("b")) ;`
    };

    const SHAPE_DEFAULTS = {
        rect: 'Process',
        diamond: 'Decision?',
        round: 'Rounded',
        stadium: 'Stadium',
        circle: 'Go',
        hexagon: 'Prepare'
    };

    function uid(prefix = 'n') {
        return `${prefix}${Math.random().toString(36).slice(2, 8)}`;
    }

    function clamp(n, min, max) {
        return Math.min(max, Math.max(min, n));
    }

    function escapeMermaidLabel(text) {
        return String(text ?? '')
            .replace(/[\r\n]+/g, ' ')
            .replace(/"/g, "'")
            .trim();
    }

    function isFlowchartSource(code) {
        const head = String(code || '').trim().split(/\n/, 1)[0] || '';
        return /^(flowchart|graph)\b/i.test(head);
    }

    function escapeRegExp(s) {
        return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    /** @typedef {{id:string,x:number,y:number,label:string,shape:string}} GraphNode */
    /** @typedef {{id:string,source:string,target:string,label:string}} GraphEdge */

    class GraphModel {
        constructor() {
            /** @type {GraphNode[]} */
            this.nodes = [];
            /** @type {GraphEdge[]} */
            this.edges = [];
            this.direction = 'TD';
            this.selectedId = null;
            this.selectedKind = null; // node | edge
            this.history = [];
            this.future = [];
        }

        snapshot() {
            return JSON.stringify({
                nodes: this.nodes,
                edges: this.edges,
                direction: this.direction
            });
        }

        restore(raw) {
            const data = JSON.parse(raw);
            this.nodes = data.nodes || [];
            this.edges = data.edges || [];
            this.direction = data.direction || 'TD';
        }

        pushHistory() {
            this.history.push(this.snapshot());
            if (this.history.length > 80) this.history.shift();
            this.future = [];
        }

        undo() {
            if (!this.history.length) return false;
            this.future.push(this.snapshot());
            this.restore(this.history.pop());
            this.clearSelection();
            return true;
        }

        redo() {
            if (!this.future.length) return false;
            this.history.push(this.snapshot());
            this.restore(this.future.pop());
            this.clearSelection();
            return true;
        }

        clearSelection() {
            this.selectedId = null;
            this.selectedKind = null;
        }

        select(kind, id) {
            this.selectedKind = kind;
            this.selectedId = id;
        }

        getSelectedNode() {
            return this.selectedKind === 'node'
                ? this.nodes.find((n) => n.id === this.selectedId)
                : null;
        }

        getSelectedEdge() {
            return this.selectedKind === 'edge'
                ? this.edges.find((e) => e.id === this.selectedId)
                : null;
        }

        addNode(shape, x, y, label) {
            this.pushHistory();
            const node = {
                id: uid('n'),
                x,
                y,
                shape: shape || 'rect',
                label: label || SHAPE_DEFAULTS[shape] || 'Node'
            };
            this.nodes.push(node);
            this.select('node', node.id);
            return node;
        }

        addEdge(source, target, label = '', sourcePort = '', targetPort = '') {
            if (!source || !target || source === target) return null;
            const exists = this.edges.some(
                (e) => e.source === source && e.target === target && e.label === label
            );
            if (exists) return null;
            this.pushHistory();
            const edge = {
                id: uid('e'),
                source,
                target,
                label,
                sourcePort: sourcePort || '',
                targetPort: targetPort || ''
            };
            this.edges.push(edge);
            this.select('edge', edge.id);
            return edge;
        }

        reverseEdge(id) {
            const edge = this.edges.find((e) => e.id === id);
            if (!edge) return false;
            this.pushHistory();
            const tmp = edge.source;
            edge.source = edge.target;
            edge.target = tmp;
            const tmpPort = edge.sourcePort || '';
            edge.sourcePort = edge.targetPort || '';
            edge.targetPort = tmpPort;
            this.select('edge', edge.id);
            return true;
        }

        reconnectEdge(id, end, nodeId, port = '') {
            const edge = this.edges.find((e) => e.id === id);
            if (!edge || !nodeId) return false;
            const nextSource = end === 'source' ? nodeId : edge.source;
            const nextTarget = end === 'target' ? nodeId : edge.target;
            if (nextSource === nextTarget) return false;

            const nextSourcePort = end === 'source' ? port || '' : edge.sourcePort || '';
            const nextTargetPort = end === 'target' ? port || '' : edge.targetPort || '';

            const sameNodes =
                nextSource === edge.source && nextTarget === edge.target;
            const samePorts =
                nextSourcePort === (edge.sourcePort || '') &&
                nextTargetPort === (edge.targetPort || '');
            if (sameNodes && samePorts) return false;

            if (!sameNodes) {
                const dup = this.edges.some(
                    (e) =>
                        e.id !== id &&
                        e.source === nextSource &&
                        e.target === nextTarget &&
                        e.label === edge.label
                );
                if (dup) return false;
            }

            this.pushHistory();
            edge.source = nextSource;
            edge.target = nextTarget;
            edge.sourcePort = nextSourcePort;
            edge.targetPort = nextTargetPort;
            this.select('edge', edge.id);
            return true;
        }

        deleteSelection() {
            if (!this.selectedId) return false;
            this.pushHistory();
            if (this.selectedKind === 'node') {
                this.nodes = this.nodes.filter((n) => n.id !== this.selectedId);
                this.edges = this.edges.filter(
                    (e) => e.source !== this.selectedId && e.target !== this.selectedId
                );
            } else if (this.selectedKind === 'edge') {
                this.edges = this.edges.filter((e) => e.id !== this.selectedId);
            }
            this.clearSelection();
            return true;
        }

        clear() {
            this.pushHistory();
            this.nodes = [];
            this.edges = [];
            this.clearSelection();
        }

        replaceAll(nodes, edges, direction = 'TD') {
            this.pushHistory();
            this.nodes = nodes;
            this.edges = edges;
            this.direction = direction;
            this.clearSelection();
        }

        moveNode(id, x, y, recordHistory) {
            const node = this.nodes.find((n) => n.id === id);
            if (!node) return;
            if (recordHistory) this.pushHistory();
            node.x = x;
            node.y = y;
        }
    }

    const MermaidCodec = {
        wrapLabel(shape, label) {
            const t = escapeMermaidLabel(label) || ' ';
            switch (shape) {
                case 'diamond':
                    return `{${t}}`;
                case 'round':
                    return `(${t})`;
                case 'stadium':
                    return `([${t}])`;
                case 'circle':
                    return `((${t}))`;
                case 'hexagon':
                    return `{{${t}}}`;
                case 'rect':
                default:
                    return `[${t}]`;
            }
        },

        detectShape(token) {
            if (/^\(\[.*\]\)$/.test(token)) return { shape: 'stadium', label: token.slice(2, -2) };
            if (/^\(\(.*\)\)$/.test(token)) return { shape: 'circle', label: token.slice(2, -2) };
            if (/^\{\{.*\}\}$/.test(token)) return { shape: 'hexagon', label: token.slice(2, -2) };
            if (/^\{.*\}$/.test(token)) return { shape: 'diamond', label: token.slice(1, -1) };
            if (/^\(.*\)$/.test(token)) return { shape: 'round', label: token.slice(1, -1) };
            if (/^\[.*\]$/.test(token)) return { shape: 'rect', label: token.slice(1, -1) };
            if (/^".*"$/.test(token)) return { shape: 'rect', label: token.slice(1, -1) };
            return { shape: 'rect', label: token };
        },

        toMermaid(model) {
            const lines = [`flowchart ${model.direction || 'TD'}`];
            const used = new Set();
            for (const n of model.nodes) {
                lines.push(`    ${n.id}${this.wrapLabel(n.shape, n.label)}`);
                used.add(n.id);
            }
            for (const e of model.edges) {
                if (!used.has(e.source) || !used.has(e.target)) continue;
                const mid = e.label ? ` -->|${escapeMermaidLabel(e.label)}| ` : ' --> ';
                lines.push(`    ${e.source}${mid}${e.target}`);
            }
            return `${lines.join('\n')}\n`;
        },

        fromMermaid(code) {
            const text = String(code || '').trim();
            if (!isFlowchartSource(text)) {
                throw new Error('Only flowchart/graph syntax can be applied to the visual canvas');
            }

            const lines = text
                .split(/\n/)
                .map((l) => l.replace(/%%.*$/, '').trim())
                .filter(Boolean);

            const header = lines.shift() || 'flowchart TD';
            const dirMatch = header.match(/^(?:flowchart|graph)\s+([TBRLtbRL]{2})/i);
            const direction = (dirMatch?.[1] || 'TD').toUpperCase();

            /** @type {Map<string, GraphNode>} */
            const nodes = new Map();
            /** @type {GraphEdge[]} */
            const edges = [];
            let col = 0;
            let row = 0;

            const ensureNode = (id, shape, label) => {
                if (!nodes.has(id)) {
                    nodes.set(id, {
                        id,
                        shape: shape || 'rect',
                        label: label || id,
                        x: 80 + (col % 4) * 200,
                        y: 80 + Math.floor(col / 4) * 120 + row * 8
                    });
                    col += 1;
                } else {
                    const n = nodes.get(id);
                    if (shape) n.shape = shape;
                    if (label) n.label = label;
                }
                return nodes.get(id);
            };

            const nodeToken = String.raw`([A-Za-z][\w-]*)\s*(?:\s*(\(\[.*?\]\)|\(\(.*?\)\)|\{\{.*?\}\}|\{.*?\}|\(.*?\)|\[.*?\]|".*?"))?`;
            const edgeRe = new RegExp(
                `^${nodeToken}\\s*(-->|---|-.->|==>|==)\\s*(?:\\|([^|]+)\\|\\s*)?${nodeToken}$`
            );
            const declRe = new RegExp(`^${nodeToken}$`);

            for (const line of lines) {
                let m = line.match(edgeRe);
                if (m) {
                    const [, sId, sShapeTok, , label, tId, tShapeTok] = m;
                    const s = this.detectShape(sShapeTok || sId);
                    const t = this.detectShape(tShapeTok || tId);
                    ensureNode(sId, sShapeTok ? s.shape : undefined, sShapeTok ? s.label : undefined);
                    ensureNode(tId, tShapeTok ? t.shape : undefined, tShapeTok ? t.label : undefined);
                    if (!nodes.get(sId).label || nodes.get(sId).label === sId) {
                        if (sShapeTok) nodes.get(sId).label = s.label;
                    }
                    if (!nodes.get(tId).label || nodes.get(tId).label === tId) {
                        if (tShapeTok) nodes.get(tId).label = t.label;
                    }
                    edges.push({
                        id: uid('e'),
                        source: sId,
                        target: tId,
                        label: (label || '').trim()
                    });
                    continue;
                }

                m = line.match(declRe);
                if (m) {
                    const [, id, shapeTok] = m;
                    const parsed = this.detectShape(shapeTok || id);
                    ensureNode(id, shapeTok ? parsed.shape : 'rect', shapeTok ? parsed.label : id);
                }
            }

            // Simple layered layout for TD/LR
            this.layout(nodes, edges, direction);
            return {
                nodes: [...nodes.values()],
                edges,
                direction
            };
        },

        layout(nodeMap, edges, direction) {
            const ids = [...nodeMap.keys()];
            if (!ids.length) return;
            const indeg = Object.fromEntries(ids.map((id) => [id, 0]));
            const outs = Object.fromEntries(ids.map((id) => [id, []]));
            for (const e of edges) {
                if (!nodeMap.has(e.source) || !nodeMap.has(e.target)) continue;
                outs[e.source].push(e.target);
                indeg[e.target] += 1;
            }
            const queue = ids.filter((id) => indeg[id] === 0);
            const depth = Object.fromEntries(ids.map((id) => [id, 0]));
            const seen = new Set(queue);
            while (queue.length) {
                const id = queue.shift();
                for (const t of outs[id]) {
                    depth[t] = Math.max(depth[t], depth[id] + 1);
                    indeg[t] -= 1;
                    if (indeg[t] <= 0 && !seen.has(t)) {
                        seen.add(t);
                        queue.push(t);
                    }
                }
            }
            const layers = {};
            for (const id of ids) {
                const d = depth[id] || 0;
                (layers[d] ||= []).push(id);
            }
            const vertical = direction === 'TD' || direction === 'BT';
            Object.keys(layers)
                .map(Number)
                .sort((a, b) => a - b)
                .forEach((d) => {
                    layers[d].forEach((id, i) => {
                        const n = nodeMap.get(id);
                        if (vertical) {
                            n.x = 90 + i * 200;
                            n.y = 70 + d * 130;
                        } else {
                            n.x = 70 + d * 210;
                            n.y = 90 + i * 120;
                        }
                    });
                });
        }
    };

    class MermaidEditor {
        constructor() {
            this.model = new GraphModel();
            this.themePref = 'auto';
            this.snapToGrid = false;
            this.visualPreviewZoom = 1;
            this.resultVisible = true;
            this.splitRatio = 0.45;
            /** @type {string|null} non-flowchart Mermaid source (sequence, state, …) */
            this.rawSource = null;
            this.view = { x: 0, y: 0, scale: 1 };
            this._visualRenderToken = 0;
            this.drag = null;
            this.link = null;
            this.reconnect = null;
            this.splitDrag = null;
            this.spacePan = false;
            this.suppressSourceApply = false;
            this.saveTimer = null;

            this.el = {
                themeToggle: document.getElementById('themeToggle'),
                templateSelect: document.getElementById('templateSelect'),
                palettePanel: document.getElementById('palettePanel'),
                inspectorEmpty: document.getElementById('inspectorEmpty'),
                inspectorFields: document.getElementById('inspectorFields'),
                inspectLabel: document.getElementById('inspectLabel'),
                inspectShape: document.getElementById('inspectShape'),
                shapeField: document.getElementById('shapeField'),
                edgeActions: document.getElementById('edgeActions'),
                edgeHint: document.getElementById('edgeHint'),
                reverseEdgeBtn: document.getElementById('reverseEdgeBtn'),
                deleteSelection: document.getElementById('deleteSelection'),
                undoBtn: document.getElementById('undoBtn'),
                redoBtn: document.getElementById('redoBtn'),
                clearBtn: document.getElementById('clearBtn'),
                copySourceBtn: document.getElementById('copySourceBtn'),
                copySvgBtn: document.getElementById('copySvgBtn'),
                exportPngBtn: document.getElementById('exportPngBtn'),
                exportSvgBtn: document.getElementById('exportSvgBtn'),
                visualView: document.getElementById('visualView'),
                canvasWrap: document.getElementById('canvasWrap'),
                structurePane: document.getElementById('structurePane'),
                sketchPaneTitle: document.getElementById('sketchPaneTitle'),
                sketchPanePill: document.getElementById('sketchPanePill'),
                resultPaneTitle: document.getElementById('resultPaneTitle'),
                resultPanePill: document.getElementById('resultPanePill'),
                layoutDisclaimer: document.getElementById('layoutDisclaimer'),
                rawSketchPreview: document.getElementById('rawSketchPreview'),
                inlineEdit: document.getElementById('inlineEdit'),
                inlineEditInput: document.getElementById('inlineEditInput'),
                canvas: document.getElementById('canvas'),
                visualPreview: document.getElementById('visualPreview'),
                mermaidPane: document.getElementById('mermaidPane'),
                splitHandle: document.getElementById('splitHandle'),
                world: document.getElementById('world'),
                nodesG: document.getElementById('nodes'),
                edgesG: document.getElementById('edges'),
                linkPreview: document.getElementById('linkPreview'),
                sourceDrawer: document.getElementById('sourceDrawer'),
                visualSource: document.getElementById('visualSource'),
                syncNote: document.getElementById('syncNote'),
                applySourceBtn: document.getElementById('applySourceBtn'),
                liveEditHint: document.getElementById('liveEditHint'),
                toggleResultBtn: document.getElementById('toggleResultBtn'),
                toggleSourceBtn: document.getElementById('toggleSourceBtn'),
                sketchOnlyControls: document.querySelectorAll('.sketch-only'),
                fitBtn: document.getElementById('fitBtn'),
                zoomInBtn: document.getElementById('zoomInBtn'),
                zoomOutBtn: document.getElementById('zoomOutBtn'),
                snapToggle: document.getElementById('snapToggle'),
                directionSelect: document.getElementById('directionSelect'),
                lastSaved: document.getElementById('lastSaved'),
                renderStatus: document.getElementById('renderStatus'),
                errorBar: document.getElementById('errorBar'),
                errorMessage: document.getElementById('errorMessage'),
                closeError: document.getElementById('closeError'),
                confirmModal: document.getElementById('confirmModal'),
                confirmMessage: document.getElementById('confirmMessage'),
                confirmOk: document.getElementById('confirmOk'),
                confirmCancel: document.getElementById('confirmCancel'),
                canvasHint: document.getElementById('canvasHint')
            };

            this.initMermaid();
            this.bind();
            this.initTheme();
            this.loadState();
            this.setSnapToGrid(this.snapToGrid);
            this.setResultVisible(this.resultVisible);
            this.applySplitRatio();
            this.updateSketchMode();
            this.redraw();
            if (this.rawSource) {
                this.setSourceText(this.rawSource);
                this.setSourceVisible(true);
            } else {
                this.syncSourceFromModel();
            }
            this.scheduleVisualMermaidRender();
            this.startAutoSave();
        }

        initMermaid() {
            mermaid.initialize({
                startOnLoad: false,
                theme: 'default',
                securityLevel: 'loose',
                flowchart: { useMaxWidth: true, htmlLabels: true },
                sequence: { useMaxWidth: true, wrap: true },
                gantt: { useMaxWidth: true }
            });
        }

        bind() {
            this.el.themeToggle.addEventListener('click', () => this.toggleTheme());
            this.el.closeError.addEventListener('click', () => this.hideError());

            document.getElementById('nodePalette').addEventListener('click', (e) => {
                const btn = e.target.closest('[data-shape]');
                if (!btn) return;
                this.dropNode(btn.dataset.shape);
            });

            this.el.templateSelect.addEventListener('change', (e) => {
                const value = e.target.value;
                if (!value) return;
                this.loadTemplate(value);
                e.target.value = '';
            });

            this.el.inspectLabel.addEventListener('focus', () => {
                this._inspectBaseline = this.el.inspectLabel.value;
                this._inspectSnapshot = this.model.snapshot();
                this._inspectHistoryPushed = false;
            });
            this.el.inspectLabel.addEventListener('input', () => {
                const node = this.model.getSelectedNode();
                const edge = this.model.getSelectedEdge();
                if (!node && !edge) return;
                if (!this._inspectHistoryPushed) {
                    this.model.history.push(this._inspectSnapshot);
                    if (this.model.history.length > 80) this.model.history.shift();
                    this.model.future = [];
                    this._inspectHistoryPushed = true;
                }
                if (node) node.label = this.el.inspectLabel.value;
                else edge.label = this.el.inspectLabel.value;
                this.redraw();
                this.syncSourceFromModel();
            });
            this.el.inspectLabel.addEventListener('change', () => {
                if (this.el.inspectLabel.value !== this._inspectBaseline) {
                    this.scheduleSave();
                }
            });

            this.el.inspectShape.addEventListener('change', () => {
                const node = this.model.getSelectedNode();
                if (!node) return;
                this.model.pushHistory();
                node.shape = this.el.inspectShape.value;
                this.afterGraphChange();
            });

            this.el.deleteSelection.addEventListener('click', () => {
                if (this.model.deleteSelection()) this.afterGraphChange();
            });
            this.el.reverseEdgeBtn?.addEventListener('click', () => {
                const edge = this.model.getSelectedEdge();
                if (!edge) return;
                if (this.model.reverseEdge(edge.id)) this.afterGraphChange();
            });

            this.el.undoBtn.addEventListener('click', () => {
                if (this.model.undo()) this.afterGraphChange();
            });
            this.el.redoBtn.addEventListener('click', () => {
                if (this.model.redo()) this.afterGraphChange();
            });

            this.el.clearBtn.addEventListener('click', () => {
                this.confirmAction('Clear the current diagram?', () => {
                    this.rawSource = null;
                    this.model.clear();
                    this.afterGraphChange();
                });
            });

            this.el.copySourceBtn.addEventListener('click', () => {
                this.copyText(this.getActiveSource(), 'Mermaid source copied');
            });
            this.el.copySvgBtn.addEventListener('click', () => this.copySvg());
            this.el.exportPngBtn.addEventListener('click', () => this.exportPng());
            this.el.exportSvgBtn.addEventListener('click', () => this.exportSvg());

            this.el.toggleResultBtn.addEventListener('click', () => {
                this.setResultVisible(!this.resultVisible);
                this.scheduleSave();
            });
            this.el.toggleSourceBtn.addEventListener('click', () => {
                this.setSourceVisible(this.el.sourceDrawer.classList.contains('hidden'));
            });
            this.el.applySourceBtn.addEventListener('click', () => this.applyVisualSource());
            this.el.visualSource.addEventListener('input', () => this.onSourceInput());
            this.el.visualSource.addEventListener('keydown', (e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                    e.preventDefault();
                    this.applyVisualSource();
                }
                if (e.key === 'Tab') {
                    e.preventDefault();
                    const el = this.el.visualSource;
                    const start = el.selectionStart;
                    const end = el.selectionEnd;
                    const v = el.value;
                    el.value = `${v.slice(0, start)}  ${v.slice(end)}`;
                    el.selectionStart = el.selectionEnd = start + 2;
                    this.onSourceInput();
                }
            });
            this.el.fitBtn.addEventListener('click', () => this.fitView());
            this.el.zoomInBtn.addEventListener('click', () => {
                this.visualPreviewZoom = Math.min(3, this.visualPreviewZoom + 0.2);
                this.applyVisualPreviewZoom();
                this.scheduleSave();
            });
            this.el.zoomOutBtn.addEventListener('click', () => {
                this.visualPreviewZoom = Math.max(0.2, this.visualPreviewZoom - 0.2);
                this.applyVisualPreviewZoom();
                this.scheduleSave();
            });
            this.el.snapToggle.addEventListener('click', () => {
                this.setSnapToGrid(!this.snapToGrid);
                this.scheduleSave();
            });
            this.el.directionSelect.addEventListener('change', () => {
                const next = this.el.directionSelect.value;
                if (!['TD', 'LR', 'BT', 'RL'].includes(next)) return;
                if (next === this.model.direction) return;
                this.rawSource = null;
                this.model.pushHistory();
                this.model.direction = next;
                this.afterGraphChange();
            });

            this.el.confirmCancel.addEventListener('click', () => this.hideModal());
            this.el.confirmModal.addEventListener('click', (e) => {
                if (e.target === this.el.confirmModal) this.hideModal();
            });

            this.bindCanvas();
            this.bindSplit();
            this.bindDirectTextEdit();

            window.addEventListener('keydown', (e) => this.onKeyDown(e));
            window.addEventListener('keyup', (e) => {
                if (e.code === 'Space') this.spacePan = false;
            });
        }

        bindCanvas() {
            const svg = this.el.canvas;

            svg.addEventListener('pointerdown', (e) => this.onPointerDown(e));
            svg.addEventListener('pointermove', (e) => this.onPointerMove(e));
            svg.addEventListener('pointerup', (e) => this.onPointerUp(e));
            svg.addEventListener('pointercancel', (e) => this.onPointerUp(e));
            svg.addEventListener('pointerleave', (e) => {
                // Don't cancel link/reconnect mid-drag when the pointer
                // briefly leaves the SVG (e.g. over the result pane).
                if (this.link || this.reconnect) return;
                this.onPointerUp(e);
            });
            svg.addEventListener('dblclick', (e) => this.onDblClick(e));
            svg.addEventListener('wheel', (e) => {
                e.preventDefault();
                const factor = e.deltaY < 0 ? 1.1 : 1 / 1.1;
                const prev = this.view.scale;
                const next = clamp(prev * factor, 0.25, 2.8);
                if (next === prev) return;
                const rect = svg.getBoundingClientRect();
                const cx = e.clientX - rect.left;
                const cy = e.clientY - rect.top;
                this.view.scale = next;
                this.view.x = cx - (cx - this.view.x) * (next / prev);
                this.view.y = cy - (cy - this.view.y) * (next / prev);
                this.applyView();
            }, { passive: false });
        }

        bindSplit() {
            const handle = this.el.splitHandle;
            if (!handle) return;

            const onMove = (e) => {
                if (!this.splitDrag) return;
                this.updateSplitFromPointer(e.clientX, e.clientY);
            };
            const onUp = () => {
                if (!this.splitDrag) return;
                this.splitDrag = null;
                handle.classList.remove('dragging');
                window.removeEventListener('pointermove', onMove);
                window.removeEventListener('pointerup', onUp);
                this.scheduleSave();
            };

            handle.addEventListener('pointerdown', (e) => {
                if (e.button !== 0) return;
                e.preventDefault();
                this.splitDrag = true;
                handle.classList.add('dragging');
                handle.setPointerCapture?.(e.pointerId);
                window.addEventListener('pointermove', onMove);
                window.addEventListener('pointerup', onUp);
            });

            handle.addEventListener('keydown', (e) => {
                const step = e.shiftKey ? 0.08 : 0.03;
                let next = this.splitRatio;
                if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next -= step;
                else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next += step;
                else return;
                e.preventDefault();
                this.splitRatio = clamp(next, 0.18, 0.82);
                this.applySplitRatio();
                this.scheduleSave();
            });
        }

        isStackedSplit() {
            return window.matchMedia('(max-width: 960px)').matches;
        }

        updateSplitFromPointer(clientX, clientY) {
            const rect = this.el.canvasWrap.getBoundingClientRect();
            if (rect.width < 1 || rect.height < 1) return;
            const ratio = this.isStackedSplit()
                ? (clientY - rect.top) / rect.height
                : (clientX - rect.left) / rect.width;
            this.splitRatio = clamp(ratio, 0.18, 0.82);
            this.applySplitRatio();
        }

        applySplitRatio() {
            const pct = `${(this.splitRatio * 100).toFixed(2)}%`;
            this.el.canvasWrap.style.setProperty('--split-sketch', pct);
            if (this.el.splitHandle) {
                this.el.splitHandle.setAttribute(
                    'aria-orientation',
                    this.isStackedSplit() ? 'horizontal' : 'vertical'
                );
            }
        }

        setResultVisible(visible) {
            this.resultVisible = !!visible;
            this.el.canvasWrap.classList.toggle('result-hidden', !this.resultVisible);
            this.el.toggleResultBtn.classList.toggle('active', this.resultVisible);
            this.el.toggleResultBtn.setAttribute('aria-pressed', this.resultVisible ? 'true' : 'false');
            if (this.resultVisible) this.scheduleVisualMermaidRender();
        }

        setSourceVisible(visible) {
            const show = !!visible;
            this.el.sourceDrawer.classList.toggle('hidden', !show);
            this.el.toggleSourceBtn.classList.toggle('active', show);
            this.el.toggleSourceBtn.setAttribute('aria-pressed', show ? 'true' : 'false');
            if (show) {
                this.el.sourceDrawer.classList.toggle('code-edit', !!this.rawSource);
                this.updateSourceChrome();
                queueMicrotask(() => this.el.visualSource?.focus());
            }
        }

        setSourceText(text) {
            this.suppressSourceApply = true;
            this.el.visualSource.value = text;
            this.suppressSourceApply = false;
            this.updateSyncNote();
            this.updateSourceChrome();
        }

        updateSyncNote() {
            if (!this.el.syncNote) return;
            this.el.syncNote.textContent = this.rawSource
                ? 'code edit · live preview'
                : 'from sketch · Apply to load';
            this.updateSketchMode();
        }

        updateSourceChrome() {
            const live = !!this.rawSource;
            this.el.sourceDrawer?.classList.toggle('code-edit', live);
            this.el.liveEditHint?.classList.toggle('hidden', !live);
            if (this.el.applySourceBtn) {
                this.el.applySourceBtn.classList.toggle('hidden', live);
                this.el.applySourceBtn.textContent = 'Apply to sketch';
            }
        }

        updateSketchMode() {
            const raw = !!this.rawSource;
            this.el.canvasWrap?.classList.toggle('sketch-hidden', raw);
            this.el.structurePane?.classList.toggle('raw-mode', raw);
            this.el.layoutDisclaimer?.classList.toggle('hidden', raw);
            this.el.sketchOnlyControls?.forEach((el) => el.classList.toggle('hidden', raw));
            this.el.rawSketchPreview?.classList.add('hidden');
            this.el.visualPreview?.classList.toggle('direct-edit', raw);

            if (this.el.sketchPaneTitle) {
                this.el.sketchPaneTitle.textContent = 'Sketch';
            }
            if (this.el.sketchPanePill) {
                this.el.sketchPanePill.textContent = 'positions ignored';
                this.el.sketchPanePill.title = 'Mermaid ignores free-form sketch positions';
            }
            if (this.el.resultPaneTitle) {
                this.el.resultPaneTitle.textContent = raw ? 'Preview' : 'Result';
            }
            if (this.el.resultPanePill) {
                this.el.resultPanePill.textContent = raw
                    ? 'click text to edit · export'
                    : 'Mermaid layout · export';
                this.el.resultPanePill.classList.toggle('pill-action', raw);
                this.el.resultPanePill.disabled = !raw;
                this.el.resultPanePill.title = raw
                    ? 'Click diagram text to edit · or open Source'
                    : '';
            }
            if (this.el.rawSketchPreview) {
                this.el.rawSketchPreview.innerHTML = '';
            }
            if (!raw) this.hideInlineEdit();
            if (raw && !this.resultVisible) this.setResultVisible(true);
            this.updateSourceChrome();
            if (this.el.canvasHint) {
                this.el.canvasHint.textContent = raw
                    ? 'Click any label to edit · open Source for full code'
                    : this.model.nodes.length
                        ? `${this.model.nodes.length} nodes · ${this.model.edges.length} edges · flow ${this.model.direction || 'TD'}`
                        : 'Sketch freely · Mermaid chooses final layout';
            }
        }

        bindDirectTextEdit() {
            const onClick = (e) => {
                if (!this.rawSource) return;
                const textEl = this.findEditableTextEl(e.target);
                if (!textEl) return;
                e.preventDefault();
                e.stopPropagation();
                this.beginInlineEdit(textEl);
            };

            this.el.visualPreview?.addEventListener('click', onClick);

            this.el.sketchPanePill?.addEventListener('click', () => {
                this.setSourceVisible(true);
            });

            this.el.resultPanePill?.addEventListener('click', () => {
                if (this.rawSource) this.setSourceVisible(true);
            });

            this.el.inlineEditInput?.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.commitInlineEdit();
                } else if (e.key === 'Escape') {
                    e.preventDefault();
                    this.hideInlineEdit();
                }
            });
            this.el.inlineEditInput?.addEventListener('blur', () => {
                // defer so Enter can commit first
                setTimeout(() => {
                    if (!this.el.inlineEdit?.classList.contains('hidden')) {
                        this.commitInlineEdit();
                    }
                }, 0);
            });
        }

        findEditableTextEl(target) {
            if (!target || !target.closest) return null;
            if (target.closest('.inline-edit')) return null;
            const text = target.closest('text, tspan');
            if (text) return text.tagName.toLowerCase() === 'tspan' ? (text.closest('text') || text) : text;
            const fo = target.closest('foreignObject');
            if (fo) {
                const label = fo.querySelector('p, span, div') || fo;
                return label;
            }
            return null;
        }

        beginInlineEdit(textEl) {
            const oldText = String(textEl.textContent || '')
                .replace(/\s+/g, ' ')
                .trim();
            if (!oldText) return;

            const rect = textEl.getBoundingClientRect();
            const box = this.el.inlineEdit;
            const input = this.el.inlineEditInput;
            if (!box || !input) return;

            this._inlineOldText = oldText;
            input.value = oldText;
            box.classList.remove('hidden');

            const width = Math.max(140, Math.min(420, rect.width + 48));
            let left = rect.left;
            let top = rect.bottom + 6;
            if (left + width > window.innerWidth - 8) left = window.innerWidth - width - 8;
            if (left < 8) left = 8;
            if (top + 44 > window.innerHeight - 8) top = Math.max(8, rect.top - 48);
            box.style.left = `${left}px`;
            box.style.top = `${top}px`;
            box.style.width = `${width}px`;

            queueMicrotask(() => {
                input.focus();
                input.select();
            });
        }

        hideInlineEdit() {
            this.el.inlineEdit?.classList.add('hidden');
            this._inlineOldText = null;
        }

        commitInlineEdit() {
            const input = this.el.inlineEditInput;
            const oldText = this._inlineOldText;
            if (!input || oldText == null) {
                this.hideInlineEdit();
                return;
            }
            const next = input.value.replace(/\s+/g, ' ').trim();
            this.hideInlineEdit();
            if (!next || next === oldText) return;
            if (!this.replaceRawText(oldText, next)) {
                this.showError(`Could not find “${oldText}” in Mermaid source`);
                return;
            }
            this.setSourceText(this.rawSource);
            this.scheduleVisualMermaidRender();
            this.scheduleSave();
            this.setStatus('Updated', 'text-success');
            this.hideError();
        }

        replaceRawText(oldText, newText) {
            const src = this.rawSource;
            if (src == null) return false;
            const esc = escapeRegExp(oldText);

            // Prefer participant / actor alias: "as Alice"
            const asRe = new RegExp(`(\\bas\\s+)${esc}\\b`);
            if (asRe.test(src)) {
                this.rawSource = src.replace(asRe, `$1${newText}`);
                return true;
            }

            // Unique exact substring
            const first = src.indexOf(oldText);
            if (first === -1) return false;
            if (src.indexOf(oldText, first + oldText.length) === -1) {
                this.rawSource = src.slice(0, first) + newText + src.slice(first + oldText.length);
                return true;
            }

            // Multiple: whole-word replace
            const wordRe = new RegExp(`\\b${esc}\\b`, 'g');
            if (!wordRe.test(src)) return false;
            this.rawSource = src.replace(new RegExp(`\\b${esc}\\b`, 'g'), newText);
            return true;
        }

        onSourceInput() {
            if (this.suppressSourceApply) return;
            const code = this.el.visualSource.value;
            const trimmed = code.trim();

            if (!trimmed) {
                if (this.rawSource !== null) {
                    this.rawSource = '';
                    this.clearGraphQuiet();
                    this.updateSketchMode();
                    this.scheduleVisualMermaidRender();
                    this.scheduleSave();
                }
                this.updateSourceChrome();
                return;
            }

            if (isFlowchartSource(trimmed)) {
                // Flowchart text needs Apply to rebuild the sketch graph.
                if (this.rawSource !== null) {
                    this.rawSource = null;
                    this.updateSketchMode();
                    this.redraw();
                }
                this.updateSourceChrome();
                this.setStatus('Press Apply to load flowchart into sketch', 'text-warning');
                return;
            }

            // Non-flowchart: live code edit + preview
            this.rawSource = code;
            this.clearGraphQuiet();
            this.updateSketchMode();
            this.redraw();
            this.scheduleVisualMermaidRender();
            this.scheduleSave();
            this.setStatus('Live preview', 'text-success');
        }

        clearGraphQuiet() {
            if (!this.model.nodes.length && !this.model.edges.length) return;
            this.model.nodes = [];
            this.model.edges = [];
            this.model.clearSelection();
            this.updateInspector();
        }

        onKeyDown(e) {
            const tag = (e.target && e.target.tagName) || '';
            const typing = tag === 'INPUT' || tag === 'TEXTAREA' || e.target.isContentEditable;

            if (e.code === 'Space' && !typing) {
                this.spacePan = true;
                e.preventDefault();
            }

            if (typing) return;

            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
                e.preventDefault();
                if (e.shiftKey) {
                    if (this.model.redo()) this.afterGraphChange();
                } else if (this.model.undo()) this.afterGraphChange();
            }

            if (e.key === 'Delete' || e.key === 'Backspace') {
                e.preventDefault();
                if (this.model.deleteSelection()) this.afterGraphChange();
            }
        }

        dropNode(shape) {
            this.rawSource = null;
            const rect = this.el.canvas.getBoundingClientRect();
            const world = this.screenToWorld(rect.width / 2, rect.height / 2);
            const pos = this.maybeSnap(world.x - NODE_W / 2, world.y - NODE_H / 2);
            this.model.addNode(shape, pos.x, pos.y);
            this.afterGraphChange();
            this.el.canvas.focus();
        }

        snapCoord(value) {
            return Math.round(value / GRID_SIZE) * GRID_SIZE;
        }

        maybeSnap(x, y) {
            if (!this.snapToGrid) return { x, y };
            return { x: this.snapCoord(x), y: this.snapCoord(y) };
        }

        setSnapToGrid(enabled) {
            this.snapToGrid = !!enabled;
            this.el.snapToggle.classList.toggle('active', this.snapToGrid);
            this.el.snapToggle.setAttribute('aria-pressed', this.snapToGrid ? 'true' : 'false');
            this.el.visualView.classList.toggle('snap-on', this.snapToGrid);
        }

        afterGraphChange(save = true) {
            this.rawSource = null;
            this.updateSketchMode();
            this.redraw();
            this.updateInspector();
            this.syncSourceFromModel();
            this.scheduleVisualMermaidRender();
            if (this.el.directionSelect) {
                this.el.directionSelect.value = this.model.direction || 'TD';
            }
            if (save) this.scheduleSave();
            this.setStatus('Ready', 'text-success');
        }

        syncSourceFromModel() {
            if (this.rawSource) {
                this.setSourceText(this.rawSource);
                return;
            }
            this.setSourceText(MermaidCodec.toMermaid(this.model));
        }

        scheduleVisualMermaidRender() {
            clearTimeout(this._visualMermaidTimer);
            this._visualMermaidTimer = setTimeout(() => this.renderVisualMermaid(), 120);
        }

        applyVisualPreviewZoom() {
            const zoom = `scale(${this.visualPreviewZoom})`;
            const resultSvg = this.el.visualPreview?.querySelector('svg');
            if (resultSvg) resultSvg.style.transform = zoom;
        }

        async renderVisualMermaid() {
            if (!this.el.visualPreview) return;
            const code = this.getActiveSource().trim();
            const emptyHtml =
                '<div class="preview-placeholder"><p>Add nodes on the sketch map, or load a template</p></div>';
            if (!code) {
                this.el.visualPreview.innerHTML = emptyHtml;
                return;
            }
            const token = ++this._visualRenderToken;
            try {
                const id = `visual-mermaid-${Date.now()}`;
                const { svg } = await mermaid.render(id, code);
                if (token !== this._visualRenderToken) return;
                this.el.visualPreview.innerHTML = svg;
                this.applyVisualPreviewZoom();
                this.hideError();
            } catch (err) {
                if (token !== this._visualRenderToken) return;
                const errHtml =
                    `<div class="preview-placeholder"><p>Mermaid preview error</p><p class="muted">${String(err.message || err)}</p></div>`;
                this.el.visualPreview.innerHTML = errHtml;
                this.showError(`Mermaid preview: ${err.message || 'Invalid diagram'}`);
            }
        }

        applyVisualSource() {
            const code = this.el.visualSource.value.trim();
            if (!code) {
                this.showError('Source is empty');
                return;
            }
            if (isFlowchartSource(code)) {
                try {
                    const parsed = MermaidCodec.fromMermaid(code);
                    this.rawSource = null;
                    this.model.replaceAll(parsed.nodes, parsed.edges, parsed.direction);
                    this.afterGraphChange();
                    this.fitView();
                    this.hideError();
                    this.setStatus('Applied Mermaid', 'text-success');
                } catch (err) {
                    this.showError(err.message || 'Could not parse Mermaid');
                }
                return;
            }

            this.rawSource = code;
            this.clearGraphQuiet();
            this.redraw();
            this.updateInspector();
            this.setSourceText(code);
            this.updateSketchMode();
            this.setResultVisible(true);
            this.setSourceVisible(true);
            this.scheduleVisualMermaidRender();
            this.hideError();
            this.setStatus('Applied Mermaid', 'text-success');
            this.scheduleSave();
        }

        updateInspector() {
            const node = this.model.getSelectedNode();
            const edge = this.model.getSelectedEdge();
            if (!node && !edge) {
                this.el.inspectorEmpty.classList.remove('hidden');
                this.el.inspectorFields.classList.add('hidden');
                this.el.deleteSelection.textContent = 'Delete';
                return;
            }
            this.el.inspectorEmpty.classList.add('hidden');
            this.el.inspectorFields.classList.remove('hidden');
            if (node) {
                this.el.inspectLabel.value = node.label;
                this.el.inspectShape.value = node.shape;
                this.el.shapeField.classList.remove('hidden');
                this.el.edgeActions?.classList.add('hidden');
                this.el.edgeHint?.classList.add('hidden');
                this.el.deleteSelection.textContent = 'Delete node';
            } else {
                this.el.inspectLabel.value = edge.label || '';
                this.el.shapeField.classList.add('hidden');
                this.el.edgeActions?.classList.remove('hidden');
                this.el.edgeHint?.classList.remove('hidden');
                this.el.deleteSelection.textContent = 'Delete arrow';
            }
        }

        redraw() {
            this.applyView();
            this.el.nodesG.innerHTML = '';
            this.el.edgesG.innerHTML = '';

            for (const edge of this.model.edges) {
                const s = this.model.nodes.find((n) => n.id === edge.source);
                const t = this.model.nodes.find((n) => n.id === edge.target);
                if (!s || !t) continue;
                const a = this.edgeEndPoint(edge, 'source', s, t);
                const b = this.edgeEndPoint(edge, 'target', s, t);
                const selected =
                    this.model.selectedKind === 'edge' && this.model.selectedId === edge.id;
                const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                g.classList.add('edge');
                if (selected) g.classList.add('selected');
                if (this.reconnect?.edgeId === edge.id) g.classList.add('reconnecting');
                g.dataset.id = edge.id;

                const d = `M ${a.x} ${a.y} L ${b.x} ${b.y}`;
                const hit = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                hit.classList.add('edge-hit');
                hit.setAttribute('d', d);
                g.appendChild(hit);

                const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                path.classList.add('edge-path');
                path.setAttribute('d', d);
                g.appendChild(path);

                if (edge.label) {
                    const mx = (a.x + b.x) / 2;
                    const my = (a.y + b.y) / 2;
                    const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                    text.classList.add('edge-label');
                    text.setAttribute('x', mx);
                    text.setAttribute('y', my);
                    text.setAttribute('text-anchor', 'middle');
                    text.setAttribute('dominant-baseline', 'middle');
                    text.textContent = edge.label;
                    const w = Math.max(24, edge.label.length * 6.2 + 10);
                    bg.classList.add('edge-label-bg');
                    bg.setAttribute('x', mx - w / 2);
                    bg.setAttribute('y', my - 9);
                    bg.setAttribute('width', w);
                    bg.setAttribute('height', 18);
                    bg.setAttribute('rx', 4);
                    g.appendChild(bg);
                    g.appendChild(text);
                }

                if (selected && !this.reconnect) {
                    for (const end of [
                        { key: 'source', pt: a },
                        { key: 'target', pt: b }
                    ]) {
                        const handle = document.createElementNS(
                            'http://www.w3.org/2000/svg',
                            'circle'
                        );
                        handle.classList.add('edge-endpoint');
                        handle.setAttribute('cx', end.pt.x);
                        handle.setAttribute('cy', end.pt.y);
                        handle.setAttribute('r', 10);
                        handle.dataset.edgeEnd = end.key;
                        handle.addEventListener('pointerdown', (e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            this.beginReconnectEdge(edge.id, end.key, e);
                        });
                        g.appendChild(handle);
                    }
                }

                g.addEventListener('pointerdown', (e) => {
                    e.stopPropagation();
                    if (e.button !== 0) return;
                    const world = this.clientToWorld(e.clientX, e.clientY);
                    const nearSource = this.dist(world, a) <= 18;
                    const nearTarget = this.dist(world, b) <= 18;
                    this.model.select('edge', edge.id);
                    this.updateInspector();
                    if (nearSource || nearTarget) {
                        this.beginReconnectEdge(
                            edge.id,
                            nearSource && (!nearTarget || this.dist(world, a) <= this.dist(world, b))
                                ? 'source'
                                : 'target',
                            e
                        );
                        return;
                    }
                    this.redraw();
                    this.el.canvas.focus();
                });

                this.el.edgesG.appendChild(g);
            }

            for (const node of this.model.nodes) {
                const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                g.classList.add('node');
                if (this.model.selectedKind === 'node' && this.model.selectedId === node.id) {
                    g.classList.add('selected');
                }
                g.dataset.id = node.id;
                g.setAttribute('transform', `translate(${node.x}, ${node.y})`);

                const body = this.createShape(node.shape);
                body.classList.add('node-body');
                g.appendChild(body);

                const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                label.classList.add('node-label');
                label.setAttribute('x', NODE_W / 2);
                label.setAttribute('y', NODE_H / 2 + 1);
                label.setAttribute('text-anchor', 'middle');
                label.setAttribute('dominant-baseline', 'middle');
                label.textContent = this.truncate(node.label, 18);
                g.appendChild(label);

                const ports = [
                    { side: 'n', cx: NODE_W / 2, cy: 0 },
                    { side: 'e', cx: NODE_W, cy: NODE_H / 2 },
                    { side: 's', cx: NODE_W / 2, cy: NODE_H },
                    { side: 'w', cx: 0, cy: NODE_H / 2 }
                ];
                const showPorts = !!(this.link || this.reconnect);
                for (const p of ports) {
                    const port = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                    port.classList.add('node-port');
                    if (showPorts) port.classList.add('port-live');
                    port.setAttribute('cx', p.cx);
                    port.setAttribute('cy', p.cy);
                    port.setAttribute('r', showPorts ? 8 : 6);
                    port.dataset.port = p.side;
                    g.appendChild(port);
                }

                g.addEventListener('pointerdown', (e) => {
                    const portEl = e.target.closest?.('.node-port');
                    if (portEl && g.contains(portEl)) {
                        e.stopPropagation();
                        e.preventDefault();
                        this.beginLink(node.id, e, portEl.dataset.port);
                        return;
                    }
                    e.stopPropagation();
                    this.model.select('node', node.id);
                    this.updateInspector();
                    this.beginDragNode(node.id, e);
                    this.redraw();
                });

                this.el.nodesG.appendChild(g);
            }

            this.el.canvasHint.textContent = this.rawSource
                ? 'Click any label to edit · open Source for full code'
                : this.model.nodes.length
                    ? `${this.model.nodes.length} nodes · ${this.model.edges.length} edges · flow ${this.model.direction || 'TD'}`
                    : 'Sketch freely · Mermaid chooses final layout';
        }

        createShape(shape) {
            const ns = 'http://www.w3.org/2000/svg';
            if (shape === 'diamond') {
                const p = document.createElementNS(ns, 'polygon');
                const midX = NODE_W / 2;
                const midY = NODE_H / 2;
                p.setAttribute(
                    'points',
                    `${midX},2 ${NODE_W - 2},${midY} ${midX},${NODE_H - 2} 2,${midY}`
                );
                return p;
            }
            if (shape === 'circle') {
                const c = document.createElementNS(ns, 'circle');
                c.setAttribute('cx', NODE_W / 2);
                c.setAttribute('cy', NODE_H / 2);
                c.setAttribute('r', Math.min(NODE_W, NODE_H) / 2 - 2);
                return c;
            }
            if (shape === 'hexagon') {
                const p = document.createElementNS(ns, 'polygon');
                const w = NODE_W;
                const h = NODE_H;
                p.setAttribute(
                    'points',
                    `${w * 0.2},2 ${w * 0.8},2 ${w - 2},${h / 2} ${w * 0.8},${h - 2} ${w * 0.2},${h - 2} 2,${h / 2}`
                );
                return p;
            }
            const r = document.createElementNS(ns, 'rect');
            r.setAttribute('x', 1.5);
            r.setAttribute('y', 1.5);
            r.setAttribute('width', NODE_W - 3);
            r.setAttribute('height', NODE_H - 3);
            // rect = sharp Mermaid [...]; round = soft (...); stadium = pill ([...])
            if (shape === 'round') r.setAttribute('rx', 22);
            else if (shape === 'stadium') r.setAttribute('rx', NODE_H / 2);
            else r.setAttribute('rx', 2);
            return r;
        }

        truncate(text, n) {
            const s = String(text || '');
            return s.length > n ? `${s.slice(0, n - 1)}…` : s;
        }

        dist(a, b) {
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            return Math.hypot(dx, dy);
        }

        edgeEndPoint(edge, end, sourceNode, targetNode) {
            const node = end === 'source' ? sourceNode : targetNode;
            const other = end === 'source' ? targetNode : sourceNode;
            const port = end === 'source' ? edge.sourcePort : edge.targetPort;
            if (port && ['n', 'e', 's', 'w'].includes(port)) {
                return this.portPoint(node, port);
            }
            return this.nodeAnchor(node, other);
        }

        closestPort(node, world) {
            let best = 's';
            let bestDist = Infinity;
            for (const side of ['n', 'e', 's', 'w']) {
                const p = this.portPoint(node, side);
                const d = this.dist(p, world);
                if (d < bestDist) {
                    bestDist = d;
                    best = side;
                }
            }
            return best;
        }

        hitTestNodeAt(clientX, clientY, excludeId = null) {
            const world = this.clientToWorld(clientX, clientY);
            const pad = 14;
            // Top-most node first (later in array draws above)
            for (let i = this.model.nodes.length - 1; i >= 0; i -= 1) {
                const n = this.model.nodes[i];
                if (excludeId && n.id === excludeId) continue;
                if (
                    world.x >= n.x - pad &&
                    world.x <= n.x + NODE_W + pad &&
                    world.y >= n.y - pad &&
                    world.y <= n.y + NODE_H + pad
                ) {
                    return { nodeId: n.id, port: this.closestPort(n, world), node: n };
                }
            }
            return null;
        }

        highlightDropTarget(nodeId) {
            this.el.nodesG.querySelectorAll('.drop-target').forEach((el) => {
                el.classList.remove('drop-target');
            });
            if (!nodeId) return;
            const g = this.el.nodesG.querySelector(`[data-id="${nodeId}"]`);
            if (g) g.classList.add('drop-target');
        }

        clearWireUi() {
            this.el.linkPreview.classList.add('hidden');
            this.el.linkPreview.removeAttribute('d');
            this.el.nodesG.querySelectorAll('.linking, .drop-target').forEach((n) => {
                n.classList.remove('linking', 'drop-target');
            });
            this._detachWireListeners?.();
            this._detachWireListeners = null;
        }

        attachWireListeners() {
            const onMove = (e) => this.onPointerMove(e);
            const onUp = (e) => this.onPointerUp(e);
            window.addEventListener('pointermove', onMove);
            window.addEventListener('pointerup', onUp);
            window.addEventListener('pointercancel', onUp);
            this._detachWireListeners = () => {
                window.removeEventListener('pointermove', onMove);
                window.removeEventListener('pointerup', onUp);
                window.removeEventListener('pointercancel', onUp);
            };
        }

        nodeCenter(node) {
            return { x: node.x + NODE_W / 2, y: node.y + NODE_H / 2 };
        }

        nodeAnchor(from, to) {
            const a = this.nodeCenter(from);
            const b = this.nodeCenter(to);
            const dx = b.x - a.x;
            const dy = b.y - a.y;
            if (Math.abs(dx) > Math.abs(dy)) {
                return {
                    x: a.x + Math.sign(dx || 1) * (NODE_W / 2),
                    y: a.y
                };
            }
            return {
                x: a.x,
                y: a.y + Math.sign(dy || 1) * (NODE_H / 2)
            };
        }

        applyView() {
            this.el.world.setAttribute(
                'transform',
                `translate(${this.view.x}, ${this.view.y}) scale(${this.view.scale})`
            );
        }

        screenToWorld(x, y) {
            return {
                x: (x - this.view.x) / this.view.scale,
                y: (y - this.view.y) / this.view.scale
            };
        }

        clientToWorld(clientX, clientY) {
            const rect = this.el.canvas.getBoundingClientRect();
            return this.screenToWorld(clientX - rect.left, clientY - rect.top);
        }

        clientToScreen() {
            return { x: 0, y: 0 };
        }

        zoomBy(factor) {
            const rect = this.el.canvas.getBoundingClientRect();
            const cx = rect.width / 2;
            const cy = rect.height / 2;
            const prev = this.view.scale;
            this.view.scale = clamp(this.view.scale * factor, 0.25, 2.8);
            this.view.x = cx - (cx - this.view.x) * (this.view.scale / prev);
            this.view.y = cy - (cy - this.view.y) * (this.view.scale / prev);
            this.applyView();
        }

        fitView() {
            if (!this.model.nodes.length) {
                this.view = { x: 0, y: 0, scale: 1 };
                this.applyView();
                return;
            }
            let minX = Infinity;
            let minY = Infinity;
            let maxX = -Infinity;
            let maxY = -Infinity;
            for (const n of this.model.nodes) {
                minX = Math.min(minX, n.x);
                minY = Math.min(minY, n.y);
                maxX = Math.max(maxX, n.x + NODE_W);
                maxY = Math.max(maxY, n.y + NODE_H);
            }
            const rect = this.el.canvas.getBoundingClientRect();
            const pad = 48;
            const w = maxX - minX || 1;
            const h = maxY - minY || 1;
            const scale = clamp(
                Math.min((rect.width - pad * 2) / w, (rect.height - pad * 2) / h),
                0.35,
                1.6
            );
            this.view.scale = scale;
            this.view.x = (rect.width - w * scale) / 2 - minX * scale;
            this.view.y = (rect.height - h * scale) / 2 - minY * scale;
            this.applyView();
        }

        onPointerDown(e) {
            if (e.button !== 0) return;
            const world = this.clientToWorld(e.clientX, e.clientY);

            if (this.spacePan || e.altKey) {
                this.drag = {
                    type: 'pan',
                    startX: e.clientX,
                    startY: e.clientY,
                    originX: this.view.x,
                    originY: this.view.y
                };
                this.el.canvas.setPointerCapture(e.pointerId);
                return;
            }

            // empty canvas click clears selection / starts pan
            this.model.clearSelection();
            this.updateInspector();
            this.redraw();
            this.drag = {
                type: 'pan',
                startX: e.clientX,
                startY: e.clientY,
                originX: this.view.x,
                originY: this.view.y
            };
            this.el.canvas.setPointerCapture(e.pointerId);
            void world;
        }

        beginDragNode(id, e) {
            const node = this.model.nodes.find((n) => n.id === id);
            if (!node) return;
            this.drag = {
                type: 'node',
                id,
                pointerId: e.pointerId,
                ox: e.clientX,
                oy: e.clientY,
                nx: node.x,
                ny: node.y,
                moved: false,
                historyPushed: false
            };
            this.el.canvas.setPointerCapture(e.pointerId);
        }

        portPoint(node, side = 's') {
            const cx = node.x + NODE_W / 2;
            const cy = node.y + NODE_H / 2;
            switch (side) {
                case 'n':
                    return { x: cx, y: node.y };
                case 'e':
                    return { x: node.x + NODE_W, y: cy };
                case 'w':
                    return { x: node.x, y: cy };
                case 's':
                default:
                    return { x: cx, y: node.y + NODE_H };
            }
        }

        beginLink(sourceId, e, side = 's') {
            this.clearWireUi();
            this.link = { sourceId, side, pointerId: e.pointerId };
            this.el.linkPreview.classList.remove('hidden');
            this.attachWireListeners();
            this.redraw();
            this.onPointerMove(e);
            const g = this.el.nodesG.querySelector(`[data-id="${sourceId}"]`);
            if (g) g.classList.add('linking');
            this.setStatus('Drop on a node or port to connect', 'text-success');
        }

        beginReconnectEdge(edgeId, end, e) {
            const edge = this.model.edges.find((ed) => ed.id === edgeId);
            if (!edge) return;
            const fixedId = end === 'source' ? edge.target : edge.source;
            const fixedNode = this.model.nodes.find((n) => n.id === fixedId);
            if (!fixedNode) return;
            this.clearWireUi();
            this.reconnect = {
                edgeId,
                end,
                fixedId,
                pointerId: e.pointerId
            };
            this.el.linkPreview.classList.remove('hidden');
            this.attachWireListeners();
            this.redraw();
            this.onPointerMove(e);
            const g = this.el.nodesG.querySelector(`[data-id="${fixedId}"]`);
            if (g) g.classList.add('linking');
            this.setStatus('Drop on another node (or its port) to reattach', 'text-success');
            this.el.canvas.focus();
        }

        onPointerMove(e) {
            if (this.reconnect) {
                const fixed = this.model.nodes.find((n) => n.id === this.reconnect.fixedId);
                if (!fixed) return;
                const edge = this.model.edges.find((ed) => ed.id === this.reconnect.edgeId);
                const fixedEnd = this.reconnect.end === 'source' ? 'target' : 'source';
                const from = edge
                    ? this.edgeEndPoint(
                          edge,
                          fixedEnd,
                          this.model.nodes.find((n) => n.id === edge.source),
                          this.model.nodes.find((n) => n.id === edge.target)
                      )
                    : this.nodeCenter(fixed);
                const to = this.clientToWorld(e.clientX, e.clientY);
                this.el.linkPreview.setAttribute('d', `M ${from.x} ${from.y} L ${to.x} ${to.y}`);
                const hit = this.hitTestNodeAt(e.clientX, e.clientY, this.reconnect.fixedId);
                this.highlightDropTarget(hit?.nodeId || null);
                return;
            }

            if (this.link) {
                const source = this.model.nodes.find((n) => n.id === this.link.sourceId);
                if (!source) return;
                const from = this.portPoint(source, this.link.side);
                const to = this.clientToWorld(e.clientX, e.clientY);
                this.el.linkPreview.setAttribute('d', `M ${from.x} ${from.y} L ${to.x} ${to.y}`);
                const hit = this.hitTestNodeAt(e.clientX, e.clientY, this.link.sourceId);
                this.highlightDropTarget(hit?.nodeId || null);
                return;
            }

            if (!this.drag) return;

            if (this.drag.type === 'pan') {
                this.view.x = this.drag.originX + (e.clientX - this.drag.startX);
                this.view.y = this.drag.originY + (e.clientY - this.drag.startY);
                this.applyView();
                return;
            }

            if (this.drag.type === 'node') {
                const dx = (e.clientX - this.drag.ox) / this.view.scale;
                const dy = (e.clientY - this.drag.oy) / this.view.scale;
                if (!this.drag.moved && (Math.abs(dx) > 2 || Math.abs(dy) > 2)) {
                    this.drag.moved = true;
                    if (!this.drag.historyPushed) {
                        this.model.pushHistory();
                        this.drag.historyPushed = true;
                    }
                }
                const rawX = this.drag.nx + dx;
                const rawY = this.drag.ny + dy;
                const pos = this.maybeSnap(rawX, rawY);
                this.model.moveNode(this.drag.id, pos.x, pos.y, false);
                this.redraw();
            }
        }

        onPointerUp(e) {
            if (this.reconnect) {
                const hit = this.hitTestNodeAt(e.clientX, e.clientY, this.reconnect.fixedId);
                let changed = false;
                if (hit) {
                    changed = this.model.reconnectEdge(
                        this.reconnect.edgeId,
                        this.reconnect.end,
                        hit.nodeId,
                        hit.port
                    );
                }
                this.reconnect = null;
                this.clearWireUi();
                if (changed) {
                    this.afterGraphChange();
                    this.setStatus('Arrow reattached', 'text-success');
                } else {
                    this.redraw();
                    this.setStatus('Drop on a different node or port', 'text-warning');
                }
                return;
            }

            if (this.link) {
                const hit = this.hitTestNodeAt(e.clientX, e.clientY, this.link.sourceId);
                if (hit) {
                    this.model.addEdge(
                        this.link.sourceId,
                        hit.nodeId,
                        '',
                        this.link.side,
                        hit.port
                    );
                    this.link = null;
                    this.clearWireUi();
                    this.afterGraphChange();
                    this.setStatus('Arrow connected', 'text-success');
                    return;
                }
                this.link = null;
                this.clearWireUi();
                this.setStatus('Drop on a node to connect', 'text-warning');
            }

            if (this.drag?.type === 'node' && this.drag.moved) {
                this.syncSourceFromModel();
                this.scheduleSave();
            }
            this.drag = null;
        }

        onDblClick(e) {
            const nodeG = e.target.closest?.('.node');
            const edgeG = e.target.closest?.('.edge');
            if (nodeG) {
                const node = this.model.nodes.find((n) => n.id === nodeG.dataset.id);
                if (!node) return;
                const next = prompt('Node label', node.label);
                if (next === null) return;
                this.model.pushHistory();
                node.label = next;
                this.model.select('node', node.id);
                this.afterGraphChange();
                return;
            }
            if (edgeG) {
                const edge = this.model.edges.find((ed) => ed.id === edgeG.dataset.id);
                if (!edge) return;
                const next = prompt('Edge label', edge.label || '');
                if (next === null) return;
                this.model.pushHistory();
                edge.label = next;
                this.model.select('edge', edge.id);
                this.afterGraphChange();
            }
        }

        loadTemplate(name) {
            const code = TEMPLATES[name];
            if (!code) return;

            if (isFlowchartSource(code)) {
                try {
                    this.rawSource = null;
                    const parsed = MermaidCodec.fromMermaid(code);
                    this.model.nodes = parsed.nodes;
                    this.model.edges = parsed.edges;
                    this.model.direction = parsed.direction;
                    this.model.history = [];
                    this.model.future = [];
                    this.afterGraphChange();
                    this.fitView();
                    this.hideError();
                } catch (err) {
                    this.showError(err.message);
                }
                this.scheduleSave();
                return;
            }

            this.rawSource = code;
            this.model.clear();
            this.redraw();
            this.updateInspector();
            this.setSourceText(code);
            this.updateSketchMode();
            this.setResultVisible(true);
            this.setSourceVisible(true);
            this.scheduleVisualMermaidRender();
            this.hideError();
            this.setStatus('Template loaded — edit code in Source', 'text-success');
            this.scheduleSave();
        }

        getActiveSource() {
            if (this.rawSource) return this.rawSource;
            return MermaidCodec.toMermaid(this.model);
        }

        async copyText(text, message) {
            try {
                await navigator.clipboard.writeText(text);
                this.flashStatus(message);
            } catch {
                this.showError('Failed to copy to clipboard');
            }
        }

        async getSvgElement() {
            let svg = this.el.visualPreview?.querySelector('svg');
            if (!svg) {
                await this.renderVisualMermaid();
                svg = this.el.visualPreview?.querySelector('svg');
            }
            return svg || null;
        }

        async copySvg() {
            const svg = await this.getSvgElement();
            if (!svg) {
                this.showError('No diagram to copy');
                return;
            }
            const text = new XMLSerializer().serializeToString(svg);
            await this.copyText(text, 'SVG copied');
        }

        async exportSvg() {
            const svg = await this.getSvgElement();
            if (!svg) {
                this.showError('No diagram to export');
                return;
            }
            const text = new XMLSerializer().serializeToString(svg);
            const blob = new Blob([text], { type: 'image/svg+xml' });
            saveAs(blob, `mermaid-diagram-${Date.now()}.svg`);
        }

        async exportPng() {
            try {
                const svg = await this.getSvgElement();
                if (!svg) {
                    this.showError('No diagram to export');
                    return;
                }
                this.setStatus('Exporting PNG…', 'text-warning');
                const container = document.createElement('div');
                container.style.position = 'absolute';
                container.style.left = '-9999px';
                container.style.background = '#fff';
                container.style.padding = '20px';
                container.appendChild(svg.cloneNode(true));
                document.body.appendChild(container);
                try {
                    const canvas = await html2canvas(container, {
                        backgroundColor: '#ffffff',
                        scale: 2,
                        logging: false
                    });
                    canvas.toBlob((blob) => {
                        if (!blob) {
                            this.showError('Failed to export PNG');
                            return;
                        }
                        saveAs(blob, `mermaid-diagram-${Date.now()}.png`);
                        this.setStatus('Ready', 'text-success');
                    });
                } finally {
                    container.remove();
                }
            } catch (err) {
                console.error(err);
                this.showError('Failed to export PNG');
                this.setStatus('Ready');
            }
        }

        initTheme() {
            const saved = localStorage.getItem(THEME_KEY);
            let pref = saved;
            if (pref === 'system') pref = 'auto';
            if (pref !== 'light' && pref !== 'dark' && pref !== 'auto') pref = 'auto';
            this.applyThemePref(pref);
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
                if (this.themePref === 'auto') this.applyResolvedTheme();
            });
        }

        toggleTheme() {
            const order = ['light', 'dark', 'auto'];
            const i = order.indexOf(this.themePref);
            this.applyThemePref(order[(i + 1) % order.length]);
        }

        resolveTheme(pref = this.themePref) {
            if (pref === 'light' || pref === 'dark') return pref;
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }

        applyThemePref(pref) {
            this.themePref = pref;
            localStorage.setItem(THEME_KEY, pref);
            document.documentElement.setAttribute('data-theme-pref', pref);
            const label = pref === 'auto' ? 'auto' : pref;
            this.el.themeToggle.title = `Colour theme: ${label}`;
            const hidden = this.el.themeToggle.querySelector('.visually-hidden');
            if (hidden) hidden.textContent = `Colour theme: ${label}`;
            this.applyResolvedTheme();
        }

        applyResolvedTheme() {
            const theme = this.resolveTheme();
            document.documentElement.setAttribute('data-theme', theme);
            mermaid.initialize({
                startOnLoad: false,
                theme: theme === 'dark' ? 'dark' : 'default',
                securityLevel: 'loose',
                flowchart: { useMaxWidth: true, htmlLabels: true },
                sequence: { useMaxWidth: true, wrap: true },
                gantt: { useMaxWidth: true }
            });
            this.scheduleVisualMermaidRender();
        }

        setTheme(theme) {
            const pref = theme === 'system' ? 'auto' : theme;
            this.applyThemePref(pref === 'dark' || pref === 'light' || pref === 'auto' ? pref : 'auto');
        }

        startAutoSave() {
            this.saveTimer = setInterval(() => this.saveState(), 2000);
        }

        scheduleSave() {
            clearTimeout(this._saveSoon);
            this._saveSoon = setTimeout(() => this.saveState(), 400);
        }

        saveState() {
            const data = {
                version: 3,
                graph: {
                    nodes: this.model.nodes,
                    edges: this.model.edges,
                    direction: this.model.direction
                },
                rawSource: this.rawSource,
                view: this.view,
                visualPreviewZoom: this.visualPreviewZoom,
                resultVisible: this.resultVisible,
                splitRatio: this.splitRatio,
                snapToGrid: this.snapToGrid,
                timestamp: Date.now()
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            this.el.lastSaved.textContent = `Saved ${new Date(data.timestamp).toLocaleTimeString()}`;
        }

        loadState() {
            try {
                const raw = localStorage.getItem(STORAGE_KEY);
                if (raw) {
                    const data = JSON.parse(raw);
                    this.visualPreviewZoom = data.visualPreviewZoom || data.previewZoom || 1;
                    this.resultVisible = data.resultVisible !== false;
                    this.splitRatio = clamp(
                        typeof data.splitRatio === 'number' ? data.splitRatio : 0.45,
                        0.18,
                        0.82
                    );
                    this.setSnapToGrid(!!data.snapToGrid);
                    if (data.view) this.view = data.view;
                    if (data.graph) {
                        this.model.nodes = data.graph.nodes || [];
                        this.model.edges = data.graph.edges || [];
                        this.model.direction = data.graph.direction || 'TD';
                    } else if (data.editor && isFlowchartSource(data.editor)) {
                        try {
                            const parsed = MermaidCodec.fromMermaid(data.editor);
                            this.model.nodes = parsed.nodes;
                            this.model.edges = parsed.edges;
                            this.model.direction = parsed.direction;
                        } catch (err) {
                            console.warn(err);
                        }
                    }
                    if (data.rawSource && !isFlowchartSource(data.rawSource)) {
                        this.rawSource = data.rawSource;
                    } else if (data.editor && !isFlowchartSource(data.editor) && data.editor.trim()) {
                        this.rawSource = data.editor;
                    }
                    if (data.timestamp) {
                        this.el.lastSaved.textContent = `Saved ${new Date(data.timestamp).toLocaleTimeString()}`;
                    }
                    if (!this.model.nodes.length && !this.rawSource) this.loadTemplate('flowchart');
                    return;
                }

                const legacy = localStorage.getItem('mermaid-editor-content');
                if (legacy) {
                    const data = JSON.parse(legacy);
                    const content = data.content || '';
                    if (content && isFlowchartSource(content)) {
                        try {
                            const parsed = MermaidCodec.fromMermaid(content);
                            this.model.nodes = parsed.nodes;
                            this.model.edges = parsed.edges;
                            this.model.direction = parsed.direction;
                            return;
                        } catch (err) {
                            console.warn(err);
                        }
                    } else if (content.trim()) {
                        this.rawSource = content;
                        return;
                    }
                }

                this.loadTemplate('flowchart');
            } catch (err) {
                console.error(err);
                this.loadTemplate('flowchart');
            }
        }

        setStatus(text, className = '') {
            this.el.renderStatus.textContent = text;
            this.el.renderStatus.className = className;
        }

        flashStatus(message) {
            const prev = this.el.renderStatus.textContent;
            const prevClass = this.el.renderStatus.className;
            this.setStatus(message, 'text-success');
            setTimeout(() => {
                this.el.renderStatus.textContent = prev;
                this.el.renderStatus.className = prevClass;
            }, 1800);
        }

        showError(message) {
            this.el.errorMessage.textContent = message;
            this.el.errorBar.classList.remove('hidden');
        }

        hideError() {
            this.el.errorBar.classList.add('hidden');
        }

        confirmAction(message, cb) {
            this.el.confirmMessage.textContent = message;
            this.el.confirmModal.classList.remove('hidden');
            const ok = this.el.confirmOk;
            const next = ok.cloneNode(true);
            ok.replaceWith(next);
            this.el.confirmOk = next;
            this.el.confirmOk.addEventListener('click', () => {
                this.hideModal();
                cb();
            });
        }

        hideModal() {
            this.el.confirmModal.classList.add('hidden');
        }

        destroy() {
            clearInterval(this.saveTimer);
            clearTimeout(this.renderTimer);
            this.saveState();
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        window.mermaidEditor = new MermaidEditor();
    });

    window.addEventListener('beforeunload', () => {
        window.mermaidEditor?.destroy();
    });
})();
