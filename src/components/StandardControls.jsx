import { useEffect } from 'react';
import { useInteraction } from '../context/InteractionContext';

export default function StandardControls() {
  const { trackInteraction, register, unregister } = useInteraction();

  useEffect(() => {
    // 3 Standard Buttons + 13 Toolbar Buttons + 3 Links + 3 Inputs
    register('StandardControls', {
      button: 16,
      link: 3,
      input: 3
    });
    return () => unregister('StandardControls');
  }, [register, unregister]);

  const handleClick = (label) => {
    trackInteraction('Button/Link', label);
  };

  return (
    <section aria-labelledby="standard-heading">
      <h2 id="standard-heading">Standard HTML Controls (Count: 22)</h2>
      <div className="control-grid">
        <div className="card">
          <h3>Buttons (3)</h3>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
            <button id="std-btn-primary" className="btn" onClick={() => handleClick('Primary Button')}>
              Primary Button
            </button>
            <button id="std-btn-secondary" className="btn btn-secondary" onClick={() => handleClick('Secondary Button')}>
              Secondary Button
            </button>
            <button id="std-btn-disabled" disabled className="btn" style={{ opacity: 0.5, cursor: 'not-allowed' }}>
              Disabled Button
            </button>
          </div>
        </div>

        <div className="card">
          <h3>Rich Text Toolbar (13)</h3>
          <div role="toolbar" style={{
            display: 'flex',
            gap: '0.5rem',
            flexWrap: 'wrap',
            background: 'hsl(var(--color-bg-primary))',
            padding: '0.5rem',
            borderRadius: '4px',
            border: '1px solid hsl(220, 15%, 25%)'
          }}>
            {['Bold', 'Italic', 'Underline', 'Strike'].map(action => (
              <button id={`std-toolbar-${action.toLowerCase()}`} key={action} className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem' }} onClick={() => handleClick(`Format ${action}`)}>
                {action[0]}
              </button>
            ))}
            <div style={{ width: '1px', background: 'hsl(220, 15%, 30%)', margin: '0 0.25rem' }}></div>
            {['Left', 'Center', 'Right', 'Justify'].map(align => (
              <button id={`std-toolbar-${align.toLowerCase()}`} key={align} className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem' }} onClick={() => handleClick(`Align ${align}`)}>
                {align}
              </button>
            ))}
            <div style={{ width: '1px', background: 'hsl(220, 15%, 30%)', margin: '0 0.25rem' }}></div>
            {['List', 'Ordered', 'Quote', 'Code', 'Image'].map(item => (
              <button id={`std-toolbar-${item.toLowerCase()}`} key={item} className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem' }} onClick={() => handleClick(`Insert ${item}`)}>
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="card">
          <h3>Links (3)</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
            <a id="std-link-anchor" href="#" className="link" onClick={(e) => { e.preventDefault(); handleClick('Standard Anchor'); }} style={{ color: 'hsl(var(--color-accent-primary))' }}>
              Standard Anchor Tag
            </a>
            <a id="std-link-newtab" href="#" target="_blank" className="link" onClick={(e) => { e.preventDefault(); handleClick('New Tab Link'); }} style={{ color: 'hsl(var(--color-accent-primary))' }}>
              Opens in New Tab
            </a>
            <a id="std-link-role-btn" type="button" className="link" onClick={(e) => { e.preventDefault(); handleClick('Link with Button Role'); }} style={{ color: 'hsl(var(--color-text-secondary))', textDecoration: 'none', borderBottom: '1px dashed' }}>
              Link pretending to be button
            </a>
          </div>
        </div>

        <div className="card">
          <h3>Text Inputs (3)</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
            <input
              id="std-input-text"
              type="text"
              className="input"
              placeholder="Standard Text Input"
              onFocus={() => trackInteraction('Input', 'Focus Standard Text')}
            />
            <input
              id="std-input-number"
              type="number"
              className="input"
              placeholder="Number Input"
              onFocus={() => trackInteraction('Input', 'Focus Number')}
            />
            <textarea
              id="std-area-text"
              className="input"
              rows="3"
              placeholder="Textarea"
              onFocus={() => trackInteraction('Input', 'Focus Textarea')}
            ></textarea>
          </div>
        </div>
      </div>
    </section>
  );
}
