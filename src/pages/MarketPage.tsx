
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, TrendingUp, TrendingDown } from 'lucide-react';

export default function MarketPage() {
  const navigate = useNavigate();

  return (
    <div className="theme-blue min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate('/home')} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <h1 className="text-3xl font-bold mb-6">Market Rates</h1>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                Current Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-green-600">Rs. 450</p>
              <p className="text-muted-foreground">Per Maund</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Today's Update</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Last updated: {new Date().toLocaleString()}</p>
              <p className="text-sm mt-2">Market is stable with good demand</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}