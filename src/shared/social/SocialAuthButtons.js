import { Box } from "@mui/material";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import AuthClient from "../../client/AuthClient";
import Button from "../buttons/Button";
import useAppleSdk from "../hooks/useAppleSdk";
import useFacebookSdk from "../hooks/useFacebookSdk";
import AppleIcon from "../icons/AppleIcon";
import FacebookIcon from "../icons/FacebookIcon";
import GoogleIcon from "../icons/GoogleIcon";

const handleAuthResponse = ({ data }, onSuccess) => {
  onSuccess(data.data.user, data.accessToken);
};

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

  return (
    <Button
      testId="googleSignIn"
      variant="secondary"
      leftIcon={<GoogleIcon />}
      onClick={() => login()}
      sx={{ flex: 1, minWidth: 0 }}
    >
      Google
    </Button>
  );
};

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

const SocialAuthButtons = ({ onSuccess, onError }) => {
  const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <Box sx={{ display: "flex", gap: 1 }}>
        <GoogleButton onSuccess={onSuccess} onError={onError} />
        <FacebookButton onSuccess={onSuccess} onError={onError} />
        <AppleButton onSuccess={onSuccess} onError={onError} />
      </Box>
    </GoogleOAuthProvider>
  );
};

export default SocialAuthButtons;
