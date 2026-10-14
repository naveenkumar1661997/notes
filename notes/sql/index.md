---
layout: default
title: Notes
---

<div class="hero">
  <h1>📚 Notes</h1>
  <p class="sub">
    Visual technical reference and quick-revision guide covering Backend Engineering, Cloud Infrastructure, DevOps Pipelines, and Data Engineering. Each topic includes architecture flowcharts, core concepts, cheat sheets, and code examples.
  </p>
  <div class="tags">
    <span class="tag">🗄️ SQL</span>
    <span class="tag">☕ Java</span>
    <span class="tag">☁️ AWS</span>
    <span class="tag">🐳 Docker</span>
    <span class="tag">🔄 CI/CD</span>
    <span class="tag">⚙️ Jenkins</span>
    <span class="tag">🐍 Python</span>
    <span class="tag">🌊 Airflow</span>
    <span class="tag">📊 Data Engineering</span>
    <span class="tag">🔀 Git</span>
  </div>
</div>

## ⚡ End-to-End Architecture Flow

<div class="diagram">
<div class="diagram-label">how all 10 topics connect in production</div>
<div class="mermaid">
flowchart LR
    G["1. Git<br/>Source Control & Branching"] --> C["2. Java & Python<br/>Application & ETL Code"]
    C --> J["3. Jenkins & CI/CD<br/>Automated Build, Test & Scan"]
    J --> D["4. Docker<br/>Container Packaging"]
    D --> A["5. AWS Cloud<br/>EC2, ECS, S3, RDS, Lambda"]
    A --> AF["6. Apache Airflow<br/>DAG Workflow Orchestration"]
    AF --> DE["7. Data Engineering & SQL<br/>Medallion Lakehouse & Analytics"]
</div>
</div>

---

## 🗂️ All Topics

<div class="tg">

  <a href="{{ site.baseurl }}/sql.html" class="tc">
    <span class="tc-status s-done">✓ Done</span>
    <div class="tc-stripe" style="background:linear-gradient(90deg,#3B82F6,#06B6D4)"></div>
    <div class="tc-icon">🗄️</div>
    <div class="tc-title">1. SQL</div>
    <div class="tc-desc">
      Command categories (DDL, DML, DQL, DCL, TCL), logical query execution order, all JOIN types, CTEs & recursive queries, Window Functions (ROW_NUMBER, RANK, DENSE_RANK, LAG, LEAD), B-Tree & covering indexes, ACID transactions, isolation levels, and normalization (1NF–BCNF).
    </div>
    <div class="tc-tags">
      <span class="tc-tag">DDL/DML</span><span class="tc-tag">Joins</span><span class="tc-tag">Window Functions</span><span class="tc-tag">ACID</span><span class="tc-tag">Indexes</span>
    </div>
  </a>

  <a href="{{ site.baseurl }}/java.html" class="tc">
    <span class="tc-status s-done">✓ Done</span>
    <div class="tc-stripe" style="background:linear-gradient(90deg,#F97316,#F59E0B)"></div>
    <div class="tc-icon">☕</div>
    <div class="tc-title">2. Java</div>
    <div class="tc-desc">
      JVM internals (ClassLoader, Heap areas, Stack, Metaspace, JIT, Garbage Collection), OOP pillars (Encapsulation, Abstraction, Inheritance, Polymorphism), Collections Framework & time complexity, Exception hierarchy, Multithreading (ExecutorService, CompletableFuture, synchronized, volatile), and Stream API.
    </div>
    <div class="tc-tags">
      <span class="tc-tag">OOP</span><span class="tc-tag">JVM</span><span class="tc-tag">Collections</span><span class="tc-tag">Threads</span><span class="tc-tag">Streams</span>
    </div>
  </a>

  <a href="{{ site.baseurl }}/aws.html" class="tc">
    <span class="tc-status s-done">✓ Done</span>
    <div class="tc-stripe" style="background:linear-gradient(90deg,#F59E0B,#EF4444)"></div>
    <div class="tc-icon">☁️</div>
    <div class="tc-title">3. AWS</div>
    <div class="tc-desc">
      High-level overview of all major AWS service categories: Compute (EC2, Lambda, ECS, EKS, Fargate), Storage (S3, EBS, EFS, Glacier), Database (RDS, Aurora, DynamoDB, Redshift, ElastiCache), Networking (VPC, Route 53, CloudFront, ALB/NLB), Security (IAM, KMS, Secrets Manager, WAF), Messaging (SQS, SNS, Kinesis), and Analytics (Glue, Athena, EMR).
    </div>
    <div class="tc-tags">
      <span class="tc-tag">EC2</span><span class="tc-tag">S3</span><span class="tc-tag">RDS</span><span class="tc-tag">Lambda</span><span class="tc-tag">VPC</span><span class="tc-tag">IAM</span>
    </div>
  </a>

  <a href="{{ site.baseurl }}/docker.html" class="tc">
    <span class="tc-status s-done">✓ Done</span>
    <div class="tc-stripe" style="background:linear-gradient(90deg,#06B6D4,#3B82F6)"></div>
    <div class="tc-icon">🐳</div>
    <div class="tc-title">4. Docker</div>
    <div class="tc-desc">
      Container architecture vs Virtual Machines, Docker images & layer caching, multi-stage Dockerfile best practices, ENTRYPOINT vs CMD, persistent storage with volumes & bind mounts, container networking (bridge, host, none), and multi-container setups with Docker Compose.
    </div>
    <div class="tc-tags">
      <span class="tc-tag">Image</span><span class="tc-tag">Container</span><span class="tc-tag">Volumes</span><span class="tc-tag">Compose</span>
    </div>
  </a>

  <a href="{{ site.baseurl }}/cicd.html" class="tc">
    <span class="tc-status s-done">✓ Done</span>
    <div class="tc-stripe" style="background:linear-gradient(90deg,#10B981,#06B6D4)"></div>
    <div class="tc-icon">🔄</div>
    <div class="tc-title">5. CI / CD</div>
    <div class="tc-desc">
      Continuous Integration vs Continuous Delivery vs Continuous Deployment, DORA metrics, pipeline stages (build, unit test, SonarQube static analysis, SAST security scan, artifact staging), CI/CD tools comparison, GitHub Actions workflow YAML, and deployment strategies (Blue/Green, Canary, Rolling, Recreate).
    </div>
    <div class="tc-tags">
      <span class="tc-tag">Pipeline</span><span class="tc-tag">GitHub Actions</span><span class="tc-tag">Blue/Green</span><span class="tc-tag">Canary</span>
    </div>
  </a>

  <a href="{{ site.baseurl }}/jenkins.html" class="tc">
    <span class="tc-status s-done">✓ Done</span>
    <div class="tc-stripe" style="background:linear-gradient(90deg,#EF4444,#F97316)"></div>
    <div class="tc-icon">⚙️</div>
    <div class="tc-title">6. Jenkins</div>
    <div class="tc-desc">
      Controller vs Worker Agent architecture, Declarative vs Scripted pipelines, end-to-end production Jenkinsfile (Docker agents, parallel test & SonarQube stages, AWS ECR image push, ECS deployment, manual approval gates, Slack alerts), essential plugins, and reusable Groovy Shared Libraries.
    </div>
    <div class="tc-tags">
      <span class="tc-tag">Jenkinsfile</span><span class="tc-tag">Stages</span><span class="tc-tag">Agents</span><span class="tc-tag">Shared Libs</span>
    </div>
  </a>

  <a href="{{ site.baseurl }}/python.html" class="tc">
    <span class="tc-status s-done">✓ Done</span>
    <div class="tc-stripe" style="background:linear-gradient(90deg,#3B82F6,#8B5CF6)"></div>
    <div class="tc-icon">🐍</div>
    <div class="tc-title">7. Python</div>
    <div class="tc-desc">
      Core mutable & immutable data types, list/dict/set comprehensions, OOP with Abstract Base Classes & dataclasses, decorators (timer, retry), lazy Generators & Iterators for large files, Async/Await event loops vs Threading vs Multiprocessing, Pandas transformations, and Data Engineering libraries (PySpark, SQLAlchemy, boto3, Polars, dbt).
    </div>
    <div class="tc-tags">
      <span class="tc-tag">OOP</span><span class="tc-tag">Decorators</span><span class="tc-tag">Generators</span><span class="tc-tag">Pandas</span><span class="tc-tag">Async</span>
    </div>
  </a>

  <a href="{{ site.baseurl }}/airflow.html" class="tc">
    <span class="tc-status s-done">✓ Done</span>
    <div class="tc-stripe" style="background:linear-gradient(90deg,#8B5CF6,#EC4899)"></div>
    <div class="tc-icon">🌊</div>
    <div class="tc-title">8. Apache Airflow</div>
    <div class="tc-desc">
      Airflow components (Webserver, Scheduler, Executor, Metadata DB, Workers), DAG concepts & logical_date, Operators, Sensors, and Hooks reference, modern @task TaskFlow API pipelines, XCom data-passing best practices, Executor types (Sequential, Local, Celery, Kubernetes), and idempotent DAG rules.
    </div>
    <div class="tc-tags">
      <span class="tc-tag">DAG</span><span class="tc-tag">Operators</span><span class="tc-tag">TaskFlow</span><span class="tc-tag">XCom</span><span class="tc-tag">Executors</span>
    </div>
  </a>

  <a href="{{ site.baseurl }}/data-engineer.html" class="tc">
    <span class="tc-status s-done">✓ Done</span>
    <div class="tc-stripe" style="background:linear-gradient(90deg,#EC4899,#F97316)"></div>
    <div class="tc-icon">📊</div>
    <div class="tc-title">9. Data Engineer</div>
    <div class="tc-desc">
      End-to-end data pipeline architecture, ETL vs ELT, Data Lake vs Data Warehouse vs Lakehouse (Delta Lake, Iceberg), Batch vs Streaming, file formats (Parquet, Avro, ORC, CSV, JSON), PySpark architecture & transformations, dbt staging-to-mart models, and Medallion Architecture (Bronze, Silver, Gold layers).
    </div>
    <div class="tc-tags">
      <span class="tc-tag">ETL/ELT</span><span class="tc-tag">Medallion</span><span class="tc-tag">Spark</span><span class="tc-tag">dbt</span><span class="tc-tag">Parquet</span>
    </div>
  </a>

  <a href="{{ site.baseurl }}/git.html" class="tc">
    <span class="tc-status s-done">✓ Done</span>
    <div class="tc-stripe" style="background:linear-gradient(90deg,#F59E0B,#10B981)"></div>
    <div class="tc-icon">🔀</div>
    <div class="tc-title">10. Git</div>
    <div class="tc-desc">
      Git architecture & object model, branching strategies (Git Flow, GitHub Flow, Trunk-Based), Merge vs Rebase workflows, cherry-picking commits, stashing work-in-progress, undoing changes (reset --soft/--mixed/--hard vs revert), Git hooks, and troubleshooting regressions.
    </div>
    <div class="tc-tags">
      <span class="tc-tag">Branching</span><span class="tc-tag">Rebase</span><span class="tc-tag">Cherry-Pick</span><span class="tc-tag">Git Flow</span>
    </div>
  </a>

</div>
