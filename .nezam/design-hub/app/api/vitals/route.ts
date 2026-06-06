import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('📊 Web Vitals Metric Received:', body);
    
    // In a real application, you would log this to Sentry, Google Analytics, or your custom DB.
    // e.g. Sentry.captureMessage(`Web Vital: ${body.name} = ${body.value}`);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error('Error parsing web vitals metric:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
