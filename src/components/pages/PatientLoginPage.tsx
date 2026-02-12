import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Eye, EyeOff, ArrowRight, CheckCircle2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Image } from '@/components/ui/image';

export default function PatientLoginPage() {
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
      if (email && password.length >= 6) {
        localStorage.setItem('patientSession', JSON.stringify({ email, timestamp: Date.now() }));
        navigate('/patient-portal');
      } else {
        setError('Please enter valid credentials');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    { icon: CheckCircle2, text: 'View your medical records' },
    { icon: CheckCircle2, text: 'Track prescriptions' },
    { icon: CheckCircle2, text: 'Access lab results' },
    { icon: CheckCircle2, text: 'Manage appointments' },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Login Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="w-full"
            >
              <div className="bg-light-grey p-12 rounded-lg">
                {/* Logo/Icon */}
                <div className="flex items-center gap-3 mb-8">
                  <div className="bg-foreground p-3 rounded-lg">
                    <Heart className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h2 className="font-heading text-2xl font-bold text-foreground">
                    Patient Portal
                  </h2>
                </div>

                {/* Title */}
                <h1 className="font-heading text-3xl font-bold text-foreground mb-2">
                  Welcome Back
                </h1>
                <p className="font-paragraph text-base text-secondary mb-8">
                  Access your health records and manage your care
                </p>

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-destructive text-destructive-foreground p-4 mb-6 text-sm font-paragraph rounded-lg"
                  >
                    {error}
                  </motion.div>
                )}

                {/* Login Form */}
                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="patient-email" className="font-paragraph text-base">
                      Email Address
                    </Label>
                    <Input
                      id="patient-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="patient@example.com"
                      className="h-12 font-paragraph"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="patient-password" className="font-paragraph text-base">
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="patient-password"
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
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 rounded-lg font-paragraph font-medium flex items-center justify-center gap-2"
                  >
                    {isLoading ? 'Signing in...' : (
                      <>
                        Sign In <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                </form>

                {/* Demo Credentials */}
                <div className="mt-8 pt-8 border-t border-medium-grey">
                  <p className="font-paragraph text-sm text-secondary text-center mb-3">
                    Demo Credentials:
                  </p>
                  <div className="bg-background p-4 rounded-lg space-y-2">
                    <p className="font-paragraph text-sm text-foreground">
                      <span className="font-medium">Email:</span> patient@example.com
                    </p>
                    <p className="font-paragraph text-sm text-foreground">
                      <span className="font-medium">Password:</span> password123
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Side - Features & Visual */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden lg:flex flex-col gap-8"
            >
              {/* Feature Image */}
              <div className="relative h-80 rounded-lg overflow-hidden bg-light-grey">
                <Image
                  src="https://static.wixstatic.com/media/98a406_0fd7491d9f3f495d82d948cdc00202de~mv2.png"
                  alt="Patient Portal"
                  className="w-full h-full object-cover opacity-70"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
              </div>

              {/* Features List */}
              <div className="space-y-4">
                <h3 className="font-heading text-xl font-bold text-foreground mb-6">
                  What You Can Access
                </h3>
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    className="flex items-center gap-4"
                  >
                    <feature.icon className="w-5 h-5 text-accent-link flex-shrink-0" />
                    <span className="font-paragraph text-base text-secondary">
                      {feature.text}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Trust Badge */}
              <div className="bg-light-grey p-6 rounded-lg border border-medium-grey">
                <p className="font-paragraph text-sm text-secondary mb-3">
                  🔒 Your data is encrypted and secure
                </p>
                <p className="font-paragraph text-xs text-secondary/70">
                  All patient information is protected with end-to-end encryption and complies with healthcare privacy regulations.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
