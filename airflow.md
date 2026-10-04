---
title: Airflow
---

<div class="hero">
  <h1>🌊 Apache Airflow</h1>
  <p class="sub">DAGs, operators, executors, XCom, connections, sensors — workflow orchestration for data pipelines.</p>
  <div class="tags">
    <span class="tag">DAG</span><span class="tag">Operators</span><span class="tag">XCom</span>
    <span class="tag">Sensors</span><span class="tag">Executors</span><span class="tag">TaskFlow</span>
  </div>
</div>

<div class="toc">
  <div class="toc-h">Contents</div>
  <ol>
    <li><a href="#arch">Airflow Architecture</a></li>
    <li><a href="#dag">DAG Concepts</a></li>
    <li><a href="#operators">Operators Reference</a></li>
    <li><a href="#dag-code">DAG Code Example</a></li>
    <li><a href="#xcom">XCom — Passing Data Between Tasks</a></li>
    <li><a href="#executors">Executors</a></li>
    <li><a href="#best">Best Practices</a></li>
  </ol>
</div>

---

## Airflow Architecture {#arch}

<div class="diagram">
<div class="mermaid">
flowchart TD
    subgraph AIRFLOW["🌊 Apache Airflow"]
        WEB["🖥️ Webserver\nUI — DAG view, logs, runs, connections"]
        SCH["⏰ Scheduler\nParses DAGs, creates DagRuns, queues tasks"]
        EXE["⚙️ Executor\nLocalExecutor / CeleryExecutor / KubernetesExecutor"]
        META["🗄️ Metadata DB\nPostgreSQL / MySQL\nStores DAGs, runs, task states, XCom"]
    end

    DAGFOLDER["📁 DAGs Folder\nPython files"] --> SCH
    SCH --> META
    SCH --> EXE
    WEB --> META
    EXE --> WORKERS["🔧 Workers\n(Celery) or K8s Pods\nActual task execution"]
    WORKERS --> META
    WORKERS --> LOGS["📋 Log Storage\nLocal / S3 / GCS"]
</div>
</div>

<div class="tw">
<table>
  <thead><tr><th>Component</th><th>Role</th></tr></thead>
  <tbody>
    <tr><td><strong>Webserver</strong></td><td>Flask UI — view DAG graph, trigger runs, check logs, manage connections and variables</td></tr>
    <tr><td><strong>Scheduler</strong></td><td>Continuously parses DAGs, determines when tasks are ready, puts them on the queue</td></tr>
    <tr><td><strong>Executor</strong></td><td>Defines HOW tasks run — local process, Celery worker, or Kubernetes pod</td></tr>
    <tr><td><strong>Metadata DB</strong></td><td>Single source of truth — all DAG runs, task states, XCom values stored here</td></tr>
    <tr><td><strong>Worker</strong></td><td>Pulls tasks from queue (Celery) or spins up (K8s) and actually executes them</td></tr>
  </tbody>
</table>
</div>

---

## DAG Concepts {#dag}

<div class="diagram">
<div class="mermaid">
flowchart LR
    subgraph DAG["📋 DAG: etl_pipeline (daily at 06:00)"]
        direction LR
        E["extract_data\nPythonOperator"]
        V["validate_data\nPythonOperator"]
        T1["transform_sales\nSparkSubmitOperator"]
        T2["transform_users\nSparkSubmitOperator"]
        L["load_to_warehouse\nPostgresOperator"]
        N["notify_team\nSlackOperator"]

        E --> V
        V --> T1
        V --> T2
        T1 --> L
        T2 --> L
        L --> N
    end
</div>
</div>

<div class="tw">
<table>
  <thead><tr><th>Concept</th><th>Description</th></tr></thead>
  <tbody>
    <tr><td><strong>DAG</strong></td><td>Directed Acyclic Graph — defines the pipeline. It's a Python script. No cycles allowed</td></tr>
    <tr><td><strong>DagRun</strong></td><td>A specific execution of a DAG at a given <code>logical_date</code> (previously: execution_date)</td></tr>
    <tr><td><strong>Task</strong></td><td>A unit of work — wraps an Operator instance. Each task has its own state</td></tr>
    <tr><td><strong>Task Instance</strong></td><td>A specific run of a Task in a DagRun — has state: queued, running, success, failed, up_for_retry</td></tr>
    <tr><td><strong>logical_date</strong></td><td>The data interval start — NOT when the DAG actually runs. Daily DAG at 06:00 for 2025-01-01 runs at 2025-01-02 06:00</td></tr>
    <tr><td><strong>Schedule</strong></td><td>Cron expression or <code>@daily</code>, <code>@hourly</code>, <code>timedelta</code>, or dataset-based triggering</td></tr>
  </tbody>
</table>
</div>

---

## Operators Reference {#operators}

<div class="tw">
<table>
  <thead><tr><th>Operator</th><th>Use Case</th><th>Import</th></tr></thead>
  <tbody>
    <tr><td><strong>PythonOperator</strong></td><td>Run any Python function</td><td><code>airflow.operators.python</code></td></tr>
    <tr><td><strong>BashOperator</strong></td><td>Run shell commands</td><td><code>airflow.operators.bash</code></td></tr>
    <tr><td><strong>PostgresOperator</strong></td><td>Execute SQL on PostgreSQL</td><td><code>airflow.providers.postgres.operators.postgres</code></td></tr>
    <tr><td><strong>S3ToRedshiftOperator</strong></td><td>Load S3 data to Redshift</td><td><code>airflow.providers.amazon.aws.transfers</code></td></tr>
    <tr><td><strong>SparkSubmitOperator</strong></td><td>Submit a Spark job</td><td><code>airflow.providers.apache.spark.operators</code></td></tr>
    <tr><td><strong>S3KeySensor</strong></td><td>Wait for a file to appear in S3</td><td><code>airflow.providers.amazon.aws.sensors.s3</code></td></tr>
    <tr><td><strong>HttpSensor</strong></td><td>Wait for HTTP endpoint to return 200</td><td><code>airflow.providers.http.sensors.http</code></td></tr>
    <tr><td><strong>TriggerDagRunOperator</strong></td><td>Trigger another DAG</td><td><code>airflow.operators.trigger_dagrun</code></td></tr>
    <tr><td><strong>BranchPythonOperator</strong></td><td>Conditional branching — return task_id to run next</td><td><code>airflow.operators.python</code></td></tr>
    <tr><td><strong>@task (TaskFlow)</strong></td><td>Modern decorator-based API — simpler Python tasks</td><td><code>from airflow.decorators import task</code></td></tr>
  </tbody>
</table>
</div>

---

## DAG Code Example {#dag-code}

<pre data-lang="python"><code>from airflow.decorators import dag, task
from airflow.providers.postgres.hooks.postgres import PostgresHook
from airflow.providers.amazon.aws.hooks.s3 import S3Hook
from pendulum import datetime
import pandas as pd

@dag(
    dag_id='sales_etl_pipeline',
    schedule='0 6 * * *',             # every day at 06:00
    start_date=datetime(2025, 1, 1),
    catchup=False,                     # don't backfill missed runs
    max_active_runs=1,                 # no concurrent runs
    tags=['sales', 'etl', 'daily'],
    default_args={
        'retries': 3,
        'retry_delay': timedelta(minutes=5),
        'email_on_failure': True,
        'email': ['naveen@company.com'],
    }
)
def sales_etl():

    @task()
    def extract_from_s3(bucket: str, key: str) -> str:
        """Download raw CSV from S3 to local temp file"""
        hook = S3Hook(aws_conn_id='aws_default')
        local_path = f'/tmp/sales_{key.replace("/","_")}'
        hook.download_file(bucket_name=bucket, key=key, local_path=local_path)
        return local_path   # passed via XCom automatically

    @task()
    def validate_and_transform(file_path: str) -> dict:
        """Clean and validate the data"""
        df = pd.read_csv(file_path)

        # Validate
        assert df['amount'].notna().all(), "NULL amounts found!"
        assert (df['amount'] > 0).all(), "Non-positive amounts found!"

        # Transform
        df['amount_inr'] = df['amount_usd'] * 83.5
        df['month']      = pd.to_datetime(df['date']).dt.month

        output_path = file_path.replace('.csv', '_cleaned.parquet')
        df.to_parquet(output_path, index=False)
        return {'path': output_path, 'row_count': len(df)}

    @task()
    def load_to_postgres(transform_result: dict):
        """Load transformed data into PostgreSQL"""
        df = pd.read_parquet(transform_result['path'])
        hook = PostgresHook(postgres_conn_id='postgres_warehouse')
        hook.insert_rows(
            table='sales_facts',
            rows=df.values.tolist(),
            target_fields=df.columns.tolist(),
            replace=True
        )
        print(f"Loaded {transform_result['row_count']} rows to warehouse")

    @task()
    def branch_on_row_count(transform_result: dict) -> str:
        """Route to alert if data looks too small"""
        return 'alert_small_load' if transform_result['row_count'] < 100 else 'success_notify'

    # ── Task Dependencies (TaskFlow wires XCom automatically) ──
    file_path       = extract_from_s3('my-data-bucket', 'sales/daily.csv')
    transform_result= validate_and_transform(file_path)
    load_to_postgres(transform_result)

# Register DAG
dag_instance = sales_etl()</code></pre>

---

## XCom — Passing Data Between Tasks {#xcom}

<div class="box info"><b>ℹ️ XCom Rules</b>
XCom (Cross-Communication) stores small values in the Metadata DB. Use for task outputs like file paths, counts, status strings — NOT for large DataFrames. For large data, write to S3/disk and pass the <strong>path</strong> via XCom.
</div>

<pre data-lang="python"><code># Classic XCom (push/pull)
def push_task(**context):
    context['ti'].xcom_push(key='row_count', value=1500)

def pull_task(**context):
    count = context['ti'].xcom_pull(task_ids='push_task', key='row_count')
    print(f"Previous task processed {count} rows")

# TaskFlow API (automatic XCom — recommended)
@task
def extract() -> str:
    return "/tmp/data.parquet"      # return value → auto XCom push

@task
def transform(path: str):
    df = pd.read_parquet(path)      # path comes from XCom automatically</code></pre>

---

## Executors {#executors}

<div class="tw">
<table>
  <thead><tr><th>Executor</th><th>How it works</th><th>Use Case</th></tr></thead>
  <tbody>
    <tr><td><strong>SequentialExecutor</strong></td><td>One task at a time, same process</td><td>Local dev / testing only — no parallelism</td></tr>
    <tr><td><strong>LocalExecutor</strong></td><td>Parallel subprocess on same machine</td><td>Single server setups, small teams</td></tr>
    <tr><td><strong>CeleryExecutor</strong></td><td>Distributes tasks to Celery workers via Redis/RabbitMQ broker</td><td>Production multi-worker setups</td></tr>
    <tr><td><strong>KubernetesExecutor</strong></td><td>Spins up a K8s pod per task, deletes after completion</td><td>Cloud-native, ephemeral, perfect isolation per task</td></tr>
    <tr><td><strong>CeleryKubernetesExecutor</strong></td><td>Hybrid — Celery for small tasks, K8s for heavy tasks</td><td>Large organisations with mixed workloads</td></tr>
  </tbody>
</table>
</div>

---

## Best Practices {#best}

<div class="box tip"><b>✅ DAG Design</b>
<ul>
<li>Keep DAGs <strong>idempotent</strong> — re-running should produce the same result</li>
<li>Keep tasks <strong>atomic</strong> — one task does one thing; easier to retry</li>
<li>Use <strong>catchup=False</strong> unless you need backfilling</li>
<li>Pass file <strong>paths</strong> via XCom, not entire DataFrames</li>
<li>Use <strong>TaskFlow API</strong> (<code>@task</code>) for pure Python tasks — cleaner code, automatic XCom</li>
<li>Set <strong>retries</strong> and <strong>retry_delay</strong> on default_args for all DAGs</li>
<li>Use <strong>Airflow Variables / Connections</strong> for config — not hardcoded values</li>
<li>Tag DAGs (<code>tags=['team', 'pipeline-type']</code>) for easy filtering in UI</li>
</ul>
</div>
