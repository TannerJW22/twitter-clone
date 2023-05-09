import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware();

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)"],
};

// type AuthMiddlewareParams = {
//   beforeAuth?: (
//     req: NextRequest,
//     evt: NextEvent
//   ) => undefined | false | true | NextResponse;
//   afterAuth?: (
//     auth: AuthObject,
//     req: NextRequest,
//     evt: NextEvent
//   ) => undefined | NextResponse;
//   publicRoutes?: string[];
//   ignoredRoutes?: string[];
//   debug?: boolean;
//   secretKey?: string;
//   publishableKey?: string;
//   jwtKey?: string;
// };
