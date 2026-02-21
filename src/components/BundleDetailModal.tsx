import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import {
  Star,
  ShoppingBag,
  Heart,
  ExternalLink,
  Check,
  Verified,
  Package,
  Gift,
  Percent,
  Sparkles,
  ChevronRight,
  Info,
  Users,
  TrendingUp,
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ProductBundle } from '../types';
import { toast } from 'sonner@2.0.3';

interface BundleDetailModalProps {
  bundle: ProductBundle | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function BundleDetailModal({
  bundle,
  open,
  onOpenChange,
}: BundleDetailModalProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isFavorite, setIsFavorite] = useState(false);

  if (!bundle) return null;

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites');
  };

  const handleAddToCart = () => {
    toast.success(`${bundle.name} added to cart!`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 gap-0 flex flex-col">
        <ScrollArea className="flex-1 overflow-y-auto">
          {/* Hero Image */}
          <div className="relative h-64 sm:h-80 bg-gradient-to-br from-[#00B4D8]/10 to-[#006D77]/10">
            <ImageWithFallback
              src={bundle.image}
              alt={bundle.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
              <div className="flex flex-col gap-2">
                <Badge className="bg-[#FF6B35] hover:bg-[#FF6B35]/90 shadow-lg w-fit">
                  <Percent className="w-4 h-4 mr-1" />
                  Save ${bundle.savings.toFixed(2)} ({Math.round((bundle.savings / bundle.originalPrice) * 100)}% OFF)
                </Badge>
                {bundle.isCustomized && (
                  <Badge className="bg-[#00B4D8] hover:bg-[#00B4D8]/90 shadow-lg w-fit">
                    <Sparkles className="w-4 h-4 mr-1" />
                    Customized for You
                  </Badge>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleFavorite}
                className="h-10 w-10 p-0 bg-white/95 hover:bg-white shadow-lg rounded-full"
              >
                <Heart
                  className={`w-5 h-5 ${
                    isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground'
                  }`}
                />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Package className="w-5 h-5 text-[#00B4D8]" />
                <span className="font-medium text-[#006D77]">{bundle.brand.name}</span>
                {bundle.brand.verified && (
                  <Verified className="w-4 h-4 text-blue-500" />
                )}
                <Badge variant="outline" className="ml-auto">
                  {bundle.category}
                </Badge>
              </div>
              
              <DialogHeader>
                <DialogTitle className="text-2xl">{bundle.name}</DialogTitle>
              </DialogHeader>
              
              <p className="text-muted-foreground mt-2">{bundle.description}</p>
            </div>

            {/* Price Section */}
            <div className="bg-gradient-to-r from-[#00B4D8]/5 to-[#006D77]/5 p-4 rounded-lg border border-[#00B4D8]/20">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-3xl font-bold text-[#006D77]">
                  ${bundle.bundlePrice.toFixed(2)}
                </span>
                <span className="text-lg text-muted-foreground line-through">
                  ${bundle.originalPrice.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#FF6B35] font-medium">
                <TrendingUp className="w-4 h-4" />
                You save ${bundle.savings.toFixed(2)} with this bundle
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-muted rounded-lg">
                <Gift className="w-5 h-5 mx-auto mb-1 text-[#00B4D8]" />
                <p className="text-lg font-bold">{bundle.products.length}</p>
                <p className="text-xs text-muted-foreground">Products</p>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <Star className="w-5 h-5 mx-auto mb-1 text-yellow-500" />
                <p className="text-lg font-bold">4.8</p>
                <p className="text-xs text-muted-foreground">Rating</p>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <Users className="w-5 h-5 mx-auto mb-1 text-[#006D77]" />
                <p className="text-lg font-bold">2.4k</p>
                <p className="text-xs text-muted-foreground">Sold</p>
              </div>
            </div>

            <Separator />

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-muted">
                <TabsTrigger value="overview" className="text-xs sm:text-sm">
                  <Info className="w-3 h-3 mr-1" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="products" className="text-xs sm:text-sm">
                  <Package className="w-3 h-3 mr-1" />
                  Products ({bundle.products.length})
                </TabsTrigger>
                <TabsTrigger value="reviews" className="text-xs sm:text-sm">
                  <Star className="w-3 h-3 mr-1" />
                  Reviews
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6 mt-6">
                {/* Benefits */}
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#00B4D8]" />
                    Bundle Benefits
                  </h3>
                  <div className="space-y-2">
                    {(bundle.benefits || []).map((benefit, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                        <Check className="w-5 h-5 text-[#00B4D8] flex-shrink-0 mt-0.5" />
                        <p className="text-sm">{benefit}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Target Skin Types */}
                <div>
                  <h3 className="font-semibold mb-3">Perfect For</h3>
                  <div className="flex flex-wrap gap-2">
                    {(bundle.forSkinType || []).map((type, idx) => (
                      <Badge key={idx} variant="outline" className="border-[#00B4D8] text-[#006D77]">
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* How to Use */}
                <div>
                  <h3 className="font-semibold mb-3">How to Use This Bundle</h3>
                  <div className="bg-gradient-to-r from-[#00B4D8]/5 to-[#006D77]/5 p-4 rounded-lg border border-[#00B4D8]/20">
                    <ol className="space-y-2">
                      <li className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#00B4D8] text-white flex items-center justify-center text-xs font-bold">1</span>
                        <div>
                          <p className="font-medium">Morning Routine</p>
                          <p className="text-sm text-muted-foreground">Start with the cleanser, apply serum, and finish with moisturizer and SPF</p>
                        </div>
                      </li>
                      <li className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#00B4D8] text-white flex items-center justify-center text-xs font-bold">2</span>
                        <div>
                          <p className="font-medium">Evening Routine</p>
                          <p className="text-sm text-muted-foreground">Double cleanse, apply treatment products, and seal with night cream</p>
                        </div>
                      </li>
                      <li className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#00B4D8] text-white flex items-center justify-center text-xs font-bold">3</span>
                        <div>
                          <p className="font-medium">Weekly Care</p>
                          <p className="text-sm text-muted-foreground">Use masks 2-3 times per week for enhanced results</p>
                        </div>
                      </li>
                    </ol>
                  </div>
                </div>

                {/* Expected Results */}
                <div>
                  <h3 className="font-semibold mb-3">Expected Results</h3>
                  <div className="grid gap-3">
                    <div className="flex items-start gap-3 p-3 border rounded-lg">
                      <ChevronRight className="w-5 h-5 text-[#00B4D8] flex-shrink-0" />
                      <div>
                        <p className="font-medium text-sm">Week 1-2</p>
                        <p className="text-xs text-muted-foreground">Improved hydration and skin texture</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 border rounded-lg">
                      <ChevronRight className="w-5 h-5 text-[#00B4D8] flex-shrink-0" />
                      <div>
                        <p className="font-medium text-sm">Week 3-4</p>
                        <p className="text-xs text-muted-foreground">Visible reduction in targeted concerns</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 border rounded-lg">
                      <ChevronRight className="w-5 h-5 text-[#00B4D8] flex-shrink-0" />
                      <div>
                        <p className="font-medium text-sm">Week 5+</p>
                        <p className="text-xs text-muted-foreground">Long-term skin health improvement and glow</p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Products Tab */}
              <TabsContent value="products" className="space-y-4 mt-6">
                <div className="bg-gradient-to-r from-[#00B4D8]/5 to-[#006D77]/5 p-3 rounded-lg border border-[#00B4D8]/20">
                  <p className="text-sm">
                    <span className="font-semibold">{bundle.products.length} carefully selected products</span> work together to deliver complete skincare results
                  </p>
                </div>
                
                {bundle.products.map((product, idx) => (
                  <div key={idx} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex gap-4">
                      <div className="w-20 h-20 flex-shrink-0 bg-muted rounded-lg overflow-hidden">
                        <ImageWithFallback
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="font-medium text-sm line-clamp-2">{product.name}</h4>
                          <Badge variant="outline" className="flex-shrink-0 text-xs">
                            {product.category}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{product.size}</p>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs font-medium">{product.rating}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            ${product.price.toFixed(2)} value
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Key Ingredients */}
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-xs text-muted-foreground mb-2">Key Ingredients:</p>
                      <div className="flex flex-wrap gap-1">
                        {product.keyIngredients.map((ingredient, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {ingredient}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Total Value */}
                <div className="bg-gradient-to-r from-[#FF6B35]/10 to-[#FF6B35]/5 p-4 rounded-lg border border-[#FF6B35]/20">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Individual Value</p>
                      <p className="text-xs text-muted-foreground mt-1">Bundle Price</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold line-through text-muted-foreground">
                        ${bundle.originalPrice.toFixed(2)}
                      </p>
                      <p className="text-2xl font-bold text-[#006D77]">
                        ${bundle.bundlePrice.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#FF6B35]">Your Savings</span>
                    <span className="font-bold text-[#FF6B35] text-lg">
                      ${bundle.savings.toFixed(2)}
                    </span>
                  </div>
                </div>
              </TabsContent>

              {/* Reviews Tab */}
              <TabsContent value="reviews" className="space-y-4 mt-6">
                {/* Rating Summary */}
                <div className="bg-gradient-to-r from-[#00B4D8]/5 to-[#006D77]/5 p-4 rounded-lg border border-[#00B4D8]/20">
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-[#006D77]">4.8</div>
                      <div className="flex items-center gap-1 justify-center my-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className="w-4 h-4 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">Based on 287 reviews</p>
                    </div>
                    <div className="flex-1 space-y-1">
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <div key={rating} className="flex items-center gap-2">
                          <span className="text-xs w-3">{rating}</span>
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#00B4D8]"
                              style={{
                                width: `${rating === 5 ? 78 : rating === 4 ? 15 : rating === 3 ? 5 : rating === 2 ? 1 : 1}%`,
                              }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground w-8">
                            {rating === 5 ? 78 : rating === 4 ? 15 : rating === 3 ? 5 : rating === 2 ? 1 : 1}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sample Reviews */}
                <div className="space-y-4">
                  {[
                    {
                      name: 'Sarah M.',
                      rating: 5,
                      date: '2 weeks ago',
                      verified: true,
                      review: 'This bundle completely transformed my skin! The products work so well together and I love having a complete routine. Great value for money!',
                      helpful: 24,
                    },
                    {
                      name: 'Jessica L.',
                      rating: 5,
                      date: '1 month ago',
                      verified: true,
                      review: 'Best skincare investment I\'ve made. My skin has never looked better. The step-by-step guide was super helpful.',
                      helpful: 18,
                    },
                    {
                      name: 'Emily R.',
                      rating: 4,
                      date: '3 weeks ago',
                      verified: true,
                      review: 'Really good bundle! Saw results within 2 weeks. Only wish the moisturizer was a bit larger.',
                      helpful: 12,
                    },
                  ].map((review, idx) => (
                    <div key={idx} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">{review.name}</span>
                            {review.verified && (
                              <Badge variant="outline" className="text-xs border-green-500 text-green-700">
                                <Check className="w-3 h-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-3 h-3 ${
                                    star <= review.rating
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-muted-foreground'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-muted-foreground">{review.date}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm mb-3">{review.review}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Button variant="ghost" size="sm" className="h-7 px-2">
                          Helpful ({review.helpful})
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>

        {/* Sticky Footer */}
        <div className="sticky bottom-0 bg-background border-t p-4">
          <div className="flex gap-3">
            <Button
              onClick={() => {
                toast.success('Redirecting to bundle page...');
                window.open('https://example.com/bundles/' + bundle.id, '_blank');
              }}
              className="flex-1 bg-[#00B4D8] hover:bg-[#00B4D8]/90 h-12"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Learn More
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}