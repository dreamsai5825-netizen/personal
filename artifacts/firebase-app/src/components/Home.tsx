import React from 'react';
import {
  Utensils,
  ShoppingBag,
  Wrench,
  Bike,
  ArrowRight,
  Star,
  Clock,
  ShieldCheck,
  TrendingUp,
  ChevronRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { usePlatformContent } from '../platformContent';

const services = [
  {
    id: 'food',
    title: 'Food Delivery',
    description: 'Order from your favorite restaurants',
    icon: Utensils,
    color: 'bg-orange-500',
    path: '/food',
  },
  {
    id: 'grocery',
    title: 'Grocery',
    description: 'Fresh groceries delivered in minutes',
    icon: ShoppingBag,
    color: 'bg-green-500',
    path: '/grocery',
  },
  {
    id: 'services',
    title: 'Home Services',
    description: 'Plumbers, Electricians & more',
    icon: Wrench,
    color: 'bg-blue-500',
    path: '/services',
  },
  {
    id: 'rides',
    title: 'Rides',
    description: 'Bike & Auto taxi at your doorstep',
    icon: Bike,
    color: 'bg-yellow-500',
    path: '/rides',
  },
];

export const Home: React.FC = () => {
  const { content } = usePlatformContent();
  const heroMode = content.advertisement.enabled ? content.advertisement : null;
  const heroTitle = heroMode ? heroMode.title : `${content.hero.headline} ${content.hero.highlight}`.trim();
  const heroSubtitle = heroMode ? heroMode.subtitle : content.hero.subheadline;
  const heroImage = heroMode?.imageUrl || content.hero.imageUrl;
  const primaryCtaLabel = heroMode?.primaryCtaLabel || content.hero.primaryCtaLabel;
  const primaryCtaPath = heroMode?.primaryCtaPath || content.hero.primaryCtaPath;
  const secondaryCtaLabel = heroMode?.secondaryCtaLabel || content.hero.secondaryCtaLabel;
  const secondaryCtaPath = heroMode?.secondaryCtaPath || content.hero.secondaryCtaPath;
  const trustText = heroMode ? `${heroMode.vendorName || 'Approved Promotion'} | ${heroMode.slotLabel}` : content.hero.trustText;
  const featuredTitle = heroMode ? heroMode.vendorName || content.branding.appName : content.hero.featuredTitle;
  const featuredSubtitle = heroMode ? heroMode.slotLabel : content.hero.featuredSubtitle;

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="relative bg-white pt-12 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              {heroMode && (
                <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 border border-orange-100 text-orange-600 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] mb-6">
                  <span>{heroMode.badge}</span>
                  <span className="h-1 w-1 rounded-full bg-orange-400" />
                  <span>{heroMode.status}</span>
                </div>
              )}
              {heroMode ? (
                <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 leading-[1.05] tracking-tight mb-6">
                  {heroTitle}
                </h1>
              ) : (
                <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 leading-[1.1] tracking-tight mb-6">
                  {content.hero.headline} <br />
                  <span className="text-orange-500">{content.hero.highlight}</span>
                </h1>
              )}
              <p className="text-lg text-gray-600 mb-8 max-w-lg leading-relaxed">
                {heroSubtitle}
              </p>

              <div className="flex flex-wrap gap-4">
                <Link to={primaryCtaPath} className="bg-orange-500 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-orange-600 transition-all shadow-xl shadow-orange-200 flex items-center gap-2">
                  {primaryCtaLabel} <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to={secondaryCtaPath} className="bg-white text-gray-900 border-2 border-gray-100 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all flex items-center gap-2">
                  {secondaryCtaLabel}
                </Link>
              </div>

              <div className="mt-12 flex items-center gap-8">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((value) => (
                    <div key={value} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?u=${heroMode ? `ad-${value}` : value}`} alt="" referrerPolicy="no-referrer" />
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1 text-orange-500">
                    {[1, 2, 3, 4, 5].map((value) => <Star key={value} className="w-4 h-4 fill-current" />)}
                  </div>
                  <p className="text-sm font-medium text-gray-600">{trustText}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-[3rem] overflow-hidden shadow-2xl aspect-square">
                <img
                  src={heroImage}
                  alt={featuredTitle}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-10 left-10 right-10 text-white">
                  <div className="bg-white/20 backdrop-blur-md p-6 rounded-3xl border border-white/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium uppercase tracking-wider">
                        {heroMode ? 'Live Advertisement' : 'Latest Order'}
                      </span>
                      <span className="bg-green-500 text-white text-[10px] px-2 py-1 rounded-full font-bold">
                        {heroMode ? 'PUBLISHED' : 'ON THE WAY'}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                        <Utensils className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-bold text-lg">{featuredTitle}</p>
                        <p className="text-sm text-white/80">{featuredSubtitle}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -top-6 -right-6 bg-white p-4 rounded-2xl shadow-xl border border-gray-50 flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">{content.hero.averageDeliveryText}</p>
                  <p className="font-bold text-sm">{content.hero.averageDeliveryValue}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Our Services</h2>
            <p className="text-gray-500">Everything you need in one place</p>
          </div>
          <Link to="/services" className="text-orange-500 font-semibold flex items-center gap-1 hover:gap-2 transition-all">
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Link
                to={service.path}
                className="group block bg-white rounded-[2.5rem] p-6 border border-gray-100 hover:border-orange-200 transition-all hover:shadow-2xl hover:shadow-orange-100"
              >
                <div className={cn('w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-6 transition-transform group-hover:scale-110', service.color)}>
                  <service.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                  {service.description}
                </p>
                <div className="flex items-center text-orange-500 font-bold text-sm">
                  Explore <ArrowRight className="w-4 h-4 ml-2 group-hover:ml-3 transition-all" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{content.testimonials.sectionTitle}</h2>
          <p className="text-gray-500">{content.testimonials.sectionSubtitle}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {content.testimonials.items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="bg-white rounded-[2rem] border border-gray-100 p-6 shadow-sm"
            >
              <div className="flex items-center gap-4 mb-5">
                <img src={item.avatarUrl} alt={item.name} className="w-14 h-14 rounded-2xl object-cover" referrerPolicy="no-referrer" />
                <div>
                  <p className="font-bold text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-500">{item.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-orange-500 mb-4">
                {Array.from({ length: 5 }, (_, starIndex) => (
                  <Star key={`${item.id}-${starIndex}`} className={cn('w-4 h-4', starIndex < item.rating ? 'fill-current' : 'text-gray-200')} />
                ))}
              </div>
              <p className="text-gray-600 leading-relaxed">{item.quote}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-gray-900 py-24 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="flex gap-6">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex-shrink-0 flex items-center justify-center text-orange-500">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-3">Safe & Secure</h3>
                <p className="text-gray-400 leading-relaxed">
                  Verified partners and secure payments for every transaction.
                </p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex-shrink-0 flex items-center justify-center text-orange-500">
                <Clock className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-3">Real-time Tracking</h3>
                <p className="text-gray-400 leading-relaxed">
                  Track your orders and rides live on the map with precision.
                </p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex-shrink-0 flex items-center justify-center text-orange-500">
                <TrendingUp className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-3">Best Prices</h3>
                <p className="text-gray-400 leading-relaxed">
                  Competitive pricing and exclusive offers on all services.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
