const installEvent = () => {
  self.addEventListener("install", () => {
    console.log("token renew service worker installed");
  });
};
installEvent();

const activateEvent = () => {
  self.addEventListener("activate", () => {
    console.log("token renew service worker activated");
  });
};
activateEvent();

const messageEvent = () => {
  self.addEventListener("message", async (event) => {
    const data = event.data;
    switch (data.type) {
      case "renew-token-request":
        console.log("renew-token-request received");
        const res = await renewToken(
          data.refreshToken,
          data.deviceInfo,
          data.backendUrl
        );
        console.log("firing access token renew response");
        event.source.postMessage({
          type: "renew-token-response",
          accessToken: res,
        });
        break;
      default:
    }
  });
};
messageEvent();

const renewToken = async (refreshToken, deviceInfo, backendUrl) => {
  try {
    const response = await fetch(`${backendUrl}/auth-api/v1/public/renew`, {
      method: "POST",
      headers: new Headers({
        os: deviceInfo.os.name,
        "screen-height": String(deviceInfo.screen.height),
        "screen-width": String(deviceInfo.screen.width),
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({ token: refreshToken }),
    });
    if (response.ok) {
      console.log("access token renewed");
      const data = await response.json();
      console.log("response received: ", data);
      return data.accessToken;
    } else {
      console.error(
        "access token renew request to backend returned error response",
        response
      );
    }
  } catch (error) {
    console.error("error occured while renewing access token. error: ", error);
  }
};
