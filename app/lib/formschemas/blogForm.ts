import { BlogPost, SchemaDefinition } from '@/app/lib/interface';
import { User } from '@prisma/client';




export const blogFormSchema: SchemaDefinition<BlogPost> = {
    title: {
        label: 'Blog Title',
        placeholder: 'Enter the title of the blog post',
        type: 'text',
        required: true,
        validation: {
            minLength: 5,
            maxLength: 100,
            pattern: {
                value: /^[a-zA-Z0-9\s.,!?'"-]+$/,
                message: 'Title can only contain letters, numbers, and basic punctuation'
            }
        }
    },
    image: {
        label: 'Banner Image',
        type: 'text',
        required: true,
        placeholder: "Paste image url (e.g. https://image_url.com/image_id.png)",
        validation: {
            pattern: {
                value: /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg|webp|bmp|tiff?))(?:\?.*)?$/,
                message: 'Please enter a valid image URL (http(s)://... .png, .jpg, .jpeg, .gif, .svg, .webp, .bmp, .tif, .tiff)'
            }
        }
    },
    category: {
        label: 'Category',
        type: 'select',
        options: [
            { label: 'Sports', value: 'Sports' },
            { label: 'News', value: 'News' },
            { label: 'Technology', value: 'Technology' },
            { label: 'Lifestyle', value: 'Lifestyle' },
            { label: 'Health', value: 'Health' },
            { label: 'Travel', value: 'Travel' },
            { label: 'Education', value: 'Education' },
            { label: 'Entertainment', value: 'Entertainment' },
            { label: 'Finance', value: 'Finance' },
            { label: 'Food', value: 'Food' },
            { label: 'Fashion', value: 'Fashion' },
            { label: 'Other', value: 'Other' }
        ],
        required: true,
        validation: {
            pattern: {
                value: /^[a-zA-Z0-9-]+$/,
                message: 'Invalid category ID'
            }
        }
    },
    slug: {
        label: 'Slug',
        placeholder: 'Enter a unique slug for the blog post',
        type: 'text',
        required: true,
        disabled: true,
        validation: {
            pattern: {
                value: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                message: 'Slug can only contain lowercase letters, numbers, and hyphens'
            }
        }
    },
    summary: {
        label: 'Summary',
        placeholder: 'Provide a brief summary of the blog post',
        type: 'text',
        required: true,
        validation: {
            maxLength: 300,
            pattern: {
                value: /^[a-zA-Z0-9\s.,!?'"-]+$/,
                message: 'Summary can only contain letters, numbers, and basic punctuation'
            }
        }
    },
    content: {
        label: 'Post Content',
        placeholder: 'Write your blog content here',
        type: 'editor',
        required: true,
        validation: {
            minLength: 20,
            pattern: {
                value: /^[\s\S]*$/,
                message: 'Content cannot be empty'
            }
        }
    },
    tags: {
        label: 'Tags',
        placeholder: 'Enter tags separated by commas',
        type: 'text',
        required: false,
        validation: {
            pattern: {
                value: /^[a-zA-Z0-9\s,]+$/,
                message: 'Tags can only contain letters, numbers, and commas'
            }
        }
    },
    status: {
        label: 'Status',
        type: 'select',
        options: [
            { label: 'Draft', value: 'draft' },
            { label: 'Published', value: 'published' },
            { label: 'Archived', value: 'archived' }
        ],
        required: true,
        validation: {
            pattern: {
                value: /^(draft|published|archived)$/,
                message: 'Invalid status'
            }
        }
    },
};
