// lib/store/checkout.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type DeliveryType = 'delivery' | 'pickup';

interface CheckoutStore {
  // Current step
  currentStep: number;
  
  // Step 1: Cart is managed by cart store
  
  // Step 2: Delivery
  deliveryType: DeliveryType;
  selectedAddressId: string | null;
  deliveryZoneId: string | null;
  deliveryFee: number;
  estimatedDeliveryTime: string | null;
  
  // Step 3: Prescription (will be added later)
  prescriptionFiles: File[];
  
  // Step 4: Payment (will be added later)
  paymentMethod: 'mobile_money' | 'cash_on_delivery' | null;
  momoPhoneNumber: string;
  
  // Customer notes
  customerNotes: string;
  
  // Actions
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  previousStep: () => void;
  
  setDeliveryType: (type: DeliveryType) => void;
  setSelectedAddress: (addressId: string | null, zoneId: string | null, fee: number, time: string | null) => void;
  
  setPrescriptionFiles: (files: File[]) => void;
  
  setPaymentMethod: (method: 'mobile_money' | 'cash_on_delivery') => void;
  setMomoPhoneNumber: (phone: string) => void;
  
  setCustomerNotes: (notes: string) => void;
  
  resetCheckout: () => void;
}

const initialState = {
  currentStep: 1,
  deliveryType: 'delivery' as DeliveryType,
  selectedAddressId: null,
  deliveryZoneId: null,
  deliveryFee: 0,
  estimatedDeliveryTime: null,
  prescriptionFiles: [],
  paymentMethod: null,
  momoPhoneNumber: '',
  customerNotes: '',
};

export const useCheckout = create<CheckoutStore>()(
  persist(
    (set) => ({
      ...initialState,

      setCurrentStep: (step) => set({ currentStep: step }),
      
      nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
      
      previousStep: () => set((state) => ({ currentStep: Math.max(1, state.currentStep - 1) })),

      setDeliveryType: (type) => set({ deliveryType: type }),
      
      setSelectedAddress: (addressId, zoneId, fee, time) =>
        set({
          selectedAddressId: addressId,
          deliveryZoneId: zoneId,
          deliveryFee: fee,
          estimatedDeliveryTime: time,
        }),

      setPrescriptionFiles: (files) => set({ prescriptionFiles: files }),

      setPaymentMethod: (method) => set({ paymentMethod: method }),
      
      setMomoPhoneNumber: (phone) => set({ momoPhoneNumber: phone }),

      setCustomerNotes: (notes) => set({ customerNotes: notes }),

      resetCheckout: () => set(initialState),
    }),
    {
      name: 'pharmacy-checkout-storage',
      storage: createJSONStorage(() => localStorage),
      // Don't persist files (they can't be serialized properly)
      partialize: (state) => ({
        ...state,
        prescriptionFiles: [],
      }),
    }
  )
);
