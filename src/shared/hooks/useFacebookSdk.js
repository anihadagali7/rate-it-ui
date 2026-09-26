import { useCallback } from "react";
import { FACEBOOK_APP_ID } from "../../config";

let fbSdkPromise = null;

const loadFacebookSdk = (appId) => {
  if (fbSdkPromise) {
    return fbSdkPromise;
  }

  fbSdkPromise = new Promise((resolve, reject) => {
    if (window.FB) {
      resolve(window.FB);
      return;
    }

    window.fbAsyncInit = () => {
      window.FB.init({
        appId,
        cookie: true,
        xfbml: false,
        version: "v19.0",
      });
      resolve(window.FB);
    };

    const script = document.createElement("script");
    script.src = "https://connect.facebook.net/en_US/sdk.js";
    script.async = true;
    script.defer = true;
    script.onerror = () => {
      fbSdkPromise = null;
      reject(new Error("Failed to load the Facebook SDK"));
    };
    document.body.appendChild(script);
  });

  return fbSdkPromise;
};

const useFacebookSdk = () => {
  const appId = FACEBOOK_APP_ID;

  const login = useCallback(async () => {
    const FB = await loadFacebookSdk(appId);

    return new Promise((resolve, reject) => {
      FB.login(
        (response) => {
          if (response.authResponse?.accessToken) {
            resolve(response.authResponse.accessToken);
          } else {
            reject(new Error("Facebook sign-in was cancelled"));
          }
        },
        { scope: "email,public_profile" }
      );
    });
  }, [appId]);

  return { login };
};

export default useFacebookSdk;
