import "./App.css";
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
        </Routes>
      </main>
    </div>
  );
}

export default App;
