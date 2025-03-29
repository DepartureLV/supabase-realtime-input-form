import { userAgent, type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";
import { v4 as uuidv4 } from 'uuid';

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export function getDevice(request: NextRequest) {
  const { device } = userAgent(request);
  return device;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
