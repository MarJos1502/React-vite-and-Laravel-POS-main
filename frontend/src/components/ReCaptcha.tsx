// src/components/MyForm.tsx
import React, { useRef, useState, useEffect } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { loadReCaptchaScript } from "../utils/recaptcha";

const ReCaptcha: React.FC = () => {
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    loadReCaptchaScript().then(() => {
      setIsScriptLoaded(true);
    });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!captchaValue) {
      alert("Please verify that you're not a robot.");
      return;
    }

    // Send captchaValue along with form data to the server
    console.log("Captcha Verified:", captchaValue);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="John Benjie" required />
      {isScriptLoaded && (
        <ReCAPTCHA
          sitekey="6LcBmGMrAAAAAGtpUY3k_ooseL9dX5m-5TAVXKeC"
          onChange={(value) => setCaptchaValue(value)}
          ref={recaptchaRef}
        />
      )}
      <button type="submit">Submit</button>
    </form>
  );
};

export default ReCaptcha;
