import Joi from 'joi';

// User / Admin side validator
export const userSignupSchema = Joi.object({
    name: Joi.string().required().messages({
        'string.base': 'Name should be a string',
        'any.required': 'Name is required',
    }),

    email: Joi.string().email().required().messages({
        'string.base': 'Email should be a string',
        'string.email': 'Invalid email format',
        'any.required': 'Email is required',
    }),
    password: Joi.string().min(8).required().messages({
        'string.base': 'Password should be a string',
        'string.min': 'Password should have at least {#limit} characters',
        'any.required': 'Password is required',
    }),
    confirmPassword: Joi.valid(Joi.ref('password')).required().messages({
        'any.only': 'Passwords do not match',
        'any.required': 'Password confirmation is required',
    }),
    status: Joi.string().valid('active', 'inactive').default('active').messages({
        'string.base': 'Status should be a string',
        'any.only': "Status should be either 'active' or 'inactive'",
    }),
    role: Joi.string().valid('user', 'admin').default('user').messages({
        'string.base': 'Role should be a string',
        'any.only': "Role should be either 'user' or 'admin'",
    }),
});
export const userLoginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.base': 'Email should be a string',
        'string.email': 'Invalid email format',
        'any.required': 'Email is required',
    }),
    password: Joi.string().min(8).required().messages({
        'string.base': 'Password should be a string',
        'string.min': 'Password should have at least {#limit} characters',
        'any.required': 'Password is required',
    }),
});

// Vendor side Velidator

export const vendorLoginSchema = Joi.object({
    username: Joi.string().min(3).messages({
        'string.base': 'Username should be a string',
        'string.min': 'Username should have at least {#limit} characters',
    }),
    email: Joi.string().email().messages({
        'string.base': 'Email should be a string',
        'string.email': 'Invalid email format',
    }),
    password: Joi.string().min(8).required().messages({
        'string.base': 'Password should be a string',
        'string.min': 'Password should have at least {#limit} characters',
        'any.required': 'Password is required',
    }),
});

export const vendorSignupSchema = Joi.object({
    username: Joi.string().required().messages({
        'string.base': 'Name should be a string',
        'any.required': 'Username is required',
    }),

    email: Joi.string().email().required().messages({
        'string.base': 'Email should be a string',
        'string.email': 'Invalid email format',
        'any.required': 'Email is required',
    }),
    password: Joi.string().min(8).required().messages({
        'string.base': 'Password should be a string',
        'string.min': 'Password should have at least {#limit} characters',
        'any.required': 'Password is required',
    }),
    confirmPassword: Joi.valid(Joi.ref('password')).required().messages({
        'any.only': 'Passwords do not match',
        'any.required': 'Password confirmation is required',
    }),
    status: Joi.string().valid('active', 'inactive').default('active').messages({
        'string.base': 'Status should be a string',
        'any.only': "Status should be either 'active' or 'inactive'",
    }),
});
