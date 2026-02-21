import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { ScrollArea } from './ui/scroll-area';
import { Slider } from './ui/slider';
import { 
  Heart, Star, ShoppingCart, ChevronDown, 
  Search, SlidersHorizontal, X, Package, Sparkles, ExternalLink,
  Filter, TrendingUp, ShoppingBag, Tag, Gift, Check, Percent, Verified
} from 'lucide-react';
import { Product, ProductBundle, ScanResult, Brand, Distributor } from '../types';
import ProductDetailModal from './ProductDetailModal';
import BundleDetailModal from './BundleDetailModal';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner@2.0.3';
import { useLocalStorage } from '../hooks/useLocalStorage';
import api, { ProductDto, BrandDto, ProductBundleDto, ProductCategoryDto, DistributorDto } from '../services/api';

interface ProductRecommendationsProps {
  recommendations: string[];
}

interface FilterOptions {
  brands: string[];
  distributors: string[];
  categories: string[];
  priceRange: [number, number];
  inStock: boolean;
  onSale: boolean;
  skinTypes: string[];
  skinConcerns: string[];
  verifiedBrandsOnly: boolean;
}

type SortOption = 'recommended' | 'price-low' | 'price-high' | 'rating' | 'reviews' | 'newest';

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

export default function ProductRecommendations({ recommendations }: ProductRecommendationsProps) {
  const [activeTab, setActiveTab] = useState('all');
  const [favorites, setFavorites] = useLocalStorage<string[]>('skinpai_favorites', []);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [selectedBundle, setSelectedBundle] = useState<ProductBundle | null>(null);
  const [bundleModalOpen, setBundleModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('recommended');
  
  // API products state
  const [apiProducts, setApiProducts] = useState<Product[]>([]);
  const [apiBrands, setApiBrands] = useState<Brand[]>([]);
  const [apiBundles, setApiBundles] = useState<ProductBundle[]>([]);
  const [apiDistributors, setApiDistributors] = useState<Distributor[]>([]);
  const [apiCategories, setApiCategories] = useState<{ id: string; name: string; description: string; icon: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load products from API
  useEffect(() => {
    const loadProducts = async () => {
      try {
        // Load products, brands, bundles, distributors, and categories in parallel
        const [productsRes, brandsRes, bundlesRes, distributorsRes, categoriesRes] = await Promise.all([
          api.getProducts({ pageSize: 100 }),
          api.getBrands(),
          api.getBundles(),
          api.getDistributors(),
          api.getCategories()
        ]);

        if (productsRes.data?.items && productsRes.data.items.length > 0) {
          setApiProducts(productsRes.data.items.map(convertApiProduct));
        }

        if (brandsRes.data && brandsRes.data.length > 0) {
          setApiBrands(brandsRes.data.map(b => ({
            id: b.brandId,
            name: b.brandName,
            logo: b.logoUrl || '',
            description: b.description || '',
            verified: b.isVerified,
            distributors: []
          })));
        }

        if (bundlesRes.data && bundlesRes.data.length > 0) {
          setApiBundles(bundlesRes.data.map(b => ({
            id: b.bundleId,
            name: b.name,
            brand: {
              id: '',
              name: 'SkinPAI',
              logo: '',
              description: '',
              verified: true,
              distributors: []
            },
            description: b.description || '',
            products: b.items?.map(item => convertApiProduct({
              ...item.product,
              productId: item.product?.productId || item.productId,
              productName: item.product?.productName || 'Product',
              price: item.product?.price || 0,
              totalReviews: item.product?.totalReviews || 0,
              inStock: item.product?.inStock ?? true,
              isFeatured: item.product?.isFeatured ?? false,
              isRecommended: item.product?.isRecommended ?? false,
              brand: item.product?.brand || { brandId: '', brandName: '', isVerified: false },
              category: item.product?.category || { categoryId: '', categoryName: '' }
            })) || [],
            bundlePrice: b.discountedPrice,
            originalPrice: b.totalPrice,
            savings: b.totalPrice - b.discountedPrice,
            image: b.imageUrl || '',
            category: 'routine',
            benefits: []
          })));
        }

        if (distributorsRes.data && distributorsRes.data.length > 0) {
          setApiDistributors(distributorsRes.data.map(d => ({
            id: d.distributorId,
            name: d.name,
            website: d.website || '',
            logo: d.logoUrl || '',
            isPartner: d.isPartner
          })));
        }

        if (categoriesRes.data && categoriesRes.data.length > 0) {
          setApiCategories(categoriesRes.data.map(c => ({
            id: c.categoryId,
            name: c.categoryName,
            description: c.description || '',
            icon: c.categoryIcon || 'package'
          })));
        }
      } catch (err) {
        console.error('Failed to load products from API:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadProducts();
  }, []);

  // Use API data directly
  const products = apiProducts;
  const brands = apiBrands;
  const bundles = apiBundles;
  
  const [filters, setFilters] = useState<FilterOptions>({
    brands: [],
    distributors: [],
    categories: [],
    priceRange: [0, 100],
    inStock: false,
    onSale: false,
    skinTypes: [],
    skinConcerns: [],
    verifiedBrandsOnly: false
  });

  // Get all unique values for filter options
  const filterOptions = useMemo(() => ({
    brands: brands.map(b => ({ id: b.id, name: b.name, verified: b.verified })),
    distributors: apiDistributors.map(d => ({ id: d.id, name: d.name, isPartner: d.isPartner })),
    categories: apiCategories,
    skinTypes: [...new Set(products.flatMap(p => p.skinType))],
    skinConcerns: [...new Set(products.flatMap(p => p.skinConcerns))]
  }), [products, brands, apiDistributors, apiCategories]);

  // Filter and search products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          product.name.toLowerCase().includes(query) ||
          product.brand.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.keyIngredients.some(ing => ing.toLowerCase().includes(query)) ||
          product.skinConcerns.some(concern => concern.toLowerCase().includes(query));
        
        if (!matchesSearch) return false;
      }

      // Brand filter
      if (filters.brands.length > 0 && !filters.brands.includes(product.brand.id)) {
        return false;
      }

      // Distributor filter
      if (filters.distributors.length > 0 && !filters.distributors.includes(product.distributor.id)) {
        return false;
      }

      // Category filter
      if (filters.categories.length >0 && !filters.categories.includes(product.category.id)) {
        return false;
      }

      // Price range filter
      if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
        return false;
      }

      // In stock filter
      if (filters.inStock && !product.inStock) {
        return false;
      }

      // On sale filter
      if (filters.onSale && !product.originalPrice) {
        return false;
      }

      // Skin type filter
      if (filters.skinTypes.length > 0 && !filters.skinTypes.some(type => product.skinType.includes(type))) {
        return false;
      }

      // Skin concerns filter
      if (filters.skinConcerns.length > 0 && !filters.skinConcerns.some(concern => product.skinConcerns.includes(concern))) {
        return false;
      }

      // Verified brands only filter
      if (filters.verifiedBrandsOnly && !product.brand.verified) {
        return false;
      }

      return true;
    });
  }, [filters, searchQuery]);

  // Sort products
  const sortedProducts = useMemo(() => {
    const products = [...filteredProducts];
    
    switch (sortBy) {
      case 'price-low':
        return products.sort((a, b) => a.price - b.price);
      case 'price-high':
        return products.sort((a, b) => b.price - a.price);
      case 'rating':
        return products.sort((a, b) => b.rating - a.rating);
      case 'reviews':
        return products.sort((a, b) => b.reviews - a.reviews);
      case 'recommended':
        return products.sort((a, b) => {
          if (a.isRecommended && !b.isRecommended) return -1;
          if (!a.isRecommended && b.isRecommended) return 1;
          return b.rating - a.rating;
        });
      case 'newest':
        return products;
      default:
        return products;
    }
  }, [filteredProducts, sortBy]);

  // Get recommended products
  const recommendedProducts = useMemo(() => {
    return sortedProducts.filter(product => product.isRecommended);
  }, [sortedProducts]);

  // Get customized bundles based on filters
  const filteredBundles = useMemo(() => {
    return productBundles.filter(bundle => {
      if (filters.brands.length > 0 && !filters.brands.includes(bundle.brand.id)) {
        return false;
      }
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return bundle.name.toLowerCase().includes(query) ||
               bundle.description.toLowerCase().includes(query) ||
               bundle.category.toLowerCase().includes(query);
      }
      return true;
    });
  }, [filters.brands, searchQuery]);

  const toggleFavorite = (productId: string) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
    const isFav = favorites.includes(productId);
    toast.success(isFav ? 'Removed from favorites' : 'Added to favorites');
  };

  const openProductUrl = (url: string) => {
    toast.success('Redirecting to store...');
    window.open(url, '_blank');
  };

  const openProductDetail = (product: Product) => {
    setSelectedProduct(product);
    setProductModalOpen(true);
  };

  const openBundleDetail = (bundle: ProductBundle) => {
    setSelectedBundle(bundle);
    setBundleModalOpen(true);
  };

  const updateFilter = (key: keyof FilterOptions, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleArrayFilter = (key: 'brands' | 'distributors' | 'categories' | 'skinTypes' | 'skinConcerns', value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key].includes(value) 
        ? prev[key].filter(item => item !== value)
        : [...prev[key], value]
    }));
  };

  const clearFilters = () => {
    setFilters({
      brands: [],
      distributors: [],
      categories: [],
      priceRange: [0, 100],
      inStock: false,
      onSale: false,
      skinTypes: [],
      skinConcerns: [],
      verifiedBrandsOnly: false
    });
    setSearchQuery('');
  };

  const getActiveFilterCount = () => {
    return (
      filters.brands.length +
      filters.distributors.length +
      filters.categories.length +
      (filters.inStock ? 1 : 0) +
      (filters.onSale ? 1 : 0) +
      filters.skinTypes.length +
      filters.skinConcerns.length +
      (filters.priceRange[0] > 0 || filters.priceRange[1] < 100 ? 1 : 0)
    );
  };

  const renderProductCard = (product: Product) => {
    // Get category color
    const getCategoryColor = (categoryId: string) => {
      const colors: Record<string, string> = {
        'cleanser': 'bg-blue-100 text-blue-700 border-blue-200',
        'serum': 'bg-purple-100 text-purple-700 border-purple-200',
        'moisturizer': 'bg-green-100 text-green-700 border-green-200',
        'sunscreen': 'bg-yellow-100 text-yellow-700 border-yellow-200',
        'treatment': 'bg-pink-100 text-pink-700 border-pink-200',
        'mask': 'bg-indigo-100 text-indigo-700 border-indigo-200',
        'toner': 'bg-teal-100 text-teal-700 border-teal-200',
        'exfoliant': 'bg-orange-100 text-orange-700 border-orange-200',
      };
      return colors[categoryId] || 'bg-gray-100 text-gray-700 border-gray-200';
    };

    return (
      <Card key={product.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full">
        <CardContent className="p-0 flex flex-col h-full">
          {/* Product Image */}
          <div className="relative aspect-square overflow-hidden bg-muted">
            <ImageWithFallback
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover cursor-pointer group-hover:scale-105 transition-transform duration-300"
              onClick={() => openProductDetail(product)}
            />
            
            {/* Badges */}
            <div className="absolute top-2 left-2 right-2 flex justify-between items-start gap-2">
              <div className="flex flex-col gap-1">
                {product.originalPrice && (
                  <Badge className="bg-[#FF6B35] hover:bg-[#FF6B35]/90 shadow-md text-xs">
                    -{product.discount}%
                  </Badge>
                )}
                {product.isRecommended && (
                  <Badge className="bg-[#00B4D8] hover:bg-[#00B4D8]/90 shadow-md text-xs">
                    <Sparkles className="w-3 h-3 mr-1" />
                    For You
                  </Badge>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(product.id);
                }}
                className="h-8 w-8 p-0 bg-white/95 hover:bg-white shadow-md rounded-full"
              >
                <Heart 
                  className={`w-4 h-4 ${
                    favorites.includes(product.id) 
                      ? 'fill-red-500 text-red-500' 
                      : 'text-muted-foreground'
                  }`} 
                />
              </Button>
            </div>

            {!product.inStock && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                <Badge variant="secondary" className="text-sm px-3 py-1">Out of Stock</Badge>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="p-3 flex-1 flex flex-col">
            {/* Category Badge */}
            <Badge className={`mb-2 w-fit text-xs border ${getCategoryColor(product.category.id)}`} variant="outline">
              {product.category.icon} {product.category.name}
            </Badge>

            {/* Brand */}
            <div className="flex items-center gap-1 mb-1">
              <span className="text-xs text-muted-foreground line-clamp-1">{product.brand.name}</span>
              {product.brand.verified && (
                <Verified className="w-3 h-3 text-blue-500 flex-shrink-0" />
              )}
            </div>

            {/* Product Name */}
            <h3 className="font-medium line-clamp-2 cursor-pointer hover:text-[#00B4D8] transition-colors mb-2 min-h-[2.5rem] text-sm" onClick={() => openProductDetail(product)}>
              {product.name}
            </h3>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-medium">{product.rating}</span>
              </div>
              <span className="text-xs text-muted-foreground">
                ({product.reviews})
              </span>
            </div>

            {/* Key Ingredients Preview */}
            <div className="flex flex-wrap gap-1 mb-2">
              {product.keyIngredients.slice(0, 2).map((ingredient, index) => (
                <Badge key={index} variant="outline" className="text-[10px] px-1.5 py-0">
                  {ingredient.length > 10 ? ingredient.substring(0, 10) + '...' : ingredient}
                </Badge>
              ))}
              {product.keyIngredients.length > 2 && (
                <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                  +{product.keyIngredients.length - 2}
                </Badge>
              )}
            </div>

            {/* Price */}
            <div className="flex items-center gap-2 mb-3">
              <span className="font-semibold text-[#006D77]">${product.price}</span>
              {product.originalPrice && (
                <span className="text-xs text-muted-foreground line-through">
                  ${product.originalPrice}
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-auto">
              <Button 
                onClick={() => openProductUrl(product.shopUrl)}
                className="flex-1 bg-[#00B4D8] hover:bg-[#00B4D8]/90 text-xs h-8"
                disabled={!product.inStock}
              >
                {product.inStock ? (
                  <>
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Browse Source
                  </>
                ) : (
                  'Notify'
                )}
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => openProductDetail(product)}
                className="px-2 h-8"
              >
                <ExternalLink className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderBundleCard = (bundle: ProductBundle) => (
    <Card key={bundle.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-[#00B4D8]/30">
      <CardContent className="p-0">
        <div 
          className="relative h-48 overflow-hidden bg-gradient-to-br from-[#00B4D8]/10 to-[#006D77]/10 cursor-pointer"
          onClick={() => openBundleDetail(bundle)}
        >
          <ImageWithFallback
            src={bundle.image}
            alt={bundle.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
            <Badge className="bg-[#FF6B35] hover:bg-[#FF6B35]/90 shadow-lg">
              <Percent className="w-3 h-3 mr-1" />
              Save ${bundle.savings.toFixed(2)}
            </Badge>
            {bundle.isCustomized && (
              <Badge className="bg-[#00B4D8] hover:bg-[#00B4D8]/90 shadow-lg">
                <Sparkles className="w-3 h-3 mr-1" />
                Customized
              </Badge>
            )}
          </div>
        </div>

        <div className="p-4 space-y-3">
          {/* Brand */}
          <div className="flex items-center gap-1">
            <Package className="w-4 h-4 text-[#00B4D8]" />
            <span className="text-sm font-medium text-[#006D77]">{bundle.brand.name}</span>
            {bundle.brand.verified && (
              <Verified className="w-3 h-3 text-blue-500" />
            )}
          </div>

          {/* Bundle Name */}
          <div 
            className="cursor-pointer"
            onClick={() => openBundleDetail(bundle)}
          >
            <h3 className="font-semibold mb-1 hover:text-[#00B4D8] transition-colors">{bundle.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{bundle.description}</p>
          </div>

          {/* Products Count */}
          <div className="flex items-center gap-2 text-sm">
            <Gift className="w-4 h-4 text-[#006D77]" />
            <span className="text-muted-foreground">{bundle.products.length} products included</span>
          </div>

          {/* Benefits */}
          <div className="space-y-1">
            {bundle.benefits.slice(0, 2).map((benefit, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[#00B4D8] flex-shrink-0 mt-0.5" />
                <span className="text-xs text-muted-foreground">{benefit}</span>
              </div>
            ))}
          </div>

          {/* Price */}
          <div className="pt-2 border-t">
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-2xl font-bold text-[#006D77]">${bundle.bundlePrice}</span>
              <span className="text-sm text-muted-foreground line-through">${bundle.originalPrice}</span>
            </div>
            <Button 
              className="w-full bg-[#00B4D8] hover:bg-[#00B4D8]/90"
              onClick={() => openBundleDetail(bundle)}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Learn More
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderFiltersPanel = () => (
    <div className="space-y-4">
      {/* Brands Filter */}
      <div>
        <h4 className="font-medium mb-3 flex items-center gap-2">
          <Verified className="w-4 h-4 text-[#00B4D8]" />
          Brands
        </h4>
        <ScrollArea className="h-40">
          <div className="space-y-2 pr-4">
            {filterOptions.brands.map(brand => (
              <div key={brand.id} className="flex items-center space-x-2">
                <Checkbox
                  checked={filters.brands.includes(brand.id)}
                  onCheckedChange={() => toggleArrayFilter('brands', brand.id)}
                />
                <span className="text-sm flex items-center gap-1">
                  {brand.name}
                  {brand.verified && <Verified className="w-3 h-3 text-blue-500" />}
                </span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Categories Filter */}
      <div>
        <h4 className="font-medium mb-3 flex items-center gap-2">
          <Tag className="w-4 h-4 text-[#00B4D8]" />
          Product Type
        </h4>
        <ScrollArea className="h-40">
          <div className="space-y-2 pr-4">
            {filterOptions.categories.map(category => (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox
                  checked={filters.categories.includes(category.id)}
                  onCheckedChange={() => toggleArrayFilter('categories', category.id)}
                />
                <span className="text-sm">{category.icon} {category.name}</span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Skin Concerns */}
      <div>
        <h4 className="font-medium mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#00B4D8]" />
          Skin Concerns
        </h4>
        <ScrollArea className="h-32">
          <div className="space-y-2 pr-4">
            {filterOptions.skinConcerns.map(concern => (
              <div key={concern} className="flex items-center space-x-2">
                <Checkbox
                  checked={filters.skinConcerns.includes(concern)}
                  onCheckedChange={() => toggleArrayFilter('skinConcerns', concern)}
                />
                <span className="text-sm">{concern}</span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="font-medium mb-3">Price Range</h4>
        <div className="space-y-2">
          <Slider
            value={filters.priceRange}
            onValueChange={(value) => updateFilter('priceRange', value)}
            max={100}
            step={5}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>${filters.priceRange[0]}</span>
            <span>${filters.priceRange[1]}+</span>
          </div>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="space-y-3">
        <label className="text-sm font-medium">Quick Filters</label>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="verified"
            checked={filters.verifiedBrandsOnly}
            onCheckedChange={(checked) => 
              setFilters(prev => ({ ...prev, verifiedBrandsOnly: checked as boolean }))
            }
          />
          <label
            htmlFor="verified"
            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Verified Brands Only
          </label>
        </div>
      </div>

      {/* Clear Filters */}
      {getActiveFilterCount() > 0 && (
        <Button 
          variant="outline" 
          onClick={clearFilters} 
          className="w-full border-[#FF6B35] text-[#FF6B35] hover:bg-[#FF6B35] hover:text-white"
        >
          <X className="w-4 h-4 mr-2" />
          Clear All Filters
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      {/* Header */}
      <Card className="border-[#00B4D8]/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#00B4D8]" />
            Skincare Shop
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {sortedProducts.length} products • {filteredBundles.length} bundles from verified brands
          </p>
        </CardHeader>
      </Card>

      {/* Recommendation Tags */}
      {recommendations.length > 0 && (
        <Card className="bg-gradient-to-r from-[#00B4D8]/10 to-[#006D77]/10 border-[#00B4D8]/20">
          <CardContent className="p-4">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#00B4D8]" />
              Recommended for your skin:
            </h4>
            <div className="flex flex-wrap gap-2">
              {recommendations.map((rec, index) => (
                <Badge key={index} className="bg-[#00B4D8] hover:bg-[#00B4D8]/90">
                  {rec}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search and Controls */}
      <div className="space-y-3">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search products, brands, or ingredients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10 h-12"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
              onClick={() => setSearchQuery('')}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Controls Row */}
        <div className="flex flex-wrap gap-2">
          {/* Filter Sheet */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="flex-1 sm:flex-initial">
                <Filter className="w-4 h-4 mr-2" />
                Filters
                {getActiveFilterCount() > 0 && (
                  <Badge className="ml-2 bg-[#FF6B35]">{getActiveFilterCount()}</Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px]">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5 text-[#00B4D8]" />
                  Filters
                </SheetTitle>
                <SheetDescription className="text-sm text-muted-foreground">
                  Adjust your filters to find the perfect products for your skin.
                </SheetDescription>
              </SheetHeader>
              <ScrollArea className="h-[calc(100vh-120px)] mt-6">
                {renderFiltersPanel()}
              </ScrollArea>
            </SheetContent>
          </Sheet>

          {/* Sort Select */}
          <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
            <SelectTrigger className="flex-1 sm:w-[200px]">
              <TrendingUp className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recommended">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Recommended
                </div>
              </SelectItem>
              <SelectItem value="rating">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  Highest Rated
                </div>
              </SelectItem>
              <SelectItem value="reviews">Most Popular</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Active Filters Pills */}
        {getActiveFilterCount() > 0 && (
          <div className="flex flex-wrap gap-2">
            {filters.brands.map(brandId => {
              const brand = filterOptions.brands.find(b => b.id === brandId);
              return brand ? (
                <Badge key={brandId} variant="secondary" className="gap-1">
                  {brand.name}
                  <X 
                    className="w-3 h-3 cursor-pointer" 
                    onClick={() => toggleArrayFilter('brands', brandId)}
                  />
                </Badge>
              ) : null;
            })}
            {filters.categories.map(catId => {
              const cat = filterOptions.categories.find(c => c.id === catId);
              return cat ? (
                <Badge key={catId} variant="secondary" className="gap-1">
                  {cat.icon} {cat.name}
                  <X 
                    className="w-3 h-3 cursor-pointer" 
                    onClick={() => toggleArrayFilter('categories', catId)}
                  />
                </Badge>
              ) : null;
            })}
            {filters.skinConcerns.map(concern => (
              <Badge key={concern} variant="secondary" className="gap-1">
                {concern}
                <X 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={() => toggleArrayFilter('skinConcerns', concern)}
                />
              </Badge>
            ))}
            {filters.inStock && (
              <Badge variant="secondary" className="gap-1">
                In Stock
                <X 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={() => updateFilter('inStock', false)}
                />
              </Badge>
            )}
            {filters.onSale && (
              <Badge variant="secondary" className="gap-1">
                On Sale
                <X 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={() => updateFilter('onSale', false)}
                />
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-muted p-1 h-auto gap-1">
          <TabsTrigger 
            value="all"
            className="data-[state=active]:bg-[#006D77] data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
          >
            <ShoppingBag className="w-3 h-3 mr-1" />
            All ({sortedProducts.length})
          </TabsTrigger>
          <TabsTrigger 
            value="recommended"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#00B4D8] data-[state=active]:to-[#006D77] data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
          >
            <Sparkles className="w-3 h-3 mr-1" />
            For You ({recommendedProducts.length})
          </TabsTrigger>
          <TabsTrigger 
            value="bundles"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#FF6B35] data-[state=active]:to-[#FF8C5A] data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
          >
            <Package className="w-3 h-3 mr-1" />
            Bundles ({filteredBundles.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          {sortedProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {sortedProducts.map(renderProductCard)}
            </div>
          ) : (
            <div className="text-center py-16 text-muted-foreground">
              <ShoppingBag className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <h3 className="text-lg font-medium mb-2">No products found</h3>
              <p className="text-sm mb-4">Try adjusting your filters or search terms</p>
              <Button onClick={clearFilters} variant="outline">
                Clear Filters
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="recommended" className="mt-6">
          {recommendedProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {recommendedProducts.map(renderProductCard)}
            </div>
          ) : (
            <div className="text-center py-16 text-muted-foreground">
              <Sparkles className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <h3 className="text-lg font-medium mb-2">No recommendations match your filters</h3>
              <p className="text-sm mb-4">Try adjusting your filters or browse all products</p>
              <Button onClick={clearFilters} variant="outline">
                Clear Filters
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="bundles" className="mt-6">
          {filteredBundles.length > 0 ? (
            <>
              <div className="mb-4 p-4 bg-gradient-to-r from-[#00B4D8]/10 to-[#006D77]/10 rounded-lg border border-[#00B4D8]/20">
                <h3 className="font-semibold flex items-center gap-2 mb-1">
                  <Gift className="w-5 h-5 text-[#00B4D8]" />
                  Customized Bundles by Brand
                </h3>
                <p className="text-sm text-muted-foreground">Save up to 20% on curated skincare sets</p>
              </div>
              <div className="space-y-4">
                {filteredBundles.map(renderBundleCard)}
              </div>
            </>
          ) : (
            <div className="text-center py-16 text-muted-foreground">
              <Package className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <h3 className="text-lg font-medium mb-2">No bundles found</h3>
              <p className="text-sm mb-4">Try adjusting your filters or search terms</p>
              <Button onClick={clearFilters} variant="outline">
                Clear Filters
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Shopping Footer */}
      <Card className="border-[#00B4D8]/20 bg-gradient-to-r from-[#00B4D8]/5 to-[#006D77]/5">
        <CardContent className="p-6 text-center">
          <h4 className="font-medium mb-2">Need personalized advice?</h4>
          <p className="text-sm text-muted-foreground mb-4">
            Connect with certified dermatologists for custom recommendations
          </p>
          <Button 
            variant="outline" 
            onClick={() => toast.success('Coming soon!')}
            className="border-[#00B4D8] text-[#00B4D8] hover:bg-[#00B4D8] hover:text-white"
          >
            Book Consultation
          </Button>
        </CardContent>
      </Card>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        open={productModalOpen}
        onOpenChange={setProductModalOpen}
      />

      {/* Bundle Detail Modal */}
      <BundleDetailModal
        bundle={selectedBundle}
        open={bundleModalOpen}
        onOpenChange={setBundleModalOpen}
      />
    </div>
  );
}