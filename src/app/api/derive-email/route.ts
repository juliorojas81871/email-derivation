import { NextRequest, NextResponse } from 'next/server';
import { deriveEmailAddress } from '@/lib/services/emailDerivationService';
import { requestSchema } from '@/lib/schemas/serverSchemas';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body with Zod
    const validationResult = requestSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed',
          details: validationResult.error.issues.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        },
        { status: 400 }
      );
    }

    const { firstName, lastName, domain } = validationResult.data;

    const result = deriveEmailAddress(firstName, lastName, domain);

    if (result.success) {
      return NextResponse.json({
        derivedEmail: result.derivedEmail,
        message: result.message
      });
    } else {
      return NextResponse.json({
        derivedEmail: result.derivedEmail,
        message: result.message
      });
    }

  } catch (error) {
    // Do not leak internal errors to clients; log server-side
    console.error('Error in derive-email endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
