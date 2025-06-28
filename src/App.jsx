import { useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Projects from "./components/Projects";
import About from "./components/About";
import "./App.css";

function App() {
  const [activePage, setActivePage] = useState("home");

  const renderPage = () => {
    switch (activePage) {
      case "projects":
        return <Projects />;
      case "about":
        return <About />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="app-wrapper">
      <main className="main-content">{renderPage()}</main>
      <Footer />
    </div>
  );
}

export default App;
