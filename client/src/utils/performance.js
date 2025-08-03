// Performance monitoring utility
class PerformanceMonitor {
  constructor() {
    this.metrics = {
      apiCalls: 0,
      cacheHits: 0,
      cacheMisses: 0,
      renderTime: 0,
      memoryUsage: 0,
    };
    this.startTime = performance.now();
  }

  // Track API call
  trackApiCall() {
    this.metrics.apiCalls++;
  }

  // Track cache hit
  trackCacheHit() {
    this.metrics.cacheHits++;
  }

  // Track cache miss
  trackCacheMiss() {
    this.metrics.cacheMisses++;
  }

  // Track render time
  trackRenderTime(componentName, renderTime) {
    this.metrics.renderTime += renderTime;
    if (process.env.NODE_ENV === 'development') {
      console.log(`${componentName} rendered in ${renderTime.toFixed(2)}ms`);
    }
  }

  // Get memory usage
  getMemoryUsage() {
    if (performance.memory) {
      this.metrics.memoryUsage = performance.memory.usedJSHeapSize;
    }
    return this.metrics.memoryUsage;
  }

  // Get cache hit ratio
  getCacheHitRatio() {
    const total = this.metrics.cacheHits + this.metrics.cacheMisses;
    return total > 0 ? (this.metrics.cacheHits / total * 100).toFixed(2) : 0;
  }

  // Get performance summary
  getSummary() {
    const uptime = performance.now() - this.startTime;
    return {
      uptime: `${(uptime / 1000).toFixed(2)}s`,
      apiCalls: this.metrics.apiCalls,
      cacheHitRatio: `${this.getCacheHitRatio()}%`,
      averageRenderTime: `${(this.metrics.renderTime / this.metrics.apiCalls || 0).toFixed(2)}ms`,
      memoryUsage: `${(this.getMemoryUsage() / 1024 / 1024).toFixed(2)}MB`,
    };
  }

  // Log performance summary
  logSummary() {
    if (process.env.NODE_ENV === 'development') {
      console.log('Performance Summary:', this.getSummary());
    }
  }

  // Reset metrics
  reset() {
    this.metrics = {
      apiCalls: 0,
      cacheHits: 0,
      cacheMisses: 0,
      renderTime: 0,
      memoryUsage: 0,
    };
    this.startTime = performance.now();
  }
}

// Create singleton instance
const performanceMonitor = new PerformanceMonitor();

export default performanceMonitor;

// Performance optimization utilities
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Image lazy loading utility
export const lazyLoadImage = (imgElement, src) => {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = src;
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    });

    imageObserver.observe(imgElement);
  } else {
    // Fallback for older browsers
    imgElement.src = src;
  }
}; 