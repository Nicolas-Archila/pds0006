# Health Check Test
GET {{base_url}}/health
HTTP 200

# Test Root Endpoint
GET {{base_url}}/
HTTP 200

# Test Get Devices
GET {{base_url}}/api/devices
HTTP 200
