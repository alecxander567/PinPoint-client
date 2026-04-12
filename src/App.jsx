import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import HomePage from "./pages/HomePage";
import ForgotPasswordPage from "./pages/ForgotPassword";
import ResetPasswordPage from "./pages/ResetPassword";
import AddItemPage from "./pages/AddItemPage";
import FoundItemPage from "./pages/FoundItemPage";
import ReportsPage from "./pages/ReportsPage";
import LostItemsPage from "./pages/LostItemPage";
import ReturnedItemsPage from "./pages/ReturnedItemsPage";
import PublicReportPage from "./pages/PublicReportPage";
import ProfilePage from "./pages/ProfilePage";
import ReportViewPage from "./pages/ReportPageView";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/report/:token" element={<PublicReportPage />} />
        <Route path="/register" element={<SignupPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/add-item" element={<AddItemPage />} />
        <Route path="/found/:itemId" element={<FoundItemPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/lost-item" element={<LostItemsPage />} />
        <Route path="/returned" element={<ReturnedItemsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/report/view/:token" element={<ReportViewPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
