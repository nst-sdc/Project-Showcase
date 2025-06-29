import { useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Projects from "./components/Projects";
import About from "./components/About";
import Contact from "./components/Contact";
import Hero from "./components/Hero";
import Stats from "./components/Stats";
import Testimonials from "./components/Testimonials";
import "./App.css";
import DiscoverHomepage from "./components/Home";

function App() {
  const [activePage, setActivePage] = useState("home");

  const renderPage = () => {
    switch (activePage) {
      case "projects":
        return <Projects />;
      case "about":
        return <About />;
      case "contact":
        return <Contact />;
      default:
        return (
          <>
            <Hero />
            <Stats />
            <Projects preview={true} />
            <Testimonials />
          </>
        );
    }
  };

  return (
    <div className="app-wrapper">
      <DiscoverHomepage/>
      <Footer />
    </div>
  );
}

export default App;