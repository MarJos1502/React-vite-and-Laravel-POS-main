import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import { useAuth } from "../context/AuthContext";
import axios from "../lib/axios";
import { loadReCaptchaScript } from "../utils/recaptcha";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/icons.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
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
    setError("");

    if (!captchaValue) {
      setError("Please complete the CAPTCHA verification");
      return;
    }

    try {
      const response = await axios.post("/api/login", {
        email,
        password,
        recaptcha_token: captchaValue,
      });

      const { token, user } = response.data;
      login(token, user);

      // Navigate to the return url or dashboard
      const from = (location.state as any)?.from?.pathname || "/dashboard";
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred during login");
    }
  };

  return (
    <div
      style={{ minHeight: "100vh", background: "#f6f8fa" }}
      className="d-flex align-items-center justify-content-center"
    >
      <div className="container">
        <div
          className="row justify-content-center align-items-center"
          style={{ minHeight: "100vh" }}
        >
          <div className="col-12 col-md-7 col-lg-5">
            <div className="card shadow-lg border-0 rounded-4 p-4 p-md-5 bg-white">
              <div className="text-center mb-4">
                {/* Logo placeholder */}
                <div className="mb-2">
                  <span
                    className="d-inline-block bg-primary rounded-circle"
                    style={{ width: 56, height: 56, lineHeight: "56px" }}
                  >
                    <i className="bi bi-person-circle text-white fs-2"></i>
                  </span>
                </div>
                <h2 className="fw-bold mb-1">StepWatch</h2>
                <p className="text-muted mb-0">Sign in</p>
              </div>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin} autoComplete="off">
                <div className="form-floating mb-3">
                  <input
                    type="email"
                    className="form-control rounded-3"
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

                <div className="form-floating mb-3 position-relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control rounded-3"
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
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary position-absolute top-50 end-0 translate-middle-y me-2"
                    style={{ zIndex: 2 }}
                    tabIndex={-1}
                    onClick={() => setShowPassword((v) => !v)}
                  >
                    <i
                      className={`bi ${
                        showPassword ? "bi-eye-slash" : "bi-eye"
                      }`}
                    ></i>
                  </button>
                </div>

                <div className="d-flex justify-content-center mb-3">
                  {isScriptLoaded && (
                    <ReCAPTCHA
                      sitekey="6LdpDFwrAAAAAFGHJHgwn3ksCTGh-koeC2uYFZlG"
                      onChange={setCaptchaValue}
                    />
                  )}
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 py-3 fw-bold rounded-3 mb-2"
                  disabled={!isScriptLoaded}
                >
                  <i className="bi bi-box-arrow-in-right me-2"></i>
                  Sign In
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
