import React, { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

import BootLoader from "../components/BootLoader";
import { useAuth } from "../context/AuthContext";
import { signUp } from "../lib/api";
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

function SignupPage() {
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
      const response = await signUp(normalizedUsername, normalizedPassword);
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
          <SectionTitle>Create your account</SectionTitle>
          <SectionText>
            Start a private profile, persistent AI memory, and a community trail of completed work.
          </SectionText>
          <BulletList>
            <li>User session stored locally for fast local development.</li>
            <li>Profile data persisted in the unified Node backend.</li>
            <li>Trainer memory synced to the AI companion on every chat session.</li>
          </BulletList>
        </div>

        <HelperText>Register once. Then log everything that matters.</HelperText>
      </AuthHero>

      <AuthCard>
        <SectionTitle>Signup</SectionTitle>
        <SectionText>Use a short username. Keep the flow clean.</SectionText>

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
              autoComplete="new-password"
              required
              minLength={8}
            />
          </Field>

          {error ? <ErrorText>{error}</ErrorText> : null}

          <PrimaryButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create account"}
          </PrimaryButton>
        </AuthForm>

        <SectionText>
          Already registered? <GhostLink to="/login">Login</GhostLink>
        </SectionText>
      </AuthCard>
    </AuthShell>
  );
}

export default SignupPage;
