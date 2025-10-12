import { useState } from 'react';
import { useLocation } from 'react-router-dom';   // ✅ جديد
import logo from '../../assets/logo.png';
import './Navbar.css';
import SearchBarMobile from '../SearchBar/SearchBarMobile';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';

export default function NavbarMobile() {
  const [cartCount, setCartCount] = useState(0);
  const { pathname } = useLocation();             // ✅ جديد

  // ✅ خبّي البحث فـ /ecoles وأي مسار يبدأ بها (مثلاً /ecoles/:slug/niveaux)
  const hideSearch = pathname === '/ecoles' || pathname.startsWith('/ecoles/');

  const handleMobileSearch = (q) => {
    console.log('mobile search:', q);
    // navigate(`/search?q=${encodeURIComponent(q)}`)
  };

  return (
    <>
      <nav className="navbar navbar-light ">
        <div className="container d-flex align-items-center justify-content-between p-0">
          {/* زر الهامبرغر */}
          <button
            className="btn border-0 bg-transparent me-4 px-2"
            style={{ width: 44 }}
            data-bs-toggle="offcanvas"
            data-bs-target="#mobileMenu"
            aria-controls="mobileMenu"
            aria-label="Open menu"
          >
            <i className="bi bi-list fs-1" />
          </button>

          {/* اللوغو */}
          <div className="d-flex align-items-center flex-grow-1 justify-content-center">
            <img src={logo} alt="MarocEdu Logo" width={30} height={30} style={{ marginRight: 10 }} />
          </div>

          {/* أيقونات اليمين */}
          <div className="d-flex align-items-center gap-3 me-2" style={{ minWidth: 56 }}>
            {/* <i className="bi bi-person fs-1"></i> */}
            <button
              className="btn p-0 border-0 bg-transparent position-relative d-flex align-items-center justify-content-center"
              style={{ width: 40, height: 40 }}
            >
              {/* أيقونة FontAwesome */}
              <FontAwesomeIcon icon={faCartShopping} size="lg" />

              {/* البادج */}
              <span
                className="position-absolute top-0 start-75 translate-middle badge rounded-pill bg-danger"
                style={{ fontSize: '0.65rem', minWidth: '16px', height: '16px' }}
              >
                1
              </span>
            </button>


          </div>
        </div>

        {/* Offcanvas */}
        <div className="offcanvas offcanvas-start" id="mobileMenu" tabIndex="-1" aria-labelledby="mobileMenuLabel">
          <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="mobileMenuLabel">Menu</h5>
            <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
          </div>

          <div className="offcanvas-body p-0">
            <ul className="list-unstyled m-0">
              <li><a href="#" className="d-flex align-items-center justify-content-between py-3 px-3 text-decoration-none">
                <span className="fw-semibold">Livres</span><i className="bi bi-chevron-right"></i></a></li>
              <li><a href="#" className="d-flex align-items-center justify-content-between py-3 px-3 text-decoration-none">
                <span className="fw-semibold">Fournitures</span><i className="bi bi-chevron-right"></i></a></li>
              <li><a href="#" className="d-flex align-items-center justify-content-between py-3 px-3 text-decoration-none">
                <span className="fw-semibold">Ecoles</span><i className="bi bi-chevron-right"></i></a></li>
              <li><a href="#" className="d-flex align-items-center justify-content-between py-3 px-3 text-decoration-none">
                <span className="fw-semibold">Librairies</span><i className="bi bi-chevron-right"></i></a></li>
            </ul>
          </div>
        </div>
      </nav>

      {/* ✅ ما نْبيّنش SearchBar فـ /ecoles/* */}
      {/* {!hideSearch && <SearchBarMobile onSubmit={handleMobileSearch} />} */}
    </>
  );
}
