import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Pill, FlaskConical, CheckCircle, FileText, Eye } from 'lucide-react';
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function DoctorPortalPage() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patients[]>([]);
  const [labTests, setLabTests] = useState<LabTests[]>([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedLabReport, setSelectedLabReport] = useState<LabTests | null>(null);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  
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
    // Check if user is logged in
    const doctorSession = localStorage.getItem('doctorSession');
    if (!doctorSession) {
      navigate('/doctor-login');
      return;
    }
    loadData();
  }, [navigate]);

  const loadData = async () => {
    try {
      const [patientsResult, labTestsResult] = await Promise.all([
        BaseCrudService.getAll<Patients>('patients'),
        BaseCrudService.getAll<LabTests>('labtests'),
      ]);
      setPatients(patientsResult.items);
      setLabTests(labTestsResult.items);
    } catch (error) {
      console.error('Error loading data:', error);
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
            <TabsList className="grid w-full max-w-md grid-cols-3 mb-8">
              <TabsTrigger value="prescription" className="flex items-center gap-2">
                <Pill className="w-4 h-4" />
                Prescription
              </TabsTrigger>
              <TabsTrigger value="labtest" className="flex items-center gap-2">
                <FlaskConical className="w-4 h-4" />
                Lab Test
              </TabsTrigger>
              <TabsTrigger value="reports" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Reports
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

            <TabsContent value="reports">
              <div className="max-w-3xl">
                <h2 className="font-heading text-2xl font-semibold text-foreground mb-8">
                  Lab Reports
                </h2>

                <div className="min-h-[300px]">
                  {labTests.length > 0 ? (
                    <div className="space-y-4">
                      {labTests.map((report, index) => (
                        <motion.div
                          key={report._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.05 }}
                          className="bg-light-grey p-6 rounded-lg border border-medium-grey hover:border-accent-link transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <FileText className="w-5 h-5 text-accent-link" />
                                <h3 className="font-heading text-lg font-semibold text-foreground">
                                  {report.testType}
                                </h3>
                              </div>
                              <div className="space-y-2 mb-4">
                                <p className="font-paragraph text-sm text-secondary">
                                  <span className="font-medium">Patient:</span> {report.patientId}
                                </p>
                                <p className="font-paragraph text-sm text-secondary">
                                  <span className="font-medium">Status:</span> {report.status}
                                </p>
                                <p className="font-paragraph text-sm text-secondary">
                                  <span className="font-medium">Requested by:</span> {report.requestedBy}
                                </p>
                                <p className="font-paragraph text-sm text-secondary">
                                  <span className="font-medium">Date:</span>{' '}
                                  {report.requestDate ? new Date(report.requestDate).toLocaleDateString() : 'N/A'}
                                </p>
                              </div>
                            </div>
                            <Button
                              onClick={() => {
                                setSelectedLabReport(report);
                                setIsReportDialogOpen(true);
                              }}
                              variant="outline"
                              className="flex items-center gap-2 ml-4"
                            >
                              <Eye className="w-4 h-4" />
                              View Report
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-light-grey p-16 text-center rounded-lg">
                      <FileText className="w-12 h-12 text-secondary mx-auto mb-4" />
                      <p className="font-paragraph text-base text-secondary">
                        No lab reports available
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading text-2xl">Lab Report</DialogTitle>
          </DialogHeader>
          {selectedLabReport && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="font-paragraph text-sm text-secondary mb-1">Test Type</p>
                  <p className="font-heading text-lg font-semibold text-foreground">{selectedLabReport.testType}</p>
                </div>
                <div>
                  <p className="font-paragraph text-sm text-secondary mb-1">Status</p>
                  <p className="font-heading text-lg font-semibold text-foreground">{selectedLabReport.status}</p>
                </div>
                <div>
                  <p className="font-paragraph text-sm text-secondary mb-1">Requested By</p>
                  <p className="font-heading text-lg font-semibold text-foreground">{selectedLabReport.requestedBy}</p>
                </div>
                <div>
                  <p className="font-paragraph text-sm text-secondary mb-1">Request Date</p>
                  <p className="font-heading text-lg font-semibold text-foreground">
                    {selectedLabReport.requestDate ? new Date(selectedLabReport.requestDate).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>

              <div className="border-t border-medium-grey pt-6">
                <p className="font-paragraph text-sm text-secondary mb-2">Diagnostic Details</p>
                <p className="font-paragraph text-base text-foreground bg-light-grey p-4 rounded-lg">
                  {selectedLabReport.diagnosticDetails}
                </p>
              </div>

              {selectedLabReport.resultDetails && (
                <div className="border-t border-medium-grey pt-6">
                  <p className="font-paragraph text-sm text-secondary mb-2">Result Details</p>
                  <p className="font-paragraph text-base text-foreground bg-light-grey p-4 rounded-lg">
                    {selectedLabReport.resultDetails}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
