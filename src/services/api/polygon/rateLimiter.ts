const CALLS_PER_MINUTE = 5; // Reduced from previous value
const COOLDOWN_MS = 15000; // Increased cooldown between calls to 15 seconds

export class RateLimiter {
  private callsQueue: number[] = [];
  private requestQueue: (() => Promise<any>)[] = [];
  private isProcessingQueue: boolean = false;
  private lastCallTime: number = 0;

  private canMakeCall(): boolean {
    const now = Date.now();
    
    // Remove calls older than 1 minute from the queue
    while (this.callsQueue.length > 0 && this.callsQueue[0] < now - 60000) {
      this.callsQueue.shift();
    }

    // Ensure minimum time between calls
    if (now - this.lastCallTime < COOLDOWN_MS) {
      return false;
    }

    return this.callsQueue.length < CALLS_PER_MINUTE;
  }

  public trackApiCall(): void {
    const now = Date.now();
    this.callsQueue.push(now);
    this.lastCallTime = now;
  }

  public async enqueueRequest(request: () => Promise<any>): Promise<any> {
    return new Promise((resolve) => {
      const wrappedRequest = async () => {
        try {
          const result = await request();
          resolve(result);
        } catch (error) {
          console.error('Error processing request:', error);
          // Return mock data on error
          resolve(undefined);
        }
      };

      this.requestQueue.push(wrappedRequest);
      this.processQueue();
    });
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessingQueue) return;
    this.isProcessingQueue = true;

    while (this.requestQueue.length > 0) {
      if (!this.canMakeCall()) {
        await new Promise(resolve => setTimeout(resolve, COOLDOWN_MS));
        continue;
      }

      const request = this.requestQueue.shift();
      if (request) {
        await request();
      }
    }

    this.isProcessingQueue = false;
  }
}

export const rateLimiter = new RateLimiter();