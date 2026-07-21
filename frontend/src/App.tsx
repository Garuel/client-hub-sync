import { Toaster } from 'react-hot-toast';
import { BrowserRouter } from 'react-router-dom';
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


      <BrowserRouter>
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <ClientesPage />
        </main>
      </BrowserRouter>
    </>
  );
}

export default App;