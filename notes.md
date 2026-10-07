---
layout: default
title: Notes
---

# 📒 Notes

<style>
  /* mind maps are wide: keep text readable and let the diagram box scroll sideways */
  .diagram .mermaid svg{min-width:880px}
</style>

<p class="sub" style="color:var(--muted);font-size:.85rem;margin-bottom:1rem;">
  Every topic on this site as one diagram-first map. Start with the master map, then jump to a sub topic.
</p>

<div class="toc">
  <div class="toc-h">Sub Topics</div>
  <ol>
    <li><a href="#sql">SQL</a></li>
    <li><a href="#java">Java</a></li>
    <li><a href="#python">Python</a></li>
    <li><a href="#aws">AWS</a></li>
    <li><a href="#docker">Docker</a></li>
    <li><a href="#git">Git</a></li>
    <li><a href="#cicd">CI/CD</a></li>
    <li><a href="#jenkins">Jenkins</a></li>
    <li><a href="#airflow">Apache Airflow</a></li>
    <li><a href="#data-engineer">Data Engineering</a></li>
  </ol>
</div>

<div class="diagram">
<div class="diagram-label">master map — all sub topics</div>
<div class="mermaid">
mindmap
  root((Notes))
    SQL
      Command types DDL DML DQL DCL TCL
      Execution order
      Joins
      Subqueries and CTEs
      Window functions
      Indexes
      ACID and isolation
      Normalization
    Java
      JVM architecture
      OOP pillars
      Collections
      Exceptions
      Multithreading
      Stream API
    Python
      Ecosystem
      Data types
      OOP and dataclasses
      Functional features
      Generators
      Async await
      Pandas
    AWS
      Compute
      Storage
      Database
      Networking
      Security and IAM
      Messaging
      Analytics
      DevOps and monitoring
    Docker
      Architecture
      Image and container lifecycle
      Container vs VM
      Dockerfile
      Compose
      Networking
    Git
      Four areas
      Git Flow
      GitHub Flow
      Merge vs rebase
      Cherry-pick stash reset
      Hooks
    CI/CD
      CI vs delivery vs deployment
      Pipeline stages
      Tools comparison
      GitHub Actions
      Deployment strategies
    Jenkins
      Controller and agents
      Declarative vs scripted
      Jenkinsfile
      Plugins
      Shared libraries
    Airflow
      Architecture
      DAG concepts
      Operators
      XCom
      Executors
    Data Engineering
      Pipeline architecture
      ETL vs ELT
      Lake vs warehouse
      Batch vs streaming
      Formats
      Spark
      dbt
      Medallion layers
</div>
</div>

<div class="diagram">
<div class="diagram-label">how the topics connect — code to analytics</div>
<div class="mermaid">
flowchart LR
    LANG["💻 Languages\nJava · Python · SQL"] --> GIT["🔀 Git\nversion control"]
    GIT --> CICD["🔄 CI/CD\nJenkins · GitHub Actions"]
    CICD --> DOCK["🐳 Docker\nimage + container"]
    DOCK --> AWS["☁️ AWS\nECS · Lambda · EC2"]
    LANG --> DE["📊 Data Engineering\nSpark · dbt · lake"]
    AIR["🌊 Airflow\norchestration"] --> DE
    DE --> AWS
    SQLN["🗄️ SQL\nwarehouse queries"] --> DE
</div>
</div>


---

## SQL {#sql}

SQL (Structured Query Language) is the standard language for defining, querying and controlling data in relational databases such as MySQL, PostgreSQL, Oracle and SQL Server. You describe WHAT data you want; the database optimiser decides HOW to fetch it. These notes go from command categories and joins to transactions, locking, normalization and tuning.

<div class="diagram">
<div class="diagram-label">mind map — SQL</div>
<div class="mermaid">
mindmap
  root((SQL))
    Command categories
      DDL
        CREATE ALTER DROP TRUNCATE
        auto-committed
      DML
        INSERT UPDATE DELETE
        can rollback
      DQL
        SELECT
      DCL
        GRANT REVOKE
      TCL
        COMMIT ROLLBACK SAVEPOINT
    Joins
      INNER matched rows only
      LEFT all left plus matches
      RIGHT all right plus matches
      FULL OUTER everything
      CROSS cartesian product
      SELF same table
      LEFT EXCLUDING where right is NULL
    Subqueries and CTEs
      Scalar subquery
      EXISTS short-circuits
      WITH CTE
      Recursive CTE for hierarchy
    Window functions
      Ranking
        ROW_NUMBER
        RANK gaps after ties
        DENSE_RANK no gaps
        NTILE
      Offset
        LAG previous row
        LEAD next row
      Running aggregates
        SUM OVER
    Indexes
      B-Tree default
      Hash equality only
      Composite left-prefix rule
      Partial
      Unique
    Normalization
      1NF atomic values
      2NF no partial dependency
      3NF no transitive dependency
      BCNF determinant is superkey
</div>
</div>

### SQL Command Categories (DDL, DML, DQL, DCL, TCL)

SQL statements are grouped by what they act upon. Knowing the group tells you whether the statement can be rolled back, whether it needs special privileges, and whether it locks the whole table.

<div class="diagram">
<div class="diagram-label">flowchart — SQL command families</div>
<div class="mermaid">
flowchart TD
    SQL["SQL Commands"]
    SQL --> DDL["DDL - structure\nCREATE ALTER DROP TRUNCATE RENAME"]
    SQL --> DML["DML - data changes\nINSERT UPDATE DELETE MERGE"]
    SQL --> DQL["DQL - reading\nSELECT"]
    SQL --> DCL["DCL - permissions\nGRANT REVOKE"]
    SQL --> TCL["TCL - transactions\nCOMMIT ROLLBACK SAVEPOINT"]
</div>
</div>

<div class="tw"><table><thead><tr><th>Category</th><th>Commands</th><th>Acts on</th><th>Rollback?</th></tr></thead><tbody>
<tr><td><strong>DDL</strong></td><td>CREATE, ALTER, DROP, TRUNCATE, RENAME</td><td>Schema objects (tables, indexes, views)</td><td>No in MySQL/Oracle (implicit commit). PostgreSQL and SQL Server allow transactional DDL</td></tr>
<tr><td><strong>DML</strong></td><td>INSERT, UPDATE, DELETE, MERGE</td><td>Rows</td><td>Yes, until COMMIT</td></tr>
<tr><td><strong>DQL</strong></td><td>SELECT</td><td>Reads rows</td><td>Nothing to roll back</td></tr>
<tr><td><strong>DCL</strong></td><td>GRANT, REVOKE</td><td>Privileges</td><td>No (auto-commit)</td></tr>
<tr><td><strong>TCL</strong></td><td>COMMIT, ROLLBACK, SAVEPOINT, SET TRANSACTION</td><td>Transaction boundaries</td><td>-</td></tr>
</tbody></table></div>

<pre data-lang="sql"><code>-- DDL: create a table
CREATE TABLE accounts (
    id       INT PRIMARY KEY,
    holder   VARCHAR(50) NOT NULL,
    balance  DECIMAL(12,2) DEFAULT 0
);
ALTER TABLE accounts ADD COLUMN branch VARCHAR(20);   -- change structure

-- DML: change rows
INSERT INTO accounts (id, holder, balance) VALUES (1, 'Asha', 5000);
UPDATE accounts SET balance = balance + 250 WHERE id = 1;
DELETE FROM accounts WHERE balance = 0;

-- DCL: permissions
GRANT SELECT, INSERT ON accounts TO report_user;
REVOKE INSERT ON accounts FROM report_user;

-- TCL
BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
ROLLBACK;     -- balance is back to what it was</code></pre>

#### DELETE vs TRUNCATE vs DROP

<div class="tw"><table><thead><tr><th>Aspect</th><th>DELETE</th><th>TRUNCATE</th><th>DROP</th></tr></thead><tbody>
<tr><td>Type</td><td>DML</td><td>DDL</td><td>DDL</td></tr>
<tr><td>Removes</td><td>Chosen rows (WHERE) or all</td><td>All rows only</td><td>Rows AND table structure</td></tr>
<tr><td>WHERE clause</td><td>Yes</td><td>No</td><td>No</td></tr>
<tr><td>Speed</td><td>Slow (row-by-row logging)</td><td>Fast (deallocates pages)</td><td>Fast</td></tr>
<tr><td>Identity / AUTO_INCREMENT</td><td>Not reset</td><td>Reset</td><td>Gone</td></tr>
<tr><td>Triggers fire</td><td>Yes</td><td>No</td><td>No</td></tr>
<tr><td>Rollback</td><td>Yes</td><td>Usually no</td><td>Usually no</td></tr>
</tbody></table></div>

<div class="box info"><b>💡 Interview quick answer</b> DDL changes the shape of the database and is auto-committed in most engines; DML changes the content and is transactional. TRUNCATE is DDL even though it deletes data, which is why it cannot be rolled back in MySQL or Oracle.</div>

### Query Execution Order (logical processing)

You write SELECT first, but the database logically processes FROM first. This explains almost every "why can't I use my alias here" error. The optimiser may physically reorder work, but the result must behave as if this logical order was followed.

<div class="diagram">
<div class="diagram-label">flowchart — logical execution order</div>
<div class="mermaid">
flowchart LR
    F["1 FROM\nJOIN"] --> W["2 WHERE\nrow filter"] --> G["3 GROUP BY"] --> H["4 HAVING\ngroup filter"] --> S["5 SELECT\naliases born here\nwindow functions"] --> D["6 DISTINCT"] --> O["7 ORDER BY\ncan use aliases"] --> L["8 LIMIT / TOP"]
</div>
</div>

<pre data-lang="sql"><code>SELECT   d.name AS dept, COUNT(*) AS emp_count, AVG(e.salary) AS avg_sal
FROM     employees e
JOIN     departments d ON d.id = e.dept_id
WHERE    e.hire_date &gt;= '2020-01-01'      -- 2) runs before grouping, cannot see aliases
GROUP BY d.name                          -- 3)
HAVING   COUNT(*) &gt; 5                    -- 4) filters whole groups
ORDER BY avg_sal DESC                    -- 7) alias allowed here
LIMIT    10;                             -- 8)</code></pre>

<div class="box warn"><b>⚠️ Consequences of the order</b>
<ul>
<li><code>WHERE total &gt; 100</code> fails if <code>total</code> is a SELECT alias. Repeat the expression or wrap the query in a subquery or CTE.</li>
<li><code>WHERE COUNT(*) &gt; 5</code> is illegal: aggregates do not exist yet at WHERE time. Use HAVING.</li>
<li>Window functions are evaluated at the SELECT step, so you cannot filter on them in WHERE of the same query. Put them in a CTE and filter outside.</li>
<li>ON-clause conditions in an OUTER JOIN filter before NULL-padding; WHERE conditions filter after. This changes results (see joins).</li>
</ul></div>

### Sample Tables Used Throughout

All join examples use these two tiny tables so you can verify results by hand. Note that John has no department (NULL) and HR has no employees.

<div class="tw"><table><thead><tr><th colspan="3">employees</th><th></th><th colspan="2">departments</th></tr><tr><th>emp_id</th><th>name</th><th>dept_id</th><th></th><th>dept_id</th><th>dept_name</th></tr></thead><tbody>
<tr><td>1</td><td>Asha</td><td>10</td><td></td><td>10</td><td>Engineering</td></tr>
<tr><td>2</td><td>Ravi</td><td>10</td><td></td><td>20</td><td>Sales</td></tr>
<tr><td>3</td><td>Meera</td><td>20</td><td></td><td>30</td><td>HR</td></tr>
<tr><td>4</td><td>John</td><td>NULL</td><td></td><td></td><td></td></tr>
</tbody></table></div>

### JOIN Types with Result Rows

A JOIN combines columns from two tables by matching rows on a condition. The join type decides what happens to rows that find no match.

<div class="diagram">
<div class="diagram-label">flowchart — which rows each join keeps</div>
<div class="mermaid">
flowchart TD
    J["JOIN A with B"]
    J --> I["INNER\nmatched rows only"]
    J --> L["LEFT\nall A + matched B\nNULL for unmatched B"]
    J --> R["RIGHT\nall B + matched A"]
    J --> F["FULL OUTER\nall A and all B"]
    J --> C["CROSS\nevery A x every B"]
    J --> S["SELF\ntable joined to itself"]
    L --> LX["LEFT EXCLUDING\nLEFT + WHERE B.key IS NULL"]
</div>
</div>

#### INNER JOIN

<pre data-lang="sql"><code>SELECT e.name, d.dept_name
FROM employees e
INNER JOIN departments d ON e.dept_id = d.dept_id;</code></pre>

<div class="tw"><table><thead><tr><th>name</th><th>dept_name</th></tr></thead><tbody>
<tr><td>Asha</td><td>Engineering</td></tr><tr><td>Ravi</td><td>Engineering</td></tr><tr><td>Meera</td><td>Sales</td></tr>
</tbody></table></div>

John (NULL never equals anything) and HR (no employees) are dropped.

#### LEFT JOIN

<pre data-lang="sql"><code>SELECT e.name, d.dept_name
FROM employees e
LEFT JOIN departments d ON e.dept_id = d.dept_id;</code></pre>

<div class="tw"><table><thead><tr><th>name</th><th>dept_name</th></tr></thead><tbody>
<tr><td>Asha</td><td>Engineering</td></tr><tr><td>Ravi</td><td>Engineering</td></tr><tr><td>Meera</td><td>Sales</td></tr><tr><td>John</td><td>NULL</td></tr>
</tbody></table></div>

#### RIGHT JOIN

<pre data-lang="sql"><code>SELECT e.name, d.dept_name
FROM employees e
RIGHT JOIN departments d ON e.dept_id = d.dept_id;</code></pre>

<div class="tw"><table><thead><tr><th>name</th><th>dept_name</th></tr></thead><tbody>
<tr><td>Asha</td><td>Engineering</td></tr><tr><td>Ravi</td><td>Engineering</td></tr><tr><td>Meera</td><td>Sales</td></tr><tr><td>NULL</td><td>HR</td></tr>
</tbody></table></div>

A RIGHT JOIN is just a LEFT JOIN with the tables swapped; most teams standardise on LEFT only for readability.

#### FULL OUTER JOIN

<pre data-lang="sql"><code>SELECT e.name, d.dept_name
FROM employees e
FULL OUTER JOIN departments d ON e.dept_id = d.dept_id;
-- MySQL has no FULL JOIN: emulate with LEFT JOIN ... UNION ... RIGHT JOIN</code></pre>

<div class="tw"><table><thead><tr><th>name</th><th>dept_name</th></tr></thead><tbody>
<tr><td>Asha</td><td>Engineering</td></tr><tr><td>Ravi</td><td>Engineering</td></tr><tr><td>Meera</td><td>Sales</td></tr><tr><td>John</td><td>NULL</td></tr><tr><td>NULL</td><td>HR</td></tr>
</tbody></table></div>

#### LEFT EXCLUDING (anti-join)

<pre data-lang="sql"><code>-- Employees that belong to no valid department
SELECT e.name
FROM employees e
LEFT JOIN departments d ON e.dept_id = d.dept_id
WHERE d.dept_id IS NULL;      -- result: John

-- Departments with no employees
SELECT d.dept_name
FROM departments d
LEFT JOIN employees e ON e.dept_id = d.dept_id
WHERE e.emp_id IS NULL;       -- result: HR</code></pre>

#### CROSS JOIN

Every row of A paired with every row of B: m x n rows. No ON clause.

<pre data-lang="sql"><code>-- sizes(S, M)  x  colors(Red, Blue)
SELECT s.size, c.color FROM sizes s CROSS JOIN colors c;</code></pre>

<div class="tw"><table><thead><tr><th>size</th><th>color</th></tr></thead><tbody>
<tr><td>S</td><td>Red</td></tr><tr><td>S</td><td>Blue</td></tr><tr><td>M</td><td>Red</td></tr><tr><td>M</td><td>Blue</td></tr>
</tbody></table></div>

#### SELF JOIN

Same table used twice under different aliases. Typical for hierarchies and "find pairs" problems.

<pre data-lang="sql"><code>-- employees(emp_id, name, manager_id)
-- 1 Asha NULL | 2 Ravi 1 | 3 Meera 1 | 4 John 2
SELECT e.name AS employee, m.name AS manager
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.emp_id;</code></pre>

<div class="tw"><table><thead><tr><th>employee</th><th>manager</th></tr></thead><tbody>
<tr><td>Asha</td><td>NULL</td></tr><tr><td>Ravi</td><td>Asha</td></tr><tr><td>Meera</td><td>Asha</td></tr><tr><td>John</td><td>Ravi</td></tr>
</tbody></table></div>

<div class="box warn"><b>⚠️ ON vs WHERE in outer joins</b> <code>LEFT JOIN d ON ... AND d.dept_name = 'Sales'</code> keeps every employee (non-Sales get NULL). Moving the same predicate into WHERE removes non-Sales employees and silently turns the LEFT JOIN into an INNER JOIN.</div>

<div class="tw"><table><thead><tr><th>JOIN</th><th>Rows for sample data</th><th>Typical use</th></tr></thead><tbody>
<tr><td>INNER</td><td>3</td><td>Orders with a valid customer</td></tr>
<tr><td>LEFT</td><td>4</td><td>All customers, orders if any</td></tr>
<tr><td>RIGHT</td><td>4</td><td>All products even if unsold</td></tr>
<tr><td>FULL</td><td>5</td><td>Reconciliation between two systems</td></tr>
<tr><td>CROSS</td><td>4 x 3 = 12</td><td>Generating combinations, calendars</td></tr>
<tr><td>LEFT EXCLUDING</td><td>1 (John)</td><td>Orphan detection, "never ordered"</td></tr>
</tbody></table></div>

### Subqueries (scalar, IN, EXISTS, correlated)

A subquery is a SELECT nested inside another statement. It can return one value (scalar), one column (for IN), or a table (in FROM, called a derived table).

<pre data-lang="sql"><code>-- 1) Scalar subquery: employees paid above company average
SELECT name, salary FROM employees
WHERE salary &gt; (SELECT AVG(salary) FROM employees);

-- 2) IN subquery: customers who placed any order
SELECT name FROM customers
WHERE id IN (SELECT customer_id FROM orders);

-- 3) EXISTS: stops at the first match (short-circuit)
SELECT c.name FROM customers c
WHERE EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id);

-- 4) Correlated subquery: refers to the outer row, runs once per outer row (conceptually)
SELECT e.name, e.salary
FROM employees e
WHERE e.salary &gt; (SELECT AVG(salary) FROM employees WHERE dept_id = e.dept_id);

-- 5) Derived table in FROM
SELECT t.dept_id, t.total
FROM (SELECT dept_id, SUM(salary) AS total FROM employees GROUP BY dept_id) t
WHERE t.total &gt; 200000;</code></pre>

<div class="tw"><table><thead><tr><th>Form</th><th>Good for</th><th>NULL behaviour</th></tr></thead><tbody>
<tr><td>IN (subquery)</td><td>Small result list</td><td>Fine</td></tr>
<tr><td>NOT IN (subquery)</td><td>-</td><td><strong>Dangerous</strong>: if the subquery returns any NULL, the whole predicate becomes UNKNOWN and returns no rows</td></tr>
<tr><td>EXISTS / NOT EXISTS</td><td>Large outer table, existence checks</td><td>Safe, ignores NULLs</td></tr>
<tr><td>JOIN</td><td>When you need columns from both</td><td>Can duplicate rows if 1-to-many</td></tr>
</tbody></table></div>

<pre data-lang="sql"><code>-- Customers who never ordered: prefer NOT EXISTS over NOT IN
SELECT c.name FROM customers c
WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id);</code></pre>

<div class="box tip"><b>✅ Rule of thumb</b> Use EXISTS for "is there any related row", JOIN when you need data from the related table, and avoid NOT IN against nullable columns. Modern optimisers often rewrite IN and EXISTS into the same semi-join plan, so choose for correctness and clarity first.</div>

### Nth Highest Salary (classic subquery problems)

<pre data-lang="sql"><code>-- salaries: 120000, 90000, 90000, 80000, 70000
-- 2nd highest DISTINCT salary (answer 90000)
SELECT MAX(salary) FROM employees
WHERE salary &lt; (SELECT MAX(salary) FROM employees);

-- Nth highest with OFFSET (N = 3 -&gt; OFFSET 2)
SELECT DISTINCT salary FROM employees
ORDER BY salary DESC
LIMIT 1 OFFSET 2;                  -- 80000

-- Robust: DENSE_RANK
SELECT salary FROM (
    SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) AS rk
    FROM employees
) t WHERE rk = 3 LIMIT 1;          -- 80000

-- Delete duplicate rows keeping the lowest id
DELETE FROM users
WHERE id NOT IN (SELECT MIN(id) FROM (SELECT * FROM users) u GROUP BY email);</code></pre>

### Common Table Expressions (CTE)

A CTE is a named temporary result defined with WITH that exists only for the statement. It makes a long query readable by naming each step, and the same CTE can be referenced more than once.

<pre data-lang="sql"><code>WITH dept_avg AS (
    SELECT dept_id, AVG(salary) AS avg_sal
    FROM employees
    GROUP BY dept_id
),
high_paid AS (
    SELECT e.name, e.salary, e.dept_id
    FROM employees e
    JOIN dept_avg d ON d.dept_id = e.dept_id
    WHERE e.salary &gt; d.avg_sal
)
SELECT h.name, h.salary, dp.dept_name
FROM high_paid h
JOIN departments dp ON dp.dept_id = h.dept_id
ORDER BY h.salary DESC;</code></pre>

<div class="diagram">
<div class="diagram-label">flowchart — chained CTEs</div>
<div class="mermaid">
flowchart LR
    E["employees"] --> A["CTE dept_avg\naverage salary per dept"]
    A --> H["CTE high_paid\nsalary above own dept average"]
    E --> H
    H --> F["final SELECT\njoin department names"]
</div>
</div>

<div class="box info"><b>💡 CTE vs subquery vs temp table</b> A CTE is about readability; in PostgreSQL 12+ and MySQL 8 it is usually inlined like a subquery. A temp table is physically stored, can be indexed and reused across statements, which wins when the same heavy intermediate result is used many times.</div>

### Recursive CTE (hierarchies and series)

A recursive CTE has an anchor member (starting rows) UNION ALL a recursive member that joins back to the CTE itself. The engine repeats the recursive step until it returns no new rows. Use it for org charts, category trees, bill of materials and number or date series.

<div class="diagram">
<div class="diagram-label">flowchart — recursive CTE iteration</div>
<div class="mermaid">
flowchart TD
    A["Anchor member\nrows with manager_id IS NULL"] --> R["Working set level 1"]
    R --> S["Recursive member\njoin employees to working set"]
    S --> Q{"New rows\nproduced?"}
    Q -->|"yes"| R2["Append rows\nnext working set"]
    R2 --> S
    Q -->|"no"| E["Stop and return all rows"]
</div>
</div>

<pre data-lang="sql"><code>-- employees: 1 Asha (CEO) | 2 Ravi -&gt; 1 | 3 Meera -&gt; 1 | 4 John -&gt; 2
WITH RECURSIVE org AS (
    SELECT emp_id, name, manager_id, 1 AS lvl, CAST(name AS CHAR(200)) AS path
    FROM employees WHERE manager_id IS NULL            -- anchor
    UNION ALL
    SELECT e.emp_id, e.name, e.manager_id, o.lvl + 1, CONCAT(o.path, ' &gt; ', e.name)
    FROM employees e
    JOIN org o ON e.manager_id = o.emp_id              -- recursive step
)
SELECT * FROM org ORDER BY path;</code></pre>

<div class="tw"><table><thead><tr><th>emp_id</th><th>name</th><th>lvl</th><th>path</th></tr></thead><tbody>
<tr><td>1</td><td>Asha</td><td>1</td><td>Asha</td></tr>
<tr><td>2</td><td>Ravi</td><td>2</td><td>Asha &gt; Ravi</td></tr>
<tr><td>4</td><td>John</td><td>3</td><td>Asha &gt; Ravi &gt; John</td></tr>
<tr><td>3</td><td>Meera</td><td>2</td><td>Asha &gt; Meera</td></tr>
</tbody></table></div>

<pre data-lang="sql"><code>-- Number series 1..5 (no helper table needed)
WITH RECURSIVE n AS (
    SELECT 1 AS x
    UNION ALL
    SELECT x + 1 FROM n WHERE x &lt; 5      -- termination condition is essential
)
SELECT x FROM n;                         -- 1 2 3 4 5</code></pre>

<div class="box warn"><b>⚠️ Infinite recursion</b> If the data contains a cycle (A manages B, B manages A) the recursion never ends. Always add a depth limit (<code>WHERE lvl &lt; 20</code>) or track visited ids. SQL Server uses <code>OPTION (MAXRECURSION n)</code>, and omits the word RECURSIVE.</div>

### Aggregates, GROUP BY and HAVING

An aggregate collapses many rows into one value: COUNT, SUM, AVG, MIN, MAX. GROUP BY makes one result row per distinct group value. HAVING filters those groups after aggregation, while WHERE filters rows before it.

Orders sample data:

<div class="tw"><table><thead><tr><th>order_id</th><th>customer</th><th>amount</th><th>status</th></tr></thead><tbody>
<tr><td>1</td><td>Asha</td><td>500</td><td>PAID</td></tr><tr><td>2</td><td>Asha</td><td>300</td><td>PAID</td></tr><tr><td>3</td><td>Ravi</td><td>700</td><td>PAID</td></tr><tr><td>4</td><td>Ravi</td><td>200</td><td>CANCELLED</td></tr><tr><td>5</td><td>Meera</td><td>100</td><td>PAID</td></tr>
</tbody></table></div>

<pre data-lang="sql"><code>SELECT customer, COUNT(*) AS orders, SUM(amount) AS total
FROM orders
WHERE status = 'PAID'          -- row 4 removed BEFORE grouping
GROUP BY customer
HAVING SUM(amount) &gt; 500       -- Meera (100) removed AFTER grouping
ORDER BY total DESC;</code></pre>

<div class="tw"><table><thead><tr><th>customer</th><th>orders</th><th>total</th></tr></thead><tbody>
<tr><td>Asha</td><td>2</td><td>800</td></tr><tr><td>Ravi</td><td>1</td><td>700</td></tr>
</tbody></table></div>

<div class="diagram">
<div class="diagram-label">flowchart — WHERE then GROUP BY then HAVING</div>
<div class="mermaid">
flowchart LR
    A["5 rows"] -->|"WHERE status = PAID"| B["4 rows"]
    B -->|"GROUP BY customer"| C["3 groups\nAsha 800\nRavi 700\nMeera 100"]
    C -->|"HAVING SUM greater than 500"| D["2 groups\nAsha, Ravi"]
</div>
</div>

<div class="tw"><table><thead><tr><th>Function</th><th>Counts / computes</th><th>NULL handling</th></tr></thead><tbody>
<tr><td><code>COUNT(*)</code></td><td>All rows</td><td>Includes NULLs</td></tr>
<tr><td><code>COUNT(col)</code></td><td>Rows where col is not NULL</td><td>Skips NULLs</td></tr>
<tr><td><code>COUNT(DISTINCT col)</code></td><td>Unique non-NULL values</td><td>Skips NULLs</td></tr>
<tr><td><code>SUM / AVG / MIN / MAX</code></td><td>Over non-NULL values</td><td>AVG divides by non-NULL count, not row count</td></tr>
</tbody></table></div>

<pre data-lang="sql"><code>-- Conditional aggregation (pivot-like)
SELECT customer,
       SUM(CASE WHEN status = 'PAID' THEN amount ELSE 0 END)      AS paid_total,
       SUM(CASE WHEN status = 'CANCELLED' THEN amount ELSE 0 END) AS cancelled_total
FROM orders GROUP BY customer;

-- Find duplicate emails
SELECT email, COUNT(*) FROM users GROUP BY email HAVING COUNT(*) &gt; 1;

-- ROLLUP adds subtotal and grand total rows
SELECT region, product, SUM(sales) FROM s GROUP BY ROLLUP (region, product);</code></pre>

<div class="box warn"><b>⚠️ Every non-aggregated column in SELECT must appear in GROUP BY</b> (strict SQL modes enforce this). MySQL with ONLY_FULL_GROUP_BY off silently returns an arbitrary value, which is a classic source of wrong reports.</div>

### Window Functions

A window function computes a value for each row using a "window" of related rows, WITHOUT collapsing rows the way GROUP BY does. The syntax is <code>fn() OVER (PARTITION BY ... ORDER BY ... frame)</code>. PARTITION BY splits rows into groups, ORDER BY orders inside each group, and the frame (ROWS BETWEEN ...) limits which neighbours are used.

Staff data used below:

<div class="tw"><table><thead><tr><th>name</th><th>dept</th><th>salary</th></tr></thead><tbody>
<tr><td>Asha</td><td>Eng</td><td>120000</td></tr><tr><td>Ravi</td><td>Eng</td><td>90000</td></tr><tr><td>Kiran</td><td>Eng</td><td>90000</td></tr><tr><td>Zoya</td><td>Eng</td><td>80000</td></tr><tr><td>Meera</td><td>Sales</td><td>70000</td></tr><tr><td>Dev</td><td>Sales</td><td>60000</td></tr>
</tbody></table></div>

<pre data-lang="sql"><code>SELECT name, dept, salary,
  ROW_NUMBER() OVER (PARTITION BY dept ORDER BY salary DESC) AS rn,
  RANK()       OVER (PARTITION BY dept ORDER BY salary DESC) AS rnk,
  DENSE_RANK() OVER (PARTITION BY dept ORDER BY salary DESC) AS drnk
FROM staff;</code></pre>

<div class="tw"><table><thead><tr><th>name</th><th>dept</th><th>salary</th><th>rn</th><th>rnk</th><th>drnk</th></tr></thead><tbody>
<tr><td>Asha</td><td>Eng</td><td>120000</td><td>1</td><td>1</td><td>1</td></tr>
<tr><td>Ravi</td><td>Eng</td><td>90000</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Kiran</td><td>Eng</td><td>90000</td><td>3</td><td>2</td><td>2</td></tr>
<tr><td>Zoya</td><td>Eng</td><td>80000</td><td>4</td><td><strong>4</strong></td><td><strong>3</strong></td></tr>
<tr><td>Meera</td><td>Sales</td><td>70000</td><td>1</td><td>1</td><td>1</td></tr>
<tr><td>Dev</td><td>Sales</td><td>60000</td><td>2</td><td>2</td><td>2</td></tr>
</tbody></table></div>

ROW_NUMBER never repeats (ties are broken arbitrarily unless you add a tiebreaker column). RANK repeats on ties and then skips (1,2,2,4). DENSE_RANK repeats and does not skip (1,2,2,3).

<div class="diagram">
<div class="diagram-label">flowchart — how a window function is evaluated</div>
<div class="mermaid">
flowchart LR
    R["All rows after\nWHERE GROUP BY HAVING"] --> P["PARTITION BY dept\nsplit into windows"]
    P --> O["ORDER BY salary DESC\ninside each partition"]
    O --> F["Frame\nROWS BETWEEN ..."]
    F --> V["Function value\nattached to EACH row"]
</div>
</div>

#### LAG, LEAD, running totals, NTILE

<pre data-lang="sql"><code>-- monthly_sales: Jan 100 | Feb 150 | Mar 120
SELECT month, revenue,
       LAG(revenue)  OVER (ORDER BY month) AS prev_month,
       LEAD(revenue) OVER (ORDER BY month) AS next_month,
       revenue - LAG(revenue) OVER (ORDER BY month) AS delta
FROM monthly_sales;</code></pre>

<div class="tw"><table><thead><tr><th>month</th><th>revenue</th><th>prev_month</th><th>next_month</th><th>delta</th></tr></thead><tbody>
<tr><td>Jan</td><td>100</td><td>NULL</td><td>150</td><td>NULL</td></tr><tr><td>Feb</td><td>150</td><td>100</td><td>120</td><td>50</td></tr><tr><td>Mar</td><td>120</td><td>150</td><td>NULL</td><td>-30</td></tr>
</tbody></table></div>

<pre data-lang="sql"><code>-- Running total and 3-row moving average
SELECT month, revenue,
  SUM(revenue) OVER (ORDER BY month ROWS UNBOUNDED PRECEDING)       AS running_total,
  AVG(revenue) OVER (ORDER BY month ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) AS moving_avg3
FROM monthly_sales;
-- running_total: 100, 250, 370

-- Quartiles: split 8 employees into 4 equal buckets
SELECT name, NTILE(4) OVER (ORDER BY salary DESC) AS quartile FROM staff;

-- Top 2 salaries per department
SELECT * FROM (
   SELECT name, dept, salary,
          DENSE_RANK() OVER (PARTITION BY dept ORDER BY salary DESC) AS rk
   FROM staff
) t WHERE rk &lt;= 2;

-- Remove duplicates keeping one row per email
DELETE FROM users WHERE id IN (
   SELECT id FROM (
      SELECT id, ROW_NUMBER() OVER (PARTITION BY email ORDER BY id) AS rn FROM users
   ) x WHERE rn &gt; 1
);</code></pre>

<div class="box warn"><b>⚠️ Default frame trap</b> With ORDER BY and no frame the default is RANGE UNBOUNDED PRECEDING to CURRENT ROW, which treats tied rows as peers (both get the same running total). Specify <code>ROWS</code> explicitly for a row-by-row running sum. Also LAST_VALUE needs a frame that extends to UNBOUNDED FOLLOWING or it returns the current row.</div>

### Constraints and Keys

Constraints are rules the database enforces so bad data cannot get in, regardless of which application writes it.

<div class="tw"><table><thead><tr><th>Constraint</th><th>Meaning</th><th>Notes</th></tr></thead><tbody>
<tr><td>PRIMARY KEY</td><td>Uniquely identifies a row; implies UNIQUE + NOT NULL</td><td>One per table; may be composite; backed by a (clustered) index</td></tr>
<tr><td>FOREIGN KEY</td><td>Value must exist in the parent table key</td><td>Options: ON DELETE CASCADE / SET NULL / RESTRICT. Index the FK column</td></tr>
<tr><td>UNIQUE</td><td>No duplicate values</td><td>Many per table; NULL handling differs by engine</td></tr>
<tr><td>NOT NULL</td><td>Value required</td><td>-</td></tr>
<tr><td>CHECK</td><td>Boolean rule such as <code>salary &gt; 0</code></td><td>Enforced in MySQL 8.0.16+</td></tr>
<tr><td>DEFAULT</td><td>Value used when none supplied</td><td>-</td></tr>
</tbody></table></div>

<pre data-lang="sql"><code>CREATE TABLE customers (
    id     INT AUTO_INCREMENT PRIMARY KEY,
    email  VARCHAR(100) NOT NULL UNIQUE,
    age    INT CHECK (age &gt;= 18)
);

CREATE TABLE orders (
    id          INT PRIMARY KEY,
    customer_id INT NOT NULL,
    amount      DECIMAL(10,2) CHECK (amount &gt; 0),
    status      VARCHAR(10) DEFAULT 'NEW',
    CONSTRAINT fk_cust FOREIGN KEY (customer_id)
        REFERENCES customers(id) ON DELETE CASCADE
);

INSERT INTO orders VALUES (1, 999, 100, 'NEW');
-- ERROR: foreign key fails, customer 999 does not exist</code></pre>

<div class="tw"><table><thead><tr><th>Key type</th><th>Definition</th><th>Example</th></tr></thead><tbody>
<tr><td>Super key</td><td>Any column set that uniquely identifies a row</td><td>(id), (id, name), (email)</td></tr>
<tr><td>Candidate key</td><td>Minimal super key</td><td>id and email</td></tr>
<tr><td>Primary key</td><td>The chosen candidate key</td><td>id</td></tr>
<tr><td>Alternate key</td><td>Candidate not chosen as PK</td><td>email</td></tr>
<tr><td>Composite key</td><td>Key made of 2+ columns</td><td>(student_id, course_id)</td></tr>
<tr><td>Surrogate key</td><td>Artificial id with no business meaning</td><td>AUTO_INCREMENT, UUID</td></tr>
<tr><td>Foreign key</td><td>References another table key</td><td>orders.customer_id</td></tr>
</tbody></table></div>

### Indexes (B-Tree, composite, covering)

An index is a separate sorted structure that lets the database find rows without scanning the whole table, like a book index. The price is extra disk space and slower INSERT/UPDATE/DELETE because every index must be maintained.

<div class="diagram">
<div class="diagram-label">flowchart — B-Tree lookup of id = 42</div>
<div class="mermaid">
flowchart TD
    ROOT["Root node\n20 | 50"] -->|"20 to 50"| MID["Branch node\n30 | 40"]
    ROOT -->|"less than 20"| L1["Leaf 1 to 19"]
    ROOT -->|"over 50"| L3["Leaf 51 and up"]
    MID --> LF["Leaf 41 to 49\nid 42 row pointer"]
    LF --> ROW["Fetch row from table"]
</div>
</div>

A B-Tree keeps keys sorted, so it supports equality, ranges (<code>BETWEEN</code>, <code>&gt;</code>), <code>ORDER BY</code> and prefix <code>LIKE 'abc%'</code>. A lookup touches only 3-4 pages even for millions of rows (O(log n)).

<div class="tw"><table><thead><tr><th>Index type</th><th>Best for</th><th>Limits</th></tr></thead><tbody>
<tr><td>B-Tree (default)</td><td>Equality, range, sorting, prefix LIKE</td><td>-</td></tr>
<tr><td>Hash</td><td>Exact equality only</td><td>No range or ORDER BY</td></tr>
<tr><td>Clustered</td><td>Table rows physically stored in key order (InnoDB PK)</td><td>One per table</td></tr>
<tr><td>Non-clustered (secondary)</td><td>Leaf holds key + pointer or PK value</td><td>Extra lookup unless covering</td></tr>
<tr><td>Composite</td><td>Queries filtering on several columns</td><td>Left-prefix rule</td></tr>
<tr><td>Covering</td><td>Index contains all columns the query needs, no table access</td><td>Wider index</td></tr>
<tr><td>Partial / filtered</td><td>Index only rows matching a WHERE (sparse data)</td><td>PostgreSQL, SQL Server</td></tr>
<tr><td>Unique</td><td>Uniqueness + speed</td><td>-</td></tr>
<tr><td>Full-text</td><td>Word search in text</td><td>Specialised syntax</td></tr>
</tbody></table></div>

<pre data-lang="sql"><code>CREATE INDEX idx_emp_dept_sal ON employees (dept_id, salary);

-- Left-prefix rule for index (dept_id, salary):
SELECT * FROM employees WHERE dept_id = 10;                    -- uses index
SELECT * FROM employees WHERE dept_id = 10 AND salary &gt; 80000; -- uses both columns
SELECT * FROM employees WHERE salary &gt; 80000;                  -- cannot seek (first column missing)

-- Covering index: query satisfied from the index alone
SELECT dept_id, salary FROM employees WHERE dept_id = 10;      -- no table lookup</code></pre>

<div class="box warn"><b>⚠️ Things that stop an index being used (non-SARGable predicates)</b>
<ul>
<li>Function on the column: <code>WHERE YEAR(order_date) = 2024</code>. Rewrite: <code>order_date &gt;= '2024-01-01' AND order_date &lt; '2025-01-01'</code>.</li>
<li>Leading wildcard: <code>LIKE '%kumar'</code>. Trailing wildcard <code>'kumar%'</code> is fine.</li>
<li>Implicit conversion: comparing a VARCHAR phone column to a number <code>WHERE phone = 99999</code>.</li>
<li>Low selectivity: an index on a boolean or gender column is often ignored; the optimiser prefers a full scan.</li>
<li><code>OR</code> across different columns, and <code>!=</code> / <code>NOT IN</code> on large portions of the table.</li>
</ul></div>

<div class="box tip"><b>✅ Composite index column order</b> Put equality columns first, then the range column, then ORDER BY columns. Index (status, created_at) serves <code>WHERE status = 'NEW' ORDER BY created_at</code> with no separate sort.</div>

### EXPLAIN: reading query plans

EXPLAIN shows how the optimiser intends to run a statement (access method, indexes, row estimates) without running it. EXPLAIN ANALYZE (PostgreSQL, MySQL 8.0.18+) actually runs it and reports real timings.

<pre data-lang="sql"><code>EXPLAIN SELECT * FROM orders WHERE customer_id = 7;</code></pre>

<div class="tw"><table><thead><tr><th>id</th><th>table</th><th>type</th><th>possible_keys</th><th>key</th><th>rows</th><th>Extra</th></tr></thead><tbody>
<tr><td>1</td><td>orders</td><td>ref</td><td>idx_customer</td><td>idx_customer</td><td>12</td><td>-</td></tr>
</tbody></table></div>

<div class="tw"><table><thead><tr><th>MySQL type (best to worst)</th><th>Meaning</th></tr></thead><tbody>
<tr><td>const / system</td><td>At most one row, via PK or unique key</td></tr>
<tr><td>eq_ref</td><td>One row per join row via PK or unique index</td></tr>
<tr><td>ref</td><td>Rows matching an index value (non-unique)</td></tr>
<tr><td>range</td><td>Index range scan (BETWEEN, &gt;, IN)</td></tr>
<tr><td>index</td><td>Full index scan</td></tr>
<tr><td>ALL</td><td>Full table scan: usually the problem</td></tr>
</tbody></table></div>

Warning signs in the Extra column: <code>Using filesort</code> (sort not served by an index), <code>Using temporary</code> (temp table for GROUP BY or DISTINCT), <code>Using where</code> with type ALL on a big table. Good sign: <code>Using index</code> (covering).

<div class="diagram">
<div class="diagram-label">flowchart — tuning loop</div>
<div class="mermaid">
flowchart LR
    A["Slow query found\nslow log or APM"] --> B["EXPLAIN\nchecks type key rows"]
    B --> C{"Full scan or\nfilesort?"}
    C -->|"yes"| D["Add or fix index\nrewrite predicate"]
    C -->|"no"| E["Check row estimates\nstatistics, join order"]
    D --> F["Re-run EXPLAIN\nand measure"]
    E --> F
    F --> B
</div>
</div>

<pre data-lang="sql"><code>-- Before: type = ALL, rows = 2,000,000
EXPLAIN SELECT * FROM orders WHERE YEAR(created_at) = 2024;
-- After rewriting + index on created_at: type = range, rows about 180,000
CREATE INDEX idx_created ON orders (created_at);
EXPLAIN SELECT * FROM orders
WHERE created_at &gt;= '2024-01-01' AND created_at &lt; '2025-01-01';</code></pre>

### Transactions and ACID

A transaction is a group of statements treated as one unit: either all succeed (COMMIT) or none do (ROLLBACK). The classic example is a bank transfer, where debit and credit must never be separated.

<div class="diagram">
<div class="diagram-label">flowchart — ACID properties</div>
<div class="mermaid">
flowchart LR
    ACID["ACID"]
    ACID --> A["Atomicity\nall or nothing\nundo log"]
    ACID --> C["Consistency\nvalid state to valid state\nconstraints hold"]
    ACID --> I["Isolation\nconcurrent transactions\ndo not see half work\nlocks or MVCC"]
    ACID --> D["Durability\ncommitted data survives crash\nWAL redo log"]
</div>
</div>

<pre data-lang="sql"><code>START TRANSACTION;
UPDATE accounts SET balance = balance - 1000 WHERE id = 1;   -- Asha 5000 -&gt; 4000
UPDATE accounts SET balance = balance + 1000 WHERE id = 2;   -- Ravi 2000 -&gt; 3000
COMMIT;      -- both persist; a crash before this line undoes both

-- Savepoint: partial rollback
BEGIN;
INSERT INTO orders (id, customer_id, amount) VALUES (11, 1, 500);
SAVEPOINT after_order;
INSERT INTO payments (order_id, amount) VALUES (11, 500);
ROLLBACK TO SAVEPOINT after_order;   -- undo the payment only
COMMIT;                              -- order 11 is saved</code></pre>

<div class="diagram">
<div class="diagram-label">sequenceDiagram — transfer with crash recovery</div>
<div class="mermaid">
sequenceDiagram
    participant App as "Application"
    participant DB as "Database engine"
    participant Log as "WAL / redo log"
    App->>DB: BEGIN
    App->>DB: debit Asha 1000
    DB->>Log: write change record
    App->>DB: credit Ravi 1000
    DB->>Log: write change record
    App->>DB: COMMIT
    DB->>Log: flush commit record to disk
    DB-->>App: success
    Note over DB,Log: If crash before commit record is flushed, recovery undoes both. If after, recovery replays both.
</div>
</div>

<div class="tw"><table><thead><tr><th>Mechanism</th><th>Provides</th></tr></thead><tbody>
<tr><td>Undo log / rollback segment</td><td>Atomicity and MVCC old versions</td></tr>
<tr><td>Redo log / WAL (write-ahead log)</td><td>Durability: log is written before data pages</td></tr>
<tr><td>Locks and MVCC</td><td>Isolation</td></tr>
<tr><td>Constraints and triggers</td><td>Consistency</td></tr>
</tbody></table></div>

<div class="box info"><b>💡 Autocommit</b> Most clients run in autocommit mode: each statement is its own transaction. Use <code>BEGIN</code> (or <code>SET autocommit = 0</code>) when several statements must succeed together.</div>

### Isolation Levels and Concurrency Anomalies

Isolation controls how much one transaction can see of another's uncommitted or newly committed work. Weaker levels are faster but allow anomalies.

<div class="tw"><table><thead><tr><th>Isolation level</th><th>Dirty read</th><th>Non-repeatable read</th><th>Phantom read</th></tr></thead><tbody>
<tr><td><strong>READ UNCOMMITTED</strong></td><td>possible</td><td>possible</td><td>possible</td></tr>
<tr><td><strong>READ COMMITTED</strong></td><td>prevented</td><td>possible</td><td>possible</td></tr>
<tr><td><strong>REPEATABLE READ</strong></td><td>prevented</td><td>prevented</td><td>possible (MySQL InnoDB prevents most via gap locks)</td></tr>
<tr><td><strong>SERIALIZABLE</strong></td><td>prevented</td><td>prevented</td><td>prevented</td></tr>
</tbody></table></div>

Defaults: MySQL InnoDB uses REPEATABLE READ; PostgreSQL, Oracle and SQL Server use READ COMMITTED.

<div class="diagram">
<div class="diagram-label">flowchart — isolation ladder</div>
<div class="mermaid">
flowchart TD
    RU["READ UNCOMMITTED\ndirty, non-repeatable, phantom allowed"] --> RC["READ COMMITTED\nstops dirty reads"]
    RC --> RR["REPEATABLE READ\nalso stops non-repeatable reads"]
    RR --> SER["SERIALIZABLE\nalso stops phantom reads"]
</div>
</div>

#### Dirty read

T2 reads data that T1 has changed but not committed. If T1 rolls back, T2 used a value that never existed.

<div class="diagram">
<div class="diagram-label">sequenceDiagram — dirty read</div>
<div class="mermaid">
sequenceDiagram
    participant T1 as "Txn 1"
    participant DB as "Row balance"
    participant T2 as "Txn 2"
    T1->>DB: UPDATE balance 1000 to 500
    T2->>DB: SELECT balance
    DB-->>T2: 500 uncommitted value
    T1->>DB: ROLLBACK
    Note over T2: T2 acted on 500 but real balance is 1000
</div>
</div>

#### Non-repeatable read

T1 reads the same row twice and gets different values because T2 committed an UPDATE in between.

<div class="diagram">
<div class="diagram-label">sequenceDiagram — non-repeatable read</div>
<div class="mermaid">
sequenceDiagram
    participant T1 as "Txn 1"
    participant DB as "Row price"
    participant T2 as "Txn 2"
    T1->>DB: SELECT price
    DB-->>T1: 100
    T2->>DB: UPDATE price to 120
    T2->>DB: COMMIT
    T1->>DB: SELECT price again
    DB-->>T1: 120
    Note over T1: Same query, different answer inside one transaction
</div>
</div>

#### Phantom read

T1 runs the same range query twice; T2 inserts and commits a new row matching the range, so a "phantom" row appears.

<div class="diagram">
<div class="diagram-label">sequenceDiagram — phantom read</div>
<div class="mermaid">
sequenceDiagram
    participant T1 as "Txn 1"
    participant DB as "orders table"
    participant T2 as "Txn 2"
    T1->>DB: SELECT COUNT where amount over 500
    DB-->>T1: 3 rows
    T2->>DB: INSERT order amount 900
    T2->>DB: COMMIT
    T1->>DB: SELECT COUNT where amount over 500
    DB-->>T1: 4 rows
    Note over T1: A new row appeared that was not there before
</div>
</div>

#### Lost update

Two transactions read the same value, both compute a new one and the later write overwrites the earlier.

<div class="diagram">
<div class="diagram-label">sequenceDiagram — lost update</div>
<div class="mermaid">
sequenceDiagram
    participant T1 as "Txn 1"
    participant DB as "Row stock"
    participant T2 as "Txn 2"
    T1->>DB: SELECT stock
    DB-->>T1: 10
    T2->>DB: SELECT stock
    DB-->>T2: 10
    T1->>DB: UPDATE stock to 9 and COMMIT
    T2->>DB: UPDATE stock to 9 and COMMIT
    Note over DB: Two units were sold so stock should be 8 but final value is 9. The T1 sale was overwritten
</div>
</div>

<pre data-lang="sql"><code>-- Fixes for lost update
UPDATE products SET stock = stock - 1 WHERE id = 5;          -- atomic in-place arithmetic
SELECT stock FROM products WHERE id = 5 FOR UPDATE;           -- pessimistic: lock the row first
UPDATE products SET stock = 9, version = version + 1
WHERE id = 5 AND version = 3;                                 -- optimistic: check version, retry if 0 rows updated

SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;              -- choose level per transaction</code></pre>

<div class="box tip"><b>✅ Interview quick answer</b> Dirty = read uncommitted data. Non-repeatable = same row, different value (UPDATE by others). Phantom = same range query, different row set (INSERT or DELETE by others). Higher isolation means fewer anomalies but more locking or retries.</div>

### Locks, MVCC and Deadlocks

Databases use locks so concurrent writers do not corrupt data. Modern engines add MVCC (multi-version concurrency control): readers see a consistent snapshot of old row versions, so reads do not block writes and writes do not block reads.

<div class="tw"><table><thead><tr><th>Lock</th><th>Description</th></tr></thead><tbody>
<tr><td>Shared (S) lock</td><td>Held while reading with locking read; many allowed; blocks writers</td></tr>
<tr><td>Exclusive (X) lock</td><td>Held while writing; blocks all others</td></tr>
<tr><td>Row lock</td><td>InnoDB default: only touched rows, high concurrency</td></tr>
<tr><td>Table lock</td><td>Whole table: DDL, LOCK TABLES, or no usable index</td></tr>
<tr><td>Gap / next-key lock</td><td>InnoDB locks index ranges to prevent phantoms</td></tr>
<tr><td>Intention locks</td><td>Table-level flags that a transaction holds row locks</td></tr>
</tbody></table></div>

<pre data-lang="sql"><code>SELECT * FROM accounts WHERE id = 1 FOR UPDATE;            -- X lock on row
SELECT * FROM accounts WHERE id = 1 FOR SHARE;             -- S lock (LOCK IN SHARE MODE in old MySQL)
SELECT * FROM jobs WHERE status='NEW' LIMIT 1
   FOR UPDATE SKIP LOCKED;                                  -- work-queue pattern, skips rows others hold</code></pre>

#### Deadlock

A deadlock is a cycle: T1 waits for a lock T2 holds, while T2 waits for a lock T1 holds. Neither can proceed. The engine detects the cycle and kills one transaction (the victim) with an error you must retry.

<div class="diagram">
<div class="diagram-label">sequenceDiagram — classic deadlock</div>
<div class="mermaid">
sequenceDiagram
    participant T1 as "Txn 1"
    participant A as "Row A"
    participant B as "Row B"
    participant T2 as "Txn 2"
    T1->>A: UPDATE row A gets X lock
    T2->>B: UPDATE row B gets X lock
    T1->>B: UPDATE row B waits for T2
    T2->>A: UPDATE row A waits for T1
    Note over T1,T2: Circular wait. Engine rolls back one transaction as victim
</div>
</div>

<pre data-lang="sql"><code>-- MySQL: ERROR 1213 (40001): Deadlock found when trying to get lock; try restarting transaction
SHOW ENGINE INNODB STATUS;      -- section LATEST DETECTED DEADLOCK</code></pre>

<div class="box tip"><b>✅ How to avoid deadlocks</b>
<ul>
<li>Always acquire locks in the same order (for example lower account id first in a transfer).</li>
<li>Keep transactions short; never wait for user input inside one.</li>
<li>Index the columns used in WHERE of UPDATE/DELETE so fewer rows are locked.</li>
<li>Use a lower isolation level where acceptable, and retry on deadlock error code.</li>
</ul></div>

### Normalization (worked example)

Normalization organises tables to remove redundancy and the update, insert and delete anomalies it causes. Each normal form adds a rule.

<div class="diagram">
<div class="diagram-label">flowchart — normalization path</div>
<div class="mermaid">
flowchart LR
    RAW["Unnormalized\nredundant data"] -->|"atomic values"| N1["1NF"]
    N1 -->|"no partial dependency"| N2["2NF"]
    N2 -->|"no transitive dependency"| N3["3NF"]
    N3 -->|"determinant is superkey"| B["BCNF"]
</div>
</div>

#### Starting point: one flat table

<div class="tw"><table><thead><tr><th>order_id</th><th>customer_name</th><th>customer_city</th><th>products</th><th>product_price</th></tr></thead><tbody>
<tr><td>101</td><td>Asha</td><td>Pune</td><td>Pen, Book</td><td>10, 200</td></tr>
<tr><td>102</td><td>Ravi</td><td>Delhi</td><td>Pen</td><td>10</td></tr>
</tbody></table></div>

Problems: multi-valued cells (hard to query), Asha's city repeated per order (update anomaly), cannot add a customer without an order (insert anomaly).

#### 1NF: atomic values, one fact per cell

<div class="tw"><table><thead><tr><th>order_id</th><th>product</th><th>customer_name</th><th>customer_city</th><th>product_price</th></tr></thead><tbody>
<tr><td>101</td><td>Pen</td><td>Asha</td><td>Pune</td><td>10</td></tr>
<tr><td>101</td><td>Book</td><td>Asha</td><td>Pune</td><td>200</td></tr>
<tr><td>102</td><td>Pen</td><td>Ravi</td><td>Delhi</td><td>10</td></tr>
</tbody></table></div>

Key is (order_id, product).

#### 2NF: remove partial dependencies

customer_name and customer_city depend only on order_id; product_price depends only on product. Both are parts of the composite key, so split:

<div class="tw"><table><thead><tr><th>orders</th><th></th><th></th><th>products</th><th></th><th>order_items</th><th></th></tr><tr><th>order_id</th><th>customer_name</th><th>customer_city</th><th>product</th><th>price</th><th>order_id</th><th>product</th></tr></thead><tbody>
<tr><td>101</td><td>Asha</td><td>Pune</td><td>Pen</td><td>10</td><td>101</td><td>Pen</td></tr>
<tr><td>102</td><td>Ravi</td><td>Delhi</td><td>Book</td><td>200</td><td>101</td><td>Book</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td>102</td><td>Pen</td></tr>
</tbody></table></div>

#### 3NF: remove transitive dependencies

In orders, order_id determines customer_name, and customer_name determines customer_city (order_id -&gt; customer -&gt; city). City is not directly about the order. Extract customers:

<div class="tw"><table><thead><tr><th>customers</th><th></th><th></th><th>orders</th><th></th></tr><tr><th>customer_id</th><th>name</th><th>city</th><th>order_id</th><th>customer_id</th></tr></thead><tbody>
<tr><td>1</td><td>Asha</td><td>Pune</td><td>101</td><td>1</td></tr>
<tr><td>2</td><td>Ravi</td><td>Delhi</td><td>102</td><td>2</td></tr>
</tbody></table></div>

Now a city change is one UPDATE in one row.

<div class="diagram">
<div class="diagram-label">flowchart — resulting schema</div>
<div class="mermaid">
flowchart LR
    C["customers\ncustomer_id PK\nname, city"] -->|"1 to many"| O["orders\norder_id PK\ncustomer_id FK"]
    O -->|"1 to many"| OI["order_items\norder_id FK\nproduct_id FK"]
    P["products\nproduct_id PK\nname, price"] -->|"1 to many"| OI
</div>
</div>

#### BCNF

BCNF: for every functional dependency X -&gt; Y, X must be a superkey. Example: table (student, subject, teacher) where each teacher teaches one subject (teacher -&gt; subject) but teacher is not a key. Decompose into (teacher, subject) and (student, teacher).

<div class="tw"><table><thead><tr><th>Form</th><th>Rule</th><th>Typical violation</th><th>Fix</th></tr></thead><tbody>
<tr><td>1NF</td><td>Atomic values, no repeating groups</td><td><code>phone = '9999, 8888'</code></td><td>Child table or one row per value</td></tr>
<tr><td>2NF</td><td>1NF + no partial dependency on composite key</td><td>student_name in (student_id, course_id) table</td><td>Move to students table</td></tr>
<tr><td>3NF</td><td>2NF + no transitive dependency</td><td>emp_id -&gt; dept_id -&gt; dept_name</td><td>departments table</td></tr>
<tr><td>BCNF</td><td>Every determinant is a superkey</td><td>teacher -&gt; subject, teacher not a key</td><td>Decompose</td></tr>
</tbody></table></div>

<div class="box note"><b>📝 Denormalization</b> Reporting and read-heavy systems deliberately copy data (for example storing order_total on orders) to avoid joins. Trade-off: faster reads, harder consistency. Normalise OLTP, denormalise carefully for analytics.</div>

### Views

A view is a stored SELECT that behaves like a virtual table. It stores no data (except materialized views). Use views to simplify complex joins, hide columns for security, and give a stable interface when tables change.

<pre data-lang="sql"><code>CREATE VIEW v_emp_public AS
SELECT e.emp_id, e.name, d.dept_name       -- salary deliberately hidden
FROM employees e JOIN departments d ON d.dept_id = e.dept_id;

SELECT * FROM v_emp_public WHERE dept_name = 'Sales';
GRANT SELECT ON v_emp_public TO hr_readonly;

-- PostgreSQL materialized view: stores the result, refresh on demand
CREATE MATERIALIZED VIEW mv_daily_sales AS
SELECT order_date, SUM(amount) AS total FROM orders GROUP BY order_date;
REFRESH MATERIALIZED VIEW mv_daily_sales;</code></pre>

<div class="tw"><table><thead><tr><th>Aspect</th><th>View</th><th>Materialized view</th></tr></thead><tbody>
<tr><td>Stores data</td><td>No, query runs each time</td><td>Yes, snapshot</td></tr>
<tr><td>Freshness</td><td>Always current</td><td>Stale until refreshed</td></tr>
<tr><td>Speed</td><td>Same as underlying query</td><td>Fast reads, can be indexed</td></tr>
<tr><td>Updatable</td><td>Simple single-table views only</td><td>No</td></tr>
</tbody></table></div>

### Stored Procedures, Functions and Triggers

A stored procedure is named SQL logic saved inside the database and run with CALL. Benefits: fewer network round trips, reuse, permission control. Drawbacks: logic hidden from application code, harder to version and test.

<pre data-lang="sql"><code>DELIMITER //
CREATE PROCEDURE transfer_funds (IN p_from INT, IN p_to INT, IN p_amt DECIMAL(12,2))
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;
    UPDATE accounts SET balance = balance - p_amt WHERE id = p_from AND balance &gt;= p_amt;
    IF ROW_COUNT() = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Insufficient funds';
    END IF;
    UPDATE accounts SET balance = balance + p_amt WHERE id = p_to;
    COMMIT;
END //
DELIMITER ;

CALL transfer_funds(1, 2, 1000);</code></pre>

<div class="tw"><table><thead><tr><th>Procedure</th><th>Function</th></tr></thead><tbody>
<tr><td>Invoked with CALL</td><td>Used inside SQL expressions</td></tr>
<tr><td>May return zero or many values (OUT params, result sets)</td><td>Must return exactly one value</td></tr>
<tr><td>Can run DML and transactions</td><td>Usually restricted, should be deterministic</td></tr>
</tbody></table></div>

#### Triggers

A trigger runs automatically BEFORE or AFTER an INSERT, UPDATE or DELETE on a table. Typical uses: audit trails, derived columns, enforcing rules the schema cannot express.

<pre data-lang="sql"><code>CREATE TABLE salary_audit (emp_id INT, old_sal DECIMAL(10,2), new_sal DECIMAL(10,2), changed_at DATETIME);

CREATE TRIGGER trg_salary_audit
AFTER UPDATE ON employees
FOR EACH ROW
BEGIN
    IF OLD.salary &lt;&gt; NEW.salary THEN
        INSERT INTO salary_audit VALUES (OLD.emp_id, OLD.salary, NEW.salary, NOW());
    END IF;
END;

UPDATE employees SET salary = 95000 WHERE emp_id = 2;   -- audit row written automatically</code></pre>

<div class="box warn"><b>⚠️ Trigger caution</b> Triggers are invisible to application developers, run inside the same transaction (slowing writes), and can cascade into other triggers. Prefer explicit application logic or constraints where possible.</div>

### Set Operations and NULL Handling

<div class="tw"><table><thead><tr><th>Operator</th><th>Result</th><th>Duplicates</th></tr></thead><tbody>
<tr><td><code>UNION</code></td><td>Rows in A or B</td><td>Removed (sort cost)</td></tr>
<tr><td><code>UNION ALL</code></td><td>Rows in A plus B</td><td>Kept (faster)</td></tr>
<tr><td><code>INTERSECT</code></td><td>Rows in both</td><td>Removed</td></tr>
<tr><td><code>EXCEPT</code> / <code>MINUS</code></td><td>In A but not B</td><td>Removed</td></tr>
</tbody></table></div>

Both queries must return the same number of columns with compatible types.

<pre data-lang="sql"><code>SELECT email FROM newsletter_subs
UNION
SELECT email FROM customers;          -- distinct combined list</code></pre>

NULL means "unknown", not zero or empty string. Any comparison with NULL yields UNKNOWN, which WHERE treats as false.

<div class="tw"><table><thead><tr><th>Expression</th><th>Result</th></tr></thead><tbody>
<tr><td><code>NULL = NULL</code></td><td>UNKNOWN (use <code>IS NULL</code>)</td></tr>
<tr><td><code>5 + NULL</code></td><td>NULL</td></tr>
<tr><td><code>NULL OR TRUE</code></td><td>TRUE</td></tr>
<tr><td><code>NULL AND TRUE</code></td><td>UNKNOWN</td></tr>
<tr><td><code>COUNT(col)</code> on 3 rows with 1 NULL</td><td>2</td></tr>
<tr><td><code>x NOT IN (1, NULL)</code></td><td>never true</td></tr>
</tbody></table></div>

<pre data-lang="sql"><code>SELECT COALESCE(phone, email, 'no contact') FROM customers;   -- first non-NULL
SELECT * FROM employees WHERE dept_id IS NULL;                 -- never use = NULL
SELECT salary / NULLIF(hours, 0) FROM t;                       -- avoid divide by zero</code></pre>

### Common Functions

<pre data-lang="sql"><code>-- String
SELECT UPPER(name), LOWER(name), LENGTH(name),
       TRIM('  hello  '),                  -- 'hello'
       SUBSTRING('Kumar', 1, 3),           -- 'Kum'
       CONCAT(first_name, ' ', last_name),
       REPLACE('98-76-54', '-', ''),       -- '987654'
       LEFT('Pune', 2), POSITION('a' IN 'Asha')
FROM employees;

-- Numeric
SELECT ROUND(12.3456, 2),   -- 12.35
       CEIL(4.1),           -- 5
       FLOOR(4.9),          -- 4
       MOD(10, 3),          -- 1
       ABS(-7);             -- 7

-- Date (MySQL flavour)
SELECT NOW(), CURDATE(),
       DATE_ADD(NOW(), INTERVAL 7 DAY),
       DATEDIFF('2025-01-31', '2025-01-01'),          -- 30
       EXTRACT(YEAR FROM hire_date),
       DATE_FORMAT(NOW(), '%Y-%m-%d'),
       TIMESTAMPDIFF(YEAR, dob, CURDATE()) AS age
FROM employees;

-- Conditional
SELECT name,
    CASE WHEN salary &gt;= 100000 THEN 'Senior'
         WHEN salary &gt;= 60000  THEN 'Mid'
         ELSE 'Junior' END AS band,
    NULLIF(bonus, 0),                -- NULL when bonus = 0
    IFNULL(commission, 0)            -- 0 when NULL (MySQL)
FROM employees;

-- Pattern matching
SELECT * FROM customers WHERE name LIKE 'A%';       -- starts with A
SELECT * FROM customers WHERE name LIKE '_sha';     -- one char then sha
SELECT * FROM customers WHERE city IN ('Pune','Delhi') AND age BETWEEN 25 AND 40;</code></pre>

### Query Optimisation Tips

<div class="tw"><table><thead><tr><th>Do</th><th>Avoid</th><th>Why</th></tr></thead><tbody>
<tr><td>Select only needed columns</td><td><code>SELECT *</code></td><td>Less I/O, enables covering indexes</td></tr>
<tr><td>Filter early with sargable predicates</td><td>Functions on indexed columns</td><td>Index seek instead of scan</td></tr>
<tr><td>Index JOIN and WHERE columns, FK columns</td><td>Too many indexes on write-heavy tables</td><td>Each index slows writes</td></tr>
<tr><td>Use EXISTS for existence checks</td><td>NOT IN with nullable subquery</td><td>Correctness and speed</td></tr>
<tr><td>UNION ALL when duplicates are fine</td><td>UNION by default</td><td>Skips the sort or hash dedupe</td></tr>
<tr><td>Keyset pagination: <code>WHERE id &gt; :last ORDER BY id LIMIT 20</code></td><td><code>OFFSET 100000</code></td><td>OFFSET reads and discards rows</td></tr>
<tr><td>Batch inserts (multi-row VALUES)</td><td>One INSERT per row in a loop</td><td>Fewer round trips and log flushes</td></tr>
<tr><td>Keep transactions short</td><td>Long transactions holding locks</td><td>Contention and deadlocks</td></tr>
<tr><td>Match data types in joins</td><td>VARCHAR vs INT comparisons</td><td>Implicit casts defeat indexes</td></tr>
<tr><td>Update statistics, check EXPLAIN</td><td>Guessing</td><td>Optimiser relies on row estimates</td></tr>
</tbody></table></div>

<pre data-lang="sql"><code>-- Slow: OFFSET pagination on page 5000
SELECT * FROM orders ORDER BY id LIMIT 20 OFFSET 99980;
-- Fast: keyset pagination
SELECT * FROM orders WHERE id &gt; 99999 ORDER BY id LIMIT 20;

-- Slow: correlated subquery per row
SELECT c.name, (SELECT COUNT(*) FROM orders o WHERE o.customer_id = c.id) AS n FROM customers c;
-- Better: one pass with join + group
SELECT c.name, COUNT(o.id) AS n
FROM customers c LEFT JOIN orders o ON o.customer_id = c.id
GROUP BY c.id, c.name;</code></pre>

<div class="box warn"><b>⚠️ N+1 query problem</b> Fetching 100 customers then running 1 query per customer for orders = 101 queries. Fetch with a JOIN or a single <code>WHERE customer_id IN (...)</code> instead (common ORM pitfall).</div>

### Common SQL Interview Q&A

<div class="tw"><table><thead><tr><th>Question</th><th>Short answer</th></tr></thead><tbody>
<tr><td>WHERE vs HAVING?</td><td>WHERE filters rows before grouping and cannot use aggregates. HAVING filters groups after aggregation.</td></tr>
<tr><td>DELETE vs TRUNCATE vs DROP?</td><td>DELETE removes chosen rows (DML, rollback). TRUNCATE empties the table fast and resets identity (DDL). DROP removes the table itself.</td></tr>
<tr><td>RANK vs DENSE_RANK vs ROW_NUMBER?</td><td>ROW_NUMBER unique; RANK repeats and leaves gaps (1,2,2,4); DENSE_RANK repeats without gaps (1,2,2,3).</td></tr>
<tr><td>UNION vs UNION ALL?</td><td>UNION removes duplicates (slower); UNION ALL keeps them.</td></tr>
<tr><td>Primary key vs unique key?</td><td>PK: one per table, no NULL. Unique: many allowed, NULL permitted (engine-specific).</td></tr>
<tr><td>Clustered vs non-clustered index?</td><td>Clustered defines physical row order (one per table). Non-clustered is a separate structure with pointers.</td></tr>
<tr><td>What is a covering index?</td><td>An index containing every column the query needs, so the table is never touched.</td></tr>
<tr><td>IN vs EXISTS?</td><td>EXISTS short-circuits and is NULL-safe; IN is fine for small lists. Optimisers often treat them alike.</td></tr>
<tr><td>What is a deadlock and how to prevent?</td><td>Cyclic lock wait; prevent with consistent lock order, short transactions, indexes, retry logic.</td></tr>
<tr><td>Explain ACID.</td><td>Atomic all-or-nothing, Consistent valid states, Isolated concurrent safety, Durable survives crash.</td></tr>
<tr><td>Why can a query ignore my index?</td><td>Function on column, leading wildcard, type mismatch, low selectivity, stale statistics, wrong column order in composite index.</td></tr>
<tr><td>Find 2nd highest salary?</td><td>DENSE_RANK() = 2, or <code>LIMIT 1 OFFSET 1</code> on distinct salaries, or MAX where salary &lt; MAX.</td></tr>
<tr><td>Find duplicates?</td><td><code>GROUP BY col HAVING COUNT(*) &gt; 1</code>.</td></tr>
<tr><td>Delete vs soft delete?</td><td>Soft delete sets a flag (<code>is_deleted</code>) to keep history; every query must then filter on it.</td></tr>
<tr><td>What is a self join and when used?</td><td>Joining a table to itself via aliases: manager hierarchy, comparing rows in same table.</td></tr>
<tr><td>Normalization vs denormalization?</td><td>Normalise to avoid anomalies (OLTP). Denormalise to cut joins for read speed (analytics).</td></tr>
</tbody></table></div>

<div class="box tip"><b>✅ Last-minute checklist</b> Say the execution order out loud. For every join ask "what happens to unmatched rows?". For every NOT IN ask "can the subquery return NULL?". For every slow query ask "what does EXPLAIN say?".</div>

---

## Java {#java}

Java is a statically typed, object-oriented language that compiles to bytecode and runs on the JVM, giving "write once, run anywhere". These notes cover how the JVM works, the object model, collections internals, concurrency, streams and the language features added from Java 8 to 17, ending with common interview answers.

<div class="diagram">
<div class="diagram-label">mind map — Java</div>
<div class="mermaid">
mindmap
  root((Java))
    JVM
      Class loader
        Load
        Link
        Initialize
      Runtime data areas
        Heap
        Stack
        Method area
        PC register
        Native method stack
      Execution engine
        Interpreter
        JIT compiler
        Garbage collector
      Heap generations
        Young Eden S0 S1
        Old generation
        Metaspace
    OOP
      Encapsulation
      Abstraction
      Inheritance
      Polymorphism
        Overloading compile time
        Overriding runtime
    Collections
      List
        ArrayList
        LinkedList
      Set
        HashSet
        TreeSet
        LinkedHashSet
      Queue
        PriorityQueue
        ArrayDeque
      Map
        HashMap
        TreeMap
        LinkedHashMap
        ConcurrentHashMap
    Exceptions
      Checked
      Unchecked
      Error
      try catch finally
      try-with-resources
    Multithreading
      Thread lifecycle
      ExecutorService
      synchronized
      volatile
      CompletableFuture
      AtomicInteger
    Stream API
      Source
      Intermediate ops
      Terminal ops
    Cheatsheet
      equals vs ==
      String immutable
      final static
      Generics erasure
      Optional
</div>
</div>

### JDK, JRE, JVM and the Compile-Run Pipeline

The JDK (development kit) contains the JRE (runtime), which contains the JVM (the virtual machine that executes bytecode). The compiler <code>javac</code> turns <code>.java</code> files into platform-neutral <code>.class</code> bytecode; each OS has its own JVM that interprets or compiles that bytecode to native code.

<div class="diagram">
<div class="diagram-label">flowchart — from source to execution</div>
<div class="mermaid">
flowchart TD
    SRC[".java source"] -->|"javac"| BC[".class bytecode"]
    BC --> CL["Class Loader\nLoad, Link, Initialize"]
    CL --> MEM["Runtime Data Areas\nHeap, Stack, Method Area, PC, Native Stack"]
    MEM --> EE["Execution Engine\nInterpreter, JIT, GC"]
    EE --> OS["OS and native libraries"]
</div>
</div>

<div class="tw"><table><thead><tr><th>Term</th><th>What it is</th><th>Contains</th></tr></thead><tbody>
<tr><td>JDK</td><td>Developer kit</td><td>JRE + javac, jar, javadoc, jshell, debugging tools</td></tr>
<tr><td>JRE</td><td>Runtime environment</td><td>JVM + core class libraries</td></tr>
<tr><td>JVM</td><td>Abstract machine specification and implementation (HotSpot)</td><td>Class loader, memory areas, execution engine</td></tr>
</tbody></table></div>

<pre data-lang="bash"><code>javac Hello.java        # produces Hello.class
java Hello              # JVM loads and runs it
javap -c Hello          # disassemble bytecode</code></pre>

### Class Loading

When your code first uses a class, the JVM loads it lazily. Loading has three phases and uses a hierarchy of class loaders.

<div class="diagram">
<div class="diagram-label">flowchart — class loading phases</div>
<div class="mermaid">
flowchart LR
    L["Load\nfind .class bytes\ncreate Class object"] --> V["Link: Verify\nbytecode is valid and safe"]
    V --> P["Link: Prepare\nallocate statics with default values"]
    P --> R["Link: Resolve\nsymbolic refs to direct refs"]
    R --> I["Initialize\nrun static blocks and static field initializers"]
</div>
</div>

<div class="diagram">
<div class="diagram-label">flowchart — parent delegation model</div>
<div class="mermaid">
flowchart TD
    APP["Application class loader\nyour classpath"] -->|"delegates up first"| PLAT["Platform class loader\nJava 9+, was Extension"]
    PLAT -->|"delegates up first"| BOOT["Bootstrap class loader\ncore java.base classes"]
    BOOT -->|"not found, try down"| PLAT
    PLAT -->|"not found, try down"| APP
</div>
</div>

A loader first asks its parent; only if the parent cannot find the class does it try itself. This stops you from replacing <code>java.lang.String</code> with a malicious copy. Initialization happens once, on first active use: creating an instance, calling a static method, or reading a non-constant static field.

<pre data-lang="java"><code>class Demo {
    static { System.out.println("Demo initialized"); }
    static int x = 5;
}
public class Main {
    public static void main(String[] args) {
        System.out.println("start");
        System.out.println(Demo.x);   // triggers initialization
    }
}
// Output:
// start
// Demo initialized
// 5</code></pre>

### JVM Memory Areas (stack, heap, metaspace)

<div class="diagram">
<div class="diagram-label">flowchart — runtime data areas</div>
<div class="mermaid">
flowchart TD
    subgraph SHARED["Shared by all threads"]
        HEAP["Heap\nobjects and arrays\ngarbage collected"]
        META["Metaspace\nclass metadata, method code\nnative memory, Java 8+"]
    end
    subgraph PERTHREAD["One per thread"]
        STK["JVM Stack\nframes with local vars and operand stack"]
        PC["PC Register\ncurrent bytecode instruction"]
        NMS["Native Method Stack"]
    end
</div>
</div>

<div class="tw"><table><thead><tr><th>Area</th><th>Stores</th><th>Error when exhausted</th></tr></thead><tbody>
<tr><td>Heap</td><td>All objects, arrays, instance fields; String pool</td><td>OutOfMemoryError: Java heap space</td></tr>
<tr><td>Stack (per thread)</td><td>One frame per method call: local variables, primitives, references</td><td>StackOverflowError (deep recursion)</td></tr>
<tr><td>Metaspace</td><td>Class structure, static vars metadata, method bytecode (replaced PermGen in Java 8)</td><td>OutOfMemoryError: Metaspace</td></tr>
<tr><td>PC register</td><td>Address of the instruction being executed</td><td>-</td></tr>
</tbody></table></div>

<pre data-lang="java"><code>void process() {
    int count = 3;                    // primitive: lives in this method's stack frame
    Order o = new Order(101);         // reference 'o' on stack, Order object on heap
}   // frame popped: 'count' and 'o' vanish, Order becomes eligible for GC if unreferenced</code></pre>

<div class="box tip"><b>✅ Interview quick answer</b> Stack = per-thread, method frames, auto-freed on return. Heap = shared, objects, freed by GC. Passing an object to a method copies the reference (pass-by-value of the reference), so the method can mutate the object but cannot make the caller variable point elsewhere.</div>

### Garbage Collection

GC automatically reclaims heap objects that are no longer reachable from GC roots (local variables on stacks, static fields, active threads, JNI refs). It is based on the weak generational hypothesis: most objects die young.

<div class="diagram">
<div class="diagram-label">flowchart — generational heap and object promotion</div>
<div class="mermaid">
flowchart LR
    NEW["new Object()"] --> EDEN["Eden"]
    EDEN -->|"Minor GC\nsurvivors"| S0["Survivor S0"]
    S0 -->|"next Minor GC\nage increments"| S1["Survivor S1"]
    S1 -->|"copy back and forth"| S0
    S1 -->|"age threshold reached"| OLD["Old Generation"]
    OLD -->|"Major or Mixed GC"| FREE["Memory reclaimed"]
</div>
</div>

<ol>
<li><strong>Mark</strong>: starting at GC roots, mark all reachable objects.</li>
<li><strong>Sweep or compact</strong>: reclaim unmarked space; compaction removes fragmentation.</li>
<li>Young collections (Minor GC) copy survivors from Eden to a survivor space; they are frequent and fast. Objects surviving enough cycles (default threshold up to 15) are promoted to Old.</li>
<li>Old collections are rarer and more expensive.</li>
</ol>

<div class="tw"><table><thead><tr><th>Collector</th><th>Flag</th><th>Best for</th></tr></thead><tbody>
<tr><td>Serial</td><td>-XX:+UseSerialGC</td><td>Tiny heaps, single core</td></tr>
<tr><td>Parallel</td><td>-XX:+UseParallelGC</td><td>Throughput batch jobs (default Java 8)</td></tr>
<tr><td>G1</td><td>-XX:+UseG1GC</td><td>Default since Java 9; region-based, predictable pauses</td></tr>
<tr><td>ZGC</td><td>-XX:+UseZGC</td><td>Very large heaps, pauses under a few ms (production in Java 15)</td></tr>
<tr><td>Shenandoah</td><td>-XX:+UseShenandoahGC</td><td>Low pause, concurrent compaction</td></tr>
</tbody></table></div>

<pre data-lang="java"><code>Object a = new Object();
a = null;                 // object now unreachable, eligible for GC
System.gc();              // only a hint, never rely on it

// Memory leak example: static collection keeps everything reachable
class Cache { static final List&lt;byte[]&gt; DATA = new ArrayList&lt;&gt;(); }
// Cache.DATA.add(new byte[1_000_000]);  // never removed -&gt; OutOfMemoryError eventually</code></pre>

<pre data-lang="bash"><code>java -Xms512m -Xmx2g -XX:+UseG1GC -Xlog:gc MyApp
# -Xms initial heap, -Xmx max heap, -Xss thread stack size</code></pre>

<div class="box note"><b>📝 Reference types</b> Strong (normal) never collected while reachable; Soft collected under memory pressure (caches); Weak collected at next GC (WeakHashMap); Phantom for cleanup notifications. <code>finalize()</code> is deprecated; use try-with-resources or Cleaner.</div>

### JIT Compilation and Execution Engine

The interpreter starts running bytecode immediately but slowly. The JVM counts how often methods and loops execute; "hot" code is compiled by the JIT (C1 quick, C2 heavily optimising, tiered together) into native machine code, applying inlining, escape analysis and dead-code elimination. That is why Java benchmarks need a warm-up.

<div class="diagram">
<div class="diagram-label">flowchart — tiered compilation</div>
<div class="mermaid">
flowchart LR
    BC["Bytecode"] --> INT["Interpreter\nslow start, collects profile"]
    INT -->|"method becomes warm"| C1["C1 compiler\nfast compile, light optimisation"]
    C1 -->|"method becomes hot"| C2["C2 compiler\naggressive optimisation"]
    C2 -->|"assumption broken"| INT
</div>
</div>

### OOP: the four pillars with code

<div class="diagram">
<div class="diagram-label">flowchart — OOP pillars</div>
<div class="mermaid">
flowchart LR
    OOP["OOP Pillars"]
    OOP --> ENC["Encapsulation\ndata plus methods\nhide with private"]
    OOP --> ABS["Abstraction\nexpose what, hide how\ninterface or abstract class"]
    OOP --> INH["Inheritance\nextends or implements\nreuse"]
    OOP --> POL["Polymorphism\noverloading compile time\noverriding runtime"]
</div>
</div>

<pre data-lang="java"><code>// Encapsulation: state is private, behaviour guards it
public class BankAccount {
    private double balance;                       // hidden
    public void deposit(double amt) {
        if (amt &lt;= 0) throw new IllegalArgumentException("amount must be positive");
        balance += amt;
    }
    public double getBalance() { return balance; }
}

// Inheritance + Polymorphism
abstract class Shape {                            // abstraction
    abstract double area();
    void describe() { System.out.println(getClass().getSimpleName() + " area=" + area()); }
}
class Circle extends Shape {
    private final double r;
    Circle(double r) { this.r = r; }
    @Override double area() { return Math.PI * r * r; }
}
class Rect extends Shape {
    private final double w, h;
    Rect(double w, double h) { this.w = w; this.h = h; }
    @Override double area() { return w * h; }
}

public class Main {
    public static void main(String[] args) {
        Shape[] shapes = { new Circle(1), new Rect(2, 3) };
        for (Shape s : shapes) s.describe();      // runtime picks the right area()
    }
}
// Output:
// Circle area=3.141592653589793
// Rect area=6.0</code></pre>

#### Overloading vs overriding

<div class="tw"><table><thead><tr><th>Aspect</th><th>Overloading</th><th>Overriding</th></tr></thead><tbody>
<tr><td>Where</td><td>Same class (or subclass)</td><td>Subclass redefines superclass method</td></tr>
<tr><td>Signature</td><td>Same name, different parameter list</td><td>Same name and parameters, compatible return (covariant)</td></tr>
<tr><td>Resolved</td><td>Compile time (static binding)</td><td>Runtime (dynamic dispatch)</td></tr>
<tr><td>Access / exceptions</td><td>Free to change</td><td>Cannot reduce visibility or throw broader checked exceptions</td></tr>
<tr><td>static / private / final methods</td><td>Can overload</td><td>Cannot override (static is hidden, not overridden)</td></tr>
</tbody></table></div>

<pre data-lang="java"><code>class Printer {
    void print(int x)    { System.out.println("int " + x); }
    void print(String s) { System.out.println("String " + s); }
    void print(Object o) { System.out.println("Object " + o); }
}
Printer p = new Printer();
p.print(5);            // int 5
p.print("hi");         // String hi
p.print((Object)"hi"); // Object hi  -- chosen by DECLARED type at compile time

class Animal { String sound() { return "..."; } }
class Dog extends Animal { @Override String sound() { return "Woof"; } }
Animal a = new Dog();
System.out.println(a.sound());   // Woof -- chosen by ACTUAL type at runtime</code></pre>

#### Constructors, this, super, static and final

<pre data-lang="java"><code>class Person {
    protected final String name;
    static int count = 0;                 // shared by all instances
    Person(String name) { this.name = name; count++; }
    Person() { this("Unknown"); }         // constructor chaining with this(...)
}
class Student extends Person {
    int roll;
    Student(String name, int roll) {
        super(name);                      // must be the first statement
        this.roll = roll;
    }
}
// Order of initialization: static blocks (once) -&gt; super constructor -&gt; instance initializers -&gt; own constructor</code></pre>

<div class="tw"><table><thead><tr><th>Keyword</th><th>On variable</th><th>On method</th><th>On class</th></tr></thead><tbody>
<tr><td><code>final</code></td><td>Cannot be reassigned (a final reference can still point to a mutable object)</td><td>Cannot be overridden</td><td>Cannot be extended (String, Integer)</td></tr>
<tr><td><code>static</code></td><td>One copy per class</td><td>Called without instance; no <code>this</code></td><td>Only for nested classes</td></tr>
<tr><td><code>abstract</code></td><td>-</td><td>No body, subclass must implement</td><td>Cannot be instantiated</td></tr>
</tbody></table></div>

<div class="box note"><b>📝 Access modifiers</b> private (class only) &lt; default/package-private (same package) &lt; protected (package + subclasses) &lt; public (everywhere). Java has single class inheritance but a class can implement many interfaces; this avoids the diamond problem for state.</div>

### Interface vs Abstract Class

<div class="tw"><table><thead><tr><th>Feature</th><th>Interface</th><th>Abstract class</th></tr></thead><tbody>
<tr><td>Purpose</td><td>Contract / capability ("can do")</td><td>Partial base implementation ("is a")</td></tr>
<tr><td>Inheritance</td><td>A class can implement many</td><td>A class extends only one</td></tr>
<tr><td>Fields</td><td>Only <code>public static final</code> constants</td><td>Any instance and static fields (state)</td></tr>
<tr><td>Methods</td><td>abstract, default, static, private (Java 8/9)</td><td>abstract and concrete, any access</td></tr>
<tr><td>Constructors</td><td>No</td><td>Yes (called via super)</td></tr>
<tr><td>Lambdas</td><td>Functional interfaces can be lambda targets</td><td>No</td></tr>
</tbody></table></div>

<pre data-lang="java"><code>interface Payment {
    void pay(double amount);                                  // abstract
    default void receipt(double amt) {                        // default method (Java 8)
        System.out.println("Paid " + amt + " via " + name());
    }
    String name();
    static Payment of(String n) { return new Upi(); }         // static method
}
class Upi implements Payment {
    public void pay(double a) { System.out.println("UPI debit " + a); }
    public String name() { return "UPI"; }
}

abstract class Vehicle {                                      // state + shared code
    protected int speed;
    Vehicle(int speed) { this.speed = speed; }
    abstract void start();
    void stop() { speed = 0; }
}</code></pre>

<div class="box tip"><b>✅ When to use which</b> Use an interface to define a role several unrelated classes share (Comparable, Runnable). Use an abstract class when subclasses share state and common code. If a class inherits conflicting default methods from two interfaces it must override and can pick one with <code>A.super.method()</code>.</div>

### Collections Framework Overview

<div class="diagram">
<div class="diagram-label">flowchart — collections hierarchy</div>
<div class="mermaid">
flowchart TD
    IT["Iterable"] --> CO["Collection"]
    CO --> LIST["List\nordered, duplicates"]
    CO --> SET["Set\nno duplicates"]
    CO --> QUEUE["Queue / Deque"]
    LIST --> AL["ArrayList\nget O of 1"]
    LIST --> LL["LinkedList\ninsert O of 1 at ends"]
    SET --> HS["HashSet"]
    SET --> LHS["LinkedHashSet\ninsertion order"]
    SET --> TS["TreeSet\nsorted"]
    QUEUE --> PQ["PriorityQueue\nmin-heap"]
    QUEUE --> AD["ArrayDeque\nstack and queue"]
    MAP["Map\nnot a Collection"] --> HM["HashMap"]
    MAP --> TM["TreeMap\nsorted by key"]
    MAP --> LHM["LinkedHashMap"]
</div>
</div>

<div class="tw"><table><thead><tr><th>Class</th><th>Backing structure</th><th>get / contains</th><th>add / put</th><th>Order</th><th>Nulls</th><th>Thread-safe</th></tr></thead><tbody>
<tr><td>ArrayList</td><td>Resizable array</td><td>O(1) by index</td><td>O(1) amortised at end, O(n) middle</td><td>Insertion</td><td>Yes</td><td>No</td></tr>
<tr><td>LinkedList</td><td>Doubly linked list</td><td>O(n)</td><td>O(1) at ends</td><td>Insertion</td><td>Yes</td><td>No</td></tr>
<tr><td>HashSet</td><td>HashMap keys</td><td>O(1) avg</td><td>O(1) avg</td><td>None</td><td>One null</td><td>No</td></tr>
<tr><td>LinkedHashSet</td><td>Hash + linked list</td><td>O(1)</td><td>O(1)</td><td>Insertion</td><td>One null</td><td>No</td></tr>
<tr><td>TreeSet / TreeMap</td><td>Red-black tree</td><td>O(log n)</td><td>O(log n)</td><td>Sorted</td><td>No null key</td><td>No</td></tr>
<tr><td>HashMap</td><td>Array of buckets (list/tree)</td><td>O(1) avg</td><td>O(1) avg</td><td>None</td><td>1 null key, many null values</td><td>No</td></tr>
<tr><td>ConcurrentHashMap</td><td>Buckets with CAS + per-bin locks</td><td>O(1)</td><td>O(1)</td><td>None</td><td>No nulls</td><td>Yes</td></tr>
<tr><td>PriorityQueue</td><td>Binary heap</td><td>peek O(1)</td><td>O(log n)</td><td>By priority</td><td>No</td><td>No</td></tr>
</tbody></table></div>

<div class="box info"><b>💡 Choosing a collection</b> Random access: ArrayList. Unique + fast lookup: HashSet. Unique + sorted: TreeSet. Key-value: HashMap (TreeMap if sorted, LinkedHashMap if insertion order or LRU cache, ConcurrentHashMap if shared across threads). Stack or queue: ArrayDeque (not Stack or LinkedList).</div>

### ArrayList internals and growth

ArrayList wraps an <code>Object[]</code>. The default capacity is 10 (allocated lazily on first add). When full, a new array of about 1.5x size is created (<code>newCap = oldCap + (oldCap &gt;&gt; 1)</code>) and elements are copied with <code>Arrays.copyOf</code>.

<div class="diagram">
<div class="diagram-label">flowchart — ArrayList.add flow</div>
<div class="mermaid">
flowchart TD
    A["add element"] --> B{"size equals\narray length?"}
    B -->|"no"| C["elementData at size = e\nsize plus 1"]
    B -->|"yes"| D["grow: newCap = old + old/2"]
    D --> E["Arrays.copyOf into bigger array"]
    E --> C
</div>
</div>

<div class="tw"><table><thead><tr><th>Add number</th><th>Capacity before</th><th>Action</th></tr></thead><tbody>
<tr><td>1st</td><td>0 (empty shared array)</td><td>Allocate 10</td></tr>
<tr><td>11th</td><td>10</td><td>Grow to 15, copy 10 elements</td></tr>
<tr><td>16th</td><td>15</td><td>Grow to 22</td></tr>
<tr><td>23rd</td><td>22</td><td>Grow to 33</td></tr>
</tbody></table></div>

<pre data-lang="java"><code>List&lt;Integer&gt; list = new ArrayList&lt;&gt;(1000);   // pre-size when you know the count: avoids copies
for (int i = 0; i &lt; 1000; i++) list.add(i);

// Remove inside a loop: ConcurrentModificationException
List&lt;Integer&gt; nums = new ArrayList&lt;&gt;(List.of(1, 2, 3, 4));
for (Integer n : nums) { if (n == 2) nums.remove(n); }   // throws CME (fail-fast iterator)

// Safe options
nums.removeIf(n -&gt; n == 2);
Iterator&lt;Integer&gt; it = nums.iterator();
while (it.hasNext()) if (it.next() == 3) it.remove();

// remove(int index) vs remove(Object o)
List&lt;Integer&gt; l = new ArrayList&lt;&gt;(List.of(10, 20, 30));
l.remove(1);                       // removes index 1 -&gt; [10, 30]
l.remove(Integer.valueOf(10));     // removes value 10 -&gt; [30]</code></pre>

<div class="box note"><b>📝 ArrayList vs LinkedList</b> In practice ArrayList wins almost always, even for inserts, because of CPU cache locality. LinkedList is O(1) only when you already hold the node position; reaching the middle costs O(n). <code>List.of()</code> returns an immutable list.</div>

### HashMap internals: put and get flow

A HashMap is an array of buckets (<code>Node[] table</code>, default size 16, always a power of two). The index of a key is computed from its <code>hashCode()</code>; colliding keys are chained in a linked list, converted to a red-black tree when a bucket holds 8 or more nodes (and the table has at least 64 slots).

<div class="diagram">
<div class="diagram-label">flowchart — HashMap.put(key, value)</div>
<div class="mermaid">
flowchart TD
    P["put key value"] --> H["hash = key.hashCode XOR hash shifted right 16"]
    H --> IDX["index = hash AND n-1"]
    IDX --> E{"bucket empty?"}
    E -->|"yes"| N["create new Node in bucket"]
    E -->|"no"| K{"first node key equals?\nsame hash and equals true"}
    K -->|"yes"| REP["replace value, return old"]
    K -->|"no"| T{"bucket is tree?"}
    T -->|"yes"| TREE["insert into red-black tree"]
    T -->|"no"| WALK["walk linked list\nequals match then replace\nelse append at tail"]
    WALK --> TH{"chain length 8 or more?"}
    TH -->|"yes"| TR["treeify bucket"]
    N --> RS{"size above\nthreshold 0.75 x capacity?"}
    TR --> RS
    TREE --> RS
    RS -->|"yes"| RZ["resize: double table and rehash"]
</div>
</div>

<div class="diagram">
<div class="diagram-label">flowchart — HashMap.get(key)</div>
<div class="mermaid">
flowchart LR
    G["get key"] --> H["compute hash and index"]
    H --> B{"bucket empty?"}
    B -->|"yes"| NUL["return null"]
    B -->|"no"| F{"first node matches\nhash and equals?"}
    F -->|"yes"| RET["return value"]
    F -->|"no"| W["walk chain or tree\ncompare hash then equals"]
    W --> RET2["return value or null"]
</div>
</div>

Worked example with capacity 16:

<pre data-lang="java"><code>Map&lt;String, Integer&gt; m = new HashMap&lt;&gt;();
m.put("Asha", 90);
// "Asha".hashCode() = 2000476 (say). spread: h ^ (h &gt;&gt;&gt; 16). index = spread &amp; 15 -&gt; e.g. bucket 7
m.put("Ravi", 85);   // different bucket, say 3
m.put("Meer", 70);   // if it maps to bucket 7 too -&gt; collision, chained after "Asha"
m.get("Meer");       // bucket 7: first node "Asha" -&gt; equals false -&gt; next node "Meer" -&gt; equals true -&gt; 70

// Resize: capacity 16 * load factor 0.75 = threshold 12.
// The 13th entry triggers resize to 32, every entry is redistributed (index uses one more bit).</code></pre>

<div class="tw"><table><thead><tr><th>Fact</th><th>Value / rule</th></tr></thead><tbody>
<tr><td>Default capacity / load factor</td><td>16 / 0.75</td></tr>
<tr><td>Treeify threshold</td><td>8 nodes in a bucket (and table size at least 64, else it resizes instead)</td></tr>
<tr><td>Untreeify</td><td>6 nodes</td></tr>
<tr><td>Null key</td><td>Allowed, stored in bucket 0</td></tr>
<tr><td>Worst case get</td><td>O(log n) with trees (was O(n) before Java 8)</td></tr>
<tr><td>Iteration order</td><td>Not guaranteed, can change after resize</td></tr>
</tbody></table></div>

<div class="box warn"><b>⚠️ Mutable keys</b> If a key's fields used in <code>hashCode</code> change after insertion, the entry is in the wrong bucket and get() returns null. Use immutable keys (String, Integer, records).</div>

#### HashMap vs Hashtable vs ConcurrentHashMap vs synchronizedMap

<div class="tw"><table><thead><tr><th>Type</th><th>Locking</th><th>Nulls</th><th>Notes</th></tr></thead><tbody>
<tr><td>HashMap</td><td>None</td><td>1 null key, null values</td><td>Not thread-safe; concurrent resize can corrupt data</td></tr>
<tr><td>Hashtable</td><td>Whole-table synchronized</td><td>None</td><td>Legacy, slow</td></tr>
<tr><td>Collections.synchronizedMap</td><td>Single mutex wrapper</td><td>As wrapped map</td><td>Compound actions still need external locking</td></tr>
<tr><td>ConcurrentHashMap</td><td>CAS for empty bins, synchronized on the first node of a bin (Java 8+)</td><td>None</td><td>Reads lock-free, atomic <code>merge</code>, <code>compute</code></td></tr>
</tbody></table></div>

<pre data-lang="java"><code>ConcurrentHashMap&lt;String, Integer&gt; hits = new ConcurrentHashMap&lt;&gt;();
hits.merge("home", 1, Integer::sum);       // atomic increment, safe across threads
hits.computeIfAbsent("cart", k -&gt; 0);

// LRU cache with LinkedHashMap
class Lru&lt;K, V&gt; extends LinkedHashMap&lt;K, V&gt; {
    private final int cap;
    Lru(int cap) { super(16, 0.75f, true); this.cap = cap; }     // true = access order
    @Override protected boolean removeEldestEntry(Map.Entry&lt;K, V&gt; e) { return size() &gt; cap; }
}</code></pre>

### equals() and hashCode() contract

<div class="tw"><table><thead><tr><th>Rule</th><th>Meaning</th></tr></thead><tbody>
<tr><td>Reflexive, symmetric, transitive, consistent</td><td><code>a.equals(a)</code> true; <code>a.equals(b)</code> equals <code>b.equals(a)</code>; stable over time; <code>equals(null)</code> false</td></tr>
<tr><td>Equal objects must have equal hash codes</td><td>If <code>a.equals(b)</code> then <code>a.hashCode() == b.hashCode()</code></td></tr>
<tr><td>Unequal objects may share a hash</td><td>Collision, allowed but hurts performance</td></tr>
</tbody></table></div>

<pre data-lang="java"><code>class Emp {
    final int id; final String name;
    Emp(int id, String name) { this.id = id; this.name = name; }
    // WITHOUT equals/hashCode overridden:
}
Set&lt;Emp&gt; s = new HashSet&lt;&gt;();
s.add(new Emp(1, "Asha"));
s.add(new Emp(1, "Asha"));
System.out.println(s.size());   // 2  -- default equals compares references

class Emp2 {
    final int id; final String name;
    Emp2(int id, String name) { this.id = id; this.name = name; }
    @Override public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Emp2)) return false;
        Emp2 e = (Emp2) o;
        return id == e.id &amp;&amp; Objects.equals(name, e.name);
    }
    @Override public int hashCode() { return Objects.hash(id, name); }
}
Set&lt;Emp2&gt; s2 = new HashSet&lt;&gt;();
s2.add(new Emp2(1, "Asha"));
s2.add(new Emp2(1, "Asha"));
System.out.println(s2.size());  // 1</code></pre>

<div class="box warn"><b>⚠️ Common bug</b> Overriding equals without hashCode: HashSet and HashMap will treat "equal" objects as different because they land in different buckets. Records (Java 16) generate both correctly.</div>

### Sorting: Comparable vs Comparator

<pre data-lang="java"><code>class Person implements Comparable&lt;Person&gt; {
    String name; int age;
    Person(String n, int a) { name = n; age = a; }
    public int compareTo(Person o) { return Integer.compare(age, o.age); }   // natural order
    public String toString() { return name + "(" + age + ")"; }
}
List&lt;Person&gt; ps = new ArrayList&lt;&gt;(List.of(new Person("Ravi", 30), new Person("Asha", 25), new Person("Meera", 30)));
Collections.sort(ps);                                    // [Asha(25), Ravi(30), Meera(30)]
ps.sort(Comparator.comparing((Person p) -&gt; p.age).reversed()
                  .thenComparing(p -&gt; p.name));          // [Meera(30), Ravi(30), Asha(25)]</code></pre>

Comparable defines the single natural ordering inside the class; Comparator is an external, pluggable ordering. Sorting objects uses a stable TimSort (O(n log n)).

### Exception Handling

<div class="diagram">
<div class="diagram-label">flowchart — exception hierarchy</div>
<div class="mermaid">
flowchart TD
    TH["Throwable"] --> EX["Exception"]
    TH --> ER["Error\ndo not catch"]
    EX --> CE["Checked\nIOException, SQLException"]
    EX --> UE["Unchecked RuntimeException\nNPE, IllegalArgument, IndexOutOfBounds"]
    ER --> OOM["OutOfMemoryError"]
    ER --> SOE["StackOverflowError"]
</div>
</div>

<div class="tw"><table><thead><tr><th>Kind</th><th>Rule</th><th>Examples</th></tr></thead><tbody>
<tr><td>Checked</td><td>Compiler forces catch or <code>throws</code></td><td>IOException, SQLException, InterruptedException</td></tr>
<tr><td>Unchecked</td><td>Programming errors, no forced handling</td><td>NullPointerException, ArithmeticException, ClassCastException</td></tr>
<tr><td>Error</td><td>JVM-level problems, rarely recoverable</td><td>OutOfMemoryError, StackOverflowError</td></tr>
</tbody></table></div>

<pre data-lang="java"><code>try {
    int[] a = new int[2];
    a[5] = 1;                              // ArrayIndexOutOfBoundsException
} catch (ArrayIndexOutOfBoundsException | NullPointerException e) {   // multi-catch
    System.out.println("bad index: " + e.getMessage());
} catch (Exception e) {                    // broad handler last
    throw new IllegalStateException("wrapped", e);                    // keep the cause
} finally {
    System.out.println("always runs");     // even after return, not after System.exit
}
// Output: bad index: Index 5 out of bounds for length 2 / always runs</code></pre>

#### try-with-resources and custom exceptions

<pre data-lang="java"><code>class Res implements AutoCloseable {
    final String n; Res(String n) { this.n = n; System.out.println("open " + n); }
    public void close() { System.out.println("close " + n); }
}
try (Res a = new Res("A"); Res b = new Res("B")) {
    System.out.println("body");
}
// Output: open A / open B / body / close B / close A   (closed in reverse order)

public class InsufficientFundsException extends Exception {          // checked
    private final double shortBy;
    public InsufficientFundsException(String msg, double shortBy) { super(msg); this.shortBy = shortBy; }
    public double getShortBy() { return shortBy; }
}</code></pre>

<div class="diagram">
<div class="diagram-label">flowchart — try catch finally flow</div>
<div class="mermaid">
flowchart TD
    T["try block runs"] --> X{"exception thrown?"}
    X -->|"no"| F["finally block"]
    X -->|"yes"| M{"matching catch?"}
    M -->|"yes"| C["catch block"] --> F
    M -->|"no"| F2["finally block"] --> P["exception propagates to caller"]
    F --> N["continue after try"]
</div>
</div>

<div class="box warn"><b>⚠️ Pitfalls</b> A <code>return</code> inside finally overrides the try's return and swallows exceptions. Never catch Exception and ignore it. throw vs throws: <code>throw</code> raises an exception object; <code>throws</code> declares what a method may raise. final vs finally vs finalize: keyword for constants, cleanup block, deprecated GC hook.</div>

### Multithreading: creating threads and the lifecycle

A thread is an independent path of execution inside a process; all threads of a process share the heap but have their own stack. Use threads to keep a UI responsive, overlap I/O waits, or use multiple cores.

<pre data-lang="java"><code>Thread t1 = new Thread(() -&gt; System.out.println("run in " + Thread.currentThread().getName()));
t1.start();          // creates a new call stack and calls run() there
t1.run();            // WRONG: just a normal method call on the current thread
t1.join();           // wait for it to finish

class Worker extends Thread { public void run() { /* ... */ } }
class Task implements Runnable { public void run() { /* ... */ } }   // preferred: separates task from thread</code></pre>

<div class="diagram">
<div class="diagram-label">stateDiagram — thread lifecycle</div>
<div class="mermaid">
stateDiagram-v2
    state "NEW" as s1
    state "RUNNABLE" as s2
    state "BLOCKED" as s3
    state "WAITING" as s4
    state "TIMED_WAITING" as s5
    state "TERMINATED" as s6
    [*] --> s1
    s1 --> s2: start
    s2 --> s3: waits for monitor lock
    s3 --> s2: lock acquired
    s2 --> s4: wait or join or park
    s4 --> s2: notify or thread ends
    s2 --> s5: sleep or wait with timeout
    s5 --> s2: timeout or notify
    s2 --> s6: run ends or exception
    s6 --> [*]
</div>
</div>

<div class="tw"><table><thead><tr><th>State</th><th>Meaning</th></tr></thead><tbody>
<tr><td>NEW</td><td>Created, not started</td></tr>
<tr><td>RUNNABLE</td><td>Running or ready for CPU (the OS scheduler decides)</td></tr>
<tr><td>BLOCKED</td><td>Waiting to enter a synchronized block held by another thread</td></tr>
<tr><td>WAITING</td><td>Waiting indefinitely: <code>wait()</code>, <code>join()</code>, <code>LockSupport.park()</code></td></tr>
<tr><td>TIMED_WAITING</td><td>Waiting with timeout: <code>sleep(ms)</code>, <code>join(ms)</code></td></tr>
<tr><td>TERMINATED</td><td>Finished</td></tr>
</tbody></table></div>

### Race conditions, synchronized and locks

A race condition occurs when threads access shared mutable data without coordination and the result depends on timing. <code>count++</code> is three steps (read, add, write), so two threads can both read 5 and both write 6.

<div class="diagram">
<div class="diagram-label">sequenceDiagram — lost increment without synchronization</div>
<div class="mermaid">
sequenceDiagram
    participant A as "Thread A"
    participant M as "count in memory"
    participant B as "Thread B"
    A->>M: read count = 5
    B->>M: read count = 5
    A->>M: write count = 6
    B->>M: write count = 6
    Note over M: Two increments but count is 6 instead of 7
</div>
</div>

<pre data-lang="java"><code>class Counter {
    private int count = 0;
    public synchronized void inc() { count++; }          // locks on 'this'
    public int get() { synchronized (this) { return count; } }
}

public class RaceDemo {
    public static void main(String[] args) throws Exception {
        Counter c = new Counter();
        Runnable r = () -&gt; { for (int i = 0; i &lt; 100_000; i++) c.inc(); };
        Thread a = new Thread(r), b = new Thread(r);
        a.start(); b.start(); a.join(); b.join();
        System.out.println(c.get());     // 200000 with synchronized; usually less without
    }
}</code></pre>

<div class="tw"><table><thead><tr><th>Mechanism</th><th>Guarantees</th><th>Notes</th></tr></thead><tbody>
<tr><td><code>synchronized</code> method / block</td><td>Mutual exclusion + visibility + ordering (happens-before)</td><td>Intrinsic monitor lock; reentrant; static synchronized locks the Class object</td></tr>
<tr><td><code>ReentrantLock</code></td><td>Same, plus tryLock, timeouts, fairness, interruptible</td><td>Always unlock in finally</td></tr>
<tr><td><code>ReadWriteLock</code></td><td>Many readers or one writer</td><td>Read-heavy data</td></tr>
<tr><td><code>AtomicInteger</code> etc.</td><td>Lock-free atomic ops via CAS</td><td>Single variable only</td></tr>
</tbody></table></div>

<pre data-lang="java"><code>Lock lock = new ReentrantLock();
lock.lock();
try { /* critical section */ }
finally { lock.unlock(); }

AtomicInteger hits = new AtomicInteger();
hits.incrementAndGet();                   // atomic, no lock
hits.compareAndSet(5, 10);                // set to 10 only if currently 5</code></pre>

#### wait / notify (producer-consumer)

<pre data-lang="java"><code>class Buffer {
    private final Queue&lt;Integer&gt; q = new LinkedList&lt;&gt;();
    private final int cap = 5;
    public synchronized void put(int v) throws InterruptedException {
        while (q.size() == cap) wait();      // loop, never if (spurious wakeups)
        q.add(v);
        notifyAll();
    }
    public synchronized int take() throws InterruptedException {
        while (q.isEmpty()) wait();
        int v = q.poll();
        notifyAll();
        return v;
    }
}
// In real code prefer BlockingQueue (ArrayBlockingQueue, LinkedBlockingQueue): put() and take() block for you.</code></pre>

<div class="box note"><b>📝 sleep vs wait</b> <code>sleep</code> pauses the thread and keeps any locks; <code>wait</code> must be called inside synchronized, releases the monitor and resumes on notify.</div>

### volatile and the Java Memory Model

Each CPU core may cache variables. Without synchronization, a write by one thread may not become visible to another, and the JIT or CPU may reorder instructions. <code>volatile</code> guarantees (1) visibility: writes go to main memory and reads see the latest value, and (2) no reordering across the volatile access. It does NOT make compound operations atomic.

<pre data-lang="java"><code>class Stopper {
    private volatile boolean running = true;     // without volatile the loop may never see false
    public void run()  { while (running) { /* work */ } }
    public void stop() { running = false; }
}

volatile int n = 0;
n++;                 // still NOT thread-safe: read-modify-write is three steps. Use AtomicInteger.

// Double-checked locking singleton needs volatile
class Single {
    private static volatile Single inst;
    static Single get() {
        if (inst == null) {
            synchronized (Single.class) { if (inst == null) inst = new Single(); }
        }
        return inst;
    }
}</code></pre>

<div class="tw"><table><thead><tr><th></th><th>volatile</th><th>synchronized</th><th>Atomic classes</th></tr></thead><tbody>
<tr><td>Visibility</td><td>Yes</td><td>Yes</td><td>Yes</td></tr>
<tr><td>Atomicity of compound ops</td><td>No</td><td>Yes</td><td>Yes (single variable)</td></tr>
<tr><td>Blocking</td><td>No</td><td>Yes</td><td>No</td></tr>
<tr><td>Typical use</td><td>Flags, safe publication</td><td>Critical sections</td><td>Counters</td></tr>
</tbody></table></div>

### Deadlock

Deadlock: two or more threads each hold a lock the other needs, so all wait forever. It requires four conditions together: mutual exclusion, hold and wait, no preemption, circular wait.

<div class="diagram">
<div class="diagram-label">sequenceDiagram — two-lock deadlock</div>
<div class="mermaid">
sequenceDiagram
    participant T1 as "Thread 1"
    participant LA as "Lock A"
    participant LB as "Lock B"
    participant T2 as "Thread 2"
    T1->>LA: acquire A
    T2->>LB: acquire B
    T1->>LB: acquire B blocked
    T2->>LA: acquire A blocked
    Note over T1,T2: Both wait forever
</div>
</div>

<pre data-lang="java"><code>final Object A = new Object(), B = new Object();
new Thread(() -&gt; { synchronized (A) { sleep(100); synchronized (B) { System.out.println("t1"); } } }).start();
new Thread(() -&gt; { synchronized (B) { sleep(100); synchronized (A) { System.out.println("t2"); } } }).start();
// Neither line is printed: deadlock. jstack shows "Found one Java-level deadlock".

// Fix 1: same global lock order (A then B) in every thread.
// Fix 2: tryLock with timeout and back off.
if (lockA.tryLock(1, TimeUnit.SECONDS)) {
    try { if (lockB.tryLock(1, TimeUnit.SECONDS)) { try { /* work */ } finally { lockB.unlock(); } } }
    finally { lockA.unlock(); }
}</code></pre>

<div class="box info"><b>💡 Related problems</b> Livelock: threads keep reacting to each other and make no progress. Starvation: a thread never gets the lock or CPU (unfair locks, low priority). Detect with <code>jstack &lt;pid&gt;</code>, VisualVM or <code>ThreadMXBean.findDeadlockedThreads()</code>.</div>

### Executors and Thread Pools

Creating a raw thread per task is expensive (about 1 MB stack each) and unbounded. A thread pool reuses a fixed set of worker threads that pull tasks from a queue.

<div class="diagram">
<div class="diagram-label">flowchart — ThreadPoolExecutor task handling</div>
<div class="mermaid">
flowchart TD
    S["submit task"] --> C{"running threads\nless than corePoolSize?"}
    C -->|"yes"| NT["start new core thread"]
    C -->|"no"| Q{"queue has space?"}
    Q -->|"yes"| ENQ["add to queue"]
    Q -->|"no"| M{"threads less than\nmaximumPoolSize?"}
    M -->|"yes"| NT2["start extra thread"]
    M -->|"no"| REJ["RejectedExecutionHandler\nAbort, CallerRuns, Discard"]
</div>
</div>

<pre data-lang="java"><code>ExecutorService pool = Executors.newFixedThreadPool(4);
List&lt;Future&lt;Integer&gt;&gt; fs = new ArrayList&lt;&gt;();
for (int i = 1; i &lt;= 3; i++) {
    final int n = i;
    fs.add(pool.submit(() -&gt; n * n));           // Callable returns a value
}
for (Future&lt;Integer&gt; f : fs) System.out.println(f.get());   // 1 4 9 (get blocks)
pool.shutdown();                                  // stop accepting, finish queued
pool.awaitTermination(10, TimeUnit.SECONDS);

// Production style: explicit bounded pool
ThreadPoolExecutor tpe = new ThreadPoolExecutor(
    4, 8, 60, TimeUnit.SECONDS,
    new ArrayBlockingQueue&lt;&gt;(100),
    new ThreadPoolExecutor.CallerRunsPolicy());

ScheduledExecutorService sch = Executors.newScheduledThreadPool(1);
sch.scheduleAtFixedRate(() -&gt; System.out.println("tick"), 0, 5, TimeUnit.SECONDS);</code></pre>

<div class="tw"><table><thead><tr><th>Factory</th><th>Behaviour</th><th>Risk</th></tr></thead><tbody>
<tr><td>newFixedThreadPool(n)</td><td>n threads, unbounded queue</td><td>Queue can grow until OOM</td></tr>
<tr><td>newCachedThreadPool()</td><td>Creates threads as needed, idle ones expire</td><td>Unbounded thread creation</td></tr>
<tr><td>newSingleThreadExecutor()</td><td>One thread, tasks in order</td><td>Unbounded queue</td></tr>
<tr><td>newScheduledThreadPool(n)</td><td>Delayed or periodic tasks</td><td>-</td></tr>
<tr><td>newVirtualThreadPerTaskExecutor()</td><td>Virtual thread per task (Java 21)</td><td>Preview before 21</td></tr>
</tbody></table></div>

<div class="box tip"><b>✅ Sizing</b> CPU-bound work: pool size about number of cores (<code>Runtime.getRuntime().availableProcessors()</code>). I/O-bound work: larger, cores x (1 + wait time / compute time). Prefer a bounded queue so overload applies back-pressure. Always shut pools down.</div>

#### Useful concurrency utilities

<div class="tw"><table><thead><tr><th>Class</th><th>Purpose</th></tr></thead><tbody>
<tr><td>CountDownLatch</td><td>Wait until N events happened (one-shot)</td></tr>
<tr><td>CyclicBarrier</td><td>N threads wait for each other, reusable</td></tr>
<tr><td>Semaphore</td><td>Limit concurrent access to N permits</td></tr>
<tr><td>BlockingQueue</td><td>Thread-safe producer-consumer hand-off</td></tr>
<tr><td>ThreadLocal</td><td>Per-thread variable copy (clear it in pools to avoid leaks)</td></tr>
<tr><td>ForkJoinPool</td><td>Work-stealing pool used by parallel streams and CompletableFuture</td></tr>
</tbody></table></div>

### CompletableFuture (async pipelines)

<code>Future.get()</code> blocks. CompletableFuture lets you chain non-blocking stages, combine results and handle errors. By default stages run on <code>ForkJoinPool.commonPool()</code>; pass your own executor for blocking I/O.

<div class="diagram">
<div class="diagram-label">flowchart — CompletableFuture chain</div>
<div class="mermaid">
flowchart LR
    S["supplyAsync\nfetchUser"] --> A["thenApply\nenrich with orders"]
    A --> B["thenCompose\ncall another async"]
    B --> C["thenAccept\nsend email"]
    S -.->|"any stage fails"| E["exceptionally or handle"]
</div>
</div>

<pre data-lang="java"><code>ExecutorService io = Executors.newFixedThreadPool(8);

CompletableFuture&lt;String&gt; user    = CompletableFuture.supplyAsync(() -&gt; "Asha", io);
CompletableFuture&lt;Integer&gt; orders = CompletableFuture.supplyAsync(() -&gt; 3, io);

CompletableFuture&lt;String&gt; summary = user.thenCombine(orders, (u, n) -&gt; u + " has " + n + " orders");
System.out.println(summary.get());                       // Asha has 3 orders

CompletableFuture&lt;Integer&gt; risky = CompletableFuture
    .supplyAsync(() -&gt; { if (true) throw new IllegalStateException("db down"); return 1; })
    .exceptionally(ex -&gt; -1);                            // fallback value
System.out.println(risky.join());                        // -1

CompletableFuture.allOf(user, orders).join();            // wait for all
CompletableFuture.anyOf(user, orders).join();            // first to finish
io.shutdown();</code></pre>

<div class="tw"><table><thead><tr><th>Method</th><th>Use</th></tr></thead><tbody>
<tr><td>thenApply</td><td>Transform result (map)</td></tr>
<tr><td>thenCompose</td><td>Chain another async call (flatMap) - avoids nested futures</td></tr>
<tr><td>thenCombine</td><td>Merge two independent futures</td></tr>
<tr><td>thenAccept / thenRun</td><td>Consume result / just run action</td></tr>
<tr><td>exceptionally / handle / whenComplete</td><td>Error recovery and cleanup</td></tr>
<tr><td>join vs get</td><td>join throws unchecked CompletionException; get throws checked exceptions</td></tr>
</tbody></table></div>

### String, String Pool and Immutability

A <code>String</code> is immutable: its value cannot change after creation. Every "modification" returns a new object. This makes strings safe as HashMap keys, thread-safe, cacheable (hash is cached) and secure (class loading, file paths).

<div class="diagram">
<div class="diagram-label">flowchart — string pool behaviour</div>
<div class="mermaid">
flowchart TD
    L1["String a = hello"] --> POOL["String pool in heap\nhello"]
    L2["String b = hello"] --> POOL
    N["String c = new String hello"] --> HEAPOBJ["separate object on heap"]
    HEAPOBJ -.->|"c.intern"| POOL
</div>
</div>

<pre data-lang="java"><code>String a = "java";
String b = "java";
String c = new String("java");
System.out.println(a == b);              // true   same pooled object
System.out.println(a == c);              // false  different objects
System.out.println(a.equals(c));         // true   same characters
System.out.println(a == c.intern());    // true   intern returns the pooled instance

String s = "Hi";
s.concat(" there");                      // result discarded, s is still "Hi"
s = s.concat(" there");                  // reassign to see the new string

// Compile-time constant folding
String x = "ja" + "va";
System.out.println(a == x);              // true (folded at compile time)
String part = "ja";
String y = part + "va";
System.out.println(a == y);              // false (built at runtime)</code></pre>

<div class="tw"><table><thead><tr><th></th><th>String</th><th>StringBuilder</th><th>StringBuffer</th></tr></thead><tbody>
<tr><td>Mutable</td><td>No</td><td>Yes</td><td>Yes</td></tr>
<tr><td>Thread-safe</td><td>Yes (immutable)</td><td>No</td><td>Yes (synchronized, slower)</td></tr>
<tr><td>Use</td><td>Constants, keys</td><td>Building text in loops</td><td>Rarely needed</td></tr>
</tbody></table></div>

<pre data-lang="java"><code>// O(n^2) because each += creates a new String
String s = "";
for (int i = 0; i &lt; 5; i++) s += i;

// O(n)
StringBuilder sb = new StringBuilder();
for (int i = 0; i &lt; 5; i++) sb.append(i);
System.out.println(sb.reverse());        // 43210

// Useful methods
"a,b,c".split(",");  "  x ".strip();  "abc".repeat(2);  String.join("-", "a", "b");
"Java".chars().filter(ch -&gt; ch == 'a').count();   // 2</code></pre>

<div class="box tip"><b>✅ Interview quick answer</b> Why is String immutable? Pool sharing safety, cached hashCode, thread safety, security of parameters. Passwords: prefer <code>char[]</code>, which can be wiped, because a String lingers in the pool until GC.</div>

### Generics and Type Erasure

Generics add compile-time type safety and remove casts. The compiler checks types, then <strong>erases</strong> them: at runtime <code>List&lt;String&gt;</code> and <code>List&lt;Integer&gt;</code> are both plain <code>List</code>.

<pre data-lang="java"><code>List raw = new ArrayList();            // raw type: no checks
raw.add("x"); raw.add(5);
String s = (String) raw.get(1);        // ClassCastException at runtime

List&lt;String&gt; safe = new ArrayList&lt;&gt;();
// safe.add(5);                        // compile error, caught early

// Generic class and method
class Box&lt;T&gt; {
    private T value;
    Box(T v) { value = v; }
    T get() { return value; }
}
static &lt;T extends Comparable&lt;T&gt;&gt; T max(T a, T b) { return a.compareTo(b) &gt;= 0 ? a : b; }
System.out.println(max(3, 9));         // 9
System.out.println(max("pen", "ink")); // pen</code></pre>

#### Wildcards: PECS (Producer Extends, Consumer Super)

<div class="tw"><table><thead><tr><th>Syntax</th><th>Meaning</th><th>Can read as</th><th>Can add</th></tr></thead><tbody>
<tr><td><code>List&lt;?&gt;</code></td><td>Unknown type</td><td>Object</td><td>null only</td></tr>
<tr><td><code>List&lt;? extends Number&gt;</code></td><td>Number or any subtype (producer)</td><td>Number</td><td>Nothing (except null)</td></tr>
<tr><td><code>List&lt;? super Integer&gt;</code></td><td>Integer or any supertype (consumer)</td><td>Object</td><td>Integer</td></tr>
</tbody></table></div>

<pre data-lang="java"><code>static double sum(List&lt;? extends Number&gt; nums) {      // reads only
    double t = 0; for (Number n : nums) t += n.doubleValue(); return t;
}
sum(List.of(1, 2, 3));        // 6.0
sum(List.of(1.5, 2.5));       // 4.0

static void fill(List&lt;? super Integer&gt; sink) { sink.add(42); }   // writes only

// Generics are invariant: List&lt;Integer&gt; is NOT a List&lt;Number&gt;
// List&lt;Number&gt; ln = new ArrayList&lt;Integer&gt;();   // compile error
// Erasure limits: no new T(), no new T[], no instanceof List&lt;String&gt;, no primitives (use Integer)</code></pre>

### Optional

Optional is a container that may or may not hold a non-null value; it makes "no result" explicit in a method's return type and avoids NullPointerException chains. Use it for return values, not for fields or parameters.

<pre data-lang="java"><code>Optional&lt;String&gt; name = Optional.of("Asha");          // of(null) throws NPE
Optional&lt;String&gt; none = Optional.empty();
Optional&lt;String&gt; maybe = Optional.ofNullable(findName()); // null-safe

name.isPresent();                                       // true
name.map(String::toUpperCase).orElse("UNKNOWN");        // ASHA
none.orElse("UNKNOWN");                                 // UNKNOWN
none.orElseGet(() -&gt; compute());                        // lazy default
none.orElseThrow(() -&gt; new NoSuchElementException("missing"));
name.ifPresent(n -&gt; System.out.println("Hi " + n));
name.filter(n -&gt; n.startsWith("A")).isPresent();        // true
user.flatMap(User::getAddress).map(Address::getCity).orElse("n/a");

// orElse always evaluates its argument; orElseGet only when empty
x.orElse(expensive());          // expensive() runs even if x has a value
x.orElseGet(() -&gt; expensive()); // runs only if empty</code></pre>

<div class="box warn"><b>⚠️ Anti-patterns</b> Calling <code>get()</code> without checking, <code>Optional</code> as a method parameter or entity field, and returning null instead of <code>Optional.empty()</code>. Optional is not Serializable.</div>

### Lambdas and Functional Interfaces

A functional interface has exactly one abstract method (it may also have default and static methods). A lambda is a concise implementation of that method: <code>(params) -&gt; expression</code>. It captures variables from the enclosing scope only if they are effectively final.

<pre data-lang="java"><code>// Before Java 8
Comparator&lt;String&gt; old = new Comparator&lt;String&gt;() {
    public int compare(String a, String b) { return a.length() - b.length(); }
};
// Lambda
Comparator&lt;String&gt; byLen = (a, b) -&gt; a.length() - b.length();
// Method reference
Function&lt;String, Integer&gt; len = String::length;
Supplier&lt;List&lt;String&gt;&gt; mk = ArrayList::new;

@FunctionalInterface
interface Discount { double apply(double price); }
Discount tenOff = p -&gt; p * 0.9;
System.out.println(tenOff.apply(500));          // 450.0

int base = 10;
Runnable r = () -&gt; System.out.println(base + 1);   // ok: base is effectively final
// base++;                                          // would make the lambda above a compile error</code></pre>

<div class="tw"><table><thead><tr><th>Interface</th><th>Method</th><th>Meaning</th><th>Example</th></tr></thead><tbody>
<tr><td><code>Predicate&lt;T&gt;</code></td><td>boolean test(T)</td><td>Test a condition</td><td><code>s -&gt; s.isEmpty()</code></td></tr>
<tr><td><code>Function&lt;T,R&gt;</code></td><td>R apply(T)</td><td>Transform</td><td><code>s -&gt; s.length()</code></td></tr>
<tr><td><code>Consumer&lt;T&gt;</code></td><td>void accept(T)</td><td>Use a value</td><td><code>System.out::println</code></td></tr>
<tr><td><code>Supplier&lt;T&gt;</code></td><td>T get()</td><td>Produce a value</td><td><code>() -&gt; UUID.randomUUID()</code></td></tr>
<tr><td><code>BiFunction&lt;T,U,R&gt;</code></td><td>R apply(T,U)</td><td>Two inputs</td><td><code>(a, b) -&gt; a + b</code></td></tr>
<tr><td><code>UnaryOperator&lt;T&gt;</code> / <code>BinaryOperator&lt;T&gt;</code></td><td>T apply</td><td>Same type in and out</td><td><code>Integer::sum</code></td></tr>
<tr><td><code>Runnable</code> / <code>Callable&lt;V&gt;</code></td><td>run / call</td><td>No result / result and checked exceptions</td><td>-</td></tr>
</tbody></table></div>

<pre data-lang="java"><code>Predicate&lt;String&gt; notEmpty = s -&gt; !s.isEmpty();
Predicate&lt;String&gt; shortStr = s -&gt; s.length() &lt; 5;
System.out.println(notEmpty.and(shortStr).test("abc"));   // true
Function&lt;Integer,Integer&gt; dbl = x -&gt; x * 2, inc = x -&gt; x + 1;
System.out.println(dbl.andThen(inc).apply(5));            // 11  (double, then add 1)
System.out.println(dbl.compose(inc).apply(5));            // 12  (add 1, then double)</code></pre>

<div class="tw"><table><thead><tr><th>Method reference kind</th><th>Syntax</th><th>Equivalent lambda</th></tr></thead><tbody>
<tr><td>Static method</td><td><code>Integer::parseInt</code></td><td><code>s -&gt; Integer.parseInt(s)</code></td></tr>
<tr><td>Instance on a given object</td><td><code>System.out::println</code></td><td><code>x -&gt; System.out.println(x)</code></td></tr>
<tr><td>Instance on parameter</td><td><code>String::length</code></td><td><code>s -&gt; s.length()</code></td></tr>
<tr><td>Constructor</td><td><code>ArrayList::new</code></td><td><code>() -&gt; new ArrayList&lt;&gt;()</code></td></tr>
</tbody></table></div>

### Stream API

A stream is a pipeline over a data source that supports declarative operations. It does not store data, does not modify the source, is lazy (nothing runs until a terminal operation) and can be consumed only once.

<div class="diagram">
<div class="diagram-label">flowchart — stream pipeline</div>
<div class="mermaid">
flowchart LR
    SRC["Source\nList, Set, array, Stream.of"] --> INT["Intermediate ops lazy\nfilter, map, flatMap, sorted, distinct, limit, peek"]
    INT --> TERM["Terminal op triggers work\ncollect, reduce, count, forEach, findFirst, anyMatch"]
    TERM --> RES["Result"]
</div>
</div>

<pre data-lang="java"><code>record Emp(String name, String dept, double salary) {}
List&lt;Emp&gt; emps = List.of(
    new Emp("Asha", "Eng", 120000), new Emp("Ravi", "Eng", 90000),
    new Emp("Meera", "Sales", 70000), new Emp("Dev", "Sales", 60000));

// filter + map + collect
List&lt;String&gt; names = emps.stream()
    .filter(e -&gt; e.salary() &gt; 65000)
    .sorted(Comparator.comparingDouble(Emp::salary).reversed())
    .map(Emp::name)
    .collect(Collectors.toList());                 // [Asha, Ravi, Meera]

// groupingBy
Map&lt;String, List&lt;String&gt;&gt; byDept = emps.stream()
    .collect(Collectors.groupingBy(Emp::dept, Collectors.mapping(Emp::name, Collectors.toList())));
// {Eng=[Asha, Ravi], Sales=[Meera, Dev]}

// groupingBy + aggregate
Map&lt;String, Double&gt; avg = emps.stream()
    .collect(Collectors.groupingBy(Emp::dept, Collectors.averagingDouble(Emp::salary)));
// {Eng=105000.0, Sales=65000.0}

// partitioningBy: two groups true/false
Map&lt;Boolean, Long&gt; part = emps.stream()
    .collect(Collectors.partitioningBy(e -&gt; e.salary() &gt;= 80000, Collectors.counting()));
// {false=2, true=2}

// reduce, numeric streams, joining
double total = emps.stream().mapToDouble(Emp::salary).sum();          // 340000.0
Optional&lt;Emp&gt; top = emps.stream().max(Comparator.comparingDouble(Emp::salary));
String csv = emps.stream().map(Emp::name).collect(Collectors.joining(", ", "[", "]"));
int sumSq = IntStream.rangeClosed(1, 4).map(x -&gt; x * x).sum();        // 30
// flatMap: flatten nested lists
List&lt;List&lt;Integer&gt;&gt; nested = List.of(List.of(1, 2), List.of(3));
List&lt;Integer&gt; flat = nested.stream().flatMap(List::stream).toList();  // [1, 2, 3] (Java 16 toList)

// toMap with duplicate-key merge
Map&lt;String, Double&gt; deptTotal = emps.stream()
    .collect(Collectors.toMap(Emp::dept, Emp::salary, Double::sum));   // Eng=210000, Sales=130000</code></pre>

<div class="tw"><table><thead><tr><th>Intermediate</th><th>Terminal</th></tr></thead><tbody>
<tr><td>filter, map, flatMap, distinct, sorted, limit, skip, peek, mapToInt, takeWhile, dropWhile</td><td>collect, forEach, reduce, count, min, max, findFirst, findAny, anyMatch, allMatch, noneMatch, toList, toArray</td></tr>
</tbody></table></div>

<pre data-lang="java"><code>// Laziness and short-circuit
Stream.of("a", "bb", "ccc", "dddd")
    .filter(s -&gt; { System.out.println("filter " + s); return s.length() &gt; 1; })
    .map(s -&gt; { System.out.println("map " + s); return s.toUpperCase(); })
    .findFirst();
// Output: filter a / filter bb / map bb   -- stops after the first match, other elements never touched

Stream&lt;Integer&gt; st = Stream.of(1, 2);
st.count();
// st.count();   // IllegalStateException: stream has already been operated upon or closed</code></pre>

<div class="box warn"><b>⚠️ Parallel streams</b> <code>parallelStream()</code> splits work on the common ForkJoinPool. It helps only for large, CPU-bound, stateless pipelines. Never mutate shared state inside it, avoid it for blocking I/O, and measure first.</div>

<div class="box note"><b>📝 map vs flatMap, peek, forEach</b> map is one-to-one; flatMap is one-to-many then flattens. <code>peek</code> is for debugging only. <code>forEach</code> on a parallel stream gives no ordering (use forEachOrdered).</div>

### Java 8 to 17 Feature Roadmap

<div class="diagram">
<div class="diagram-label">flowchart — language features by release</div>
<div class="mermaid">
flowchart LR
    J8["Java 8\nlambdas, streams\nOptional, default methods\njava.time"] --> J9["Java 9\nmodules\nList.of, Map.of\nprivate interface methods"]
    J9 --> J10["Java 10\nvar local inference"]
    J10 --> J11["Java 11 LTS\nString isBlank strip repeat\nHttpClient\nvar in lambdas"]
    J11 --> J14["Java 14\nswitch expressions\nhelpful NPE messages"]
    J14 --> J15["Java 15\ntext blocks"]
    J15 --> J16["Java 16\nrecords\npattern matching instanceof\nStream toList"]
    J16 --> J17["Java 17 LTS\nsealed classes\nstrong encapsulation"]
</div>
</div>

<pre data-lang="java"><code>// Java 9: immutable factory methods
List&lt;String&gt; l = List.of("a", "b");  Set&lt;Integer&gt; s = Set.of(1, 2);  Map&lt;String,Integer&gt; m = Map.of("x", 1);
// l.add("c");   // UnsupportedOperationException

// Java 10: var (local variables only, type still static)
var list = new ArrayList&lt;String&gt;();
for (var e : list) { }

// Java 11 String helpers
"  ".isBlank();            // true
"  hi ".strip();           // "hi"
"ab".repeat(3);            // "ababab"
"a\nb".lines().count();    // 2

// Java 14: switch expression (no fall-through, returns a value)
int days = switch (month) {
    case "FEB" -&gt; 28;
    case "APR", "JUN", "SEP", "NOV" -&gt; 30;
    default -&gt; { yield 31; }
};

// Java 15: text block
String json = """
    {
      "name": "Asha",
      "age": 30
    }
    """;

// Java 16: record = immutable data carrier (final fields, constructor, accessors, equals, hashCode, toString)
record Point(int x, int y) {
    Point { if (x &lt; 0) throw new IllegalArgumentException("x must be non-negative"); }  // compact constructor
    double dist() { return Math.sqrt(x * x + y * y); }
}
Point p = new Point(3, 4);
System.out.println(p);            // Point[x=3, y=4]
System.out.println(p.x());        // 3
System.out.println(p.equals(new Point(3, 4)));   // true

// Java 16: pattern matching for instanceof
Object o = "hello";
if (o instanceof String str &amp;&amp; str.length() &gt; 3) System.out.println(str.toUpperCase());

// Java 17: sealed classes restrict who can extend
sealed interface Shape permits Circle2, Square2 {}
record Circle2(double r) implements Shape {}
record Square2(double s) implements Shape {}
double area(Shape sh) {            // pattern matching in switch is preview in 17, final in 21
    if (sh instanceof Circle2 c) return Math.PI * c.r() * c.r();
    if (sh instanceof Square2 q) return q.s() * q.s();
    throw new AssertionError();
}</code></pre>

<div class="tw"><table><thead><tr><th>Java 8 date-time (java.time)</th><th>Use</th></tr></thead><tbody>
<tr><td>LocalDate / LocalTime / LocalDateTime</td><td>Date and time without zone, immutable and thread-safe</td></tr>
<tr><td>ZonedDateTime / Instant</td><td>With time zone / machine timestamp</td></tr>
<tr><td>Duration / Period</td><td>Time-based / date-based amount</td></tr>
<tr><td>DateTimeFormatter</td><td>Thread-safe formatting (unlike SimpleDateFormat)</td></tr>
</tbody></table></div>

<pre data-lang="java"><code>LocalDate d = LocalDate.of(2025, 1, 31);
System.out.println(d.plusMonths(1));                              // 2025-02-28 (clamped)
System.out.println(ChronoUnit.DAYS.between(d, LocalDate.of(2025, 3, 1)));   // 29
System.out.println(d.format(DateTimeFormatter.ofPattern("dd-MMM-yyyy")));   // 31-Jan-2025</code></pre>

### Wrapper Classes, Autoboxing and the Integer Cache

<pre data-lang="java"><code>Integer a = 127, b = 127;
System.out.println(a == b);        // true   cached range -128..127
Integer c = 128, d = 128;
System.out.println(c == d);        // false  new objects, compare with equals
System.out.println(c.equals(d));   // true

Integer n = null;
// int x = n;                      // NullPointerException on unboxing

List&lt;Integer&gt; li = new ArrayList&lt;&gt;(List.of(1, 2, 3));
li.remove(Integer.valueOf(2));     // remove by value
long big = Integer.MAX_VALUE + 1;  // int overflow BEFORE widening: -2147483648
long ok  = Integer.MAX_VALUE + 1L; // 2147483648
System.out.println(0.1 + 0.2);                          // 0.30000000000000004
System.out.println(new BigDecimal("0.1").add(new BigDecimal("0.2")));   // 0.3  (use for money)</code></pre>

### Immutable Classes and Design Patterns

<pre data-lang="java"><code>// Recipe for an immutable class: final class, private final fields, no setters,
// defensive copies of mutable inputs and outputs
public final class Order {
    private final String id;
    private final List&lt;String&gt; items;
    public Order(String id, List&lt;String&gt; items) {
        this.id = id;
        this.items = List.copyOf(items);          // defensive copy, unmodifiable
    }
    public String id() { return id; }
    public List&lt;String&gt; items() { return items; }
}

// Thread-safe lazy singleton (initialization-on-demand holder)
public class Config {
    private Config() {}
    private static class Holder { static final Config INSTANCE = new Config(); }
    public static Config get() { return Holder.INSTANCE; }
}
// or simply: enum Config { INSTANCE; }   (also safe against reflection and serialization)

// Builder
User u = User.builder().name("Asha").age(30).build();</code></pre>

### Common Java Interview Q&A

<div class="tw"><table><thead><tr><th>Question</th><th>Short answer</th></tr></thead><tbody>
<tr><td><code>==</code> vs <code>equals()</code>?</td><td><code>==</code> compares references (or primitive values); <code>equals</code> compares logical content when overridden.</td></tr>
<tr><td>Why override hashCode with equals?</td><td>Hash collections find the bucket by hashCode first; equal objects must hash alike or lookups fail.</td></tr>
<tr><td>Is Java pass-by-value or reference?</td><td>Always pass-by-value. For objects the value is a copy of the reference.</td></tr>
<tr><td>Abstract class vs interface?</td><td>Abstract class: state + constructors + single inheritance. Interface: contract, multiple implementation, default methods since Java 8.</td></tr>
<tr><td>Checked vs unchecked exceptions?</td><td>Checked must be handled or declared (IOException); unchecked extend RuntimeException (NPE).</td></tr>
<tr><td>How does HashMap work internally?</td><td>Array of buckets, index = (n-1) &amp; spread(hashCode), collisions chained then treeified at 8, resize at 0.75 load, keys compared with hashCode then equals.</td></tr>
<tr><td>HashMap vs ConcurrentHashMap?</td><td>HashMap is not thread-safe; ConcurrentHashMap uses CAS and per-bin locking, disallows nulls.</td></tr>
<tr><td>ArrayList vs LinkedList?</td><td>ArrayList array-backed, O(1) get; LinkedList node-based, O(n) get. ArrayList is the default choice.</td></tr>
<tr><td>Fail-fast vs fail-safe iterators?</td><td>ArrayList/HashMap iterators throw ConcurrentModificationException on structural change; CopyOnWriteArrayList and ConcurrentHashMap iterators work on a snapshot or weakly consistent view.</td></tr>
<tr><td>synchronized vs volatile?</td><td>synchronized gives mutual exclusion and visibility; volatile gives visibility and ordering only.</td></tr>
<tr><td>start() vs run()?</td><td>start() creates a new thread and calls run on it; run() directly executes on the current thread.</td></tr>
<tr><td>What causes a memory leak in Java?</td><td>Unreachable-in-practice but still referenced objects: static collections, unclosed resources, listeners never removed, ThreadLocals in pools.</td></tr>
<tr><td>What is the difference between final, finally, finalize?</td><td>Modifier for constants, always-run cleanup block, deprecated pre-GC hook.</td></tr>
<tr><td>String vs StringBuilder vs StringBuffer?</td><td>Immutable / mutable not thread-safe / mutable thread-safe.</td></tr>
<tr><td>What is type erasure?</td><td>Generic type parameters are removed after compilation, replaced by bounds or Object, with casts inserted.</td></tr>
<tr><td>Intermediate vs terminal stream ops?</td><td>Intermediate are lazy and return a stream; terminal triggers execution and produces a result. A stream is single-use.</td></tr>
<tr><td>What is a functional interface?</td><td>One abstract method; target for lambdas and method references; annotate with @FunctionalInterface.</td></tr>
<tr><td>What is the default GC in Java 17?</td><td>G1 (since Java 9).</td></tr>
<tr><td>What is the difference between StackOverflowError and OutOfMemoryError?</td><td>Stack: too-deep recursion on a thread stack. OOM: heap (or metaspace) cannot satisfy an allocation after GC.</td></tr>
<tr><td>Can we override a static or private method?</td><td>No. Static methods are hidden, private ones are not inherited.</td></tr>
<tr><td>What are records and when use them?</td><td>Compact immutable data classes (Java 16) with generated equals, hashCode, toString; ideal for DTOs.</td></tr>
</tbody></table></div>

<div class="box tip"><b>✅ Revision order</b> JVM memory and GC, then OOP rules, then HashMap and ArrayList internals, then threads (race, synchronized, volatile, pools, CompletableFuture), then streams and Java 8-17 features. Practise explaining each with a small code example out loud.</div>

---

## Python {#python}

Python is a general-purpose, dynamically typed, garbage-collected language that reads almost like pseudocode. In data engineering it is the glue language: it drives Spark jobs, calls AWS APIs, orchestrates Airflow DAGs, validates data and runs quick transformations with Pandas. These notes go from the runtime model up to the libraries you will use at work.

<div class="diagram">
<div class="diagram-label">mind map — Python</div>
<div class="mermaid">
mindmap
  root((Python))
    Ecosystem
      Web
        FastAPI
        Flask
        Django
      Data science
        Pandas
        NumPy
        Matplotlib
      ML and AI
        Scikit-learn
        TensorFlow
        PyTorch
      Data engineering
        PySpark
        Airflow
        dbt
        SQLAlchemy
      Automation
        Selenium
        Requests
        BeautifulSoup
      DevOps
        boto3
        Click
    Core types
      list mutable
      tuple immutable
      dict mutable
      set mutable
      frozenset immutable
      str immutable
      Comprehensions
      Unpacking
      f-strings
    OOP
      Abstract base class
      dataclass
      Inheritance
    Functional
      lambda
      map filter reduce
      Decorators
    Generators
      yield
      Generator expressions
      Custom iterators
      itertools
    Async
      async def
      await
      asyncio
    Pandas
      Inspect
      Select
      Transform
      GroupBy
      Merge
      Export
</div>
</div>

### The Python ecosystem and how code runs

Python source is compiled by CPython (the reference implementation) into bytecode (`.pyc` files in `__pycache__`), and the Python Virtual Machine interprets that bytecode. Everything is an object, names are references to objects, and types are checked at run time (dynamic typing) rather than at compile time. Other implementations exist (PyPy with a JIT, Jython, MicroPython) but CPython is what you use in production.

<div class="diagram">
<div class="diagram-label">flowchart — from source file to running program</div>
<div class="mermaid">
flowchart LR
    SRC["script.py\nsource code"] --> PARSE["Parser\nbuilds AST"]
    PARSE --> COMP["Compiler\nbytecode"]
    COMP --> PYC["__pycache__\n.pyc cache"]
    COMP --> PVM["Python VM\nevaluation loop"]
    PYC --> PVM
    PVM --> C["C extensions\nNumPy, Pandas, Spark JVM bridge"]
    PVM --> OUT["Output and side effects"]
</div>
</div>

<div class="g2">
<div class="card"><h4>Web and APIs</h4><p>FastAPI (async, typed, auto docs), Flask (micro), Django (batteries included ORM + admin).</p></div>
<div class="card"><h4>Data and ML</h4><p>NumPy arrays, Pandas DataFrames, Matplotlib charts, scikit-learn, PyTorch, TensorFlow.</p></div>
<div class="card"><h4>Data engineering</h4><p>PySpark, Airflow, dbt, SQLAlchemy, boto3, Great Expectations, Polars, Pydantic.</p></div>
<div class="card"><h4>Automation</h4><p>Requests, BeautifulSoup, Selenium, Playwright, Click, subprocess, pathlib scripting.</p></div>
</div>

Example: inspect what the compiler produces for a tiny function.

<pre data-lang="python"><code>import dis

def add(a, b):
    return a + b

dis.dis(add)
# Output (3.11+ style, trimmed):
#   RESUME        0
#   LOAD_FAST     a
#   LOAD_FAST     b
#   BINARY_OP     0 (+)
#   RETURN_VALUE

print(add(2, 3))      # 5
print(add("a", "b"))  # ab   -> same bytecode, behaviour decided at run time (duck typing)</code></pre>

<div class="box note"><b>Note: Python 2 vs 3</b> Python 2 is dead. Use 3.10+ so you get <code>match</code> statements, better error messages and modern typing syntax such as <code>list[int]</code> and <code>int | None</code>.</div>

### Core data types and mutability

Mutable objects can be changed in place (the object keeps its identity); immutable objects cannot, so any "change" creates a new object. This matters because immutable objects are hashable (usable as dict keys / set members), are safe to share, and because mutable objects passed to functions can be modified by the callee.

<div class="tw"><table><thead><tr><th>Type</th><th>Mutable?</th><th>Ordered?</th><th>Example</th><th>Key methods</th></tr></thead><tbody>
<tr><td><strong>int, float, bool</strong></td><td>No</td><td>-</td><td><code>42, 3.14, True</code></td><td>arithmetic; <code>int</code> has unlimited precision</td></tr>
<tr><td><strong>str</strong></td><td>No</td><td>Yes</td><td><code>'hello'</code></td><td><code>.split() .strip() .join() .replace() .startswith()</code></td></tr>
<tr><td><strong>list</strong></td><td>Yes</td><td>Yes</td><td><code>[1, 2, 3]</code></td><td><code>.append() .extend() .pop() .sort() .insert()</code></td></tr>
<tr><td><strong>tuple</strong></td><td>No</td><td>Yes</td><td><code>(1, 2, 3)</code></td><td><code>.count() .index()</code>; use for fixed records and dict keys</td></tr>
<tr><td><strong>dict</strong></td><td>Yes</td><td>Insertion order (3.7+)</td><td><code>{'a': 1}</code></td><td><code>.get() .items() .update() .setdefault() .pop()</code></td></tr>
<tr><td><strong>set</strong></td><td>Yes</td><td>No</td><td><code>{1, 2, 3}</code></td><td><code>.add() .discard() | &amp; - ^</code> operators</td></tr>
<tr><td><strong>frozenset</strong></td><td>No</td><td>No</td><td><code>frozenset([1, 2])</code></td><td>immutable set, hashable</td></tr>
<tr><td><strong>bytes / bytearray</strong></td><td>No / Yes</td><td>Yes</td><td><code>b'abc'</code></td><td>binary data, file and network I/O</td></tr>
</tbody></table></div>

<div class="diagram">
<div class="diagram-label">flowchart — which collection to pick</div>
<div class="mermaid">
flowchart TD
    Q["Need a collection?"] --> O{"Ordered and changeable?"}
    O -->|yes| LST["list"]
    O -->|"ordered, fixed"| TUP["tuple"]
    Q --> K{"Key to value lookup?"}
    K -->|yes| DCT["dict"]
    Q --> U{"Unique items only?"}
    U -->|changeable| SET["set"]
    U -->|"hashable, fixed"| FS["frozenset"]
</div>
</div>

<pre data-lang="python"><code>a = [1, 2, 3]
b = a              # b is another NAME for the same list object
b.append(4)
print(a)           # [1, 2, 3, 4]  -> a changed too
print(a is b)      # True

s = "hi"
t = s
t += "!"           # strings are immutable: t now points to a NEW object
print(s, t)        # hi hi!

# Tuple is immutable, but it can CONTAIN a mutable object
tp = (1, [10, 20])
tp[1].append(30)
print(tp)          # (1, [10, 20, 30])
# tp[0] = 5        # TypeError: 'tuple' object does not support item assignment

# Shallow vs deep copy
import copy
orig = [[1, 2], [3, 4]]
shallow = copy.copy(orig)       # new outer list, SAME inner lists
deep = copy.deepcopy(orig)      # everything duplicated
orig[0].append(99)
print(shallow)     # [[1, 2, 99], [3, 4]]
print(deep)        # [[1, 2], [3, 4]]</code></pre>

<div class="box warn"><b>Pitfall: mutable default arguments</b> Default values are evaluated once, when <code>def</code> runs, not on every call. <code>def f(x, acc=[])</code> shares one list across all calls. Use <code>acc=None</code> and create the list inside.</div>

<pre data-lang="python"><code>def bad(x, acc=[]):
    acc.append(x)
    return acc

print(bad(1))   # [1]
print(bad(2))   # [1, 2]   &lt;- surprise, state leaked between calls

def good(x, acc=None):
    if acc is None:
        acc = []
    acc.append(x)
    return acc

print(good(1), good(2))   # [1] [2]</code></pre>

Other basics worth knowing: truthiness (empty containers, `0`, `None`, `""` are falsy), `is` compares identity while `==` compares value, `None` is a singleton (use `is None`), integers between -5 and 256 are cached, and dict/set lookups are O(1) average because of hashing.

### Comprehensions, unpacking and f-strings

A comprehension builds a list, set, dict or generator from an iterable in one expression. It is faster than an equivalent `for` loop with `.append` and is the idiomatic way to map and filter. Keep them to one condition and one loop level; beyond that, use a normal loop for readability.

<pre data-lang="python"><code>squares   = [x**2 for x in range(6)]                    # [0, 1, 4, 9, 16, 25]
even_sq   = [x**2 for x in range(10) if x % 2 == 0]     # [0, 4, 16, 36, 64]
word_len  = {w: len(w) for w in ["python", "java"]}     # {'python': 6, 'java': 4}
mods      = {x % 3 for x in range(10)}                  # {0, 1, 2}
flat      = [n for row in [[1, 2], [3, 4]] for n in row]  # [1, 2, 3, 4]
label     = ["big" if n &gt; 2 else "small" for n in [1, 3]] # ['small', 'big']
gen       = (x**2 for x in range(10_000_000))           # lazy, no memory used yet

# Unpacking
a, *rest, last = [1, 2, 3, 4, 5]
print(a, rest, last)            # 1 [2, 3, 4] 5
x, y = 10, 20
x, y = y, x                     # swap -&gt; x=20, y=10

d1 = {"a": 1, "b": 2}
d2 = {"b": 3, "c": 4}
print({**d1, **d2})             # {'a': 1, 'b': 3, 'c': 4}  (right side wins)
print(d1 | d2)                  # same, Python 3.9+

# f-strings
name, score = "Naveen", 98.5
print(f"{name!r} scored {score:.1f}%")   # 'Naveen' scored 98.5%
print(f"{score = }")                      # score = 98.5
print(f"{1234567.891:,.2f}")              # 1,234,567.89
print(f"{42:08b}")                        # 00101010</code></pre>

<div class="box tip"><b>Tip</b> Use <code>zip</code>, <code>enumerate</code> and <code>sorted(key=...)</code> with comprehensions: <code>dict(zip(keys, values))</code>, <code>for i, v in enumerate(items, start=1)</code>.</div>

### Functions: arguments, args/kwargs, scope and closures

Functions are first-class objects: you can pass them, return them and store them in dicts. Arguments are passed "by object reference": the callee gets a reference to the same object, so mutating a list inside a function is visible outside, but rebinding the name is not.

<pre data-lang="python"><code>def connect(host, port=5432, *, ssl=True, **options):
    # host: positional, port: default, ssl: keyword-only (after the bare *)
    return host, port, ssl, options

print(connect("db1"))                         # ('db1', 5432, True, {})
print(connect("db1", 5433, ssl=False, timeout=30))
# ('db1', 5433, False, {'timeout': 30})

def total(*args, **kwargs):
    # args is a tuple of extra positional, kwargs a dict of extra keyword args
    return sum(args), kwargs

print(total(1, 2, 3, unit="INR"))             # (6, {'unit': 'INR'})

nums = [1, 2, 3]
opts = {"ssl": False}
print(connect(*nums[:1], **opts))             # unpack at call site

def positional_only(a, b, /, c):              # a and b cannot be named, 3.8+
    return a + b + c</code></pre>

#### Scope: the LEGB rule

Name lookup goes Local, Enclosing function, Global (module), Built-in. Assigning to a name inside a function makes it local unless you declare `global` or `nonlocal`.

<div class="diagram">
<div class="diagram-label">flowchart — LEGB name lookup</div>
<div class="mermaid">
flowchart LR
    N["Name used"] --> L["Local\ncurrent function"]
    L -->|not found| E["Enclosing\nouter functions"]
    E -->|not found| G["Global\nmodule level"]
    G -->|not found| B["Built-in\nlen, print"]
    B -->|not found| ERR["NameError"]
</div>
</div>

#### Closures

A closure is an inner function that remembers variables from the enclosing function after that function has returned. Useful for factories, decorators and callbacks.

<pre data-lang="python"><code>def make_counter():
    count = 0
    def inc():
        nonlocal count      # needed to rebind (not just read) the outer variable
        count += 1
        return count
    return inc

c1, c2 = make_counter(), make_counter()
print(c1(), c1(), c1())   # 1 2 3
print(c2())               # 1   -> each closure has its own cell

# Classic late-binding gotcha
funcs = [lambda: i for i in range(3)]
print([f() for f in funcs])            # [2, 2, 2]  (i looked up at call time)
funcs = [lambda i=i: i for i in range(3)]
print([f() for f in funcs])            # [0, 1, 2]  (default arg captures value)</code></pre>

### Functional tools and decorators

`lambda` creates a small anonymous function; `map`, `filter` and `reduce` apply functions across iterables; `functools` adds `partial`, `lru_cache` and `wraps`. A decorator is just a function that takes a function and returns a (usually wrapped) function: `@dec` above `def f` means `f = dec(f)`.

<pre data-lang="python"><code>from functools import reduce, partial, lru_cache

nums = [1, 2, 3, 4, 5]
print(list(map(lambda x: x * 2, nums)))        # [2, 4, 6, 8, 10]
print(list(filter(lambda x: x % 2 == 0, nums)))# [2, 4]
print(reduce(lambda a, b: a + b, nums))        # 15

def power(b, e):
    return b ** e

square = partial(power, e=2)
print(square(9))                                # 81

@lru_cache(maxsize=None)
def fib(n):
    return n if n &lt; 2 else fib(n - 1) + fib(n - 2)
print(fib(50))                                  # 12586269025 (instant thanks to caching)

people = [("Asha", 28), ("Ravi", 35), ("Meera", 31)]
print(sorted(people, key=lambda p: p[1], reverse=True))
# [('Ravi', 35), ('Meera', 31), ('Asha', 28)]</code></pre>

<div class="diagram">
<div class="diagram-label">sequenceDiagram — what a decorator does on each call</div>
<div class="mermaid">
sequenceDiagram
    participant C as Caller
    participant W as wrapper
    participant F as original function
    C->>W: call fetch
    W->>W: start timer or log
    W->>F: call original with same arguments
    F-->>W: result
    W->>W: stop timer, print
    W-->>C: result
</div>
</div>

<pre data-lang="python"><code>import functools, time

def timer(func):
    @functools.wraps(func)            # keeps __name__, __doc__ of the original
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        print(f"{func.__name__} took {time.perf_counter() - start:.3f}s")
        return result
    return wrapper

def retry(times=3, exceptions=(Exception,), delay=0.5):
    # decorator FACTORY: three nested levels (config -> decorator -> wrapper)
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(1, times + 1):
                try:
                    return func(*args, **kwargs)
                except exceptions as e:
                    if attempt == times:
                        raise
                    print(f"retry {attempt}/{times}: {e}")
                    time.sleep(delay * 2 ** (attempt - 1))   # exponential backoff
        return wrapper
    return decorator

calls = {"n": 0}

@timer                                 # applied last (outermost)
@retry(times=3, exceptions=(ConnectionError,), delay=0.01)
def fetch():
    calls["n"] += 1
    if calls["n"] &lt; 3:
        raise ConnectionError("timeout")
    return "ok"

print(fetch())
# retry 1/3: timeout
# retry 2/3: timeout
# fetch took 0.031s
# ok</code></pre>

<div class="box info"><b>Stacking order</b> Decorators apply bottom-up (closest to <code>def</code> first) but the outermost wrapper runs first on a call. Without <code>functools.wraps</code> the wrapped function loses its name, which breaks logging, Airflow task ids and pytest introspection.</div>

### OOP: classes, inheritance, MRO and dunder methods

A class bundles data (attributes) and behaviour (methods). `self` is the instance passed implicitly. Python has no true private members: a single leading underscore `_x` means "internal", a double underscore `__x` triggers name mangling. Inheritance uses Method Resolution Order (MRO, C3 linearisation) to decide which method wins in multiple inheritance.

<pre data-lang="python"><code>class Account:
    bank = "SBI"                      # class attribute shared by all instances

    def __init__(self, owner, balance=0):
        self.owner = owner            # instance attributes
        self._balance = balance

    @property
    def balance(self):                # read-only computed attribute
        return self._balance

    def deposit(self, amt):
        if amt &lt;= 0:
            raise ValueError("amount must be positive")
        self._balance += amt
        return self

    @classmethod
    def from_string(cls, s):          # alternative constructor
        owner, bal = s.split(",")
        return cls(owner, int(bal))

    @staticmethod
    def is_valid(amt):                # no self, no cls: just a namespaced function
        return amt &gt; 0

    # dunder (magic) methods hook into language syntax
    def __repr__(self):  return f"Account({self.owner!r}, {self._balance})"
    def __str__(self):   return f"{self.owner}: Rs {self._balance:,}"
    def __eq__(self, o): return (self.owner, self._balance) == (o.owner, o._balance)
    def __hash__(self):  return hash((self.owner, self._balance))
    def __lt__(self, o): return self._balance &lt; o._balance
    def __len__(self):   return len(self.owner)
    def __add__(self, o):return Account(self.owner, self._balance + o._balance)

class Savings(Account):
    def __init__(self, owner, balance=0, rate=0.04):
        super().__init__(owner, balance)
        self.rate = rate
    def add_interest(self):
        return self.deposit(self._balance * self.rate)

a = Account.from_string("Asha,1000")
print(a)                       # Asha: Rs 1,000
print(repr(a))                 # Account('Asha', 1000)
print(a.deposit(500).balance)  # 1500  (method chaining via return self)
s = Savings("Ravi", 10000)
print(s.add_interest().balance)# 10400.0
print(Savings.__mro__)         # (Savings, Account, object)
print(isinstance(s, Account))  # True</code></pre>

<div class="diagram">
<div class="diagram-label">flowchart — class hierarchy and MRO</div>
<div class="mermaid">
flowchart TD
    OBJ["object"] --> ACC["Account\ndeposit, balance"]
    ACC --> SAV["Savings\nadd_interest"]
    ACC --> CUR["Current\noverdraft"]
    SAV --> MRO["MRO lookup order\nSavings then Account then object"]
</div>
</div>

<div class="tw"><table><thead><tr><th>Dunder</th><th>Triggered by</th><th>Dunder</th><th>Triggered by</th></tr></thead><tbody>
<tr><td><code>__init__</code></td><td><code>Cls(...)</code> after creation</td><td><code>__getitem__</code></td><td><code>obj[key]</code></td></tr>
<tr><td><code>__repr__ / __str__</code></td><td><code>repr(), print()</code></td><td><code>__iter__ / __next__</code></td><td><code>for x in obj</code></td></tr>
<tr><td><code>__eq__ / __lt__</code></td><td><code>==, &lt;</code></td><td><code>__contains__</code></td><td><code>x in obj</code></td></tr>
<tr><td><code>__len__</code></td><td><code>len(obj)</code></td><td><code>__call__</code></td><td><code>obj(...)</code></td></tr>
<tr><td><code>__enter__ / __exit__</code></td><td><code>with obj</code></td><td><code>__del__</code></td><td>object garbage collected (avoid relying on it)</td></tr>
</tbody></table></div>

<div class="box tip"><b>Composition over inheritance</b> Prefer "has-a" (a Pipeline holds a Reader and a Writer) to deep inheritance trees. Use inheritance for true "is-a" relationships and abstract interfaces.</div>

### Dataclasses and abstract base classes

`@dataclass` generates `__init__`, `__repr__` and `__eq__` from annotated fields, removing boilerplate for plain data holders. `frozen=True` makes instances immutable and hashable. An Abstract Base Class (ABC) defines an interface; a subclass that does not implement every `@abstractmethod` cannot be instantiated, so errors surface early.

<pre data-lang="python"><code>from abc import ABC, abstractmethod
from dataclasses import dataclass, field, asdict
from typing import ClassVar

class DataSource(ABC):
    @abstractmethod
    def read(self, query: str) -&gt; list: ...
    @abstractmethod
    def write(self, rows: list) -&gt; int: ...

@dataclass
class CsvSource(DataSource):
    path: str
    delimiter: str = ","
    tags: list = field(default_factory=list)     # NEVER use tags=[] directly
    instances: ClassVar[int] = 0                 # class var, not a field

    def __post_init__(self):
        CsvSource.instances += 1

    def read(self, query):  return [f"row from {self.path}"]
    def write(self, rows):  return len(rows)

src = CsvSource("/data/a.csv", tags=["raw"])
print(src)             # CsvSource(path='/data/a.csv', delimiter=',', tags=['raw'])
print(asdict(src))     # {'path': '/data/a.csv', 'delimiter': ',', 'tags': ['raw']}

try:
    DataSource()       # cannot instantiate an abstract class
except TypeError as e:
    print(e)           # Can't instantiate abstract class DataSource with abstract methods read, write

@dataclass(frozen=True, order=True)
class Point:
    x: int
    y: int

p = Point(1, 2)
print(p &lt; Point(1, 3))   # True (order=True generates comparisons)
# p.x = 5               # FrozenInstanceError</code></pre>

<div class="box info"><b>dataclass vs Pydantic vs NamedTuple</b> dataclass = no validation, stdlib. Pydantic = runtime validation and parsing (config, APIs). NamedTuple = immutable and tuple-like. Pick Pydantic when the data comes from outside your program.</div>

### Generators and iterators

An iterable can produce an iterator (`iter(obj)`); an iterator implements `__next__` and raises `StopIteration` when exhausted. A generator is an iterator written as a function using `yield`: it pauses at each `yield` and resumes on the next request, holding its local state. That makes it ideal for streaming large files or datasets with constant memory.

<div class="diagram">
<div class="diagram-label">sequenceDiagram — generator pause and resume</div>
<div class="mermaid">
sequenceDiagram
    participant L as for loop
    participant G as generator
    L->>G: next
    G->>G: run to first yield
    G-->>L: value 1
    L->>G: next
    G->>G: resume after yield
    G-->>L: value 2
    L->>G: next
    G-->>L: StopIteration
</div>
</div>

<pre data-lang="python"><code>def read_large_file(path):
    with open(path) as f:
        for line in f:                # file objects are lazy iterators
            yield line.rstrip("\n")

def countdown(n):
    while n &gt; 0:
        yield n
        n -= 1

g = countdown(3)
print(next(g), next(g), next(g))     # 3 2 1
# next(g)                            # StopIteration
print(list(countdown(3)))            # [3, 2, 1]  (a generator is single-use)

import sys
print(sys.getsizeof([x for x in range(1_000_000)]))   # ~8,448,728 bytes
print(sys.getsizeof((x for x in range(1_000_000))))   # ~200 bytes

# Custom iterator class
from datetime import date, timedelta
class DateRange:
    def __init__(self, start, end):
        self.cur, self.end = start, end
    def __iter__(self):
        return self
    def __next__(self):
        if self.cur &gt;= self.end:
            raise StopIteration
        d, self.cur = self.cur, self.cur + timedelta(days=1)
        return d

print([d.isoformat() for d in DateRange(date(2025, 1, 1), date(2025, 1, 4))])
# ['2025-01-01', '2025-01-02', '2025-01-03']

# Pipelines of generators (each stage lazy)
def parse(lines):   return (l.split(",") for l in lines)
def only_ok(rows):  return (r for r in rows if r[1] == "OK")
rows = only_ok(parse(["a,OK", "b,FAIL", "c,OK"]))
print(list(rows))                    # [['a', 'OK'], ['c', 'OK']]

# itertools
from itertools import chain, islice, groupby, product
print(list(islice(chain([1, 2], [3, 4], [5, 6]), 4)))   # [1, 2, 3, 4]
print([(k, len(list(g))) for k, g in groupby("aabbbc")])# [('a', 2), ('b', 3), ('c', 1)]
print(list(product("AB", [1, 2])))   # [('A', 1), ('A', 2), ('B', 1), ('B', 2)]</code></pre>

<div class="box tip"><b>Use when</b> input does not fit in memory, you want early exit (<code>any(...)</code> over a generator stops at the first hit) or you are chaining transformations. <code>yield from sub()</code> delegates to another generator.</div>

### Context managers

A context manager guarantees setup and cleanup around a block, even when an exception occurs. The `with` statement calls `__enter__` on entry and `__exit__` on exit. Use it for files, locks, DB transactions, temporary directories and timers.

<div class="diagram">
<div class="diagram-label">sequenceDiagram — with statement lifecycle</div>
<div class="mermaid">
sequenceDiagram
    participant C as Your code
    participant M as Context manager
    C->>M: __enter__
    M-->>C: resource
    C->>C: run the with block
    alt block raises exception
        C->>M: __exit__ with exception info
        M-->>C: return True to swallow or False to re-raise
    else block finishes normally
        C->>M: __exit__ None None None
    end
</div>
</div>

<pre data-lang="python"><code>import time
from contextlib import contextmanager, suppress

class Timer:
    def __enter__(self):
        self.t0 = time.perf_counter()
        return self
    def __exit__(self, exc_type, exc, tb):
        self.elapsed = time.perf_counter() - self.t0
        print(f"elapsed {self.elapsed:.2f}s")
        return False                  # do not swallow exceptions

with Timer():
    sum(range(1_000_000))             # elapsed 0.03s

@contextmanager
def transaction(conn):
    try:
        yield conn                    # code inside the with block runs here
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()

import os
with suppress(FileNotFoundError):     # ignore a specific exception
    os.remove("missing.tmp")

with open("a.txt", "w") as f1, open("b.txt", "w") as f2:   # multiple managers
    f1.write("x"); f2.write("y")</code></pre>

### Exceptions and error handling

Exceptions signal errors up the call stack until something catches them. Catch the narrowest type you can handle, never use a bare `except:` (it also hides `KeyboardInterrupt`), and use `finally` for cleanup. Custom exception classes make intent clear and let callers react selectively.

<div class="diagram">
<div class="diagram-label">flowchart — try / except / else / finally</div>
<div class="mermaid">
flowchart TD
    T["try block"] -->|raises| E{"matching except?"}
    T -->|no error| EL["else block"]
    E -->|yes| H["except handler"]
    E -->|no| P["propagates to caller"]
    EL --> F["finally block"]
    H --> F
    P --> F
    F --> N["continue or unwind"]
</div>
</div>

<pre data-lang="python"><code>class PipelineError(Exception):
    """Base error for our ETL code."""

class SchemaMismatch(PipelineError):
    def __init__(self, expected, got):
        super().__init__(f"expected {expected}, got {got}")
        self.expected, self.got = expected, got

def load(rec):
    try:
        amount = int(rec["amount"])
    except KeyError as e:
        raise SchemaMismatch(["amount"], list(rec)) from e   # keep the cause chain
    except ValueError:
        print("bad number, using 0")
        amount = 0
    else:
        print("parsed fine")          # runs only if no exception
    finally:
        print("done")                 # always runs
    return amount

print(load({"amount": "10"}))   # parsed fine / done / 10
print(load({"amount": "x"}))    # bad number, using 0 / done / 0
try:
    load({"amt": 1})
except PipelineError as e:
    print(type(e).__name__, e)  # done / SchemaMismatch expected ['amount'], got ['amt']

# Python 3.11 exception groups and notes
# try: ... except* ValueError: ...</code></pre>

<div class="box warn"><b>Pitfalls</b> Do not use exceptions for normal flow in tight loops when a cheap check works. Do not <code>except Exception: pass</code> silently. Use <code>raise</code> (bare) to re-raise with the original traceback. EAFP ("easier to ask forgiveness than permission") is the Python style: try it, handle the failure.</div>

### Modules, packages, virtual environments and pip

A module is a `.py` file; a package is a directory of modules (usually with `__init__.py`). `import` finds modules via `sys.path` (current directory, installed site-packages, PYTHONPATH). A virtual environment is an isolated Python plus its own site-packages so each project keeps its own dependency versions. `pip` installs packages from PyPI.

<div class="diagram">
<div class="diagram-label">flowchart — dependency workflow</div>
<div class="mermaid">
flowchart LR
    A["python -m venv .venv"] --> B["activate the env"]
    B --> C["pip install pandas boto3"]
    C --> D["pip freeze to requirements.txt"]
    D --> E["commit file to git"]
    E --> F["CI or teammate runs pip install -r requirements.txt"]
</div>
</div>

<pre data-lang="bash"><code>python -m venv .venv
source .venv/bin/activate              # Windows: .venv\Scripts\activate
pip install pandas==2.2.2 "boto3&gt;=1.34"
pip freeze &gt; requirements.txt
pip install -r requirements.txt
pip list --outdated
deactivate

# Project layout
# etl/
#   pyproject.toml
#   src/etl/__init__.py
#   src/etl/extract.py
#   src/etl/transform.py
#   tests/test_transform.py</code></pre>

<pre data-lang="python"><code># src/etl/transform.py
def clean(x): return x.strip().lower()

# main.py
from etl.transform import clean         # absolute import (preferred)
import etl.transform as t               # alias
print(clean("  HELLO "))                # hello

if __name__ == "__main__":              # runs only when executed directly, not on import
    print("running as script")
print(__name__)                         # '__main__' when run directly</code></pre>

<div class="tw"><table><thead><tr><th>Tool</th><th>Purpose</th></tr></thead><tbody>
<tr><td><code>venv</code></td><td>stdlib virtual environments</td></tr>
<tr><td><code>pip</code></td><td>install packages; pin versions in <code>requirements.txt</code></td></tr>
<tr><td><code>pip-tools / poetry / uv</code></td><td>resolve and lock dependencies reproducibly; uv is very fast</td></tr>
<tr><td><code>pyproject.toml</code></td><td>modern project metadata and build config</td></tr>
<tr><td><code>conda</code></td><td>environments plus non-Python binaries (common in data science)</td></tr>
</tbody></table></div>

<div class="box warn"><b>Pitfall</b> Never <code>pip install</code> into the system Python, and never commit the <code>.venv</code> folder. Circular imports (a imports b, b imports a) cause <code>ImportError</code>; fix by moving shared code to a third module or importing inside the function.</div>

### Concurrency: GIL, threading, multiprocessing and asyncio

The Global Interpreter Lock (GIL) in CPython lets only one thread execute Python bytecode at a time. Consequence: threads do not speed up CPU-bound pure Python code, but they work well for I/O-bound work because the GIL is released while waiting on network or disk. For CPU-bound work use multiprocessing (separate processes, each with its own GIL) or native extensions (NumPy, Spark) that release the GIL. asyncio gives cooperative concurrency in one thread using an event loop. (Python 3.13 adds an experimental free-threaded build with no GIL.)

<div class="diagram">
<div class="diagram-label">flowchart — choosing a concurrency model</div>
<div class="mermaid">
flowchart TD
    S["Slow task"] --> Q{"Bound by what?"}
    Q -->|"CPU: math, parsing"| MP["multiprocessing\nProcessPoolExecutor"]
    Q -->|"I/O with blocking libs"| TH["threading\nThreadPoolExecutor"]
    Q -->|"I/O with async libs, thousands of sockets"| AS["asyncio"]
    MP --> R1["True parallelism\nhigher memory, pickling cost"]
    TH --> R2["Concurrency under GIL\nsimple, shared memory"]
    AS --> R3["One thread, event loop\nawait yields control"]
</div>
</div>

<pre data-lang="python"><code>import time
from concurrent.futures import ThreadPoolExecutor, ProcessPoolExecutor

def io_task(n):
    time.sleep(1)                 # simulates a network call
    return n

def cpu_task(n):
    return sum(i * i for i in range(n))

if __name__ == "__main__":        # REQUIRED for multiprocessing on Windows/macOS
    t = time.perf_counter()
    with ThreadPoolExecutor(max_workers=5) as ex:
        print(list(ex.map(io_task, range(5))))        # [0, 1, 2, 3, 4]
    print(f"threads: {time.perf_counter() - t:.1f}s") # ~1.0s instead of 5.0s sequential

    with ProcessPoolExecutor(max_workers=4) as ex:
        print(list(ex.map(cpu_task, [10**6] * 4)))    # runs on 4 cores in parallel</code></pre>

#### asyncio

`async def` defines a coroutine; `await` suspends it until the awaited thing finishes, letting the loop run other tasks. Nothing runs concurrently unless you schedule tasks with `gather` or `create_task`. A blocking call (like `time.sleep` or `requests.get`) inside a coroutine freezes the whole loop.

<div class="diagram">
<div class="diagram-label">sequenceDiagram — three awaits sharing one event loop</div>
<div class="mermaid">
sequenceDiagram
    participant L as Event loop
    participant A as Task A
    participant B as Task B
    L->>A: start, await fetch 1
    A-->>L: yields at await
    L->>B: start, await fetch 2
    B-->>L: yields at await
    L->>A: response 1 ready, resume
    A-->>L: done
    L->>B: response 2 ready, resume
    B-->>L: done
</div>
</div>

<pre data-lang="python"><code>import asyncio, time

async def fetch(name, delay):
    await asyncio.sleep(delay)         # non-blocking pause
    return f"{name} done"

async def main():
    t = time.perf_counter()
    results = await asyncio.gather(fetch("A", 1), fetch("B", 2), fetch("C", 1))
    print(results)                     # ['A done', 'B done', 'C done']
    print(f"{time.perf_counter() - t:.1f}s")   # 2.0s (not 4.0s)

    # timeout and cancellation
    try:
        await asyncio.wait_for(fetch("slow", 10), timeout=0.5)
    except asyncio.TimeoutError:
        print("timed out")

    sem = asyncio.Semaphore(2)         # limit concurrency to 2
    async def limited(i):
        async with sem:
            return await fetch(i, 0.1)
    print(await asyncio.gather(*(limited(i) for i in range(5))))

asyncio.run(main())</code></pre>

<div class="tw"><table><thead><tr><th>Model</th><th>Parallel CPU?</th><th>Best for</th><th>Overhead</th><th>Gotcha</th></tr></thead><tbody>
<tr><td>threading</td><td>No (GIL)</td><td>blocking I/O, 10s to 100s tasks</td><td>low</td><td>race conditions, use Lock or Queue</td></tr>
<tr><td>multiprocessing</td><td>Yes</td><td>CPU-heavy transforms</td><td>high (process start, pickling)</td><td>arguments must be picklable</td></tr>
<tr><td>asyncio</td><td>No</td><td>1000s of I/O tasks, APIs</td><td>very low</td><td>whole stack must be async</td></tr>
</tbody></table></div>

<div class="box tip"><b>Interview answer</b> "The GIL protects CPython's reference counting. It blocks CPU parallelism across threads, so for CPU work I use multiprocessing or push the work into C-based libraries or Spark; for I/O I use threads or asyncio."</div>

### Pandas with example data and outputs

Pandas is the standard in-memory tabular library. A `Series` is a labelled 1-D array; a `DataFrame` is a table of Series sharing an index. Operations are vectorised (run in C), so avoid Python loops over rows. It is limited by RAM: switch to Polars, Dask or Spark when data no longer fits.

<pre data-lang="python"><code>import pandas as pd
import numpy as np

emp = pd.DataFrame({
    "id":     [1, 2, 3, 4, 5, 6],
    "name":   ["Asha", "Ravi", "Meera", "Karan", "Divya", "Imran"],
    "dept":   ["Eng", "Eng", "Sales", "Sales", "HR", "Eng"],
    "salary": [90000, 120000, 60000, 75000, 50000, np.nan],
    "age":    [28, 35, 31, 40, 26, 30],
})
print(emp)
#    id   name   dept    salary  age
# 0   1   Asha    Eng   90000.0   28
# 1   2   Ravi    Eng  120000.0   35
# 2   3  Meera  Sales   60000.0   31
# 3   4  Karan  Sales   75000.0   40
# 4   5  Divya     HR   50000.0   26
# 5   6  Imran    Eng       NaN   30

print(emp.shape)            # (6, 5)
print(emp.dtypes)           # id int64, name object, dept object, salary float64, age int64
print(emp["salary"].isna().sum())   # 1</code></pre>

#### Select and filter

<pre data-lang="python"><code>print(emp.loc[emp["age"] &gt; 29, ["name", "age"]])
#     name  age
# 1   Ravi   35
# 2  Meera   31
# 3  Karan   40
# 5  Imran   30

print(emp.iloc[0:2, 1:3])        # position based, end exclusive
#    name dept
# 0  Asha  Eng
# 1  Ravi  Eng

print(emp.query("dept == 'Eng' and salary &gt; 100000")["name"].tolist())   # ['Ravi']</code></pre>

#### Clean and transform

<pre data-lang="python"><code>emp["salary"] = emp["salary"].fillna(emp.groupby("dept")["salary"].transform("median"))
# Imran (Eng) gets the Eng median (90000 and 120000 -&gt; 105000.0)

emp["band"] = pd.cut(emp["age"], bins=[0, 29, 35, 60], labels=["Jr", "Mid", "Sr"])
emp["bonus"] = np.where(emp["salary"] &gt;= 90000, emp["salary"] * 0.10, 0)
emp["name_upper"] = emp["name"].str.upper()
emp = emp.drop_duplicates(subset=["id"])
emp = emp.astype({"id": "int32"})
print(emp[["name", "salary", "band", "bonus"]])
#     name    salary band    bonus
# 0   Asha   90000.0   Jr   9000.0
# 1   Ravi  120000.0  Mid  12000.0
# 2  Meera   60000.0  Mid      0.0
# 3  Karan   75000.0   Sr      0.0
# 4  Divya   50000.0   Jr      0.0
# 5  Imran  105000.0  Mid  10500.0</code></pre>

#### GroupBy

Split-apply-combine: split rows into groups, apply an aggregation to each, combine into one result.

<div class="diagram">
<div class="diagram-label">flowchart — groupby split apply combine</div>
<div class="mermaid">
flowchart LR
    DF["DataFrame\n6 rows"] --> SP["Split by dept"]
    SP --> G1["Eng\n3 rows"]
    SP --> G2["Sales\n2 rows"]
    SP --> G3["HR\n1 row"]
    G1 --> AG["Apply agg\ncount, mean, max"]
    G2 --> AG
    G3 --> AG
    AG --> CB["Combine\n3 row result"]
</div>
</div>

<pre data-lang="python"><code>summary = emp.groupby("dept").agg(
    emp_count=("id", "count"),
    avg_salary=("salary", "mean"),
    max_salary=("salary", "max"),
).reset_index()
print(summary)
#     dept  emp_count  avg_salary  max_salary
# 0    Eng          3    105000.0    120000.0
# 1     HR          1     50000.0     50000.0
# 2  Sales          2     67500.0     75000.0

# Rank within group, running totals
emp["rank_in_dept"] = emp.groupby("dept")["salary"].rank(ascending=False, method="dense")
emp["cum_salary"] = emp.sort_values("id").groupby("dept")["salary"].cumsum()

# Pivot table
print(emp.pivot_table(index="dept", columns="band", values="salary", aggfunc="mean", observed=True))</code></pre>

#### Merge (SQL join) and concat

<pre data-lang="python"><code>depts = pd.DataFrame({"dept": ["Eng", "Sales", "Finance"],
                      "city": ["Bengaluru", "Mumbai", "Delhi"]})

left = emp.merge(depts, on="dept", how="left")
print(left[["name", "dept", "city"]])
#     name   dept       city
# 0   Asha    Eng  Bengaluru
# 1   Ravi    Eng  Bengaluru
# 2  Meera  Sales     Mumbai
# 3  Karan  Sales     Mumbai
# 4  Divya     HR        NaN      &lt;- HR has no match, left join keeps it
# 5  Imran    Eng  Bengaluru

outer = emp.merge(depts, on="dept", how="outer", indicator=True)
print(outer["_merge"].value_counts().to_dict())
# {'both': 5, 'left_only': 1, 'right_only': 1}

stacked = pd.concat([emp.head(2), emp.tail(2)], ignore_index=True)   # row-wise union</code></pre>

<div class="tw"><table><thead><tr><th>how</th><th>SQL equivalent</th><th>Keeps</th></tr></thead><tbody>
<tr><td>inner</td><td>INNER JOIN</td><td>keys in both</td></tr>
<tr><td>left</td><td>LEFT JOIN</td><td>all left, matches from right</td></tr>
<tr><td>right</td><td>RIGHT JOIN</td><td>all right</td></tr>
<tr><td>outer</td><td>FULL OUTER JOIN</td><td>everything</td></tr>
</tbody></table></div>

#### Time series, apply and performance

<pre data-lang="python"><code>sales = pd.DataFrame({
    "ts": pd.to_datetime(["2025-01-01", "2025-01-01", "2025-01-02", "2025-01-03"]),
    "amt": [100, 50, 200, 80],
})
print(sales.set_index("ts").resample("D")["amt"].sum())
# ts
# 2025-01-01    150
# 2025-01-02    200
# 2025-01-03     80
# Freq: D, Name: amt, dtype: int64

# Prefer vectorised ops; apply(axis=1) is a slow Python loop
sales["amt_tax"] = sales["amt"] * 1.18                 # fast
# sales["amt_tax"] = sales.apply(lambda r: r["amt"] * 1.18, axis=1)   # slow

# Memory tips
sales["amt"] = pd.to_numeric(sales["amt"], downcast="integer")
emp["dept"] = emp["dept"].astype("category")

# Read big files in chunks
for chunk in pd.read_csv("big.csv", chunksize=100_000):
    pass   # process each chunk

emp.to_parquet("emp.parquet", index=False, compression="snappy")
emp.to_csv("emp.csv", index=False)</code></pre>

<div class="box warn"><b>Pitfalls</b> <code>SettingWithCopyWarning</code>: chained assignment <code>df[df.a&gt;1]["b"] = 0</code> may modify a copy; use <code>df.loc[df.a&gt;1, "b"] = 0</code>. Aggregations skip NaN by default. <code>object</code> columns holding mixed types are slow. Always check <code>merge</code> row counts for accidental many-to-many explosions (<code>validate="m:1"</code>).</div>

### File, JSON and CSV handling

Use `pathlib.Path` for paths, `with open(...)` for files, always set `encoding="utf-8"`, and use `newline=""` for CSV. Text mode converts line endings; binary mode (`rb`, `wb`) does not.

<pre data-lang="python"><code>from pathlib import Path
import json, csv

base = Path("data")
base.mkdir(exist_ok=True)
p = base / "orders.json"

orders = [{"id": 1, "amt": 250.5, "items": ["pen", "book"]},
          {"id": 2, "amt": 99.0,  "items": []}]

p.write_text(json.dumps(orders, indent=2), encoding="utf-8")
loaded = json.loads(p.read_text(encoding="utf-8"))
print(loaded[0]["items"])             # ['pen', 'book']
print(json.dumps({"a": 1, "b": None, "c": True}))   # {"a": 1, "b": null, "c": true}

# JSON Lines: one object per line, streams well and is the common format for big logs
with open(base / "orders.jsonl", "w", encoding="utf-8") as f:
    for o in orders:
        f.write(json.dumps(o) + "\n")
with open(base / "orders.jsonl", encoding="utf-8") as f:
    for line in f:                    # constant memory
        rec = json.loads(line)

# CSV
with open(base / "orders.csv", "w", newline="", encoding="utf-8") as f:
    w = csv.DictWriter(f, fieldnames=["id", "amt"], extrasaction="ignore")
    w.writeheader()
    w.writerows(orders)

with open(base / "orders.csv", newline="", encoding="utf-8") as f:
    for row in csv.DictReader(f):
        print(row)                    # {'id': '1', 'amt': '250.5'}  -&gt; values are strings!
                                      # {'id': '2', 'amt': '99.0'}

# Handy path operations
print(p.suffix, p.stem, p.parent)     # .json orders data
print([x.name for x in base.glob("*.json*")])   # ['orders.json', 'orders.jsonl']
p.unlink(missing_ok=True)</code></pre>

<div class="tw"><table><thead><tr><th>Format</th><th>Pros</th><th>Cons</th><th>Typical use</th></tr></thead><tbody>
<tr><td>CSV</td><td>universal, human readable</td><td>no types, quoting issues, big</td><td>exports, small feeds</td></tr>
<tr><td>JSON / JSONL</td><td>nested, self describing</td><td>verbose, no schema</td><td>APIs, events, logs</td></tr>
<tr><td>Parquet</td><td>columnar, compressed, typed, fast scans</td><td>not human readable</td><td>data lakes, Spark, Athena</td></tr>
</tbody></table></div>

<div class="box warn"><b>Pitfalls</b> <code>json.dump</code> cannot serialise <code>datetime</code> or <code>Decimal</code> (pass <code>default=str</code>). Do not parse CSV with <code>line.split(",")</code> (quoted commas break it). Reading a 5 GB file with <code>.read()</code> loads it all into RAM; iterate lines instead.</div>

### Type hints and static checking

Type hints document intent and let tools (mypy, pyright, IDEs) catch bugs before running. They are not enforced at run time. Use built-in generics (`list[int]`, `dict[str, float]`) and `X | None` on modern Python; use `TypedDict`, `Protocol`, `Literal`, `Callable` for richer contracts.

<pre data-lang="python"><code>from typing import Callable, Iterable, Literal, Optional, Protocol, TypedDict, TypeVar

T = TypeVar("T")

def first(items: list[T], default: T | None = None) -&gt; T | None:
    return items[0] if items else default

def apply(rows: Iterable[dict[str, int]], fn: Callable[[int], int]) -&gt; list[int]:
    return [fn(r["v"]) for r in rows]

class Row(TypedDict):
    id: int
    name: str

class Writer(Protocol):             # structural typing: any object with write() matches
    def write(self, data: bytes) -&gt; int: ...

def save(w: Writer, data: bytes) -&gt; int:
    return w.write(data)

Mode = Literal["append", "overwrite"]
def write_table(mode: Mode) -&gt; None: ...

r: Row = {"id": 1, "name": "Asha"}
# write_table("delete")   # mypy: Argument 1 has incompatible type "Literal['delete']"</code></pre>

<pre data-lang="bash"><code>pip install mypy
mypy src/
# src/etl/x.py:12: error: Incompatible return value type (got "str", expected "int")  [return-value]</code></pre>

<div class="box tip"><b>Practical advice</b> Annotate function signatures at module boundaries first; run mypy in CI. Pydantic reads the same annotations to validate data at run time.</div>

### Testing with pytest

pytest discovers files named `test_*.py` and functions named `test_*`, uses plain `assert` with rich failure output, and offers fixtures (reusable setup), parametrisation and monkeypatching. Test pure transformation functions heavily; mock only at I/O boundaries.

<div class="diagram">
<div class="diagram-label">flowchart — pytest run lifecycle</div>
<div class="mermaid">
flowchart LR
    D["Discover test files"] --> F["Build fixtures"]
    F --> S["Setup fixture"]
    S --> T["Run test function"]
    T --> A{"assert ok?"}
    A -->|yes| P["PASS"]
    A -->|no| X["FAIL with diff"]
    P --> TD["Teardown fixture"]
    X --> TD
    TD --> R["Report summary"]
</div>
</div>

<pre data-lang="python"><code># src/etl/transform.py
def normalize(rec: dict) -&gt; dict:
    return {"id": int(rec["id"]), "name": rec["name"].strip().title()}

# tests/test_transform.py
import pytest
from unittest.mock import MagicMock, patch
from etl.transform import normalize

def test_normalize_basic():
    assert normalize({"id": "7", "name": "  asha rao "}) == {"id": 7, "name": "Asha Rao"}

@pytest.mark.parametrize("raw, expected", [
    ({"id": "1", "name": "a"}, {"id": 1, "name": "A"}),
    ({"id": 2,   "name": "B "}, {"id": 2, "name": "B"}),
])
def test_normalize_many(raw, expected):
    assert normalize(raw) == expected

def test_missing_key_raises():
    with pytest.raises(KeyError):
        normalize({"id": 1})

@pytest.fixture
def sample_df(tmp_path):                 # tmp_path is a built-in fixture
    p = tmp_path / "x.csv"
    p.write_text("id,name\n1,asha\n")
    return p

def test_reads_file(sample_df):
    assert sample_df.read_text().startswith("id")

def test_s3_upload_called():
    with patch("boto3.client") as client:
        s3 = MagicMock()
        client.return_value = s3
        import boto3
        boto3.client("s3").put_object(Bucket="b", Key="k", Body=b"x")
        s3.put_object.assert_called_once_with(Bucket="b", Key="k", Body=b"x")

# run: pytest -q
# ....F
# 1 failed, 4 passed in 0.12s</code></pre>

<pre data-lang="bash"><code>pytest -q                      # quiet run
pytest -k normalize -x         # run matching tests, stop at first failure
pytest --cov=etl --cov-report=term-missing
pytest -m "not slow"           # select by marker</code></pre>

<div class="box info"><b>conftest.py</b> Put shared fixtures in <code>conftest.py</code>; pytest loads it automatically. Use <code>moto</code> to fake AWS in tests and <code>chispa</code> or a local SparkSession for PySpark tests.</div>

### Data engineering libraries: boto3, SQLAlchemy and PySpark

#### boto3 (AWS SDK)

`client` is a low-level 1:1 map of the API; `resource` is a higher-level object interface (being phased out for new services). Credentials come from the default chain: env vars, shared credentials file, then an IAM role (on EC2, ECS, Lambda). Never hard-code keys.

<pre data-lang="python"><code>import boto3
from botocore.exceptions import ClientError

s3 = boto3.client("s3", region_name="ap-south-1")

s3.upload_file("daily.parquet", "my-lake", "raw/orders/dt=2025-01-01/daily.parquet")
s3.download_file("my-lake", "raw/orders/dt=2025-01-01/daily.parquet", "local.parquet")

# list more than 1000 keys with a paginator
paginator = s3.get_paginator("list_objects_v2")
total = 0
for page in paginator.paginate(Bucket="my-lake", Prefix="raw/orders/"):
    for obj in page.get("Contents", []):
        total += obj["Size"]
print(total)

try:
    s3.head_object(Bucket="my-lake", Key="nope")
except ClientError as e:
    print(e.response["Error"]["Code"])    # 404

# presigned URL valid for 10 minutes
url = s3.generate_presigned_url("get_object",
        Params={"Bucket": "my-lake", "Key": "raw/report.csv"}, ExpiresIn=600)

# DynamoDB resource
ddb = boto3.resource("dynamodb").Table("orders")
ddb.put_item(Item={"order_id": "o1", "customer": "c9", "amt": 250})
print(ddb.get_item(Key={"order_id": "o1"})["Item"])</code></pre>

#### SQLAlchemy

SQLAlchemy has a Core layer (SQL expression and connection management) and an ORM layer (classes mapped to tables). The `Engine` owns a connection pool; use it as a context manager so connections return to the pool.

<pre data-lang="python"><code>from sqlalchemy import create_engine, text, String, Integer
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, Session

engine = create_engine("postgresql+psycopg2://user:pass@host:5432/shop", pool_size=5)

# Core with bound parameters (prevents SQL injection)
with engine.begin() as conn:             # begin() commits on success, rolls back on error
    conn.execute(text("INSERT INTO emp(name, salary) VALUES (:n, :s)"), {"n": "Asha", "s": 90000})
    rows = conn.execute(text("SELECT name, salary FROM emp WHERE salary &gt; :min"), {"min": 50000})
    for r in rows:
        print(r.name, r.salary)          # Asha 90000

# ORM
class Base(DeclarativeBase): pass

class Emp(Base):
    __tablename__ = "emp"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(50))
    salary: Mapped[int]

with Session(engine) as s:
    s.add(Emp(name="Ravi", salary=120000))
    s.commit()
    top = s.query(Emp).filter(Emp.salary &gt; 100000).all()

# Pandas integration
import pandas as pd
df = pd.read_sql("SELECT dept, avg(salary) FROM emp GROUP BY dept", engine)
df.to_sql("dept_summary", engine, if_exists="replace", index=False, chunksize=10_000)</code></pre>

<div class="box warn"><b>Never</b> build SQL with f-strings from user input. Always use bound parameters (<code>:name</code>).</div>

#### PySpark

PySpark drives a Spark cluster from Python. DataFrame operations are lazy: transformations build a plan, and an action (`show`, `count`, `write`) triggers execution. Prefer built-in functions over Python UDFs (UDFs serialise rows between JVM and Python and are slow).

<div class="diagram">
<div class="diagram-label">flowchart — lazy evaluation in PySpark</div>
<div class="mermaid">
flowchart LR
    R["read parquet"] --> F["filter"]
    F --> G["groupBy agg"]
    G --> W["withColumn"]
    W --> ACT{"Action called?"}
    ACT -->|"no, only plan"| LAZY["Nothing executed"]
    ACT -->|"write or show"| EXEC["Catalyst optimizes\nplan runs on executors"]
</div>
</div>

<pre data-lang="python"><code>from pyspark.sql import SparkSession, functions as F, Window

spark = SparkSession.builder.appName("orders").getOrCreate()

orders = spark.read.parquet("s3a://my-lake/raw/orders/")
daily = (orders
    .filter(F.col("status") == "PAID")
    .withColumn("dt", F.to_date("created_at"))
    .groupBy("dt", "customer_id")
    .agg(F.sum("amount").alias("revenue"), F.count("*").alias("orders")))

w = Window.partitionBy("dt").orderBy(F.desc("revenue"))
top3 = daily.withColumn("rk", F.row_number().over(w)).filter("rk &lt;= 3")

top3.show(3)
# +----------+-----------+-------+------+---+
# |        dt|customer_id|revenue|orders| rk|
# +----------+-----------+-------+------+---+
# |2025-01-01|        c42| 9800.0|     4|  1|
# |2025-01-01|        c07| 7500.0|     2|  2|
# |2025-01-01|        c19| 6100.0|     3|  3|

top3.write.mode("overwrite").partitionBy("dt").parquet("s3a://my-lake/curated/top_customers/")

big = orders.join(F.broadcast(spark.read.parquet("s3a://my-lake/dim/customers/")), "customer_id")</code></pre>

<div class="tw"><table><thead><tr><th>Library</th><th>Use case</th><th>Key feature</th></tr></thead><tbody>
<tr><td>PySpark</td><td>distributed processing, TB scale</td><td>lazy DataFrames, Catalyst optimizer</td></tr>
<tr><td>SQLAlchemy</td><td>Python to RDBMS</td><td>engine pool, Core + ORM</td></tr>
<tr><td>boto3</td><td>AWS automation</td><td>paginators, waiters, IAM-role credentials</td></tr>
<tr><td>Great Expectations</td><td>data quality tests</td><td>declarative expectations on tables</td></tr>
<tr><td>dbt-core</td><td>SQL transformations</td><td>models, tests, lineage</td></tr>
<tr><td>Polars</td><td>fast single-machine DataFrames</td><td>Rust, lazy, multi-threaded</td></tr>
<tr><td>Pydantic</td><td>validation and settings</td><td>typed models, automatic parsing</td></tr>
</tbody></table></div>

### Interview quick answers

<div class="tw"><table><thead><tr><th>Question</th><th>Short answer</th></tr></thead><tbody>
<tr><td>list vs tuple?</td><td>List is mutable, tuple immutable and hashable if its items are; tuples are slightly smaller and faster, used for fixed records and dict keys.</td></tr>
<tr><td>What is the difference between <code>is</code> and <code>==</code>?</td><td><code>is</code> compares object identity, <code>==</code> compares value via <code>__eq__</code>.</td></tr>
<tr><td>Shallow vs deep copy?</td><td>Shallow copies the outer container only and shares nested objects; deep copy recursively duplicates them.</td></tr>
<tr><td>What are <code>*args</code> and <code>**kwargs</code>?</td><td>Collect extra positional args into a tuple and extra keyword args into a dict; also used to unpack at call sites.</td></tr>
<tr><td>Generator vs list?</td><td>A generator yields lazily one item at a time with constant memory and can be consumed once; a list stores everything.</td></tr>
<tr><td>What is a decorator?</td><td>A callable that takes a function and returns a replacement, applied with <code>@</code>; use <code>functools.wraps</code> to keep metadata.</td></tr>
<tr><td>What is the GIL?</td><td>A mutex in CPython allowing one thread to run bytecode at a time; hurts CPU-bound threads, not I/O-bound ones.</td></tr>
<tr><td>Threads vs processes vs asyncio?</td><td>Threads for blocking I/O, processes for CPU, asyncio for massive async I/O in one thread.</td></tr>
<tr><td>How is memory managed?</td><td>Reference counting plus a cyclic garbage collector for reference cycles.</td></tr>
<tr><td><code>__init__</code> vs <code>__new__</code>?</td><td><code>__new__</code> creates the instance, <code>__init__</code> initialises it.</td></tr>
<tr><td><code>@staticmethod</code> vs <code>@classmethod</code>?</td><td>Static gets no implicit first arg; classmethod gets the class (<code>cls</code>), good for alternative constructors.</td></tr>
<tr><td>What is MRO?</td><td>The order Python searches base classes (C3 linearisation); see <code>Cls.__mro__</code>; <code>super()</code> follows it.</td></tr>
<tr><td>Why avoid mutable default args?</td><td>The default is created once at definition time and shared across calls.</td></tr>
<tr><td>How do you handle a 50 GB CSV?</td><td>Stream or chunk with Pandas <code>chunksize</code>, use Polars lazy scan, convert to Parquet, or use Spark.</td></tr>
<tr><td>Pandas apply vs vectorised?</td><td>Vectorised ops run in C and are 10-100x faster than row-wise <code>apply</code>.</td></tr>
<tr><td>What does <code>if __name__ == "__main__"</code> do?</td><td>Runs code only when the file is executed directly, not when imported.</td></tr>
<tr><td>How do you test code that calls AWS?</td><td>Mock with <code>unittest.mock</code> or <code>moto</code>, inject the client as a parameter, keep logic in pure functions.</td></tr>
</tbody></table></div>

<div class="box tip"><b>Coding question warm-up</b> Be able to write from memory: dedupe preserving order (<code>list(dict.fromkeys(xs))</code>), word frequency (<code>collections.Counter</code>), flatten nested lists, group by key (<code>defaultdict(list)</code>), two-sum with a dict, read a file line by line and aggregate.</div>

<pre data-lang="python"><code>from collections import Counter, defaultdict

print(list(dict.fromkeys([3, 1, 3, 2, 1])))          # [3, 1, 2]
print(Counter("mississippi").most_common(2))          # [('i', 4), ('s', 4)]
g = defaultdict(list)
for k, v in [("a", 1), ("b", 2), ("a", 3)]:
    g[k].append(v)
print(dict(g))                                        # {'a': [1, 3], 'b': [2]}

def two_sum(nums, target):
    seen = {}
    for i, n in enumerate(nums):
        if target - n in seen:
            return [seen[target - n], i]
        seen[n] = i
print(two_sum([2, 7, 11, 15], 9))                     # [0, 1]</code></pre>

---

## AWS {#aws}

Amazon Web Services rents you compute, storage, databases, networking and hundreds of managed services on demand, billed by usage. The skill is knowing which service fits which job, how they connect inside a VPC, how identity and encryption protect them, and how to keep the bill sane. These notes follow the order you meet things in practice: infrastructure, compute, storage, data, network, security, integration, analytics, operations, then architecture patterns.

<div class="diagram">
<div class="diagram-label">mind map — AWS</div>
<div class="mermaid">
mindmap
  root((AWS))
    Compute
      EC2 virtual machines
      Lambda serverless
      ECS EKS Fargate
      Elastic Beanstalk
    Storage
      S3 object
      EBS block
      EFS shared files
      Glacier archive
    Database
      RDS and Aurora relational
      DynamoDB NoSQL
      Redshift warehouse
      ElastiCache in-memory
      DocumentDB
      Neptune graph
    Networking
      VPC
      Route 53 DNS
      CloudFront CDN
      ALB and NLB
      API Gateway
      Security group vs NACL
    Security
      IAM
      Cognito
      KMS
      Secrets Manager
      WAF and Shield
      GuardDuty
    Messaging
      SQS queue
      SNS pub sub
      Kinesis streams
      EventBridge
      MSK Kafka
    Analytics
      Glue ETL
      Athena SQL on S3
      EMR
      Lake Formation
      QuickSight
    DevOps
      CodePipeline
      CodeBuild
      CodeDeploy
      CloudFormation and CDK
      CloudWatch
      CloudTrail
      X-Ray
</div>
</div>

### Global infrastructure: Regions, Availability Zones and edge

A <strong>Region</strong> is a geographic area (for example ap-south-1 Mumbai, us-east-1 N. Virginia) made of several isolated <strong>Availability Zones</strong>. An AZ is one or more physical data centres with independent power, cooling and networking, connected to its sibling AZs by low-latency private fiber (typically under 2 ms). <strong>Edge locations</strong> and Regional Edge Caches (used by CloudFront, Route 53, WAF) sit in hundreds of cities close to users. <strong>Local Zones</strong> and <strong>Outposts</strong> extend AWS closer to a city or into your own data centre.

<div class="diagram">
<div class="diagram-label">flowchart — Region, AZ and edge hierarchy</div>
<div class="mermaid">
flowchart TD
    GL["AWS Global Network"] --> R1["Region ap-south-1 Mumbai"]
    GL --> R2["Region eu-west-1 Ireland"]
    GL --> EDGE["Edge locations\nCloudFront and Route 53"]
    R1 --> AZ1["AZ ap-south-1a"]
    R1 --> AZ2["AZ ap-south-1b"]
    R1 --> AZ3["AZ ap-south-1c"]
    AZ1 --> DC["One or more\ndata centres"]
    EDGE --> USER["Users get low latency"]
</div>
</div>

<div class="tw"><table><thead><tr><th>Concept</th><th>What it is</th><th>Design implication</th></tr></thead><tbody>
<tr><td>Region</td><td>Independent geography, data stays unless you replicate it</td><td>Pick for latency, data residency law, service availability and price</td></tr>
<tr><td>Availability Zone</td><td>Isolated failure domain inside a Region</td><td>Spread across at least 2 AZs for high availability</td></tr>
<tr><td>Edge location</td><td>CDN and DNS point of presence</td><td>Cache static content near users, terminate TLS early</td></tr>
<tr><td>Local Zone / Outposts</td><td>AWS infra in a metro area / on premises</td><td>Single-digit ms latency or data that must stay on site</td></tr>
</tbody></table></div>

Example scenario: an Indian retailer must keep customer data in India, so it chooses ap-south-1 and deploys web servers in 3 AZs. If AZ "a" loses power, the load balancer stops sending traffic to its instances and the app continues at about two thirds capacity. For disaster recovery against a whole-Region failure it replicates S3 and the database to ap-south-2 (Hyderabad).

<div class="box tip"><b>Rule of thumb</b> High availability = multi-AZ (same Region). Disaster recovery = multi-Region. AZ names like <code>ap-south-1a</code> map to different physical zones for different accounts, so use AZ IDs (<code>aps1-az1</code>) when coordinating across accounts.</div>

### Shared responsibility model

AWS secures the cloud itself; you secure what you put in it. The line moves with the service: the more managed the service, the more AWS handles.

<div class="diagram">
<div class="diagram-label">flowchart — who is responsible for what</div>
<div class="mermaid">
flowchart TD
    subgraph CUST["Customer: security IN the cloud"]
        C1["Your data and encryption choices"]
        C2["IAM users, roles, policies"]
        C3["OS patching on EC2"]
        C4["Security groups and NACLs"]
        C5["Application code"]
    end
    subgraph AWSR["AWS: security OF the cloud"]
        A1["Physical data centres"]
        A2["Hardware and host OS"]
        A3["Hypervisor and network fabric"]
        A4["Managed service software"]
    end
    CUST --> AWSR
</div>
</div>

<div class="tw"><table><thead><tr><th>Service</th><th>AWS handles</th><th>You handle</th></tr></thead><tbody>
<tr><td>EC2 (IaaS)</td><td>Hardware, hypervisor</td><td>Guest OS patches, firewall config, app, data, IAM</td></tr>
<tr><td>RDS (managed)</td><td>OS and DB engine patching, backups infra, failover</td><td>Schema, parameters, users, network access, encryption settings</td></tr>
<tr><td>S3 / Lambda (abstracted)</td><td>Almost the whole stack</td><td>Bucket policies, function code, IAM, data classification</td></tr>
</tbody></table></div>

<div class="box info"><b>Exam line</b> "Patching the guest OS on EC2 is the customer's job; patching the RDS engine is AWS's job (you choose the maintenance window)."</div>

### EC2: instance types, pricing, Auto Scaling and load balancing

EC2 gives you virtual servers. You choose an AMI (OS image), an instance type (CPU, RAM, network), storage (EBS or instance store), a security group and an IAM role. Instance names read as family + generation + extras + size, for example <code>m6i.xlarge</code> (m = general purpose, 6th generation, i = Intel, xlarge = 4 vCPU).

<div class="tw"><table><thead><tr><th>Family</th><th>Optimised for</th><th>Examples</th><th>Typical use</th></tr></thead><tbody>
<tr><td>T (burstable)</td><td>Baseline CPU with credits</td><td>t3.micro, t3.medium</td><td>Dev, small websites</td></tr>
<tr><td>M (general)</td><td>Balanced CPU and RAM</td><td>m6i, m7g</td><td>App servers</td></tr>
<tr><td>C (compute)</td><td>CPU</td><td>c6i, c7g</td><td>Batch, encoding, gaming</td></tr>
<tr><td>R / X (memory)</td><td>RAM</td><td>r6i, x2idn</td><td>In-memory DB, large Spark executors</td></tr>
<tr><td>I / D (storage)</td><td>Local NVMe / dense HDD</td><td>i3, d3</td><td>NoSQL, data warehousing</td></tr>
<tr><td>P / G (accelerated)</td><td>GPU</td><td>p4d, g5</td><td>ML training, graphics</td></tr>
</tbody></table></div>

#### Purchasing options

<div class="tw"><table><thead><tr><th>Model</th><th>Commitment</th><th>Discount vs On-Demand</th><th>Best for</th></tr></thead><tbody>
<tr><td>On-Demand</td><td>None, per second</td><td>0%</td><td>Spiky or unknown workloads</td></tr>
<tr><td>Reserved Instances</td><td>1 or 3 years, specific family/Region</td><td>up to about 72%</td><td>Steady 24x7 workloads</td></tr>
<tr><td>Savings Plans</td><td>1 or 3 years of $/hour spend</td><td>up to about 72%</td><td>Steady usage, flexibility across families, Fargate, Lambda</td></tr>
<tr><td>Spot</td><td>None, can be reclaimed with 2 min notice</td><td>up to about 90%</td><td>Fault-tolerant: batch, Spark, CI, stateless workers</td></tr>
<tr><td>Dedicated Host</td><td>Physical server for you</td><td>-</td><td>BYO licences, compliance</td></tr>
</tbody></table></div>

Example: a web tier needs 4 instances all year (baseline) and up to 12 during sales. Buy a Savings Plan covering the 4 baseline instances, use On-Demand for the burst, and run the nightly Spark job on Spot. If an m5.large costs 100 units On-Demand, the baseline might cost about 60 with a plan and the batch about 30 on Spot.

#### Instance lifecycle

<div class="diagram">
<div class="diagram-label">stateDiagram — EC2 instance lifecycle</div>
<div class="mermaid">
stateDiagram-v2
    state "pending" as p
    state "running" as r
    state "stopping" as sg
    state "stopped" as st
    state "shutting-down" as sd
    state "terminated" as t
    [*] --> p
    p --> r
    r --> sg: stop
    sg --> st
    st --> p: start
    r --> sd: terminate
    st --> sd: terminate
    sd --> t
    t --> [*]
</div>
</div>

You pay compute only while running; EBS volumes and Elastic IPs still cost while stopped. Stopping and starting usually moves the instance to new hardware and changes its public IP (unless an Elastic IP is attached). Instance-store data is lost on stop.

#### Auto Scaling and load balancing

An <strong>Auto Scaling Group (ASG)</strong> keeps a desired number of instances running from a launch template, spread across subnets in several AZs, replacing unhealthy ones and scaling by policy (target tracking on CPU, request count per target, or scheduled / predictive). An <strong>Elastic Load Balancer</strong> distributes traffic to healthy targets.

<div class="diagram">
<div class="diagram-label">flowchart — ELB plus ASG across two AZs</div>
<div class="mermaid">
flowchart TD
    U["Users"] --> DNS["Route 53"]
    DNS --> ALB["Application Load Balancer\nin public subnets"]
    ALB --> T1["EC2 AZ a"]
    ALB --> T2["EC2 AZ b"]
    ALB --> T3["EC2 AZ b"]
    ASG["Auto Scaling Group\nmin 2 desired 3 max 10"] -.-> T1
    ASG -.-> T2
    ASG -.-> T3
    CW["CloudWatch metric\nCPU 50 percent target"] --> ASG
</div>
</div>

<div class="tw"><table><thead><tr><th>Load balancer</th><th>Layer</th><th>Routes by</th><th>Pick when</th></tr></thead><tbody>
<tr><td>ALB</td><td>7 (HTTP/HTTPS, gRPC, WebSocket)</td><td>path, host, header, query, OIDC auth</td><td>Web apps, microservices, Lambda targets</td></tr>
<tr><td>NLB</td><td>4 (TCP/UDP/TLS)</td><td>IP and port, static IP per AZ</td><td>Millions of requests per second, ultra-low latency, static IPs</td></tr>
<tr><td>GWLB</td><td>3</td><td>transparent bump-in-wire</td><td>Third-party firewalls and inspection appliances</td></tr>
<tr><td>CLB</td><td>4 and 7</td><td>legacy</td><td>Avoid for new builds</td></tr>
</tbody></table></div>

<pre data-lang="bash"><code># Target-tracking policy: keep average CPU of the group at 50 percent
aws autoscaling put-scaling-policy \
  --auto-scaling-group-name web-asg \
  --policy-name cpu50 \
  --policy-type TargetTrackingScaling \
  --target-tracking-configuration '{"PredefinedMetricSpecification":{"PredefinedMetricType":"ASGAverageCPUUtilization"},"TargetValue":50.0}'
# With 4 instances at 80% average CPU the group scales out toward 4 x 80/50 = about 6.4 -> 7 instances</code></pre>

<div class="box warn"><b>Pitfalls</b> Cooldowns and slow warm-up cause flapping. Health checks: use ELB health checks in the ASG so a failing app is replaced, not only a dead host. Sticky sessions hide state problems; keep sessions in ElastiCache or DynamoDB.</div>

### Lambda and serverless flow

Lambda runs your function in response to an event, scales automatically from zero, and bills per request and per millisecond of duration times memory. Memory (128 MB to 10 GB) also determines CPU. Maximum duration is 15 minutes; code package up to 250 MB unzipped (10 GB as a container image).

<div class="diagram">
<div class="diagram-label">sequenceDiagram — Lambda behind API Gateway</div>
<div class="mermaid">
sequenceDiagram
    participant C as Client
    participant G as API Gateway
    participant L as Lambda service
    participant F as Function
    participant D as DynamoDB
    C->>G: POST orders
    G->>L: Invoke with event
    alt no warm environment
        L->>L: Cold start - download code, start runtime, run init
    end
    L->>F: handler event context
    F->>D: PutItem
    D-->>F: ok
    F-->>L: response
    L-->>G: statusCode 201
    G-->>C: 201 Created
</div>
</div>

<div class="tw"><table><thead><tr><th>Invocation type</th><th>Triggers</th><th>Behaviour</th></tr></thead><tbody>
<tr><td>Synchronous</td><td>API Gateway, ALB, SDK call</td><td>Caller waits; errors returned to caller</td></tr>
<tr><td>Asynchronous</td><td>S3, SNS, EventBridge</td><td>Queued internally, 2 automatic retries, then DLQ or destination</td></tr>
<tr><td>Poll-based (event source mapping)</td><td>SQS, Kinesis, DynamoDB Streams, MSK</td><td>Lambda polls and sends batches; failing batch is retried or split</td></tr>
</tbody></table></div>

<pre data-lang="python"><code>import json, os, boto3

table = boto3.resource("dynamodb").Table(os.environ["TABLE"])   # created OUTSIDE handler: reused when warm

def handler(event, context):
    body = json.loads(event["body"])
    table.put_item(Item={"order_id": body["id"], "amt": body["amt"]})
    return {"statusCode": 201, "body": json.dumps({"ok": True})}

# S3 event handler: Lambda gets a batch of records
def s3_handler(event, context):
    for rec in event["Records"]:
        bucket = rec["s3"]["bucket"]["name"]
        key = rec["s3"]["object"]["key"]
        print(f"new object s3://{bucket}/{key}")</code></pre>

<div class="box info"><b>Cost example</b> 1 million requests per month at 200 ms and 512 MB = 1M x 0.2 s x 0.5 GB = 100,000 GB-seconds. Free tier covers 400,000 GB-seconds and 1M requests, so this workload is effectively free; at 100M requests it is a few thousand rupees.</div>

<div class="box warn"><b>Limits and pitfalls</b> Default account concurrency 1,000 per Region (raise via quota). Cold starts matter for Java and big packages (use Provisioned Concurrency or SnapStart). Lambda in a VPC needs NAT or VPC endpoints for internet and AWS API access. Make handlers idempotent, because async and stream sources deliver at least once.</div>

### Containers: ECS, EKS, Fargate and ECR

Containers package app plus dependencies. <strong>ECR</strong> stores images. <strong>ECS</strong> is AWS's own orchestrator (task definitions, services). <strong>EKS</strong> is managed Kubernetes (you get the K8s API, portability, ecosystem). Both run on EC2 nodes you manage or on <strong>Fargate</strong>, where AWS provisions the compute per task so you manage no servers.

<div class="diagram">
<div class="diagram-label">flowchart — container deployment path</div>
<div class="mermaid">
flowchart LR
    DEV["Developer push"] --> CB["CodeBuild\ndocker build"]
    CB --> ECR["ECR image registry"]
    ECR --> SVC["ECS service or EKS deployment"]
    SVC --> FG["Fargate tasks"]
    SVC --> EC2N["EC2 worker nodes"]
    ALB["ALB"] --> FG
    ALB --> EC2N
</div>
</div>

<div class="tw"><table><thead><tr><th>Option</th><th>You manage</th><th>Choose when</th></tr></thead><tbody>
<tr><td>ECS on Fargate</td><td>Task definition, service</td><td>Simplest path for containers, small team</td></tr>
<tr><td>ECS on EC2</td><td>Nodes, AMI patching, capacity</td><td>GPUs, cheaper at steady high utilisation</td></tr>
<tr><td>EKS</td><td>K8s objects, node groups (or Fargate profiles)</td><td>Need Kubernetes API, Helm, multi-cloud portability</td></tr>
<tr><td>App Runner / Beanstalk</td><td>Almost nothing</td><td>Deploy web app from source or image quickly</td></tr>
<tr><td>Lambda container image</td><td>Image only</td><td>Event-driven code that needs large dependencies</td></tr>
</tbody></table></div>

<pre data-lang="json"><code>{
  "family": "orders-api",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "executionRoleArn": "arn:aws:iam::123456789012:role/ecsTaskExecutionRole",
  "taskRoleArn": "arn:aws:iam::123456789012:role/ordersApiTaskRole",
  "containerDefinitions": [{
    "name": "api",
    "image": "123456789012.dkr.ecr.ap-south-1.amazonaws.com/orders-api:1.4.2",
    "portMappings": [{"containerPort": 8080}],
    "logConfiguration": {"logDriver": "awslogs",
      "options": {"awslogs-group": "/ecs/orders-api", "awslogs-region": "ap-south-1", "awslogs-stream-prefix": "api"}}
  }]
}</code></pre>

<div class="box note"><b>Two roles</b> The <em>execution role</em> lets ECS pull the image and write logs. The <em>task role</em> is what your application code uses to call S3, DynamoDB and so on. Mixing them up is a common mistake.</div>

### S3 deep dive: classes, lifecycle, versioning and presigned URLs

S3 stores objects (up to 5 TB each) in buckets, addressed by key; the namespace looks like folders but is flat (prefixes). It offers 11 nines of durability by storing data redundantly across at least 3 AZs (except One Zone classes), strong read-after-write consistency, and virtually unlimited scale (at least 3,500 PUT and 5,500 GET requests per second per prefix). Objects over 100 MB should use multipart upload (required above 5 GB).

#### Storage classes

<div class="tw"><table><thead><tr><th>Class</th><th>Access pattern</th><th>Retrieval</th><th>Min duration</th><th>Notes</th></tr></thead><tbody>
<tr><td>Standard</td><td>Frequent</td><td>ms</td><td>none</td><td>Default, highest storage price</td></tr>
<tr><td>Intelligent-Tiering</td><td>Unknown or changing</td><td>ms for frequent/infrequent tiers</td><td>none</td><td>Auto-moves between tiers, small monitoring fee per object</td></tr>
<tr><td>Standard-IA</td><td>Infrequent, needs ms</td><td>ms, retrieval fee</td><td>30 days</td><td>Multi-AZ, 128 KB minimum billable size</td></tr>
<tr><td>One Zone-IA</td><td>Infrequent, re-creatable</td><td>ms</td><td>30 days</td><td>Single AZ, about 20% cheaper than IA</td></tr>
<tr><td>Glacier Instant Retrieval</td><td>Rare, need ms</td><td>ms</td><td>90 days</td><td>Archive with instant access</td></tr>
<tr><td>Glacier Flexible Retrieval</td><td>Archive</td><td>minutes to 12 hours</td><td>90 days</td><td>Expedited, standard, bulk options</td></tr>
<tr><td>Glacier Deep Archive</td><td>Compliance archive</td><td>12 to 48 hours</td><td>180 days</td><td>Cheapest, well under 1 USD per TB-month</td></tr>
</tbody></table></div>

#### Lifecycle rules

<div class="diagram">
<div class="diagram-label">flowchart — lifecycle transition timeline</div>
<div class="mermaid">
flowchart LR
    D0["Day 0\nS3 Standard"] -->|"30 days"| IA["Standard-IA"]
    IA -->|"90 days"| GL["Glacier Flexible"]
    GL -->|"365 days"| DA["Deep Archive"]
    DA -->|"2555 days"| DEL["Expire / delete"]
</div>
</div>

<pre data-lang="json"><code>{
  "Rules": [{
    "ID": "logs-tiering",
    "Status": "Enabled",
    "Filter": {"Prefix": "logs/"},
    "Transitions": [
      {"Days": 30,  "StorageClass": "STANDARD_IA"},
      {"Days": 90,  "StorageClass": "GLACIER"},
      {"Days": 365, "StorageClass": "DEEP_ARCHIVE"}
    ],
    "Expiration": {"Days": 2555},
    "NoncurrentVersionExpiration": {"NoncurrentDays": 60},
    "AbortIncompleteMultipartUpload": {"DaysAfterInitiation": 7}
  }]
}</code></pre>

Example: 10 TB of logs kept in Standard costs roughly 10,000 GB x 0.023 = about 230 USD per month; after tiering most of it into Glacier and Deep Archive, the same data can fall below 30 USD per month.

#### Versioning and protection

With versioning enabled, every overwrite creates a new version and a delete only adds a <em>delete marker</em>; older versions stay recoverable. Once enabled it can only be suspended, never removed. Add <strong>MFA Delete</strong> and <strong>Object Lock</strong> (WORM, governance or compliance mode) for ransomware and compliance protection, and <strong>Cross-Region Replication</strong> (needs versioning on both sides) for DR.

<pre data-lang="bash"><code>aws s3api put-bucket-versioning --bucket my-lake --versioning-configuration Status=Enabled
aws s3 cp report.csv s3://my-lake/report.csv      # version v1
aws s3 cp report2.csv s3://my-lake/report.csv     # version v2 (v1 retained)
aws s3api list-object-versions --bucket my-lake --prefix report.csv
# Versions: [ {VersionId: "3Lg...", IsLatest: true}, {VersionId: "a1B...", IsLatest: false} ]
aws s3 rm s3://my-lake/report.csv                 # only adds a delete marker
aws s3api delete-object --bucket my-lake --key report.csv --version-id a1B...   # permanent delete of v1</code></pre>

#### Presigned URL flow

A presigned URL lets someone without AWS credentials upload or download one specific object for a limited time. The URL embeds a signature made with the credentials of whoever generated it, so it carries <em>their</em> permissions and stops working when the expiry passes or those credentials are revoked.

<div class="diagram">
<div class="diagram-label">sequenceDiagram — browser uploads directly to S3 with a presigned URL</div>
<div class="mermaid">
sequenceDiagram
    participant B as Browser
    participant A as Your API
    participant S as S3
    B->>A: Request upload for invoice.pdf
    A->>A: Authenticate user, check permission
    A->>S: Generate presigned PUT URL using role credentials
    S-->>A: URL with signature and expiry 300 seconds
    A-->>B: Return URL
    B->>S: PUT file directly to URL
    S->>S: Validate signature, expiry and method
    S-->>B: 200 OK
    S-)A: Event notification via SNS or Lambda
</div>
</div>

<pre data-lang="python"><code>import boto3
s3 = boto3.client("s3", region_name="ap-south-1")

put_url = s3.generate_presigned_url(
    "put_object",
    Params={"Bucket": "uploads-prod", "Key": "users/42/invoice.pdf", "ContentType": "application/pdf"},
    ExpiresIn=300)
print(put_url[:60])   # https://uploads-prod.s3.amazonaws.com/users/42/invoice.pdf?X-Amz-...

# Or a POST policy with a size limit
post = s3.generate_presigned_post("uploads-prod", "users/42/${filename}",
        Conditions=[["content-length-range", 0, 10_485_760]], ExpiresIn=300)</code></pre>

#### Security and other features

<ul>
<li><strong>Block Public Access</strong> on by default for new buckets; leave it on at account level.</li>
<li><strong>Bucket policy</strong> (resource-based) for cross-account and VPC endpoint rules; ACLs are legacy (disable with Object Ownership: bucket owner enforced).</li>
<li><strong>Encryption</strong>: SSE-S3 (default, AES-256), SSE-KMS (key policy and audit trail, per-request KMS cost), SSE-C, client-side.</li>
<li><strong>Event notifications</strong> to Lambda, SQS, SNS or EventBridge; <strong>S3 Select</strong>/Athena for querying; <strong>Transfer Acceleration</strong> via edge; <strong>static website hosting</strong> behind CloudFront.</li>
<li><strong>Data lake layout</strong>: <code>s3://lake/raw/orders/dt=2025-01-01/part-0.parquet</code>. Partitioned Hive-style prefixes let Athena and Spark prune data.</li>
</ul>

<div class="box warn"><b>Pitfalls</b> Millions of tiny files hurt Athena and Spark performance (compact them into 128 MB to 1 GB Parquet files). Cross-Region and internet egress is billed. Deleting a versioned bucket needs all versions removed. Lifecycle to IA of objects under 128 KB can cost more, not less.</div>

### EBS and EFS (and instance store)

<strong>EBS</strong> is network-attached block storage for one EC2 instance at a time (io2 Multi-Attach is the exception), living in a single AZ and persisting independently of the instance. Back it up with incremental <strong>snapshots</strong> stored in S3; copy snapshots across Regions or AZs to move or restore volumes. <strong>EFS</strong> is a managed NFS file system that many Linux instances (across AZs) mount at once; it grows and shrinks automatically. <strong>Instance store</strong> is physically attached, very fast and ephemeral.

<div class="tw"><table><thead><tr><th>Type</th><th>Medium</th><th>Max IOPS</th><th>Use</th></tr></thead><tbody>
<tr><td>gp3</td><td>SSD</td><td>16,000 (set independently of size)</td><td>Default for boot and general volumes</td></tr>
<tr><td>io2 / io2 Block Express</td><td>SSD</td><td>64,000 / 256,000</td><td>Critical databases</td></tr>
<tr><td>st1</td><td>HDD</td><td>throughput optimised</td><td>Big sequential reads, logs, Kafka</td></tr>
<tr><td>sc1</td><td>HDD</td><td>cold</td><td>Rarely accessed bulk data</td></tr>
</tbody></table></div>

<div class="tw"><table><thead><tr><th></th><th>EBS</th><th>EFS</th><th>S3</th></tr></thead><tbody>
<tr><td>Type</td><td>Block</td><td>File (NFS)</td><td>Object</td></tr>
<tr><td>Attach to</td><td>1 instance, 1 AZ</td><td>Thousands of clients, multi-AZ</td><td>HTTP API</td></tr>
<tr><td>Capacity</td><td>Provisioned (resizable)</td><td>Elastic</td><td>Unlimited</td></tr>
<tr><td>Cost (relative)</td><td>Medium</td><td>Highest per GB</td><td>Lowest</td></tr>
</tbody></table></div>

<div class="diagram">
<div class="diagram-label">flowchart — backup and restore with snapshots</div>
<div class="mermaid">
flowchart LR
    VOL["EBS volume\nAZ a"] -->|"snapshot incremental"| SNAP["Snapshot in S3"]
    SNAP -->|"create volume"| VOL2["New volume\nAZ b"]
    SNAP -->|"copy"| SNAP2["Snapshot in\nanother Region"]
    DLM["Data Lifecycle Manager\nor AWS Backup"] --> SNAP
</div>
</div>

<pre data-lang="bash"><code>aws ec2 create-volume --availability-zone ap-south-1a --size 100 --volume-type gp3 --iops 4000 --throughput 250 --encrypted
aws ec2 attach-volume --volume-id vol-0abc --instance-id i-0123 --device /dev/sdf
sudo mkfs -t xfs /dev/nvme1n1 &amp;&amp; sudo mount /dev/nvme1n1 /data
aws ec2 create-snapshot --volume-id vol-0abc --description "nightly"
aws ec2 modify-volume --volume-id vol-0abc --size 200        # grow online, then extend the filesystem</code></pre>

<div class="box tip"><b>Tip</b> Encrypt EBS by default at account level (KMS). A volume must be in the same AZ as the instance. Delete unattached volumes and old snapshots; they are a classic hidden cost.</div>

### Databases: RDS, Aurora and DynamoDB

#### RDS

RDS runs MySQL, PostgreSQL, MariaDB, Oracle, SQL Server or Db2 for you: provisioning, patching, backups (automated, point-in-time restore up to 35 days), monitoring. <strong>Multi-AZ</strong> keeps a synchronous standby in another AZ for automatic failover (60 to 120 seconds, availability feature, not for reads). <strong>Read replicas</strong> use asynchronous replication to scale reads (up to 15 for Aurora, 5 for most others), can be cross-Region and can be promoted.

<div class="diagram">
<div class="diagram-label">flowchart — RDS Multi-AZ plus read replica</div>
<div class="mermaid">
flowchart LR
    APP["Application"] -->|"writes and reads"| PRI["Primary\nAZ a"]
    PRI -->|"synchronous"| STB["Standby\nAZ b"]
    PRI -->|"asynchronous"| RR["Read replica\nAZ c"]
    APP -->|"read only queries"| RR
    STB -.->|"automatic failover\nDNS endpoint flips"| PRI
</div>
</div>

#### Aurora

Aurora is AWS's cloud-native MySQL and PostgreSQL compatible engine. Storage is a shared, self-healing, 6-copy volume across 3 AZs that auto-grows to 128 TiB; replicas read from the same storage so replica lag is typically milliseconds and failover is under 30 seconds. Variants: <strong>Serverless v2</strong> (scales ACUs in fine steps), <strong>Global Database</strong> (cross-Region, under 1 s replication lag), <strong>Aurora I/O-Optimized</strong>. Use Aurora over plain RDS when you need more throughput, faster failover and more replicas, accepting a modest price premium.

<div class="diagram">
<div class="diagram-label">flowchart — Aurora cluster</div>
<div class="mermaid">
flowchart TD
    W["Writer endpoint"] --> P["Primary instance"]
    R["Reader endpoint\nload balances"] --> R1["Replica 1"]
    R --> R2["Replica 2"]
    P --> ST["Shared cluster volume"]
    R1 --> ST
    R2 --> ST
    ST --> C1["Copies in AZ a"]
    ST --> C2["Copies in AZ b"]
    ST --> C3["Copies in AZ c"]
</div>
</div>

#### DynamoDB

DynamoDB is a serverless key-value and document NoSQL database with single-digit millisecond reads and writes at any scale. Every item is addressed by its <strong>primary key</strong>: either a partition key alone, or partition key + sort key. DynamoDB hashes the partition key to pick the physical partition, so a <em>high-cardinality, evenly accessed</em> partition key spreads load; a hot key (such as a date or a status value) throttles. The sort key orders items inside a partition and enables range queries.

<div class="diagram">
<div class="diagram-label">flowchart — partition key routing and a GSI</div>
<div class="mermaid">
flowchart LR
    REQ["Query customer_id = c9"] --> HASH["Hash partition key"]
    HASH --> P1["Partition 1"]
    HASH --> P2["Partition 2"]
    HASH --> P3["Partition 3"]
    P2 --> ITEMS["Items sorted by order_date\nsort key"]
    TBL["Base table\nPK customer_id SK order_date"] -.->|"async copy"| GSI["GSI\nPK status SK order_date"]
    GSI --> Q2["Query status = SHIPPED"]
</div>
</div>

<div class="tw"><table><thead><tr><th>Index</th><th>Keys</th><th>Consistency</th><th>Created when</th></tr></thead><tbody>
<tr><td>Base table</td><td>PK (+ SK)</td><td>Eventual or strong</td><td>Table creation</td></tr>
<tr><td>LSI (local)</td><td>Same PK, different SK</td><td>Eventual or strong</td><td>Only at table creation, 10 GB per PK limit</td></tr>
<tr><td>GSI (global)</td><td>Different PK and SK</td><td>Eventual only</td><td>Any time, has its own capacity</td></tr>
</tbody></table></div>

<pre data-lang="python"><code>import boto3
from boto3.dynamodb.conditions import Key

ddb = boto3.resource("dynamodb")
t = ddb.create_table(
    TableName="orders",
    KeySchema=[{"AttributeName": "customer_id", "KeyType": "HASH"},
               {"AttributeName": "order_date",  "KeyType": "RANGE"}],
    AttributeDefinitions=[{"AttributeName": "customer_id", "AttributeType": "S"},
                          {"AttributeName": "order_date",  "AttributeType": "S"},
                          {"AttributeName": "status",      "AttributeType": "S"}],
    GlobalSecondaryIndexes=[{
        "IndexName": "status-date-index",
        "KeySchema": [{"AttributeName": "status", "KeyType": "HASH"},
                      {"AttributeName": "order_date", "KeyType": "RANGE"}],
        "Projection": {"ProjectionType": "ALL"}}],
    BillingMode="PAY_PER_REQUEST")

t.put_item(Item={"customer_id": "c9", "order_date": "2025-01-05", "status": "SHIPPED", "amt": 450})

# Query is efficient (uses the key), Scan reads the whole table (avoid)
r = t.query(KeyConditionExpression=Key("customer_id").eq("c9") &amp; Key("order_date").between("2025-01-01", "2025-01-31"))
print(r["Items"][0]["amt"])        # 450

r2 = t.query(IndexName="status-date-index", KeyConditionExpression=Key("status").eq("SHIPPED"))</code></pre>

<div class="tw"><table><thead><tr><th>Capacity mode</th><th>How you pay</th><th>Use</th></tr></thead><tbody>
<tr><td>On-demand</td><td>Per read and write request</td><td>Unpredictable or new workloads</td></tr>
<tr><td>Provisioned (+ auto scaling)</td><td>RCU and WCU per hour</td><td>Steady predictable traffic, cheaper at scale</td></tr>
</tbody></table></div>

One RCU = one strongly consistent read per second of up to 4 KB (two eventually consistent). One WCU = one write per second of up to 1 KB. Example: 100 writes per second of 3 KB items need 100 x 3 = 300 WCU. Other features: Streams (change capture to Lambda), TTL (free expiry), Global Tables (multi-Region active-active), DAX (in-memory cache), transactions, PITR backups.

<div class="box tip"><b>Which database?</b> Relational joins and transactions on moderate scale: RDS or Aurora. Key-based access at huge scale and predictable latency: DynamoDB. Analytics over TBs: Redshift or Athena. Sub-millisecond cache: ElastiCache. Graph: Neptune. Documents with Mongo API: DocumentDB.</div>

### VPC: subnets, routing, security groups, NACLs and NAT

A VPC is your private, logically isolated network defined by a CIDR block (for example 10.0.0.0/16 gives 65,536 addresses). You carve it into <strong>subnets</strong>, each in exactly one AZ. A subnet is <em>public</em> if its route table has a route to an <strong>Internet Gateway</strong>; otherwise it is <em>private</em>. AWS reserves 5 IPs in every subnet (so a /24 has 251 usable addresses).

<div class="diagram">
<div class="diagram-label">flowchart — three-tier VPC across two AZs</div>
<div class="mermaid">
flowchart TD
    NET["Internet"] --> IGW["Internet Gateway"]
    subgraph VPC["VPC 10.0.0.0/16"]
        subgraph AZA["AZ a"]
            PUBA["Public subnet 10.0.1.0/24\nALB, NAT GW"]
            APPA["Private app subnet 10.0.11.0/24\nEC2"]
            DBA["Private DB subnet 10.0.21.0/24\nRDS primary"]
        end
        subgraph AZB["AZ b"]
            PUBB["Public subnet 10.0.2.0/24\nALB, NAT GW"]
            APPB["Private app subnet 10.0.12.0/24\nEC2"]
            DBB["Private DB subnet 10.0.22.0/24\nRDS standby"]
        end
    end
    IGW --> PUBA
    IGW --> PUBB
    PUBA --> APPA --> DBA
    PUBB --> APPB --> DBB
</div>
</div>

#### Routing

Each subnet is associated with one route table. The most specific matching route wins; <code>local</code> (VPC CIDR) is always present.

<div class="tw"><table><thead><tr><th>Route table</th><th>Destination</th><th>Target</th><th>Meaning</th></tr></thead><tbody>
<tr><td rowspan="2">Public</td><td>10.0.0.0/16</td><td>local</td><td>VPC internal traffic</td></tr>
<tr><td>0.0.0.0/0</td><td>igw-xxxx</td><td>Anything else goes to the internet</td></tr>
<tr><td rowspan="2">Private app</td><td>10.0.0.0/16</td><td>local</td><td>VPC internal traffic</td></tr>
<tr><td>0.0.0.0/0</td><td>nat-xxxx</td><td>Outbound only via NAT Gateway</td></tr>
<tr><td>Private DB</td><td>10.0.0.0/16</td><td>local</td><td>No internet route at all</td></tr>
</tbody></table></div>

#### NAT Gateway

Instances in private subnets have no public IP, so they cannot reach the internet directly. A NAT Gateway placed in a <em>public</em> subnet (with an Elastic IP) translates their outbound traffic; replies are allowed back but nobody on the internet can initiate a connection in. Deploy one per AZ for resilience (cost: hourly plus per GB). Use <strong>VPC endpoints</strong> (Gateway for S3 and DynamoDB, free; Interface for other services via PrivateLink) so AWS API traffic never goes through NAT, reducing cost and exposure.

<div class="diagram">
<div class="diagram-label">sequenceDiagram — private instance downloads a package</div>
<div class="mermaid">
sequenceDiagram
    participant I as Private EC2
    participant N as NAT Gateway
    participant G as Internet Gateway
    participant X as Internet host
    I->>N: Request to external IP via route 0.0.0.0/0
    N->>N: Replace private source IP with Elastic IP
    N->>G: Forward
    G->>X: Request
    X-->>G: Response
    G-->>N: Response to Elastic IP
    N->>N: Map back to private IP
    N-->>I: Response
</div>
</div>

#### Security groups vs NACLs

<div class="tw"><table><thead><tr><th></th><th>Security Group</th><th>Network ACL</th></tr></thead><tbody>
<tr><td>Applies to</td><td>ENI (instance, Lambda in VPC, RDS...)</td><td>Whole subnet</td></tr>
<tr><td>State</td><td><strong>Stateful</strong>: return traffic auto-allowed</td><td><strong>Stateless</strong>: must allow both directions, incl. ephemeral ports 1024-65535</td></tr>
<tr><td>Rules</td><td>Allow only</td><td>Allow and Deny, evaluated in number order, first match wins</td></tr>
<tr><td>Default</td><td>Deny all inbound, allow all outbound</td><td>Default NACL allows all</td></tr>
<tr><td>Source can be</td><td>CIDR or another security group</td><td>CIDR only</td></tr>
<tr><td>Typical use</td><td>Primary tier-to-tier firewall</td><td>Coarse block of an abusive IP range</td></tr>
</tbody></table></div>

<div class="diagram">
<div class="diagram-label">flowchart — security group chaining across tiers</div>
<div class="mermaid">
flowchart LR
    U["Internet"] -->|"443 from 0.0.0.0/0"| ALB["sg-alb"]
    ALB -->|"8080 from sg-alb"| APP["sg-app"]
    APP -->|"5432 from sg-app"| DB["sg-db"]
</div>
</div>

Example: <code>sg-db</code> allows inbound TCP 5432 with source <code>sg-app</code> instead of an IP range, so it keeps working as the ASG adds and removes instances. To block 203.0.113.0/24 entirely, add a NACL rule 90 DENY before the allow rule 100.

<div class="box info"><b>Connecting networks</b> VPC Peering (1-to-1, non-transitive, no overlapping CIDRs), Transit Gateway (hub-and-spoke for many VPCs and VPNs), Site-to-Site VPN (encrypted over internet), Direct Connect (dedicated line), PrivateLink (expose a service privately without peering).</div>

<div class="box warn"><b>Pitfalls</b> No route to NAT means <code>apt install</code> hangs in private subnets. NAT Gateway data processing charges can dominate a bill (move S3 traffic to a gateway endpoint). Subnets are per-AZ: an ALB needs subnets in at least 2 AZs.</div>

### Route 53 (DNS)

Route 53 is a highly available authoritative DNS service plus domain registration and health checks. A <strong>hosted zone</strong> holds records (A, AAAA, CNAME, MX, TXT, and the AWS-specific <strong>Alias</strong> that points to ALB, CloudFront, S3 website and others, works at the zone apex and is free for AWS targets).

<div class="tw"><table><thead><tr><th>Routing policy</th><th>Behaviour</th><th>Use</th></tr></thead><tbody>
<tr><td>Simple</td><td>One record, possibly multiple values</td><td>Single resource</td></tr>
<tr><td>Weighted</td><td>Split by weight, for example 90/10</td><td>Canary releases, A/B tests</td></tr>
<tr><td>Latency</td><td>Lowest latency Region</td><td>Multi-Region apps</td></tr>
<tr><td>Failover</td><td>Primary, fall back to secondary on failed health check</td><td>Active-passive DR</td></tr>
<tr><td>Geolocation / Geoproximity</td><td>By user location</td><td>Compliance, localisation</td></tr>
<tr><td>Multivalue</td><td>Up to 8 healthy records</td><td>Simple client-side balancing</td></tr>
</tbody></table></div>

<div class="diagram">
<div class="diagram-label">sequenceDiagram — failover routing</div>
<div class="mermaid">
sequenceDiagram
    participant U as User resolver
    participant R as Route 53
    participant H as Health checker
    participant P as Primary ALB Mumbai
    participant S as Secondary ALB Hyderabad
    H->>P: Probe every 30 seconds
    P--xH: No response 3 times
    H->>R: Mark primary unhealthy
    U->>R: Lookup app.example.com
    R-->>U: Secondary ALB address
    U->>S: HTTPS request
</div>
</div>

<div class="box warn"><b>TTL</b> Resolvers cache answers for the TTL, so failover is only as fast as health check detection plus TTL. Use a 60 second TTL (or less) for records you plan to fail over.</div>

### CloudFront (CDN)

CloudFront caches content at edge locations and fetches from an <strong>origin</strong> (S3, ALB, API Gateway, any HTTP server) on a cache miss. It terminates TLS near users, absorbs DDoS (with Shield and WAF), and can run code at the edge (CloudFront Functions, Lambda@Edge).

<div class="diagram">
<div class="diagram-label">sequenceDiagram — cache hit vs miss</div>
<div class="mermaid">
sequenceDiagram
    participant U as User
    participant E as Edge location
    participant O as Origin S3 or ALB
    U->>E: GET /logo.png
    alt cached and fresh
        E-->>U: 200 from cache, X-Cache Hit
    else cache miss
        E->>O: GET /logo.png
        O-->>E: 200 with Cache-Control max-age
        E->>E: Store by cache key
        E-->>U: 200, X-Cache Miss
    end
</div>
</div>

<ul>
<li><strong>Cache key and TTL</strong> are controlled by cache policy; set <code>Cache-Control</code> at the origin. Fewer headers/cookies/query strings in the key = higher hit ratio.</li>
<li><strong>Origin Access Control (OAC)</strong> keeps an S3 bucket private so only CloudFront can read it.</li>
<li><strong>Invalidation</strong> (<code>aws cloudfront create-invalidation --paths "/index.html"</code>) is costly at scale; prefer versioned file names (app.4f3a.js).</li>
<li>Signed URLs and signed cookies restrict private content (different from S3 presigned URLs).</li>
</ul>

Example: 1 TB per month of images from S3 to users. Directly from S3 each request is billed as S3 egress; through CloudFront with a 95% hit ratio only 5% hits S3, latency drops from about 120 ms to about 20 ms, and CloudFront data transfer is usually cheaper than S3 internet egress (and S3 to CloudFront transfer is free).

### IAM: identities, policies and role assumption

IAM controls <em>who</em> (principal) can do <em>what</em> (action) on <em>which</em> resource, under <em>which</em> conditions. Evaluation order: explicit Deny always wins; otherwise an explicit Allow is needed; the default is implicit deny. Every API call is authenticated (who are you) and then authorised (policy evaluation).

<div class="tw"><table><thead><tr><th>Entity</th><th>What it is</th><th>Credentials</th></tr></thead><tbody>
<tr><td>Root user</td><td>Account owner, unrestricted</td><td>Lock away with MFA, use only for few tasks</td></tr>
<tr><td>IAM user</td><td>Long-lived identity for a person or legacy app</td><td>Password, access keys (avoid)</td></tr>
<tr><td>Group</td><td>Set of users to attach policies to</td><td>none</td></tr>
<tr><td>Role</td><td>Identity assumed temporarily by services, users, other accounts, federated identities</td><td>Short-lived STS tokens</td></tr>
<tr><td>Policy</td><td>JSON permissions document</td><td>Identity-based, resource-based, permission boundary, SCP, session</td></tr>
</tbody></table></div>

#### Policy JSON example

<pre data-lang="json"><code>{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ReadWriteOwnPrefix",
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:PutObject"],
      "Resource": "arn:aws:s3:::my-lake/raw/*",
      "Condition": {
        "StringEquals": {"s3:x-amz-server-side-encryption": "aws:kms"},
        "IpAddress": {"aws:SourceIp": "203.0.113.0/24"}
      }
    },
    {
      "Sid": "ListBucketOnlyUnderRaw",
      "Effect": "Allow",
      "Action": "s3:ListBucket",
      "Resource": "arn:aws:s3:::my-lake",
      "Condition": {"StringLike": {"s3:prefix": ["raw/*"]}}
    },
    {
      "Sid": "NeverDelete",
      "Effect": "Deny",
      "Action": "s3:DeleteObject",
      "Resource": "*"
    }
  ]
}</code></pre>

Read it as: allow get and put on objects under <code>raw/</code> only if encrypted with KMS and coming from the office IP range; allow listing the bucket restricted to the <code>raw/</code> prefix; deny deletes everywhere (an explicit deny overrides any allow elsewhere).

#### Role assumption

A role has two policies: a <strong>trust policy</strong> (who may assume it) and <strong>permission policies</strong> (what it can do). When a principal assumes a role, STS returns temporary credentials (access key, secret key, session token) valid for 15 minutes to 12 hours.

<pre data-lang="json"><code>{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": {"AWS": "arn:aws:iam::111111111111:role/etl-runner"},
    "Action": "sts:AssumeRole",
    "Condition": {"StringEquals": {"sts:ExternalId": "audit-2025"}}
  }]
}</code></pre>

<div class="diagram">
<div class="diagram-label">sequenceDiagram — cross-account role assumption</div>
<div class="mermaid">
sequenceDiagram
    participant P as Principal in account 111111111111
    participant S as STS
    participant I as IAM in account 222222222222
    participant R as S3 in account 222222222222
    P->>S: AssumeRole target role ARN
    S->>I: Check trust policy and caller permission
    I-->>S: Allowed
    S-->>P: Temporary credentials with expiry
    P->>R: GetObject signed with temporary credentials
    R->>I: Evaluate role permission policy
    I-->>R: Allow
    R-->>P: Object data
</div>
</div>

For an EC2 instance, an <strong>instance profile</strong> hands the role to the instance, and the SDK fetches rotating credentials from the instance metadata service (use IMDSv2). Lambda and ECS tasks get roles the same way. For people, use IAM Identity Center (SSO) rather than IAM users.

<div class="box tip"><b>Best practices</b> Least privilege, roles over access keys, MFA everywhere, no wildcard <code>*:*</code>, use Access Analyzer to find unused permissions, Organizations + SCPs to set guardrails across accounts, separate accounts for dev, test, prod.</div>

<div class="box warn"><b>Pitfalls</b> Never commit access keys to Git. Bucket policy and IAM policy are evaluated together: same-account access needs an allow in either; cross-account needs an allow on both sides. Roles trusting <code>"Principal": "*"</code> are a breach waiting to happen.</div>

### KMS, Secrets Manager and encryption

<strong>KMS</strong> creates and controls cryptographic keys (KMS keys, formerly CMKs) inside FIPS-validated HSMs; the key material never leaves KMS in plaintext. Services use <strong>envelope encryption</strong>: KMS generates a data key, the service encrypts the data with it, and stores the data key encrypted by the KMS key. This keeps big data off the KMS API (which caps direct encrypt at 4 KB).

<div class="diagram">
<div class="diagram-label">sequenceDiagram — envelope encryption</div>
<div class="mermaid">
sequenceDiagram
    participant A as Application or S3
    participant K as KMS
    A->>K: GenerateDataKey for key alias app-key
    K-->>A: Plaintext data key and encrypted data key
    A->>A: Encrypt data locally with plaintext key
    A->>A: Discard plaintext key, store encrypted data key with data
    Note over A,K: Later to decrypt
    A->>K: Decrypt encrypted data key
    K-->>A: Plaintext data key if caller is allowed
    A->>A: Decrypt data locally
</div>
</div>

<div class="tw"><table><thead><tr><th>Key type</th><th>Managed by</th><th>Cost</th><th>Notes</th></tr></thead><tbody>
<tr><td>AWS owned</td><td>AWS</td><td>free</td><td>Invisible to you (for example DynamoDB default)</td></tr>
<tr><td>AWS managed (aws/s3)</td><td>AWS</td><td>free</td><td>Cannot edit key policy</td></tr>
<tr><td>Customer managed</td><td>You</td><td>1 USD per month + API calls</td><td>Custom policy, rotation, cross-account sharing, disable or delete</td></tr>
</tbody></table></div>

Access to a KMS key needs <em>both</em> the key policy to allow the principal (or delegate to IAM) and an IAM policy allowing <code>kms:Decrypt</code>. A frequent cause of "AccessDenied reading an encrypted S3 object" is a role that can read the bucket but not use the key. <strong>Secrets Manager</strong> stores database credentials and API keys with automatic rotation (Lambda-based, native for RDS) and fine IAM control; SSM Parameter Store is cheaper for plain configuration. Encrypt in transit with TLS (ACM issues free public certificates for ALB and CloudFront).

<pre data-lang="python"><code>import boto3, json
sm = boto3.client("secretsmanager")
cred = json.loads(sm.get_secret_value(SecretId="prod/orders/db")["SecretString"])
print(list(cred))     # ['username', 'password', 'host', 'port']   (never print the values)</code></pre>

### Messaging and streaming: SQS, SNS, Kinesis, EventBridge

These services decouple producers from consumers so a slow or failing consumer does not break the producer.

<div class="tw"><table><thead><tr><th>Service</th><th>Model</th><th>Delivery</th><th>Retention</th><th>Consumers</th></tr></thead><tbody>
<tr><td>SQS Standard</td><td>Queue, pull</td><td>At least once, best-effort order, nearly unlimited throughput</td><td>1 min to 14 days (default 4)</td><td>One logical consumer group; message deleted after processing</td></tr>
<tr><td>SQS FIFO</td><td>Queue, pull</td><td>Exactly-once processing, strict order per message group</td><td>same</td><td>300 msg/s (3,000 batched), higher with high-throughput mode</td></tr>
<tr><td>SNS</td><td>Pub/sub, push</td><td>Fan-out to many subscribers</td><td>no storage</td><td>SQS, Lambda, HTTP, email, SMS</td></tr>
<tr><td>Kinesis Data Streams</td><td>Ordered log in shards</td><td>Per-shard order, replayable</td><td>24 h to 365 days</td><td>Many consumers each reading the full stream</td></tr>
<tr><td>Kinesis Firehose</td><td>Managed delivery</td><td>Buffers then writes to S3, Redshift, OpenSearch, Splunk</td><td>none</td><td>No consumer code</td></tr>
<tr><td>EventBridge</td><td>Event bus with rules</td><td>Content-based routing, schedules, SaaS events</td><td>archive and replay optional</td><td>20+ target types</td></tr>
</tbody></table></div>

<div class="diagram">
<div class="diagram-label">flowchart — SNS fan-out to SQS queues</div>
<div class="mermaid">
flowchart LR
    S3["S3 upload"] --> SNS["SNS topic\norder-events"]
    SNS --> Q1["SQS billing queue"]
    SNS --> Q2["SQS analytics queue"]
    SNS --> EM["Email alert"]
    Q1 --> L1["Lambda billing"]
    Q2 --> L2["Lambda analytics"]
    Q1 -.->|"after maxReceiveCount"| DLQ["Dead-letter queue"]
</div>
</div>

#### SQS details

A consumer receives a message, which becomes invisible for the <strong>visibility timeout</strong> (default 30 s); if the consumer does not delete it in time, it reappears (so processing must be idempotent). <strong>Long polling</strong> (<code>WaitTimeSeconds=20</code>) cuts empty responses and cost. Failing messages move to a <strong>dead-letter queue</strong> after <code>maxReceiveCount</code> attempts.

<pre data-lang="python"><code>import boto3, json
sqs = boto3.client("sqs")
q = sqs.get_queue_url(QueueName="orders")["QueueUrl"]

sqs.send_message(QueueUrl=q, MessageBody=json.dumps({"order_id": "o1"}))

while True:
    resp = sqs.receive_message(QueueUrl=q, MaxNumberOfMessages=10, WaitTimeSeconds=20, VisibilityTimeout=60)
    for m in resp.get("Messages", []):
        data = json.loads(m["Body"])
        # process(data) must be idempotent
        sqs.delete_message(QueueUrl=q, ReceiptHandle=m["ReceiptHandle"])</code></pre>

#### Kinesis Data Streams

A stream has <strong>shards</strong>; each shard accepts 1 MB/s or 1,000 records/s in and gives 2 MB/s out. A record's <strong>partition key</strong> is hashed to pick the shard, preserving order per key. Capacity example: 5 MB/s of clickstream needs at least 5 shards (on-demand mode scales automatically). Consume with KCL apps, Lambda, Flink or Firehose.

<div class="diagram">
<div class="diagram-label">flowchart — streaming ingestion to a data lake</div>
<div class="mermaid">
flowchart LR
    APP["Apps and IoT"] -->|"PutRecord partition key"| KDS["Kinesis stream\nshards 1 to N"]
    KDS --> FH["Firehose\nbuffer 5 min or 128 MB"]
    FH --> S3["S3 Parquet"]
    KDS --> LAM["Lambda real-time alerts"]
    KDS --> FL["Managed Flink\nwindowed aggregates"]
</div>
</div>

#### EventBridge

Producers put JSON events on a bus; <strong>rules</strong> match event patterns and route to targets. It also hosts cron-style schedules (replacing CloudWatch Events) and EventBridge Pipes / Scheduler.

<pre data-lang="json"><code>{
  "source": ["aws.s3"],
  "detail-type": ["Object Created"],
  "detail": {"bucket": {"name": ["my-lake"]}, "object": {"key": [{"prefix": "raw/orders/"}]}}
}</code></pre>

<div class="box tip"><b>How to choose</b> Need a work queue with retries: SQS. Need one event to reach many systems: SNS or EventBridge. Need ordered, replayable, high-volume stream with several consumers: Kinesis or MSK (Kafka). Need to push stream to S3 with zero code: Firehose.</div>

### Analytics: Glue, Athena, Redshift and EMR

<div class="diagram">
<div class="diagram-label">flowchart — S3 data lake analytics stack</div>
<div class="mermaid">
flowchart LR
    SRC["Sources\nRDS, APIs, streams"] --> RAW["S3 raw zone"]
    RAW --> GJ["Glue ETL job\nSpark"]
    GJ --> CUR["S3 curated Parquet\npartitioned"]
    CR["Glue crawler"] --> CAT["Glue Data Catalog"]
    CUR --> CR
    CAT --> ATH["Athena"]
    CAT --> RS["Redshift Spectrum"]
    CAT --> EMR["EMR Spark"]
    ATH --> QS["QuickSight dashboards"]
    RS --> QS
    LF["Lake Formation\ncolumn-level permissions"] -.-> CAT
</div>
</div>

#### Glue

Serverless ETL: <strong>Crawlers</strong> infer schemas and write table definitions to the <strong>Data Catalog</strong> (a Hive-metastore-compatible metadata store used by Athena, EMR, Redshift Spectrum). <strong>Jobs</strong> run Spark (or Python shell, or Ray) billed per DPU-hour. Job bookmarks track processed data for incremental loads. Glue Workflows and Triggers chain jobs; Glue Data Quality adds rules.

<pre data-lang="python"><code>import sys
from awsglue.context import GlueContext
from awsglue.utils import getResolvedOptions
from pyspark.context import SparkContext
from pyspark.sql import functions as F

args = getResolvedOptions(sys.argv, ["JOB_NAME", "run_date"])
gc = GlueContext(SparkContext.getOrCreate())
spark = gc.spark_session

df = gc.create_dynamic_frame.from_catalog(database="raw", table_name="orders").toDF()
out = (df.filter(F.col("status") == "PAID")
         .withColumn("dt", F.to_date("created_at"))
         .dropDuplicates(["order_id"]))
out.write.mode("overwrite").partitionBy("dt").parquet("s3://my-lake/curated/orders/")</code></pre>

#### Athena

Serverless interactive SQL (Trino / Presto engine) directly on S3 data, billed at about 5 USD per TB scanned. Cost and speed levers: columnar formats (Parquet/ORC), compression, partitioning, and selecting only needed columns.

<pre data-lang="sql"><code>CREATE EXTERNAL TABLE curated.orders (
  order_id string, customer_id string, amount double
)
PARTITIONED BY (dt string)
STORED AS PARQUET
LOCATION 's3://my-lake/curated/orders/';

MSCK REPAIR TABLE curated.orders;     -- discover dt=... partitions

SELECT customer_id, SUM(amount) AS revenue
FROM curated.orders
WHERE dt BETWEEN '2025-01-01' AND '2025-01-07'    -- partition pruning
GROUP BY customer_id ORDER BY revenue DESC LIMIT 3;
-- Data scanned: 180 MB (vs 40 GB for the same query on raw CSV) -&gt; cost about 0.001 USD instead of 0.20 USD</code></pre>

#### Redshift

Petabyte-scale columnar MPP data warehouse. A leader node plans queries; compute nodes hold slices of data. Tune with a good <strong>distribution key</strong> (co-locate joined tables, avoid skew), <strong>sort key</strong> (zone-map pruning), compression and <code>COPY</code> from S3 in parallel (many files). RA3 nodes separate compute from managed storage; Serverless removes cluster sizing; Spectrum queries S3 external tables; materialized views and concurrency scaling handle BI load.

<pre data-lang="sql"><code>COPY sales FROM 's3://my-lake/curated/sales/dt=2025-01-01/'
IAM_ROLE 'arn:aws:iam::123456789012:role/redshift-copy'
FORMAT AS PARQUET;

CREATE TABLE sales (
  sale_id bigint, customer_id int, sale_date date, amount decimal(12,2)
) DISTKEY(customer_id) SORTKEY(sale_date);</code></pre>

#### EMR

Managed Hadoop ecosystem (Spark, Hive, Presto, HBase, Flink) on EC2, EKS or serverless. Use it when you need full control over Spark configuration, custom libraries or very large persistent clusters; use Glue when you prefer zero cluster management. Save with Spot task nodes, transient clusters (terminate after the job) and S3 (not HDFS) as the durable store.

<div class="tw"><table><thead><tr><th>Need</th><th>Pick</th></tr></thead><tbody>
<tr><td>Ad hoc SQL on S3, pay per query</td><td>Athena</td></tr>
<tr><td>Serverless Spark ETL</td><td>Glue</td></tr>
<tr><td>Fast BI warehouse with many concurrent users and joins</td><td>Redshift</td></tr>
<tr><td>Custom big-data frameworks, tuned Spark</td><td>EMR</td></tr>
<tr><td>Fine-grained permissions on lake tables and columns</td><td>Lake Formation</td></tr>
<tr><td>Dashboards</td><td>QuickSight</td></tr>
</tbody></table></div>

### Monitoring and audit: CloudWatch and CloudTrail

<strong>CloudWatch</strong> answers "how is it behaving?": <em>Metrics</em> (CPU, request count, custom metrics; 1-minute standard, 1 second high resolution), <em>Logs</em> (log groups and streams, retention policy, Logs Insights queries, metric filters), <em>Alarms</em> (threshold, anomaly, composite; actions to SNS, ASG, EC2 recover), <em>Dashboards</em>, and <em>Events/EventBridge</em>. Memory and disk metrics on EC2 need the CloudWatch agent. <strong>CloudTrail</strong> answers "who did what?": it records AWS API calls (management events by default for 90 days in Event History; create a trail to S3 for long-term, organisation-wide, with log file validation). <strong>X-Ray</strong> traces requests across services; <strong>AWS Config</strong> tracks resource configuration and compliance; <strong>GuardDuty</strong> detects threats.

<div class="diagram">
<div class="diagram-label">flowchart — observability signals</div>
<div class="mermaid">
flowchart LR
    RES["EC2, Lambda, RDS"] -->|"metrics"| CWM["CloudWatch Metrics"]
    RES -->|"logs"| CWL["CloudWatch Logs"]
    CWL -->|"metric filter"| CWM
    CWM --> AL["Alarm"]
    AL --> SNS["SNS topic"]
    SNS --> OPS["Email, Slack, PagerDuty"]
    AL --> ASG["Scale out ASG"]
    API["Any API call"] --> CT["CloudTrail"]
    CT --> S3["S3 audit bucket"]
    CT --> CWL
</div>
</div>

<pre data-lang="bash"><code>aws cloudwatch put-metric-alarm --alarm-name high-5xx --namespace AWS/ApplicationELB \
  --metric-name HTTPCode_Target_5XX_Count --statistic Sum --period 60 --evaluation-periods 3 \
  --threshold 10 --comparison-operator GreaterThanThreshold \
  --alarm-actions arn:aws:sns:ap-south-1:123456789012:oncall
# Alarm fires when there are more than 10 5xx errors per minute for 3 consecutive minutes

# CloudWatch Logs Insights query
# fields @timestamp, @message | filter @message like /ERROR/ | stats count() by bin(5m)

# CloudTrail: who deleted the bucket?
aws cloudtrail lookup-events --lookup-attributes AttributeKey=EventName,AttributeValue=DeleteBucket</code></pre>

<div class="box info"><b>Remember</b> CloudWatch = performance and logs. CloudTrail = audit of API activity. Config = configuration history and compliance rules. They are asked as a trio in interviews.</div>

### Infrastructure as code and CI/CD: CloudFormation, CDK, CodePipeline

<strong>CloudFormation</strong> deploys a <em>stack</em> from a YAML or JSON template; it computes a <strong>change set</strong>, creates resources in dependency order, and rolls back on failure. It also detects <strong>drift</strong> when someone edits resources by hand. <strong>CDK</strong> lets you write infrastructure in Python, TypeScript, Java and others; <code>cdk synth</code> generates a CloudFormation template, <code>cdk deploy</code> deploys it. Terraform is the common multi-cloud alternative.

<div class="diagram">
<div class="diagram-label">flowchart — CDK and CloudFormation flow</div>
<div class="mermaid">
flowchart LR
    CODE["CDK app in Python"] -->|"cdk synth"| TPL["CloudFormation template"]
    TPL -->|"cdk deploy"| CS["Change set preview"]
    CS --> STK["Stack create or update"]
    STK --> RES["S3, Lambda, VPC resources"]
    STK -.->|"failure"| RB["Automatic rollback"]
</div>
</div>

<pre data-lang="yaml"><code>AWSTemplateFormatVersion: "2010-09-09"
Parameters:
  Env: {Type: String, AllowedValues: [dev, prod], Default: dev}
Resources:
  LakeBucket:
    Type: AWS::S3::Bucket
    DeletionPolicy: Retain
    Properties:
      BucketName: !Sub "my-lake-${Env}-${AWS::AccountId}"
      VersioningConfiguration: {Status: Enabled}
      BucketEncryption:
        ServerSideEncryptionConfiguration:
          - ServerSideEncryptionByDefault: {SSEAlgorithm: aws:kms}
Outputs:
  BucketArn:
    Value: !GetAtt LakeBucket.Arn</code></pre>

<pre data-lang="python"><code>from aws_cdk import App, Stack, Duration, aws_s3 as s3, aws_lambda as _lambda, aws_s3_notifications as n
from constructs import Construct

class IngestStack(Stack):
    def __init__(self, scope: Construct, id: str, **kw):
        super().__init__(scope, id, **kw)
        bucket = s3.Bucket(self, "Lake", versioned=True, encryption=s3.BucketEncryption.KMS_MANAGED)
        fn = _lambda.Function(self, "Proc", runtime=_lambda.Runtime.PYTHON_3_12,
                              handler="app.handler", code=_lambda.Code.from_asset("src"),
                              timeout=Duration.seconds(60))
        bucket.add_event_notification(s3.EventType.OBJECT_CREATED, n.LambdaDestination(fn))
        bucket.grant_read(fn)          # CDK writes the least-privilege IAM policy for you

app = App()
IngestStack(app, "IngestStack")
app.synth()
# cdk deploy   -&gt; creates bucket, function, role, permission, notification</code></pre>

#### CodePipeline, CodeBuild, CodeDeploy

<div class="diagram">
<div class="diagram-label">flowchart — CodePipeline stages</div>
<div class="mermaid">
flowchart LR
    SRC["Source\nGitHub or CodeCommit"] --> BLD["Build\nCodeBuild runs buildspec.yml"]
    BLD --> TST["Test stage\nunit and integration"]
    TST --> STG["Deploy staging\nCloudFormation or CodeDeploy"]
    STG --> APR["Manual approval"]
    APR --> PRD["Deploy production\nblue green"]
</div>
</div>

<pre data-lang="yaml"><code>version: 0.2
phases:
  install:
    runtime-versions: {python: 3.12}
    commands: [pip install -r requirements.txt]
  build:
    commands:
      - pytest -q
      - docker build -t $ECR_URI:$CODEBUILD_RESOLVED_SOURCE_VERSION .
      - docker push $ECR_URI:$CODEBUILD_RESOLVED_SOURCE_VERSION
artifacts:
  files: [imagedefinitions.json]</code></pre>

CodeDeploy supports in-place and blue/green deployments for EC2, ECS and Lambda (canary and linear traffic shifting with automatic rollback on alarms).

<div class="box warn"><b>Pitfalls</b> Hand-editing a CloudFormation-managed resource causes drift. Renaming a logical ID replaces the resource (and may delete data); protect stateful resources with <code>DeletionPolicy: Retain</code>. Never put secrets in templates; reference Secrets Manager or SSM.</div>

### The Well-Architected Framework (six pillars)

<div class="diagram">
<div class="diagram-label">mind map — Well-Architected pillars</div>
<div class="mermaid">
mindmap
  root((Well-Architected))
    Operational excellence
      Infrastructure as code
      Small reversible changes
      Runbooks and game days
    Security
      Least privilege
      Encrypt everywhere
      Traceability
    Reliability
      Multi AZ
      Backups and tested restore
      Scale horizontally
    Performance efficiency
      Right size
      Serverless and caching
      Experiment
    Cost optimization
      Pay for use
      Savings Plans and Spot
      Tag and measure
    Sustainability
      Maximise utilisation
      Graviton and managed services
</div>
</div>

<div class="tw"><table><thead><tr><th>Pillar</th><th>Key question</th><th>Typical AWS answer</th></tr></thead><tbody>
<tr><td>Operational excellence</td><td>Can we deploy and run safely and learn from failures?</td><td>CloudFormation or CDK, CodePipeline, CloudWatch, runbooks</td></tr>
<tr><td>Security</td><td>Is data and access protected?</td><td>IAM roles, KMS, VPC isolation, WAF, GuardDuty, CloudTrail</td></tr>
<tr><td>Reliability</td><td>Does it recover from failure and meet demand?</td><td>Multi-AZ, ASG, health checks, backups, Route 53 failover, quotas</td></tr>
<tr><td>Performance efficiency</td><td>Are resources matched to the workload?</td><td>Right instance family, CloudFront, ElastiCache, serverless</td></tr>
<tr><td>Cost optimization</td><td>Are we avoiding waste?</td><td>Savings Plans, Spot, S3 tiering, rightsizing, budgets</td></tr>
<tr><td>Sustainability</td><td>Are we minimising environmental impact?</td><td>Graviton, managed services, high utilisation, regions with clean energy</td></tr>
</tbody></table></div>

Reliability terms: <strong>RPO</strong> (how much data you can lose) and <strong>RTO</strong> (how long you can be down) drive the DR strategy.

<div class="tw"><table><thead><tr><th>DR strategy</th><th>RTO / RPO</th><th>Idea</th><th>Relative cost</th></tr></thead><tbody>
<tr><td>Backup and restore</td><td>Hours</td><td>Backups copied to another Region</td><td>Lowest</td></tr>
<tr><td>Pilot light</td><td>Tens of minutes</td><td>Core data replicated, compute off</td><td>Low</td></tr>
<tr><td>Warm standby</td><td>Minutes</td><td>Scaled-down full copy always running</td><td>Medium</td></tr>
<tr><td>Multi-site active-active</td><td>Near zero</td><td>Full capacity in 2+ Regions</td><td>Highest</td></tr>
</tbody></table></div>

### Architecture patterns

#### 1. Serverless web application

<div class="diagram">
<div class="diagram-label">flowchart — serverless web app</div>
<div class="mermaid">
flowchart LR
    U["Users"] --> R53["Route 53"]
    R53 --> CF["CloudFront + WAF"]
    CF -->|"static files"| S3["S3 site bucket"]
    CF -->|"api path"| APIGW["API Gateway"]
    COG["Cognito\nJWT auth"] -.-> APIGW
    APIGW --> LAM["Lambda"]
    LAM --> DDB["DynamoDB"]
    LAM --> SM["Secrets Manager"]
</div>
</div>

No servers to patch, scales to zero, pay per request. Good for spiky or low-traffic apps. Watch for cold starts, 29-second API Gateway timeout and DynamoDB access-pattern design.

#### 2. Three-tier web application

<div class="diagram">
<div class="diagram-label">flowchart — 3-tier on EC2 and RDS</div>
<div class="mermaid">
flowchart TD
    U["Users"] --> R53["Route 53"]
    R53 --> CF["CloudFront"]
    CF --> ALB["ALB in public subnets"]
    ALB --> ASG["Web and app EC2 in ASG\nprivate subnets, 2 AZs"]
    ASG --> CACHE["ElastiCache Redis"]
    ASG --> RDS["RDS Multi-AZ\nprivate DB subnets"]
    ASG -->|"outbound only"| NAT["NAT Gateway"]
    ASG -.-> S3E["S3 gateway endpoint"]
</div>
</div>

Familiar lift-and-shift pattern. Reliability from multi-AZ and ASG; security from private subnets and security group chaining.

#### 3. Event-driven pipeline

<div class="diagram">
<div class="diagram-label">sequenceDiagram — S3 upload to processed result</div>
<div class="mermaid">
sequenceDiagram
    participant P as Producer
    participant S as S3 raw bucket
    participant N as SNS topic
    participant Q as SQS queue
    participant L as Lambda or ECS worker
    participant D as DynamoDB and S3 curated
    P->>S: Upload file
    S->>N: ObjectCreated notification
    N->>Q: Fan out message
    Q->>L: Batch of messages
    L->>S: Read object
    L->>D: Write result
    L-->>Q: Delete message on success
    Q-->>Q: Failed messages go to DLQ after retries
</div>
</div>

SQS between SNS and the worker buffers bursts and gives retries plus a dead-letter queue; worker concurrency can be capped to protect downstream systems.

#### 4. Data lake

<div class="diagram">
<div class="diagram-label">flowchart — data lake on S3</div>
<div class="mermaid">
flowchart LR
    SRC["Apps, DB CDC via DMS, logs"] --> FH["Kinesis Firehose\nor DMS"]
    FH --> RAW["S3 raw"]
    RAW --> GJ["Glue ETL"]
    GJ --> CUR["S3 curated Parquet"]
    CR["Glue crawler"] --> CAT["Data Catalog"]
    CUR --> CR
    CAT --> ATH["Athena"]
    CUR --> SP["Redshift Spectrum"]
    ATH --> QS["QuickSight"]
    LF["Lake Formation security"] -.-> CAT
</div>
</div>

Keep storage and compute separate, store open formats, partition by date, catalog everything, and govern with Lake Formation.

### Cost optimisation tips

<div class="tw"><table><thead><tr><th>Area</th><th>Action</th><th>Typical saving</th></tr></thead><tbody>
<tr><td>Compute</td><td>Right-size using Compute Optimizer; buy Savings Plans for the steady baseline; Spot for batch and CI; Graviton (arm64) instances</td><td>20% to 70%</td></tr>
<tr><td>Idle resources</td><td>Stop dev instances at night (Instance Scheduler), delete unattached EBS, old snapshots, unused Elastic IPs and idle load balancers</td><td>10% to 30%</td></tr>
<tr><td>S3</td><td>Lifecycle to IA and Glacier, Intelligent-Tiering, delete incomplete multipart uploads and old versions, compress and use Parquet</td><td>40% to 80% on cold data</td></tr>
<tr><td>Data transfer</td><td>VPC gateway endpoints for S3 and DynamoDB, CloudFront for egress, keep chatty services in one AZ or Region</td><td>NAT and transfer often 10% of bill</td></tr>
<tr><td>Databases</td><td>Aurora Serverless v2 for variable loads, DynamoDB on-demand vs provisioned decision, reserved instances for RDS, stop non-prod DBs</td><td>30% to 60%</td></tr>
<tr><td>Serverless</td><td>Tune Lambda memory with power tuning, batch SQS and Kinesis events, avoid long idle waits</td><td>Variable</td></tr>
<tr><td>Governance</td><td>Tag everything (team, env, project), AWS Budgets and alerts, Cost Explorer, Cost Anomaly Detection, separate accounts</td><td>Visibility first</td></tr>
</tbody></table></div>

<div class="diagram">
<div class="diagram-label">flowchart — cost optimisation loop</div>
<div class="mermaid">
flowchart LR
    M["Measure\ncost allocation tags\nCost Explorer"] --> A["Analyse\nwaste and top spenders"]
    A --> O["Optimise\nrightsize, commit, tier"]
    O --> G["Govern\nBudgets and alarms"]
    G --> M
</div>
</div>

<div class="box tip"><b>Worked example</b> Monthly bill 100,000: EC2 40,000 (60% steady), NAT 8,000, S3 15,000 (80% cold). Savings Plan on the steady EC2 share: 40,000 x 0.6 x 35% = about 8,400 saved. S3 tiering of cold data: 15,000 x 0.8 x 60% = about 7,200 saved. Gateway endpoints cutting half of NAT traffic: about 4,000 saved. Total about 19,600, nearly 20%, with no change to the application.</div>

### Interview quick answers

<div class="tw"><table><thead><tr><th>Question</th><th>Short answer</th></tr></thead><tbody>
<tr><td>Region vs AZ vs edge location?</td><td>Region is a geography with multiple isolated AZs (data centres); edge locations cache content and serve DNS close to users.</td></tr>
<tr><td>Security group vs NACL?</td><td>SG is stateful, instance level, allow only. NACL is stateless, subnet level, allow and deny with ordered rules.</td></tr>
<tr><td>How does a private instance reach the internet?</td><td>Route 0.0.0.0/0 to a NAT Gateway in a public subnet, which uses the Internet Gateway; or use VPC endpoints for AWS services.</td></tr>
<tr><td>Multi-AZ vs read replica?</td><td>Multi-AZ is synchronous standby for failover (availability). Read replica is asynchronous for read scaling and can be cross-Region.</td></tr>
<tr><td>EBS vs EFS vs S3?</td><td>Block for one instance, shared NFS for many Linux instances, object storage via API for unlimited scale.</td></tr>
<tr><td>How do you secure an S3 bucket?</td><td>Block Public Access, least-privilege IAM and bucket policy, encryption (KMS), versioning plus Object Lock, VPC endpoint policy, access logging, Macie for sensitive data.</td></tr>
<tr><td>How do you give an app AWS access without keys?</td><td>An IAM role attached to the EC2 instance profile, ECS task or Lambda; the SDK gets temporary credentials from STS.</td></tr>
<tr><td>DynamoDB hot partition?</td><td>A skewed partition key concentrates traffic; choose a high-cardinality key, add random suffix (write sharding), or use on-demand and DAX caching.</td></tr>
<tr><td>SQS vs SNS vs Kinesis?</td><td>SQS pull queue, SNS push fan-out, Kinesis ordered replayable stream with multiple consumers.</td></tr>
<tr><td>Athena vs Redshift?</td><td>Athena is serverless ad hoc SQL on S3 billed per scan; Redshift is a provisioned or serverless warehouse for heavy, concurrent BI workloads.</td></tr>
<tr><td>CloudWatch vs CloudTrail vs Config?</td><td>Metrics and logs; API audit; resource configuration history and compliance.</td></tr>
<tr><td>How to make an app highly available?</td><td>Multi-AZ ASG behind ALB, Multi-AZ database, stateless servers, health checks, Route 53 failover for Region-level.</td></tr>
<tr><td>Cold start and how to reduce it?</td><td>Time to create a new Lambda environment; use smaller packages, lighter runtimes, Provisioned Concurrency or SnapStart.</td></tr>
<tr><td>S3 consistency model?</td><td>Strong read-after-write and list consistency for all operations since December 2020.</td></tr>
<tr><td>When Spot?</td><td>Interruptible, stateless or checkpointed work such as Spark batches, CI, rendering.</td></tr>
<tr><td>CloudFormation vs CDK vs Terraform?</td><td>CFN is declarative YAML, CDK generates CFN from real code, Terraform is multi-cloud with its own state.</td></tr>
</tbody></table></div>

<div class="box note"><b>Scenario answer</b> "Design a reliable analytics pipeline": ingest with Firehose into S3 raw; Glue ETL to partitioned Parquet; Glue Catalog and Lake Formation for governance; Athena for ad hoc and Redshift for BI; orchestrate with Airflow or Step Functions; monitor with CloudWatch alarms to SNS; deploy with CDK in a CodePipeline; encrypt with KMS and restrict through IAM roles and VPC endpoints.</div>

---

## Docker {#docker}

Docker packages an application together with everything it needs (runtime, libraries, config) into a portable **image**, and runs that image as an isolated **container** that shares the host kernel. It removes the classic "works on my machine" problem and is the base layer of modern CI/CD, microservices and Kubernetes.

<div class="diagram">
<div class="diagram-label">mind map — Docker</div>
<div class="mermaid">
mindmap
  root((Docker))
    Architecture
      CLI
      Daemon dockerd
      Images
      Containers
      Volumes
      Networks
      Registry
    Lifecycle
      build
      push
      pull
      run
      stop start
      rm
      commit
    Container vs VM
      Process-level isolation
      Starts in milliseconds
      Shares host kernel
      MBs not GBs
    Dockerfile
      Multi-stage builds
      Slim or alpine base
      Copy dependencies first
      Non-root user
      dockerignore
      HEALTHCHECK
      One process per container
    Compose
      services
      depends_on healthy
      volumes
      networks
      up down logs exec
    Networking
      bridge default
      host
      none
      overlay
    Storage
      Named volume
      Bind mount
</div>
</div>

### What Docker is and why we use it

Before containers, deploying meant installing the right Java/Python version, the right OS libraries and the right config on every server. Two machines never matched exactly, so bugs appeared only in production. Virtual machines solved isolation but each VM carries a whole guest OS (GBs, minutes to boot).

A **container** is just a normal Linux process that the kernel has fenced in: it sees its own filesystem, its own process tree, its own network stack and has limited CPU/memory. There is no guest OS, so it starts in milliseconds and weighs megabytes.

**Why teams use it**

- **Reproducibility** - the same image runs identically on a laptop, CI runner and production.
- **Isolation** - two apps needing Python 3.8 and Python 3.12 live side by side.
- **Speed** - start, stop and scale in seconds.
- **Density** - many containers on one host (much cheaper than one VM per app).
- **Immutable deployments** - you ship a new image, you do not patch a running server.

<div class="diagram">
<div class="diagram-label">flowchart — container vs virtual machine stack</div>
<div class="mermaid">
flowchart TB
    subgraph VM["Virtual machines"]
        direction TB
        VA["App A + libs"] --> VG1["Guest OS 1"]
        VB["App B + libs"] --> VG2["Guest OS 2"]
        VG1 --> HYP["Hypervisor"]
        VG2 --> HYP
        HYP --> VH["Host OS / hardware"]
    end
    subgraph CT["Containers"]
        direction TB
        CA["App A + libs"] --> ENG["Container engine"]
        CB["App B + libs"] --> ENG
        ENG --> CH["Host OS kernel / hardware"]
    end
</div>
</div>

<div class="tw"><table><thead><tr><th>Aspect</th><th>Container</th><th>Virtual machine</th></tr></thead><tbody>
<tr><td><strong>Isolation</strong></td><td>Process level, shares host kernel</td><td>Full OS, separate kernel via hypervisor</td></tr>
<tr><td><strong>Startup</strong></td><td>Milliseconds to seconds</td><td>Tens of seconds to minutes</td></tr>
<tr><td><strong>Size</strong></td><td>10 MB - 500 MB typical</td><td>1 GB - tens of GB</td></tr>
<tr><td><strong>Overhead</strong></td><td>Near native</td><td>Hypervisor and guest OS cost</td></tr>
<tr><td><strong>Security boundary</strong></td><td>Weaker (kernel exploits can escape)</td><td>Stronger (hardware virtualisation)</td></tr>
<tr><td><strong>OS flexibility</strong></td><td>Must match host kernel family (Linux on Linux)</td><td>Any guest OS</td></tr>
<tr><td><strong>Best for</strong></td><td>Microservices, CI, cloud-native</td><td>Legacy apps, multi-tenant hard isolation</td></tr>
</tbody></table></div>

<div class="box info"><b>ℹ️ Docker on Windows / macOS</b> Containers need a Linux kernel. Docker Desktop therefore runs a small hidden Linux VM (WSL2 or a lightweight hypervisor) and your containers live inside it. In production on Linux there is no VM layer.</div>

### How isolation works: namespaces and cgroups

Docker does not invent isolation; it uses two Linux kernel features.

**Namespaces** control *what a process can see*. Each container gets its own set:

<div class="tw"><table><thead><tr><th>Namespace</th><th>Isolates</th><th>Effect inside container</th></tr></thead><tbody>
<tr><td><code>pid</code></td><td>Process IDs</td><td>Your main process is PID 1; host processes are invisible</td></tr>
<tr><td><code>net</code></td><td>Network stack</td><td>Own interfaces, IP, routing table, ports</td></tr>
<tr><td><code>mnt</code></td><td>Mount points</td><td>Own root filesystem</td></tr>
<tr><td><code>uts</code></td><td>Hostname</td><td>Container has its own hostname</td></tr>
<tr><td><code>ipc</code></td><td>Shared memory, semaphores</td><td>No IPC with other containers by default</td></tr>
<tr><td><code>user</code></td><td>UID/GID mapping</td><td>Root inside can map to unprivileged user outside (optional)</td></tr>
</tbody></table></div>

**cgroups (control groups)** control *how much a process can use*: CPU shares, memory limit, block I/O, number of PIDs. When a container exceeds its memory limit the kernel OOM-kills it.

<pre data-lang="bash"><code>$ docker run -d --name demo --memory=256m --cpus=0.5 nginx:alpine
$ docker exec demo ps aux
PID   USER     COMMAND
  1   root     nginx: master process nginx -g daemon off;
 29   nginx    nginx: worker process

# On the host the same nginx has a different, big PID:
$ docker top demo
UID   PID    PPID   CMD
root  48213  48190  nginx: master process nginx -g daemon off;

# The cgroup limit that Docker created (cgroup v2):
$ cat /sys/fs/cgroup/system.slice/docker-$(docker inspect -f '&#123;&#123;.Id&#125;&#125;' demo).scope/memory.max
268435456</code></pre>

<div class="box note"><b>📝 Key idea</b> Namespaces = what you can see. cgroups = what you can use. A container is simply a process with both applied, plus a layered root filesystem.</div>

### Docker architecture

Docker is client-server. The `docker` CLI sends REST calls over a Unix socket (`/var/run/docker.sock`) to the **daemon** `dockerd`, which delegates to `containerd` (container lifecycle) and `runc` (the low-level tool that actually creates namespaces/cgroups and starts the process).

<div class="diagram">
<div class="diagram-label">flowchart — Docker architecture</div>
<div class="mermaid">
flowchart TD
    CLI["Docker CLI\ndocker build / run / push"] -->|"REST over unix socket"| DAEMON["Docker daemon dockerd"]
    DAEMON --> CTRD["containerd"]
    CTRD --> RUNC["runc"]
    RUNC --> PROC["Container process"]
    DAEMON --> IMAGES["Images"]
    DAEMON --> VOL["Volumes"]
    DAEMON --> NET["Networks"]
    DAEMON <-->|"push / pull"| REG["Registry\nDocker Hub / ECR / GHCR"]
</div>
</div>

<div class="tw"><table><thead><tr><th>Component</th><th>Role</th></tr></thead><tbody>
<tr><td><strong>Docker CLI</strong></td><td>User interface; translates commands into API calls</td></tr>
<tr><td><strong>dockerd</strong></td><td>Daemon: builds images, manages networks, volumes, talks to registries</td></tr>
<tr><td><strong>containerd</strong></td><td>Industry-standard runtime manager (also used by Kubernetes)</td></tr>
<tr><td><strong>runc</strong></td><td>OCI runtime: sets up namespaces, cgroups, execs the process</td></tr>
<tr><td><strong>Image</strong></td><td>Read-only template (layers + metadata)</td></tr>
<tr><td><strong>Container</strong></td><td>Running (or stopped) instance of an image plus a writable layer</td></tr>
<tr><td><strong>Registry</strong></td><td>Server storing images: Docker Hub, AWS ECR, GitHub GHCR, private Harbor</td></tr>
</tbody></table></div>

<div class="box warn"><b>⚠️ Docker socket = root</b> Anyone who can talk to <code>/var/run/docker.sock</code> can start a privileged container and own the host. Never mount the socket into untrusted containers and avoid adding users to the <code>docker</code> group on shared servers.</div>

### Images, layers and the union filesystem

An **image** is an ordered stack of **read-only layers** plus a JSON config (default command, env, ports). Each Dockerfile instruction that changes the filesystem (`RUN`, `COPY`, `ADD`) creates a layer, identified by a SHA-256 content hash. A **union filesystem** (overlay2 on modern Linux) merges the stack so the container sees one directory tree. When the container runs, Docker adds a thin **writable layer** on top using **copy-on-write**: reading a file comes from the lower layer, but modifying it first copies it up into the writable layer.

<div class="diagram">
<div class="diagram-label">flowchart — layered image plus writable container layer</div>
<div class="mermaid">
flowchart TB
    W["Container writable layer\n(copy on write, deleted with container)"]
    L4["Layer 4: COPY app.jar"]
    L3["Layer 3: RUN apk add curl"]
    L2["Layer 2: JRE from base image"]
    L1["Layer 1: Alpine base"]
    W --> L4 --> L3 --> L2 --> L1
</div>
</div>

<pre data-lang="bash"><code>$ docker pull eclipse-temurin:17-jre-alpine
17-jre-alpine: Pulling from library/eclipse-temurin
c926b61bad3b: Pull complete      # layer 1 - alpine
a5e5f1b2c3d4: Pull complete      # layer 2 - JRE
Status: Downloaded newer image for eclipse-temurin:17-jre-alpine

$ docker history myapp:1.0
IMAGE          CREATED BY                                      SIZE
3f1a2b4c5d6e   ENTRYPOINT ["java" "-jar" "app.jar"]            0B
9a8b7c6d5e4f   COPY /app/target/*.jar app.jar                  48MB
...            RUN addgroup -S appgroup &amp;&amp; adduser ...         4kB
...            /bin/sh -c #(nop) FROM eclipse-temurin          170MB</code></pre>

**Why layers matter**

- **Sharing** - ten images built on `alpine` store the base layers only once on disk and download them once.
- **Caching** - unchanged layers are reused during build (next section).
- **Deletion trap** - a file removed in a later layer is only *hidden*, the bytes still live in the earlier layer. Deleting a 500 MB archive in a separate `RUN rm` does not shrink the image; download, use and delete in the **same** `RUN`.

<div class="box tip"><b>✅ Image vs container</b> An image is a class, a container is an object. One image can start any number of containers; each gets its own writable layer. Changes inside a container never alter the image.</div>

### Build cache and context

When you run `docker build`, Docker sends the **build context** (the directory, minus `.dockerignore` entries) to the builder. For every instruction it computes a cache key (the instruction text plus, for `COPY`/`ADD`, a checksum of the files). If the key matches a cached layer it prints `CACHED`. **The first miss invalidates every later layer.** That is why you copy rarely-changing files first.

<div class="diagram">
<div class="diagram-label">flowchart — how the build cache decides</div>
<div class="mermaid">
flowchart TD
    A["Next instruction"] --> B{"Same instruction text\nand same input files?"}
    B -->|"yes"| C["Reuse cached layer"]
    B -->|"no"| D["Execute and create new layer"]
    D --> E["All following instructions\nmust rebuild too"]
    C --> F{"More instructions?"}
    E --> F
    F -->|"yes"| A
    F -->|"no"| G["Image ready"]
</div>
</div>

**Bad order** (every code change reinstalls all dependencies):

<pre data-lang="dockerfile"><code>COPY . .
RUN npm ci
CMD ["node", "server.js"]</code></pre>

**Good order** (dependencies reinstall only when `package*.json` changes):

<pre data-lang="dockerfile"><code>COPY package.json package-lock.json ./
RUN npm ci
COPY . .
CMD ["node", "server.js"]</code></pre>

Result with numbers: changing one line of source, bad order = 90 s rebuild; good order = 3 s (only the last `COPY` layer rebuilds).

<pre data-lang="bash"><code># .dockerignore - keeps the context small and avoids needless cache busts
node_modules
.git
*.log
target/
.env
Dockerfile
docker-compose*.yml

$ docker build -t myapp:1.0 .
 =&gt; [internal] load build context          0.3s
 =&gt; CACHED [2/5] WORKDIR /app
 =&gt; CACHED [3/5] COPY package*.json ./
 =&gt; CACHED [4/5] RUN npm ci
 =&gt; [5/5] COPY . .                         0.2s

$ docker build --no-cache -t myapp:1.0 .      # ignore the cache completely</code></pre>

<div class="box tip"><b>✅ BuildKit</b> Modern Docker uses BuildKit by default: parallel stages, <code>--mount=type=cache</code> for package-manager caches (<code>RUN --mount=type=cache,target=/root/.m2 mvn package</code>) and <code>--mount=type=secret</code> so credentials never land in a layer.</div>

### Dockerfile instructions - the full set

A Dockerfile is a text recipe, executed top to bottom.

<div class="tw"><table><thead><tr><th>Instruction</th><th>Purpose</th><th>Notes</th></tr></thead><tbody>
<tr><td><code>FROM</code></td><td>Base image; starts a build stage</td><td><code>FROM image:tag AS name</code>; pin tags, avoid <code>latest</code></td></tr>
<tr><td><code>WORKDIR</code></td><td>Set working dir for later instructions and runtime</td><td>Creates the dir if missing; prefer over <code>RUN cd</code></td></tr>
<tr><td><code>COPY</code></td><td>Copy files from context (or another stage) into image</td><td><code>--chown</code>, <code>--from=stage</code></td></tr>
<tr><td><code>ADD</code></td><td>Like COPY plus URL download and tar auto-extract</td><td>Use only for auto-extract</td></tr>
<tr><td><code>RUN</code></td><td>Execute a command at build time, commit a layer</td><td>Chain with <code>&amp;&amp;</code> to cut layers</td></tr>
<tr><td><code>ARG</code></td><td>Build-time variable</td><td>Not present at runtime</td></tr>
<tr><td><code>ENV</code></td><td>Environment variable, persists into containers</td><td>Visible in <code>docker inspect</code></td></tr>
<tr><td><code>EXPOSE</code></td><td>Documents the listening port</td><td>Does NOT publish the port</td></tr>
<tr><td><code>VOLUME</code></td><td>Declares a mount point (anonymous volume)</td><td>Prefer explicit <code>-v</code> at run</td></tr>
<tr><td><code>USER</code></td><td>Switch user for later steps and runtime</td><td>Always end as non-root</td></tr>
<tr><td><code>CMD</code></td><td>Default command/arguments</td><td>Overridden by args to <code>docker run</code></td></tr>
<tr><td><code>ENTRYPOINT</code></td><td>The executable that always runs</td><td>Overridden only by <code>--entrypoint</code></td></tr>
<tr><td><code>HEALTHCHECK</code></td><td>Command to test container health</td><td>Drives <code>healthy/unhealthy</code> status</td></tr>
<tr><td><code>LABEL</code></td><td>Key/value metadata</td><td>Maintainer, version, git SHA</td></tr>
<tr><td><code>STOPSIGNAL</code></td><td>Signal sent by <code>docker stop</code></td><td>Default SIGTERM</td></tr>
<tr><td><code>SHELL</code></td><td>Change shell used by shell-form instructions</td><td>Rare; Windows containers</td></tr>
<tr><td><code>ONBUILD</code></td><td>Trigger run when this image is used as a base</td><td>Rare; avoid</td></tr>
</tbody></table></div>

A complete annotated Dockerfile for a Python API:

<pre data-lang="dockerfile"><code># syntax=docker/dockerfile:1
ARG PYTHON_VERSION=3.12
FROM python:${PYTHON_VERSION}-slim AS base

LABEL org.opencontainers.image.source="https://github.com/acme/orders-api"

ENV PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    APP_HOME=/app

WORKDIR ${APP_HOME}

# 1. dependencies (cached until requirements.txt changes)
COPY requirements.txt .
RUN pip install -r requirements.txt

# 2. application code (changes often, so last)
COPY --chown=10001:10001 . .

RUN useradd --uid 10001 --no-create-home appuser
USER 10001

EXPOSE 8000
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD python -c "import urllib.request,sys; sys.exit(0 if urllib.request.urlopen('http://localhost:8000/health').status==200 else 1)"

ENTRYPOINT ["gunicorn"]
CMD ["-b", "0.0.0.0:8000", "app:app"]</code></pre>

<div class="box note"><b>📝 Shell form vs exec form</b> <code>CMD python app.py</code> (shell form) runs via <code>/bin/sh -c</code>, so the shell is PID 1 and may swallow SIGTERM. <code>CMD ["python","app.py"]</code> (exec form, JSON array) makes your program PID 1 and receives signals correctly. Prefer exec form for <code>CMD</code> and <code>ENTRYPOINT</code>.</div>

### CMD vs ENTRYPOINT, COPY vs ADD, ARG vs ENV

#### CMD vs ENTRYPOINT

- **ENTRYPOINT** = the program the container *is*. Arguments you give to `docker run image args` are appended to it.
- **CMD** = default arguments (or default command if no ENTRYPOINT). Anything after the image name in `docker run` **replaces** CMD.
- Together: ENTRYPOINT is the fixed executable, CMD supplies overridable default arguments.

<div class="tw"><table><thead><tr><th>Dockerfile</th><th><code>docker run img</code></th><th><code>docker run img foo</code></th></tr></thead><tbody>
<tr><td><code>CMD ["ping","localhost"]</code></td><td>ping localhost</td><td>runs <code>foo</code> (CMD replaced)</td></tr>
<tr><td><code>ENTRYPOINT ["ping"]</code></td><td>ping (no host, error)</td><td>ping foo</td></tr>
<tr><td><code>ENTRYPOINT ["ping"]</code> + <code>CMD ["localhost"]</code></td><td>ping localhost</td><td>ping foo</td></tr>
</tbody></table></div>

<pre data-lang="bash"><code>$ docker run pinger -c 1 8.8.8.8          # ENTRYPOINT ping + args
64 bytes from 8.8.8.8: icmp_seq=1 ttl=117 time=12.4 ms

$ docker run --entrypoint sh -it pinger    # only way to replace ENTRYPOINT</code></pre>

#### COPY vs ADD

- `COPY src dest` just copies. Predictable. Use it by default.
- `ADD` also (a) auto-extracts local tar archives and (b) can fetch a URL. The URL form is discouraged (no cache control, no checksum); use `RUN curl -fsSL ... | tar -xz` or `ADD --checksum=`.

<pre data-lang="dockerfile"><code>COPY app.jar /app/app.jar        # plain copy
ADD rootfs.tar.gz /              # extracts into /  (the legit use of ADD)</code></pre>

#### ARG vs ENV

<div class="tw"><table><thead><tr><th></th><th>ARG</th><th>ENV</th></tr></thead><tbody>
<tr><td>Available during build</td><td>Yes (after its declaration)</td><td>Yes</td></tr>
<tr><td>Available in running container</td><td>No</td><td>Yes</td></tr>
<tr><td>Set from CLI</td><td><code>docker build --build-arg VER=2</code></td><td><code>docker run -e KEY=val</code></td></tr>
<tr><td>Typical use</td><td>Base image version, build flags</td><td>Runtime config, PATH, JAVA_OPTS</td></tr>
<tr><td>Stored in image history</td><td>Yes (visible in <code>docker history</code>)</td><td>Yes (in config)</td></tr>
</tbody></table></div>

<pre data-lang="dockerfile"><code>ARG NODE_VERSION=20
FROM node:${NODE_VERSION}-alpine       # ARG before FROM is usable only in FROM
ARG BUILD_DATE                         # re-declare after FROM to use inside the stage
ENV NODE_ENV=production
RUN echo "built $BUILD_DATE with node $(node -v)"</code></pre>

<div class="box warn"><b>⚠️ Never put secrets in ARG or ENV</b> Both are recoverable with <code>docker history</code> or <code>docker inspect</code>. Use BuildKit <code>--mount=type=secret</code> at build and runtime secrets (Docker/Kubernetes secrets, Vault, AWS Secrets Manager) at run.</div>

### Multi-stage builds

Compilers, JDKs and test tools are needed to *build* but not to *run*. A multi-stage build uses several `FROM` stages; only the last stage becomes the image, and it pulls just the artefacts it needs with `COPY --from=`.

<div class="diagram">
<div class="diagram-label">flowchart — multi-stage build</div>
<div class="mermaid">
flowchart LR
    S1["Stage 1 builder\nMaven + JDK\ncopy pom, deps, src, package"] -->|"COPY --from=builder jar"| S2["Stage 2 runtime\nJRE alpine\nnon-root user + HEALTHCHECK"]
    S2 --> OUT["Small final image"]
    S1 -.->|"discarded"| TRASH["Build tools thrown away"]
</div>
</div>

<pre data-lang="dockerfile"><code># ---------- Stage 1: build ----------
FROM maven:3.9-eclipse-temurin-17 AS builder
WORKDIR /app
COPY pom.xml .
RUN mvn -q dependency:go-offline          # cached while pom.xml unchanged
COPY src ./src
RUN mvn -q package -DskipTests

# ---------- Stage 2: runtime ----------
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
RUN addgroup -S app &amp;&amp; adduser -S app -G app
USER app
COPY --from=builder /app/target/*.jar app.jar
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -qO- http://localhost:8080/actuator/health || exit 1
ENTRYPOINT ["java","-XX:MaxRAMPercentage=75","-jar","app.jar"]</code></pre>

<div class="tw"><table><thead><tr><th>Image</th><th>Size</th></tr></thead><tbody>
<tr><td>Single stage (Maven + JDK + sources + jar)</td><td>~ 780 MB</td></tr>
<tr><td>Multi-stage (JRE alpine + jar)</td><td>~ 190 MB</td></tr>
<tr><td>Distroless / jlink minimal runtime</td><td>~ 100 MB</td></tr>
</tbody></table></div>

Useful tricks: `docker build --target builder .` stops at a named stage (run tests there); stages can run in parallel under BuildKit; a `scratch` final stage works for static Go binaries (image of just a few MB).

### Container lifecycle and states

A container moves between well-defined states. `docker create` makes it, `start` runs it, `pause` freezes it via the cgroup freezer, `stop` sends SIGTERM then (after 10 s) SIGKILL.

<div class="diagram">
<div class="diagram-label">state diagram — container lifecycle</div>
<div class="mermaid">
stateDiagram-v2
    state "Created" as created
    state "Running" as running
    state "Paused" as paused
    state "Exited" as exited
    state "Restarting" as restarting
    state "Removed" as removed
    [*] --> created: docker create
    created --> running: docker start
    [*] --> running: docker run
    running --> paused: docker pause
    paused --> running: docker unpause
    running --> exited: docker stop or process ends
    running --> exited: docker kill
    exited --> running: docker start
    exited --> restarting: restart policy
    restarting --> running: back up
    exited --> removed: docker rm
    created --> removed: docker rm
    removed --> [*]
</div>
</div>

<div class="diagram">
<div class="diagram-label">sequenceDiagram — what docker stop does</div>
<div class="mermaid">
sequenceDiagram
    participant U as "User"
    participant D as "dockerd"
    participant P as "PID 1 in container"
    U->>D: docker stop web
    D->>P: SIGTERM
    Note over P: graceful shutdown, finish requests
    alt exits within 10 seconds
        P-->>D: exit code 0
    else still running
        D->>P: SIGKILL
        P-->>D: exit code 137
    end
    D-->>U: web
</div>
</div>

<div class="tw"><table><thead><tr><th>Exit code</th><th>Meaning</th></tr></thead><tbody>
<tr><td>0</td><td>Clean exit</td></tr>
<tr><td>1</td><td>Application error</td></tr>
<tr><td>125 / 126 / 127</td><td>Docker failed / command not executable / command not found</td></tr>
<tr><td>137</td><td>SIGKILL (128+9): <code>docker kill</code>, stop timeout or OOM kill</td></tr>
<tr><td>143</td><td>SIGTERM (128+15): graceful stop</td></tr>
</tbody></table></div>

{% raw %}
<pre data-lang="bash"><code>$ docker create --name web nginx:alpine
$ docker ps -a --filter name=web --format 'table {{.Names}}\t{{.Status}}'
NAMES   STATUS
web     Created
$ docker start web  &amp;&amp; docker pause web
$ docker ps --format '{{.Names}}: {{.Status}}'
web: Up 3 seconds (Paused)</code></pre>
{% endraw %}

<div class="box tip"><b>✅ PID 1 matters</b> If your app does not handle SIGTERM (many shell scripts and Node apps do not by default), <code>docker stop</code> waits the full 10 s and then kills it. Use exec form, <code>exec "$@"</code> at the end of entrypoint scripts, or <code>docker run --init</code> (tini) so signals and zombie reaping work.</div>

### docker run flags you will use daily

<div class="tw"><table><thead><tr><th>Flag</th><th>Meaning</th><th>Example</th></tr></thead><tbody>
<tr><td><code>-d</code></td><td>Detached (background)</td><td><code>docker run -d nginx</code></td></tr>
<tr><td><code>-it</code></td><td>Interactive + TTY</td><td><code>docker run -it ubuntu bash</code></td></tr>
<tr><td><code>--rm</code></td><td>Remove container on exit</td><td>throwaway tasks</td></tr>
<tr><td><code>--name</code></td><td>Give a readable name</td><td><code>--name web</code></td></tr>
<tr><td><code>-p host:cont</code></td><td>Publish a port</td><td><code>-p 8080:80</code></td></tr>
<tr><td><code>-P</code></td><td>Publish all EXPOSEd ports to random host ports</td><td></td></tr>
<tr><td><code>-e KEY=val</code> / <code>--env-file</code></td><td>Set environment variables</td><td><code>--env-file .env</code></td></tr>
<tr><td><code>-v</code> / <code>--mount</code></td><td>Mount volume or host dir</td><td><code>-v pgdata:/var/lib/postgresql/data</code></td></tr>
<tr><td><code>--network</code></td><td>Attach to a network</td><td><code>--network backend</code></td></tr>
<tr><td><code>--restart</code></td><td>Restart policy: no, on-failure[:N], always, unless-stopped</td><td><code>--restart unless-stopped</code></td></tr>
<tr><td><code>--memory</code>, <code>--cpus</code></td><td>Resource limits</td><td><code>--memory 512m --cpus 1.5</code></td></tr>
<tr><td><code>-u</code></td><td>Run as user</td><td><code>-u 1000:1000</code></td></tr>
<tr><td><code>--read-only</code></td><td>Read-only root filesystem</td><td>hardening</td></tr>
<tr><td><code>-w</code></td><td>Working directory</td><td><code>-w /app</code></td></tr>
<tr><td><code>--entrypoint</code></td><td>Override ENTRYPOINT</td><td><code>--entrypoint sh</code></td></tr>
<tr><td><code>--init</code></td><td>Tiny init as PID 1</td><td>signal handling</td></tr>
</tbody></table></div>

<pre data-lang="bash"><code>$ docker run -d --name api -p 8080:8080 \
    -e SPRING_PROFILES_ACTIVE=prod --env-file .env \
    --memory 512m --cpus 1 --restart unless-stopped \
    --network backend myrepo/orders-api:1.4.2
4b2f9c1e7a...
$ docker ps
CONTAINER ID  IMAGE                    STATUS         PORTS                   NAMES
4b2f9c1e7a1d  myrepo/orders-api:1.4.2  Up 5 seconds   0.0.0.0:8080-&gt;8080/tcp  api

$ docker exec -it api sh          # shell inside the running container
$ docker logs -f --tail 50 api    # follow last 50 log lines
$ docker run --rm alpine echo hello
hello</code></pre>

### Storage: volumes, bind mounts, tmpfs

A container's writable layer disappears with the container and is slower than a real filesystem. Anything you need to keep (databases, uploads) must live in a mount.

<div class="diagram">
<div class="diagram-label">flowchart — storage options</div>
<div class="mermaid">
flowchart LR
    C["Container"] --> V["Named volume\nmanaged by Docker\n/var/lib/docker/volumes"]
    C --> B["Bind mount\nany host path"]
    C --> T["tmpfs\nhost RAM only"]
    V --> HD["Host disk"]
    B --> HD
    T --> RAM["Memory, gone on stop"]
</div>
</div>

<div class="tw"><table><thead><tr><th></th><th>Named volume</th><th>Bind mount</th><th>tmpfs</th></tr></thead><tbody>
<tr><td><strong>Location</strong></td><td>Docker area on host</td><td>Any host path you choose</td><td>Host memory</td></tr>
<tr><td><strong>Managed by</strong></td><td>Docker (<code>docker volume</code>)</td><td>You</td><td>Kernel</td></tr>
<tr><td><strong>Survives container removal</strong></td><td>Yes</td><td>Yes (it is your folder)</td><td>No</td></tr>
<tr><td><strong>Portable</strong></td><td>Yes</td><td>No, depends on host layout</td><td>n/a</td></tr>
<tr><td><strong>Pre-populated from image</strong></td><td>Yes (first use)</td><td>No, host dir hides image content</td><td>No</td></tr>
<tr><td><strong>Use case</strong></td><td>Databases, production data</td><td>Dev live-reload, config files</td><td>Secrets, scratch, caches</td></tr>
</tbody></table></div>

<pre data-lang="bash"><code># Named volume - database survives container deletion
$ docker volume create pgdata
$ docker run -d --name db -v pgdata:/var/lib/postgresql/data -e POSTGRES_PASSWORD=dev postgres:16-alpine
$ docker exec db psql -U postgres -c "create table t(id int); insert into t values (1);"
$ docker rm -f db
$ docker run -d --name db2 -v pgdata:/var/lib/postgresql/data -e POSTGRES_PASSWORD=dev postgres:16-alpine
$ docker exec db2 psql -U postgres -c "select * from t;"
 id
----
  1                      # data survived

# Bind mount - edit code on host, container sees it instantly
$ docker run --rm -v "$(pwd)":/app -w /app node:20-alpine node index.js

# Read-only bind and tmpfs
$ docker run -d -v "$(pwd)/conf":/etc/app:ro --tmpfs /tmp:rw,size=64m myapp

# Back up a volume
$ docker run --rm -v pgdata:/data -v "$(pwd)":/backup alpine tar czf /backup/pgdata.tgz -C /data .</code></pre>

<div class="box tip"><b>✅ Prefer --mount in scripts</b> <code>--mount type=bind,src=/x,dst=/y</code> is explicit and errors if the host path is missing, whereas <code>-v /x:/y</code> silently creates an empty directory and hides typos.</div>

### Networking drivers and port mapping

Each container gets its own network namespace. Docker connects it to a **network** using a driver.

<div class="tw"><table><thead><tr><th>Driver</th><th>Description</th><th>Use case</th></tr></thead><tbody>
<tr><td><strong>bridge</strong></td><td>Default. Private virtual switch (<code>docker0</code>) with NAT to the outside. User-defined bridges add DNS by container name</td><td>Single-host multi-container apps, Compose</td></tr>
<tr><td><strong>host</strong></td><td>Shares the host network stack, no isolation, no port mapping needed</td><td>Max network performance, monitoring agents</td></tr>
<tr><td><strong>none</strong></td><td>Only loopback</td><td>Fully isolated batch jobs</td></tr>
<tr><td><strong>overlay</strong></td><td>Multi-host network spanning daemons (Swarm / VXLAN)</td><td>Distributed clusters</td></tr>
<tr><td><strong>macvlan</strong></td><td>Container gets its own MAC and LAN IP</td><td>Legacy apps that must appear as physical hosts</td></tr>
</tbody></table></div>

<div class="diagram">
<div class="diagram-label">flowchart — bridge network and port mapping</div>
<div class="mermaid">
flowchart LR
    CLIENT["Browser\nhost:8080"] -->|"published port 8080"| HOST["Host NAT\niptables DNAT"]
    HOST -->|"to 172.18.0.2:80"| WEB["web container\nnginx :80"]
    WEB -->|"api:5000 by name"| API["api container\n:5000"]
    API -->|"db:5432 by name"| DB["db container\n:5432"]
    DB -.->|"not published"| NOPE["unreachable from outside"]
</div>
</div>

**Port mapping** `-p HOST:CONTAINER` creates a NAT rule from a host port to the container port. `EXPOSE` in a Dockerfile only documents. Bind to loopback for local-only access: `-p 127.0.0.1:5432:5432`.

**Name resolution:** on a *user-defined* bridge, Docker's embedded DNS (127.0.0.11) resolves container and service names. The default `bridge` network has no name DNS (legacy `--link` only).

{% raw %}
<pre data-lang="bash"><code>$ docker network create backend
$ docker run -d --name db  --network backend postgres:16-alpine
$ docker run -d --name api --network backend -p 8080:8080 myapi
$ docker exec api getent hosts db
172.18.0.2   db                      # resolved by name

$ docker network ls
NETWORK ID   NAME      DRIVER   SCOPE
a1b2c3d4e5f6 backend   bridge   local
$ docker network inspect backend --format '{{range .Containers}}{{.Name}} {{.IPv4Address}}{{"\n"}}{{end}}'
db  172.18.0.2/16
api 172.18.0.3/16</code></pre>
{% endraw %}

<div class="box warn"><b>⚠️ localhost inside a container is the container</b> Pointing an app at <code>localhost:5432</code> will not reach a database in another container. Use the service name (<code>db:5432</code>). To reach a service on the host from Docker Desktop use <code>host.docker.internal</code>.</div>

### Docker Compose

Compose describes a multi-container application in one YAML file (`compose.yaml` or `docker-compose.yml`) and manages it as a unit. It creates a project network automatically so services reach each other by service name.

<pre data-lang="yaml"><code># compose.yaml - API + Postgres + Redis
services:
  app:
    build:
      context: .
      target: runtime
    image: myrepo/orders-api:dev
    ports:
      - "8080:8080"
    environment:
      DB_URL: jdbc:postgresql://db:5432/orders
      DB_USER: admin
      DB_PASS: ${DB_PASSWORD}          # read from .env next to this file
      REDIS_HOST: redis
    depends_on:
      db:
        condition: service_healthy     # wait until db healthcheck passes
      redis:
        condition: service_started
    restart: unless-stopped
    networks: [backend]

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: orders
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - pg_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U admin -d orders"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks: [backend]

  redis:
    image: redis:7-alpine
    command: ["redis-server", "--maxmemory", "128mb"]
    networks: [backend]

volumes:
  pg_data:

networks:
  backend:
    driver: bridge</code></pre>

<div class="diagram">
<div class="diagram-label">sequenceDiagram — docker compose up</div>
<div class="mermaid">
sequenceDiagram
    participant U as "User"
    participant C as "Compose CLI"
    participant D as "dockerd"
    U->>C: docker compose up -d
    C->>D: create network and volumes
    C->>D: build or pull images
    C->>D: start db and redis
    D-->>C: db healthcheck passing
    C->>D: start app after db healthy
    D-->>C: all services running
    C-->>U: containers started
</div>
</div>

<div class="tw"><table><thead><tr><th>Command</th><th>Description</th></tr></thead><tbody>
<tr><td><code>docker compose up -d</code></td><td>Create and start all services in background</td></tr>
<tr><td><code>docker compose up -d --build</code></td><td>Rebuild images first</td></tr>
<tr><td><code>docker compose ps</code></td><td>Status of services</td></tr>
<tr><td><code>docker compose logs -f app</code></td><td>Follow one service log</td></tr>
<tr><td><code>docker compose exec app sh</code></td><td>Shell into running service</td></tr>
<tr><td><code>docker compose run --rm app pytest</code></td><td>One-off command in a new container</td></tr>
<tr><td><code>docker compose up -d --scale app=3</code></td><td>Run 3 replicas (do not publish a fixed host port)</td></tr>
<tr><td><code>docker compose down</code></td><td>Stop and remove containers and networks (volumes kept)</td></tr>
<tr><td><code>docker compose down -v</code></td><td>Also delete named volumes (data loss)</td></tr>
<tr><td><code>docker compose config</code></td><td>Validate and print the merged file</td></tr>
</tbody></table></div>

<div class="box info"><b>ℹ️ depends_on is about start order, not readiness</b> Plain <code>depends_on</code> only waits for the container to start. Add a <code>healthcheck</code> and <code>condition: service_healthy</code> so the app starts only when the database accepts connections. Override files (<code>compose.override.yaml</code>, <code>-f compose.prod.yaml</code>) and <code>profiles</code> let one file serve dev, test and prod.</div>

### Registries, tagging and pushing images

A **registry** stores and distributes images. An image reference is `[registry/][namespace/]repository[:tag][@digest]`, for example `123456789012.dkr.ecr.ap-south-1.amazonaws.com/orders-api:1.4.2`. Without a registry host Docker assumes Docker Hub.

<div class="diagram">
<div class="diagram-label">flowchart — build, tag, push, pull</div>
<div class="mermaid">
flowchart LR
    B["docker build -t orders-api:1.4.2 ."] --> T["docker tag to registry/repo:1.4.2"]
    T --> L["docker login"]
    L --> P["docker push"]
    P --> R["Registry"]
    R -->|"docker pull"| S["Server / Kubernetes node"]
</div>
</div>

<pre data-lang="bash"><code>$ docker build -t orders-api:1.4.2 .
$ docker tag orders-api:1.4.2 myrepo/orders-api:1.4.2
$ docker tag orders-api:1.4.2 myrepo/orders-api:latest
$ docker login
$ docker push myrepo/orders-api:1.4.2
1.4.2: digest: sha256:9f2c...e41a size: 1573

# AWS ECR
$ aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin 123456789012.dkr.ecr.ap-south-1.amazonaws.com

# Pull by immutable digest (cannot change underneath you)
$ docker pull myrepo/orders-api@sha256:9f2c...e41a</code></pre>

**Tagging strategy**

- Tags are **mutable pointers**; `latest` is just a tag name with no special meaning, and it does not mean newest.
- Tag releases with semantic version **and** git SHA: `1.4.2`, `1.4`, `git-3fa91c2`.
- Production should deploy a specific version or digest, never `latest`.
- Multi-arch: `docker buildx build --platform linux/amd64,linux/arm64 -t myrepo/app:1.4.2 --push .`

### Healthchecks

A container being "Up" only means PID 1 is alive, not that the app serves requests. `HEALTHCHECK` runs a command periodically; exit 0 = healthy, 1 = unhealthy. Status moves **starting, healthy, unhealthy**.

<div class="diagram">
<div class="diagram-label">state diagram — health status</div>
<div class="mermaid">
stateDiagram-v2
    state "starting" as st
    state "healthy" as hl
    state "unhealthy" as un
    [*] --> st
    st --> hl: check passes
    st --> un: retries exhausted after start period
    hl --> un: consecutive failures reach retries
    un --> hl: check passes again
</div>
</div>

<pre data-lang="dockerfile"><code>HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD curl -fsS http://localhost:8080/actuator/health || exit 1</code></pre>

{% raw %}
<pre data-lang="bash"><code>$ docker ps
CONTAINER ID   IMAGE    STATUS                    NAMES
7c1d...        api      Up 2 minutes (healthy)    api
$ docker inspect --format '{{json .State.Health}}' api | head -c 200
{"Status":"healthy","FailingStreak":0,"Log":[{"ExitCode":0,"Output":"{\"status\":\"UP\"}"...</code></pre>
{% endraw %}

<div class="box note"><b>📝 Who acts on it?</b> Plain Docker only <em>reports</em> unhealthy; it does not restart the container. Compose <code>depends_on: condition: service_healthy</code>, Swarm and ECS use it for ordering and replacement. Kubernetes ignores HEALTHCHECK and uses its own liveness/readiness probes. The image must contain the tool (curl/wget) the check calls.</div>

### Resource limits

Without limits one runaway container can starve the host. Limits map to cgroups.

{% raw %}
<pre data-lang="bash"><code>$ docker run -d --name worker \
    --memory 512m --memory-swap 512m \
    --cpus 1.5 --pids-limit 200 \
    --ulimit nofile=4096:4096 \
    myworker
$ docker stats --no-stream
NAME     CPU %   MEM USAGE / LIMIT    MEM %   PIDS
worker   42.10%  310MiB / 512MiB      60.55%  34

$ docker update --memory 1g --cpus 2 worker     # change a running container
# Container that exceeded its memory limit:
$ docker inspect -f '{{.State.OOMKilled}} {{.State.ExitCode}}' worker
true 137</code></pre>
{% endraw %}

<div class="tw"><table><thead><tr><th>Flag</th><th>Effect</th></tr></thead><tbody>
<tr><td><code>--memory</code></td><td>Hard limit; exceeding it triggers OOM kill (exit 137)</td></tr>
<tr><td><code>--memory-swap</code></td><td>Memory plus swap; equal to memory means no swap</td></tr>
<tr><td><code>--cpus</code></td><td>Number of CPUs worth of time (fractions allowed)</td></tr>
<tr><td><code>--cpu-shares</code></td><td>Relative weight only under contention</td></tr>
<tr><td><code>--pids-limit</code></td><td>Stops fork bombs</td></tr>
<tr><td><code>--restart on-failure:5</code></td><td>Cap crash loops</td></tr>
</tbody></table></div>

<div class="box warn"><b>⚠️ JVM and containers</b> Modern JVMs (10+) read the cgroup limit, but set <code>-XX:MaxRAMPercentage=75</code> so heap plus metaspace and threads fit inside the limit; otherwise the container is OOM-killed even though heap looks fine.</div>

### Security best practices

<div class="diagram">
<div class="diagram-label">flowchart — defence in depth for containers</div>
<div class="mermaid">
flowchart TD
    A["Trusted minimal base image"] --> B["Scan for CVEs\ntrivy / docker scout"]
    B --> C["Run as non-root user"]
    C --> D["Drop capabilities\nread-only root fs"]
    D --> E["No secrets in image or env"]
    E --> F["Limit resources and network"]
    F --> G["Sign images and pin digests"]
</div>
</div>

<div class="tw"><table><thead><tr><th>Practice</th><th>How</th></tr></thead><tbody>
<tr><td>Non-root</td><td><code>USER 10001</code> in Dockerfile, <code>-u 1000</code> at run</td></tr>
<tr><td>Minimal images</td><td>alpine, slim, distroless, scratch: fewer packages = fewer CVEs</td></tr>
<tr><td>Scan images</td><td><code>trivy image myapp:1.0</code>, <code>docker scout cves myapp:1.0</code> in CI</td></tr>
<tr><td>Drop capabilities</td><td><code>--cap-drop ALL --cap-add NET_BIND_SERVICE</code></td></tr>
<tr><td>Read-only filesystem</td><td><code>--read-only --tmpfs /tmp</code></td></tr>
<tr><td>No privilege escalation</td><td><code>--security-opt no-new-privileges</code></td></tr>
<tr><td>Avoid <code>--privileged</code></td><td>Gives nearly full host access</td></tr>
<tr><td>Secrets</td><td>Runtime secrets or secret managers, never baked into layers or committed <code>.env</code></td></tr>
<tr><td>Pin versions</td><td><code>FROM node:20.11-alpine3.19</code> or digest</td></tr>
<tr><td>Rootless Docker / user namespaces</td><td>Root in container maps to unprivileged host user</td></tr>
<tr><td>Update regularly</td><td>Rebuild images to pick up base-image patches</td></tr>
</tbody></table></div>

<pre data-lang="bash"><code>$ docker run -d --read-only --tmpfs /tmp \
    --cap-drop ALL --security-opt no-new-privileges \
    -u 10001 --memory 256m --pids-limit 100 myapp:1.0
$ trivy image --severity HIGH,CRITICAL myapp:1.0
Total: 2 (HIGH: 2, CRITICAL: 0)</code></pre>

### Logging

Docker captures the container's **stdout and stderr** and stores them via a logging driver. Therefore log to the console, not to files inside the container.

<pre data-lang="bash"><code>$ docker logs api                     # all logs
$ docker logs -f --tail 100 api       # follow last 100 lines
$ docker logs --since 10m -t api      # last 10 minutes with timestamps

# Prevent disks filling up: rotate json-file logs
$ docker run -d --log-driver json-file --log-opt max-size=10m --log-opt max-file=3 myapp

# /etc/docker/daemon.json - default for every container
{
  "log-driver": "json-file",
  "log-opts": { "max-size": "10m", "max-file": "3" }
}</code></pre>

<div class="tw"><table><thead><tr><th>Driver</th><th>Where logs go</th></tr></thead><tbody>
<tr><td><code>json-file</code> (default)</td><td>JSON files on host; no rotation by default (set max-size)</td></tr>
<tr><td><code>local</code></td><td>Compact rotated files</td></tr>
<tr><td><code>syslog</code>, <code>journald</code></td><td>Host logging system</td></tr>
<tr><td><code>awslogs</code></td><td>CloudWatch Logs</td></tr>
<tr><td><code>fluentd</code>, <code>gelf</code>, <code>splunk</code></td><td>Central log platforms</td></tr>
</tbody></table></div>

<div class="box warn"><b>⚠️ Unrotated json-file logs fill the disk</b> A chatty container with default settings can consume tens of GB in <code>/var/lib/docker/containers</code>. Always set <code>max-size</code> and <code>max-file</code>.</div>

### Debugging and troubleshooting

<div class="diagram">
<div class="diagram-label">flowchart — container will not run, how to investigate</div>
<div class="mermaid">
flowchart TD
    A["Problem"] --> B["docker ps -a\nstatus and exit code"]
    B --> C["docker logs name"]
    C --> D{"Cause found?"}
    D -->|"no"| E["docker inspect name\nconfig, mounts, networks, health"]
    E --> F["docker run --rm -it --entrypoint sh image\nreproduce interactively"]
    D -->|"yes"| G["Fix Dockerfile or config and rebuild"]
    F --> G
</div>
</div>

<div class="tw"><table><thead><tr><th>Symptom</th><th>Likely cause</th><th>Fix / command</th></tr></thead><tbody>
<tr><td>Exits immediately (Exited 0)</td><td>Foreground process ended (e.g. <code>CMD service start</code>)</td><td>Run app in foreground; check <code>docker logs</code></td></tr>
<tr><td>Exited (137)</td><td>OOM kill or <code>docker kill</code></td><td><code>docker inspect -f '{% raw %}{{.State.OOMKilled}}{% endraw %}'</code>; raise memory</td></tr>
<tr><td>Exited (1) at startup</td><td>App error / bad config</td><td><code>docker logs</code>, check env vars</td></tr>
<tr><td>Exit 127 "not found"</td><td>Binary missing or wrong path/shell (alpine has no bash)</td><td>Use <code>sh</code>; install package</td></tr>
<tr><td>"exec format error"</td><td>Wrong CPU arch (arm image on amd64) or CRLF in script</td><td><code>--platform</code>; convert line endings</td></tr>
<tr><td>Port already allocated</td><td>Host port in use</td><td><code>docker ps</code>; change <code>-p</code> mapping</td></tr>
<tr><td>Cannot connect to other container</td><td>Different networks, using localhost</td><td>Same user-defined network, use service name</td></tr>
<tr><td>Connection refused from host</td><td>App bound to 127.0.0.1 inside container</td><td>Bind <code>0.0.0.0</code>; publish port</td></tr>
<tr><td>Permission denied on bind mount</td><td>UID mismatch</td><td><code>-u $(id -u)</code> or fix ownership</td></tr>
<tr><td>Data vanished</td><td>No volume; used <code>down -v</code></td><td>Mount named volume</td></tr>
<tr><td>Build always slow</td><td>Cache busted by early <code>COPY . .</code></td><td>Reorder; add <code>.dockerignore</code></td></tr>
<tr><td>Image huge</td><td>Build tools and caches in final image</td><td>Multi-stage, slim base, clean in same RUN</td></tr>
<tr><td>No space left on device</td><td>Old images, layers, logs</td><td><code>docker system df</code>; <code>docker system prune</code></td></tr>
<tr><td>Pull "denied" / "unauthorized"</td><td>Not logged in or wrong repo name</td><td><code>docker login</code>; check tag</td></tr>
</tbody></table></div>

{% raw %}
<pre data-lang="bash"><code>$ docker ps -a
CONTAINER ID  IMAGE  STATUS                    NAMES
e5a1...       api    Exited (1) 3 seconds ago  api
$ docker logs api
Error: connect ECONNREFUSED 127.0.0.1:5432    # app used localhost for the DB
$ docker inspect -f '{{.NetworkSettings.Networks}}' api
$ docker exec -it api sh                       # inside a running container
$ docker run --rm -it --entrypoint sh myapi:1.0 # when it crashes at start
$ docker events --since 10m                    # daemon-level events
$ docker top api ; docker diff api ; docker cp api:/app/app.log .</code></pre>
{% endraw %}

### Cleaning up disk space

<pre data-lang="bash"><code>$ docker system df
TYPE            TOTAL   ACTIVE   SIZE      RECLAIMABLE
Images          48      6        14.2GB    11.8GB (83%)
Containers      12      3        1.1GB     900MB (81%)
Local Volumes   9       2        3.4GB     2.9GB (85%)
Build Cache     210     0        6.0GB     6.0GB

$ docker container prune            # remove stopped containers
$ docker image prune                # remove dangling (untagged) images
$ docker image prune -a             # remove all images not used by a container
$ docker volume prune               # remove unused volumes (DATA LOSS risk)
$ docker network prune
$ docker builder prune              # build cache
$ docker system prune -a --volumes  # everything unused
$ docker image prune -a --filter "until=720h"   # older than 30 days</code></pre>

<div class="box warn"><b>⚠️ Volumes hold real data</b> <code>docker volume prune</code> and <code>system prune --volumes</code> delete any volume not attached to a container, including a database volume whose container is currently stopped. Check <code>docker volume ls</code> first.</div>

### Essential command cheat sheet

<pre data-lang="bash"><code># Images
docker build -t myapp:1.0 .            # build
docker images                          # list
docker pull nginx:alpine               # download
docker push myrepo/myapp:1.0           # upload
docker rmi myapp:1.0                   # delete image
docker save -o app.tar myapp:1.0       # export to file (docker load -i to import)

# Containers
docker run -d -p 8080:80 --name web nginx
docker ps / docker ps -a
docker stop web &amp;&amp; docker rm web
docker restart web
docker exec -it web sh
docker logs -f web
docker inspect web
docker cp web:/etc/nginx/nginx.conf .
docker commit web myorg/web:snapshot   # image from container (avoid: not reproducible)

# Volumes and networks
docker volume create mydata ; docker volume ls ; docker volume rm mydata
docker network create backend ; docker network ls</code></pre>

### Interview quick answers

<div class="g2">
<div class="card"><h4>Image vs container?</h4><p>An image is a read-only, layered template. A container is a running instance of it with an added writable layer and isolated namespaces.</p></div>
<div class="card"><h4>Container vs VM?</h4><p>Containers share the host kernel and isolate at process level (fast, small). VMs run a full guest OS on a hypervisor (stronger isolation, heavier).</p></div>
<div class="card"><h4>How does Docker isolate?</h4><p>Linux namespaces (pid, net, mnt, uts, ipc, user) limit visibility; cgroups limit resources; layered filesystem gives each its own root.</p></div>
<div class="card"><h4>CMD vs ENTRYPOINT?</h4><p>ENTRYPOINT is the fixed executable; CMD is default, overridable arguments. Combine them: ENTRYPOINT for the program, CMD for default flags.</p></div>
<div class="card"><h4>COPY vs ADD?</h4><p>COPY only copies. ADD also extracts local tar files and downloads URLs. Use COPY unless you need extraction.</p></div>
<div class="card"><h4>ARG vs ENV?</h4><p>ARG exists only at build time; ENV persists into the running container. Neither is safe for secrets.</p></div>
<div class="card"><h4>How do you shrink an image?</h4><p>Multi-stage build, slim/alpine/distroless base, one RUN for install and cleanup, .dockerignore, no build tools in final stage.</p></div>
<div class="card"><h4>Why does the order of Dockerfile lines matter?</h4><p>The cache invalidates from the first changed instruction onward, so put stable steps (dependencies) before volatile ones (source code).</p></div>
<div class="card"><h4>Volume vs bind mount?</h4><p>A volume is managed by Docker and portable (production data). A bind mount maps a specific host path (development, config).</p></div>
<div class="card"><h4>How do containers talk to each other?</h4><p>Put them on the same user-defined bridge network and use container or service names via Docker's embedded DNS. Publish ports only for outside access.</p></div>
<div class="card"><h4>EXPOSE vs -p?</h4><p>EXPOSE is documentation. -p actually publishes a container port on a host port.</p></div>
<div class="card"><h4>What happens on docker stop?</h4><p>SIGTERM to PID 1, wait 10 s (configurable), then SIGKILL. Handle SIGTERM for graceful shutdown.</p></div>
<div class="card"><h4>Why not use the latest tag?</h4><p>It is mutable and not necessarily the newest, so deploys are not reproducible. Pin a version or digest.</p></div>
<div class="card"><h4>Container keeps restarting. Steps?</h4><p>docker ps -a for exit code, docker logs, docker inspect (OOMKilled, env, mounts), then reproduce with --entrypoint sh.</p></div>
<div class="card"><h4>Docker vs Kubernetes?</h4><p>Docker builds and runs containers on a host; Kubernetes orchestrates many containers across many hosts (scheduling, scaling, self-healing, service discovery).</p></div>
<div class="card"><h4>How to keep data after removing a container?</h4><p>Store it in a named volume or bind mount; the writable layer is deleted with the container.</p></div>
</div>

---

## Git {#git}

Git is a distributed version control system: it records snapshots of your project over time so you can collaborate, branch, review, undo and recover. Almost every software team uses it, so knowing its model (not just the commands) is what separates confident users from those who fear `git reset`.

<div class="diagram">
<div class="diagram-label">mind map — Git</div>
<div class="mermaid">
mindmap
  root((Git))
    Four areas
      Working directory
      Staging area
      Local repo
      Remote repo
    Branching strategies
      Git Flow
        main
        develop
        feature
        release
        hotfix
      GitHub Flow
        main always deployable
        feature branch
        Pull request and CI
    Merge vs rebase
      merge keeps history
      rebase gives linear history
      never rebase shared branches
    Undo and save
      cherry-pick
      stash
      reset soft mixed hard
      revert safe undo
    Daily commands
      status add commit
      branch checkout
      fetch pull push
      tag
    Hooks
      pre-commit
      commit-msg
      pre-push
</div>
</div>

### What Git is and why we use it

Before Git, teams emailed zip files (`project_final_v3_REAL.zip`) or used centralised systems (SVN, CVS) where one server held the only history and you needed network access to commit. **Git is distributed**: every clone contains the *entire* history, so commits, diffs, branches and log work offline, and any clone can restore a lost server.

Core ideas:

- Git stores **snapshots** of the whole project (not file diffs) at each commit, deduplicated by content hash.
- A commit is identified by a **SHA-1 (or SHA-256) hash** of its content, so history is tamper-evident.
- **Branches are cheap** - a branch is just a 41-byte file holding a commit hash. You can create one in milliseconds.
- Almost everything is **local and reversible** until you push.

<div class="tw"><table><thead><tr><th>Need</th><th>How Git answers it</th></tr></thead><tbody>
<tr><td>Who changed this line and why?</td><td><code>git blame</code>, <code>git log -p</code></td></tr>
<tr><td>Work on features in parallel</td><td>Branches and merges</td></tr>
<tr><td>Undo a bad change</td><td><code>revert</code>, <code>reset</code>, <code>reflog</code></td></tr>
<tr><td>Review before shipping</td><td>Pull / merge requests</td></tr>
<tr><td>Find which commit broke the build</td><td><code>git bisect</code></td></tr>
<tr><td>Mark a release</td><td>Tags</td></tr>
</tbody></table></div>

<div class="box note"><b>📝 Git vs GitHub</b> Git is the tool (runs on your machine). GitHub, GitLab and Bitbucket are hosting services that add remotes, pull requests, issues and CI around Git repositories.</div>

### The four areas: working directory, staging, local repo, remote

Changes travel through four places. Understanding which area a change is in tells you which command to use.

<div class="diagram">
<div class="diagram-label">flowchart — where changes live</div>
<div class="mermaid">
flowchart LR
    WD["Working directory"] -->|git add| SA["Staging area"]
    SA -->|git commit| LR["Local repo"]
    LR -->|git push| RR["Remote repo"]
    RR -->|git fetch| LR
    RR -->|git pull| WD
    LR -->|git checkout| WD
</div>
</div>

<div class="tw"><table><thead><tr><th>Area</th><th>What it holds</th><th>Key command</th></tr></thead><tbody>
<tr><td><strong>Working directory</strong></td><td>Actual files you edit (tracked, modified or untracked)</td><td><code>git status</code></td></tr>
<tr><td><strong>Staging area (index)</strong></td><td>Snapshot being prepared for the next commit</td><td><code>git add</code>, <code>git restore --staged</code></td></tr>
<tr><td><strong>Local repository</strong></td><td>Committed history in <code>.git/</code></td><td><code>git commit</code>, <code>git log</code></td></tr>
<tr><td><strong>Remote repository</strong></td><td>Shared copy on GitHub/GitLab</td><td><code>git push</code>, <code>git fetch</code></td></tr>
</tbody></table></div>

The staging area lets you build a clean commit even when the working directory has unrelated edits: stage only the relevant files (or hunks with `git add -p`).

<pre data-lang="bash"><code>$ echo "print('hi')" &gt; app.py
$ git status -s
?? app.py                  # untracked (working directory only)
$ git add app.py
$ git status -s
A  app.py                  # staged (in index)
$ echo "print('bye')" &gt;&gt; app.py
$ git status -s
AM app.py                  # staged version differs from working copy
$ git commit -m "feat: add app"
$ git status -s            # clean - nothing printed</code></pre>

<div class="diagram">
<div class="diagram-label">state diagram — life of a file</div>
<div class="mermaid">
stateDiagram-v2
    state "Untracked" as un
    state "Unmodified" as um
    state "Modified" as mo
    state "Staged" as st
    [*] --> un: create file
    un --> st: git add
    um --> mo: edit file
    mo --> st: git add
    st --> um: git commit
    st --> mo: git restore --staged
    mo --> um: git restore
    um --> un: git rm --cached
</div>
</div>

### The object model: blob, tree, commit, ref

Inside `.git/objects` Git is a **content-addressable key-value store**. Four object types make up everything:

- **blob** - the contents of one file (no name, no permissions).
- **tree** - a directory listing: names and modes pointing to blobs and sub-trees.
- **commit** - points to one top-level tree (the snapshot), its **parent commit(s)**, author, committer, timestamp and message.
- **tag (annotated)** - a named, signed pointer to a commit.

A **ref** is a human name for a commit hash: branches live in `.git/refs/heads/`, remote-tracking branches in `refs/remotes/`, tags in `refs/tags/`. `HEAD` says which branch (or commit) you are on.

<div class="diagram">
<div class="diagram-label">flowchart — how objects link together</div>
<div class="mermaid">
flowchart TD
    HEAD["HEAD"] --> MAIN["refs/heads/main"]
    MAIN --> C2["commit C2\nmessage: add readme"]
    C2 -->|"parent"| C1["commit C1\nmessage: initial"]
    C2 --> T2["tree root"]
    C1 --> T1["tree root older"]
    T2 --> B1["blob app.py v2"]
    T2 --> B2["blob README"]
    T2 --> SUB["tree src"]
    SUB --> B3["blob util.py"]
    T1 --> B0["blob app.py v1"]
</div>
</div>

<pre data-lang="bash"><code>$ git init demo &amp;&amp; cd demo
$ echo "hello" &gt; a.txt &amp;&amp; git add a.txt &amp;&amp; git commit -m "first"
[main (root-commit) 3b18e51] first

$ git cat-file -t 3b18e51          # object type
commit
$ git cat-file -p 3b18e51          # commit content
tree 4f2e9ac...
author Asha &lt;asha@example.com&gt; 1738000000 +0530
committer Asha &lt;asha@example.com&gt; 1738000000 +0530

first
$ git cat-file -p 4f2e9ac          # the tree
100644 blob ce01362...    a.txt
$ git cat-file -p ce01362          # the blob
hello
$ cat .git/HEAD
ref: refs/heads/main
$ cat .git/refs/heads/main
3b18e51...full 40-char hash...</code></pre>

<div class="box info"><b>ℹ️ Why snapshots are cheap</b> If a file is unchanged between commits, both trees point to the <em>same blob</em> (same hash). Renaming a file creates no new blob. Git later packs objects with delta compression (<code>git gc</code>), so repos stay small.</div>

### Starting: init, clone, add, commit

<pre data-lang="bash"><code># one-time identity
$ git config --global user.name  "Asha Verma"
$ git config --global user.email "asha@example.com"
$ git config --global init.defaultBranch main
$ git config --global core.editor "code --wait"
$ git config --list --show-origin | head -3

# start a repo
$ git init orders-api           # new empty repo
Initialized empty Git repository in /home/asha/orders-api/.git/
$ git clone https://github.com/acme/orders-api.git         # copy remote incl. full history
$ git clone --depth 1 https://github.com/acme/big.git       # shallow, latest snapshot only

# daily loop
$ git status
$ git add src/Order.java             # stage a file
$ git add -p                         # stage chosen hunks interactively
$ git diff                           # working dir vs staging
$ git diff --staged                  # staging vs last commit
$ git commit -m "feat(order): validate GST number"
[main 8c2f1d4] feat(order): validate GST number
 1 file changed, 12 insertions(+)
$ git commit --amend --no-edit       # fold forgotten change into last commit (local only)
$ git log --oneline --graph --decorate -5
8c2f1d4 (HEAD -&gt; main, origin/main) feat(order): validate GST number
a91b3e0 fix: rounding in invoice total
...</code></pre>

**Good commit habits**

- One logical change per commit; the build should pass at each commit.
- Subject line imperative, under ~50 characters (`Add retry to payment client`); blank line; body explains *why*.
- Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`) help changelogs and automation.
- `git add -A` stages everything, including accidental files; review with `git status` first.

### Branching and HEAD

A branch is a movable pointer to a commit. `HEAD` is a pointer to the branch you are on (or directly to a commit in **detached HEAD** state). Making a commit moves the *current branch* forward.

<div class="diagram">
<div class="diagram-label">flowchart — branches are pointers</div>
<div class="mermaid">
flowchart LR
    C1["C1"] --> C2["C2"] --> C3["C3"]
    C2 --> C4["C4"] --> C5["C5"]
    MAIN["main"] -.-> C3
    FEAT["feature/login"] -.-> C5
    HEAD["HEAD"] -.-> FEAT
</div>
</div>

<pre data-lang="bash"><code>$ git branch                              # list local branches (* = current)
* main
$ git switch -c feature/login             # create + switch (modern; git checkout -b also works)
Switched to a new branch 'feature/login'
$ git commit -am "wip login form"
$ git switch main                         # go back
$ git branch -a                           # include remote-tracking branches
$ git branch -d feature/login             # delete if merged
$ git branch -D feature/login             # force delete unmerged (careful)
$ git branch -m old-name new-name         # rename

# Detached HEAD: looking at a commit that no branch points to
$ git switch --detach 8c2f1d4
HEAD is now at 8c2f1d4 ...
$ git switch -c rescue                    # save work done while detached</code></pre>

<div class="box warn"><b>⚠️ Detached HEAD</b> Commits made while detached belong to no branch; once you switch away they are only reachable via the reflog and will eventually be garbage collected. Run <code>git switch -c new-branch</code> before leaving.</div>

Shortcuts for pointing at commits: `HEAD` (current), `HEAD~1` or `HEAD^` (parent), `HEAD~3` (three back), `main@{yesterday}`, `abc123` (hash prefix), `v1.2.0` (tag).

### Merging: fast-forward vs three-way

`git merge feature` brings the commits of `feature` into the **current** branch.

**Fast-forward**: if the current branch has not moved since `feature` branched, Git simply slides the branch pointer forward. No new commit.

**Three-way merge**: if both branches have new commits, Git finds the **merge base** (common ancestor), compares both tips against it and creates a **merge commit** with two parents.

<div class="diagram">
<div class="diagram-label">flowchart — fast-forward merge</div>
<div class="mermaid">
flowchart LR
    subgraph BEFORE["Before"]
        direction LR
        A1["A"] --> B1["B"] --> C1["C"]
        M1["main"] -.-> B1
        F1["feature"] -.-> C1
    end
    subgraph AFTER["After git merge feature"]
        direction LR
        A2["A"] --> B2["B"] --> C2["C"]
        M2["main and feature"] -.-> C2
    end
</div>
</div>

<div class="diagram">
<div class="diagram-label">flowchart — three-way merge</div>
<div class="mermaid">
flowchart LR
    A["A\nmerge base"] --> B["B"] --> C["C\nmain"]
    A --> D["D"] --> E["E\nfeature"]
    C --> M["M\nmerge commit"]
    E --> M
</div>
</div>

<pre data-lang="bash"><code># fast-forward
$ git switch main
$ git merge feature/search
Updating 3b18e51..9d7a2c0
Fast-forward
 search.py | 20 ++++++++++++++++++++
$ git merge --no-ff feature/search     # force a merge commit even when FF possible
$ git merge --ff-only feature/search   # refuse if a real merge would be needed

# three-way
$ git merge feature/login
Merge made by the 'ort' strategy.
 login.py | 40 +++++++++
$ git log --oneline --graph
*   5e3f1aa Merge branch 'feature/login'
|\
| * 21c9b7d add login form
* | 7a0d3e4 fix typo in README
|/
* 3b18e51 first</code></pre>

<div class="tw"><table><thead><tr><th></th><th>Fast-forward</th><th>Three-way</th></tr></thead><tbody>
<tr><td>Needs divergence?</td><td>No (linear)</td><td>Yes</td></tr>
<tr><td>Creates commit?</td><td>No</td><td>Yes, 2 parents</td></tr>
<tr><td>Shows feature was a branch?</td><td>No (unless <code>--no-ff</code>)</td><td>Yes</td></tr>
<tr><td>Conflicts possible?</td><td>No</td><td>Yes</td></tr>
</tbody></table></div>

### Resolving merge conflicts step by step

A conflict occurs when both branches changed the **same lines** (or one deleted a file the other edited). Git cannot decide, so it stops and marks the file.

<div class="diagram">
<div class="diagram-label">flowchart — conflict resolution workflow</div>
<div class="mermaid">
flowchart TD
    A["git merge feature"] --> B{"Conflicts?"}
    B -->|"no"| Z["Merge commit created"]
    B -->|"yes"| C["git status\nlists both modified files"]
    C --> D["Open file, edit between markers"]
    D --> E["Remove markers, keep correct code"]
    E --> F["git add file"]
    F --> G{"More conflicted files?"}
    G -->|"yes"| D
    G -->|"no"| H["git commit"]
    H --> Z
    C -.->|"give up"| X["git merge --abort"]
</div>
</div>

<pre data-lang="bash"><code>$ git switch main
$ git merge feature/discount
Auto-merging pricing.py
CONFLICT (content): Merge conflict in pricing.py
Automatic merge failed; fix conflicts and then commit the result.

$ git status
Unmerged paths:
        both modified:   pricing.py

$ cat pricing.py
def total(price):
&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD
    return price * 1.18            # main: 18% GST
=======
    return price * 0.9 * 1.12      # feature: 10% discount, 12% GST
&gt;&gt;&gt;&gt;&gt;&gt;&gt; feature/discount</code></pre>

Everything between `&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD` and `=======` is **your current branch**; between `=======` and `&gt;&gt;&gt;&gt;&gt;&gt;&gt;` is the **incoming branch**. Edit to the intended final code and delete all markers:

<pre data-lang="bash"><code># pricing.py after manual resolution
def total(price):
    return price * 0.9 * 1.18      # discount applied, GST stays 18%

$ git add pricing.py               # mark as resolved
$ git commit                       # message pre-filled: Merge branch 'feature/discount'
[main 6f2a8d1] Merge branch 'feature/discount'

# helpful options
$ git merge --abort                        # undo the whole merge attempt
$ git checkout --ours   pricing.py         # take main's version of the file
$ git checkout --theirs pricing.py         # take incoming version
$ git mergetool                            # open configured visual tool
$ git diff --name-only --diff-filter=U     # list unresolved files
$ git config --global merge.conflictstyle zdiff3   # show the common ancestor too</code></pre>

<div class="box tip"><b>✅ Reduce conflicts</b> Merge/rebase from <code>main</code> into your branch often, keep branches short-lived, avoid reformatting whole files, and talk to whoever else is touching the same module. After resolving, always run the tests: a clean textual merge can still be a logical conflict.</div>

### Rebase vs merge

Both integrate changes from one branch into another, but they record history differently.

- **Merge** keeps the true history and adds a merge commit.
- **Rebase** *replays* your commits on top of another base, creating **new commits** (new hashes) and a straight line.

<div class="diagram">
<div class="diagram-label">flowchart — merge vs rebase result</div>
<div class="mermaid">
flowchart TD
    subgraph MERGE["git merge main into feature"]
        direction LR
        MA["A"] --> MB["B"] --> MC["C main"]
        MB --> MD["D"] --> ME["E"]
        MC --> MM["M merge commit"]
        ME --> MM
    end
    subgraph REBASE["git rebase main"]
        direction LR
        RA["A"] --> RB["B"] --> RC["C main"] --> RD["D prime"] --> RE["E prime"]
    end
</div>
</div>

<pre data-lang="bash"><code># Rebase your feature onto the latest main
$ git switch feature/login
$ git fetch origin
$ git rebase origin/main
Successfully rebased and updated refs/heads/feature/login.

# if a conflict happens during rebase (once per replayed commit)
$ git add file.py
$ git rebase --continue
$ git rebase --skip          # drop the commit being replayed
$ git rebase --abort         # go back to before the rebase

# Then fast-forward main cleanly
$ git switch main &amp;&amp; git merge --ff-only feature/login

# After rebasing a branch you already pushed, history differs, so:
$ git push --force-with-lease      # safer than --force</code></pre>

<div class="tw"><table><thead><tr><th>Aspect</th><th>Merge</th><th>Rebase</th></tr></thead><tbody>
<tr><td><strong>History</strong></td><td>Non-linear, exact record</td><td>Linear, tidy</td></tr>
<tr><td><strong>Extra commit</strong></td><td>Yes (merge commit)</td><td>No</td></tr>
<tr><td><strong>Rewrites commits</strong></td><td>No</td><td>Yes (new hashes)</td></tr>
<tr><td><strong>Safe on shared branches</strong></td><td>Yes</td><td>No</td></tr>
<tr><td><strong>Conflict handling</strong></td><td>Resolve once</td><td>Possibly per commit</td></tr>
<tr><td><strong>Bisect friendliness</strong></td><td>Okay</td><td>Better (linear)</td></tr>
<tr><td><strong>Best for</strong></td><td>Integrating into main/develop</td><td>Updating your private feature branch</td></tr>
</tbody></table></div>

<div class="box warn"><b>⚠️ Golden rule of rebase</b> Never rebase commits that other people have already pulled. Rebase rewrites history; teammates' copies will diverge and produce duplicate commits and painful conflicts. Rebase only your own, unpublished (or solely-yours) branches.</div>

### Interactive rebase: clean up your history

`git rebase -i HEAD~4` opens an editor listing the last 4 commits (oldest first). Change the verb in front of each line, save, and Git rewrites them.

<div class="tw"><table><thead><tr><th>Command</th><th>Effect</th></tr></thead><tbody>
<tr><td><code>pick</code></td><td>Keep the commit as is</td></tr>
<tr><td><code>reword</code></td><td>Keep changes, edit the message</td></tr>
<tr><td><code>edit</code></td><td>Stop to amend the commit or split it</td></tr>
<tr><td><code>squash</code></td><td>Meld into previous commit, combine messages</td></tr>
<tr><td><code>fixup</code></td><td>Meld into previous, discard this message</td></tr>
<tr><td><code>drop</code></td><td>Delete the commit</td></tr>
</tbody></table></div>

<pre data-lang="bash"><code>$ git log --oneline -4
d4e5f6a fix typo
c3d4e5f wip
b2c3d4e add payment retry
a1b2c3d add payment client

$ git rebase -i HEAD~4
# editor shows (oldest first); change to:
pick   a1b2c3d add payment client
squash b2c3d4e add payment retry
fixup  c3d4e5f wip
fixup  d4e5f6a fix typo

# save and close, edit the combined message when asked
$ git log --oneline -2
9f8e7d6 feat(payment): add client with retry
...                                   # 4 commits became 1

# Shortcut workflow: record a fixup against an earlier commit, auto-arrange later
$ git commit --fixup a1b2c3d
$ git rebase -i --autosquash origin/main</code></pre>

<div class="box tip"><b>✅ Do this before opening a PR</b> Squash noisy "wip" commits so reviewers see a story: one or a few logical commits. If you already pushed, update the remote with <code>git push --force-with-lease</code>. If anything goes wrong, <code>git reflog</code> (below) gets the old state back.</div>

### Cherry-pick

`git cherry-pick <hash>` copies the **change introduced by one commit** onto your current branch as a new commit (new hash). Typical uses: back-port a hotfix to a release branch, rescue a single commit from an abandoned branch.

<div class="diagram">
<div class="diagram-label">flowchart — cherry-pick one commit</div>
<div class="mermaid">
flowchart LR
    subgraph FEATURE["feature"]
        F1["F1"] --> F2["F2 bug fix"] --> F3["F3"]
    end
    subgraph RELEASE["release 1.0 after"]
        R1["R1"] --> R2["R2"] --> F2P["F2 prime copy"]
    end
    F2 -.->|"git cherry-pick F2"| F2P
</div>
</div>

<pre data-lang="bash"><code>$ git switch release/1.0
$ git log --oneline feature/search     # find the hash
e7f8a9b add pagination
5c6d7e8 fix NPE in search              &lt;-- want only this one
$ git cherry-pick 5c6d7e8
[release/1.0 1a2b3c4] fix NPE in search
$ git cherry-pick A..B                 # range (A excluded, B included)
$ git cherry-pick -x 5c6d7e8           # append "(cherry picked from commit ...)"
$ git cherry-pick -n 5c6d7e8           # apply changes but do not commit
# on conflict: fix, git add, then
$ git cherry-pick --continue    # or --abort</code></pre>

<div class="box warn"><b>⚠️ Duplicates</b> The copied commit has a different hash, so a later merge of the original branch may show the change twice (usually harmless as Git recognises identical changes, but can cause conflicts). Use sparingly.</div>

### Stash: park unfinished work

You are mid-change and need to switch branches for an urgent fix, but the work is not ready to commit. `git stash` saves modified tracked files (and staged changes) on a stack and restores a clean working directory.

<div class="diagram">
<div class="diagram-label">sequenceDiagram — stash and restore</div>
<div class="mermaid">
sequenceDiagram
    participant W as "Working dir"
    participant S as "Stash stack"
    participant B as "Other branch"
    W->>S: git stash push -m WIP
    Note over W: working dir is clean
    W->>B: git switch hotfix and commit fix
    B->>W: git switch back to feature
    S->>W: git stash pop
    Note over W: changes are back
</div>
</div>

<pre data-lang="bash"><code>$ git stash push -m "WIP: login validation"
Saved working directory and index state On feature/login: WIP: login validation
$ git stash list
stash@{0}: On feature/login: WIP: login validation
stash@{1}: WIP on main: 3b18e51 first
$ git switch main                     # do other work...
$ git switch feature/login
$ git stash pop                       # apply stash@{0} and delete it
$ git stash apply stash@{1}           # apply but keep it in the list
$ git stash drop stash@{1}            # delete one
$ git stash clear                     # delete all
$ git stash push -u                   # also stash untracked files
$ git stash push -- src/app.py        # stash only one path
$ git stash show -p stash@{0}         # view diff
$ git stash branch fix/login stash@{0}  # new branch from stash</code></pre>

### Reset: soft, mixed, hard

`git reset <commit>` moves the **current branch pointer** to another commit. The mode decides what also happens to the index and working directory.

<div class="diagram">
<div class="diagram-label">flowchart — reset modes</div>
<div class="mermaid">
flowchart LR
    RS["git reset to commit"] --> SOFT["--soft\nmove branch only\nchanges stay staged"]
    RS --> MIX["--mixed default\nmove branch and unstage\nchanges stay in files"]
    RS --> HARD["--hard\nmove branch, reset index and files\nchanges DISCARDED"]
</div>
</div>

<div class="tw"><table><thead><tr><th>Mode</th><th>Branch pointer</th><th>Staging area</th><th>Working directory</th><th>Use for</th></tr></thead><tbody>
<tr><td><code>--soft</code></td><td>moved</td><td>kept</td><td>kept</td><td>Redo/squash last commits</td></tr>
<tr><td><code>--mixed</code></td><td>moved</td><td>reset</td><td>kept</td><td>Un-commit and re-stage selectively</td></tr>
<tr><td><code>--hard</code></td><td>moved</td><td>reset</td><td>reset (lost)</td><td>Throw everything away</td></tr>
</tbody></table></div>

<pre data-lang="bash"><code>$ git log --oneline -3
c3 add feature C
b2 add feature B
a1 add feature A

$ git reset --soft HEAD~1      # branch at b2; feature C changes still STAGED
$ git status -s
M  c.py
$ git commit -m "add feature C properly"     # recommit

$ git reset HEAD~1             # --mixed: changes in files but NOT staged
$ git status -s
 M c.py

$ git reset --hard HEAD~1      # changes gone from branch AND disk
HEAD is now at b2 add feature B

$ git reset HEAD file.py       # unstage one file (older syntax of: git restore --staged file.py)
$ git restore file.py          # discard working changes in a file (cannot be undone!)</code></pre>

<div class="box warn"><b>⚠️ Reset rewrites history</b> Do not reset commits that are already pushed and shared; use <code>revert</code> there. <code>--hard</code> destroys uncommitted work permanently (committed work can still be recovered through the reflog).</div>

### Revert: the safe undo

`git revert <commit>` creates a **new commit that applies the inverse** of an earlier commit. History is preserved, so it is safe on shared branches such as `main`.

<div class="diagram">
<div class="diagram-label">flowchart — revert adds a commit</div>
<div class="mermaid">
flowchart LR
    A["A"] --> B["B good"] --> C["C bad change"] --> D["D"] --> R["R revert of C"]
</div>
</div>

<pre data-lang="bash"><code>$ git revert 7b8c9d0
[main e1f2a3b] Revert "feat: aggressive caching"
 1 file changed, 4 deletions(-)
$ git revert HEAD~2..HEAD         # revert a range, one commit each
$ git revert -n 7b8c9d0           # stage the inverse but do not commit
$ git revert -m 1 5e3f1aa         # revert a MERGE commit (-m picks the mainline parent)</code></pre>

<div class="tw"><table><thead><tr><th></th><th>revert</th><th>reset</th></tr></thead><tbody>
<tr><td>History</td><td>Adds a new commit, nothing lost</td><td>Moves the branch back, commits dropped</td></tr>
<tr><td>Safe after push</td><td>Yes</td><td>No (needs force push)</td></tr>
<tr><td>Typical use</td><td>Undo a bad change in production</td><td>Clean local mistakes</td></tr>
</tbody></table></div>

### Reflog: recover "lost" commits

The **reflog** is a local journal of every position `HEAD` and each branch tip has had (kept ~90 days). It is your safety net after a bad `reset --hard`, rebase or deleted branch because the commits still exist as objects until garbage collected.

<div class="diagram">
<div class="diagram-label">flowchart — recovery with reflog</div>
<div class="mermaid">
flowchart TD
    A["Mistake: reset --hard, bad rebase, deleted branch"] --> B["git reflog"]
    B --> C["Find hash from before the mistake"]
    C --> D{"Restore how?"}
    D -->|"move branch back"| E["git reset --hard hash"]
    D -->|"keep current, make new branch"| F["git switch -c rescue hash"]
    D -->|"just one commit"| G["git cherry-pick hash"]
</div>
</div>

<pre data-lang="bash"><code>$ git log --oneline
c3 add C
b2 add B
a1 add A
$ git reset --hard a1                 # oops - lost B and C
$ git log --oneline
a1 add A

$ git reflog
a1 HEAD@{0}: reset: moving to a1
c3 HEAD@{1}: commit: add C
b2 HEAD@{2}: commit: add B
a1 HEAD@{3}: commit: add A

$ git reset --hard c3                 # or HEAD@{1}
HEAD is now at c3 add C               # everything is back

# Recover a deleted branch
$ git branch -D feature/x             # Deleted branch feature/x (was 9a8b7c6).
$ git branch feature/x 9a8b7c6        # recreated
$ git fsck --lost-found               # find unreachable (dangling) commits</code></pre>

<div class="box info"><b>ℹ️ Limits</b> The reflog is local only (not pushed) and does not track uncommitted work. Never-committed edits lost by <code>reset --hard</code> or <code>restore</code> cannot be recovered.</div>

### Tags and releases

A **tag** is a permanent, human-readable name for one commit, normally a release (`v1.4.2`). Unlike branches, tags do not move.

<div class="tw"><table><thead><tr><th>Type</th><th>Create</th><th>Contains</th></tr></thead><tbody>
<tr><td>Lightweight</td><td><code>git tag v1.0.0</code></td><td>Just a pointer</td></tr>
<tr><td>Annotated (recommended)</td><td><code>git tag -a v1.0.0 -m "Release 1.0"</code></td><td>Tagger, date, message, optional GPG signature</td></tr>
</tbody></table></div>

<pre data-lang="bash"><code>$ git tag -a v1.4.0 -m "Release 1.4.0"
$ git tag -a v1.3.0 a1b2c3d -m "Back-tag an older commit"
$ git tag                              # list
v1.3.0
v1.4.0
$ git show v1.4.0                      # tag info and commit
$ git push origin v1.4.0               # tags are NOT pushed by default
$ git push origin --tags               # push all tags
$ git switch --detach v1.3.0           # inspect old release
$ git tag -d v1.4.0                    # delete locally
$ git push origin --delete v1.4.0      # delete on remote
$ git describe --tags                  # v1.4.0-5-g8c2f1d4 (5 commits after tag)</code></pre>

Use **semantic versioning**: `MAJOR.MINOR.PATCH` (breaking, feature, fix). CI pipelines often trigger release builds when a tag matching `v*` is pushed.

### Remotes: fetch vs pull vs push

A **remote** is a named URL of another copy of the repo (by convention `origin`). Git keeps **remote-tracking branches** (`origin/main`) as a local read-only bookmark of where the remote branch was at your last contact.

<div class="diagram">
<div class="diagram-label">sequenceDiagram — fetch vs pull</div>
<div class="mermaid">
sequenceDiagram
    participant R as "Remote origin"
    participant T as "origin/main tracking"
    participant L as "Local main"
    participant W as "Working dir"
    R->>T: git fetch downloads new commits
    Note over T,L: fetch does not touch local main or files
    T->>L: git merge origin/main
    L->>W: update files
    Note over R,W: git pull equals fetch then merge or rebase
    L->>R: git push uploads commits
</div>
</div>

<div class="tw"><table><thead><tr><th>Command</th><th>Downloads</th><th>Changes your branch/files</th><th>Safe?</th></tr></thead><tbody>
<tr><td><code>git fetch</code></td><td>Yes</td><td>No (only origin/* refs)</td><td>Always safe</td></tr>
<tr><td><code>git pull</code></td><td>Yes</td><td>Yes (fetch + merge)</td><td>May cause merge/conflicts</td></tr>
<tr><td><code>git pull --rebase</code></td><td>Yes</td><td>Yes (fetch + rebase)</td><td>Linear history, rewrites local commits</td></tr>
<tr><td><code>git push</code></td><td>No (uploads)</td><td>Remote branch</td><td>Rejected if remote has commits you lack</td></tr>
</tbody></table></div>

<pre data-lang="bash"><code>$ git remote -v
origin  https://github.com/acme/orders-api.git (fetch)
origin  https://github.com/acme/orders-api.git (push)
$ git remote add upstream https://github.com/original/orders-api.git   # forks
$ git fetch origin
$ git log --oneline main..origin/main        # what would pull bring?
f1e2d3c fix: null check
$ git pull --rebase origin main
$ git push -u origin feature/login           # -u sets upstream so later just 'git push'
$ git push
 ! [rejected]  main -&gt; main (fetch first)    # someone pushed before you
$ git pull --rebase &amp;&amp; git push              # integrate then push
$ git push --force-with-lease                # forced update ONLY if remote is as you expect
$ git fetch --prune                          # delete tracking refs of removed remote branches
$ git config --global pull.rebase true</code></pre>

### Branching strategies: Git Flow, GitHub Flow, trunk-based

A strategy is a team agreement on which branches exist and how code reaches production.

#### Git Flow

Long-lived `main` (production) and `develop` (integration) plus short-lived `feature/*`, `release/*` and `hotfix/*` branches. Good for versioned products with scheduled releases.

<div class="diagram">
<div class="diagram-label">git graph — Git Flow</div>
<div class="mermaid">
gitGraph
   commit id: "init"
   branch develop
   checkout develop
   commit id: "setup"
   branch feature
   checkout feature
   commit id: "feature work"
   checkout develop
   merge feature
   branch release
   checkout release
   commit id: "bump version"
   checkout main
   merge release tag: "v1.0"
   checkout develop
   merge release
   branch hotfix
   checkout hotfix
   commit id: "fix prod bug"
   checkout main
   merge hotfix tag: "v1.0.1"
   checkout develop
   merge hotfix
</div>
</div>

<div class="tw"><table><thead><tr><th>Branch</th><th>Branches from</th><th>Merges into</th><th>Purpose</th></tr></thead><tbody>
<tr><td><strong>main</strong></td><td>-</td><td>-</td><td>Production code, every commit is a release (tagged)</td></tr>
<tr><td><strong>develop</strong></td><td>main</td><td>release</td><td>Integration of finished features</td></tr>
<tr><td><strong>feature/*</strong></td><td>develop</td><td>develop</td><td>One feature or ticket</td></tr>
<tr><td><strong>release/*</strong></td><td>develop</td><td>main and develop</td><td>Stabilise, bump version, only bug fixes</td></tr>
<tr><td><strong>hotfix/*</strong></td><td>main</td><td>main and develop</td><td>Urgent production fix</td></tr>
</tbody></table></div>

#### GitHub Flow

One rule: `main` is always deployable. Create a short-lived branch, open a pull request, review + CI, merge, deploy.

<div class="diagram">
<div class="diagram-label">flowchart — GitHub Flow</div>
<div class="mermaid">
flowchart LR
    MAIN["main\nalways deployable"] -->|branch| FEAT["feature branch"]
    FEAT -->|Pull Request| PR["Review + CI"]
    PR -->|merged| MAIN
    MAIN -->|auto deploy| PROD["Production"]
</div>
</div>

#### Trunk-based development

Everyone commits to `main` (the trunk) at least daily, either directly or via branches that live for hours, not days. Unfinished work is hidden behind **feature flags**. It needs strong automated tests and CI, and enables continuous delivery with minimal merge pain.

<div class="diagram">
<div class="diagram-label">flowchart — trunk-based development</div>
<div class="mermaid">
flowchart LR
    DEV["Developer\nsmall change"] -->|"short branch, under 1 day"| PR["Quick review + CI"]
    PR --> TRUNK["trunk / main"]
    TRUNK --> FLAG["Feature flag off"]
    FLAG --> DEPLOY["Deploy to production often"]
    DEPLOY -->|"flag on when ready"| USERS["Users see feature"]
</div>
</div>

<div class="tw"><table><thead><tr><th>Aspect</th><th>Git Flow</th><th>GitHub Flow</th><th>Trunk-based</th></tr></thead><tbody>
<tr><td>Long-lived branches</td><td>main + develop</td><td>main</td><td>main only</td></tr>
<tr><td>Branch lifetime</td><td>Days to weeks</td><td>Days</td><td>Hours</td></tr>
<tr><td>Release model</td><td>Scheduled, versioned</td><td>Continuous</td><td>Continuous</td></tr>
<tr><td>Complexity</td><td>High</td><td>Low</td><td>Low (needs discipline and tests)</td></tr>
<tr><td>Best for</td><td>Installed software, multiple supported versions</td><td>Web apps, SaaS</td><td>High-performing CD teams</td></tr>
</tbody></table></div>

### Pull request (code review) workflow

<div class="diagram">
<div class="diagram-label">sequenceDiagram — feature to production through a PR</div>
<div class="mermaid">
sequenceDiagram
    participant Dev as "Developer"
    participant Local as "Local repo"
    participant GH as "GitHub"
    participant CI as "CI pipeline"
    participant Rev as "Reviewer"
    Dev->>Local: git switch -c feature/x and commit
    Dev->>GH: git push -u origin feature/x
    Dev->>GH: open Pull Request
    GH->>CI: trigger build and tests
    CI-->>GH: status checks pass or fail
    Rev->>GH: review and comment
    Dev->>GH: push fixes
    Rev->>GH: approve
    GH->>GH: merge squash or merge commit
    GH->>CI: deploy from main
    Dev->>Local: git switch main and pull and delete branch
</div>
</div>

<pre data-lang="bash"><code>$ git switch main &amp;&amp; git pull --rebase
$ git switch -c feature/ORD-142-gst-validation
# ... commits ...
$ git fetch origin &amp;&amp; git rebase origin/main    # sync before PR
$ git push -u origin feature/ORD-142-gst-validation
# open PR (web UI or: gh pr create --fill)
# after review changes
$ git commit -am "address review comments" &amp;&amp; git push
# after merge
$ git switch main &amp;&amp; git pull --rebase
$ git branch -d feature/ORD-142-gst-validation
$ git push origin --delete feature/ORD-142-gst-validation</code></pre>

<div class="tw"><table><thead><tr><th>Merge button option</th><th>Result</th><th>When</th></tr></thead><tbody>
<tr><td>Create a merge commit</td><td>Full branch history + merge commit</td><td>Want exact record</td></tr>
<tr><td>Squash and merge</td><td>One commit on main per PR</td><td>Messy branch history, clean main</td></tr>
<tr><td>Rebase and merge</td><td>Commits replayed linearly, no merge commit</td><td>Well-structured commits, linear history</td></tr>
</tbody></table></div>

Good PR practice: small (under ~400 changed lines), descriptive title and body, linked ticket, passing CI, branch protection requiring review and green checks before merge.

### Git hooks

Hooks are scripts in `.git/hooks/` that Git runs at lifecycle events. They are **not versioned** (`.git` is not cloned); share them with a tool such as **Husky** or **pre-commit**, or `git config core.hooksPath .githooks` with a committed folder.

<div class="tw"><table><thead><tr><th>Hook</th><th>When it runs</th><th>Common use</th></tr></thead><tbody>
<tr><td><strong>pre-commit</strong></td><td>Before commit is created</td><td>Lint, format, secret scan</td></tr>
<tr><td><strong>prepare-commit-msg</strong></td><td>Before message editor opens</td><td>Prefill ticket id from branch name</td></tr>
<tr><td><strong>commit-msg</strong></td><td>After message entered</td><td>Enforce Conventional Commits</td></tr>
<tr><td><strong>pre-push</strong></td><td>Before push</td><td>Run tests, block pushes to main</td></tr>
<tr><td><strong>post-merge</strong>, <strong>post-checkout</strong></td><td>After merge/checkout</td><td>Reinstall dependencies</td></tr>
<tr><td><strong>pre-receive</strong>, <strong>update</strong> (server)</td><td>On the remote when a push arrives</td><td>Enforce policy centrally</td></tr>
</tbody></table></div>

<div class="diagram">
<div class="diagram-label">flowchart — hooks during a commit and push</div>
<div class="mermaid">
flowchart LR
    A["git commit"] --> B["pre-commit"]
    B -->|"exit 0"| C["commit-msg"]
    B -->|"non-zero"| X["Commit aborted"]
    C -->|"exit 0"| D["Commit created"]
    C -->|"non-zero"| X
    D --> E["git push"]
    E --> F["pre-push"]
    F -->|"exit 0"| G["Remote receives"]
    F -->|"non-zero"| Y["Push aborted"]
</div>
</div>

<pre data-lang="bash"><code>#!/bin/sh
# .git/hooks/commit-msg  (chmod +x) - enforce Conventional Commits
MSG=$(cat "$1")
PATTERN='^(feat|fix|docs|chore|refactor|test|ci|perf|style)(\(.+\))?: .{1,72}'
if ! echo "$MSG" | grep -qE "$PATTERN"; then
    echo "Invalid commit message."
    echo "Format:  type(scope): description"
    echo "Example: feat(auth): add JWT token refresh"
    exit 1
fi

#!/bin/sh
# .git/hooks/pre-commit - block commits that contain a debugger statement
if git diff --cached | grep -E '^\+.*(debugger|console\.log|pdb\.set_trace)' ; then
    echo "Remove debug statements before committing."
    exit 1
fi</code></pre>

A failing hook (non-zero exit) aborts the operation. Skip with `--no-verify` only in emergencies; CI must repeat the checks because local hooks can be bypassed.

### .gitignore

`.gitignore` lists files Git should not track: build output, dependencies, logs, secrets, IDE files. It only affects **untracked** files; a file already committed stays tracked until removed from the index.

<pre data-lang="bash"><code># .gitignore
node_modules/
target/
build/
*.log
.env
.idea/
.vscode/
__pycache__/
*.pyc
!important.log        # negation: do track this one
/secrets.json         # leading slash = only at repo root
docs/**/*.tmp         # ** matches nested dirs

# File was committed by mistake? stop tracking it but keep on disk:
$ git rm --cached .env
$ git rm -r --cached node_modules
$ git commit -m "chore: stop tracking env and node_modules"

$ git check-ignore -v build/app.js        # which rule ignores this?
.gitignore:3:build/    build/app.js
$ git status --ignored                    # show ignored files
$ git config --global core.excludesfile ~/.gitignore_global   # personal rules (OS files)</code></pre>

<div class="box warn"><b>⚠️ Leaked secret</b> Adding a committed secret to <code>.gitignore</code> does not remove it from history. Rotate the credential immediately; then purge history with <code>git filter-repo</code> or BFG if required, and force-push. Treat it as compromised regardless.</div>

### Finding bugs with git bisect

When something worked in `v1.0` but is broken now, **bisect** does a binary search through the commits between them. For 1000 commits it needs only about 10 steps.

<div class="diagram">
<div class="diagram-label">flowchart — bisect loop</div>
<div class="mermaid">
flowchart TD
    A["git bisect start\nmark bad and good"] --> B["Git checks out the middle commit"]
    B --> C{"Test: is it broken?"}
    C -->|"yes"| D["git bisect bad"]
    C -->|"no"| E["git bisect good"]
    D --> F{"One commit left?"}
    E --> F
    F -->|"no"| B
    F -->|"yes"| G["First bad commit found\ngit bisect reset"]
</div>
</div>

<pre data-lang="bash"><code>$ git bisect start
$ git bisect bad                     # current HEAD is broken
$ git bisect good v1.0               # this tag worked
Bisecting: 15 revisions left to test after this (roughly 4 steps)
[7d3e1f2...] refactor tax module
$ ./run_tests.sh                     # you test it
$ git bisect good                    # or: git bisect bad
...
a9c8b7d is the first bad commit
commit a9c8b7d
    change rounding mode in invoice total
$ git bisect reset                   # return to original branch

# Fully automatic: script exit 0 = good, 1-127 = bad, 125 = skip
$ git bisect start HEAD v1.0
$ git bisect run ./run_tests.sh</code></pre>

### Inspecting history: log, diff, blame, show

<pre data-lang="bash"><code>$ git log --oneline --graph --decorate --all
$ git log -p -- src/Order.java              # history of one file with patches
$ git log --author="Asha" --since="2 weeks ago"
$ git log --grep="GST"                      # search commit messages
$ git log -S"calculateTax"                  # commits that added/removed this string (pickaxe)
$ git log main..feature                     # commits in feature not in main
$ git show 8c2f1d4                          # one commit
$ git show HEAD:README.md                   # file as of a commit
$ git diff main...feature                   # changes on feature since it forked
$ git blame -L 10,20 src/Order.java         # who last changed lines 10-20
$ git shortlog -sn                          # commits per author
$ git config --global alias.lg "log --oneline --graph --decorate --all"
$ git config --global alias.st "status -s"</code></pre>

### Common mistakes and how to fix them

<div class="tw"><table><thead><tr><th>Mistake</th><th>Fix</th></tr></thead><tbody>
<tr><td>Typo in last commit message (not pushed)</td><td><code>git commit --amend -m "new message"</code></td></tr>
<tr><td>Forgot a file in last commit</td><td><code>git add file &amp;&amp; git commit --amend --no-edit</code></td></tr>
<tr><td>Committed on wrong branch</td><td><code>git branch right-branch</code> (keeps commits), then on wrong branch <code>git reset --hard HEAD~1</code>, <code>git switch right-branch</code></td></tr>
<tr><td>Committed to <code>main</code> instead of feature branch (unpushed)</td><td><code>git switch -c feature/x</code>; then <code>git switch main &amp;&amp; git reset --hard origin/main</code></td></tr>
<tr><td>Staged the wrong file</td><td><code>git restore --staged file</code></td></tr>
<tr><td>Want to discard local edits to a file</td><td><code>git restore file</code> (irreversible)</td></tr>
<tr><td>Need to undo a pushed commit</td><td><code>git revert &lt;hash&gt;</code> then push (never rewrite shared history)</td></tr>
<tr><td>Lost commits after reset or rebase</td><td><code>git reflog</code> then <code>git reset --hard HEAD@{n}</code></td></tr>
<tr><td>Deleted a branch accidentally</td><td><code>git reflog</code>, <code>git branch name &lt;hash&gt;</code></td></tr>
<tr><td>Push rejected (non-fast-forward)</td><td><code>git pull --rebase</code> then push. Do not force-push shared branches</td></tr>
<tr><td>Committed a large file or secret</td><td>Rotate secret; <code>git filter-repo</code> or BFG; force push; teammates re-clone</td></tr>
<tr><td>Merge went badly, want to start over</td><td><code>git merge --abort</code> (or <code>git reset --hard ORIG_HEAD</code> after completion)</td></tr>
<tr><td>Rebase became messy</td><td><code>git rebase --abort</code></td></tr>
<tr><td>Detached HEAD with new commits</td><td><code>git switch -c rescue-branch</code></td></tr>
<tr><td>File still tracked after adding to .gitignore</td><td><code>git rm --cached file</code></td></tr>
<tr><td>Wrong author name/email on commits</td><td><code>git config user.email ...</code>; fix last with <code>git commit --amend --reset-author</code></td></tr>
<tr><td>Line ending noise (CRLF vs LF)</td><td><code>.gitattributes</code> with <code>* text=auto</code>; <code>core.autocrlf</code></td></tr>
<tr><td>"Your local changes would be overwritten"</td><td>Commit or <code>git stash</code> first, then switch/pull</td></tr>
</tbody></table></div>

<pre data-lang="bash"><code># Scenario: you committed 2 commits on main by mistake (not pushed)
$ git log --oneline -3
c3 feature part 2
b2 feature part 1
a1 last good release (origin/main)

$ git branch feature/x            # new branch keeps c3 and b2
$ git reset --hard origin/main    # main back to a1
$ git switch feature/x            # continue work here
$ git log --oneline -1
c3 feature part 2</code></pre>

### Interview quick answers

<div class="g2">
<div class="card"><h4>What is Git and how is it different from SVN?</h4><p>Git is a distributed VCS: each clone holds full history, branching is cheap, most operations are local. SVN is centralised: one server holds history and needs network access.</p></div>
<div class="card"><h4>Git vs GitHub?</h4><p>Git is the version control tool. GitHub is a hosting platform adding pull requests, issues, Actions and access control.</p></div>
<div class="card"><h4>Explain the 3 local states</h4><p>Modified (working directory), staged (index, marked for next commit), committed (stored in the local repository). Pushing then publishes to the remote.</p></div>
<div class="card"><h4>What is HEAD?</h4><p>A pointer to the current commit, usually via the checked-out branch. Detached HEAD means it points straight at a commit.</p></div>
<div class="card"><h4>What is a branch, internally?</h4><p>A lightweight file under refs/heads holding the hash of the latest commit on that line of work.</p></div>
<div class="card"><h4>Fast-forward vs 3-way merge?</h4><p>Fast-forward just moves the pointer when history is linear. 3-way uses the common ancestor and creates a merge commit with two parents.</p></div>
<div class="card"><h4>Merge vs rebase?</h4><p>Merge preserves history with a merge commit. Rebase rewrites your commits on a new base for linear history. Do not rebase shared branches.</p></div>
<div class="card"><h4>fetch vs pull?</h4><p>fetch only downloads and updates origin/* refs. pull = fetch plus merge (or rebase) into the current branch.</p></div>
<div class="card"><h4>reset vs revert?</h4><p>reset moves the branch pointer (rewrites history, local use). revert adds a new commit that undoes a previous one (safe for shared branches).</p></div>
<div class="card"><h4>reset --soft vs --mixed vs --hard?</h4><p>Soft keeps changes staged, mixed keeps them unstaged, hard discards them.</p></div>
<div class="card"><h4>How do you resolve a merge conflict?</h4><p>Open conflicted files, edit between the markers to the correct result, remove markers, git add, then git commit (or rebase --continue). Abort with --abort.</p></div>
<div class="card"><h4>When use cherry-pick?</h4><p>To apply one specific commit to another branch, such as back-porting a hotfix to a release branch.</p></div>
<div class="card"><h4>What does git stash do?</h4><p>Shelves uncommitted changes onto a stack so you can switch context, then restores them with pop or apply.</p></div>
<div class="card"><h4>You deleted a branch or did reset --hard by mistake. Recover?</h4><p>git reflog to find the old commit hash, then git branch name hash or git reset --hard hash.</p></div>
<div class="card"><h4>What is git bisect?</h4><p>Binary search over history to find the commit that introduced a bug, in about log2 N steps; automatable with bisect run.</p></div>
<div class="card"><h4>Git Flow vs GitHub Flow vs trunk-based?</h4><p>Git Flow: develop, release and hotfix branches for scheduled versions. GitHub Flow: main plus short feature branches and PRs. Trunk-based: tiny, frequent commits to main with feature flags.</p></div>
<div class="card"><h4>What is --force-with-lease?</h4><p>A safer force push that fails if the remote branch has commits you have not seen, preventing overwriting a teammate's work.</p></div>
<div class="card"><h4>How to undo a commit that is already pushed?</h4><p>git revert the commit and push. Resetting and force-pushing shared history harms teammates.</p></div>
<div class="card"><h4>Annotated vs lightweight tag?</h4><p>Lightweight is only a pointer; annotated is a full object with tagger, date, message and optional signature. Use annotated for releases.</p></div>
<div class="card"><h4>What are hooks?</h4><p>Executable scripts Git runs at events like pre-commit or pre-push to enforce quality; shared via Husky or core.hooksPath since .git is not cloned.</p></div>
</div>

---

## CI/CD {#cicd}

CI/CD is the practice of automatically building, testing, packaging and releasing software every time code changes. It replaces slow, manual, error-prone releases with a repeatable pipeline that gives fast feedback. These notes go from the basic idea through pipelines, deployment strategies, GitOps and security.

<div class="diagram">
<div class="diagram-label">mind map — CI/CD</div>
<div class="mermaid">
mindmap
  root((CI/CD))
    Concepts
      Continuous Integration
        merge often
        build and test
      Continuous Delivery
        always deployable
        manual release
      Continuous Deployment
        auto to production
    DORA metrics
      Deployment frequency
      Lead time
      MTTR
      Change failure rate
    Pipeline stages
      Source
      Build
      Unit test
      Static analysis
      Security scan
      Artifact
      Deploy dev
      Integration test
      Deploy prod
    Tools
      Jenkins
      GitHub Actions
      GitLab CI
      AWS CodePipeline
      CircleCI
      ArgoCD
    Deployment strategies
      Blue Green
      Canary
      Rolling
</div>
</div>

### The problem CI/CD solves

Before CI/CD, teams worked on long-lived branches for weeks and merged everything just before a release. The result was <strong>integration hell</strong>: hundreds of conflicting changes, a build that no one had compiled in days, manual test cycles, and a "release weekend" where a sysadmin copied a WAR file onto a server by hand and prayed.

Problems of the manual approach:

- <strong>Late feedback</strong> - a bug introduced in week 1 is found in week 4, when nobody remembers the change.
- <strong>Big-bang releases</strong> - large batches mean large risk and hard debugging.
- <strong>"Works on my machine"</strong> - builds depend on a developer laptop, not a clean reproducible environment.
- <strong>Human error</strong> - a missed step in a 40-line runbook takes production down.
- <strong>Slow</strong> - releases happen monthly or quarterly, so customers wait for value.

CI/CD fixes this by making the path from commit to production <strong>automated, small-batch and repeatable</strong>.

<div class="diagram">
<div class="diagram-label">flowchart — manual release vs automated pipeline</div>
<div class="mermaid">
flowchart LR
    subgraph OLD["Manual process"]
        direction LR
        O1["Code for 4 weeks"] --> O2["Big merge"] --> O3["Manual QA 2 weeks"] --> O4["Weekend release"] --> O5["Firefighting"]
    end
    subgraph NEW["CI/CD process"]
        direction LR
        N1["Small commit"] --> N2["Auto build and test\n10 minutes"] --> N3["Auto deploy"] --> N4["Monitor"]
    end
</div>
</div>

**Worked example:** a team of 8 developers merges a 6,000-line change after 3 weeks. 14 tests fail, 3 merge conflicts hide a real bug, and the fix takes 2 days. With CI, each developer merges about 150 lines per day; a failing test points at a 150-line diff and is fixed in 15 minutes.

<div class="box tip"><b>✅ Core idea</b> Make integration and release boring by doing them constantly in small steps. If something is painful, do it more often until it stops being painful.</div>

### CI vs Continuous Delivery vs Continuous Deployment

The three terms are often mixed up. They are successive levels of automation.

<div class="g2">
<div class="card"><h4>Continuous Integration</h4><p>Developers merge to the shared trunk at least daily. Every merge triggers an automated build and test run. Output: a verified, versioned artifact.</p></div>
<div class="card"><h4>Continuous Delivery</h4><p>Every change that passes CI is automatically prepared for release and is always deployable. A human presses the button to go to production.</p></div>
<div class="card"><h4>Continuous Deployment</h4><p>Every change that passes all automated stages goes to production automatically. No manual gate. Needs very strong tests and monitoring.</p></div>
<div class="card"><h4>Rule of thumb</h4><p>CI answers "does it build and pass tests?". Delivery answers "can we release right now?". Deployment answers "is it already released?".</p></div>
</div>

<div class="diagram">
<div class="diagram-label">flowchart — Integration, Delivery, Deployment</div>
<div class="mermaid">
flowchart LR
    C["Commit"] --> CI["CI\nbuild + unit tests + scan"]
    CI --> ART["Versioned artifact"]
    ART --> STG["Auto deploy to staging\nintegration tests"]
    STG --> GATE{"Manual approval?"}
    GATE -->|"Yes: Continuous Delivery"| H["Human clicks Deploy"] --> PROD["Production"]
    GATE -->|"No: Continuous Deployment"| PROD
</div>
</div>

<div class="tw"><table><thead><tr><th>Aspect</th><th>CI</th><th>Continuous Delivery</th><th>Continuous Deployment</th></tr></thead><tbody>
<tr><td>Automation ends at</td><td>Tested artifact</td><td>Release-ready in staging</td><td>Live in production</td></tr>
<tr><td>Production release</td><td>Not covered</td><td>Manual trigger</td><td>Automatic</td></tr>
<tr><td>Typical use</td><td>Every team</td><td>Regulated or enterprise (banks, approvals)</td><td>SaaS, web products</td></tr>
<tr><td>Needs</td><td>Unit tests</td><td>Full test suite + environments</td><td>Excellent tests, feature flags, monitoring, fast rollback</td></tr>
</tbody></table></div>

<div class="box note"><b>📝 Interview quick answer</b> "CI is merging often with automated build and test. Delivery means the product is always releasable with a manual approval to ship. Deployment removes that approval and ships every green change automatically."</div>

### DORA metrics - measuring delivery performance

DORA (DevOps Research and Assessment, from Google) identified four metrics that predict software delivery performance and business outcomes. Two measure <strong>speed</strong>, two measure <strong>stability</strong>.

<div class="tw"><table><thead><tr><th>Metric</th><th>Question</th><th>Elite benchmark (approx.)</th><th>How to measure</th></tr></thead><tbody>
<tr><td>Deployment frequency</td><td>How often do we deploy to production?</td><td>On demand, multiple per day</td><td>Count successful prod deploys per day or week</td></tr>
<tr><td>Lead time for changes</td><td>Commit to production, how long?</td><td>Less than 1 day</td><td>Commit timestamp vs deploy timestamp</td></tr>
<tr><td>Change failure rate</td><td>What % of deploys cause an incident or rollback?</td><td>0-15%</td><td>Failed deploys / total deploys</td></tr>
<tr><td>Time to restore (MTTR)</td><td>How long to recover from a production failure?</td><td>Less than 1 hour</td><td>Incident open to resolved</td></tr>
</tbody></table></div>

**Worked example:** in one month a team made 60 production deploys (frequency 2 per working day). 6 needed a rollback, so change failure rate = 6/60 = <strong>10%</strong>. Average commit-to-prod was 3 hours (lead time) and the average incident lasted 40 minutes (MTTR).

<div class="box info"><b>ℹ️ Speed and stability go together</b> DORA research shows elite teams are faster <em>and</em> more stable. Deploying small changes often lowers risk, it does not raise it. Do not use these as individual performance targets, only as team improvement signals.</div>

### The full CI/CD pipeline

A pipeline is a series of automated stages. Each stage is a quality gate: if it fails, the change stops and the author is told. Early stages are fast and cheap, later stages are slower and more expensive ("fail fast").

<div class="diagram">
<div class="diagram-label">flowchart — full pipeline</div>
<div class="mermaid">
flowchart LR
    DEV["👨‍💻 Commit"] -->|git push| SCM["📦 GitHub / GitLab"]
    SCM --> CI
    subgraph CI["⚙️ Continuous Integration"]
        direction TB
        B["🔨 Build"] --> UT["🧪 Unit tests"] --> SA["🔍 Static analysis"] --> SEC["🔒 Security scan"] --> ART["📦 Artifact"]
    end
    ART --> CD
    subgraph CD["🚀 Delivery / Deployment"]
        direction TB
        D1["Dev auto"] --> STG["Staging auto"] --> UAT["UAT manual approval"] --> PROD["🏁 Production"]
    end
    PROD --> MON["📊 Monitoring"]
    MON -->|alert| DEV
</div>
</div>

<div class="diagram">
<div class="diagram-label">flowchart — Delivery vs Deployment</div>
<div class="mermaid">
flowchart LR
    C["Commit"] --> T["Automated build + tests"]
    T --> DLV["Continuous Delivery\nmanual approval"] --> P1["Production"]
    T --> DPL["Continuous Deployment\nno manual gate"] --> P2["Production"]
</div>
</div>

<div class="tw"><table><thead><tr><th>Stage</th><th>Typical duration</th><th>Cost of failure</th><th>Who is told</th></tr></thead><tbody>
<tr><td>Build + unit tests</td><td>2-5 min</td><td>Very low (one commit)</td><td>Author</td></tr>
<tr><td>Static analysis + scan</td><td>2-5 min</td><td>Low</td><td>Author</td></tr>
<tr><td>Integration tests in staging</td><td>5-20 min</td><td>Medium</td><td>Team channel</td></tr>
<tr><td>Production deploy</td><td>2-10 min</td><td>High</td><td>On-call</td></tr>
</tbody></table></div>

### Pipeline stages explained, with example output

Every stage below shows what it does and what you would see in the log.

<div class="tw"><table><thead><tr><th>Stage</th><th>What happens</th><th>Tools</th><th>Fail = ?</th></tr></thead><tbody>
<tr><td><strong>Source</strong></td><td>Trigger on git push or PR merge, clone repo</td><td>GitHub, GitLab, Bitbucket</td><td>Pipeline does not start</td></tr>
<tr><td><strong>Build</strong></td><td>Compile code, run linters, build Docker image</td><td>Maven, Gradle, npm, Docker</td><td>Broken build, notify dev</td></tr>
<tr><td><strong>Unit Test</strong></td><td>Isolated unit tests with mocked dependencies</td><td>JUnit, Mockito, PyTest, Jest</td><td>Stop pipeline, report failures</td></tr>
<tr><td><strong>Static Analysis</strong></td><td>Code quality, coverage, smells</td><td>SonarQube, Checkstyle, ESLint</td><td>Fail if quality gate not met</td></tr>
<tr><td><strong>Security Scan</strong></td><td>Dependency vulnerability check, SAST</td><td>Snyk, OWASP Dependency-Check, Trivy</td><td>Block on high/critical CVEs</td></tr>
<tr><td><strong>Artifact</strong></td><td>Package JAR, build and push Docker image</td><td>Nexus, Artifactory, ECR, DockerHub</td><td>Retry or fail build</td></tr>
<tr><td><strong>Deploy Dev</strong></td><td>Auto-deploy to development environment</td><td>Kubernetes, ECS, Helm, Terraform</td><td>Rollback automatically</td></tr>
<tr><td><strong>Integration Test</strong></td><td>Real service interactions in staging</td><td>Postman/Newman, Selenium, RestAssured</td><td>Block promotion to UAT</td></tr>
<tr><td><strong>Deploy Prod</strong></td><td>Zero-downtime deploy</td><td>Blue/Green, Canary, Rolling</td><td>Rollback, incident alert</td></tr>
</tbody></table></div>

#### 1. Source stage

A commit or pull request triggers the pipeline. The CI server checks out the exact commit (not just "latest main") so the build is reproducible.

<pre data-lang="text"><code>Run actions/checkout@v4
Syncing repository: acme/payments-api
Fetching the repository
  git fetch --depth=1 origin +a1b2c3d4e5f6:refs/remotes/origin/main
HEAD is now at a1b2c3d Fix rounding bug in GST calculation</code></pre>

#### 2. Build stage

Compile the code and resolve dependencies. A cache for dependencies (Maven `~/.m2`, npm `~/.npm`) can cut build time from 6 minutes to 1.5.

<pre data-lang="text"><code>[INFO] Scanning for projects...
[INFO] Building payments-api 1.4.2-SNAPSHOT
[INFO] --- maven-compiler-plugin:3.11.0:compile ---
[INFO] Compiling 142 source files to target/classes
[INFO] BUILD SUCCESS
[INFO] Total time:  48.2 s</code></pre>

#### 3. Unit test stage

Unit tests run in memory in seconds. They must not touch a real database or network. Results are published as JUnit XML so the CI UI can show failures and trends.

<pre data-lang="text"><code>[INFO] Running com.acme.payments.GstCalculatorTest
[INFO] Tests run: 24, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.61 s
[INFO] Results:
[INFO] Tests run: 318, Failures: 0, Errors: 0, Skipped: 2
[INFO] Jacoco coverage: 82.4% lines (threshold 80%) - OK</code></pre>

#### 4. Static analysis stage

Analyses source without running it: bugs, code smells, duplicated code, coverage. A <strong>quality gate</strong> is a pass/fail rule such as "no new bugs, coverage on new code at least 80%".

<pre data-lang="text"><code>INFO: ANALYSIS SUCCESSFUL, you can find the results at:
      https://sonarcloud.io/dashboard?id=payments-api
Quality Gate: FAILED
  - New code coverage: 64.1% (required &gt;= 80%)
  - New bugs: 0   New vulnerabilities: 0
ERROR: Pipeline stopped, quality gate failed</code></pre>

#### 5. Security scan stage

Checks third-party libraries for known CVEs (SCA), and the code itself for patterns such as SQL injection (SAST). Container images are scanned too.

<pre data-lang="text"><code>$ trivy image --severity HIGH,CRITICAL --exit-code 1 payments-api:a1b2c3d
Total: 2 (HIGH: 1, CRITICAL: 1)
+-----------------+----------------+----------+-------------------+---------------+
|     LIBRARY     | VULNERABILITY  | SEVERITY | INSTALLED VERSION | FIXED VERSION |
+-----------------+----------------+----------+-------------------+---------------+
| log4j-core      | CVE-2021-44228 | CRITICAL | 2.14.1            | 2.17.1        |
| openssl         | CVE-2023-0286  | HIGH     | 3.0.2             | 3.0.8         |
+-----------------+----------------+----------+-------------------+---------------+
exit code 1 -&gt; pipeline FAILED</code></pre>

#### 6. Artifact stage

Package once, deploy many times. Build a Docker image tagged with the commit SHA and push it to a registry. Never rebuild for each environment.

<pre data-lang="text"><code>$ docker build -t 123456789.dkr.ecr.ap-south-1.amazonaws.com/payments-api:a1b2c3d .
$ docker push 123456789.dkr.ecr.ap-south-1.amazonaws.com/payments-api:a1b2c3d
a1b2c3d: digest: sha256:9f86d081884c7d659a2feaa0c55ad015 size: 1789</code></pre>

#### 7. Deploy and integration test stages

Deploy the artifact to dev or staging, wait for health, then run smoke and integration tests against the real deployed service.

<pre data-lang="text"><code>$ kubectl set image deployment/payments-api app=...payments-api:a1b2c3d -n staging
$ kubectl rollout status deployment/payments-api -n staging
Waiting for deployment "payments-api" rollout to finish: 1 of 3 updated replicas...
deployment "payments-api" successfully rolled out
$ newman run smoke.postman_collection.json --env-var host=staging.acme.in
 executed 12 requests, 0 failed  (iterations 1)</code></pre>

### Branching strategies and pipeline triggers

How you branch decides how often you integrate and what the pipeline does on each branch.

<div class="tw"><table><thead><tr><th>Strategy</th><th>Idea</th><th>CI/CD fit</th></tr></thead><tbody>
<tr><td>Trunk-based development</td><td>Everyone commits to <code>main</code> (or very short-lived branches under 1-2 days). Incomplete work hidden behind feature flags.</td><td>Best fit for CI/CD and DORA elite performance</td></tr>
<tr><td>GitHub Flow</td><td>Short feature branch, pull request, merge to main, deploy main.</td><td>Very good, simple</td></tr>
<tr><td>GitFlow</td><td>Long-lived <code>develop</code>, <code>release/*</code>, <code>hotfix/*</code> branches.</td><td>Works for scheduled releases, slows integration</td></tr>
</tbody></table></div>

<div class="diagram">
<div class="diagram-label">flowchart — what runs on which event</div>
<div class="mermaid">
flowchart TD
    E1["Push to feature branch"] --> P1["Build + unit tests + lint"]
    E2["Pull request opened"] --> P2["Build + all tests + scan\npost status on PR"]
    E3["Merge to main"] --> P3["Build + tests + publish artifact\ndeploy to staging"]
    E4["Git tag v1.2.0"] --> P4["Release pipeline\ndeploy to production"]
    E5["Nightly schedule"] --> P5["Full regression + dependency scan"]
</div>
</div>

**Triggers** start a pipeline: a git push or PR event (via webhook), a git tag, a cron schedule, a manual button (workflow_dispatch), or another pipeline finishing. Prefer webhooks to polling: polling git every 5 minutes wastes load and adds delay.

<div class="box tip"><b>✅ Protect main</b> Enable branch protection: require a passing pipeline, at least one review, and no direct pushes to <code>main</code>. The pipeline then acts as the gatekeeper.</div>

### The testing pyramid

Not all tests are equal. Many fast, cheap tests at the bottom and few slow, brittle tests at the top give fast feedback at low cost.

<div class="diagram">
<div class="diagram-label">flowchart — testing pyramid</div>
<div class="mermaid">
flowchart TD
    E2E["End-to-end UI tests\nfew, slow, brittle\nminutes"]
    INT["Integration and contract tests\nsome, medium\nseconds each"]
    UNIT["Unit tests\nmany, fast, isolated\nmilliseconds each"]
    E2E --- INT --- UNIT
</div>
</div>

<div class="tw"><table><thead><tr><th>Level</th><th>Scope</th><th>Example</th><th>Where in pipeline</th><th>Share</th></tr></thead><tbody>
<tr><td>Unit</td><td>One class or function, dependencies mocked</td><td>Test GST calculator returns 18% of 1000 = 180</td><td>CI, every commit</td><td>~70%</td></tr>
<tr><td>Integration</td><td>Several components, real DB via Testcontainers</td><td>Repository saves an order and reads it back</td><td>CI or staging</td><td>~20%</td></tr>
<tr><td>Contract</td><td>Agreement between two services</td><td>Pact test: consumer expects field <code>amount</code> as number</td><td>CI</td><td>small</td></tr>
<tr><td>End-to-end</td><td>Whole system via UI or API</td><td>Selenium logs in, places order, sees receipt</td><td>Staging after deploy</td><td>~10%</td></tr>
<tr><td>Smoke</td><td>Is the deployed app alive?</td><td><code>GET /health</code> returns 200</td><td>After every deploy</td><td>tiny</td></tr>
</tbody></table></div>

<div class="box warn"><b>⚠️ Ice-cream cone anti-pattern</b> Many UI tests, few unit tests. Builds take an hour, tests are flaky, and developers stop trusting red builds. A <strong>flaky test</strong> (passes and fails randomly) must be fixed or quarantined immediately.</div>

### Artifacts and versioning

An <strong>artifact</strong> is the immutable output of the build: a JAR, a wheel, an npm package, or most commonly a Docker image. The principle is <strong>build once, deploy everywhere</strong>: the exact same binary that passed staging tests goes to production, only configuration changes.

<div class="diagram">
<div class="diagram-label">flowchart — build once, promote the same artifact</div>
<div class="mermaid">
flowchart LR
    SRC["Commit a1b2c3d"] --> BUILD["Build once"] --> REG["Registry\nimage a1b2c3d"]
    REG --> DEV["Dev\nconfig dev"]
    REG --> STG["Staging\nconfig stg"]
    REG --> PRD["Production\nconfig prod"]
</div>
</div>

Versioning options:

<div class="tw"><table><thead><tr><th>Scheme</th><th>Example</th><th>Notes</th></tr></thead><tbody>
<tr><td>Semantic versioning</td><td><code>2.4.1</code> (MAJOR.MINOR.PATCH)</td><td>MAJOR breaking, MINOR new feature, PATCH bug fix. Good for libraries.</td></tr>
<tr><td>Git SHA</td><td><code>a1b2c3d</code></td><td>Unique, traceable to exact source. Best for services.</td></tr>
<tr><td>Build number</td><td><code>build-482</code></td><td>Simple, but ties to one CI server.</td></tr>
<tr><td>Combined</td><td><code>2.4.1-a1b2c3d</code></td><td>Human readable plus traceable.</td></tr>
</tbody></table></div>

<div class="box warn"><b>⚠️ Never deploy <code>:latest</code></b> It is mutable, so you cannot tell what is running or roll back to it. Always deploy an immutable tag (SHA) or even a digest (<code>@sha256:...</code>).</div>

Artifact repositories (Nexus, JFrog Artifactory, GitHub Packages, ECR, Docker Hub) store artifacts, apply retention policies (keep last 20 snapshots, keep all releases forever) and can scan them for vulnerabilities.

### Environments and promotion

An <strong>environment</strong> is a place the app runs with its own config and data. A change is <strong>promoted</strong> from one to the next only after passing that environment's gate.

<div class="diagram">
<div class="diagram-label">flowchart — environment promotion</div>
<div class="mermaid">
flowchart LR
    ART["Artifact a1b2c3d"] --> DEV["Dev\nauto deploy\nsmoke test"]
    DEV --> STG["Staging\nauto deploy\nintegration + perf tests"]
    STG --> UAT["UAT / Pre-prod\nmanual approval\nbusiness sign-off"]
    UAT --> PRD["Production\nstrategy: canary or blue green"]
</div>
</div>

<div class="tw"><table><thead><tr><th>Environment</th><th>Purpose</th><th>Data</th><th>Deploy</th></tr></thead><tbody>
<tr><td>Dev</td><td>Developers integrate, quick checks</td><td>Fake / seed</td><td>Every merge</td></tr>
<tr><td>Staging / QA</td><td>Production-like testing</td><td>Anonymised copy</td><td>Every merge</td></tr>
<tr><td>UAT / Pre-prod</td><td>Business acceptance, final rehearsal</td><td>Production-like</td><td>Approval</td></tr>
<tr><td>Production</td><td>Real users</td><td>Real</td><td>Approval or automatic</td></tr>
</tbody></table></div>

Rules: keep staging as close to production as possible (same OS, same versions, same infra code); inject environment differences through configuration (env vars, ConfigMaps, parameter store), never by rebuilding the artifact; protect production with required reviewers.

### Deployment strategies

A strategy defines how new code replaces old code in production. The trade-off is always between <strong>risk, downtime, cost and complexity</strong>.

<div class="diagram">
<div class="diagram-label">flowchart — deployment strategies overview</div>
<div class="mermaid">
flowchart TD
    STRAT["🚀 Deployment Strategies"]
    STRAT --> REC["♻️ Recreate\nStop all v1 then start all v2\nSimple but downtime"]
    STRAT --> ROLL["🔄 Rolling Update\nReplace instances one by one\nNo downtime, mixed versions briefly"]
    STRAT --> BG["🔵🟢 Blue/Green\nRun v2 alongside v1\nSwitch traffic instantly\nInstant rollback, 2x infra cost"]
    STRAT --> CAN["🐦 Canary\nSend 5% then 20% then 100% traffic\nGradual risk, complex monitoring"]
    STRAT --> AB["🅰️🅱️ A/B Testing\nRoute by user segment\nFor feature experiments"]
</div>
</div>

#### Recreate

Stop every v1 instance, then start v2. There is a gap with no service. Acceptable for internal tools, batch jobs, or when v1 and v2 cannot coexist (for example an incompatible schema change).

<div class="diagram">
<div class="diagram-label">flowchart — recreate</div>
<div class="mermaid">
flowchart LR
    A["v1 x3 running"] --> B["Stop all v1\nDOWNTIME"] --> C["Start v2 x3"] --> D["v2 x3 running"]
</div>
</div>

<pre data-lang="yaml"><code># Kubernetes
spec:
  strategy:
    type: Recreate     # kill all old pods first, then create new ones</code></pre>

**Example:** a nightly reporting service is redeployed at 2 AM; 30 seconds of downtime is fine. Cost: lowest. Rollback: redeploy v1 (downtime again).

#### Rolling update

Replace instances gradually: start one v2, wait until healthy, stop one v1, repeat. The default in Kubernetes. Capacity stays mostly intact. During the rollout both versions serve traffic, so they must be backward compatible.

<div class="diagram">
<div class="diagram-label">flowchart — rolling update, 4 instances</div>
<div class="mermaid">
flowchart LR
    S1["v1 v1 v1 v1"] --> S2["v2 v1 v1 v1"] --> S3["v2 v2 v1 v1"] --> S4["v2 v2 v2 v1"] --> S5["v2 v2 v2 v2"]
</div>
</div>

<pre data-lang="yaml"><code>spec:
  replicas: 4
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1          # up to 1 extra pod above 4 during rollout
      maxUnavailable: 0    # never drop below 4 healthy pods
  template:
    spec:
      containers:
        - name: app
          image: acme/payments-api:a1b2c3d
          readinessProbe:  # new pod gets traffic only when ready
            httpGet: { path: /health, port: 8080 }</code></pre>

**Example output:**

<pre data-lang="text"><code>$ kubectl rollout status deploy/payments-api
Waiting for deployment "payments-api" rollout to finish: 2 out of 4 new replicas have been updated...
Waiting for deployment "payments-api" rollout to finish: 3 of 4 updated replicas are available...
deployment "payments-api" successfully rolled out</code></pre>

Rollback: `kubectl rollout undo deploy/payments-api` (another rolling update back to v1, takes minutes).

#### Blue/Green

Keep two identical environments. Blue serves live traffic with v1. Deploy v2 to idle Green, test it with no user impact, then flip the router/load balancer to Green. Blue stays on standby for instant rollback.

<div class="diagram">
<div class="diagram-label">flowchart — blue green</div>
<div class="mermaid">
flowchart LR
    U["Users"] --> LB["Load balancer / router"]
    LB -->|"live traffic"| BLUE["Blue v1\nlive"]
    LB -.->|"after switch"| GREEN["Green v2\ntested, idle"]
    DB[("Shared database")] --- BLUE
    DB --- GREEN
</div>
</div>

<pre data-lang="bash"><code># Kubernetes: two deployments, one Service. Switch by changing the selector.
kubectl apply -f deploy-green.yaml                 # v2 running, no traffic yet
kubectl run curl --rm -it --image=curlimages/curl -- curl http://payments-green/health
kubectl patch svc payments -p '{"spec":{"selector":{"app":"payments","slot":"green"}}}'
# instant rollback:
kubectl patch svc payments -p '{"spec":{"selector":{"app":"payments","slot":"blue"}}}'</code></pre>

**Pros:** zero downtime, instant rollback, full pre-production test on real infra. **Cons:** double infrastructure cost during the switch; the database must work with both versions, so use <strong>expand/contract</strong> migrations (add new column first, remove the old one in a later release).

#### Canary

Send a small share of real traffic (say 5%) to v2 while the rest stays on v1. Watch error rate and latency. If healthy, increase to 25%, 50%, 100%. If not, send everything back to v1; only 5% of users were affected.

<div class="diagram">
<div class="diagram-label">flowchart — canary</div>
<div class="mermaid">
flowchart LR
    U["Users"] --> LB["Router"]
    LB -->|"95%"| V1["v1 stable"]
    LB -->|"5% then 25% then 100%"| V2["v2 canary"]
    V2 --> M["Metrics: errors, latency"]
    M -->|"healthy: promote"| LB
    M -->|"bad: rollback"| V1
</div>
</div>

<pre data-lang="yaml"><code># Argo Rollouts example
apiVersion: argoproj.io/v1alpha1
kind: Rollout
metadata:
  name: payments-api
spec:
  replicas: 10
  strategy:
    canary:
      steps:
        - setWeight: 5
        - pause: { duration: 10m }     # watch metrics
        - setWeight: 25
        - pause: { duration: 10m }
        - setWeight: 50
        - pause: {}                    # wait for manual promote
  selector:
    matchLabels: { app: payments-api }
  template:
    metadata:
      labels: { app: payments-api }
    spec:
      containers:
        - name: app
          image: acme/payments-api:a1b2c3d</code></pre>

**Example:** a bug causes 3% of requests to fail in v2. At 5% canary weight overall error rate rises from 0.1% to about 0.25%; an automated analysis (Prometheus query) detects it and aborts. Blast radius: 5% of users for 10 minutes instead of 100%.

#### A/B testing

Similar mechanics to canary but the goal is <strong>measuring business behaviour</strong>, not safety. Users are routed by segment (country, cookie, user id) to variant A or B, and conversion is compared. Usually done with feature flags.

<div class="tw"><table><thead><tr><th>Strategy</th><th>Downtime</th><th>Rollback speed</th><th>Extra cost</th><th>Risk exposure</th><th>Best for</th></tr></thead><tbody>
<tr><td>Recreate</td><td>Yes</td><td>Slow</td><td>None</td><td>All users</td><td>Dev, batch, incompatible versions</td></tr>
<tr><td>Rolling</td><td>No</td><td>Minutes</td><td>Small (surge)</td><td>Grows during rollout</td><td>Default for stateless services</td></tr>
<tr><td>Blue/Green</td><td>No</td><td>Instant</td><td>2x during switch</td><td>All at once after flip</td><td>Critical systems needing instant rollback</td></tr>
<tr><td>Canary</td><td>No</td><td>Fast</td><td>Small</td><td>Small, controlled</td><td>High-traffic services with good metrics</td></tr>
</tbody></table></div>

### Rollback strategies

Failures will happen; what matters is how quickly you recover (MTTR). Plan the rollback before the deploy.

<div class="diagram">
<div class="diagram-label">flowchart — rollback decision</div>
<div class="mermaid">
flowchart TD
    D["Deploy done"] --> H{"Health checks and\nerror rate OK?"}
    H -->|"Yes"| OK["Keep, promote"]
    H -->|"No"| T{"Quick fix possible?"}
    T -->|"Flag-related"| FF["Turn feature flag off"]
    T -->|"Code bug"| RB["Roll back to previous artifact"]
    T -->|"Data issue"| DB["Restore or forward-fix, runbook"]
    RB --> V["Verify and post-mortem"]
    FF --> V
</div>
</div>

<div class="tw"><table><thead><tr><th>Method</th><th>How</th><th>Speed</th></tr></thead><tbody>
<tr><td>Redeploy previous artifact</td><td>Pipeline with the old SHA as parameter. Immutable artifacts make this safe.</td><td>Minutes</td></tr>
<tr><td>Kubernetes undo</td><td><code>kubectl rollout undo deploy/app</code> or <code>helm rollback app 12</code></td><td>Minutes</td></tr>
<tr><td>Blue/Green switch back</td><td>Point router to old slot</td><td>Seconds</td></tr>
<tr><td>Feature flag off</td><td>Disable flag in the flag service</td><td>Seconds</td></tr>
<tr><td>Git revert + pipeline</td><td>Revert commit, normal pipeline deploys</td><td>10-20 min</td></tr>
</tbody></table></div>

<pre data-lang="bash"><code>$ helm history payments-api
REVISION  STATUS      CHART             DESCRIPTION
11        superseded  payments-1.4.1    Upgrade complete
12        deployed    payments-1.4.2    Upgrade complete   &lt;- bad
$ helm rollback payments-api 11
Rollback was a success! Happy Helming!</code></pre>

<div class="box warn"><b>⚠️ Databases do not roll back like code</b> A dropped column cannot be un-dropped. Make schema changes backward compatible (expand/contract) so the previous app version still works with the new schema. Prefer <strong>roll forward</strong> with a fix when data has already changed.</div>

### Feature flags (feature toggles)

A feature flag is an if-statement controlled by remote config. It <strong>separates deployment from release</strong>: code ships to production switched off, then is turned on for 1%, 10%, 100% of users, or only for internal staff, without a new deploy.

<pre data-lang="python"><code>if flags.is_enabled("new-upi-checkout", user_id=user.id):
    return new_checkout(cart)      # new code path
else:
    return old_checkout(cart)      # safe fallback

# Flag service config
# new-upi-checkout: enabled for 10% of users, plus employees
# Kill switch: set to 0% -&gt; instantly back to old path, no deploy</code></pre>

<div class="diagram">
<div class="diagram-label">flowchart — deploy vs release with flags</div>
<div class="mermaid">
flowchart LR
    M["Merge to main"] --> D["Deploy to prod\nflag OFF"] --> R1["Enable for staff"] --> R2["Enable 10%"] --> R3["Enable 100%"] --> C["Remove flag and old code"]
    R2 -->|"problem"| K["Kill switch: flag OFF"]
</div>
</div>

Types: release flags (short-lived), experiment flags (A/B), ops flags (kill switches), permission flags (premium users). Tools: LaunchDarkly, Unleash, Flagsmith, AWS AppConfig. <strong>Pitfall:</strong> stale flags become technical debt; track an owner and an expiry date and delete them after rollout.

### Secrets management

Secrets (API keys, DB passwords, tokens, certificates) must never be in source code, images, or logs. Once in git history they are compromised even if deleted.

<div class="tw"><table><thead><tr><th>Do</th><th>Do not</th></tr></thead><tbody>
<tr><td>Store in a secret manager: HashiCorp Vault, AWS Secrets Manager, Azure Key Vault, GCP Secret Manager</td><td>Commit <code>.env</code> or <code>application.properties</code> with passwords</td></tr>
<tr><td>Use CI secret store (GitHub Secrets, GitLab masked variables, Jenkins credentials), masked in logs</td><td>Echo secrets or pass them in command lines that appear in logs</td></tr>
<tr><td>Prefer short-lived credentials via OIDC (CI gets a temporary cloud role, no stored key)</td><td>Use long-lived admin keys with wide scope</td></tr>
<tr><td>Rotate regularly, least privilege per environment</td><td>Share one secret across dev and prod</td></tr>
<tr><td>Scan commits (gitleaks, trufflehog, GitHub secret scanning)</td><td>Bake secrets into Docker image layers</td></tr>
</tbody></table></div>

<div class="diagram">
<div class="diagram-label">sequenceDiagram — OIDC keyless cloud access from CI</div>
<div class="mermaid">
sequenceDiagram
    participant CI as "CI job"
    participant IDP as "CI OIDC provider"
    participant AWS as "AWS STS"
    participant SVC as "AWS service"
    CI->>IDP: Request identity token for this repo and branch
    IDP-->>CI: Signed JWT
    CI->>AWS: AssumeRoleWithWebIdentity with JWT
    AWS-->>CI: Temporary credentials 1 hour
    CI->>SVC: Push image or deploy using temporary credentials
</div>
</div>

<div class="box tip"><b>✅ Leaked secret?</b> Revoke and rotate immediately, then clean history. Rewriting git history alone is not enough because the secret may already have been cloned.</div>

### Infrastructure as Code in pipelines

IaC defines servers, networks and databases as versioned code (Terraform, CloudFormation, Pulumi, Ansible) so infrastructure follows the same review and pipeline process as application code. The pipeline runs <code>plan</code> on a pull request so reviewers see what will change, and <code>apply</code> after merge.

<div class="diagram">
<div class="diagram-label">flowchart — Terraform in a pipeline</div>
<div class="mermaid">
flowchart LR
    PR["Pull request"] --> FMT["terraform fmt + validate"] --> PLAN["terraform plan\ncomment on PR"] --> REV["Review"] --> MRG["Merge"] --> APPLY["terraform apply\napproval gate"] --> STATE["Remote state S3 + lock"]
</div>
</div>

<pre data-lang="yaml"><code># snippet of a GitHub Actions job
  terraform:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: hashicorp/setup-terraform@v3
      - run: terraform init
      - run: terraform fmt -check
      - run: terraform validate
      - run: terraform plan -out=tfplan
      - run: terraform apply -auto-approve tfplan
        if: github.ref == 'refs/heads/main'</code></pre>

<pre data-lang="text"><code>Plan: 2 to add, 1 to change, 0 to destroy.
  + aws_security_group.payments_api
  + aws_ecs_service.payments_api
  ~ aws_lb_target_group.api  (health_check.path: "/" -&gt; "/health")</code></pre>

Key practices: remote state with locking (S3 + DynamoDB), separate state per environment, policy-as-code (OPA/Sentinel, checkov) to block unsafe changes, and review every plan that has <code>destroy</code> in it.

### GitOps and ArgoCD

GitOps makes <strong>Git the single source of truth for the desired state</strong> of the running system. Instead of the pipeline pushing changes to the cluster (push model), an agent inside the cluster (ArgoCD, Flux) continuously compares the cluster with a Git repo and pulls changes (pull model). Drift is detected and corrected.

<div class="diagram">
<div class="diagram-label">flowchart — GitOps with ArgoCD</div>
<div class="mermaid">
flowchart LR
    DEV["Developer"] --> APP["App repo"]
    APP --> CI["CI pipeline\nbuild, test, push image"]
    CI -->|"update image tag"| CFG["Config repo\nK8s manifests / Helm values"]
    CFG --> ARGO["ArgoCD in cluster\ncompares and syncs"]
    ARGO --> K8S["Kubernetes cluster"]
    K8S -.->|"drift detected"| ARGO
</div>
</div>

<pre data-lang="yaml"><code>apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: payments-api
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/acme/config-repo.git
    targetRevision: main
    path: apps/payments-api/overlays/prod
  destination:
    server: https://kubernetes.default.svc
    namespace: payments
  syncPolicy:
    automated:
      prune: true        # delete resources removed from git
      selfHeal: true     # revert manual kubectl changes
    syncOptions: [CreateNamespace=true]</code></pre>

<pre data-lang="text"><code>$ argocd app get payments-api
Name:               payments-api
Sync Status:        Synced to main (9d3e1f2)
Health Status:      Healthy
GROUP  KIND        NAME           STATUS  HEALTH
apps   Deployment  payments-api   Synced  Healthy
       Service     payments-api   Synced  Healthy</code></pre>

**Benefits:** full audit trail (git log), rollback = `git revert`, cluster credentials never leave the cluster, drift correction. **Typical split:** CI (GitHub Actions/Jenkins) builds and tests; CD (ArgoCD) deploys.

### GitHub Actions - full workflow explained line by line

GitHub Actions runs workflows defined in <code>.github/workflows/*.yml</code>. A <strong>workflow</strong> contains <strong>jobs</strong>; each job runs on a <strong>runner</strong> (VM) and contains <strong>steps</strong> (shell commands or reusable <strong>actions</strong>). Jobs run in parallel unless linked with <code>needs</code>.

<div class="diagram">
<div class="diagram-label">flowchart — workflow structure</div>
<div class="mermaid">
flowchart LR
    EV["Event: push or PR"] --> WF["Workflow YAML"]
    WF --> J1["Job build-test\nrunner ubuntu"]
    J1 -->|"needs"| J2["Job docker\nonly on main"]
    J2 -->|"needs"| J3["Job deploy\nenvironment production approval"]
</div>
</div>

{% raw %}
<pre data-lang="yaml"><code># .github/workflows/ci-cd.yml
name: CI/CD Pipeline                      # (1) display name in the Actions tab

on:                                       # (2) triggers
  push:
    branches: [main, develop]             #     run on push to these branches
  pull_request:
    branches: [main]                      #     and on PRs targeting main
  workflow_dispatch:                      #     manual "Run workflow" button

permissions:                              # (3) least privilege for GITHUB_TOKEN
  contents: read
  id-token: write                         #     needed for OIDC to AWS

concurrency:                              # (4) cancel older runs on same branch
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

env:                                      # (5) workflow-wide variables
  AWS_REGION: ap-south-1

jobs:
  build-test:                             # (6) job id
    runs-on: ubuntu-latest                #     runner image
    steps:
      - uses: actions/checkout@v4         # (7) reusable action: clone repo

      - name: Set up JDK 17
        uses: actions/setup-java@v4
        with:                             #     inputs to the action
          java-version: '17'
          distribution: 'temurin'
          cache: maven                    #     built-in dependency caching

      - name: Build and Test
        run: mvn -B clean verify          # (8) shell command, -B = batch mode

      - name: Publish test report
        if: always()                      # (9) run even when tests fail
        uses: actions/upload-artifact@v4
        with:
          name: surefire-reports
          path: target/surefire-reports

      - name: SonarCloud analysis
        run: mvn -B sonar:sonar
        env:
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}   # (10) secret, masked in logs

  docker:
    needs: build-test                     # (11) wait for previous job
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'   # (12) condition: only main
    outputs:
      image: ${{ steps.meta.outputs.image }}   # (13) pass data to later jobs
    steps:
      - uses: actions/checkout@v4

      - uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::123456789012:role/gha-ecr-push
          aws-region: ${{ env.AWS_REGION }}   # OIDC, no stored keys

      - name: Login to ECR
        uses: aws-actions/amazon-ecr-login@v2

      - name: Build and push image
        id: meta                          # (14) step id for outputs
        run: |
          IMAGE=${{ secrets.ECR_REGISTRY }}/myapp:${{ github.sha }}
          docker build -t $IMAGE .
          docker push $IMAGE
          echo "image=$IMAGE" >> $GITHUB_OUTPUT

  deploy:
    needs: docker
    runs-on: ubuntu-latest
    environment: production               # (15) protection rules: required reviewers
    steps:
      - uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::123456789012:role/gha-ecs-deploy
          aws-region: ${{ env.AWS_REGION }}
      - name: Deploy to ECS
        run: |
          aws ecs update-service \
            --cluster prod-cluster \
            --service myapp \
            --force-new-deployment
          aws ecs wait services-stable --cluster prod-cluster --services myapp
</code></pre>
{% endraw %}

<div class="tw"><table><thead><tr><th>Concept</th><th>Meaning</th></tr></thead><tbody>
<tr><td><code>on</code></td><td>Events that start the workflow (push, pull_request, schedule, workflow_dispatch, release)</td></tr>
<tr><td><code>jobs.&lt;id&gt;.runs-on</code></td><td>Runner: GitHub-hosted (ubuntu-latest, windows-latest) or self-hosted with labels</td></tr>
<tr><td><code>needs</code></td><td>Job dependency, creates the stage ordering</td></tr>
<tr><td><code>uses</code> vs <code>run</code></td><td><code>uses</code> calls a packaged action, <code>run</code> executes a shell script</td></tr>
<tr><td><code>secrets.*</code></td><td>Encrypted repo/org/environment secrets</td></tr>
<tr><td><code>environment</code></td><td>Named target with approvals, secrets and wait timers</td></tr>
<tr><td><code>matrix</code></td><td>Run the same job across versions: <code>java: [11, 17, 21]</code></td></tr>
<tr><td><code>cache</code> / artifacts</td><td>Cache speeds builds; artifacts pass files between jobs or keep reports</td></tr>
</tbody></table></div>

<div class="box tip"><b>✅ Pin actions</b> Prefer a commit SHA for third-party actions (<code>uses: owner/action@3f2a...</code>) to avoid supply-chain attacks through a moved tag.</div>

### GitLab CI example

GitLab CI uses a single <code>.gitlab-ci.yml</code> at the repo root. Jobs belong to <strong>stages</strong>; stages run in order, jobs in the same stage run in parallel on <strong>runners</strong>.

<pre data-lang="yaml"><code>stages: [build, test, package, deploy]

variables:
  MAVEN_OPTS: "-Dmaven.repo.local=.m2/repository"

cache:
  key: "$CI_COMMIT_REF_SLUG"
  paths: [.m2/repository]

build:
  stage: build
  image: maven:3.9-eclipse-temurin-17
  script:
    - mvn -B clean package -DskipTests
  artifacts:
    paths: [target/*.jar]
    expire_in: 1 week

unit-test:
  stage: test
  image: maven:3.9-eclipse-temurin-17
  script:
    - mvn -B test
  artifacts:
    when: always
    reports:
      junit: target/surefire-reports/*.xml

docker-image:
  stage: package
  image: docker:24
  services: [docker:24-dind]
  rules:
    - if: $CI_COMMIT_BRANCH == "main"
  script:
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
    - docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHORT_SHA .
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHORT_SHA

deploy-prod:
  stage: deploy
  environment: production
  rules:
    - if: $CI_COMMIT_BRANCH == "main"
      when: manual              # manual gate = continuous delivery
  script:
    - kubectl set image deployment/app app=$CI_REGISTRY_IMAGE:$CI_COMMIT_SHORT_SHA</code></pre>

<div class="tw"><table><thead><tr><th>GitLab keyword</th><th>Meaning</th><th>GitHub Actions equivalent</th></tr></thead><tbody>
<tr><td><code>stages</code></td><td>Ordered groups</td><td><code>needs</code> between jobs</td></tr>
<tr><td><code>script</code></td><td>Commands to run</td><td><code>steps.run</code></td></tr>
<tr><td><code>rules</code> / <code>only</code></td><td>When the job runs</td><td><code>if</code></td></tr>
<tr><td><code>artifacts</code></td><td>Files passed to later jobs</td><td><code>upload-artifact</code></td></tr>
<tr><td><code>when: manual</code></td><td>Approval click</td><td>Environment required reviewers</td></tr>
</tbody></table></div>

### CI/CD tools comparison

<div class="tw"><table><thead><tr><th>Tool</th><th>Type</th><th>Best For</th><th>Config File</th></tr></thead><tbody>
<tr><td><strong>Jenkins</strong></td><td>Self-hosted</td><td>Enterprise, complex pipelines, full control</td><td><code>Jenkinsfile</code></td></tr>
<tr><td><strong>GitHub Actions</strong></td><td>Cloud-native</td><td>GitHub repos, open source, quick setup</td><td><code>.github/workflows/*.yml</code></td></tr>
<tr><td><strong>GitLab CI</strong></td><td>Cloud + self-hosted</td><td>GitLab repos, built-in container registry</td><td><code>.gitlab-ci.yml</code></td></tr>
<tr><td><strong>AWS CodePipeline</strong></td><td>Cloud (AWS)</td><td>AWS-native deployments, ECS, Lambda, EC2</td><td>Console / CloudFormation</td></tr>
<tr><td><strong>CircleCI</strong></td><td>Cloud</td><td>Fast builds, parallelism, orbs marketplace</td><td><code>.circleci/config.yml</code></td></tr>
<tr><td><strong>ArgoCD</strong></td><td>GitOps (K8s)</td><td>Kubernetes deployments via GitOps</td><td>Git repo = source of truth</td></tr>
<tr><td><strong>Azure DevOps</strong></td><td>Cloud + self-hosted</td><td>Microsoft shops, boards + repos + pipelines</td><td><code>azure-pipelines.yml</code></td></tr>
</tbody></table></div>

**How to choose:** where is your code (GitHub then Actions, GitLab then GitLab CI)? Need on-premises control or very custom workflows (Jenkins)? Kubernetes-native deployments (ArgoCD for CD)? Cloud lock-in tolerance (CodePipeline)? Team skills and maintenance budget matter more than feature lists.

### Pipeline security (DevSecOps)

DevSecOps "shifts security left": check security at every stage instead of at the end. Also protect the pipeline itself because it holds the keys to production.

<div class="diagram">
<div class="diagram-label">flowchart — security checks across the pipeline</div>
<div class="mermaid">
flowchart LR
    A["Pre-commit\nsecret scan, lint"] --> B["Build\nSAST: SonarQube, Semgrep"]
    B --> C["Dependencies\nSCA: Snyk, Dependabot"]
    C --> D["Image\nTrivy scan, sign with cosign"]
    D --> E["Deploy\nIaC scan, policy as code"]
    E --> F["Runtime\nDAST, monitoring, WAF"]
</div>
</div>

<div class="tw"><table><thead><tr><th>Technique</th><th>What it finds</th><th>Example tool</th></tr></thead><tbody>
<tr><td>Secret scanning</td><td>Keys or passwords in commits</td><td>gitleaks, trufflehog</td></tr>
<tr><td>SAST</td><td>Insecure code patterns (SQL injection) without running</td><td>SonarQube, Semgrep, CodeQL</td></tr>
<tr><td>SCA</td><td>Vulnerable open-source dependencies</td><td>Snyk, OWASP Dependency-Check, Dependabot</td></tr>
<tr><td>Container scan</td><td>CVEs in base image and packages</td><td>Trivy, Grype</td></tr>
<tr><td>IaC scan</td><td>Open S3 bucket, 0.0.0.0/0 security group</td><td>checkov, tfsec</td></tr>
<tr><td>DAST</td><td>Vulnerabilities in the running app</td><td>OWASP ZAP</td></tr>
<tr><td>SBOM and signing</td><td>Know and verify what you ship (supply chain)</td><td>Syft, cosign, SLSA provenance</td></tr>
</tbody></table></div>

Pipeline hardening: least-privilege tokens, ephemeral runners, pinned actions and base images, required reviews on pipeline file changes, no secrets on pull requests from forks, and separation between the people who write code and who can approve production.

<div class="box warn"><b>⚠️ The pipeline is an attack target</b> Compromising CI means attackers can ship malicious code with a trusted signature (SolarWinds-style attacks). Treat pipeline config as production-critical code.</div>

### Monitoring and the feedback loop

Delivery does not end at deploy. Monitoring closes the loop: production behaviour feeds back into planning and automated rollback.

<div class="diagram">
<div class="diagram-label">flowchart — feedback loop</div>
<div class="mermaid">
flowchart LR
    PLAN["Plan"] --> CODE["Code"] --> BUILD["Build and test"] --> REL["Release"] --> DEP["Deploy"] --> OPS["Operate"] --> MON["Monitor"]
    MON -->|"metrics, logs, alerts, user feedback"| PLAN
    MON -->|"SLO breach"| RB["Auto rollback"]
</div>
</div>

- <strong>Metrics</strong> (Prometheus, CloudWatch, Datadog): the four golden signals - latency, traffic, errors, saturation.
- <strong>Logs</strong> (ELK, Loki, CloudWatch Logs) and <strong>traces</strong> (OpenTelemetry, Jaeger).
- <strong>Alerts</strong> on SLO violations route to on-call (PagerDuty, Opsgenie).
- <strong>Post-deploy verification</strong>: pipeline waits 5 minutes after deploy, queries error rate, and rolls back automatically if it exceeds 1%.
- Annotate dashboards with deploy markers so you can see "errors rose right after v1.4.2".
- Run <strong>blameless post-mortems</strong> and turn findings into pipeline checks.

### Best practices

<div class="box tip"><b>✅ CI Best Practices</b>
<ul>
<li>Keep build under <strong>10 minutes</strong> - long builds discourage frequent commits</li>
<li>Fix broken builds <strong>immediately</strong> - broken main blocks everyone</li>
<li>Commit small, frequent changes - easier to bisect failures</li>
<li>Run tests in <strong>parallel</strong> - split unit/integration test suites</li>
<li>Cache dependencies (Maven, npm, pip) - dramatically speeds up builds</li>
</ul>
</div>

<div class="box warn"><b>⚠️ CD Best Practices</b>
<ul>
<li>Use <strong>environment-specific configs</strong> - inject via env vars, not hardcoded</li>
<li>Never deploy on Friday afternoon - no one to watch overnight</li>
<li>Always have a <strong>rollback plan</strong> - one-click rollback to last good version</li>
<li>Gate with <strong>smoke tests</strong> after every deploy before promoting</li>
<li>Keep secrets in <strong>Secrets Manager</strong> / GitHub Secrets - never in code</li>
</ul>
</div>

<div class="box info"><b>ℹ️ More practices</b>
<ul>
<li>Pipeline as code, versioned with the app</li>
<li>Build once, promote the same immutable artifact</li>
<li>Same deployment process for every environment</li>
<li>Fail fast: cheap checks first</li>
<li>Make pipelines idempotent and re-runnable</li>
<li>Measure DORA metrics and improve continuously</li>
</ul>
</div>

### Interview Q&A

<div class="g2">
<div class="card"><h4>Q: CI vs Continuous Delivery vs Continuous Deployment?</h4><p>CI: merge often, automated build and tests. Delivery: always releasable, manual approval to production. Deployment: every passing change goes to production automatically.</p></div>
<div class="card"><h4>Q: What are the DORA metrics?</h4><p>Deployment frequency, lead time for changes, change failure rate, and time to restore service (MTTR). Two for speed, two for stability.</p></div>
<div class="card"><h4>Q: Blue/Green vs Canary?</h4><p>Blue/Green switches all traffic at once between two full environments with instant rollback but 2x cost. Canary shifts traffic gradually to limit blast radius, needs good metrics.</p></div>
<div class="card"><h4>Q: Why build the artifact once?</h4><p>What you tested is exactly what you ship. Rebuilding per environment can produce different binaries and hidden bugs.</p></div>
<div class="card"><h4>Q: How do you handle secrets in a pipeline?</h4><p>Secret manager or CI secret store, masked in logs, short-lived OIDC credentials, least privilege, rotation, and secret scanning on commits.</p></div>
<div class="card"><h4>Q: What is GitOps?</h4><p>Git holds the desired state; an in-cluster agent such as ArgoCD pulls and reconciles, corrects drift and gives audit and easy rollback via git revert.</p></div>
<div class="card"><h4>Q: How do you roll back a bad release?</h4><p>Redeploy the previous immutable artifact, kubectl or helm rollback, switch blue/green back, or disable the feature flag. Database changes must be backward compatible.</p></div>
<div class="card"><h4>Q: How do you speed up a slow pipeline?</h4><p>Cache dependencies, parallelise tests, run cheap checks first, use incremental builds and bigger runners, delete flaky tests, split monolith builds.</p></div>
<div class="card"><h4>Q: What is a quality gate?</h4><p>An automated pass/fail rule on metrics such as coverage, new bugs or CVE severity that blocks promotion when not met.</p></div>
<div class="card"><h4>Q: What is a flaky test and what do you do?</h4><p>A test with non-deterministic results. Quarantine it, find the cause (timing, shared state, external call), fix or delete, as it destroys trust in the pipeline.</p></div>
<div class="card"><h4>Q: Feature flags vs branches?</h4><p>Flags let unfinished work merge to trunk safely and decouple deploy from release; long-lived branches delay integration and create merge pain.</p></div>
<div class="card"><h4>Q: Push vs pull deployment?</h4><p>Push: CI runs kubectl or aws commands and needs cluster credentials. Pull (GitOps): an agent inside the cluster fetches desired state, more secure and self-healing.</p></div>
</div>

---

## Jenkins {#jenkins}

Jenkins is the most widely used open-source automation server. It runs on your own infrastructure, schedules jobs on a pool of build machines and is configured as code through a <code>Jenkinsfile</code>. A large plugin ecosystem lets it integrate with almost any tool.

<div class="diagram">
<div class="diagram-label">mind map — Jenkins</div>
<div class="mermaid">
mindmap
  root((Jenkins))
    Architecture
      Controller schedules and stores config
      Agents run the builds
      Build queue
      Workspace and artifacts
      Notifications
    Pipeline types
      Declarative
        pipeline block
        readable
        recommended
      Scripted
        node block
        Groovy
        flexible but complex
    Jenkinsfile
      agent
      environment
      stages and steps
      post
      script block for Groovy
    Agents
      Linux Docker
      Windows
      Kubernetes pods
    Plugins
    Shared libraries
      Reusable pipeline code
</div>
</div>

<div class="diagram">
<div class="diagram-label">flowchart — Jenkins architecture</div>
<div class="mermaid">
flowchart TD
    SCM["📦 Git webhook"] -->|trigger| JC["⚙️ Controller"]
    JC --> Q["📋 Build queue"]
    Q --> AG["Agents\nLinux · Windows · K8s pod"]
    AG -->|results| JC
    JC --> WS["💾 Workspace + artifacts"]
    JC --> NOT["📧 Slack / Email"]
    JC --> DEP["🚀 EC2 / ECS / K8s"]
</div>
</div>

<div class="box tip"><b>✅ Rule</b>
Prefer Declarative pipelines, use a <code>script { }</code> block only where Groovy logic is needed, and never run heavy builds on the controller.
</div>

### What Jenkins is and why it exists

Jenkins (forked from Hudson in 2011) automates the repetitive work around software delivery: compile, test, package, deploy, notify. It is <strong>not</strong> a build tool itself (Maven or Gradle do the compiling); it is an <strong>orchestrator</strong> that decides when to run those tools, where, with which credentials, and what to do with the result.

Why teams choose it:

- <strong>Self-hosted and free</strong> - full control over data, network and hardware (important in banks and regulated environments).
- <strong>Plugins</strong> - over 1,800 integrations (Git, Docker, Kubernetes, SonarQube, Slack, AWS).
- <strong>Pipeline as code</strong> - the <code>Jenkinsfile</code> lives in the repo next to the application.
- <strong>Scales out</strong> - add agents (physical, VM, container, Kubernetes pod) as load grows.

Costs: you operate it yourself (upgrades, plugin compatibility, backups, security patches), and the Groovy-based DSL has a learning curve.

**Example scenario:** 40 microservices each need build, test, Docker image and deploy. One Jenkins controller schedules jobs onto an autoscaling pool of Kubernetes pods; every service has a 40-line <code>Jenkinsfile</code> that calls a shared library.

<div class="box note"><b>📝 Interview quick answer</b> "Jenkins is an open-source, self-hosted CI/CD orchestration server. A controller schedules jobs and agents execute them. Pipelines are defined as code in a Jenkinsfile, and plugins add integrations."</div>

### Architecture - controller and agents

The <strong>controller</strong> (formerly "master") runs the web UI, stores job configuration and build history, manages credentials and plugins, and schedules builds. <strong>Agents</strong> (formerly "slaves") are machines or containers that actually execute the build steps. They connect to the controller by SSH or by the inbound agent (JNLP/WebSocket) protocol.

<div class="diagram">
<div class="diagram-label">flowchart — controller, executors, agents</div>
<div class="mermaid">
flowchart TD
    USER["Users / API"] --> JC["Controller\nUI, scheduler, config, credentials"]
    HOOK["Git webhook"] --> JC
    JC --> Q["Build queue"]
    Q --> A1["Agent linux-docker\n4 executors"]
    Q --> A2["Agent windows\n2 executors"]
    Q --> A3["K8s pod agent\n1 executor, ephemeral"]
    A1 -->|"logs and results"| JC
    A2 -->|"logs and results"| JC
    A3 -->|"logs and results"| JC
    JC --> HOME["JENKINS_HOME on disk\njobs, builds, plugins, secrets"]
</div>
</div>

<div class="tw"><table><thead><tr><th>Term</th><th>Meaning</th></tr></thead><tbody>
<tr><td>Controller</td><td>The Jenkins server process. Orchestrates only; set its executors to 0 so no build runs on it.</td></tr>
<tr><td>Agent / node</td><td>A machine that runs builds. Can be permanent or ephemeral.</td></tr>
<tr><td>Executor</td><td>A slot on a node that runs one build at a time. A node with 4 executors runs 4 concurrent builds.</td></tr>
<tr><td>Label</td><td>A tag on a node (<code>linux</code>, <code>docker</code>, <code>gpu</code>) used to pick where a job runs.</td></tr>
<tr><td>Workspace</td><td>The checkout directory on an agent for a job, e.g. <code>/home/jenkins/workspace/my-app</code>.</td></tr>
<tr><td>JENKINS_HOME</td><td>Directory on the controller with all state (<code>/var/lib/jenkins</code>).</td></tr>
<tr><td>Build queue</td><td>Jobs waiting for a free executor that matches their label.</td></tr>
</tbody></table></div>

<div class="box warn"><b>⚠️ Do not build on the controller</b> Build code can read <code>JENKINS_HOME</code>, including credentials. Heavy builds also starve the UI. Set "Number of executors" on the built-in node to 0.</div>

### Installation and first setup

<pre data-lang="bash"><code># Option 1: Docker (quickest for learning)
docker run -d --name jenkins \
  -p 8080:8080 -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  jenkins/jenkins:lts-jdk17

# Get the initial admin password
docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
# 3f8a1c...e92b

# Option 2: Ubuntu package (needs Java 17)
sudo apt install openjdk-17-jre
# add the Jenkins apt repository, then:
sudo apt install jenkins
sudo systemctl enable --now jenkins
sudo cat /var/lib/jenkins/secrets/initialAdminPassword</code></pre>

Then open <code>http://server:8080</code> and follow the wizard:

<div class="diagram">
<div class="diagram-label">flowchart — first-time setup wizard</div>
<div class="mermaid">
flowchart LR
    A["Open port 8080"] --> B["Enter initial admin password"] --> C["Install suggested plugins"] --> D["Create admin user"] --> E["Set Jenkins URL"] --> F["Create first job"]
</div>
</div>

Post-install checklist: set the Jenkins URL, set controller executors to 0, enable security (login required), install Docker Pipeline, Credentials Binding and Git plugins, configure a backup of <code>JENKINS_HOME</code>, and put Jenkins behind HTTPS (nginx or a load balancer).

**Example output** after starting the container:

<pre data-lang="text"><code>Jenkins initial setup is required. An admin user has been created
Please use the following password to proceed to installation:
3f8a1c0b7d9e4a2f8c11e92b5d6a7f03
INFO: Jenkins is fully up and running</code></pre>

### Job types

<div class="tw"><table><thead><tr><th>Job type</th><th>Description</th><th>When to use</th></tr></thead><tbody>
<tr><td>Freestyle project</td><td>Click-configured job: SCM, build steps, post-build actions in the UI.</td><td>Quick one-offs, legacy jobs. Not versioned in git.</td></tr>
<tr><td>Pipeline</td><td>Job whose logic is a Jenkinsfile (in the job config or in SCM).</td><td>Standard choice for one repo and one branch.</td></tr>
<tr><td>Multibranch Pipeline</td><td>Scans a repo and creates a job per branch and PR that has a Jenkinsfile.</td><td>Feature branches and pull requests.</td></tr>
<tr><td>Organization Folder</td><td>Scans a whole GitHub org or Bitbucket project, creates multibranch jobs per repo.</td><td>Many repositories, automatic onboarding.</td></tr>
<tr><td>Folder</td><td>Container for grouping jobs with shared permissions.</td><td>Team separation.</td></tr>
</tbody></table></div>

<div class="box tip"><b>✅ Prefer Pipeline or Multibranch</b> A Freestyle job's configuration lives only in the Jenkins database, so it cannot be reviewed, versioned or rebuilt easily. A Jenkinsfile in git can.</div>

### Declarative vs Scripted pipeline

Both are Groovy-based. <strong>Declarative</strong> offers a fixed, readable structure with built-in directives and syntax checking. <strong>Scripted</strong> is plain Groovy under <code>node { }</code> with unlimited flexibility.

<div class="tw"><table><thead><tr><th>Type</th><th>Definition</th><th>Pros</th><th>Cons</th></tr></thead><tbody>
<tr><td><strong>Declarative</strong></td><td>Structured DSL inside <code>pipeline { }</code> block</td><td>Readable, validates syntax, built-in directives (options, triggers, post, when)</td><td>Less flexible for complex logic</td></tr>
<tr><td><strong>Scripted</strong></td><td>Groovy code inside <code>node { }</code> block - full power</td><td>Maximum flexibility, conditionals, loops</td><td>Complex, error-prone, harder to read</td></tr>
</tbody></table></div>

<pre data-lang="groovy"><code>// Declarative
pipeline {
    agent any
    stages {
        stage('Build') {
            steps { sh 'mvn -B package' }
        }
    }
    post { failure { echo 'Build failed' } }
}

// Scripted - same job
node {
    try {
        stage('Build') {
            sh 'mvn -B package'
        }
    } catch (e) {
        echo 'Build failed'
        throw e
    }
}</code></pre>

<div class="box tip"><b>✅ Use Declarative</b> Always prefer Declarative pipeline. Use a <code>script { }</code> block inside a stage when you need imperative Groovy for specific steps (loops, complex conditions).</div>

<pre data-lang="groovy"><code>stage('Report') {
    steps {
        script {
            def services = ['auth', 'payments', 'orders']
            for (s in services) {
                echo "Checking ${s}"
            }
        }
    }
}</code></pre>

### The Jenkinsfile - full example explained section by section

A <code>Jenkinsfile</code> is a text file in the repo root that defines the pipeline. Jenkins loads it on each run, so changing the pipeline is just a commit (and gets code review).

<div class="diagram">
<div class="diagram-label">flowchart — Jenkinsfile structure</div>
<div class="mermaid">
flowchart TD
    P["pipeline"] --> AG["agent: where to run"]
    P --> OP["options: timeout, retention"]
    P --> PR["parameters: user inputs"]
    P --> TR["triggers: automatic starts"]
    P --> EN["environment: variables and credentials"]
    P --> ST["stages"]
    ST --> S1["stage"] --> S2["steps: sh, echo, junit"]
    ST --> WH["when: conditions"]
    P --> PO["post: always, success, failure"]
</div>
</div>

Here is a complete pipeline for a Java service. Each numbered block is explained below.

<pre data-lang="groovy"><code>pipeline {
    // (1) ── Where to run ──────────────────────────────
    agent {
        docker {
            image 'maven:3.9-eclipse-temurin-17'
            args '-v $HOME/.m2:/root/.m2'   // cache Maven repo
        }
    }

    // (2) ── Global options ────────────────────────────
    options {
        timeout(time: 30, unit: 'MINUTES')
        disableConcurrentBuilds()            // no parallel runs
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    // (3) ── Parameters ────────────────────────────────
    parameters {
        choice(name: 'DEPLOY_ENV', choices: ['staging', 'production'], description: 'Target')
        booleanParam(name: 'RUN_SONAR', defaultValue: true, description: 'Run code analysis')
    }

    // (4) ── Auto-triggers ─────────────────────────────
    triggers {
        pollSCM('H/5 * * * *')              // poll git every 5 min
        // or: githubPush()                 // webhook (preferred)
    }

    // (5) ── Reusable variables ────────────────────────
    environment {
        APP_NAME    = 'my-java-app'
        ECR_REPO    = '123456789.dkr.ecr.ap-south-1.amazonaws.com/myapp'
        IMAGE_TAG   = "${env.GIT_COMMIT[0..7]}"
        // Credentials from Jenkins Credentials Store:
        AWS_CREDS   = credentials('aws-ecr-creds')
        SONAR_TOKEN = credentials('sonarcloud-token')
    }

    stages {

        // (6) ── Stage 1 ──────────────────────────────
        stage('Checkout') {
            steps {
                checkout scm
                echo "Branch: ${env.GIT_BRANCH} | Commit: ${IMAGE_TAG}"
            }
        }

        // ── Stage 2 ───────────────────────────────────
        stage('Build') {
            steps {
                sh 'mvn clean package -DskipTests -q'
            }
            post {
                success { archiveArtifacts artifacts: 'target/*.jar' }
            }
        }

        // (7) ── Stage 3: parallel ────────────────────
        stage('Test') {
            parallel {
                stage('Unit Tests') {
                    steps { sh 'mvn test' }
                    post { always { junit 'target/surefire-reports/*.xml' } }
                }
                stage('Code Analysis') {
                    when { expression { params.RUN_SONAR } }
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

        // (8) ── Stage 4: when ────────────────────────
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

        // ── Stage 5 ───────────────────────────────────
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

        // (9) ── Stage 6: Manual Gate ─────────────────
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

    // (10) ── Post actions (always run) ───────────────
    post {
        always   { cleanWs() }           // clean workspace
        success  { slackSend color: 'good',    message: "✅ ${APP_NAME} deployed ${IMAGE_TAG}" }
        failure  { slackSend color: 'danger',  message: "❌ ${APP_NAME} build FAILED on ${env.GIT_BRANCH}" }
        unstable { slackSend color: 'warning', message: "⚠️ ${APP_NAME} tests UNSTABLE" }
    }
}</code></pre>

#### (1) agent - where the pipeline runs

`agent` decides which machine runs the steps. Here a throwaway Docker container from the <code>maven:3.9-eclipse-temurin-17</code> image is started on an agent, the workspace is mounted into it and all steps run inside. The build gets a clean toolchain every time, and <code>args</code> mounts a Maven cache to avoid re-downloading dependencies. Details are in the Agents section below.

#### (2) options - pipeline-wide behaviour

<div class="tw"><table><thead><tr><th>Option</th><th>Effect</th></tr></thead><tbody>
<tr><td><code>timeout</code></td><td>Abort a hung build after 30 minutes instead of blocking an executor forever.</td></tr>
<tr><td><code>disableConcurrentBuilds()</code></td><td>A second push waits instead of two builds deploying at the same time.</td></tr>
<tr><td><code>buildDiscarder</code></td><td>Keep only the last 10 builds so the disk does not fill up.</td></tr>
<tr><td><code>retry(3)</code>, <code>skipDefaultCheckout()</code>, <code>timestamps()</code></td><td>Other common options.</td></tr>
</tbody></table></div>

#### (3) parameters - inputs at build time

Parameters appear as a "Build with Parameters" form. Read them with <code>params.NAME</code>. Types: <code>string</code>, <code>choice</code>, <code>booleanParam</code>, <code>text</code>, <code>password</code>. Note that the first run after adding parameters has no values yet; the form appears from the second run.

#### (4) triggers - starting automatically

<code>pollSCM('H/5 * * * *')</code> asks git every ~5 minutes whether anything changed (the <code>H</code> hash spreads load). <code>cron('H 2 * * *')</code> runs nightly. <code>githubPush()</code> reacts to a webhook, which is instant and preferred. <code>upstream</code> triggers after another job.

#### (5) environment - variables and credentials

Variables defined here are available to every step as <code>env.NAME</code> or <code>$NAME</code> in shell. <code>credentials('id')</code> loads a stored secret. For a "Username with password" credential, Jenkins creates <code>AWS_CREDS</code> (as <code>user:pass</code>) plus <code>AWS_CREDS_USR</code> and <code>AWS_CREDS_PSW</code>. Jenkins masks the values as <code>****</code> in the console.

<pre data-lang="text"><code>[Pipeline] sh
+ mvn sonar:sonar -Dsonar.host.url=https://sonarcloud.io -Dsonar.token=****</code></pre>

<div class="box warn"><b>⚠️ Groovy interpolation leaks secrets</b> In <code>sh """ ... ${SONAR_TOKEN} """</code> Groovy substitutes the secret into the script text before running, which Jenkins warns about. Prefer single quotes <code>sh 'mvn ... -Dsonar.token=$SONAR_TOKEN'</code> so the shell reads the environment variable and the secret is never part of the Groovy string.</div>

#### (6) stages and steps

<code>stages</code> holds an ordered list of <code>stage</code> blocks; each shows as a column in the Stage View. Inside a stage, <code>steps</code> are the real actions: <code>sh</code> (Linux shell), <code>bat</code> (Windows), <code>echo</code>, <code>checkout scm</code> (check out the same repo and revision the Jenkinsfile came from), <code>archiveArtifacts</code>, <code>junit</code>, <code>input</code>, and plugin steps like <code>slackSend</code>.

#### (7) parallel - run stages concurrently

Stages nested under <code>parallel</code> run at the same time on available executors; the parent finishes when all complete. Unit tests and Sonar analysis here take as long as the slower of the two, not the sum.

<div class="diagram">
<div class="diagram-label">flowchart — parallel stages</div>
<div class="mermaid">
flowchart LR
    B["Build"] --> T1["Unit Tests"]
    B --> T2["Code Analysis"]
    T1 --> D["Docker Build"]
    T2 --> D
</div>
</div>

Add <code>failFast true</code> to abort sibling branches as soon as one fails.

#### (8) when - conditional stages

<div class="tw"><table><thead><tr><th>Condition</th><th>Example</th><th>Meaning</th></tr></thead><tbody>
<tr><td><code>branch</code></td><td><code>branch 'main'</code></td><td>Only on branch main (multibranch jobs)</td></tr>
<tr><td><code>environment</code></td><td><code>environment name: 'DEPLOY', value: 'yes'</code></td><td>Env var equals value</td></tr>
<tr><td><code>expression</code></td><td><code>expression { params.RUN_SONAR }</code></td><td>Any Groovy boolean</td></tr>
<tr><td><code>changeset</code></td><td><code>changeset 'src/**'</code></td><td>When matching files changed</td></tr>
<tr><td><code>allOf / anyOf / not</code></td><td><code>allOf { branch 'main'; not { changeRequest() } }</code></td><td>Combine conditions</td></tr>
<tr><td><code>tag</code>, <code>changeRequest</code></td><td><code>tag 'v*'</code></td><td>Release tags, pull requests</td></tr>
</tbody></table></div>

A skipped stage shows as greyed out in the UI: <code>Stage "Docker Build and Push" skipped due to when conditional</code>.

#### (9) input - manual approval gate

<code>input</code> pauses the pipeline and waits for a human to click Proceed or Abort; <code>submitter</code> restricts who may approve. Always wrap it in a <code>timeout</code> and put it in a stage with <code>agent none</code> (or at least outside a heavy agent) so an executor is not blocked while waiting.

<pre data-lang="groovy"><code>stage('Approve Production') {
    agent none
    steps {
        timeout(time: 1, unit: 'HOURS') {
            input message: 'Deploy to Production?', ok: 'Deploy',
                  submitter: 'naveen,tech-lead'
        }
    }
}</code></pre>

#### (10) post - actions after the run

<code>post</code> runs after stages. Conditions: <code>always</code>, <code>success</code>, <code>failure</code>, <code>unstable</code> (tests failed but build ok), <code>aborted</code>, <code>changed</code> (status differs from previous run), <code>fixed</code> (failure then success), <code>cleanup</code> (runs last). It can be at pipeline level or per stage. Use it for cleanup, test reports and notifications.

<div class="diagram">
<div class="diagram-label">stateDiagram — build result lifecycle</div>
<div class="mermaid">
stateDiagram-v2
    state "Queued" as q
    state "Running" as r
    state "SUCCESS" as s
    state "UNSTABLE" as u
    state "FAILURE" as f
    state "ABORTED" as a
    [*] --> q
    q --> r: executor free
    r --> s: all steps ok
    r --> u: tests failed
    r --> f: step error
    r --> a: user abort or timeout
    s --> [*]
    u --> [*]
    f --> [*]
    a --> [*]
</div>
</div>

#### Credentials in a pipeline

Besides <code>credentials()</code> in <code>environment</code>, use <code>withCredentials</code> to scope a secret to a few lines:

<pre data-lang="groovy"><code>withCredentials([
    usernamePassword(credentialsId: 'nexus-login',
                     usernameVariable: 'NEXUS_USER',
                     passwordVariable: 'NEXUS_PASS'),
    string(credentialsId: 'slack-token', variable: 'SLACK_TOKEN'),
    file(credentialsId: 'kubeconfig-prod', variable: 'KUBECONFIG'),
    sshUserPrivateKey(credentialsId: 'deploy-key', keyFileVariable: 'SSH_KEY')
]) {
    sh 'curl -u $NEXUS_USER:$NEXUS_PASS -T target/app.jar https://nexus.acme.in/repo/app.jar'
    sh 'kubectl --kubeconfig=$KUBECONFIG get pods'
}</code></pre>

### Webhooks and the triggering sequence

Polling asks "anything new?" on a timer. A <strong>webhook</strong> is the reverse: the Git server calls Jenkins immediately on each push, so builds start in seconds with no wasted polling.

<div class="diagram">
<div class="diagram-label">sequenceDiagram — push to build result</div>
<div class="mermaid">
sequenceDiagram
    participant Dev as "Developer"
    participant GH as "GitHub"
    participant JC as "Jenkins Controller"
    participant AG as "Agent"
    participant SL as "Slack"
    Dev->>GH: git push to main
    GH->>JC: POST /github-webhook/ with push payload
    JC->>JC: Match repo, put job in build queue
    JC->>AG: Allocate executor, send job
    AG->>GH: Clone repo at commit SHA
    AG->>AG: Run stages: build, test, package
    AG-->>JC: Stream console log and test results
    JC->>GH: Report commit status success or failure
    JC->>SL: Send notification
</div>
</div>

Setup steps:

1. Install the GitHub plugin; in the job enable "GitHub hook trigger for GITScm polling" (or <code>githubPush()</code> in the Jenkinsfile).
2. In GitHub: repo Settings, Webhooks, add <code>https://jenkins.acme.in/github-webhook/</code>, content type <code>application/json</code>, event "Just the push event".
3. The Jenkins URL must be reachable from GitHub (public URL, VPN or a relay tool in private networks).
4. Check "Recent Deliveries" in GitHub for the response code (200 = OK).

<pre data-lang="text"><code>Started by GitHub push by naveen-kumar
Obtained Jenkinsfile from git https://github.com/acme/payments-api.git
Running on build-agent-3 in /home/jenkins/workspace/payments-api_main
[Pipeline] stage
[Pipeline] { (Checkout)</code></pre>

<div class="box note"><b>📝 Other triggers</b> <code>cron</code> (scheduled), <code>pollSCM</code> (fallback), <code>upstream(upstreamProjects: 'lib-build')</code>, remote HTTP trigger with token (<code>/job/x/build?token=...</code>), and manual "Build Now".</div>

### Agents - labels, Docker and Kubernetes

The <code>agent</code> directive selects where code runs.

<div class="tw"><table><thead><tr><th>Agent Type</th><th>Syntax</th><th>Use Case</th></tr></thead><tbody>
<tr><td><strong>any</strong></td><td><code>agent any</code></td><td>Run on any available agent - simplest option</td></tr>
<tr><td><strong>none</strong></td><td><code>agent none</code></td><td>No global agent - each stage defines its own</td></tr>
<tr><td><strong>label</strong></td><td><code>agent { label 'linux' }</code></td><td>Run on agents with a specific label</td></tr>
<tr><td><strong>docker</strong></td><td><code>agent { docker { image 'maven:3.9' } }</code></td><td>Run inside a Docker container - clean environment every time</td></tr>
<tr><td><strong>kubernetes</strong></td><td><code>agent { kubernetes { yaml '...' } }</code></td><td>Spin up a K8s pod as ephemeral agent - scales to zero</td></tr>
</tbody></table></div>

<div class="diagram">
<div class="diagram-label">flowchart — agent selection</div>
<div class="mermaid">
flowchart TD
    J["Job needs agent"] --> L{"Which directive?"}
    L -->|"any"| N1["First free executor"]
    L -->|"label linux and docker"| N2["Node with both labels"]
    L -->|"docker image"| N3["Node with Docker, start container"]
    L -->|"kubernetes"| N4["Cluster creates a pod, deleted after build"]
</div>
</div>

#### Permanent agents and labels

Add a node under Manage Jenkins, Nodes: set remote root directory, number of executors and <strong>labels</strong> such as <code>linux docker maven</code>. A pipeline can then use <code>agent { label 'linux &amp;&amp; docker' }</code>. Connection methods: SSH (controller connects to agent) or inbound agent (agent connects to controller, useful behind NAT).

<pre data-lang="bash"><code># Inbound agent started on the build machine
java -jar agent.jar -url https://jenkins.acme.in/ \
     -secret 9a8b7c... -name linux-agent-1 -workDir /home/jenkins</code></pre>

#### Docker agents

<pre data-lang="groovy"><code>pipeline {
    agent none
    stages {
        stage('Backend') {
            agent { docker { image 'maven:3.9-eclipse-temurin-17' } }
            steps { sh 'mvn -v' }
        }
        stage('Frontend') {
            agent { docker { image 'node:20-alpine' } }
            steps { sh 'node --version &amp;&amp; npm ci &amp;&amp; npm test' }
        }
    }
}</code></pre>

Different stages can use different toolchains with nothing installed on the agent except Docker.

#### Kubernetes agents (ephemeral pods)

With the Kubernetes plugin, Jenkins starts a pod per build and deletes it afterwards. Idle cost is zero and builds scale with the cluster. The pod normally contains a <code>jnlp</code> container (the Jenkins agent) plus tool containers.

<div class="diagram">
<div class="diagram-label">sequenceDiagram — Kubernetes ephemeral agent</div>
<div class="mermaid">
sequenceDiagram
    participant JC as "Controller"
    participant K8 as "Kubernetes API"
    participant POD as "Agent Pod"
    JC->>K8: Create pod from template
    K8-->>POD: Schedule and start containers
    POD->>JC: Connect as inbound agent
    JC->>POD: Run pipeline steps
    POD-->>JC: Results and logs
    JC->>K8: Delete pod
</div>
</div>

<pre data-lang="groovy"><code>pipeline {
    agent {
        kubernetes {
            yaml '''
apiVersion: v1
kind: Pod
spec:
  containers:
    - name: maven
      image: maven:3.9-eclipse-temurin-17
      command: [cat]
      tty: true
    - name: kaniko
      image: gcr.io/kaniko-project/executor:debug
      command: [cat]
      tty: true
'''
        }
    }
    stages {
        stage('Build') {
            steps {
                container('maven') {
                    sh 'mvn -B package'
                }
            }
        }
    }
}</code></pre>

<div class="box tip"><b>✅ Why ephemeral agents</b> Every build starts from a clean state, so there are no "works on the previous build" surprises, no tool drift, and you pay only while building.</div>

### Credentials management

Credentials are stored encrypted on the controller (Manage Jenkins, Credentials) with a scope (global, or a folder/system) and an ID that pipelines reference.

<div class="tw"><table><thead><tr><th>Type</th><th>Use</th><th>Binding</th></tr></thead><tbody>
<tr><td>Secret text</td><td>API token, single value</td><td><code>string(credentialsId, variable)</code></td></tr>
<tr><td>Username with password</td><td>Registry, Nexus, Git over HTTPS</td><td><code>usernamePassword(...)</code></td></tr>
<tr><td>SSH username with private key</td><td>Git over SSH, deploy servers</td><td><code>sshUserPrivateKey(...)</code></td></tr>
<tr><td>Secret file</td><td>kubeconfig, service account JSON</td><td><code>file(...)</code></td></tr>
<tr><td>Certificate</td><td>Client certs, keystores</td><td><code>certificate(...)</code></td></tr>
</tbody></table></div>

Good practice: least-privilege scope per folder, no secrets in the Jenkinsfile, use cloud IAM roles on agents instead of stored AWS keys where possible, and consider an external store (HashiCorp Vault plugin, AWS Secrets Manager plugin). Jenkins masks secrets in the log, but a script can still print them in transformed form (for example base64), so do not trust masking alone.

### Plugins

Plugins add almost all of Jenkins' functionality. Manage Jenkins, Plugins shows installed, updates and available ones.

<div class="tw"><table><thead><tr><th>Plugin</th><th>What it does</th></tr></thead><tbody>
<tr><td><strong>Pipeline</strong></td><td>Core pipeline support - Jenkinsfile execution</td></tr>
<tr><td><strong>Git / GitHub</strong></td><td>SCM checkout, webhooks, status reporting to GitHub PRs</td></tr>
<tr><td><strong>Docker Pipeline</strong></td><td>Use Docker images as agents, docker.build, docker.push</td></tr>
<tr><td><strong>Credentials Binding</strong></td><td>Inject secrets/credentials as env vars into pipeline</td></tr>
<tr><td><strong>Blue Ocean</strong></td><td>Modern visual pipeline UI - see stage graph, logs inline</td></tr>
<tr><td><strong>JUnit</strong></td><td>Parse and display test results from XML reports</td></tr>
<tr><td><strong>SonarQube Scanner</strong></td><td>Run SonarQube analysis and publish quality gate result</td></tr>
<tr><td><strong>Slack Notification</strong></td><td>Send build notifications to Slack channels</td></tr>
<tr><td><strong>Kubernetes</strong></td><td>Use K8s pods as dynamic Jenkins agents</td></tr>
<tr><td><strong>AWS Steps</strong></td><td>AWS CLI commands as pipeline steps</td></tr>
<tr><td><strong>Configuration as Code (JCasC)</strong></td><td>Define Jenkins settings in YAML</td></tr>
<tr><td><strong>Role-based Authorization Strategy</strong></td><td>Roles and per-folder permissions</td></tr>
</tbody></table></div>

<div class="box warn"><b>⚠️ Plugin hygiene</b> Plugins are the main source of Jenkins vulnerabilities and upgrade breakages. Install only what you need, update regularly (test on a staging Jenkins first), and remove unmaintained ones.</div>

### Shared libraries

A shared library is a Git repository of reusable Groovy pipeline code. It stops 20 microservices from each copying the same 80 lines of deploy logic.

<div class="diagram">
<div class="diagram-label">flowchart — shared library usage</div>
<div class="mermaid">
flowchart LR
    LIB["Library repo\nvars/ src/ resources/"] --> JC["Jenkins loads library by name and version"]
    JC --> J1["Service A Jenkinsfile"]
    JC --> J2["Service B Jenkinsfile"]
    JC --> J3["Service C Jenkinsfile"]
</div>
</div>

<div class="box info"><b>ℹ️ What is a Shared Library?</b>
Reusable Groovy code stored in a Git repo that can be imported into any Jenkinsfile. Avoid copy-pasting the same stages across 20 microservices.
</div>

Library layout:

<pre data-lang="text"><code>my-shared-lib/
  vars/
    deployToECS.groovy       # global step: deployToECS(...)
    standardPipeline.groovy  # a whole pipeline as one step
  src/com/acme/Utils.groovy  # normal Groovy classes
  resources/                 # files loaded via libraryResource</code></pre>

Register it under Manage Jenkins, System, Global Pipeline Libraries (name <code>my-shared-lib</code>, default version <code>main</code>, Git URL).

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

A more powerful pattern is a whole standard pipeline with a config map, so each service's Jenkinsfile shrinks to a few lines:

<pre data-lang="groovy"><code>// vars/standardPipeline.groovy
def call(Map cfg) {
    pipeline {
        agent { label 'docker' }
        stages {
            stage('Build') { steps { sh cfg.buildCmd ?: 'mvn -B package' } }
            stage('Image') { steps { sh "docker build -t ${cfg.image}:${env.GIT_COMMIT.take(7)} ." } }
            stage('Deploy') {
                when { branch 'main' }
                steps { deployToECS(cfg.cluster, cfg.service) }
            }
        }
    }
}

// Jenkinsfile in the service repo (3 lines)
@Library('my-shared-lib') _
standardPipeline(image: 'acme/orders', cluster: 'prod', service: 'orders')</code></pre>

Pitfalls: pin versions for stability (<code>@v2.3.0</code>) rather than <code>@main</code> for critical pipelines, and test library changes on a branch (<code>@feature-x</code>) before merging.

### Multibranch pipeline

A Multibranch Pipeline job scans a repository and creates a sub-job for every branch and pull request that contains a Jenkinsfile. When a branch is deleted its job is cleaned up. It is how feature branches get CI automatically.

<div class="diagram">
<div class="diagram-label">flowchart — multibranch pipeline</div>
<div class="mermaid">
flowchart TD
    REPO["Repo payments-api"] --> SCAN["Branch indexing\nwebhook or periodic scan"]
    SCAN --> M["Job: main"]
    SCAN --> F1["Job: feature/upi"]
    SCAN --> PR["Job: PR-142"]
    M --> D["Build + test + deploy"]
    F1 --> T1["Build + test only"]
    PR --> T2["Build + test, status on PR"]
</div>
</div>

Create it via New Item, Multibranch Pipeline, add a Branch Source (GitHub) with credentials, and set the Jenkinsfile path. Combine with <code>when { branch 'main' }</code> so only main deploys, while other branches stop after tests.

<pre data-lang="text"><code>Scanning repository acme/payments-api
Checking branch main        -&gt; 'Jenkinsfile' found, job created
Checking branch feature/upi -&gt; 'Jenkinsfile' found, job created
Checking pull request #142  -&gt; merge with main, job created
Finished: 3 branches, 0 failures</code></pre>

For PRs, the plugin builds the merge result of the PR with the target branch, which catches integration conflicts before merging.

### Worked example - Java app, Docker image and deploy

Scenario: a Spring Boot service <code>payments-api</code>. Goal: on every push, build and test; on main, build a Docker image, push to a registry, deploy to Kubernetes, with approval before production.

<div class="diagram">
<div class="diagram-label">flowchart — Java build, image, deploy</div>
<div class="mermaid">
flowchart LR
    A["Checkout"] --> B["mvn package\nunit tests"] --> C["Publish JUnit + JAR"] --> D["docker build\ndocker push"] --> E["Deploy staging\nkubectl"] --> F["Smoke test"] --> G["Approval"] --> H["Deploy production"]
</div>
</div>

<pre data-lang="dockerfile"><code>FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY target/payments-api.jar app.jar
EXPOSE 8080
USER 1000
ENTRYPOINT ["java", "-jar", "app.jar"]</code></pre>

<pre data-lang="groovy"><code>pipeline {
    agent { label 'docker' }
    options { timeout(time: 25, unit: 'MINUTES'); timestamps() }
    environment {
        REGISTRY = 'registry.acme.in'
        IMAGE    = "${REGISTRY}/payments-api"
        TAG      = "${env.BUILD_NUMBER}-${env.GIT_COMMIT.take(7)}"
    }
    stages {
        stage('Build and Test') {
            agent { docker { image 'maven:3.9-eclipse-temurin-17' } }
            steps {
                sh 'mvn -B clean verify'
            }
            post {
                always { junit 'target/surefire-reports/*.xml' }
                success { archiveArtifacts 'target/*.jar' }
            }
        }
        stage('Docker Image') {
            when { branch 'main' }
            steps {
                withCredentials([usernamePassword(credentialsId: 'registry-login',
                        usernameVariable: 'U', passwordVariable: 'P')]) {
                    sh '''
                        echo "$P" | docker login registry.acme.in -u "$U" --password-stdin
                    '''
                    sh "docker build -t ${IMAGE}:${TAG} ."
                    sh "docker push ${IMAGE}:${TAG}"
                }
            }
        }
        stage('Deploy Staging') {
            when { branch 'main' }
            steps {
                withCredentials([file(credentialsId: 'kubeconfig-staging', variable: 'KUBECONFIG')]) {
                    sh "kubectl set image deployment/payments-api app=${IMAGE}:${TAG} -n staging"
                    sh 'kubectl rollout status deployment/payments-api -n staging --timeout=120s'
                }
                sh 'curl -fsS https://staging.acme.in/payments/health'
            }
        }
        stage('Approve') {
            when { branch 'main' }
            steps {
                timeout(time: 2, unit: 'HOURS') {
                    input message: "Deploy ${TAG} to production?", submitter: 'tech-lead'
                }
            }
        }
        stage('Deploy Production') {
            when { branch 'main' }
            steps {
                withCredentials([file(credentialsId: 'kubeconfig-prod', variable: 'KUBECONFIG')]) {
                    sh "kubectl set image deployment/payments-api app=${IMAGE}:${TAG} -n prod"
                    sh 'kubectl rollout status deployment/payments-api -n prod --timeout=180s'
                }
            }
        }
    }
    post {
        failure { slackSend channel: '#builds', color: 'danger', message: "FAILED ${env.JOB_NAME} #${env.BUILD_NUMBER}" }
        always  { cleanWs() }
    }
}</code></pre>

**Expected console output (abridged):**

<pre data-lang="text"><code>[Pipeline] stage (Build and Test)
[INFO] Tests run: 318, Failures: 0, Errors: 0, Skipped: 2
[INFO] BUILD SUCCESS
[Pipeline] stage (Docker Image)
Successfully tagged registry.acme.in/payments-api:57-a1b2c3d
57-a1b2c3d: digest: sha256:9f86d0... size: 1789
[Pipeline] stage (Deploy Staging)
deployment "payments-api" successfully rolled out
{"status":"UP"}
[Pipeline] stage (Approve)
Input requested   (waiting for tech-lead)</code></pre>

### Troubleshooting

<div class="tw"><table><thead><tr><th>Symptom</th><th>Likely cause</th><th>Fix</th></tr></thead><tbody>
<tr><td>Build stuck in queue: "Waiting for next available executor"</td><td>No agent with the requested label, agent offline, all executors busy</td><td>Check Manage Jenkins, Nodes. Fix label spelling, bring the agent online, add capacity.</td></tr>
<tr><td>Webhook does not trigger</td><td>Jenkins not reachable from GitHub, wrong URL (missing trailing slash), trigger not enabled</td><td>Check GitHub "Recent Deliveries", firewall, enable <code>githubPush()</code>.</td></tr>
<tr><td><code>command not found: mvn</code></td><td>Tool not installed on the agent</td><td>Use a Docker agent or Global Tool Configuration.</td></tr>
<tr><td><code>Permission denied</code> on docker.sock</td><td>Jenkins user not in docker group</td><td><code>sudo usermod -aG docker jenkins</code> then restart agent.</td></tr>
<tr><td><code>groovy.lang.MissingPropertyException</code></td><td>Undefined variable or quoting problem</td><td>Check variable scope, use double quotes only when interpolating.</td></tr>
<tr><td><code>NotSerializableException</code></td><td>Non-serializable object (e.g. Matcher) kept across a step</td><td>Isolate in a <code>@NonCPS</code> method, convert to plain types.</td></tr>
<tr><td>Disk full on controller</td><td>Old builds and artifacts</td><td>Use <code>buildDiscarder</code>, clean workspaces, clean docker images.</td></tr>
<tr><td>Jenkins slow or OOM</td><td>Heap too small, too many plugins, builds on controller</td><td>Raise <code>-Xmx</code>, move builds to agents, prune plugins.</td></tr>
<tr><td>Git clone fails: Host key verification</td><td>Unknown SSH host key</td><td>Add known_hosts or configure host key verification strategy.</td></tr>
<tr><td>Pipeline "hangs" after a restart</td><td>Waiting on an <code>input</code> or lost agent</td><td>Abort the build, add timeouts.</td></tr>
</tbody></table></div>

<div class="diagram">
<div class="diagram-label">flowchart — debugging a failed build</div>
<div class="mermaid">
flowchart TD
    F["Build failed"] --> L["Read Console Output from the bottom"]
    L --> Q{"Where did it fail?"}
    Q -->|"Before any step"| A1["Agent, label, checkout or credentials problem"]
    Q -->|"In a sh step"| A2["Run same command on the agent by hand"]
    Q -->|"Groovy exception"| A3["Syntax or scope: use Replay and Pipeline Syntax snippet generator"]
    A1 --> R["Fix and rebuild"]
    A2 --> R
    A3 --> R
</div>
</div>

Useful tools: <strong>Replay</strong> (rerun a build with an edited Jenkinsfile without committing), <strong>Pipeline Syntax / Snippet Generator</strong> (generates step code), "Declarative Directive Generator", <code>Manage Jenkins, System Log</code>, and a lint check: <code>curl -X POST -F "jenkinsfile=&lt;Jenkinsfile" https://jenkins/pipeline-model-converter/validate</code>.

### Backup, upgrade and security

#### Backup

Everything important is in <code>JENKINS_HOME</code>: <code>config.xml</code>, <code>jobs/</code>, <code>credentials.xml</code>, <code>secrets/</code>, <code>plugins/</code>, <code>users/</code>. Back it up regularly (excluding <code>workspace/</code>, caches and old build logs), or use a plugin/volume snapshot. Better: keep as much as possible as code (Jenkinsfiles, JCasC YAML, job DSL) so a controller can be rebuilt from scratch.

<pre data-lang="bash"><code>tar czf jenkins-backup-$(date +%F).tgz \
    --exclude='workspace' --exclude='caches' \
    -C /var/lib/jenkins .
# jenkins-backup-2026-10-07.tgz  (copy offsite, test restore regularly)</code></pre>

#### Security checklist

<div class="g2">
<div class="card"><h4>Access</h4><p>Enable security realm (LDAP, SSO/SAML, GitHub OAuth). Use Role-based or Matrix authorization with least privilege. Disable anonymous access. Turn on CSRF protection.</p></div>
<div class="card"><h4>Execution</h4><p>Controller executors = 0. Agents run as an unprivileged user. Use ephemeral agents. Enable Script Security and approve Groovy scripts deliberately.</p></div>
<div class="card"><h4>Secrets</h4><p>Use the Credentials store, folder scoping, external vaults. Never print secrets. Restrict who can edit pipelines that use powerful credentials.</p></div>
<div class="card"><h4>Maintenance</h4><p>Run LTS releases, apply security advisories promptly, update plugins after testing, serve only over HTTPS, audit logs, and back up.</p></div>
</div>

<div class="box warn"><b>⚠️ A Jenkins admin is effectively a root user</b> Anyone who can edit a pipeline can run code on agents and read credentials bound to it. Control write access to Jenkinsfiles and protect <code>main</code> with reviews.</div>

### Jenkins vs GitHub Actions

<div class="tw"><table><thead><tr><th>Aspect</th><th>Jenkins</th><th>GitHub Actions</th></tr></thead><tbody>
<tr><td>Hosting</td><td>You run controller and agents</td><td>Managed by GitHub (or self-hosted runners)</td></tr>
<tr><td>Config</td><td>Groovy <code>Jenkinsfile</code></td><td>YAML in <code>.github/workflows</code></td></tr>
<tr><td>Setup effort</td><td>Install, secure, upgrade, back up</td><td>Add a file, it works</td></tr>
<tr><td>Cost</td><td>Free software, you pay for infra and admin time</td><td>Free minutes then per-minute billing</td></tr>
<tr><td>Extensibility</td><td>Huge plugin ecosystem, shared libraries</td><td>Marketplace of actions, reusable workflows</td></tr>
<tr><td>Flexibility</td><td>Very high, any SCM, on-prem, air-gapped</td><td>Best with GitHub repos</td></tr>
<tr><td>Scaling</td><td>Add agents / K8s pods yourself</td><td>Elastic hosted runners</td></tr>
<tr><td>Maintenance</td><td>Plugin and version management</td><td>Minimal</td></tr>
<tr><td>Best for</td><td>Enterprises with on-prem needs, complex legacy pipelines</td><td>GitHub-centred teams, open source, fast start</td></tr>
</tbody></table></div>

**Rough mapping:** pipeline = workflow; stage = job; agent label = runs-on; <code>environment {}</code> = <code>env:</code>; <code>credentials()</code> = <code>secrets.X</code>; shared library = reusable workflow or composite action; <code>input</code> = environment with required reviewers.

<div class="box note"><b>📝 Choosing</b> If your code is on GitHub and you do not need on-prem control, Actions is usually less work. Choose Jenkins when you already run it at scale, must stay on-premises, or need plugins and flexibility Actions cannot offer.</div>

### Interview Q&A

<div class="g2">
<div class="card"><h4>Q: Controller vs agent?</h4><p>The controller schedules jobs, stores config, credentials and serves the UI. Agents execute the build steps. Do not run builds on the controller for security and stability.</p></div>
<div class="card"><h4>Q: Declarative vs Scripted?</h4><p>Declarative uses a structured <code>pipeline { }</code> with built-in directives and validation, and is recommended. Scripted is free-form Groovy in <code>node { }</code>, flexible but harder to maintain. Use <code>script { }</code> in Declarative for the odd imperative bit.</p></div>
<div class="card"><h4>Q: What is a Jenkinsfile?</h4><p>A text file in the repo defining the pipeline as code, so it is versioned, reviewed and reproducible.</p></div>
<div class="card"><h4>Q: How do you trigger a build on every commit?</h4><p>Configure a GitHub webhook to <code>/github-webhook/</code> with <code>githubPush()</code>; polling with <code>pollSCM</code> is the fallback.</p></div>
<div class="card"><h4>Q: How do you handle secrets?</h4><p>Jenkins Credentials store with <code>credentials()</code> or <code>withCredentials</code>, scoped by folder, masked in logs, optionally backed by Vault. Never in the Jenkinsfile.</p></div>
<div class="card"><h4>Q: What are shared libraries?</h4><p>Git-hosted reusable Groovy (<code>vars/</code>, <code>src/</code>) loaded with <code>@Library</code> to avoid duplicating pipeline logic across repos.</p></div>
<div class="card"><h4>Q: How do you run builds in parallel?</h4><p>The <code>parallel</code> block inside a stage, plus multiple executors or agents. Use <code>failFast</code> if one failure should stop all.</p></div>
<div class="card"><h4>Q: What is a multibranch pipeline?</h4><p>A job that auto-discovers branches and PRs with a Jenkinsfile and builds each one independently.</p></div>
<div class="card"><h4>Q: How do you scale Jenkins?</h4><p>Many agents, labels, Docker and Kubernetes ephemeral agents, folders per team, and sometimes multiple controllers.</p></div>
<div class="card"><h4>Q: A build is stuck in the queue. What do you check?</h4><p>Whether an agent with the label exists and is online, executor availability, disk space on the node, and the queue "why" text.</p></div>
<div class="card"><h4>Q: How do you back up Jenkins?</h4><p>Back up <code>JENKINS_HOME</code> (config, jobs, credentials, secrets) and keep pipelines and configuration as code so the server is rebuildable.</p></div>
<div class="card"><h4>Q: Jenkins vs GitHub Actions?</h4><p>Jenkins: self-hosted, plugin-rich, highly flexible but needs maintenance. Actions: managed, YAML, tight GitHub integration, minimal setup.</p></div>
</div>

---

## Apache Airflow {#airflow}

Apache Airflow is a platform to author, schedule and monitor workflows as Python code. You describe a pipeline as a DAG (a graph of tasks with dependencies), and Airflow decides when each task is ready, runs it, retries it, and records everything. It does not process big data itself; it tells other systems (Spark, SQL engines, APIs) when to work.

<div class="diagram">
<div class="diagram-label">mind map — Airflow</div>
<div class="mermaid">
mindmap
  root((Airflow))
    Architecture
      Webserver UI
      Scheduler
      Executor
      Metadata DB
      Workers
      Log storage
    DAG concepts
      DAG
      DagRun
      Task
      Task Instance
      logical_date
      Schedule
    Operators
      PythonOperator
      BashOperator
      PostgresOperator
      SparkSubmitOperator
      S3ToRedshiftOperator
      Sensors
        S3KeySensor
        HttpSensor
      BranchPythonOperator
      TriggerDagRunOperator
      TaskFlow task decorator
    XCom
      Pass small data between tasks
      TaskFlow does it automatically
    Executors
      Local
      Celery
      Kubernetes
    Best practices
</div>
</div>

### What is orchestration and why Airflow

A data pipeline is rarely one script. It is "wait for the file, load it, validate it, transform it, publish it, tell someone". Each step can fail, take hours, depend on another system, and need to be re-run for a past date. Cron plus shell scripts cannot answer: which step failed, what ran yesterday, can I re-run only the broken part, do tasks run in the right order?

An **orchestrator** owns three things: **ordering** (dependencies), **timing** (schedules and data intervals) and **recovery** (retries, backfills, alerts, history). Airflow's distinguishing idea is **workflows as code**: DAGs are Python files, so they can be versioned, reviewed, tested and generated dynamically.

<div class="diagram">
<div class="diagram-label">flowchart — cron scripts vs orchestrator</div>
<div class="mermaid">
flowchart LR
    subgraph CRON["Cron plus scripts"]
        C1["0 6 extract.sh"] --> C2["0 7 load.sh\nhope extract finished"]
        C2 --> C3["0 8 report.sh\nhope load finished"]
    end
    subgraph AF["Airflow DAG"]
        A1["extract"] -->|"on success"| A2["load"]
        A2 -->|"on success"| A3["report"]
        A1 -.->|"retry 3 times then alert"| A1
    end
</div>
</div>

<div class="tw"><table><thead><tr><th>Need</th><th>Cron + scripts</th><th>Airflow</th></tr></thead><tbody><tr><td>Run B only after A succeeded</td><td>Guess with time gaps</td><td>Explicit dependency <code>A &gt;&gt; B</code></td></tr><tr><td>Retry on failure</td><td>Write it yourself</td><td><code>retries=3</code>, <code>retry_delay</code></td></tr><tr><td>History and logs per run</td><td>grep log files</td><td>UI with per-task logs and states</td></tr><tr><td>Re-run last Tuesday</td><td>Edit script dates by hand</td><td>Clear tasks or <code>airflow dags backfill</code></td></tr><tr><td>Many pipelines, one view</td><td>No</td><td>Single UI, tags, filters</td></tr></tbody></table></div>

<div class="box tip"><b>✅ When to use Airflow</b> Batch workflows with clear dependencies and a schedule: nightly ETL, ML retraining, report generation, cross-system jobs. It is a poor fit for low-latency event processing (use Kafka/Flink) or for moving large data through Airflow workers (let Spark/the warehouse do the heavy work).</div>

<div class="box warn"><b>⚠️ Not a data processing engine</b> A common beginner mistake is loading a 20 GB DataFrame inside a PythonOperator. Airflow workers are small; trigger a Spark/SQL job and wait for it instead.</div>

### Architecture and components

Airflow is a set of cooperating processes that all talk to one **metadata database**. The scheduler decides, the executor dispatches, workers execute, the webserver displays.

<div class="diagram">
<div class="diagram-label">flowchart — architecture</div>
<div class="mermaid">
flowchart TD
    DAGS["DAGs folder\nPython files"] --> DP["DAG processor\nparses files"]
    DP --> META["Metadata DB\nPostgres or MySQL"]
    SCH["Scheduler"] --> META
    SCH --> EXE["Executor"]
    EXE --> WRK["Workers\nCelery workers or K8s pods"]
    WRK --> META
    WRK --> LOGS["Log storage\nlocal or S3 or GCS"]
    WEB["Webserver and API"] --> META
    WEB --> LOGS
    TRG["Triggerer\nasync deferred tasks"] --> META
</div>
</div>

<div class="tw"><table><thead><tr><th>Component</th><th>What it does</th><th>Notes</th></tr></thead><tbody><tr><td>Scheduler</td><td>Creates DagRuns, decides which task instances are ready, hands them to the executor</td><td>Can run several copies (HA) since 2.0</td></tr><tr><td>DAG processor</td><td>Parses <code>.py</code> files in the DAGs folder and serialises them into the DB</td><td>Part of the scheduler by default, can be standalone</td></tr><tr><td>Executor</td><td>Strategy for how tasks run: in-process, Celery, Kubernetes</td><td>Configured in <code>airflow.cfg</code></td></tr><tr><td>Worker</td><td>The process or pod that actually runs task code</td><td>Needs all libraries your tasks import</td></tr><tr><td>Metadata DB</td><td>State of everything: runs, task instances, XCom, connections, variables</td><td>Use Postgres in production, never SQLite</td></tr><tr><td>Webserver</td><td>UI and REST API: graph, grid, logs, trigger, clear</td><td>Read-mostly, does not parse DAGs in 2.x</td></tr><tr><td>Triggerer</td><td>Runs <code>async</code> triggers so deferrable sensors do not hold a worker slot</td><td>Optional</td></tr></tbody></table></div>

Everything is stateless except the metadata DB, which is why you can scale or restart components freely.

### How the scheduler works (the loop)

The scheduler repeats a tight loop. Understanding it explains most "why did my DAG not run" questions.

<div class="diagram">
<div class="diagram-label">sequenceDiagram — scheduler loop</div>
<div class="mermaid">
sequenceDiagram
    participant D as DAG files
    participant S as Scheduler
    participant M as Metadata DB
    participant E as Executor
    participant W as Worker
    S->>D: parse files every few seconds
    S->>M: store serialized DAG
    S->>M: which DAGs are due for a new run
    M-->>S: list of due DAGs
    S->>M: create DagRun and task instances in state none
    S->>M: find tasks whose upstream succeeded
    S->>M: mark ready tasks as scheduled then queued
    S->>E: send queued task instances
    E->>W: start task
    W->>M: state running
    W->>M: state success or failed
    S->>M: update DagRun state
</div>
</div>

Steps in words:

1. **Parse** the DAG files periodically (`min_file_process_interval`, default 30 s). Heavy top-level code here slows everything down.
2. **Create DagRuns** when `now` passes the end of a data interval.
3. **Evaluate dependencies**: a task instance becomes `scheduled` when upstream tasks match its trigger rule, pool slots and concurrency limits allow it.
4. **Queue** to the executor; the executor launches the worker.
5. **Update states** as workers report back; a finished DagRun is marked `success` or `failed` depending on its leaf tasks.

<div class="box info"><b>ℹ️ Top-level code runs every parse</b> Anything outside a task callable (API calls, DB queries, big imports) is executed each time the scheduler parses the file, typically every 30 seconds per file. Keep top-level code cheap.</div>

### DAG file anatomy, line by line

A DAG file is plain Python that the scheduler imports. Importing it must create DAG objects and nothing slow.

{% raw %}
<pre data-lang="python"><code>from __future__ import annotations           # 1  modern type hints

import pendulum                               # 2  timezone-aware datetimes
from datetime import timedelta                # 3  for retry_delay etc.

from airflow import DAG                       # 4  the DAG class
from airflow.operators.bash import BashOperator    # 5  a ready-made operator
from airflow.operators.python import PythonOperator  # 6

def say_count(**context):                     # 7  callable run by the worker
    print("run date:", context["ds"])         # 8  ds = logical date as YYYY-MM-DD

with DAG(                                     # 9  context manager registers tasks
    dag_id="hello_orders",                    # 10 unique name shown in UI
    schedule="0 6 * * *",                     # 11 cron: daily at 06:00
    start_date=pendulum.datetime(2025, 1, 1, tz="Asia/Kolkata"),  # 12 first interval start
    catchup=False,                            # 13 do not create past runs
    max_active_runs=1,                        # 14 one DagRun at a time
    default_args={                            # 15 inherited by every task
        "owner": "data-eng",
        "retries": 2,
        "retry_delay": timedelta(minutes=5),
    },
    tags=["demo", "orders"],                  # 16 UI filter
) as dag:                                     # 17 'dag' is bound for the block

    extract = BashOperator(                   # 18 task 1
        task_id="extract",                    # 19 unique within the DAG
        bash_command="echo extracting {{ ds }}",   # 20 Jinja-templated field
    )

    report = PythonOperator(                  # 21 task 2
        task_id="report",
        python_callable=say_count,            # 22 function reference, not a call
    )

    extract &gt;&gt; report                         # 23 extract runs first</code></pre>
{% endraw %}

<div class="tw"><table><thead><tr><th>Line(s)</th><th>Meaning</th></tr></thead><tbody><tr><td>1-3</td><td>Imports; <code>pendulum</code> is Airflow's datetime library and handles time zones and DST properly</td></tr><tr><td>4-6</td><td>Core classes. Provider operators (Postgres, S3, Spark) come from separate <code>apache-airflow-providers-*</code> packages</td></tr><tr><td>7-8</td><td>The Python function the worker executes. Airflow injects context (<code>ds</code>, <code>ti</code>, <code>logical_date</code>, <code>params</code>...) as keyword args</td></tr><tr><td>9-17</td><td>The DAG definition. <code>with</code> makes every operator created inside belong to this DAG automatically</td></tr><tr><td>11</td><td><code>schedule</code> replaced <code>schedule_interval</code> in 2.4+. Accepts cron, presets (<code>@daily</code>), <code>timedelta</code>, timetables, datasets</td></tr><tr><td>12</td><td><code>start_date</code> is where intervals start; it is not "first run time"</td></tr><tr><td>13</td><td><code>catchup=False</code> prevents the scheduler from creating runs for every interval since <code>start_date</code></td></tr><tr><td>20</td><td><code>{% raw %}{{ ds }}{% endraw %}</code> is Jinja, rendered at runtime just before the task executes</td></tr><tr><td>23</td><td><code>&gt;&gt;</code> sets the dependency; the arrow reads "then"</td></tr></tbody></table></div>

Expected result for the run covering 2025-03-10: `extract` logs `extracting 2025-03-10`, then `report` logs `run date: 2025-03-10`.

<div class="box warn"><b>⚠️ Always give a fixed start_date</b> Do not use <code>datetime.now()</code> as <code>start_date</code>: it changes on every parse and the scheduler will never find a stable first interval.</div>

### Scheduling: cron, logical_date and data intervals

This is the most misunderstood Airflow topic. Airflow runs a DAG **at the end of the interval it is processing**, not at the start. A daily DAG for Monday's data runs on Tuesday.

Terms (Airflow 2.2+):

- **data_interval_start / data_interval_end**: the slice of time the run is responsible for.
- **logical_date** (formerly `execution_date`): equals `data_interval_start` for cron-scheduled runs. It is a label, not the wall-clock moment the run started.
- **run_after / actual start**: when the scheduler really triggers it, normally right after `data_interval_end`.

Worked example: `schedule="0 6 * * *"` (daily 06:00), `start_date=2025-01-01 06:00`.

<div class="tw"><table><thead><tr><th>DagRun</th><th>data_interval_start (= logical_date)</th><th>data_interval_end</th><th>Actually starts</th><th><code>ds</code></th></tr></thead><tbody><tr><td>1</td><td>2025-01-01 06:00</td><td>2025-01-02 06:00</td><td>2025-01-02 06:00</td><td>2025-01-01</td></tr><tr><td>2</td><td>2025-01-02 06:00</td><td>2025-01-03 06:00</td><td>2025-01-03 06:00</td><td>2025-01-02</td></tr><tr><td>3</td><td>2025-01-03 06:00</td><td>2025-01-04 06:00</td><td>2025-01-04 06:00</td><td>2025-01-03</td></tr></tbody></table></div>

So the run that processes 1 January data starts on 2 January, and its `ds` is `2025-01-01`. A task that does `WHERE order_date = '{% raw %}{{ ds }}{% endraw %}'` therefore loads exactly the day that just finished, which is the whole design goal.

<div class="diagram">
<div class="diagram-label">flowchart — data interval timeline</div>
<div class="mermaid">
flowchart LR
    A["01 Jan 06:00\ninterval 1 starts\nlogical_date"] --> B["02 Jan 06:00\ninterval 1 ends\nRun 1 starts"]
    B --> C["03 Jan 06:00\ninterval 2 ends\nRun 2 starts"]
    B -.->|"Run 1 processes data of 01 Jan"| A
    C -.->|"Run 2 processes data of 02 Jan"| B
</div>
</div>

Common schedule values:

<div class="tw"><table><thead><tr><th>Value</th><th>Meaning</th></tr></thead><tbody><tr><td><code>"0 6 * * *"</code></td><td>every day 06:00</td></tr><tr><td><code>"*/15 * * * *"</code></td><td>every 15 minutes</td></tr><tr><td><code>"0 9 * * 1-5"</code></td><td>09:00 Monday to Friday</td></tr><tr><td><code>"0 0 1 * *"</code></td><td>first day of each month 00:00</td></tr><tr><td><code>"@daily"</code> / <code>"@hourly"</code></td><td>midnight daily / start of every hour</td></tr><tr><td><code>timedelta(hours=6)</code></td><td>every 6 hours after the previous interval end</td></tr><tr><td><code>None</code></td><td>manual trigger only</td></tr><tr><td><code>[Dataset("s3://b/orders")]</code></td><td>run when upstream DAGs update that dataset</td></tr></tbody></table></div>

Cron fields are `minute hour day-of-month month day-of-week`. Cron-based schedules are anchored to wall-clock times; `timedelta` schedules are relative to the previous interval.

Useful template variables, with the 2025-01-02 06:00 run above (`logical_date` 2025-01-01):

<div class="tw"><table><thead><tr><th>Variable</th><th>Value</th></tr></thead><tbody><tr><td><code>{% raw %}{{ ds }}{% endraw %}</code></td><td><code>2025-01-01</code></td></tr><tr><td><code>{% raw %}{{ ds_nodash }}{% endraw %}</code></td><td><code>20250101</code></td></tr><tr><td><code>{% raw %}{{ data_interval_start }}{% endraw %}</code></td><td><code>2025-01-01T06:00:00+00:00</code></td></tr><tr><td><code>{% raw %}{{ data_interval_end }}{% endraw %}</code></td><td><code>2025-01-02T06:00:00+00:00</code></td></tr><tr><td><code>{% raw %}{{ prev_ds }}{% endraw %}</code></td><td><code>2024-12-31</code></td></tr></tbody></table></div>

<div class="box note"><b>📝 Airflow 3</b> Airflow 3 de-emphasises <code>logical_date</code> (it can be null for manually triggered runs) and favours <code>data_interval_start/end</code> and <code>run_after</code>. The interval concepts above still hold; prefer the data interval variables in new code.</div>

### Catchup and backfill

**Catchup** is what the scheduler does for intervals between `start_date` and now that have no DagRun yet. With `catchup=True` it creates one run per missed interval; with `catchup=False` it only creates the latest interval.

Example: `start_date=2025-01-01`, daily, DAG first deployed on 2025-01-10.

<div class="tw"><table><thead><tr><th>Setting</th><th>Runs created at first scan</th></tr></thead><tbody><tr><td><code>catchup=True</code></td><td>9 runs (1 Jan to 9 Jan), subject to <code>max_active_runs</code></td></tr><tr><td><code>catchup=False</code></td><td>1 run (the most recent complete interval, 9 Jan)</td></tr></tbody></table></div>

**Backfill** is an explicit, on-demand re-processing of a date range, even for DAGs with `catchup=False`.

<pre data-lang="bash"><code># Re-run 1 Jan to 7 Jan for one DAG (Airflow 2.x CLI)
airflow dags backfill \
  --start-date 2025-01-01 --end-date 2025-01-07 \
  --reset-dagruns \
  hello_orders

# Re-run only failed task instances for a past run: clear them
airflow tasks clear hello_orders \
  --start-date 2025-01-03 --end-date 2025-01-03 \
  --task-regex "^load" --yes</code></pre>

Expected: the scheduler (or the backfill process) creates seven DagRuns with `ds` 2025-01-01 .. 2025-01-07 and runs them in order, respecting `max_active_runs`.

<div class="box tip"><b>✅ Why backfills are safe only with idempotent tasks</b> A backfill re-runs history. If a task appends rows instead of overwriting the partition for its <code>ds</code>, you will duplicate data. See the idempotency section below.</div>

<div class="diagram">
<div class="diagram-label">flowchart — catchup decision</div>
<div class="mermaid">
flowchart TD
    S["Scheduler scans DAG"] --> Q{"Missed intervals\nsince start_date?"}
    Q -->|"no"| N["Create next run on time"]
    Q -->|"yes"| C{"catchup?"}
    C -->|"True"| ALL["Create one run per missed interval"]
    C -->|"False"| ONE["Create only the latest interval"]
    ALL --> LIM["Throttled by max_active_runs"]
</div>
</div>


### Operators, sensors and hooks

Three building blocks that people mix up:

- **Operator**: a template for one unit of work (run SQL, run bash, call Spark). Instantiating it inside a DAG creates a **task**.
- **Sensor**: a special operator that waits until a condition is true (file exists, partition arrives, API returns 200), then succeeds.
- **Hook**: a Python class that wraps the connection to an external system (`PostgresHook`, `S3Hook`). Operators use hooks internally; you use hooks directly inside `@task` functions for custom logic.

<div class="diagram">
<div class="diagram-label">flowchart — operator, hook, connection</div>
<div class="mermaid">
flowchart LR
    T["Task\nan operator instance"] --> H["Hook\nPostgresHook"]
    H --> C["Connection\npostgres_warehouse\nhost user password"]
    C --> X["External system\nPostgres"]
    S["Sensor"] --> H2["Hook\nS3Hook"]
    H2 --> C2["Connection\naws_default"]
    C2 --> Y["S3 bucket"]
</div>
</div>

<div class="tw"><table><thead><tr><th>Operator / sensor</th><th>Typical use</th><th>Package</th></tr></thead><tbody><tr><td><code>BashOperator</code></td><td>Shell command</td><td>core</td></tr><tr><td><code>PythonOperator</code> / <code>@task</code></td><td>Any Python function</td><td>core</td></tr><tr><td><code>EmptyOperator</code></td><td>Placeholder or join point</td><td>core</td></tr><tr><td><code>SQLExecuteQueryOperator</code></td><td>Run SQL on any DB-API connection (replaces <code>PostgresOperator</code>)</td><td><code>apache-airflow-providers-common-sql</code></td></tr><tr><td><code>SparkSubmitOperator</code></td><td><code>spark-submit</code> a job</td><td><code>providers-apache-spark</code></td></tr><tr><td><code>S3ToRedshiftOperator</code></td><td><code>COPY</code> from S3 to Redshift</td><td><code>providers-amazon</code></td></tr><tr><td><code>S3KeySensor</code></td><td>Wait for an S3 object</td><td><code>providers-amazon</code></td></tr><tr><td><code>HttpSensor</code></td><td>Poll an endpoint</td><td><code>providers-http</code></td></tr><tr><td><code>ExternalTaskSensor</code></td><td>Wait for a task in another DAG</td><td>core</td></tr><tr><td><code>TriggerDagRunOperator</code></td><td>Start another DAG</td><td>core</td></tr></tbody></table></div>

Sensors have two modes. Choose carefully because a waiting sensor can hold a worker slot for hours.

<div class="tw"><table><thead><tr><th>Mode</th><th>Behaviour</th><th>When</th></tr></thead><tbody><tr><td><code>poke</code> (default)</td><td>Occupies a worker slot and sleeps between checks</td><td>Very short waits (a few minutes)</td></tr><tr><td><code>reschedule</code></td><td>Releases the slot between pokes, task goes to <code>up_for_reschedule</code></td><td>Waits of minutes to hours</td></tr><tr><td><code>deferrable=True</code></td><td>Hands the wait to the triggerer (async), zero worker slots</td><td>Many long waits, best at scale</td></tr></tbody></table></div>

<pre data-lang="python"><code>from airflow.providers.amazon.aws.sensors.s3 import S3KeySensor

wait_for_file = S3KeySensor(
    task_id="wait_for_file",
    bucket_name="raw-landing",
    bucket_key="orders/dt=2025-01-01/_SUCCESS",
    aws_conn_id="aws_default",
    mode="reschedule",        # free the worker between checks
    poke_interval=300,        # check every 5 minutes
    timeout=6 * 60 * 60,      # give up after 6 hours -&gt; task fails
    soft_fail=False,          # True would mark it skipped instead of failed
)</code></pre>

Result: the task shows `up_for_reschedule` between checks, `success` as soon as `_SUCCESS` exists, or `failed` after six hours.

<div class="box tip"><b>✅ Hook inside TaskFlow</b> When no operator fits, write a <code>@task</code> function and use the hook: <code>PostgresHook("postgres_warehouse").get_pandas_df("select 1")</code>. You keep Airflow's connection management and logging without needing a custom operator.</div>

### Connections, Variables and templating

**Connections** store credentials and endpoints for external systems: a `conn_id`, type, host, login, password, port, extras. Tasks refer to them by name, so code never contains secrets. **Variables** are small global key-value settings (environment name, feature flags).

Ways to define them, in order of production suitability:

1. A **secrets backend** (AWS Secrets Manager, HashiCorp Vault, GCP Secret Manager). Secrets are not in the DB.
2. **Environment variables**: `AIRFLOW_CONN_POSTGRES_WAREHOUSE='postgresql://user:pw@host:5432/dw'` and `AIRFLOW_VAR_ENV=prod`.
3. UI or CLI (stored encrypted in the metadata DB with the Fernet key).

<pre data-lang="bash"><code>export AIRFLOW_CONN_POSTGRES_WAREHOUSE='postgresql://etl:s3cret@dw.internal:5432/analytics'
export AIRFLOW_VAR_ENV=prod

airflow connections get postgres_warehouse
airflow variables get ENV</code></pre>

<pre data-lang="python"><code>from airflow.models import Variable

# Good: read inside the task (runtime), not at module top level
def load(**_):
    env = Variable.get("ENV", default_var="dev")
    print("running in", env)           # prints: running in prod</code></pre>

**Jinja templating**: many operator fields (marked in `template_fields`) are rendered before execution, which injects the run's dates and parameters.

{% raw %}
<pre data-lang="python"><code>from airflow.operators.bash import BashOperator

export_orders = BashOperator(
    task_id="export_orders",
    bash_command=(
        "psql -c \"\\copy (select * from orders "
        "where order_date = '{{ ds }}') to '/tmp/orders_{{ ds_nodash }}.csv' csv\""
    ),
)
# For the run with ds = 2025-01-01 the rendered command filters
# order_date = '2025-01-01' and writes /tmp/orders_20250101.csv</code></pre>
{% endraw %}

<div class="box warn"><b>⚠️ Variable.get at top level</b> <code>Variable.get()</code> outside a task hits the database on every parse of the file. Use templates (<code>{% raw %}{{ var.value.ENV }}{% endraw %}</code>) or call it inside the task.</div>

### Dependencies and trigger rules

Dependencies define edges of the DAG. By default a task runs only when **all upstream tasks succeeded**.

<pre data-lang="python"><code>extract &gt;&gt; transform &gt;&gt; load                 # chain
extract &gt;&gt; [clean_a, clean_b] &gt;&gt; merge        # fan-out then fan-in
load &lt;&lt; merge                              # same as merge &gt;&gt; load

from airflow.models.baseoperator import chain, cross_downstream
chain(start, [a, b], [c, d], end)          # a-c and b-d pairwise
cross_downstream([a, b], [c, d])           # every pair: a-c a-d b-c b-d</code></pre>

<div class="diagram">
<div class="diagram-label">flowchart — fan-out and fan-in</div>
<div class="mermaid">
flowchart LR
    E["extract"] --> V["validate"]
    V --> T1["transform_sales"]
    V --> T2["transform_users"]
    T1 --> L["load_to_warehouse"]
    T2 --> L
    L --> N["notify_team"]
</div>
</div>

A **trigger rule** changes what "ready" means for a task, based on the states of its direct upstream tasks.

<div class="tw"><table><thead><tr><th>trigger_rule</th><th>Task runs when</th><th>Typical use</th></tr></thead><tbody><tr><td><code>all_success</code> (default)</td><td>every upstream succeeded</td><td>normal flow</td></tr><tr><td><code>all_failed</code></td><td>every upstream failed</td><td>fallback path</td></tr><tr><td><code>all_done</code></td><td>all upstream finished, any result</td><td>cleanup, always notify</td></tr><tr><td><code>one_failed</code></td><td>at least one upstream failed (fires immediately)</td><td>alert on first failure</td></tr><tr><td><code>one_success</code></td><td>at least one upstream succeeded</td><td>take the first result</td></tr><tr><td><code>none_failed</code></td><td>no upstream failed or upstream_failed (skipped is fine)</td><td>join after a branch</td></tr><tr><td><code>none_failed_min_one_success</code></td><td>none failed and at least one succeeded</td><td>join after branch, stricter</td></tr><tr><td><code>none_skipped</code></td><td>no upstream skipped</td><td>rare</td></tr><tr><td><code>always</code></td><td>regardless of upstream</td><td>rare</td></tr></tbody></table></div>

<pre data-lang="python"><code>from airflow.operators.empty import EmptyOperator

cleanup = BashOperator(
    task_id="cleanup_tmp",
    bash_command="rm -rf /tmp/work",
    trigger_rule="all_done",      # runs even if transform failed
)
notify_fail = EmptyOperator(task_id="notify_fail", trigger_rule="one_failed")

[extract, transform] &gt;&gt; cleanup
[extract, transform] &gt;&gt; notify_fail</code></pre>

Scenario: `transform` fails after retries. `load` (default rule) becomes `upstream_failed` and is not run; `cleanup` (`all_done`) runs; `notify_fail` runs. The DagRun ends `failed` because a non-skipped leaf failed.

<div class="box info"><b>ℹ️ Join after a branch</b> After a branch, downstream join tasks must use <code>none_failed_min_one_success</code>. With the default <code>all_success</code> the join is skipped because one branch was skipped.</div>

### XCom and the TaskFlow API

**XCom** ("cross-communication") lets tasks exchange small values. A task *pushes* a key/value pair into the metadata DB, a downstream task *pulls* it. The **TaskFlow API** (`@task`, `@dag`) hides this: a returned value is pushed, and a function argument fed from another task is pulled, and the dependency is inferred.

<div class="diagram">
<div class="diagram-label">sequenceDiagram — XCom push and pull</div>
<div class="mermaid">
sequenceDiagram
    participant A as extract task
    participant M as Metadata DB
    participant B as transform task
    A->>M: push return value as XCom key return_value
    Note over M: row with dag_id run_id task_id key value
    B->>M: pull XCom of extract
    M-->>B: file path string
    B->>B: read parquet from that path
</div>
</div>

Classic style:

<pre data-lang="python"><code>def push(**context):
    context["ti"].xcom_push(key="row_count", value=1500)

def pull(**context):
    n = context["ti"].xcom_pull(task_ids="push_task", key="row_count")
    print(f"upstream processed {n} rows")      # upstream processed 1500 rows</code></pre>

TaskFlow style (recommended): a complete, runnable DAG.

<pre data-lang="python"><code>import pendulum
from airflow.decorators import dag, task

@dag(schedule="@daily", start_date=pendulum.datetime(2025, 1, 1), catchup=False)
def orders_taskflow():

    @task
    def extract() -&gt; dict:
        # pretend we wrote a file and counted rows
        return {"path": "s3://lake/bronze/orders/2025-01-01.parquet", "rows": 1500}

    @task
    def validate(meta: dict) -&gt; dict:
        if meta["rows"] &lt; 100:
            raise ValueError("too few rows")
        return meta

    @task
    def load(meta: dict) -&gt; None:
        print(f"loading {meta['rows']} rows from {meta['path']}")

    load(validate(extract()))          # builds extract &gt;&gt; validate &gt;&gt; load

orders_taskflow()</code></pre>

Expected log of `load`: `loading 1500 rows from s3://lake/bronze/orders/2025-01-01.parquet`. Dependencies were created by the function calls; no `>>` needed.

Useful TaskFlow features: `multiple_outputs=True` (return a dict and access keys separately), `@task.virtualenv`, `@task.branch`, `@task.short_circuit`, `@task.bash` in newer versions.

<div class="box warn"><b>⚠️ XCom size</b> XCom lives in the metadata DB (about 48 KB in MySQL, 1 GB limit on Postgres but it will slow the DB long before). Pass paths, ids, counts and small dicts. For big data write to S3 and pass the path, or configure a custom XCom backend that stores values in object storage.</div>

### Branching and conditional execution

Branching picks a path at runtime. The branch function returns the `task_id` (or a list of ids) to follow; every other direct downstream path is **skipped**.

<div class="diagram">
<div class="diagram-label">flowchart — branching</div>
<div class="mermaid">
flowchart LR
    X["extract"] --> B{"check_rows\n@task.branch"}
    B -->|"rows under 100"| A["alert_small_load"]
    B -->|"rows 100 or more"| L["load_full"]
    A --> J["finish\nnone_failed_min_one_success"]
    L --> J
</div>
</div>

<pre data-lang="python"><code>from airflow.decorators import task
from airflow.operators.empty import EmptyOperator

@task
def extract() -&gt; int:
    return 42                       # row count

@task.branch
def check_rows(n: int) -&gt; str:
    return "alert_small_load" if n &lt; 100 else "load_full"

alert = EmptyOperator(task_id="alert_small_load")
load_full = EmptyOperator(task_id="load_full")
finish = EmptyOperator(task_id="finish", trigger_rule="none_failed_min_one_success")

check_rows(extract()) &gt;&gt; [alert, load_full]
[alert, load_full] &gt;&gt; finish</code></pre>

With `extract` returning 42: `alert_small_load` runs (`success`), `load_full` is `skipped`, `finish` runs because of its trigger rule. Related tools:

<div class="tw"><table><thead><tr><th>Tool</th><th>Behaviour</th></tr></thead><tbody><tr><td><code>@task.branch</code> / <code>BranchPythonOperator</code></td><td>Choose which downstream task ids run</td></tr><tr><td><code>@task.short_circuit</code></td><td>If it returns falsy, skip everything downstream</td></tr><tr><td><code>LatestOnlyOperator</code></td><td>Skip downstream unless the run is the most recent interval (useful with catchup)</td></tr><tr><td><code>AirflowSkipException</code></td><td>Raise inside a task to mark it skipped</td></tr></tbody></table></div>

### Dynamic task mapping

Sometimes the number of tasks is not known until runtime: one task per file in a folder, per customer, per partition. **Dynamic task mapping** (Airflow 2.3+) creates mapped task instances from a list returned by an upstream task, with no loops over DAG files.

<div class="diagram">
<div class="diagram-label">flowchart — dynamic task mapping</div>
<div class="mermaid">
flowchart LR
    L["list_files\nreturns 3 paths"] --> P0["process 0"]
    L --> P1["process 1"]
    L --> P2["process 2"]
    P0 --> S["summarize\ncollects all results"]
    P1 --> S
    P2 --> S
</div>
</div>

<pre data-lang="python"><code>from airflow.decorators import task

@task
def list_files() -&gt; list[str]:
    return ["a.csv", "b.csv", "c.csv"]          # could be dynamic, from S3 listing

@task
def process(path: str) -&gt; int:
    print("processing", path)
    return len(path)                             # stand-in for rows processed

@task
def summarize(counts: list[int]) -&gt; None:
    print("total:", sum(counts))                 # total: 15 (5+5+5)

summarize(process.expand(path=list_files()))</code></pre>

`expand()` makes one task instance per element (map index 0, 1, 2); the UI shows them as one task with a mapped count. Use `partial()` for fixed arguments: `process.partial(bucket="raw").expand(path=files)`. Results arrive at the downstream task as a lazy list.

<div class="box tip"><b>✅ Mapping vs generating tasks in a for loop</b> A <code>for</code> loop over a static Python list is fine and creates tasks at parse time. Use mapping only when the list depends on data at runtime. Cap fan-out with <code>max_active_tis_per_dag</code> or a pool.</div>

### Task states and the lifecycle

Every task instance moves through states stored in the metadata DB. The UI colours map directly to them.

<div class="diagram">
<div class="diagram-label">stateDiagram-v2 — task instance lifecycle</div>
<div class="mermaid">
stateDiagram-v2
    state "no status" as nostat
    state "scheduled" as scheduled
    state "queued" as queued
    state "running" as running
    state "success" as success
    state "failed" as failed
    state "up_for_retry" as retry
    state "up_for_reschedule" as resched
    state "skipped" as skipped
    state "upstream_failed" as upfail
    [*] --> nostat
    nostat --> scheduled: dependencies met
    nostat --> skipped: branch skipped it
    nostat --> upfail: upstream failed
    scheduled --> queued: sent to executor
    queued --> running: worker picks up
    running --> success: finished ok
    running --> failed: error and no retries left
    running --> retry: error and retries left
    running --> resched: sensor not ready
    resched --> scheduled: next poke time
    retry --> scheduled: after retry_delay
    success --> [*]
    failed --> [*]
</div>
</div>

<div class="tw"><table><thead><tr><th>State</th><th>Meaning</th></tr></thead><tbody><tr><td><code>none</code></td><td>Task instance created, nothing decided yet</td></tr><tr><td><code>scheduled</code></td><td>Scheduler found dependencies satisfied</td></tr><tr><td><code>queued</code></td><td>Handed to the executor, waiting for a slot</td></tr><tr><td><code>running</code></td><td>Executing on a worker</td></tr><tr><td><code>success</code></td><td>Finished normally</td></tr><tr><td><code>failed</code></td><td>Raised an error and exhausted retries</td></tr><tr><td><code>up_for_retry</code></td><td>Failed but will retry after <code>retry_delay</code></td></tr><tr><td><code>up_for_reschedule</code></td><td>Sensor in reschedule mode waiting for next poke</td></tr><tr><td><code>upstream_failed</code></td><td>Not run because an upstream task failed</td></tr><tr><td><code>skipped</code></td><td>Not run due to branching or skip exception</td></tr><tr><td><code>deferred</code></td><td>Waiting on the triggerer (async)</td></tr><tr><td><code>removed</code></td><td>Task no longer exists in the DAG file</td></tr></tbody></table></div>

Clearing a task (UI "Clear" or `airflow tasks clear`) resets it to `none` so the scheduler runs it again, together with downstream tasks if chosen.

### Retries, timeouts, SLAs and alerts

Failures are normal; configure for them.

<pre data-lang="python"><code>from datetime import timedelta
from airflow.operators.bash import BashOperator

def notify_slack(context):
    ti = context["task_instance"]
    print(f"FAILED {ti.dag_id}.{ti.task_id} run {context['run_id']} try {ti.try_number}")

load = BashOperator(
    task_id="load",
    bash_command="python load.py",
    retries=3,                              # up to 4 attempts in total
    retry_delay=timedelta(minutes=5),
    retry_exponential_backoff=True,         # 5, 10, 20 minutes ...
    max_retry_delay=timedelta(hours=1),
    execution_timeout=timedelta(hours=2),   # kill a single attempt after 2 h
    on_failure_callback=notify_slack,       # after final failure
    on_retry_callback=None,
    email_on_failure=True,
    email=["data-team@example.com"],
)</code></pre>

<div class="tw"><table><thead><tr><th>Setting</th><th>Scope</th><th>What it does</th></tr></thead><tbody><tr><td><code>retries</code>, <code>retry_delay</code></td><td>task</td><td>Re-run failed attempts; state goes <code>up_for_retry</code></td></tr><tr><td><code>execution_timeout</code></td><td>task</td><td>Fail an attempt that runs too long</td></tr><tr><td><code>dagrun_timeout</code></td><td>DAG</td><td>Fail the whole run after N time</td></tr><tr><td><code>sla</code> / <code>sla_miss_callback</code></td><td>task (2.x)</td><td>Record and alert when a task is not finished by <code>data_interval_end + sla</code></td></tr><tr><td><code>on_failure_callback</code>, <code>on_success_callback</code>, <code>on_retry_callback</code></td><td>task or DAG</td><td>Python hook for Slack, PagerDuty, email</td></tr><tr><td><code>email_on_failure</code></td><td>task</td><td>Needs SMTP configured</td></tr></tbody></table></div>

<div class="box info"><b>ℹ️ SLA status</b> The classic <code>sla</code> feature was removed in Airflow 3; newer releases use Deadline Alerts. Whatever the version, the underlying pattern is the same: define the time by which data must be ready and alert if it is not.</div>

Scenario: nightly load takes 30 minutes normally, must be done by 07:00, runs at 06:00. Set `execution_timeout=timedelta(minutes=90)` so a hung job dies, `retries=2` for transient errors, and an `on_failure_callback` that posts to the on-call channel; a stuck load thereby alerts at around 07:30 rather than silently blocking dashboards.

### Executors compared

The executor decides **where and how** task instances run. The scheduler is the same in all cases.

<div class="diagram">
<div class="diagram-label">flowchart — executor choices</div>
<div class="mermaid">
flowchart TD
    S["Scheduler"] --> E{"Executor"}
    E -->|"Sequential"| Q1["Same process\none task at a time"]
    E -->|"Local"| Q2["Subprocesses on\nscheduler machine"]
    E -->|"Celery"| Q3["Message broker\nRedis or RabbitMQ"]
    Q3 --> W1["Celery worker 1"]
    Q3 --> W2["Celery worker N"]
    E -->|"Kubernetes"| Q4["API server creates\none pod per task"]
</div>
</div>

<div class="tw"><table><thead><tr><th>Executor</th><th>Parallelism</th><th>Isolation</th><th>Latency to start</th><th>Ops complexity</th><th>Best for</th></tr></thead><tbody><tr><td>Sequential</td><td>none</td><td>none</td><td>instant</td><td>trivial</td><td>learning only, SQLite</td></tr><tr><td>Local</td><td>one machine's CPUs</td><td>process</td><td>low</td><td>low</td><td>small single-node installs</td></tr><tr><td>Celery</td><td>scales with worker count</td><td>shared worker env</td><td>low (workers warm)</td><td>medium (broker plus workers)</td><td>steady production load</td></tr><tr><td>Kubernetes</td><td>cluster capacity</td><td>pod per task, own image</td><td>seconds (pod start)</td><td>higher</td><td>spiky load, per-task dependencies</td></tr><tr><td>CeleryKubernetes (hybrid)</td><td>both</td><td>mixed</td><td>mixed</td><td>highest</td><td>large mixed workloads</td></tr></tbody></table></div>

Pick Celery when you have many short tasks and want low latency; pick Kubernetes when tasks need different Python environments or you want to scale to zero. In newer releases (2.10+) multiple executors can be configured side by side, and tasks choose one with `executor=` .

### Pools, concurrency and parallelism

Without limits a fan-out DAG can overwhelm a database or API. Airflow has layered limits; the lowest applicable one wins.

<div class="tw"><table><thead><tr><th>Setting</th><th>Level</th><th>Limits</th></tr></thead><tbody><tr><td><code>parallelism</code></td><td>whole installation</td><td>max running task instances overall (default 32)</td></tr><tr><td><code>max_active_runs_per_dag</code> / <code>max_active_runs</code></td><td>DAG</td><td>concurrent DagRuns</td></tr><tr><td><code>max_active_tasks</code> (<code>concurrency</code>)</td><td>DAG</td><td>concurrent task instances across runs of one DAG</td></tr><tr><td><code>max_active_tis_per_dag</code></td><td>task</td><td>concurrent instances of that task, including mapped copies</td></tr><tr><td><strong>pool</strong> and <code>pool_slots</code></td><td>any tasks sharing a pool</td><td>named slot counter, often per external resource</td></tr><tr><td><code>worker_concurrency</code></td><td>Celery worker</td><td>tasks per worker process</td></tr></tbody></table></div>

A **pool** models a shared resource. Example: your source database tolerates 4 concurrent connections.

<pre data-lang="bash"><code>airflow pools set source_db 4 "Max 4 parallel queries on source DB"</code></pre>

<pre data-lang="python"><code>extract_part = PythonOperator.partial(
    task_id="extract_part",
    python_callable=extract_one_partition,
    pool="source_db",            # at most 4 running at once, across all DAGs
    priority_weight=5,           # higher number is scheduled first when slots are scarce
).expand(op_args=[[i] for i in range(20)])</code></pre>

Twenty mapped tasks are created, but only four run simultaneously; the other sixteen stay `scheduled` until a slot frees up.

### Idempotency and safe re-runs

A task is **idempotent** if running it several times for the same data interval gives the same final state as running it once. Airflow retries, clears, and backfills; non-idempotent tasks turn each of those into data corruption.

<div class="diagram">
<div class="diagram-label">flowchart — idempotent load pattern</div>
<div class="mermaid">
flowchart LR
    A["Read source rows\nfor data_interval"] --> B["Write to staging table\nor temp path"]
    B --> C["Delete or overwrite target\npartition for ds"]
    C --> D["Insert from staging\nin one transaction"]
</div>
</div>

Bad versus good:

<div class="tw"><table><thead><tr><th>Pattern</th><th>Re-run result</th></tr></thead><tbody><tr><td><code>INSERT INTO sales SELECT ... WHERE dt = today</code> using <code>now()</code> or <code>today</code></td><td>Depends on when it runs, duplicates on retry</td></tr><tr><td><code>INSERT INTO sales SELECT ... WHERE dt = '{% raw %}{{ ds }}{% endraw %}'</code> with no cleanup</td><td>Duplicates on re-run</td></tr><tr><td><code>DELETE FROM sales WHERE dt = '{% raw %}{{ ds }}{% endraw %}'</code> then insert, in one transaction</td><td>Same result on every re-run</td></tr><tr><td><code>MERGE</code> / upsert on business key</td><td>Same result on every re-run</td></tr><tr><td>Overwrite the partition <code>s3://lake/sales/dt={% raw %}{{ ds }}{% endraw %}/</code></td><td>Same result on every re-run</td></tr></tbody></table></div>

{% raw %}
<pre data-lang="sql"><code>-- idempotent daily load, run by an Airflow task for each ds
BEGIN;
DELETE FROM analytics.sales WHERE sale_date = '{{ ds }}';
INSERT INTO analytics.sales
SELECT * FROM staging.sales_raw WHERE sale_date = '{{ ds }}';
COMMIT;
-- Run it once or five times: row count for that date is identical</code></pre>
{% endraw %}

Rules of thumb: derive dates from the data interval (never `datetime.now()`), write outputs to paths keyed by `ds`, avoid appending, make each task atomic (all or nothing), and keep inputs immutable (read from bronze, not from a table you are modifying).

### Testing DAGs

Test in layers, cheapest first.

1. **Import test**: every DAG file loads without errors and has no cycles.
2. **Structure test**: expected tasks, dependencies, tags, retries.
3. **Unit test the Python logic** outside Airflow (plain pytest on functions).
4. **Single task run**: `airflow tasks test`.
5. **Whole DAG run in-process**: `dag.test()`.

<pre data-lang="python"><code># tests/test_dags.py
from airflow.models import DagBag

def test_no_import_errors():
    bag = DagBag(dag_folder="dags/", include_examples=False)
    assert bag.import_errors == {}, bag.import_errors

def test_orders_dag_structure():
    bag = DagBag(dag_folder="dags/", include_examples=False)
    dag = bag.get_dag("hello_orders")
    assert dag is not None
    assert {t.task_id for t in dag.tasks} == {"extract", "report"}
    assert dag.get_task("report").upstream_task_ids == {"extract"}
    assert dag.default_args["retries"] &gt;= 1</code></pre>

<pre data-lang="bash"><code># run one task for a given logical date without recording state
airflow tasks test hello_orders extract 2025-01-01
# prints the rendered command and its output, for example: extracting 2025-01-01

# run the whole DAG in one process (also available as dag.test() in Python)
airflow dags test hello_orders 2025-01-01</code></pre>

<div class="box tip"><b>✅ CI step</b> Run <code>pytest</code> with the DagBag import test on every pull request. It catches typos, missing imports and cycles before they reach the scheduler, where a broken file shows up as an "import error" banner and the DAG disappears.</div>

### Deployment

How DAG code reaches the scheduler and workers matters as much as the DAG itself.

<div class="diagram">
<div class="diagram-label">flowchart — deployment pipeline</div>
<div class="mermaid">
flowchart LR
    G["Git repo\ndags and plugins"] --> CI["CI\nlint plus pytest"]
    CI --> IMG["Build image\nor sync bundle"]
    IMG --> ENV["Airflow environment\ndev then staging then prod"]
    ENV --> SCH["Scheduler"]
    ENV --> WRK["Workers"]
    SECR["Secrets backend"] --> ENV
</div>
</div>

<div class="tw"><table><thead><tr><th>Option</th><th>How</th><th>Notes</th></tr></thead><tbody><tr><td>Docker Compose</td><td>Official <code>docker-compose.yaml</code></td><td>Local dev and demos</td></tr><tr><td>Helm chart on Kubernetes</td><td><code>helm install airflow apache-airflow/airflow</code></td><td>Standard for production; use git-sync or bake DAGs into image</td></tr><tr><td>Managed service</td><td>MWAA (AWS), Cloud Composer (GCP), Astronomer</td><td>Less ops, constrained config</td></tr><tr><td>VM with systemd</td><td>scheduler, webserver, workers as services</td><td>Simple, manual scaling</td></tr></tbody></table></div>

Production checklist: external **Postgres** metadata DB with backups, a **secrets backend**, **remote logging** (S3/GCS) so logs survive pod deletion, a pinned Airflow version with a constraints file for dependencies, separate dev/stage/prod environments, DAGs deployed by CI (git-sync or image build), monitoring on scheduler heartbeat and DAG import errors, and `airflow db clean` on a schedule to prune old metadata.

<pre data-lang="bash"><code># Pinning dependencies with the official constraints file
AIRFLOW_VERSION=2.9.3
PYTHON_VERSION=3.11
pip install "apache-airflow==${AIRFLOW_VERSION}" \
  --constraint "https://raw.githubusercontent.com/apache/airflow/constraints-${AIRFLOW_VERSION}/constraints-${PYTHON_VERSION}.txt"

airflow db migrate          # create or upgrade metadata schema (2.7+)
airflow standalone          # dev only: db, webserver, scheduler in one process</code></pre>

### Best practices

<div class="box tip"><b>✅ DAG design</b>
<ul>
<li>Make tasks <strong>idempotent and atomic</strong>: one task, one job, safe to retry.</li>
<li>Keep top-level code <strong>light</strong>: no API calls, no DB queries, no heavy imports at parse time.</li>
<li>Pass <strong>paths and ids</strong> through XCom, not data frames.</li>
<li>Use <strong>data interval variables</strong> (<code>ds</code>, <code>data_interval_start</code>), never <code>datetime.now()</code>.</li>
<li>Set <strong>retries</strong>, <strong>execution_timeout</strong> and <strong>on_failure_callback</strong> in <code>default_args</code>.</li>
<li>Use <strong>pools</strong> for fragile resources and <strong>reschedule or deferrable sensors</strong> for long waits.</li>
<li>Offload heavy compute to Spark, the warehouse, or Kubernetes pods; Airflow orchestrates only.</li>
<li>Keep secrets in a <strong>secrets backend</strong>, not in code or Variables.</li>
<li>Use <strong>tags</strong>, <strong>owners</strong> and docs (<code>doc_md</code>) so people can find and understand DAGs.</li>
<li>Prefer <strong>TaskFlow</strong> and <strong>datasets</strong> over brittle <code>ExternalTaskSensor</code> chains.</li>
<li>Set <code>catchup=False</code> unless you want automatic history; use explicit backfills otherwise.</li>
<li>Test imports in CI; version-control everything.</li>
</ul>
</div>

<div class="box warn"><b>⚠️ Anti-patterns</b> Giant DAG files with hundreds of tasks that parse slowly; one monolithic task that does extract, transform and load (no partial retry); writing results to the worker's local disk and reading them in the next task (a different worker may run it); sleeping in <code>PythonOperator</code> instead of using a sensor.</div>

### Troubleshooting guide

<div class="tw"><table><thead><tr><th>Symptom</th><th>Likely cause</th><th>Fix</th></tr></thead><tbody><tr><td>New DAG not in UI</td><td>Import error, file not in DAGs folder, or no <code>dag</code>/<code>DAG</code> string in file (safe-mode parse)</td><td>Check "DAG Import Errors" banner, <code>airflow dags list-import-errors</code>, fix syntax</td></tr><tr><td>DAG visible but never runs</td><td>DAG is paused, <code>start_date</code> in future, schedule is <code>None</code></td><td>Unpause, check <code>start_date</code> and data interval</td></tr><tr><td>"It ran a day late"</td><td>Misunderstood data interval: run starts at interval end</td><td>Use <code>ds</code>/<code>data_interval_end</code> correctly; this is expected</td></tr><tr><td>Hundreds of old runs started</td><td><code>catchup=True</code> with an old <code>start_date</code></td><td>Set <code>catchup=False</code>, delete runs, or limit <code>max_active_runs</code></td></tr><tr><td>Tasks stuck in <code>queued</code></td><td>Pool full, worker down, parallelism hit, broker issue</td><td>Check pool slots, worker logs, <code>parallelism</code>, Celery queue</td></tr><tr><td>Tasks stuck in <code>scheduled</code></td><td>Concurrency limits, <code>max_active_tasks</code>, scheduler overloaded</td><td>Review limits, scheduler logs, slow parsing</td></tr><tr><td>Task failed without logs</td><td>Worker killed (OOM) or remote log config missing</td><td>Check pod/worker OOM events, enable remote logging</td></tr><tr><td><code>Zombie</code> or <code>heartbeat</code> errors</td><td>Worker lost connection to DB, node died</td><td>Increase resources, check DB connectivity, rerun</td></tr><tr><td><code>Broken DAG: No module named x</code></td><td>Package not installed on scheduler/workers</td><td>Build the dependency into the image on all components</td></tr><tr><td>XCom value is <code>None</code></td><td>Upstream task did not return or used wrong <code>task_ids</code>/<code>key</code></td><td>Return a value, check pull parameters</td></tr><tr><td><code>Variable not found</code></td><td>Not defined in this environment</td><td>Define via env var/secrets, use <code>default_var</code></td></tr><tr><td>Join task skipped after branch</td><td>Default <code>all_success</code> trigger rule</td><td>Use <code>none_failed_min_one_success</code></td></tr><tr><td>Scheduler slow, high DB load</td><td>Too many DAG files, heavy top-level code, huge metadata tables</td><td>Simplify parsing, tune intervals, run <code>airflow db clean</code></td></tr><tr><td>Re-run created duplicate rows</td><td>Non-idempotent load</td><td>Delete-then-insert per <code>ds</code> or upsert</td></tr></tbody></table></div>

Debug flow: open the task's **log** in the grid view, read the real exception, reproduce it with `airflow tasks test dag_id task_id date`, then fix and **clear** the failed task so the scheduler re-runs it and its downstream tasks.

### Interview quick answers

<div class="box note"><b>📝 Q1. What is Airflow and what is a DAG?</b> A Python-based workflow orchestrator. A DAG is a directed acyclic graph of tasks defining order and schedule. Airflow schedules, runs, retries and monitors tasks; it does not process the data itself.</div>

<div class="box note"><b>📝 Q2. Explain logical_date and why a daily DAG runs the next day.</b> A run covers a data interval, for example 1 Jan 06:00 to 2 Jan 06:00. It can only start once the interval has ended, so it starts on 2 Jan. <code>logical_date</code> (and <code>ds</code>) label the interval start, 1 Jan.</div>

<div class="box note"><b>📝 Q3. Difference between catchup and backfill?</b> Catchup is automatic creation of runs for intervals missed since <code>start_date</code> (controlled by the DAG flag). Backfill is a manual command to re-run a chosen date range.</div>

<div class="box note"><b>📝 Q4. Operator vs sensor vs hook?</b> Operator: a unit of work template. Sensor: an operator that waits for a condition. Hook: a connector class to an external system that operators and your code reuse.</div>

<div class="box note"><b>📝 Q5. How do tasks share data?</b> XCom, which stores small serialisable values in the metadata DB. TaskFlow does it implicitly through return values and arguments. For large data pass a storage path.</div>

<div class="box note"><b>📝 Q6. What are trigger rules?</b> Rules defining when a task runs based on upstream states: default <code>all_success</code>, plus <code>all_done</code>, <code>one_failed</code>, <code>none_failed_min_one_success</code> and others. Needed for cleanup tasks and joins after branches.</div>

<div class="box note"><b>📝 Q7. Which executor would you choose?</b> Local for small single-node setups; Celery for steady multi-worker production; Kubernetes for per-task isolation, custom images and elastic scaling. Sequential is only for learning.</div>

<div class="box note"><b>📝 Q8. How do you make a pipeline idempotent?</b> Derive everything from the data interval, write to partitioned outputs keyed by date and overwrite them, use delete-then-insert in a transaction or upsert, avoid appends and <code>now()</code>.</div>

<div class="box note"><b>📝 Q9. How do you limit load on a database?</b> Use a pool with N slots for tasks that touch it, plus <code>max_active_tis_per_dag</code> and <code>max_active_runs</code>.</div>

<div class="box note"><b>📝 Q10. How would you create tasks for each file in a bucket?</b> Dynamic task mapping: a task lists the files and a downstream task calls <code>.expand(path=files)</code>.</div>

<div class="box note"><b>📝 Q11. A DAG stopped running. How do you debug?</b> Is it paused? Import errors? Scheduler healthy? Pool or concurrency limits? Check the run's task states and logs, reproduce with <code>airflow tasks test</code>, fix, clear tasks.</div>

<div class="box note"><b>📝 Q12. Why shouldn't you do heavy work in top-level DAG code?</b> The scheduler imports every DAG file repeatedly (about every 30 s). Slow top-level code starves scheduling and hits databases and APIs constantly.</div>

---

## Data Engineering {#data-engineer}

Data engineering is the discipline of moving data from where it is produced to where it can be trusted and used: reliably, at scale, on schedule. A data engineer builds the pipelines, storage layers and quality checks that analysts, data scientists and applications depend on.

<div class="diagram">
<div class="diagram-label">mind map — Data Engineering</div>
<div class="mermaid">
mindmap
  root((Data Engineering))
    Pipeline architecture
      Sources
      Ingestion batch and stream
      Data lake
      Serving layer
      Orchestration
    ETL vs ELT
      ETL transform before load
      ELT transform in warehouse
    Lake vs warehouse
      Lake schema on read
      Warehouse schema on write
      Lakehouse
        Delta Lake
        Iceberg
        Hudi
    Batch vs streaming
      Batch cheaper and simpler
      Streaming low latency
    Formats
      CSV
      JSON
      Parquet default choice
      Avro
      ORC
      Delta and Iceberg
    Spark
      Driver
      Cluster manager
      Lazy transformations
      Actions trigger work
    dbt
      SQL models
      Tests
      Lineage
    Medallion
      Bronze raw
      Silver cleaned
      Gold business-ready
    Tools ecosystem
</div>
</div>

### The role of a data engineer

Every company produces data in operational systems (an orders database, app events, payment gateway files). Those systems are built to run the business, not to answer questions. Analysts need yesterday's revenue by city; ML teams need clean features; finance needs numbers that reconcile. The data engineer sits between: **collect, store, clean, model, serve and keep it all running**.

<div class="diagram">
<div class="diagram-label">flowchart — who depends on the data engineer</div>
<div class="mermaid">
flowchart LR
    APP["Apps and databases\nproducers"] --> DE["Data engineer\npipelines storage quality"]
    DE --> AN["Analysts\nSQL and dashboards"]
    DE --> DS["Data scientists\nfeatures and training sets"]
    DE --> PM["Product and finance\ntrusted metrics"]
    DE --> SVC["Services\ndata APIs"]
</div>
</div>

<div class="tw"><table><thead><tr><th>Role</th><th>Main question</th><th>Typical tools</th></tr></thead><tbody><tr><td>Data engineer</td><td>Is the right data here, on time, correct?</td><td>Python, SQL, Spark, Airflow, dbt, Kafka</td></tr><tr><td>Analytics engineer</td><td>Are metrics modelled and tested?</td><td>dbt, SQL, BI tools</td></tr><tr><td>Data analyst</td><td>What happened and why?</td><td>SQL, BI</td></tr><tr><td>Data scientist / ML engineer</td><td>What will happen?</td><td>Python, ML libraries</td></tr><tr><td>Platform / DevOps</td><td>Is the infrastructure healthy?</td><td>Terraform, Kubernetes</td></tr></tbody></table></div>

Day-to-day work: building ingestion jobs, modelling tables, tuning slow queries, fixing a broken pipeline at 7 am, adding data quality tests, controlling cost, and agreeing on **data contracts** with the teams that produce data.

<div class="box tip"><b>✅ Skills checklist</b> Strong SQL (window functions, joins, query plans), Python, one distributed engine (Spark), a warehouse (Snowflake, BigQuery, Redshift), an orchestrator (Airflow), a modelling tool (dbt), cloud storage and IAM basics, Git and CI, and data modelling fundamentals.</div>

### Pipeline architecture

A pipeline is a repeatable path with stages: **sources, ingestion, storage, transformation, serving**, wrapped by **orchestration, quality and observability**.

<div class="diagram">
<div class="diagram-label">flowchart — end-to-end pipeline</div>
<div class="mermaid">
flowchart LR
    subgraph SRC["Sources"]
        DB["Databases"]
        API["APIs"]
        STR["Kafka or Kinesis"]
        FIL["Files"]
    end
    subgraph INGEST["Ingestion"]
        BI["Batch ingest\nAirflow Glue Fivetran"]
        SI["Stream ingest\nKafka Connect"]
    end
    subgraph LAKE["Data lake"]
        BR["Bronze\nraw"] --> SI2["Silver\ncleaned"] --> GO["Gold\nbusiness ready"]
    end
    SRC --> INGEST
    INGEST --> BR
    GO --> DW["Warehouse\nSnowflake BigQuery Redshift"]
    DW --> BIT["BI tools"]
    GO --> ML["ML features"]
    ORCH["Orchestrator\nAirflow"] -.-> LAKE
    ORCH -.-> INGEST
</div>
</div>

<div class="tw"><table><thead><tr><th>Stage</th><th>Question it answers</th><th>Examples</th></tr></thead><tbody><tr><td>Sources</td><td>Where is data born?</td><td>Postgres, SaaS APIs, clickstream, CSV drops</td></tr><tr><td>Ingestion</td><td>How does it get in?</td><td>Fivetran, Airbyte, Kafka Connect, custom Python</td></tr><tr><td>Storage</td><td>Where does it live cheaply and durably?</td><td>S3, GCS, ADLS</td></tr><tr><td>Transformation</td><td>How is it cleaned and modelled?</td><td>Spark, dbt, SQL</td></tr><tr><td>Serving</td><td>How do users consume it?</td><td>Warehouse, BI, feature store, API</td></tr><tr><td>Orchestration</td><td>In what order, when, and what on failure?</td><td>Airflow, Dagster, Prefect</td></tr><tr><td>Governance</td><td>Who may see what, where did it come from?</td><td>Catalog, lineage, IAM</td></tr></tbody></table></div>

Design principles: keep **raw data immutable** so you can reprocess; make every step **idempotent**; separate **storage from compute**; prefer **simple batch** unless the business truly needs low latency; and automate quality checks at layer boundaries.

### Ingestion: full load, incremental load, batch and streaming

**Ingestion** copies data from a source into your platform. Choose the pattern by source size and how changes can be detected.

<div class="tw"><table><thead><tr><th>Pattern</th><th>How</th><th>Pros</th><th>Cons</th></tr></thead><tbody><tr><td>Full snapshot</td><td>Copy the whole table each run</td><td>Simple, catches deletes</td><td>Slow and costly for big tables</td></tr><tr><td>Incremental by timestamp</td><td><code>WHERE updated_at &gt; last_watermark</code></td><td>Cheap</td><td>Misses hard deletes, needs reliable <code>updated_at</code></td></tr><tr><td>Incremental by id</td><td><code>WHERE id &gt; last_id</code></td><td>Cheap, good for append-only</td><td>Misses updates</td></tr><tr><td>CDC (change data capture)</td><td>Read the DB transaction log</td><td>Captures inserts, updates, deletes with low load</td><td>More moving parts</td></tr><tr><td>API pull</td><td>Paginate through REST with a cursor</td><td>Works for SaaS</td><td>Rate limits, schema drift</td></tr><tr><td>Event stream</td><td>Consume events as they are produced</td><td>Low latency</td><td>Ordering, duplicates, late data</td></tr></tbody></table></div>

Worked example: incremental load by watermark. `orders` has 50 million rows; 40 thousand change per day.

<pre data-lang="python"><code>import pandas as pd
from sqlalchemy import create_engine, text

src = create_engine("postgresql://ro@source/shop")

def read_watermark() -&gt; str:
    # last successfully loaded updated_at, stored in a control table
    return "2025-03-09 23:59:59"

watermark = read_watermark()
q = text("SELECT * FROM orders WHERE updated_at &gt; :wm AND updated_at &lt;= :now")
df = pd.read_sql(q, src, params={"wm": watermark, "now": "2025-03-10 23:59:59"})
print(len(df), "changed rows")        # 41,208 changed rows instead of 50,000,000

df.to_parquet("s3://lake/bronze/orders/load_date=2025-03-10/part-0.parquet")
# only after the write succeeds: update the watermark to 2025-03-10 23:59:59</code></pre>

<div class="box warn"><b>⚠️ Watermark traps</b> Use <code>&gt;</code> with a closed upper bound and move the watermark only after a successful write. Late-committed rows with an older <code>updated_at</code> can be missed; re-read a small overlap window (for example 1 hour) and de-duplicate in silver.</div>

<div class="diagram">
<div class="diagram-label">flowchart — incremental ingestion with a watermark</div>
<div class="mermaid">
flowchart LR
    W["Read last watermark"] --> Q["Query source\nupdated_at greater than watermark"]
    Q --> L["Write to bronze\npartitioned by load_date"]
    L --> OK{"Write succeeded?"}
    OK -->|"yes"| U["Advance watermark"]
    OK -->|"no"| R["Keep old watermark\nretry next run"]
</div>
</div>

### ETL vs ELT with a worked example

**ETL**: Extract, Transform, then Load into the target. Transformation happens in a separate engine or tool, so only cleaned data lands in the warehouse. **ELT**: Extract, Load raw data first, then Transform inside the warehouse with SQL. ELT became dominant because cloud warehouses separate cheap storage from elastic compute.

<div class="diagram">
<div class="diagram-label">flowchart — ETL vs ELT</div>
<div class="mermaid">
flowchart LR
    subgraph ETL["ETL"]
        direction TB
        E1["Extract\nfrom source"] --> T1["Transform\nin ETL tool or Spark"] --> L1["Load\nclean data only"]
    end
    subgraph ELT["ELT"]
        direction TB
        E2["Extract\nfrom source"] --> L2["Load\nraw into warehouse or lake"] --> T2["Transform\nSQL or dbt in warehouse"]
    end
</div>
</div>

Source rows (raw orders, amounts in USD, messy):

<div class="tw"><table><thead><tr><th>order_id</th><th>customer</th><th>amount_usd</th><th>order_ts</th><th>status</th></tr></thead><tbody><tr><td>101</td><td>Asha</td><td>100.0</td><td>2025-03-01 10:15</td><td>COMPLETED</td></tr><tr><td>102</td><td>ravi</td><td>250.5</td><td>2025-03-01 11:40</td><td>completed</td></tr><tr><td>102</td><td>ravi</td><td>250.5</td><td>2025-03-01 11:40</td><td>completed</td></tr><tr><td>103</td><td>Meena</td><td>NULL</td><td>2025-03-02 09:05</td><td>CANCELLED</td></tr></tbody></table></div>

**ETL version**: a Python job cleans before loading, so the warehouse only ever sees the final table.

<pre data-lang="python"><code>import pandas as pd

raw = pd.read_csv("orders_2025-03-01.csv")
clean = (raw
    .drop_duplicates(subset="order_id")                       # removes second row of 102
    .assign(customer=lambda d: d.customer.str.title(),         # ravi -&gt; Ravi
            status=lambda d: d.status.str.lower(),
            amount_inr=lambda d: d.amount_usd * 83.5)
    .query("status == 'completed'"))                           # drops order 103
print(clean[["order_id", "customer", "amount_inr"]])
#    order_id customer  amount_inr
# 0       101     Asha      8350.0
# 1       102     Ravi     20916.75
clean.to_sql("fct_orders", warehouse_engine, if_exists="append", index=False)</code></pre>

**ELT version**: load raw rows as-is into `raw.orders`, then transform with SQL (often a dbt model).

<pre data-lang="sql"><code>-- step 1 (Load): COPY INTO raw.orders FROM @stage/orders_2025-03-01.csv;  -- 4 raw rows land untouched

-- step 2 (Transform): runs inside the warehouse
CREATE OR REPLACE TABLE analytics.fct_orders AS
SELECT DISTINCT
       order_id,
       INITCAP(customer)      AS customer,
       amount_usd * 83.5      AS amount_inr,
       order_ts
FROM   raw.orders
WHERE  LOWER(status) = 'completed';
-- Result: 2 rows (101 Asha 8350.00, 102 Ravi 20916.75). Raw table still has all 4 rows.</code></pre>

<div class="tw"><table><thead><tr><th>Aspect</th><th>ETL</th><th>ELT</th></tr></thead><tbody><tr><td>Transform location</td><td>Separate engine before load</td><td>Inside warehouse after load</td></tr><tr><td>Raw data kept?</td><td>Usually not</td><td>Yes, reprocessable</td></tr><tr><td>Changing business logic</td><td>Re-extract from source</td><td>Re-run SQL on stored raw data</td></tr><tr><td>Fits</td><td>Legacy, strict PII removal before landing, on-prem</td><td>Cloud warehouses and lakes</td></tr><tr><td>Tools</td><td>SSIS, Informatica, Talend</td><td>Fivetran/Airbyte + dbt, Spark SQL</td></tr></tbody></table></div>

<div class="box info"><b>ℹ️ Compliance exception</b> If raw data contains PII that must never land unmasked in the warehouse, do a small ETL-style masking step during ingestion, then ELT the rest.</div>

### Data lake vs data warehouse vs lakehouse

<div class="diagram">
<div class="diagram-label">flowchart — three storage architectures</div>
<div class="mermaid">
flowchart TD
    subgraph LK["Data lake"]
        L1["Object storage\nS3 GCS ADLS"] --> L2["Raw files\nJSON CSV Parquet images"]
    end
    subgraph WH["Data warehouse"]
        W1["Managed columnar engine"] --> W2["Structured tables\nschema on write"]
    end
    subgraph LH["Lakehouse"]
        H1["Object storage"] --> H2["Open table format\nDelta Iceberg Hudi"] --> H3["ACID tables plus SQL"]
    end
</div>
</div>

<div class="tw"><table><thead><tr><th>Aspect</th><th>Data lake</th><th>Data warehouse</th><th>Lakehouse</th></tr></thead><tbody><tr><td>Data</td><td>Any: structured, semi, unstructured</td><td>Structured tables</td><td>Any, with table layer</td></tr><tr><td>Schema</td><td>On read</td><td>On write</td><td>Enforced and evolvable</td></tr><tr><td>Cost</td><td>Lowest storage</td><td>Higher</td><td>Lake-level storage</td></tr><tr><td>Transactions (ACID)</td><td>No</td><td>Yes</td><td>Yes</td></tr><tr><td>Typical users</td><td>Data science, engineers</td><td>Analysts, BI</td><td>Everyone</td></tr><tr><td>Examples</td><td>S3 + Glue/Athena</td><td>Snowflake, BigQuery, Redshift</td><td>Databricks Delta, Iceberg on S3</td></tr></tbody></table></div>

**Schema-on-read** means files sit untyped and you decide types when querying; **schema-on-write** rejects data that does not fit the table at load time.

Why open table formats matter: plain Parquet on S3 has no transactions, so two writers can corrupt a table and you cannot `UPDATE` a row. Delta, Iceberg and Hudi add a **transaction log** over Parquet files giving ACID commits, `MERGE`, schema evolution and **time travel**.

<pre data-lang="sql"><code>-- Delta Lake / Iceberg style (Spark SQL)
UPDATE silver.customers SET city = 'Pune' WHERE customer_id = 7;       -- impossible on plain Parquet
SELECT * FROM silver.customers VERSION AS OF 12;                       -- time travel to commit 12
-- Result: customer 7 shows the previous city in version 12, the new city in the latest version</code></pre>

### Medallion architecture with example records

The medallion pattern organises the lake in three quality tiers. Each tier is a table set you can rebuild from the one before.

<div class="diagram">
<div class="diagram-label">flowchart — medallion layers</div>
<div class="mermaid">
flowchart LR
    SRC["Source\nraw JSON events"] --> BR["Bronze\nas received plus metadata\nappend only"]
    BR -->|"dedupe cast validate"| SI["Silver\ncleaned conformed\none row per event"]
    SI -->|"join aggregate model"| GO["Gold\nbusiness metrics\nstar schema marts"]
    GO --> BI["BI and ML"]
    BR -.->|"reprocess any time"| SI
</div>
</div>

**Bronze** (raw, nothing removed, ingestion metadata added):

<div class="tw"><table><thead><tr><th>event_id</th><th>user_id</th><th>amount</th><th>ts</th><th>_ingested_at</th><th>_source_file</th></tr></thead><tbody><tr><td>e1</td><td>7</td><td>"499.00"</td><td>2025-03-01T10:00:00Z</td><td>2025-03-02 01:00</td><td>f1.json</td></tr><tr><td>e1</td><td>7</td><td>"499.00"</td><td>2025-03-01T10:00:00Z</td><td>2025-03-02 01:00</td><td>f2.json</td></tr><tr><td>e2</td><td>8</td><td>"abc"</td><td>2025-03-01T11:00:00Z</td><td>2025-03-02 01:00</td><td>f1.json</td></tr><tr><td>e3</td><td>7</td><td>"150.00"</td><td>2025-03-01T18:30:00Z</td><td>2025-03-02 01:00</td><td>f1.json</td></tr><tr><td>e4</td><td>9</td><td>"75.50"</td><td>2025-03-02T09:00:00Z</td><td>2025-03-03 01:00</td><td>f3.json</td></tr></tbody></table></div>

**Silver** (deduplicated on `event_id`, typed, invalid row quarantined):

<div class="tw"><table><thead><tr><th>event_id</th><th>user_id</th><th>amount</th><th>event_date</th></tr></thead><tbody><tr><td>e1</td><td>7</td><td>499.00</td><td>2025-03-01</td></tr><tr><td>e3</td><td>7</td><td>150.00</td><td>2025-03-01</td></tr><tr><td>e4</td><td>9</td><td>75.50</td><td>2025-03-02</td></tr></tbody></table></div>

`e2` (amount "abc" cannot be cast) goes to a quarantine table with the reason `invalid_amount`; the duplicate `e1` is dropped.

**Gold** (business aggregate, one row per day):

<div class="tw"><table><thead><tr><th>event_date</th><th>orders</th><th>revenue</th><th>unique_users</th></tr></thead><tbody><tr><td>2025-03-01</td><td>2</td><td>649.00</td><td>1</td></tr><tr><td>2025-03-02</td><td>1</td><td>75.50</td><td>1</td></tr></tbody></table></div>

<pre data-lang="sql"><code>-- bronze -&gt; silver
CREATE OR REPLACE TABLE silver.payments AS
SELECT event_id, user_id,
       TRY_CAST(amount AS DECIMAL(12,2)) AS amount,
       CAST(ts AS DATE)                  AS event_date
FROM (SELECT *, ROW_NUMBER() OVER (PARTITION BY event_id ORDER BY _ingested_at) AS rn
      FROM bronze.payments)
WHERE rn = 1 AND TRY_CAST(amount AS DECIMAL(12,2)) IS NOT NULL;

-- silver -&gt; gold
SELECT event_date, COUNT(*) AS orders, SUM(amount) AS revenue, COUNT(DISTINCT user_id) AS unique_users
FROM silver.payments GROUP BY event_date;</code></pre>

<div class="g2"><div class="card"><h4>Bronze</h4><p>Exact copy of the source plus lineage columns. Append-only, never edited. Lets you replay the pipeline after a bug.</p></div><div class="card"><h4>Silver</h4><p>Deduplicated, typed, validated, standardised. One trustworthy row per entity or event. Joins across sources happen here.</p></div><div class="card"><h4>Gold</h4><p>Aggregates, dimensional models and metrics shaped for BI and ML. Fast, documented, access-controlled.</p></div><div class="card"><h4>Why layers?</h4><p>Bad data in bronze cannot destroy silver, you can rebuild forward at any time, and each layer has a clear owner and quality bar.</p></div></div>

### Batch vs streaming processing

**Batch** processes a bounded chunk of data on a schedule (hourly, daily). **Streaming** processes an unbounded flow of events continuously as they arrive.

<div class="diagram">
<div class="diagram-label">flowchart — batch vs streaming</div>
<div class="mermaid">
flowchart LR
    subgraph B["Batch"]
        B1["Events pile up\nall day"] --> B2["Nightly job\nprocesses 24 hours"] --> B3["Report ready next morning"]
    end
    subgraph S["Streaming"]
        S1["Event arrives"] --> S2["Processed in\nmilliseconds to seconds"] --> S3["Dashboard or alert\nupdates now"]
    end
</div>
</div>

<div class="tw"><table><thead><tr><th>Aspect</th><th>Batch</th><th>Streaming</th></tr></thead><tbody><tr><td>Latency</td><td>Minutes to hours</td><td>Milliseconds to seconds</td></tr><tr><td>Complexity</td><td>Low: re-run on failure</td><td>High: ordering, late events, state, exactly-once</td></tr><tr><td>Cost model</td><td>Pay while the job runs</td><td>Always-on clusters</td></tr><tr><td>Tools</td><td>Spark, dbt, SQL, Glue</td><td>Kafka, Flink, Spark Structured Streaming, Kinesis</td></tr><tr><td>Use cases</td><td>Daily revenue, ML training, finance close</td><td>Fraud, live dashboards, alerting, IoT</td></tr></tbody></table></div>

Streaming concepts you must know: **event time** (when it happened) vs **processing time** (when you saw it), **windows** (tumbling, sliding, session), **watermarks** (how long to wait for late events), **state** and **delivery semantics** (at-most-once, at-least-once, exactly-once).

<pre data-lang="python"><code># Spark Structured Streaming: orders per 5-minute tumbling window
from pyspark.sql import functions as F

orders = (spark.readStream.format("kafka")
          .option("kafka.bootstrap.servers", "broker:9092")
          .option("subscribe", "orders").load()
          .select(F.from_json(F.col("value").cast("string"), "order_id string, amount double, ts timestamp").alias("o"))
          .select("o.*"))

agg = (orders.withWatermark("ts", "10 minutes")            # accept events up to 10 min late
       .groupBy(F.window("ts", "5 minutes"))
       .agg(F.count("*").alias("orders"), F.sum("amount").alias("revenue")))

agg.writeStream.outputMode("update").format("console").start()
# +------------------------------------------+------+-------+
# |window                                    |orders|revenue|
# +------------------------------------------+------+-------+
# |{2025-03-01 10:00:00, 2025-03-01 10:05:00}|3     |730.5  |</code></pre>

<div class="box tip"><b>✅ Decision rule</b> Ask "what decision changes if the data is 1 minute old versus 1 day old?" If the answer is none, use batch. Micro-batch (every 1-5 minutes) is often a good middle ground.</div>

### Apache Kafka basics

Kafka is a distributed, durable **commit log** used to move events between systems. Producers write events to **topics**; consumers read them at their own pace. Events are kept for a retention period, so consumers can replay.

<div class="diagram">
<div class="diagram-label">flowchart — topics, partitions, consumer groups</div>
<div class="mermaid">
flowchart LR
    P1["Producer\nweb app"] --> T
    P2["Producer\nmobile app"] --> T
    subgraph T["Topic: orders - 3 partitions"]
        PA["Partition 0\noffsets 0 1 2 3"]
        PB["Partition 1\noffsets 0 1 2"]
        PC["Partition 2\noffsets 0 1"]
    end
    PA --> C1["Consumer A\ngroup billing"]
    PB --> C2["Consumer B\ngroup billing"]
    PC --> C2
    PA --> D1["Consumer X\ngroup analytics"]
    PB --> D1
    PC --> D1
</div>
</div>

<div class="tw"><table><thead><tr><th>Concept</th><th>Meaning</th></tr></thead><tbody><tr><td>Topic</td><td>Named stream of events, like a table of an append-only log</td></tr><tr><td>Partition</td><td>Ordered, immutable slice of a topic. Unit of parallelism and ordering</td></tr><tr><td>Offset</td><td>Position of an event inside a partition</td></tr><tr><td>Key</td><td>Same key goes to the same partition, which gives per-key ordering</td></tr><tr><td>Broker</td><td>A Kafka server. A cluster has several, partitions are replicated across them</td></tr><tr><td>Replication factor</td><td>Copies of each partition (3 is typical) for fault tolerance</td></tr><tr><td>Consumer group</td><td>Consumers sharing work: each partition is read by exactly one consumer in the group</td></tr><tr><td>Committed offset</td><td>Where the group has read up to, so it can resume after a crash</td></tr></tbody></table></div>

Key rules: ordering is guaranteed **only within a partition**; a group can have at most as many active consumers as partitions; different groups each receive the full stream independently (billing and analytics above both see every order).

<pre data-lang="python"><code>from confluent_kafka import Producer, Consumer
import json

p = Producer({"bootstrap.servers": "broker:9092"})
for order in [{"order_id": 1, "customer_id": 7}, {"order_id": 2, "customer_id": 8}, {"order_id": 3, "customer_id": 7}]:
    # key = customer_id so one customer's orders stay in order inside one partition
    p.produce("orders", key=str(order["customer_id"]), value=json.dumps(order))
p.flush()

c = Consumer({"bootstrap.servers": "broker:9092", "group.id": "billing",
              "auto.offset.reset": "earliest", "enable.auto.commit": False})
c.subscribe(["orders"])
msg = c.poll(5.0)
print(msg.partition(), msg.offset(), msg.key(), msg.value())
# 2 0 b'7' b'{"order_id": 1, "customer_id": 7}'
c.commit(msg)         # commit only after processing succeeded -&gt; at-least-once</code></pre>

Delivery semantics: committing **after** processing gives at-least-once (duplicates possible after a crash, so make consumers idempotent); committing **before** gives at-most-once (may lose data); exactly-once needs transactions or idempotent sinks.

### File formats: row vs columnar

A **row-oriented** format stores each record contiguously (CSV, JSON, Avro). A **columnar** format stores each column contiguously (Parquet, ORC). Analytics queries read a few columns across many rows, so columnar wins; transactional lookups and streaming messages need whole rows, so row formats win.

<div class="diagram">
<div class="diagram-label">flowchart — row layout vs column layout</div>
<div class="mermaid">
flowchart LR
    subgraph ROW["Row layout CSV Avro"]
        R1["id1 Asha Pune 100"] --- R2["id2 Ravi Delhi 250"] --- R3["id3 Meena Pune 75"]
    end
    subgraph COL["Column layout Parquet"]
        C1["id column\n1 2 3"]
        C2["name column\nAsha Ravi Meena"]
        C3["city column\nPune Delhi Pune"]
        C4["amount column\n100 250 75"]
    end
</div>
</div>

Query: `SELECT SUM(amount) FROM orders` on 10 million rows with 20 columns. Illustrative numbers from a typical run:

<div class="tw"><table><thead><tr><th>Format</th><th>File size</th><th>Data read for the query</th><th>Time (8-core machine)</th></tr></thead><tbody><tr><td>CSV</td><td>2.4 GB</td><td>all 2.4 GB (must parse every column)</td><td>about 45 s</td></tr><tr><td>JSON lines</td><td>4.1 GB</td><td>all 4.1 GB</td><td>about 80 s</td></tr><tr><td>Parquet (Snappy)</td><td>380 MB</td><td>about 20 MB (only the amount column chunks)</td><td>about 1.5 s</td></tr></tbody></table></div>

Why: Parquet stores values of one column together, so they compress very well (repeated cities, similar numbers), keeps min/max **statistics** per row group to skip chunks, and reads only needed columns (**column pruning**) and filtered chunks (**predicate pushdown**).

<div class="tw"><table><thead><tr><th>Format</th><th>Layout</th><th>Schema</th><th>Strength</th><th>Use for</th></tr></thead><tbody><tr><td>CSV</td><td>row, text</td><td>none</td><td>human readable, universal</td><td>small exchange files</td></tr><tr><td>JSON</td><td>row, text</td><td>flexible nested</td><td>APIs, semi-structured</td><td>landing raw API data</td></tr><tr><td>Avro</td><td>row, binary</td><td>embedded, evolvable</td><td>fast full-row writes, schema registry</td><td>Kafka messages</td></tr><tr><td>Parquet</td><td>columnar, binary</td><td>embedded</td><td>analytics, compression, pruning</td><td>default lake format</td></tr><tr><td>ORC</td><td>columnar, binary</td><td>embedded</td><td>Hive ecosystem</td><td>Hadoop workloads</td></tr><tr><td>Delta / Iceberg / Hudi</td><td>Parquet plus transaction log</td><td>versioned</td><td>ACID, time travel, upserts</td><td>lakehouse tables</td></tr></tbody></table></div>

<pre data-lang="python"><code>import pandas as pd
df = pd.read_csv("orders.csv")                       # 2.4 GB on disk
df.to_parquet("orders.parquet", compression="snappy")  # about 380 MB
only = pd.read_parquet("orders.parquet", columns=["amount"])   # reads just one column
print(only.amount.sum())</code></pre>

<div class="box tip"><b>✅ Default choice</b> Parquet with Snappy for lake data (balanced speed), Zstd when storage matters more; Avro for Kafka; avoid giant single files and thousands of tiny files, aim for 128 MB to 1 GB files.</div>


### Partitioning data for fast queries

**Partitioning** splits a table into folders by the value of a column so queries can skip whole folders (**partition pruning**). It is the cheapest performance tool in a lake.

<pre data-lang="text"><code>s3://lake/silver/orders/
    order_date=2025-03-01/part-0001.parquet
    order_date=2025-03-01/part-0002.parquet
    order_date=2025-03-02/part-0001.parquet
    order_date=2025-03-03/part-0001.parquet</code></pre>

<div class="diagram">
<div class="diagram-label">flowchart — partition pruning</div>
<div class="mermaid">
flowchart TD
    Q["SELECT SUM of amount\nWHERE order_date = 2025-03-02"] --> PL["Query planner\nreads folder names"]
    PL --> P1["order_date=2025-03-01\nSKIPPED"]
    PL --> P2["order_date=2025-03-02\nREAD"]
    PL --> P3["order_date=2025-03-03\nSKIPPED"]
</div>
</div>

Example: 3 years of data (1,095 daily partitions, 2 GB each, 2.2 TB total). A one-day query reads 2 GB instead of 2.2 TB, roughly 1,000 times less I/O, and on Athena or BigQuery the bill drops by the same factor.

How to choose a partition column:

- It appears in most `WHERE` filters (usually a date).
- **Low to medium cardinality**: hundreds to a few thousand values, not millions. Partitioning by `customer_id` creates millions of tiny files, the "small files problem".
- Partitions should be large enough (hundreds of MB) to avoid overhead.
- Prefer coarser grain (day) over finer (minute) unless volumes are huge.

<pre data-lang="python"><code>(df.write.mode("overwrite")
   .partitionBy("order_date")                 # one folder per date
   .parquet("s3://lake/silver/orders/"))

spark.read.parquet("s3://lake/silver/orders/") \
     .filter("order_date = '2025-03-02'").explain()
# PartitionFilters: [isnotnull(order_date), (order_date = 2025-03-02)]   &lt;- pruning confirmed</code></pre>

Related ideas: **bucketing** (hash rows into a fixed number of files to speed joins), **clustering / Z-order** (sort data by columns inside files for data skipping), and **compaction** (merge small files, `OPTIMIZE` in Delta).

<div class="box warn"><b>⚠️ Over-partitioning</b> 10 million rows partitioned by <code>user_id</code> produces thousands of 2 KB files. Metadata listing then dominates runtime. Partition by date, cluster by user.</div>

### Apache Spark fundamentals

Spark is a distributed engine that splits data into **partitions** and processes them in parallel across a cluster, keeping intermediate data in memory. It handles batch, SQL, streaming and ML with one API.

<div class="diagram">
<div class="diagram-label">flowchart — Spark architecture</div>
<div class="mermaid">
flowchart LR
    APP["Driver program\nSparkSession\nbuilds the plan"] --> CM["Cluster manager\nYARN or Kubernetes or Standalone"]
    CM --> W1["Worker node 1\nExecutor with tasks"]
    CM --> W2["Worker node 2\nExecutor with tasks"]
    CM --> W3["Worker node N\nExecutor with tasks"]
    W1 --> ST["Storage\nS3 GCS HDFS"]
    W2 --> ST
    W3 --> ST
    APP -.->|"sends tasks and collects results"| W1
</div>
</div>

<div class="tw"><table><thead><tr><th>Term</th><th>Meaning</th></tr></thead><tbody><tr><td>Driver</td><td>The process running your <code>main</code>; builds the logical plan, schedules tasks, gathers results</td></tr><tr><td>Executor</td><td>JVM process on a worker that runs tasks and caches data</td></tr><tr><td>Cluster manager</td><td>Allocates resources: YARN, Kubernetes, standalone</td></tr><tr><td>Partition</td><td>Chunk of data processed by one task. Ideally about 128 MB</td></tr><tr><td>Task</td><td>Work on one partition in one stage</td></tr><tr><td>Stage</td><td>Group of tasks that can run without a shuffle</td></tr><tr><td>Job</td><td>Everything triggered by one action</td></tr><tr><td>DataFrame</td><td>Distributed table with schema, optimised by Catalyst. Use this, not raw RDDs</td></tr></tbody></table></div>

#### Lazy evaluation and the DAG

Spark **transformations** (`filter`, `select`, `join`, `groupBy`) only record a plan. Nothing executes until an **action** (`show`, `count`, `collect`, `write`). This lets the optimiser (Catalyst) reorder and combine steps, push filters down to the file scan, and prune columns.

<div class="diagram">
<div class="diagram-label">flowchart — lazy evaluation</div>
<div class="mermaid">
flowchart LR
    R["read parquet"] -.->|"transformation"| F["filter"]
    F -.->|"transformation"| G["groupBy and agg"]
    G -->|"action: show"| X["Catalyst optimises\nthen run job"]
    X --> OUT["Result rows"]
</div>
</div>

#### Narrow vs wide transformations and shuffles

- **Narrow**: each output partition depends on one input partition (`filter`, `select`, `withColumn`, `map`). No data movement, fast, pipelined inside a stage.
- **Wide**: output partitions depend on many input partitions (`groupBy`, `join`, `distinct`, `orderBy`, `repartition`). Data must be **shuffled** across the network: written to disk, sent, read. Shuffles are the main cost in Spark and create **stage boundaries**.

<div class="diagram">
<div class="diagram-label">flowchart — narrow vs wide, stage boundary</div>
<div class="mermaid">
flowchart LR
    subgraph S1["Stage 1 narrow only"]
        A1["Partition 1\nread filter"] 
        A2["Partition 2\nread filter"]
    end
    subgraph S2["Stage 2 after shuffle"]
        B1["Partition 1\nregion A sums"]
        B2["Partition 2\nregion B sums"]
    end
    A1 -->|"shuffle by region"| B1
    A1 --> B2
    A2 --> B1
    A2 -->|"shuffle by region"| B2
</div>
</div>

<div class="tw"><table><thead><tr><th>Operation</th><th>Type</th><th>Shuffle?</th></tr></thead><tbody><tr><td><code>select</code>, <code>filter</code>, <code>withColumn</code>, <code>map</code>, <code>union</code></td><td>narrow</td><td>no</td></tr><tr><td><code>groupBy().agg()</code>, <code>distinct</code>, <code>orderBy</code></td><td>wide</td><td>yes</td></tr><tr><td><code>join</code> (shuffle hash or sort-merge)</td><td>wide</td><td>yes, both sides</td></tr><tr><td><code>join</code> with <code>broadcast(small)</code></td><td>narrow for big side</td><td>no, small table copied to executors</td></tr><tr><td><code>repartition(n)</code></td><td>wide</td><td>yes</td></tr><tr><td><code>coalesce(n)</code> (reduce only)</td><td>narrow</td><td>no</td></tr></tbody></table></div>

#### PySpark example with output

<pre data-lang="python"><code>from pyspark.sql import SparkSession, functions as F

spark = (SparkSession.builder.appName("SalesDemo")
         .config("spark.sql.shuffle.partitions", "8").getOrCreate())

data = [
    (1, "South", "completed", 100.0, "2025-03-01"),
    (2, "South", "completed", 250.0, "2025-03-01"),
    (3, "North", "cancelled",  80.0, "2025-03-01"),
    (4, "North", "completed", 120.0, "2025-03-02"),
    (5, "South", "completed",  60.0, "2025-03-02"),
]
df = spark.createDataFrame(data, "order_id int, region string, status string, amount double, order_date string")

result = (df.filter(F.col("status") == "completed")                 # narrow
            .withColumn("amount_inr", F.col("amount") * 83.5)       # narrow
            .groupBy("region", "order_date")                        # wide: shuffle
            .agg(F.sum("amount_inr").alias("revenue"),
                 F.count("*").alias("orders"))
            .orderBy("region", "order_date"))                       # wide: shuffle

result.show()          # action: only now does Spark run anything
# +------+----------+-------+------+
# |region|order_date|revenue|orders|
# +------+----------+-------+------+
# | North|2025-03-02|10020.0|     1|
# | South|2025-03-01|29225.0|     2|
# | South|2025-03-02| 5010.0|     1|
# +------+----------+-------+------+

result.explain()
# == Physical Plan ==
# Sort [region ASC, order_date ASC]
# +- Exchange rangepartitioning(region, order_date, 8)       &lt;- shuffle for orderBy
#    +- HashAggregate(keys=[region, order_date], functions=[sum(...), count(1)])
#       +- Exchange hashpartitioning(region, order_date, 8)  &lt;- shuffle for groupBy
#          +- HashAggregate(partial_sum...)
#             +- Project [...] +- Filter (status = completed) +- Scan ExistingRDD</code></pre>

Check the arithmetic: South on 1 March = (100 + 250) x 83.5 = 29,225; North on 2 March = 120 x 83.5 = 10,020; South on 2 March = 60 x 83.5 = 5,010. The cancelled order was filtered before aggregation. `explain()` shows two `Exchange` nodes, which are the two shuffles and therefore three stages.

Join optimisation, with the classic "small dimension joins big fact" case:

<pre data-lang="python"><code>from pyspark.sql.functions import broadcast

regions = spark.read.parquet("s3://lake/dim/regions/")     # 200 rows
facts   = spark.read.parquet("s3://lake/silver/orders/")   # 2 billion rows

joined = facts.join(broadcast(regions), "region_id")       # regions copied to every executor
# no shuffle of the 2 billion row side; plan shows BroadcastHashJoin</code></pre>

Performance checklist: filter and select columns early, prefer built-in functions to Python UDFs, broadcast small tables, avoid `collect()` on big data, **cache** only data reused by several actions, watch for **data skew** (one key with most rows makes one task run for hours; fix with salting or Adaptive Query Execution), and tune `spark.sql.shuffle.partitions` (200 default is too many for small data, too few for huge).

<div class="box tip"><b>✅ Spark UI</b> Open the Stages tab: look for tasks with durations far above the median (skew), large shuffle read/write, and spill to disk. That tells you where to tune.</div>

### dbt: SQL transformations as software

dbt (data build tool) does the **T** of ELT. You write `SELECT` statements in files called **models**; dbt compiles them, resolves dependencies, creates tables or views in the warehouse in the right order, runs **tests**, and builds **documentation and lineage**. It brings software practices (Git, code review, CI, tests) to analytics SQL.

<div class="diagram">
<div class="diagram-label">flowchart — dbt project lineage</div>
<div class="mermaid">
flowchart LR
    RAW["sources\nraw.orders raw.customers"] --> S1["stg_orders\nclean rename cast"]
    RAW --> S2["stg_customers"]
    S1 --> I["int_order_items"]
    I --> F["fct_sales"]
    S2 --> D["dim_customer"]
    D --> F
    F --> BI["Dashboards"]
    T["dbt tests\nnot_null unique relationships"] -.-> S1
    T -.-> F
</div>
</div>

Project layout:

<pre data-lang="text"><code>my_dbt/
  dbt_project.yml
  models/
    staging/      stg_orders.sql  stg_customers.sql  sources.yml
    marts/        fct_sales.sql   dim_customer.sql   schema.yml
  tests/          assert_revenue_positive.sql
  macros/         cents_to_rupees.sql
  snapshots/      customers_snapshot.sql</code></pre>

A staging model and a mart model that uses `ref()`:

{% raw %}
<pre data-lang="sql"><code>-- models/staging/stg_orders.sql  (materialized as a view)
SELECT
    order_id,
    customer_id,
    CAST(amount_usd AS NUMERIC(12,2)) AS amount_usd,
    LOWER(status)                     AS status,
    CAST(order_ts AS DATE)            AS order_date
FROM {{ source('raw', 'orders') }}
WHERE order_id IS NOT NULL

-- models/marts/fct_sales.sql  (incremental table)
{{ config(materialized='incremental', unique_key='order_id') }}

SELECT
    o.order_id,
    o.order_date,
    c.customer_key,
    o.amount_usd * {{ var('usd_to_inr', 83.5) }} AS amount_inr
FROM {{ ref('stg_orders') }} o                 -- ref() builds the dependency graph
LEFT JOIN {{ ref('dim_customer') }} c USING (customer_id)
WHERE o.status = 'completed'
{% if is_incremental() %}
  AND o.order_date &gt;= (SELECT MAX(order_date) FROM {{ this }})   -- only new data on later runs
{% endif %}</code></pre>
{% endraw %}

What happens on `dbt run`: dbt reads every `ref()`, orders models as a DAG, and executes `stg_orders` and `dim_customer` before `fct_sales`. First run builds the full table; later runs execute only the `is_incremental()` branch and **merge** on `unique_key`.

<div class="tw"><table><thead><tr><th>Materialization</th><th>Result</th><th>Use for</th></tr></thead><tbody><tr><td><code>view</code></td><td>SQL view, no storage</td><td>light staging models</td></tr><tr><td><code>table</code></td><td>Rebuilt fully each run</td><td>small or heavy-logic marts</td></tr><tr><td><code>incremental</code></td><td>Only new or changed rows each run</td><td>large facts and event tables</td></tr><tr><td><code>ephemeral</code></td><td>Inlined CTE, no object created</td><td>reusable fragments</td></tr><tr><td><code>snapshot</code></td><td>SCD2 history of a source table</td><td>tracking changes over time</td></tr></tbody></table></div>

Tests are declared in YAML, plus custom SQL tests that return failing rows:

<pre data-lang="yaml"><code># models/marts/schema.yml
version: 2
models:
  - name: fct_sales
    columns:
      - name: order_id
        tests: [unique, not_null]
      - name: customer_key
        tests:
          - relationships: {to: ref('dim_customer'), field: customer_key}
      - name: amount_inr
        tests:
          - dbt_utils.accepted_range: {min_value: 0}</code></pre>

<pre data-lang="bash"><code>dbt build --select +fct_sales        # run and test fct_sales and everything upstream
# 1 of 5 OK created view model staging.stg_orders ............ [OK in 0.4s]
# 2 of 5 OK created table model marts.dim_customer ........... [OK in 1.1s]
# 3 of 5 OK created incremental model marts.fct_sales ....... [OK in 2.3s]
# 4 of 5 PASS unique_fct_sales_order_id ...................... [PASS in 0.3s]
# 5 of 5 FAIL 2 relationships_fct_sales_customer_key ......... [FAIL 2 in 0.4s]   &lt;- 2 orphan keys found
dbt docs generate &amp;&amp; dbt docs serve   # browsable lineage graph</code></pre>

### Dimensional modelling: star schema

Dimensional modelling (Kimball) shapes gold data for fast, understandable analytics. A **fact table** records measurable events (sales, clicks) at a declared **grain** (one row per order line). **Dimension tables** describe the context (who, what, where, when). Fact rows reference dimensions by **surrogate keys**. Drawn out, it looks like a star.

<div class="diagram">
<div class="diagram-label">flowchart — star schema</div>
<div class="mermaid">
flowchart TD
    F["fact_sales\norder_line_id\ndate_key customer_key product_key\nquantity amount_inr"]
    D1["dim_date\ndate_key date month quarter year"] --> F
    D2["dim_customer\ncustomer_key name city segment"] --> F
    D3["dim_product\nproduct_key name category brand"] --> F
</div>
</div>

Example tables:

`dim_customer`

<div class="tw"><table><thead><tr><th>customer_key</th><th>customer_id</th><th>name</th><th>city</th><th>segment</th></tr></thead><tbody><tr><td>1</td><td>C100</td><td>Asha</td><td>Pune</td><td>Retail</td></tr><tr><td>2</td><td>C200</td><td>Ravi</td><td>Delhi</td><td>Corporate</td></tr></tbody></table></div>

`dim_product`

<div class="tw"><table><thead><tr><th>product_key</th><th>sku</th><th>name</th><th>category</th></tr></thead><tbody><tr><td>10</td><td>P-1</td><td>Laptop</td><td>Electronics</td></tr><tr><td>11</td><td>P-2</td><td>Desk</td><td>Furniture</td></tr></tbody></table></div>

`dim_date`

<div class="tw"><table><thead><tr><th>date_key</th><th>date</th><th>month</th><th>year</th></tr></thead><tbody><tr><td>20250301</td><td>2025-03-01</td><td>March</td><td>2025</td></tr><tr><td>20250302</td><td>2025-03-02</td><td>March</td><td>2025</td></tr></tbody></table></div>

`fact_sales` (grain: one row per order line)

<div class="tw"><table><thead><tr><th>order_line_id</th><th>date_key</th><th>customer_key</th><th>product_key</th><th>quantity</th><th>amount_inr</th></tr></thead><tbody><tr><td>1</td><td>20250301</td><td>1</td><td>10</td><td>1</td><td>65000</td></tr><tr><td>2</td><td>20250301</td><td>2</td><td>11</td><td>2</td><td>18000</td></tr><tr><td>3</td><td>20250302</td><td>1</td><td>11</td><td>1</td><td>9000</td></tr></tbody></table></div>

<pre data-lang="sql"><code>SELECT d.month, c.city, p.category, SUM(f.amount_inr) AS revenue
FROM fact_sales f
JOIN dim_date d     ON f.date_key = d.date_key
JOIN dim_customer c ON f.customer_key = c.customer_key
JOIN dim_product p  ON f.product_key = p.product_key
GROUP BY d.month, c.city, p.category;
-- March | Pune  | Electronics | 65000
-- March | Delhi | Furniture   | 18000
-- March | Pune  | Furniture   |  9000</code></pre>

<div class="tw"><table><thead><tr><th>Concept</th><th>Meaning</th></tr></thead><tbody><tr><td>Grain</td><td>What one fact row means. Decide this first</td></tr><tr><td>Additive measure</td><td>Can be summed across all dimensions (amount, quantity)</td></tr><tr><td>Semi-additive</td><td>Summable across some dimensions only (account balance, not over time)</td></tr><tr><td>Surrogate key</td><td>Warehouse-generated integer key, independent of source ids</td></tr><tr><td>Snowflake schema</td><td>Dimensions normalised into sub-dimensions. Less redundancy, more joins</td></tr><tr><td>Conformed dimension</td><td>A dimension shared by several fact tables (same <code>dim_customer</code> everywhere)</td></tr></tbody></table></div>

### Slowly changing dimensions (SCD)

Dimension attributes change over time (a customer moves city). **SCD types** define what history you keep.

<div class="tw"><table><thead><tr><th>Type</th><th>Behaviour</th><th>History kept?</th><th>Use when</th></tr></thead><tbody><tr><td>0</td><td>Never changes</td><td>n/a</td><td>birth date, original signup channel</td></tr><tr><td>1</td><td>Overwrite the value</td><td>No</td><td>corrections, history not needed</td></tr><tr><td>2</td><td>Add a new row with validity dates</td><td>Full</td><td>you need "as it was then" reporting</td></tr><tr><td>3</td><td>Add a "previous value" column</td><td>One step</td><td>only the last change matters</td></tr></tbody></table></div>

SCD Type 2 example: Asha moves from Pune to Mumbai on 2025-04-01.

<div class="tw"><table><thead><tr><th>customer_key</th><th>customer_id</th><th>city</th><th>valid_from</th><th>valid_to</th><th>is_current</th></tr></thead><tbody><tr><td>1</td><td>C100</td><td>Pune</td><td>2024-01-10</td><td>2025-03-31</td><td>false</td></tr><tr><td>3</td><td>C100</td><td>Mumbai</td><td>2025-04-01</td><td>9999-12-31</td><td>true</td></tr></tbody></table></div>

March sales stay attached to key 1 (Pune), April sales get key 3 (Mumbai), so reports by city are historically correct.

<div class="diagram">
<div class="diagram-label">flowchart — SCD type 2 load</div>
<div class="mermaid">
flowchart TD
    N["Incoming customer row"] --> M{"Matches a current row\nby customer_id?"}
    M -->|"no"| I["Insert new row\nis_current true"]
    M -->|"yes"| CH{"Tracked attribute\nchanged?"}
    CH -->|"no"| X["Do nothing"]
    CH -->|"yes"| E["Close old row\nvalid_to and is_current false"]
    E --> I2["Insert new version row"]
</div>
</div>

<pre data-lang="sql"><code>-- Step 1: close changed rows
UPDATE dim_customer d
SET    valid_to = CURRENT_DATE - 1, is_current = FALSE
FROM   stg_customers s
WHERE  d.customer_id = s.customer_id AND d.is_current AND d.city &lt;&gt; s.city;

-- Step 2: insert new versions (changed or brand new customers)
INSERT INTO dim_customer (customer_id, name, city, valid_from, valid_to, is_current)
SELECT s.customer_id, s.name, s.city, CURRENT_DATE, DATE '9999-12-31', TRUE
FROM   stg_customers s
LEFT JOIN dim_customer d ON d.customer_id = s.customer_id AND d.is_current
WHERE  d.customer_id IS NULL;      -- no current row left: new or just closed</code></pre>

dbt automates this with `snapshots` (strategy `timestamp` or `check`).

### Change data capture (CDC)

**CDC** streams every insert, update and delete from a source database by reading its **transaction log** (Postgres WAL, MySQL binlog), instead of repeatedly querying tables. Tools: Debezium (with Kafka), AWS DMS, Fivetran, Datastream.

<div class="diagram">
<div class="diagram-label">sequenceDiagram — CDC pipeline</div>
<div class="mermaid">
sequenceDiagram
    participant APP as Application
    participant DB as Source database
    participant DBZ as Debezium connector
    participant K as Kafka topic
    participant L as Lakehouse table
    APP->>DB: UPDATE customers SET city = Mumbai WHERE id = 100
    DB->>DB: write change to transaction log
    DBZ->>DB: read log position
    DBZ->>K: publish event with before and after and op u
    K->>L: consumer applies MERGE by primary key
    Note over L: table now matches source within seconds
</div>
</div>

A Debezium change event:

<pre data-lang="json"><code>{
  "op": "u",
  "before": {"id": 100, "city": "Pune"},
  "after":  {"id": 100, "city": "Mumbai"},
  "source": {"table": "customers", "lsn": 2341987, "ts_ms": 1743500000000}
}</code></pre>

Applying to the target:

<pre data-lang="sql"><code>MERGE INTO silver.customers t
USING (SELECT * FROM cdc_batch QUALIFY ROW_NUMBER() OVER (PARTITION BY id ORDER BY lsn DESC) = 1) s
ON t.id = s.id
WHEN MATCHED AND s.op = 'd' THEN DELETE
WHEN MATCHED THEN UPDATE SET t.city = s.city
WHEN NOT MATCHED AND s.op &lt;&gt; 'd' THEN INSERT (id, city) VALUES (s.id, s.city);
-- takes only the latest change per key, so replays are safe</code></pre>

<div class="tw"><table><thead><tr><th>Approach</th><th>Captures deletes?</th><th>Source load</th><th>Latency</th></tr></thead><tbody><tr><td>Full snapshot</td><td>yes</td><td>heavy</td><td>hours</td></tr><tr><td>Timestamp incremental</td><td>no</td><td>light</td><td>batch</td></tr><tr><td>Log-based CDC</td><td>yes</td><td>very light</td><td>seconds</td></tr></tbody></table></div>

### Data quality

Pipelines that run on time but deliver wrong numbers are worse than pipelines that fail loudly. Build checks in, not on top.

<div class="tw"><table><thead><tr><th>Dimension</th><th>Question</th><th>Example check</th></tr></thead><tbody><tr><td>Completeness</td><td>Is anything missing?</td><td><code>customer_id</code> not null; today's partition exists</td></tr><tr><td>Uniqueness</td><td>Any duplicates?</td><td><code>order_id</code> unique</td></tr><tr><td>Validity</td><td>Correct format or range?</td><td><code>amount &gt;= 0</code>, status in allowed set</td></tr><tr><td>Consistency</td><td>Do tables agree?</td><td>every <code>fact.customer_key</code> exists in <code>dim_customer</code></td></tr><tr><td>Timeliness</td><td>Is it fresh?</td><td>latest <code>ingested_at</code> less than 2 hours old</td></tr><tr><td>Accuracy / reconciliation</td><td>Does it match the source?</td><td>row count and sum equal to source totals</td></tr><tr><td>Volume / anomaly</td><td>Is the change plausible?</td><td>today's rows within +-30% of 7-day average</td></tr></tbody></table></div>

<pre data-lang="python"><code>def check_orders(df):
    problems = []
    if df["order_id"].isna().any():
        problems.append("null order_id")
    if df["order_id"].duplicated().any():
        problems.append("duplicate order_id")
    if (df["amount"] &lt; 0).any():
        problems.append("negative amount")
    if len(df) &lt; 0.7 * EXPECTED_ROWS:
        problems.append(f"row count {len(df)} far below expected {EXPECTED_ROWS}")
    if problems:
        raise ValueError("; ".join(problems))      # fail the task so downstream does not run

# check_orders(today_df)
# ValueError: duplicate order_id; row count 600 far below expected 1000</code></pre>

Where to enforce: at ingestion (schema and nulls, quarantine bad rows), between layers (bronze to silver contracts), and before publishing (gold reconciliation). Tools: dbt tests, Great Expectations, Soda, Monte Carlo. Decide per check whether failure **blocks** the pipeline or only **alerts**.

<div class="diagram">
<div class="diagram-label">flowchart — quality gate</div>
<div class="mermaid">
flowchart LR
    I["Load batch"] --> Q{"Quality checks"}
    Q -->|"pass"| P["Publish to silver or gold"]
    Q -->|"fail minor"| W["Publish and alert"]
    Q -->|"fail critical"| B["Block pipeline\nquarantine rows\npage owner"]
</div>
</div>

### Orchestration in a data platform

An orchestrator such as Airflow, Dagster or Prefect runs the steps above in order, on a schedule, with retries and alerts. A typical daily DAG:

<div class="diagram">
<div class="diagram-label">flowchart — daily pipeline orchestrated</div>
<div class="mermaid">
flowchart LR
    W["Wait for source file"] --> I["Ingest to bronze"]
    I --> S["Spark bronze to silver"]
    S --> Q["Quality checks"]
    Q --> D["dbt build gold models"]
    D --> R["Refresh dashboards"]
    D --> N["Notify team"]
</div>
</div>

The orchestrator should only **trigger and monitor**; heavy computation runs in Spark, the warehouse or Kubernetes. Key features to use: dependencies, retries, backfills by date, sensors for upstream data, alerting, and data-aware scheduling (run when an upstream dataset updates).

### Observability and monitoring

Observability answers "is the data healthy, and if not, where and why?" Monitor the pipeline **and** the data.

<div class="tw"><table><thead><tr><th>Pillar</th><th>What to track</th><th>Example alert</th></tr></thead><tbody><tr><td>Freshness</td><td>Age of latest data per table</td><td><code>fct_sales</code> newer than 3 h, else page</td></tr><tr><td>Volume</td><td>Rows loaded vs historic range</td><td>rows today under 50% of 7-day average</td></tr><tr><td>Schema</td><td>Added, removed or retyped columns</td><td>source dropped <code>customer_id</code></td></tr><tr><td>Distribution</td><td>Nulls, min/max, value shares</td><td>null rate of <code>amount</code> jumped from 0.1% to 12%</td></tr><tr><td>Lineage</td><td>Which jobs and tables feed which</td><td>impacted dashboards when <code>stg_orders</code> breaks</td></tr><tr><td>Pipeline health</td><td>Run duration, failures, retries, cost</td><td>task 3x slower than usual</td></tr></tbody></table></div>

Practices: structured logs with `run_id` and row counts, metrics per stage (rows in, rows out, rows rejected), SLAs and on-call runbooks, and a data catalog with owners (DataHub, OpenMetadata, Atlan). Lineage lets you answer "what breaks if I change this column?" before you change it.

### Idempotency and reliable pipelines

An **idempotent** pipeline gives the same result when re-run for the same input. This is what makes retries, backfills and failure recovery safe.

<div class="tw"><table><thead><tr><th>Technique</th><th>Example</th></tr></thead><tbody><tr><td>Overwrite partitions</td><td><code>INSERT OVERWRITE ... PARTITION (dt='2025-03-01')</code> or Spark dynamic partition overwrite</td></tr><tr><td>Delete then insert in a transaction</td><td>per date or batch id</td></tr><tr><td>Upsert / MERGE on a business key</td><td>CDC apply, SCD loads</td></tr><tr><td>Deterministic keys</td><td><code>hash(order_id)</code> instead of random UUID or auto-increment on retry</td></tr><tr><td>Immutable raw layer</td><td>reprocess silver from bronze after a bug</td></tr><tr><td>Atomic publish</td><td>write to temp path then rename or swap table</td></tr><tr><td>Exactly-once via idempotent sink</td><td>at-least-once delivery plus de-duplication</td></tr></tbody></table></div>

<pre data-lang="python"><code># Not idempotent: running twice doubles the rows
df.write.mode("append").parquet(f"s3://lake/silver/orders/")

# Idempotent: re-running for the same date replaces only that date
spark.conf.set("spark.sql.sources.partitionOverwriteMode", "dynamic")
(df.write.mode("overwrite").partitionBy("order_date")
   .parquet("s3://lake/silver/orders/"))
# run 1 or run 5 times: partition order_date=2025-03-01 holds the same rows</code></pre>

Other reliability habits: use data contracts with upstream teams, make pipelines **restartable from any stage**, handle schema drift deliberately, keep secrets out of code, and write runbooks for the common failures.

### Tools ecosystem

<div class="diagram">
<div class="diagram-label">flowchart — modern data stack map</div>
<div class="mermaid">
flowchart LR
    ING["Ingest\nFivetran Airbyte Debezium Kafka Connect"] --> STO["Store\nS3 GCS ADLS"]
    STO --> PRO["Process\nSpark Flink dbt Glue"]
    PRO --> WH["Warehouse\nSnowflake BigQuery Redshift"]
    WH --> SRV["Serve\nSuperset Tableau QuickSight APIs"]
    ORC["Orchestrate\nAirflow Dagster Prefect"] -.-> ING
    ORC -.-> PRO
    GOV["Govern and observe\nDataHub Great Expectations Monte Carlo"] -.-> WH
</div>
</div>

<div class="tw"><table><thead><tr><th>Category</th><th>Tools</th></tr></thead><tbody><tr><td>Ingestion</td><td>Fivetran, Airbyte, AWS Glue, Debezium (CDC), Kafka Connect, AWS DMS</td></tr><tr><td>Orchestration</td><td>Apache Airflow, Dagster, Prefect, AWS Step Functions</td></tr><tr><td>Processing</td><td>Apache Spark, dbt, AWS Glue, Pandas, Polars, Flink (streaming)</td></tr><tr><td>Storage</td><td>S3, GCS, Azure ADLS (lake); Redshift, Snowflake, BigQuery (warehouse)</td></tr><tr><td>Table formats</td><td>Delta Lake, Apache Iceberg, Apache Hudi</td></tr><tr><td>Streaming</td><td>Apache Kafka, Kinesis, Flink, Spark Structured Streaming</td></tr><tr><td>Catalog / governance</td><td>AWS Glue Data Catalog, DataHub, Amundsen, Apache Atlas</td></tr><tr><td>Quality</td><td>Great Expectations, dbt tests, Soda Core, Monte Carlo</td></tr><tr><td>Visualization</td><td>Superset, Metabase, Tableau, QuickSight, Redash</td></tr><tr><td>Infra</td><td>Terraform, Docker, Kubernetes, GitHub Actions</td></tr></tbody></table></div>

<div class="box info"><b>ℹ️ Choosing</b> Start small: object storage, Parquet or Delta, one warehouse, dbt, Airflow. Add Kafka or Spark only when volume or latency requires it. Every added tool is something you must operate and debug.</div>

### Interview quick answers

<div class="box note"><b>📝 Q1. ETL vs ELT?</b> ETL transforms before loading, in a separate engine; ELT loads raw data first and transforms inside the warehouse. ELT keeps raw data reprocessable and uses elastic warehouse compute, so it dominates on cloud.</div>

<div class="box note"><b>📝 Q2. Lake vs warehouse vs lakehouse?</b> Lake: cheap object storage of raw files, schema on read. Warehouse: structured tables, schema on write, fast SQL. Lakehouse: lake storage with an open table format (Delta, Iceberg, Hudi) adding ACID, schema and time travel.</div>

<div class="box note"><b>📝 Q3. What is the medallion architecture?</b> Bronze (raw, immutable), silver (cleaned, deduplicated, typed), gold (business-ready aggregates and models). It isolates bad data, supports reprocessing and gives each layer a quality bar.</div>

<div class="box note"><b>📝 Q4. Why Parquet over CSV?</b> Columnar, compressed, typed, with statistics. Queries read only needed columns and skip chunks, giving large size and speed gains (for example 2.4 GB CSV to about 380 MB Parquet and 20 to 30 times faster aggregations).</div>

<div class="box note"><b>📝 Q5. Explain lazy evaluation in Spark.</b> Transformations build a logical plan only; an action triggers execution. This lets Catalyst optimise the whole plan (predicate pushdown, column pruning, join choice) before running.</div>

<div class="box note"><b>📝 Q6. Narrow vs wide transformations?</b> Narrow needs one input partition per output partition (filter, select), no data movement. Wide needs data from many partitions (groupBy, join), causing a shuffle and a new stage. Minimise and tune shuffles.</div>

<div class="box note"><b>📝 Q7. How do you handle data skew?</b> Detect via Spark UI task times; mitigate with broadcast joins, salting hot keys, Adaptive Query Execution skew handling, or filtering the hot key and processing it separately.</div>

<div class="box note"><b>📝 Q8. Kafka partitions and consumer groups?</b> A topic is split into ordered partitions for parallelism. Within a consumer group each partition is read by one consumer, so adding consumers (up to the partition count) scales throughput. Different groups read independently. Ordering is only per partition, so key by the entity needing order.</div>

<div class="box note"><b>📝 Q9. What is SCD Type 2?</b> Keep history by inserting a new dimension row on change with <code>valid_from</code>, <code>valid_to</code> and <code>is_current</code>, so facts join to the attribute value that was true at the time.</div>

<div class="box note"><b>📝 Q10. Star vs snowflake schema?</b> Star: a central fact table with denormalised dimensions, fewer joins, faster and simpler. Snowflake: normalised dimensions, less redundancy but more joins.</div>

<div class="box note"><b>📝 Q11. How do you capture deletes from a source?</b> Log-based CDC (Debezium, DMS), or periodic full comparison, or soft-delete flags. Timestamp-based incremental loads cannot see hard deletes.</div>

<div class="box note"><b>📝 Q12. How do you make a pipeline idempotent?</b> Overwrite partitions or delete-then-insert per batch, MERGE on business keys, deterministic keys, immutable raw layer, atomic publish. Then retries and backfills never duplicate data.</div>

<div class="box note"><b>📝 Q13. Batch or streaming for a new project?</b> Default to batch (or micro-batch) for simplicity and cost; choose streaming only when the business decision needs data within seconds, and then plan for state, late data and exactly-once handling.</div>

<div class="box note"><b>📝 Q14. How do you ensure data quality?</b> Schema and constraint checks at ingestion, tests between layers (dbt tests, Great Expectations), reconciliation with source totals, freshness and volume monitors, quarantine tables for bad rows, and clear ownership and alerts.</div>

<div class="box note"><b>📝 Q15. How would you design a daily sales pipeline?</b> Incremental or CDC ingestion to bronze Parquet partitioned by date, Spark or SQL to silver (dedupe, type), dbt to gold star schema, quality tests at each hop, Airflow orchestrating with retries and alerts, partition-overwrite for idempotent re-runs.</div>
