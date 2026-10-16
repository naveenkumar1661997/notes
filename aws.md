---
layout: default
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
<pre class="mermaid">
flowchart TD
    R53["Route 53 - DNS"] --> CF["CloudFront CDN"]
    CF --> IGW["Internet Gateway"]
    IGW --> ALB["ALB - Load Balancer"]
    ALB --> EC2["EC2 Instances"]
    EC2 --> RDS2["RDS Database"]
    EC2 --> NAT["NAT Gateway"]
    NAT --> IGW

    subgraph PUBLIC["Public Subnet"]
        ALB
        NAT
    end

    subgraph PRIVATE["Private Subnet"]
        EC2
        RDS2
    end
</pre>
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
<pre class="mermaid">
flowchart LR
    IAM["🔐 IAM"] --> USER["Users (people)"]
    IAM --> GROUP["Groups (collection of users)"]
    IAM --> ROLE["Roles (assumed by services/apps)"]
    IAM --> POL["Policies (JSON permissions)"]

    POL --> USER
    POL --> GROUP
    POL --> ROLE

    ROLE --> EC22["EC2 Instance"]
    ROLE --> LAM["Lambda Function"]
    ROLE --> ECS2["ECS Task"]
</pre>
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
<pre class="mermaid">
flowchart LR
    RAW["📥 Raw Data S3 / Streams"] --> GLUE["AWS Glue ETL + Data Catalog"]
    GLUE --> DL["Data Lake S3 + Lake Formation"]
    DL --> ATH["Athena Query S3 with SQL"]
    DL --> EMR["EMR Spark / Hive cluster"]
    DL --> RS["Redshift Data Warehouse"]
    RS --> QS["QuickSight BI Dashboard"]
    ATH --> QS
</pre>
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
