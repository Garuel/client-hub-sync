// src/App.tsx
import { Toaster } from 'react-hot-toast';
import { ClientesPage } from './features/clientes/components/clientes-page/clients-page';

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#333',
            color: '#fff',
          },
        }}
      />

      <main style={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
        <ClientesPage />
      </main>
    </>
  );
}

export default App;