const yup = require('yup');


const userSchema = yup.object({
    username: yup.string().required('Username is required'),
    email: yup.string().email('Invalid email format').required('Email is required'),
    password: yup.string()
        .min(8, 'Password must be at least 8 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 
                 'Password must contain an uppercase letter, a lowercase letter, a number, and a special character')
        .required('Password is required')
});


const contactSchema = yup.object({
    name: yup.string().required('Name is required'),
    phone: yup.string()
        .matches(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format')
        .required('Phone number is required'),
    email: yup.string().email('Invalid email format').required('Email is required'),
    address: yup.object({
        street: yup.string(),
        city: yup.string(),
        state: yup.string(),
        postalCode: yup.string(),
    }),
    notes: yup.string().optional(),
    birthday: yup.date().optional(),
    tags: yup.array().of(yup.string()).optional(),
    favorite: yup.boolean().optional(),
});

export { userSchema, contactSchema };

