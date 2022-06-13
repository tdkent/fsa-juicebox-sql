-- LOGIN Correct Credentials:

curl http://localhost:3000/api/users/login -H "Content-Type: application/json" -X POST -d '{"username": "jean", "password": "sibelius1865"}' 

curl http://localhost:3000/api/users/login -H "Content-Type: application/json" -X POST -d '{"username": "paul", "password": "dukas1865"}'

-- Incorrect Credentials:

curl http://localhost:3000/api/users/login -H "Content-Type: application/json" -X POST -d '{"username": "bela", "password": "bartok1781"}'

-- Missing Credentials:

curl http://localhost:3000/api/users/login -H "Content-Type: application/json" -X POST -d '{"username": "bela"}'

-- REGISTER Correct Credentials:

curl http://localhost:3000/api/users/register -H "Content-Type: application/json" -X POST -d '{"username": "paul", "password": "dukas1865", "name": "paul", "location": "france"}'

-- Sample Token: 

eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJqZWFuIiwiaWF0IjoxNjU1MDgyNjIyfQ.9lLAqoTphgpft_FPks5llO-9yMzy3BArG1LD0oIq69Q

-- Create Post Request (Correct, using above token)

curl http://localhost:3000/api/posts -X POST -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJqZWFuIiwiaWF0IjoxNjU1MDgyNjIyfQ.9lLAqoTphgpft_FPks5llO-9yMzy3BArG1LD0oIq69Q' -H 'Content-Type: application/json' -d '{"title": "6th Symphony", "content": "Whereas most other modern composers are engaged in manufacturing cocktails of every hue and description, I offer the public pure cold water", "tags": " #pure #cold    #water"}'

-- Update Post Request (Correct, using above token)

curl http://localhost:3000/api/posts/25 -X PATCH -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJqZWFuIiwiaWF0IjoxNjU1MDY2OTQ0fQ.jLWRMkNofxF4otbDpp448Ot7ePRWQR6S630PPtOTaBA' -H 'Content-Type: application/json' -d '{"title": "Working on the Seventh now", "content": "The grandest celebration of C major there ever was", "tags": "#final-symphony"}'

-- Delete Post Request (Correct, using token above)

curl http://localhost:3000/api/posts/4 -X DELETE -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJqZWFuIiwiaWF0IjoxNjU1MDgyNjIyfQ.9lLAqoTphgpft_FPks5llO-9yMzy3BArG1LD0oIq69Q'

- Show Posts (Logged In)

curl http://localhost:3000/api/posts -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJqZWFuIiwiaWF0IjoxNjU1MDgyNjIyfQ.9lLAqoTphgpft_FPks5llO-9yMzy3BArG1LD0oIq69Q'

- Show Posts by Tag (Logged In)

curl http://localhost:3000/api/tags/%23cold/posts -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJqZWFuIiwiaWF0IjoxNjU1MDgxMzI0fQ.KTVfY9uQccdzAUy50_UR0PUZs72trSfxI_H9-U4V7hQ'