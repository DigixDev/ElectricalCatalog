// Utility to convert numbers to Persian words for official invoices

const ones = ['', 'یک', 'دو', 'سه', 'چهار', 'پنج', 'شش', 'هفت', 'هشت', 'نه'];
const teens = [
  'ده',
  'یازده',
  'دوازده',
  'سیزده',
  'چهارده',
  'پانزده',
  'شانزده',
  'هفده',
  'هجده',
  'نوزده',
];
const tens = ['', '', 'بیست', 'سی', 'چهل', 'پنجاه', 'شصت', 'هفتاد', 'هشتاد', 'نود'];
const hundreds = [
  '',
  'یکصد',
  'دویست',
  'سیصد',
  'چهارصد',
  'پانصد',
  'ششصد',
  'هفتصد',
  'هشتصد',
  'نهصد',
];
const scales = ['', 'هزار', 'میلیون', 'میلیارد', 'تریلیون'];

function convertThreeDigits(num: number): string {
  const parts: string[] = [];
  const h = Math.floor(num / 100);
  const remainder = num % 100;
  const t = Math.floor(remainder / 10);
  const o = remainder % 10;

  if (h > 0) parts.push(hundreds[h]);

  if (remainder >= 10 && remainder < 20) {
    parts.push(teens[remainder - 10]);
  } else {
    if (t > 0) parts.push(tens[t]);
    if (o > 0) parts.push(ones[o]);
  }

  return parts.join(' و ');
}

export function numberToPersianWords(amount: number): string {
  if (amount === 0) return 'صفر';
  if (amount < 0) return `منفی ${numberToPersianWords(Math.abs(amount))}`;

  const numStr = Math.floor(amount).toString();
  const groups: number[] = [];

  for (let i = numStr.length; i > 0; i -= 3) {
    const start = Math.max(0, i - 3);
    groups.unshift(parseInt(numStr.slice(start, i), 10));
  }

  const resultParts: string[] = [];
  const totalGroups = groups.length;

  for (let i = 0; i < totalGroups; i++) {
    const groupVal = groups[i];
    if (groupVal > 0) {
      const scaleIndex = totalGroups - 1 - i;
      const groupWords = convertThreeDigits(groupVal);
      const scaleWord = scales[scaleIndex];
      resultParts.push(scaleWord ? `${groupWords} ${scaleWord}` : groupWords);
    }
  }

  return resultParts.join(' و ') + ' تومان';
}
