// PARALLEL ORCHESTRATOR
// Manages parallel AI processing for multiple partners and marketplaces

import Queue from 'bull';
import { log } from '../utils/logger';
import { generateProductCard, optimizePrice, monitorPartnerProducts, autoUploadToMarketplace, broadcastAIStats } from './aiManagerService';
import { wsManager } from '../websocket';

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
  taskType: 'product_creation' | 'price_optimization' | 'monitoring' | 'marketplace_upload';
  inputData?: any;
}

export class ParallelOrchestrator {
  private aiQueue: Queue.Queue;
  private maxConcurrent: number = 100;

  constructor(maxConcurrent: number = 100) {
    this.maxConcurrent = maxConcurrent;

    // Initialize Redis-based queue
    this.aiQueue = new Queue('ai-tasks', {
      redis: {
        host: process.env.REDIS_URL || 'localhost',
        port: 6379,
        password: process.env.REDIS_PASSWORD,
      },
      defaultJobOptions: {
        removeOnComplete: 50,
        removeOnFail: 20,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
      },
    });

    this.setupQueueProcessor();
    this.setupEventHandlers();
  }

  // Add task to Redis queue
  async addTask(task: Omit<Task, 'id' | 'status' | 'createdAt'>): Promise<string> {
    const taskId = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const job = await this.aiQueue.add(
      {
        taskId,
        ...task,
      },
      {
        priority: task.priority,
        jobId: taskId,
      }
    );

    log.info(`✅ Task added to queue: ${taskId} (priority: ${task.priority})`);
    return taskId;
  }

  // Setup queue processor
  private setupQueueProcessor() {
    this.aiQueue.process(this.maxConcurrent, async (job) => {
      const { taskId, partnerId, productId, marketplaces, taskType, inputData } = job.data;

      try {
        log.info(`🚀 Processing task: ${taskId} (${taskType})`);

        let result;
        switch (taskType) {
          case 'product_creation':
            result = await generateProductCard(inputData, parseInt(partnerId));
            break;
          case 'price_optimization':
            result = await optimizePrice(parseInt(partnerId), parseInt(productId), marketplaces[0]);
            break;
          case 'monitoring':
            result = await monitorPartnerProducts(parseInt(partnerId));
            break;
          case 'marketplace_upload':
            result = await autoUploadToMarketplace(parseInt(productId), marketplaces[0], inputData.credentials);
            break;
          default:
            throw new Error(`Unknown task type: ${taskType}`);
        }

        log.info(`✅ Task completed: ${taskId}`);
        return result;

      } catch (error: any) {
        log.error(`❌ Task failed: ${taskId} - ${error.message}`);
        throw error;
      }
    });
  }

  // Setup event handlers for monitoring
  private setupEventHandlers() {
    this.aiQueue.on('completed', async (job, result) => {
      log.info(`✅ Job completed: ${job.id}`);

      // Broadcast stats update
      await broadcastAIStats();

      // Emit completion event
      if (wsManager) {
        wsManager.broadcastAIActivity({
          id: `activity_${job.id}`,
          timestamp: new Date(),
          type: job.data.taskType,
          status: 'completed',
          partnerId: job.data.partnerId,
          partnerName: 'Partner',
          productName: job.data.inputData?.name || 'Product',
          marketplace: job.data.marketplaces?.[0] || 'unknown',
          duration: Math.floor((Date.now() - job.processedOn!) / 1000),
          progress: 100,
          details: `Task completed successfully`
        });
      }
    });

    this.aiQueue.on('failed', async (job, err) => {
      log.error(`❌ Job failed: ${job?.id} - ${err.message}`);

      // Broadcast stats update
      await broadcastAIStats();

      // Emit failure event
      if (wsManager) {
        wsManager.broadcastAIActivity({
          id: `activity_${job?.id}`,
          timestamp: new Date(),
          type: job?.data?.taskType || 'unknown',
          status: 'failed',
          partnerId: job?.data?.partnerId || 'unknown',
          partnerName: 'Partner',
          productName: job?.data?.inputData?.name || 'Product',
          marketplace: job?.data?.marketplaces?.[0] || 'unknown',
          duration: 0,
          progress: 0,
          details: `Task failed: ${err.message}`
        });
      }
    });

    this.aiQueue.on('active', (job) => {
      log.info(`🚀 Job started: ${job.id}`);

      // Broadcast activity started
      if (wsManager) {
        wsManager.broadcastAIActivity({
          id: `activity_${job.id}`,
          timestamp: new Date(),
          type: job.data.taskType,
          status: 'processing',
          partnerId: job.data.partnerId,
          partnerName: 'Partner',
          productName: job.data.inputData?.name || 'Product',
          marketplace: job.data.marketplaces?.[0] || 'unknown',
          duration: 0,
          progress: 10,
          details: `Task started processing`
        });
      }
    });
  }

  // Get queue statistics
  async getQueueStats() {
    const waiting = await this.aiQueue.getWaiting();
    const active = await this.aiQueue.getActive();
    const completed = await this.aiQueue.getCompleted();
    const failed = await this.aiQueue.getFailed();

    return {
      waiting: waiting.length,
      active: active.length,
      completed: completed.length,
      failed: failed.length,
      total: waiting.length + active.length + completed.length + failed.length,
    };
  }

  // Graceful shutdown
  async close() {
    await this.aiQueue.close();
    log.info('🔄 Parallel Orchestrator closed');
  }
}

// Export singleton instance
export const parallelOrchestrator = new ParallelOrchestrator(100);
