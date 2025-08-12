const { z } = require('zod');

// Minimal example using core rules from scraped schema.
// Adjust and expand fields to match desired schema.
const registrationSchema = z.object({
  aadhaar: z.string().regex(/^\d{12}$/, { message: 'Aadhaar must be 12 digits' }),
 pan: z.string()
       .regex(/^[A-Za-z]{5}[0-9]{4}[A-Za-z]$/, 'Invalid PAN')
       .optional(),
  email: z.string().email().optional(),
  mobile: z.string().optional(),
  pin: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional()
});

module.exports = { registrationSchema };
