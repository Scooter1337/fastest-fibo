# Fibo Matrix
Rust Command Line tool that calculates the n'th fibonacci number.

Created by [Luca](https://github.com/scooter1337)

# Bench
Method chosen is fastest for that N, that calculates the correct answer. (Approximations / Non-bigint-implementations do not always return the correct result, due to the nature of approximation and due to overflowing integers)
| N | time | method |
|---|---|---|
| 100 | 40ns | 4 |
| 1000 | 3.66us | 0 |
| 10K | 15.25us | 0 |
| 100K | 318us| 0 |
| 1M | 3.06ms| 8 |
| 10M | 33.73ms| 8 |
| 100M | 547ms | 8 |
| 1B | 5.78s | 8 |

Note: Experimental method 15 (Rayon matrix multiplication 5) often outperforms method 8 by ~1.8-2x for medium to large N due to reduced temporary allocations and in-place reuse; benchmarks table will be updated after broader validation.

# Usage
Build using `cargo build --release --features cli` or run `cargo run --release --features cli -- $` where $ is to be replaced with command-line arguments.

> Note
> 
> The first compile could take multiple minutes as 'gmp-mpfr-sys' is building. It is not frozen!

### Example
```bash
cargo build --release --features cli
target/release/fastest-fibo -m 8 --length 100000000 --quiet
```

or

```bash
cargo run --release --features cli -- -m 8 --length 100000000 --quiet --warmup 10
```

or

```md
Usage: fibomatrix [OPTIONS] --length <LENGTH>

Options:
  -l, --length <LENGTH>
          Length of the Fibonacci sequence to generate
          
          This is the number of Fibonacci numbers to generate
          
          The minimum is 1

  -m, --method <METHOD>
          Method to use 
          
          
          Options: 
           
           Single-threaded: 
           > 0: Single-threaded matrix multiplication 
           > 1: Iterative 
           > 2: Recursive 
           > 3: Recursive with memoization 
           > 4: Single-threaded matrix multiplication without BigInt 
           
           Rayon (each variant is more optimized than the last): 
           > 5: Rayon matrix multiplication 1 
           > 6: Rayon matrix multiplication 2 
           > 7: Rayon matrix multiplication 3 
           > 8: Rayon matrix multiplication 4 
           > 15: Rayon matrix multiplication 5 (in-place optimized) 
           
           Threads: 
           > 9: Threads matrix multiplication 1 (WIP) 
           
           Approximation (BigFloat): 
           > 10: Approximation 1 
          
          
          [default: 1]

  -q, --quiet
          Don't print the result 
           (large numbers can take a long time to print, so this can save a lot of time)
          
          [default: false]

  -n, --no-time
          Don't print the time elapsed
          
          [default: false]

  -p, --precision <PRECISION>
          Precision for approximation
          
          [default: 100]

  -w, --warmup <WARMUP>
          Warmup iterations (number of times to run the calculation before timing it)
          
          [default: 0]

  -h, --help
          Print help (see a summary with '-h')

  -V, --version

```


# Exact fast-doubling update

Method **12** now skips the leading-bit setup work and computes only the requested value on the final bit. For even indices it avoids the two unused final squares; for odd indices it avoids the unused final product and companion-value addition. It retains the `(rug::Integer, Duration)` API and the native GMP backend. The library also exposes `fibonacci_fast_doubling(n)` alongside the existing iterative and matrix string exports.

The Cargo CLI feature now correctly enables the optional `clap` dependency, duplicate library module declarations are removed, and the unused `profile.release.optimize` key is removed. Build the CLI with `--features cli`, as shown above.

## Browser demo

```sh
cd vite-project
bun install --frozen-lockfile
bun run test
bun run dev
```

The demo uses `fibBigInt(n)`, a native JavaScript BigInt fast-doubling implementation. It runs in a module worker, supports cancellation, reports arithmetic and number-formatting time separately, previews at most 4,000 characters and downloads the complete decimal or hexadecimal result. Fractions, negative values and unsafe integer indices fail explicitly. No one-million index cap is imposed here; accepted indices are still subject to available memory and practical execution time.

The existing `fib(n)` export remains the BN.js matrix implementation and continues returning a BN value. `fibBigInt(n)` is an explicit alternative returning a JavaScript `bigint`, so existing callers do not silently change types. Its arithmetic duration excludes number formatting. The worker imports the independent BigInt module and does not bundle BN.js.

The browser demo does not build or load the native GMP crate as WebAssembly. The existing `wasm_bindgen` wrappers do not make GMP a browser-portable dependency; browser BigInt and native Rust/GMP remain separate execution paths.

## Validation and measurements

Two Rust risk tests check recurrence values across index-bit boundaries and large even/odd indices against the recursive implementation. Two browser-algorithm tests check the recurrence, parity with the retained BN API and rejection of invalid indices. Browser UI verification covers decimal/hex output, full F(1,000,000) download, bounded preview, invalid input and cancellation.

New measurements and their exact scope are recorded in [docs/FAST-DOUBLING-2026-11-09.json](docs/FAST-DOUBLING-2026-11-09.json). The historical benchmark table above remains unchanged; timings from different machines and arithmetic runtimes must not be treated as directly comparable.

On the local Apple M1 Pro release build, method 12 at n=1,000,000 improved from **3.053 ms to 1.913 ms (1.60×)**, and n=10,000,000 from **39.167 ms to 26.626 ms (1.47×)**. These are arithmetic-only medians over eleven samples after three warmups.

The JavaScript comparison used **Node V8**, not a browser benchmark: at n=100,000, the retained BN matrix path took 20.702 ms arithmetic / 394.942 ms decimal formatting, versus 0.204 ms / 0.902 ms for BigInt fast doubling. At n=1,000,000 arithmetic took 2199.122 ms versus 4.645 ms; BN decimal formatting at that size was deliberately omitted, with no extrapolated figure. Browser UI execution was verified separately.
