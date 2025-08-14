import React, { useState } from 'react';
import FormRenderer from './components/FormRenderer';
import schema from './schema/udyam_schema.json';

function Stepper({ step }) {
  return (
    <div className="stepper">
      <div className={step === 1 ? 'step active' : 'step'}>1. Aadhaar</div>
      <div className={step === 2 ? 'step active' : 'step'}>2. PAN / Business</div>
    </div>
  );
}

export default function App() {
  const [step, setStep] = useState(1);
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // ✅ Match backend's actual field IDs
  const step1 = schema.filter(f => f.id === 'aadhaar' || f.id === 'aadhaar_otp');
  const step2 = schema.filter(f => f.id !== 'aadhaar' && f.id !== 'aadhaar_otp');

  const [collected, setCollected] = useState({});

  return (
    <div className="container">
      <h1>Udyam Registration — Clone</h1>
      <Stepper step={step} />

      {step === 1 && (
        <FormRenderer
          schema={step1}
          initialData={collected}
          onNext={(data) => {
            setCollected(prev => ({ ...prev, ...data }));
            setStep(2);
          }}
          apiUrl={apiUrl}
          simulateOtp
        />
      )}

      {step === 2 && (
        <FormRenderer
          schema={step2}
          initialData={collected}
          onBack={() => setStep(1)}
          onSubmit={async (data) => {
            const payload = { ...collected, ...data };
            console.log("📤 Submitting payload:", payload);

            try {
              const res = await fetch(`${apiUrl}/api/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
              });

              const responseData = await res.json();

              if (!res.ok) {
                console.error("❌ Backend validation error:", responseData);
                alert('❌ Submit failed: ' + (responseData.message || JSON.stringify(responseData)));
              } else {
                alert('✅ Submitted! ID: ' + (responseData.id || JSON.stringify(responseData)));
              }
            } catch (err) {
              console.error('❌ Network error:', err);
              alert('❌ Network error: ' + err.message);
            }
          }}
          apiUrl={apiUrl}
        />
      )}
    </div>
  );
}
