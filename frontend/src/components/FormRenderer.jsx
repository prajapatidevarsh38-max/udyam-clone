import React, { useState, useEffect } from 'react';

export default function FormRenderer({ schema, initialData = {}, onNext, onBack, onSubmit, apiUrl, simulateOtp = false }) {
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [otpSent, setOtpSent] = useState(false);

  
  useEffect(() => {
    const init = {};
    schema.forEach(f => init[f.id] = initialData[f.id] || '');
    setForm(init);
  }, [schema]);

  const validateField = (f, val) => {
    if (f.required && !val) return 'Required';
    if (f.pattern) {
      const re = new RegExp(f.pattern);
      if (!re.test(val)) return 'Invalid format';
    }
    if (f.type === 'email' && val) {
      const ok = /\S+@\S+\.\S+/.test(val);
      if (!ok) return 'Invalid email';
    }
    return null;
  };

  const handleChange = (id, value) => {
    setForm(s => ({ ...s, [id]: value }));
    const f = schema.find(x => x.id === id);
    const err = validateField(f, value);
    setErrors(e => ({ ...e, [id]: err }));
  };

  const handleSendOtp = () => {
    // simulate OTP send
    setOtpSent(true);
    alert('Simulated OTP sent to registered mobile (not actually sent). Use 123456 as OTP in tests.');
  };

  const handleNext = () => {
    const errs = {};
    schema.forEach(f => {
      const e = validateField(f, form[f.id]);
      if (e) errs[f.id] = e;
    });
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      if (onNext) onNext(form);
    }
  };

const handleSubmit = async (e) => {
  e?.preventDefault?.();
  
  // Validate all fields before submit
  const errs = {};
  schema.forEach(f => {
    const e2 = validateField(f, form[f.id]);
    if (e2) errs[f.id] = e2;
  });
  setErrors(errs);
  
  if (Object.keys(errs).length) return;

  try {
    const res = await fetch(`${apiUrl}/api/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    if (!res.ok) {
      throw new Error(`Server error: ${res.status}`);
    }

    const data = await res.json();
    alert('✅ Form submitted successfully!');
    console.log('Server response:', data);
  } catch (err) {
    console.error('❌ Error submitting form:', err);
    alert('❌ Failed to submit form. Check console for details.');
  }
};


  return (
    <form className="form" onSubmit={handleSubmit}>
      {schema.map(f => (
        <div className="field" key={f.id}>
          <label htmlFor={f.id}>{f.label}{f.required ? '*' : ''}</label>
          <input
            id={f.id}
            name={f.id}
            type={f.type === 'text' ? 'text' : (f.type || 'text')}
            value={form[f.id] || ''}
            placeholder={f.placeholder || ''}
            onChange={e => handleChange(f.id, e.target.value)}
          />
          {errors[f.id] && <div className="error">{errors[f.id]}</div>}
          {f.id === 'aadhaar' && simulateOtp && (
            <div className="otp-actions">
              <button type="button" onClick={handleSendOtp}>Send OTP (simulate)</button>
              {otpSent && <small>OTP sent — use 123456 (simulated)</small>}
            </div>
          )}
        </div>
      ))}

      <div className="form-actions">
        {onBack && <button type="button" onClick={onBack} className="secondary">Back</button>}
        {onNext && <button type="button" onClick={handleNext}>Next</button>}
        {onSubmit && <button type="submit">Submit</button>}
      </div>
    </form>
  );
}
