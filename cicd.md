---
layout: default
title: CI/CD
---

<div class="hero">
  <h1>🔄 CI / CD</h1>
  <p class="sub">Continuous Integration & Continuous Delivery — pipeline concepts, stages, tools, and real-world patterns.</p>
  <div class="tags">
    <span class="tag">CI</span><span class="tag">CD</span><span class="tag">Pipeline</span>
    <span class="tag">GitHub Actions</span><span class="tag">Automated Testing</span><span class="tag">Deployment</span>
  </div>
</div>

<div class="toc">
  <div class="toc-h">Contents</div>
  <ol>
    <li><a href="#concept">CI vs CD vs CD</a></li>
    <li><a href="#pipeline">Pipeline Flow Diagram</a></li>
    <li><a href="#stages">Pipeline Stages Explained</a></li>
    <li><a href="#tools">Tools Comparison</a></li>
    <li><a href="#github-actions">GitHub Actions Example</a></li>
    <li><a href="#strategies">Deployment Strategies</a></li>
    <li><a href="#best">Best Practices</a></li>
  </ol>
</div>

---

## CI vs CD vs CD {#concept}

<div class="g2">
  <div class="card">
    <h4>🔄 Continuous Integration (CI)</h4>
    <p>Developers merge code frequently (multiple times/day). Every merge triggers automated <strong>build + test</strong>. Goal: catch bugs early, avoid integration hell.</p>
  </div>
  <div class="card">
    <h4>🚚 Continuous Delivery (CD)</h4>
    <p>Code is always in a deployable state after CI passes. Release to production is a <strong>manual trigger</strong>. Ensures you CAN deploy anytime.</p>
  </div>
  <div class="card">
    <h4>🚀 Continuous Deployment (CD)</h4>
    <p>Every change that passes all pipeline stages is <strong>automatically deployed to production</strong>. No manual gates. Requires high test confidence.</p>
  </div>
  <div class="card">
    <h4>📊 Key Metrics (DORA)</h4>
    <p><strong>Deployment frequency</strong> — how often you deploy<br/><strong>Lead time</strong> — commit → production<br/><strong>MTTR</strong> — mean time to recovery<br/><strong>Change failure rate</strong> — % of bad deployments</p>
  </div>
</div>

---

## Full CI/CD Pipeline {#pipeline}

<div class="diagram">
<div class="mermaid">
flowchart LR
    DEV["👨‍💻 Developer\nCode Commit"] -->|git push| SCM["📦 Source Control\nGitHub / GitLab"]

    SCM --> CI

    subgraph CI["⚙️ Continuous Integration"]
        direction TB
        B["🔨 Build\nCompile / Lint"]
        B --> UT["🧪 Unit Tests\nJUnit / PyTest"]
        UT --> SA["🔍 Static Analysis\nSonarQube / Checkstyle"]
        SA --> SEC["🔒 Security Scan\nSNYK / OWASP"]
        SEC --> ART["📦 Artifact\nJAR / Docker Image"]
    end

    ART --> CD

    subgraph CD["🚀 Continuous Delivery/Deployment"]
        direction TB
        DEV2["🔧 Dev\nAuto deploy"]
        DEV2 -->|smoke test| STG["🎭 Staging\nAuto deploy"]
        STG -->|integration test| UAT["✅ UAT / Pre-Prod\nManual approval"]
        UAT -->|approved| PROD["🏁 Production\nBlue/Green or Rolling"]
    end

    PROD --> MON["📊 Monitoring\nCloudWatch / DataDog"]
    MON -->|alert| DEV
</div>
</div>

---

## Pipeline Stages Explained {#stages}

<div class="tw">
<table>
  <thead><tr><th>Stage</th><th>What happens</th><th>Tools</th><th>Fail = ?</th></tr></thead>
  <tbody>
    <tr><td><strong>Source</strong></td><td>Trigger on git push/PR merge. Clone repo</td><td>GitHub, GitLab, Bitbucket</td><td>Pipeline doesn't start</td></tr>
    <tr><td><strong>Build</strong></td><td>Compile code, run linters, build Docker image</td><td>Maven, Gradle, npm, Docker</td><td>Broken build → notify dev</td></tr>
    <tr><td><strong>Unit Test</strong></td><td>Run isolated unit tests with mocked dependencies</td><td>JUnit, Mockito, PyTest, Jest</td><td>Stop pipeline, report failures</td></tr>
    <tr><td><strong>Static Analysis</strong></td><td>Code quality, coverage, security vulnerabilities</td><td>SonarQube, Checkstyle, ESLint</td><td>Fail if quality gate not met</td></tr>
    <tr><td><strong>Security Scan</strong></td><td>Dependency vulnerability check, SAST</td><td>Snyk, OWASP Dependency-Check, Trivy</td><td>Block if high/critical CVEs</td></tr>
    <tr><td><strong>Artifact</strong></td><td>Package JAR, build + push Docker image, publish</td><td>Nexus, Artifactory, ECR, DockerHub</td><td>Retry or fail build</td></tr>
    <tr><td><strong>Deploy Dev</strong></td><td>Auto-deploy to development environment</td><td>Kubernetes, ECS, Helm, Terraform</td><td>Rollback automatically</td></tr>
    <tr><td><strong>Integration Test</strong></td><td>Test real service interactions in staging</td><td>Postman/Newman, Selenium, RestAssured</td><td>Block promotion to UAT</td></tr>
    <tr><td><strong>Deploy Prod</strong></td><td>Deploy with zero-downtime strategy</td><td>Blue/Green, Canary, Rolling</td><td>Rollback, incident alert</td></tr>
  </tbody>
</table>
</div>

---

## Tools Comparison {#tools}

<div class="tw">
<table>
  <thead><tr><th>Tool</th><th>Type</th><th>Best For</th><th>Config File</th></tr></thead>
  <tbody>
    <tr><td><strong>Jenkins</strong></td><td>Self-hosted</td><td>Enterprise, complex pipelines, full control</td><td><code>Jenkinsfile</code></td></tr>
    <tr><td><strong>GitHub Actions</strong></td><td>Cloud-native</td><td>GitHub repos, open source, quick setup</td><td><code>.github/workflows/*.yml</code></td></tr>
    <tr><td><strong>GitLab CI</strong></td><td>Cloud + self-hosted</td><td>GitLab repos, built-in container registry</td><td><code>.gitlab-ci.yml</code></td></tr>
    <tr><td><strong>AWS CodePipeline</strong></td><td>Cloud (AWS)</td><td>AWS-native deployments, ECS, Lambda, EC2</td><td>Console / CloudFormation</td></tr>
    <tr><td><strong>CircleCI</strong></td><td>Cloud</td><td>Fast builds, parallelism, orbs marketplace</td><td><code>.circleci/config.yml</code></td></tr>
    <tr><td><strong>ArgoCD</strong></td><td>GitOps (K8s)</td><td>Kubernetes deployments via GitOps</td><td>Git repo = source of truth</td></tr>
  </tbody>
</table>
</div>

---

## GitHub Actions Example {#github-actions}

{% raw %}
<pre data-lang="yaml"><code># .github/workflows/ci-cd.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  # ── Stage 1: Build & Test ──────────────────────────
  build-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up JDK 17
        uses: actions/setup-java@v4
        with:
          java-version: '17'
          distribution: 'temurin'

      - name: Cache Maven packages
        uses: actions/cache@v3
        with:
          path: ~/.m2
          key: ${{ runner.os }}-m2-${{ hashFiles('**/pom.xml') }}

      - name: Build and Test
        run: mvn clean verify

      - name: Upload coverage to SonarCloud
        run: mvn sonar:sonar
        env:
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}

  # ── Stage 2: Docker Build & Push ──────────────────
  docker:
    needs: build-test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4

      - name: Login to ECR
        uses: aws-actions/amazon-ecr-login@v2

      - name: Build and push image
        run: |
          IMAGE=${{ secrets.ECR_REGISTRY }}/myapp:${{ github.sha }}
          docker build -t $IMAGE .
          docker push $IMAGE
          echo "IMAGE=$IMAGE" >> $GITHUB_ENV

  # ── Stage 3: Deploy to ECS ────────────────────────
  deploy:
    needs: docker
    runs-on: ubuntu-latest
    environment: production
    steps:
      - name: Deploy to ECS
        run: |
          aws ecs update-service \
            --cluster prod-cluster \
            --service myapp \
            --force-new-deployment
</code></pre>
{% endraw %}

---

## Deployment Strategies {#strategies}

<div class="diagram">
<div class="mermaid">
flowchart TD
    STRAT["🚀 Deployment Strategies"]

    STRAT --> REC["♻️ Recreate\nStop all v1 → Start all v2\n✅ Simple ❌ Downtime"]
    STRAT --> ROLL["🔄 Rolling Update\nReplace instances one by one\n✅ No downtime ❌ Mixed versions briefly"]
    STRAT --> BG["🔵🟢 Blue/Green\nRun v2 alongside v1\nSwitch traffic instantly\n✅ Instant rollback ❌ 2x infra cost"]
    STRAT --> CAN["🐦 Canary\nSend 5% → 20% → 100% traffic\n✅ Gradual risk ❌ Complex monitoring"]
    STRAT --> AB["🅰️🅱️ A/B Testing\nRoute by user segment\nFor feature experiments"]
</div>
</div>

---

## Best Practices {#best}

<div class="box tip"><b>✅ CI Best Practices</b>
<ul>
<li>Keep build under <strong>10 minutes</strong> — long builds discourage frequent commits</li>
<li>Fix broken builds <strong>immediately</strong> — broken main blocks everyone</li>
<li>Commit small, frequent changes — easier to bisect failures</li>
<li>Run tests in <strong>parallel</strong> — split unit/integration test suites</li>
<li>Cache dependencies (Maven, npm, pip) — dramatically speeds up builds</li>
</ul>
</div>

<div class="box warn"><b>⚠️ CD Best Practices</b>
<ul>
<li>Use <strong>environment-specific configs</strong> — inject via env vars, not hardcoded</li>
<li>Never deploy on Friday afternoon — no one to watch overnight</li>
<li>Always have a <strong>rollback plan</strong> — one-click rollback to last good version</li>
<li>Gate with <strong>smoke tests</strong> after every deploy before promoting</li>
<li>Keep secrets in <strong>Secrets Manager</strong> / GitHub Secrets — never in code</li>
</ul>
</div>
