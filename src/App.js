import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SAdminUpload from './SuperAdmin/js/Upload';
// import UserBanner from './User/js/Banner';
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SAdminUpload />} />
          {/* <Route path="/banner" element={<UserBanner />} /> */}
      
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

