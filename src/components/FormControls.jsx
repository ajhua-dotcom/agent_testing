import { useState, useEffect } from 'react';
import { useInteraction } from '../context/InteractionContext';

export default function FormControls() {
    const { trackInteraction, register, unregister } = useInteraction();

    useEffect(() => {
        register('FormControls', {
            input: 14, // 1 Select + 3 Radio + 1 Slider + 8 Inputs + 1 Checkbox
            button: 1 // Submit button
        });
        return () => unregister('FormControls');
    }, [register, unregister]);

    const [formData, setFormData] = useState({
        flavor: 'vanilla',
        toppings: [],
        intensity: 50
    });

    return (
        <section aria-labelledby="form-heading">
            <h2 id="form-heading">Complex Form Controls (Count: 15)</h2>
            <div className="control-grid">
                <div className="card">
                    <h3>Native Select (1)</h3>
                    <label htmlFor="flavor-select" style={{ display: 'block', marginBottom: '0.5rem' }}>Choose Flavor:</label>
                    <select
                        id="flavor-select"
                        className="input"
                        value={formData.flavor}
                        onChange={e => {
                            setFormData({ ...formData, flavor: e.target.value });
                            trackInteraction('Select', `Flavor ${e.target.value}`);
                        }}
                    >
                        <option value="vanilla">Vanilla</option>
                        <option value="chocolate">Chocolate</option>
                        <option value="strawberry">Strawberry</option>
                        <option value="mint">Mint Chip</option>
                    </select>
                </div>

                <div className="card">
                    <h3>Radio Group (3)</h3>
                    <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
                        <legend style={{ marginBottom: '0.5rem' }}>Preferences:</legend>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {['Email', 'Phone', 'Pigeon (Disabled)'].map(opt => (
                                <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <input
                                        id={`form-radio-${opt.toLowerCase().split(' ')[0]}`}
                                        type="radio"
                                        name="pref"
                                        value={opt.toLowerCase()}
                                        disabled={opt.includes('Disabled')}
                                        onChange={() => trackInteraction('Radio', opt)}
                                    />
                                    {opt}
                                </label>
                            ))}
                        </div>
                    </fieldset>
                </div>

                <div className="card">
                    <h3>Range Slider (1)</h3>
                    <label htmlFor="intensity-range" style={{ display: 'block', marginBottom: '0.5rem' }}>
                        Intensity: {formData.intensity}%
                    </label>
                    <input
                        type="range"
                        id="intensity-range"
                        min="0"
                        max="100"
                        value={formData.intensity}
                        onChange={e => setFormData({ ...formData, intensity: e.target.value })}
                        onMouseUp={() => trackInteraction('Slider', `Intensity ${formData.intensity}`)}
                        style={{ width: '100%' }}
                    />
                </div>

                <div className="card" style={{ gridColumn: 'span 2' }}>
                    <h3>Long Registration Form (10)</h3>
                    <form
                        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}
                        onSubmit={e => { e.preventDefault(); trackInteraction('Form', 'Submit Registration'); }}
                    >
                        {[
                            { label: 'First Name', type: 'text' },
                            { label: 'Last Name', type: 'text' },
                            { label: 'Email', type: 'email' },
                            { label: 'Phone', type: 'tel' },
                            { label: 'Date of Birth', type: 'date' },
                            { label: 'Address', type: 'text' },
                            { label: 'City', type: 'text' },
                            { label: 'Zip Code', type: 'number' },
                        ].map(field => (
                            <div key={field.label}>
                                <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.25rem' }}>{field.label}</label>
                                <input
                                    id={`form-reg-${field.label.toLowerCase().replace(/\s+/g, '-')}`}
                                    type={field.type}
                                    className="input"
                                    onFocus={() => trackInteraction('Input', `Focus ${field.label}`)}
                                />
                            </div>
                        ))}
                        <div style={{ gridColumn: 'span 2' }}>
                            <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                <input id="form-check-terms" type="checkbox" onChange={e => trackInteraction('Checkbox', `Terms ${e.target.checked ? 'Checked' : 'Unchecked'}`)} />
                                I agree to the Terms and Conditions
                            </label>
                        </div>
                        <div style={{ gridColumn: 'span 2', marginTop: '0.5rem' }}>
                            <button id="form-btn-submit" type="submit" className="btn" style={{ width: '100%' }}>Register Account</button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}
