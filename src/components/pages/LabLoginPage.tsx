import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FlaskConical, Eye, EyeOff } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LabLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Simulate authentication - in production, this would call a real API
      if (email && password.length >= 6) {
        // Store lab session
        localStorage.setItem('labSession', JSON.stringify({ email, timestamp: Date.now() }));
        navigate('/lab-portal');
      } else {
        setError('Please enter valid credentials');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="bg-light-grey p-12">
            {/* Logo/Icon */}
            <div className="flex justify-center mb-8">
              <div className="bg-foreground p-4">
                <FlaskConical className="w-8 h-8 text-primary-foreground" />
              </div>
            </div>

            {/* Title */}
            <h1 className="font-heading text-3xl font-bold text-foreground text-center mb-2">
              Laboratory Portal
            </h1>
            <p className="font-paragraph text-base text-secondary text-center mb-8">
              Sign in to manage lab tests
            </p>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-destructive text-destructive-foreground p-4 mb-6 text-sm font-paragraph"
              >
                {error}
              </motion.div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="lab-email" className="font-paragraph text-base">
                  Email Address
                </Label>
                <Input
                  id="lab-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="lab@example.com"
                  className="h-12 font-paragraph"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lab-password" className="font-paragraph text-base">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="lab-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-12 font-paragraph pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 rounded-lg font-paragraph font-medium"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-8 pt-8 border-t border-medium-grey">
              <p className="font-paragraph text-sm text-secondary text-center mb-3">
                Demo Credentials:
              </p>
              <div className="bg-background p-4 space-y-2">
                <p className="font-paragraph text-sm text-foreground">
                  <span className="font-medium">Email:</span> lab@example.com
                </p>
                <p className="font-paragraph text-sm text-foreground">
                  <span className="font-medium">Password:</span> password123
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
