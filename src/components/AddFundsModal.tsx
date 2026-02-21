import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Separator } from './ui/separator';
import {
  CreditCard,
  Wallet,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  Building2,
  Smartphone,
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface AddFundsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentBalance: number;
  onAddFunds: (amount: number) => void;
}

export default function AddFundsModal({
  open,
  onOpenChange,
  currentBalance,
  onAddFunds,
}: AddFundsModalProps) {
  const [amount, setAmount] = useState<string>('');
  const [customAmount, setCustomAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank' | 'wallet'>('card');
  const [isProcessing, setIsProcessing] = useState(false);

  const quickAmounts = [10, 25, 50, 100, 200, 500];
  const MIN_AMOUNT = 10;
  const MAX_AMOUNT = 1000;

  const getSelectedAmount = () => {
    return amount === 'custom' ? parseFloat(customAmount) || 0 : parseFloat(amount) || 0;
  };

  const validateAmount = () => {
    const selectedAmount = getSelectedAmount();
    
    if (!selectedAmount || selectedAmount <= 0) {
      toast.error('Please select or enter an amount');
      return false;
    }
    
    if (selectedAmount < MIN_AMOUNT) {
      toast.error(`Minimum amount is $${MIN_AMOUNT}`);
      return false;
    }
    
    if (selectedAmount > MAX_AMOUNT) {
      toast.error(`Maximum amount is $${MAX_AMOUNT} per transaction`);
      return false;
    }
    
    return true;
  };

  const handleAddFunds = async () => {
    if (!validateAmount()) return;

    setIsProcessing(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    const selectedAmount = getSelectedAmount();
    onAddFunds(selectedAmount);
    
    toast.success('Funds added successfully!', {
      description: `$${selectedAmount.toFixed(2)} has been added to your wallet`,
    });

    setIsProcessing(false);
    onOpenChange(false);
    
    // Reset form
    setAmount('');
    setCustomAmount('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-[#00B4D8]" />
            Add Funds to Wallet
          </DialogTitle>
          <DialogDescription>
            Add money to your SkinPAI wallet for faster checkouts and exclusive rewards
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Balance */}
          <div className="p-4 bg-gradient-to-r from-[#00B4D8]/10 to-[#006D77]/10 rounded-lg border border-[#00B4D8]/20">
            <p className="text-sm text-muted-foreground mb-1">Current Balance</p>
            <p className="text-2xl font-bold text-[#006D77]">${currentBalance.toFixed(2)}</p>
          </div>

          {/* Quick Amount Selection */}
          <div className="space-y-3">
            <Label>Select Amount</Label>
            <div className="grid grid-cols-3 gap-2">
              {quickAmounts.map((amt) => (
                <Button
                  key={amt}
                  variant={amount === amt.toString() ? 'default' : 'outline'}
                  className={
                    amount === amt.toString()
                      ? 'bg-[#00B4D8] hover:bg-[#00B4D8]/90'
                      : ''
                  }
                  onClick={() => {
                    setAmount(amt.toString());
                    setCustomAmount('');
                  }}
                >
                  ${amt}
                </Button>
              ))}
            </div>
          </div>

          {/* Custom Amount */}
          <div className="space-y-2">
            <Label>Or Enter Custom Amount</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    setAmount('custom');
                  }}
                  className="pl-9"
                  min={MIN_AMOUNT}
                  max={MAX_AMOUNT}
                  step="0.01"
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Min: ${MIN_AMOUNT} • Max: ${MAX_AMOUNT} per transaction
            </p>
          </div>

          <Separator />

          {/* Payment Method */}
          <Tabs value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as any)} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="card" className="text-xs">
                <CreditCard className="w-3 h-3 mr-1" />
                Card
              </TabsTrigger>
              <TabsTrigger value="bank" className="text-xs">
                <Building2 className="w-3 h-3 mr-1" />
                Bank
              </TabsTrigger>
              <TabsTrigger value="wallet" className="text-xs">
                <Smartphone className="w-3 h-3 mr-1" />
                Digital
              </TabsTrigger>
            </TabsList>

            <TabsContent value="card" className="space-y-3 mt-4">
              <div className="space-y-2">
                <Label>Card Information</Label>
                <Input placeholder="Card number" />
                <div className="grid grid-cols-2 gap-2">
                  <Input placeholder="MM/YY" />
                  <Input placeholder="CVC" />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="bank" className="space-y-3 mt-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">Bank Transfer</p>
                    <p className="text-xs text-blue-700 mt-1">
                      Funds will be available within 2-3 business days
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Account Number</Label>
                <Input placeholder="Enter account number" />
                <Label>Routing Number</Label>
                <Input placeholder="Enter routing number" />
              </div>
            </TabsContent>

            <TabsContent value="wallet" className="space-y-3 mt-4">
              <RadioGroup defaultValue="paypal">
                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                  <RadioGroupItem value="paypal" id="paypal" />
                  <Label htmlFor="paypal" className="flex-1 cursor-pointer">
                    PayPal
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                  <RadioGroupItem value="applepay" id="applepay" />
                  <Label htmlFor="applepay" className="flex-1 cursor-pointer">
                    Apple Pay
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                  <RadioGroupItem value="googlepay" id="googlepay" />
                  <Label htmlFor="googlepay" className="flex-1 cursor-pointer">
                    Google Pay
                  </Label>
                </div>
              </RadioGroup>
            </TabsContent>
          </Tabs>

          {/* Summary */}
          {getSelectedAmount() > 0 && (
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Amount to add</span>
                <span className="font-medium">${getSelectedAmount().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Processing fee</span>
                <span className="font-medium">$0.00</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="font-semibold">New Balance</span>
                <span className="font-bold text-[#00B4D8]">
                  ${(currentBalance + getSelectedAmount()).toFixed(2)}
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-[#00B4D8] hover:bg-[#00B4D8]/90"
              onClick={handleAddFunds}
              disabled={isProcessing || getSelectedAmount() === 0}
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Add Funds
                </>
              )}
            </Button>
          </div>

          {/* Security Notice */}
          <div className="flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-green-800">
              Your payment information is encrypted and secure. We never store your card details.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
