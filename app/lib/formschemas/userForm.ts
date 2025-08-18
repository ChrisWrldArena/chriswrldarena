import { SchemaDefinition } from '@/app/lib/interface';
import { User } from '@prisma/client';




export const userFormSchema: SchemaDefinition<User> = {
    id: {
        label: 'User ID',
        placeholder: 'Enter user ID',
        type: 'text',
        required: true,
        hidden: true,
        validation: {
            pattern: {
                value: /^[a-fA-F0-9]{24}$/,
                message: 'Invalid ID format'
            }
        },
    },
    email: {
        label: 'Email Address',
        type: 'email',
        required: true,
        placeholder: 'Enter your email',
        validation: {
            pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: 'Invalid email format'
            }
        }
    },

    passwordHash: {
        label: 'Password',
        description: 'Your password must be at least 8 characters long',
        type: 'password',
        hidden: true,
        placeholder: 'Enter your password',
        validation: {
            minLength: 8
        }
    },
    username: {
        label: 'Username',
        type: 'text',
        required: true,
        placeholder: 'Enter your username',
        validation: {
            minLength: 3,
            maxLength: 20,
            pattern: {
                value: /^[a-zA-Z0-9_]+$/,
                message: 'Username can only contain letters, numbers, and underscores'
            }
        }
    },
    phone: {
        label: 'Phone Number',
        type: 'text',
        required: false,
        placeholder: 'Enter your phone number',
        validation: {
            pattern: {
                value: /^\+?[1-9]\d{1,14}$/,
                message: 'Invalid phone number format'
            }
        }
    },
    role: {
        label: 'User Role',
        type: 'select',
        required: true,
        options: [
            { label: 'Admin', value: 'ADMIN' },
            { label: 'User', value: 'USER' },
            { label: 'Guest', value: 'GUEST' }
        ],
    },
    location: {
        label: 'Location',
        type: 'text',
        required: false,
        hidden: true,
        placeholder: 'Enter your location',
        validation: {
            maxLength: 100
        }
    },
    createdAt: {
        label: 'Created At',
        type: 'date',
        hidden: true,
        placeholder: 'Select creation date',

    },
    updatedAt: {
        label: 'Updated At',
        type: 'date',
        hidden: true,
        placeholder: 'Select last update date',

    },
    emailVerified: {
        label: 'Email Verified',
        type: 'checkbox',
        hidden: true,
        description: 'Check if the email is verified',

    }
};
