-- LOGIN Correct Credentials:

curl http://localhost:3000/api/users/login -H "Content-Type: application/json" -X POST -d '{"username": "jean", "password": "sibelius1865"}' 

-- Incorrect Credentials:

curl http://localhost:3000/api/users/login -H "Content-Type: application/json" -X POST -d '{"username": "bela", "password": "bartok1781"}'

-- Missing Credentials:

curl http://localhost:3000/api/users/login -H "Content-Type: application/json" -X POST -d '{"username": "bela"}'

-- REGISTER Correct Credentials:

curl http://localhost:3000/api/users/register -H "Content-Type: application/json" -X POST -d '{"username": "paul", "password": "dukas1865", "name": "paul", "location": "france"}'

-- User

curl http://localhost:3000/api -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJqZWFuIiwiaWF0IjoxNjU0ODA5OTcxfQ.st6o0WftkZ4r8aWk7Hui28d5hxOlJan4EIP-uPfCeQI'