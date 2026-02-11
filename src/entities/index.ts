/**
 * Auto-generated entity types
 * Contains all CMS collection interfaces in a single file 
 */

/**
 * Collection ID: labtests
 * Interface for LabTests
 */
export interface LabTests {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  patientId?: string;
  /** @wixFieldType text */
  testType?: string;
  /** @wixFieldType text */
  diagnosticDetails?: string;
  /** @wixFieldType text */
  status?: string;
  /** @wixFieldType datetime */
  requestDate?: Date | string;
  /** @wixFieldType text */
  resultDetails?: string;
  /** @wixFieldType text */
  requestedBy?: string;
}


/**
 * Collection ID: patients
 * Interface for Patients
 */
export interface Patients {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  fullName?: string;
  /** @wixFieldType date */
  dateOfBirth?: Date | string;
  /** @wixFieldType text */
  gender?: string;
  /** @wixFieldType text */
  contactNumber?: string;
  /** @wixFieldType text */
  address?: string;
  /** @wixFieldType text */
  medicalHistorySummary?: string;
  /** @wixFieldType text */
  allergies?: string;
  /** @wixFieldType text */
  currentStatus?: string;
}


/**
 * Collection ID: prescriptions
 * Interface for Prescriptions
 */
export interface Prescriptions {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  patientId?: string;
  /** @wixFieldType text */
  medicationName?: string;
  /** @wixFieldType text */
  dosage?: string;
  /** @wixFieldType text */
  instructions?: string;
  /** @wixFieldType text */
  status?: string;
  /** @wixFieldType date */
  prescribedDate?: Date | string;
  /** @wixFieldType text */
  doctorName?: string;
}
