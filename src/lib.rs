use wasm_bindgen::prelude::*;

pub mod approx;
pub mod rayon;
pub mod simple;
pub mod threads;

#[wasm_bindgen]
pub fn fibonacci_iterative(n: usize) -> String {
    simple::iter::fib(n).0.to_string()
}

#[wasm_bindgen]
pub fn fibonacci_matrix(n: usize) -> String {
    simple::matrix::fib(n).0.to_string()
}

#[wasm_bindgen]
pub fn fibonacci_fast_doubling(n: usize) -> String {
    simple::fast_doubling_iter::fib(n).0.to_string()
}
