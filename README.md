# Social Networking API Documentation

This document outlines the API endpoints for a simple social networking application. The application supports features such as user management, authentication, post creation, and following mechanisms.

## Base URL

All URLs referenced in the documentation have the following base:

http://localhost:3000


## Authentication

### Sign Up

- **URL**

  `/users/signup`

- **Method:**

  `POST`

- **Data Params**

  ```json
  {
    "username": "user_example",
    "email": "user@example.com",
    "password": "password123"
  }

Success Response:

Code: 200 <br />
Content: { token: "JWT_TOKEN" }

Log In
URL

/users/login

Method:

POST

Data Params
```{
  "email": "user@example.com",
  "password": "password123"
}
```
Success Response:

Code: 200 <br />
Content: { token: "JWT_TOKEN" }
Users
Get User Profile
URL

/users/me

Method:

GET

Authorization:

Bearer Token (JWT)

Success Response:

Code: 200 <br />
Content: User object
Update User Profile
URL

/users/me

Method:

PATCH

Authorization:

Bearer Token (JWT)

Data Params
```
{
  "bio": "New bio",
  "profilePictureUrl": "http://example.com/new-picture.jpg"
}
```
Success Response:

Code: 200 <br />
Content: User object
Posts
Create a Post
URL

/posts

Method:

POST

Authorization:

Bearer Token (JWT)

Data Params
```
{
  "text": "This is a sample post."
}
```
Success Response:

Code: 201 <br />
Content: Post object
Get Latest Posts from Followed Users
URL

/posts/following

Method:

GET

Authorization:

Bearer Token (JWT)

Success Response:

Code: 200 <br />
Content: [Posts array]

