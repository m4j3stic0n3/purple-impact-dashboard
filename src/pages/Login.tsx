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
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-[#1a237e] to-[#311b92] p-4">
      {/* Logo Section */}
      <div className="mt-8 mb-12">
        <div className="flex items-center gap-2">
          <img 
            src="/lovable-uploads/57a38a35-6ea4-42c7-bd1a-54fef1960bd0.png" 
            alt="PEAK Logo" 
            className="w-12 h-12"
          />
          <span className="text-white text-3xl font-bold">PEAK</span>
        </div>
      </div>

      {/* Login Card */}
      <Card className="w-full max-w-md p-8 bg-white shadow-xl rounded-2xl">
        <h1 className="text-2xl font-bold text-center mb-8 text-gray-800">Welcome Back!</h1>
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#1a237e',
                  brandAccent: '#311b92',
                  defaultButtonBackground: '#1a237e',
                  defaultButtonBackgroundHover: '#311b92',
                },
                borderRadii: {
                  button: '8px',
                  input: '8px',
                },
              }
            },
            className: {
              container: 'flex flex-col gap-4',
              label: 'text-sm font-medium text-gray-700',
              input: 'w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent',
              button: 'w-full p-3 text-white font-medium rounded-lg transition-colors',
              anchor: 'text-blue-600 hover:text-blue-700 text-sm font-medium',
            }
          }}
          providers={[]}
        />
      </Card>
    </div>
  );
};

export default Login;