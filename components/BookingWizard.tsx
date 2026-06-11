"use client";
import { useEffect, useMemo, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import { zar, fmtTime, fmtDate, SIZES } from "@/lib/format";
import { PawIcon } from "@/components/Logo";

type Service = { id: string; slug: string; name: string; short_description: string; duration_minutes: number; service_prices: { size: string | null; price: number }[] };
type Slot = { slot_start: string; slot_end: string };

const PAYMENT_METHODS = [
  { value: "payment_link", label: "Payment link", hint: "We send a secure link once confirmed" },
  { value: "eft", label: "Manual EFT", hint: "Bank details on confirmation" },
  { value: "in_person", label: "Pay at the parlour", hint: "Card or cash on the day" },
];

const steps = ["Service", "Your dog", "Date & time", "Your details"];

export default function BookingWizard({ services, initialService, whatsapp }: { services: Service[]; initialService?: string; whatsapp: string }) {
  const sb = useMemo(() => supabaseBrowser(), []);
  const [step, setStep] = useState(0);
  const [serviceId, setServiceId] = useState<string>(() => services.find((s) => s.slug === initialService)?.id ?? "");
  const [size, setSize] = useState<string>("medium");
  const [dogName, setDogName] = useState("");
  const [breed, setBreed] = useState("");
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState<Slot[] | null>(null);
  const [slot, setSlot] = useState<string>("");
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [owner, setOwner] = useState({ name: "", email: "", phone: "", pensioner: false, notes: "", payment: "payment_link" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState<any>(null);

  const service = services.find((s) => s.id === serviceId);
  const price = useMemo(() => {
    if (!service) return null;
    const exact = service.service_prices.find((p) => p.size === size);
    const flat = service.service_prices.find((p) => p.size === null);
    return exact?.price ?? flat?.price ?? null;
  }, [service, size]);

  const minDate = new Date().toISOString().slice(0, 10);
  const maxDate = new Date(Date.now() + 60 * 86400000).toISOString().slice(0, 10);

  useEffect(() => {
    if (!date || !serviceId) { setSlots(null); return; }
    let live = true;
    setLoadingSlots(true);
    setSlot("");
    sb.rpc("get_available_slots", { p_date: date, p_service_id: serviceId }).then(({ data, error }) => {
      if (!live) return;
      setLoadingSlots(false);
      setSlots(error ? [] : (data as Slot[]));
    });
    return () => { live = false; };
  }, [date, serviceId, sb]);

  async function submit() {
    setError("");
    setSubmitting(true);
    const { data, error } = await sb.rpc("create_booking", {
      p_service_id: serviceId,
      p_date: date,
      p_start_time: slot,
      p_owner_name: owner.name,
      p_email: owner.email,
      p_phone: owner.phone,
      p_is_pensioner: owner.pensioner,
      p_dog_name: dogName,
      p_breed: breed,
      p_size: size,
      p_notes: owner.notes,
      p_payment_method: owner.payment,
    });
    setSubmitting(false);
    if (error) {
      setError(error.message.replace(/^.*?: /, ""));
      if (error.message.includes("slot")) {
        // refresh slots if it was taken
        const { data: fresh } = await sb.rpc("get_available_slots", { p_date: date, p_service_id: serviceId });
        setSlots((fresh as Slot[]) ?? []);
        setSlot("");
        setStep(2);
      }
      return;
    }
    setDone(data);
  }

  if (done) {
    return (
      <div className="card mx-auto max-w-xl p-10 text-center">
        <PawIcon className="mx-auto h-10 w-10 text-gold" />
        <h2 className="mt-4 text-3xl">Booking request received!</h2>
        <p className="mt-3 leading-relaxed">
          Thank you — {dogName}&rsquo;s spot is pencilled in for <strong>{fmtDate(done.date)}</strong> at{" "}
          <strong>{fmtTime(done.start_time)}</strong>. We&rsquo;ll confirm shortly and send your payment details.
        </p>
        <p className="mt-4 rounded-2xl bg-lilac-50 px-4 py-3 text-sm">
          Your reference: <strong className="text-plum">{done.reference}</strong>
          {done.amount != null && <> · Estimated price: <strong className="text-plum">{zar(Number(done.amount))}</strong></>}
        </p>
        <a
          href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(`Hi! I've just made a booking request (ref ${done.reference}) for ${dogName}.`)}`}
          target="_blank" rel="noopener noreferrer" className="btn-whatsapp mt-6"
        >
          Chat to us on WhatsApp
        </a>
      </div>
    );
  }

  const canNext =
    step === 0 ? !!serviceId :
    step === 1 ? !!dogName.trim() && !!size :
    step === 2 ? !!date && !!slot :
    !!owner.name.trim() && (!!owner.email.trim() || !!owner.phone.trim());

  return (
    <div className="mx-auto max-w-3xl">
      {/* Stepper */}
      <ol className="mb-10 flex items-center justify-between gap-2" aria-label="Booking steps">
        {steps.map((label, i) => (
          <li key={label} className="flex flex-1 items-center gap-2">
            <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${i <= step ? "bg-plum text-white" : "bg-lilac-100 text-plum-mid"}`}>
              {i + 1}
            </span>
            <span className={`hidden text-xs font-semibold sm:block ${i <= step ? "text-plum" : "text-inkgrey/50"}`}>{label}</span>
            {i < steps.length - 1 && <span className="h-px flex-1 bg-lilac-200" />}
          </li>
        ))}
      </ol>

      {step === 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {services.map((s) => (
            <button
              key={s.id}
              onClick={() => setServiceId(s.id)}
              className={`card p-6 text-left transition-all hover:shadow-lift ${serviceId === s.id ? "ring-2 ring-plum-mid" : ""}`}
            >
              <h3 className="text-base">{s.name}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-inkgrey/80">{s.short_description}</p>
              <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-plum-mid">±{s.duration_minutes} min</p>
            </button>
          ))}
        </div>
      )}

      {step === 1 && (
        <div className="card space-y-6 p-8">
          <div>
            <span className="label">Dog&rsquo;s size</span>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
              {SIZES.map((s) => (
                <button key={s.value} onClick={() => setSize(s.value)}
                  className={`rounded-2xl border px-3 py-3 text-sm font-semibold transition-all ${size === s.value ? "border-plum bg-plum text-white" : "border-lilac-200 bg-white text-plum hover:bg-lilac-50"}`}>
                  {s.label}
                  <span className={`block text-[10px] font-normal ${size === s.value ? "text-white/75" : "text-inkgrey/60"}`}>{s.hint}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="dogname">Dog&rsquo;s name *</label>
              <input id="dogname" className="input" value={dogName} onChange={(e) => setDogName(e.target.value)} placeholder="e.g. Misty" />
            </div>
            <div>
              <label className="label" htmlFor="breed">Breed</label>
              <input id="breed" className="input" value={breed} onChange={(e) => setBreed(e.target.value)} placeholder="e.g. Labrador (or best guess!)" />
            </div>
          </div>
          {price != null && (
            <p className="rounded-2xl bg-lilac-50 px-4 py-3 text-sm">
              Estimated price for {service?.name}: <strong className="text-plum">{zar(Number(price))}</strong>
              <span className="text-inkgrey/60"> — final price confirmed at the parlour.</span>
            </p>
          )}
        </div>
      )}

      {step === 2 && (
        <div className="card space-y-6 p-8">
          <div className="max-w-xs">
            <label className="label" htmlFor="date">Preferred date</label>
            <input id="date" type="date" className="input" min={minDate} max={maxDate} value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          {date && (
            <div>
              <span className="label">Available times {service && <em className="font-normal normal-case text-inkgrey/60">(±{service.duration_minutes} min appointment)</em>}</span>
              {loadingSlots ? (
                <p className="py-6 text-sm text-inkgrey/70">Checking the diary…</p>
              ) : slots && slots.length ? (
                <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-5">
                  {slots.map((s) => (
                    <button key={s.slot_start} onClick={() => setSlot(s.slot_start)}
                      className={`rounded-xl border px-2 py-2.5 text-sm font-semibold transition-all ${slot === s.slot_start ? "border-plum bg-plum text-white" : "border-lilac-200 bg-white text-plum hover:bg-lilac-50"}`}>
                      {fmtTime(s.slot_start)}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="rounded-2xl bg-lilac-50 px-4 py-4 text-sm">
                  No open slots on this day — we may be closed or fully booked. Try another date, or WhatsApp us and we&rsquo;ll find a gap.
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {step === 3 && (
        <div className="card space-y-5 p-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="oname">Your name *</label>
              <input id="oname" className="input" value={owner.name} onChange={(e) => setOwner({ ...owner, name: e.target.value })} />
            </div>
            <div>
              <label className="label" htmlFor="ophone">Phone / WhatsApp</label>
              <input id="ophone" className="input" value={owner.phone} onChange={(e) => setOwner({ ...owner, phone: e.target.value })} placeholder="+27…" />
            </div>
          </div>
          <div>
            <label className="label" htmlFor="oemail">Email</label>
            <input id="oemail" type="email" className="input" value={owner.email} onChange={(e) => setOwner({ ...owner, email: e.target.value })} />
            <p className="mt-1.5 text-xs text-inkgrey/60">Please give at least an email or phone number so we can confirm.</p>
          </div>
          <label className="flex items-center gap-3 rounded-2xl bg-lilac-50 px-4 py-3 text-sm">
            <input type="checkbox" className="h-4 w-4 accent-plum" checked={owner.pensioner} onChange={(e) => setOwner({ ...owner, pensioner: e.target.checked })} />
            <span>I&rsquo;m a pensioner — apply the pensioner discount</span>
          </label>
          <div>
            <label className="label" htmlFor="onotes">Notes for us</label>
            <textarea id="onotes" rows={4} className="input" value={owner.notes} onChange={(e) => setOwner({ ...owner, notes: e.target.value })}
              placeholder="Behaviour, coat condition, medical issues, or anything that helps us care for your dog…" />
          </div>
          <div>
            <span className="label">Preferred payment method</span>
            <div className="grid gap-3 sm:grid-cols-3">
              {PAYMENT_METHODS.map((m) => (
                <button key={m.value} onClick={() => setOwner({ ...owner, payment: m.value })}
                  className={`rounded-2xl border px-4 py-3 text-left text-sm transition-all ${owner.payment === m.value ? "border-plum bg-plum text-white" : "border-lilac-200 bg-white text-plum hover:bg-lilac-50"}`}>
                  <span className="font-semibold">{m.label}</span>
                  <span className={`block text-xs ${owner.payment === m.value ? "text-white/75" : "text-inkgrey/60"}`}>{m.hint}</span>
                </button>
              ))}
            </div>
          </div>
          {service && date && slot && (
            <p className="rounded-2xl border border-gold/40 bg-gold/10 px-4 py-3 text-sm text-plum">
              <strong>{service.name}</strong> for <strong>{dogName || "your dog"}</strong> · {fmtDate(date)} at {fmtTime(slot)}
              {price != null && <> · est. {zar(Number(price))}{owner.pensioner ? " (before pensioner discount)" : ""}</>}
            </p>
          )}
        </div>
      )}

      {error && <p className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{error}</p>}

      <div className="mt-8 flex items-center justify-between">
        <button className="btn-ghost" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>Back</button>
        {step < 3 ? (
          <button className="btn-primary" onClick={() => canNext && setStep(step + 1)} disabled={!canNext}>Continue</button>
        ) : (
          <button className="btn-primary" onClick={submit} disabled={!canNext || submitting}>
            {submitting ? "Sending…" : "Send booking request"}
          </button>
        )}
      </div>
    </div>
  );
}
