import sys

with open('src/components/VoucherTable.tsx', 'r') as f:
    content = f.read()

# 1. Optimize filteredVouchers
old_filtered = """  const filteredVouchers = useMemo(() => {
    return vouchers
      .filter((v) =>
        v.voucherNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.purpose.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        const numA = parseInt(a.voucherNo) || 0;
        const numB = parseInt(b.voucherNo) || 0;
        if (numA !== numB) return numA - numB; // Ascending
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      });
  }, [vouchers, searchTerm]);"""

new_filtered = """  const filteredVouchers = useMemo(() => {
    const search = searchTerm.toLowerCase();
    return vouchers
      .filter((v) =>
        v.voucherNo.toLowerCase().includes(search) ||
        v.recipient.toLowerCase().includes(search) ||
        v.purpose.toLowerCase().includes(search)
      )
      .sort((a, b) => {
        const numA = parseInt(a.voucherNo) || 0;
        const numB = parseInt(b.voucherNo) || 0;
        if (numA !== numB) return numA - numB; // Ascending
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      });
  }, [vouchers, searchTerm]);"""

content = content.replace(old_filtered, new_filtered)

# 2. Optimize stats and voucherNoCounts
old_stats_and_counts = """  const voucherNoCounts = useMemo(() => {
    return vouchers.reduce((acc, v) => {
      acc[v.voucherNo] = (acc[v.voucherNo] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [vouchers]);

  const stats = useMemo(() => {
    const totalRO = vouchers.reduce((acc, v) => acc + (v.isVoid ? 0 : v.amountRO), 0);
    const totalBz = vouchers.reduce((acc, v) => acc + (v.isVoid ? 0 : v.amountBz), 0);
    const normalizedRO = totalRO + Math.floor(totalBz / 1000);
    const normalizedBz = totalBz % 1000;
    const voidCount = vouchers.filter(v => v.isVoid || v.recipient === "VOID / NO DATA").length;

    return {
      ledgerCount: ledgers.length,
      voucherCount: vouchers.length,
      totalRO: normalizedRO,
      totalBz: normalizedBz,
      voidCount
    };
  }, [vouchers, ledgers]);"""

new_stats_and_counts = """  // Optimization: Single pass calculation for stats and duplicate counts
  const { voucherNoCounts, stats } = useMemo(() => {
    const counts: Record<string, number> = {};
    let totalRO = 0;
    let totalBz = 0;
    let voidCount = 0;

    for (const v of vouchers) {
      // Count voucher numbers for duplicate detection
      counts[v.voucherNo] = (counts[v.voucherNo] || 0) + 1;

      // Accumulate stats
      if (v.isVoid || v.recipient === "VOID / NO DATA") {
        voidCount++;
      } else {
        totalRO += v.amountRO;
        totalBz += v.amountBz;
      }
    }

    const normalizedRO = totalRO + Math.floor(totalBz / 1000);
    const normalizedBz = totalBz % 1000;

    return {
      voucherNoCounts: counts,
      stats: {
        ledgerCount: ledgers.length,
        voucherCount: vouchers.length,
        totalRO: normalizedRO,
        totalBz: normalizedBz,
        voidCount
      }
    };
  }, [vouchers, ledgers.length]);"""

content = content.replace(old_stats_and_counts, new_stats_and_counts)

with open('src/components/VoucherTable.tsx', 'w') as f:
    f.write(content)
