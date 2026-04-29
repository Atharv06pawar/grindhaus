import React, { useEffect, useState } from "react";

import { useAuth } from "../context/AuthContext";
import { getCommunityPosts, getProfile } from "../lib/api";
import {
  AppFrame,
  ButtonRow,
  ContentWrap,
  EmptyState,
  HelperText,
  LinkButton,
  Panel,
  PanelHeader,
  SectionText,
  SectionTitle,
  StatCard,
  StatGrid,
  StatLabel,
  StatValue
} from "../styles/ui";

function DashboardPage() {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [postCount, setPostCount] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    Promise.all([getProfile(), getCommunityPosts()])
      .then(([profileResponse, postsResponse]) => {
        if (!isMounted) {
          return;
        }

        setProfile(profileResponse);
        setPostCount(postsResponse.filter((post) => post.userId === currentUser.userId).length);
      })
      .catch((requestError) => {
        if (isMounted) {
          setError(requestError.message);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [currentUser.userId]);

  if (!profile && !error) {
    return (
      <AppFrame>
        <Panel>Loading dashboard...</Panel>
      </AppFrame>
    );
  }

  if (error) {
    return (
      <AppFrame>
        <Panel>{error}</Panel>
      </AppFrame>
    );
  }

  return (
    <AppFrame>
      <ContentWrap>
        <Panel>
          <PanelHeader>
            <div>
              <SectionTitle>Welcome back, {profile.name || currentUser.username}</SectionTitle>
              <SectionText>Pick your next move and keep the training loop tight.</SectionText>
            </div>
          </PanelHeader>
        </Panel>

      <StatGrid>
        <StatCard>
          <StatLabel>Name</StatLabel>
          <StatValue>{profile.name || currentUser.username}</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Weight</StatLabel>
          <StatValue>{profile.weight ? `${profile.weight} kg` : "--"}</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Streak</StatLabel>
          <StatValue>{profile.streak || 0}</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Community Posts</StatLabel>
          <StatValue>{postCount}</StatValue>
        </StatCard>
      </StatGrid>

      <Panel>
        <PanelHeader>
          <div>
            <SectionTitle>Current direction</SectionTitle>
            <SectionText>
              {profile.goal
                ? `Goal locked: ${profile.goal}`
                : "No goal locked yet. Update your profile or tell the AI trainer."}
            </SectionText>
          </div>
        </PanelHeader>

        <ButtonRow>
          <LinkButton to="/workout">Workout</LinkButton>
          <LinkButton to="/technique">Technique</LinkButton>
          <LinkButton to="/nutrition">Nutrition</LinkButton>
          <LinkButton to="/community">Community</LinkButton>
          <LinkButton to="/chat">AI Chat</LinkButton>
          <LinkButton to="/profile">Profile</LinkButton>
        </ButtonRow>
      </Panel>

      <Panel>
        <PanelHeader>
          <div>
            <SectionTitle>Latest memory sync</SectionTitle>
            <SectionText>The chatbot and profile are using the same local persistence layer.</SectionText>
          </div>
        </PanelHeader>

        {profile.lastActivity ? (
          <HelperText>Last activity: {new Date(profile.lastActivity).toLocaleString()}</HelperText>
        ) : (
          <EmptyState>No activity yet. Send the first update through the AI chat.</EmptyState>
        )}
      </Panel>
      </ContentWrap>
    </AppFrame>
  );
}

export default DashboardPage;
