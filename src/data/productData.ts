import { Brand, Distributor, Product, ProductCategory, ProductBundle } from '../types';

export const mockDistributors: Distributor[] = [
  {
    id: 'sephora',
    name: 'Sephora',
    website: 'https://sephora.com',
    logo: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=100&h=100&fit=crop',
    isPartner: true
  },
  {
    id: 'ulta',
    name: 'Ulta Beauty',
    website: 'https://ulta.com',
    logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop',
    isPartner: true
  },
  {
    id: 'amazon',
    name: 'Amazon',
    website: 'https://amazon.com',
    logo: 'https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=100&h=100&fit=crop',
    isPartner: false
  },
  {
    id: 'target',
    name: 'Target',
    website: 'https://target.com',
    logo: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=100&h=100&fit=crop',
    isPartner: true
  }
];

export const mockBrands: Brand[] = [
  {
    id: 'skinglow',
    name: 'SkinGlow Pro',
    logo: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=150&h=150&fit=crop',
    description: 'Premium skincare with scientifically-proven ingredients',
    verified: true,
    distributors: [mockDistributors[0], mockDistributors[1]]
  },
  {
    id: 'radiance',
    name: 'Radiance Labs',
    logo: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=150&h=150&fit=crop',
    description: 'Advanced vitamin C and brightening solutions',
    verified: true,
    distributors: [mockDistributors[0], mockDistributors[2]]
  },
  {
    id: 'sunshield',
    name: 'SunShield',
    logo: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=150&h=150&fit=crop',
    description: 'Superior sun protection for all skin types',
    verified: true,
    distributors: [mockDistributors[1], mockDistributors[3]]
  },
  {
    id: 'youth',
    name: 'Youth Renewal',
    logo: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=150&h=150&fit=crop',
    description: 'Anti-aging treatments with retinol and peptides',
    verified: true,
    distributors: [mockDistributors[0], mockDistributors[1], mockDistributors[2]]
  },
  {
    id: 'hydraplus',
    name: 'HydraPlus',
    logo: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=150&h=150&fit=crop',
    description: 'Intensive hydration and moisture barrier repair',
    verified: false,
    distributors: [mockDistributors[2], mockDistributors[3]]
  },
  {
    id: 'purecleanse',
    name: 'PureCleanse',
    logo: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=150&h=150&fit=crop',
    description: 'Gentle cleansing solutions for sensitive skin',
    verified: true,
    distributors: [mockDistributors[0], mockDistributors[3]]
  }
];

export const productCategories: ProductCategory[] = [
  {
    id: 'cleanser',
    name: 'Cleansers',
    description: 'Face washes and cleansing products',
    icon: '🧼'
  },
  {
    id: 'serum',
    name: 'Serums',
    description: 'Concentrated treatment serums',
    icon: '💧'
  },
  {
    id: 'moisturizer',
    name: 'Moisturizers',
    description: 'Daily hydration and creams',
    icon: '🧴'
  },
  {
    id: 'sunscreen',
    name: 'Sunscreen',
    description: 'UV protection products',
    icon: '☀️'
  },
  {
    id: 'treatment',
    name: 'Treatments',
    description: 'Specialized skin treatments',
    icon: '⚗️'
  },
  {
    id: 'mask',
    name: 'Masks',
    description: 'Face masks and treatments',
    icon: '🎭'
  },
  {
    id: 'toner',
    name: 'Toners',
    description: 'Balancing and pH-adjusting toners',
    icon: '🌿'
  },
  {
    id: 'exfoliant',
    name: 'Exfoliants',
    description: 'Chemical and physical exfoliants',
    icon: '✨'
  }
];

export const mockProducts: Product[] = [
  // Cleansers
  {
    id: 'clean-001',
    name: 'Gentle Foam Cleanser',
    brand: mockBrands[5], // PureCleanse
    distributor: mockDistributors[0], // Sephora
    price: 22.99,
    rating: 4.6,
    reviews: 892,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&h=300&fit=crop',
    category: productCategories[0],
    description: 'pH-balanced foam cleanser that removes impurities without stripping skin',
    keyIngredients: ['Ceramides', 'Niacinamide', 'Hyaluronic Acid'],
    skinType: ['Sensitive', 'Dry', 'All Types'],
    skinConcerns: ['Dryness', 'Sensitivity'],
    shopUrl: 'https://sephora.com/product/1',
    inStock: true,
    isRecommended: true,
    affiliateLinks: {
      amazon: 'https://www.amazon.com/dp/B08XXX?tag=skinpai-20',
      sephora: 'https://www.sephora.com/product/gentle-foam-cleanser?ref=skinpai',
      ulta: 'https://www.ulta.com/p/gentle-foam-cleanser?ref=skinpai'
    }
  },
  {
    id: 'clean-002',
    name: 'Hydrating Oil Cleanser',
    brand: mockBrands[4], // HydraPlus
    distributor: mockDistributors[3], // Target
    price: 18.50,
    originalPrice: 24.99,
    rating: 4.4,
    reviews: 567,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300&h=300&fit=crop',
    category: productCategories[0],
    description: 'Nourishing oil cleanser that melts away makeup and sunscreen',
    keyIngredients: ['Jojoba Oil', 'Vitamin E', 'Chamomile'],
    skinType: ['Dry', 'Mature'],
    skinConcerns: ['Dryness', 'Makeup Removal'],
    shopUrl: 'https://target.com/product/2',
    inStock: true,
    discount: 26
  },

  // Serums
  {
    id: 'serum-001',
    name: 'Hyaluronic Acid Serum',
    brand: mockBrands[0], // SkinGlow Pro
    distributor: mockDistributors[0], // Sephora
    price: 29.99,
    originalPrice: 39.99,
    rating: 4.8,
    reviews: 1247,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300&h=300&fit=crop',
    category: productCategories[1],
    description: 'Triple-weight hyaluronic acid for intense hydration and plumping',
    keyIngredients: ['Hyaluronic Acid', 'Vitamin B5', 'Glycerin'],
    skinType: ['Dry', 'Dehydrated', 'All Types'],
    skinConcerns: ['Dryness', 'Fine Lines', 'Dehydration'],
    shopUrl: 'https://sephora.com/product/3',
    inStock: true,
    isRecommended: true,
    discount: 25
  },
  {
    id: 'serum-002',
    name: 'Vitamin C Brightening Serum',
    brand: mockBrands[1], // Radiance Labs
    distributor: mockDistributors[0], // Sephora
    price: 45.00,
    rating: 4.6,
    reviews: 892,
    image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=300&h=300&fit=crop',
    category: productCategories[1],
    description: '20% L-Ascorbic Acid serum for brightening and antioxidant protection',
    keyIngredients: ['Vitamin C', 'Ferulic Acid', 'Vitamin E'],
    skinType: ['Dull', 'Uneven', 'Normal'],
    skinConcerns: ['Dark Spots', 'Dullness', 'Uneven Tone'],
    shopUrl: 'https://sephora.com/product/4',
    inStock: true,
    isRecommended: true
  },
  {
    id: 'serum-003',
    name: 'Retinol Renewal Serum',
    brand: mockBrands[3], // Youth Renewal
    distributor: mockDistributors[1], // Ulta
    price: 52.00,
    originalPrice: 65.00,
    rating: 4.7,
    reviews: 743,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop',
    category: productCategories[1],
    description: 'Time-released retinol serum for anti-aging and texture improvement',
    keyIngredients: ['Retinol', 'Squalane', 'Peptides'],
    skinType: ['Mature', 'Acne-Prone'],
    skinConcerns: ['Fine Lines', 'Wrinkles', 'Texture'],
    shopUrl: 'https://ulta.com/product/5',
    inStock: false,
    discount: 20
  },

  // Moisturizers
  {
    id: 'moist-001',
    name: 'Daily Hydrating Cream',
    brand: mockBrands[4], // HydraPlus
    distributor: mockDistributors[2], // Amazon
    price: 35.00,
    rating: 4.5,
    reviews: 1156,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&h=300&fit=crop',
    category: productCategories[2],
    description: 'Lightweight daily moisturizer with 24-hour hydration',
    keyIngredients: ['Ceramides', 'Hyaluronic Acid', 'Peptides'],
    skinType: ['Normal', 'Combination', 'Dry'],
    skinConcerns: ['Dryness', 'Barrier Repair'],
    shopUrl: 'https://amazon.com/product/6',
    inStock: true
  },
  {
    id: 'moist-002',
    name: 'Night Recovery Cream',
    brand: mockBrands[3], // Youth Renewal
    distributor: mockDistributors[0], // Sephora
    price: 68.00,
    rating: 4.8,
    reviews: 445,
    image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=300&h=300&fit=crop',
    category: productCategories[2],
    description: 'Rich overnight cream with anti-aging peptides and antioxidants',
    keyIngredients: ['Retinyl Palmitate', 'Peptides', 'Antioxidants'],
    skinType: ['Mature', 'Dry'],
    skinConcerns: ['Aging', 'Fine Lines', 'Firmness'],
    shopUrl: 'https://sephora.com/product/7',
    inStock: true,
    isRecommended: true
  },

  // Sunscreens
  {
    id: 'sun-001',
    name: 'SPF 50 Daily Sunscreen',
    brand: mockBrands[2], // SunShield
    distributor: mockDistributors[1], // Ulta
    price: 24.99,
    rating: 4.9,
    reviews: 2156,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&h=300&fit=crop',
    category: productCategories[3],
    description: 'Broad spectrum protection with zinc oxide and titanium dioxide',
    keyIngredients: ['Zinc Oxide', 'Titanium Dioxide', 'Vitamin E'],
    skinType: ['All Types', 'Sensitive'],
    skinConcerns: ['Sun Protection', 'Prevention'],
    shopUrl: 'https://ulta.com/product/8',
    inStock: true,
    isRecommended: true
  },
  {
    id: 'sun-002',
    name: 'Tinted Mineral SPF 30',
    brand: mockBrands[2], // SunShield
    distributor: mockDistributors[3], // Target
    price: 19.99,
    rating: 4.3,
    reviews: 834,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop',
    category: productCategories[3],
    description: 'Tinted mineral sunscreen with light coverage and SPF 30',
    keyIngredients: ['Zinc Oxide', 'Iron Oxides', 'Antioxidants'],
    skinType: ['Normal', 'Combination'],
    skinConcerns: ['Sun Protection', 'Light Coverage'],
    shopUrl: 'https://target.com/product/9',
    inStock: true
  },

  // Treatments
  {
    id: 'treat-001',
    name: 'AHA/BHA Exfoliating Treatment',
    brand: mockBrands[0], // SkinGlow Pro
    distributor: mockDistributors[1], // Ulta
    price: 42.00,
    rating: 4.4,
    reviews: 678,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300&h=300&fit=crop',
    category: productCategories[4],
    description: 'Dual-action chemical exfoliant with glycolic and salicylic acid',
    keyIngredients: ['Glycolic Acid', 'Salicylic Acid', 'Niacinamide'],
    skinType: ['Oily', 'Acne-Prone', 'Normal'],
    skinConcerns: ['Texture', 'Pores', 'Breakouts'],
    shopUrl: 'https://ulta.com/product/10',
    inStock: true
  },
  {
    id: 'treat-002',
    name: 'Niacinamide 10% + Zinc 1%',
    brand: mockBrands[0], // SkinGlow Pro
    distributor: mockDistributors[2], // Amazon
    price: 15.99,
    rating: 4.6,
    reviews: 1823,
    image: 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=300&h=300&fit=crop',
    category: productCategories[4],
    description: 'Oil control and pore minimizing treatment serum',
    keyIngredients: ['Niacinamide', 'Zinc PCA', 'Panthenol'],
    skinType: ['Oily', 'Combination', 'Acne-Prone'],
    skinConcerns: ['Pores', 'Oil Control', 'Blemishes'],
    shopUrl: 'https://amazon.com/product/11',
    inStock: true,
    isRecommended: true
  },

  // Masks
  {
    id: 'mask-001',
    name: 'Detox Clay Mask',
    brand: mockBrands[5], // PureCleanse
    distributor: mockDistributors[3], // Target
    price: 28.00,
    originalPrice: 35.00,
    rating: 4.5,
    reviews: 524,
    image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=300&h=300&fit=crop',
    category: productCategories[5],
    description: 'Kaolin clay mask that draws out impurities and minimizes pores',
    keyIngredients: ['Kaolin Clay', 'Bentonite', 'Tea Tree Oil'],
    skinType: ['Oily', 'Combination', 'Acne-Prone'],
    skinConcerns: ['Pores', 'Excess Oil', 'Breakouts'],
    shopUrl: 'https://target.com/product/12',
    inStock: true,
    discount: 20
  },
  {
    id: 'mask-002',
    name: 'Hydrating Sheet Mask Set',
    brand: mockBrands[4], // HydraPlus
    distributor: mockDistributors[2], // Amazon
    price: 24.99,
    rating: 4.7,
    reviews: 1245,
    image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=300&h=300&fit=crop',
    category: productCategories[5],
    description: 'Set of 5 bio-cellulose masks with hyaluronic acid',
    keyIngredients: ['Hyaluronic Acid', 'Collagen', 'Vitamin E'],
    skinType: ['All Types', 'Dry', 'Dehydrated'],
    skinConcerns: ['Dryness', 'Dullness', 'Dehydration'],
    shopUrl: 'https://amazon.com/product/13',
    inStock: true,
    isRecommended: true
  },
  {
    id: 'mask-003',
    name: 'Overnight Sleeping Mask',
    brand: mockBrands[3], // Youth Renewal
    distributor: mockDistributors[0], // Sephora
    price: 48.00,
    rating: 4.8,
    reviews: 892,
    image: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=300&h=300&fit=crop',
    category: productCategories[5],
    description: 'Intensive overnight treatment mask for deep hydration',
    keyIngredients: ['Peptides', 'Ceramides', 'Squalane'],
    skinType: ['Dry', 'Mature', 'Normal'],
    skinConcerns: ['Dryness', 'Fine Lines', 'Firmness'],
    shopUrl: 'https://sephora.com/product/14',
    inStock: true
  },

  // Toners
  {
    id: 'toner-001',
    name: 'Balancing pH Toner',
    brand: mockBrands[5], // PureCleanse
    distributor: mockDistributors[0], // Sephora
    price: 26.00,
    rating: 4.4,
    reviews: 567,
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=300&h=300&fit=crop',
    category: productCategories[6],
    description: 'Alcohol-free toner that restores skin pH balance',
    keyIngredients: ['Rose Water', 'Niacinamide', 'Allantoin'],
    skinType: ['All Types', 'Sensitive'],
    skinConcerns: ['Balance', 'Sensitivity', 'Redness'],
    shopUrl: 'https://sephora.com/product/15',
    inStock: true
  },
  {
    id: 'toner-002',
    name: 'Glycolic Acid Toner 7%',
    brand: mockBrands[1], // Radiance Labs
    distributor: mockDistributors[1], // Ulta
    price: 32.00,
    originalPrice: 40.00,
    rating: 4.6,
    reviews: 943,
    image: 'https://images.unsplash.com/photo-1556228578-dd4715a0b5bc?w=300&h=300&fit=crop',
    category: productCategories[6],
    description: 'Exfoliating toner with 7% glycolic acid for smooth, radiant skin',
    keyIngredients: ['Glycolic Acid', 'Aloe Vera', 'Ginseng'],
    skinType: ['Normal', 'Combination', 'Dull'],
    skinConcerns: ['Texture', 'Dullness', 'Uneven Tone'],
    shopUrl: 'https://ulta.com/product/16',
    inStock: true,
    discount: 20,
    isRecommended: true
  },
  {
    id: 'toner-003',
    name: 'Centella Soothing Toner',
    brand: mockBrands[5], // PureCleanse
    distributor: mockDistributors[3], // Target
    price: 22.00,
    rating: 4.7,
    reviews: 728,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop',
    category: productCategories[6],
    description: 'Calming toner with centella asiatica for sensitive skin',
    keyIngredients: ['Centella Asiatica', 'Panthenol', 'Madecassoside'],
    skinType: ['Sensitive', 'Reactive', 'All Types'],
    skinConcerns: ['Sensitivity', 'Redness', 'Irritation'],
    shopUrl: 'https://target.com/product/17',
    inStock: true
  },

  // Exfoliants
  {
    id: 'exfo-001',
    name: 'Lactic Acid 10% + HA',
    brand: mockBrands[0], // SkinGlow Pro
    distributor: mockDistributors[0], // Sephora
    price: 18.99,
    rating: 4.5,
    reviews: 1456,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300&h=300&fit=crop',
    category: productCategories[7],
    description: 'Gentle exfoliating serum with lactic acid for sensitive skin',
    keyIngredients: ['Lactic Acid', 'Hyaluronic Acid', 'Tasmanian Pepperberry'],
    skinType: ['Sensitive', 'Dry', 'Normal'],
    skinConcerns: ['Texture', 'Dullness', 'Fine Lines'],
    shopUrl: 'https://sephora.com/product/18',
    inStock: true,
    isRecommended: true
  },
  {
    id: 'exfo-002',
    name: 'Enzyme Exfoliating Powder',
    brand: mockBrands[5], // PureCleanse
    distributor: mockDistributors[1], // Ulta
    price: 34.00,
    rating: 4.6,
    reviews: 634,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&h=300&fit=crop',
    category: productCategories[7],
    description: 'Papaya and pineapple enzyme powder exfoliant',
    keyIngredients: ['Papain', 'Bromelain', 'Rice Powder'],
    skinType: ['All Types', 'Sensitive'],
    skinConcerns: ['Texture', 'Dullness', 'Pores'],
    shopUrl: 'https://ulta.com/product/19',
    inStock: true
  },
  {
    id: 'exfo-003',
    name: 'Salicylic Acid 2% Solution',
    brand: mockBrands[0], // SkinGlow Pro
    distributor: mockDistributors[2], // Amazon
    price: 12.99,
    rating: 4.7,
    reviews: 2341,
    image: 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=300&h=300&fit=crop',
    category: productCategories[7],
    description: 'BHA exfoliant for acne-prone and congested skin',
    keyIngredients: ['Salicylic Acid', 'Witch Hazel', 'Panthenol'],
    skinType: ['Oily', 'Acne-Prone', 'Combination'],
    skinConcerns: ['Breakouts', 'Pores', 'Texture'],
    shopUrl: 'https://amazon.com/product/20',
    inStock: true,
    isRecommended: true
  },

  // More Cleansers
  {
    id: 'clean-003',
    name: 'Micellar Cleansing Water',
    brand: mockBrands[5], // PureCleanse
    distributor: mockDistributors[2], // Amazon
    price: 16.99,
    rating: 4.5,
    reviews: 1876,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&h=300&fit=crop',
    category: productCategories[0],
    description: 'No-rinse micellar water for makeup removal and cleansing',
    keyIngredients: ['Micelles', 'Glycerin', 'Cucumber Extract'],
    skinType: ['All Types', 'Sensitive'],
    skinConcerns: ['Makeup Removal', 'Convenience'],
    shopUrl: 'https://amazon.com/product/21',
    inStock: true
  },
  {
    id: 'clean-004',
    name: 'Double Cleanse Duo',
    brand: mockBrands[5], // PureCleanse
    distributor: mockDistributors[0], // Sephora
    price: 38.00,
    originalPrice: 48.00,
    rating: 4.8,
    reviews: 523,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300&h=300&fit=crop',
    category: productCategories[0],
    description: 'Complete double cleanse system with oil and foam cleanser',
    keyIngredients: ['Grapeseed Oil', 'Green Tea', 'Amino Acids'],
    skinType: ['All Types', 'Combination'],
    skinConcerns: ['Deep Cleansing', 'Makeup Removal'],
    shopUrl: 'https://sephora.com/product/22',
    inStock: true,
    discount: 21
  },

  // More Serums
  {
    id: 'serum-004',
    name: 'Peptide Complex Serum',
    brand: mockBrands[3], // Youth Renewal
    distributor: mockDistributors[0], // Sephora
    price: 58.00,
    rating: 4.7,
    reviews: 845,
    image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=300&h=300&fit=crop',
    category: productCategories[1],
    description: 'Multi-peptide serum for firmness and elasticity',
    keyIngredients: ['Matrixyl 3000', 'Argireline', 'Copper Peptides'],
    skinType: ['Mature', 'All Types'],
    skinConcerns: ['Fine Lines', 'Firmness', 'Sagging'],
    shopUrl: 'https://sephora.com/product/23',
    inStock: true,
    isRecommended: true
  },
  {
    id: 'serum-005',
    name: 'Alpha Arbutin 2% + HA',
    brand: mockBrands[1], // Radiance Labs
    distributor: mockDistributors[2], // Amazon
    price: 16.99,
    rating: 4.4,
    reviews: 967,
    image: 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=300&h=300&fit=crop',
    category: productCategories[1],
    description: 'Brightening serum targeting hyperpigmentation and dark spots',
    keyIngredients: ['Alpha Arbutin', 'Hyaluronic Acid', 'Vitamin C'],
    skinType: ['All Types', 'Uneven'],
    skinConcerns: ['Dark Spots', 'Hyperpigmentation', 'Uneven Tone'],
    shopUrl: 'https://amazon.com/product/24',
    inStock: true
  },
  {
    id: 'serum-006',
    name: 'Caffeine Eye Serum',
    brand: mockBrands[0], // SkinGlow Pro
    distributor: mockDistributors[1], // Ulta
    price: 24.00,
    rating: 4.6,
    reviews: 1234,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300&h=300&fit=crop',
    category: productCategories[1],
    description: 'Depuffing eye serum with caffeine and peptides',
    keyIngredients: ['Caffeine', 'Peptides', 'Hyaluronic Acid'],
    skinType: ['All Types'],
    skinConcerns: ['Dark Circles', 'Puffiness', 'Fine Lines'],
    shopUrl: 'https://ulta.com/product/25',
    inStock: true
  },

  // More Moisturizers
  {
    id: 'moist-003',
    name: 'Gel-Cream Moisturizer',
    brand: mockBrands[4], // HydraPlus
    distributor: mockDistributors[3], // Target
    price: 28.00,
    originalPrice: 35.00,
    rating: 4.5,
    reviews: 892,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&h=300&fit=crop',
    category: productCategories[2],
    description: 'Oil-free gel-cream moisturizer for oily and combination skin',
    keyIngredients: ['Niacinamide', 'Hyaluronic Acid', 'Green Tea'],
    skinType: ['Oily', 'Combination', 'Acne-Prone'],
    skinConcerns: ['Oil Control', 'Hydration', 'Pores'],
    shopUrl: 'https://target.com/product/26',
    inStock: true,
    discount: 20
  },
  {
    id: 'moist-004',
    name: 'Rich Barrier Cream',
    brand: mockBrands[4], // HydraPlus
    distributor: mockDistributors[0], // Sephora
    price: 45.00,
    rating: 4.8,
    reviews: 623,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300&h=300&fit=crop',
    category: productCategories[2],
    description: 'Ultra-nourishing cream for barrier repair and protection',
    keyIngredients: ['Ceramides', 'Cholesterol', 'Fatty Acids'],
    skinType: ['Dry', 'Sensitive', 'Mature'],
    skinConcerns: ['Dryness', 'Barrier Damage', 'Sensitivity'],
    shopUrl: 'https://sephora.com/product/27',
    inStock: true,
    isRecommended: true
  },
  {
    id: 'moist-005',
    name: 'SPF 30 Daily Moisturizer',
    brand: mockBrands[2], // SunShield
    distributor: mockDistributors[1], // Ulta
    price: 32.00,
    rating: 4.4,
    reviews: 756,
    image: 'https://images.unsplash.com/photo-1556228578-dd4715a0b5bc?w=300&h=300&fit=crop',
    category: productCategories[2],
    description: 'All-in-one moisturizer with broad spectrum SPF 30',
    keyIngredients: ['Avobenzone', 'Hyaluronic Acid', 'Vitamin E'],
    skinType: ['Normal', 'Combination'],
    skinConcerns: ['Hydration', 'Sun Protection'],
    shopUrl: 'https://ulta.com/product/28',
    inStock: true
  },

  // More Sunscreens
  {
    id: 'sun-003',
    name: 'Invisible Fluid SPF 50+',
    brand: mockBrands[2], // SunShield
    distributor: mockDistributors[0], // Sephora
    price: 36.00,
    rating: 4.9,
    reviews: 1567,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&h=300&fit=crop',
    category: productCategories[3],
    description: 'Ultra-light invisible sunscreen with SPF 50+ PA++++',
    keyIngredients: ['Tinosorb S', 'Uvinul A Plus', 'Niacinamide'],
    skinType: ['All Types', 'Oily'],
    skinConcerns: ['Sun Protection', 'No White Cast'],
    shopUrl: 'https://sephora.com/product/29',
    inStock: true,
    isRecommended: true
  },
  {
    id: 'sun-004',
    name: 'Sport Sunscreen SPF 70',
    brand: mockBrands[2], // SunShield
    distributor: mockDistributors[3], // Target
    price: 28.00,
    rating: 4.6,
    reviews: 943,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop',
    category: productCategories[3],
    description: 'Water-resistant sport sunscreen for active lifestyles',
    keyIngredients: ['Octinoxate', 'Octisalate', 'Vitamin E'],
    skinType: ['All Types', 'Active'],
    skinConcerns: ['Sun Protection', 'Water Resistance'],
    shopUrl: 'https://target.com/product/30',
    inStock: true
  },

  // More Treatments
  {
    id: 'treat-003',
    name: 'Azelaic Acid 10% Suspension',
    brand: mockBrands[0], // SkinGlow Pro
    distributor: mockDistributors[2], // Amazon
    price: 19.99,
    rating: 4.5,
    reviews: 1123,
    image: 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=300&h=300&fit=crop',
    category: productCategories[4],
    description: 'Multi-functional treatment for redness and uneven tone',
    keyIngredients: ['Azelaic Acid', 'Vitamin C', 'Liquorice Root'],
    skinType: ['Sensitive', 'Rosacea', 'Normal'],
    skinConcerns: ['Redness', 'Uneven Tone', 'Texture'],
    shopUrl: 'https://amazon.com/product/31',
    inStock: true
  },
  {
    id: 'treat-004',
    name: 'Acne Spot Treatment',
    brand: mockBrands[0], // SkinGlow Pro
    distributor: mockDistributors[3], // Target
    price: 14.99,
    rating: 4.4,
    reviews: 2156,
    image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=300&h=300&fit=crop',
    category: productCategories[4],
    description: 'Targeted spot treatment with salicylic acid and sulfur',
    keyIngredients: ['Salicylic Acid', 'Sulfur', 'Tea Tree Oil'],
    skinType: ['Oily', 'Acne-Prone'],
    skinConcerns: ['Breakouts', 'Blemishes', 'Pores'],
    shopUrl: 'https://target.com/product/32',
    inStock: true
  },
  {
    id: 'treat-005',
    name: 'Tranexamic Acid 5%',
    brand: mockBrands[1], // Radiance Labs
    distributor: mockDistributors[0], // Sephora
    price: 38.00,
    rating: 4.7,
    reviews: 567,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300&h=300&fit=crop',
    category: productCategories[4],
    description: 'Advanced treatment for stubborn hyperpigmentation',
    keyIngredients: ['Tranexamic Acid', 'Kojic Acid', 'Niacinamide'],
    skinType: ['All Types'],
    skinConcerns: ['Dark Spots', 'Melasma', 'Post-Inflammatory Hyperpigmentation'],
    shopUrl: 'https://sephora.com/product/33',
    inStock: false
  }
];

// Product Bundles - Curated sets by brand
export const productBundles: ProductBundle[] = [
  // SkinGlow Pro Bundles
  {
    id: 'bundle-001',
    name: 'Complete Hydration System',
    brand: mockBrands[0], // SkinGlow Pro
    description: 'A comprehensive 3-step hydration routine for plump, dewy skin',
    products: [
      mockProducts.find(p => p.id === 'serum-001')!, // Hyaluronic Acid Serum
      mockProducts.find(p => p.id === 'moist-001')!, // Daily Hydrating Cream
      mockProducts.find(p => p.id === 'exfo-001')!, // Lactic Acid 10%
    ],
    bundlePrice: 72.99,
    originalPrice: 87.98,
    savings: 14.99,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&h=400&fit=crop',
    category: 'Hydration',
    benefits: [
      'Triple-action hydration boost',
      'Gentle exfoliation for better absorption',
      'Suitable for all skin types',
      'Save $14.99 vs individual purchase'
    ],
    forSkinType: ['Dry', 'Dehydrated', 'All Types'],
    forSkinConcerns: ['Dryness', 'Fine Lines', 'Dehydration'],
    isCustomized: true
  },
  {
    id: 'bundle-002',
    name: 'Acne Control Kit',
    brand: mockBrands[0], // SkinGlow Pro
    description: 'Target breakouts and control oil with this powerful duo',
    products: [
      mockProducts.find(p => p.id === 'treat-002')!, // Niacinamide 10%
      mockProducts.find(p => p.id === 'exfo-003')!, // Salicylic Acid 2%
    ],
    bundlePrice: 24.99,
    originalPrice: 28.98,
    savings: 3.99,
    image: 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=600&h=400&fit=crop',
    category: 'Acne Care',
    benefits: [
      'Reduces breakouts and blemishes',
      'Minimizes pores',
      'Controls excess oil',
      'Dermatologist-recommended ingredients'
    ],
    forSkinType: ['Oily', 'Acne-Prone', 'Combination'],
    forSkinConcerns: ['Breakouts', 'Pores', 'Oil Control'],
    isCustomized: true
  },

  // Radiance Labs Bundles
  {
    id: 'bundle-003',
    name: 'Brightening Power Trio',
    brand: mockBrands[1], // Radiance Labs
    description: 'Fade dark spots and reveal radiant, even-toned skin',
    products: [
      mockProducts.find(p => p.id === 'serum-002')!, // Vitamin C Serum
      mockProducts.find(p => p.id === 'toner-002')!, // Glycolic Acid Toner
      mockProducts.find(p => p.id === 'serum-005')!, // Alpha Arbutin
    ],
    bundlePrice: 89.99,
    originalPrice: 103.99,
    savings: 14.00,
    image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=600&h=400&fit=crop',
    category: 'Brightening',
    benefits: [
      'Triple brightening action',
      'Fades hyperpigmentation',
      'Evens skin tone',
      'Powerful antioxidant protection'
    ],
    forSkinType: ['All Types', 'Dull', 'Uneven'],
    forSkinConcerns: ['Dark Spots', 'Dullness', 'Uneven Tone'],
    isCustomized: true
  },

  // SunShield Bundles
  {
    id: 'bundle-004',
    name: 'Ultimate Sun Protection Set',
    brand: mockBrands[2], // SunShield
    description: 'Complete daily and sport sun protection for all occasions',
    products: [
      mockProducts.find(p => p.id === 'sun-001')!, // SPF 50 Daily
      mockProducts.find(p => p.id === 'sun-003')!, // Invisible Fluid
      mockProducts.find(p => p.id === 'sun-004')!, // Sport Sunscreen
    ],
    bundlePrice: 79.99,
    originalPrice: 88.99,
    savings: 9.00,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&h=400&fit=crop',
    category: 'Sun Protection',
    benefits: [
      'All-day sun protection',
      'Sport & water-resistant option',
      'No white cast formula',
      'Broad spectrum UVA/UVB coverage'
    ],
    forSkinType: ['All Types'],
    forSkinConcerns: ['Sun Protection', 'Prevention'],
    isCustomized: false
  },

  // Youth Renewal Bundles
  {
    id: 'bundle-005',
    name: 'Anti-Aging Essentials',
    brand: mockBrands[3], // Youth Renewal
    description: 'Combat signs of aging with retinol and peptides',
    products: [
      mockProducts.find(p => p.id === 'serum-003')!, // Retinol Serum
      mockProducts.find(p => p.id === 'serum-004')!, // Peptide Complex
      mockProducts.find(p => p.id === 'moist-002')!, // Night Recovery Cream
    ],
    bundlePrice: 165.00,
    originalPrice: 178.00,
    savings: 13.00,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop',
    category: 'Anti-Aging',
    benefits: [
      'Reduces fine lines and wrinkles',
      'Improves skin firmness',
      'Boosts collagen production',
      'Complete day & night system'
    ],
    forSkinType: ['Mature', 'Dry', 'All Types'],
    forSkinConcerns: ['Fine Lines', 'Wrinkles', 'Firmness'],
    isCustomized: true
  },

  // HydraPlus Bundles
  {
    id: 'bundle-006',
    name: 'Moisture Barrier Repair',
    brand: mockBrands[4], // HydraPlus
    description: 'Restore and strengthen your skin\'s moisture barrier',
    products: [
      mockProducts.find(p => p.id === 'clean-002')!, // Hydrating Oil Cleanser
      mockProducts.find(p => p.id === 'moist-004')!, // Rich Barrier Cream
      mockProducts.find(p => p.id === 'mask-002')!, // Hydrating Sheet Masks
    ],
    bundlePrice: 86.99,
    originalPrice: 97.99,
    savings: 11.00,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&h=400&fit=crop',
    category: 'Barrier Repair',
    benefits: [
      'Intensive moisture replenishment',
      'Repairs damaged skin barrier',
      'Soothes sensitive skin',
      'Clinically proven ceramide blend'
    ],
    forSkinType: ['Dry', 'Sensitive', 'Dehydrated'],
    forSkinConcerns: ['Dryness', 'Barrier Damage', 'Sensitivity'],
    isCustomized: true
  },

  // PureCleanse Bundles
  {
    id: 'bundle-007',
    name: 'Gentle Cleansing Routine',
    brand: mockBrands[5], // PureCleanse
    description: 'Perfect for sensitive skin - cleanse without stripping',
    products: [
      mockProducts.find(p => p.id === 'clean-001')!, // Gentle Foam Cleanser
      mockProducts.find(p => p.id === 'toner-003')!, // Centella Toner
      mockProducts.find(p => p.id === 'clean-003')!, // Micellar Water
    ],
    bundlePrice: 54.99,
    originalPrice: 65.98,
    savings: 10.99,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&h=400&fit=crop',
    category: 'Cleansing',
    benefits: [
      'Double cleanse system',
      'Maintains skin pH balance',
      'Calms and soothes',
      'Perfect for sensitive skin'
    ],
    forSkinType: ['Sensitive', 'Dry', 'All Types'],
    forSkinConcerns: ['Sensitivity', 'Redness', 'Irritation'],
    isCustomized: true
  },

  // Mixed Brand Premium Bundle
  {
    id: 'bundle-008',
    name: 'The Complete Routine',
    brand: mockBrands[0], // SkinGlow Pro (featured brand)
    description: 'Our bestselling complete skincare routine from AM to PM',
    products: [
      mockProducts.find(p => p.id === 'clean-001')!, // Cleanser
      mockProducts.find(p => p.id === 'serum-001')!, // HA Serum
      mockProducts.find(p => p.id === 'moist-001')!, // Moisturizer
      mockProducts.find(p => p.id === 'sun-001')!, // Sunscreen
    ],
    bundlePrice: 98.99,
    originalPrice: 114.97,
    savings: 15.98,
    image: 'https://images.unsplash.com/photo-1556228578-dd4715a0b5bc?w=600&h=400&fit=crop',
    category: 'Complete Routine',
    benefits: [
      'Full AM/PM skincare routine',
      'Dermatologist-approved formula',
      'Suitable for beginners',
      'Best value bundle'
    ],
    forSkinType: ['All Types'],
    forSkinConcerns: ['All Concerns'],
    isCustomized: false
  }
];