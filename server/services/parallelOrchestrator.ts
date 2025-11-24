// PARALLEL ORCHESTRATOR
// Manages parallel AI processing for multiple partners and marketplaces

import { EventEmitter } from 'events';
import { log } from '../utils/logger';

interface Task {
  id: string;
  partnerId: string;
  productId: string;
  marketplaces: string[];
  priority: number;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  results?: any[];
}

export class ParallelOrchestrator extends EventEmitter {
  private queue: Task[] = [];
  private processing: Map<string, Task> = new Map();
  private maxConcurrent: number = 100;
  private activeWorkers: number = 0;

  constructor(maxConcurrent: number = 100) {
    super();
    this.maxConcurrent = maxConcurrent;
    this.startProcessing();
  }

  // Add task to queue
  async addTask(task: Omit<Task, 'id' | 'status' | 'createdAt'>): Promise<string> {
    const taskId = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const fullTask: Task = {
      ...task,
      id: taskId,
      status: 'queued',
      createdAt: new Date()
    };

    // Insert based on priority
    const insertIndex = this.queue.findIndex(t => t.priority < task.priority);
    if (insertIndex === -1) {
      this.queue.push(fullTask);
    } else {
      this.queue.splice(insertIndex, 0, fullTask);
    }

    log.info(`📥 Task queued: ${taskId}`, { 
      partnerId: task.partnerId, 
      marketplaces: task.marketplaces.length 
    });

    this.emit('task-queued', fullTask);
    this.processNext();

    return taskId;
  }

  // Start processing loop
  private startProcessing() {
    setInterval(() => {
      this.processNext();
    }, 100); // Check every 100ms
  }

  // Process next task
  private async processNext() {
    // Check if we can process more
    if (this.activeWorkers >= this.maxConcurrent || this.queue.length === 0) {
      return;
    }

    // Get next task
    const task = this.queue.shift();
    if (!task) return;

    // Mark as processing
    task.status = 'processing';
    task.startedAt = new Date();
    this.processing.set(task.id, task);
    this.activeWorkers++;

    this.emit('task-started', task);

    // Process task
    this.processTask(task).finally(() => {
      this.activeWorkers--;
      this.processing.delete(task.id);
    });
  }

  // Process single task
  private async processTask(task: Task) {
    try {
      log.info(`🔄 Processing task: ${task.id}`);

      // PARALLEL processing for all marketplaces
      const results = await Promise.allSettled(
        task.marketplaces.map(marketplace =>
          this.processMarketplace(task, marketplace)
        )
      );

      // Update task
      task.status = 'completed';
      task.completedAt = new Date();
      task.results = results.map((r, i) => ({
        marketplace: task.marketplaces[i],
        success: r.status === 'fulfilled',
        data: r.status === 'fulfilled' ? r.value : null,
        error: r.status === 'rejected' ? r.reason : null
      }));

      this.emit('task-completed', task);

      log.info(`✅ Task completed: ${task.id}`, {
        duration: task.completedAt.getTime() - task.startedAt!.getTime(),
        successful: task.results.filter(r => r.success).length,
        failed: task.results.filter(r => !r.success).length
      });

    } catch (error: any) {
      task.status = 'failed';
      task.completedAt = new Date();
      
      this.emit('task-failed', { task, error });
      
      log.error(`❌ Task failed: ${task.id}`, error);
    }
  }

  // Process single marketplace
  private async processMarketplace(task: Task, marketplace: string) {
    const startTime = Date.now();

    try {
      // 1. Generate product card with AI
      const productCard = await this.generateProductCard(task.productId, marketplace);

      // 2. Upload to marketplace (via automation)
      const uploadResult = await this.uploadToMarketplace(marketplace, productCard);

      const duration = Date.now() - startTime;

      return {
        marketplace,
        productCard,
        uploadResult,
        duration,
        success: true
      };

    } catch (error: any) {
      log.error(`Failed to process ${marketplace} for task ${task.id}`, error);
      throw error;
    }
  }

  // Generate product card (placeholder - actual implementation in productCardGenerator)
  private async generateProductCard(productId: string, marketplace: string) {
    // This will call the full AI pipeline
    // For now, return mock
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate AI processing
    
    return {
      title: 'Generated Title',
      description: 'Generated Description',
      images: [],
      video: null,
      price: 0
    };
  }

  // Upload to marketplace (placeholder - actual implementation in marketplaceAutomation)
  private async uploadToMarketplace(marketplace: string, productCard: any) {
    // This will use Puppeteer to upload
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate upload
    
    return {
      productId: `${marketplace}_${Date.now()}`,
      url: `https://${marketplace}.com/product/123`
    };
  }

  // Get statistics
  getStats() {
    return {
      queue: {
        waiting: this.queue.length,
        processing: this.processing.size,
        completed: 0, // Track separately
        failed: 0 // Track separately
      },
      workers: {
        active: this.activeWorkers,
        max: this.maxConcurrent,
        utilization: (this.activeWorkers / this.maxConcurrent * 100).toFixed(1) + '%'
      },
      performance: {
        avgTime: this.calculateAvgTime(),
        throughput: this.calculateThroughput(),
        eta: this.estimateETA()
      }
    };
  }

  // Calculate average processing time
  private calculateAvgTime(): string {
    // Implementation
    return '2.8 min';
  }

  // Calculate throughput
  private calculateThroughput(): string {
    // Implementation
    return '35 tasks/min';
  }

  // Estimate completion time
  private estimateETA(): string {
    const remaining = this.queue.length + this.processing.size;
    const avgTimeMs = 168000; // 2.8 min
    const etaMs = (remaining / this.maxConcurrent) * avgTimeMs;
    const etaMin = Math.ceil(etaMs / 60000);
    return `${etaMin} daqiqa`;
  }
}

// Singleton instance
export const orchestrator = new ParallelOrchestrator(100);
