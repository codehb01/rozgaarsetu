import { SignIn } from "@clerk/nextjs";

const SignInPage = () => {
  return <SignIn forceRedirectUrl="/api/auth/callback" />;
};

export default SignInPage;
