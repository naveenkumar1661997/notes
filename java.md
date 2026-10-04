---
layout: default
title: Java
---

<div class="hero">
  <h1>☕ Java</h1>
  <p class="sub">JVM internals, OOP, Collections, Multithreading, Stream API — revision notes</p>
  <div class="tags">
    <span class="tag">OOP</span><span class="tag">JVM</span><span class="tag">Collections</span>
    <span class="tag">Threads</span><span class="tag">Streams</span><span class="tag">Spring</span>
  </div>
</div>

<div class="toc">
  <div class="toc-h">Contents</div>
  <ol>
    <li><a href="#jvm">JVM Architecture</a></li>
    <li><a href="#oop">OOP Principles</a></li>
    <li><a href="#collections">Collections Framework</a></li>
    <li><a href="#exceptions">Exception Handling</a></li>
    <li><a href="#threads">Multithreading</a></li>
    <li><a href="#streams">Stream API</a></li>
    <li><a href="#misc">Key Concepts Cheatsheet</a></li>
  </ol>
</div>

---

## JVM Architecture {#jvm}

<div class="diagram">
<div class="diagram-label">flowchart — JVM internals</div>
<div class="mermaid">
flowchart TD
    SRC["📄 Java Source (.java)"]
    SRC -->|javac| BC["📦 Bytecode (.class)"]
    BC --> CL

    subgraph JVM["☕ JVM"]
        CL["🔁 Class Loader\nLoad → Link → Initialize"]
        CL --> MEM

        subgraph MEM["💾 Runtime Data Areas"]
            HEAP["Heap\n(Objects & Arrays)"]
            STACK["JVM Stack\n(Method frames, local vars)"]
            MTH["Method Area\n(Class meta, static vars)"]
            PC["PC Register\n(Current instruction)"]
            NM["Native Method Stack"]
        end

        MEM --> EE

        subgraph EE["⚙️ Execution Engine"]
            INT["Interpreter\n(line-by-line)"]
            JIT["JIT Compiler\n(hot-path optimisation)"]
            GC["Garbage Collector"]
        end
    end

    EE --> OS["🖥️ OS / Native Libraries"]
</div>
</div>

<div class="g2">
  <div class="card">
    <h4>Heap Areas (GC)</h4>
    <p><strong>Young Gen:</strong> Eden + S0 + S1 → Minor GC<br/>
    <strong>Old Gen:</strong> Long-lived objects → Major GC<br/>
    <strong>Metaspace:</strong> Class metadata (Java 8+)</p>
  </div>
  <div class="card">
    <h4>Class Loading Steps</h4>
    <p><strong>Load:</strong> Find .class file<br/>
    <strong>Link:</strong> Verify → Prepare → Resolve<br/>
    <strong>Initialize:</strong> Run static blocks</p>
  </div>
</div>

---

## OOP Principles {#oop}

<div class="diagram">
<div class="mermaid">
flowchart LR
    OOP["🎯 OOP Pillars"]
    OOP --> ENC["Encapsulation\nBundle data + methods\nHide via private/getters"]
    OOP --> ABS["Abstraction\nHide complexity\nAbstract class / Interface"]
    OOP --> INH["Inheritance\nextends / implements\nCode reuse"]
    OOP --> POL["Polymorphism\nOverloading (compile-time)\nOverriding (runtime)"]
</div>
</div>

<div class="tw">
<table>
  <thead><tr><th>Concept</th><th>Keyword</th><th>Key Rule</th></tr></thead>
  <tbody>
    <tr><td><strong>Encapsulation</strong></td><td><code>private</code> + getters/setters</td><td>Fields private, access via public methods</td></tr>
    <tr><td><strong>Inheritance</strong></td><td><code>extends</code> / <code>implements</code></td><td>Java: single class inheritance, multiple interface</td></tr>
    <tr><td><strong>Abstraction</strong></td><td><code>abstract class</code> / <code>interface</code></td><td>Interface = full abstraction; abstract = partial</td></tr>
    <tr><td><strong>Polymorphism</strong></td><td>Overload / Override</td><td>Overload = same name diff params; Override = same signature in subclass</td></tr>
    <tr><td><strong>Interface vs Abstract</strong></td><td>—</td><td>Interface: all abstract (pre-Java 8), no state. Abstract: can have state + body</td></tr>
  </tbody>
</table>
</div>

---

## Collections Framework {#collections}

<div class="diagram">
<div class="mermaid">
flowchart TD
    CI["Iterable"]
    CI --> CO["Collection"]
    CO --> LIST["List"]
    CO --> SET["Set"]
    CO --> QUEUE["Queue"]

    LIST --> AL["ArrayList\n✅ Fast get O(1)\n❌ Slow insert O(n)"]
    LIST --> LL["LinkedList\n✅ Fast insert O(1)\n❌ Slow get O(n)"]

    SET --> HS["HashSet\n✅ O(1) ops\n❌ No order"]
    SET --> TS["TreeSet\n✅ Sorted\nO(log n)"]
    SET --> LHS["LinkedHashSet\n✅ Insertion order"]

    QUEUE --> PQ["PriorityQueue\n✅ Min-heap by default"]
    QUEUE --> DQ["Deque / ArrayDeque\n✅ Stack + Queue"]

    MAP["Map (separate)"]
    MAP --> HM["HashMap\nO(1), no order"]
    MAP --> TM["TreeMap\nSorted by key"]
    MAP --> LHM["LinkedHashMap\nInsertion order"]
    MAP --> CHM["ConcurrentHashMap\n✅ Thread-safe"]
</div>
</div>

<div class="box info"><b>💡 Choosing the Right Collection</b>
Frequent random access → <code>ArrayList</code>. Frequent inserts/deletes → <code>LinkedList</code>. Unique elements, fast lookup → <code>HashSet</code>. Sorted unique → <code>TreeSet</code>. Key-value, fast → <code>HashMap</code>. Thread-safe map → <code>ConcurrentHashMap</code>.
</div>

---

## Exception Handling {#exceptions}

<div class="diagram">
<div class="mermaid">
flowchart TD
    TH["Throwable"]
    TH --> EX["Exception\n(checked + unchecked)"]
    TH --> ER["Error\n(JVM level — don't catch)"]

    EX --> CE["Checked Exception\nMust handle at compile time\nIOException, SQLException"]
    EX --> UE["Unchecked (RuntimeException)\nNullPointerException\nArrayIndexOutOfBoundsException\nIllegalArgumentException"]

    ER --> OOM["OutOfMemoryError"]
    ER --> SOE["StackOverflowError"]
</div>
</div>

<pre data-lang="java"><code>try {
    riskyMethod();
} catch (IOException e) {          // specific first
    log.error("IO failed", e);
} catch (Exception e) {            // broad last
    throw new RuntimeException(e); // wrap and rethrow
} finally {
    resource.close();              // always runs
}

// Try-with-resources (auto-closes Closeable)
try (Connection con = ds.getConnection()) {
    // con.close() called automatically
}

// Custom exception
public class PaymentException extends RuntimeException {
    public PaymentException(String msg) { super(msg); }
}</code></pre>

---

## Multithreading {#threads}

<div class="diagram">
<div class="mermaid">
flowchart LR
    NEW["NEW\nThread created"] -->|start()| RUNNABLE["RUNNABLE\nReady to run"]
    RUNNABLE -->|scheduler picks| RUNNING["RUNNING\nExecuting"]
    RUNNING -->|sleep/wait/IO| BLOCKED["BLOCKED/WAITING"]
    BLOCKED -->|notify/timeout| RUNNABLE
    RUNNING -->|run() ends| TERMINATED["TERMINATED"]
</div>
</div>

<div class="tw">
<table>
  <thead><tr><th>Concept</th><th>Description</th><th>Key API</th></tr></thead>
  <tbody>
    <tr><td><strong>Thread creation</strong></td><td>Extend Thread OR implement Runnable / Callable</td><td><code>new Thread(runnable).start()</code></td></tr>
    <tr><td><strong>ExecutorService</strong></td><td>Thread pool — don't create raw threads in production</td><td><code>Executors.newFixedThreadPool(n)</code></td></tr>
    <tr><td><strong>synchronized</strong></td><td>Locks object monitor; only one thread at a time</td><td><code>synchronized(this) { }</code></td></tr>
    <tr><td><strong>volatile</strong></td><td>Visibility — reads/writes go to main memory, not CPU cache</td><td><code>volatile boolean running</code></td></tr>
    <tr><td><strong>Future / CompletableFuture</strong></td><td>Async result; chain operations without blocking</td><td><code>CompletableFuture.supplyAsync()</code></td></tr>
    <tr><td><strong>AtomicInteger</strong></td><td>Lock-free thread-safe counter</td><td><code>counter.incrementAndGet()</code></td></tr>
  </tbody>
</table>
</div>

<pre data-lang="java"><code>// ExecutorService pattern
ExecutorService pool = Executors.newFixedThreadPool(4);
Future<String> future = pool.submit(() -> fetchData());
String result = future.get(); // blocks until done
pool.shutdown();

// CompletableFuture chaining
CompletableFuture.supplyAsync(() -> fetchUser(id))
    .thenApply(user -> enrichWithOrders(user))
    .thenAccept(data -> sendEmail(data))
    .exceptionally(ex -> { log.error(ex); return null; });</code></pre>

---

## Stream API {#streams}

<div class="diagram">
<div class="mermaid">
flowchart LR
    SRC["📦 Source\nList, Array, Set"] --> INT["Intermediate Ops\nfilter · map · flatMap\nsorted · distinct · limit"]
    INT --> TERM["Terminal Op\ncollect · count · reduce\nforEach · findFirst · anyMatch"]
    TERM --> RES["✅ Result"]
</div>
</div>

<pre data-lang="java"><code>List<String> names = employees.stream()
    .filter(e -> e.getSalary() > 50000)           // filter
    .sorted(Comparator.comparing(Employee::getName))
    .map(Employee::getName)                        // transform
    .collect(Collectors.toList());

// Grouping
Map<String, List<Employee>> byDept = employees.stream()
    .collect(Collectors.groupingBy(Employee::getDept));

// Reduce
int total = numbers.stream()
    .reduce(0, Integer::sum);

// Parallel stream (careful with shared state)
long count = list.parallelStream()
    .filter(x -> x > 100).count();</code></pre>

---

## Key Concepts Cheatsheet {#misc}

<div class="tw">
<table>
  <thead><tr><th>Topic</th><th>Quick Answer</th></tr></thead>
  <tbody>
    <tr><td><code>==</code> vs <code>.equals()</code></td><td><code>==</code> compares references; <code>.equals()</code> compares values (override for custom classes)</td></tr>
    <tr><td><code>String</code> immutability</td><td>String is immutable — every change creates a new object. Use <code>StringBuilder</code> for concatenation in loops</td></tr>
    <tr><td><code>final</code></td><td>Variable: can't reassign. Method: can't override. Class: can't extend</td></tr>
    <tr><td><code>static</code></td><td>Belongs to class, not instance. Static methods can't access instance vars</td></tr>
    <tr><td>Garbage Collection</td><td>Mark-and-sweep. G1GC is default in Java 9+. Objects collected when no references</td></tr>
    <tr><td>Generics</td><td>Type-safe containers: <code>List&lt;T&gt;</code>. Erasure at runtime — generic type info removed</td></tr>
    <tr><td>Functional Interface</td><td>Interface with exactly 1 abstract method. Enables lambda expressions. <code>@FunctionalInterface</code></td></tr>
    <tr><td>Optional</td><td>Container for a value that may be null. Use instead of returning null: <code>Optional.ofNullable()</code></td></tr>
  </tbody>
</table>
</div>
