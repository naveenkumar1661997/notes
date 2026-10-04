---
title: AWS
---

<div class="hero">
  <h1>☁️ AWS — All Core Services</h1>
  <p class="sub">High-level overview of every major AWS service category — compute, storage, database, networking, security, analytics, and more.</p>
  <div class="tags">
    <span class="tag">EC2</span><span class="tag">S3</span><span class="tag">Lambda</span><span class="tag">RDS</span>
    <span class="tag">VPC</span><span class="tag">IAM</span><span class="tag">Kinesis</span><span class="tag">Glue</span>
  </div>
</div>

<div class="toc">
  <div class="toc-h">Categories</div>
  <ol>
    <li><a href="#overview">Services Overview Diagram</a></li>
    <li><a href="#compute">Compute</a></li>
    <li><a href="#storage">Storage</a></li>
    <li><a href="#database">Database</a></li>
    <li><a href="#networking">Networking & CDN</a></li>
    <li><a href="#security">Security & IAM</a></li>
    <li><a href="#messaging">Messaging & Streaming</a></li>
    <li><a href="#analytics">Analytics & Data</a></li>
    <li><a href="#devops">DevOps & Monitoring</a></li>
    <li><a href="#patterns">Common Patterns</a></li>
  </ol>
</div>

---

## AWS Services Overview {#overview}

<div class="diagram">
<div class="diagram-label">flowchart — all major AWS service categories</div>
<div class="mermaid">
flowchart TD
    AWS["☁️ Amazon Web Services"]

    AWS --> COMPUTE["🖥️ COMPUTE\nEC2 · Lambda · ECS · EKS\nFargate · Elastic Beanstalk · Batch"]
    AWS --> STORAGE["💾 STORAGE\nS3 · EBS · EFS\nGlacier · Storage Gateway"]
    AWS --> DATABASE["🗄️ DATABASE\nRDS · Aurora · DynamoDB\nRedshift · ElastiCache · DocumentDB"]
    AWS --> NETWORK["🌐 NETWORKING\nVPC · Route 53 · CloudFront\nALB · NLB · API Gateway · Direct Connect"]
    AWS --> SECURITY["🔒 SECURITY\nIAM · Cognito · KMS · WAF\nShield · Secrets Manager · GuardDuty"]
    AWS --> MESSAGING["📨 MESSAGING\nSQS · SNS · EventBridge\nKinesis · MSK (Kafka)"]
    AWS --> ANALYTICS["📊 ANALYTICS\nGlue · Athena · EMR · Redshift\nKinesis Analytics · Lake Formation · QuickSight"]
    AWS --> DEVOPS["⚙️ DEVOPS\nCodePipeline · CodeBuild · CodeDeploy\nCloudFormation · CDK · ECR"]
    AWS --> MONITOR["📈 MONITORING\nCloudWatch · X-Ray · CloudTrail\nConfig · Trusted Advisor"]
    AWS --> AI["🤖 AI/ML\nSageMaker · Rekognition\nComprehend · Textract · Bedrock"]
</div>
</div>

---

## Compute {#compute}

<div class="aws-g">
  <div class="aws-card">
    <div class="aws-head">🖥️ EC2</div>
    <div class="aws-items">
      Virtual machines in the cloud.<br/>
      <strong>Instance types:</strong> t3 (general), c6 (compute), r6 (memory), p3 (GPU)<br/>
      <strong>Pricing:</strong> On-Demand, Reserved (1-3yr), Spot (up to 90% off)<br/>
      <strong>Key:</strong> Security Groups, Key Pairs, AMIs, User Data
    </div>
  </div>
  <div class="aws-card">
    <div class="aws-head">⚡ Lambda</div>
    <div class="aws-items">
      Serverless — run code without managing servers.<br/>
      <strong>Triggers:</strong> API Gateway, S3 events, SQS, EventBridge, DynamoDB Streams<br/>
      <strong>Limits:</strong> 15 min timeout, 10 GB RAM, 1000 concurrent (default)<br/>
      <strong>Key:</strong> Pay per invocation + duration
    </div>
  </div>
  <div class="aws-card">
    <div class="aws-head">🐳 ECS / EKS / Fargate</div>
    <div class="aws-items">
      Container orchestration.<br/>
      <strong>ECS:</strong> AWS-native container service<br/>
      <strong>EKS:</strong> Managed Kubernetes<br/>
      <strong>Fargate:</strong> Serverless containers (no EC2 management)<br/>
      <strong>ECR:</strong> Private container registry
    </div>
  </div>
  <div class="aws-card">
    <div class="aws-head">🌱 Elastic Beanstalk</div>
    <div class="aws-items">
      PaaS — deploy app without managing infra.<br/>
      Supports Java, Python, Node, Go, Docker.<br/>
      Auto-provisions EC2, LB, ASG, RDS.
    </div>
  </div>
</div>

---

## Storage {#storage}

<div class="aws-g">
  <div class="aws-card">
    <div class="aws-head">🪣 S3</div>
    <div class="aws-items">
      Object storage. 99.999999999% durability.<br/>
      <strong>Classes:</strong> Standard → IA → One-Zone IA → Glacier → Deep Archive<br/>
      <strong>Key:</strong> Versioning, Lifecycle policies, ACLs, Pre-signed URLs, Static hosting<br/>
      <strong>Max object size:</strong> 5 TB (multipart upload for >5 GB)
    </div>
  </div>
  <div class="aws-card">
    <div class="aws-head">💿 EBS</div>
    <div class="aws-items">
      Block storage — attached to EC2 (one instance).<br/>
      <strong>Types:</strong> gp3 (SSD general), io2 (high IOPS), st1 (throughput HDD), sc1 (cold HDD)<br/>
      Persists independent of EC2 lifecycle.
    </div>
  </div>
  <div class="aws-card">
    <div class="aws-head">📂 EFS</div>
    <div class="aws-items">
      Elastic File System — shared NFS across multiple EC2.<br/>
      Auto-scales storage. Linux only.<br/>
      <strong>Use:</strong> Shared config, content management, ML training data
    </div>
  </div>
  <div class="aws-card">
    <div class="aws-head">🧊 Glacier</div>
    <div class="aws-items">
      Archival storage — very cheap, slow retrieval.<br/>
      <strong>Instant:</strong> milliseconds. <strong>Flexible:</strong> 1-12 hrs. <strong>Deep Archive:</strong> 12-48 hrs.<br/>
      <strong>Use:</strong> Compliance archives, logs, backups
    </div>
  </div>
</div>

---

## Database {#database}

<div class="tw">
<table>
  <thead><tr><th>Service</th><th>Type</th><th>Use Case</th><th>Key Feature</th></tr></thead>
  <tbody>
    <tr><td><strong>RDS</strong></td><td>Relational (MySQL, PostgreSQL, Oracle, SQL Server)</td><td>OLTP apps, structured data</td><td>Multi-AZ failover, Read Replicas, automated backups</td></tr>
    <tr><td><strong>Aurora</strong></td><td>MySQL/PostgreSQL compatible (AWS-built)</td><td>High-performance OLTP</td><td>5x faster than MySQL, auto-scales storage to 128TB</td></tr>
    <tr><td><strong>DynamoDB</strong></td><td>NoSQL key-value + document</td><td>Low-latency at scale, IoT, gaming</td><td>Single-digit ms, auto-scale, Global Tables, Streams</td></tr>
    <tr><td><strong>Redshift</strong></td><td>Columnar (OLAP data warehouse)</td><td>Analytics, BI queries on large data</td><td>Petabyte scale, Redshift Spectrum queries S3</td></tr>
    <tr><td><strong>ElastiCache</strong></td><td>In-memory (Redis / Memcached)</td><td>Caching, sessions, leaderboards</td><td>Sub-ms latency, pub/sub (Redis), cluster mode</td></tr>
    <tr><td><strong>DocumentDB</strong></td><td>Document (MongoDB-compatible)</td><td>JSON documents, CMS, catalog</td><td>MongoDB API compatible, managed</td></tr>
    <tr><td><strong>Neptune</strong></td><td>Graph database</td><td>Social networks, fraud detection, knowledge graphs</td><td>Supports Gremlin + SPARQL</td></tr>
  </tbody>
</table>
</div>

---

## Networking {#networking}

<div class="diagram">
<div class="mermaid">
flowchart TD
    Internet["🌍 Internet"] --> IGW["Internet Gateway\n(IGW)"]
    IGW --> VPC

    subgraph VPC["🔷 VPC (Virtual Private Cloud)"]
        subgraph PUB["Public Subnet"]
            ALB["ALB\nLoad Balancer"]
            NAT["NAT Gateway"]
        end
        subgraph PRI["Private Subnet"]
            EC2["EC2 Instances"]
            RDS2["RDS"]
        end
        ALB --> EC2
        EC2 --> RDS2
        EC2 -->|outbound| NAT
        NAT --> IGW
    end

    CF["CloudFront CDN"] --> ALB
    R53["Route 53\nDNS"] --> CF
</div>
</div>

<div class="tw">
<table>
  <thead><tr><th>Service</th><th>What it does</th></tr></thead>
  <tbody>
    <tr><td><strong>VPC</strong></td><td>Isolated virtual network. Contains subnets, route tables, security groups, NACLs</td></tr>
    <tr><td><strong>Security Group</strong></td><td>Stateful firewall at instance level — allow rules only</td></tr>
    <tr><td><strong>NACL</strong></td><td>Stateless firewall at subnet level — allow AND deny rules</td></tr>
    <tr><td><strong>Route 53</strong></td><td>DNS service + health checks + routing policies (Simple, Weighted, Latency, Failover, Geolocation)</td></tr>
    <tr><td><strong>CloudFront</strong></td><td>CDN — cache content at 400+ edge locations globally</td></tr>
    <tr><td><strong>ALB / NLB</strong></td><td>ALB = Layer 7 (HTTP/HTTPS routing by path/host). NLB = Layer 4 (TCP, ultra-low latency)</td></tr>
    <tr><td><strong>API Gateway</strong></td><td>Managed REST/WebSocket/HTTP API — integrate with Lambda, EC2, any HTTP endpoint</td></tr>
    <tr><td><strong>VPC Peering / Transit GW</strong></td><td>Connect VPCs together privately without internet</td></tr>
  </tbody>
</table>
</div>

---

## Security & IAM {#security}

<div class="diagram">
<div class="mermaid">
flowchart LR
    IAM["🔐 IAM"] --> USER["Users\n(people)"]
    IAM --> GROUP["Groups\n(collection of users)"]
    IAM --> ROLE["Roles\n(assumed by services/apps)"]
    IAM --> POL["Policies\n(JSON permissions)"]

    POL --> USER
    POL --> GROUP
    POL --> ROLE

    ROLE --> EC22["EC2 Instance"]
    ROLE --> LAM["Lambda Function"]
    ROLE --> ECS2["ECS Task"]
</div>
</div>

<div class="tw">
<table>
  <thead><tr><th>Service</th><th>Purpose</th></tr></thead>
  <tbody>
    <tr><td><strong>IAM</strong></td><td>Identity management — users, groups, roles, policies. Principle of least privilege</td></tr>
    <tr><td><strong>Cognito</strong></td><td>User authentication for apps — sign up/sign in, social login (Google/Facebook), JWT tokens</td></tr>
    <tr><td><strong>KMS</strong></td><td>Key Management Service — create and control encryption keys. Used by S3, RDS, EBS, Lambda</td></tr>
    <tr><td><strong>Secrets Manager</strong></td><td>Store DB passwords, API keys securely. Rotate automatically. Better than SSM Parameter Store for secrets</td></tr>
    <tr><td><strong>WAF</strong></td><td>Web Application Firewall — protect against SQL injection, XSS, DDoS. Works with ALB/CloudFront</td></tr>
    <tr><td><strong>Shield</strong></td><td>DDoS protection. Standard (free), Advanced (paid with 24/7 DDoS response)</td></tr>
    <tr><td><strong>GuardDuty</strong></td><td>Threat detection using ML — monitors CloudTrail, VPC Flow Logs, DNS logs</td></tr>
  </tbody>
</table>
</div>

<div class="box info"><b>🔑 IAM Best Practices</b>
Never use root account for daily work · Enable MFA on all accounts · Use Roles for EC2/Lambda (not access keys) · Attach policies to Groups not individual Users · Use condition keys to restrict access by IP, time, MFA
</div>

---

## Messaging & Streaming {#messaging}

<div class="tw">
<table>
  <thead><tr><th>Service</th><th>Type</th><th>Use Case</th><th>Key Difference</th></tr></thead>
  <tbody>
    <tr><td><strong>SQS</strong></td><td>Queue (pull)</td><td>Decouple microservices, background jobs</td><td>Standard (at-least-once) vs FIFO (exactly-once, ordered)</td></tr>
    <tr><td><strong>SNS</strong></td><td>Pub/Sub (push)</td><td>Fan-out notifications, alerts</td><td>One message → multiple subscribers (SQS, Lambda, Email, HTTP)</td></tr>
    <tr><td><strong>Kinesis Data Streams</strong></td><td>Real-time streaming</td><td>Log ingestion, clickstreams, IoT</td><td>Ordered, replay within 24h-7 days. Shards = throughput units</td></tr>
    <tr><td><strong>Kinesis Firehose</strong></td><td>Managed delivery</td><td>Stream to S3/Redshift/ElasticSearch</td><td>Fully managed, no consumers needed, near-real-time</td></tr>
    <tr><td><strong>EventBridge</strong></td><td>Event bus</td><td>SaaS integrations, scheduled rules</td><td>Schema registry, cross-account events, cron schedules</td></tr>
    <tr><td><strong>MSK (Managed Kafka)</strong></td><td>Kafka-managed</td><td>Kafka workloads without managing clusters</td><td>Standard Kafka API — drop-in managed replacement</td></tr>
  </tbody>
</table>
</div>

---

## Analytics & Data {#analytics}

<div class="diagram">
<div class="mermaid">
flowchart LR
    RAW["📥 Raw Data\nS3 / Streams"] --> GLUE["AWS Glue\nETL + Data Catalog"]
    GLUE --> DL["Data Lake\nS3 + Lake Formation"]
    DL --> ATH["Athena\nQuery S3 with SQL"]
    DL --> EMR["EMR\nSpark / Hive cluster"]
    DL --> RS["Redshift\nData Warehouse"]
    RS --> QS["QuickSight\nBI Dashboard"]
    ATH --> QS
</div>
</div>

<div class="tw">
<table>
  <thead><tr><th>Service</th><th>What it does</th></tr></thead>
  <tbody>
    <tr><td><strong>AWS Glue</strong></td><td>Serverless ETL. Crawlers auto-discover schema (Data Catalog). Python/Scala Spark jobs. Glue Studio for visual ETL</td></tr>
    <tr><td><strong>Athena</strong></td><td>Serverless SQL on S3. No infra — pay per query scanned. Supports Parquet, ORC, CSV, JSON</td></tr>
    <tr><td><strong>EMR</strong></td><td>Managed Hadoop/Spark/Hive cluster. Good for large-scale transformations. EC2 or EKS based</td></tr>
    <tr><td><strong>Lake Formation</strong></td><td>Build secure data lakes on S3 — fine-grained access control on tables and columns</td></tr>
    <tr><td><strong>Redshift</strong></td><td>Petabyte-scale data warehouse. Columnar storage. Redshift Spectrum queries S3 directly</td></tr>
    <tr><td><strong>QuickSight</strong></td><td>Serverless BI tool. Connect to Redshift, S3, RDS, Athena. Shareable dashboards</td></tr>
  </tbody>
</table>
</div>

---

## DevOps & Monitoring {#devops}

<div class="tw">
<table>
  <thead><tr><th>Service</th><th>Purpose</th></tr></thead>
  <tbody>
    <tr><td><strong>CodePipeline</strong></td><td>Orchestrate CI/CD: Source → Build → Test → Deploy stages</td></tr>
    <tr><td><strong>CodeBuild</strong></td><td>Managed build server (like Jenkins build). Runs buildspec.yml. Docker support</td></tr>
    <tr><td><strong>CodeDeploy</strong></td><td>Deploy to EC2, Lambda, ECS. Blue/Green and Rolling strategies</td></tr>
    <tr><td><strong>CloudFormation</strong></td><td>Infrastructure as Code (IaC) with YAML/JSON templates. Stack = group of resources</td></tr>
    <tr><td><strong>CDK</strong></td><td>Cloud Development Kit — define CloudFormation in Python/Java/TypeScript code</td></tr>
    <tr><td><strong>CloudWatch</strong></td><td>Metrics, Logs, Alarms, Dashboards. Log Insights for query-based log analysis</td></tr>
    <tr><td><strong>CloudTrail</strong></td><td>Audit log of all AWS API calls — who did what, when, from where</td></tr>
    <tr><td><strong>X-Ray</strong></td><td>Distributed tracing — visualise request flow across Lambda, ECS, API Gateway</td></tr>
  </tbody>
</table>
</div>

---

## Common Architecture Patterns {#patterns}

<div class="g2">
  <div class="card">
    <h4>Serverless Web App</h4>
    <p>Route 53 → CloudFront → S3 (static site) + API Gateway → Lambda → DynamoDB</p>
  </div>
  <div class="card">
    <h4>3-Tier Web App</h4>
    <p>Route 53 → ALB → EC2 ASG (App Tier) → RDS Multi-AZ (DB Tier) — all in private subnets</p>
  </div>
  <div class="card">
    <h4>Event-Driven Pipeline</h4>
    <p>S3 upload → SNS → SQS → Lambda / ECS (process) → DynamoDB / S3</p>
  </div>
  <div class="card">
    <h4>Data Lake</h4>
    <p>Kinesis Firehose → S3 → Glue Crawler → Athena (query) + Redshift Spectrum</p>
  </div>
</div>
