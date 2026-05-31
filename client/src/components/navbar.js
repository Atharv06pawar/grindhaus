import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import BrandWordmark from "./BrandWordmark";
import { useAuth } from "../context/AuthContext";

/* ===== NAV ===== */
const Nav = styled.nav`
  position: fixed;
  top: 0px;                 /* FLOAT distance from top */
  left: 50%;
  transform: translateX(-50%);

  z-index: 1100;

  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;

  width: calc(100% - 40px);  /* keeps margin left + right */
  max-width: 1400px;

  padding: 0.9rem 1.5rem;

  font-family: "Bricolage Grotesque", sans-serif;
`;

/* ===== GLASS TAB BASE ===== */
const GlassTab = styled.div`
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);

  background: rgba(255, 255, 255, 0.06);

  border: 1px solid rgba(255, 255, 255, 0.12);

  border-radius: 18px;

  padding: 10px 18px;

  box-shadow:
    inset 0 1px 1px rgba(255,255,255,0.15),
    0 8px 25px rgba(0,0,0,0.6);

  transition: all 0.3s ease;

  &:hover {
    background: rgba(255,255,255,0.09);
    transform: translateY(-2px);
  }
`;

/* LEFT */
const Left = styled(GlassTab)`
  display: flex;
  align-items: center;
  justify-self: start;
`;

const LogoLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  cursor: pointer;
  outline: none;
`;

const LogoText = styled(BrandWordmark)`
  transition: color 0.28s ease, letter-spacing 0.28s ease, text-shadow 0.28s ease, transform 0.28s ease;

  ${LogoLink}:hover &,
  ${LogoLink}:focus-visible & {
    color: #ffffff;
    letter-spacing: 0.34em;
    text-shadow: 0 0 18px rgba(255, 69, 58, 0.34);
    transform: translateY(-1px);
  }
`;

/* CENTER */
const CenterLinks = styled(GlassTab)`
  display: flex;
  justify-content: center;
  justify-self: center;
  gap: 2rem;
  padding: 20px 25px 20px 25px;
  border-radius: 10px;

  a {
    color: white;
    text-decoration: none;
    font-size: 1.05rem;

    &:hover {
      color: #ff453a;
    }
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

/* RIGHT */
const Right = styled.div`
  display: flex;
  align-items: center;
  justify-self: end;
  gap: 12px;
`;

/* Glow Button */
const GlowButton = styled(Link)`
  color: #f5f5f5;
  padding: 0.6rem 1.3rem;
  border-radius: 10px;
  text-decoration: none;
  font-weight: bold;

  background: rgba(255, 69, 58, 0.13);
  border: 1px solid rgba(255, 69, 58, 0.35);
  box-shadow: 0 0 22px rgba(255, 69, 58, 0.14);
  transition: background 0.28s ease, border-color 0.28s ease, box-shadow 0.28s ease, transform 0.28s ease;

  &:hover {
    background: rgba(255, 69, 58, 0.22);
    border-color: rgba(255, 69, 58, 0.72);
    box-shadow: 0 0 26px rgba(255, 69, 58, 0.26);
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

/* Hamburger */
const Hamburger = styled.button`
  display: none;
  background: transparent;
  border: none;
  cursor: pointer;

  span {
    display: block;
    width: 26px;
    height: 3px;
    background: white;
    margin: 5px 0;
    border-radius: 2px;
  }

  @media (max-width: 768px) {
    display: block;
  }
`;

/* ===== Mobile Overlay ===== */
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.7);
  backdrop-filter: blur(6px);
  z-index: 1200;
`;

/* ===== Mobile Menu ===== */
const MobileMenu = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  width: 85%;
  max-width: 320px;

  background: rgba(20,20,20,0.95);
  border-radius: 20px;
  padding: 2rem;

  display: flex;
  flex-direction: column;
  gap: 1.4rem;
  text-align: center;

  box-shadow: 0 20px 60px rgba(0,0,0,0.8);
  z-index: 1300;
`;

const MobileLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-size: 1.3rem;

  &:hover {
    color: #ff453a;
  }
`;

const MobileLogin = styled(GlowButton)`
  display: block;
`;

const AccountButton = styled(GlowButton)`
  text-transform: none;
`;

/* ===== COMPONENT ===== */
const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { currentUser, isAuthenticated } = useAuth();
  const accountLabel = isAuthenticated ? currentUser?.username || "Profile" : "Login / Signup";
  const accountPath = isAuthenticated ? "/profile" : "/login";

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = menuOpen ? "hidden" : "";

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  return (
    <>
      {menuOpen && <Overlay onClick={() => setMenuOpen(false)} />}

      {menuOpen && (
        <MobileMenu onClick={(e) => e.stopPropagation()}>
          <MobileLink to="/workout" onClick={() => setMenuOpen(false)}>Workouts</MobileLink>
          <MobileLink to="/technique" onClick={() => setMenuOpen(false)}>Technique</MobileLink>
          <MobileLink to="/nutrition" onClick={() => setMenuOpen(false)}>Nutrition</MobileLink>
          <MobileLink to="/community" onClick={() => setMenuOpen(false)}>Community</MobileLink>
          {isAuthenticated ? (
            <MobileLink to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</MobileLink>
          ) : null}
          <MobileLogin to={accountPath} onClick={() => setMenuOpen(false)}>
            {accountLabel}
          </MobileLogin>
        </MobileMenu>
      )}

      <Nav>
        <Left>
          <LogoLink to="/" aria-label="REDAESTH home">
            <LogoText size="md" />
          </LogoLink>
        </Left>

        <CenterLinks>
          <Link to="/workout">Workouts</Link>
          <Link to="/technique">Technique</Link>
          <Link to="/nutrition">Nutrition</Link>
          <Link to="/community">Community</Link>
        </CenterLinks>

        <Right>
          <AccountButton to={accountPath}>{accountLabel}</AccountButton>

          <Hamburger onClick={() => setMenuOpen(true)}>
            <span />
            <span />
            <span />
          </Hamburger>
        </Right>
      </Nav>
    </>
  );
};

export default React.memo(Navbar);
