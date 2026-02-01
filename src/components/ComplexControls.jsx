import { useEffect, useRef } from 'react';
import { useInteraction } from '../context/InteractionContext';

function ShadowDomComponent({ trackInteraction }) {
    const hostRef = useRef(null);

    useEffect(() => {
        if (hostRef.current && !hostRef.current.shadowRoot) {
            const shadow = hostRef.current.attachShadow({ mode: 'open' });

            const style = document.createElement('style');
            style.textContent = `
        .shadow-btn {
          background: #7c3aed;
          color: white;
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .shadow-content {
          padding: 10px;
          border: 1px solid #ccc;
          margin-top: 10px;
          color: black;
          background: white;
        }
      `;

            const container = document.createElement('div');
            container.className = 'shadow-content';

            const btn = document.createElement('button');
            btn.className = 'shadow-btn';
            btn.textContent = 'Button inside Shadow DOM';
            btn.onclick = () => trackInteraction('Shadow DOM', 'Internal Button');

            const text = document.createElement('p');
            text.textContent = 'This content is isolated in Shadow DOM.';

            container.appendChild(text);
            container.appendChild(btn);

            shadow.appendChild(style);
            shadow.appendChild(container);
        }
    }, [trackInteraction]);

    return <div ref={hostRef}></div>;
}

export default function ComplexControls() {
    const { trackInteraction, register, unregister } = useInteraction();

    useEffect(() => {
        register('ComplexControls', {
            button: 3, // Shadow btn, Inner btn, Outer Div 
            other: 1   // SVG
        });
        return () => unregister('ComplexControls');
    }, [register, unregister]);

    return (
        <section aria-labelledby="complex-heading">
            <h2 id="complex-heading">Complex & Isolated Elements (Count: 4)</h2>
            <div className="control-grid">
                <div className="card">
                    <h3>Shadow DOM Boundary (1)</h3>
                    <ShadowDomComponent trackInteraction={trackInteraction} />
                </div>

                <div className="card">
                    <h3>SVG Interactions (1)</h3>
                    <svg
                        id="complex-svg-interaction"
                        width="100"
                        height="100"
                        viewBox="0 0 100 100"
                        style={{ cursor: 'pointer' }}
                        onClick={() => trackInteraction('SVG', 'Vector Graphic')}
                    >
                        <circle cx="50" cy="50" r="40" stroke="hsl(var(--color-accent-primary))" strokeWidth="4" fill="hsl(var(--color-bg-secondary))" />
                        <text x="50" y="55" textAnchor="middle" fill="white" fontSize="12">Click Me</text>
                    </svg>
                </div>

                <div className="card">
                    <h3>Nested Interactivity (2)</h3>
                    <div
                        id="complex-div-outer"
                        onClick={() => trackInteraction('Div', 'Outer Container')}
                        style={{ padding: '1rem', background: 'hsl(var(--color-bg-primary))', cursor: 'pointer' }}
                    >
                        Outer Div (Click me)
                        <button
                            id="complex-btn-inner"
                            className="btn btn-secondary"
                            onClick={(e) => {
                                e.stopPropagation();
                                trackInteraction('Button', 'Inner Propagation Stopped');
                            }}
                            style={{ display: 'block', marginTop: '0.5rem' }}
                        >
                            Inner Button (Stops Propagation)
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
