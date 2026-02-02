import { useState, useEffect } from 'react';
import { useInteraction } from '../context/InteractionContext';

// Tree Node Component
const TreeNode = ({ node, level = 0, trackInteraction, register, unregister, parentId }) => {
    const [expanded, setExpanded] = useState(false);
    const hasChildren = node.children && node.children.length > 0;
    const nodeId = `${parentId}-${node.label.replace(/\s+/g, '')}`;

    useEffect(() => {
        // Register this node as 1 element (Other)
        register(nodeId, { other: 1 });
        return () => unregister(nodeId);
    }, [register, unregister, nodeId]);

    return (
        <div style={{ marginLeft: `${level * 20}px` }}>
            <div
                onClick={() => {
                    if (hasChildren) {
                        setExpanded(!expanded);
                        trackInteraction('Tree', `${expanded ? 'Collapsed' : 'Expanded'} ${node.label}`);
                    } else {
                        trackInteraction('Tree', `Selected ${node.label}`);
                    }
                }}
                style={{
                    cursor: hasChildren ? 'pointer' : 'default',
                    padding: '0.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    color: hasChildren ? 'hsl(var(--color-accent-primary))' : 'inherit'
                }}
                id={`nav-tree-node-${node.label.replace(/\s+/g, '-').toLowerCase()}`}
            >
                {hasChildren && <span style={{ marginRight: '0.5rem', width: '10px' }}>{expanded ? '▼' : '▶'}</span>}
                {!hasChildren && <span style={{ marginRight: '0.5rem', width: '10px' }}>•</span>}
                {node.label}
            </div>
            {expanded && hasChildren && (
                <div>
                    {node.children.map(child => (
                        <TreeNode
                            key={child.label}
                            node={child}
                            level={level + 1}
                            trackInteraction={trackInteraction}
                            register={register}
                            unregister={unregister}
                            parentId={nodeId}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default function NavigationPatterns() {
    const { trackInteraction, register, unregister } = useInteraction();
    const [activeTab, setActiveTab] = useState(0);
    const [activeStep, setActiveStep] = useState(0);

    // Dynamic Tab Content Counting
    useEffect(() => {
        let counts = { button: 3 + 2, link: 2, input: 0 }; // 3 Tabs, 2 Stepper Buttons, 2 Breadcrumb links

        if (activeTab === 0) counts.link += 1;
        if (activeTab === 1) counts.button += 1; // Change PW
        if (activeTab === 2) counts.input += 1;  // Checkbox

        register('NavigationPatterns', counts);
        return () => unregister('NavigationPatterns');
    }, [register, unregister, activeTab]);

    const treeData = {
        label: 'Root',
        children: [
            {
                label: 'Folder A',
                children: [
                    { label: 'File A1' },
                    { label: 'File A2' }
                ]
            },
            {
                label: 'Folder B',
                children: [
                    {
                        label: 'Subfolder B1',
                        children: [
                            { label: 'File B1-1' }
                        ]
                    }
                ]
            },
            { label: 'File C' }
        ]
    };

    return (
        <section aria-labelledby="nav-heading">
            <h2 id="nav-heading">Complex Navigation Patterns (Count: {7 + (activeTab === 0 ? 1 : 0) + (activeTab === 1 ? 1 : 0) + (activeTab === 2 ? 1 : 0)} + Tree)</h2>
            <div className="control-grid">

                <div className="card">
                    <h3>Tree View (Self-registering)</h3>
                    <div style={{ marginTop: '1rem', border: '1px solid hsl(220, 15%, 25%)', padding: '0.5rem', borderRadius: '4px' }}>
                        <TreeNode
                            node={treeData}
                            trackInteraction={trackInteraction}
                            register={register}
                            unregister={unregister}
                            parentId="TreeRoot"
                        />
                    </div>
                </div>

                <div className="card">
                    <h3>Accessible Tabs ({3 + (activeTab === 0 ? 1 : 0) + (activeTab === 1 ? 1 : 0) + (activeTab === 2 ? 1 : 0)})</h3>
                    <div role="tablist" style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                        {['Account', 'Security', 'Notifications'].map((tab, idx) => (
                            <button
                                key={tab}
                                role="tab"
                                aria-selected={activeTab === idx}
                                aria-controls={`nav-panel-${idx}`}
                                id={`nav-tab-${tab.toLowerCase()}`}
                                tabIndex={activeTab === idx ? 0 : -1}
                                onClick={() => {
                                    setActiveTab(idx);
                                    trackInteraction('Tab', `Switched to ${tab}`);
                                }}
                                style={{
                                    padding: '0.5rem 1rem',
                                    border: 'none',
                                    background: activeTab === idx ? 'hsl(var(--color-accent-primary))' : 'transparent',
                                    color: activeTab === idx ? 'white' : 'hsl(var(--color-text-secondary))',
                                    borderRadius: '16px',
                                    cursor: 'pointer'
                                }}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                    <div
                        role="tabpanel"
                        id={`nav-panel-${activeTab}`}
                        aria-labelledby={`nav-tab-${['account', 'security', 'notifications'][activeTab]}`}
                        style={{ minHeight: '100px' }}
                    >
                        {activeTab === 0 && <p>Account settings content here. <a id="nav-link-edit-profile" href="#" style={{ color: 'hsl(var(--color-accent-primary))' }} onClick={() => trackInteraction('Link', 'Edit Profile')}>Edit Profile</a></p>}
                        {activeTab === 1 && <p>Security settings content here. <button id="nav-btn-change-pw" className="btn btn-secondary" onClick={() => trackInteraction('Button', 'Change Password')}>Change Password</button></p>}
                        {activeTab === 2 && <p>Notification preferences here. <label><input id="nav-check-email-notifs" type="checkbox" onChange={e => trackInteraction('Checkbox', `Email Notifs ${e.target.checked}`)} /> Email</label></p>}
                    </div>
                </div>

                <div className="card">
                    <h3>Stepper / Wizard (2)</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', position: 'relative' }}>
                        <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '2px', background: 'hsl(220, 15%, 30%)', zIndex: 0 }}></div>
                        {[1, 2, 3].map((step, idx) => (
                            <div
                                key={step}
                                style={{
                                    width: '30px',
                                    height: '30px',
                                    borderRadius: '50%',
                                    background: activeStep >= idx ? 'hsl(var(--color-accent-primary))' : 'hsl(220, 15%, 20%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    zIndex: 1,
                                    position: 'relative',
                                    border: '2px solid hsl(var(--color-bg-tertiary))'
                                }}
                            >
                                {step}
                            </div>
                        ))}
                    </div>
                    <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                        <p>Step {activeStep + 1} Content: {['Personal Details', 'Shipping Info', 'Confirmation'][activeStep]}</p>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <button
                            className="btn btn-secondary"
                            disabled={activeStep === 0}
                            id="nav-btn-step-back"
                            onClick={() => {
                                setActiveStep(s => s - 1);
                                trackInteraction('Stepper', 'Back');
                            }}
                        >
                            Back
                        </button>
                        <button
                            className="btn"
                            id="nav-btn-step-next"
                            onClick={() => {
                                if (activeStep < 2) {
                                    setActiveStep(s => s + 1);
                                    trackInteraction('Stepper', 'Next');
                                } else {
                                    trackInteraction('Stepper', 'Finished Wizard');
                                }
                            }}
                        >
                            {activeStep === 2 ? 'Finish' : 'Next'}
                        </button>
                    </div>
                </div>

                <div className="card">
                    <h3>Breadcrumbs (2)</h3>
                    <nav aria-label="Breadcrumb">
                        <ol style={{ listStyle: 'none', padding: 0, display: 'flex', gap: '0.5rem', color: 'hsl(var(--color-text-secondary))' }}>
                            <li><a id="nav-breadcrumb-home" href="#" onClick={(e) => { e.preventDefault(); trackInteraction('Breadcrumb', 'Home') }} style={{ color: 'inherit' }}>Home</a></li>
                            <li>/</li>
                            <li><a id="nav-breadcrumb-products" href="#" onClick={(e) => { e.preventDefault(); trackInteraction('Breadcrumb', 'Products') }} style={{ color: 'inherit' }}>Products</a></li>
                            <li>/</li>
                            <li aria-current="page" style={{ color: 'hsl(var(--color-text-primary))' }}>Electronics</li>
                        </ol>
                    </nav>
                </div>

            </div>
        </section>
    );
}
