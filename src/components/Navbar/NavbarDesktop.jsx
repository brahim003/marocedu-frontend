import { useState } from "react";
import logo from "../../assets/logo.png";   
import "./Navbar.css";                      

export default function NavbarDesktop() {
  const [cartCount, setCartCount] = useState(0);

  return (
    <nav className="navbar navbar-light px-0 ">
      <div className="container-fluid d-flex justify-content-between align-items-center px-5">

        {/* Logo + Brand */}
        <div className="d-flex align-items-center ">
          <img
            src={logo}
            alt="MarocEdu Logo"
            width={40}
            height={40}
            style={{ display: "block", marginRight: 10 }}
          />

          <a className="navbar-brand fw-semibold" href="#">MarocEdu</a>
        </div>

        {/* Links */}
        <div className="flex-grow-1 d-flex justify-content-center ">
          <ul className="nav rounded-5 py-1 custom-width justify-content-center gap-4 navbar-links m-0">
            <li className="nav-item"><a className="nav-link" href="#">Livres</a></li>
            <li className="nav-item"><a className="nav-link" href="#">Fournitures</a></li>
            <li className="nav-item"><a className="nav-link" href="#">Ecoles</a></li>
            <li className="nav-item"><a className="nav-link" href="#">Librairies</a></li>
          </ul>
        </div>

        {/* Icons */}
        <div className="d-flex align-items-center ">
          <button
            className="btn p-0 border-0 bg-transparent position-relative me-4"
            onClick={() => setCartCount(c => c + 1)}
            aria-label={`Cart with ${cartCount} items`}
          >
            <i className="bi bi-cart-fill fs-2"></i>
            {cartCount > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {cartCount}
              </span>
            )}
          </button>
          <i className="bi bi-person-fill fs-1"></i>
        </div>

      </div>
    </nav>
  );
}
