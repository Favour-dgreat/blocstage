"use client";

import { useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";

/* ---------- Interfaces ---------- */
interface Ticket {
  id: string;
  name: string;
  description: string;
  is_free: boolean;
  total_supply: number;
  price?: number; // For paid tickets
  benefits?: string[]; // Optional benefits
  isTransferable?: boolean; // Optional transferability
  isResellable?: boolean; // Optional resellability
}

interface BuyTicketsPageProps {
  eventId: string;
  ticketsData?: Ticket[]; // Make optional for backward compatibility
}

interface SummaryItem {
  name: string;
  price: number;
}

/* ---------- Fetch Tickets Function ---------- */
const fetchEventTickets = async (eventId: string): Promise<Ticket[]> => {
  try {
    const response = await fetch(`https://api.blocstage.com/events/${eventId}/tickets`);
    
    if (!response.ok) {
      console.warn(`Failed to fetch tickets for event ${eventId}:`, response.status);
      return [];
    }
    
    const tickets = await response.json();
    return Array.isArray(tickets) ? tickets : [];
  } catch (error) {
    console.error(`Error fetching tickets for event ${eventId}:`, error);
    return [];
  }
};

/* ---------- Main BuyTicketsPage ---------- */
const BuyTicketsPage = ({ eventId, ticketsData }: BuyTicketsPageProps) => {
  const [tickets, setTickets] = useState<Ticket[]>(ticketsData || []);
  const [loading, setLoading] = useState(!ticketsData);
  const [error, setError] = useState<string | null>(null);
  const [ticketQuantities, setTicketQuantities] = useState<{ [key: string]: number }>({});
  const [showContactForm, setShowContactForm] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch tickets from API if not provided
  useEffect(() => {
    if (!ticketsData && eventId) {
      const loadTickets = async () => {
        setLoading(true);
        setError(null);
        try {
          const fetchedTickets = await fetchEventTickets(eventId);
          setTickets(fetchedTickets);
          
          // Initialize quantities to 0 for all tickets
          const initialQuantities = fetchedTickets.reduce((acc, ticket) => ({
            ...acc,
            [ticket.id]: 0
          }), {});
          setTicketQuantities(initialQuantities);
        } catch (err) {
          setError('Failed to load tickets');
          console.error('Error loading tickets:', err);
        } finally {
          setLoading(false);
        }
      };
      
      loadTickets();
    } else if (ticketsData) {
      // Initialize quantities for provided tickets
      const initialQuantities = ticketsData.reduce((acc, ticket) => ({
        ...acc,
        [ticket.id]: 0
      }), {});
      setTicketQuantities(initialQuantities);
    }
  }, [eventId, ticketsData]);

  const handleQuantityChange = (id: string, delta: number) => {
    setTicketQuantities((prev) => ({
      ...prev,
      [id]: Math.max(0, prev[id] + delta),
    }));
  };

  const totalTickets = Object.values(ticketQuantities).reduce((sum, qty) => sum + qty, 0);
  const subtotal = tickets.reduce(
    (sum, ticket) => {
      const quantity = ticketQuantities[ticket.id] || 0;
      const price = ticket.is_free ? 0 : (ticket.price || 0);
      return sum + (price * quantity);
    },
    0
  );
  const total = subtotal;

  const summaryItems = tickets
    .filter((ticket) => ticketQuantities[ticket.id] > 0)
    .map((ticket) => ({
      name: `x${ticketQuantities[ticket.id]} ${ticket.name}`,
      price: ticket.is_free ? 0 : (ticket.price || 0) * ticketQuantities[ticket.id],
    }));

  if (showContactForm) {
    return (
      <ContactInformationPage
        total={total}
        summaryItems={summaryItems}
        onBack={() => setShowContactForm(false)}
        eventId={eventId}
        tickets={tickets}
        setTickets={setTickets}
        ticketQuantities={ticketQuantities}
        setTicketQuantities={setTicketQuantities}
      />
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-t-4 border-[#F4511E] border-gray-200 rounded-full animate-spin mb-4 mx-auto"></div>
              <p className="text-gray-600">Loading tickets...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <p className="text-red-500 mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="px-4 py-2 bg-[#092C4C] text-white rounded hover:bg-[#0a3a5c]"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Back Button */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => window.history.back()}
            className="text-gray-600 hover:text-gray-900 flex items-center"
          >
            <ChevronLeft size={20} />
            <span className="ml-2">Back</span>
          </button>
        </div>

        {/* Page Title */}
        <h1 className="text-2xl font-bold text-[#092C4C] mb-6">Buy Ticket</h1>

        {/* Progress Bar */}
        <ProgressBar currentStep={0} />

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Tickets Section */}
          <div className="lg:col-span-2 space-y-6">
            {tickets.length > 0 ? (
              tickets.map((ticket) => (
                <TicketCard
                  key={ticket.id}
                  ticket={ticket}
                  quantity={ticketQuantities[ticket.id] || 0}
                  onQuantityChange={handleQuantityChange}
                />
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No tickets available for this event.</p>
              </div>
            )}
          </div>

          {/* Summary Section */}
          <SummaryCard
            total={total}
            summaryItems={summaryItems}
            buttonLabel="Continue"
            onButtonClick={() => setShowContactForm(true)}
            disabled={totalTickets === 0}
          />
        </div>
      </div>
    </div>
  );
};

/* ---------- Progress Bar Component ---------- */
const ProgressBar = ({ currentStep }: { currentStep: number }) => {
  const steps = ["Tickets", "Contact", "Payment"];

  return (
    <div className="flex items-center justify-between mb-8">
      {steps.map((step, index) => (
        <div key={index} className="flex-1 flex items-center">
          <div
            className={`w-6 h-6 flex items-center justify-center rounded-full border-2 ${
              index === currentStep 
                ? "border-[#092C4C] bg-[#092C4C]" 
                : index < currentStep 
                ? "border-[#092C4C] bg-[#092C4C]" 
                : "border-gray-300 bg-white"
            }`}
          >
            {index <= currentStep && (
              <div className="w-2 h-2 bg-white rounded-full"></div>
            )}
          </div>
          <span className={`ml-3 text-sm ${
            index === currentStep ? "text-[#092C4C] font-semibold" : "text-gray-600"
          }`}>
            {step}
          </span>
          {index < steps.length - 1 && (
            <div className={`flex-1 h-0.5 mx-4 ${
              index < currentStep ? "bg-[#092C4C]" : "bg-gray-200"
            }`}></div>
          )}
        </div>
      ))}
    </div>
  );
};

/* ---------- Ticket Card ---------- */
const TicketCard = ({
  ticket,
  quantity,
  onQuantityChange,
}: {
  ticket: Ticket;
  quantity: number;
  onQuantityChange: (id: string, delta: number) => void;
}) => {
  const [showBenefits, setShowBenefits] = useState(false);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-4">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h2 className="text-lg font-bold text-[#092C4C] mb-2">{ticket.name}</h2>
          <p className="text-[#F4511E] font-semibold text-lg mb-3">
            {ticket.is_free ? 'FREE' : `NGN ${(ticket.price || 0).toLocaleString()}`}
          </p>

          {/* Description */}
          {ticket.description && (
            <p className="text-sm text-gray-600 mb-3">{ticket.description}</p>
          )}

          {/* Badges */}
          <div className="flex items-center space-x-2 mb-3">
            {ticket.isTransferable && (
              <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full">
                Transferable
              </span>
            )}
            {ticket.isResellable && (
              <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full">
                Resellable
              </span>
            )}
            {ticket.is_free && (
              <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full">
                Free Ticket
              </span>
            )}
          </div>

          {/* Benefits */}
          {ticket.benefits && ticket.benefits.length > 0 && (
            <div className="text-sm text-gray-700">
              <span className="font-semibold">Benefits:</span>
              <div className="mt-1">
                {(showBenefits ? ticket.benefits : ticket.benefits.slice(0, 1)).map((benefit, index) => (
                  <p key={index} className="text-sm">• {benefit}</p>
                ))}
              </div>
              {ticket.benefits.length > 1 && (
                <button
                  onClick={() => setShowBenefits(!showBenefits)}
                  className="text-xs text-[#F4511E] mt-1 hover:underline"
                >
                  {showBenefits ? "See less" : "See more"}
                </button>
              )}
            </div>
          )}

          {/* Total Supply */}
          <div className={`text-xs mt-2 ${
            ticket.total_supply <= 5 && ticket.total_supply > 0 
              ? "text-orange-600 font-medium" 
              : ticket.total_supply === 0 
                ? "text-red-600 font-medium" 
                : "text-gray-500"
          }`}>
            {ticket.total_supply === 0 
              ? "Sold Out" 
              : ticket.total_supply <= 5 
                ? `Only ${ticket.total_supply} tickets left!` 
                : `Available: ${ticket.total_supply} tickets`
            }
          </div>
        </div>

        {/* Quantity Selector */}
        <div className="flex items-center space-x-3 ml-6">
          <button
            onClick={() => onQuantityChange(ticket.id, -1)}
            disabled={quantity === 0 || ticket.total_supply === 0}
            className={`w-8 h-8 border text-sm rounded-full flex items-center justify-center ${
              quantity === 0 || ticket.total_supply === 0
                ? "border-gray-200 text-gray-400 cursor-not-allowed"
                : "border-gray-300 hover:bg-gray-50"
            }`}
          >
            -
          </button>
          <span className="w-8 text-center text-sm font-semibold">{quantity}</span>
          <button
            onClick={() => onQuantityChange(ticket.id, 1)}
            disabled={ticket.total_supply === 0 || quantity >= ticket.total_supply}
            className={`w-8 h-8 border text-sm rounded-full flex items-center justify-center ${
              ticket.total_supply === 0 || quantity >= ticket.total_supply
                ? "border-gray-200 bg-gray-200 text-gray-400 cursor-not-allowed"
                : "border-[#F4511E] bg-[#F4511E] text-white hover:bg-[#e03e0c]"
            }`}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};

/* ---------- Summary Card ---------- */
interface SummaryCardProps {
  total: number;
  summaryItems: SummaryItem[];
  buttonLabel: string;
  onButtonClick: () => void;
  disabled: boolean;
}

const SummaryCard = ({
  total,
  summaryItems,
  buttonLabel,
  onButtonClick,
  disabled,
}: SummaryCardProps) => (
  <div className="bg-white border border-gray-200 rounded-lg p-6">
    <h2 className="text-lg font-bold text-[#092C4C] mb-4">Summary</h2>
    <div className="space-y-3 text-sm">
      {summaryItems.map((item, index) => (
        <div key={index} className="flex justify-between">
          <span className="text-gray-700">{item.name}</span>
          <span className="text-gray-900 font-medium">NGN {item.price.toLocaleString()}</span>
        </div>
      ))}
    </div>
    <div className="border-t border-gray-200 my-4" />
    <div className="flex justify-between text-base font-bold text-[#092C4C]">
      <span>Total</span>
      <span>NGN {total.toLocaleString()}</span>
    </div>
    <button
      onClick={onButtonClick}
      disabled={disabled}
      className={`w-full mt-6 py-3 text-sm rounded-md font-semibold ${
        disabled
          ? "bg-gray-300 text-gray-600 cursor-not-allowed"
          : "bg-[#092C4C] text-white hover:bg-[#0a3a5c] transition-colors"
      }`}
    >
      {buttonLabel}
    </button>
  </div>
);

/* ---------- Contact Information Page ---------- */
const ContactInformationPage = ({
  total,
  summaryItems,
  onBack,
  eventId,
  tickets,
  setTickets,
  ticketQuantities,
  setTicketQuantities,
}: {
  total: number;
  summaryItems: SummaryItem[];
  onBack: () => void;
  eventId: string;
  tickets: Ticket[];
  setTickets: (tickets: Ticket[]) => void;
  ticketQuantities: { [key: string]: number };
  setTicketQuantities: (quantities: { [key: string]: number }) => void;
}) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsSubmitting(true);
    try {
      // Check if any tickets are selected
      const hasSelectedTickets = Object.values(ticketQuantities).some(quantity => quantity > 0);
      if (!hasSelectedTickets) {
        alert('Please select at least one ticket');
        return;
      }

      // Get the selected ticket type ID from the actual ticket data
      const selectedTicketId = Object.keys(ticketQuantities).find(id => ticketQuantities[id] > 0);
      const selectedTicket = tickets.find(ticket => ticket.id === selectedTicketId);
      
      if (!selectedTicket) {
        alert('Selected ticket not found');
        return;
      }
      
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        eventId: eventId,
        ticketTypeId: selectedTicket.id,
        quantity: ticketQuantities[selectedTicket.id]
      };

      // Get authentication token
      const authToken = localStorage.getItem("authToken");
      if (!authToken) {
        alert("Please log in to claim tickets.");
        return;
      }


      const response = await fetch(`https://api.blocstage.com/ticket-types/${selectedTicket.id}/claim`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`Failed to claim ticket: ${response.status} ${response.statusText} - ${errorText}`);
      }

      // Reduce available tickets after successful registration
      const updatedTickets = tickets.map(ticket => {
        const quantityClaimed = ticketQuantities[ticket.id] || 0;
        if (quantityClaimed > 0) {
          return {
            ...ticket,
            total_supply: Math.max(0, ticket.total_supply - quantityClaimed)
          };
        }
        return ticket;
      });
      setTickets(updatedTickets);

      // Reset ticket quantities
      setTicketQuantities({});

      // Reset form data
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
      });

      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error claiming ticket:', error);
      alert('Failed to claim ticket. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    formData.firstName && formData.lastName && formData.email && formData.phone;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Back Button */}
        <div className="flex items-center mb-6">
          <button
            onClick={onBack}
            className="text-gray-600 hover:text-gray-900 flex items-center"
          >
            <ChevronLeft size={20} />
            <span className="ml-2">Back</span>
          </button>
        </div>

        {/* Page Title */}
        <h1 className="text-2xl font-bold text-[#092C4C] mb-6">Buy Ticket</h1>

        {/* Progress Bar (Step 1 - Contact) */}
        <ProgressBar currentStep={1} />

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <h2 className="text-lg font-bold text-[#092C4C] mb-6">
              Contact Information
            </h2>
            <div className="mb-4">
              <span className="text-sm text-gray-600">Tickets</span>
            </div>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="e.g Regular"
                />
                <InputField
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="e.g Regular"
                />
              </div>
              <InputField
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="e.g Regular"
              />
              <InputField
                label="Phone Number"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="e.g Regular"
              />
              <button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className={`w-full mt-6 py-3 rounded-md font-semibold ${
                  !isFormValid || isSubmitting
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-[#092C4C] text-white hover:bg-[#0a3a5c] transition-colors"
                }`}
              >
                {isSubmitting ? "Processing..." : "Proceed"}
              </button>
            </form>
          </div>

          {/* Summary Section */}
          <SummaryCard
            total={total}
            summaryItems={summaryItems}
            buttonLabel="Get Ticket"
            onButtonClick={() => {}}
            disabled={!isFormValid}
          />
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-4">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Event Registered Successfully!</h3>
              <p className="text-sm text-gray-500 mb-6">
                Your ticket has been claimed and you will receive a confirmation email shortly.
              </p>
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  onBack(); // Go back to ticket selection
                }}
                className="w-full bg-[#092C4C] text-white py-2 px-4 rounded-md hover:bg-[#0a3a5c] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ---------- Reusable Input Component ---------- */
const InputField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>
    <input
      type={type}
      name={name}
      id={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-[#092C4C] focus:border-[#092C4C] text-gray-900 placeholder-gray-500"
    />
  </div>
);

export default BuyTicketsPage;
