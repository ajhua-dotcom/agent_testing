import { useState, useEffect } from 'react';
import { useInteraction } from '../context/InteractionContext';

export default function AntiPatternControls() {
    const { trackInteraction, register, unregister } = useInteraction();
    const [soupCount, setSoupCount] = useState(0);

    useEffect(() => {
        register('AntiPatternControls', {
            button: 5, // 1 soup, 1 missing label, 1 fake button, 1 invisible, 1 broken aria
            input: 2   // 1 no label, 1 duplicate id
        });
        return () => unregister('AntiPatternControls');
    }, [register, unregister]);

    return (
        <section aria-labelledby="antipattern-heading">
            <h2 id="antipattern-heading">Anti-Patterns & Poor Practices (Count: 7)</h2>
            <div className="control-grid">

                {/* Div Soup */}
                <div className="card">
                    <h3>Div Soup (Deep Nesting)</h3>
                    <div id="div-soup-container" style={{ padding: '0.5rem' }}>
                        <div>
                            <div>
                                <div>
                                    <div
                                        id="soup-clickable"
                                        style={{
                                            padding: '10px',
                                            background: 'hsl(var(--color-bg-tertiary))',
                                            cursor: 'pointer',
                                            border: '1px solid hsl(220, 15%, 30%)'
                                        }}
                                        onClick={() => {
                                            setSoupCount(c => c + 1);
                                            trackInteraction('Div Soup', `Clicked ${soupCount + 1}`);
                                        }}
                                    >
                                        I am a clickable div buried 5 levels deep
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Missing Labels */}
                <div className="card">
                    <h3>Missing Labels / Placeholder Only</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <input
                            type="text"
                            id="input-no-label"
                            className="input"
                            placeholder="I have no label tag"
                            onChange={() => trackInteraction('Bad Input', 'Typed in no-label')}
                        />
                        <button
                            id="btn-icon-no-label"
                            className="btn"
                            onClick={() => trackInteraction('Bad Button', 'Clicked empty icon')}
                        >
                            <span className="icon">🛑</span>
                        </button>
                    </div>
                </div>

                {/* Visual Deception */}
                <div className="card">
                    <h3>Visual Deception</h3>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <a
                            id="fake-link-button"
                            className="btn"
                            onClick={() => trackInteraction('Deception', 'Link looking like button')}
                        >
                            Link styled as Button
                        </a>
                        <div
                            id="fake-button-div"
                            style={{
                                textDecoration: 'underline',
                                color: 'hsl(var(--color-accent-primary))',
                                cursor: 'pointer'
                            }}
                            onClick={() => trackInteraction('Deception', 'Div looking like link')}
                        >
                            Div styled as Link
                        </div>
                    </div>
                </div>

                {/* Invisible / Obscured */}
                <div className="card">
                    <h3>Invisible but Interactive</h3>
                    <div style={{ position: 'relative', height: '50px', background: 'hsl(220, 15%, 20%)' }}>
                        <button
                            id="invisible-btn"
                            onClick={() => trackInteraction('Invisible', 'Clicked 0 opacity')}
                            style={{
                                opacity: 0,
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                cursor: 'pointer'
                            }}
                        >
                            Invisible Button
                        </button>
                        <span style={{ position: 'relative', pointerEvents: 'none', padding: '10px' }}>
                            Click here (Button is Opacity: 0)
                        </span>
                    </div>
                </div>

                {/* Broken Accessibility */}
                <div className="card">
                    <h3>Broken Accessibility</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <button
                            id="submit-btn" // Intentionally duplicate ID if used elsewhere
                            tabIndex="-1"
                            className="btn btn-secondary"
                            onClick={() => trackInteraction('Broken A11y', 'Tabindex -1')}
                        >
                            Focusable but removed from tab order
                        </button>

                        <input
                            type="text"
                            id="submit-btn" // DUPLICATE ID intentionally
                            className="input"
                            placeholder="Duplicate ID 'submit-btn'"
                            onChange={() => trackInteraction('Broken A11y', 'Duplicate ID Input')}
                        />

                        <div
                            id="aria-hidden-interactive"
                            aria-hidden="true"
                            onClick={() => trackInteraction('Broken A11y', 'Aria Hidden Click')}
                            style={{
                                padding: '0.5rem',
                                border: '1px solid red',
                                cursor: 'pointer'
                            }}
                        >
                            I have aria-hidden="true" but am visible
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
