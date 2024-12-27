const CALLS_PER_MINUTE = 2; // Reduced from 5 to be more conservative
const COOLDOWN_MS = 30000; // Increased cooldown between calls to 30 seconds

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
      console.log(`Waiting for cooldown... ${((COOLDOWN_MS - (now - this.lastCallTime)) / 1000).toFixed(1)}s remaining`);
      return false;
    }

    return this.callsQueue.length < CALLS_PER_MINUTE;
  }

  public trackApiCall(): void {
    const now = Date.now();
    this.callsQueue.push(now);
    this.lastCallTime = now;
    console.log(`API call tracked. Calls in last minute: ${this.callsQueue.length}`);
  }

  public async enqueueRequest(request: () => Promise<any>): Promise<any> {
    return new Promise((resolve) => {
      const wrappedRequest = async () => {
        try {
          const result = await request();
          resolve(result);
        } catch (error) {
          console.error('Error processing request:', error);
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
        await new Promise(resolve => setTimeout(resolve, 5000)); // Check every 5 seconds
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