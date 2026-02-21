import { ScanResult } from '../types';

export const mockScanHistory: ScanResult[] = [
  {
    id: '1',
    date: '2024-12-15T10:30:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1594824532981-0b5b8f78c4da?w=600&h=800&fit=crop',
    overallScore: 78,
    estimatedAge: 28,
    actualAge: 30,
    
    // Health metrics
    hydration: 85,
    moisture: 82,
    oiliness: 45,
    evenness: 72,
    texture: 76,
    clarity: 80,
    firmness: 75,
    elasticity: 78,
    poreSize: 35,
    smoothness: 74,
    radiance: 70,
    
    // Concerns
    acne: 15,
    wrinkles: 22,
    darkCircles: 30,
    darkSpots: 18,
    redness: 20,
    
    skinType: 'combination',
    uvDamage: 25,
    
    recommendations: [
      'Hyaluronic Acid Deep Hydration Serum',
      'Vitamin C Brightening Cream',
      'SPF 50 Broad Spectrum Sunscreen',
      'Niacinamide Pore Refining Serum'
    ],
    aiAnalysis: 'Your skin shows good hydration levels. Focus on UV protection to prevent premature aging.'
  },
  {
    id: '2',
    date: '2024-12-10T09:15:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1594824532981-0b5b8f78c4da?w=600&h=800&fit=crop',
    overallScore: 82,
    estimatedAge: 27,
    actualAge: 30,
    
    // Health metrics
    hydration: 80,
    moisture: 85,
    oiliness: 50,
    evenness: 78,
    texture: 80,
    clarity: 85,
    firmness: 85,
    elasticity: 82,
    poreSize: 30,
    smoothness: 81,
    radiance: 79,
    
    // Concerns
    acne: 12,
    wrinkles: 18,
    darkCircles: 25,
    darkSpots: 15,
    redness: 15,
    
    skinType: 'normal',
    uvDamage: 20,
    
    recommendations: [
      'Retinol Night Treatment',
      'Gentle Cleanser',
      'Peptide Firming Cream'
    ],
    aiAnalysis: 'Excellent improvement in overall skin health. Continue your current routine.'
  },
  {
    id: '3',
    date: '2024-12-05T14:20:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1594824532981-0b5b8f78c4da?w=600&h=800&fit=crop',
    overallScore: 75,
    estimatedAge: 29,
    actualAge: 30,
    
    // Health metrics
    hydration: 78,
    moisture: 75,
    oiliness: 55,
    evenness: 70,
    texture: 72,
    clarity: 76,
    firmness: 70,
    elasticity: 74,
    poreSize: 40,
    smoothness: 71,
    radiance: 68,
    
    // Concerns
    acne: 18,
    wrinkles: 25,
    darkCircles: 35,
    darkSpots: 22,
    redness: 25,
    
    skinType: 'combination',
    uvDamage: 30,
    
    recommendations: [
      'Hydrating Toner',
      'Vitamin E Moisturizer',
      'AHA Exfoliating Serum',
      'Eye Cream for Dark Circles'
    ],
    aiAnalysis: 'Some dehydration detected. Increase water intake and use hydrating products.'
  }
];