const LEVELS = {
  log:   { label: 'log',   color: '#e2e8f0' },
  info:  { label: 'info',  color: '#60a5fa' },
  warn:  { label: 'warn',  color: '#fbbf24' },
  error: { label: 'error', color: '#f87171' },
  debug: { label: 'debug', color: '#a78bfa' },
  count: { label: 'count', color: '#34d399' },
  table: { label: 'table', color: '#e2e8f0' },
};

function serialize(arg) {
  if (arg === null) return 'null';
  if (arg === undefined) return 'undefined';
  if (typeof arg === 'string') return arg;
  if (arg instanceof Error) return `${arg.name}: ${arg.message}`;
  try {
    return JSON.stringify(arg, null, 2);
  } catch {
    return String(arg);
  }
}

class ConsoleLogger extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._originals = {};
    this._counts = new Map();
  }

  connectedCallback() {
    this._render();
    this._attach();
  }

  disconnectedCallback() {
    this._detach();
  }

  _attach() {
    for (const level of Object.keys(LEVELS)) {
      this._originals[level] = console[level];
      console[level] = (...args) => {
        this._originals[level](...args);
        this._append(level, args);
      };
    }

    // console.count tracks a named counter
    this._originals.count = console.count;
    console.count = (label = 'default') => {
      this._originals.count(label);
      const n = (this._counts.get(label) ?? 0) + 1;
      this._counts.set(label, n);
      this._append('count', [`${label}: ${n}`]);
    };

    // console.countReset resets the tracked counter
    this._originals.countReset = console.countReset;
    console.countReset = (label = 'default') => {
      this._originals.countReset(label);
      this._counts.set(label, 0);
    };

    // console.table renders a proper <table>
    this._originals.table = console.table;
    console.table = (data, columns) => {
      this._originals.table(data, columns);
      this._appendTable(data, columns);
    };
  }

  _detach() {
    for (const [level, fn] of Object.entries(this._originals)) {
      console[level] = fn;
    }
    this._originals = {};
    this._counts.clear();
  }

  _append(level, args) {
    const { label, color } = LEVELS[level];
    const text = args.map(serialize).join(' ');

    const line = document.createElement('div');
    line.className = 'line';

    const badge = document.createElement('span');
    badge.className = 'badge';
    badge.textContent = label;
    badge.style.color = color;
    badge.style.borderColor = color;

    const msg = document.createElement('pre');
    msg.className = 'msg';
    msg.style.color = color;
    msg.textContent = text;

    line.appendChild(badge);
    line.appendChild(msg);

    const output = this.shadowRoot.querySelector('.output');
    output.appendChild(line);
    output.scrollTop = output.scrollHeight;
  }

  _appendTable(data, filterColumns) {
    const { label, color } = LEVELS.table;

    // Normalise to an array of rows with an (index) column
    const rows = Array.isArray(data)
      ? data.map((v, i) => ({ '(index)': i, ...(typeof v === 'object' && v !== null ? v : { Value: v }) }))
      : Object.entries(data).map(([k, v]) => ({ '(index)': k, ...(typeof v === 'object' && v !== null ? v : { Value: v }) }));

    const allCols = rows.length ? Object.keys(rows[0]) : [];
    const cols = filterColumns ? ['(index)', ...filterColumns] : allCols;

    const line = document.createElement('div');
    line.className = 'line line--table';

    const badge = document.createElement('span');
    badge.className = 'badge';
    badge.textContent = label;
    badge.style.color = color;
    badge.style.borderColor = color;

    const table = document.createElement('table');
    table.className = 'console-table';

    const thead = table.createTHead();
    const headerRow = thead.insertRow();
    for (const col of cols) {
      const th = document.createElement('th');
      th.textContent = col;
      headerRow.appendChild(th);
    }

    const tbody = table.createTBody();
    for (const row of rows) {
      const tr = tbody.insertRow();
      for (const col of cols) {
        const td = tr.insertCell();
        const val = row[col];
        td.textContent = val === undefined ? '' : serialize(val);
      }
    }

    line.appendChild(badge);
    line.appendChild(table);

    const output = this.shadowRoot.querySelector('.output');
    output.appendChild(line);
    output.scrollTop = output.scrollHeight;
  }

  _clear() {
    this.shadowRoot.querySelector('.output').innerHTML = '';
    this._counts.clear();
  }

  _render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: 'Menlo', 'Consolas', 'Monaco', monospace;
          font-size: 0.8rem;
          background: #0f172a;
          border: 1px solid #1e293b;
          border-radius: 6px;
          overflow: hidden;
        }

        .toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.4rem 0.75rem;
          background: #1e293b;
          border-bottom: 1px solid #334155;
          color: #94a3b8;
          font-size: 0.7rem;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .clear-btn {
          background: none;
          border: 1px solid #334155;
          color: #94a3b8;
          border-radius: 4px;
          padding: 0.15rem 0.5rem;
          cursor: pointer;
          font: inherit;
          font-size: 0.7rem;
        }

        .clear-btn:hover { background: #334155; }

        .output {
          min-height: 6rem;
          max-height: 16rem;
          overflow-y: auto;
          padding: 0.5rem 0;
        }

        .line {
          display: flex;
          align-items: flex-start;
          gap: 0.6rem;
          padding: 0.2rem 0.75rem;
          border-bottom: 1px solid #1e293b;
        }

        .line:last-child { border-bottom: none; }

        .badge {
          flex-shrink: 0;
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          border: 1px solid;
          border-radius: 3px;
          padding: 0.05rem 0.3rem;
          margin-top: 0.15rem;
          width: 2.8rem;
          text-align: center;
        }

        .msg {
          margin: 0;
          white-space: pre-wrap;
          word-break: break-all;
          line-height: 1.5;
          flex: 1;
        }
        .line--table { align-items: flex-start; }

        .console-table {
          border-collapse: collapse;
          font-size: 0.75rem;
          color: #e2e8f0;
          flex: 1;
        }

        .console-table th,
        .console-table td {
          border: 1px solid #334155;
          padding: 0.2rem 0.5rem;
          text-align: left;
          white-space: pre;
        }

        .console-table th {
          background: #1e293b;
          color: #94a3b8;
          font-weight: 600;
        }

        .console-table tr:nth-child(even) td { background: #0f172a; }
        .console-table tr:nth-child(odd)  td { background: #111827; }

      </style>

      <div class="toolbar">
        <span>console</span>
        <button class="clear-btn">clear</button>
      </div>
      <div class="output"></div>
    `;

    this.shadowRoot.querySelector('.clear-btn').addEventListener('click', () => this._clear());
  }
}

customElements.define('console-logger', ConsoleLogger);
