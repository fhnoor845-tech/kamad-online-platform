
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { Leaf, User, Factory, TrendingUp, BookOpen, MessageCircle, Info, LogOut } from 'lucide-react';

export default function HomePage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [news, setNews] = useState<string[]>([]);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    fetchNews();
  }, [user, navigate]);

  const fetchNews = async () => {
    const { data } = await supabase
      .from('news')
      .select('content')
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    
    if (data) {
      setNews(data.map(n => n.content));
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const menuItems = [
    { icon: User, label: 'Profile', path: '/profile', color: 'bg-blue-500' },
    { icon: Factory, label: 'Mills', path: '/mills', color: 'bg-blue-600' },
    { icon: TrendingUp, label: 'Market', path: '/market', color: 'bg-blue-700' },
    { icon: BookOpen, label: 'Khata', path: '/khata', color: 'bg-blue-800' },
    { icon: MessageCircle, label: 'Support', path: '/support', color: 'bg-blue-500' },
    { icon: Info, label: 'About Us', path: '/about', color: 'bg-blue-600' },
  ];

  return (
    <div className="theme-green min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="slideshow-image absolute inset-0 bg-cover bg-center" 
             style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1920&h=1080&fit=crop)' }} />
        <div className="slideshow-image absolute inset-0 bg-cover bg-center opacity-0" 
             style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1920&h=1080&fit=crop)' }} />
        <div className="slideshow-image absolute inset-0 bg-cover bg-center opacity-0" 
             style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?w=1920&h=1080&fit=crop)' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="cube-3d w-16 h-16 bg-green-500 rounded-lg shadow-2xl flex items-center justify-center">
              <Leaf className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Kamad Online</h1>
              <p className="text-green-200">Welcome, {user?.name}</p>
            </div>
          </div>
          <Button variant="destructive" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        <div className="bg-green-900/80 backdrop-blur rounded-lg p-4 mb-8 overflow-hidden">
          <div className="ticker-content whitespace-nowrap text-white text-lg">
            {news.length > 0 ? news.join(' • ') : 'Welcome to Kamad Online - Your complete sugarcane management solution'}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {menuItems.map((item) => (
            <Card 
              key={item.path}
              className="cursor-pointer hover:scale-105 transition-transform bg-white/95 backdrop-blur"
              onClick={() => navigate(item.path)}
            >
              <CardContent className="p-6 text-center">
                <div className={`${item.color} w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center`}>
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-lg">{item.label}</h3>
              </CardContent>
            </Card>
          ))}
        </div>

        {user?.role === 'admin' && (
          <Card className="mt-8 bg-red-50 border-red-200">
            <CardContent className="p-6">
              <Button 
                variant="destructive" 
                className="w-full"
                onClick={() => navigate('/admin')}
              >
                Admin Panel
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}