export type Flow = 'login' | 'register' | 'terms' | 'privacy' | 'home' | 'setup';

export interface LoginFormState {
  email: string;
  emailError: string;
  password: string;
  passwordError: string;
  showPassword: boolean;
  isLoading: boolean;
}

export interface RegisterFormState {
  step: number;
  email: string;
  emailError: string;
  name: string;
  nameError: string;
  password: string;
  passwordError: string;
  confirmPassword: string;
  confirmPasswordError: string;
  showPassword: boolean;
  phone: string;
  phoneError: string;
  code: string[];
  codeError: string;
  timer: number;
  isResending: boolean;
}

export interface CompanySetupState {
  name: string;
  document: string;
  workDays: string[];
  startTime: string;
  endTime: string;
  collaboratorsCount: string;
}

export interface ServiceSetupState {
  name: string;
  duration: string;
  value: string;
  category: string;
  photo: string | null;
}

export interface ProfessionalSetupState {
  name: string;
  photo: string | null;
  tag: string;
  pauseStart: string;
  pauseEnd: string;
  workDays: string[];
}

export interface Appointment {
  id: string;
  time: string;
  service: string;
  price: string;
  clientName: string;
  clientPhone: string;
  professionalName: string;
  category: string;
  date: string;
}

export interface SetupFormState {
  step: number;
  subStep: number;
  company: CompanySetupState;
  services: ServiceSetupState[];
  currentService: ServiceSetupState;
  professionals: ProfessionalSetupState[];
  currentProfessional: ProfessionalSetupState;
  errors: Record<string, string>;
}
