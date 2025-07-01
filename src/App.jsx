import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Footer from "./components/Footer";
import Projects from "./components/Projects";
import About from "./components/About";
import Contact from "./components/Contact";
import DiscoverHomepage from "./components/Home";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="app-wrapper">
        {/* Optional Navbar */}
        

        <Routes>
          <Route path="/" element={<DiscoverHomepage />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
