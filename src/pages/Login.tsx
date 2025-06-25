import { LoginHeader } from "@/components/auth/LoginHeader";
import { LoginCard } from "@/components/auth/LoginCard";
import { useSearchParams } from "react-router-dom";

const Login = () => {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <LoginHeader />
        <LoginCard defaultMode={mode === "signup" ? "signup" : "signin"} />
      </div>
    </div>
  );
};

export default Login;
