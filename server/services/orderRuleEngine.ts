// Order Rule Engine - Automated Order Processing
// Simple but powerful rule-based automation

import { storage } from '../storage';

export interface OrderRule {
  id: string;
  name: string;
  enabled: boolean;
  priority: number;
  conditions: OrderCondition[];
  actions: OrderAction[];
}

export interface OrderCondition {
  field: 'total' | 'marketplace' | 'customer_type' | 'product_category' | 'shipping_country';
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains';
  value: any;
}

export interface OrderAction {
  type: 'set_priority' | 'assign_warehouse' | 'set_shipping_method' | 'send_notification' | 'add_tag';
  params: any;
}

// Built-in rules for common scenarios
const DEFAULT_RULES: OrderRule[] = [
  {
    id: 'rule-high-value',
    name: 'High Value Orders',
    enabled: true,
    priority: 1,
    conditions: [
      { field: 'total', operator: 'greater_than', value: 1000000 } // 1M UZS
    ],
    actions: [
      { type: 'set_priority', params: { priority: 'high' } },
      { type: 'send_notification', params: { recipient: 'admin', message: 'High value order received' } }
    ]
  },
  {
    id: 'rule-uzum-orders',
    name: 'Uzum Marketplace Orders',
    enabled: true,
    priority: 2,
    conditions: [
      { field: 'marketplace', operator: 'equals', value: 'uzum' }
    ],
    actions: [
      { type: 'set_shipping_method', params: { method: 'express' } },
      { type: 'add_tag', params: { tag: 'uzum-priority' } }
    ]
  },
  {
    id: 'rule-international',
    name: 'International Orders',
    enabled: true,
    priority: 3,
    conditions: [
      { field: 'shipping_country', operator: 'not_equals', value: 'UZ' }
    ],
    actions: [
      { type: 'set_priority', params: { priority: 'medium' } },
      { type: 'send_notification', params: { recipient: 'logistics', message: 'International order requires customs' } }
    ]
  }
];

class OrderRuleEngine {
  private rules: OrderRule[] = DEFAULT_RULES;

  // Evaluate conditions
  private evaluateCondition(order: any, condition: OrderCondition): boolean {
    const fieldValue = order[condition.field];
    const conditionValue = condition.value;

    switch (condition.operator) {
      case 'equals':
        return fieldValue === conditionValue;
      case 'not_equals':
        return fieldValue !== conditionValue;
      case 'greater_than':
        return Number(fieldValue) > Number(conditionValue);
      case 'less_than':
        return Number(fieldValue) < Number(conditionValue);
      case 'contains':
        return String(fieldValue).toLowerCase().includes(String(conditionValue).toLowerCase());
      default:
        return false;
    }
  }

  // Check if all conditions match
  private matchesRule(order: any, rule: OrderRule): boolean {
    if (!rule.enabled) return false;
    return rule.conditions.every(condition => this.evaluateCondition(order, condition));
  }

  // Execute actions
  private async executeAction(order: any, action: OrderAction): Promise<void> {
    console.log(`🔧 Executing action: ${action.type}`, action.params);

    switch (action.type) {
      case 'set_priority':
        // Update order priority
        await storage.updateOrder(order.id, { priority: action.params.priority });
        break;

      case 'assign_warehouse':
        // Assign to specific warehouse
        await storage.updateOrder(order.id, { warehouseId: action.params.warehouseId });
        break;

      case 'set_shipping_method':
        // Set shipping method
        await storage.updateOrder(order.id, { shippingMethod: action.params.method });
        break;

      case 'send_notification':
        // Send notification (implement notification service)
        console.log(`📧 Notification: ${action.params.message} to ${action.params.recipient}`);
        break;

      case 'add_tag':
        // Add tag to order
        const currentTags = order.tags || [];
        await storage.updateOrder(order.id, { 
          tags: [...currentTags, action.params.tag] 
        });
        break;

      default:
        console.warn(`Unknown action type: ${action.type}`);
    }
  }

  // Process order through rule engine
  async processOrder(order: any): Promise<{ applied: string[], actions: number }> {
    console.log(`🔍 Processing order ${order.orderNumber} through rule engine`);

    const appliedRules: string[] = [];
    let actionsExecuted = 0;

    // Sort rules by priority
    const sortedRules = [...this.rules].sort((a, b) => a.priority - b.priority);

    for (const rule of sortedRules) {
      if (this.matchesRule(order, rule)) {
        console.log(`✅ Rule matched: ${rule.name}`);
        appliedRules.push(rule.name);

        // Execute all actions
        for (const action of rule.actions) {
          try {
            await this.executeAction(order, action);
            actionsExecuted++;
          } catch (error) {
            console.error(`❌ Error executing action:`, error);
          }
        }
      }
    }

    console.log(`✅ Order processing complete: ${appliedRules.length} rules applied, ${actionsExecuted} actions executed`);

    return { applied: appliedRules, actions: actionsExecuted };
  }

  // Get all rules
  getRules(): OrderRule[] {
    return this.rules;
  }

  // Add custom rule
  addRule(rule: OrderRule): void {
    this.rules.push(rule);
  }

  // Update rule
  updateRule(ruleId: string, updates: Partial<OrderRule>): void {
    const index = this.rules.findIndex(r => r.id === ruleId);
    if (index !== -1) {
      this.rules[index] = { ...this.rules[index], ...updates };
    }
  }

  // Delete rule
  deleteRule(ruleId: string): void {
    this.rules = this.rules.filter(r => r.id !== ruleId);
  }

  // Enable/disable rule
  toggleRule(ruleId: string, enabled: boolean): void {
    const rule = this.rules.find(r => r.id === ruleId);
    if (rule) {
      rule.enabled = enabled;
    }
  }
}

// Export singleton instance
export const orderRuleEngine = new OrderRuleEngine();

// Export for testing
export { OrderRuleEngine };
