---
layout: default
title: SQL
---

<div class="hero">
  <h1>🗄️ SQL</h1>
  <p class="sub">Structured Query Language — command categories, joins, window functions, indexes, transactions, normalization.</p>
  <div class="tags">
    <span class="tag">DDL/DML</span><span class="tag">Joins</span><span class="tag">Window Functions</span>
    <span class="tag">Indexes</span><span class="tag">ACID</span><span class="tag">Normalization</span>
  </div>
</div>

<div class="toc">
  <div class="toc-h">Contents</div>
  <ol>
    <li><a href="#categories">SQL Command Categories</a></li>
    <li><a href="#execution-order">Query Execution Order</a></li>
    <li><a href="#joins">JOIN Types</a></li>
    <li><a href="#subqueries">Subqueries & CTEs</a></li>
    <li><a href="#window">Window Functions</a></li>
    <li><a href="#indexes">Indexes</a></li>
    <li><a href="#acid">Transactions & ACID</a></li>
    <li><a href="#normalization">Normalization</a></li>
    <li><a href="#functions">Common Functions</a></li>
  </ol>
</div>

---

## SQL Command Categories {#categories}

<div class="diagram">
<div class="mermaid">
flowchart TD
    SQL["🗄️ SQL Commands"]

    SQL --> DDL["DDL — Data Definition Language\nCREATE · ALTER · DROP · TRUNCATE · RENAME"]
    SQL --> DML["DML — Data Manipulation Language\nINSERT · UPDATE · DELETE"]
    SQL --> DQL["DQL — Data Query Language\nSELECT"]
    SQL --> DCL["DCL — Data Control Language\nGRANT · REVOKE"]
    SQL --> TCL["TCL — Transaction Control Language\nCOMMIT · ROLLBACK · SAVEPOINT"]
</div>
</div>

<div class="box info"><b>💡 Key Distinction</b>
<strong>DDL is auto-committed</strong> — you cannot rollback a DROP or TRUNCATE. <strong>DML can be rolled back</strong> — DELETE, INSERT, UPDATE inside a transaction. TRUNCATE is DDL (removes all rows, resets identity). DELETE is DML (logged per row, can rollback).
</div>

---

## Query Execution Order {#execution-order}

<div class="diagram">
<div class="mermaid">
flowchart LR
    subgraph W["✍️ Written Order"]
        direction TB
        w1["1 SELECT"] --> w2["2 FROM"] --> w3["3 JOIN"] --> w4["4 WHERE"] --> w5["5 GROUP BY"] --> w6["6 HAVING"] --> w7["7 ORDER BY"] --> w8["8 LIMIT"]
    end
    subgraph E["⚙️ Execution Order"]
        direction TB
        e1["1 FROM"] --> e2["2 JOIN"] --> e3["3 WHERE"] --> e4["4 GROUP BY"] --> e5["5 HAVING"] --> e6["6 SELECT"] --> e7["7 ORDER BY"] --> e8["8 LIMIT"]
    end
</div>
</div>

<div class="box warn"><b>⚠️ Common Gotchas</b>
<ul>
<li><strong>WHERE cannot use SELECT aliases</strong> — WHERE runs before SELECT.</li>
<li><strong>HAVING filters after GROUP BY</strong> — use for aggregate conditions: <code>HAVING COUNT(*) > 5</code></li>
<li><strong>ORDER BY CAN use SELECT aliases</strong> — it runs after SELECT.</li>
</ul>
</div>

<pre data-lang="sql"><code>SELECT   department, COUNT(*) AS emp_count, AVG(salary) AS avg_sal
FROM     employees
JOIN     departments USING (dept_id)
WHERE    hire_date >= '2020-01-01'        -- runs before GROUP BY
GROUP BY department
HAVING   COUNT(*) > 5                     -- filters after grouping
ORDER BY avg_sal DESC                     -- can use alias here
LIMIT    10;</code></pre>

---

## JOIN Types {#joins}

<div class="diagram">
<div class="mermaid">
flowchart TD
    JOINS["🔗 SQL JOINs"]
    JOINS --> INNER["INNER JOIN\nOnly matching rows in BOTH tables"]
    JOINS --> LEFT["LEFT JOIN\nAll from left + matched from right\n(NULL if no match on right)"]
    JOINS --> RIGHT["RIGHT JOIN\nAll from right + matched from left\n(NULL if no match on left)"]
    JOINS --> FULL["FULL OUTER JOIN\nAll rows from both tables\n(NULLs where no match)"]
    JOINS --> CROSS["CROSS JOIN\nCartesian product — every A × every B\nm × n rows"]
    JOINS --> SELF["SELF JOIN\nJoin table with itself\n(manager → employee)"]
    JOINS --> EXCL["LEFT EXCLUDING\nRows in A with NO match in B\nWHERE B.id IS NULL"]
</div>
</div>

<div class="tw">
<table>
  <thead><tr><th>JOIN</th><th>Returns</th><th>Example Use Case</th></tr></thead>
  <tbody>
    <tr><td><strong>INNER</strong></td><td>Matched rows only</td><td>Orders with a valid customer</td></tr>
    <tr><td><strong>LEFT</strong></td><td>All left + matched right</td><td>All customers, with orders if they have any</td></tr>
    <tr><td><strong>RIGHT</strong></td><td>All right + matched left</td><td>All products, even unsold ones</td></tr>
    <tr><td><strong>FULL OUTER</strong></td><td>Everything from both</td><td>Audit/reconciliation reports</td></tr>
    <tr><td><strong>CROSS</strong></td><td>Every combination</td><td>Generate size × color combinations</td></tr>
    <tr><td><strong>SELF</strong></td><td>Row paired with related row in same table</td><td>Employee → Manager hierarchy</td></tr>
  </tbody>
</table>
</div>

<pre data-lang="sql"><code>-- INNER JOIN
SELECT e.name, d.name AS dept
FROM employees e
INNER JOIN departments d ON e.dept_id = d.id;

-- LEFT JOIN — customers with no orders (orphan detection)
SELECT c.name, o.order_id
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
WHERE o.id IS NULL;    -- LEFT EXCLUDING pattern

-- SELF JOIN — manager name
SELECT e.name, m.name AS manager
FROM employees e
JOIN employees m ON e.manager_id = m.id;</code></pre>

---

## Subqueries & CTEs {#subqueries}

<pre data-lang="sql"><code>-- Scalar subquery in WHERE
SELECT * FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees);

-- EXISTS (faster than IN for large sets — short-circuits)
SELECT * FROM orders o
WHERE EXISTS (
    SELECT 1 FROM customers c
    WHERE c.id = o.customer_id AND c.country = 'IN'
);

-- CTE (readability + reusability)
WITH dept_avg AS (
    SELECT dept_id, AVG(salary) AS avg_sal
    FROM employees GROUP BY dept_id
)
SELECT e.name, e.salary, d.avg_sal
FROM employees e
JOIN dept_avg d ON e.dept_id = d.dept_id
WHERE e.salary > d.avg_sal;

-- Recursive CTE (org hierarchy)
WITH RECURSIVE org AS (
    SELECT id, name, manager_id, 1 AS lvl
    FROM employees WHERE manager_id IS NULL
    UNION ALL
    SELECT e.id, e.name, e.manager_id, o.lvl + 1
    FROM employees e JOIN org o ON e.manager_id = o.id
)
SELECT * FROM org ORDER BY lvl;</code></pre>

---

## Window Functions {#window}

<div class="diagram">
<div class="mermaid">
flowchart LR
    WF["Window Functions\nfn() OVER (PARTITION BY ... ORDER BY ...)"]
    WF --> RANK["Ranking\nROW_NUMBER · RANK · DENSE_RANK · NTILE"]
    WF --> OFFSET["Offset\nLAG · LEAD · FIRST_VALUE · LAST_VALUE"]
    WF --> AGG["Running Aggregates\nSUM OVER · AVG OVER · COUNT OVER"]
</div>
</div>

<div class="tw">
<table>
  <thead><tr><th>Function</th><th>Ties?</th><th>Gaps?</th><th>Use Case</th></tr></thead>
  <tbody>
    <tr><td><code>ROW_NUMBER()</code></td><td>Unique per row</td><td>—</td><td>De-duplication, pagination</td></tr>
    <tr><td><code>RANK()</code></td><td>Same rank for ties</td><td>✅ Gap after tie (1,1,3)</td><td>Competition rankings</td></tr>
    <tr><td><code>DENSE_RANK()</code></td><td>Same rank for ties</td><td>❌ No gap (1,1,2)</td><td>Top-N per group</td></tr>
    <tr><td><code>LAG(col, n)</code></td><td>—</td><td>—</td><td>Previous row value (MoM comparison)</td></tr>
    <tr><td><code>LEAD(col, n)</code></td><td>—</td><td>—</td><td>Next row value (forecast delta)</td></tr>
  </tbody>
</table>
</div>

<pre data-lang="sql"><code>-- Top 1 salary per department
WITH ranked AS (
    SELECT *, DENSE_RANK() OVER (PARTITION BY dept ORDER BY salary DESC) AS rk
    FROM employees
)
SELECT * FROM ranked WHERE rk = 1;

-- Month-over-month revenue change
SELECT month, revenue,
    LAG(revenue) OVER (ORDER BY month)          AS prev_month,
    revenue - LAG(revenue) OVER (ORDER BY month) AS delta
FROM monthly_sales;

-- Running total
SELECT date, amount,
    SUM(amount) OVER (ORDER BY date ROWS UNBOUNDED PRECEDING) AS running_total
FROM sales;</code></pre>

---

## Indexes {#indexes}

<div class="diagram">
<div class="mermaid">
flowchart TD
    IDX["🗂️ Index Types"]
    IDX --> BT["B-Tree (default)\n✅ Range, ORDER BY, LIKE 'abc%'"]
    IDX --> HS["Hash\n✅ Exact equality only\n❌ No range queries"]
    IDX --> CI["Composite\nMulti-column — follow left-prefix rule"]
    IDX --> PI["Partial\nWHERE clause — smaller, faster for sparse data"]
    IDX --> UI["Unique Index\nEnforce uniqueness + speed"]
</div>
</div>

<div class="box warn"><b>⚠️ Index Pitfalls</b>
<ul>
<li>Functions on column kill index: <code>WHERE YEAR(date) = 2024</code> → use <code>BETWEEN</code> instead</li>
<li>Leading % bypasses index: <code>LIKE '%Kumar'</code> → full scan</li>
<li>Implicit type cast prevents index use</li>
<li>Left-prefix rule: index on (A, B, C) — query on B alone = ❌ no index</li>
</ul>
</div>

---

## Transactions & ACID {#acid}

<div class="diagram">
<div class="mermaid">
flowchart LR
    ACID["🔐 ACID Properties"]
    ACID --> A["Atomicity\nAll or nothing\nNo partial state"]
    ACID --> C["Consistency\nDB goes valid state → valid state\nAll constraints maintained"]
    ACID --> I["Isolation\nConcurrent transactions\nbehave as if serial"]
    ACID --> D["Durability\nCommitted data persists\neven after crash (WAL)"]
</div>
</div>

<div class="tw">
<table>
  <thead><tr><th>Isolation Level</th><th>Dirty Read</th><th>Non-Repeatable Read</th><th>Phantom Read</th></tr></thead>
  <tbody>
    <tr><td><strong>READ UNCOMMITTED</strong></td><td>✅ possible</td><td>✅ possible</td><td>✅ possible</td></tr>
    <tr><td><strong>READ COMMITTED</strong></td><td>❌ prevented</td><td>✅ possible</td><td>✅ possible</td></tr>
    <tr><td><strong>REPEATABLE READ</strong></td><td>❌ prevented</td><td>❌ prevented</td><td>✅ possible</td></tr>
    <tr><td><strong>SERIALIZABLE</strong></td><td>❌ prevented</td><td>❌ prevented</td><td>❌ prevented</td></tr>
  </tbody>
</table>
</div>

<pre data-lang="sql"><code>BEGIN;
    UPDATE accounts SET balance = balance - 1000 WHERE id = 1;
    UPDATE accounts SET balance = balance + 1000 WHERE id = 2;
COMMIT;

-- Partial rollback
BEGIN;
    INSERT INTO orders VALUES (...);
    SAVEPOINT after_order;
    INSERT INTO payments VALUES (...);
    ROLLBACK TO SAVEPOINT after_order;  -- undo payment, keep order
COMMIT;</code></pre>

---

## Normalization {#normalization}

<div class="diagram">
<div class="mermaid">
flowchart LR
    RAW["Unnormalized\n(redundant data)"] -->|"Atomic values\nno repeating groups"| N1["1NF"]
    N1 -->|"No partial\ndependency"| N2["2NF"]
    N2 -->|"No transitive\ndependency"| N3["3NF"]
    N3 -->|"Every determinant\nis a superkey"| BCNF["BCNF"]
</div>
</div>

<div class="tw">
<table>
  <thead><tr><th>Form</th><th>Rule</th><th>Violation Example</th><th>Fix</th></tr></thead>
  <tbody>
    <tr><td><strong>1NF</strong></td><td>Atomic values, no repeating groups, unique rows</td><td><code>phone = "9999, 8888"</code> in one cell</td><td>Separate phones into own table</td></tr>
    <tr><td><strong>2NF</strong></td><td>1NF + no partial dependency (non-key depends on WHOLE PK)</td><td>Table(student_id, course_id, student_name) — name depends only on student_id</td><td>Move student_name to Students table</td></tr>
    <tr><td><strong>3NF</strong></td><td>2NF + no transitive dependency</td><td>emp_id → dept_id → dept_name (dept_name depends on dept_id, not emp_id)</td><td>Separate Departments table</td></tr>
    <tr><td><strong>BCNF</strong></td><td>Every determinant must be a superkey</td><td>Multiple overlapping candidate keys causing anomalies</td><td>Decompose further</td></tr>
  </tbody>
</table>
</div>

---

## Common Functions {#functions}

<pre data-lang="sql"><code>-- String
SELECT UPPER(name), LOWER(name), LENGTH(name),
       TRIM('  hello  '), SUBSTRING(name, 1, 3),
       CONCAT(first_name, ' ', last_name),
       REPLACE(phone, '-', ''),
       COALESCE(phone, email, 'no contact')   -- first non-NULL
FROM employees;

-- Date
SELECT NOW(), CURDATE(),
       DATE_ADD(NOW(), INTERVAL 7 DAY),
       DATEDIFF('2025-01-01', hire_date),
       EXTRACT(YEAR FROM hire_date),
       DATE_FORMAT(NOW(), '%Y-%m-%d'),
       TIMESTAMPDIFF(YEAR, dob, NOW()) AS age
FROM employees;

-- Conditional
SELECT name,
    CASE
        WHEN salary >= 100000 THEN 'Senior'
        WHEN salary >= 60000  THEN 'Mid'
        ELSE 'Junior'
    END AS band,
    NULLIF(bonus, 0),            -- NULL if bonus = 0
    IFNULL(commission, 0)        -- replace NULL with 0
FROM employees;</code></pre>
