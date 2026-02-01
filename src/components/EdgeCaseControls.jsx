import { useState, useEffect, useRef } from 'react';
import { useInteraction } from '../context/InteractionContext';

function CanvasButton({ trackInteraction }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        // Draw button
        ctx.fillStyle = '#7c3aed';
        ctx.roundRect(10, 10, 130, 40, 8);
        ctx.fill();

        // Text
        ctx.fillStyle = 'white';
        ctx.font = '14px sans-serif';
        ctx.fillText('Canvas Button', 35, 35);

        const handleClick = (e) => {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            if (x >= 10 && x <= 140 && y >= 10 && y <= 50) {
                trackInteraction('Canvas', 'Painted Button');
            }
        };

        canvas.addEventListener('click', handleClick);
        return () => canvas.removeEventListener('click', handleClick);
    }, [trackInteraction]);

    return <canvas id="edge-canvas-btn" ref={canvasRef} width="150" height="60" style={{ cursor: 'pointer' }} />;
}

export default function EdgeCaseControls() {
    const { trackInteraction, register, unregister } = useInteraction();
    const [accordionOpen, setAccordionOpen] = useState(false);

    useEffect(() => {
        register('EdgeCaseControls', {
            // Accessibility Tiers: 3 Buttons (Good, Ok, Bad)
            // Visibility: 3 Buttons (Ghost, Camo, Zero)
            // Canvas: 1 Other
            // Label Trigger: 1 Input (Checkbox underlying)
            // Accordion: 1 Button (Summary) + (1 Button Inner if Open)
            button: 3 + 3 + 1 + (accordionOpen ? 1 : 0),
            input: 1,
            other: 1
        });
        return () => unregister('EdgeCaseControls');
    }, [register, unregister, accordionOpen]);

    return (
        <section aria-labelledby="edge-case-heading">
            <h2 id="edge-case-heading">Edge Cases & Hostile Patterns (Count: {8 + (accordionOpen ? 1 : 0)})</h2>
            <div className="control-grid">
                {/* Accessibility Tiers */}
                <div className="card">
                    <h3>Accessibility Tiers</h3>
                    <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column', marginTop: '1rem' }}>
                        <button id="edge-btn-good" className="btn" onClick={() => trackInteraction('Button', 'Good A11y')}>
                            Good: Standard Button
                        </button>
                        <div
                            id="edge-btn-ok"
                            tabIndex="0"
                            role="button"
                            className="btn btn-secondary"
                            onClick={() => trackInteraction('Button', 'Ok A11y (Div+Role)')}
                            onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && trackInteraction('Button', 'Ok A11y')}
                        >
                            Average: Div + Role + TabIndex
                        </div>
                        <div
                            id="edge-btn-bad"
                            className="btn"
                            style={{ background: 'hsl(var(--color-bg-tertiary))', border: '1px solid currentColor' }}
                            onClick={() => trackInteraction('Button', 'Bad A11y (Div only)')}
                        >
                            Bad: Div with onClick only
                        </div>
                    </div>
                </div>

                {/* Visibility Tricks */}
                <div className="card">
                    <h3>Visibility Tricks</h3>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                        <button
                            id="edge-btn-ghost"
                            className="btn"
                            style={{ opacity: 0.05 }}
                            onClick={() => trackInteraction('Ghost', 'Low Opacity')}
                        >
                            Ghost (5% Opacity)
                        </button>

                        <button
                            id="edge-btn-camo"
                            onClick={() => trackInteraction('Camo', 'Same Color')}
                            style={{
                                background: 'hsl(var(--color-bg-secondary))',
                                color: 'hsl(var(--color-bg-secondary))',
                                border: 'none',
                                padding: '1rem',
                                cursor: 'pointer'
                            }}
                        >
                            Camouflaged
                        </button>

                        <div style={{ width: 0, height: 0, overflow: 'visible' }}>
                            <button
                                id="edge-btn-zero"
                                onClick={() => trackInteraction('ZeroSize', 'Overflow Visible')}
                                style={{ whiteSpace: 'nowrap' }}
                            >
                                Zero-Size Container
                            </button>
                        </div>
                    </div>
                </div>

                {/* Custom Interactive Elements */}
                <div className="card">
                    <h3>Custom Interactive</h3>

                    <div style={{ marginBottom: '1rem' }}>
                        <CanvasButton trackInteraction={trackInteraction} />
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <label
                            id="edge-label-trigger"
                            style={{
                                display: 'inline-block',
                                padding: '0.5rem 1rem',
                                background: 'hsl(var(--color-accent-primary))',
                                color: 'white',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Label Trigger
                            <input
                                id="edge-checkbox-hidden"
                                type="checkbox"
                                style={{ display: 'none' }}
                                onChange={e => trackInteraction('Label Hack', `Checkbox ${e.target.checked}`)}
                            />
                        </label>
                    </div>

                    <details
                        open={accordionOpen}
                        onToggle={(e) => {
                            setAccordionOpen(e.target.open);
                            if (e.target.open) trackInteraction('Accordion', 'Opened');
                        }}
                    >
                        <summary id="edge-accordion-summary" style={{ cursor: 'pointer', padding: '0.5rem', background: 'hsl(var(--color-bg-tertiary))' }}>
                            Native Accordion (Details)
                        </summary>
                        <div style={{ padding: '0.5rem' }}>
                            <button id="edge-btn-accordion-inner" className="btn btn-secondary" onClick={() => trackInteraction('Accordion', 'Inner Action')}>
                                Hidden Content Action
                            </button>
                        </div>
                    </details>
                </div>
            </div>
        </section>
    );
}
