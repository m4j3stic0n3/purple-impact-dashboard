class RateLimiter {
  private queue: Array<() => Promise<any>> = [];
  private processing = false;
  private lastCallTime = 0;
  private minInterval: number;

  constructor(callsPerMinute: number) {
    this.minInterval = (60 * 1000) / callsPerMinute;
  }

  async enqueue<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await fn();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
      
      if (!this.processing) {
        this.processQueue();
      }
    });
  }

  private async processQueue() {
    if (this.queue.length === 0) {
      this.processing = false;
      return;
    }

    this.processing = true;
    const now = Date.now();
    const timeToWait = Math.max(0, this.lastCallTime + this.minInterval - now);
    
    await new Promise(resolve => setTimeout(resolve, timeToWait));
    
    const fn = this.queue.shift();
    if (fn) {
      this.lastCallTime = Date.now();
      await fn();
    }

    this.processQueue();
  }
}

// Initialize with 5 calls per minute
export const polygonRateLimiter = new RateLimiter(5);