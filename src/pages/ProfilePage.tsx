
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { ArrowLeft, Upload, Camera } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [nicFront, setNicFront] = useState<File | null>(null);
  const [nicBack, setNicBack] = useState<File | null>(null);
  const [selfie, setSelfie] = useState<File | null>(null);

  useEffect(() => {
    if (!user) navigate('/');
  }, [user, navigate]);

  const handleFileUpload = async (file: File, type: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${user?.id}-${type}-${Date.now()}.${fileExt}`;
    const { error } = await supabase.storage
      .from('verification')
      .upload(fileName, file);

    if (error) throw error;
    
    const { data } = supabase.storage.from('verification').getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleSubmitVerification = async () => {
    if (!nicFront || !nicBack || !selfie) {
      toast.error('Please upload all required documents');
      return;
    }

    setUploading(true);
    try {
      const nicFrontUrl = await handleFileUpload(nicFront, 'nic-front');
      const nicBackUrl = await handleFileUpload(nicBack, 'nic-back');
      const selfieUrl = await handleFileUpload(selfie, 'selfie');

      const { error } = await supabase.from('verification_documents').insert({
        user_id: user?.id,
        nic_front: nicFrontUrl,
        nic_back: nicBackUrl,
        selfie: selfieUrl,
      });

      if (error) throw error;
      toast.success('Verification documents submitted successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="theme-blue min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate('/home')} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center">
              <Avatar className="w-32 h-32 protected-content">
                <AvatarImage src={user?.profile_photo} />
                <AvatarFallback className="text-3xl">{user?.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <h2 className="text-2xl font-bold mt-4">{user?.name}</h2>
              <p className="text-muted-foreground capitalize">{user?.role}</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Mobile</Label>
                <Input value={user?.mobile} disabled />
              </div>
              <div>
                <Label>CNIC</Label>
                <Input value={user?.cnic} disabled />
              </div>
              <div>
                <Label>Address</Label>
                <Input value={user?.address} disabled />
              </div>
              <div>
                <Label>Email</Label>
                <Input value={user?.email || 'Not provided'} disabled />
              </div>
            </div>

            {!user?.is_verified && (
              <Card className="bg-yellow-50 border-yellow-200">
                <CardHeader>
                  <CardTitle className="text-lg">Verification Required</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>NIC Front Side</Label>
                    <Input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => setNicFront(e.target.files?.[0] || null)}
                    />
                  </div>
                  <div>
                    <Label>NIC Back Side</Label>
                    <Input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => setNicBack(e.target.files?.[0] || null)}
                    />
                  </div>
                  <div>
                    <Label>Live Selfie</Label>
                    <Input 
                      type="file" 
                      accept="image/*"
                      capture="user"
                      onChange={(e) => setSelfie(e.target.files?.[0] || null)}
                    />
                  </div>
                  <Button 
                    onClick={handleSubmitVerification} 
                    disabled={uploading}
                    className="w-full"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {uploading ? 'Uploading...' : 'Submit for Verification'}
                  </Button>
                </CardContent>
              </Card>
            )}

            {user?.is_verified && !user?.is_approved && (
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4 text-center">
                  <p className="text-blue-700">Your account is pending admin approval</p>
                </CardContent>
              </Card>
            )}

            {user?.is_approved && (
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-4 text-center">
                  <p className="text-green-700 font-semibold">✓ Account Verified & Approved</p>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}