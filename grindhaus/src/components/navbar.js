// Navbar.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import logo from '../assets/nav/logo.png';

// Gradient animation
const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const Nav = styled.nav`
  position: sticky;
  top: 0;
  z-index: 1100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #111;
  padding: 0.5rem 2rem;
  font-family: 'Bangers', cursive;
  box-shadow: 0 2px 12px rgba(245, 241, 241, 0.25);
`;

const LeftGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
`;

const Logo = styled.img`
  height: 40px;
  width: auto;
  cursor: pointer;
`;

const Hamburger = styled.button`
  display: none;
  flex-direction: column;
  cursor: pointer;
  background: transparent;
  border: 0;
  padding: 4px;
  margin-left: 12px;

  span {
    background: white;
    height: 3px;
    width: 26px;
    margin: 4px 0;
    border-radius: 2px;
    display: block;
  }

  @media (max-width: 768px) {
    display: flex;
  }
`;

const NavLinks = styled.ul`
  display: flex;
  align-items: center;
  list-style: none;
  gap: 1.5rem;
  margin: 0;
  padding: 0;

  a {
    color: white;
    text-decoration: none;
    transition: color 0.3s ease;
    &:hover {
      color: #ff003c;
    }
  }

  /* Mobile slide-out */
  @media (max-width: 768px) {
    position: absolute;
    top: 60px;
    right: 0;
    flex-direction: column;
    background: #111;
    width: 240px;
    padding: 1rem;
    gap: 1rem;
    transition: transform 0.3s ease;
    z-index: 1101; /* above overlay */
    border-left: 1px solid rgba(255,255,255,0.08);
    box-shadow: -6px 0 18px rgba(0,0,0,0.5);

    transform: ${({ open }) => (open ? 'translateX(0)' : 'translateX(100%)')};
  }
`;

/* Base button style */
const GlowButtonBase = styled(Link)`
  color: white;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  text-decoration: none;
  font-weight: bold;
  background: linear-gradient(270deg, #ff003c, #8a2be2);
  background-size: 400% 400%;
  animation: ${gradientShift} 4s ease infinite;
  box-shadow: 0 0 10px #ff003c, 0 0 20px #8a2be2;
  transition: all 0.3s ease;
  white-space: nowrap;

  &:hover {
    animation: none;
    background: #ff003c;
    box-shadow: 0 0 20px #ff003c, 0 0 40px #ff003c;
  }
`;

/* Desktop-only button (right side) */
const GlowButtonDesktop = styled(GlowButtonBase)`
  @media (max-width: 768px) {
    display: none;
  }
`;

/* Mobile-only button (inside the hamburger menu) */
const GlowButtonMobile = styled(GlowButtonBase)`
  display: none;
  @media (max-width: 768px) {
    display: block;
    width: 100%;
    text-align: center;
  }
`;

/* Full-screen overlay (clicking it closes menu) */
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.55);
  backdrop-filter: blur(2px);
  z-index: 1100; /* below Nav but above page content */
`;

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  // Lock body scroll when menu is open and add Escape handler
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : 'auto';

    const onKey = (e) => {
      if (e.key === 'Escape' && menuOpen) setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = 'auto';
    };
  }, [menuOpen]);

  // Close menu when clicking overlay
  const handleOverlayClick = () => setMenuOpen(false);

  return (
    <>
      {/* Render overlay only when menu is open; clicking it closes the menu */}
      {menuOpen && <Overlay onClick={handleOverlayClick} />}

      <Nav>
        <LeftGroup>
          <Link to="/" onClick={() => setMenuOpen(false)}>
            <Logo src={logo} alt="GrindHaus Logo" />
          </Link>

          <NavLinks open={menuOpen} onClick={(e) => e.stopPropagation()}>
            <li><Link to="/workout" onClick={() => setMenuOpen(false)}>Workouts</Link></li>
            <li><Link to="/technique" onClick={() => setMenuOpen(false)}>Technique</Link></li>
            <li><Link to="/nutrition" onClick={() => setMenuOpen(false)}>Nutrition</Link></li>
            <li><Link to="/community" onClick={() => setMenuOpen(false)}>Community</Link></li>

            {/* Mobile-only login button inside the slide-out */}
            <li>
              <GlowButtonMobile to="/login" onClick={() => setMenuOpen(false)}>LogIn/SignUp</GlowButtonMobile>
            </li>
          </NavLinks>
        </LeftGroup>

        {/* Right: Desktop-only login button */}
        <GlowButtonDesktop to="/login">LogIn/SignUp</GlowButtonDesktop>

        {/* Hamburger (right aligned) */}
        <Hamburger
          onClick={(e) => {
            e.stopPropagation(); // don't let the page-level click handlers catch this
            setMenuOpen((s) => !s);
          }}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </Hamburger>
      </Nav>
    </>
  );
};

export default Navbar;
