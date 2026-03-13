
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Factory } from 'lucide-react';

export default function MillsPage() {
  const navigate = useNavigate();

  const mills = [
    { name: 'Al-Noor Sugar Mills', location: 'Faisalabad', capacity: '5000 TPD' },
    { name: 'Green Valley Mills', location: 'Jhang', capacity: '4500 TPD' },
    { name: 'Punjab Sugar Mills', location: 'Gujranwala', capacity: '6000 TPD' },
  ];

  return (
    <div className="theme-blue min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate('/home')} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <h1 className="text-3xl font-bold mb-6">Sugar Mills</h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mills.map((mill, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-blue-500 p-3 rounded-lg">
                    <Factory className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle>{mill.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Location: {mill.location}</p>
                <p className="text-muted-foreground">Capacity: {mill.capacity}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}