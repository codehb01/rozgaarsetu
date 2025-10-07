import { SignIn } from "@clerk/nextjs";

const SignInPage = () => {
  return <SignIn forceRedirectUrl="/auth-redirect" />;
};

export default SignInPage;
