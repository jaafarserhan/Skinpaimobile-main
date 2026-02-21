import React, { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { 
  Star, ShoppingBag, ExternalLink, Verified, Globe,
  MapPin, Phone, Mail, Heart, MessageCircle, Users,
  Award, TrendingUp, Package, Sparkles
} from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { toast } from 'sonner@2.0.3';

interface BrandProfileProps {
  brandId: string;
  onBack: () => void;
  onViewProduct: (productId: string) => void;
}

export default function BrandProfile({ brandId, onBack, onViewProduct }: BrandProfileProps) {
  const [isFollowing, setIsFollowing] = useState(false);

  // Mock brand data
  const brand = {
    id: brandId,
    name: 'SkinGlow Naturals',
    logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=200&fit=crop',
    cover: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&h=300&fit=crop',
    verified: true,
    rating: 4.8,
    reviews: 12450,
    description: '🌿 Natural & Organic Skincare Brand\n✨ Cruelty-free & Vegan\n🌍 Sustainable packaging\n💚 Since 2015',
    website: 'https://skinglow.com',
    email: 'hello@skinglow.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    stats: {
      followers: 89600,
      products: 47,
      posts: 234,
      campaigns: 12,
    },
    categories: ['Natural', 'Anti-aging', 'Hydration', 'Brightening'],
    achievements: [
      { icon: '🏆', title: 'Best Natural Brand 2024', year: '2024' },
      { icon: '🌟', title: 'Top Rated', year: '2023' },
      { icon: '💚', title: 'Eco-Friendly Certified', year: '2022' },
    ],
  };

  const products = [
    {
      id: '1',
      name: 'Vitamin C Brightening Serum',
      image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300&h=300&fit=crop',
      price: 45.99,
      rating: 4.9,
      reviews: 1234,
    },
    {
      id: '2',
      name: 'Hyaluronic Acid Moisturizer',
      image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=300&h=300&fit=crop',
      price: 38.99,
      rating: 4.7,
      reviews: 892,
    },
    {
      id: '3',
      name: 'Retinol Night Cream',
      image: 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=300&h=300&fit=crop',
      price: 52.99,
      rating: 4.8,
      reviews: 1456,
    },
    {
      id: '4',
      name: 'Gentle Cleansing Foam',
      image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=300&h=300&fit=crop',
      price: 24.99,
      rating: 4.6,
      reviews: 678,
    },
  ];

  const posts = [
    {
      id: '1',
      image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop',
      likes: 3421,
      comments: 234,
    },
    {
      id: '2',
      image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=400&fit=crop',
      likes: 2876,
      comments: 189,
    },
    {
      id: '3',
      image: 'https://images.unsplash.com/photo-1570554886111-e80fcca6a029?w=400&h=400&fit=crop',
      likes: 4123,
      comments: 312,
    },
  ];

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    toast.success(isFollowing ? `Unfollowed ${brand.name}` : `Following ${brand.name}!`);
  };

  const handleVisitWebsite = () => {
    toast.success('Opening website...');
    window.open(brand.website, '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Cover Image */}
      <div className="relative h-40">
        <ImageWithFallback
          src={brand.cover}
          alt="Cover"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
      </div>

      <div className="px-4 -mt-20 relative z-10 space-y-4">
        {/* Brand Header */}
        <div className="flex items-end justify-between">
          <Avatar className="w-24 h-24 border-4 border-background">
            <AvatarImage src={brand.logo} />
            <AvatarFallback>{brand.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex gap-2 pb-2">
            <Button 
              variant={isFollowing ? 'outline' : 'default'}
              size="sm"
              onClick={handleFollow}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </Button>
            <Button variant="outline" size="sm" onClick={handleVisitWebsite}>
              <Globe className="w-4 h-4 mr-2" />
              Visit
            </Button>
          </div>
        </div>

        {/* Brand Name & Rating */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold">{brand.name}</h1>
            {brand.verified && (
              <Verified className="w-5 h-5 text-blue-500" />
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(brand.rating)
                      ? 'fill-current text-yellow-500'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="font-medium">{brand.rating}</span>
            <span className="text-sm text-muted-foreground">
              ({brand.reviews.toLocaleString()} reviews)
            </span>
          </div>
        </div>

        {/* Description */}
        <div className="whitespace-pre-line text-sm">
          {brand.description}
        </div>

        {/* Contact Info */}
        <Card>
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Globe className="w-4 h-4 text-muted-foreground" />
              <a href={brand.website} className="text-primary hover:underline">
                {brand.website}
              </a>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <span>{brand.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <span>{brand.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span>{brand.location}</span>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <div className="font-bold">{brand.stats.products}</div>
                <div className="text-xs text-muted-foreground">Products</div>
              </div>
              <div>
                <div className="font-bold">{(brand.stats.followers / 1000).toFixed(1)}K</div>
                <div className="text-xs text-muted-foreground">Followers</div>
              </div>
              <div>
                <div className="font-bold">{brand.stats.posts}</div>
                <div className="text-xs text-muted-foreground">Posts</div>
              </div>
              <div>
                <div className="font-bold">{brand.stats.campaigns}</div>
                <div className="text-xs text-muted-foreground">Campaigns</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Categories */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3">Categories</h3>
            <div className="flex flex-wrap gap-2">
              {brand.categories.map((category, index) => (
                <Badge key={index} variant="secondary">
                  {category}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3">Awards & Certifications</h3>
            <div className="space-y-2">
              {brand.achievements.map((achievement, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-secondary/20 rounded-lg">
                  <span className="text-2xl">{achievement.icon}</span>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{achievement.title}</p>
                    <p className="text-xs text-muted-foreground">{achievement.year}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="products" className="w-full pb-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="posts">Posts</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="mt-4 space-y-4">
            {products.map((product) => (
              <Card 
                key={product.id} 
                className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => onViewProduct(product.id)}
              >
                <CardContent className="p-0">
                  <div className="flex gap-4">
                    <ImageWithFallback
                      src={product.image}
                      alt={product.name}
                      className="w-24 h-24 object-cover"
                    />
                    <div className="flex-1 p-3">
                      <h4 className="font-medium mb-1 line-clamp-2">{product.name}</h4>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-current text-yellow-500" />
                          <span className="text-sm">{product.rating}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          ({product.reviews})
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold">${product.price}</span>
                        <Button size="sm" variant="outline">
                          <ShoppingBag className="w-4 h-4 mr-2" />
                          Shop
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="posts" className="mt-4">
            <div className="grid grid-cols-3 gap-1">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="relative aspect-square cursor-pointer group"
                >
                  <ImageWithFallback
                    src={post.image}
                    alt="Post"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white">
                    <div className="flex items-center gap-1">
                      <Heart className="w-5 h-5" />
                      <span className="text-sm">{post.likes.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-5 h-5" />
                      <span className="text-sm">{post.comments}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}