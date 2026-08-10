## Delete User

curl -X DELETE http://localhost:8080/api/v1/users/d4d22419-04dd-4662-ad21-e88180cc451d \
  -H "Content-Type: application/json" 

## Update User

curl -X PUT http://localhost:8080/api/v1/users/5770a2c0-8c09-4563-b1db-75ecc5e5372a \
  -H "Content-Type: application/json" \
  -d '{
    "username": "evgs",
    "email": "yevg@bk.ru",
    "password": "777"
  }'

## Delete Skills

curl -X DELETE http://localhost:8080/api/v1/skills/7 -v 

