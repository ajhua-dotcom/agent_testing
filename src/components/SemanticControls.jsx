import { useState, useEffect } from 'react';
import { useInteraction } from '../context/InteractionContext';

export default function SemanticControls() {
    const { trackInteraction, register, unregister } = useInteraction();
    const [toggleState, setToggleState] = useState(false);

    useEffect(() => {
        register('SemanticControls', {
            button: 3, // Div, Span, ARIA Button
            input: 1   // ARIA Checkbox
        });
        return () => unregister('SemanticControls');
    }, [register, unregister]);

    return (
        <section aria-labelledby="semantic-heading">
            <h2 id="semantic-heading">Semantic & ARIA Controls (Count: 4)</h2>
            <div className="control-grid">
                <div className="card">
                    <h3>Div/Span Buttons (Anti-patterns)</h3>
                    <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
                        {/* These are intentionally bad patterns to test detection */}
                        <div
                            id="sem-btn-div"
                            className="btn"
                            onClick={() => trackInteraction('Div', 'Button with onClick')}
                            style={{ display: 'inline-block' }}
                        >
                            Div with onClick
                        </div>

                        <span
                            id="sem-btn-span"
                            className="btn btn-secondary"
                            onClick={() => trackInteraction('Span', 'Button with onClick')}
                            style={{ display: 'inline-block' }}
                        >
                            Span with onClick
                        </span>
                    </div>
                </div>

                <div className="card">
                    <h3>ARIA Roles</h3>
                    <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', flexDirection: 'column' }}>
                        <div
                            id="sem-aria-btn"
                            role="button"
                            tabIndex="0"
                            className="btn"
                            onClick={() => trackInteraction('ARIA Button', 'Div with role=button')}
                            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && trackInteraction('ARIA Button', 'Keyboard Trigger')}
                        >
                            Div with role="button"
                        </div>

                        <div
                            id="sem-aria-checkbox"
                            role="checkbox"
                            aria-checked={toggleState}
                            tabIndex="0"
                            onClick={() => {
                                setToggleState(!toggleState);
                                trackInteraction('ARIA Checkbox', `Toggled to ${!toggleState}`);
                            }}
                            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setToggleState(!toggleState)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                cursor: 'pointer',
                                padding: '0.5rem',
                                border: '1px solid hsl(220, 15%, 30%)',
                                borderRadius: '4px'
                            }}
                        >
                            <div style={{
                                width: '16px',
                                height: '16px',
                                background: toggleState ? 'hsl(var(--color-accent-primary))' : 'transparent',
                                border: '1px solid hsl(var(--color-text-secondary))'
                            }} />
                            Custom ARIA Checkbox
                        </div>
                    </div>
                </div>

                <div className="card">
                    <h3>Hidden Elements</h3>
                    <p style={{ fontSize: '0.9rem', color: 'hsl(var(--color-text-secondary))' }}>
                        Elements below should be ignored by the agent.
                    </p>
                    <button style={{ display: 'none' }}>Display None Button</button>
                    <button style={{ visibility: 'hidden' }}>Visibility Hidden Button</button>
                    <button aria-hidden="true" style={{ opacity: 0 }}>Aria Hidden Button</button>
                    <div hidden>HTML5 Hidden Attribute</div>
                </div>
            </div>
        </section>
    );
}
