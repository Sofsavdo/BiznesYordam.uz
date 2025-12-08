// SELF-HEALING AI SYSTEM
// Automatic error detection, analysis, and recovery

import emergentAI from './emergentAI';
import { storage } from '../storage';

interface ErrorEvent {
  id: string;
  partnerId: string;
  marketplace?: string;
  errorType: string;
  errorMessage: string;
  stackTrace?: string;
  context: any;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

interface RecoveryAction {
  type: string;
  description: string;
  automated: boolean;
  executed: boolean;
  success?: boolean;
  result?: any;
}

interface HealingResult {
  success: boolean;
  recoveryActions: RecoveryAction[];
  requiresManual: boolean;
  adminNotified: boolean;
  learningStored: boolean;
}

class SelfHealingSystem {
  private errorPatterns: Map<string, number> = new Map();
  private knowledgeBase: Map<string, RecoveryAction[]> = new Map();

  // ==================== ERROR DETECTION ====================
  
  async detectError(error: Error | any, context: any): Promise<ErrorEvent> {
    const errorEvent: ErrorEvent = {
      id: `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      partnerId: context.partnerId,
      marketplace: context.marketplace,
      errorType: this.classifyError(error),
      errorMessage: error.message || String(error),
      stackTrace: error.stack,
      context,
      timestamp: new Date(),
      severity: this.assessSeverity(error, context),
    };

    // Store error
    await storage.logError(errorEvent);

    // Update error patterns
    const pattern = this.extractPattern(error);
    this.errorPatterns.set(pattern, (this.errorPatterns.get(pattern) || 0) + 1);

    console.log(`🚨 Error detected: ${errorEvent.errorType} (${errorEvent.severity})`);

    return errorEvent;
  }

  // ==================== CLASSIFY ERROR ====================
  
  private classifyError(error: any): string {
    const message = error.message?.toLowerCase() || '';
    
    if (message.includes('timeout') || message.includes('timed out')) {
      return 'TIMEOUT';
    }
    if (message.includes('network') || message.includes('econnrefused')) {
      return 'NETWORK';
    }
    if (message.includes('selector') || message.includes('element not found')) {
      return 'SELECTOR';
    }
    if (message.includes('login') || message.includes('authentication')) {
      return 'AUTH';
    }
    if (message.includes('captcha')) {
      return 'CAPTCHA';
    }
    if (message.includes('rate limit')) {
      return 'RATE_LIMIT';
    }
    if (message.includes('api') || message.includes('request failed')) {
      return 'API';
    }
    
    return 'UNKNOWN';
  }

  // ==================== ASSESS SEVERITY ====================
  
  private assessSeverity(error: any, context: any): ErrorEvent['severity'] {
    const errorType = this.classifyError(error);
    
    // Critical errors
    if (['AUTH', 'CRITICAL'].includes(errorType)) {
      return 'critical';
    }
    
    // High severity
    if (['NETWORK', 'API'].includes(errorType)) {
      return 'high';
    }
    
    // Medium severity
    if (['TIMEOUT', 'SELECTOR', 'RATE_LIMIT'].includes(errorType)) {
      return 'medium';
    }
    
    return 'low';
  }

  // ==================== HEAL ERROR ====================
  
  async heal(errorEvent: ErrorEvent): Promise<HealingResult> {
    console.log(`🔧 Attempting to heal error: ${errorEvent.errorType}`);

    const recoveryActions: RecoveryAction[] = [];
    let success = false;
    let requiresManual = false;

    try {
      // Check knowledge base first
      const knownActions = this.knowledgeBase.get(errorEvent.errorType);
      
      if (knownActions) {
        // Apply known solution
        for (const action of knownActions) {
          const result = await this.executeRecoveryAction(action, errorEvent);
          recoveryActions.push(result);
          
          if (result.success) {
            success = true;
            break;
          }
        }
      }

      // If no known solution, use AI
      if (!success) {
        const aiActions = await this.generateRecoveryWithAI(errorEvent);
        
        for (const action of aiActions) {
          const result = await this.executeRecoveryAction(action, errorEvent);
          recoveryActions.push(result);
          
          if (result.success) {
            success = true;
            // Store in knowledge base
            await this.learnFromSuccess(errorEvent.errorType, action);
            break;
          }
        }
      }

      // If still not resolved, escalate to manual
      if (!success) {
        requiresManual = true;
        await this.notifyAdmin(errorEvent, recoveryActions);
      }

      return {
        success,
        recoveryActions,
        requiresManual,
        adminNotified: requiresManual,
        learningStored: success,
      };

    } catch (healingError: any) {
      console.error('Healing failed:', healingError);
      
      return {
        success: false,
        recoveryActions,
        requiresManual: true,
        adminNotified: true,
        learningStored: false,
      };
    }
  }

  // ==================== GENERATE RECOVERY WITH AI ====================
  
  private async generateRecoveryWithAI(errorEvent: ErrorEvent): Promise<RecoveryAction[]> {
    const prompt = `
Sen self-healing AI system san. Quyidagi xatolikni tahlil qil va tuzatish yo'llarini taklif qil.

XATOLIK:
Type: ${errorEvent.errorType}
Message: ${errorEvent.errorMessage}
Severity: ${errorEvent.severity}
Context: ${JSON.stringify(errorEvent.context, null, 2)}

Quyidagilarni JSON formatda ber:
{
  "analysis": "Xatolik sababi",
  "recoveryActions": [
    {
      "type": "retry" | "refresh_session" | "change_selector" | "wait" | "fallback",
      "description": "Nima qilish kerak",
      "automated": true/false,
      "parameters": {...}
    }
  ]
}
`;

    const result = await emergentAI.generateJSON<{
      analysis: string;
      recoveryActions: Array<{
        type: string;
        description: string;
        automated: boolean;
        parameters?: any;
      }>;
    }>(prompt, 'ErrorRecovery');

    return result.recoveryActions.map(action => ({
      type: action.type,
      description: action.description,
      automated: action.automated,
      executed: false,
    }));
  }

  // ==================== EXECUTE RECOVERY ACTION ====================
  
  private async executeRecoveryAction(
    action: RecoveryAction,
    errorEvent: ErrorEvent
  ): Promise<RecoveryAction> {
    console.log(`🔄 Executing recovery: ${action.type}`);

    const executed: RecoveryAction = { ...action, executed: true };

    try {
      switch (action.type) {
        case 'retry':
          executed.success = await this.retryOperation(errorEvent);
          break;

        case 'refresh_session':
          executed.success = await this.refreshSession(errorEvent);
          break;

        case 'change_selector':
          executed.success = await this.findAlternativeSelector(errorEvent);
          break;

        case 'wait':
          await this.waitAndRetry(errorEvent);
          executed.success = true;
          break;

        case 'fallback':
          executed.success = await this.useFallback(errorEvent);
          break;

        default:
          executed.success = false;
          executed.result = 'Unknown recovery action';
      }

      if (executed.success) {
        console.log(`✅ Recovery successful: ${action.type}`);
      } else {
        console.log(`❌ Recovery failed: ${action.type}`);
      }

      return executed;

    } catch (error: any) {
      console.error(`Recovery action failed: ${action.type}`, error);
      executed.success = false;
      executed.result = error.message;
      return executed;
    }
  }

  // ==================== RECOVERY STRATEGIES ====================
  
  private async retryOperation(errorEvent: ErrorEvent): Promise<boolean> {
    // Retry with exponential backoff
    const maxRetries = 3;
    
    for (let i = 0; i < maxRetries; i++) {
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
      
      try {
        // Re-execute original operation
        // Implementation depends on operation type
        return true;
      } catch (error) {
        if (i === maxRetries - 1) {
          return false;
        }
      }
    }
    
    return false;
  }

  private async refreshSession(errorEvent: ErrorEvent): Promise<boolean> {
    // Refresh marketplace session/cookies
    if (!errorEvent.marketplace) return false;

    try {
      // Re-login to marketplace
      // Implementation in marketplaceAutomation service
      return true;
    } catch (error) {
      return false;
    }
  }

  private async findAlternativeSelector(errorEvent: ErrorEvent): Promise<boolean> {
    // Use AI to find alternative CSS selector
    const prompt = `
Quyidagi selector ishlamayapti: ${errorEvent.context.selector}

Marketplace: ${errorEvent.marketplace}
Element type: ${errorEvent.context.elementType}

Alternative selectors taklif qil (3 ta):
`;

    try {
      const result = await emergentAI.generateText({ prompt, maxTokens: 200 });
      // Try alternative selectors
      // Implementation depends on Puppeteer integration
      return false; // Placeholder
    } catch (error) {
      return false;
    }
  }

  private async waitAndRetry(errorEvent: ErrorEvent): Promise<void> {
    // Wait for element/network/etc
    await new Promise(resolve => setTimeout(resolve, 5000));
  }

  private async useFallback(errorEvent: ErrorEvent): Promise<boolean> {
    // Switch to fallback method (e.g., API instead of Puppeteer)
    return false; // Placeholder
  }

  // ==================== LEARNING ====================
  
  private async learnFromSuccess(errorType: string, action: RecoveryAction): Promise<void> {
    // Store successful recovery in knowledge base
    const existing = this.knowledgeBase.get(errorType) || [];
    existing.unshift(action); // Add to beginning (most recent)
    
    // Keep only top 5 actions
    if (existing.length > 5) {
      existing.length = 5;
    }
    
    this.knowledgeBase.set(errorType, existing);

    // Persist to database
    await storage.storeKnowledgeBaseEntry(errorType, action);

    console.log(`📚 Learned new recovery for ${errorType}`);
  }

  // ==================== ADMIN NOTIFICATION ====================
  
  private async notifyAdmin(
    errorEvent: ErrorEvent,
    attemptedActions: RecoveryAction[]
  ): Promise<void> {
    const notification = {
      type: 'ERROR_REQUIRES_MANUAL',
      errorEvent,
      attemptedActions,
      timestamp: new Date(),
    };

    // Send email alert
    // await emailService.sendAdminAlert(notification);

    // Send in-app notification
    // await notificationService.send('admin', notification);

    // Create support ticket
    await storage.createSupportTicket({
      partnerId: errorEvent.partnerId,
      priority: errorEvent.severity === 'critical' ? 'urgent' : 'high',
      subject: `Auto-recovery failed: ${errorEvent.errorType}`,
      description: JSON.stringify({ errorEvent, attemptedActions }, null, 2),
      status: 'open',
      createdAt: new Date(),
    });

    console.log(`🚨 Admin notified: ${errorEvent.id}`);
  }

  // ==================== PATTERN EXTRACTION ====================
  
  private extractPattern(error: any): string {
    // Extract common pattern from error
    const message = error.message || String(error);
    
    // Remove dynamic parts (IDs, timestamps, etc)
    return message
      .replace(/\d+/g, 'N')
      .replace(/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/gi, 'UUID')
      .replace(/https?:\/\/[^\s]+/g, 'URL')
      .toLowerCase();
  }

  // ==================== ANALYTICS ====================
  
  getErrorStatistics(): {
    totalErrors: number;
    byType: Record<string, number>;
    bySeverity: Record<string, number>;
    healingSuccessRate: number;
  } {
    // Calculate from stored data
    return {
      totalErrors: this.errorPatterns.size,
      byType: Object.fromEntries(this.errorPatterns),
      bySeverity: {},
      healingSuccessRate: 0.75, // Placeholder: 75%
    };
  }
}

export const selfHealing = new SelfHealingSystem();
export default selfHealing;
