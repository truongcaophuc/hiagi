import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          // Buộc Google hiển thị màn hình chọn tài khoản thay vì tự dùng phiên hiện có
          prompt: "select_account",
        },
      },
    }),
  ],
  session: {
    strategy: "jwt" as const,
  },
  callbacks: {
    async jwt({ token, account }: any) {
      // Lưu Google access_token vào JWT của NextAuth để dùng ở server
      if (account?.access_token) {
        (token as any).accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }: any) {
      // Đưa accessToken vào session để API server-side có thể truy cập
      (session as any).accessToken = (token as any).accessToken;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };