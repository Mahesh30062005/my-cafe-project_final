import { useEffect, useMemo, useState } from 'react';
import {
  adminLoginPassword,
  adminRequestOtp,
  adminVerifyOtp,
  createEmployee,
  deleteEmployee,
  fetchEmployees,
} from '../api/client';

const ADMIN_STORAGE_KEY = 'adminSession';

const loadAdminSession = () => {
  const raw = localStorage.getItem(ADMIN_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const isExpired = (session) => {
  if (!session?.expiresAt) return true;
  const exp = new Date(session.expiresAt);
  return Number.isNaN(exp.getTime()) || exp.getTime() <= Date.now();
};

export default function AdminPage() {
  const [session, setSession] = useState(() => {
    const stored = loadAdminSession();
    if (stored && !isExpired(stored)) return stored;
    if (stored) localStorage.removeItem(ADMIN_STORAGE_KEY);
    return null;
  });
  const [mode, setMode] = useState('password');
  const [form, setForm] = useState({ email: '', password: '' });
  const [otpForm, setOtpForm] = useState({ email: '', code: '' });
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [employeeForm, setEmployeeForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    roleTitle: '',
    department: '',
    joiningDate: '',
    status: 'ACTIVE',
  });

  const isAuthed = useMemo(() => !!session && !isExpired(session), [session]);

  const saveSession = (data) => {
    const next = { token: data.token, expiresAt: data.expiresAt };
    localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(next));
    localStorage.setItem('adminToken', data.token);
    setSession(next);
  };

  const handlePasswordLogin = async (event) => {
    event.preventDefault();
    setError(null);
    try {
      const data = await adminLoginPassword(form);
      saveSession(data);
    } catch (err) {
      setError(err.message || 'Admin login failed');
    }
  };

  const handleRequestOtp = async () => {
    setError(null);
    try {
      await adminRequestOtp({ email: otpForm.email });
      setOtpSent(true);
    } catch (err) {
      setError(err.message || 'Failed to send OTP');
    }
  };

  const handleVerifyOtp = async () => {
    setError(null);
    try {
      const data = await adminVerifyOtp(otpForm);
      saveSession(data);
    } catch (err) {
      setError(err.message || 'OTP verification failed');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(ADMIN_STORAGE_KEY);
    localStorage.removeItem('adminToken');
    setSession(null);
  };

  const loadEmployees = async () => {
    const data = await fetchEmployees();
    setEmployees(data);
  };

  useEffect(() => {
    if (isAuthed) {
      loadEmployees().catch(() => setError('Failed to load employees'));
    }
  }, [isAuthed]);

  const handleCreateEmployee = async (event) => {
    event.preventDefault();
    setError(null);
    try {
      await createEmployee({
        ...employeeForm,
        joiningDate: employeeForm.joiningDate,
      });
      setEmployeeForm({
        fullName: '',
        email: '',
        phone: '',
        roleTitle: '',
        department: '',
        joiningDate: '',
        status: 'ACTIVE',
      });
      await loadEmployees();
    } catch (err) {
      setError(err.message || 'Failed to add employee');
    }
  };

  const handleDeleteEmployee = async (id) => {
    setError(null);
    try {
      await deleteEmployee(id);
      await loadEmployees();
    } catch (err) {
      setError(err.message || 'Failed to delete employee');
    }
  };

  return (
    <section className="bg-cream-100 min-h-screen">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-12 py-12">
        <div className="mb-8">
          <h1 className="font-display text-espresso-700 text-4xl font-light">Admin</h1>
          <p className="font-body text-muted text-sm mt-2">
            Password login or OTP via email for admin access.
          </p>
        </div>

        {error && (
          <div className="mb-6 text-sm text-red-600 bg-red-50 border border-red-200 p-3">
            {error}
          </div>
        )}

        {!isAuthed ? (
          <div className="bg-white border border-cream-200 p-6 shadow-sm">
            <div className="flex gap-2 mb-6">
              <button
                type="button"
                onClick={() => setMode('password')}
                className={`px-4 py-2 text-xs uppercase tracking-widest border ${
                  mode === 'password'
                    ? 'bg-espresso-600 text-cream-100 border-espresso-600'
                    : 'border-cream-300 text-muted'
                }`}
              >
                Password
              </button>
              <button
                type="button"
                onClick={() => setMode('otp')}
                className={`px-4 py-2 text-xs uppercase tracking-widest border ${
                  mode === 'otp'
                    ? 'bg-espresso-600 text-cream-100 border-espresso-600'
                    : 'border-cream-300 text-muted'
                }`}
              >
                OTP Email
              </button>
            </div>

            {mode === 'password' ? (
              <form onSubmit={handlePasswordLogin} className="space-y-4">
                <input
                  type="email"
                  required
                  placeholder="Admin email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full border border-cream-300 px-3 py-2"
                />
                <input
                  type="password"
                  required
                  placeholder="Admin password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full border border-cream-300 px-3 py-2"
                />
                <button
                  type="submit"
                  className="w-full bg-espresso-600 text-cream-100 py-2.5 text-xs uppercase tracking-widest"
                >
                  Sign In
                </button>
              </form>
            ) : (
              <div className="space-y-4">
                <input
                  type="email"
                  required
                  placeholder="Admin email"
                  value={otpForm.email}
                  onChange={(e) => setOtpForm({ ...otpForm, email: e.target.value })}
                  className="w-full border border-cream-300 px-3 py-2"
                />
                <button
                  type="button"
                  onClick={handleRequestOtp}
                  className="w-full border border-espresso-500 text-espresso-600 py-2.5 text-xs uppercase tracking-widest"
                >
                  Send OTP
                </button>
                {otpSent && (
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Enter OTP"
                      value={otpForm.code}
                      onChange={(e) => setOtpForm({ ...otpForm, code: e.target.value })}
                      className="w-full border border-cream-300 px-3 py-2"
                    />
                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      className="w-full bg-espresso-600 text-cream-100 py-2.5 text-xs uppercase tracking-widest"
                    >
                      Verify OTP
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleLogout}
                className="px-4 py-2 text-xs uppercase tracking-widest border border-cream-300 text-muted"
              >
                Logout
              </button>
            </div>

            <div className="bg-white border border-cream-200 p-6 shadow-sm">
              <h2 className="font-display text-espresso-700 text-2xl font-light mb-4">Add Employee</h2>
              <form onSubmit={handleCreateEmployee} className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  required
                  placeholder="Full name"
                  value={employeeForm.fullName}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, fullName: e.target.value })}
                  className="border border-cream-300 px-3 py-2"
                />
                <input
                  type="email"
                  required
                  placeholder="Email"
                  value={employeeForm.email}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, email: e.target.value })}
                  className="border border-cream-300 px-3 py-2"
                />
                <input
                  type="text"
                  placeholder="Phone"
                  value={employeeForm.phone}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, phone: e.target.value })}
                  className="border border-cream-300 px-3 py-2"
                />
                <input
                  type="text"
                  required
                  placeholder="Role title"
                  value={employeeForm.roleTitle}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, roleTitle: e.target.value })}
                  className="border border-cream-300 px-3 py-2"
                />
                <input
                  type="text"
                  placeholder="Department"
                  value={employeeForm.department}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, department: e.target.value })}
                  className="border border-cream-300 px-3 py-2"
                />
                <input
                  type="date"
                  required
                  value={employeeForm.joiningDate}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, joiningDate: e.target.value })}
                  className="border border-cream-300 px-3 py-2"
                />
                <select
                  value={employeeForm.status}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, status: e.target.value })}
                  className="border border-cream-300 px-3 py-2"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
                <button
                  type="submit"
                  className="md:col-span-2 bg-espresso-600 text-cream-100 py-2.5 text-xs uppercase tracking-widest"
                >
                  Add Employee
                </button>
              </form>
            </div>

            <div className="bg-white border border-cream-200 p-6 shadow-sm">
              <h2 className="font-display text-espresso-700 text-2xl font-light mb-4">Employees</h2>
              {employees.length === 0 ? (
                <p className="text-sm text-muted">No employees yet.</p>
              ) : (
                <div className="space-y-3">
                  {employees.map((emp) => (
                    <div key={emp.id} className="flex items-center justify-between border-b border-cream-200 pb-3">
                      <div>
                        <p className="font-body text-espresso-700">{emp.fullName}</p>
                        <p className="text-xs text-muted">
                          {emp.roleTitle} • Joined {emp.joiningDate}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteEmployee(emp.id)}
                        className="text-xs uppercase tracking-widest text-red-600 border border-red-200 px-3 py-1"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
