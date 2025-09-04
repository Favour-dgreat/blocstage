"use client";

import { useState } from "react";
import { ChevronLeft } from "lucide-react";

/* ---------- Interfaces ---------- */
interface Ticket {
  id: string;
  name: string;
  price: number;
  benefits: string[];
  isTransferable: boolean;
  isResellable: boolean;
}

interface BuyTicketsPageProps {
  ticketsData: Ticket[];
}

interface SummaryItem {
  name: string;
  price: number;
}

/* ---------- Main BuyTicketsPage ---------- */
const BuyTicketsPage = ({ ticketsData }: BuyTicketsPageProps) => {
  const [ticketQuantities, setTicketQuantities] = useState<{ [key: string]: number }>(
    ticketsData.reduce((acc, ticket) => ({ ...acc, [ticket.id]: 0 }), {})
  );

  const [showContactForm, setShowContactForm] = useState(false);

  const handleQuantityChange = (id: string, delta: number) => {
    setTicketQuantities((prev) => ({
      ...prev,
      [id]: Math.max(0, prev[id] + delta),
    }));
  };

  const totalTickets = Object.values(ticketQuantities).reduce((sum, qty) => sum + qty, 0);
  const subtotal = ticketsData.reduce(
    (sum, ticket) => sum + ticket.price * (ticketQuantities[ticket.id] || 0),
    0
  );
  const charges = totalTickets > 0 ? 320 : 0;
  const total = subtotal + charges;

  const summaryItems = ticketsData
    .filter((ticket) => ticketQuantities[ticket.id] > 0)
    .map((ticket) => ({
      name: `x${ticketQuantities[ticket.id]} ${ticket.name}`,
      price: ticket.price * ticketQuantities[ticket.id],
    }));

  if (showContactForm) {
    return (
      <ContactInformationPage
        total={total}
        summaryItems={summaryItems}
        onBack={() => setShowContactForm(false)}
      />
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-5xl mx-auto bg-white p-8 rounded-xl shadow-sm">
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
        <h1 className="text-xl font-bold text-[#092C4C] mb-6">Buy Ticket</h1>

        {/* Progress Bar */}
        <ProgressBar currentStep={1} />

        {/* Main Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Tickets Section */}
          <div className="md:col-span-2 space-y-6">
            {ticketsData.map((ticket) => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                quantity={ticketQuantities[ticket.id]}
                onQuantityChange={handleQuantityChange}
              />
            ))}
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
            className={`w-5 h-5 flex items-center justify-center rounded-full border-2 ${
              index <= currentStep ? "border-[#092C4C]" : "border-gray-300"
            }`}
          >
            {index <= currentStep && <div className="w-2.5 h-2.5 bg-[#092C4C] rounded-full"></div>}
          </div>
          <span className="ml-2 text-sm text-gray-600">{step}</span>
          {index < steps.length - 1 && <div className="flex-1 h-0.5 bg-gray-200 mx-4"></div>}
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
    <div className="border-b border-gray-200 pb-4">
      <h2 className="text-md font-semibold text-gray-800">{ticket.name}</h2>
      <p className="text-orange-600 font-semibold text-sm mb-2">
        NGN {ticket.price.toLocaleString()}
      </p>

      {/* Badges */}
      <div className="flex items-center space-x-2 mb-2">
        {ticket.isTransferable && (
          <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded">
            Transferable
          </span>
        )}
        {ticket.isResellable && (
          <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded">
            Resellable
          </span>
        )}
      </div>

      {/* Benefits */}
      <div className="mt-2 text-sm text-gray-700">
        <span className="font-semibold">Benefits:</span>
        <div className="mt-1">
          {(showBenefits ? ticket.benefits : ticket.benefits.slice(0, 1)).map((benefit, index) => (
            <p key={index}>{benefit}</p>
          ))}
        </div>
        {ticket.benefits.length > 1 && (
          <button
            onClick={() => setShowBenefits(!showBenefits)}
            className="text-xs text-red-500 mt-1"
          >
            {showBenefits ? "See less" : "See more"}
          </button>
        )}
      </div>

      {/* Quantity Selector */}
      <div className="flex items-center space-x-2 mt-3">
        <button
          onClick={() => onQuantityChange(ticket.id, -1)}
          className="w-6 h-6 border border-gray-300 text-sm rounded flex items-center justify-center"
        >
          -
        </button>
        <span className="w-6 text-center text-sm">{quantity}</span>
        <button
          onClick={() => onQuantityChange(ticket.id, 1)}
          className="w-6 h-6 border border-gray-300 text-sm rounded flex items-center justify-center"
        >
          +
        </button>
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
  <div className="bg-gray-50 p-5 rounded-lg border">
    <h2 className="text-md font-bold text-gray-800 mb-4">Summary</h2>
    <div className="space-y-2 text-sm">
      {summaryItems.map((item, index) => (
        <div key={index} className="flex justify-between">
          <span>{item.name}</span>
          <span>NGN {item.price.toLocaleString()}</span>
        </div>
      ))}
      <div className="flex justify-between">
        <span>Charges</span>
        <span>NGN 320</span>
      </div>
    </div>
    <div className="border-t border-gray-200 my-4" />
    <div className="flex justify-between text-sm font-semibold text-gray-900">
      <span>Total</span>
      <span>NGN {total.toLocaleString()}</span>
    </div>
    <button
      onClick={onButtonClick}
      disabled={disabled}
      className={`w-full mt-5 py-2.5 text-sm rounded-md font-semibold ${
        disabled
          ? "bg-gray-300 text-gray-600 cursor-not-allowed"
          : "bg-[#092C4C] text-white hover:bg-blue-900"
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
}: {
  total: number;
  summaryItems: SummaryItem[];
  onBack: () => void;
}) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isFormValid =
    formData.firstName && formData.lastName && formData.email && formData.phone;

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-5xl mx-auto bg-white p-8 rounded-xl shadow-sm">
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
        <h1 className="text-xl font-bold text-[#092C4C] mb-6">Buy Ticket</h1>

        {/* Progress Bar (Step 2) */}
        <ProgressBar currentStep={2} />

        {/* Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="md:col-span-2">
            <h2 className="text-lg font-bold text-gray-800 mb-6">
              Contact Information
            </h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="e.g. John"
                />
                <InputField
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="e.g. Doe"
                />
              </div>
              <InputField
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="e.g. johndoe@example.com"
              />
              <InputField
                label="Phone Number"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="e.g. 08012345678"
              />
              <button
                type="submit"
                disabled={!isFormValid}
                className={`w-full mt-6 py-2.5 rounded-md font-semibold ${
                  !isFormValid
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-[#092C4C] text-white hover:bg-blue-900"
                }`}
              >
                Continue to Pay
              </button>
            </form>
          </div>

          {/* Summary Section */}
          <SummaryCard
            total={total}
            summaryItems={summaryItems}
            buttonLabel="Pay"
            onButtonClick={() => console.log("Proceed to Pay")}
            disabled={!isFormValid}
          />
        </div>
      </div>
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
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <input
      type={type}
      name={name}
      id={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-[#092C4C] focus:border-[#092C4C]"
    />
  </div>
);

export default BuyTicketsPage;
