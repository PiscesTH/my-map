import "./App.css";
import ImageUploader from "./ImageUploader";
import KakaoMap from "./KakaoMap";
import Location from "./Location";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <div className="container">
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
