import { useState } from "react";

import { CreditCard, Copy, Check, Smartphone, Landmark, QrCode } from "lucide-react";

import cbeQr from "@/assets/cbe-qr.png";

// ========================
// COPY FIELD COMPONENT
// ========================
function CopyField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1600);
    } catch {
      //
    }
  };

  return (
    <div className="flex items-center justify-between rounded-2xl border border-red-100 bg-red-50/40 px-4 py-3">
      <div>
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>

        <p className="mt-1 text-sm font-semibold text-foreground">{value}</p>
      </div>

      <button
        onClick={handleCopy}
        className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-medium transition ${
          copied
            ? "border-green-200 bg-green-50 text-green-700"
            : "border-red-100 bg-white text-muted-foreground hover:bg-red-50"
        }`}
      >
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5" strokeWidth={2} />
            Copied
          </>
        ) : (
          <>
            <Copy className="h-3.5 w-3.5" strokeWidth={1.8} />
            Copy
          </>
        )}
      </button>
    </div>
  );
}

// ========================
// CARD COMPONENT
// ========================
function PaymentCard({
  children,
  icon: Icon,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  icon: any;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="overflow-hidden rounded-[28px] border border-red-100 bg-white shadow-[0_6px_24px_rgba(0,0,0,0.05)]">
      {/* TOP */}
      <div className="border-b border-red-100 bg-gradient-to-r from-red-50 to-white px-5 py-4">
        <div className="flex items-start gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-primary text-white shadow-sm">
            <Icon className="h-5 w-5" strokeWidth={1.8} />
          </div>

          <div>
            <h2 className="text-sm font-semibold text-foreground">{title}</h2>

            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{subtitle}</p>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-5">{children}</div>
    </div>
  );
}

// ========================
// PAYMENT PAGE
// ========================
export default function PaymentPage() {
  return (
    <div className="mx-auto min-h-screen max-w-lg bg-background px-4 pt-5 pb-28">
      {/* HEADER */}
      <div className="mb-6">
        <div className="rounded-[28px] border border-red-100 bg-gradient-to-br from-white to-red-50/60 p-5 shadow-[0_6px_24px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-white shadow-sm">
              <CreditCard className="h-5 w-5" strokeWidth={1.8} />
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-tight text-foreground">Payment Methods</h1>

              <p className="mt-1 text-xs text-muted-foreground">Fast and secure payment options</p>
            </div>
          </div>
        </div>
      </div>

      {/* PAYMENT METHODS */}
      <div className="space-y-4">
        {/* ================= CBE QR ================= */}
        <PaymentCard
          icon={QrCode}
          title="Commercial Bank of Ethiopia"
          subtitle="Scan the QR code below to complete your payment securely."
        >
          <div className="flex justify-center">
            <div className="rounded-[26px] border border-red-100 bg-gradient-to-b from-red-50/40 to-white p-4 shadow-sm">
              <img src={cbeQr} alt="CBE QR Code" className="h-52 w-52 rounded-2xl object-contain" />
            </div>
          </div>

          <div className="mt-5 text-center">
            <h3 className="text-sm font-semibold text-foreground">Smash & Co Café</h3>

            <p className="mt-1 text-xs text-muted-foreground">Official CBE QR Payment Account</p>
          </div>
        </PaymentCard>
        
        {/* ================= CBE BANK ================= */}
        <PaymentCard
          icon={Landmark}
          title="CBE Bank Transfer"
          subtitle="Transfer directly using the bank account details below."
        >
          <div className="space-y-3">
            <CopyField label="Account Name" value="Smash & Co Café" />

            <CopyField label="Account Number" value="1000123456789" />
          </div>
        </PaymentCard>

        {/* ================= TELEBIRR ================= */}
        <PaymentCard
          icon={Smartphone}
          title="Telebirr"
          subtitle="Send money directly using Telebirr mobile transfer."
        >
          <div className="mb-4 rounded-2xl border border-red-100 bg-red-50/40 px-4 py-3">
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              Account Holder
            </p>

            <h3 className="mt-1 text-sm font-semibold text-foreground">Smash & Co Café</h3>
          </div>

          <CopyField label="Phone Number" value="+251 91 123 4567" />
        </PaymentCard>

      </div>
    </div>
  );
}
