import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const cookieStore = await cookies();
  const accessToken: RequestCookie | undefined = cookieStore.get(
    "hangout|accessToken"
  );
  if (accessToken === undefined) {
    console.log("[middleware] access token not present");
    return NextResponse.redirect(new URL("/login", request.url));
  } else {
    console.log("[middleware] access token is present");
    //TODO: do a backend call here to verify the token
    return NextResponse.next();
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    "/profile/:userId",
    "/create",
    "/notifications",
    "/comments/:postId",
  ],
};
