
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Leaf } from 'lucide-react';

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className="theme-blue min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate('/home')} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <div className="flex items-center gap-3 mb-4">
              <Leaf className="w-12 h-12 text-green-500" />
              <CardTitle className="text-3xl">About Kamad Online</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg">
              <strong>Kamad Online (Noor Project)</strong> is a comprehensive digital platform designed to revolutionize sugarcane farming management in Pakistan.
            </p>
            <p>
              Our platform connects farmers (Kisan), contractors (Thekedar), and supervisors (Jamadar) in a seamless digital ecosystem that handles everything from hiring to accounting.
            </p>
            <h3 className="text-xl font-semibold mt-6">Key Features:</h3>
            <ul className="list-disc list-inside space-y-2">
              <li>Digital QR Contracts with signatures</li>
              <li>Automated weight-based accounting</li>
              <li>Real-time market rates</li>
              <li>Secure verification system</li>
              <li>Comprehensive Khata management</li>
              <li>Direct support via WhatsApp</li>
            </ul>
            <p className="mt-6 text-muted-foreground">
              Version 1.0.0 | © 2026 Kamad Online - Noor Project
            </p>
          </CardContent