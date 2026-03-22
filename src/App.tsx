import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import Login from "./pages/Login";
import WithDOM from "./pages/WithDOM";
import { AppLayout } from "./components/layout/AppLayout";
import WithCanvas from "./pages/WithCanvas";
import NotFound from "./pages/NotFound";
import { useStore } from "./store/RootStore";
import { observer } from "mobx-react-lite";

function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
  allowedRoles?: string[];
}) {
  const { authStore } = useStore();

  if (!authStore.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <AppLayout>{children}</AppLayout>;
}

const AppRoutes = observer(() => {
  const { authStore } = useStore();

  const homeRedirect = () => {
    if (!authStore.isAuthenticated) return "/login";

    return "/with-canvas";
  };

  return (
    <Routes>
      <Route path="/" element={<Navigate to={homeRedirect()} replace />} />

      <Route path="/login" element={<Login />} />

      <Route
        path="/with-dom"
        element={
          <ProtectedRoute>
            <WithDOM />
          </ProtectedRoute>
        }
      />

      <Route
        path="/with-canvas"
        element={
          <ProtectedRoute>
            <WithCanvas />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
});

function App() {
  return (
    <>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </>
  );
}

export default App;
