import { useState, useEffect } from 'react';
import { useInteraction } from '../context/InteractionContext';

export default function OverlayControls() {
    const { trackInteraction, register, unregister } = useInteraction();
    const [showModal, setShowModal] = useState(false);
    const [contextMenu, setContextMenu] = useState(null);

    useEffect(() => {
        register('OverlayControls', {
            // Base: 2 buttons (Open Modal, Trigger Toast)
            // Modal: +2 buttons (Cancel, Confirm) if open
            // Context Menu: +4 "other" items if open
            button: 2 + (showModal ? 2 : 0),
            other: (contextMenu ? 4 : 0)
        });
        return () => unregister('OverlayControls');
    }, [register, unregister, showModal, contextMenu]);

    const addToast = () => {
        trackInteraction('Toast', 'Triggered');
    };

    const handleContextMenu = (e) => {
        e.preventDefault();
        trackInteraction('Context Menu', 'Opened');
        setContextMenu({ x: e.clientX, y: e.clientY });
    };

    // Close context menu on click elsewhere
    useEffect(() => {
        const closeMenu = () => setContextMenu(null);
        window.addEventListener('click', closeMenu);
        return () => window.removeEventListener('click', closeMenu);
    }, []);

    return (
        <section aria-labelledby="overlay-heading">
            <h2 id="overlay-heading">Overlays, Popups & Context Menus (Count: {2 + (showModal ? 2 : 0) + (contextMenu ? 4 : 0)})</h2>
            <div className="control-grid">

                <div className="card">
                    <h3>Modal Dialog ({1 + (showModal ? 2 : 0)})</h3>
                    <button id="overlay-btn-open-modal" className="btn" onClick={() => setShowModal(true)}>Open Modal</button>

                    {showModal && (
                        <div style={{
                            position: 'fixed',
                            top: 0, left: 0, right: 0, bottom: 0,
                            background: 'rgba(0,0,0,0.7)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 1000
                        }}>
                            <div
                                role="dialog"
                                aria-modal="true"
                                style={{
                                    background: 'hsl(var(--color-bg-secondary))',
                                    padding: '2rem',
                                    borderRadius: 'var(--radius-lg)',
                                    maxWidth: '500px',
                                    width: '90%',
                                    border: '1px solid hsl(var(--color-accent-primary))',
                                    boxShadow: 'var(--shadow-glass)'
                                }}
                            >
                                <h3>Important Confirmation</h3>
                                <p>This is a simulated modal dialog. It should trap focus in a real application.</p>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                                    <button
                                        id="overlay-btn-modal-cancel"
                                        className="btn btn-secondary"
                                        onClick={() => {
                                            setShowModal(false);
                                            trackInteraction('Modal', 'Cancelled');
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        id="overlay-btn-modal-confirm"
                                        className="btn"
                                        onClick={() => {
                                            setShowModal(false);
                                            trackInteraction('Modal', 'Confirmed');
                                        }}
                                    >
                                        Confirm
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="card">
                    <h3>Toasts / Notifications (1)</h3>
                    <button id="overlay-btn-trigger-toast" className="btn btn-secondary" onClick={addToast}>Trigger Toast</button>
                    <p style={{ fontSize: '0.8rem', color: 'hsl(var(--color-text-secondary))', marginTop: '0.5rem' }}>
                        Toasts appear globally in bottom right
                    </p>
                </div>

                <div className="card">
                    <h3>Tooltips (0)</h3>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div
                            className="tooltip-container"
                            style={{ position: 'relative', cursor: 'help' }}
                            onMouseEnter={() => trackInteraction('Tooltip', 'Hovered')}
                        >
                            <span style={{ borderBottom: '1px dotted' }}>Hover me</span>
                            <div className="tooltip" style={{
                                position: 'absolute',
                                bottom: '100%',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                padding: '0.5rem',
                                background: 'black',
                                color: 'white',
                                borderRadius: '4px',
                                fontSize: '0.8rem',
                                whiteSpace: 'nowrap',
                                opacity: 0,
                                pointerEvents: 'none',
                                transition: 'opacity 0.2s'
                            }}>
                                I am a tooltip!
                            </div>
                        </div>
                    </div>
                    <style>{`
            .tooltip-container:hover .tooltip { opacity: 1; }
          `}</style>
                </div>

                <div className="card">
                    <h3>Custom Context Menu ({contextMenu ? 4 : 0})</h3>
                    <div
                        id="overlay-context-area"
                        onContextMenu={handleContextMenu}
                        style={{
                            padding: '2rem',
                            border: '2px dashed hsl(var(--color-text-secondary))',
                            borderRadius: 'var(--radius-md)',
                            textAlign: 'center',
                            background: 'hsl(var(--color-bg-primary))'
                        }}
                    >
                        Right-click in this area
                    </div>

                    {contextMenu && (
                        <div style={{
                            position: 'fixed',
                            top: contextMenu.y,
                            left: contextMenu.x,
                            background: 'hsl(var(--color-bg-tertiary))',
                            border: '1px solid hsl(220, 15%, 30%)',
                            borderRadius: '4px',
                            padding: '0.5rem 0',
                            boxShadow: 'var(--shadow-md)',
                            zIndex: 3000,
                            minWidth: '150px'
                        }}>
                            {['Copy', 'Paste', 'Inspect', 'Delete'].map(action => (
                                <div
                                    key={action}
                                    id={`overlay-context-item-${action.toLowerCase()}`}
                                    onClick={() => trackInteraction('Context Menu', `Selected ${action}`)}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        cursor: 'pointer',
                                        color: 'hsl(var(--color-text-primary))'
                                    }}
                                    onMouseEnter={e => e.target.style.background = 'hsl(var(--color-accent-primary))'}
                                    onMouseLeave={e => e.target.style.background = 'transparent'}
                                >
                                    {action}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </section>
    );
}
