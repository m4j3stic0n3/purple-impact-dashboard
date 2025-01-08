import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1A0B2E] p-4">
      <Card className="w-full max-w-md p-6 bg-dashboard-card/60 backdrop-blur-lg border-purple-800/20">
        <h1 className="text-2xl font-bold text-center mb-6 text-white">Welcome to Purple Impact</h1>
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#9333ea',
                  brandAccent: '#7e22ce',
                }
              }
            }
          }}
          providers={[]}
        />
      </Card>
    </div>
  );
};

export default Login;