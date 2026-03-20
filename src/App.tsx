/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Link, 
  useNavigate, 
  useLocation 
} from 'react-router-dom';
import { 
  Eye, EyeOff, Loader2, Scissors, ArrowLeft, X, Check, AlertCircle,
  Plus, Trash2, Camera, Clock, Calendar, Users, Briefcase, ChevronRight, ChevronLeft, Upload,
  DollarSign, Tag, ChevronDown, ChevronUp, Menu, MoreVertical, LogOut, Home, Settings, Filter, Phone, Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LoginFormState, 
  RegisterFormState, 
  SetupFormState, 
  CompanySetupState,
  ServiceSetupState,
  ProfessionalSetupState
} from './types';

// --- Components for each Route ---

const LoginPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<LoginFormState>({
    email: '',
    emailError: '',
    password: '',
    passwordError: '',
    showPassword: false,
    isLoading: false,
  });

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let hasError = false;
    const newForm = { ...form, emailError: '', passwordError: '' };

    if (!form.email) {
      newForm.emailError = 'Digite um email válido';
      hasError = true;
    } else if (!validateEmail(form.email)) {
      newForm.emailError = 'Digite um email válido';
      hasError = true;
    }

    if (!form.password || form.password.length < 6) {
      newForm.passwordError = 'Senha não identificada';
      hasError = true;
    }

    setForm(newForm);

    if (!hasError) {
      setForm(prev => ({ ...prev, isLoading: true }));
      console.log('Tracking: Initing Login Flow');
      await new Promise(resolve => setTimeout(resolve, 1500));
      setForm(prev => ({ ...prev, isLoading: false }));
      navigate('/home');
    }
  };

  return (
    <div className="w-full max-w-md space-y-8 h-[420px]">
      <div className="text-center space-y-2 pb-4 pt-0 leading-[16px]">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-zinc-900 text-white mb-4">
          <Scissors size={24} />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Acesse sua conta</h1>
      </div>

      <form onSubmit={handleLogin} className="space-y-5">
        <div className="space-y-2">
          <label className="text-[12px] font-medium text-zinc-700" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Digite seu email"
            className={`w-full px-4 py-3 rounded-xl border bg-white transition-all outline-none focus:ring-2 focus:ring-zinc-900/10 placeholder:text-[12px] text-[12px] ${
              form.emailError 
                ? 'border-red-500 focus:border-red-500' 
                : 'border-zinc-200 focus:border-zinc-900'
            }`}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value, emailError: '' })}
          />
          {form.emailError && (
            <p className="text-xs font-medium text-red-500 mt-1">{form.emailError}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-[12px] font-medium text-zinc-700" htmlFor="password">
            Senha
          </label>
          <div className="relative">
            <input
              id="password"
              type={form.showPassword ? 'text' : 'password'}
              placeholder="Digite sua senha"
              className={`w-full px-4 py-3 rounded-xl border bg-white transition-all outline-none focus:ring-2 focus:ring-zinc-900/10 pr-12 placeholder:text-[12px] text-[12px] ${
                form.passwordError 
                  ? 'border-red-500 focus:border-red-500' 
                  : 'border-zinc-200 focus:border-zinc-900'
              }`}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value, passwordError: '' })}
            />
            <button
              type="button"
              onClick={() => setForm({ ...form, showPassword: !form.showPassword })}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
            >
              {form.showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {form.passwordError && (
            <p className="text-xs font-medium text-red-500 mt-1">{form.passwordError}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={form.isLoading}
          className="w-full bg-zinc-900 text-white py-3.5 rounded-xl font-semibold hover:bg-zinc-800 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-zinc-200"
        >
          {form.isLoading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Entrando...
            </>
          ) : (
            'Entrar'
          )}
        </button>

        <div className="flex justify-center pt-2">
          <Link
            to="/criar-conta"
            className="text-sm font-semibold text-zinc-900 hover:underline underline-offset-4 decoration-zinc-300"
          >
            Criar conta
          </Link>
        </div>
      </form>
    </div>
  );
};

const RegisterPage = ({ setUserName }: { setUserName: (name: string) => void }) => {
  const navigate = useNavigate();
  const [reg, setReg] = useState<RegisterFormState>({
    step: 1,
    email: '',
    emailError: '',
    name: '',
    nameError: '',
    password: '',
    passwordError: '',
    confirmPassword: '',
    confirmPasswordError: '',
    showPassword: false,
    phone: '',
    phoneError: '',
    code: ['', '', '', '', '', ''],
    codeError: '',
    timer: 0,
    isResending: false,
  });

  // Timer logic for SMS code
  React.useEffect(() => {
    let interval: any;
    if (reg.timer > 0) {
      interval = setInterval(() => {
        setReg(prev => ({ ...prev, timer: prev.timer - 1 }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [reg.timer]);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email) && !email.includes(' ');
  };

  const getPasswordStrength = (pw: string) => {
    if (!pw) return 0;
    let strength = 0;
    if (pw.length >= 8) strength++;
    if (/[A-Z]/.test(pw)) strength++;
    if (/[a-z]/.test(pw)) strength++;
    if (/[0-9]/.test(pw)) strength++;
    if (/[^A-Za-z0-9]/.test(pw)) strength++;
    return strength;
  };

  const maskPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      let masked = numbers;
      if (numbers.length > 2) masked = `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
      if (numbers.length > 7) masked = `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
      return masked;
    }
    return value.slice(0, 15);
  };

  const handleNext = () => {
    if (reg.step === 1) {
      let hasError = false;
      const errors = { emailError: '', nameError: '' };
      if (!reg.email || !validateEmail(reg.email)) {
        errors.emailError = 'Digite um e-mail válido';
        hasError = true;
      }
      if (!reg.name || reg.name.length < 2 || /^\d+$/.test(reg.name)) {
        errors.nameError = 'Digite um nome válido';
        hasError = true;
      }
      if (hasError) {
        setReg(prev => ({ ...prev, ...errors }));
        return;
      }
      setReg(prev => ({ ...prev, step: 2 }));
    } else if (reg.step === 2) {
      let hasError = false;
      const errors = { passwordError: '', confirmPasswordError: '' };
      
      if (reg.password.length < 8) {
        errors.passwordError = 'A senha deve ter no mínimo 8 caracteres';
        hasError = true;
      } else if (!/[A-Z]/.test(reg.password)) {
        errors.passwordError = 'A senha deve conter letra maiúscula';
        hasError = true;
      } else if (!/[a-z]/.test(reg.password)) {
        errors.passwordError = 'A senha deve conter letra minúscula';
        hasError = true;
      } else if (!/[0-9]/.test(reg.password)) {
        errors.passwordError = 'A senha deve conter um número';
        hasError = true;
      } else if (!/[^A-Za-z0-9]/.test(reg.password)) {
        errors.passwordError = 'A senha deve conter um caractere especial';
        hasError = true;
      }

      if (reg.password !== reg.confirmPassword) {
        errors.confirmPasswordError = 'As senhas não coincidem';
        hasError = true;
      }

      if (hasError) {
        setReg(prev => ({ ...prev, ...errors }));
        return;
      }
      setReg(prev => ({ ...prev, step: 3 }));
    } else if (reg.step === 3) {
      const numbers = reg.phone.replace(/\D/g, '');
      if (numbers.length < 10) {
        setReg(prev => ({ ...prev, phoneError: 'Digite um telefone válido' }));
        return;
      }
      setReg(prev => ({ ...prev, step: 4, timer: 40 }));
    }
  };

  const handleConfirmCode = () => {
    if (reg.code.some(c => !c)) {
      setReg(prev => ({ ...prev, codeError: 'Digite o código completo' }));
      return;
    }
    // Simulate success
    setUserName(reg.name);
    setReg(prev => ({ ...prev, step: 5 }));
  };

  const handleCodeChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newCode = [...reg.code];
    newCode[index] = value.slice(-1);
    setReg(prev => ({ ...prev, code: newCode, codeError: '' }));
    
    // Auto focus next
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }
  };

  const renderStep = () => {
    switch (reg.step) {
      case 1:
        return (
          <div className="space-y-6 pb-4 pt-0 leading-[16px]">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-zinc-900">Crie sua conta</h2>
              <p className="text-zinc-500 text-sm">Preencha seus dados básicos para começar.</p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[12px] font-medium text-zinc-700">Digite seu e-mail *</label>
                <input
                  type="email"
                  placeholder="seuemail@email.com"
                  className={`w-full px-4 py-3 rounded-xl border bg-white outline-none transition-all focus:ring-2 focus:ring-zinc-900/10 placeholder:text-[12px] text-[12px] ${reg.emailError ? 'border-red-500' : 'border-zinc-200 focus:border-zinc-900'}`}
                  value={reg.email}
                  onChange={e => setReg({ ...reg, email: e.target.value, emailError: '' })}
                />
                {reg.emailError && <p className="text-xs text-red-500 font-medium">{reg.emailError}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-[12px] font-medium text-zinc-700">Digite seu nome *</label>
                <input
                  type="text"
                  placeholder="Seu nome"
                  className={`w-full px-4 py-3 rounded-xl border bg-white outline-none transition-all focus:ring-2 focus:ring-zinc-900/10 placeholder:text-[12px] text-[12px] ${reg.nameError ? 'border-red-500' : 'border-zinc-200 focus:border-zinc-900'}`}
                  value={reg.name}
                  onChange={e => setReg({ ...reg, name: e.target.value, nameError: '' })}
                />
                {reg.nameError && <p className="text-xs text-red-500 font-medium">{reg.nameError}</p>}
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <button onClick={handleNext} className="w-full bg-zinc-900 text-white py-3.5 rounded-xl font-semibold hover:bg-zinc-800 transition-all active:scale-[0.98]">
                Avançar
              </button>
              <button onClick={() => navigate('/login')} className="w-full py-3 text-zinc-500 font-medium hover:text-zinc-900 transition-colors">
                Voltar
              </button>
            </div>
          </div>
        );
      case 2:
        const requirements = [
          { label: 'Mínimo 8 caracteres', met: reg.password.length >= 8 },
          { label: 'Letra maiúscula', met: /[A-Z]/.test(reg.password) },
          { label: 'Letra minúscula', met: /[a-z]/.test(reg.password) },
          { label: 'Número', met: /[0-9]/.test(reg.password) },
          { label: 'Caractere especial', met: /[^A-Za-z0-9]/.test(reg.password) },
          { label: 'Senhas coincidem', met: reg.password !== '' && reg.password === reg.confirmPassword },
        ];
        return (
          <div className="space-y-6 pb-4 pt-0 leading-[16px]">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-zinc-900">Crie sua senha</h2>
              <p className="text-zinc-500 text-sm">Sua senha deve ser forte e segura.</p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[12px] font-medium text-zinc-700">Digite sua senha *</label>
                <div className="relative">
                  <input
                    type={reg.showPassword ? 'text' : 'password'}
                    placeholder="Digite sua senha"
                    className={`w-full px-4 py-3 rounded-xl border bg-white outline-none transition-all focus:ring-2 focus:ring-zinc-900/10 pr-12 placeholder:text-[12px] text-[12px] ${reg.passwordError ? 'border-red-500' : 'border-zinc-200 focus:border-zinc-900'}`}
                    value={reg.password}
                    onChange={e => setReg({ ...reg, password: e.target.value, passwordError: '' })}
                  />
                  <button onClick={() => setReg({ ...reg, showPassword: !reg.showPassword })} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400">
                    {reg.showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[12px] font-medium text-zinc-700">Confirme sua senha *</label>
                <div className="relative">
                  <input
                    type={reg.showPassword ? 'text' : 'password'}
                    placeholder="Confirme sua senha"
                    className={`w-full px-4 py-3 rounded-xl border bg-white outline-none transition-all focus:ring-2 focus:ring-zinc-900/10 pr-12 placeholder:text-[12px] text-[12px] ${reg.confirmPasswordError ? 'border-red-500' : 'border-zinc-200 focus:border-zinc-900'}`}
                    value={reg.confirmPassword}
                    onChange={e => setReg({ ...reg, confirmPassword: e.target.value, confirmPasswordError: '' })}
                  />
                  <button onClick={() => setReg({ ...reg, showPassword: !reg.showPassword })} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400">
                    {reg.showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {reg.confirmPasswordError && <p className="text-xs text-red-500 font-medium">{reg.confirmPasswordError}</p>}
              </div>

              <div className="pt-2">
                {/* Visual Requirements Checklist */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {requirements.map((req, i) => (
                    <div key={i} className={`flex items-center gap-2 text-[11px] font-medium transition-colors ${req.met ? 'text-emerald-600' : 'text-zinc-400'}`}>
                      {req.met ? <Check size={12} strokeWidth={3} /> : <div className="w-1 h-1 rounded-full bg-zinc-300 ml-1.5 mr-1" />}
                      {req.label}
                    </div>
                  ))}
                </div>

                {reg.passwordError && (
                  <div className="mt-4 flex items-center gap-2 text-red-500">
                    <AlertCircle size={14} />
                    <p className="text-[10px] font-bold uppercase">{reg.passwordError}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <button onClick={handleNext} className="w-full bg-zinc-900 text-white py-3.5 rounded-xl font-semibold hover:bg-zinc-800 transition-all active:scale-[0.98]">
                Avançar
              </button>
              <button onClick={() => setReg({ ...reg, step: 1 })} className="w-full py-3 text-zinc-500 font-medium hover:text-zinc-900 transition-colors">
                Voltar
              </button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6 pb-4 pt-0 leading-[16px]">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-zinc-900">Verifique seu telefone</h2>
              <p className="text-zinc-500 text-sm">Enviaremos um código de segurança.</p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[12px] font-medium text-zinc-700">Digite seu telefone *</label>
                <input
                  type="text"
                  placeholder="(00) 00000-0000"
                  className={`w-full px-4 py-3 rounded-xl border bg-white outline-none transition-all focus:ring-2 focus:ring-zinc-900/10 placeholder:text-[12px] text-[12px] ${reg.phoneError ? 'border-red-500' : 'border-zinc-200 focus:border-zinc-900'}`}
                  value={reg.phone}
                  onChange={e => setReg({ ...reg, phone: maskPhone(e.target.value), phoneError: '' })}
                />
                {reg.phoneError && <p className="text-xs text-red-500 font-medium">{reg.phoneError}</p>}
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <button onClick={handleNext} className="w-full bg-zinc-900 text-white py-3.5 rounded-xl font-semibold hover:bg-zinc-800 transition-all active:scale-[0.98]">
                Avançar
              </button>
              <button onClick={() => setReg({ ...reg, step: 2 })} className="w-full py-3 text-zinc-500 font-medium hover:text-zinc-900 transition-colors">
                Voltar
              </button>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6 pb-4 pt-0 leading-[16px]">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-zinc-900">Digite o código</h2>
              <p className="text-zinc-500 text-sm">
                Enviamos um código para o número:
                <br />
                <span className="font-semibold text-zinc-900">{reg.phone}</span>
              </p>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-6 gap-2 sm:gap-3">
                {reg.code.map((digit, i) => (
                  <input
                    key={i}
                    id={`code-${i}`}
                    type="text"
                    maxLength={1}
                    inputMode="numeric"
                    className="w-full aspect-square text-center text-xl font-bold rounded-xl border border-zinc-200 bg-white outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all"
                    value={digit}
                    onChange={e => handleCodeChange(i, e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Backspace' && !reg.code[i] && i > 0) {
                        document.getElementById(`code-${i - 1}`)?.focus();
                      }
                    }}
                  />
                ))}
              </div>
              {reg.codeError && <p className="text-xs text-red-500 font-medium text-center">{reg.codeError}</p>}
              
              <div className="flex justify-center">
                <button 
                  disabled={reg.timer > 0}
                  onClick={() => setReg({ ...reg, timer: 40, codeError: '' })}
                  className={`text-sm font-semibold transition-colors ${reg.timer > 0 ? 'text-zinc-300 cursor-not-allowed' : 'text-emerald-600 hover:text-emerald-700'}`}
                >
                  {reg.timer > 0 ? `Reenviar código em ${reg.timer}s` : 'Reenviar código'}
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <button onClick={handleConfirmCode} className="w-full bg-zinc-900 text-white py-3.5 rounded-xl font-semibold hover:bg-zinc-800 transition-all active:scale-[0.98]">
                Confirmar código
              </button>
              <button onClick={() => setReg({ ...reg, step: 3 })} className="w-full py-3 text-zinc-500 font-medium hover:text-zinc-900 transition-colors">
                Voltar
              </button>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="flex flex-col items-center justify-center py-6 text-center space-y-6">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600"
            >
              <Check size={40} strokeWidth={3} />
            </motion.div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-zinc-900">Conta criada com sucesso</h2>
              <p className="text-zinc-500 leading-relaxed">
                Agora você pode começar a gerenciar seus agendamentos.
              </p>
            </div>
            <button 
              onClick={() => navigate('/setup')}
              className="w-full bg-zinc-900 text-white py-3.5 rounded-xl font-semibold hover:bg-zinc-800 transition-all active:scale-[0.98]"
            >
              Começar já
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-[461px]">
      {renderStep()}
    </div>
  );
};

const HomeHeader = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {/* Header */}
      <header className="bg-white border-b border-zinc-100 sticky top-0 z-30">
        <div className="max-w-2xl mx-auto w-full flex items-center justify-between p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center text-white">
              <Scissors size={20} />
            </div>
            <div>
              <h1 className="font-bold text-zinc-900">BarberFlow</h1>
            </div>
          </div>
          <button 
            onClick={() => setIsMenuOpen(true)}
            className="p-2 hover:bg-zinc-100 rounded-xl transition-colors text-zinc-600"
          >
            <Menu size={24} />
          </button>
        </div>
      </header>

      {/* Sidebar Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-72 bg-white z-50 shadow-2xl p-6 flex flex-col"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-zinc-900">Menu</h2>
                <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>

              <nav className="flex-1 space-y-2">
                {[
                  { icon: Home, label: 'Página inicial', path: '/home' },
                  { icon: Calendar, label: 'Agenda', path: '/home' },
                  { icon: Briefcase, label: 'Serviço', path: '/setup' },
                  { icon: Users, label: 'Colaborador', path: '/setup' },
                ].map((item, i) => (
                  <button 
                    key={i}
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate(item.path);
                    }}
                    className="w-full flex items-center gap-3 p-4 rounded-xl text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-all font-medium"
                  >
                    <item.icon size={20} />
                    {item.label}
                  </button>
                ))}
              </nav>

              <button 
                onClick={() => navigate('/')}
                className="flex items-center gap-3 p-4 rounded-xl text-red-500 hover:bg-red-50 transition-all font-bold mt-auto"
              >
                <LogOut size={20} />
                Sair
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

const HomePage = () => {
  const navigate = useNavigate();
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('Todos os atendimentos');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeKebab, setActiveKebab] = useState<string | null>(null);

  const professionalsData = [
    { name: 'João', photo: 'https://picsum.photos/seed/joao/100/100' },
    { name: 'Carlos', photo: 'https://picsum.photos/seed/carlos/100/100' },
    { name: 'Pedro', photo: 'https://picsum.photos/seed/pedro/100/100' },
  ];

  const categories = [
    'Todos os atendimentos',
    'Corte de cabelo',
    'Barba',
    'Combo',
    'Acabamento / estética',
    'Tratamentos capilares',
    'Coloração / pigmentação',
    'Cuidados com a pele'
  ];

  const collaboratorColors: Record<string, string> = {
    'Proprietário': '#BBC5DC',
    'João': '#DCBBBB',
    'Carlos': '#DCC7BB',
    'Pedro': '#DCD3BB',
  };

  // Mock appointments
  const appointments = [
    {
      id: '1',
      time: '09:00',
      service: 'Corte de cabelo',
      price: 'R$ 50,00',
      clientName: 'Felipe Gabriel',
      clientPhone: '(11) 99999-9999',
      professionalName: 'João',
      category: 'Corte de cabelo',
      date: new Date().toISOString().split('T')[0]
    },
    {
      id: '2',
      time: '10:30',
      service: 'Barba',
      price: 'R$ 35,00',
      clientName: 'Ricardo Silva',
      clientPhone: '(11) 88888-8888',
      professionalName: 'Carlos',
      category: 'Barba',
      date: new Date().toISOString().split('T')[0]
    },
    {
      id: '3',
      time: '14:00',
      service: 'Combo',
      price: 'R$ 75,00',
      clientName: 'Lucas Oliveira',
      clientPhone: '(11) 77777-7777',
      professionalName: 'Pedro',
      category: 'Combo',
      date: new Date().toISOString().split('T')[0]
    }
  ];

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', 
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
    '18:00', '18:30', '19:00'
  ];

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  const isPast = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const slotDate = new Date(currentDate);
    slotDate.setHours(hours, minutes, 0, 0);
    return slotDate < new Date();
  };

  const changeDay = (days: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + days);
    setCurrentDate(newDate);
  };

  const toggleEmployee = (name: string) => {
    setSelectedEmployees(prev => 
      prev.includes(name) 
        ? prev.filter(e => e !== name) 
        : [...prev, name]
    );
  };

  const filteredAppointments = appointments.filter(app => {
    const matchesEmployee = selectedEmployees.length === 0 || selectedEmployees.includes(app.professionalName);
    const matchesCategory = selectedCategory === 'Todos os atendimentos' || app.category === selectedCategory;
    const matchesDate = app.date === currentDate.toISOString().split('T')[0];
    return matchesEmployee && matchesCategory && matchesDate;
  });

  const stats = {
    todayCount: filteredAppointments.length,
    availableSlots: timeSlots.length - filteredAppointments.length
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col w-full relative pb-20">
      <div className="pt-0 px-4 pb-4 space-y-8 max-w-2xl mx-auto w-full leading-[16px]">
        {/* Date Navigation - Main Element */}
        <div className="flex flex-col items-center gap-6 py-4 mb-4 h-[166px] text-base">
          <div className="flex items-center justify-between w-full max-w-md bg-white p-2 rounded-lg border border-zinc-200">
            <button 
              onClick={() => changeDay(-1)}
              className="p-3 hover:bg-zinc-50 rounded-xl transition-colors text-zinc-400 hover:text-zinc-900"
            >
              <ChevronLeft size={24} />
            </button>
            <div className="text-center px-4">
              <p className="text-base font-bold text-zinc-900 leading-[22px]">{formatDate(currentDate)}</p>
              {currentDate.toDateString() === new Date().toDateString() && (
                <p className="text-[10px] text-emerald-600 font-bold mt-1">
                  Hoje
                </p>
              )}
            </div>
            <button 
              onClick={() => changeDay(1)}
              className="p-3 hover:bg-zinc-50 rounded-xl transition-colors text-zinc-400 hover:text-zinc-900"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 gap-4 w-full">
            <div className="bg-white p-2 rounded-lg border border-zinc-200 flex flex-col items-center justify-center space-y-1 text-center h-[60px]">
              <p className="text-[10px] font-normal text-zinc-400">Atendimentos</p>
              <p className="text-base font-bold text-zinc-900">{stats.todayCount}</p>
            </div>
            <div className="bg-white p-2 rounded-lg border border-zinc-200 flex flex-col items-center justify-center space-y-1 text-center h-[60px]">
              <p className="text-[10px] font-normal text-zinc-400">Vagas</p>
              <p className="text-base font-bold text-zinc-900">{stats.availableSlots}</p>
            </div>
          </div>
        </div>

        {/* Professional Filter Section */}
        <div className="space-y-4 mb-0 pl-0 ml-0 pb-[10px]">
          <div className="flex items-center justify-end px-1">
            {selectedEmployees.length > 0 && (
              <button 
                onClick={() => setSelectedEmployees([])}
                className="text-[10px] font-bold text-zinc-400 hover:text-zinc-900 uppercase tracking-widest transition-colors"
              >
                Limpar
              </button>
            )}
          </div>
          
          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide mx-0 px-0">
            {professionalsData.map((p) => {
              const isSelected = selectedEmployees.includes(p.name);
              return (
                <button
                  key={p.name}
                  onClick={() => toggleEmployee(p.name)}
                  className={`flex items-center gap-3 p-2 pr-4 rounded-full border transition-all shrink-0 ${
                    isSelected 
                      ? 'bg-zinc-900 border-zinc-900 text-white shadow-md' 
                      : 'bg-white border-zinc-100 text-zinc-600 hover:border-zinc-300'
                  }`}
                >
                  <img 
                    src={p.photo} 
                    alt={p.name} 
                    className="w-8 h-8 rounded-full object-cover border border-white/10"
                    referrerPolicy="no-referrer"
                  />
                  <span className="text-sm font-normal whitespace-nowrap">{p.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Agenda List */}
        <div className="space-y-2">
          {timeSlots.map(time => {
            const appointment = filteredAppointments.find(app => app.time === time);
            const past = isPast(time);

            return (
              <div key={time}>
                {appointment ? (
                  <div className="relative group">
                    <div className="bg-white p-4 rounded-xl border border-zinc-100 shadow-sm hover:shadow-md transition-all cursor-pointer relative overflow-hidden group">
                      {/* Left accent bar */}
                      <div 
                        className={`absolute left-0 top-0 bottom-0 transition-all duration-300 ${!past ? 'w-[6px]' : 'w-1 opacity-40'}`}
                        style={{ backgroundColor: collaboratorColors[appointment.professionalName] || '#10b981' }}
                      />
                      
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="text-lg font-bold text-zinc-900 leading-tight">{appointment.service}</h3>
                        <div className="relative">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveKebab(activeKebab === appointment.id ? null : appointment.id);
                            }}
                            className="p-1 hover:bg-zinc-50 rounded-lg transition-colors text-zinc-400"
                          >
                            <MoreVertical size={20} />
                          </button>
                          {activeKebab === appointment.id && (
                            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-zinc-100 z-20 overflow-hidden animate-in fade-in zoom-in duration-200">
                              <button className="w-full flex items-center gap-3 p-3 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors">
                                <Trash2 size={16} />
                                Cancelar serviço
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6 mb-3">
                        <div className="flex items-center gap-1.5 text-sm font-medium text-zinc-500">
                          <Clock size={14} className="text-zinc-400" />
                          <span>{appointment.time}</span>
                        </div>
                        <span className="text-sm font-medium text-zinc-500">{appointment.price}</span>
                      </div>
                      
                      <div className="h-px bg-zinc-100 w-full mb-3" />
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-zinc-700">{appointment.clientName}</span>
                          <span className="text-[10px] text-zinc-400 font-medium">{appointment.clientPhone}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-3 px-4 rounded-xl border border-dashed border-zinc-300 flex items-center justify-between group hover:border-zinc-500 transition-all cursor-pointer bg-white">
                    <span className="text-sm font-normal text-zinc-600 group-hover:text-zinc-900 transition-colors">
                      {time}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Floating Action Button */}
        <button 
          onClick={() => navigate('/novo-agendamento')}
          className="fixed bottom-6 right-6 w-14 h-14 bg-zinc-900 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50"
          aria-label="Adicionar agendamento"
        >
          <Plus size={28} />
        </button>
      </div>
    </div>
  );
};

const SetupPage = ({ userName }: { userName: string }) => {
  const navigate = useNavigate();
  const [setup, setSetup] = useState<SetupFormState>({
    step: 1,
    subStep: 1,
    company: {
      name: '',
      document: '',
      workDays: [],
      startTime: '09:00',
      endTime: '19:00',
      collaboratorsCount: '',
    },
    services: [],
    currentService: {
      name: '',
      duration: '',
      value: '',
      category: '',
      photo: null,
    },
    professionals: [],
    currentProfessional: {
      name: '',
      photo: null,
      tag: '',
      pauseStart: '12:00',
      pauseEnd: '13:00',
      workDays: [],
    },
    errors: {},
  });

  const [isAddingMember, setIsAddingMember] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [isProfessionalModalOpen, setIsProfessionalModalOpen] = useState(false);

  React.useEffect(() => {
    if (setup.step === 3 && setup.professionals.length === 0) {
      setSetup(prev => ({
        ...prev,
        professionals: [{
          name: userName || 'Proprietário',
          photo: 'https://picsum.photos/seed/owner/200/200',
          tag: 'Proprietário',
          pauseStart: '12:00',
          pauseEnd: '13:00',
          workDays: prev.company.workDays,
        }]
      }));
    }
  }, [setup.step, userName]);

  const days = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'];
  const categories = [
    'Corte de Cabelo', 'Barba', 'Combos', 'Acabamento e Estética', 
    'Tratamentos Capilares', 'Coloração e Pigmentação', 'Cuidados com a Pele'
  ];
  const tags = ['Especialista', 'Profissional', 'Experiente'];

  const validateStep1 = () => {
    const errors: Record<string, string> = {};
    if (setup.subStep === 1) {
      if (!setup.company.name) errors.companyName = 'Preencha o nome da empresa';
      if (!setup.company.document) errors.companyDoc = 'Digite um CPF ou CNPJ válido';
    } else if (setup.subStep === 2) {
      if (setup.company.workDays.length === 0) errors.workDays = 'Selecione ao menos um dia de expediente';
    } else if (setup.subStep === 3) {
      if (!setup.company.startTime || !setup.company.endTime) errors.hours = 'Defina o horário de funcionamento';
    }
    
    setSetup(prev => ({ ...prev, errors }));
    return Object.keys(errors).length === 0;
  };

  const validateService = () => {
    const errors: Record<string, string> = {};
    if (!setup.currentService.name || !setup.currentService.duration || !setup.currentService.value || !setup.currentService.category) {
      errors.serviceFields = 'Preencha todos os campos obrigatórios';
    }
    if (!setup.currentService.photo) {
      errors.servicePhoto = 'Adicione uma foto válida para o serviço';
    }
    setSetup(prev => ({ ...prev, errors }));
    return Object.keys(errors).length === 0;
  };

  const validateProfessional = () => {
    const errors: Record<string, string> = {};
    if (!setup.currentProfessional.name) errors.profName = 'Preencha o nome';
    // Photo is now optional
    if (!setup.currentProfessional.tag) errors.profTag = 'Selecione uma tag profissional';
    if (!setup.currentProfessional.pauseStart || !setup.currentProfessional.pauseEnd) errors.profPause = 'Defina o horário de pausa';
    if (setup.currentProfessional.workDays.length === 0) errors.profDays = 'Selecione os dias trabalhados';
    
    setSetup(prev => ({ ...prev, errors }));
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (setup.step === 1) {
      if (validateStep1()) {
        if (setup.subStep < 4) {
          setSetup(prev => ({ ...prev, subStep: prev.subStep + 1 }));
        } else {
          setSetup(prev => ({ ...prev, step: 2 }));
        }
      }
    } else if (setup.step === 2) {
      if (setup.services.length > 0 || validateService()) {
        // If they have services, they can proceed. If they are filling one, we should probably add it or check if they want to.
        // For simplicity, if they have at least one service, they can go next.
        if (setup.services.length === 0) {
          const s = setup.currentService;
          setSetup(prev => ({ ...prev, services: [...prev.services, s], step: 3 }));
        } else {
          setSetup(prev => ({ ...prev, step: 3 }));
        }
      }
    } else if (setup.step === 3) {
      if (setup.professionals.length > 0) {
        navigate('/home');
      }
    }
  };

  const addService = (closeModal = true) => {
    if (validateService()) {
      setSetup(prev => ({
        ...prev,
        services: [...prev.services, prev.currentService],
        currentService: { name: '', duration: '', value: '', category: '', photo: null },
        errors: {}
      }));
      if (closeModal) {
        setIsServiceModalOpen(false);
      }
    }
  };

  const addProfessional = () => {
    if (validateProfessional()) {
      setSetup(prev => ({
        ...prev,
        professionals: [...prev.professionals, prev.currentProfessional],
        currentProfessional: { name: '', photo: null, tag: '', pauseStart: '12:00', pauseEnd: '13:00', workDays: [] },
        errors: {}
      }));
      setIsProfessionalModalOpen(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-zinc-900 mb-2 w-[310px] h-[32px]">Configure sua empresa</h2>
        <p className="text-zinc-500 h-[42px]">
          {setup.subStep === 1 && 'Conte-nos um pouco sobre sua barbearia'}
          {setup.subStep === 2 && 'Selecionar dias de expediente'}
          {setup.subStep === 3 && 'Defina os horários de atendimento'}
          {setup.subStep === 4 && 'Quantas pessoas trabalham com você?'}
        </p>
      </div>

      <div className="space-y-4">
        {setup.subStep === 1 && (
          <>
            <div className="space-y-1.5">
              <label className="text-[12px] font-medium text-zinc-700">Nome da empresa *</label>
              <input 
                type="text"
                placeholder="Nome da sua barbearia"
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-zinc-900 outline-none transition-all placeholder:text-[12px] text-[12px]"
                value={setup.company.name}
                onChange={e => setSetup(prev => ({ ...prev, company: { ...prev.company, name: e.target.value }, errors: { ...prev.errors, companyName: '' } }))}
              />
              {setup.errors.companyName && <p className="text-xs text-red-500">{setup.errors.companyName}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-[12px] font-medium text-zinc-700">CNPJ ou CPF*</label>
              <input 
                type="text"
                placeholder="digite seu cpf ou cnpj"
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-zinc-900 outline-none transition-all placeholder:text-[12px] text-[12px]"
                value={setup.company.document}
                onChange={e => setSetup(prev => ({ ...prev, company: { ...prev.company, document: e.target.value }, errors: { ...prev.errors, companyDoc: '' } }))}
              />
              {setup.errors.companyDoc && <p className="text-xs text-red-500">{setup.errors.companyDoc}</p>}
            </div>
          </>
        )}

        {setup.subStep === 2 && (
          <div className="space-y-1.5">
            <div className="space-y-1.5">
              {days.map(day => (
                <button
                  key={day}
                  type="button"
                  onClick={() => {
                    const current = setup.company.workDays;
                    const next = current.includes(day) ? current.filter(d => d !== day) : [...current, day];
                    setSetup(prev => ({ ...prev, company: { ...prev.company, workDays: next }, errors: { ...prev.errors, workDays: '' } }));
                  }}
                  className={`w-full p-3 rounded-xl border-2 transition-all flex items-center justify-between group ${
                    setup.company.workDays.includes(day) 
                      ? 'border-emerald-500 bg-emerald-50/50 text-zinc-900' 
                      : 'border-zinc-100 bg-white text-zinc-600 hover:border-zinc-200'
                  }`}
                >
                  <span className="text-sm font-semibold">{day}</span>
                  {setup.company.workDays.includes(day) && (
                    <Check size={18} className="text-emerald-500" />
                  )}
                </button>
              ))}
            </div>
            {setup.errors.workDays && <p className="text-xs text-red-500">{setup.errors.workDays}</p>}
          </div>
        )}

        {setup.subStep === 3 && (
          <>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[12px] font-medium text-zinc-700">Início *</label>
                <input 
                  type="time"
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-zinc-900 outline-none transition-all text-[12px]"
                  value={setup.company.startTime}
                  onChange={e => setSetup(prev => ({ ...prev, company: { ...prev.company, startTime: e.target.value } }))}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[12px] font-medium text-zinc-700">Fim *</label>
                <input 
                  type="time"
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-zinc-900 outline-none transition-all text-[12px]"
                  value={setup.company.endTime}
                  onChange={e => setSetup(prev => ({ ...prev, company: { ...prev.company, endTime: e.target.value } }))}
                />
              </div>
            </div>
            {setup.errors.hours && <p className="text-xs text-red-500">{setup.errors.hours}</p>}
          </>
        )}

        {setup.subStep === 4 && (
          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-zinc-700">Quantos colaboradores?</label>
            <div className="relative">
              <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
              <input 
                type="number"
                placeholder="Ex: 5"
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-zinc-200 focus:border-zinc-900 outline-none transition-all placeholder:text-[12px] text-[12px]"
                value={setup.company.collaboratorsCount}
                onChange={e => setSetup(prev => ({ ...prev, company: { ...prev.company, collaboratorsCount: e.target.value }, errors: { ...prev.errors, collaborators: '' } }))}
              />
            </div>
            {setup.errors.collaborators && <p className="text-xs text-red-500">{setup.errors.collaborators}</p>}
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-4">
        <button 
          onClick={() => {
            if (setup.subStep > 1) {
              setSetup(prev => ({ ...prev, subStep: prev.subStep - 1 }));
            } else {
              navigate(-1);
            }
          }}
          className="flex-1 py-3.5 rounded-xl font-semibold text-zinc-600 bg-zinc-100 hover:bg-zinc-200 transition-all"
        >
          Voltar
        </button>
        <button 
          onClick={handleNext}
          className="flex-[2] py-3.5 rounded-xl font-semibold text-white bg-zinc-900 hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-200"
        >
          Próximo
        </button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-zinc-900 mb-2 w-[310px] h-[32px]">Cadastre seus serviços</h2>
        <p className="text-zinc-500 h-[42px]">Adicione os serviços que sua barbearia realiza</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <label className="text-[12px] font-bold text-zinc-900">Serviços cadastrados</label>
          
          <div className="space-y-3">
            {setup.services.length === 0 ? (
              <div className="flex items-center gap-4 p-3 mb-8 bg-white rounded-lg border border-zinc-200 leading-6">
                <div className="w-14 h-14 bg-zinc-100 rounded-lg flex items-center justify-center text-base">
                  <Camera size={24} className="text-zinc-300" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-zinc-400">Adicione um serviço</p>
                  <p className="text-xs text-zinc-300">Valor: 00,00 • Duração: 00:00</p>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {setup.services.map((s, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-zinc-200">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-zinc-100 rounded-xl overflow-hidden">
                        {s.photo ? (
                          <img src={s.photo} alt={s.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-zinc-100">
                            <Camera size={20} className="text-zinc-300" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-zinc-900">{s.name}</p>
                        <p className="text-xs text-zinc-500">Valor: {s.value} • Duração: {s.duration}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setSetup(prev => ({ ...prev, services: prev.services.filter((_, idx) => idx !== i) }))}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button 
              onClick={() => setIsServiceModalOpen(true)}
              className="w-full py-4 rounded-xl border-2 border-zinc-900 text-zinc-900 font-bold hover:bg-zinc-50 transition-all flex items-center justify-center gap-2"
            >
              Adicionar serviço
            </button>
          </div>
        </div>
      </div>

      {/* Modal / Drawer */}
      {isServiceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center md:p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm h-[2000px]" onClick={() => setIsServiceModalOpen(false)} />
          <div className="relative w-[340px] md:max-w-md bg-white rounded-[12px] shadow-2xl overflow-hidden animate-in slide-in-from-bottom md:zoom-in duration-300 h-[613px] md:h-auto flex flex-col">
            <div className="p-[24px_24px_32px_24px] space-y-6 flex flex-col h-[625px] w-[340px] m-0 leading-6 text-[12px]">
              <div className="flex items-center justify-between shrink-0 pl-0 mr-0 mb-0">
                <h3 className="text-xl font-bold text-zinc-900">Adicione seu serviço</h3>
                <button onClick={() => setIsServiceModalOpen(false)} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4 mb-0 pr-1 scrollbar-hide">
                <div className="space-y-1.5">
                  <label className="text-[12px] font-medium text-zinc-700">Nome do serviço*</label>
                  <input 
                    type="text"
                    placeholder="EX: Corte Masculino"
                    className="w-full px-4 py-3.5 rounded-xl border border-zinc-200 focus:border-zinc-900 outline-none transition-all placeholder:text-[12px] text-[12px]"
                    value={setup.currentService.name}
                    onChange={e => setSetup(prev => ({ ...prev, currentService: { ...prev.currentService, name: e.target.value }, errors: { ...prev.errors, serviceFields: '' } }))}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[12px] font-medium text-zinc-700">Selecione a duração</label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                    <input 
                      type="text"
                      placeholder="Ex: 20 min"
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-zinc-200 focus:border-zinc-900 outline-none transition-all placeholder:text-[12px] text-[12px]"
                      value={setup.currentService.duration}
                      onChange={e => setSetup(prev => ({ ...prev, currentService: { ...prev.currentService, duration: e.target.value }, errors: { ...prev.errors, serviceFields: '' } }))}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[12px] font-medium text-zinc-700">Valor*</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                    <input 
                      type="text"
                      placeholder="EX: R$ 30,00"
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-zinc-200 focus:border-zinc-900 outline-none transition-all placeholder:text-[12px] text-[12px]"
                      value={setup.currentService.value}
                      onChange={e => setSetup(prev => ({ ...prev, currentService: { ...prev.currentService, value: e.target.value }, errors: { ...prev.errors, serviceFields: '' } }))}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[12px] font-medium text-zinc-700">Categoria</label>
                  <div className="relative">
                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                    <button 
                      onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                      className="w-full pl-12 pr-12 py-3.5 rounded-xl border border-zinc-200 focus:border-zinc-900 outline-none transition-all bg-white text-left flex items-center justify-between"
                    >
                      <span className={setup.currentService.category ? 'text-zinc-900 text-[12px]' : 'text-zinc-400 text-[12px]'}>
                        {setup.currentService.category || 'Selecione a categoria'}
                      </span>
                      {isCategoryOpen ? <ChevronUp size={18} className="text-zinc-400" /> : <ChevronDown size={18} className="text-zinc-400" />}
                    </button>
                    
                    {/* Desktop Dropdown */}
                    {isCategoryOpen && (
                      <div className="hidden md:block absolute z-10 w-full mt-1 bg-white border border-zinc-200 rounded-2xl shadow-xl overflow-hidden">
                        {categories.map(c => (
                          <button
                            key={c}
                            className="w-full px-4 py-3 text-left text-[12px] hover:bg-zinc-50 transition-colors border-b border-zinc-50 last:border-0"
                            onClick={() => {
                              setSetup(prev => ({ ...prev, currentService: { ...prev.currentService, category: c }, errors: { ...prev.errors, serviceFields: '' } }));
                              setIsCategoryOpen(false);
                            }}
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[12px] font-medium text-zinc-700">Foto do serviço</label>
                  <div className="relative">
                    <Camera className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                    <input 
                      type="file"
                      className="hidden"
                      id="service-photo"
                      onChange={e => {
                        // Mock photo upload
                        setSetup(prev => ({ ...prev, currentService: { ...prev.currentService, photo: 'https://picsum.photos/seed/barber/200/200' }, errors: { ...prev.errors, servicePhoto: '' } }));
                      }}
                    />
                    <label 
                      htmlFor="service-photo"
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-zinc-200 bg-white text-zinc-500 cursor-pointer flex items-center justify-between hover:border-zinc-300 transition-all"
                    >
                      <span className="text-[12px]">{setup.currentService.photo ? 'Foto selecionada' : 'Selecione a foto'}</span>
                      {setup.currentService.photo && <Check size={16} className="text-emerald-500" />}
                    </label>
                  </div>
                </div>

                {setup.errors.serviceFields && <p className="text-xs text-red-500">{setup.errors.serviceFields}</p>}
                {setup.errors.servicePhoto && <p className="text-xs text-red-500 text-left">{setup.errors.servicePhoto}</p>}
              </div>

              <div className="flex gap-3 pt-2 shrink-0">
                <button 
                  onClick={() => addService(false)}
                  className="flex-1 py-4 px-0 rounded-xl border-0 text-zinc-900 font-bold hover:bg-zinc-50 transition-all leading-[12px]"
                >
                  Adicionar outro
                </button>
                <button 
                  onClick={() => addService(true)}
                  className="flex-1 py-4 rounded-xl bg-zinc-900 text-white font-bold hover:bg-zinc-800 transition-all"
                >
                  Concluir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Category Drawer */}
      {isCategoryOpen && (
        <div className="fixed inset-0 z-[60] flex items-end md:hidden">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsCategoryOpen(false)} />
          <div className="relative w-[375px] mx-auto bg-white rounded-t-[32px] shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300 h-[450px] flex flex-col">
            <div className="p-[24px] space-y-6 flex flex-col h-full text-[12px]">
              <div className="flex items-center justify-between shrink-0">
                <h3 className="text-xl font-bold text-zinc-900">Selecione a categoria</h3>
                <button onClick={() => setIsCategoryOpen(false)} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto space-y-0 pb-0 scrollbar-hide m-0 pl-0 pt-0 leading-[0px]">
                {categories.map((c, index) => (
                  <button
                    key={c}
                    className={`w-full px-4 py-4 text-left text-base font-medium hover:bg-zinc-50 transition-colors border-b border-zinc-50 last:border-0 rounded-xl m-0 ml-0 mb-0 ${index === 0 ? 'h-[57px] pt-[16px]' : ''}`}
                    onClick={() => {
                      setSetup(prev => ({ ...prev, currentService: { ...prev.currentService, category: c }, errors: { ...prev.errors, serviceFields: '' } }));
                      setIsCategoryOpen(false);
                    }}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-3 pt-[120px]">
        <button 
          onClick={() => setSetup(prev => ({ ...prev, step: 1, subStep: 4 }))}
          className="flex-1 py-4 rounded-xl font-semibold text-zinc-600 bg-zinc-100 hover:bg-zinc-200 transition-all"
        >
          Voltar
        </button>
        <button 
          onClick={handleNext}
          className="flex-[2] py-4 rounded-xl font-semibold text-white bg-zinc-900 hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-200"
        >
          Próximo
        </button>
      </div>
    </div>
  );
  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-zinc-900 mb-2 w-[310px] h-[32px]">
          Cadastrar colaborador
        </h2>
        <p className="text-zinc-500 h-[42px]">
          Gerencie a equipe da sua barbearia
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <label className="text-[12px] font-bold text-zinc-900">Colaborador cadastrado</label>
          
          <div className="space-y-3">
            {setup.professionals.map((p, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-zinc-200 group hover:border-zinc-300 transition-all cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-zinc-100">
                    {p.photo ? (
                      <img src={p.photo} alt={p.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Camera size={20} className="text-zinc-300" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-zinc-900">{p.name}</p>
                    <p className="text-xs text-zinc-500">{p.tag}</p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-zinc-300 group-hover:text-zinc-900 transition-colors" />
              </div>
            ))}

            <button 
              onClick={() => setIsProfessionalModalOpen(true)}
              className="w-full py-4 rounded-xl border-2 border-zinc-900 text-zinc-900 font-bold hover:bg-zinc-50 transition-all flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              Adicionar colaborador
            </button>
          </div>
        </div>
      </div>

      {/* Modal / Drawer for Professional */}
      {isProfessionalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center md:p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm h-[2000px]" onClick={() => setIsProfessionalModalOpen(false)} />
          <div className="relative w-[340px] md:max-w-md bg-white rounded-[12px] shadow-2xl overflow-hidden animate-in slide-in-from-bottom md:zoom-in duration-300 h-[613px] md:h-auto flex flex-col">
            <div className="p-[24px_24px_32px_24px] space-y-6 flex flex-col h-[625px] w-[340px] m-0 leading-6 text-[12px]">
              <div className="flex items-center justify-between shrink-0 pl-0 mr-0 mb-0">
                <h3 className="text-xl font-bold text-zinc-900">Cadastrar colaborador</h3>
                <button onClick={() => setIsProfessionalModalOpen(false)} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4 mb-0 pr-1 scrollbar-hide">
                <div className="space-y-1.5">
                  <label className="text-[12px] font-medium text-zinc-700">Nome do colaborador*</label>
                  <input 
                    type="text"
                    placeholder="Digite o nome"
                    className="w-full px-4 py-3.5 rounded-xl border border-zinc-200 focus:border-zinc-900 outline-none transition-all placeholder:text-[12px] text-[12px]"
                    value={setup.currentProfessional.name}
                    onChange={e => setSetup(prev => ({ ...prev, currentProfessional: { ...prev.currentProfessional, name: e.target.value }, errors: { ...prev.errors, profName: '' } }))}
                  />
                  {setup.errors.profName && <p className="text-xs text-red-500">{setup.errors.profName}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[12px] font-medium text-zinc-700">Horário de pausa*</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-[12px] text-zinc-400 font-normal leading-[16px]">Inicio</span>
                      <input 
                        type="time"
                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-zinc-900 outline-none transition-all text-[12px]"
                        value={setup.currentProfessional.pauseStart}
                        onChange={e => setSetup(prev => ({ ...prev, currentProfessional: { ...prev.currentProfessional, pauseStart: e.target.value } }))}
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[12px] text-zinc-400 font-normal leading-[16px]">Fim</span>
                      <input 
                        type="time"
                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-zinc-900 outline-none transition-all text-[12px]"
                        value={setup.currentProfessional.pauseEnd}
                        onChange={e => setSetup(prev => ({ ...prev, currentProfessional: { ...prev.currentProfessional, pauseEnd: e.target.value } }))}
                      />
                    </div>
                  </div>
                  {setup.errors.profPause && <p className="text-xs text-red-500">{setup.errors.profPause}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[12px] font-medium text-zinc-700">Seleção de tag*</label>
                  <div className="relative">
                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                    <select 
                      className="w-full pl-12 pr-10 py-3.5 rounded-xl border border-zinc-200 focus:border-zinc-900 outline-none transition-all appearance-none bg-white text-[12px]"
                      value={setup.currentProfessional.tag}
                      onChange={e => setSetup(prev => ({ ...prev, currentProfessional: { ...prev.currentProfessional, tag: e.target.value }, errors: { ...prev.errors, profTag: '' } }))}
                    >
                      <option value="" disabled>Selecione uma tag</option>
                      {['Experiente', 'Profissional', 'Especialista'].map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" size={18} />
                  </div>
                  {setup.errors.profTag && <p className="text-xs text-red-500">{setup.errors.profTag}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[12px] font-medium text-zinc-700">Foto do colaborador</label>
                  <div className="relative">
                    <Camera className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                    <input 
                      type="file"
                      className="hidden"
                      id="prof-photo-modal"
                      onChange={e => {
                        setSetup(prev => ({ ...prev, currentProfessional: { ...prev.currentProfessional, photo: 'https://picsum.photos/seed/face/200/200' }, errors: { ...prev.errors, profPhoto: '' } }));
                      }}
                    />
                    <label 
                      htmlFor="prof-photo-modal"
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-zinc-200 bg-white text-zinc-500 cursor-pointer flex items-center justify-between hover:border-zinc-300 transition-all"
                    >
                      <span className="text-[12px]">{setup.currentProfessional.photo ? 'Foto selecionada' : 'Selecione uma foto'}</span>
                      {setup.currentProfessional.photo && <Check size={16} className="text-emerald-500" />}
                    </label>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[12px] font-medium text-zinc-700">Dias de trabalho*</label>
                  <div className="flex flex-wrap gap-2">
                    {days.map(day => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => {
                          const current = setup.currentProfessional.workDays;
                          const next = current.includes(day) ? current.filter(d => d !== day) : [...current, day];
                          setSetup(prev => ({ ...prev, currentProfessional: { ...prev.currentProfessional, workDays: next }, errors: { ...prev.errors, profDays: '' } }));
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                          setup.currentProfessional.workDays.includes(day) 
                            ? 'bg-zinc-900 text-white' 
                            : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                  {setup.errors.profDays && <p className="text-xs text-red-500">{setup.errors.profDays}</p>}
                </div>
              </div>

              <div className="flex gap-3 pt-2 shrink-0">
                <button 
                  onClick={() => setIsProfessionalModalOpen(false)}
                  className="flex-1 py-4 px-0 rounded-xl border-0 text-zinc-900 font-bold hover:bg-zinc-50 transition-all leading-[12px]"
                >
                  Cancelar
                </button>
                <button 
                  onClick={addProfessional}
                  className="flex-1 py-4 rounded-xl bg-zinc-900 text-white font-bold hover:bg-zinc-800 transition-all"
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-3 pt-[120px]">
        <button 
          onClick={() => setSetup(prev => ({ ...prev, step: 2 }))}
          className="flex-1 py-4 rounded-xl font-semibold text-zinc-600 bg-zinc-100 hover:bg-zinc-200 transition-all"
        >
          Voltar
        </button>
        <button 
          onClick={handleNext}
          className="flex-[2] py-4 rounded-xl font-semibold text-white bg-zinc-900 hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-200"
        >
          Próximo
        </button>
      </div>
    </div>
  );

  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <div className="flex gap-1.5 pb-4 pt-0 leading-[16px]">
          {[1, 2, 3].map(s => (
            <div 
              key={s} 
              className={`h-1.5 rounded-full transition-all duration-500 ${
                setup.step === s ? 'w-8 bg-zinc-900' : 'w-4 bg-zinc-200'
              }`} 
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={setup.step + '-' + setup.subStep + (isAddingMember ? '-member' : '')}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {setup.step === 1 && renderStep1()}
          {setup.step === 2 && renderStep2()}
          {setup.step === 3 && renderStep3()}
        </motion.div>
      </AnimatePresence>
    </>
  );
};

const BottomSheet = ({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) => {
  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
      />
      <motion.div 
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed bottom-0 left-0 right-0 bg-white z-50 rounded-t-3xl p-4 shadow-2xl h-[380px] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-zinc-900">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
            <X size={24} className="text-zinc-600" />
          </button>
        </div>
        {children}
      </motion.div>
    </>
  );
};

const NovoAgendamentoPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    service: '',
    professional: '',
    date: new Date().toISOString().split('T')[0],
    time: '',
    clientName: '',
    clientPhone: '',
  });
  const [isServiceSheetOpen, setIsServiceSheetOpen] = useState(false);
  const [isProfessionalSheetOpen, setIsProfessionalSheetOpen] = useState(false);

  const services = [
    { name: 'Corte de cabelo', price: 'R$ 50,00', duration: '30 min' },
    { name: 'Barba', price: 'R$ 35,00', duration: '20 min' },
    { name: 'Combo', price: 'R$ 75,00', duration: '50 min' },
  ];

  const professionals = ['João', 'Carlos', 'Pedro'];
  const times = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00'];

  const handleSave = () => {
    // In a real app, this would save to a database
    alert('Agendamento realizado com sucesso!');
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col w-full">
      <div className="flex-1 overflow-y-auto pt-0 px-4 pb-4 max-w-md mx-auto w-full leading-[16px]">
        {/* Title */}
        <div className="h-[50px] mb-0 flex items-center">
          <h2 className="text-[20px] leading-[20px] font-bold text-zinc-900">Adicionar agendamento</h2>
        </div>

        {/* Step 1: Service */}
        <div className="space-y-4 mb-4">
          <label className="text-[12px] font-normal text-zinc-500">Serviço</label>
          <div 
            onClick={() => setIsServiceSheetOpen(true)}
            className="w-full p-4 rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-900 font-medium cursor-pointer flex justify-between items-center hover:border-zinc-300 transition-all leading-[16px]"
          >
            <span className={formData.service ? 'text-zinc-900 text-[12px]' : 'text-zinc-400 text-[12px]'}>
              {formData.service || 'Selecionar serviço'}
            </span>
            <ChevronDown size={20} className="text-zinc-400" />
          </div>
        </div>

        {/* Step 2: Professional */}
        <div className="space-y-4 mb-4">
          <label className="text-[12px] font-normal text-zinc-500">Profissional</label>
          <div 
            onClick={() => setIsProfessionalSheetOpen(true)}
            className="w-full p-4 rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-900 font-medium cursor-pointer flex justify-between items-center hover:border-zinc-300 transition-all leading-[16px]"
          >
            <span className={formData.professional ? 'text-zinc-900 text-[12px]' : 'text-zinc-400 text-[12px]'}>
              {formData.professional || 'Selecionar profissional'}
            </span>
            <ChevronDown size={20} className="text-zinc-400" />
          </div>
        </div>

        {/* Step 3: Date & Time */}
        <div className="space-y-4 mb-4">
          <div className="space-y-4">
            <label className="text-[12px] font-normal text-zinc-500">Data</label>
            <input 
              type="date" 
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full p-4 rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-900 font-medium focus:outline-none focus:ring-2 focus:ring-zinc-900/10 text-[12px] leading-[16px]"
            />
          </div>
          <div className="space-y-4">
            <label className="text-[12px] font-normal text-zinc-500">Horário</label>
            <select 
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              className="w-full p-4 rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-900 font-medium focus:outline-none focus:ring-2 focus:ring-zinc-900/10 text-[12px] leading-[16px]"
            >
              <option value="" className="text-[12px]">Selecionar</option>
              {times.map(t => <option key={t} value={t} className="text-[12px]">{t}</option>)}
            </select>
          </div>
        </div>

        {/* Step 4: Client Info */}
        <div className="space-y-0 pt-4 mb-4">
          <div className="space-y-4 mb-4">
            <label className="text-[12px] font-normal text-zinc-500">Nome do cliente</label>
            <input 
              type="text" 
              placeholder="Ex: João Silva"
              value={formData.clientName}
              onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
              className="w-full p-4 rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-900 font-medium focus:outline-none focus:ring-2 focus:ring-zinc-900/10 placeholder:text-[12px] text-[12px] leading-[16px]"
            />
          </div>
          <div className="space-y-4 mb-0">
            <label className="text-[12px] font-normal text-zinc-500">Telefone</label>
            <input 
              type="tel" 
              placeholder="(11) 99999-9999"
              value={formData.clientPhone}
              onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
              className="w-full p-4 rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-900 font-medium focus:outline-none focus:ring-2 focus:ring-zinc-900/10 placeholder:text-[12px] text-[12px] leading-[16px]"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-8 mb-12">
          <button
            onClick={() => navigate(-1)}
            className="flex-1 bg-zinc-100 text-zinc-900 p-4 rounded-xl font-normal text-[16px] leading-[20px] hover:bg-zinc-200 transition-all"
          >
            Voltar
          </button>
          <button
            onClick={handleSave}
            disabled={!formData.service || !formData.professional || !formData.time || !formData.clientName}
            className="flex-[2] bg-zinc-900 text-white p-4 rounded-xl font-normal text-[16px] leading-[20px] shadow-lg hover:bg-zinc-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirmar
          </button>
        </div>
      </div>

      {/* Bottom Sheets */}
      <AnimatePresence>
        {isServiceSheetOpen && (
          <BottomSheet 
            title="Escolha o serviço" 
            onClose={() => setIsServiceSheetOpen(false)}
          >
            <div className="space-y-3 pb-8">
              {services.map(s => (
                <button
                  key={s.name}
                  onClick={() => {
                    setFormData({ ...formData, service: s.name });
                    setIsServiceSheetOpen(false);
                  }}
                  className={`w-full p-4 rounded-2xl border transition-all text-left flex justify-between items-center ${
                    formData.service === s.name 
                      ? 'border-zinc-900 bg-zinc-900 text-white' 
                      : 'border-zinc-100 bg-white text-zinc-600 hover:border-zinc-300'
                  }`}
                >
                  <div>
                    <p className={`font-bold ${formData.service === s.name ? 'text-white' : 'text-zinc-900'}`}>{s.name}</p>
                    <p className={`text-xs ${formData.service === s.name ? 'text-zinc-400' : 'text-zinc-400'}`}>{s.duration}</p>
                  </div>
                  <span className={`font-bold ${formData.service === s.name ? 'text-white' : 'text-zinc-900'}`}>{s.price}</span>
                </button>
              ))}
            </div>
          </BottomSheet>
        )}

        {isProfessionalSheetOpen && (
          <BottomSheet 
            title="Escolha o profissional" 
            onClose={() => setIsProfessionalSheetOpen(false)}
          >
            <div className="space-y-3 pb-8">
              {professionals.map(p => (
                <button
                  key={p}
                  onClick={() => {
                    setFormData({ ...formData, professional: p });
                    setIsProfessionalSheetOpen(false);
                  }}
                  className={`w-full p-5 rounded-2xl border transition-all text-left font-bold ${
                    formData.professional === p 
                      ? 'border-zinc-900 bg-zinc-900 text-white' 
                      : 'border-zinc-100 bg-white text-zinc-600 hover:border-zinc-300'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </BottomSheet>
        )}
      </AnimatePresence>
    </div>
  );
};

const TermsPage = () => {
  const navigate = useNavigate();
  return (
    <div className="space-y-6 relative">
      <button 
        onClick={() => navigate(-1)} 
        className="absolute -top-2 -right-2 p-2 text-zinc-400 hover:text-zinc-900 transition-colors bg-zinc-50 rounded-full"
        title="Fechar"
      >
        <X size={20} />
      </button>
      <h2 className="text-2xl font-bold text-zinc-900">Termos de Uso</h2>
      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        <p className="text-zinc-500 leading-relaxed">
          Estes são os termos de uso do BarberFlow. Ao utilizar nossa plataforma, você concorda com as regras de agendamento e cancelamento estabelecidas pelas barbearias parceiras.
        </p>
        <p className="text-zinc-500 leading-relaxed">
          O BarberFlow atua como intermediário entre clientes e profissionais da beleza. Não nos responsabilizamos pela qualidade técnica dos serviços prestados, mas garantimos a integridade do processo de agendamento.
        </p>
      </div>
      <button 
        onClick={() => navigate(-1)}
        className="w-full py-3 bg-zinc-100 text-zinc-900 rounded-xl font-semibold hover:bg-zinc-200 transition-colors"
      >
        Fechar
      </button>
    </div>
  );
};

const PrivacyPage = () => {
  const navigate = useNavigate();
  return (
    <div className="space-y-6 relative">
      <button 
        onClick={() => navigate(-1)} 
        className="absolute -top-2 -right-2 p-2 text-zinc-400 hover:text-zinc-900 transition-colors bg-zinc-50 rounded-full"
        title="Fechar"
      >
        <X size={20} />
      </button>
      <h2 className="text-2xl font-bold text-zinc-900">Política de Privacidade</h2>
      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        <p className="text-zinc-500 leading-relaxed">
          Sua privacidade é importante para nós. Coletamos apenas os dados necessários para garantir a melhor experiência de agendamento e comunicação com sua barbearia.
        </p>
        <p className="text-zinc-500 leading-relaxed">
          Dados como nome, email e telefone são compartilhados apenas com a barbearia na qual você realiza o agendamento. Nunca vendemos seus dados para terceiros.
        </p>
      </div>
      <button 
        onClick={() => navigate(-1)}
        className="w-full py-3 bg-zinc-100 text-zinc-900 rounded-xl font-semibold hover:bg-zinc-200 transition-colors"
      >
        Fechar
      </button>
    </div>
  );
};

const Footer = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/' || location.pathname === '/login';

  if (!isLoginPage) return null;

  return (
    <footer className="p-6 sm:p-8 flex flex-col items-center gap-4 h-[90px]">
      <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-xs font-medium text-zinc-400 px-4 text-center">
        <Link 
          to="/termos-de-uso"
          className="hover:text-zinc-900 transition-colors whitespace-nowrap"
        >
          Termos de Uso
        </Link>
        <Link 
          to="/politica-de-privacidade"
          className="hover:text-zinc-900 transition-colors whitespace-nowrap"
        >
          Política de Privacidade
        </Link>
      </div>
      <p className="text-[10px] uppercase tracking-widest text-zinc-300 font-bold">
        BarberFlow © 2026
      </p>
    </footer>
  );
};

// --- Main App with Router ---

export default function App() {
  const [userName, setUserName] = useState('');

  return (
    <Router>
      <div className="min-h-screen bg-zinc-50 flex flex-col font-sans selection:bg-zinc-900 selection:text-white overflow-x-hidden">
        <main className="flex-1 flex flex-col items-center h-[660px]">
          <AppContent userName={userName} setUserName={setUserName} />
        </main>
        <Footer />
      </div>
    </Router>
  );
}

function AppContent({ userName, setUserName }: { userName: string; setUserName: (name: string) => void }) {
  const location = useLocation();
  const isWidePage = location.pathname === '/setup' || location.pathname === '/home';

  const isHome = location.pathname === '/home';
  const isNewAppointment = location.pathname === '/novo-agendamento';

  return (
    <div
      className={isHome || isNewAppointment
        ? "w-full"
        : isWidePage 
          ? "w-full max-w-2xl" 
          : "w-full max-w-md pt-0 pl-[2px] pr-0 pb-0"
      }
    >
      {(isHome || isNewAppointment) && <HomeHeader />}
      <div className={isHome || isNewAppointment ? "" : "p-4 sm:p-8 my-6"}>
        <Routes location={location}>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/criar-conta" element={<RegisterPage setUserName={setUserName} />} />
        <Route path="/setup" element={<SetupPage userName={userName} />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/novo-agendamento" element={<NovoAgendamentoPage />} />
        <Route path="/termos-de-uso" element={<TermsPage />} />
        <Route path="/politica-de-privacidade" element={<PrivacyPage />} />
      </Routes>
      </div>
    </div>
  );
}
