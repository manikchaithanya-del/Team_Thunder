import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Pill, FlaskConical, CheckCircle } from 'lucide-react';
import { BaseCrudService } from '@/integrations';
import { Patients, Prescriptions, LabTests } from '@/entities';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function DoctorPortalPage() {
  const [patients, setPatients] = useState<Patients[]>([]);
  const [successMessage, setSuccessMessage] = useState('');
  
  const [prescriptionForm, setPrescriptionForm] = useState({
    patientId: '',
    medicationName: '',
    dosage: '',
    instructions: '',
    doctorName: '',
  });

  const [labTestForm, setLabTestForm] = useState({
    patientId: '',
    testType: '',
    diagnosticDetails: '',
    requestedBy: '',
  });

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      const result = await BaseCrudService.getAll<Patients>('patients');
      setPatients(result.items);
    } catch (error) {
      console.error('Error loading patients:', error);
    }
  };

  const handleSubmitPrescription = async () => {
    try {
      const newPrescription: Prescriptions = {
        _id: crypto.randomUUID(),
        patientId: prescriptionForm.patientId,
        medicationName: prescriptionForm.medicationName,
        dosage: prescriptionForm.dosage,
        instructions: prescriptionForm.instructions,
        doctorName: prescriptionForm.doctorName,
        status: 'Pending',
        prescribedDate: new Date().toISOString(),
      };

      await BaseCrudService.create('prescriptions', newPrescription);

      setSuccessMessage('Prescription submitted successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);

      setPrescriptionForm({
        patientId: '',
        medicationName: '',
        dosage: '',
        instructions: '',
        doctorName: '',
      });
    } catch (error) {
      console.error('Error submitting prescription:', error);
    }
  };

  const handleSubmitLabTest = async () => {
    try {
      const newLabTest: LabTests = {
        _id: crypto.randomUUID(),
        patientId: labTestForm.patientId,
        testType: labTestForm.testType,
        diagnosticDetails: labTestForm.diagnosticDetails,
        requestedBy: labTestForm.requestedBy,
        status: 'Pending',
        requestDate: new Date().toISOString(),
        resultDetails: '',
      };

      await BaseCrudService.create('labtests', newLabTest);

      setSuccessMessage('Lab test request submitted successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);

      setLabTestForm({
        patientId: '',
        testType: '',
        diagnosticDetails: '',
        requestedBy: '',
      });
    } catch (error) {
      console.error('Error submitting lab test:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="max-w-[100rem] mx-auto px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-heading text-5xl font-bold text-foreground mb-4">
              Doctor Portal
            </h1>
            <p className="font-paragraph text-lg text-secondary mb-12">
              Submit prescription and lab test requests for patients
            </p>
          </motion.div>

          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-foreground text-primary-foreground p-4 mb-8 flex items-center gap-3"
            >
              <CheckCircle className="w-5 h-5" />
              <span className="font-paragraph text-base">{successMessage}</span>
            </motion.div>
          )}

          <Tabs defaultValue="prescription" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
              <TabsTrigger value="prescription" className="flex items-center gap-2">
                <Pill className="w-4 h-4" />
                Prescription
              </TabsTrigger>
              <TabsTrigger value="labtest" className="flex items-center gap-2">
                <FlaskConical className="w-4 h-4" />
                Lab Test
              </TabsTrigger>
            </TabsList>

            <TabsContent value="prescription">
              <div className="max-w-3xl bg-light-grey p-12">
                <h2 className="font-heading text-2xl font-semibold text-foreground mb-8">
                  Submit Prescription Request
                </h2>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="prescription-patient">Patient</Label>
                    <Select
                      value={prescriptionForm.patientId}
                      onValueChange={(value) => setPrescriptionForm({ ...prescriptionForm, patientId: value })}
                    >
                      <SelectTrigger id="prescription-patient">
                        <SelectValue placeholder="Select patient" />
                      </SelectTrigger>
                      <SelectContent>
                        {patients.map((patient) => (
                          <SelectItem key={patient._id} value={patient._id}>
                            {patient.fullName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="medication-name">Medication Name</Label>
                    <Input
                      id="medication-name"
                      value={prescriptionForm.medicationName}
                      onChange={(e) => setPrescriptionForm({ ...prescriptionForm, medicationName: e.target.value })}
                      placeholder="e.g., Paracetamol"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dosage">Dosage</Label>
                    <Input
                      id="dosage"
                      value={prescriptionForm.dosage}
                      onChange={(e) => setPrescriptionForm({ ...prescriptionForm, dosage: e.target.value })}
                      placeholder="e.g., 500mg"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="instructions">Instructions</Label>
                    <Textarea
                      id="instructions"
                      value={prescriptionForm.instructions}
                      onChange={(e) => setPrescriptionForm({ ...prescriptionForm, instructions: e.target.value })}
                      placeholder="e.g., Take twice daily after meals"
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="doctor-name">Doctor Name</Label>
                    <Input
                      id="doctor-name"
                      value={prescriptionForm.doctorName}
                      onChange={(e) => setPrescriptionForm({ ...prescriptionForm, doctorName: e.target.value })}
                      placeholder="Enter your name"
                    />
                  </div>

                  <Button
                    onClick={handleSubmitPrescription}
                    disabled={!prescriptionForm.patientId || !prescriptionForm.medicationName || !prescriptionForm.doctorName}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 rounded-lg"
                  >
                    Submit Prescription
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="labtest">
              <div className="max-w-3xl bg-light-grey p-12">
                <h2 className="font-heading text-2xl font-semibold text-foreground mb-8">
                  Submit Lab Test Request
                </h2>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="labtest-patient">Patient</Label>
                    <Select
                      value={labTestForm.patientId}
                      onValueChange={(value) => setLabTestForm({ ...labTestForm, patientId: value })}
                    >
                      <SelectTrigger id="labtest-patient">
                        <SelectValue placeholder="Select patient" />
                      </SelectTrigger>
                      <SelectContent>
                        {patients.map((patient) => (
                          <SelectItem key={patient._id} value={patient._id}>
                            {patient.fullName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="test-type">Test Type</Label>
                    <Input
                      id="test-type"
                      value={labTestForm.testType}
                      onChange={(e) => setLabTestForm({ ...labTestForm, testType: e.target.value })}
                      placeholder="e.g., Blood Test, X-Ray, MRI"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="diagnostic-details">Diagnostic Details</Label>
                    <Textarea
                      id="diagnostic-details"
                      value={labTestForm.diagnosticDetails}
                      onChange={(e) => setLabTestForm({ ...labTestForm, diagnosticDetails: e.target.value })}
                      placeholder="Enter diagnostic requirements and details"
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="requested-by">Requested By</Label>
                    <Input
                      id="requested-by"
                      value={labTestForm.requestedBy}
                      onChange={(e) => setLabTestForm({ ...labTestForm, requestedBy: e.target.value })}
                      placeholder="Enter your name"
                    />
                  </div>

                  <Button
                    onClick={handleSubmitLabTest}
                    disabled={!labTestForm.patientId || !labTestForm.testType || !labTestForm.requestedBy}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 rounded-lg"
                  >
                    Submit Lab Test Request
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
