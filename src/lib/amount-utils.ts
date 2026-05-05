/**
 * Converts numerical Omani Rial amounts to words locally.
 */
export function convertAmountToWords(amount: number): string {
  const rials = Math.floor(amount);
  const baisas = Math.round((amount - rials) * 1000);

  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const scales = ['', 'Thousand', 'Million'];

  function convertGroup(n: number): string {
    let res = '';
    if (n >= 100) {
      res += ones[Math.floor(n / 100)] + ' Hundred ';
      n %= 100;
    }
    if (n >= 10 && n <= 19) {
      res += teens[n - 10] + ' ';
    } else if (n >= 20) {
      res += tens[Math.floor(n / 10)] + ' ';
      n %= 10;
    }
    if (n >= 1 && n <= 9) {
      res += ones[n] + ' ';
    }
    return res.trim();
  }

  function numberToWords(num: number): string {
    if (num === 0) return 'Zero';
    let res = '';
    let scaleIdx = 0;
    let tempNum = num;
    while (tempNum > 0) {
      const group = tempNum % 1000;
      if (group > 0) {
        const groupWords = convertGroup(group);
        res = groupWords + (scales[scaleIdx] ? ' ' + scales[scaleIdx] : '') + ' ' + res;
      }
      tempNum = Math.floor(tempNum / 1000);
      scaleIdx++;
    }
    return res.trim();
  }

  let result = 'Sum of Rial Omani ';
  if (rials > 0) {
    result += numberToWords(rials);
  } else {
    result += 'Zero';
  }

  if (baisas > 0) {
    result += ' and ' + numberToWords(baisas) + ' Baisa only';
  } else {
    result += ' only';
  }

  return result;
}
