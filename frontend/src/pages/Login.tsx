import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import { useAuth } from '../context/AuthContext';
import axios from '../lib/axios';
import { loadReCaptchaScript } from '../utils/recaptcha';
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/icons.css";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  useEffect(() => {
    loadReCaptchaScript().then(() => {
      setIsScriptLoaded(true);
    });
  }, []);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!captchaValue) {
      setError('Please complete the CAPTCHA verification');
      return;
    }

    try {
      const response = await axios.post('/api/login', {
        email,
        password,
        recaptcha_token: captchaValue,
      });

      const { token, user } = response.data;
      login(token, user);

      // Navigate to the return url or dashboard
      const from = (location.state as any)?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred during login');
    }
  };

  return (
    <div className="container-fluid">
      <div className="row vh-100">
        <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
          <div className="w-75">
            <div className="text-center mb-5">
              <h2 className="fw-bold">Welcome Back!</h2>
              <p className="text-muted">Please sign in to continue</p>
            </div>

            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div className="form-floating mb-4">
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <label htmlFor="email">
                  <i className="bi bi-envelope me-2"></i>
                  Email address
                </label>
              </div>

              <div className="form-floating mb-4">
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <label htmlFor="password">
                  <i className="bi bi-lock me-2"></i>
                  Password
                </label>
              </div>

              <div className="d-flex justify-content-center mb-4">
                {isScriptLoaded && (
                  <ReCAPTCHA
                    sitekey="6LcBmGMrAAAAAGtpUY3k_ooseL9dX5m-5TAVXKeC"
                    onChange={setCaptchaValue}
                  />
                )}
              </div>

              <button 
                type="submit" 
                className="btn btn-primary w-100 py-3 mb-4 fw-bold"
                disabled={!isScriptLoaded}
              >
                <i className="bi bi-box-arrow-in-right me-2"></i>
                Sign In
              </button>
            </form>
          </div>
        </div>
        <div className="col-md-6 d-none d-md-block bg-primary">
          {/* Add your login page illustration or branding here */}
        </div>
      </div>
    </div>
  );
}
