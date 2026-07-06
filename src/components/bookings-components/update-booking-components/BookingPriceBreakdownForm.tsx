"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Calculator, Plus, X, ChevronDown, Edit2, Trash2, DollarSign, Package } from "lucide-react";
import { PriceBreakDown, CreateBookingParams, CreatePriceBreakDownRequest, UpdatePriceBreakDownRequest } from "@/types/booking-types";
import { useTheme } from "@/contexts/ThemeContext";
import { useCurrency } from "@/contexts/CurrencyContext";

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const }
  },
};

const sectionVariants: Variants = {
  hidden: { opacity: 0, height: 0 },
  visible: { 
    opacity: 1, 
    height: "auto", 
    transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] as const }
  },
};

interface BookingPriceBreakdownFormProps {
  priceBreakdowns: PriceBreakDown[];
  removedPriceBreakdowns: number[];
  bookingParams: CreateBookingParams;
  onAddPriceBreakdown: (item: CreatePriceBreakDownRequest) => void;
  onRemovePriceBreakdown: (itemId: number) => void;
  onUpdatePriceBreakdown: (item: UpdatePriceBreakDownRequest) => void;
  expandedSections: Set<string>;
  onToggleSection: (section: string) => void;
  theme: any;
  formatPrice: (price: number) => string;
}

export const BookingPriceBreakdownForm: React.FC<BookingPriceBreakdownFormProps> = ({
  priceBreakdowns,
  removedPriceBreakdowns,
  bookingParams,
  onAddPriceBreakdown,
  onRemovePriceBreakdown,
  onUpdatePriceBreakdown,
  expandedSections,
  onToggleSection,
  theme,
  formatPrice,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<PriceBreakDown | null>(null);

  const [newItem, setNewItem] = useState<CreatePriceBreakDownRequest>({
    itemType: "",
    itemName: "",
    itemDescription: "",
    quantity: 1,
    unitPrice: 0,
    totalPrice: 0,
    status: 1,
  });

  const [editItemData, setEditItemData] = useState<UpdatePriceBreakDownRequest>({
    priceBreakDownId: 0,
    itemType: "",
    itemName: "",
    itemDescription: "",
    quantity: 1,
    unitPrice: 0,
    totalPrice: 0,
    status: 1,
  });

  const isItemRemoved = (id: number) => removedPriceBreakdowns.includes(id);
  const visibleItems = priceBreakdowns.filter(i => !isItemRemoved(i.priceBreakDownId || 0));

  const focusHandlers = {
    onFocus: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      e.currentTarget.style.borderColor = theme.primary;
      e.currentTarget.style.boxShadow = `0 0 0 3px ${theme.primary}18`;
    },
    onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      e.currentTarget.style.borderColor = theme.border;
      e.currentTarget.style.boxShadow = "none";
    },
  };

  const fieldBase: React.CSSProperties = {
    backgroundColor: theme.background,
    color: theme.text,
    transition: "border-color 0.18s ease, box-shadow 0.18s ease",
  };

  const handleAddItem = () => {
    if (!newItem.itemType || !newItem.itemName) {
      alert("Item type and name are required");
      return;
    }
    newItem.totalPrice = newItem.quantity * newItem.unitPrice;
    onAddPriceBreakdown(newItem);
    setNewItem({
      itemType: "",
      itemName: "",
      itemDescription: "",
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0,
      status: 1,
    });
    setShowAddForm(false);
  };

  const handleUpdateItem = () => {
    if (!editItemData.itemType || !editItemData.itemName) {
      alert("Item type and name are required");
      return;
    }
    editItemData.totalPrice = editItemData.quantity * editItemData.unitPrice;
    onUpdatePriceBreakdown(editItemData);
    setEditingItem(null);
    setEditItemData({
      priceBreakDownId: 0,
      itemType: "",
      itemName: "",
      itemDescription: "",
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0,
      status: 1,
    });
  };

  const handleEditClick = (item: PriceBreakDown) => {
    setEditingItem(item);
    setEditItemData({
      priceBreakDownId: item.priceBreakDownId || 0,
      itemType: item.itemType,
      itemName: item.itemName,
      itemDescription: item.itemDescription,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      totalPrice: item.totalPrice,
      status: 1,
    });
  };

  const totalPrice = visibleItems.reduce((sum, item) => sum + item.totalPrice, 0);

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="rounded-2xl overflow-hidden"
      style={{
        backgroundColor: theme.surface,
        border: `1px solid ${theme.border}`,
        boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
      }}
    >
      <button
        onClick={() => onToggleSection("price-breakdown")}
        className="w-full flex items-center justify-between p-4 cursor-pointer transition-colors"
        style={{
          backgroundColor: expandedSections.has("price-breakdown") ? `${theme.primary}05` : "transparent",
          borderBottom: expandedSections.has("price-breakdown") ? `1px solid ${theme.border}` : "none",
        }}
      >
        <div className="flex items-center gap-3">
          <span
            className="flex items-center justify-center w-8 h-8 rounded-lg"
            style={{ backgroundColor: `${theme.primary}18`, color: theme.primary }}
          >
            <Calculator className="w-4 h-4" />
          </span>
          <div>
            <h2 className="text-sm sm:text-base font-semibold" style={{ color: theme.text }}>
              Price Breakdown
            </h2>
            <p className="text-xs mt-0.5" style={{ color: theme.textSecondary }}>
              {visibleItems.length} items · Total: {formatPrice(totalPrice)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowAddForm(true);
            }}
            className="px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-medium cursor-pointer transition-all"
            style={{ backgroundColor: `${theme.success}15`, color: theme.success }}
          >
            <Plus className="w-3.5 h-3.5" /> Add
          </button>
          <ChevronDown
            className="w-4 h-4 transition-transform duration-200"
            style={{ transform: expandedSections.has("price-breakdown") ? "rotate(180deg)" : "none", color: theme.textSecondary }}
          />
        </div>
      </button>

      <AnimatePresence>
        {expandedSections.has("price-breakdown") && (
          <motion.div variants={sectionVariants} initial="hidden" animate="visible" exit="hidden" className="p-6">
            {/* Add Item Form */}
            <AnimatePresence>
              {showAddForm && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-6 p-4 rounded-xl"
                  style={{ backgroundColor: `${theme.success}08`, border: `1px solid ${theme.success}30` }}
                >
                  <h4 className="text-sm font-semibold mb-4" style={{ color: theme.text }}>
                    Add Price Item
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
                        Item Type <span style={{ color: theme.error }}>*</span>
                      </label>
                      <input
                        type="text"
                        value={newItem.itemType}
                        onChange={(e) => setNewItem({ ...newItem, itemType: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border-2 text-sm"
                        style={{ ...fieldBase, borderColor: theme.border }}
                        placeholder="e.g., Accommodation, Transport"
                        {...focusHandlers}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
                        Item Name <span style={{ color: theme.error }}>*</span>
                      </label>
                      <input
                        type="text"
                        value={newItem.itemName}
                        onChange={(e) => setNewItem({ ...newItem, itemName: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border-2 text-sm"
                        style={{ ...fieldBase, borderColor: theme.border }}
                        placeholder="e.g., Hotel Stay"
                        {...focusHandlers}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
                        Description
                      </label>
                      <input
                        type="text"
                        value={newItem.itemDescription}
                        onChange={(e) => setNewItem({ ...newItem, itemDescription: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border-2 text-sm"
                        style={{ ...fieldBase, borderColor: theme.border }}
                        placeholder="Optional description"
                        {...focusHandlers}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
                        <Package className="w-3 h-3 inline mr-1" />
                        Quantity
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={newItem.quantity}
                        onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 rounded-lg border-2 text-sm"
                        style={{ ...fieldBase, borderColor: theme.border }}
                        {...focusHandlers}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
                        <DollarSign className="w-3 h-3 inline mr-1" />
                        Unit Price
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={newItem.unitPrice}
                        onChange={(e) => setNewItem({ ...newItem, unitPrice: parseFloat(e.target.value) })}
                        className="w-full px-3 py-2 rounded-lg border-2 text-sm"
                        style={{ ...fieldBase, borderColor: theme.border }}
                        {...focusHandlers}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
                        <DollarSign className="w-3 h-3 inline mr-1" />
                        Total Price
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={newItem.quantity * newItem.unitPrice}
                        disabled
                        className="w-full px-3 py-2 rounded-lg border-2 text-sm opacity-70"
                        style={{ ...fieldBase, borderColor: theme.border }}
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 mt-4 pt-2">
                    <button
                      onClick={() => setShowAddForm(false)}
                      className="flex-1 px-3 py-2 rounded-lg text-sm"
                      style={{ backgroundColor: theme.background, border: `1px solid ${theme.border}`, color: theme.textSecondary }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddItem}
                      className="flex-1 px-3 py-2 rounded-lg text-sm font-medium text-white"
                      style={{ backgroundColor: theme.success }}
                    >
                      Add Item
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Edit Item Modal */}
            <AnimatePresence>
              {editingItem && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                  onClick={() => setEditingItem(null)}
                >
                  <div
                    className="rounded-2xl p-6 max-w-2xl w-full mx-4"
                    style={{ backgroundColor: theme.surface }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h3 className="text-lg font-semibold mb-4" style={{ color: theme.text }}>
                      Edit Price Item
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
                          Item Type
                        </label>
                        <input
                          type="text"
                          value={editItemData.itemType}
                          onChange={(e) => setEditItemData({ ...editItemData, itemType: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border-2"
                          style={{ ...fieldBase, borderColor: theme.border }}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
                          Item Name
                        </label>
                        <input
                          type="text"
                          value={editItemData.itemName}
                          onChange={(e) => setEditItemData({ ...editItemData, itemName: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border-2"
                          style={{ ...fieldBase, borderColor: theme.border }}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
                          Description
                        </label>
                        <input
                          type="text"
                          value={editItemData.itemDescription}
                          onChange={(e) => setEditItemData({ ...editItemData, itemDescription: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border-2"
                          style={{ ...fieldBase, borderColor: theme.border }}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
                          Quantity
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={editItemData.quantity}
                          onChange={(e) => setEditItemData({ ...editItemData, quantity: parseInt(e.target.value) })}
                          className="w-full px-3 py-2 rounded-lg border-2"
                          style={{ ...fieldBase, borderColor: theme.border }}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
                          Unit Price
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={editItemData.unitPrice}
                          onChange={(e) => setEditItemData({ ...editItemData, unitPrice: parseFloat(e.target.value) })}
                          className="w-full px-3 py-2 rounded-lg border-2"
                          style={{ ...fieldBase, borderColor: theme.border }}
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 mt-4 pt-2">
                      <button
                        onClick={() => setEditingItem(null)}
                        className="flex-1 px-4 py-2 rounded-lg"
                        style={{ backgroundColor: theme.background, border: `1px solid ${theme.border}`, color: theme.textSecondary }}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleUpdateItem}
                        className="flex-1 px-4 py-2 rounded-lg text-white"
                        style={{ backgroundColor: theme.primary }}
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Items List */}
            {visibleItems.length === 0 ? (
              <div className="text-center py-8" style={{ backgroundColor: `${theme.border}10`, borderRadius: "12px" }}>
                <Calculator className="w-12 h-12 mx-auto mb-3 opacity-30" style={{ color: theme.textSecondary }} />
                <p className="text-sm" style={{ color: theme.textSecondary }}>No price items added yet</p>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  {visibleItems.map((item) => (
                    <div
                      key={item.priceBreakDownId}
                      className="flex items-center justify-between p-3 rounded-lg"
                      style={{ backgroundColor: `${theme.border}10`, border: `1px solid ${theme.border}` }}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: `${theme.primary}15`, color: theme.primary }}>
                            {item.itemType}
                          </span>
                          <span className="text-sm font-medium" style={{ color: theme.text }}>{item.itemName}</span>
                        </div>
                        {item.itemDescription && (
                          <p className="text-xs mt-1" style={{ color: theme.textSecondary }}>{item.itemDescription}</p>
                        )}
                        <div className="flex items-center gap-3 mt-1 text-xs" style={{ color: theme.textSecondary }}>
                          <span>Qty: {item.quantity}</span>
                          <span>Unit: {formatPrice(item.unitPrice)}</span>
                          <span className="font-semibold" style={{ color: theme.primary }}>
                            Total: {formatPrice(item.totalPrice)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleEditClick(item)}
                          className="p-1.5 rounded-lg transition-all hover:scale-110"
                          style={{ color: theme.primary }}
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onRemovePriceBreakdown(item.priceBreakDownId || 0)}
                          className="p-1.5 rounded-lg transition-all hover:scale-110"
                          style={{ color: theme.error }}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total Summary */}
                <div className="mt-4 p-3 rounded-lg text-center" style={{ backgroundColor: `${theme.primary}10` }}>
                  <p className="text-sm font-semibold" style={{ color: theme.primary }}>
                    Total: {formatPrice(totalPrice)}
                  </p>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};