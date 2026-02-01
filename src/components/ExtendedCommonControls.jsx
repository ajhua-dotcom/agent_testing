import { useEffect, useState } from 'react';
import { useInteraction } from '../context/InteractionContext';

export default function ExtendedCommonControls() {
    const { trackInteraction, register, unregister } = useInteraction();

    // Element Breakdown:
    // Buttons: 3 (types) + 1 (anchor) + 1 (icon) = 5
    // Inputs: 1 (search) + 1 (password) + 4 (other types) + 1 (contenteditable) = 7
    // Selection: 3 (chips) + 2 (toggles) + 2 (cards) = 7
    // Total: 19
    useEffect(() => {
        register('ExtendedCommon', { button: 5, input: 7, other: 7 });
        return () => unregister('ExtendedCommon');
    }, [register, unregister]);

    const [passwordVisible, setPasswordVisible] = useState(false);
    const [toggle1, setToggle1] = useState(false);
    const [toggle2, setToggle2] = useState(true);
    const [selectedChip, setSelectedChip] = useState('Option A');

    return (
        <section aria-labelledby="extended-heading">
            <h2 id="extended-heading">Extended Common Controls (Count: 19)</h2>
            <div className="control-grid">

                {/* Button Implementations */}
                <div className="card">
                    <h3>Button Variations (4)</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <input
                                id="ext-input-btn-type"
                                type="button"
                                value="Input Type=Button"
                                className="btn"
                                onClick={() => trackInteraction('Button', 'Input Type Button')}
                            />
                            <input
                                id="ext-input-submit-type"
                                type="submit"
                                value="Input Type=Submit"
                                className="btn btn-secondary"
                                onClick={() => trackInteraction('Button', 'Input Type Submit')}
                            />
                        </div>

                        <a
                            id="ext-anchor-btn-role"
                            href="#"
                            role="button"
                            className="btn"
                            style={{ textAlign: 'center', textDecoration: 'none', background: 'hsl(var(--color-bg-tertiary))', color: 'inherit' }}
                            onClick={(e) => { e.preventDefault(); trackInteraction('Button', 'Anchor as Button'); }}
                        >
                            Anchor styled as Button
                        </a>

                        <button
                            id="ext-btn-icon-only"
                            aria-label="Settings"
                            className="btn btn-secondary"
                            onClick={() => trackInteraction('Button', 'Icon Only')}
                            style={{ width: '40px', padding: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                        >
                            ⚙️
                        </button>
                    </div>
                </div>

                {/* Varied Inputs */}
                <div className="card">
                    <h3>Input Variations (8)</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>

                        <div style={{ position: 'relative' }}>
                            <input
                                id="ext-input-search"
                                type="search"
                                className="input"
                                placeholder="Search..."
                                onFocus={() => trackInteraction('Input', 'Search')}
                            />
                            <button
                                id="ext-btn-clear-search"
                                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', opacity: 0.5 }}
                                onClick={() => trackInteraction('Button', 'Clear Search')}
                            >
                                ✕
                            </button>
                        </div>

                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <input
                                id="ext-input-password"
                                type={passwordVisible ? "text" : "password"}
                                className="input"
                                placeholder="Password"
                                onFocus={() => trackInteraction('Input', 'Password')}
                            />
                            <button
                                id="ext-btn-toggle-pw"
                                className="btn btn-secondary"
                                onClick={() => { setPasswordVisible(!passwordVisible); trackInteraction('Button', 'Toggle Password'); }}
                            >
                                {passwordVisible ? 'Hide' : 'Show'}
                            </button>
                        </div>

                        <div
                            id="ext-content-editable"
                            contentEditable
                            className="input"
                            style={{ minHeight: '60px', overflowY: 'auto' }}
                            onFocus={() => trackInteraction('Input', 'ContentEditable Div')}
                        >
                            ContentEditable Div (Rich Input)
                        </div>

                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            <input id="ext-input-date" type="date" className="input" style={{ width: 'auto' }} onChange={() => trackInteraction('Input', 'Date Change')} />
                            <input id="ext-input-color" type="color" style={{ height: '40px', width: '40px', cursor: 'pointer' }} onChange={() => trackInteraction('Input', 'Color Change')} />
                            <input id="ext-input-file" type="file" style={{ fontSize: '0.8rem' }} onChange={() => trackInteraction('Input', 'File Selected')} />
                        </div>

                    </div>
                </div>

                {/* Alternative Selections */}
                <div className="card">
                    <h3>Alternative Selections (7)</h3>

                    <div style={{ marginTop: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Chip Selection:</label>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            {['Option A', 'Option B', 'Option C'].map(opt => (
                                <div
                                    key={opt}
                                    id={`ext-chip-${opt.toLowerCase().replace(/\s+/g, '-')}`}
                                    tabIndex="0"
                                    role="radio"
                                    aria-checked={selectedChip === opt}
                                    onClick={() => { setSelectedChip(opt); trackInteraction('Select', `Chip ${opt}`); }}
                                    onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && setSelectedChip(opt)}
                                    style={{
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '16px',
                                        border: '1px solid hsl(var(--color-accent-primary))',
                                        background: selectedChip === opt ? 'hsl(var(--color-accent-primary))' : 'transparent',
                                        color: selectedChip === opt ? 'white' : 'inherit',
                                        cursor: 'pointer',
                                        fontSize: '0.85rem'
                                    }}
                                >
                                    {opt}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ marginTop: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Toggle Switches:</label>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            {[toggle1, toggle2].map((isToggled, i) => (
                                <div
                                    key={i}
                                    id={`ext-switch-${i + 1}`}
                                    role="switch"
                                    aria-checked={isToggled}
                                    tabIndex="0"
                                    onClick={() => {
                                        if (i === 0) setToggle1(!toggle1); else setToggle2(!toggle2);
                                        trackInteraction('Switch', `Toggle ${i + 1}`);
                                    }}
                                    onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && (i === 0 ? setToggle1(!toggle1) : setToggle2(!toggle2))}
                                    style={{
                                        width: '40px',
                                        height: '24px',
                                        background: isToggled ? 'hsl(var(--color-success))' : 'hsl(220, 15%, 30%)',
                                        borderRadius: '12px',
                                        position: 'relative',
                                        cursor: 'pointer',
                                        transition: 'background 0.2s'
                                    }}
                                >
                                    <div style={{
                                        width: '18px',
                                        height: '18px',
                                        background: 'white',
                                        borderRadius: '50%',
                                        position: 'absolute',
                                        top: '3px',
                                        left: isToggled ? '19px' : '3px',
                                        transition: 'left 0.2s'
                                    }} />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                        {['Card 1', 'Card 2'].map(card => (
                            <div
                                key={card}
                                id={`ext-card-${card.toLowerCase().replace(/\s+/g, '-')}`}
                                onClick={() => trackInteraction('Card', `${card} Selected`)}
                                style={{
                                    flex: 1,
                                    padding: '1rem',
                                    border: '1px solid hsl(220, 15%, 25%)',
                                    borderRadius: '8px',
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    background: 'hsl(var(--color-bg-primary))'
                                }}
                                className="hover-card"
                            >
                                {card}
                            </div>
                        ))}
                    </div>

                </div>

            </div>
            <style>{`
        .hover-card:hover { border-color: hsl(var(--color-accent-primary)); }
      `}</style>
        </section>
    );
}
