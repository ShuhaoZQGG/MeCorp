const FALLBACK_NEWS: Array<{ headline: string; body: string }> = [
  { headline: 'Q3 Synergy Levels At All-Time High', body: 'Management credits the new open floor plan and mandatory fun Fridays.' },
  { headline: 'Break Room Coffee Machine Upgraded', body: 'Now featuring artisanal sludge and premium brown water options.' },
  { headline: 'Employee of the Month: TBD', body: 'HR is still processing last month\'s nominations. And the month before.' },
  { headline: 'New Policy: Mandatory Desk Plants', body: 'Studies show plants increase productivity by a made-up percentage.' },
  { headline: 'Parking Lot Expansion Approved', body: 'Construction begins never. Remote work petition also denied.' },
  { headline: 'Annual Review Process Streamlined', body: 'Now only requires 47 forms instead of the previous 52.' },
  { headline: 'CEO Completes Marathon', body: 'Entire company receives motivational email about perseverance.' },
  { headline: 'Printer on Floor 3 Fixed', body: 'IT celebrates with champagne. Printer breaks again immediately.' },
  { headline: 'Team Building Event Announced', body: 'Escape room theme: "Escaping Another Team Building Event."' },
  { headline: 'MeCorp Stock Hits New Record', body: 'Employees reminded that their stock options vest in 2047.' },
  { headline: 'Wellness Wednesday Introduced', body: 'Free yoga mats provided. Yoga instructor budget denied.' },
  { headline: 'New Expense Policy Released', body: 'Stapler requisitions now require VP-level approval.' },
];

export function getRandomFallbackNews(): Array<{ headline: string; body: string }> {
  const shuffled = [...FALLBACK_NEWS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3);
}
