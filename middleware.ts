import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { NextRequest, NextResponse } from "next/server";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const accessToken: RequestCookie | undefined = request.cookies.get(
    "hangout-session|accessToken"
  );
  if (!accessToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  } else {
    //TODO: do a backend call here to verify the token
    return NextResponse.next();
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/profile", "/create", "/notifications", "/posts/:postId/comments"],
};
