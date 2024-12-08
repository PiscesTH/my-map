import "./App.css";
import ImageUploader from "./ImageUploader";
import KakaoMap from "./KakaoMap";
import Location from "./Location";
import Header from "./Header";
import { Route, Routes } from "react-router-dom";
import "react-calendar/dist/Calendar.css";

function App() {
  return (
    <div className="container">
      <Header></Header>
      <main>
        <Routes>
          <Route exact="true" path="/" element={<KakaoMap />}></Route>
          <Route path="/location" element={<Location />}></Route>
          <Route path="/record" element={<ImageUploader />}></Route>
        </Routes>
      </main>
    </div>
  );
}

export default App;
