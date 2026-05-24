"""
Realistic test corpus for CogniVault RAG pipeline tests.
Each entry simulates a knowledge document the system would ingest.
"""

SAMPLE_DOCUMENTS = {
    "python_basics.txt": """\
Python is a high-level, general-purpose programming language. Its design
philosophy emphasizes code readability with the use of significant
indentation. Python is dynamically typed and garbage-collected. It supports
multiple programming paradigms, including structured, object-oriented, and
functional programming.

Python was conceived in the late 1980s by Guido van Rossum at Centrum
Wiskunde & Informatica in the Netherlands. It was first released in 1991 as
Python 0.9.0. Python 2.0 was released in 2000, introducing list
comprehensions and a garbage collection system. Python 3.0, released in 2008,
was a major revision not completely backward-compatible with earlier versions.

Popular Python frameworks include Django for web development, Flask for
lightweight APIs, FastAPI for high-performance async services, and Pandas for
data analysis. The Python Package Index (PyPI) hosts over 400,000 packages.
""",

    "machine_learning.md": """\
# Machine Learning Overview

Machine learning (ML) is a subset of artificial intelligence that enables
systems to learn and improve from experience without being explicitly
programmed. ML focuses on developing algorithms that can access data, learn
from it, and make predictions or decisions.

## Types of Machine Learning

### Supervised Learning
The model is trained on labeled data. Common algorithms include linear
regression, logistic regression, support vector machines, and neural networks.
Applications: image classification, spam detection, price prediction.

### Unsupervised Learning
The model finds patterns in unlabeled data. Techniques include k-means
clustering, hierarchical clustering, principal component analysis (PCA), and
autoencoders. Applications: customer segmentation, anomaly detection.

### Reinforcement Learning
An agent learns by interacting with an environment and receiving rewards or
penalties. Key algorithms: Q-learning, SARSA, policy gradient methods.
Applications: game playing, robotics, autonomous driving.

## Popular ML Libraries
- scikit-learn: classical ML algorithms
- TensorFlow: deep learning framework by Google
- PyTorch: deep learning framework by Meta
- XGBoost: gradient boosting library
""",

    "databases.txt": """\
A database is an organized collection of structured information or data,
typically stored electronically in a computer system. Databases are managed
by database management systems (DBMS).

Relational databases use structured query language (SQL) for defining and
manipulating data. Examples include PostgreSQL, MySQL, SQLite, and Oracle.
They organize data into tables with rows and columns, enforcing schemas and
relationships through foreign keys.

NoSQL databases provide flexible schemas and horizontal scaling. Categories
include document stores (MongoDB, CouchDB), key-value stores (Redis,
DynamoDB), column-family stores (Cassandra, HBase), and graph databases
(Neo4j, ArangoDB).

Vector databases are optimized for storing and querying high-dimensional
vector embeddings. Popular options include Pinecone, Weaviate, Milvus,
Qdrant, and Chroma. They support approximate nearest neighbor (ANN) search
algorithms like HNSW and IVF, which are essential for retrieval-augmented
generation (RAG) pipelines.
""",

    "web_development.md": """\
# Web Development Guide

## Frontend
Frontend development involves building the user-facing part of web
applications. Core technologies:

- **HTML5**: Semantic markup, accessibility, canvas, WebSockets
- **CSS3**: Flexbox, Grid, custom properties, animations
- **JavaScript/TypeScript**: DOM manipulation, async/await, modules

### Popular Frameworks
- React: Component-based UI library by Meta
- Vue.js: Progressive framework with gentle learning curve
- Angular: Full-featured framework by Google
- Svelte: Compile-time framework with no virtual DOM

## Backend
Backend development handles server-side logic, databases, and APIs.

### Languages and Frameworks
- **Node.js**: Express, NestJS, Fastify
- **Python**: Django, Flask, FastAPI
- **Go**: Gin, Echo, Fiber
- **Rust**: Actix-web, Axum, Rocket

## REST API Design
RESTful APIs follow these principles:
1. Use nouns for resource URLs (/users, /orders)
2. Use HTTP methods (GET, POST, PUT, DELETE)
3. Return appropriate status codes (200, 201, 404, 500)
4. Version your API (/api/v1/users)
5. Use pagination for large collections
""",

    "small.txt": "Short document for edge case testing.",
}


# Expected chunks from python_basics.txt with default chunk_size=400, overlap=80
# (used to validate chunker output without running the actual splitter)
PYTHON_BASICS_EXPECTED_MIN_CHUNKS = 2

# Queries and expected relevant sources for retrieval tests
RETRIEVAL_TEST_CASES = [
    {
        "query": "What is Python programming language?",
        "expected_source": "python_basics.txt",
    },
    {
        "query": "How does supervised learning work in machine learning?",
        "expected_source": "machine_learning.md",
    },
    {
        "query": "What are vector databases used for?",
        "expected_source": "databases.txt",
    },
    {
        "query": "How to build a REST API?",
        "expected_source": "web_development.md",
    },
]
