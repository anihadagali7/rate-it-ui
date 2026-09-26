import { useCallback } from "react";
import { APPLE_CLIENT_ID, APPLE_REDIRECT_URI } from "../../config";

let appleSdkPromise = null;

const loadAppleSdk = ({ clientId, redirectURI }) => {
  if (appleSdkPromise) {
    return appleSdkPromise;
  }

  appleSdkPromise = new Promise((resolve, reject) => {
    if (window.AppleID) {
      resolve(window.AppleID);
      return;
    }

    const script = document.createElement("script");
    script.src =
      "https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js";
    script.async = true;
    script.onload = () => {
      window.AppleID.auth.init({
        clientId,
        scope: "name email",
        redirectURI,
        usePopup: true,
      });
      resolve(window.AppleID);
    };
    script.onerror = () => {
      appleSdkPromise = null;
      reject(new Error("Failed to load the Apple SDK"));
    };
    document.body.appendChild(script);
  });

  return appleSdkPromise;
};

const useAppleSdk = () => {
  const clientId = APPLE_CLIENT_ID;
  const redirectURI = APPLE_REDIRECT_URI;

  const signIn = useCallback(async () => {
    const AppleID = await loadAppleSdk({ clientId, redirectURI });
    // Resolves { authorization: { id_token, code }, user? } — `user` is
    // only ever present on the very first authorization.
    return AppleID.auth.signIn();
  }, [clientId, redirectURI]);

  return { signIn };
};

export default useAppleSdk;
