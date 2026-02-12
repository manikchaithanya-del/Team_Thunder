import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, LogOut, FileText, Calendar, Pill, FlaskConical, Clock, AlertCircle, Eye } from 'lucide-react';
import { BaseCrudService } from '@/integrations';
import { LabTests, Prescriptions } from '@/entities';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface PatientData {
  email: string;
  name: string;
  patientId: string;
}

interface HealthRecord {
  id: string;
  type: 'prescription' | 'lab' | 'appointment' | 'record';
  title: string;
  date: string;
  status: 'completed' | 'pending' | 'upcoming';
  description: string;
}

export default function PatientPortalPage() {
  const navigate = useNavigate();
  const [patient, setPatient] = useState<PatientData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [labReports, setLabReports] = useState<LabTests[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescriptions[]>([]);
  const [selectedReport, setSelectedReport] = useState<LabTests | null>(null);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);

  useEffect(() => {
    const session = localStorage.getItem('patientSession');
    if (!session) {
      navigate('/patient-login');
      return;
    }

    const sessionData = JSON.parse(session);
    setPatient({
      email: sessionData.email,
      name: sessionData.email.split('@')[0],
      patientId: 'P' + Math.random().toString(36).substr(2, 9).toUpperCase(),
    });
    
    loadData(sessionData.email);
  }, [navigate]);

  const loadData = async (email: string) => {
    try {
      const [labResult, prescResult] = await Promise.all([
        BaseCrudService.getAll<LabTests>('labtests'),
        BaseCrudService.getAll<Prescriptions>('prescriptions'),
      ]);
      
      // Filter reports and prescriptions for this patient (using email as identifier)
      setLabReports(labResult.items);
      setPrescriptions(prescResult.items);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('patientSession');
    navigate('/');
  };



  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground mx-auto mb-4" />
            <p className="font-paragraph text-secondary">Loading your portal...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!patient) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 w-full">
        {/* Header Section */}
        <section className="w-full bg-light-grey border-b border-medium-grey">
          <div className="max-w-[100rem] mx-auto px-8 py-12">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-foreground p-3 rounded-lg">
                  <Heart className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="font-heading text-3xl font-bold text-foreground">
                    Welcome, {patient.name}
                  </h1>
                  <p className="font-paragraph text-secondary mt-1">
                    Patient ID: {patient.patientId}
                  </p>
                </div>
              </div>
              <Button
                onClick={handleLogout}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="w-full bg-background border-b border-medium-grey">
          <div className="max-w-[100rem] mx-auto px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: 'Active Prescriptions', value: '2', icon: Pill },
                { label: 'Pending Tests', value: '1', icon: FlaskConical },
                { label: 'Upcoming Appointments', value: '1', icon: Calendar },
                { label: 'Last Checkup', value: '5 days ago', icon: Clock },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-light-grey p-6 rounded-lg border border-medium-grey"
                >
                  <div className="flex items-start justify-between mb-4">
                    <stat.icon className="w-5 h-5 text-accent-link" />
                    <span className="text-2xl font-bold text-foreground">{stat.value}</span>
                  </div>
                  <p className="font-paragraph text-sm text-secondary">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Health Records */}
        <section className="w-full bg-background py-16">
          <div className="max-w-[100rem] mx-auto px-8">
            <div className="mb-12">
              <h2 className="font-heading text-3xl font-bold text-foreground mb-2">
                Your Lab Reports
              </h2>
              <p className="font-paragraph text-secondary">
                View your completed lab test results and reports
              </p>
            </div>

            <div className="min-h-[300px]">
              {labReports.length > 0 ? (
                <div className="space-y-4">
                  {labReports.map((report, index) => (
                    <motion.div
                      key={report._id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border border-medium-grey">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4 flex-1">
                            <div className="bg-light-grey p-3 rounded-lg mt-1">
                              <FileText className="w-5 h-5 text-foreground" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-heading text-lg font-bold text-foreground mb-1">
                                {report.testType}
                              </h3>
                              <p className="font-paragraph text-sm text-secondary mb-3">
                                {report.diagnosticDetails}
                              </p>
                              <div className="flex items-center gap-4">
                                <span className="font-paragraph text-xs text-secondary/70">
                                  {report.requestDate ? new Date(report.requestDate).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                  }) : 'N/A'}
                                </span>
                                <span
                                  className={`font-paragraph text-xs font-medium px-3 py-1 rounded-full ${
                                    report.status?.toLowerCase() === 'completed'
                                      ? 'bg-green-100 text-green-800'
                                      : report.status?.toLowerCase() === 'in progress'
                                      ? 'bg-yellow-100 text-yellow-800'
                                      : 'bg-blue-100 text-blue-800'
                                  }`}
                                >
                                  {report.status}
                                </span>
                              </div>
                            </div>
                          </div>
                          <Button
                            onClick={() => {
                              setSelectedReport(report);
                              setIsReportDialogOpen(true);
                            }}
                            variant="outline"
                            className="ml-4 whitespace-nowrap flex items-center gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            View Report
                          </Button>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="bg-light-grey p-16 text-center rounded-lg">
                  <FileText className="w-12 h-12 text-secondary mx-auto mb-4" />
                  <p className="font-paragraph text-base text-secondary">
                    No lab reports available yet
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Important Notice */}
        <section className="w-full bg-light-grey border-t border-medium-grey py-12">
          <div className="max-w-[100rem] mx-auto px-8">
            <div className="flex items-start gap-4 bg-background p-6 rounded-lg border border-medium-grey">
              <AlertCircle className="w-5 h-5 text-accent-link flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-heading font-bold text-foreground mb-2">
                  Important Notice
                </h3>
                <p className="font-paragraph text-sm text-secondary">
                  If you have any questions about your health records or need to contact your healthcare provider, please reach out to your doctor directly. For urgent medical concerns, please call emergency services.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading text-2xl">Lab Report Details</DialogTitle>
          </DialogHeader>
          {selectedReport && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="font-paragraph text-sm text-secondary mb-1">Test Type</p>
                  <p className="font-heading text-lg font-semibold text-foreground">{selectedReport.testType}</p>
                </div>
                <div>
                  <p className="font-paragraph text-sm text-secondary mb-1">Status</p>
                  <p className="font-heading text-lg font-semibold text-foreground">{selectedReport.status}</p>
                </div>
                <div>
                  <p className="font-paragraph text-sm text-secondary mb-1">Requested By</p>
                  <p className="font-heading text-lg font-semibold text-foreground">{selectedReport.requestedBy}</p>
                </div>
                <div>
                  <p className="font-paragraph text-sm text-secondary mb-1">Request Date</p>
                  <p className="font-heading text-lg font-semibold text-foreground">
                    {selectedReport.requestDate ? new Date(selectedReport.requestDate).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>

              <div className="border-t border-medium-grey pt-6">
                <p className="font-paragraph text-sm text-secondary mb-2">Diagnostic Details</p>
                <p className="font-paragraph text-base text-foreground bg-light-grey p-4 rounded-lg">
                  {selectedReport.diagnosticDetails}
                </p>
              </div>

              {selectedReport.resultDetails && (
                <div className="border-t border-medium-grey pt-6">
                  <p className="font-paragraph text-sm text-secondary mb-2">Test Results</p>
                  <p className="font-paragraph text-base text-foreground bg-light-grey p-4 rounded-lg">
                    {selectedReport.resultDetails}
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
