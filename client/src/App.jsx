import { Navigate, Route, Routes } from "react-router-dom";
import PublicLayout from "./layouts/PublicLayout";
import AdminLayout from "./layouts/AdminLayout";
import PublicRegistrationPage from "./pages/PublicRegistrationPage";
import SuccessPage from "./pages/SuccessPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import RegistrationDetailPage from "./pages/RegistrationDetailPage";
import PublicVerificationPage from "./pages/PublicVerificationPage";
import PrintAllPage from "./pages/PrintAllPage";
import ExportPage from "./pages/AdminExportPage";
import CamperLoginPage from "./pages/CamperLoginPage";
import CamperLayout from "./layouts/CamperLayout";
import CamperPortalPage from "./pages/CamperPortalPage";
import NotFoundPage from "./pages/NotFoundPage";

const App = () => {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Navigate to="/register/default-event" replace />} />
        <Route path="/register/:eventId" element={<PublicRegistrationPage />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/verify/:registrationId" element={<PublicVerificationPage />} />
      </Route>
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/campers/login" element={<CamperLoginPage />} />
      <Route path="/campers" element={<CamperLayout />}>
        <Route index element={<CamperPortalPage />} />
      </Route>
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="registrations" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="registrations/:id" element={<RegistrationDetailPage />} />
        <Route path="export" element={<ExportPage />} />
        <Route path="print" element={<PrintAllPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;
