import { ReactNode } from "react";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      paddingTop: '10rem',
      minHeight: '100vh',
      backgroundColor: '#f9fafb'
    }}>
      {children}
    </div>
  );
};

export default AuthLayout;
