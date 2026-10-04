---
layout: default
title: Python
---

<div class="hero">
  <h1>🐍 Python</h1>
  <p class="sub">Core types, OOP, decorators, generators, async, Pandas, and data engineering libraries.</p>
  <div class="tags">
    <span class="tag">OOP</span><span class="tag">Decorators</span><span class="tag">Generators</span>
    <span class="tag">Pandas</span><span class="tag">Async</span><span class="tag">Type Hints</span>
  </div>
</div>

<div class="toc">
  <div class="toc-h">Contents</div>
  <ol>
    <li><a href="#ecosystem">Python Ecosystem</a></li>
    <li><a href="#types">Core Data Types</a></li>
    <li><a href="#oop">OOP in Python</a></li>
    <li><a href="#functional">Functional Features</a></li>
    <li><a href="#generators">Generators & Iterators</a></li>
    <li><a href="#async">Async / Await</a></li>
    <li><a href="#pandas">Pandas Quick Reference</a></li>
    <li><a href="#de-libs">Data Engineering Libraries</a></li>
  </ol>
</div>

---

## Python Ecosystem {#ecosystem}

<div class="diagram">
<div class="mermaid">
flowchart TD
    PY["🐍 Python"]

    PY --> WEB["🌐 Web\nFastAPI · Flask · Django"]
    PY --> DATA["📊 Data Science\nPandas · NumPy · Matplotlib · Seaborn"]
    PY --> ML["🤖 ML / AI\nScikit-learn · TensorFlow · PyTorch"]
    PY --> DE["⚙️ Data Engineering\nApache Spark (PySpark)\nAirflow · dbt · SQLAlchemy"]
    PY --> AUTO["🤖 Automation\nSelenium · Playwright · Requests · BeautifulSoup"]
    PY --> ASYNC["⚡ Async\nasyncio · aiohttp · FastAPI"]
    PY --> DEVOPS["🔧 DevOps/Scripting\nboto3 (AWS) · Fabric · Click"]
</div>
</div>

---

## Core Data Types {#types}

<div class="tw">
<table>
  <thead><tr><th>Type</th><th>Mutable?</th><th>Example</th><th>Key Methods</th></tr></thead>
  <tbody>
    <tr><td><strong>list</strong></td><td>✅ Yes</td><td><code>[1, 2, 3]</code></td><td><code>.append(), .extend(), .pop(), .sort(), .index()</code></td></tr>
    <tr><td><strong>tuple</strong></td><td>❌ No</td><td><code>(1, 2, 3)</code></td><td><code>.count(), .index()</code> — use for fixed data, dict keys</td></tr>
    <tr><td><strong>dict</strong></td><td>✅ Yes</td><td><code>{'a': 1}</code></td><td><code>.get(), .items(), .keys(), .values(), .update(), .setdefault()</code></td></tr>
    <tr><td><strong>set</strong></td><td>✅ Yes</td><td><code>{1, 2, 3}</code></td><td><code>.add(), .discard(), .union(), .intersection(), .difference()</code></td></tr>
    <tr><td><strong>frozenset</strong></td><td>❌ No</td><td><code>frozenset([1,2])</code></td><td>Immutable set — use as dict key</td></tr>
    <tr><td><strong>str</strong></td><td>❌ No</td><td><code>'hello'</code></td><td><code>.split(), .strip(), .join(), .replace(), .format(), f-string</code></td></tr>
  </tbody>
</table>
</div>

<pre data-lang="python"><code># Comprehensions — pythonic one-liners
squares     = [x**2 for x in range(10)]                          # list
even_sq     = [x**2 for x in range(10) if x % 2 == 0]           # filtered
word_lens   = {word: len(word) for word in ['python', 'java']}   # dict
unique_mods = {x % 3 for x in range(10)}                         # set

# Unpacking
a, *rest, last = [1, 2, 3, 4, 5]   # a=1, rest=[2,3,4], last=5

# f-strings (Python 3.8+)
name, score = "Naveen", 98.5
print(f"{name!r} scored {score:.1f}%")   # 'Naveen' scored 98.5%
print(f"{score = }")                      # score = 98.5 (debug)</code></pre>

---

## OOP in Python {#oop}

<pre data-lang="python"><code>from dataclasses import dataclass, field
from abc import ABC, abstractmethod
from typing import ClassVar

# Abstract Base Class
class DataSource(ABC):
    @abstractmethod
    def read(self, query: str) -> list: ...

    @abstractmethod
    def write(self, data: list) -> int: ...

# Concrete class with dataclass decorator
@dataclass
class PostgreSQLSource(DataSource):
    host: str
    port: int = 5432
    _pool: object = field(default=None, repr=False, init=False)
    instance_count: ClassVar[int] = 0   # class variable

    def __post_init__(self):
        PostgreSQLSource.instance_count += 1
        self._pool = self._create_pool()

    def _create_pool(self): ...         # private method convention

    def read(self, query: str) -> list:
        return self._pool.execute(query).fetchall()

    def write(self, data: list) -> int:
        return self._pool.bulk_insert(data)

    # Property — computed attribute
    @property
    def connection_string(self) -> str:
        return f"postgresql://{self.host}:{self.port}"

    # Class method
    @classmethod
    def from_env(cls) -> 'PostgreSQLSource':
        import os
        return cls(host=os.getenv('DB_HOST', 'localhost'))

    # Static method
    @staticmethod
    def validate_query(query: str) -> bool:
        return query.strip().upper().startswith('SELECT')

    def __repr__(self): return f"PostgreSQLSource({self.host}:{self.port})"
    def __str__(self):  return f"Connected to {self.host}"</code></pre>

---

## Functional Features {#functional}

<pre data-lang="python"><code># Decorators
import functools, time

def timer(func):
    @functools.wraps(func)           # preserve original function metadata
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        print(f"{func.__name__} took {time.perf_counter()-start:.3f}s")
        return result
    return wrapper

def retry(times=3, exceptions=(Exception,)):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(times):
                try:
                    return func(*args, **kwargs)
                except exceptions as e:
                    if attempt == times - 1: raise
                    print(f"Retry {attempt+1}/{times}: {e}")
        return wrapper
    return decorator

@timer
@retry(times=3, exceptions=(ConnectionError,))
def fetch_data(url: str) -> dict:
    # both decorators applied: retry first, then timer
    ...

# Lambda + map/filter/reduce
from functools import reduce
nums = [1, 2, 3, 4, 5]
doubled  = list(map(lambda x: x * 2, nums))
evens    = list(filter(lambda x: x % 2 == 0, nums))
total    = reduce(lambda a, b: a + b, nums)   # 15</code></pre>

---

## Generators & Iterators {#generators}

<pre data-lang="python"><code># Generator function — yield instead of return
def read_large_file(filepath: str):
    """Reads a file line by line — memory efficient for huge files"""
    with open(filepath) as f:
        for line in f:
            yield line.strip()

# Generator expression — like list comprehension but lazy
big_squares = (x**2 for x in range(10_000_000))  # no memory cost until iterated

# Custom iterator class
class DateRange:
    def __init__(self, start, end):
        self.current, self.end = start, end

    def __iter__(self):
        return self

    def __next__(self):
        if self.current >= self.end:
            raise StopIteration
        result = self.current
        self.current += timedelta(days=1)
        return result

# Useful built-in generators
from itertools import chain, islice, groupby, product

# Chain multiple iterables
all_items = chain([1,2], [3,4], [5,6])

# Take first n items from any iterable
first_5 = list(islice(big_squares, 5))</code></pre>

---

## Async / Await {#async}

<div class="diagram">
<div class="mermaid">
flowchart LR
    EL["⚡ Event Loop"]
    EL --> T1["Task 1\nawait fetch(url1)"]
    EL --> T2["Task 2\nawait fetch(url2)"]
    EL --> T3["Task 3\nawait fetch(url3)"]
    T1 --> WAIT["⏳ I/O Wait\n(yields control)"]
    T2 --> WAIT
    T3 --> WAIT
    WAIT -->|I/O complete| EL
</div>
</div>

<pre data-lang="python"><code">import asyncio, aiohttp

async def fetch(session, url: str) -> dict:
    async with session.get(url) as resp:
        return await resp.json()

async def fetch_all(urls: list[str]) -> list:
    async with aiohttp.ClientSession() as session:
        tasks = [fetch(session, url) for url in urls]
        return await asyncio.gather(*tasks)   # run all concurrently

# Run
results = asyncio.run(fetch_all([
    'https://api.example.com/user/1',
    'https://api.example.com/user/2',
]))</code></pre>

<div class="box info"><b>ℹ️ Async vs Threading</b>
Use <strong>async</strong> for I/O-bound tasks (HTTP, DB calls, file reads). Use <strong>threading</strong> for I/O-bound when working with blocking libraries. Use <strong>multiprocessing</strong> for CPU-bound tasks (bypasses the GIL).
</div>

---

## Pandas Quick Reference {#pandas}

<pre data-lang="python"><code">import pandas as pd

df = pd.read_csv('data.csv', parse_dates=['date'])   # load
df = pd.read_parquet('data.parquet')                 # fast columnar

# Inspect
df.shape, df.dtypes, df.describe(), df.info()
df.head(), df.tail(), df.sample(5)

# Select
df['col']                           # Series
df[['col1', 'col2']]               # DataFrame
df.loc[df['age'] > 25, 'name']    # label-based + condition
df.iloc[0:5, 1:3]                  # position-based

# Transform
df['full_name'] = df['first'] + ' ' + df['last']
df['age_bucket'] = pd.cut(df['age'], bins=[0,18,35,60], labels=['Jr','Mid','Sr'])
df = df.rename(columns={'old': 'new'})
df = df.drop_duplicates(subset=['email'])
df = df.fillna({'salary': 0, 'dept': 'Unknown'})

# GroupBy
summary = df.groupby('dept').agg(
    emp_count=('id', 'count'),
    avg_salary=('salary', 'mean'),
    max_salary=('salary', 'max')
).reset_index()

# Merge (like SQL JOIN)
result = pd.merge(employees, departments, on='dept_id', how='left')

# Export
df.to_parquet('output.parquet', index=False, compression='snappy')
df.to_csv('output.csv', index=False)</code></pre>

---

## Data Engineering Libraries {#de-libs}

<div class="tw">
<table>
  <thead><tr><th>Library</th><th>Use Case</th><th>Key Feature</th></tr></thead>
  <tbody>
    <tr><td><strong>PySpark</strong></td><td>Large-scale distributed data processing</td><td>DataFrame API mirrors Pandas but runs on a cluster</td></tr>
    <tr><td><strong>SQLAlchemy</strong></td><td>ORM + raw SQL for Python ↔ database</td><td>Works with PostgreSQL, MySQL, SQLite, Oracle, Redshift</td></tr>
    <tr><td><strong>boto3</strong></td><td>AWS SDK for Python</td><td>S3, DynamoDB, Glue, Redshift, EC2 — everything AWS</td></tr>
    <tr><td><strong>Great Expectations</strong></td><td>Data quality validation</td><td>Define and run expectations (assertions) on DataFrames / tables</td></tr>
    <tr><td><strong>dbt (via dbt-core)</strong></td><td>Transform data in SQL + build data models</td><td>Version-controlled SQL models, tests, lineage docs</td></tr>
    <tr><td><strong>Polars</strong></td><td>Fast DataFrame library (Rust-backed)</td><td>10-100x faster than Pandas for large files, lazy evaluation</td></tr>
    <tr><td><strong>Pydantic</strong></td><td>Data validation and settings management</td><td>Type-safe data models with automatic validation</td></tr>
  </tbody>
</table>
</div>
