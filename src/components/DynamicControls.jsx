import { useState, useEffect } from 'react';
import { useInteraction } from '../context/InteractionContext';

export default function DynamicControls() {
    const { trackInteraction, register, unregister } = useInteraction();
    const [showDelayed, setShowDelayed] = useState(false);
    const [hovered, setHovered] = useState(false);
    const [counter, setCounter] = useState(0);

    useEffect(() => {
        register('DynamicControls', {
            // Base: 1 (Counter)
            // Delayed: +1 if showDelayed
            // Hovered: +1 if hovered
            button: 1 + (showDelayed ? 1 : 0) + (hovered ? 1 : 0)
        });
        return () => unregister('DynamicControls');
    }, [register, unregister, showDelayed, hovered]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowDelayed(true);
        }, 5000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <section aria-labelledby="dynamic-heading">
            <h2 id="dynamic-heading">Dynamic & State-dependent Controls (Count: {1 + (showDelayed ? 1 : 0) + (hovered ? 1 : 0)})</h2>
            <div className="control-grid">
                <div className="card">
                    <h3>Timed Elements</h3>
                    <p>Button appears after 5s load:</p>
                    {showDelayed ? (
                        <button id="dyn-btn-delayed" className="btn fade-in" onClick={() => trackInteraction('Dynamic', 'I arrived late!')}>
                            I arrived late!
                        </button>
                    ) : (
                        <div style={{ color: 'hsl(var(--color-accent-primary))' }}>Loading...</div>
                    )}
                </div>

                <div className="card">
                    <h3>Hover Interactions</h3>
                    <div
                        onMouseEnter={() => setHovered(true)}
                        onMouseLeave={() => setHovered(false)}
                        style={{
                            padding: '1rem',
                            background: 'hsl(var(--color-bg-secondary))',
                            border: '1px dashed hsl(var(--color-text-secondary))',
                            borderRadius: 'var(--radius-md)',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        Hover me to reveal action
                        {hovered && (
                            <button
                                id="dyn-btn-hover-revealed"
                                className="btn"
                                onClick={() => trackInteraction('Hover', 'Revealed Button')}
                                style={{
                                    marginTop: '1rem',
                                    display: 'block',
                                    animation: 'slideUp 0.2s ease-out'
                                }}
                            >
                                Revealed Button
                            </button>
                        )}
                    </div>
                </div>

                <div className="card">
                    <h3>State Updates</h3>
                    <button
                        id="dyn-btn-counter"
                        className="btn btn-secondary"
                        onClick={() => {
                            setCounter(c => c + 1);
                            trackInteraction('State', `Clicked ${counter + 1} times`);
                        }}
                        aria-live="polite"
                    >
                        Clicked {counter} times
                        {counter > 5 && <span style={{ marginLeft: '5px', color: 'hsl(var(--color-warning))' }}>(High count!)</span>}
                    </button>
                </div>
            </div>

            <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
        </section>
    );
}
