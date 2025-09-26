// Simple API call cache to prevent duplicate requests
class APICache {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private pendingRequests = new Map<string, Promise<any>>();
  private readonly CACHE_DURATION = 30000; // 30 seconds

  async fetch(url: string, options?: RequestInit): Promise<Response> {
    const cacheKey = `${url}_${JSON.stringify(options || {})}`;
    
    // Check if we have a cached response
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return new Response(JSON.stringify(cached.data), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check if request is already pending
    if (this.pendingRequests.has(cacheKey)) {
      const data = await this.pendingRequests.get(cacheKey);
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Make the request
    const requestPromise = fetch(url, options).then(async (response) => {
      if (response.ok) {
        const data = await response.json();
        this.cache.set(cacheKey, { data, timestamp: Date.now() });
      }
      this.pendingRequests.delete(cacheKey);
      return response;
    });

    this.pendingRequests.set(cacheKey, requestPromise);
    return requestPromise;
  }

  clear() {
    this.cache.clear();
    this.pendingRequests.clear();
  }
}

export const apiCache = new APICache();
