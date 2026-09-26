import { Box } from "@mui/material";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import AuthClient from "../../client/AuthClient";
import { GOOGLE_CLIENT_ID } from "../../config";
import Button from "../buttons/Button";
import useAppleSdk from "../hooks/useAppleSdk";
import useFacebookSdk from "../hooks/useFacebookSdk";
import AppleIcon from "../icons/AppleIcon";
import FacebookIcon from "../icons/FacebookIcon";
import GoogleIcon from "../icons/GoogleIcon";

const handleAuthResponse = ({ data }, onSuccess) => {
  onSuccess(data.data.user, data.accessToken);
};

const GoogleButtonBase = ({ onClick }) => (
  <Button
    testId="googleSignIn"
    variant="secondary"
    leftIcon={<GoogleIcon />}
    onClick={onClick}
    sx={{ flex: 1, minWidth: 0 }}
  >
    Google
  </Button>
);

const GoogleButton = ({ onSuccess, onError }) => {
  const login = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async ({ code }) => {
      try {
        const response = await AuthClient.loginWithGoogle(code);
        handleAuthResponse(response, onSuccess);
      } catch (error) {
        onError?.(error);
      }
    },
    onError: () => onError?.(new Error("Google sign-in failed")),
  });

  return <GoogleButtonBase onClick={() => login()} />;
};

// Google's SDK throws during render when it has no client ID, which would take down
// the whole page. Keep the button and report the failure on click instead.
const UnconfiguredGoogleButton = ({ onError }) => (
  <GoogleButtonBase
    onClick={() => onError?.(new Error("VITE_GOOGLE_CLIENT_ID is not set"))}
  />
);

const FacebookButton = ({ onSuccess, onError }) => {
  const { login } = useFacebookSdk();

  const handleClick = async () => {
    try {
      const accessToken = await login();
      const response = await AuthClient.loginWithFacebook(accessToken);
      handleAuthResponse(response, onSuccess);
    } catch (error) {
      onError?.(error);
    }
  };

  return (
    <Button
      testId="facebookSignIn"
      variant="secondary"
      leftIcon={<FacebookIcon />}
      onClick={handleClick}
      sx={{ flex: 1, minWidth: 0 }}
    >
      Facebook
    </Button>
  );
};

const AppleButton = ({ onSuccess, onError }) => {
  const { signIn } = useAppleSdk();

  const handleClick = async () => {
    try {
      const result = await signIn();
      const response = await AuthClient.loginWithApple({
        identityToken: result.authorization.id_token,
        user: result.user,
      });
      handleAuthResponse(response, onSuccess);
    } catch (error) {
      onError?.(error);
    }
  };

  return (
    <Button
      testId="appleSignIn"
      variant="secondary"
      leftIcon={<AppleIcon />}
      onClick={handleClick}
      sx={{ flex: 1, minWidth: 0 }}
    >
      Apple
    </Button>
  );
};

// Facebook and Apple are temporarily disabled here — Facebook's app dashboard
// setup isn't working yet, and Apple's web flow needs a real HTTPS domain we
// don't have configured yet. Add "facebook" / "apple" back once those are
// ready; no other changes needed, both buttons are already fully wired up.
const DEFAULT_ENABLED_PROVIDERS = ["google"];

const SocialAuthButtons = ({
  onSuccess,
  onError,
  providers = DEFAULT_ENABLED_PROVIDERS,
}) => {
  return (
    <Box sx={{ display: "flex", gap: 1 }}>
      {providers.includes("google") ? (
        GOOGLE_CLIENT_ID ? (
          <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <GoogleButton onSuccess={onSuccess} onError={onError} />
          </GoogleOAuthProvider>
        ) : (
          <UnconfiguredGoogleButton onError={onError} />
        )
      ) : null}
      {providers.includes("facebook") ? (
        <FacebookButton onSuccess={onSuccess} onError={onError} />
      ) : null}
      {providers.includes("apple") ? (
        <AppleButton onSuccess={onSuccess} onError={onError} />
      ) : null}
    </Box>
  );
};

export default SocialAuthButtons;
