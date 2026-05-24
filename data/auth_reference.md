**FastAPI JWT Authentication**

Complete Component Reference & Communication Guide

_auth/ module • main.py • All endpoints explained_

_Python | FastAPI | SQLAlchemy | python-jose | passlib_

# **1\. Overview**

This module implements a complete, production-ready authentication system for a FastAPI application. It uses **JSON Web Tokens (JWT)** - a stateless, self-contained way to verify identity without touching the database on every request.

**What it does:** A user registers once, logs in to receive two tokens, then uses the short-lived access token for every protected endpoint. When it expires, the refresh token issues a new one without requiring the password again.

## **1.1 The Two-Token Strategy**

Two tokens are issued on login for security reasons:

- **Access Token**
- Short-lived (30 minutes by default)
- Sent in the Authorization header on every API request
- If stolen, attacker access expires quickly
- **Refresh Token**
- Long-lived (7 days by default)
- Only sent to the /auth/refresh endpoint
- Never used for accessing protected resources directly
- Lets users stay logged in without re-entering passwords

## **1.2 Project Structure**

project/

├── main.py ← FastAPI app, startup, router registration

├── requirements.txt ← all Python dependencies

├── .env.example ← environment variable template

└── auth/ ← self-contained auth package

├── \__init_\_.py

├── config.py ← settings (SECRET_KEY, expiry times)

├── models.py ← SQLAlchemy User table definition

├── database.py ← DB engine + get_db() session factory

├── schemas.py ← Pydantic request/response shapes

├── hashing.py ← bcrypt password utilities

├── jwt.py ← token creation and decoding

├── dependencies.py ← FastAPI deps: get_current_user etc.

└── router.py ← all /auth/\* route handlers

# **2\. Component Deep Dive**

## **2.1 config.py - Settings & Environment Variables**

This is the single source of truth for all tunable parameters. It uses pydantic-settings, which automatically reads values from a .env file or shell environment variables.

| **Variable**                | **Default**   | **Purpose**                                                                        |
| --------------------------- | ------------- | ---------------------------------------------------------------------------------- |
| SECRET_KEY                  | (placeholder) | HMAC secret used to sign and verify JWTs. Must be long, random, and kept private.  |
| ALGORITHM                   | HS256         | JWT signing algorithm. HS256 = HMAC-SHA256, symmetric (one key for sign + verify). |
| ACCESS_TOKEN_EXPIRE_MINUTES | 30            | Lifetime of the access token. Shorter = more secure, less convenient.              |
| REFRESH_TOKEN_EXPIRE_DAYS   | 7             | Lifetime of the refresh token. Longer means fewer logins needed.                   |

**Security note:** Generate SECRET_KEY with: openssl rand -hex 32. Never commit this to version control. Load it only through environment variables or a secrets manager.

The auth_settings singleton is imported by jwt.py to sign tokens. No other file needs to import config.py directly.

## **2.2 models.py - SQLAlchemy User Model**

Defines the users database table using SQLAlchemy's declarative ORM. Each Python attribute maps to a SQL column.

| **Column**      | **Type**     | **Description**                                                            |
| --------------- | ------------ | -------------------------------------------------------------------------- |
| id              | Integer PK   | Auto-incrementing primary key                                              |
| username        | String(32)   | Unique, indexed. Used as the JWT subject (sub claim).                      |
| email           | String(255)  | Unique, indexed. Validated by Pydantic before reaching the DB.             |
| hashed_password | String(255)  | bcrypt hash. The plain password is NEVER stored.                           |
| is_active       | Boolean      | Soft-delete flag. Inactive users are rejected without deleting their data. |
| created_at      | DateTime(tz) | Set to UTC now() at row creation. Not updatable.                           |

**Why index username and email?** Both are queried on every login and registration uniqueness check. Without indexes, each query is a full table scan - fine for 100 users, painful for 100,000.

## **2.3 database.py - Database Session Factory**

Configures SQLAlchemy and exposes a get_db() generator that FastAPI uses as a dependency. The session is opened at the start of a request and closed (via finally) after the response is sent, even if an exception occurs.

\# How get_db() works - simplified

def get_db():

db = SessionLocal() # open a connection

try:

yield db # hand it to the route handler

finally:

db.close() # always close, even on error

To switch to PostgreSQL, change only the DATABASE_URL string:

\# SQLite (development)

DATABASE_URL = "sqlite:///./app.db"

\# PostgreSQL (production)

DATABASE_URL = "postgresql+psycopg2://user:pass@host:5432/dbname"

**Important:** check_same_thread=False is SQLite-specific. Remove it (or the connect_args dict entirely) when using PostgreSQL or MySQL.

## **2.4 schemas.py - Pydantic Request & Response Shapes**

Pydantic schemas act as a **contract** between the API and its callers. FastAPI uses them for two things automatically:

- Input validation - rejects requests that don't match the schema before your code runs
- Output serialisation - filters the response to only include declared fields (no leaking hashed_password!)

| **Schema**            | **Direction** | **Fields & Notes**                                                   |
| --------------------- | ------------- | -------------------------------------------------------------------- |
| RegisterRequest       | → Inbound     | username (validated regex), email (EmailStr), password (min 8 chars) |
| LoginRequest          | → Inbound     | username, password - plain strings, no extra validation              |
| RefreshRequest        | → Inbound     | refresh_token - the string from the previous login response          |
| ChangePasswordRequest | → Inbound     | current_password, new_password (min 8 chars)                         |
| TokenResponse         | ← Outbound    | access_token, refresh_token, token_type='bearer'                     |
| AccessTokenResponse   | ← Outbound    | access_token only (used by /refresh endpoint)                        |
| UserResponse          | ← Outbound    | id, username, email, is_active - hashed_password is NOT included     |
| MessageResponse       | ← Outbound    | Single message: str field for success confirmations                  |

The model_config = {"from_attributes": True} on UserResponse tells Pydantic to read attributes from a SQLAlchemy model object (ORM mode), so you can pass a User row directly instead of manually converting to a dict.

## **2.5 hashing.py - Password Hashing**

Uses passlib with the **bcrypt** algorithm. Bcrypt is deliberately slow and includes a random salt - this means:

- The same password produces a different hash every time
- Brute-force attacks are computationally expensive
- Rainbow table attacks don't work (because of the salt)

hash_password('mypassword123') # -> '\$2b\$12\$...' (60 chars, includes salt)

verify_password('mypassword123', stored_hash) # -> True / False

\# verify_password is timing-safe - it won't leak info via response time

**Never store plain text passwords.** Even if your database is breached, attackers only get bcrypt hashes. Cracking a single bcrypt hash at cost factor 12 takes ~0.3 seconds per guess on a GPU - effectively infeasible for long passwords.

## **2.6 jwt.py - Token Creation & Decoding**

Uses python-jose to create and verify JWTs. A JWT has three parts separated by dots: **Header.Payload.Signature**.

\# JWT payload structure (what's inside the token)

{

"sub": "prateek", # subject - the username

"type": "access", # "access" or "refresh"

"exp": 1748000000, # Unix timestamp: when it expires

"iat": 1747996400 # Unix timestamp: when it was issued

}

The type claim is the key defence preventing a refresh token from being used where an access token is expected:

- decode_token() is called first in dependencies.py
- The type field is checked - if it's not 'access', the request is rejected with 401
- Refresh tokens are only accepted at the /auth/refresh endpoint

### **Token Lifecycle**

| **Function**                   | **What it does**                                                                                       |
| ------------------------------ | ------------------------------------------------------------------------------------------------------ |
| create_access_token(username)  | Creates a JWT signed with SECRET_KEY, type='access', expiry = now + 30 min                             |
| create_refresh_token(username) | Creates a JWT signed with SECRET_KEY, type='refresh', expiry = now + 7 days                            |
| decode_token(token)            | Verifies the signature, checks expiry, returns the payload dict. Raises JWTError if anything is wrong. |

## **2.7 dependencies.py - FastAPI Authentication Guards**

This file defines **injectable dependencies** - functions that FastAPI automatically calls and resolves before running a route handler.

Two dependencies are provided:

### **get_current_user**

def get_current_user(token=Depends(oauth2_scheme), db=Depends(get_db)) -> User:

\# 1. OAuth2PasswordBearer extracts the token from the

\# 'Authorization: Bearer &lt;token&gt;' header automatically

\# 2. decode_token() verifies signature + expiry

\# 3. Checks payload type == 'access'

\# 4. Reads the 'sub' claim to get the username

\# 5. Queries the DB to confirm the user still exists

\# 6. Returns the User ORM object - or raises 401

### **get_current_active_user**

A thin wrapper around get_current_user that also checks user.is_active. Use this in routes where deactivated accounts must be blocked. Use get_current_user directly if you need to allow inactive users through (e.g., a reactivation endpoint).

Usage in a route handler:

@router.get('/me')

def me(current_user: User = Depends(get_current_active_user)):

return current_user # FastAPI resolved and validated user before this ran

## **2.8 router.py - Route Handlers**

All /auth/\* endpoints live here. The router uses the prefix /auth and the tag Auth (shown in the Swagger UI). Adding the router to main.py is a single line: app.include_router(auth_router).

| **Method** | **Path**          | **What it does**                                                                                           |
| ---------- | ----------------- | ---------------------------------------------------------------------------------------------------------- |
| POST       | /auth/register    | Validates uniqueness of username+email, hashes the password, inserts User row. Returns UserResponse (201). |
| POST       | /auth/login       | Verifies password with verify_password(), checks is_active, returns access+refresh tokens.                 |
| POST       | /auth/refresh     | Validates the refresh token (type must be 'refresh'), returns a new access token.                          |
| GET        | /auth/me          | Protected. Returns the current user's profile via get_current_active_user.                                 |
| PUT        | /auth/me/password | Protected. Verifies current password before updating to the new hash.                                      |
| DELETE     | /auth/me          | Protected. Sets is_active=False. The user row is preserved in the DB.                                      |

## **2.9 main.py - Application Entry Point**

Ties everything together. It creates the FastAPI app, registers the auth router, and creates database tables on startup using the lifespan context manager.

@asynccontextmanager

async def lifespan(app):

Base.metadata.create_all(bind=engine) # CREATE TABLE IF NOT EXISTS

yield # app runs here

\# (teardown code goes after yield)

app = FastAPI(lifespan=lifespan)

app.include_router(auth_router) # registers all /auth/\* routes

**Production migration note:** Base.metadata.create_all is fine for development. In production, use Alembic to manage schema migrations - it tracks what's been applied and supports rollbacks.

# **3\. Component Communication Map**

This section shows exactly how data flows between components for each major operation. Understanding this will let you quickly find where to make changes.

## **3.1 Registration Flow**

Client → POST /auth/register {username, email, password}

│

└─► router.py (register function)

│

├─► schemas.py (RegisterRequest validates input)

│ └── field_validator: username regex, password min length

│

├─► database.py (get_db injects db session)

│

├─► models.py (queries User by username, then by email)

│ └── 409 Conflict if either exists

│

├─► hashing.py hash_password(password)

│

└─► models.py (creates new User row, db.commit)

│

└─► schemas.py (UserResponse serialises output)

│

└─► Client ← 201 {id, username, email, is_active}

## **3.2 Login Flow**

Client → POST /auth/login {username, password}

│

└─► router.py (login function)

│

├─► schemas.py (LoginRequest - basic validation only)

│

├─► database.py (get_db session)

│

├─► models.py (SELECT \* FROM users WHERE username = ?)

│ └── 401 if user not found

│

├─► hashing.py verify_password(plain, hashed)

│ └── 401 if mismatch

│

├─► 403 if user.is_active == False

│

├─► jwt.py create_access_token(username)

├─► jwt.py create_refresh_token(username)

│ └── both read SECRET_KEY from config.py

│

└─► schemas.py (TokenResponse)

└─► Client ← 200 {access_token, refresh_token, token_type}

## **3.3 Authenticated Request Flow (e.g. GET /auth/me)**

Client → GET /auth/me

Header: Authorization: Bearer &lt;access_token&gt;

│

└─► FastAPI dependency resolution (before route handler runs)

│

├─► dependencies.py get_current_active_user

│ │

│ └─► get_current_user

│ │

│ ├─► OAuth2PasswordBearer extracts token from header

│ │

│ ├─► jwt.py decode_token(token)

│ │ ├── verifies signature (uses config.py SECRET_KEY)

│ │ ├── checks expiry (exp claim)

│ │ └── 401 if invalid/expired

│ │

│ ├─► checks payload\['type'\] == 'access' → 401 if not

│ │

│ ├─► database.py (get_db session)

│ │

│ └─► models.py (SELECT user WHERE username = sub)

│ └── 401 if not found

│

└─► checks user.is_active → 403 if False

│

└─► router.py me(current_user) - user already resolved and validated

│

└─► schemas.py (UserResponse)

└─► Client ← 200 {id, username, email, is_active}

## **3.4 Token Refresh Flow**

Client → POST /auth/refresh {refresh_token: '...'}

│

└─► router.py (refresh function)

│

├─► schemas.py (RefreshRequest)

│

├─► jwt.py decode_token(refresh_token)

│ ├── verifies signature and expiry

│ ├── checks payload\['type'\] == 'refresh' → 401 if 'access'

│ └── extracts username from 'sub'

│

├─► database.py (get_db session)

├─► models.py (confirms user exists + is_active)

│

└─► jwt.py create_access_token(username)

└─► schemas.py (AccessTokenResponse)

└─► Client ← 200 {access_token, token_type}

# **4\. Import Dependency Graph**

The direction of arrows shows who imports whom. Files lower in the tree are more fundamental and have no knowledge of the layers above.

main.py

├── auth.database (engine, Base)

├── auth.models (Base - for create_all)

└── auth.router (auth_router)

auth/router.py

├── auth.database (get_db)

├── auth.dependencies (get_current_active_user)

├── auth.hashing (hash_password, verify_password)

├── auth.jwt (create_access_token, create_refresh_token, decode_token)

├── auth.models (User)

└── auth.schemas (all request/response schemas)

auth/dependencies.py

├── auth.database (get_db)

├── auth.jwt (decode_token)

└── auth.models (User)

auth/jwt.py

└── auth.config (auth_settings)

auth/hashing.py - no auth imports (standalone)

auth/schemas.py - no auth imports (standalone)

auth/models.py - no auth imports (standalone)

auth/database.py - imports auth.models (for Base)

auth/config.py - no auth imports (standalone)

**Key principle:** config, models, schemas, and hashing are leaf nodes - they import nothing from the auth package. This makes them easy to test in isolation. jwt imports only config. dependencies imports jwt, database, and models. router imports everything.

# **5\. HTTP Error Reference**

| **Code** | **Where raised**        | **Reason**                                                               |
| -------- | ----------------------- | ------------------------------------------------------------------------ |
| 400      | change_password         | current_password doesn't match the stored hash                           |
| 401      | login                   | Username not found OR password mismatch                                  |
| 401      | get_current_user        | Token missing, expired, tampered, or wrong type                          |
| 401      | refresh                 | Refresh token invalid, expired, or type is not 'refresh'                 |
| 403      | login                   | User exists but is_active = False                                        |
| 403      | get_current_active_user | User exists but is_active = False                                        |
| 409      | register                | Username or email already in the database                                |
| 422      | any endpoint            | Pydantic validation failed (wrong types, missing fields, regex mismatch) |

# **6\. Running & Extending the System**

## **6.1 Running Locally**

\# 1. Install dependencies

pip install -r requirements.txt

\# 2. Set environment variables

cp .env.example .env

\# Edit .env - at minimum change SECRET_KEY

\# 3. Start the server

uvicorn main:app --reload

\# 4. Open Swagger UI

\# <http://localhost:8000/docs>

## **6.2 Protecting Your Own Routes**

Import the dependency and add it as a parameter:

from auth.dependencies import get_current_active_user

from auth.models import User

from fastapi import APIRouter, Depends

router = APIRouter()

@router.get('/posts')

def get_my_posts(current_user: User = Depends(get_current_active_user)):

\# current_user is a fully-loaded User ORM object

return {'user_id': current_user.id, 'posts': \[\]}

## **6.3 Switching to PostgreSQL**

\# In auth/database.py, change one line:

DATABASE_URL = "postgresql+psycopg2://user:password@localhost:5432/mydb"

\# Add the driver:

pip install psycopg2-binary

\# Also remove the connect_args dict - it's SQLite-only

## **6.4 Production Checklist**

- Replace SECRET_KEY with openssl rand -hex 32 output
- Switch DATABASE_URL to PostgreSQL or MySQL
- Use Alembic instead of create_all() for schema migrations
- Run uvicorn behind a reverse proxy (nginx / Caddy)
- Add HTTPS - JWTs sent over HTTP can be intercepted
- Store tokens in httpOnly cookies instead of localStorage to prevent XSS
- Consider token revocation via a Redis blocklist for refresh tokens
- Add rate limiting to /auth/login to prevent brute-force attacks