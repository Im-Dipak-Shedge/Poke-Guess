import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import WaitingRoom from "./pages/Lobby";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/room/:roomId" element={<WaitingRoom />} />
      </Routes>
    </BrowserRouter>
  );
}
