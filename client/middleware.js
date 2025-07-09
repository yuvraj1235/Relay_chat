export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/dashboard", "/chat/:userid"], // ✅ Correct dynamic route syntax
};
