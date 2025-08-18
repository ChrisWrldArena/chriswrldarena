export const GET = async () => {
    return new Response('This is the API route for email verification. Please use POST method with appropriate data.', {
        status: 200,
        headers: {
            'Content-Type': 'text/plain',
        },
    });
}