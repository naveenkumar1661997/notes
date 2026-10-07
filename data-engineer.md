---
layout: default
title: Data Engineer
---

<div class="hero">
  <h1>📊 Data Engineering</h1>
  <p class="sub">ETL vs ELT, data lake vs warehouse, batch vs streaming, Spark, dbt, data formats, and pipeline patterns.</p>
  <div class="tags">
    <span class="tag">ETL</span><span class="tag">Data Lake</span><span class="tag">Spark</span>
    <span class="tag">dbt</span><span class="tag">Streaming</span><span class="tag">Data Formats</span>
  </div>
</div>

<div class="toc">
  <div class="toc-h">Contents</div>
  <ol>
    <li><a href="#pipeline">Data Pipeline Architecture</a></li>
    <li><a href="#etl-vs-elt">ETL vs ELT</a></li>
    <li><a href="#lake-vs-warehouse">Data Lake vs Data Warehouse</a></li>
    <li><a href="#batch-vs-stream">Batch vs Streaming</a></li>
    <li><a href="#formats">Data Formats</a></li>
    <li><a href="#spark">Apache Spark (PySpark)</a></li>
    <li><a href="#dbt">dbt — Data Build Tool</a></li>
    <li><a href="#layered">Layered Architecture (Medallion)</a></li>
    <li><a href="#tools">Tools Ecosystem</a></li>
  </ol>
</div>

---

## Data Pipeline Architecture {#pipeline}

<div class="diagram">
<div class="mermaid">
flowchart LR
    subgraph SOURCES["📥 Data Sources"]
        DB["Transactional DBs\nPostgreSQL / MySQL"]
        API["APIs & Webhooks"]
        STREAM["Event Streams\nKafka / Kinesis"]
        FILES["Files\nCSV / JSON / XML"]
    end

    subgraph INGEST["📡 Ingestion"]
        BATCH_I["Batch Ingest\nAWS Glue / Sqoop\nAirflow"]
        STREAM_I["Stream Ingest\nKafka Connect\nKinesis Firehose"]
    end

    subgraph LAKE["🏔️ Data Lake (S3 / GCS)"]
        BRONZE["🟤 Bronze Layer\nRaw data as-is"]
        SILVER["⚪ Silver Layer\nCleaned & validated"]
        GOLD["🟡 Gold Layer\nAggregated / business-ready"]
    end

    subgraph SERVE["📈 Serving Layer"]
        DW["Data Warehouse\nRedshift / BigQuery / Snowflake"]
        BI["BI Tools\nTableau / QuickSight / Superset"]
        ML["ML Features\nSageMaker Feature Store"]
        API2["Data API\nFastAPI / GraphQL"]
    end

    SOURCES --> INGEST
    INGEST --> BRONZE
    BRONZE -->|Spark / dbt| SILVER
    SILVER -->|Spark / dbt| GOLD
    GOLD --> SERVE

    ORCH["🎯 Orchestration\nAirflow / Prefect"] --> INGEST
    ORCH --> BRONZE
    ORCH --> SILVER
    ORCH --> GOLD
</div>
</div>

---

## ETL vs ELT {#etl-vs-elt}

<div class="diagram">
<div class="mermaid">
flowchart LR
    subgraph ETL["ETL — Traditional"]
        direction TB
        E1["Extract\nFrom source"] --> T1["Transform\nIn pipeline / ETL tool"] --> L1["Load\nTo target DB"]
    end

    subgraph ELT["ELT — Modern Cloud"]
        direction TB
        E2["Extract\nFrom source"] --> L2["Load\nRaw to cloud storage"] --> T2["Transform\nInside warehouse (SQL/dbt)"]
    end
</div>
</div>

<div class="tw">
<table>
  <thead><tr><th>Aspect</th><th>ETL</th><th>ELT</th></tr></thead>
  <tbody>
    <tr><td><strong>Transform when</strong></td><td>Before loading — in a dedicated tool</td><td>After loading — inside the data warehouse</td></tr>
    <tr><td><strong>Storage</strong></td><td>Only clean data stored</td><td>Raw data preserved (reprocessable)</td></tr>
    <tr><td><strong>Tools</strong></td><td>SSIS, Informatica, Talend, Pentaho</td><td>dbt, Spark, AWS Glue, Fivetran + dbt</td></tr>
    <tr><td><strong>Best for</strong></td><td>Legacy systems, strict compliance, on-prem</td><td>Cloud data warehouses (Redshift, Snowflake, BigQuery)</td></tr>
    <tr><td><strong>Flexibility</strong></td><td>Transform logic baked in pipeline — harder to change</td><td>Re-transform raw data any time without re-ingesting</td></tr>
  </tbody>
</table>
</div>

---

## Data Lake vs Data Warehouse {#lake-vs-warehouse}

<div class="tw">
<table>
  <thead><tr><th>Aspect</th><th>🏔️ Data Lake</th><th>🏛️ Data Warehouse</th></tr></thead>
  <tbody>
    <tr><td><strong>Data format</strong></td><td>Raw: JSON, CSV, Parquet, Avro, images, logs</td><td>Structured tables with defined schema</td></tr>
    <tr><td><strong>Schema</strong></td><td>Schema-on-read (defined at query time)</td><td>Schema-on-write (enforced at load time)</td></tr>
    <tr><td><strong>Storage cost</strong></td><td>Very cheap (object storage: S3, GCS)</td><td>More expensive (columnar DB)</td></tr>
    <tr><td><strong>Query</strong></td><td>Slow for ad-hoc SQL (Athena, Spark)</td><td>Fast for SQL analytics (Redshift, BigQuery, Snowflake)</td></tr>
    <tr><td><strong>Users</strong></td><td>Data scientists, ML engineers</td><td>Business analysts, BI teams</td></tr>
    <tr><td><strong>Examples</strong></td><td>S3 + Glue catalog, Azure Data Lake, GCS</td><td>Redshift, Snowflake, BigQuery, Synapse</td></tr>
  </tbody>
</table>
</div>

<div class="box info"><b>ℹ️ Data Lakehouse</b>
Modern pattern combining lake (cheap storage) + warehouse (SQL + ACID + schema). <strong>Delta Lake</strong> (Databricks), <strong>Apache Iceberg</strong>, and <strong>Apache Hudi</strong> are open-table formats that enable this — ACID transactions directly on S3.
</div>

---

## Batch vs Streaming {#batch-vs-stream}

<div class="tw">
<table>
  <thead><tr><th>Aspect</th><th>Batch Processing</th><th>Stream Processing</th></tr></thead>
  <tbody>
    <tr><td><strong>Data arrival</strong></td><td>Collected and processed at intervals (hourly, daily)</td><td>Processed as each event arrives (ms to seconds)</td></tr>
    <tr><td><strong>Latency</strong></td><td>Minutes to hours</td><td>Sub-second to seconds</td></tr>
    <tr><td><strong>Complexity</strong></td><td>Simpler — rerun on failure</td><td>More complex — ordering, late data, state management</td></tr>
    <tr><td><strong>Tools</strong></td><td>Spark Batch, Glue, dbt, SQL</td><td>Spark Streaming, Flink, Kinesis Analytics, Kafka Streams</td></tr>
    <tr><td><strong>Use cases</strong></td><td>Daily reports, EOD summaries, ML training</td><td>Fraud detection, real-time dashboards, alerting, IoT</td></tr>
    <tr><td><strong>Cost</strong></td><td>Cheaper — compute only when running</td><td>Higher — always-on infrastructure</td></tr>
  </tbody>
</table>
</div>

---

## Data Formats {#formats}

<div class="tw">
<table>
  <thead><tr><th>Format</th><th>Storage</th><th>Read Speed</th><th>Schema</th><th>Best For</th></tr></thead>
  <tbody>
    <tr><td><strong>CSV</strong></td><td>Row-based, text</td><td>Slow (full scan)</td><td>No (inferred)</td><td>Small files, data exchange, humans</td></tr>
    <tr><td><strong>JSON</strong></td><td>Row-based, text</td><td>Slow</td><td>Flexible (nested)</td><td>APIs, semi-structured data</td></tr>
    <tr><td><strong>Parquet</strong></td><td>Columnar, binary</td><td>⚡ Very fast (column pruning)</td><td>Yes (enforced)</td><td>Data lakes, Spark, Athena — most common choice</td></tr>
    <tr><td><strong>Avro</strong></td><td>Row-based, binary</td><td>Fast for full row reads</td><td>Yes (JSON schema)</td><td>Kafka messages, schema evolution</td></tr>
    <tr><td><strong>ORC</strong></td><td>Columnar, binary</td><td>⚡ Fast (Hive optimised)</td><td>Yes</td><td>Hive / Spark on Hadoop</td></tr>
    <tr><td><strong>Delta / Iceberg</strong></td><td>Parquet + metadata</td><td>⚡ Fast + ACID</td><td>Yes + versioned</td><td>Lakehouse pattern, updates, time travel</td></tr>
  </tbody>
</table>
</div>

<div class="box tip"><b>✅ Default Choice</b>
Use <strong>Parquet with Snappy compression</strong> for most data lake workloads. 5-10x smaller than CSV, columnar reads only fetch needed columns, widely supported by Spark, Athena, Glue, Redshift Spectrum.
</div>

---

## Apache Spark — PySpark {#spark}

<div class="diagram">
<div class="mermaid">
flowchart LR
    APP["Spark Application\n(Driver)"] --> SC["SparkContext / SparkSession"]
    SC --> CM["Cluster Manager\nYARN / Mesos / K8s / Standalone"]
    CM --> WN1["Worker Node 1\nExecutor → Tasks"]
    CM --> WN2["Worker Node 2\nExecutor → Tasks"]
    CM --> WN3["Worker Node N\nExecutor → Tasks"]
    WN1 --> DATA["Distributed Storage\nHDFS / S3 / GCS"]
    WN2 --> DATA
    WN3 --> DATA
</div>
</div>

<pre data-lang="python"><code>from pyspark.sql import SparkSession
from pyspark.sql import functions as F
from pyspark.sql.types import StructType, StructField, StringType, DoubleType

spark = SparkSession.builder \
    .appName("SalesETL") \
    .config("spark.sql.shuffle.partitions", "200") \
    .getOrCreate()

# Read from S3
df = spark.read.parquet("s3://my-bucket/sales/year=2025/")

# Transformations (lazy — nothing runs until action)
result = df \
    .filter(F.col("status") == "completed") \
    .withColumn("amount_inr", F.col("amount_usd") * 83.5) \
    .withColumn("month",      F.month("order_date")) \
    .groupBy("region", "month") \
    .agg(
        F.sum("amount_inr").alias("total_revenue"),
        F.count("*").alias("order_count"),
        F.avg("amount_inr").alias("avg_order_value")
    ) \
    .orderBy("month", "total_revenue", ascending=[True, False])

# Action — triggers actual computation
result.write \
    .mode("overwrite") \
    .partitionBy("month") \
    .parquet("s3://my-bucket/agg/sales_by_region/")</code></pre>

<div class="tw">
<table>
  <thead><tr><th>Concept</th><th>Description</th></tr></thead>
  <tbody>
    <tr><td><strong>RDD</strong></td><td>Resilient Distributed Dataset — low-level, avoid in modern code. Use DataFrame API</td></tr>
    <tr><td><strong>Transformation</strong></td><td>Lazy — filter, map, groupBy, join. Nothing runs until an action is called</td></tr>
    <tr><td><strong>Action</strong></td><td>Triggers execution — collect(), count(), write(), show()</td></tr>
    <tr><td><strong>Partition</strong></td><td>Unit of parallelism. More partitions = more parallel tasks. Aim for 128 MB per partition</td></tr>
    <tr><td><strong>Shuffle</strong></td><td>Data redistributed across nodes (e.g., groupBy, join). Most expensive operation — minimise</td></tr>
    <tr><td><strong>Broadcast Join</strong></td><td>Small table loaded into memory of all executors — avoids shuffle for small-large joins</td></tr>
    <tr><td><strong>Cache / Persist</strong></td><td>Store intermediate results in memory — reuse in multiple downstream actions</td></tr>
  </tbody>
</table>
</div>

---

## dbt — Data Build Tool {#dbt}

<div class="diagram">
<div class="mermaid">
flowchart TD
    RAW["📥 Raw Tables\n(loaded by Fivetran/Airbyte/Glue)"]
    RAW --> STG["📋 Staging Models\nstg_orders.sql\nstg_customers.sql\n(clean, rename, cast)"]
    STG --> INT["🔧 Intermediate Models\nint_order_items.sql\n(business logic)"]
    INT --> MART["📊 Mart Models\nfct_sales.sql (facts)\ndim_customer.sql (dimensions)"]
    MART --> BI["📈 BI Tools\nRedash / Tableau / QuickSight"]

    TESTS["🧪 dbt Tests\nnot_null · unique\naccepted_values · relationships"] --> STG
    TESTS --> INT
    TESTS --> MART
    DOCS["📖 Auto Documentation\ndbt docs generate"] --> MART
</div>
</div>

<pre data-lang="sql"><code>{% raw %}-- models/marts/fct_sales.sql

{{ config(
    materialized='incremental',      -- only process new rows
    unique_key='order_id',
    partition_by={'field': 'order_date', 'data_type': 'date'}
) }}

WITH orders AS (
    SELECT * FROM {{ ref('stg_orders') }}   -- ref() handles dependencies
    {% if is_incremental() %}
    WHERE order_date >= (SELECT MAX(order_date) FROM {{ this }})
    {% endif %}
),

customers AS (
    SELECT * FROM {{ ref('dim_customer') }}
)

SELECT
    o.order_id,
    o.order_date,
    c.customer_name,
    c.region,
    o.amount_usd,
    o.amount_usd * {{ var('usd_to_inr', 83.5) }} AS amount_inr
FROM orders o
LEFT JOIN customers c ON o.customer_id = c.customer_id{% endraw %}</code></pre>

---

## Medallion / Layered Architecture {#layered}

<div class="g2">
  <div class="card" style="border-left:3px solid #cd7f32">
    <h4>🟤 Bronze — Raw Layer</h4>
    <p>Exact copy of source data. Never transform. Append-only. Preserves history for reprocessing. Format: Parquet or original format.</p>
  </div>
  <div class="card" style="border-left:3px solid #c0c0c0">
    <h4>⚪ Silver — Cleaned Layer</h4>
    <p>Deduplicated, validated, standardised schema, nulls handled, types cast correctly. Ready for complex transforms. Joined across sources.</p>
  </div>
  <div class="card" style="border-left:3px solid #ffd700">
    <h4>🟡 Gold — Business Layer</h4>
    <p>Aggregated metrics and dimensions. Business logic applied. Optimised for queries. This is what BI tools and analysts query.</p>
  </div>
  <div class="card">
    <h4>📐 Why Medallion?</h4>
    <p>Separate concerns. Bad data in Bronze doesn't destroy Silver. Reprocess Silver from Bronze anytime. Gold is always fast and clean.</p>
  </div>
</div>

---

## Tools Ecosystem {#tools}

<div class="tw">
<table>
  <thead><tr><th>Category</th><th>Tools</th></tr></thead>
  <tbody>
    <tr><td><strong>Ingestion</strong></td><td>Fivetran, Airbyte, AWS Glue, Sqoop, Debezium (CDC), Kafka Connect</td></tr>
    <tr><td><strong>Orchestration</strong></td><td>Apache Airflow, Prefect, Dagster, AWS Step Functions</td></tr>
    <tr><td><strong>Processing</strong></td><td>Apache Spark, dbt, AWS Glue, Pandas, Flink (streaming)</td></tr>
    <tr><td><strong>Storage</strong></td><td>S3, GCS, Azure ADLS (lake); Redshift, Snowflake, BigQuery (warehouse)</td></tr>
    <tr><td><strong>Streaming</strong></td><td>Apache Kafka, AWS Kinesis, Apache Flink, Spark Structured Streaming</td></tr>
    <tr><td><strong>Catalog / Governance</strong></td><td>AWS Glue Data Catalog, Apache Atlas, Amundsen, DataHub</td></tr>
    <tr><td><strong>Quality</strong></td><td>Great Expectations, dbt tests, Soda Core, Monte Carlo</td></tr>
    <tr><td><strong>Formats</strong></td><td>Parquet (default), Avro (Kafka), Delta Lake / Iceberg (lakehouse)</td></tr>
    <tr><td><strong>Visualization</strong></td><td>Apache Superset, Metabase, Tableau, AWS QuickSight, Redash</td></tr>
  </tbody>
</table>
</div>
