import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Lobby from "./pages/Lobby";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/room/:roomId" element={<Lobby />} />
      </Routes>
    </BrowserRouter>
  );
}

// to reveal network urls :- npx vite --host
