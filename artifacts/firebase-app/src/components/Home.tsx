import React, { useState } from 'react';
import { 
  Utensils, 
  ShoppingBag, 
  Wrench, 
  Bike, 
  Car, 
  ArrowRight, 
  Star, 
  Clock, 
  ShieldCheck,
  TrendingUp,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

const services = [
  {
    id: 'food',
    title: 'Food Delivery',
    description: 'Order from your favorite restaurants',
    icon: Utensils,
    color: 'bg-orange-500',
    lightColor: 'bg-orange-50',
    path: '/food',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'grocery',
    title: 'Grocery',
    description: 'Fresh groceries delivered in 10 mins',
    icon: ShoppingBag,
    color: 'bg-green-500',
    lightColor: 'bg-green-50',
    path: '/grocery',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'services',
    title: 'Home Services',
    description: 'Plumbers, Electricians & more',
    icon: Wrench,
    color: 'bg-blue-500',
    lightColor: 'bg-blue-50',
    path: '/services',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'rides',
    title: 'Rides',
    description: 'Bike & Auto taxi at your doorstep',
    icon: Bike,
    color: 'bg-yellow-500',
    lightColor: 'bg-yellow-50',
    path: '/rides',
    image: 'https://images.unsplash.com/photo-1558981403-c5f91cbba527?auto=format&fit=crop&w=800&q=80'
  }
];

export const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-white pt-12 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 leading-[1.1] tracking-tight mb-6">
                Everything you need, <br />
                <span className="text-orange-500">delivered fast.</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-lg leading-relaxed">
                From hot meals and fresh groceries to home repairs and quick rides. 
                One app for all your daily needs.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link to="/food" className="bg-orange-500 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-orange-600 transition-all shadow-xl shadow-orange-200 flex items-center gap-2">
                  Order Now <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/rides" className="bg-white text-gray-900 border-2 border-gray-100 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all flex items-center gap-2">
                  Book a Ride
                </Link>
              </div>

              <div className="mt-12 flex items-center gap-8">
                <div className="flex -space-x-3">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?u=${i}`} alt="" referrerPolicy="no-referrer" />
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1 text-orange-500">
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                  <p className="text-sm font-medium text-gray-600">Trusted by 1M+ users</p>
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
                  src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1000&q=80" 
                  alt="Food delivery" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-10 left-10 right-10 text-white">
                  <div className="bg-white/20 backdrop-blur-md p-6 rounded-3xl border border-white/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium uppercase tracking-wider">Latest Order</span>
                      <span className="bg-green-500 text-white text-[10px] px-2 py-1 rounded-full font-bold">ON THE WAY</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                        <Utensils className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-bold text-lg">Margherita Pizza</p>
                        <p className="text-sm text-white/80">Arriving in 12 mins</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-6 -right-6 bg-white p-4 rounded-2xl shadow-xl border border-gray-50 flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Delivery Time</p>
                  <p className="font-bold text-sm">Avg. 24 mins</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
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
          {services.map((service, idx) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
            >
              <Link 
                to={service.path}
                className="group block bg-white rounded-[2.5rem] p-6 border border-gray-100 hover:border-orange-200 transition-all hover:shadow-2xl hover:shadow-orange-100"
              >
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-6 transition-transform group-hover:scale-110", service.color)}>
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

      {/* Features */}
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
