import { APIError, UserFacingError } from '@/types';

export class ErrorHandler {
  static handleAPIError(error: APIError): UserFacingError {
    switch (error.status) {
      case 401:
        return {
          message: 'Authentication failed. Please try again.',
          retryable: true,
          action: 'retry'
        };
      case 404:
        return {
          message: 'User not found on Farcaster.',
          retryable: false,
          action: 'none'
        };
      case 429:
        return {
          message: 'Too many requests. Please wait a moment.',
          retryable: true,
          action: 'queue'
        };
      case 500:
        return {
          message: 'Service temporarily unavailable.',
          retryable: true,
          action: 'retry'
        };
      default:
        return {
          message: 'An unexpected error occurred.',
          retryable: true,
          action: 'retry'
        };
    }
  }

  static async retryWithBackoff<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3
  ): Promise<T> {
    let lastError: any = null;
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error: any) {
        lastError = error;
        
        // If rate limited (429), wait longer
        if (error.status === 429) {
          const delay = Math.pow(2, i + 2) * 1000; // 4s, 8s, 16s for rate limits
          console.log(`Rate limited, waiting ${delay}ms before retry ${i + 1}/${maxRetries}`);
          await new Promise(resolve => setTimeout(resolve, delay));
        } else if (error.retryable) {
          const delay = Math.pow(2, i) * 1000; // 1s, 2s, 4s for other errors
          await new Promise(resolve => setTimeout(resolve, delay));
        } else {
          // Don't retry non-retryable errors
          throw error;
        }
      }
    }
    
    throw lastError!;
  }
}
