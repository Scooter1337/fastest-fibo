use rug::{Complete, Integer};
use std::time::{Duration, Instant};

/// Compute F(n), skipping the unused companion value on the final index bit.
pub fn fib(n: usize) -> (Integer, Duration) {
    if n < 3 {
        return (Integer::from(u8::from(n != 0)), Duration::ZERO);
    }
    let start = Instant::now();
    let highest_bit = usize::BITS - n.leading_zeros() - 1;
    // The leading set bit is already represented by (F(1), F(2)).
    let mut a = Integer::from(1);
    let mut b = Integer::from(1);
    for bit in (1..highest_bit).rev() {
        let mut difference = b.clone();
        difference <<= 1;
        difference -= &a;
        let c = (&a * &difference).complete();
        let mut d = a.square_ref().complete();
        d += b.square_ref();
        (a, b) = if (n >> bit) & 1 == 0 {
            (c, d)
        } else {
            let next = (&c + &d).complete();
            (d, next)
        };
    }
    let result = if n & 1 == 0 {
        b <<= 1;
        b -= &a;
        a * b
    } else {
        a.square_mut();
        a += b.square_ref();
        a
    };
    (result, start.elapsed())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn exact_values_across_index_bit_boundaries() {
        let (mut a, mut b) = (Integer::from(0), Integer::from(1));
        for n in 0..=4097 {
            assert_eq!(fib(n).0, a, "F({n})");
            let next = (&a + &b).complete();
            (a, b) = (b, next);
        }
    }

    #[test]
    fn large_even_and_odd_indices_match_recursive_doubling() {
        for n in [99_999, 100_000, 1_000_000, 1_000_001] {
            assert_eq!(fib(n).0, crate::simple::fast_doubling::fib(n).0, "F({n})");
        }
    }
}
