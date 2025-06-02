import { NextResponse } from 'next/server';

interface SubscribeRequestBody {
  email: string;
}

// A slightly more robust regex for email validation
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const body = await request.json() as SubscribeRequestBody;
    let { email } = body; // Make email mutable for trimming

    // Log the received email immediately for debugging
    console.log(`[API /api/subscribe] Raw email received: "${email}"`);

    if (email) {
      email = email.trim(); // Trim whitespace
      console.log(`[API /api/subscribe] Trimmed email for validation: "${email}"`);
    }

    if (!email || !EMAIL_REGEX.test(email)) { // Use the defined regex and trimmed email
      console.error(`[API /api/subscribe] Email validation failed for (trimmed): "${email}"`);
      return NextResponse.json(
        { message: 'Invalid email address provided. Please check and try again.' }, // Slightly more helpful message
        { status: 400 }
      );
    }

    // In a real application, you would add the email to your database or mailing list service here.
    console.log(`[API /api/subscribe] Received email for subscription: ${email}`);

    // Simulate some processing time
    await new Promise(resolve => setTimeout(resolve, 700));

    // For now, we'll always return a success response if the email format is valid.
    // Later, you might add logic to check if the email is already subscribed, etc.
    return NextResponse.json(
      { message: `Email ${email} successfully subscribed!` },
      { status: 200 }
    );

  } catch (error) {
    console.error('[API /api/subscribe] Error:', error);
    let errorMessage = 'An unexpected error occurred during subscription.';
    if (error instanceof Error) {
      // Avoid exposing too much internal detail in client-facing error messages for generic errors
      // errorMessage = error.message;
    }
    // Check if it's a JSON parsing error (e.g., empty or malformed body)
    if (error instanceof SyntaxError && request.headers.get('content-type')?.includes('application/json')) {
        errorMessage = 'Invalid JSON payload provided.';
        return NextResponse.json({ message: errorMessage }, { status: 400 });
    }

    return NextResponse.json(
      { message: errorMessage },
      { status: 500 }
    );
  }
}