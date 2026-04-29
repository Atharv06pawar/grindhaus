import React, { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

import BootLoader from "../components/BootLoader";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../lib/api";
import {
  AuthCard,
  AuthForm,
  AuthHero,
  AuthShell,
  BulletList,
  ErrorText,
  Field,
  GhostLink,
  HelperText,
  Input,
  Label,
  PrimaryButton,
  SectionText,
  SectionTitle
} from "../styles/ui";

function LoginPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isInitializing, login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectTarget = location.state?.from || "/dashboard";

  if (isInitializing) {
    return <BootLoader />;
  }

  if (isAuthenticated) {
    return <Navigate to={redirectTarget} replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const normalizedUsername = username.trim();
    const normalizedPassword = password.trim();

    if (!normalizedUsername || !normalizedPassword) {
      setError("Username and password are required.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const response = await loginUser(normalizedUsername, normalizedPassword);
      login(response);
      navigate(redirectTarget, { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthShell>
      <AuthHero>
        <div>
          <SectionTitle>GrindHaus System</SectionTitle>
          <SectionText>
            One login. One dashboard. One local trainer engine that remembers your numbers and pushes
            progress.
          </SectionText>
          <BulletList>
            <li>Strict AI trainer backed by local C++ memory.</li>
            <li>Profile and streak synced across chat and dashboard.</li>
            <li>Community feed for accountability and proof of work.</li>
          </BulletList>
        </div>

        <HelperText>Discipline scales when the system stays simple.</HelperText>
      </AuthHero>

      <AuthCard>
        <SectionTitle>Login</SectionTitle>
        <SectionText>Enter your username and get back to work.</SectionText>

        <AuthForm onSubmit={handleSubmit}>
          <Field>
            <Label>Username</Label>
            <Input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
              required
            />
          </Field>

          <Field>
            <Label>Password</Label>
            <Input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
            />
          </Field>

          {error ? <ErrorText>{error}</ErrorText> : null}

          <PrimaryButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Checking..." : "Login"}
          </PrimaryButton>
        </AuthForm>

        <SectionText>
          Need an account? <GhostLink to="/signup">Create one</GhostLink>
        </SectionText>
      </AuthCard>
    </AuthShell>
  );
}

export default LoginPage;
