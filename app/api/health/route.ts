import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        api: 'online',
        database: 'checking...',
        email: 'checking...',
        paypal: 'checking...'
      },
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0'
    };

    // Check environment variables
    const requiredEnvVars = [
      'NEXT_PUBLIC_PAYPAL_CLIENT_ID',
      'PAYPAL_CLIENT_SECRET',
      'JWT_SECRET'
    ];

    const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
    
    if (missingEnvVars.length > 0) {
      healthStatus.services.api = 'warning';
      healthStatus.status = 'degraded';
    }

    // Database connection check
    try {
      // For now, we'll assume database is healthy if env vars are set
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
        healthStatus.services.database = 'online';
      } else {
        healthStatus.services.database = 'configuration_missing';
        healthStatus.status = 'degraded';
      }    } catch {
      healthStatus.services.database = 'offline';
      healthStatus.status = 'unhealthy';
    }

    // Email service check
    if (process.env.EMAIL_FROM && process.env.EMAIL_HOST) {
      healthStatus.services.email = 'configured';
    } else {
      healthStatus.services.email = 'not_configured';
    }

    // PayPal service check
    if (process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET) {
      healthStatus.services.paypal = 'configured';
    } else {
      healthStatus.services.paypal = 'not_configured';
      healthStatus.status = 'degraded';
    }

    return NextResponse.json(healthStatus, {
      status: healthStatus.status === 'healthy' ? 200 : 
              healthStatus.status === 'degraded' ? 200 : 503
    });

  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json({
      status: 'unhealthy',
      error: 'Health check failed',
      timestamp: new Date().toISOString()
    }, { status: 503 });
  }
}
