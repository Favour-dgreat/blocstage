"use client";

import { useState } from 'react';
import { Plus, Trash2, Ticket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

interface TicketType {
  id: string;
  name: string;
  type: string;
  quantity: string;
  purchaseLimit: string;
  currency: string;
  amount: string;
  benefits: string;
  isTransferable: boolean;
  isResellable: boolean;
  isNFT: boolean;
   availableTickets?: string; 
}

interface TicketsFormProps {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function TicketsForm({ data, onUpdate, onNext, onBack }: TicketsFormProps) {
  const [tickets, setTickets] = useState<TicketType[]>(
    data.tickets?.length > 0 ? data.tickets : []
  );

  const addNewTicket = () => {
    const newTicket: TicketType = {
      id: Date.now().toString(),
      name: '',
      type: '',
      quantity: '',
      purchaseLimit: '5',
      currency: 'Naira',
      amount: '',
      benefits: '',
      isTransferable: false,
      isResellable: false,
      isNFT: false,
      availableTickets: ''
    };
    const updatedTickets = [...tickets, newTicket];
    setTickets(updatedTickets);
    onUpdate({ tickets: updatedTickets });
  };

  const updateTicket = (id: string, field: string, value: any) => {
    const updatedTickets = tickets.map(ticket =>
      ticket.id === id ? { ...ticket, [field]: value } : ticket
    );
    setTickets(updatedTickets);
    onUpdate({ tickets: updatedTickets });
  };

  const removeTicket = (id: string) => {
    const updatedTickets = tickets.filter(ticket => ticket.id !== id);
    setTickets(updatedTickets);
    onUpdate({ tickets: updatedTickets });
  };

  const addBenefit = (ticketId: string) => {
    // This would typically open a modal or expand the benefits section
    console.log('Add benefit for ticket:', ticketId);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column - Ticket Creation Form */}
      <div className="lg:col-span-2">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Create Ticket</h2>
          <p className="text-gray-600">Set up ticket type for the event</p>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Tickets</h3>
            
            {tickets.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Ticket className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 mb-4">No Tickets Yet</p>
                <Button onClick={addNewTicket} className="bg-blue-900 hover:bg-blue-800">
                  Add Ticket
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {tickets.map((ticket) => (
                  <div key={ticket.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Ticket Name
                        </label>
                        <Input
                          value={ticket.name}
                          onChange={(e) => updateTicket(ticket.id, 'name', e.target.value)}
                          placeholder="e.g Regular"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Ticket Type
                        </label>
                        <Select
                          value={ticket.type}
                          onValueChange={(value) => updateTicket(ticket.id, 'type', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select option" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="regular">Regular</SelectItem>
                            <SelectItem value="vip">VIP</SelectItem>
                            <SelectItem value="early-bird">Early Bird</SelectItem>
                            <SelectItem value="student">Student</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Quantity
                        </label>
                        <Select
                          value={ticket.quantity}
                          onValueChange={(value) => updateTicket(ticket.id, 'quantity', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select option" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="unlimited">Unlimited</SelectItem>
                            <SelectItem value="limited">Limited</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Purchase Limit
                        </label>
                        <Select
                          value={ticket.purchaseLimit}
                          onValueChange={(value) => updateTicket(ticket.id, 'purchaseLimit', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1</SelectItem>
                            <SelectItem value="2">2</SelectItem>
                            <SelectItem value="5">5</SelectItem>
                            <SelectItem value="10">10</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {ticket.quantity === 'limited' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Available Tickets
                          </label>
                          <Input
                            type="number"
                            placeholder="400"
                            onChange={(e) => updateTicket(ticket.id, 'availableTickets', e.target.value)}
                          />
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Payment Currency
                        </label>
                        <Select
                          value={ticket.currency}
                          onValueChange={(value) => updateTicket(ticket.id, 'currency', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Naira">Naira</SelectItem>
                            <SelectItem value="USD">USD</SelectItem>
                            <SelectItem value="EUR">EUR</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Amount
                        </label>
                        <Input
                          type="number"
                          value={ticket.amount}
                          onChange={(e) => updateTicket(ticket.id, 'amount', e.target.value)}
                          placeholder="4,000"
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Benefits
                        </label>
                        <button
                          onClick={() => addBenefit(ticket.id)}
                          className="text-sm text-orange-500 hover:text-orange-600"
                        >
                          + Add Benefit
                        </button>
                      </div>
                      <Textarea
                        value={ticket.benefits}
                        onChange={(e) => updateTicket(ticket.id, 'benefits', e.target.value)}
                        placeholder="e.g Free drinks"
                        rows={2}
                      />
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={ticket.isNFT}
                            onCheckedChange={(checked) => updateTicket(ticket.id, 'isNFT', checked)}
                          />
                          <span className="text-sm text-gray-700">NFT</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={ticket.isTransferable}
                            onCheckedChange={(checked) => updateTicket(ticket.id, 'isTransferable', checked)}
                          />
                          <span className="text-sm text-gray-700">Transfer Ticket</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={ticket.isResellable}
                            onCheckedChange={(checked) => updateTicket(ticket.id, 'isResellable', checked)}
                          />
                          <span className="text-sm text-gray-700">Resell Ticket</span>
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

                    <Button
                      className="w-full bg-blue-900 hover:bg-blue-800"
                      onClick={addNewTicket}
                    >
                      Add Ticket
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Column - Ticket List */}
      <div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Ticket List</h3>
          
          {tickets.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Ticket className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 mb-4">No Tickets Yet</p>
            </div>
          ) : (
            <div className="space-y-4 mb-6">
              {tickets.map((ticket) => (
                <div key={ticket.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900">{ticket.name || 'Regular'}</h4>
                    <span className="text-sm text-orange-500">
                      {ticket.benefits ? ticket.benefits.split(',').length : 0} Benefits
                    </span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900 mb-1">
                    {ticket.currency === 'Naira' ? 'NGN' : ticket.currency} {ticket.amount || '5000'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {ticket.quantity === 'unlimited' ? 'Unlimited' : `${ticket.availableTickets || '100'} Tickets`}
                  </p>
                </div>
              ))}
            </div>
          )}

          <Button
            className="w-full bg-blue-900 hover:bg-blue-800 mb-4"
            disabled={tickets.length === 0}
          >
            Preview Website
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <div className="lg:col-span-3 flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={onBack}
          className="px-6 py-2"
        >
          Back
        </Button>
        <Button
          onClick={onNext}
          className="px-8 py-2 bg-blue-900 text-white hover:bg-blue-800"
        >
          Next
        </Button>
      </div>
    </div>
  );
}