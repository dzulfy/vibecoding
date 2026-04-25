import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthLayout } from "./layouts/AuthLayout";
import { MainLayout } from "./layouts/MainLayout";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Profile } from "./pages/Profile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route element={<MainLayout />}>
          <Route path="/" element={<Profile />} />
        </Route>

        {/* Catch all route - redirect ke home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
