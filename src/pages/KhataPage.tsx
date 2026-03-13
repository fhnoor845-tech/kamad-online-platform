
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase, KhataEntry } from '@/lib/supabase';
import { toast } from 'sonner';
import { ArrowLeft, Plus, Edit } from 'lucide-react';
import { format } from 'date-fns';

export default function KhataPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [entries, setEntries] = useState<KhataEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    fetchEntries();
  }, [user, navigate]);

  const fetchEntries = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('khata_entries')
      .select('*')
      .eq('farmer_id', user?.id)
      .order('entry_date', { ascending: false });

    if (error) {
      toast.error('Failed to load entries');
    } else {
      setEntries(data || []);
    }
    setLoading(false);
  };

  const handleAddEntry = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const { error } = await supabase.from('khata_entries').insert({
      farmer_id: user?.id,
      contract_id: formData.get('contract_id') as string,
      entry_date: formData.get('entry_date') as string,
      weight_maunds: parseFloat(formData.get('weight_maunds') as string),
      rate_per_maund: parseFloat(formData.get('rate_per_maund') as string),
      cpr: formData.get('cpr') as string,
      notes: formData.get('notes') as string,
    });

    if (error) {
      toast.error('Failed to add entry');
    } else {
      toast.success('Entry added successfully');
      setDialogOpen(false);
      fetchEntries();
    }
  };

  return (
    <div className="theme-blue min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <Button variant="ghost" onClick={() => navigate('/home')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Entry
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Khata Entry</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddEntry} className="space-y-4">
                <div>
                  <Label>Date</Label>
                  <Input name="entry_date" type="date" required />
                </div>
                <div>
                  <Label>Weight (Maunds)</Label>
                  <Input name="weight_maunds" type="number" step="0.01" required />
                </div>
                <div>
                  <Label>Rate per Maund</Label>
                  <Input name="rate_per_maund" type="number" step="0.01" required />
                </div>
                <div>
                  <Label>CPR</Label>
                  <Input name="cpr" />
                </div>
                <div>
                  <Label>Notes</Label>
                  <Input name="notes" />
                </div>
                <Button type="submit" className="w-full">Add Entry</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Khata Ledger</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading...</p>
            ) : entries.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No entries yet</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Weight (Maunds)</TableHead>
                    <TableHead>Rate</TableHead>
                    <TableHead>Total Earnings</TableHead>
                    <TableHead>CPR</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {entries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>{format(new Date(entry.entry_date), 'dd/MM/yyyy')}</TableCell>
                      <TableCell>{entry.weight_maunds}</TableCell>
                      <TableCell>Rs. {entry.rate_per_maund}</TableCell>
                      <TableCell className="font-semibold">Rs. {entry.total_earnings}</TableCell>
                      <TableCell>{entry.cpr || '-'}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}