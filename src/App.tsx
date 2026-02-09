import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { AuthGuard } from "./components/AuthGuard/AuthGuard";
import { WelcomePage } from "./components/WelcomePage";
import { LoginPage } from "./features/auth/pages/LoginPage";
import { RegistrationPage } from "./features/auth/pages/RegistrationPage";
import { PublicFilesPage } from "./features/files/pages/PublicFilesPage";
import { UserFilesPage } from "./features/files/pages/UserFilesPage";

function App() {
  return (
    <BrowserRouter>
      <main>
        <Toaster position="top-right" reverseOrder={false} />
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registration" element={<RegistrationPage />} />
          <Route element={<AuthGuard />}>
            <Route path="/public" element={<PublicFilesPage />} />
            <Route path="/user" element={<UserFilesPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
