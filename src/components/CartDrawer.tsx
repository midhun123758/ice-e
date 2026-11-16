import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, ShoppingBag, Plus, Minus, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CartItem } from '../types';
import { playScoopPop, playChime } from '../utils/audio';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  const [isOrdered, setIsOrdered] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const freeShippingThreshold = 20;
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const remainingForFree = Math.max(0, freeShippingThreshold - subtotal);

  const handleCheckout = () => {
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#FF70A6', '#FF9770', '#FFD670', '#70D6BC', '#A06CD5'],
    });
    playChime();
    setOrderNumber(`ICE-${Math.floor(100000 + Math.random() * 900000)}`);
    setIsOrdered(true);
  };

  const handleFinishOrder = () => {
    setIsOrdered(false);
    onClearCart();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between"
            >
              {/* Header */}
              <div className="p-6 border-b border-stone-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-pink-500" />
                  <h3 className="font-display font-black text-xl text-stone-900">
                    Your Cone Bag
                  </h3>
                  <span className="text-xs bg-pink-100 text-pink-800 font-bold px-2 py-0.5 rounded-full">
                    {items.reduce((s, i) => s + i.quantity, 0)} items
                  </span>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    playScoopPop();
                  }}
                  className="w-8 h-8 rounded-full bg-stone-100 text-stone-500 hover:text-stone-900 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Free delivery goal progress */}
              <div className="px-6 py-3 bg-pink-50/60 border-b border-pink-100">
                <div className="flex items-center justify-between text-xs font-semibold mb-1.5 text-stone-700">
                  <span>
                    {remainingForFree > 0
                      ? `Add $${remainingForFree.toFixed(2)} more for FREE Dry-Ice Delivery 🚀`
                      : '🎉 You unlocked FREE Dry-Ice Express Delivery!'}
                  </span>
                  <span className="font-bold text-pink-600">{Math.round(progressPercent)}%</span>
                </div>
                <div className="w-full bg-pink-200/60 rounded-full h-1.5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.5 }}
                    className="h-full bg-gradient-to-r from-pink-500 to-rose-400 rounded-full"
                  />
                </div>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-3 text-stone-400 py-16">
                    <span className="text-5xl">🍦</span>
                    <h4 className="font-display font-bold text-lg text-stone-700">
                      Your cone bag is empty
                    </h4>
                    <p className="text-xs max-w-xs text-stone-500">
                      Explore our handcrafted artisanal scoops or build a custom gravity cone in the studio!
                    </p>
                  </div>
                ) : (
                  items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="p-4 rounded-2xl border border-stone-100 bg-stone-50/60 flex items-start justify-between gap-3"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-sm shrink-0 mt-0.5"
                          style={{ backgroundColor: item.color }}
                        >
                          🍨
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-stone-900 leading-tight">
                            {item.title}
                          </h4>
                          <p className="text-xs text-stone-500 mt-0.5">
                            {item.subtitle}
                          </p>

                          {item.customDetails && (
                            <div className="text-[11px] text-stone-400 mt-1 font-medium">
                              <div>Cone: {item.customDetails.coneName}</div>
                              {item.customDetails.toppingNames.length > 0 && (
                                <div>Toppings: {item.customDetails.toppingNames.join(', ')}</div>
                              )}
                            </div>
                          )}

                          <div className="flex items-center gap-2 mt-3">
                            <div className="flex items-center border border-stone-200 bg-white rounded-lg">
                              <button
                                onClick={() => {
                                  onUpdateQuantity(item.id, -1);
                                  playScoopPop();
                                }}
                                className="w-6 h-6 flex items-center justify-center text-stone-600 hover:text-stone-900"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="px-2 text-xs font-bold text-stone-800">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => {
                                  onUpdateQuantity(item.id, 1);
                                  playScoopPop();
                                }}
                                className="w-6 h-6 flex items-center justify-center text-stone-600 hover:text-stone-900"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <span className="font-bold text-sm text-stone-900">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          onRemoveItem(item.id);
                          playScoopPop();
                        }}
                        className="text-stone-400 hover:text-rose-500 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Footer Summary & Checkout */}
              {items.length > 0 && (
                <div className="p-6 border-t border-stone-100 bg-white space-y-4">
                  <div className="space-y-1.5 text-xs text-stone-600">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-bold text-stone-900">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Dry-Ice Insulated Packaging</span>
                      <span className="font-semibold text-emerald-600">FREE</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery</span>
                      <span className="font-bold text-stone-900">
                        {remainingForFree === 0 ? 'FREE' : '$3.50'}
                      </span>
                    </div>
                    <div className="flex justify-between text-base font-black text-stone-900 pt-2 border-t border-stone-100">
                      <span>Total Amount</span>
                      <span>
                        ${(subtotal + (remainingForFree === 0 ? 0 : 3.5)).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCheckout}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 text-white font-display font-bold text-base shadow-xl shadow-pink-500/25 flex items-center justify-center gap-2 group"
                  >
                    <span>Proceed to Instant Chill-Out</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </div>
              )}

              {/* Order Success Popup */}
              <AnimatePresence>
                {isOrdered && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-white z-50 flex flex-col items-center justify-center p-8 text-center space-y-4"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', damping: 12, stiffness: 200 }}
                      className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-4xl shadow-xl shadow-emerald-500/10"
                    >
                      <CheckCircle2 className="w-10 h-10" />
                    </motion.div>

                    <h3 className="font-display font-black text-3xl text-stone-900">
                      Order Confirmed!
                    </h3>
                    <p className="text-stone-600 text-sm max-w-xs leading-relaxed">
                      Your scoops are being micro-churned in liquid nitrogen with love!
                    </p>

                    <div className="bg-stone-50 border border-stone-200 px-4 py-2 rounded-xl text-xs font-mono font-bold text-stone-700">
                      Order ID: {orderNumber}
                    </div>

                    <p className="text-xs text-stone-400">
                      Estimated cold delivery: 25-35 minutes
                    </p>

                    <button
                      onClick={handleFinishOrder}
                      className="mt-6 px-8 py-3 rounded-full bg-stone-900 text-white font-bold text-sm hover:bg-pink-600 transition-colors shadow-lg"
                    >
                      Back to Menu
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
