# test_auth.py - Simple test script for your auth routes

import requests
import json

BASE_URL = "http://127.0.0.1:8000"

def test_routes():
    print("🧪 Testing MindMate API Routes\n")
    
    # Test 1: Root endpoint
    print("1. Testing root endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/")
        print(f"   ✅ Status: {response.status_code}")
        print(f"   📄 Response: {response.json()}")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    # Test 2: Health check
    print("\n2. Testing health endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/health")
        print(f"   ✅ Status: {response.status_code}")
        print(f"   📄 Response: {response.json()}")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    # Test 3: Debug routes
    print("\n3. Testing debug/routes endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/debug/routes")
        print(f"   ✅ Status: {response.status_code}")
        routes = response.json()["routes"]
        print(f"   📄 Found {len(routes)} routes:")
        for route in routes:
            print(f"      {', '.join(route['methods'])} {route['path']}")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    # Test 4: Signup endpoint
    print("\n4. Testing signup endpoint...")
    signup_data = {
        "name": "Test User",
        "email": "test@example.com",
        "password": "testpass123",
        "age": 25,
        "preferences": ["healthy eating", "meditation"]
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/api/auth/signup",
            json=signup_data,
            headers={"Content-Type": "application/json"}
        )
        print(f"   ✅ Status: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print(f"   🎟️  Token: {result['access_token'][:50]}...")
            print(f"   👤 User: {result['user']}")
        else:
            print(f"   📄 Response: {response.text}")
    except Exception as e:
        print(f"   ❌ Error: {e}")

if __name__ == "__main__":
    test_routes()