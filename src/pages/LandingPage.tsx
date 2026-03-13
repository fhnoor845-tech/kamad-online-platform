
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Leaf, MessageCircle } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const [loading, setLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      await signIn(
        formData.get('email') as string,
        formData.get('password') as string
      );
      toast.success('Login successful!');
      navigate('/home');
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!acceptedTerms) {
      toast.error('Please accept Terms & Conditions');
      return;
    }
    
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      await signUp({
        email: formData.get('email') as string,
        password: formData.get('password') as string,
        mobile: formData.get('mobile') as string,
        name: formData.get('name') as string,
        role: formData.get('role') as 'kisan' | 'thekedar' | 'jamadar',
        cnic: formData.get('cnic') as string,
        address: formData.get('address') as string,
      });
      toast.success('Registration successful! Please verify your account.');
      navigate('/home');
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoMode = () => {
    toast.info('Demo mode - Limited features available');
    navigate('/home');
  };

  const handleForgotPassword = () => {
    const adminWhatsApp = '+923001234567';
    window.open(`https://wa.me/${adminWhatsApp}?text=I need help resetting my password`, '_blank');
  };

  return (
    <div className="theme-green min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="slideshow-image absolute inset-0 bg-cover bg-center" 
             style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1920&h=1080&fit=crop)' }} />
        <div className="slideshow-image absolute inset-0 bg-cover bg-center opacity-0" 
             style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1920&h=1080&fit=crop)' }} />
        <div className="slideshow-image absolute inset-0 bg-cover bg-center opacity-0" 
             style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?w=1920&h=1080&fit=crop)' }} />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 min-h-screen flex flex-col items-center justify-center">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <Leaf className="w-12 h-12 text-green-400" />
            <h1 className="text-5xl font-bold text-white">Kamad Online</h1>
          </div>
          <p className="text-xl text-green-100">Noor Project - Complete Sugarcane Management</p>
        </div>

        <Card className="w-full max-w-2xl bg-white/95 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Welcome</CardTitle>
            <CardDescription className="text-center">Login or create your account</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" name="password" type="password" required />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="link" 
                    className="w-full text-sm"
                    onClick={handleForgotPassword}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Forgot Password? Contact Admin on WhatsApp
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select name="role" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kisan">Kisan (Farmer)</SelectItem>
                        <SelectItem value="thekedar">Thekedar (Contractor)</SelectItem>
                        <SelectItem value="jamadar">Jamadar (Supervisor)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" name="name" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mobile">Mobile Number</Label>
                      <Input id="mobile" name="mobile" type="tel" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cnic">CNIC Number</Label>
                    <Input id="cnic" name="cnic" placeholder="12345-1234567-1" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" name="address" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input id="signup-email" name="email" type="email" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input id="signup-password" name="password" type="password" required />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="terms" 
                      checked={acceptedTerms}
                      onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
                    />
                    <label htmlFor="terms" className="text-sm">
                      I accept the Terms & Conditions
                    </label>
                  </div>
                  <Button type="submit" className="w-full" disabled={loading || !acceptedTerms}>
                    {loading ? 'Creating Account...' : 'Sign Up'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6">
              <Button variant="outline" className="w-full" onClick={handleDemoMode}>
                Try Demo Mode
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}