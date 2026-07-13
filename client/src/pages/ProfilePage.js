import React, { useEffect, useState } from "react";

import { useAuth } from "../context/AuthContext";
import { getProfile, updateProfile } from "../lib/api";
import {
  AppFrame,
  ButtonRow,
  ContentWrap,
  Field,
  FormGrid,
  Input,
  Label,
  Panel,
  PanelHeader,
  PrimaryButton,
  SectionText,
  SectionTitle
} from "../styles/ui";

function ProfilePage() {
  const { currentUser, logout } = useAuth();
  const [form, setForm] = useState({
    name: "",
    weight: "",
    goal: ""
  });
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let isMounted = true;

    getProfile()
      .then((response) => {
        if (!isMounted) {
          return;
        }

        setProfile(response);
        setForm({
          name: response.name || "",
          weight: response.weight || "",
          goal: response.goal || ""
        });
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

  const handleChange = (field) => (event) => {
    setForm((currentForm) => ({ ...currentForm, [field]: event.target.value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError("");

    try {
      const updatedProfile = await updateProfile({
        name: form.name,
        weight: form.weight,
        goal: form.goal
      });

      setProfile(updatedProfile);
      setForm({
        name: updatedProfile.name || "",
        weight: updatedProfile.weight || "",
        goal: updatedProfile.goal || ""
      });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AppFrame>
      <ContentWrap>
      <Panel>
        <PanelHeader>
          <div>
            <SectionTitle>Editable profile</SectionTitle>
            <SectionText>Name, weight, and goal sync back into the C++ trainer memory.</SectionText>
          </div>
        </PanelHeader>

        <FormGrid>
          <Field>
            <Label>Username</Label>
            <Input value={currentUser.username} disabled />
          </Field>
          <Field>
            <Label>Name</Label>
            <Input value={form.name} onChange={handleChange("name")} />
          </Field>
          <Field>
            <Label>Weight (kg)</Label>
            <Input type="number" value={form.weight} onChange={handleChange("weight")} />
          </Field>
          <Field>
            <Label>Goal</Label>
            <Input value={form.goal} onChange={handleChange("goal")} />
          </Field>
        </FormGrid>

        <ButtonRow style={{ marginTop: 18 }}>
          <PrimaryButton type="button" onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save profile"}
          </PrimaryButton>
          <PrimaryButton type="button" onClick={logout}>
            Logout
          </PrimaryButton>
        </ButtonRow>

        {error ? <SectionText>{error}</SectionText> : null}
      </Panel>

      <Panel>
        <PanelHeader>
          <div>
            <SectionTitle>Read-only stats</SectionTitle>
            <SectionText>These come back from the same local persistence used by chat.</SectionText>
          </div>
        </PanelHeader>

        <FormGrid>
          <Field>
            <Label>Current streak</Label>
            <Input value={profile?.streak || 0} disabled />
          </Field>
          <Field>
            <Label>Last activity</Label>
            <Input value={profile?.lastActivity ? new Date(profile.lastActivity).toLocaleString() : "--"} disabled />
          </Field>
        </FormGrid>
      </Panel>

      <Panel>
        <PanelHeader>
          <div>
            <SectionTitle>Support the Developer</SectionTitle>
            <SectionText>RedAesth is built by a solo developer and remains completely free with no ads. If you find value in the platform, consider supporting its development.</SectionText>
          </div>
        </PanelHeader>

        <ButtonRow>
          <PrimaryButton as="a" href="https://buymeacoffee.com/redaesth" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
            ☕ Buy me a coffee
          </PrimaryButton>
        </ButtonRow>
      </Panel>
      </ContentWrap>
    </AppFrame>
  );
}

export default ProfilePage;
