---
layout: default
title: Notes
---

<div class="hero">
  <h1>📚 Notes</h1>
  <p class="sub">
    Visual technical reference and quick-revision guide covering Backend Engineering, Cloud Infrastructure, DevOps Pipelines, and Data Engineering. Each topic includes architecture flowcharts, core concepts, cheat sheets, and production code examples.
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

## ⚡ How All 10 Topics Connect (End-to-End Flow)

<div class="diagram">
<div class="diagram-label">end-to-end software & data engineering lifecycle</div>
<div class="mermaid">
flowchart LR
    G["1. Git\nSource Control & Branching"] --> C["2. Java & Python\nApplication & ETL Code"]
    C --> J["3. Jenkins & CI/CD\nAutomated Build, Test & Scan"]
    J --> D["4. Docker\nContainer Packaging"]
    D --> A["5. AWS Cloud\nEC2, ECS, S3, RDS, Lambda"]
    A --> AF["6. Apache Airflow\nDAG Workflow Orchestration"]
    AF --> DE["7. Data Engineering & SQL\nMedallion Lakehouse & Analytics"]
</div>
</div>

---

## 🗂️ Topics

<div class="tg">

  <a href="{{ site.baseurl }}/sql.html" class="tc">
    <span class="tc-status s-done">✓ Complete</span>
    <div class="tc-stripe" style="background:linear-gradient(90deg,#3B82F6,#06B6D4)"></div>
    <div class="tc-icon">🗄️</div>
    <div class="tc-title">1. SQL</div>
    <div class="tc-desc">
      Complete relational database reference covering DDL/DML/DQL/DCL/TCL commands, logical query execution order, all JOIN types, CTEs & recursive queries, Window Functions (ROW_NUMBER, RANK, DENSE_RANK, LAG/LEAD), B-Tree & covering indexes, ACID transactions, isolation levels, and database normalization (1NF to BCNF).
    </div>
    <div class="tc-tags">
      <span class="tc-tag">DDL/DML</span><span class="tc-tag">Joins</span><span class="tc-tag">Window Functions</span><span class="tc-tag">ACID</span><span class="tc-tag">Indexes</span>
    </div>
  </a>

  <a href="{{ site.baseurl }}/java.html" class="tc">
    <span class="tc-status s-done">✓ Complete</span>
    <div class="tc-stripe" style="background:linear-gradient(90deg,#F97316,#F59E0B)"></div>
    <div class="tc-icon">☕</div>
    <div class="tc-title">2. Java</div>
    <div class="tc-desc">
      Deep dive into JVM architecture (ClassLoader, Heap generations, Stack, Metaspace, JIT, Garbage Collection), the four OOP pillars, Collections Framework hierarchy & complexity (List, Set, Queue, Map, ConcurrentHashMap), Exception handling, Multithreading (ExecutorService, CompletableFuture, synchronized, volatile), and the Java Stream API.
    </div>
    <div class="tc-tags">
      <span class="tc-tag">JVM</span><span class="tc-tag">OOP</span><span class="tc-tag">Collections</span><span class="tc-tag">Threads</span><span class="tc-tag">Streams</span>
    </div>
  </a>

  <a href="{{ site.baseurl }}/aws.html" class="tc">
    <span class="tc-status s-done">✓ Complete</span>
    <div class="tc-stripe" style="background:linear-gradient(90deg,#F59E0B,#EF4444)"></div>
    <div class="tc-icon">☁️</div>
    <div class="tc-title">3. AWS</div>
    <div class="tc-desc">
      High-level architectural guide across all major AWS categories: Compute (EC2, Lambda, ECS, EKS, Fargate), Storage (S3 tiers, EBS, EFS, Glacier), Databases (RDS Multi-AZ, Aurora, DynamoDB, Redshift, ElastiCache), Networking (VPC, Subnets, Route 53, CloudFront, ALB/NLB), Security (IAM Roles/Policies, KMS, WAF), Messaging (SQS, SNS, Kinesis), and Analytics (Glue, Athena, EMR).
    </div>
    <div class="tc-tags">
      <span class="tc-tag">EC2 & ECS</span><span class="tc-tag">S3</span><span class="tc-tag">RDS</span><span class="tc-tag">VPC</span><span class="tc-tag">IAM</span>
    </div>
  </a>

  <a href="{{ site.baseurl }}/docker.html" class="tc">
    <span class="tc-status s-done">✓ Complete</span>
    <div class="tc-stripe" style="background:linear-gradient(90deg,#06B6D4,#3B82F6)"></div>
    <div class="tc-icon">🐳</div>
    <div class="tc-title">4. Docker</div>
    <div class="tc-desc">
      Containerization fundamentals explaining OS kernel virtualization (cgroups and namespaces vs Virtual Machines), image layer caching, multi-stage Dockerfile builds, ENTRYPOINT vs CMD, persistent storage (volumes vs bind mounts), container networking modes (bridge, host, overlay), and multi-container orchestration with Docker Compose.
    </div>
    <div class="tc-tags">
      <span class="tc-tag">Dockerfile</span><span class="tc-tag">Containers</span><span class="tc-tag">Volumes</span><span class="tc-tag">Compose</span>
    </div>
  </a>

  <a href="{{ site.baseurl }}/cicd.html" class="tc">
    <span class="tc-status s-done">✓ Complete</span>
    <div class="tc-stripe" style="background:linear-gradient(90deg,#10B981,#06B6D4)"></div>
    <div class="tc-icon">🔄</div>
    <div class="tc-title">5. CI / CD</div>
    <div class="tc-desc">
      End-to-end delivery lifecycle comparing Continuous Integration, Continuous Delivery, and Continuous Deployment. Covers DORA metrics, pipeline verification stages (unit tests, SonarQube static analysis, SAST security scans, artifact publishing), GitHub Actions workflows, and production rollout strategies (Blue/Green, Canary, Rolling, Recreate).
    </div>
    <div class="tc-tags">
      <span class="tc-tag">Pipelines</span><span class="tc-tag">GitHub Actions</span><span class="tc-tag">Blue/Green</span><span class="tc-tag">Canary</span>
    </div>
  </a>

  <a href="{{ site.baseurl }}/jenkins.html" class="tc">
    <span class="tc-status s-done">✓ Complete</span>
    <div class="tc-stripe" style="background:linear-gradient(90deg,#EF4444,#F97316)"></div>
    <div class="tc-icon">⚙️</div>
    <div class="tc-title">6. Jenkins</div>
    <div class="tc-desc">
      Enterprise build automation covering Jenkins Controller & distributed Worker Agent architecture, Declarative vs Scripted pipelines, complete production Jenkinsfile syntax (triggers, credentials binding, parallel test stages, Docker ECR push, manual approval gates, post-build Slack notifications), essential plugins, and reusable Groovy Shared Libraries.
    </div>
    <div class="tc-tags">
      <span class="tc-tag">Jenkinsfile</span><span class="tc-tag">Declarative</span><span class="tc-tag">Agents</span><span class="tc-tag">Shared Libs</span>
    </div>
  </a>

  <a href="{{ site.baseurl }}/python.html" class="tc">
    <span class="tc-status s-done">✓ Complete</span>
    <div class="tc-stripe" style="background:linear-gradient(90deg,#3B82F6,#8B5CF6)"></div>
    <div class="tc-icon">🐍</div>
    <div class="tc-title">7. Python</div>
    <div class="tc-desc">
      Python for backend and data engineering: mutable vs immutable core types, comprehensions, OOP with Abstract Base Classes & dataclasses, functional programming (decorators with functools.wraps, retry patterns), memory-efficient Generators & Iterators for large files, Asyncio event loops vs Threading vs Multiprocessing (GIL), and Pandas/Polars data manipulation.
    </div>
    <div class="tc-tags">
      <span class="tc-tag">OOP</span><span class="tc-tag">Decorators</span><span class="tc-tag">Generators</span><span class="tc-tag">Asyncio</span><span class="tc-tag">Pandas</span>
    </div>
  </a>

  <a href="{{ site.baseurl }}/airflow.html" class="tc">
    <span class="tc-status s-done">✓ Complete</span>
    <div class="tc-stripe" style="background:linear-gradient(90deg,#8B5CF6,#EC4899)"></div>
    <div class="tc-icon">🌊</div>
    <div class="tc-title">8. Apache Airflow</div>
    <div class="tc-desc">
      Workflow orchestration architecture (Webserver, Scheduler, Executor, Metadata DB, Workers), Directed Acyclic Graph (DAG) concepts, logical_date vs execution intervals, Core & Provider Operators, Sensors, Hooks, modern @task TaskFlow API, XCom data-passing rules, Executor comparison (Local, Celery, Kubernetes), and idempotent pipeline design.
    </div>
    <div class="tc-tags">
      <span class="tc-tag">DAGs</span><span class="tc-tag">Operators</span><span class="tc-tag">TaskFlow</span><span class="tc-tag">XCom</span><span class="tc-tag">Executors</span>
    </div>
  </a>

  <a href="{{ site.baseurl }}/data-engineer.html" class="tc">
    <span class="tc-status s-done">✓ Complete</span>
    <div class="tc-stripe" style="background:linear-gradient(90deg,#EC4899,#F97316)"></div>
    <div class="tc-icon">📊</div>
    <div class="tc-title">9. Data Engineer</div>
    <div class="tc-desc">
      Modern data platform design covering ingestion to serving layers, ETL vs ELT trade-offs, Data Lake vs Data Warehouse vs Lakehouse (Delta Lake, Iceberg), Batch vs Stream processing, storage formats (Parquet, Avro, ORC, CSV, JSON), PySpark distributed architecture (RDDs, DataFrames, shuffles, broadcast joins), dbt incremental models, and Medallion Architecture (Bronze, Silver, Gold).
    </div>
    <div class="tc-tags">
      <span class="tc-tag">ETL/ELT</span><span class="tc-tag">Medallion</span><span class="tc-tag">PySpark</span><span class="tc-tag">dbt</span><span class="tc-tag">Parquet</span>
    </div>
  </a>

  <a href="{{ site.baseurl }}/git.html" class="tc">
    <span class="tc-status s-done">✓ Complete</span>
    <div class="tc-stripe" style="background:linear-gradient(90deg,#F59E0B,#10B981)"></div>
    <div class="tc-icon">🔀</div>
    <div class="tc-title">10. Git</div>
    <div class="tc-desc">
      Version control internals and team workflows covering the three-tree architecture (Working Directory, Staging Index, Repository), branching strategies (Git Flow vs Trunk-Based Development), Git Merge vs Interactive Rebase, cherry-picking hotfixes, stashing, undoing changes (reset, revert, checkout), Git hooks, and binary bug hunting with git bisect.
    </div>
    <div class="tc-tags">
      <span class="tc-tag">Branching</span><span class="tc-tag">Rebase vs Merge</span><span class="tc-tag">Cherry-Pick</span><span class="tc-tag">Reset/Revert</span>
    </div>
  </a>

</div>

---

## 📖 Quick Topic Summary Table

<div class="tw">
<table>
  <thead>
    <tr>
      <th>#</th>
      <th>Topic</th>
      <th>Primary Role in Architecture</th>
      <th>Key Subtopics Covered</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>1</strong></td>
      <td><a href="{{ site.baseurl }}/sql.html" style="color:var(--accent)">SQL</a></td>
      <td>Querying, indexing, and transactional data integrity</td>
      <td>Execution order, Joins, Window Functions, B-Tree Indexes, ACID, 1NF–BCNF</td>
    </tr>
    <tr>
      <td><strong>2</strong></td>
      <td><a href="{{ site.baseurl }}/java.html" style="color:var(--accent)">Java</a></td>
      <td>High-performance backend services & concurrent processing</td>
      <td>JVM Memory & GC, OOP, Collections, ExecutorService, CompletableFuture, Streams</td>
    </tr>
    <tr>
      <td><strong>3</strong></td>
      <td><a href="{{ site.baseurl }}/aws.html" style="color:var(--accent)">AWS</a></td>
      <td>Cloud compute, storage, networking, and managed data services</td>
      <td>EC2, Lambda, ECS, S3, RDS, Aurora, DynamoDB, VPC, IAM, SQS/SNS, Glue, Redshift</td>
    </tr>
    <tr>
      <td><strong>4</strong></td>
      <td><a href="{{ site.baseurl }}/docker.html" style="color:var(--accent)">Docker</a></td>
      <td>Immutable application packaging and isolated runtime environments</td>
      <td>Images vs Containers, Multi-stage Dockerfile, Volumes, Bridge Networks, Compose</td>
    </tr>
    <tr>
      <td><strong>5</strong></td>
      <td><a href="{{ site.baseurl }}/cicd.html" style="color:var(--accent)">CI / CD</a></td>
      <td>Automated code verification, security scanning, and zero-downtime release</td>
      <td>CI vs CD, DORA metrics, Quality Gates, GitHub Actions, Blue/Green & Canary deploys</td>
    </tr>
    <tr>
      <td><strong>6</strong></td>
      <td><a href="{{ site.baseurl }}/jenkins.html" style="color:var(--accent)">Jenkins</a></td>
      <td>Self-hosted enterprise pipeline orchestration</td>
      <td>Controller/Agent architecture, Declarative Jenkinsfile, Docker agents, Shared Libraries</td>
    </tr>
    <tr>
      <td><strong>7</strong></td>
      <td><a href="{{ site.baseurl }}/python.html" style="color:var(--accent)">Python</a></td>
      <td>Data transformation, automation scripting, and async APIs</td>
      <td>Data types, Dataclasses, Decorators, Generators, Asyncio, Pandas, PySpark, boto3</td>
    </tr>
    <tr>
      <td><strong>8</strong></td>
      <td><a href="{{ site.baseurl }}/airflow.html" style="color:var(--accent)">Apache Airflow</a></td>
      <td>Dependency-driven scheduling and monitoring of batch workflows</td>
      <td>DAGs, Operators, Sensors, Hooks, TaskFlow API, XCom rules, Celery & K8s Executors</td>
    </tr>
    <tr>
      <td><strong>9</strong></td>
      <td><a href="{{ site.baseurl }}/data-engineer.html" style="color:var(--accent)">Data Engineer</a></td>
      <td>End-to-end data pipelines, lakehouses, and analytical modeling</td>
      <td>ETL vs ELT, Data Lakehouse, Batch vs Stream, Parquet/Avro, Spark, dbt, Medallion layers</td>
    </tr>
    <tr>
      <td><strong>10</strong></td>
      <td><a href="{{ site.baseurl }}/git.html" style="color:var(--accent)">Git</a></td>
      <td>Distributed source code management and release branching</td>
      <td>Git internals, Merge vs Rebase, Cherry-pick, Stash, Reset vs Revert, Git Hooks</td>
    </tr>
  </tbody>
</table>
</div>
