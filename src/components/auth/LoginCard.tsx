import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { LoginForm } from "./LoginForm";

interface LoginCardProps {
  defaultMode?: "signin" | "signup";
}

export const LoginCard = ({ defaultMode = "signin" }: LoginCardProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLogin, setIsLogin] = useState(defaultMode === "signin");

  useEffect(() => {
    setIsLogin(defaultMode === "signin");
  }, [defaultMode]);

  return (
    <>
      {user && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
          <p className="text-green-800 mb-2">You're already signed in!</p>
          <Button onClick={() => navigate('/workspace')} className="w-full">
            Go to Workspace
          </Button>
        </div>
      )}

      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            {isLogin ? "Welcome back" : "Create your account"}
          </CardTitle>
          <CardDescription>
            {isLogin 
              ? "Sign in to access AI-powered prompt optimization" 
              : "Join PromptSync for AI-enhanced prompt creation"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm isLogin={isLogin} setIsLogin={setIsLogin} />

          <div className="mt-6">
            <Separator className="my-4" />
            <div className="text-center">
              <p className="text-sm text-gray-600">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
              </p>
              <Button 
                variant="link" 
                onClick={() => {
                  setIsLogin(!isLogin);
                  navigate(`/login?mode=${isLogin ? "signup" : "signin"}`);
                }}
                className="p-0 h-auto font-medium"
              >
                {isLogin ? "Sign up" : "Sign in"}
              </Button>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800 text-center">
              <strong>Free tier includes 50 AI-enhanced prompts/day!</strong> All users get access to Gemini 2.0 Flash AI optimization.
            </p>
          </div>
        </CardContent>
      </Card>
    </>
  );
};
