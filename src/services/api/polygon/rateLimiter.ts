const CALLS_PER_MINUTE = 5;
const COOLDOWN_MS = 12000; // 12 seconds between calls

export class RateLimiter {
  private callsQueue: number[] = [];
  private requestQueue: (() => Promise<any>)[] = [];
  private isProcessingQueue: boolean = false;

  private canMakeCall(): boolean {
    const now = Date.now();
    while (this.callsQueue.length > 0 && this.callsQueue[0] < now - 60000) {
      this.callsQueue.shift();
    }
    return this.callsQueue.length < CALLS_PER_MINUTE;
  }

  public trackApiCall(): void {
    this.callsQueue.push(Date.now());
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