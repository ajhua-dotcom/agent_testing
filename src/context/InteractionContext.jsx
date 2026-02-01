import { createContext, useContext, useState, useCallback, useMemo } from 'react';

const InteractionContext = createContext();

export function InteractionProvider({ children }) {
    const [toasts, setToasts] = useState([]);
    // Registry: { componentId: { button: 0, input: 0, link: 0, other: 0 } }
    const [registry, setRegistry] = useState({});

    const addToast = useCallback((message) => {
        setToasts(prev => {
            const newToast = { id: Date.now() + Math.random(), message };
            const updated = [newToast, ...prev];
            return updated.slice(0, 6);
        });

        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.message !== message));
        }, 3000);
    }, []);

    const trackInteraction = useCallback((type, label) => {
        addToast(`Interacted with ${type}: ${label}`);
    }, [addToast]);

    const register = useCallback((id, counts) => {
        setRegistry(prev => {
            // Only update if counts actually changed to avoid render cycles
            const current = prev[id];
            if (current &&
                current.button === counts.button &&
                current.input === counts.input &&
                current.link === counts.link &&
                current.other === counts.other) {
                return prev;
            }
            return { ...prev, [id]: counts };
        });
    }, []);

    const unregister = useCallback((id) => {
        setRegistry(prev => {
            const next = { ...prev };
            delete next[id];
            return next;
        });
    }, []);

    const elementCounts = useMemo(() => {
        const totals = { total: 0, button: 0, input: 0, link: 0, other: 0 };
        Object.values(registry).forEach(counts => {
            totals.button += (counts.button || 0);
            totals.input += (counts.input || 0);
            totals.link += (counts.link || 0);
            totals.other += (counts.other || 0);
        });
        totals.total = totals.button + totals.input + totals.link + totals.other;
        return totals;
    }, [registry]);

    const value = useMemo(() => ({
        toasts,
        elementCounts,
        trackInteraction,
        register,
        unregister
    }), [toasts, elementCounts, trackInteraction, register, unregister]);

    return (
        <InteractionContext.Provider value={value}>
            {children}
            <div style={{
                position: 'fixed',
                bottom: '80px',
                right: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                zIndex: 9999,
                pointerEvents: 'none'
            }}>
                {toasts.map(toast => (
                    <div
                        key={toast.id}
                        style={{
                            background: 'hsl(var(--color-bg-secondary))',
                            color: 'hsl(var(--color-text-primary))',
                            padding: '0.75rem 1rem',
                            borderRadius: 'var(--radius-md)',
                            boxShadow: 'var(--shadow-glass)',
                            borderLeft: '4px solid hsl(var(--color-accent-primary))',
                            fontSize: '0.9rem',
                            animation: 'slideIn 0.2s ease-out',
                            maxWidth: '300px'
                        }}
                    >
                        {toast.message}
                    </div>
                ))}
            </div>
        </InteractionContext.Provider>
    );
}

export function useInteraction() {
    const context = useContext(InteractionContext);
    if (!context) {
        throw new Error('useInteraction must be used within an InteractionProvider');
    }
    return context;
}
