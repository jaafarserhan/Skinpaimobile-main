import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { 
  ShoppingCart, ExternalLink, Heart, Share2, Star, 
  Check, TrendingUp, Sparkles, Shield, Leaf, Droplets,
  X, AlertCircle, Package, Truck, RotateCcw, Clock,
  Award, Users, ThumbsUp, MapPin, Store, Verified,
  Calendar, Info
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Product } from '../types';
import { toast } from 'sonner@2.0.3';
import CommentSystem, { Comment } from './shared/CommentSystem';

interface ProductDetailModalProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ProductDetailModal({ product, open, onOpenChange }: ProductDetailModalProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [productReviews, setProductReviews] = useState<Comment[]>([
    {
      id: '1',
      author: {
        name: 'Sarah M.',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b7a1?w=150&h=150&fit=crop',
        verified: true,
      },
      content: 'Absolutely love this product! My skin has never felt better. Highly recommend!',
      timestamp: '2 weeks ago',
      likes: 24,
      liked: false,
    },
    {
      id: '2',
      author: {
        name: 'Jessica L.',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
        verified: true,
      },
      content: 'Great product, saw results after 2 weeks. Would give 5 stars but the price is a bit high.',
      timestamp: '1 month ago',
      likes: 18,
      liked: false,
      replies: [
        {
          id: '2-1',
          author: {
            name: 'Brand Team',
            avatar: 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=150&h=150&fit=crop',
            verified: true,
            isBrand: true,
          },
          content: 'Thank you for your feedback! We\'re running a sale next week 😊',
          timestamp: '3 weeks ago',
          likes: 5,
          liked: false,
        }
      ]
    },
    {
      id: '3',
      author: {
        name: 'Emily R.',
        avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop',
        verified: true,
      },
      content: 'Perfect for sensitive skin. No irritation and amazing hydration.',
      timestamp: '1 month ago',
      likes: 15,
      liked: false,
    },
  ]);

  if (!product) return null;

  const handleShopNow = () => {
    toast.success('Redirecting to store...');
    window.open(product.shopUrl, '_blank');
  };

  const handleAddToFavorites = () => {
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites');
  };

  const handleShare = () => {
    toast.success('Share link copied to clipboard!');
  };

  const relatedProducts = [
    {
      name: 'Hyaluronic Acid Serum',
      price: 28.99,
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=200&h=200&fit=crop',
    },
    {
      name: 'Gentle Daily Cleanser',
      price: 22.50,
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=200&h=200&fit=crop',
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
        {/* Product Image */}
        <div className="relative">
          <ImageWithFallback
            src={product.image}
            alt={product.name}
            className="w-full h-64 object-cover"
          />
          {product.discount && (
            <div className="absolute top-4 right-4">
              <Badge className="bg-destructive text-white text-lg px-3 py-1">
                -{product.discount}%
              </Badge>
            </div>
          )}
          {product.isRecommended && (
            <div className="absolute top-4 left-4">
              <Badge className="bg-primary text-white">
                <Sparkles className="w-3 h-3 mr-1" />
                AI Recommended
              </Badge>
            </div>
          )}
        </div>

        <div className="p-6 space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-1">{product.name}</h2>
                <div className="flex items-center gap-2 mb-2">
                  <ImageWithFallback
                    src={product.brand.logo}
                    alt={product.brand.name}
                    className="w-6 h-6 object-contain"
                  />
                  <span className="text-sm text-muted-foreground">{product.brand.name}</span>
                  {product.brand.verified && (
                    <Badge variant="secondary" className="text-xs">
                      <Check className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleAddToFavorites}
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current text-red-500' : ''}`} />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleShare}
                >
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating)
                        ? 'fill-current text-yellow-500'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium">{product.rating}</span>
              <span className="text-sm text-muted-foreground">({product.reviews} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-3xl font-bold">${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="text-lg text-muted-foreground line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Stock Status */}
            {product.inStock ? (
              <Badge variant="secondary" className="bg-green-50 text-green-700">
                <Check className="w-3 h-3 mr-1" />
                In Stock
              </Badge>
            ) : (
              <Badge variant="secondary" className="bg-red-50 text-red-700">
                <X className="w-3 h-3 mr-1" />
                Out of Stock
              </Badge>
            )}
          </div>

          <Separator />

          {/* Tabs */}
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
              <TabsTrigger value="howto">How to Use</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4 mt-4">
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-sm text-muted-foreground">{product.description}</p>
              </div>

              {/* Product Category */}
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Package className="w-4 h-4 text-[#00B4D8]" />
                  Category
                </h3>
                <Badge className="text-sm" variant="outline">
                  {product.category.icon} {product.category.name}
                </Badge>
                <p className="text-xs text-muted-foreground mt-1">{product.category.description}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Suitable For</h3>
                <div className="flex flex-wrap gap-2">
                  {product.skinType.map((type, index) => (
                    <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Addresses Skin Concerns</h3>
                <div className="flex flex-wrap gap-2">
                  {product.skinConcerns.map((concern, index) => (
                    <Badge key={index} variant="secondary" className="bg-purple-50 text-purple-700 border-purple-200">
                      {concern}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Product Benefits */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#00B4D8]" />
                  Key Benefits
                </h3>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Clinically tested and dermatologist approved</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Non-comedogenic and hypoallergenic formula</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Visible results in 2-4 weeks with regular use</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">Cruelty-free and vegan friendly</span>
                  </div>
                </div>
              </div>

              {/* Shipping & Delivery */}
              <div className="bg-gradient-to-br from-[#00B4D8]/5 to-[#006D77]/5 p-4 rounded-lg space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#00B4D8]" />
                  Shipping & Delivery
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Free shipping on orders over $50</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Package className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Delivery in 3-5 business days</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <RotateCcw className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">30-day return policy</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Store className="w-4 h-4 text-[#00B4D8]" />
                  Available At
                </h3>
                <div className="flex items-center gap-2 p-3 border rounded-lg">
                  <ImageWithFallback
                    src={product.distributor.logo}
                    alt={product.distributor.name}
                    className="w-8 h-8 object-contain"
                  />
                  <span className="flex-1 font-medium">{product.distributor.name}</span>
                  {product.distributor.isPartner && (
                    <Badge className="bg-[#00B4D8] hover:bg-[#00B4D8]/90 text-xs">
                      <Award className="w-3 h-3 mr-1" />
                      Partner
                    </Badge>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="ingredients" className="space-y-4 mt-4">
              <div>
                <h3 className="font-semibold mb-3">Key Ingredients</h3>
                <div className="space-y-3">
                  {product.keyIngredients.map((ingredient, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 border rounded-lg hover:border-[#00B4D8] transition-colors">
                      <div className="w-8 h-8 rounded-full bg-[#00B4D8]/10 flex items-center justify-center flex-shrink-0">
                        <Leaf className="w-4 h-4 text-[#00B4D8]" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{ingredient}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Beneficial for skin health, nourishment, and cellular repair
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Safety Information */}
              <div className="space-y-3">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm text-green-900 mb-1">Clean Formula</p>
                      <p className="text-xs text-green-700">
                        Free from parabens, sulfates, phthalates, and harmful chemicals
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Droplets className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm text-blue-900 mb-1">pH Balanced</p>
                      <p className="text-xs text-blue-700">
                        Formulated at optimal pH level to maintain skin barrier health
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm text-amber-900 mb-1">Patch Test Recommended</p>
                      <p className="text-xs text-amber-700">
                        Always perform a patch test before first use. Discontinue if irritation occurs.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="howto" className="space-y-4 mt-4">
              {/* Usage Instructions */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Info className="w-4 h-4 text-[#00B4D8]" />
                  How to Use
                </h3>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#00B4D8] text-white flex items-center justify-center font-semibold text-sm">
                      1
                    </div>
                    <div>
                      <p className="font-medium text-sm mb-1">Cleanse</p>
                      <p className="text-xs text-muted-foreground">
                        Start with clean, dry skin. Gently cleanse your face and pat dry.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#00B4D8] text-white flex items-center justify-center font-semibold text-sm">
                      2
                    </div>
                    <div>
                      <p className="font-medium text-sm mb-1">Apply</p>
                      <p className="text-xs text-muted-foreground">
                        Take a small amount and apply evenly to face and neck using gentle upward motions.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#00B4D8] text-white flex items-center justify-center font-semibold text-sm">
                      3
                    </div>
                    <div>
                      <p className="font-medium text-sm mb-1">Massage</p>
                      <p className="text-xs text-muted-foreground">
                        Gently massage the product into skin using circular motions until fully absorbed.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#00B4D8] text-white flex items-center justify-center font-semibold text-sm">
                      4
                    </div>
                    <div>
                      <p className="font-medium text-sm mb-1">Follow Up</p>
                      <p className="text-xs text-muted-foreground">
                        Continue with your regular skincare routine. Use twice daily for best results.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Best Practices */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-100">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <ThumbsUp className="w-4 h-4 text-purple-600" />
                  Best Practices
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 mt-1">•</span>
                    <span>Use consistently for at least 4 weeks to see visible results</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 mt-1">•</span>
                    <span>Store in a cool, dry place away from direct sunlight</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 mt-1">•</span>
                    <span>Always apply sunscreen during the day when using active ingredients</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 mt-1">•</span>
                    <span>Avoid contact with eyes. If contact occurs, rinse thoroughly with water</span>
                  </li>
                </ul>
              </div>

              {/* When to Use */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#00B4D8]" />
                  Recommended Usage
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 border rounded-lg text-center">
                    <div className="text-2xl mb-1">🌅</div>
                    <p className="font-medium text-sm">Morning</p>
                    <p className="text-xs text-muted-foreground mt-1">Before sunscreen</p>
                  </div>
                  <div className="p-3 border rounded-lg text-center">
                    <div className="text-2xl mb-1">🌙</div>
                    <p className="font-medium text-sm">Evening</p>
                    <p className="text-xs text-muted-foreground mt-1">Before moisturizer</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="space-y-4 mt-4">
              {/* Review Summary */}
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-1">{product.rating}</div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < Math.floor(product.rating)
                              ? 'fill-current text-yellow-500'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{product.reviews} reviews</p>
                  </div>
                  <div className="flex-1 space-y-2">
                    {[5, 4, 3, 2, 1].map((star) => (
                      <div key={star} className="flex items-center gap-2">
                        <span className="text-xs w-4">{star}</span>
                        <Star className="w-3 h-3 fill-current text-yellow-500" />
                        <Progress value={star === 5 ? 75 : star === 4 ? 20 : 5} className="h-2" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Individual Reviews */}
              <div className="space-y-4">
                {productReviews.map((review) => (
                  <div key={review.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{review.author.name}</span>
                          {review.author.verified && (
                            <Badge variant="secondary" className="text-xs">
                              <Check className="w-3 h-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < review.rating
                                  ? 'fill-current text-yellow-500'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">{review.timestamp}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{review.content}</p>
                    {review.replies && review.replies.map((reply) => (
                      <div key={reply.id} className="p-3 border-t mt-2">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{reply.author.name}</span>
                          {reply.author.verified && (
                            <Badge variant="secondary" className="text-xs">
                              <Check className="w-3 h-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                          {reply.author.isBrand && (
                            <Badge variant="secondary" className="text-xs">
                              Brand
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{reply.content}</p>
                        <span className="text-xs text-muted-foreground">{reply.timestamp}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Related Products */}
          <div>
            <h3 className="font-semibold mb-3">You Might Also Like</h3>
            <div className="grid grid-cols-2 gap-3">
              {relatedProducts.map((item, index) => (
                <div key={index} className="border rounded-lg p-3 cursor-pointer hover:shadow-md transition-shadow">
                  <ImageWithFallback
                    src={item.image}
                    alt={item.name}
                    className="w-full h-24 object-cover rounded mb-2"
                  />
                  <p className="text-sm font-medium line-clamp-2 mb-1">{item.name}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold">${item.price}</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current text-yellow-500" />
                      <span className="text-xs">{item.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 sticky bottom-0 bg-background pb-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleAddToFavorites}
            >
              <Heart className={`w-4 h-4 mr-2 ${isFavorite ? 'fill-current' : ''}`} />
              {isFavorite ? 'Saved' : 'Save'}
            </Button>
            <Button 
              className="w-full h-12 bg-[#00B4D8] hover:bg-[#00B4D8]/90 text-base"
              onClick={() => window.open(product.shopUrl, '_blank')}
              disabled={!product.inStock}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Browse Source
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}