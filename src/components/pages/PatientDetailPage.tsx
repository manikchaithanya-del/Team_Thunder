import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Calendar, Phone, MapPin, AlertCircle, FileText, CheckCircle, Clock, XCircle } from 'lucide-react';
import { BaseCrudService } from '@/integrations';
import { Patients, Prescriptions, LabTests } from '@/entities';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { format } from 'date-fns';

export default function PatientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patients | null>(null);
  const [prescriptions, setPrescriptions] = useState<Prescriptions[]>([]);
  const [labTests, setLabTests] = useState<LabTests[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPatientData();
  }, [id]);

  const loadPatientData = async () => {
    if (!id) return;
    
    try {
      setIsLoading(true);
      const [patientData, prescriptionsResult, labTestsResult] = await Promise.all([
        BaseCrudService.getById<Patients>('patients', id),
        BaseCrudService.getAll<Prescriptions>('prescriptions'),
        BaseCrudService.getAll<LabTests>('labtests'),
      ]);

      setPatient(patientData);
      setPrescriptions(prescriptionsResult.items.filter(p => p.patientId === id));
      setLabTests(labTestsResult.items.filter(l => l.patientId === id));
    } catch (error) {
      console.error('Error loading patient data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'ready':
        return <CheckCircle className="w-5 h-5 text-foreground" />;
      case 'in progress':
      case 'processing':
        return <Clock className="w-5 h-5 text-accent-link" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-secondary" />;
      default:
        return <XCircle className="w-5 h-5 text-secondary" />;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'ready':
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

  const allActivities = [
    ...prescriptions.map(p => ({
      type: 'prescription',
      id: p._id,
      date: p.prescribedDate,
      title: p.medicationName,
      subtitle: `${p.dosage} - ${p.instructions}`,
      status: p.status,
      doctor: p.doctorName,
    })),
    ...labTests.map(l => ({
      type: 'labtest',
      id: l._id,
      date: l.requestDate,
      title: l.testType,
      subtitle: l.diagnosticDetails,
      status: l.status,
      doctor: l.requestedBy,
      result: l.resultDetails,
    })),
  ].sort((a, b) => {
    const dateA = a.date ? new Date(a.date).getTime() : 0;
    const dateB = b.date ? new Date(b.date).getTime() : 0;
    return dateB - dateA;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center min-h-[400px]">
          <LoadingSpinner />
        </main>
        <Footer />
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1">
          <div className="max-w-[100rem] mx-auto px-8 py-16">
            <div className="text-center py-16">
              <User className="w-16 h-16 text-secondary mx-auto mb-4" />
              <h2 className="font-heading text-2xl font-semibold text-foreground mb-2">
                Patient not found
              </h2>
              <Link to="/patients" className="font-paragraph text-base text-accent-link hover:underline">
                Return to patient directory
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="max-w-[100rem] mx-auto px-8 py-16">
          <Link
            to="/patients"
            className="inline-flex items-center gap-2 font-paragraph text-base text-secondary hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Patients
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            <div className="lg:col-span-1">
              <div className="bg-light-grey p-8">
                <div className="w-24 h-24 bg-foreground rounded-full flex items-center justify-center mb-6">
                  <User className="w-12 h-12 text-primary-foreground" />
                </div>

                <h1 className="font-heading text-3xl font-bold text-foreground mb-2">
                  {patient.fullName}
                </h1>

                <div className="space-y-4 mt-6">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-secondary mt-0.5" />
                    <div>
                      <p className="font-paragraph text-sm text-secondary">Date of Birth</p>
                      <p className="font-paragraph text-base text-foreground">{patient.dateOfBirth}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-secondary mt-0.5" />
                    <div>
                      <p className="font-paragraph text-sm text-secondary">Gender</p>
                      <p className="font-paragraph text-base text-foreground">{patient.gender}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-secondary mt-0.5" />
                    <div>
                      <p className="font-paragraph text-sm text-secondary">Contact</p>
                      <p className="font-paragraph text-base text-foreground">{patient.contactNumber}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-secondary mt-0.5" />
                    <div>
                      <p className="font-paragraph text-sm text-secondary">Address</p>
                      <p className="font-paragraph text-base text-foreground">{patient.address}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-secondary mt-0.5" />
                    <div>
                      <p className="font-paragraph text-sm text-secondary">Status</p>
                      <p className="font-paragraph text-base text-foreground font-medium">{patient.currentStatus}</p>
                    </div>
                  </div>
                </div>
              </div>

              {patient.allergies && (
                <div className="bg-light-grey p-8 mt-8">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-destructive mt-0.5" />
                    <div>
                      <p className="font-paragraph text-sm text-secondary mb-2">Allergies</p>
                      <p className="font-paragraph text-base text-foreground">{patient.allergies}</p>
                    </div>
                  </div>
                </div>
              )}

              {patient.medicalHistorySummary && (
                <div className="bg-light-grey p-8 mt-8">
                  <p className="font-paragraph text-sm text-secondary mb-2">Medical History</p>
                  <p className="font-paragraph text-base text-foreground">{patient.medicalHistorySummary}</p>
                </div>
              )}
            </div>

            <div className="lg:col-span-2">
              <h2 className="font-heading text-3xl font-semibold text-foreground mb-8">
                Patient Timeline
              </h2>

              {allActivities.length > 0 ? (
                <div className="space-y-6">
                  {allActivities.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      className="bg-light-grey p-8"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(activity.status)}
                          <div>
                            <h3 className="font-heading text-xl font-semibold text-foreground">
                              {activity.title}
                            </h3>
                            <p className="font-paragraph text-sm text-secondary mt-1">
                              {activity.type === 'prescription' ? 'Prescription' : 'Lab Test'}
                            </p>
                          </div>
                        </div>
                        <span className={`font-paragraph text-sm font-medium ${getStatusColor(activity.status)}`}>
                          {activity.status}
                        </span>
                      </div>

                      <p className="font-paragraph text-base text-foreground mb-4">
                        {activity.subtitle}
                      </p>

                      <div className="flex flex-wrap gap-6 text-sm">
                        <div>
                          <span className="font-paragraph text-secondary">Date: </span>
                          <span className="font-paragraph text-foreground">
                            {activity.date ? format(new Date(activity.date), 'MMM dd, yyyy') : 'N/A'}
                          </span>
                        </div>
                        <div>
                          <span className="font-paragraph text-secondary">
                            {activity.type === 'prescription' ? 'Prescribed by: ' : 'Requested by: '}
                          </span>
                          <span className="font-paragraph text-foreground">{activity.doctor}</span>
                        </div>
                      </div>

                      {activity.result && (
                        <div className="mt-4 pt-4 border-t border-medium-grey">
                          <p className="font-paragraph text-sm text-secondary mb-1">Results:</p>
                          <p className="font-paragraph text-base text-foreground">{activity.result}</p>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="bg-light-grey p-16 text-center">
                  <FileText className="w-12 h-12 text-secondary mx-auto mb-4" />
                  <p className="font-paragraph text-base text-secondary">
                    No activities recorded yet
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
