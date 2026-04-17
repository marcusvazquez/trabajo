import type { Student } from "@/lib/types";

export const STUDENTS: Student[] = [
  {
    id: "st-01",
    enrollment: "24402080059968",
    fullName: "Andrea Lizeth Cortez Ruiz",
    gradeGroup: "4A Programacion",
    photoUrl: "https://ui-avatars.com/api/?name=Andrea+Cortez&background=0A2A66&color=fff&size=256",
    guardianEmail: "tutor.andrea@example.com",
    allowedExitTimes: ["14:00", "19:00"],
    absences: 2,
  },
  {
    id: "st-02",
    enrollment: "24402080061234",
    fullName: "Luis Fernando Arce Vazquez",
    gradeGroup: "2B Mecanica",
    photoUrl: "https://ui-avatars.com/api/?name=Luis+Arce&background=0A2A66&color=fff&size=256",
    guardianEmail: "tutor.luis@example.com",
    allowedExitTimes: ["14:00"],
    absences: 6,
  },
  {
    id: "st-03",
    enrollment: "24402080064567",
    fullName: "Sofia Ramirez Acosta",
    gradeGroup: "6C Enfermeria",
    photoUrl: "https://ui-avatars.com/api/?name=Sofia+Ramirez&background=0A2A66&color=fff&size=256",
    guardianEmail: "tutor.sofia@example.com",
    allowedExitTimes: ["19:00"],
    absences: 8,
  },
];
