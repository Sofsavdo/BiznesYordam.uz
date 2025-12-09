#!/usr/bin/env python3
"""
Comprehensive Backend API Testing for BiznesYordam
Tests all backend endpoints systematically
"""

import requests
import json
import sys
from typing import Dict, Any, Optional

# Configuration
BASE_URL = "http://localhost:5000"
ADMIN_CREDENTIALS = {"username": "admin", "password": "BiznesYordam2024!"}
# Note: testpartner user exists but may not have partner profile
PARTNER_CREDENTIALS = {"username": "testpartner", "password": "partner123"}

class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    END = '\033[0m'

class APITester:
    def __init__(self):
        self.session = requests.Session()
        self.admin_session = requests.Session()
        self.partner_session = requests.Session()
        self.results = {
            "passed": [],
            "failed": [],
            "warnings": []
        }
        self.partner_id = None
        self.product_id = None
        
    def log(self, message: str, level: str = "info"):
        """Log messages with colors"""
        if level == "success":
            print(f"{Colors.GREEN}✅ {message}{Colors.END}")
        elif level == "error":
            print(f"{Colors.RED}❌ {message}{Colors.END}")
        elif level == "warning":
            print(f"{Colors.YELLOW}⚠️  {message}{Colors.END}")
        else:
            print(f"{Colors.BLUE}ℹ️  {message}{Colors.END}")
    
    def test_endpoint(self, name: str, method: str, endpoint: str, 
                     session: Optional[requests.Session] = None,
                     data: Optional[Dict] = None,
                     expected_status: int = 200,
                     json_data: Optional[Dict] = None) -> bool:
        """Test a single endpoint"""
        url = f"{BASE_URL}{endpoint}"
        sess = session or self.session
        
        try:
            if method == "GET":
                response = sess.get(url, timeout=10)
            elif method == "POST":
                if json_data:
                    response = sess.post(url, json=json_data, timeout=10)
                else:
                    response = sess.post(url, data=data, timeout=10)
            elif method == "PUT":
                response = sess.put(url, json=json_data, timeout=10)
            elif method == "DELETE":
                response = sess.delete(url, timeout=10)
            else:
                self.log(f"{name}: Unsupported method {method}", "error")
                return False
            
            # Check status code
            if response.status_code == expected_status:
                self.log(f"{name}: {method} {endpoint} - Status {response.status_code}", "success")
                self.results["passed"].append(name)
                
                # Try to parse JSON response
                try:
                    json_response = response.json()
                    if isinstance(json_response, dict):
                        # Store important IDs for later tests
                        if "partner" in json_response and "id" in json_response["partner"]:
                            self.partner_id = json_response["partner"]["id"]
                        if "id" in json_response and "product" in name.lower():
                            self.product_id = json_response["id"]
                except:
                    pass
                
                return True
            else:
                self.log(f"{name}: Expected {expected_status}, got {response.status_code}", "error")
                self.log(f"Response: {response.text[:200]}", "error")
                self.results["failed"].append(f"{name} (Status: {response.status_code})")
                return False
                
        except requests.exceptions.Timeout:
            self.log(f"{name}: Request timeout", "error")
            self.results["failed"].append(f"{name} (Timeout)")
            return False
        except Exception as e:
            self.log(f"{name}: {str(e)}", "error")
            self.results["failed"].append(f"{name} ({str(e)})")
            return False
    
    def test_health(self):
        """Test health check endpoint"""
        self.log("\n=== Testing Health Check ===", "info")
        return self.test_endpoint("Health Check", "GET", "/api/health")
    
    def test_admin_login(self):
        """Test admin login"""
        self.log("\n=== Testing Admin Authentication ===", "info")
        result = self.test_endpoint(
            "Admin Login",
            "POST",
            "/api/auth/login",
            session=self.admin_session,
            json_data=ADMIN_CREDENTIALS
        )
        return result
    
    def test_admin_me(self):
        """Test admin /me endpoint"""
        return self.test_endpoint(
            "Admin Auth Check",
            "GET",
            "/api/auth/me",
            session=self.admin_session
        )
    
    def test_partner_registration(self):
        """Test partner registration"""
        self.log("\n=== Testing Partner Registration ===", "info")
        
        # Generate unique username
        import time
        timestamp = int(time.time())
        
        partner_data = {
            "username": f"testpartner{timestamp}",
            "email": f"test{timestamp}@example.com",
            "password": "TestPassword123!",
            "firstName": "Test",
            "lastName": "Partner",
            "phone": "+998901234567",
            "businessName": "Test Business LLC",
            "businessCategory": "electronics",
            "monthlyRevenue": "50000-100000",
            "notes": "Test registration"
        }
        
        result = self.test_endpoint(
            "Partner Registration",
            "POST",
            "/api/partners/register",
            json_data=partner_data,
            expected_status=201
        )
        
        if result:
            # Try to login with new partner
            PARTNER_CREDENTIALS["username"] = partner_data["username"]
            PARTNER_CREDENTIALS["password"] = partner_data["password"]
        
        return result
    
    def test_partner_login(self):
        """Test partner login"""
        self.log("\n=== Testing Partner Authentication ===", "info")
        return self.test_endpoint(
            "Partner Login",
            "POST",
            "/api/auth/login",
            session=self.partner_session,
            json_data=PARTNER_CREDENTIALS
        )
    
    def test_partner_me(self):
        """Test partner /me endpoint"""
        return self.test_endpoint(
            "Partner Auth Check",
            "GET",
            "/api/auth/me",
            session=self.partner_session
        )
    
    def test_partner_profile(self):
        """Test partner profile endpoint"""
        self.log("\n=== Testing Partner Profile ===", "info")
        return self.test_endpoint(
            "Get Partner Profile",
            "GET",
            "/api/partners/me",
            session=self.partner_session
        )
    
    def test_admin_get_partners(self):
        """Test admin get all partners"""
        self.log("\n=== Testing Admin Partner Management ===", "info")
        return self.test_endpoint(
            "Admin Get All Partners",
            "GET",
            "/api/admin/partners",
            session=self.admin_session
        )
    
    def test_products(self):
        """Test product endpoints"""
        self.log("\n=== Testing Product Endpoints ===", "info")
        
        # Get products
        get_result = self.test_endpoint(
            "Get Products",
            "GET",
            "/api/products",
            session=self.partner_session
        )
        
        # Create product
        product_data = {
            "name": "Test Product",
            "category": "electronics",
            "price": "99.99",
            "description": "Test product description",
            "costPrice": "50.00",
            "sku": "TEST-001",
            "weight": "1.5"
        }
        
        create_result = self.test_endpoint(
            "Create Product",
            "POST",
            "/api/products",
            session=self.partner_session,
            json_data=product_data,
            expected_status=201
        )
        
        return get_result and create_result
    
    def test_orders(self):
        """Test order endpoints"""
        self.log("\n=== Testing Order Endpoints ===", "info")
        
        # Get orders
        return self.test_endpoint(
            "Get Orders",
            "GET",
            "/api/orders",
            session=self.partner_session
        )
    
    def test_analytics(self):
        """Test analytics endpoint"""
        self.log("\n=== Testing Analytics ===", "info")
        return self.test_endpoint(
            "Get Analytics",
            "GET",
            "/api/analytics",
            session=self.partner_session
        )
    
    def test_ai_manager_endpoints(self):
        """Test AI Manager endpoints"""
        self.log("\n=== Testing AI Manager Endpoints ===", "info")
        
        results = []
        
        # Get AI products
        results.append(self.test_endpoint(
            "AI Manager - Get Products",
            "GET",
            "/api/ai-manager/products",
            session=self.admin_session
        ))
        
        # Get AI tasks
        results.append(self.test_endpoint(
            "AI Manager - Get Tasks",
            "GET",
            "/api/ai-manager/tasks",
            session=self.admin_session
        ))
        
        # Get AI alerts
        results.append(self.test_endpoint(
            "AI Manager - Get Alerts",
            "GET",
            "/api/ai-manager/alerts",
            session=self.admin_session
        ))
        
        return all(results)
    
    def test_partner_ai_toggle(self):
        """Test partner AI toggle"""
        self.log("\n=== Testing Partner AI Toggle ===", "info")
        
        # Request AI enable
        return self.test_endpoint(
            "Partner AI Toggle Request",
            "POST",
            "/api/partners/ai-toggle",
            session=self.partner_session,
            json_data={"enabled": True}
        )
    
    def test_pricing_tiers(self):
        """Test pricing tiers endpoint"""
        self.log("\n=== Testing Pricing Tiers ===", "info")
        return self.test_endpoint(
            "Get Pricing Tiers",
            "GET",
            "/api/pricing-tiers"
        )
    
    def test_logout(self):
        """Test logout"""
        self.log("\n=== Testing Logout ===", "info")
        
        admin_logout = self.test_endpoint(
            "Admin Logout",
            "POST",
            "/api/auth/logout",
            session=self.admin_session
        )
        
        partner_logout = self.test_endpoint(
            "Partner Logout",
            "POST",
            "/api/auth/logout",
            session=self.partner_session
        )
        
        return admin_logout and partner_logout
    
    def run_all_tests(self):
        """Run all tests in sequence"""
        self.log("\n" + "="*60, "info")
        self.log("BIZNESYORDAM BACKEND API COMPREHENSIVE TEST", "info")
        self.log("="*60 + "\n", "info")
        
        # Test sequence
        tests = [
            ("Health Check", self.test_health),
            ("Admin Login", self.test_admin_login),
            ("Admin Auth Check", self.test_admin_me),
            ("Partner Registration", self.test_partner_registration),
            ("Partner Login", self.test_partner_login),
            ("Partner Auth Check", self.test_partner_me),
            ("Partner Profile", self.test_partner_profile),
            ("Admin Get Partners", self.test_admin_get_partners),
            ("Products", self.test_products),
            ("Orders", self.test_orders),
            ("Analytics", self.test_analytics),
            ("AI Manager", self.test_ai_manager_endpoints),
            ("Partner AI Toggle", self.test_partner_ai_toggle),
            ("Pricing Tiers", self.test_pricing_tiers),
            ("Logout", self.test_logout),
        ]
        
        for test_name, test_func in tests:
            try:
                test_func()
            except Exception as e:
                self.log(f"Test '{test_name}' crashed: {str(e)}", "error")
                self.results["failed"].append(f"{test_name} (Crashed)")
        
        # Print summary
        self.print_summary()
    
    def print_summary(self):
        """Print test summary"""
        self.log("\n" + "="*60, "info")
        self.log("TEST SUMMARY", "info")
        self.log("="*60 + "\n", "info")
        
        total = len(self.results["passed"]) + len(self.results["failed"])
        passed = len(self.results["passed"])
        failed = len(self.results["failed"])
        
        self.log(f"Total Tests: {total}", "info")
        self.log(f"Passed: {passed}", "success")
        self.log(f"Failed: {failed}", "error" if failed > 0 else "info")
        
        if self.results["failed"]:
            self.log("\nFailed Tests:", "error")
            for test in self.results["failed"]:
                self.log(f"  - {test}", "error")
        
        if self.results["warnings"]:
            self.log("\nWarnings:", "warning")
            for warning in self.results["warnings"]:
                self.log(f"  - {warning}", "warning")
        
        self.log("\n" + "="*60 + "\n", "info")
        
        # Return exit code
        return 0 if failed == 0 else 1

if __name__ == "__main__":
    tester = APITester()
    exit_code = tester.run_all_tests()
    sys.exit(exit_code)
