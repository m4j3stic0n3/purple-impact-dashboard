interface RateLimiter {
  callsQueue: number[];
  requestQueue: (() => Promise<any>)[];
  isProcessingQueue: boolean;
}

class ApiRateLimiter implements RateLimiter {
  callsQueue: number[] = [];
  requestQueue: (() => Promise<any>)[] = [];
  isProcessingQueue: boolean = false;
  
  private readonly RATE_LIMIT = 5; // Maximum calls per minute
  private readonly WINDOW_MS = 60000; // 1 minute window
  private readonly COOLDOWN_MS = 30000; // 30 seconds cooldown if rate limit is hit

  trackApiCall() {
    const now = Date.now();
    this.callsQueue.push(now);
    
    // Remove calls older than the window
    this.callsQueue = this.callsQueue.filter(time => now - time < this.WINDOW_MS);
  }

  async enqueueRequest<T>(request: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      const executeRequest = async () => {
        const now = Date.now();
        this.callsQueue = this.callsQueue.filter(time => now - time < this.WINDOW_MS);

        if (this.callsQueue.length >= this.RATE_LIMIT) {
          const oldestCall = this.callsQueue[0];
          const waitTime = (oldestCall + this.WINDOW_MS) - now;
          console.info(`Waiting for cooldown... ${(waitTime / 1000).toFixed(1)}s remaining`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
        }

        try {
          const result = await request();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      };

      executeRequest();
    });
  }
}

export const rateLimiter = new ApiRateLimiter();