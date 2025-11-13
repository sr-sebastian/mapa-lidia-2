import { sql } from "drizzle-orm";
import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const semestreColors: Record<string, string> = {
  "1": "#A8DADC",
  "2": "#B8E6F0",
  "3": "#F4A6C8",
  "4": "#FFD6A5",
  "5": "#FFCBB3",
  "6": "#C5E8B7",
  "7": "#9BD5C1",
  "8": "#B4ADCF"
};

export interface Course {
  name: string;
  creditos: number;
  semestre: number;
  previas: string[];
}

export interface Elective {
  name: string;
  previas: string[];
}

export const Materias: Record<string, Course> = {
  "INT": { "name": "Introducción a la Ing. de Datos e IA", "creditos": 4, "semestre": 1, "previas": [] },
  "FIS": { "name": "Física para Ing. de Datos e IA", "creditos": 10, "semestre": 1, "previas": [] },
  "PRO1": { "name": "Programación I", "creditos": 8, "semestre": 1, "previas": [] },
  "MDI": { "name": "Matemática Discreta", "creditos": 8, "semestre": 1, "previas": [] },
  "MAT1": { "name": "Matemática I", "creditos": 10, "semestre": 1, "previas": [] },
  "ING1": { "name": "Inglés I", "creditos": 4, "semestre": 1, "previas": [] },

  "EDA": { "name": "Estructuras de Datos y Algoritmos", "creditos": 8, "semestre": 2, "previas": ["PRO1","MDI"] },
  "ARC": { "name": "Arquitectura de Computadoras", "creditos": 8, "semestre": 2, "previas": ["MDI"] },
  "PRO2": { "name": "Programación II", "creditos": 8, "semestre": 2, "previas": ["PRO1"] },
  "ALL": { "name": "Álgebra Lineal", "creditos": 8, "semestre": 2, "previas": [] },
  "MAT2": { "name": "Matemática II", "creditos": 10, "semestre": 2, "previas": ["MAT1"] },
  "ING2": { "name": "Inglés II", "creditos": 4, "semestre": 2, "previas": ["ING1"] },

  "SOP": { "name": "Sistemas Operativos", "creditos": 8, "semestre": 3, "previas": ["ARC"] },
  "BDR": { "name": "Bases de Datos Relacionales", "creditos": 8, "semestre": 3, "previas": ["EDA"] },
  "TALF": { "name": "Teoría de Autómatas y Lenguajes Formales", "creditos": 8, "semestre": 3, "previas": ["EDA"] },
  "MNC": { "name": "Métodos Numéricos Computacionales", "creditos": 8, "semestre": 3, "previas": ["ALL","PRO2"] },
  "PRE": { "name": "Probabilidad y Estadística", "creditos": 8, "semestre": 3, "previas": ["MDI","MAT1"] },
  "ING3": { "name": "Inglés III", "creditos": 4, "semestre": 3, "previas": ["ING2"] },

  "AA1": { "name": "Aprendizaje Automático I", "creditos": 8, "semestre": 4, "previas": ["PRE"] },
  "BDN": { "name": "Bases de Datos NoSQL", "creditos": 8, "semestre": 4, "previas": ["BDR"] },
  "TITD": { "name": "Teoría de la Info. y Transmisión de Datos", "creditos": 8, "semestre": 4, "previas": ["PRE"] },
  "MOP": { "name": "Métodos de Optimización", "creditos": 8, "semestre": 4, "previas": ["ALL"] },
  "MIN": { "name": "Metodología de la Investigación", "creditos": 4, "semestre": 4, "previas": [] },
  "ING4": { "name": "Inglés IV", "creditos": 4, "semestre": 4, "previas": ["ING3"] },

  "AA2": { "name": "Aprendizaje Automático II", "creditos": 8, "semestre": 5, "previas": ["AA1"] },
  "RCO": { "name": "Redes de Computadoras", "creditos": 8, "semestre": 5, "previas": ["TITD"] },
  "OPT1": { "name": "Optativa I", "creditos": 8, "semestre": 5, "previas": [] },
  "ERS": { "name": "Ética y Responsabilidad Social en TI", "creditos": 4, "semestre": 5, "previas": [] },
  "PID": { "name": "Proyecto de Ingeniería de Datos", "creditos": 8, "semestre": 5, "previas": ["BDN"] },
  "ING5": { "name": "Inglés V", "creditos": 4, "semestre": 5, "previas": ["ING4"] },

  "OPT2": { "name": "Optativa II", "creditos": 8, "semestre": 6, "previas": [] },
  "AAA": { "name": "Aplicaciones del Aprendizaje Automático", "creditos": 8, "semestre": 6, "previas": ["AA2"] },
  "CSE": { "name": "Ciberseguridad", "creditos": 8, "semestre": 6, "previas": ["RCO"] },
  "LNPD": { "name": "Leyes y Normativas de Protección de Datos", "creditos": 4, "semestre": 6, "previas": [] },
  "PAA": { "name": "Proyecto de Aprendizaje Automático", "creditos": 8, "semestre": 6, "previas": ["AA2"] },
  "ING6": { "name": "Inglés VI", "creditos": 4, "semestre": 6, "previas": ["ING5"] },

  "OPT3": { "name": "Optativa III", "creditos": 8, "semestre": 7, "previas": [] },
  "OPT4": { "name": "Optativa IV", "creditos": 8, "semestre": 7, "previas": [] },
  "APR": { "name": "Aprendizaje Profundo", "creditos": 8, "semestre": 7, "previas": ["AAA","PAA"] },
  "IBD": { "name": "Infraestructura de Big Data", "creditos": 8, "semestre": 7, "previas": ["BDN","PID"] },
  "AOGP": { "name": "Adm. de Org. y Gestión de Proyectos", "creditos": 4, "semestre": 7, "previas": [] },
  "ING7": { "name": "Inglés VII", "creditos": 4, "semestre": 7, "previas": ["ING6"] },

  "OPT5": { "name": "Optativa V", "creditos": 8, "semestre": 8, "previas": [] },
  "OPT6": { "name": "Optativa VI", "creditos": 8, "semestre": 8, "previas": [] },
  "TFC": { "name": "Trabajo Final de Carrera", "creditos": 25, "semestre": 8, "previas": ["PAA","PID"] },
  "ING8": { "name": "Inglés VIII", "creditos": 4, "semestre": 8, "previas": ["ING7"] }
};

export const Electivas: Record<string, Elective> = {
  "PACD": { "name": "Programación Avanzada para Ciencia de Datos", "previas": ["AA2"] },
  "ISO": { "name": "Ingeniería de Software", "previas": ["BDR"] },
  "PIS": { "name": "Procesamiento de Imágenes y Señales", "previas": ["TITD"] },
  "SEM": { "name": "Sistemas Embebidos", "previas": ["ARC"] },
  "RES": { "name": "Redes de Sensores", "previas": ["RCO"] },
  "PDTR": { "name": "Procesamiento de Datos en Tiempo Real", "previas": ["BDN"] },
  "CNU": { "name": "Computación en la Nube", "previas": ["RCO"] },
  "VDM": { "name": "Visualización de Datos Masivos", "previas": ["BDN"] },
  "PLN": { "name": "Procesamiento de Lenguaje Natural", "previas": ["APR"] },
  "VCO": { "name": "Visión Computacional", "previas": ["PIS"] },
  "ROB": { "name": "Introducción a la Robótica", "previas": ["AA2", "PIS"] },
  "ARS": { "name": "Análisis de Redes Sociales", "previas": ["AA2"] }
};
