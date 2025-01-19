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
    let res;
    switch (data.type) {
      case "renew-token-request":
        console.log("renew-token-request received");
        res = await renewToken(
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
      case "fetch-posts-request":
        console.log("fetch-posts-request received");
        res = await fetchPosts(
          data.lat,
          data.lon,
          data.min,
          data.max,
          data.pageNumber,
          data.backendUrl
        );
        console.log("firing fetch-posts-response");
        event.source.postMessage({
          type: "fetch-posts-response",
          response: res,
        });
        break;
      default:
    }
  });
};
messageEvent();

async function renewToken(refreshToken, deviceInfo, backendUrl) {
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
}

// defining data fetching function
async function fetchPosts(lat, lon, min, max, pageNumber, backendUrl) {
  const getPostsReqBody = {
    lat: lat,
    lon: lon,
    minSearchRadius: min,
    maxSearchRadius: max,
    pageNumber: pageNumber,
  };
  const response = await fetch(`${backendUrl}/post/near-me`, {
    method: "POST",
    headers: new Headers({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(getPostsReqBody),
  });
  if (response.ok) {
    const data = await response.json();
    return {
      posts: data.posts,
      totalPages: data.totalPages,
    };
  } else {
    console.error("could not fetch posts from backend");
  }
}
