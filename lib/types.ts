export type ValidationResult = "AUTORIZADO" | "DENEGADO" | "YA_SALIO";

export type Student = {
  id: string;
  enrollment: string;
  fullName: string;
  gradeGroup: string;
  photoUrl: string;
  guardianEmail: string;
  allowedExitTimes: string[];
  absences: number;
  /** Credencial — Carrera (ej. PROGRAMACIÓN) */
  career?: string;
  /** Credencial — Semestre y grupo (ej. 4TO | DPGM) */
  semesterGroup?: string;
  /** Credencial — Turno */
  shift?: string;
  /** Credencial — Texto de vigencia */
  credentialValidUntil?: string;
  /** Contenido del QR oficial (ej. URL de controlesc); si no hay, se usa la matrícula. */
  credentialQrPayload?: string;
};

/** Ventanas de salida por grupo (prefectura). */
export type GroupExitWindow = {
  id: string;
  groupCode: string;
  /** 0 = domingo … 6 = sábado (Date.getDay) */
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  enabled: boolean;
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

/** Aviso prefectura: misma credencial con varios intentos DENEGADO seguidos. */
export type PrefectureExitDenialAlert = {
  id: string;
  enrollment: string;
  studentName: string;
  denialStreakTotal: number;
  firstReachedAt: string;
  lastAttemptAt: string;
  /** Ej. último QR/placa leído (truncate en UI si es muy largo). */
  credentialLabel: string;
};
