---
layout: default
title: Docker
---

<div class="hero">
  <h1>🐳 Docker</h1>
  <p class="sub">Containers, images, Dockerfile, Compose, networking — complete reference with diagrams.</p>
  <div class="tags">
    <span class="tag">Image</span><span class="tag">Container</span><span class="tag">Dockerfile</span>
    <span class="tag">Compose</span><span class="tag">Volumes</span><span class="tag">Networking</span>
  </div>
</div>

<div class="toc">
  <div class="toc-h">Contents</div>
  <ol>
    <li><a href="#arch">Docker Architecture</a></li>
    <li><a href="#lifecycle">Image & Container Lifecycle</a></li>
    <li><a href="#vs-vm">Container vs VM</a></li>
    <li><a href="#dockerfile">Dockerfile Best Practices</a></li>
    <li><a href="#compose">Docker Compose</a></li>
    <li><a href="#networking">Networking</a></li>
    <li><a href="#commands">Essential Commands</a></li>
  </ol>
</div>

---

## Docker Architecture {#arch}

<div class="diagram">
<div class="mermaid">
flowchart TD
    CLI["🖥️ Docker CLI\ndocker build / run / push"] --> DAEMON["🔧 Docker Daemon\n(dockerd)\nManages objects"]

    DAEMON --> IMAGES["📦 Images\n(read-only layers)"]
    DAEMON --> CONT["📦 Containers\n(running instances)"]
    DAEMON --> VOL["💾 Volumes\n(persistent storage)"]
    DAEMON --> NET["🌐 Networks\n(bridge/host/overlay)"]

    DAEMON <-->|push/pull| REG["🗂️ Registry\nDocker Hub / AWS ECR\nGitHub GHCR"]

    subgraph HOST["🖥️ Host Machine"]
        DAEMON
        IMAGES
        CONT
        VOL
        NET
    end
</div>
</div>

---

## Image & Container Lifecycle {#lifecycle}

<div class="diagram">
<div class="mermaid">
flowchart LR
    CODE["📄 Source Code\n+ Dockerfile"] -->|docker build| IMAGE["📦 Docker Image\n(immutable layers)"]
    IMAGE -->|docker push| REG["🗂️ Registry\n(DockerHub/ECR)"]
    REG  -->|docker pull| IMAGE2["📦 Image\n(on host)"]
    IMAGE2 -->|docker run| CONT["🟢 Container\n(RUNNING)"]
    CONT -->|docker stop| STOP["🔴 Container\n(STOPPED)"]
    STOP -->|docker start| CONT
    STOP -->|docker rm| DEL["🗑️ Deleted"]
    CONT -->|docker commit| NEWIMG["📦 New Image"]
</div>
</div>

<div class="box info"><b>💡 Image Layers</b>
Each instruction in Dockerfile adds a read-only layer. Layers are cached — if a layer hasn't changed, Docker reuses the cache. Container adds a thin writable layer on top. This is why we put frequently changing instructions (COPY code) LAST in Dockerfile.
</div>

---

## Container vs VM {#vs-vm}

<div class="tw">
<table>
  <thead><tr><th>Aspect</th><th>🐳 Container</th><th>🖥️ VM</th></tr></thead>
  <tbody>
    <tr><td><strong>Isolation</strong></td><td>Process-level (shares OS kernel)</td><td>Full OS isolation (hypervisor)</td></tr>
    <tr><td><strong>Startup</strong></td><td>Milliseconds</td><td>Minutes</td></tr>
    <tr><td><strong>Size</strong></td><td>MBs</td><td>GBs</td></tr>
    <tr><td><strong>Performance</strong></td><td>Near-native</td><td>Overhead from hypervisor</td></tr>
    <tr><td><strong>Portability</strong></td><td>Run anywhere Docker runs</td><td>Depends on hypervisor</td></tr>
    <tr><td><strong>Security</strong></td><td>Shared kernel — weaker isolation</td><td>Stronger — separate kernel</td></tr>
    <tr><td><strong>Use Case</strong></td><td>Microservices, CI/CD, cloud-native</td><td>Legacy apps, strong isolation needs</td></tr>
  </tbody>
</table>
</div>

---

## Dockerfile Best Practices {#dockerfile}

<pre data-lang="dockerfile"><code># ✅ GOOD Dockerfile — multi-stage, minimal image

# ── Stage 1: Build ──────────────────────────────────
FROM maven:3.9-eclipse-temurin-17 AS builder
WORKDIR /app
COPY pom.xml .                        # copy pom first (layer cache!)
RUN mvn dependency:go-offline -q      # cache dependencies
COPY src ./src                        # code changes here — after deps
RUN mvn package -DskipTests

# ── Stage 2: Runtime ────────────────────────────────
FROM eclipse-temurin:17-jre-alpine    # tiny JRE image, not full JDK
WORKDIR /app

# Non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=10s \
  CMD wget -qO- http://localhost:8080/actuator/health || exit 1

ENTRYPOINT ["java", "-jar", "app.jar"]</code></pre>

<div class="tw">
<table>
  <thead><tr><th>Practice</th><th>Why</th></tr></thead>
  <tbody>
    <tr><td>Use official slim/alpine base images</td><td>Smaller attack surface, faster pull</td></tr>
    <tr><td>Multi-stage builds</td><td>Final image has no build tools — much smaller</td></tr>
    <tr><td>Copy <code>pom.xml</code>/<code>package.json</code> before source</td><td>Leverage layer cache — dep layer unchanged unless deps change</td></tr>
    <tr><td>Run as non-root user</td><td>Security — limit blast radius of container escape</td></tr>
    <tr><td>Use <code>.dockerignore</code></td><td>Exclude <code>node_modules/</code>, <code>.git/</code>, IDE files from build context</td></tr>
    <tr><td>HEALTHCHECK instruction</td><td>Orchestrators (ECS, K8s) use it to route traffic only to healthy containers</td></tr>
    <tr><td>One process per container</td><td>Simplifies scaling, logging, and failure isolation</td></tr>
  </tbody>
</table>
</div>

---

## Docker Compose {#compose}

<pre data-lang="yaml"><code># docker-compose.yml — full stack example
version: '3.9'

services:
  app:
    build: .
    ports:
      - "8080:8080"
    environment:
      - DB_URL=jdbc:postgresql://db:5432/mydb
      - DB_USER=admin
      - DB_PASS=${DB_PASSWORD}           # from .env file
    depends_on:
      db:
        condition: service_healthy       # wait for DB healthcheck
    networks:
      - backend

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: mydb
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - pg_data:/var/lib/postgresql/data  # named volume (persistent)
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U admin"]
      interval: 10s
      retries: 5
    networks:
      - backend

  redis:
    image: redis:7-alpine
    networks:
      - backend

volumes:
  pg_data:

networks:
  backend:
    driver: bridge</code></pre>

<div class="tw">
<table>
  <thead><tr><th>Command</th><th>Description</th></tr></thead>
  <tbody>
    <tr><td><code>docker compose up -d</code></td><td>Start all services in background</td></tr>
    <tr><td><code>docker compose down -v</code></td><td>Stop and remove containers + volumes</td></tr>
    <tr><td><code>docker compose logs -f app</code></td><td>Follow logs of a specific service</td></tr>
    <tr><td><code>docker compose exec app bash</code></td><td>Shell into a running container</td></tr>
    <tr><td><code>docker compose ps</code></td><td>List status of all services</td></tr>
    <tr><td><code>docker compose scale app=3</code></td><td>Run 3 replicas of the app service</td></tr>
  </tbody>
</table>
</div>

---

## Networking {#networking}

<div class="tw">
<table>
  <thead><tr><th>Network Driver</th><th>Description</th><th>Use Case</th></tr></thead>
  <tbody>
    <tr><td><strong>bridge</strong></td><td>Default. Private internal network on host. Containers talk by service name</td><td>Docker Compose multi-container apps</td></tr>
    <tr><td><strong>host</strong></td><td>Container uses host network directly — no isolation</td><td>Performance-critical apps, monitoring agents</td></tr>
    <tr><td><strong>none</strong></td><td>No networking</td><td>Batch jobs that need no network access</td></tr>
    <tr><td><strong>overlay</strong></td><td>Multi-host networking (Docker Swarm / Kubernetes)</td><td>Distributed containerized apps</td></tr>
  </tbody>
</table>
</div>

---

## Essential Commands {#commands}

<pre data-lang="bash"><code># Images
docker build -t myapp:1.0 .           # build from Dockerfile in current dir
docker images                          # list local images
docker pull nginx:alpine               # pull from registry
docker push myrepo/myapp:1.0           # push to registry
docker image prune                     # remove unused images

# Containers
docker run -d -p 8080:80 --name web nginx     # detached with port mapping
docker run --rm -it ubuntu bash               # interactive, auto-remove
docker ps                                     # running containers
docker ps -a                                  # all containers
docker stop web && docker rm web              # stop and remove
docker exec -it web bash                      # shell into running container
docker logs -f web                            # follow container logs

# Volumes
docker volume create mydata
docker run -v mydata:/data myapp       # named volume mount
docker run -v $(pwd):/app myapp        # bind mount (dev)

# System cleanup
docker system prune -af                # remove all unused objects
docker stats                           # live resource usage</code></pre>
