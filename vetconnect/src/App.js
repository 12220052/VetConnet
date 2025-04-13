import "./App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
// import SAdminUpload from './SuperAdmin/js/Upload';
import Navbar from "./User/js/Navbar";
import SignupForm from "./User/js/SignupForm";
import VetRegister from "./User/js/VetRegister";
import OTPForm from "./User/js/OTPForm";
import Login from "./User/js/Login";

import SuperAdminDashboard from "./SuperAdmin/js/SuperAdminDashboard.jsx";
import ContentManagement from "./SuperAdmin/js/ContentMgmt.jsx";
import ExpertiseMngt from "./SuperAdmin/js/ExpertiseMngt.jsx";
import Testimonial from "./SuperAdmin/js/Testimonial.jsx";
import PayOut from "./SuperAdmin/js/Payout.jsx";
import RefundForms from "./SuperAdmin/js/RefundForm.jsx";

import AdminDashboard from "./Admin/js/AdminDashboard.jsx";
import ManageVet from "./Admin/js/ManageVet.jsx";
// import VetAppointments from "./SuperAdmin/js/VetAppointments.jsx";

import Review from "./User/js/Review.js";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* <Route path="/" element={<SAdminUpload />} /> */}
          <Route path="/navbar" element={<Navbar />} />
          <Route path="/client" element={<SignupForm />} />
          <Route path="/vet" element={<VetRegister />} />
          <Route path="/otp" element={<OTPForm />} />
          <Route path="/login" element={<Login />} />
          <Route path="/review" element={<Review />} />

          <Route
            path="/SuperAdmindashboard"
            element={<SuperAdminDashboard />}
          />
          <Route path="/contentmgnt" element={<ContentManagement />} />
          <Route path="/expertiseMngt" element={<ExpertiseMngt />} />
          <Route path="/manageTestimonial" element={<Testimonial />} />
          <Route path="/payout" element={<PayOut />} />
          <Route path="/refund-forms" element={<RefundForms />} />
          {/* <Route path="/vet-appointments" element={<VetAppointments />} /> */}

          <Route path="/adminDashboard" element={<AdminDashboard />} />
          <Route path="/vetManage" element={<ManageVet />} />

          {/* <MainLayout /> */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
