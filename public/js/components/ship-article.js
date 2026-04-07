class ShipArticle extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          overflow: hidden;
          font-family: inherit;
          max-width: 640px;
        }

        article {
          padding: 1.5rem;
        }

        h2 {
          margin: 0 0 0.75rem;
          font-size: 1.4rem;
          line-height: 1.25;
          color: #1a1a1a;
        }

        .summary {
          font-size: 0.95rem;
          line-height: 1.7;
          color: #555;
          border-left: 3px solid #e0e0e0;
          padding-left: 0.75rem;
          margin: 0 0 1rem;
        }

        details {
          font-size: 0.9rem;
          color: #444;
          line-height: 1.7;
        }

        summary {
          cursor: pointer;
          font-weight: 600;
          font-size: 0.875rem;
          user-select: none;
          list-style: none;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        summary::before {
          content: '▶';
          font-size: 0.65rem;
          transition: transform 0.2s ease;
        }

        details[open] summary::before {
          transform: rotate(90deg);
        }

        p {
          margin: 0.75rem 0 0;
        }
      </style>

      <article>
        <h2 part="headline">Canterbury</h2>

        <p class="summary" part="summary">
          The Canterbury ("Cant") was a former colony ship converted to function as an ice hauler
          traveling among the Belt and Outer Planets in service of the Pur'n'Kleen Water Company.
        </p>

        <details>
          <summary>Read more</summary>

          <p>
            The Canterbury was powered by four dual Epstein drives for axial acceleration and also had
            a number of reaction control system thrusters to enable rotational maneuvers. The spacecraft
            was capable of a sustained 3g acceleration during emergency maneuvers.
          </p>

          <p>
            The Canterbury was 1,000m (3,281 feet) long and had a draft of about 250m (820 feet). The
            majority of the ship's volume was taken up by its hollow cargo bay, which was open at the bow
            for capturing ice in space.
          </p>

          <p>
            As a civilian ice hauler, the Canterbury carried no armaments.
          </p>
        </details>
      </article>
    `;
  }
}

customElements.define('ship-article', ShipArticle);
