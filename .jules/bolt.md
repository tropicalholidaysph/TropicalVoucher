## 2025-05-11 - Optimized multi-pass array iterations in React
**Learning:** In components handling large data sets (like VoucherTable), multiple .reduce, .filter, and .map calls on the same array during a single render cycle can lead to performance degradation. Combining these into a single 'for...of' loop within a useMemo block significantly reduces overhead.
**Action:** Always check if multiple memoized values are derived from the same source array and consider combining them into a single-pass calculation.
