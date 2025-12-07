// AI Task Queue - Parallel task processing
// Handles all AI operations asynchronously

import { db } from '../db';
import { 
  generateReviewResponse,
  createProductCard,
  analyzeCompetitor,
  optimizeSEO,
  createAdCampaign,
  generateReport
} from './aiMarketplaceManager';

export type AITaskType =
  | 'review_response'
  | 'question_response'
  | 'product_card_creation'
  | 'seo_optimization'
  | 'competitor_analysis'
  | 'ad_campaign_creation'
  | 'infographic_generation'
  | 'niche_analysis'
  | 'report_generation';

export interface AITask {
  id?: number;
  accountId: number;
  taskType: AITaskType;
  priority: number; // 1-10 (10 = highest)
  status: 'pending' | 'processing' | 'completed' | 'failed';
  inputData: any;
  outputData?: any;
  error?: string;
  createdAt?: Date;
  completedAt?: Date;
}

// In-memory queue (production: use Redis/Bull)
const taskQueue: AITask[] = [];
let isProcessing = false;

// Add task to queue
export async function addAITask(task: Omit<AITask, 'id' | 'status' | 'createdAt'>): Promise<number> {
  const createdAt = new Date();
  const newTask: AITask = {
    ...task,
    status: 'pending',
    createdAt,
  };

  // Save to database
  const result = await db.run(
    `INSERT INTO ai_tasks (account_id, task_type, priority, status, input_data, created_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      newTask.accountId,
      newTask.taskType,
      newTask.priority,
      newTask.status,
      JSON.stringify(newTask.inputData),
      createdAt.toISOString(),
    ]
  );

  const taskId = result.lastID!;
  newTask.id = taskId;
  
  // Add to in-memory queue
  taskQueue.push(newTask);
  
  // Sort by priority (highest first)
  taskQueue.sort((a, b) => b.priority - a.priority);
  
  // Start processing if not already
  if (!isProcessing) {
    processQueue();
  }
  
  console.log(`✅ AI Task added: ${task.taskType} (Priority: ${task.priority})`);
  return taskId;
}

// Process queue
async function processQueue() {
  if (isProcessing || taskQueue.length === 0) {
    return;
  }

  isProcessing = true;
  console.log(`🔄 Processing AI queue: ${taskQueue.length} tasks`);

  while (taskQueue.length > 0) {
    const task = taskQueue.shift()!;
    
    try {
      await processTask(task);
    } catch (error) {
      console.error(`❌ Task ${task.id} failed:`, error);
      await markTaskFailed(task.id!, error instanceof Error ? error.message : 'Unknown error');
    }
  }

  isProcessing = false;
  console.log(`✅ AI queue processed`);
}

// Process single task
async function processTask(task: AITask) {
  console.log(`⚙️  Processing task ${task.id}: ${task.taskType}`);
  
  // Update status to processing
  await db.run(
    `UPDATE ai_tasks SET status = 'processing' WHERE id = ?`,
    [task.id]
  );

  let result: any;

  try {
    switch (task.taskType) {
      case 'review_response':
        result = await handleReviewResponse(task);
        break;
      
      case 'question_response':
        result = await handleQuestionResponse(task);
        break;
      
      case 'product_card_creation':
        result = await handleProductCardCreation(task);
        break;
      
      case 'seo_optimization':
        result = await handleSEOOptimization(task);
        break;
      
      case 'competitor_analysis':
        result = await handleCompetitorAnalysis(task);
        break;
      
      case 'ad_campaign_creation':
        result = await handleAdCampaignCreation(task);
        break;
      
      case 'report_generation':
        result = await handleReportGeneration(task);
        break;
      
      default:
        throw new Error(`Unknown task type: ${task.taskType}`);
    }

    // Mark as completed
    await markTaskCompleted(task.id!, result);
    console.log(`✅ Task ${task.id} completed`);
    
  } catch (error) {
    console.error(`❌ Task ${task.id} failed:`, error);
    throw error;
  }
}

// Task handlers
async function handleReviewResponse(task: AITask) {
  const { reviewText, rating, productName, language } = task.inputData;
  
  const response = await generateReviewResponse(
    reviewText,
    rating,
    productName,
    language || 'uz'
  );

  return { response };
}

async function handleQuestionResponse(task: AITask) {
  const { question, productName, language } = task.inputData;
  
  // Similar to review response
  const response = await generateReviewResponse(
    question,
    5, // neutral rating for questions
    productName,
    language || 'uz'
  );

  return { response };
}

async function handleProductCardCreation(task: AITask) {
  const { productInfo, marketplace } = task.inputData;
  
  const card = await createProductCard(productInfo, marketplace);
  
  return card;
}

async function handleSEOOptimization(task: AITask) {
  const { currentTitle, currentDescription, marketplace } = task.inputData;
  
  const optimized = await optimizeSEO(
    currentTitle,
    currentDescription,
    marketplace
  );
  
  return optimized;
}

async function handleCompetitorAnalysis(task: AITask) {
  const { competitorData, myProduct } = task.inputData;
  
  const analysis = await analyzeCompetitor(competitorData, myProduct);
  
  return analysis;
}

async function handleAdCampaignCreation(task: AITask) {
  const { productInfo, budget, marketplace } = task.inputData;
  
  const campaign = await createAdCampaign(productInfo, budget, marketplace);
  
  return campaign;
}

async function handleReportGeneration(task: AITask) {
  const { reportData } = task.inputData;
  
  const report = await generateReport(reportData);
  
  return report;
}

// Mark task as completed
async function markTaskCompleted(taskId: number, result: any) {
  await db.run(
    `UPDATE ai_tasks 
     SET status = 'completed', 
         output_data = ?,
         completed_at = ?
     WHERE id = ?`,
    [JSON.stringify(result), new Date().toISOString(), taskId]
  );
}

// Mark task as failed
async function markTaskFailed(taskId: number, error: string) {
  await db.run(
    `UPDATE ai_tasks 
     SET status = 'failed', 
         error_message = ?,
         completed_at = ?
     WHERE id = ?`,
    [error, new Date().toISOString(), taskId]
  );
}

// Get task status
export async function getTaskStatus(taskId: number): Promise<AITask | null> {
  const task = await db.get(
    `SELECT * FROM ai_tasks WHERE id = ?`,
    [taskId]
  );

  if (!task) return null;

  return {
    id: task.id,
    accountId: task.account_id,
    taskType: task.task_type,
    priority: task.priority,
    status: task.status,
    inputData: JSON.parse(task.input_data),
    outputData: task.output_data ? JSON.parse(task.output_data) : undefined,
    error: task.error_message,
    createdAt: new Date(task.created_at),
    completedAt: task.completed_at ? new Date(task.completed_at) : undefined,
  };
}

// Get pending tasks count
export async function getPendingTasksCount(): Promise<number> {
  const result = await db.get(
    `SELECT COUNT(*) as count FROM ai_tasks WHERE status = 'pending'`
  );
  return result.count;
}

// Get tasks by account
export async function getAccountTasks(
  accountId: number,
  limit: number = 50
): Promise<AITask[]> {
  const tasks = await db.all(
    `SELECT * FROM ai_tasks 
     WHERE account_id = ? 
     ORDER BY created_at DESC 
     LIMIT ?`,
    [accountId, limit]
  );

  return tasks.map((task: any) => ({
    id: task.id,
    accountId: task.account_id,
    taskType: task.task_type,
    priority: task.priority,
    status: task.status,
    inputData: JSON.parse(task.input_data),
    outputData: task.output_data ? JSON.parse(task.output_data) : undefined,
    error: task.error_message,
    createdAt: new Date(task.created_at),
    completedAt: task.completed_at ? new Date(task.completed_at) : undefined,
  }));
}

// Batch add tasks (for multiple marketplaces)
export async function addBatchTasks(tasks: Omit<AITask, 'id' | 'status' | 'createdAt'>[]): Promise<number[]> {
  const taskIds: number[] = [];
  
  for (const task of tasks) {
    const id = await addAITask(task);
    taskIds.push(id);
  }
  
  return taskIds;
}

// Auto-schedule recurring tasks
export function scheduleRecurringTasks() {
  // Every 5 minutes: Check for new reviews
  setInterval(async () => {
    console.log('🔍 Checking for new reviews...');
    // Implementation: Query marketplace APIs for new reviews
  }, 5 * 60 * 1000);

  // Every hour: SEO optimization check
  setInterval(async () => {
    console.log('🔍 Running SEO optimization check...');
    // Implementation: Check products that need SEO update
  }, 60 * 60 * 1000);

  // Every 2 hours: Competitor analysis
  setInterval(async () => {
    console.log('🔍 Running competitor analysis...');
    // Implementation: Analyze top competitors
  }, 2 * 60 * 60 * 1000);

  // Daily: Generate reports
  setInterval(async () => {
    console.log('📊 Generating daily reports...');
    // Implementation: Generate reports for all active partners
  }, 24 * 60 * 60 * 1000);
}

// Initialize queue system
export function initializeAIQueue() {
  console.log('🚀 AI Task Queue initialized');
  scheduleRecurringTasks();
}
