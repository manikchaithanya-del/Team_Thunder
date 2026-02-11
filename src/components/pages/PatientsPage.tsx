import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Plus, User } from 'lucide-react';
import { BaseCrudService } from '@/integrations';
import { Patients } from '@/entities';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patients[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    gender: '',
    contactNumber: '',
    address: '',
    medicalHistorySummary: '',
    allergies: '',
    currentStatus: 'Active',
  });

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      setIsLoading(true);
      const result = await BaseCrudService.getAll<Patients>('patients');
      setPatients(result.items);
    } catch (error) {
      console.error('Error loading patients:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPatient = async () => {
    try {
      const newPatient = {
        _id: crypto.randomUUID(),
        ...formData,
      };
      
      setPatients([newPatient, ...patients]);
      setIsDialogOpen(false);
      
      await BaseCrudService.create('patients', newPatient);
      
      setFormData({
        fullName: '',
        dateOfBirth: '',
        gender: '',
        contactNumber: '',
        address: '',
        medicalHistorySummary: '',
        allergies: '',
        currentStatus: 'Active',
      });
    } catch (error) {
      console.error('Error adding patient:', error);
      loadPatients();
    }
  };

  const filteredPatients = patients.filter((patient) =>
    patient.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.contactNumber?.includes(searchQuery)
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="max-w-[100rem] mx-auto px-8 py-16">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h1 className="font-heading text-5xl font-bold text-foreground mb-4">
                Patient Directory
              </h1>
              <p className="font-paragraph text-lg text-secondary">
                Browse and manage all registered patients
              </p>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-6 rounded-lg">
                  <Plus className="w-5 h-5 mr-2" />
                  Add New Patient
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="font-heading text-2xl">Add New Patient</DialogTitle>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="Enter patient full name"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactNumber">Contact Number</Label>
                    <Input
                      id="contactNumber"
                      value={formData.contactNumber}
                      onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                      placeholder="Enter contact number"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Enter address"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="medicalHistorySummary">Medical History Summary</Label>
                    <Textarea
                      id="medicalHistorySummary"
                      value={formData.medicalHistorySummary}
                      onChange={(e) => setFormData({ ...formData, medicalHistorySummary: e.target.value })}
                      placeholder="Enter medical history"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="allergies">Allergies</Label>
                    <Input
                      id="allergies"
                      value={formData.allergies}
                      onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                      placeholder="Enter known allergies"
                    />
                  </div>

                  <Button
                    onClick={handleAddPatient}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 rounded-lg"
                  >
                    Add Patient
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="mb-8">
            <div className="relative max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary" />
              <Input
                type="text"
                placeholder="Search by name or contact number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 rounded-lg"
              />
            </div>
          </div>

          <div className="min-h-[400px]">
            {isLoading ? null : filteredPatients.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPatients.map((patient, index) => (
                  <motion.div
                    key={patient._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <Link
                      to={`/patients/${patient._id}`}
                      className="block bg-light-grey p-8 hover:bg-medium-grey transition-colors"
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-12 h-12 bg-foreground rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-6 h-6 text-primary-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-heading text-xl font-semibold text-foreground mb-1 truncate">
                            {patient.fullName}
                          </h3>
                          <p className="font-paragraph text-sm text-secondary">
                            {patient.gender} • {patient.dateOfBirth}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-paragraph text-sm text-secondary">Contact:</span>
                          <span className="font-paragraph text-sm text-foreground">{patient.contactNumber}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-paragraph text-sm text-secondary">Status:</span>
                          <span className={`font-paragraph text-sm font-medium ${
                            patient.currentStatus === 'Active' ? 'text-foreground' : 'text-secondary'
                          }`}>
                            {patient.currentStatus}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <User className="w-16 h-16 text-secondary mx-auto mb-4" />
                <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
                  No patients found
                </h3>
                <p className="font-paragraph text-base text-secondary">
                  {searchQuery ? 'Try adjusting your search' : 'Add your first patient to get started'}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
