import sys

with open('src/components/VoucherTable.tsx', 'r') as f:
    content = f.read()

# 1. Add useDeferredValue to imports if not present
if 'useDeferredValue' not in content:
    content = content.replace('useState, useRef, useEffect, useMemo', 'useState, useRef, useEffect, useMemo, useDeferredValue')

# 2. Add deferredSearchTerm
if 'const deferredSearchTerm = useDeferredValue(searchTerm);' not in content:
    content = content.replace('const [searchTerm, setSearchTerm] = useState("");',
                              'const [searchTerm, setSearchTerm] = useState("");\n  const deferredSearchTerm = useDeferredValue(searchTerm);')

# 3. Update filteredVouchers to use deferredSearchTerm
content = content.replace('const search = searchTerm.toLowerCase();', 'const search = deferredSearchTerm.toLowerCase();')
content = content.replace('}, [vouchers, searchTerm]);', '}, [vouchers, deferredSearchTerm]);')

with open('src/components/VoucherTable.tsx', 'w') as f:
    f.write(content)
