"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { useRazorpayPayout, usePaypalPayout } from "@/hooks/payoutHooks"
import { Loader2, Landmark, Mail, ArrowLeft } from "lucide-react"

export default function PayoutDialog() {
  const [method, setMethod] = useState<"BANK" | "PAYPAL" | null>(null)
  const [bankDetails, setBankDetails] = useState({
    accountNumber: "",
    ifscNumber: "",
    accountHolderName: "",
  })
  const [paypalEmail, setPaypalEmail] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // hooks
  const { mutate: razorpayPayout, isPending: isRzpPending } = useRazorpayPayout()

  const { mutate: paypalPayout, isPending: isPaypalPending } = usePaypalPayout()

  useEffect(() => {
    if (!isDialogOpen) {
      setMethod(null)
      setBankDetails({ accountNumber: "", ifscNumber: "", accountHolderName: "" })
      setPaypalEmail("")
    }
  }, [isDialogOpen])

  const handleSubmit = () => {
    if (method === "BANK") {
      if (!bankDetails.accountNumber || !bankDetails.ifscNumber || !bankDetails.accountHolderName) {
        toast.error("⚠️ Please fill all bank details")
        return
      }

      // Show processing toast
      toast.loading("🏦 Processing your bank withdrawal request...", {
        id: "bank-withdrawal"
      })

      razorpayPayout(bankDetails, {
        onSuccess: () => {
          // Dismiss loading toast
          toast.dismiss("bank-withdrawal")
          
          // Show success toast
          toast.success("🎉 Withdrawal Successful! Your money is on the way to your bank account.", {
            duration: 4000,
            description: "Your funds will be transferred within 1-2 business days"
          })
          
          setIsDialogOpen(false)
          
          // Reload page after 2 seconds to show updated balance
          setTimeout(() => {
            window.location.reload()
          }, 2000)
        },
        onError: (error: any) => {
          // Dismiss loading toast
          toast.dismiss("bank-withdrawal")
          
          // Show error toast with details
          const errorMessage = error?.response?.data?.message || error?.message || "Failed to process bank payout"
          toast.error("❌ Withdrawal Failed", {
            description: errorMessage,
            duration: 5000
          })
        },
      })
    }

    if (method === "PAYPAL") {
      if (!paypalEmail) {
        toast.error("⚠️ Please enter PayPal email")
        return
      }

      // Show processing toast
      toast.loading("💳 Processing your PayPal withdrawal request...", {
        id: "paypal-withdrawal"
      })

      paypalPayout(paypalEmail, {
        onSuccess: () => {
          // Dismiss loading toast
          toast.dismiss("paypal-withdrawal")
          
          // Show success toast
          toast.success("🎉 Withdrawal Successful! Check your PayPal account.", {
            duration: 4000,
            description: "Your funds have been sent to your PayPal email"
          })
          
          setIsDialogOpen(false)
          
          // Reload page after 2 seconds to show updated balance
          setTimeout(() => {
            window.location.reload()
          }, 2000)
        },
        onError: (error: any) => {
          // Dismiss loading toast
          toast.dismiss("paypal-withdrawal")
          
          // Show error toast with details
          const errorMessage = error?.response?.data?.message || error?.message || "Failed to process PayPal payout"
          toast.error("❌ Withdrawal Failed", {
            description: errorMessage,
            duration: 5000
          })
        },
      })
    }
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Payout</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg p-0 overflow-hidden">
        <DialogHeader className="border-b bg-muted/40 px-6 py-4">
          <DialogTitle className="text-pretty">Choose payout method</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Select how you'd like to receive your funds. You can review details before submitting.
          </p>
        </DialogHeader>

        <div className="px-6 py-5">
          {!method && (
            <div className="grid gap-3">
              <Button
                variant="outline"
                className="group flex items-center justify-between rounded-lg border bg-card p-4 text-left transition-shadow hover:bg-accent/50 hover:shadow-md"
                onClick={() => setMethod("BANK")}
              >
                <span className="flex items-center gap-3">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-muted text-muted-foreground">
                    <Landmark className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="flex flex-col">
                    <span className="font-medium">Indian Bank Account</span>
                    <span className="text-xs text-muted-foreground">🇮🇳 Transfer via bank</span>
                  </span>
                </span>
                <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">Instant · No fees</span>
              </Button>

              <Button
                variant="outline"
                className="group flex items-center justify-between rounded-lg border bg-card p-4 text-left transition-shadow hover:bg-accent/50 hover:shadow-md"
                onClick={() => setMethod("PAYPAL")}
              >
                <span className="flex items-center gap-3">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-muted text-muted-foreground">
                    <Mail className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="flex flex-col">
                    <span className="font-medium">PayPal</span>
                    <span className="text-xs text-muted-foreground">Use your PayPal email</span>
                  </span>
                </span>
                <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">3–9% fees</span>
              </Button>
            </div>
          )}

          {method === "BANK" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-muted text-muted-foreground">
                    <Landmark className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <h3 className="text-sm font-medium">Bank transfer details</h3>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setMethod(null)}
                  className="gap-1 text-muted-foreground"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
              </div>

              <p className="rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                ⚠️ Please verify your details carefully. Wrong info means money cannot be recovered.
              </p>

              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label htmlFor="accountNumber" className="text-sm font-medium">
                    Account Number
                  </label>
                  <Input
                    id="accountNumber"
                    placeholder="e.g., 1234 5678 9012"
                    value={bankDetails.accountNumber}
                    onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="ifscNumber" className="text-sm font-medium">
                    IFSC Code
                  </label>
                  <Input
                    id="ifscNumber"
                    placeholder="e.g., HDFC0001234"
                    value={bankDetails.ifscNumber}
                    onChange={(e) => setBankDetails({ ...bankDetails, ifscNumber: e.target.value })}
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="accountHolderName" className="text-sm font-medium">
                    Account Holder Name
                  </label>
                  <Input
                    id="accountHolderName"
                    placeholder="e.g., Rohan Sharma"
                    value={bankDetails.accountHolderName}
                    onChange={(e) => setBankDetails({ ...bankDetails, accountHolderName: e.target.value })}
                  />
                </div>
              </div>

              <Button className="w-full gap-2" onClick={handleSubmit} disabled={isRzpPending}>
                {isRzpPending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
                {isRzpPending ? "Processing..." : "Submit Bank Details"}
              </Button>

              <p className="text-xs text-muted-foreground">
                By submitting, you confirm the account is in your name and details are correct.
              </p>
            </div>
          )}

          {method === "PAYPAL" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-muted text-muted-foreground">
                    <Mail className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <h3 className="text-sm font-medium">Connect PayPal</h3>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setMethod(null)}
                  className="gap-1 text-muted-foreground"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="paypalEmail" className="text-sm font-medium">
                  PayPal Email
                </label>
                <Input
                  id="paypalEmail"
                  placeholder="your-email@paypal.com"
                  value={paypalEmail}
                  onChange={(e) => setPaypalEmail(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Ensure the email matches your PayPal account to avoid delays.
                </p>
              </div>

              <Button className="w-full gap-2" onClick={handleSubmit} disabled={isPaypalPending}>
                {isPaypalPending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
                {isPaypalPending ? "Processing..." : "Connect PayPal"}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}