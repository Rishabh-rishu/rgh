import shared from "@rgh/shared";

const { HTTP_STATUS, sendErrorResponse } = shared;

const validators = {
  required: (value) => value !== undefined && value !== null && String(value).trim() !== "",
  email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value)),
  min: (min) => (value) => String(value).length >= min,
};

const messages = {
  required: (field) => `${field} is required`,
  email: (field) => `${field} must be a valid email`,
  min: (field, min) => `${field} must be at least ${min} characters`,
};

export const validateBody = (schema) => (req, res, next) => {
  const errors = [];

  Object.entries(schema).forEach(([field, rules]) => {
    const value = req.body?.[field];

    if (rules.required && !validators.required(value)) {
      errors.push(messages.required(field));
      return;
    }

    if (!validators.required(value)) return;

    if (rules.email && !validators.email(value)) {
      errors.push(messages.email(field));
    }

    if (rules.min && !validators.min(rules.min)(value)) {
      errors.push(messages.min(field, rules.min));
    }
  });

  if (errors.length) {
    return sendErrorResponse(res, HTTP_STATUS.BAD_REQUEST, "Validation failed", errors);
  }

  next();
};

export const adminLoginValidator = validateBody({
  email: { required: true, email: true },
  password: { required: true },
});

export const forgotPasswordValidator = validateBody({
  email: { required: true, email: true },
});

export const otpValidator = validateBody({
  otp: { required: true },
});

export const resetPasswordValidator = validateBody({
  password: { required: true, min: 6 },
});

export const tenantLoginValidator = validateBody({
  identifier: { required: true },
});
