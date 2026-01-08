import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Landing } from './pages/Landing';
import { CitizenDashboard } from './pages/CitizenDashboard';
import { TechnicianDashboard } from './pages/TechnicianDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { LoginPage } from './pages/Login';
import { ProtectedRoute } from './components/ProtectedRoute';
import { IssueProvider } from './context/IssueContext';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <IssueProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            
            
            <Route path="/" element={<Layout><Landing /></Layout>} />
            
            <Route path="/citizen" element={
              <Layout>
                <CitizenDashboard />
              </Layout>
            } />
            
            <Route path="/technician" element={
              <ProtectedRoute allowedRoles={['technician', 'admin']}>
                <Layout>
                  <TechnicianDashboard />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Layout>
                  <AdminDashboard />
                </Layout>
              </ProtectedRoute>
            } />

            {/* Catch all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </IssueProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
