import { useState, lazy, Suspense, createContext } from 'react'
import './App.css'

// Create context for payment details
export const PaymentContext = createContext<{
  recipient: string;
  note: string;
  setNote: (note: string) => void;
  amount: number | null;
  setAmount: (amount: number | null) => void;
  setRecipient: (recipient: string) => void;
}>({
  recipient: '',
  note: '',
  setNote: () => {},
  amount: null,
  setAmount: () => {},
  setRecipient: () => {}
});

// Lazy load payment method components
const PayPalSection = lazy(() => import('./components/payment-methods/PayPal'));
const CashAppSection = lazy(() => import('./components/payment-methods/CashApp'));
const ChimeSection = lazy(() => import('./components/payment-methods/Chime'));
const VenmoSection = lazy(() => import('./components/payment-methods/Venmo'));

function App() {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [amount, setAmount] = useState<number | null>(null);
  const [recipient, setRecipient] = useState('');

  // Matching env variables
  const ENV_RECIPIENTS: Record<string, string> = {
    venmo: import.meta.env.VITE_VENMO_RECIPIENT_ID || '',
    paypal: import.meta.env.VITE_PAYPAL_RECIPIENT_ID || '',
    cashapp: import.meta.env.VITE_CASHAPP_RECIPIENT_ID || '',
    chime: import.meta.env.VITE_CHIME_RECIPIENT_ID || ''
  };

  const toggleSection = (section: string) => {
    const isClosing = activeSection === section;
    setActiveSection(isClosing ? null : section);

    if (!isClosing) {
      // set correct recipient based on payment method selected
      setRecipient(ENV_RECIPIENTS[section]);
    }
  };

  const paymentMethods = [
    { id: 'venmo', name: 'Venmo', Component: VenmoSection, logo: '/logos/venmo.png' },
    { id: 'paypal', name: 'PayPal', Component: PayPalSection, logo: '/logos/paypal.png' },
    { id: 'cashapp', name: 'CashApp', Component: CashAppSection, logo: '/logos/cashapp.png' },
    { id: 'chime', name: 'Chime', Component: ChimeSection, logo: '/logos/chime.png' }
  ];

  return (
    <PaymentContext.Provider value={{ recipient, note, setNote, amount, setAmount, setRecipient }}>
      <div className="app-container">
        <header className="app-header">
          <h1>Cashier App</h1>
          <h2>Please select your payment method below</h2>
        </header>

        <section className="amount-section">
          <label htmlFor="amount-select">Select amount (USD):</label>
          <select
            id="amount-select"
            value={amount === null ? '' : amount}
            onChange={(e) => {
              const val = e.target.value;
              setAmount(val ? Number(val) : null);
              setActiveSection(null);
              setRecipient(''); // Clear when amount changes
            }}
            className="amount-select"
          >
            <option value="" disabled>Select amount</option>
            <option value={1}>$1</option>
            <option value={5}>$5</option>
            <option value={10}>$10</option>
            <option value={20}>$20</option>
            <option value={50}>$50</option>
            <option value={100}>$100</option>
          </select>
        </section>

        {amount !== null && (
          <main className="payment-sections">
            {paymentMethods.map((method) => (
              <div key={method.id} className="payment-section">
                <button
                  className={`payment-button ${activeSection === method.id ? 'active' : ''}`}
                  onClick={() => toggleSection(method.id)}
                >
                  <span className="button-content">
                    <span className="button-text">{method.name}</span>
                    <img src={method.logo} alt={`${method.name} logo`} className="payment-logo" />
                  </span>
                </button>

                <div className={`collapsible-content ${activeSection === method.id ? 'open' : ''}`}>
                  <div className="content-inner">
                    {activeSection === method.id && (
                      <Suspense fallback={<div>Loading...</div>}>
                        <method.Component />
                      </Suspense>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </main>
        )}
      </div>
    </PaymentContext.Provider>
  );
}

export default App;
