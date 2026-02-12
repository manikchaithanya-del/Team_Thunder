import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, LogOut, FileText, Calendar, Pill, FlaskConical, Clock, AlertCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

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
    setIsLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('patientSession');
    navigate('/');
  };

  const healthRecords: HealthRecord[] = [
    {
      id: '1',
      type: 'prescription',
      title: 'Amoxicillin 500mg',
      date: '2026-02-10',
      status: 'completed',
      description: 'Prescribed by Dr. Smith for bacterial infection',
    },
    {
      id: '2',
      type: 'lab',
      title: 'Blood Work Results',
      date: '2026-02-08',
      status: 'completed',
      description: 'Complete blood count and metabolic panel',
    },
    {
      id: '3',
      type: 'appointment',
      title: 'Follow-up Checkup',
      date: '2026-02-20',
      status: 'upcoming',
      description: 'General health checkup with Dr. Johnson',
    },
    {
      id: '4',
      type: 'record',
      title: 'Medical History Summary',
      date: '2026-02-01',
      status: 'completed',
      description: 'Updated medical history and allergies',
    },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'prescription':
        return Pill;
      case 'lab':
        return FlaskConical;
      case 'appointment':
        return Calendar;
      default:
        return FileText;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
                Your Health Records
              </h2>
              <p className="font-paragraph text-secondary">
                Access your medical history, prescriptions, and test results
              </p>
            </div>

            <div className="space-y-4">
              {healthRecords.map((record, index) => {
                const IconComponent = getIcon(record.type);
                return (
                  <motion.div
                    key={record.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border border-medium-grey">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="bg-light-grey p-3 rounded-lg mt-1">
                            <IconComponent className="w-5 h-5 text-foreground" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-heading text-lg font-bold text-foreground mb-1">
                              {record.title}
                            </h3>
                            <p className="font-paragraph text-sm text-secondary mb-3">
                              {record.description}
                            </p>
                            <div className="flex items-center gap-4">
                              <span className="font-paragraph text-xs text-secondary/70">
                                {new Date(record.date).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                })}
                              </span>
                              <span
                                className={`font-paragraph text-xs font-medium px-3 py-1 rounded-full ${getStatusColor(
                                  record.status
                                )}`}
                              >
                                {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          className="ml-4 whitespace-nowrap"
                        >
                          View Details
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
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

      <Footer />
    </div>
  );
}
