import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ req, token }) => {
      // Bảo vệ các route admin
      if (req.nextUrl.pathname.startsWith("/admin")) {
        return token?.role === "admin";
      }
      
      if (
        req.nextUrl.pathname.startsWith("/profile") || 
        req.nextUrl.pathname.startsWith("/orders")
      ) {
        return !!token;
      }
      
      return true;
    },
  },
});

export const config = {
  matcher: ["/admin/:path*", "/profile/:path*", "/orders/:path*"],
};
