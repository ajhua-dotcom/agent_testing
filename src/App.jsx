import StandardControls from './components/StandardControls';
import SemanticControls from './components/SemanticControls';
import FormControls from './components/FormControls';
import DynamicControls from './components/DynamicControls';
import ComplexControls from './components/ComplexControls';
import EdgeCaseControls from './components/EdgeCaseControls';
import NavigationPatterns from './components/NavigationPatterns';
import OverlayControls from './components/OverlayControls';
import ExtendedCommonControls from './components/ExtendedCommonControls';
import AntiPatternControls from './components/AntiPatternControls';
import GlobalFooter from './components/GlobalFooter';
import { InteractionProvider } from './context/InteractionContext';

function App() {
  return (
    <InteractionProvider>
      <div>
        <main style={{ paddingTop: '2rem', minHeight: '100vh', paddingBottom: '2rem' }}>
          <StandardControls />
          <FormControls />
          <ExtendedCommonControls />
          <SemanticControls />
          <DynamicControls />
          <ComplexControls />
          <EdgeCaseControls />
          <NavigationPatterns />
          <OverlayControls />
          <AntiPatternControls />
        </main>
        <GlobalFooter />
      </div>
    </InteractionProvider>
  );
}

export default App;
