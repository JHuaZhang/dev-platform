import { StoreContext } from '@/stores';
import stores from '@/stores';
import AppRouter from '@/router';

function App() {
  return (
    <StoreContext.Provider value={stores}>
      <AppRouter />
    </StoreContext.Provider>
  );
}

export default App;
