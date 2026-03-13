
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, MessageCircle, Phone, Mail } from 'lucide-react';

export default function SupportPage() {
  const navigate = useNavigate();

  const handleWhatsApp = () => {
    window.open('https://wa.me/+923001234567', '_blank');
  };

  return (
    <div className="theme-blue min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate('/home')} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <h1 className="text-3xl font-bold mb-6">Support</h1>

        <div className="grid md:grid-cols-2 gap-6 max-w-2xl">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={handleWhatsApp}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-green-500" />
                WhatsApp Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Chat with us on WhatsApp</p>
              <p className="font-semibold mt-2">+92 300 1234567</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-blue-500" />
                Phone Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Call us directly</p>
              <p className="font-semibold mt-2">+92 300 1234567</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-red-500" />
                Email Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Send us an email</p>
              <p className="font-semibold mt-2">support@kamadonline.com</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}