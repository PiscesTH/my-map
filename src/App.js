import "./App.css";
import ImageUploader from "./ImageUploader";
import KakaoMap from "./KakaoMap";
import Location from "./Location";
import Header from "./Header";
import { Route, Routes } from "react-router-dom";
import "react-calendar/dist/Calendar.css";
// import {AuthProvider} from "./AuthContext"
// import LoginPage from "./LoginPage";
// import SignupPage from "./SignupPage";

function App() {
  return (
    // <AuthProvider>
    <div className="container">
      <Header></Header>
      <main>
        <Routes>
          <Route exact="true" path="/" element={<KakaoMap />}></Route>
          <Route path="/location" element={<Location />}></Route>
          <Route path="/record" element={<ImageUploader />}></Route>
          {/* <Route path="/login" element={<LoginPage />}></Route> */}
          {/* <Route path="/register" element={<SignupPage />}></Route> */}
        </Routes>
      </main>
    </div>
    // </AuthProvider>
  );
}

export default App;
