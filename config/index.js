const PasswordValidator = require('password-validator');

const tokenDuration = 172800; // 2 days
const passwordSchema = new PasswordValidator();
const date = new Date();
date.setTime(date.getTime() + tokenDuration * 1000);

passwordSchema
  .is()
  .min(8) // Minimum length 8
  .is()
  .max(100) // Maximum length 100
  .has()
  .uppercase() // Must have uppercase letters
  .has()
  .lowercase() // Must have lowercase letters
  .has()
  .digits(1) // Must have at least 1 digits
  .has()
  .not()
  .spaces() // Should not have spaces
  .is()
  .not()
  .oneOf(['Password123']); // Blacklist these values
module.exports = {
  port: process.env.PORT || 5000,
  cors: [
    'https://localhost:8000',
    'https://127.0.0.1:8000',
    'https://localhost:9000',
    'https://127.0.0.1:9000',
  ],
  cookie: {
    httpOnly: true,
    sameSite: 'None',
    secure: true,
    expires: date,
  },
  db: {
    url: process.env.MONGODB_DATABASE || 'mongodb://localhost/your-app',
    ROLES: ['is_user', 'is_staff', 'is_admin'],
  },
  authentication: {
    jwtSecret: process.env.JWT_SECRET,
    token_expiry_time: tokenDuration,
    passwordSchema,
    passwordSaltRound: 10,
  },
  mail: {
    api_key: process.env.SENDGRID_APIKEY,
    from: '',
  },
  paystack: {
    api_key: process.env.PAYSTACK_KEY,
    api_public_key: process.env.PAYSTACK_PUBLIC_KEY,
    commission_rate: 0.2,
  },
};
