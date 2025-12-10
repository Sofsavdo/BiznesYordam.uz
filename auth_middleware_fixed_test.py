#!/usr/bin/env python3
"""
FINAL COMPREHENSIVE TEST - After All Fixes
Testing ALL endpoints after auth middleware fix
Focus: Partner endpoints that were failing before
"""

import requests
import json
import sys
from typing import Dict, Any, Optional

# Configuration
BASE_URL = "http://localhost:5000"
PARTNER_CREDENTIALS = {"username": "testpartner", "password": "partner123"}

class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    CYAN = '\033[96m'
    END = '\033[0m'

class ComprehensiveAPITester:
    def __init__(self):
        self.session = requests.Session()
        self.results = {
            "passed": [],
            "failed": [],
            "total": 0
        }
        
    def log(self, message: str, level: str = "info"):
        """Log messages with colors"""
        if level == "success":
            print(f"{Colors.GREEN}✅ {message}{Colors.END}")
        elif level == "error":
            print(f"{Colors.RED}❌ {message}{Colors.END}")
        elif level == "warning":
            print(f"{Colors.YELLOW}⚠️  {message}{Colors.END}")
        elif level == "header":
            print(f"{Colors.CYAN}{'='*70}{Colors.END}")
            print(f"{Colors.CYAN}{message}{Colors.END}")
            print(f"{Colors.CYAN}{'='*70}{Colors.END}")
        else:
            print(f"{Colors.BLUE}ℹ️  {message}{Colors.END}")
    
    def test_endpoint(self, name: str, method: str, endpoint: str, 
                     data: Optional[Dict] = None,
                     expected_status: int = 200,
                     json_data: Optional[Dict] = None) -> bool:
        """Test a single endpoint"""
        url = f"{BASE_URL}{endpoint}"
        self.results["total"] += 1
        
        try:
            if method == "GET":
                response = self.session.get(url, timeout=10)
            elif method == "POST":
                if json_data:
                    response = self.session.post(url, json=json_data, timeout=10)
                else:
                    response = self.session.post(url, data=data, timeout=10)
            elif method == "PUT":
                response = self.session.put(url, json=json_data, timeout=10)
            else:
                self.log(f"{name}: Unsupported method {method}", "error")
                self.results["failed"].append(name)
                return False
            
            # Check status code
            if response.status_code == expected_status:
                self.log(f"{name}: {method} {endpoint} - Status {response.status_code}", "success")
                self.results["passed"].append(name)
                
                # Show response preview
                try:
                    json_response = response.json()
                    if isinstance(json_response, dict):
                        keys = list(json_response.keys())[:5]
                        self.log(f"  Response keys: {keys}", "info")
                    elif isinstance(json_response, list):
                        self.log(f"  Response: Array with {len(json_response)} items", "info")
                except:
                    pass
                
                return True
            else:
                self.log(f"{name}: Expected {expected_status}, got {response.status_code}", "error")
                try:
                    error_data = response.json()
                    self.log(f"  Error: {json.dumps(error_data, indent=2)}", "error")
                except:
                    self.log(f"  Response: {response.text[:200]}", "error")
                self.results["failed"].append(name)
                return False
                
        except requests.exceptions.Timeout:
            self.log(f"{name}: Request timeout", "error")
            self.results["failed"].append(name)
            return False
        except Exception as e:
            self.log(f"{name}: {str(e)}", "error")
            self.results["failed"].append(name)
            return False
    
    def run_comprehensive_test(self):
        """Run all comprehensive tests"""
        self.log("FINAL COMPREHENSIVE TEST - After All Fixes", "header")
        self.log("Objective: Verify ALL endpoints work after auth middleware fix\n", "info")
        
        # 1. Partner Login
        self.log("\n=== 1. AUTHENTICATION ===", "header")
        login_success = self.test_endpoint(
            "Partner Login",
            "POST",
            "/api/auth/login",
            json_data=PARTNER_CREDENTIALS
        )
        
        if not login_success:
            self.log("\n❌ CRITICAL: Login failed. Cannot proceed with other tests.", "error")
            self.print_summary()
            return 1
        
        # 2. Partner Profile - GET /api/partners/me (requirePartnerWithData)
        self.log("\n=== 2. PARTNER PROFILE (requirePartnerWithData) ===", "header")
        self.test_endpoint(
            "GET /api/partners/me",
            "GET",
            "/api/partners/me"
        )
        
        # 3. Products - GET /api/products, POST /api/products
        self.log("\n=== 3. PRODUCTS (middleware + barcode column) ===", "header")
        self.test_endpoint(
            "GET /api/products",
            "GET",
            "/api/products"
        )
        
        import time
        timestamp = int(time.time())
        
        product_data = {
            "name": "Test Product After Fix",
            "category": "electronics",
            "price": 199.99,
            "description": "Test product after middleware fix",
            "costPrice": 100.00,
            "sku": f"TEST-FIX-{timestamp}"
        }
        
        self.test_endpoint(
            "POST /api/products",
            "POST",
            "/api/products",
            json_data=product_data,
            expected_status=201
        )
        
        # 4. Inventory - GET /api/inventory/stats, /api/inventory/items
        self.log("\n=== 4. INVENTORY (requirePartnerWithData) ===", "header")
        self.test_endpoint(
            "GET /api/inventory/stats",
            "GET",
            "/api/inventory/stats"
        )
        
        self.test_endpoint(
            "GET /api/inventory/items",
            "GET",
            "/api/inventory/items"
        )
        
        # 5. Chat - GET /api/chat/room, GET /api/chat/messages, POST /api/chat/messages
        self.log("\n=== 5. CHAT (new routes) ===", "header")
        self.test_endpoint(
            "GET /api/chat/room",
            "GET",
            "/api/chat/room"
        )
        
        self.test_endpoint(
            "GET /api/chat/messages",
            "GET",
            "/api/chat/messages"
        )
        
        chat_message = {
            "content": "Test message after middleware fix",
            "messageType": "text"
        }
        
        self.test_endpoint(
            "POST /api/chat/messages",
            "POST",
            "/api/chat/messages",
            json_data=chat_message,
            expected_status=201
        )
        
        # 6. Orders - GET /api/orders
        self.log("\n=== 6. ORDERS ===", "header")
        self.test_endpoint(
            "GET /api/orders",
            "GET",
            "/api/orders"
        )
        
        # 7. Analytics - GET /api/analytics
        self.log("\n=== 7. ANALYTICS ===", "header")
        self.test_endpoint(
            "GET /api/analytics",
            "GET",
            "/api/analytics"
        )
        
        # 8. Referral - GET /api/referrals/stats
        self.log("\n=== 8. REFERRAL ===", "header")
        self.test_endpoint(
            "GET /api/referrals/stats",
            "GET",
            "/api/referrals/stats"
        )
        
        # Additional critical endpoints
        self.log("\n=== 9. ADDITIONAL PARTNER ENDPOINTS ===", "header")
        
        # Fulfillment requests
        self.test_endpoint(
            "GET /api/fulfillment-requests",
            "GET",
            "/api/fulfillment-requests"
        )
        
        # Profit breakdown
        self.test_endpoint(
            "GET /api/profit-breakdown",
            "GET",
            "/api/profit-breakdown"
        )
        
        # Stock alerts
        self.test_endpoint(
            "GET /api/stock-alerts",
            "GET",
            "/api/stock-alerts"
        )
        
        # AI Manager endpoints
        self.log("\n=== 10. AI MANAGER ENDPOINTS ===", "header")
        self.test_endpoint(
            "GET /api/ai-manager/tasks",
            "GET",
            "/api/ai-manager/tasks"
        )
        
        self.test_endpoint(
            "GET /api/ai-manager/alerts",
            "GET",
            "/api/ai-manager/alerts"
        )
        
        # Subscriptions
        self.log("\n=== 11. SUBSCRIPTIONS ===", "header")
        self.test_endpoint(
            "GET /api/subscriptions/current",
            "GET",
            "/api/subscriptions/current"
        )
        
        # Print summary
        self.print_summary()
        
        # Return exit code based on success rate
        success_rate = (len(self.results["passed"]) / self.results["total"]) * 100
        if success_rate >= 80:
            return 0
        else:
            return 1
    
    def print_summary(self):
        """Print test summary"""
        self.log("\n" + "="*70, "info")
        self.log("TEST SUMMARY", "header")
        
        total = self.results["total"]
        passed = len(self.results["passed"])
        failed = len(self.results["failed"])
        success_rate = (passed / total * 100) if total > 0 else 0
        
        self.log(f"\nTotal Tests: {total}", "info")
        self.log(f"Passed: {passed} ({success_rate:.1f}%)", "success" if success_rate >= 80 else "warning")
        self.log(f"Failed: {failed}", "error" if failed > 0 else "info")
        
        if success_rate >= 80:
            self.log(f"\n🎉 SUCCESS: {success_rate:.1f}% tests passing (Expected: 80%+)", "success")
        else:
            self.log(f"\n⚠️  WARNING: Only {success_rate:.1f}% tests passing (Expected: 80%+)", "warning")
        
        if self.results["failed"]:
            self.log("\n❌ Failed Tests:", "error")
            for test in self.results["failed"]:
                self.log(f"  - {test}", "error")
        
        self.log("\n" + "="*70 + "\n", "info")

if __name__ == "__main__":
    tester = ComprehensiveAPITester()
    exit_code = tester.run_comprehensive_test()
    sys.exit(exit_code)
