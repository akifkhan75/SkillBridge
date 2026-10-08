// Privacy-safe Analytics adapter

export class AnalyticsService {
  static init() {
    // Initialize analytics provider (e.g. PostHog, Mixpanel)
    // No initialization logic in this test implementation
    console.log('Analytics initialized');
  }

  static identify(userId: string, type: 'customer' | 'worker') {
    // Only send user ID and type, NEVER phone, email or address
    console.log(`[Analytics] Identified user: ${userId}, type: ${type}`);
  }

  static track(event: string, properties?: Record<string, any>) {
    // Strip any potential PII before sending
    const safeProperties = this.stripPII(properties || {});
    console.log(`[Analytics] Track: ${event}`, safeProperties);
  }

  static trackScreen(screenName: string, properties?: Record<string, any>) {
    this.track(`Screen: ${screenName}`, properties);
  }

  private static stripPII(props: Record<string, any>) {
    const safeProps = { ...props };
    
    // Privacy-safe rules
    const piiKeys = ['phone', 'email', 'address', 'latitude', 'longitude', 'message', 'text', 'password', 'secret', 'token'];
    
    for (const key of Object.keys(safeProps)) {
      if (piiKeys.some(piiKey => key.toLowerCase().includes(piiKey))) {
        delete safeProps[key];
      }
    }
    
    return safeProps;
  }
}
