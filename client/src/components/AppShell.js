import React from "react";
import { AnimatePresence } from "framer-motion";
import { Outlet, useLocation } from "react-router-dom";

import BrandWordmark from "./BrandWordmark";
import { useAuth } from "../context/AuthContext";
import {
  AppFrame,
  AppGrid,
  Badge,
  BrandStack,
  BrandSubtitle,
  BrandTitle,
  ContentWrap,
  DangerButton,
  MotionPage,
  NavItem,
  NavRail,
  PageBody,
  PageSubtitle,
  PageTitle,
  Sidebar,
  SidebarFooter,
  TopBar,
  UserChip
} from "../styles/ui";

const routeMeta = {
  "/dashboard": {
    title: "Dashboard",
    subtitle: "Your central command for discipline, current stats, and next actions."
  },
  "/chat": {
    title: "AI Trainer",
    subtitle: "Context-aware coaching, persistent memory, and direct performance guidance."
  },
  "/community": {
    title: "Community",
    subtitle: "Post training updates, track accountability, and keep the feed sharp."
  },
  "/profile": {
    title: "Profile",
    subtitle: "Update the numbers that drive your plan. Keep the engine memory aligned."
  }
};

const navigationItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/chat", label: "Chat" },
  { href: "/community", label: "Community" },
  { href: "/profile", label: "Profile" }
];

const ShellSidebar = React.memo(function ShellSidebar({ onLogout }) {
  return (
    <Sidebar>
      <BrandStack>
        <div>
          <BrandTitle>
            <BrandWordmark size="sm" />
          </BrandTitle>
          <BrandSubtitle>AI-powered performance ecosystem</BrandSubtitle>
        </div>
      </BrandStack>

      <Badge>Local AI + Unified backend</Badge>

      <NavRail>
        {navigationItems.map((item) => (
          <NavItem key={item.href} to={item.href}>
            {item.label}
          </NavItem>
        ))}
      </NavRail>

      <SidebarFooter>
        <DangerButton type="button" onClick={onLogout}>
          Logout
        </DangerButton>
      </SidebarFooter>
    </Sidebar>
  );
});

function AppShell() {
  const location = useLocation();
  const { currentUser, logout } = useAuth();
  const meta = routeMeta[location.pathname] || routeMeta["/dashboard"];

  return (
    <AppFrame>
      <AppGrid>
        <ShellSidebar onLogout={logout} />

        <ContentWrap>
          <TopBar>
            <div>
              <PageTitle>{meta.title}</PageTitle>
              <PageSubtitle>{meta.subtitle}</PageSubtitle>
            </div>
            <UserChip>{currentUser?.username}</UserChip>
          </TopBar>

          <PageBody>
            <AnimatePresence mode="wait">
              <MotionPage
                key={location.pathname}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              >
                <Outlet />
              </MotionPage>
            </AnimatePresence>
          </PageBody>
        </ContentWrap>
      </AppGrid>
    </AppFrame>
  );
}

export default AppShell;
