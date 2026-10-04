---
layout: default
title: Jenkins
---

<div class="hero">
  <h1>⚙️ Jenkins</h1>
  <p class="sub">Jenkins architecture, declarative pipelines, Jenkinsfile, agents, shared libraries — revision notes.</p>
  <div class="tags">
    <span class="tag">Jenkinsfile</span><span class="tag">Declarative Pipeline</span>
    <span class="tag">Stages</span><span class="tag">Agents</span><span class="tag">Plugins</span>
  </div>
</div>

<div class="toc">
  <div class="toc-h">Contents</div>
  <ol>
    <li><a href="#arch">Jenkins Architecture</a></li>
    <li><a href="#pipeline-types">Pipeline Types</a></li>
    <li><a href="#jenkinsfile">Full Declarative Jenkinsfile</a></li>
    <li><a href="#agents">Agents</a></li>
    <li><a href="#plugins">Key Plugins</a></li>
    <li><a href="#shared-lib">Shared Libraries</a></li>
  </ol>
</div>

---

## Jenkins Architecture {#arch}

<div class="diagram">
<div class="mermaid">
flowchart TD
    SCM["📦 Git / GitHub\n(Webhook on push)"] -->|trigger| JC["⚙️ Jenkins Controller\n(Master)\nSchedules builds, stores config"]

    JC --> Q["📋 Build Queue"]
    Q --> AGT

    subgraph AGT["Build Agents (Workers)"]
        A1["Agent 1\nLinux / Docker"]
        A2["Agent 2\nWindows"]
        A3["Agent 3\nK8s Pod (ephemeral)"]
    end

    AGT --> |results| JC
    JC --> |store| WS["💾 Workspace\n& Artifacts"]
    JC --> |notify| NOTIF["📧 Notifications\nSlack / Email"]
    JC --> |deploy| DEPLOY["🚀 Target\nEC2 / ECS / K8s"]
</div>
</div>

<div class="box info"><b>ℹ️ Controller vs Agent</b>
The <strong>Controller</strong> (Master) orchestrates — it stores jobs, schedules builds, serves the UI. <strong>Agents</strong> do the actual work — compile, test, deploy. Never run heavy builds on the controller itself (security + stability).
</div>

---

## Pipeline Types {#pipeline-types}

<div class="tw">
<table>
  <thead><tr><th>Type</th><th>Definition</th><th>Pros</th><th>Cons</th></tr></thead>
  <tbody>
    <tr>
      <td><strong>Declarative</strong></td>
      <td>Structured YAML-like DSL inside <code>pipeline { }</code> block</td>
      <td>Readable, validates syntax, built-in directives (options, triggers, post)</td>
      <td>Less flexible for complex logic</td>
    </tr>
    <tr>
      <td><strong>Scripted</strong></td>
      <td>Groovy code inside <code>node { }</code> block — full power</td>
      <td>Maximum flexibility, conditionals, loops</td>
      <td>Complex, error-prone, harder to read</td>
    </tr>
  </tbody>
</table>
</div>

<div class="box tip"><b>✅ Use Declarative</b>
Always prefer Declarative pipeline. Use the <code>script { }</code> block inside stages when you need imperative Groovy logic for specific steps.
</div>

---

## Full Declarative Jenkinsfile {#jenkinsfile}

<pre data-lang="groovy"><code>pipeline {
    // ── Where to run ──────────────────────────────
    agent {
        docker {
            image 'maven:3.9-eclipse-temurin-17'
            args '-v $HOME/.m2:/root/.m2'   // cache Maven repo
        }
    }

    // ── Global options ────────────────────────────
    options {
        timeout(time: 30, unit: 'MINUTES')
        disableConcurrentBuilds()            // no parallel runs
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    // ── Auto-triggers ─────────────────────────────
    triggers {
        pollSCM('H/5 * * * *')              // poll git every 5 min
        // or: githubPush()                 // webhook (preferred)
    }

    // ── Reusable variables ────────────────────────
    environment {
        APP_NAME    = 'my-java-app'
        ECR_REPO    = '123456789.dkr.ecr.ap-south-1.amazonaws.com/myapp'
        IMAGE_TAG   = "${env.GIT_COMMIT[0..7]}"
        // Credentials from Jenkins Credentials Store:
        AWS_CREDS   = credentials('aws-ecr-creds')
        SONAR_TOKEN = credentials('sonarcloud-token')
    }

    stages {

        // ── Stage 1 ───────────────────────────────
        stage('Checkout') {
            steps {
                checkout scm
                echo "Branch: ${env.GIT_BRANCH} | Commit: ${IMAGE_TAG}"
            }
        }

        // ── Stage 2 ───────────────────────────────
        stage('Build') {
            steps {
                sh 'mvn clean package -DskipTests -q'
            }
            post {
                success { archiveArtifacts artifacts: 'target/*.jar' }
            }
        }

        // ── Stage 3 ───────────────────────────────
        stage('Test') {
            parallel {
                stage('Unit Tests') {
                    steps { sh 'mvn test' }
                    post { always { junit 'target/surefire-reports/*.xml' } }
                }
                stage('Code Analysis') {
                    steps {
                        sh """
                            mvn sonar:sonar \
                              -Dsonar.host.url=https://sonarcloud.io \
                              -Dsonar.token=${SONAR_TOKEN}
                        """
                    }
                }
            }
        }

        // ── Stage 4 ───────────────────────────────
        stage('Docker Build & Push') {
            when {
                branch 'main'              // only run on main branch
            }
            steps {
                script {
                    sh """
                        aws ecr get-login-password --region ap-south-1 | \
                            docker login --username AWS --password-stdin ${ECR_REPO}
                        docker build -t ${ECR_REPO}:${IMAGE_TAG} .
                        docker push ${ECR_REPO}:${IMAGE_TAG}
                    """
                }
            }
        }

        // ── Stage 5 ───────────────────────────────
        stage('Deploy to Staging') {
            when { branch 'main' }
            steps {
                sh """
                    aws ecs update-service \
                        --cluster staging \
                        --service ${APP_NAME} \
                        --force-new-deployment
                """
            }
        }

        // ── Stage 6: Manual Gate ──────────────────
        stage('Approve Production') {
            when { branch 'main' }
            steps {
                input message: 'Deploy to Production?',
                      submitter: 'naveen,tech-lead'
            }
        }

        stage('Deploy to Production') {
            when { branch 'main' }
            steps {
                sh """
                    aws ecs update-service \
                        --cluster production \
                        --service ${APP_NAME} \
                        --force-new-deployment
                """
            }
        }
    }

    // ── Post actions (always run) ─────────────────
    post {
        always   { cleanWs() }           // clean workspace
        success  { slackSend color: 'good',    message: "✅ ${APP_NAME} deployed ${IMAGE_TAG}" }
        failure  { slackSend color: 'danger',  message: "❌ ${APP_NAME} build FAILED on ${env.GIT_BRANCH}" }
        unstable { slackSend color: 'warning', message: "⚠️ ${APP_NAME} tests UNSTABLE" }
    }
}</code></pre>

---

## Agents {#agents}

<div class="tw">
<table>
  <thead><tr><th>Agent Type</th><th>Syntax</th><th>Use Case</th></tr></thead>
  <tbody>
    <tr><td><strong>any</strong></td><td><code>agent any</code></td><td>Run on any available agent — simplest option</td></tr>
    <tr><td><strong>none</strong></td><td><code>agent none</code></td><td>No global agent — each stage defines its own</td></tr>
    <tr><td><strong>label</strong></td><td><code>agent { label 'linux' }</code></td><td>Run on agents with a specific label</td></tr>
    <tr><td><strong>docker</strong></td><td><code>agent { docker { image 'maven:3.9' } }</code></td><td>Run inside a Docker container — clean environment every time</td></tr>
    <tr><td><strong>kubernetes</strong></td><td><code>agent { kubernetes { yaml '...' } }</code></td><td>Spin up a K8s pod as ephemeral agent — scales to zero</td></tr>
  </tbody>
</table>
</div>

---

## Key Plugins {#plugins}

<div class="tw">
<table>
  <thead><tr><th>Plugin</th><th>What it does</th></tr></thead>
  <tbody>
    <tr><td><strong>Pipeline</strong></td><td>Core pipeline support — Jenkinsfile execution</td></tr>
    <tr><td><strong>Git / GitHub</strong></td><td>SCM checkout, webhooks, status reporting to GitHub PRs</td></tr>
    <tr><td><strong>Docker Pipeline</strong></td><td>Use Docker images as agents, docker.build, docker.push</td></tr>
    <tr><td><strong>Credentials Binding</strong></td><td>Inject secrets/credentials as env vars into pipeline</td></tr>
    <tr><td><strong>Blue Ocean</strong></td><td>Modern visual pipeline UI — see stage graph, logs inline</td></tr>
    <tr><td><strong>JUnit</strong></td><td>Parse and display test results from XML reports</td></tr>
    <tr><td><strong>SonarQube Scanner</strong></td><td>Run SonarQube analysis and publish quality gate result</td></tr>
    <tr><td><strong>Slack Notification</strong></td><td>Send build notifications to Slack channels</td></tr>
    <tr><td><strong>Kubernetes</strong></td><td>Use K8s pods as dynamic Jenkins agents</td></tr>
    <tr><td><strong>AWS Steps</strong></td><td>AWS CLI commands as pipeline steps</td></tr>
  </tbody>
</table>
</div>

---

## Shared Libraries {#shared-lib}

<div class="box info"><b>ℹ️ What is a Shared Library?</b>
Reusable Groovy code stored in a Git repo that can be imported into any Jenkinsfile. Avoid copy-pasting the same stages across 20 microservices.
</div>

<pre data-lang="groovy"><code>// vars/deployToECS.groovy  (in shared library repo)
def call(String cluster, String service) {
    sh """
        aws ecs update-service \
            --cluster ${cluster} \
            --service ${service} \
            --force-new-deployment
    """
}

// ─────────────────────────────────────────────────────
// Jenkinsfile in any microservice — using the library:
@Library('my-shared-lib@main') _

pipeline {
    agent any
    stages {
        stage('Deploy') {
            steps {
                deployToECS('production', 'payment-service')
            }
        }
    }
}</code></pre>
