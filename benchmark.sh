./target/release/fastest-fibo -m 4 --length 1 --quiet --warmup 100 > res/result1.txt
./target/release/fastest-fibo -m 4 --length 10 --quiet --warmup 100 > res/result10.txt
./target/release/fastest-fibo -m 4 --length 100 --quiet --warmup 100 > res/result100.txt
./target/release/fastest-fibo -m 0 --length 1000 --quiet --warmup 100 > res/result1000.txt
./target/release/fastest-fibo -m 0 --length 10000 --quiet --warmup 100 > res/result10000.txt
./target/release/fastest-fibo -m 0 --length 100000 --quiet --warmup 100 > res/result100000.txt
./target/release/fastest-fibo -m 8 --length 1000000 --quiet --warmup 100 > res/result1000000.txt
./target/release/fastest-fibo -m 8 --length 10000000 --quiet --warmup 100 > res/result10000000.txt
./target/release/fastest-fibo -m 8 --length 100000000 --quiet --warmup 100 > res/result100000000.txt
./target/release/fastest-fibo -m 8 --length 1000000000 --quiet --warmup 10 > res/result1000000000.txt
