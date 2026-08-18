export interface PriceRange {
  min: number;
  max: number;
}

export interface Treatment {
  id: string;
  name: string;
  prices: Record<string, PriceRange>;
  hasQuantity?: boolean;
  category: string;
  secondaryCategory?: string;
}

export const NATIONALITIES_LIST = [
  'Enter your nationality',
  'Australia',
  'United States',
  'Singapore',
  'New Zealand',
  'United Kingdom',
  'Canada',
  'Vietnam',
  'Germany',
  'France',
  'Japan',
  'South Korea',
  'Russia',
  'Thailand',
  'Other'
];

export const TREATMENTS: Treatment[] = [
  { 
    id: 'cleaning', 
    name: 'Cleaning + Exam', 
    category: 'General',
    prices: {
      vn: { min: 10, max: 40 },
      th: { min: 90, max: 120 },
      au: { min: 270, max: 300 },
      sg: { min: 220, max: 250 },
      kr: { min: 120, max: 150 },
      jp: { min: 150, max: 180 },
      cn: { min: 145, max: 175 },
      ru: { min: 60, max: 90 },
      us: { min: 370, max: 400 },
    }
  },
  { 
    id: 'whitening', 
    name: 'Professional Whitening', 
    category: 'General',
    prices: {
      vn: { min: 60, max: 180 },
      th: { min: 480, max: 600 },
      au: { min: 880, max: 1000 },
      sg: { min: 1080, max: 1200 },
      kr: { min: 580, max: 700 },
      jp: { min: 780, max: 900 },
      cn: { min: 365, max: 485 },
      ru: { min: 380, max: 500 },
      us: { min: 1080, max: 1200 },
    }
  },
  { 
    id: 'filling', 
    name: 'Composite Filling', 
    hasQuantity: true, 
    category: 'General',
    prices: {
      vn: { min: 10, max: 60 },
      th: { min: 130, max: 180 },
      au: { min: 400, max: 450 },
      sg: { min: 300, max: 350 },
      kr: { min: 170, max: 220 },
      jp: { min: 250, max: 300 },
      cn: { min: 95, max: 145 },
      ru: { min: 130, max: 180 },
      us: { min: 650, max: 700 },
    }
  },
  { 
    id: 'extraction', 
    name: 'Simple Extraction', 
    hasQuantity: true, 
    category: 'General',
    prices: {
      vn: { min: 12, max: 98 },
      th: { min: 94, max: 180 },
      au: { min: 264, max: 350 },
      sg: { min: 214, max: 300 },
      kr: { min: 94, max: 180 },
      jp: { min: 134, max: 220 },
      cn: { min: 132, max: 218 },
      ru: { min: 34, max: 120 },
      us: { min: 414, max: 500 },
    }
  },
  { 
    id: 'surgical-extraction', 
    name: 'Surgical Extraction', 
    hasQuantity: true, 
    category: 'General',
    prices: {
      vn: { min: 40, max: 200 },
      th: { min: 290, max: 450 },
      au: { min: 640, max: 800 },
      sg: { min: 740, max: 900 },
      kr: { min: 340, max: 500 },
      jp: { min: 490, max: 650 },
      cn: { min: 345, max: 505 },
      ru: { min: 190, max: 350 },
      us: { min: 1040, max: 1200 },
    }
  },
  { 
    id: 'root-canal', 
    name: 'Root Canal + Crown', 
    category: 'Restorative',
    prices: {
      vn: { min: 80, max: 925 },
      th: { min: 955, max: 1800 },
      au: { min: 3155, max: 4000 },
      sg: { min: 2655, max: 3500 },
      kr: { min: 1355, max: 2200 },
      jp: { min: 1955, max: 2800 },
      cn: { min: 1378, max: 2223 },
      ru: { min: 655, max: 1500 },
      us: { min: 4155, max: 5000 },
    }
  },
  { 
    id: 'porcelain-crown', 
    name: 'Porcelain Crown (Zirconia)', 
    hasQuantity: true, 
    category: 'Restorative',
    prices: {
      vn: { min: 157, max: 394 },
      th: { min: 663, max: 900 },
      au: { min: 1963, max: 2200 },
      sg: { min: 1763, max: 2000 },
      kr: { min: 763, max: 1000 },
      jp: { min: 1263, max: 1500 },
      cn: { min: 682, max: 919 },
      ru: { min: 563, max: 800 },
      us: { min: 2763, max: 3000 },
    }
  },
  { 
    id: 'veneer', 
    name: 'Premium Veneers (per tooth)', 
    hasQuantity: true, 
    category: 'Cosmetic',
    prices: {
      vn: { min: 394, max: 551 },
      th: { min: 1043, max: 1200 },
      au: { min: 2343, max: 2500 },
      sg: { min: 2043, max: 2200 },
      kr: { min: 1043, max: 1200 },
      jp: { min: 1343, max: 1500 },
      cn: { min: 722, max: 879 },
      ru: { min: 643, max: 800 },
      us: { min: 2843, max: 3000 },
    }
  },
  { 
    id: 'implant', 
    name: 'Implant', 
    hasQuantity: true, 
    category: 'Implants',
    secondaryCategory: 'General',
    prices: {
      vn: { min: 670, max: 2285 },
      th: { min: 2385, max: 4000 },
      au: { min: 5385, max: 7000 },
      sg: { min: 4885, max: 6500 },
      kr: { min: 1885, max: 3500 },
      jp: { min: 3885, max: 5500 },
      cn: { min: 2043, max: 3658 },
      ru: { min: 1385, max: 3000 },
      us: { min: 6385, max: 8000 },
    }
  },
  { 
    id: 'all-on-4', 
    name: 'All-on-4 Full Arch', 
    category: 'Implants',
    prices: {
      vn: { min: 4724, max: 7874 },
      th: { min: 14850, max: 18000 },
      au: { min: 36850, max: 40000 },
      sg: { min: 34850, max: 38000 },
      kr: { min: 14850, max: 18000 },
      jp: { min: 31850, max: 35000 },
      cn: { min: 11425, max: 14575 },
      ru: { min: 14850, max: 18000 },
      us: { min: 41850, max: 45000 },
    }
  },
  { 
    id: 'invisalign', 
    name: 'Invisalign (Full Package)', 
    category: 'Orthodontics',
    prices: {
      vn: { min: 4724, max: 5905 },
      th: { min: 5819, max: 7000 },
      au: { min: 7819, max: 9000 },
      sg: { min: 8819, max: 10000 },
      kr: { min: 5319, max: 6500 },
      jp: { min: 7319, max: 8500 },
      cn: { min: 5910, max: 7091 },
      ru: { min: 4819, max: 6000 },
      us: { min: 7819, max: 9000 },
    }
  },
  { 
    id: 'braces', 
    name: 'Braces / Orthodontics', 
    category: 'Orthodontics',
    prices: {
      vn: { min: 984, max: 2755 },
      th: { min: 2729, max: 4500 },
      au: { min: 6229, max: 8000 },
      sg: { min: 6229, max: 8000 },
      kr: { min: 3229, max: 5000 },
      jp: { min: 5229, max: 7000 },
      cn: { min: 3315, max: 5086 },
      ru: { min: 2229, max: 4000 },
      us: { min: 6229, max: 8000 },
    }
  },
  { 
    id: 'smile-makeover', 
    name: 'Full Smile Makeover', 
    category: 'Cosmetic',
    prices: {
      vn: { min: 3780, max: 11020 },
      th: { min: 17760, max: 25000 },
      au: { min: 52760, max: 60000 },
      sg: { min: 47760, max: 55000 },
      kr: { min: 17760, max: 25000 },
      jp: { min: 37760, max: 45000 },
      cn: { min: 17380, max: 24620 },
      ru: { min: 10760, max: 18000 },
      us: { min: 62760, max: 70000 },
    }
  },
  { 
    id: 'sinus-lift', 
    name: 'Sinus Lift (Support)', 
    category: 'Implants',
    prices: {
      vn: { min: 197, max: 590 },
      th: { min: 807, max: 1200 },
      au: { min: 2607, max: 3000 },
      sg: { min: 2107, max: 2500 },
      kr: { min: 1107, max: 1500 },
      jp: { min: 1407, max: 1800 },
      cn: { min: 1204, max: 1597 },
      ru: { min: 507, max: 900 },
      us: { min: 3607, max: 4000 },
    }
  },
];

export const CATEGORIES = ['General', 'Restorative', 'Implants', 'Orthodontics', 'Cosmetic'];

export const ORIGINS = {
  au: { label: 'Australia', short: 'AUS' },
  us: { label: 'USA', short: 'USA' },
  th: { label: 'Thailand', short: 'THA' },
  sg: { label: 'Singapore', short: 'SGP' },
  kr: { label: 'South Korea', short: 'KOR' },
  jp: { label: 'Japan', short: 'JPN' },
  cn: { label: 'China', short: 'CHN' },
  ru: { label: 'Russia', short: 'RUS' },
};
