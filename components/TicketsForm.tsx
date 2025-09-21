"use client";

import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import Image from "next/image";

interface TicketType {
  id: string;
  name: string;
  description: string;
  price: string;
  currency: string;
  is_free: boolean;
  total_supply: number;
}

interface TicketsFormProps {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}
const createEmptyTicket = (): TicketType => ({
    id: Date.now().toString(),
    name: "",
    description: "",
    price: "0.00",
    currency: "USDC",
    is_free: false,
    total_supply: 0,
  });

export default function TicketsForm({
  data,
  onUpdate,
  onNext,
  onBack,
}: TicketsFormProps) {
  const [tickets, setTickets] = useState<TicketType[]>(
    data.tickets?.length > 0 ? data.tickets : [createEmptyTicket()]
  );
  const [hasTickets, setHasTickets] = useState(tickets.length > 0);

  

  useEffect(() => {
    setHasTickets(tickets.length > 0);
  }, [tickets]);

  const addNewTicket = () => {
    const newTicket = createEmptyTicket();
    const updatedTickets = [...tickets, newTicket];
    setTickets(updatedTickets);
    onUpdate({ tickets: updatedTickets });
  };

  const updateTicket = (id: string, field: string, value: any) => {
    const updatedTickets = tickets.map((ticket) =>
      ticket.id === id ? { ...ticket, [field]: value } : ticket
    );
    setTickets(updatedTickets);
    onUpdate({ tickets: updatedTickets });
  };

  const removeTicket = (id: string) => {
    const updatedTickets = tickets.filter((ticket) => ticket.id !== id);
    setTickets(updatedTickets);
    onUpdate({ tickets: updatedTickets });
  };



  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column - Ticket Creation Form */}
      <div className="lg:col-span-2">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Create Ticket
          </h2>
          <p className="text-gray-600">Set up ticket type for the event</p>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6">
            <h3 className="text-lg font-medium text-[#282828] mb-6">Tickets</h3>

            <div className="space-y-6">
              {hasTickets &&
                tickets.map((ticket) => (
                  <div key={ticket.id}>
                    {/* Ticket Name & Type */}
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-4">
                      <div className="relative z-10">
                        <label className="block text-sm font-medium text-[#BDBDBD] mb-4">
                          Ticket Name
                        </label>
                        <Input
                          value={ticket.name}
                          onChange={(e) =>
                            updateTicket(ticket.id, "name", e.target.value)
                          }
                          className="rounded-sm"
                          placeholder="e.g Regular"
                        />
                      </div>

                      <div className="relative z-10">
                        <label className="block text-sm font-medium text-[#BDBDBD] mb-4">
                          Ticket Type
                        </label>
                        <Select
                          value="regular"
                          onValueChange={() => {}}
                        >
                          <SelectTrigger className="rounded-sm">
                            <SelectValue placeholder="Select option" />
                          </SelectTrigger>
                          <SelectContent
                            position="popper"
                            className="z-50 bg-white border border-gray-200 shadow-md  rounded-md"
                          >
                            <SelectItem value="regular" className="hover:bg-gray-100">Regular</SelectItem>
                            <SelectItem value="vip" className="hover:bg-gray-100">VIP </SelectItem>
                            <SelectItem value="early-bird" className="hover:bg-gray-100">
                              Early Bird
                            </SelectItem>
                            <SelectItem value="student" className="hover:bg-gray-100">Student</SelectItem>
                            <SelectItem value="group" className="hover:bg-gray-100">Group</SelectItem>
                            <SelectItem value="premium" className="hover:bg-gray-100">Premium</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Quantity & Purchase Limit */}
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-4">
                      <div className="relative z-10">
                        <label className="block text-sm font-medium text-[#BDBDBD] mb-4">
                          Quantity
                        </label>
                        <Select
                          value="unlimited"
                          onValueChange={() => {}}
                        >
                          <SelectTrigger className="rounded-sm">
                            <SelectValue placeholder="Select option" />
                          </SelectTrigger>
                          <SelectContent
                            position="popper"
                            className="z-50 bg-white border  border-gray-200 shadow-md rounded-md"
                          >
                            <SelectItem value="unlimited" className="hover:bg-gray-100">Unlimited</SelectItem>
                            <SelectItem value="limited"className="hover:bg-gray-100" >Limited</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="relative z-10">
                        <label className="block text-sm font-medium text-[#BDBDBD] mb-4">
                          Purchase Limit
                        </label>
                        <Select
                          value="5"
                          onValueChange={() => {}}
                        >
                          <SelectTrigger className="rounded-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent
                            position="popper"
                            className="z-50 bg-white border border-gray-200 shadow-md rounded-md"
                          >
                            <SelectItem value="1" className="hover:bg-gray-100">1</SelectItem>
                            <SelectItem value="2" className="hover:bg-gray-100">2</SelectItem>
                            <SelectItem value="5" className="hover:bg-gray-100">5</SelectItem>
                            <SelectItem value="10" className="hover:bg-gray-100">10</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                        <div className="relative z-10">
                          <label className="block text-sm font-medium text-[#BDBDBD] mb-4">
                            Available Tickets
                          </label>
                          <Input
                            type="number"
                            placeholder="400"
                            className="rounded-sm"
                          value={ticket.total_supply}
                            onChange={(e) =>
                              updateTicket(
                                ticket.id,
                              "total_supply",
                              parseInt(e.target.value) || 0
                              )
                            }
                          />
                        </div>
                    </div>

                    {/* Currency & Amount */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="relative z-10">
                        <label className="block text-sm font-medium text-[#BDBDBD] mb-4">
                          Payment Currency
                        </label>
                        <Select
                          value={ticket.currency}
                          onValueChange={(value) =>
                            updateTicket(ticket.id, "currency", value)
                          }
                        >
                          <SelectTrigger className="rounded-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent
                            position="popper"
                            className="z-50 bg-white border border-gray-200 shadow-md rounded-md"
                          >
                            <SelectItem value="USDC" className="hover:bg-gray-100">USDC</SelectItem>
                            <SelectItem value="USD" className="hover:bg-gray-100">USD</SelectItem>
                            <SelectItem value="EUR" className="hover:bg-gray-100">EUR</SelectItem>
                            <SelectItem value="NGN" className="hover:bg-gray-100">NGN</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="relative z-10">
                        <label className="block text-sm font-medium text-[#BDBDBD] mb-4">
                          Price
                        </label>
                        <Input
                          type="text"
                          className="rounded-sm"
                          value={ticket.price}
                          onChange={(e) =>
                            updateTicket(ticket.id, "price", e.target.value)
                          }
                          placeholder="10.00"
                          disabled={ticket.is_free}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-700">
                          Free Event
                        </span>
                        <Switch
                          checked={ticket.is_free}
                          onCheckedChange={(checked) =>
                            updateTicket(ticket.id, "is_free", checked)
                          }
                          className={
                            ticket.is_free
                              ? "bg-[#F56630] text-white hover:bg-[#F56630]"
                              : "bg-[#E4E7EC] text-gray-600 border-gray-300 hover:bg-gray-100"
                          }
                        />
                      </div>
                      {ticket.is_free && (
                        <div className="text-sm text-green-600 bg-green-50 p-2 rounded">
                          ✓ This ticket will be free for attendees
                        </div>
                      )}
                    </div>

                    {/* Ticket Description */}
                    <div className="mb-4 relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <label className="block text-sm font-medium text-[#BDBDBD]">
                          Ticket Description
                        </label>
                      </div>
                      <Textarea
                        value={ticket.description}
                        onChange={(e) =>
                          updateTicket(ticket.id, "description", e.target.value)
                        }
                        className="rounded-sm"
                        placeholder="e.g Free tickets for general attendees"
                        rows={3}
                      />
                    </div>

                    {/* Benefits */}
                    <div className="mb-4 relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <label className="block text-sm font-medium text-[#BDBDBD]">
                          Benefits
                        </label>
                      </div>
                      <div className="flex items-center mb-2">
                          <Input
                            type="text"
                            className="rounded-sm flex-grow mr-2"
                            placeholder="e.g. Free drinks"
                          disabled
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          disabled
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      <button
                        type="button"
                        className="text-sm text-orange-500 hover:text-orange-600"
                        disabled
                      >
                        + Add Benefit
                      </button>
                    </div>

                    {/* Switches & Delete */}
                    <div className="flex items-center justify-between mb-4 relative z-10">
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-700">
                            Transfer Ticket
                          </span>
                          <Switch
                            checked={false}
                            onCheckedChange={() => {}}
                            className="bg-[#E4E7EC] text-gray-600 border-gray-300 hover:bg-gray-100"
                            disabled
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-700">
                            Resell Ticket
                          </span>
                          <Switch
                            checked={false}
                            onCheckedChange={() => {}}
                            className="bg-[#E4E7EC] text-gray-600 border-gray-300 hover:bg-gray-100"
                            disabled
                          />
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTicket(ticket.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}

              <Button
                className="w-full bg-[#092C4C] hover:bg-[#092C4C] text-white"
                onClick={addNewTicket}
              >
                Add Ticket
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Ticket List */}
      <div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Ticket List
          </h3>
          <div className="space-y-4 mb-6">
            {!hasTickets ? (
              <div className="flex flex-col items-center justify-center text-center py-8">
                <Image
                  src="/images/ticket.png"
                  height={200}
                  width={200}
                  alt="Ticket Image"
                  className="w-24 h-auto mb-4"
                />
                <p className="text-gray-500">No Tickets Yet</p>
              </div>
            ) : (
              tickets.map((ticket) => (
                <div key={ticket.id} className="">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900">
                      {ticket.name || "Regular"}
                    </h4>
                    <span className="text-sm text-[#E04E1E] bg-[#FBEAE4] p-1 rounded">
                      0 Benefits
                    </span>
                  </div>

                  <div className="flex justify-between items-center gap-6 mb-2">
                    <p className="text-sm font-semibold text-[#4F4F4F] mb-1">
                      {ticket.is_free ? "FREE" : `${ticket.currency} ${ticket.price}`}
                    </p>
                    <p className="text-sm text-gray-500">
                      {ticket.total_supply || 0} Tickets
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          <Button
            className="w-full bg-[#092C4C] text-white hover:bg-[#092C4C] mb-4"
            disabled={!hasTickets}
          >
            Preview Website
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <div className="lg:col-span-3 flex justify-between mt-8">
        <Button variant="outline" onClick={onBack} className="px-6 py-2">
          Back
        </Button>
        <Button
          onClick={onNext}
          className="px-8 py-2 bg-[#092C4C] text-white hover:bg-[#092C4C]"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
