import { Toaster } from 'react-hot-toast';
import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './features/auth/context/auth.context';
import { router } from './core/router/app.router';

function App() {
  return (
    <AuthProvider>
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

      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <RouterProvider router={router} />
      </main>
    </AuthProvider>
  );
}

export default App;