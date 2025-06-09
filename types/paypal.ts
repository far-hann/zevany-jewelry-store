// PayPal TypeScript definitions
export interface PayPalCreateOrderData {
  purchase_units: Array<{
    amount: {
      value: string;
      currency_code: string;
    };
    description: string;
    invoice_id: string;
    custom_id: string;
    shipping?: {
      name: {
        full_name: string;
      };
      address: {
        address_line_1: string;
        address_line_2?: string;
        admin_area_2: string;
        admin_area_1: string;
        postal_code: string;
        country_code: string;
      };
    };
  }>;
  application_context: {
    brand_name: string;
    locale: string;
    landing_page: string;
    user_action: string;
    shipping_preference: string;
  };
}

export interface PayPalCaptureResult {
  id: string;
  status: string;
  purchase_units: Array<{
    shipping: {
      name: {
        full_name: string;
      };
      address: {
        address_line_1: string;
        address_line_2?: string;
        admin_area_2: string;
        admin_area_1: string;
        postal_code: string;
        country_code: string;
      };
    };
    payments: {
      captures: Array<{
        id: string;
        status: string;
      }>;
    };
  }>;
  payer: {
    email_address: string;
    name: {
      given_name: string;
      surname: string;
    };
  };
}

// Global PayPal interface
declare global {
  interface Window {
    paypal: {
      Buttons: (config: {
        createOrder: (data: unknown, actions: {
          order: {
            create: (orderData: PayPalCreateOrderData) => Promise<string>;
          };
        }) => Promise<string>;
        onApprove: (data: { orderID: string }, actions: {
          order: {
            capture: () => Promise<PayPalCaptureResult>;
          };
        }) => Promise<void>;
        onCancel: () => void;
        onError: (err: unknown) => void;
        style: {
          layout: string;
          color: string;
          shape: string;
          label: string;
          height: number;
          tagline: boolean;
          disableMaxWidth: boolean;
        };
        funding: {
          allowed: string[];
          disallowed: string[];
        };
      }) => {
        render: (selector: string) => Promise<void>;
      };
      FUNDING: {
        PAYPAL: string;
        CARD: string;
        PAYLATER: string;
      };
    };
  }
}
