export default function Navbar({ onNavClick }) {
  return (
    <nav className="navbar">
      <h1 className="logo">Project Showcase</h1>
      <div className="nav-links">
        <button onClick={() => onNavClick("home")}>Home</button>
        <button onClick={() => onNavClick("projects")}>Projects</button>
        <button onClick={() => onNavClick("about")}>About</button>
      </div>
    </nav>
  );
}
