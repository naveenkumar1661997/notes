---
layout: default
title: SQL
---

<div class="page-hero">
  <h1>SQL</h1>
  <p class="subtitle">Structured Query Language — complete reference with diagrams for fast revision.</p>
  <div class="tag-row">
    <span class="tag">DDL</span>
    <span class="tag">DML</span>
    <span class="tag">Joins</span>
    <span class="tag">Window Functions</span>
    <span class="tag">Indexes</span>
    <span class="tag">ACID</span>
    <span class="tag">Normalization</span>
  </div>
</div>

<div class="toc">
  <div class="toc-title">Contents</div>
  <ol>
    <li><a href="#categories">SQL Command Categories</a></li>
    <li><a href="#execution-order">Query Execution Order</a></li>
    <li><a href="#joins">JOIN Types</a></li>
    <li><a href="#subqueries">Subqueries</a></li>
    <li><a href="#window-functions">Window Functions</a></li>
    <li><a href="#indexes">Indexes</a></li>
    <li><a href="#transactions">Transactions & ACID</a></li>
    <li><a href="#normalization">Normalization</a></li>
    <li><a href="#functions">Common Functions</a></li>
  </ol>
</div>

---

## SQL Command Categories {#categories}

<div class="diagram-wrap">
<div class="mermaid">
flowchart TD
    SQL["🗄️ SQL Commands"]

    SQL --> DDL["DDL\nData Definition Language"]
    SQL --> DML["DML\nData Manipulation Language"]
    SQL --> DQL["DQL\nData Query Language"]
    SQL --> DCL["DCL\nData Control Language"]
    SQL --> TCL["TCL\nTransaction Control Language"]

    DDL --> d1["CREATE"]
    DDL --> d2["ALTER"]
    DDL --> d3["DROP"]
    DDL --> d4["TRUNCATE"]
    DDL --> d5["RENAME"]

    DML --> m1["INSERT"]
    DML --> m2["UPDATE"]
    DML --> m3["DELETE"]

    DQL --> q1["SELECT"]

    DCL --> c1["GRANT"]
    DCL --> c2["REVOKE"]

    TCL --> t1["COMMIT"]
    TCL --> t2["ROLLBACK"]
    TCL --> t3["SAVEPOINT"]
</div>
</div>

<div class="callout info">
  <div class="callout-title">💡 Quick Distinction</div>
  <strong>DDL</strong> changes structure (auto-committed, cannot rollback). <strong>DML</strong> changes data (can rollback). <strong>TRUNCATE</strong> is DDL — it removes all rows and resets identity, while <code>DELETE</code> is DML and logs each row.
</div>

---

## Query Execution Order {#execution-order}

SQL is <strong>written</strong> in a different order than it is <strong>executed</strong>. This matters for understanding aliases and filtering.

<div class="diagram-wrap">
<div class="mermaid">
flowchart LR
    subgraph WRITTEN["✍️  Written Order"]
        direction TB
        w1["1 — SELECT"]
        w2["2 — FROM"]
        w3["3 — JOIN"]
        w4["4 — WHERE"]
        w5["5 — GROUP BY"]
        w6["6 — HAVING"]
        w7["7 — ORDER BY"]
        w8["8 — LIMIT"]
        w1 --> w2 --> w3 --> w4 --> w5 --> w6 --> w7 --> w8
    end

    subgraph EXECUTED["⚙️  Execution Order"]
        direction TB
        e1["1 — FROM"]
        e2["2 — JOIN"]
        e3["3 — WHERE"]
        e4["4 — GROUP BY"]
        e5["5 — HAVING"]
        e6["6 — SELECT"]
        e7["7 — ORDER BY"]
        e8["8 — LIMIT"]
        e1 --> e2 --> e3 --> e4 --> e5 --> e6 --> e7 --> e8
    end
</div>
</div>

<div class="callout warn">
  <div class="callout-title">⚠️ Common Gotchas</div>
  <ul>
    <li><strong>WHERE cannot use SELECT aliases</strong> — WHERE runs before SELECT.</li>
    <li><strong>HAVING filters after GROUP BY</strong> — use it for aggregate conditions (<code>HAVING COUNT(*) > 2</code>).</li>
    <li><strong>ORDER BY can use SELECT aliases</strong> — it runs after SELECT.</li>
  </ul>
</div>

<pre data-lang="sql"><code>-- Full SELECT anatomy
SELECT department, COUNT(*) AS emp_count, AVG(salary) AS avg_sal
FROM   employees
JOIN   departments USING (dept_id)
WHERE  hire_date >= '2020-01-01'        -- filter rows BEFORE grouping
GROUP  BY department
HAVING COUNT(*) > 5                      -- filter AFTER grouping
ORDER  BY avg_sal DESC
LIMIT  10;</code></pre>

---

## JOIN Types {#joins}

<div class="join-grid">

  <div class="join-card">
    <h4>INNER JOIN</h4>
    <svg width="120" height="80" viewBox="0 0 120 80">
      <circle cx="42" cy="40" r="32" fill="#7C3AED" fill-opacity="0.25" stroke="#7C3AED" stroke-width="1.5"/>
      <circle cx="78" cy="40" r="32" fill="#06B6D4" fill-opacity="0.25" stroke="#06B6D4" stroke-width="1.5"/>
      <path d="M 60 12 A 32 32 0 0 1 60 68 A 32 32 0 0 1 60 12" fill="#A78BFA" fill-opacity="0.6"/>
      <text x="60" y="44" text-anchor="middle" fill="white" font-size="8" font-family="monospace">match</text>
    </svg>
    <p>Returns rows that have matching values in <strong>both</strong> tables.</p>
    <pre style="margin:0;padding:8px;font-size:0.75rem;"><code>SELECT *
FROM A
INNER JOIN B
  ON A.id = B.id;</code></pre>
  </div>

  <div class="join-card">
    <h4>LEFT JOIN</h4>
    <svg width="120" height="80" viewBox="0 0 120 80">
      <circle cx="42" cy="40" r="32" fill="#7C3AED" fill-opacity="0.5" stroke="#7C3AED" stroke-width="1.5"/>
      <circle cx="78" cy="40" r="32" fill="#06B6D4" fill-opacity="0.1" stroke="#06B6D4" stroke-width="1.5"/>
      <text x="36" y="44" text-anchor="middle" fill="white" font-size="8" font-family="monospace">all A</text>
    </svg>
    <p>All rows from <strong>left</strong> table + matched rows from right. NULLs for no match.</p>
    <pre style="margin:0;padding:8px;font-size:0.75rem;"><code>SELECT *
FROM A
LEFT JOIN B
  ON A.id = B.id;</code></pre>
  </div>

  <div class="join-card">
    <h4>RIGHT JOIN</h4>
    <svg width="120" height="80" viewBox="0 0 120 80">
      <circle cx="42" cy="40" r="32" fill="#7C3AED" fill-opacity="0.1" stroke="#7C3AED" stroke-width="1.5"/>
      <circle cx="78" cy="40" r="32" fill="#06B6D4" fill-opacity="0.5" stroke="#06B6D4" stroke-width="1.5"/>
      <text x="84" y="44" text-anchor="middle" fill="white" font-size="8" font-family="monospace">all B</text>
    </svg>
    <p>All rows from <strong>right</strong> table + matched rows from left. NULLs for no match.</p>
    <pre style="margin:0;padding:8px;font-size:0.75rem;"><code>SELECT *
FROM A
RIGHT JOIN B
  ON A.id = B.id;</code></pre>
  </div>

  <div class="join-card">
    <h4>FULL OUTER JOIN</h4>
    <svg width="120" height="80" viewBox="0 0 120 80">
      <circle cx="42" cy="40" r="32" fill="#7C3AED" fill-opacity="0.4" stroke="#7C3AED" stroke-width="1.5"/>
      <circle cx="78" cy="40" r="32" fill="#06B6D4" fill-opacity="0.4" stroke="#06B6D4" stroke-width="1.5"/>
      <text x="60" y="44" text-anchor="middle" fill="white" font-size="7.5" font-family="monospace">all rows</text>
    </svg>
    <p>All rows from <strong>both</strong> tables. NULLs where no match on either side.</p>
    <pre style="margin:0;padding:8px;font-size:0.75rem;"><code>SELECT *
FROM A
FULL OUTER JOIN B
  ON A.id = B.id;</code></pre>
  </div>

  <div class="join-card">
    <h4>LEFT EXCLUDING JOIN</h4>
    <svg width="120" height="80" viewBox="0 0 120 80">
      <circle cx="42" cy="40" r="32" fill="#7C3AED" fill-opacity="0.5" stroke="#7C3AED" stroke-width="1.5"/>
      <circle cx="78" cy="40" r="32" fill="#0D1117" stroke="#06B6D4" stroke-width="1.5"/>
      <text x="32" y="44" text-anchor="middle" fill="white" font-size="7.5" font-family="monospace">A only</text>
    </svg>
    <p>Rows in A with <strong>no match</strong> in B — orphans on the left.</p>
    <pre style="margin:0;padding:8px;font-size:0.75rem;"><code>SELECT *
FROM A
LEFT JOIN B ON A.id = B.id
WHERE B.id IS NULL;</code></pre>
  </div>

  <div class="join-card">
    <h4>CROSS JOIN</h4>
    <svg width="120" height="80" viewBox="0 0 120 80">
      <rect x="10" y="20" width="40" height="40" rx="4" fill="#7C3AED" fill-opacity="0.4" stroke="#7C3AED" stroke-width="1.5"/>
      <rect x="70" y="20" width="40" height="40" rx="4" fill="#06B6D4" fill-opacity="0.4" stroke="#06B6D4" stroke-width="1.5"/>
      <text x="60" y="38" text-anchor="middle" fill="white" font-size="14">✕</text>
    </svg>
    <p>Cartesian product — every row of A paired with every row of B (m × n rows).</p>
    <pre style="margin:0;padding:8px;font-size:0.75rem;"><code>SELECT *
FROM A
CROSS JOIN B;
-- or: FROM A, B</code></pre>
  </div>

  <div class="join-card">
    <h4>SELF JOIN</h4>
    <svg width="120" height="80" viewBox="0 0 120 80">
      <circle cx="60" cy="40" r="30" fill="#10B981" fill-opacity="0.2" stroke="#10B981" stroke-width="1.5"/>
      <path d="M 60 10 C 90 10 100 30 80 40 C 60 50 70 65 60 70" fill="none" stroke="#10B981" stroke-width="1.5" marker-end="url(#arr)"/>
      <text x="60" y="44" text-anchor="middle" fill="white" font-size="8" font-family="monospace">T → T</text>
    </svg>
    <p>Join a table <strong>with itself</strong>. Useful for hierarchies (manager → employee).</p>
    <pre style="margin:0;padding:8px;font-size:0.75rem;"><code>SELECT e.name, m.name AS mgr
FROM emp e
JOIN emp m
  ON e.mgr_id = m.id;</code></pre>
  </div>

</div>

<div class="callout tip">
  <div class="callout-title">✅ Which JOIN to use?</div>
  Use <strong>INNER</strong> when you only want matching rows. Use <strong>LEFT</strong> when you want all records from the primary table even if the related table has no match (e.g., customers with no orders). Use <strong>FULL OUTER</strong> for reconciliation / audit reports.
</div>

---

## Subqueries {#subqueries}

<h3>Types of Subqueries</h3>

<div class="table-wrap">
<table>
  <thead>
    <tr><th>Type</th><th>Where Used</th><th>Characteristic</th><th>Example</th></tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Scalar</strong></td>
      <td>SELECT, WHERE</td>
      <td>Returns exactly 1 value</td>
      <td><code>WHERE sal > (SELECT AVG(sal) FROM emp)</code></td>
    </tr>
    <tr>
      <td><strong>Row</strong></td>
      <td>WHERE</td>
      <td>Returns 1 row, multiple cols</td>
      <td><code>WHERE (a, b) = (SELECT x, y FROM …)</code></td>
    </tr>
    <tr>
      <td><strong>Table (inline view)</strong></td>
      <td>FROM</td>
      <td>Returns a result set used as a table</td>
      <td><code>FROM (SELECT …) AS sub</code></td>
    </tr>
    <tr>
      <td><strong>Correlated</strong></td>
      <td>WHERE / SELECT</td>
      <td>References outer query — re-runs per row</td>
      <td><code>WHERE sal = (SELECT MAX(sal) FROM emp e2 WHERE e2.dept = e1.dept)</code></td>
    </tr>
  </tbody>
</table>
</div>

<h3>EXISTS vs IN</h3>

<pre data-lang="sql"><code>-- IN  — pulls all matching values first, then filters
SELECT * FROM orders
WHERE customer_id IN (SELECT id FROM customers WHERE country = 'IN');

-- EXISTS — stops at first match (faster for large subquery result sets)
SELECT * FROM orders o
WHERE EXISTS (
  SELECT 1 FROM customers c
  WHERE c.id = o.customer_id AND c.country = 'IN'
);</code></pre>

<div class="callout info">
  <div class="callout-title">ℹ️ Rule of Thumb</div>
  Use <strong>EXISTS</strong> when the subquery table is large. Use <strong>IN</strong> when the list is small or a literal list. EXISTS short-circuits on the first match — IN evaluates all results first.
</div>

<h3>Common Table Expressions (CTEs)</h3>

<pre data-lang="sql"><code>-- Non-recursive CTE (readability / reuse)
WITH dept_avg AS (
  SELECT dept_id, AVG(salary) AS avg_sal
  FROM employees
  GROUP BY dept_id
)
SELECT e.name, e.salary, d.avg_sal
FROM employees e
JOIN dept_avg d ON e.dept_id = d.dept_id
WHERE e.salary > d.avg_sal;

-- Recursive CTE (hierarchies)
WITH RECURSIVE org_tree AS (
  SELECT id, name, manager_id, 1 AS level
  FROM employees WHERE manager_id IS NULL   -- anchor
  UNION ALL
  SELECT e.id, e.name, e.manager_id, t.level + 1
  FROM employees e
  JOIN org_tree t ON e.manager_id = t.id   -- recursive
)
SELECT * FROM org_tree ORDER BY level;</code></pre>

---

## Window Functions {#window-functions}

<div class="callout info">
  <div class="callout-title">ℹ️ What are Window Functions?</div>
  Perform calculations across a <strong>window of rows related to the current row</strong>, without collapsing them like GROUP BY. They run in the SELECT clause after WHERE / GROUP BY / HAVING.
</div>

<h3>Syntax</h3>

<pre data-lang="sql"><code>function_name() OVER (
  PARTITION BY col1, col2   -- optional: grouping window
  ORDER BY col3             -- optional: defines row order within window
  ROWS BETWEEN ...          -- optional: frame definition
)</code></pre>

<h3>Function Reference</h3>

<div class="table-wrap">
<table>
  <thead>
    <tr><th>Category</th><th>Function</th><th>Description</th></tr>
  </thead>
  <tbody>
    <tr>
      <td rowspan="3"><strong>Ranking</strong></td>
      <td><code>ROW_NUMBER()</code></td>
      <td>Unique number per row within partition (no ties)</td>
    </tr>
    <tr>
      <td><code>RANK()</code></td>
      <td>Same value gets same rank; gaps after ties (1,1,3)</td>
    </tr>
    <tr>
      <td><code>DENSE_RANK()</code></td>
      <td>Same value = same rank; no gaps (1,1,2)</td>
    </tr>
    <tr>
      <td rowspan="2"><strong>Offset</strong></td>
      <td><code>LAG(col, n)</code></td>
      <td>Value from <em>n</em> rows before current row</td>
    </tr>
    <tr>
      <td><code>LEAD(col, n)</code></td>
      <td>Value from <em>n</em> rows after current row</td>
    </tr>
    <tr>
      <td rowspan="2"><strong>Position</strong></td>
      <td><code>FIRST_VALUE(col)</code></td>
      <td>First value in the window frame</td>
    </tr>
    <tr>
      <td><code>LAST_VALUE(col)</code></td>
      <td>Last value in the window frame</td>
    </tr>
    <tr>
      <td rowspan="3"><strong>Aggregate</strong></td>
      <td><code>SUM() OVER</code></td>
      <td>Running total or partition total</td>
    </tr>
    <tr>
      <td><code>AVG() OVER</code></td>
      <td>Moving/partition average</td>
    </tr>
    <tr>
      <td><code>NTILE(n)</code></td>
      <td>Divides rows into n equal buckets</td>
    </tr>
  </tbody>
</table>
</div>

<h3>Practical Examples</h3>

<pre data-lang="sql"><code>-- Top 1 salary per department
WITH ranked AS (
  SELECT *, DENSE_RANK() OVER (PARTITION BY dept ORDER BY salary DESC) AS rk
  FROM employees
)
SELECT * FROM ranked WHERE rk = 1;

-- Running total of sales
SELECT date, amount,
  SUM(amount) OVER (ORDER BY date ROWS UNBOUNDED PRECEDING) AS running_total
FROM sales;

-- Month-over-month change
SELECT month, revenue,
  LAG(revenue, 1) OVER (ORDER BY month)  AS prev_month,
  revenue - LAG(revenue, 1) OVER (ORDER BY month) AS delta
FROM monthly_sales;</code></pre>

---

## Indexes {#indexes}

<div class="diagram-wrap">
<div class="mermaid">
flowchart TD
    I["🗂️ Index Types"]
    I --> BT["B-Tree Index\n(default)"]
    I --> HS["Hash Index"]
    I --> CI["Composite Index\n(multi-column)"]
    I --> UI["Unique Index"]
    I --> PI["Partial Index\n(WHERE clause)"]
    I --> FI["Full-Text Index"]

    BT --> bt1["✅ Range queries\n✅ ORDER BY\n✅ LIKE 'abc%'"]
    HS  --> hs1["✅ Exact equality\n❌ Range queries"]
    CI  --> ci1["✅ Multi-column WHERE\nFollow left-prefix rule"]
    PI  --> pi1["✅ Sparse data\nSmaller, faster"]
</div>
</div>

<h3>The Left-Prefix Rule (Composite Index)</h3>

<pre data-lang="sql"><code>-- Index on (last_name, first_name, age)
CREATE INDEX idx_name_age ON employees(last_name, first_name, age);

-- ✅ Uses index
WHERE last_name = 'Kumar'
WHERE last_name = 'Kumar' AND first_name = 'Naveen'
WHERE last_name = 'Kumar' AND first_name = 'Naveen' AND age = 27

-- ❌ Does NOT use index (skips left column)
WHERE first_name = 'Naveen'
WHERE age = 27</code></pre>

<h3>When to Add an Index</h3>

<div class="table-wrap">
<table>
  <thead><tr><th>Add Index When…</th><th>Avoid Index When…</th></tr></thead>
  <tbody>
    <tr>
      <td>Column appears often in WHERE / JOIN ON</td>
      <td>Table is small (full scan is faster)</td>
    </tr>
    <tr>
      <td>Column used in ORDER BY / GROUP BY</td>
      <td>Column has very low cardinality (e.g., boolean)</td>
    </tr>
    <tr>
      <td>Column used in range queries</td>
      <td>Table is write-heavy (indexes slow INSERT/UPDATE/DELETE)</td>
    </tr>
    <tr>
      <td>Foreign key columns</td>
      <td>Column is rarely queried</td>
    </tr>
  </tbody>
</table>
</div>

<div class="callout warn">
  <div class="callout-title">⚠️ Index Pitfalls</div>
  <ul>
    <li>Functions on indexed columns prevent index use: <code>WHERE YEAR(created_at) = 2024</code> — use <code>created_at BETWEEN '2024-01-01' AND '2024-12-31'</code> instead.</li>
    <li>Leading <code>%</code> wildcard bypasses index: <code>WHERE name LIKE '%Kumar'</code> → full scan.</li>
    <li>Implicit type cast can prevent index use: comparing <code>VARCHAR</code> column to an integer.</li>
  </ul>
</div>

---

## Transactions & ACID {#transactions}

<div class="acid-grid">
  <div class="acid-card">
    <div class="acid-letter" style="color:#A78BFA;">A</div>
    <div class="acid-word">Atomicity</div>
    <div class="acid-desc">All operations in a transaction succeed or all are rolled back. No partial state. <em>"All or nothing."</em></div>
  </div>
  <div class="acid-card">
    <div class="acid-letter" style="color:#06B6D4;">C</div>
    <div class="acid-word">Consistency</div>
    <div class="acid-desc">A transaction brings the database from one valid state to another. All constraints, rules, and cascades are maintained.</div>
  </div>
  <div class="acid-card">
    <div class="acid-letter" style="color:#10B981;">I</div>
    <div class="acid-word">Isolation</div>
    <div class="acid-desc">Concurrent transactions execute as if they are serial. Intermediate state is not visible to others.</div>
  </div>
  <div class="acid-card">
    <div class="acid-letter" style="color:#F59E0B;">D</div>
    <div class="acid-word">Durability</div>
    <div class="acid-desc">Once committed, changes persist even after a system crash. Ensured via write-ahead logging (WAL).</div>
  </div>
</div>

<h3>Isolation Levels</h3>

<div class="table-wrap">
<table>
  <thead>
    <tr><th>Level</th><th>Dirty Read</th><th>Non-Repeatable Read</th><th>Phantom Read</th><th>Performance</th></tr>
  </thead>
  <tbody>
    <tr><td><strong>READ UNCOMMITTED</strong></td><td>✅ possible</td><td>✅ possible</td><td>✅ possible</td><td>🚀 Fastest</td></tr>
    <tr><td><strong>READ COMMITTED</strong></td><td>❌ prevented</td><td>✅ possible</td><td>✅ possible</td><td>🏎️ Fast</td></tr>
    <tr><td><strong>REPEATABLE READ</strong></td><td>❌ prevented</td><td>❌ prevented</td><td>✅ possible</td><td>🚗 Moderate</td></tr>
    <tr><td><strong>SERIALIZABLE</strong></td><td>❌ prevented</td><td>❌ prevented</td><td>❌ prevented</td><td>🐢 Slowest</td></tr>
  </tbody>
</table>
</div>

<h3>Transaction Syntax</h3>

<pre data-lang="sql"><code>BEGIN;                          -- start transaction

UPDATE accounts SET balance = balance - 1000 WHERE id = 1;
UPDATE accounts SET balance = balance + 1000 WHERE id = 2;

-- Partial rollback using SAVEPOINT
SAVEPOINT before_transfer;
-- ... something goes wrong ...
ROLLBACK TO SAVEPOINT before_transfer;

COMMIT;                         -- persist all changes</code></pre>

---

## Normalization {#normalization}

<div class="callout info">
  <div class="callout-title">ℹ️ Goal of Normalization</div>
  Eliminate <strong>redundancy</strong> and prevent <strong>anomalies</strong> (insert, update, delete). Each normal form builds on the previous.
</div>

<div class="norm-block">
  <span class="norm-badge n1">1NF — First Normal Form</span>
  <p style="font-size:0.85rem;color:var(--muted);margin:4px 0;"><strong>Rule:</strong> Each column has atomic (indivisible) values. No repeating groups. Each row is unique.</p>
  <p style="font-size:0.85rem;color:var(--danger);">❌ Violates: <code>phone = "9999, 8888"</code> (multiple values in one cell)</p>
  <p style="font-size:0.85rem;color:var(--accent3);">✅ Fix: Separate <code>phone</code> into its own table with FK to customer.</p>
</div>

<div class="norm-block">
  <span class="norm-badge n2">2NF — Second Normal Form</span>
  <p style="font-size:0.85rem;color:var(--muted);margin:4px 0;"><strong>Rule:</strong> Must be in 1NF + every non-key column must depend on the <strong>entire composite primary key</strong> (no partial dependency).</p>
  <p style="font-size:0.85rem;color:var(--danger);">❌ Violates: Table(student_id, course_id, student_name) — student_name depends only on student_id, not on (student_id, course_id).</p>
  <p style="font-size:0.85rem;color:var(--accent3);">✅ Fix: Move student_name to a separate Students table.</p>
</div>

<div class="norm-block">
  <span class="norm-badge n3">3NF — Third Normal Form</span>
  <p style="font-size:0.85rem;color:var(--muted);margin:4px 0;"><strong>Rule:</strong> Must be in 2NF + no <strong>transitive dependency</strong> (non-key column should not depend on another non-key column).</p>
  <p style="font-size:0.85rem;color:var(--danger);">❌ Violates: emp_id → dept_id → dept_name (dept_name depends on dept_id, not emp_id directly)</p>
  <p style="font-size:0.85rem;color:var(--accent3);">✅ Fix: Separate Departments table with dept_id as PK.</p>
</div>

<div class="norm-block">
  <span class="norm-badge nb">BCNF — Boyce-Codd Normal Form</span>
  <p style="font-size:0.85rem;color:var(--muted);margin:4px 0;"><strong>Rule:</strong> Stricter 3NF — for every functional dependency X → Y, X must be a superkey. Handles anomalies 3NF misses with multiple overlapping candidate keys.</p>
</div>

<div class="diagram-wrap">
<div class="mermaid">
flowchart LR
    Raw["Raw / Unnormalized"] -->|"Atomic values,\nno repeating groups"| NF1["1NF"]
    NF1 -->|"No partial\ndependency"| NF2["2NF"]
    NF2 -->|"No transitive\ndependency"| NF3["3NF"]
    NF3 -->|"Every determinant\nis a superkey"| BCNF["BCNF"]
    BCNF -->|"No multi-valued\ndependency"| NF4["4NF"]
</div>
</div>

---

## Common Functions {#functions}

<h3>Aggregate Functions</h3>

<div class="kw-grid">
  <div class="kw-item"><div class="kw">COUNT(*)</div><div class="kd">Count all rows</div></div>
  <div class="kw-item"><div class="kw">COUNT(col)</div><div class="kd">Count non-NULL values</div></div>
  <div class="kw-item"><div class="kw">SUM(col)</div><div class="kd">Total of numeric column</div></div>
  <div class="kw-item"><div class="kw">AVG(col)</div><div class="kd">Average (ignores NULLs)</div></div>
  <div class="kw-item"><div class="kw">MIN(col)</div><div class="kd">Smallest value</div></div>
  <div class="kw-item"><div class="kw">MAX(col)</div><div class="kd">Largest value</div></div>
  <div class="kw-item"><div class="kw">GROUP_CONCAT</div><div class="kd">Concatenate group values</div></div>
  <div class="kw-item"><div class="kw">STDDEV(col)</div><div class="kd">Standard deviation</div></div>
</div>

<h3>String Functions</h3>

<pre data-lang="sql"><code>SELECT
  UPPER('hello'),              -- HELLO
  LOWER('WORLD'),              -- world
  LENGTH('sql'),               -- 3
  TRIM('  hi  '),              -- 'hi'
  SUBSTRING('Naveen', 1, 3),  -- Nav  (1-indexed)
  CONCAT('Hello', ' ', 'SQL'),-- Hello SQL
  REPLACE('abc', 'b', 'X'),   -- aXc
  INSTR('hello', 'l'),        -- 3  (position of 'l')
  LPAD('5', 3, '0'),          -- 005
  COALESCE(NULL, NULL, 'x');  -- x  (first non-NULL)</code></pre>

<h3>Date Functions</h3>

<pre data-lang="sql"><code>SELECT
  NOW(),                            -- current datetime
  CURDATE(),                        -- current date
  DATE_ADD(NOW(), INTERVAL 7 DAY),  -- 7 days from now
  DATEDIFF('2025-01-01', NOW()),    -- days between dates
  EXTRACT(YEAR FROM hire_date),     -- extract part
  DATE_FORMAT(NOW(), '%Y-%m-%d'),   -- format date
  TIMESTAMPDIFF(YEAR, dob, NOW())   -- age in years
FROM employees;</code></pre>

<h3>Conditional</h3>

<pre data-lang="sql"><code>-- CASE expression
SELECT name,
  CASE
    WHEN salary >= 100000 THEN 'Senior'
    WHEN salary >= 60000  THEN 'Mid'
    ELSE 'Junior'
  END AS level
FROM employees;

-- NULL handling
SELECT COALESCE(phone, email, 'no contact') AS contact FROM users;
SELECT NULLIF(score, 0) FROM exams;  -- returns NULL if score = 0
SELECT IFNULL(commission, 0) FROM sales;</code></pre>

---

<div class="callout tip">
  <div class="callout-title">📌 Quick Revision Checklist</div>
  <ul>
    <li>Know the <strong>execution order</strong> — explains why WHERE can't use SELECT aliases</li>
    <li>Draw JOIN Venn diagrams from memory — INNER, LEFT, RIGHT, FULL OUTER, EXCLUDING</li>
    <li>RANK vs DENSE_RANK vs ROW_NUMBER — gaps vs no gaps</li>
    <li>LAG/LEAD for time-series comparisons</li>
    <li>Index left-prefix rule for composite indexes</li>
    <li>ACID: each letter, its meaning, and a real-world analogy</li>
    <li>Normalization: 2NF = no partial dep, 3NF = no transitive dep</li>
  </ul>
</div>
