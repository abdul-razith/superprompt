import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Zap, Users, Target, User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Index = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const features = [
    {
      icon: <Zap className="h-8 w-8 text-blue-600" />,
      title: "One Prompt, Many Models",
      description: "Transform your lazy prompts into optimized super prompts tailored for multiple LLMs"
    },
    {
      icon: <Target className="h-8 w-8 text-green-600" />,
      title: "Consistent Results",
      description: "Get reliable, high-quality outputs across different models without manual re-tuning"
    },
    {
      icon: <Users className="h-8 w-8 text-purple-600" />,
      title: "For Everyone",
      description: "Perfect for prompt engineers, content creators, developers, and AI enthusiasts"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">PS</span>
            </div>
            <span className="text-xl font-bold text-gray-900">PromptSync</span>
          </div>
          <div className="flex items-center space-x-3">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    {user.email}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate('/workspace')}>
                    Workspace
                  </DropdownMenuItem>
                  {/* <DropdownMenuItem onClick={() => navigate('/library')}>
                    Library
                  </DropdownMenuItem> */}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate('/login?mode=signup')}>
                  Sign Up
                </Button>
                <Button onClick={() => navigate('/login?mode=signin')}>
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            One prompt, many models.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Consistent results, every time.
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto">
            Stop wrestling with inconsistent LLM outputs. PromptSync transforms your simple prompts into 
            optimized super prompts tailored for multiple open-source models like Llama 3 and Mistral.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="px-8 py-6 text-lg"
              onClick={() => navigate('/workspace')}
            >
              {user ? 'Go to Workspace' : 'Start Optimizing Free'}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            {!user && <p className="text-sm text-gray-500">No signup required • Start immediately</p>}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Built for Modern AI Workflows
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Whether you're a seasoned prompt engineer or just getting started with AI, 
            PromptSync adapts to your needs.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="mx-auto mb-4">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How PromptSync Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Simple, powerful, and designed for consistency across models.
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              { step: "1", title: "Input Your Prompt", desc: "Enter your basic prompt and select your purpose" },
              { step: "2", title: "Choose Models", desc: "Select from Llama 3, Mistral, and other open-source LLMs" },
              { step: "3", title: "Auto-Optimize", desc: "AI transforms your prompt for each model's strengths" },
              { step: "4", title: "Compare & Refine", desc: "See outputs side-by-side and get improvement suggestions" }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg mb-4 mx-auto">
                  {item.step}
                </div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Optimize Your Prompts?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of users who've already improved their AI workflows. 
            Start free, no credit card required.
          </p>
          <Button 
            size="lg" 
            variant="secondary" 
            className="px-8 py-6 text-lg"
            onClick={() => navigate('/workspace')}
          >
            Get Started Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-purple-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">PS</span>
            </div>
            <span className="font-semibold">PromptSync</span>
          </div>
          <p className="text-gray-400">
            © 2024 PromptSync. Built with ❤️ for the AI community.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
