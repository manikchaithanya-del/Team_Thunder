import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FlaskConical, Clock, CheckCircle, User } from 'lucide-react';
import { BaseCrudService } from '@/integrations';
import { LabTests, Patients } from '@/entities';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';

export default function LabPortalPage() {
  const navigate = useNavigate();
  const [labTests, setLabTests] = useState<LabTests[]>([]);
  const [patients, setPatients] = useState<Record<string, Patients>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedTest, setSelectedTest] = useState<LabTests | null>(null);
  const [resultDetails, setResultDetails] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const labSession = localStorage.getItem('labSession');
    if (!labSession) {
      navigate('/lab-login');
      return;
    }
    loadData();
  }, [navigate]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [labTestsResult, patientsResult] = await Promise.all([
        BaseCrudService.getAll<LabTests>('labtests'),
        BaseCrudService.getAll<Patients>('patients'),
      ]);

      setLabTests(labTestsResult.items);

      const patientsMap: Record<string, Patients> = {};
      patientsResult.items.forEach((patient) => {
        patientsMap[patient._id] = patient;
      });
      setPatients(patientsMap);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (testId: string, newStatus: string) => {
    try {
      setUpdatingId(testId);
      
      setLabTests(labTests.map(t =>
        t._id === testId ? { ...t, status: newStatus } : t
      ));

      await BaseCrudService.update<LabTests>('labtests', {
        _id: testId,
        status: newStatus,
      });
    } catch (error) {
      console.error('Error updating status:', error);
      loadData();
    } finally {
      setUpdatingId(null);
    }
  };

  const completeTest = async () => {
    if (!selectedTest) return;

    try {
      setLabTests(labTests.map(t =>
        t._id === selectedTest._id
          ? { ...t, status: 'Completed', resultDetails }
          : t
      ));

      setIsDialogOpen(false);
      setResultDetails('');
      setSelectedTest(null);

      await BaseCrudService.update<LabTests>('labtests', {
        _id: selectedTest._id,
        status: 'Completed',
        resultDetails,
      });
    } catch (error) {
      console.error('Error completing test:', error);
      loadData();
    }
  };

  const openCompleteDialog = (test: LabTests) => {
    setSelectedTest(test);
    setResultDetails(test.resultDetails || '');
    setIsDialogOpen(true);
  };

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'text-foreground';
      case 'in progress':
      case 'processing':
        return 'text-accent-link';
      case 'pending':
        return 'text-secondary';
      default:
        return 'text-secondary';
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-foreground" />;
      case 'in progress':
      case 'processing':
        return <Clock className="w-5 h-5 text-accent-link" />;
      default:
        return <Clock className="w-5 h-5 text-secondary" />;
    }
  };

  const pendingTests = labTests.filter(t => t.status?.toLowerCase() === 'pending');
  const inProgressTests = labTests.filter(t => t.status?.toLowerCase() === 'in progress' || t.status?.toLowerCase() === 'processing');
  const completedTests = labTests.filter(t => t.status?.toLowerCase() === 'completed');

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
              Laboratory Portal
            </h1>
            <p className="font-paragraph text-lg text-secondary mb-12">
              View and update diagnostic test requests
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-light-grey p-8">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-6 h-6 text-secondary" />
                <span className="font-heading text-3xl font-bold text-foreground">
                  {pendingTests.length}
                </span>
              </div>
              <p className="font-paragraph text-base text-secondary">Pending</p>
            </div>

            <div className="bg-light-grey p-8">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-6 h-6 text-accent-link" />
                <span className="font-heading text-3xl font-bold text-foreground">
                  {inProgressTests.length}
                </span>
              </div>
              <p className="font-paragraph text-base text-secondary">In Progress</p>
            </div>

            <div className="bg-light-grey p-8">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="w-6 h-6 text-foreground" />
                <span className="font-heading text-3xl font-bold text-foreground">
                  {completedTests.length}
                </span>
              </div>
              <p className="font-paragraph text-base text-secondary">Completed</p>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="font-heading text-2xl font-semibold text-foreground mb-6">
                Pending Tests
              </h2>
              <div className="min-h-[200px]">
                {isLoading ? null : pendingTests.length > 0 ? (
                  <div className="space-y-4">
                    {pendingTests.map((test, index) => (
                      <motion.div
                        key={test._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                        className="bg-light-grey p-8"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start gap-4 flex-1">
                            <FlaskConical className="w-6 h-6 text-foreground mt-1" />
                            <div className="flex-1">
                              <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
                                {test.testType}
                              </h3>
                              <div className="flex items-center gap-2 mb-2">
                                <User className="w-4 h-4 text-secondary" />
                                <span className="font-paragraph text-base text-foreground">
                                  {patients[test.patientId || '']?.fullName || 'Unknown Patient'}
                                </span>
                              </div>
                              <div className="space-y-1">
                                <p className="font-paragraph text-sm text-secondary">
                                  <span className="font-medium">Details:</span> {test.diagnosticDetails}
                                </p>
                                <p className="font-paragraph text-sm text-secondary">
                                  <span className="font-medium">Requested by:</span> {test.requestedBy}
                                </p>
                                <p className="font-paragraph text-sm text-secondary">
                                  <span className="font-medium">Date:</span>{' '}
                                  {test.requestDate ? format(new Date(test.requestDate), 'MMM dd, yyyy') : 'N/A'}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(test.status)}
                            <span className={`font-paragraph text-sm font-medium ${getStatusColor(test.status)}`}>
                              {test.status}
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                          <Button
                            onClick={() => updateStatus(test._id, 'In Progress')}
                            disabled={updatingId === test._id}
                            className="bg-accent-link text-primary-foreground hover:bg-accent-link/90 h-10 px-6 rounded-lg"
                          >
                            {updatingId === test._id ? 'Updating...' : 'Start Processing'}
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-light-grey p-16 text-center">
                    <FlaskConical className="w-12 h-12 text-secondary mx-auto mb-4" />
                    <p className="font-paragraph text-base text-secondary">
                      No pending tests
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h2 className="font-heading text-2xl font-semibold text-foreground mb-6">
                In Progress
              </h2>
              <div className="min-h-[200px]">
                {isLoading ? null : inProgressTests.length > 0 ? (
                  <div className="space-y-4">
                    {inProgressTests.map((test, index) => (
                      <motion.div
                        key={test._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                        className="bg-light-grey p-8"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start gap-4 flex-1">
                            <FlaskConical className="w-6 h-6 text-accent-link mt-1" />
                            <div className="flex-1">
                              <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
                                {test.testType}
                              </h3>
                              <div className="flex items-center gap-2 mb-2">
                                <User className="w-4 h-4 text-secondary" />
                                <span className="font-paragraph text-base text-foreground">
                                  {patients[test.patientId || '']?.fullName || 'Unknown Patient'}
                                </span>
                              </div>
                              <p className="font-paragraph text-sm text-secondary">
                                {test.diagnosticDetails}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(test.status)}
                            <span className={`font-paragraph text-sm font-medium ${getStatusColor(test.status)}`}>
                              {test.status}
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                          <Button
                            onClick={() => openCompleteDialog(test)}
                            className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6 rounded-lg"
                          >
                            Complete Test
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-light-grey p-16 text-center">
                    <Clock className="w-12 h-12 text-secondary mx-auto mb-4" />
                    <p className="font-paragraph text-base text-secondary">
                      No tests in progress
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h2 className="font-heading text-2xl font-semibold text-foreground mb-6">
                Completed
              </h2>
              <div className="min-h-[200px]">
                {isLoading ? null : completedTests.length > 0 ? (
                  <div className="space-y-4">
                    {completedTests.map((test, index) => (
                      <motion.div
                        key={test._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                        className="bg-light-grey p-8"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start gap-4 flex-1">
                            <CheckCircle className="w-6 h-6 text-foreground mt-1" />
                            <div className="flex-1">
                              <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
                                {test.testType}
                              </h3>
                              <div className="flex items-center gap-2 mb-2">
                                <User className="w-4 h-4 text-secondary" />
                                <span className="font-paragraph text-base text-foreground">
                                  {patients[test.patientId || '']?.fullName || 'Unknown Patient'}
                                </span>
                              </div>
                              {test.resultDetails && (
                                <div className="mt-3 pt-3 border-t border-medium-grey">
                                  <p className="font-paragraph text-sm text-secondary mb-1">Results:</p>
                                  <p className="font-paragraph text-base text-foreground">{test.resultDetails}</p>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(test.status)}
                            <span className={`font-paragraph text-sm font-medium ${getStatusColor(test.status)}`}>
                              {test.status}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-light-grey p-16 text-center">
                    <CheckCircle className="w-12 h-12 text-secondary mx-auto mb-4" />
                    <p className="font-paragraph text-base text-secondary">
                      No completed tests
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-heading text-2xl">Complete Test</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div>
              <p className="font-paragraph text-base text-foreground mb-2">
                <span className="font-medium">Test:</span> {selectedTest?.testType}
              </p>
              <p className="font-paragraph text-base text-foreground">
                <span className="font-medium">Patient:</span>{' '}
                {selectedTest?.patientId ? patients[selectedTest.patientId]?.fullName : 'Unknown'}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="result-details">Test Results</Label>
              <Textarea
                id="result-details"
                value={resultDetails}
                onChange={(e) => setResultDetails(e.target.value)}
                placeholder="Enter test results and findings"
                rows={6}
              />
            </div>

            <Button
              onClick={completeTest}
              disabled={!resultDetails.trim()}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 rounded-lg"
            >
              Complete Test
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
