import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const cookieStore = await cookies();
  const accessToken: RequestCookie | undefined = cookieStore.get(
    "hangout-session|accessToken"
  );
  if (accessToken === undefined) {
    return NextResponse.redirect(new URL("/login", request.url));
  } else {
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
