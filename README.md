# User Registration API Server

The purpose of this server is to register users to database with the very first user as the admin.

## Prerequisites

- [Node.js](https://nodejs.org) v10.15.0+
- [PostgreSQL](https://postgresql.org) v12.1.0+

## Getting Started

Clone the repo and install the packages.

``` bash
$ git clone https://github.com/chaythanyanair/user-registration-api.gits
$ npm install
```

### Start a Local API Server

Inorder to test the application one can start the application locally. 

```bash
$ npm start
```
The API server should be up and running in port `9000`.

Now we can test if the server has been started successfully:

```bash
$ curl --location --request GET 'http://localhost:9000/user/9' 
{"code":200,"status":"Success","message":"No user found"}
```

## API Specification

The application currently supports two APIs. One for registering new users into the database and another for accesing the user details.


__Application URL__: https://banking-api-server.herokuapp.com


1. POST /user API

This API can be used to add new users to the database. The very first user of the database will always be an admin user. The amdin user's permission is automatically set as `admin`.

For further users, if you do not specify any user permissions in the request body `observer` role will be given by default.

```bash
curl --location --request POST 'http://localhost:9000/user/' \
--header 'Content-Type: application/json' \
--data-raw '{
"email": "admin@example.io"
"password":"admin"
"last_name": "admin",
"first_name" : "admin",
"roles": [
"admin",
"observer",
"editor"
]
}'
```
2. GET /user/:userId API

This API fetches details of the user for a given user id.

```bash
curl --location --request GET 'http://localhost:9000/user/2' 
{"code":200,"status":"Success","user":{"id":2,"first_name":"admin","last_name":"admin","email":"admin@example.io","roles":["observer"]}}
```


## Technology Stack

- Language: `Node.js`
- Database: `PostgreSQL`

