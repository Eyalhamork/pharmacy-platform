'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  MessageCircle,
  X,
  Pill,
  Package,
  FileText,
  HelpCircle,
  Clock,
  Phone,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { activeTheme } from '@/lib/theme-config';

interface QuickAction {
  id: string;
  icon: React.ReactNode;
  label: string;
  message: string;
}

export function WhatsAppChatWidget() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on a staff or admin page
  const isStaffOrAdminPage = pathname?.startsWith('/staff') || pathname?.startsWith('/admin');

  useEffect(() => {
    // Detect mobile device
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Slide in animation after component mounts
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);

    return () => {
      window.removeEventListener('resize', checkMobile);
      clearTimeout(timer);
    };
  }, []);

  // Don't render on staff or admin pages
  if (isStaffOrAdminPage) {
    return null;
  }

  const whatsappNumber = activeTheme.contact.whatsapp.replace(/[^0-9]/g, '');
  const pharmacyName = activeTheme.name;

  const quickActions: QuickAction[] = [
    {
      id: 'medicine',
      icon: <Pill className="w-5 h-5" />,
      label: 'Ask about a medicine',
      message: "Hi, I'd like to ask about a medicine. ",
    },
    {
      id: 'order',
      icon: <Package className="w-5 h-5" />,
      label: 'Check my order/delivery',
      message: "Hi, I need help with my order. Order #: ",
    },
    {
      id: 'prescription',
      icon: <FileText className="w-5 h-5" />,
      label: 'Prescription help',
      message: "Hi, I need help with prescription verification. ",
    },
    {
      id: 'general',
      icon: <HelpCircle className="w-5 h-5" />,
      label: 'General inquiry',
      message: "Hi, I'm browsing your pharmacy and need assistance. ",
    },
  ];

  const openWhatsApp = (message: string) => {
    const encodedMessage = encodeURIComponent(message);

    if (isMobile) {
      // Mobile: Try to open WhatsApp app first
      window.location.href = `whatsapp://send?phone=${whatsappNumber}&text=${encodedMessage}`;

      // Fallback to web version after a short delay if app doesn't open
      setTimeout(() => {
        window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
      }, 1000);
    } else {
      // Desktop: Open WhatsApp Web
      window.open(
        `https://wa.me/${whatsappNumber}?text=${encodedMessage}`,
        '_blank',
        'noopener,noreferrer'
      );
    }

    setIsOpen(false);
  };

  return (
    <>
      {/* Floating WhatsApp Button */}
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Open WhatsApp chat"
        title="Chat with us on WhatsApp"
        className={`
          fixed flex items-center justify-center
          bg-[#25D366] hover:bg-[#20BA5A]
          text-white rounded-full shadow-lg
          transition-all duration-300 ease-in-out
          hover:scale-110 active:scale-95
          ${isMobile ? 'w-14 h-14 bottom-4 right-4' : 'w-16 h-16 bottom-6 right-6'}
          ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-32 opacity-0'}
        `}
        style={{
          boxShadow: '0 4px 12px rgba(37, 211, 102, 0.4)',
          zIndex: 9999,
        }}
      >
        <MessageCircle
          className={isMobile ? 'w-7 h-7' : 'w-8 h-8'}
          strokeWidth={2}
        />

        {/* Pulsating animation ring */}
        <span
          className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-75"
          style={{ animationDuration: '2s' }}
        />
      </button>

      {/* WhatsApp Chat Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="w-[95vw] max-w-md max-h-[90vh] sm:max-h-none overflow-y-auto sm:overflow-y-visible">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <div className="w-10 h-10 bg-[#25D366] rounded-full flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              Need Help? Let's Connect!
            </DialogTitle>
            <DialogDescription className="text-sm sm:text-base">
              Choose a topic or start a general WhatsApp chat with {pharmacyName}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 sm:space-y-4 py-2 sm:py-4">
            {/* Quick Action Buttons */}
            <div className="grid grid-cols-1 gap-2">
              {quickActions.map((action) => (
                <Button
                  key={action.id}
                  variant="outline"
                  className="justify-start h-auto py-2.5 sm:py-3 px-3 sm:px-4 hover:bg-green-50 hover:border-green-300 hover:text-gray-900 transition-colors"
                  onClick={() => openWhatsApp(action.message)}
                >
                  <div className="flex items-center gap-2 sm:gap-3 w-full">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 bg-green-100 rounded-full flex items-center justify-center text-green-700 flex-shrink-0">
                      {action.icon}
                    </div>
                    <span className="text-left font-medium text-gray-800 text-sm sm:text-base">{action.label}</span>
                  </div>
                </Button>
              ))}
            </div>

            {/* Divider */}
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">OR</span>
              </div>
            </div>

            {/* General Chat Button */}
            <Button
              onClick={() => openWhatsApp("Hi, I'm browsing your pharmacy and need assistance. ")}
              className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white py-5 sm:py-6 text-sm sm:text-base font-semibold"
            >
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Start WhatsApp Chat
            </Button>

            {/* Pharmacy Info */}
            <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-200">
              <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600 flex-shrink-0" />
                  <span className="font-medium">{activeTheme.contact.whatsapp}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">Mon-Sat, 8:00 AM - 8:00 PM</span>
                </div>
                <p className="text-[10px] sm:text-xs text-gray-500 mt-1 sm:mt-2">
                  We typically respond within a few minutes during business hours
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
