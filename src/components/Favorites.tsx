import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Product } from '../types';
import { Heart, ShoppingCart, ExternalLink, Trash2, ArrowLeft, Loader2 } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner@2.0.3';
import api, { ProductDto } from '../services/api';

interface FavoritesProps {
  onNavigate: (screen: string) => void;
  onViewProduct?: (product: Product) => void;
}

// Convert API ProductDto to local Product type
const convertApiProduct = (dto: ProductDto): Product => ({
  id: dto.productId,
  name: dto.productName,
  brand: {
    id: dto.brand?.brandId || '',
    name: dto.brand?.brandName || 'Unknown',
    logo: dto.brand?.logoUrl || '',
    description: dto.brand?.description || '',
    verified: dto.brand?.isVerified || false,
    distributors: []
  },
  distributor: {
    id: dto.distributor?.distributorId || '',
    name: dto.distributor?.name || 'Unknown',
    website: dto.distributor?.websiteUrl || '',
    logo: dto.distributor?.logoUrl || '',
    isPartner: dto.distributor?.isPartner || false
  },
  price: dto.price,
  originalPrice: dto.originalPrice,
  rating: dto.averageRating || 0,
  reviews: dto.totalReviews,
  image: dto.productImageUrl || '',
  category: {
    id: dto.category?.categoryId || '',
    name: dto.category?.categoryName || 'General',
    description: dto.category?.description || '',
    icon: dto.category?.iconName || 'package'
  },
  description: dto.description || '',
  keyIngredients: dto.keyIngredients || [],
  skinType: dto.skinTypes || [],
  skinConcerns: dto.skinConcerns || [],
  shopUrl: dto.shopUrl || '',
  inStock: dto.inStock,
  isRecommended: dto.isRecommended,
  discount: dto.discountPercent
});

export default function Favorites({ onNavigate, onViewProduct }: FavoritesProps) {
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await api.getFavorites();
      if (data && !error) {
        setFavoriteProducts(data.map(convertApiProduct));
      }
    } catch (err) {
      console.error('Failed to load favorites:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const removeFavorite = async (productId: string) => {
    try {
      const { error } = await api.removeFavorite(productId);
      if (!error) {
        setFavoriteProducts(prev => prev.filter(p => p.id !== productId));
        toast.success('Removed from favorites');
      } else {
        toast.error('Failed to remove from favorites');
      }
    } catch (err) {
      toast.error('Failed to remove from favorites');
    }
  };

  const handleShopNow = (url: string) => {
    toast.success('Redirecting to store...');
    window.open(url, '_blank');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onNavigate('settings')}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold">Saved Items</h1>
          <p className="text-sm text-muted-foreground">
            {favoriteProducts.length} {favoriteProducts.length === 1 ? 'product' : 'products'} saved
          </p>
        </div>
      </div>

      {/* Favorites List */}
      {favoriteProducts.length > 0 ? (
        <div className="space-y-4">
          {favoriteProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  {/* Product Image */}
                  <div 
                    className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden cursor-pointer"
                    onClick={() => onViewProduct?.(product)}
                  >
                    <ImageWithFallback
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <div 
                      className="cursor-pointer"
                      onClick={() => onViewProduct?.(product)}
                    >
                      <h3 className="font-semibold truncate mb-1">{product.name}</h3>
                      <div className="flex items-center gap-2 mb-2">
                        <ImageWithFallback
                          src={product.brand.logo}
                          alt={product.brand.name}
                          className="w-4 h-4 object-contain"
                        />
                        <span className="text-sm text-muted-foreground">{product.brand.name}</span>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg font-bold text-primary">{product.price.toLocaleString()} IQD</span>
                        <div className="flex items-center gap-1 text-sm">
                          <span className="text-yellow-500">★</span>
                          <span>{product.rating}</span>
                          <span className="text-muted-foreground">({product.reviews})</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {product.skinConcerns.slice(0, 2).map((concern, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {concern}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-3">
                      <Button
                        size="sm"
                        className="flex-1 bg-[#00B4D8] hover:bg-[#00B4D8]/90"
                        onClick={() => handleShopNow(product.shopUrl)}
                        disabled={!product.inStock}
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        {product.inStock ? 'Shop Now' : 'Out of Stock'}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeFavorite(product.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No Saved Items</h3>
            <p className="text-muted-foreground mb-6">
              Start saving products you love by tapping the heart icon
            </p>
            <Button onClick={() => onNavigate('products')}>
              Browse Products
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}