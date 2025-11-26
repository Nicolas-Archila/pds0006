# Health Check Test
GET {{base_url}}/health
HTTP 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.timestamp" exists

# Test Root Endpoint
GET {{base_url}}/
HTTP 200

# Test Device Endpoints (ajusta según tus rutas)
GET {{base_url}}/api/devices
HTTP 200
[Asserts]
header "Content-Type" contains "application/json"

# Test Photo Repository
GET {{base_url}}/api/photos
HTTP 200

# Test Medical Device Repository  
GET {{base_url}}/api/medical
HTTP 200

# Test Computer Request Repository
GET {{base_url}}/api/computer
HTTP 200