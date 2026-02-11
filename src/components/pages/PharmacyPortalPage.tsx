import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Pill, Clock, CheckCircle, User } from 'lucide-react';
import { BaseCrudService } from '@/integrations';
import { Prescriptions, Patients } from '@/entities';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

export default function PharmacyPortalPage() {
  const [prescriptions, setPrescriptions] = useState<Prescriptions[]>([]);
  const [patients, setPatients] = useState<Record<string, Patients>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [prescriptionsResult, patientsResult] = await Promise.all([
        BaseCrudService.getAll<Prescriptions>('prescriptions'),
        BaseCrudService.getAll<Patients>('patients'),
      ]);

      setPrescriptions(prescriptionsResult.items);

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

  const updateStatus = async (prescriptionId: string, newStatus: string) => {
    try {
      setUpdatingId(prescriptionId);
      
      setPrescriptions(prescriptions.map(p =>
        p._id === prescriptionId ? { ...p, status: newStatus } : p
      ));

      await BaseCrudService.update<Prescriptions>('prescriptions', {
        _id: prescriptionId,
        status: newStatus,
      });
    } catch (error) {
      console.error('Error updating status:', error);
      loadData();
    } finally {
      setUpdatingId(null);
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

  const getStatusIcon = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'ready':
        return <CheckCircle className="w-5 h-5 text-foreground" />;
      case 'in progress':
      case 'processing':
        return <Clock className="w-5 h-5 text-accent-link" />;
      default:
        return <Clock className="w-5 h-5 text-secondary" />;
    }
  };

  const pendingPrescriptions = prescriptions.filter(p => p.status?.toLowerCase() === 'pending');
  const inProgressPrescriptions = prescriptions.filter(p => p.status?.toLowerCase() === 'in progress');
  const completedPrescriptions = prescriptions.filter(p => p.status?.toLowerCase() === 'completed' || p.status?.toLowerCase() === 'ready');

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
              Pharmacy Portal
            </h1>
            <p className="font-paragraph text-lg text-secondary mb-12">
              View and manage prescription requests
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-light-grey p-8">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-6 h-6 text-secondary" />
                <span className="font-heading text-3xl font-bold text-foreground">
                  {pendingPrescriptions.length}
                </span>
              </div>
              <p className="font-paragraph text-base text-secondary">Pending</p>
            </div>

            <div className="bg-light-grey p-8">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-6 h-6 text-accent-link" />
                <span className="font-heading text-3xl font-bold text-foreground">
                  {inProgressPrescriptions.length}
                </span>
              </div>
              <p className="font-paragraph text-base text-secondary">In Progress</p>
            </div>

            <div className="bg-light-grey p-8">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="w-6 h-6 text-foreground" />
                <span className="font-heading text-3xl font-bold text-foreground">
                  {completedPrescriptions.length}
                </span>
              </div>
              <p className="font-paragraph text-base text-secondary">Completed</p>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="font-heading text-2xl font-semibold text-foreground mb-6">
                Pending Prescriptions
              </h2>
              <div className="min-h-[200px]">
                {isLoading ? null : pendingPrescriptions.length > 0 ? (
                  <div className="space-y-4">
                    {pendingPrescriptions.map((prescription, index) => (
                      <motion.div
                        key={prescription._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                        className="bg-light-grey p-8"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start gap-4 flex-1">
                            <Pill className="w-6 h-6 text-foreground mt-1" />
                            <div className="flex-1">
                              <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
                                {prescription.medicationName}
                              </h3>
                              <div className="flex items-center gap-2 mb-2">
                                <User className="w-4 h-4 text-secondary" />
                                <span className="font-paragraph text-base text-foreground">
                                  {patients[prescription.patientId || '']?.fullName || 'Unknown Patient'}
                                </span>
                              </div>
                              <div className="space-y-1">
                                <p className="font-paragraph text-sm text-secondary">
                                  <span className="font-medium">Dosage:</span> {prescription.dosage}
                                </p>
                                <p className="font-paragraph text-sm text-secondary">
                                  <span className="font-medium">Instructions:</span> {prescription.instructions}
                                </p>
                                <p className="font-paragraph text-sm text-secondary">
                                  <span className="font-medium">Prescribed by:</span> {prescription.doctorName}
                                </p>
                                <p className="font-paragraph text-sm text-secondary">
                                  <span className="font-medium">Date:</span>{' '}
                                  {prescription.prescribedDate ? format(new Date(prescription.prescribedDate), 'MMM dd, yyyy') : 'N/A'}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(prescription.status)}
                            <span className={`font-paragraph text-sm font-medium ${getStatusColor(prescription.status)}`}>
                              {prescription.status}
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                          <Button
                            onClick={() => updateStatus(prescription._id, 'In Progress')}
                            disabled={updatingId === prescription._id}
                            className="bg-accent-link text-primary-foreground hover:bg-accent-link/90 h-10 px-6 rounded-lg"
                          >
                            {updatingId === prescription._id ? 'Updating...' : 'Start Preparing'}
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-light-grey p-16 text-center">
                    <Pill className="w-12 h-12 text-secondary mx-auto mb-4" />
                    <p className="font-paragraph text-base text-secondary">
                      No pending prescriptions
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
                {isLoading ? null : inProgressPrescriptions.length > 0 ? (
                  <div className="space-y-4">
                    {inProgressPrescriptions.map((prescription, index) => (
                      <motion.div
                        key={prescription._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                        className="bg-light-grey p-8"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start gap-4 flex-1">
                            <Pill className="w-6 h-6 text-accent-link mt-1" />
                            <div className="flex-1">
                              <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
                                {prescription.medicationName}
                              </h3>
                              <div className="flex items-center gap-2 mb-2">
                                <User className="w-4 h-4 text-secondary" />
                                <span className="font-paragraph text-base text-foreground">
                                  {patients[prescription.patientId || '']?.fullName || 'Unknown Patient'}
                                </span>
                              </div>
                              <div className="space-y-1">
                                <p className="font-paragraph text-sm text-secondary">
                                  <span className="font-medium">Dosage:</span> {prescription.dosage}
                                </p>
                                <p className="font-paragraph text-sm text-secondary">
                                  <span className="font-medium">Instructions:</span> {prescription.instructions}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(prescription.status)}
                            <span className={`font-paragraph text-sm font-medium ${getStatusColor(prescription.status)}`}>
                              {prescription.status}
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                          <Button
                            onClick={() => updateStatus(prescription._id, 'Completed')}
                            disabled={updatingId === prescription._id}
                            className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6 rounded-lg"
                          >
                            {updatingId === prescription._id ? 'Updating...' : 'Mark as Ready'}
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-light-grey p-16 text-center">
                    <Clock className="w-12 h-12 text-secondary mx-auto mb-4" />
                    <p className="font-paragraph text-base text-secondary">
                      No prescriptions in progress
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
                {isLoading ? null : completedPrescriptions.length > 0 ? (
                  <div className="space-y-4">
                    {completedPrescriptions.map((prescription, index) => (
                      <motion.div
                        key={prescription._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                        className="bg-light-grey p-8"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4 flex-1">
                            <CheckCircle className="w-6 h-6 text-foreground mt-1" />
                            <div className="flex-1">
                              <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
                                {prescription.medicationName}
                              </h3>
                              <div className="flex items-center gap-2 mb-2">
                                <User className="w-4 h-4 text-secondary" />
                                <span className="font-paragraph text-base text-foreground">
                                  {patients[prescription.patientId || '']?.fullName || 'Unknown Patient'}
                                </span>
                              </div>
                              <p className="font-paragraph text-sm text-secondary">
                                {prescription.dosage}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(prescription.status)}
                            <span className={`font-paragraph text-sm font-medium ${getStatusColor(prescription.status)}`}>
                              {prescription.status}
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
                      No completed prescriptions
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
