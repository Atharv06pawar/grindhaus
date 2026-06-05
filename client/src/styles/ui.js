import { motion } from "framer-motion";
import { Link, NavLink } from "react-router-dom";
import styled, { createGlobalStyle, css } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  :root {
    color-scheme: dark;
  }

  body {
    overflow-x: hidden;
    background:
      radial-gradient(circle at top, rgba(255, 69, 58, 0.1), transparent 28%),
      linear-gradient(180deg, #0b0b0b 0%, #070708 100%);
  }
`;

export const LoaderOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: grid;
  place-items: center;
  background:
    radial-gradient(circle at center, rgba(255, 69, 58, 0.2), transparent 42%),
    linear-gradient(180deg, #090909 0%, #050505 100%);
`;

export const LoaderPulse = styled.div`
  min-width: 172px;
  min-height: 72px;
  padding: 18px 24px;
  display: grid;
  place-items: center;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.45);
  animation: loaderBreath 1.8s ease-in-out infinite;

  @keyframes loaderBreath {
    0% {
      transform: scale(0.92);
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.35);
    }
    50% {
      transform: scale(1);
      box-shadow: 0 20px 52px rgba(255, 69, 58, 0.22);
    }
    100% {
      transform: scale(0.92);
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.35);
    }
  }
`;

export const LoaderLogo = styled.span`
  font-family: "Bangers", "Passero One", Impact, sans-serif;
  font-size: 1.05rem;
  font-weight: 700;
  letter-spacing: 0.26em;
  color: #f5f5f5;
  text-transform: uppercase;
  white-space: nowrap;

  &::before {
    content: "REDAESTH";
  }
`;

export const RouteLoaderOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: grid;
  place-items: center;
  background:
    radial-gradient(circle at center, rgba(255, 69, 58, 0.12), transparent 38%),
    rgba(7, 7, 8, 0.32);
  backdrop-filter: blur(8px);
  pointer-events: none;
`;

const buttonStyles = css`
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 14px 18px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease;

  &:hover {
    transform: translateY(-1px);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.55;
    transform: none;
  }
`;

export const AppFrame = styled.div`
  min-height: 100vh;
  padding: 128px 24px 24px;

  @media (max-width: 768px) {
    padding: 112px 16px 16px;
  }
`;

export const AppGrid = styled.div`
  min-height: calc(100vh - 48px);
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 20px;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

export const Sidebar = styled.aside`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 28px;
  background: rgba(17, 17, 19, 0.92);
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.36);
  position: sticky;
  top: 24px;
  height: fit-content;

  @media (max-width: 980px) {
    position: static;
  }
`;

export const BrandStack = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

export const BrandImage = styled.img`
  width: 52px;
  height: 52px;
  border-radius: 16px;
  object-fit: cover;
  background: rgba(255, 255, 255, 0.06);
`;

export const BrandTitle = styled.div`
  display: flex;
  align-items: center;
  font-weight: 800;
`;

export const BrandSubtitle = styled.div`
  margin-top: 4px;
  color: rgba(255, 255, 255, 0.62);
  font-size: 0.94rem;
`;

export const NavRail = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 8px;

  @media (max-width: 980px) {
    flex-direction: row;
    flex-wrap: wrap;
  }
`;

export const NavItem = styled(NavLink)`
  padding: 13px 14px;
  border-radius: 14px;
  color: rgba(255, 255, 255, 0.72);
  font-weight: 600;
  transition: background 0.2s ease, color 0.2s ease;

  &.active {
    background: rgba(255, 69, 58, 0.18);
    color: #ffffff;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.06);
    color: #ffffff;
  }
`;

export const SidebarFooter = styled.div`
  margin-top: auto;
  padding-top: 8px;
`;

export const ContentWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

export const TopBar = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 22px 24px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 28px;
  background: rgba(17, 17, 19, 0.88);

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const PageTitle = styled.h1`
  margin: 0;
  font-family: "Bangers", "Passero One", Impact, sans-serif;
  font-size: clamp(1.8rem, 2vw, 2.5rem);
  letter-spacing: -0.05em;
`;

export const PageSubtitle = styled.p`
  margin: 8px 0 0;
  color: rgba(255, 255, 255, 0.64);
  max-width: 720px;
  line-height: 1.6;
`;

export const UserChip = styled.div`
  padding: 10px 14px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.72);
  font-size: 0.95rem;
`;

export const PageBody = styled.main`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

export const MotionPage = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

export const Panel = styled.section`
  padding: 24px;
  border-radius: 28px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(14, 14, 15, 0.88);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.26);
`;

export const PanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: flex-start;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const SectionTitle = styled.h2`
  margin: 0;
  font-family: "Bangers", "Passero One", Impact, sans-serif;
  font-size: 1.2rem;
  letter-spacing: -0.04em;
`;

export const SectionText = styled.p`
  margin: 8px 0 0;
  color: rgba(255, 255, 255, 0.64);
  line-height: 1.6;
`;

export const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const StatCard = styled.div`
  padding: 20px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
`;

export const StatLabel = styled.div`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.92rem;
`;

export const StatValue = styled.div`
  margin-top: 12px;
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: -0.05em;
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const Label = styled.span`
  font-size: 0.94rem;
  color: rgba(255, 255, 255, 0.72);
`;

export const Input = styled.input`
  width: 100%;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.04);
  color: #ffffff;
  padding: 15px 16px;
  outline: none;

  &:focus {
    border-color: rgba(255, 69, 58, 0.7);
  }
`;

export const Textarea = styled.textarea`
  width: 100%;
  min-height: 120px;
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.04);
  color: #ffffff;
  padding: 15px 16px;
  resize: vertical;
  outline: none;

  &:focus {
    border-color: rgba(255, 69, 58, 0.7);
  }
`;

export const ButtonRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;

export const PrimaryButton = styled.button`
  ${buttonStyles};
  background: linear-gradient(135deg, #ff453a 0%, #ff6a5f 100%);
  color: #ffffff;
`;

export const SecondaryButton = styled.button`
  ${buttonStyles};
  background: rgba(255, 255, 255, 0.05);
  color: #ffffff;
`;

export const LinkButton = styled(Link)`
  ${buttonStyles};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  color: #ffffff;
`;

export const GhostLink = styled(Link)`
  color: #ff9c75;
  font-weight: 700;
`;

export const DangerButton = styled(SecondaryButton)`
  border-color: rgba(255, 69, 58, 0.28);
  color: #ffb5af;
`;

export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(255, 69, 58, 0.14);
  color: #ffb5af;
  font-size: 0.84rem;
  font-weight: 700;
`;

export const ErrorText = styled.p`
  margin: 0;
  color: #ff8b8b;
`;

export const HelperText = styled.p`
  margin: 0;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.6;
`;

export const AuthShell = styled.div`
  min-height: 100vh;
  padding: 128px 24px 24px;
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 18px;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`;

export const AuthHero = styled(Panel)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: calc(100vh - 48px);

  @media (max-width: 960px) {
    min-height: auto;
  }
`;

export const AuthCard = styled(Panel)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: calc(100vh - 48px);

  @media (max-width: 960px) {
    min-height: auto;
  }
`;

export const AuthForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 28px;
`;

export const BulletList = styled.ul`
  margin: 20px 0 0;
  padding-left: 18px;
  color: rgba(255, 255, 255, 0.72);
  line-height: 1.8;
`;

export const ChatLayout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.5fr) minmax(320px, 0.8fr);
  gap: 18px;

  @media (max-width: 1080px) {
    grid-template-columns: 1fr;
  }
`;

export const MessageList = styled.div`
  min-height: 480px;
  max-height: 68vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding-right: 8px;
`;

export const MessageBubble = styled.div`
  align-self: ${({ $from }) => ($from === "user" ? "flex-end" : "flex-start")};
  max-width: 78%;
  padding: 14px 16px;
  border-radius: ${({ $from }) => ($from === "user" ? "18px 18px 6px 18px" : "18px 18px 18px 6px")};
  background: ${({ $from }) => ($from === "user" ? "#ff453a" : "rgba(255,255,255,0.06)")};
  line-height: 1.6;
  white-space: pre-wrap;
`;

export const ComposerRow = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 18px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const FeedList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const PostCard = styled.div`
  padding: 20px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
`;

export const MetaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 12px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.92rem;
`;

export const ActionRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 16px;
`;

export const ActionButton = styled.button`
  ${buttonStyles};
  padding: 10px 14px;
  background: rgba(255, 255, 255, 0.04);
  color: #ffffff;
`;

export const EmptyState = styled.div`
  padding: 26px;
  border-radius: 24px;
  border: 1px dashed rgba(255, 255, 255, 0.14);
  color: rgba(255, 255, 255, 0.62);
  text-align: center;
`;
