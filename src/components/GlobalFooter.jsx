import { useInteraction } from '../context/InteractionContext';

export default function GlobalFooter() {
    const { elementCounts } = useInteraction();

    return (
        <footer style={{
            marginTop: '4rem',
            padding: '1.5rem',
            background: 'hsl(var(--color-bg-secondary))',
            borderTop: '1px solid hsl(220, 15%, 20%)',
            color: 'hsl(var(--color-text-secondary))',
            fontSize: '0.9rem',
            display: 'flex',
            justifyContent: 'center',
            gap: '2rem',
            flexWrap: 'wrap'
        }}>
            <strong style={{ color: 'hsl(var(--color-text-primary))' }}>
                Total Elements: {elementCounts.total}
            </strong>
            <span>Buttons: {elementCounts.button}</span>
            <span>Inputs: {elementCounts.input}</span>
            <span>Links: {elementCounts.link}</span>
            <span>Other: {elementCounts.other}</span>
        </footer>
    );
}
