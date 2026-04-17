export type ValidationResult = "AUTORIZADO" | "DENEGADO";

export type Student = {
  id: string;
  enrollment: string;
  fullName: string;
  gradeGroup: string;
  photoUrl: string;
  guardianEmail: string;
  allowedExitTimes: string[];
  absences: number;
};

export type AccessRecord = {
  scannedAt: string;
  enrollment: string;
  studentName: string;
  result: ValidationResult;
  reason: string;
};

export type NotificationPayload = {
  student: Student;
  result: ValidationResult;
  scannedAt: string;
  reason: string;
};
