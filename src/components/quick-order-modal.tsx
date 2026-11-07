'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Loader2, Phone, Lock, Zap, CheckCircle2 } from 'lucide-react';
import { Modal } from './ui/dialog';
import { Button } from './ui/button';
import { api } from '@/lib/client';
import {
  addDays,
  countPhoneOrders,
  FREE_PHONE_ORDER_LIMIT,
  isStarterOrAbove,
  money,
  phoneMatch,
  today,
  type Job,
  type Workspace,
} from '@/lib/types';
import { quote } from '@/lib/pricing';

export function QuickOrderModal({
  open,
  onClose,
  data,
  reload,
  notify,
  onCreated,
  initialCustomer,
}: {
  open: boolean;
  onClose: () => void;
  data: Workspace;
  reload: () => Promise<void>;
  notify: (msg: string, error?: boolean) => void;
  onCreated?: (job: Job) => void;
  initialCustomer?: {
    name?: string;
    phone?: string;
    email?: string;
    address?: string;
    zip?: string;
    isCommercial?: boolean;
    notes?: string;
  } | null;
}) {
  const [customerName, setCustomerName] = useState(initialCustomer?.name || '');
  const [customerPhone, setCustomerPhone] = useState(initialCustomer?.phone || '');
  const [customerEmail, setCustomerEmail] = useState(initialCustomer?.email || '');
  const [address, setAddress] = useState(initialCustomer?.address || '');
  const [zip, setZip] = useState(
    initialCustomer?.zip || data.pricing_rules[0]?.service_zips[0] || '78704',
  );
  const availableSizes = useMemo(() => {
    const fromRules = data.pricing_rules.map((r) => r.size_yards);
    const fromContainers = data.containers.map((c) => c.size_yards);
    return Array.from(new Set([...fromRules, ...fromContainers, 10, 20, 30, 40])).sort((a, b) => a - b);
  }, [data.pricing_rules, data.containers]);

  const [sizeYards, setSizeYards] = useState<number>(() => data.pricing_rules[0]?.size_yards ?? 20);
  const [deliveryDate, setDeliveryDate] = useState(today());

  const rule = useMemo(
    () => data.pricing_rules.find((r) => r.size_yards === sizeYards) || data.pricing_rules[0],
    [data.pricing_rules, sizeYards],
  );

  const defaultPickup = useMemo(
    () => addDays(deliveryDate, rule?.included_days || 7),
    [deliveryDate, rule?.included_days],
  );

  const [pickupDate, setPickupDate] = useState(defaultPickup);
  const [driverId, setDriverId] = useState('');
  const [containerId, setContainerId] = useState('');
  const [notes, setNotes] = useState(initialCustomer?.notes || '');
  const [boards, setBoards] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const isPaidPlan = isStarterOrAbove(data.organization);
  const phoneOrdersUsed = useMemo(() => countPhoneOrders(data.jobs), [data.jobs]);
  const freePhoneOrdersLeft = Math.max(0, FREE_PHONE_ORDER_LIMIT - phoneOrdersUsed);
  const [paymentType, setPaymentType] = useState<'card' | 'cash' | 'check' | 'net_30'>(
    initialCustomer?.isCommercial ? 'net_30' : 'card',
  );
  const isBlockedByPlan = !isPaidPlan && freePhoneOrdersLeft === 0;

  const [prevInitialCustomer, setPrevInitialCustomer] = useState(initialCustomer);
  if (initialCustomer !== prevInitialCustomer) {
    setPrevInitialCustomer(initialCustomer);
    if (initialCustomer) {
      if (initialCustomer.name) setCustomerName(initialCustomer.name);
      if (initialCustomer.phone) setCustomerPhone(initialCustomer.phone);
      if (initialCustomer.email) setCustomerEmail(initialCustomer.email);
      if (initialCustomer.address) setAddress(initialCustomer.address);
      if (initialCustomer.zip) setZip(initialCustomer.zip);
      if (initialCustomer.isCommercial) setPaymentType('net_30');
      if (initialCustomer.notes) setNotes(initialCustomer.notes);
    }
  }

  // When size changes, re-sync pickup date to included days
  const handleSizeChange = (newSize: number) => {
    setSizeYards(newSize);
    const newRule = data.pricing_rules.find((r) => r.size_yards === newSize);
    if (newRule) {
      setPickupDate(addDays(deliveryDate, newRule.included_days));
    }
    setContainerId(''); // Reset container selection if size changes
  };

  const handleDeliveryChange = (newDelivery: string) => {
    setDeliveryDate(newDelivery);
    setPickupDate(addDays(newDelivery, rule?.included_days || 7));
  };

  const recentCustomers = useMemo(() => {
    const seen = new Set<string>();
    const list: Job[] = [];
    for (const j of data.jobs) {
      const key = `${j.customer_name.trim().toLowerCase()}|${j.customer_phone.replace(/\D/g, '')}`;
      if (!seen.has(key) && j.customer_name) {
        seen.add(key);
        list.push(j);
      }
      if (list.length >= 5) break;
    }
    return list;
  }, [data.jobs]);

  const matchedPastJob = useMemo(() => {
    const cleanPhone = customerPhone.replace(/\D/g, '');
    const cleanName = customerName.trim().toLowerCase();
    if (cleanPhone.length < 4 && cleanName.length < 3) return null;

    return (
      data.jobs.find((j) => {
        const phoneMatched = cleanPhone.length >= 4 && phoneMatch(j.customer_phone, customerPhone);
        const nameMatched =
          cleanName.length >= 3 && j.customer_name.toLowerCase().includes(cleanName);
        if (!phoneMatched && !nameMatched) return false;

        const alreadyIdentical =
          j.customer_name === customerName &&
          j.customer_phone === customerPhone &&
          j.delivery_address === address &&
          j.zip === zip;
        return !alreadyIdentical;
      }) || null
    );
  }, [data.jobs, customerPhone, customerName, address, zip]);

  const applyPastJob = (job: Job) => {
    setCustomerName(job.customer_name);
    setCustomerPhone(job.customer_phone);
    setCustomerEmail(job.customer_email || '');
    setAddress(job.delivery_address);
    if (job.zip) setZip(job.zip);
    handleSizeChange(job.size_yards);
    setBoards(Boolean(job.protective_boards));
    if (isPaidPlan || freePhoneOrdersLeft > 0) {
      const pt = job.payment_type;
      if (pt === 'cash' || pt === 'check' || pt === 'net_30') {
        setPaymentType(pt);
      } else if (job.is_commercial || job.notes?.includes('VIP CONTRACTOR')) {
        setPaymentType('net_30');
      } else {
        setPaymentType('card');
      }
    } else if (job.payment_type === 'card') {
      setPaymentType('card');
    }
  };

  // Available containers of matching size in yard
  const availableContainers = useMemo(
    () => data.containers.filter((c) => c.size_yards === sizeYards && c.status === 'yard'),
    [data.containers, sizeYards],
  );

  const drivers = useMemo(
    () => data.users.filter((u) => u.role === 'driver'),
    [data.users],
  );

  const calculatedQuote = useMemo(() => {
    if (!rule) return null;
    return quote(rule, deliveryDate, pickupDate, 100, {
      customerFee: false,
      boards,
    });
  }, [rule, deliveryDate, pickupDate, boards]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');

    if (isBlockedByPlan) {
      setError(
        `You've used all ${FREE_PHONE_ORDER_LIMIT} free trial phone orders. Upgrade to Starter ($29/mo) or Growth ($99/mo) in Settings to unlock unlimited $0-fee phone orders.`,
      );
      setBusy(false);
      return;
    }

    try {
      const res = await api<{ ok: boolean; job: Job }>('/api/jobs/quick', {
        method: 'POST',
        body: JSON.stringify({
          customer_name: customerName,
          customer_phone: customerPhone,
          customer_email: customerEmail || undefined,
          delivery_address: address,
          zip,
          size_yards: sizeYards,
          delivery_date: deliveryDate,
          pickup_date: pickupDate,
          notes,
          driver_id: driverId || null,
          container_id: containerId || null,
          protective_boards: boards,
          payment_type: paymentType,
        }),
      });

      await reload();
      notify(`Phone order booked for ${customerName} (${sizeYards}yd dumpster).`);
      onClose();
      if (onCreated && res.job) onCreated(res.job);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={(o) => !o && onClose()}
      title="Quick Phone Order"
      description="Take an order over the phone and add it directly to your dispatch schedule in seconds."
    >
      <form onSubmit={handleSubmit} className="form-stack">
        {!isPaidPlan && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: 8,
              background: freePhoneOrdersLeft > 0 ? '#f0fdf4' : '#fffbeb',
              border: freePhoneOrdersLeft > 0 ? '1px solid #bbf7d0' : '1px solid #fde68a',
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
              fontSize: 12,
              color: freePhoneOrdersLeft > 0 ? '#166534' : '#92400e',
              lineHeight: 1.45,
            }}
          >
            {freePhoneOrdersLeft > 0 ? (
              <div>
                <strong>
                  🎁 Free Plan Trial: {freePhoneOrdersLeft} of {FREE_PHONE_ORDER_LIMIT} free $0-fee
                  phone orders remaining ({phoneOrdersUsed}/{FREE_PHONE_ORDER_LIMIT} used).
                </strong>{' '}
                Test logging Cash, Check, Net-30, or Card orders!
              </div>
            ) : (
              <div>
                <div style={{ fontWeight: 700, marginBottom: 2 }}>
                  🔒 You&apos;ve used all 3 free trial phone orders ({FREE_PHONE_ORDER_LIMIT}/
                  {FREE_PHONE_ORDER_LIMIT} used)
                </div>
                <div style={{ color: '#78350f' }}>
                  Upgrade to <strong>Starter ($29/mo · 14-day free trial)</strong> or{' '}
                  <strong>Growth Fleet ($99/mo)</strong> in{' '}
                  <Link
                    href="/settings"
                    style={{ color: '#b45309', textDecoration: 'underline', fontWeight: 600 }}
                  >
                    Settings
                  </Link>{' '}
                  to unlock unlimited $0-fee manual phone orders, offline Cash/Check/Net-30
                  logging, and 1-click container swaps.
                </div>
              </div>
            )}
          </div>
        )}

        {recentCustomers.length > 0 && (
          <div
            style={{
              padding: '10px 12px',
              borderRadius: 8,
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: '#334155',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <span>⚡ Repeat Caller Quick-Fill:</span>
              <span style={{ fontWeight: 400, color: '#64748b' }}>
                1-tap auto-fill past customer &amp; Net-30 terms
              </span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {recentCustomers.map((rc) => (
                <button
                  key={rc.id}
                  type="button"
                  onClick={() => applyPastJob(rc)}
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    padding: '4px 9px',
                    borderRadius: 999,
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    color: '#1e293b',
                    cursor: 'pointer',
                  }}
                >
                  {rc.customer_name} ({rc.size_yards}yd)
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="form-row">
          <label className="field">
            Customer name *
            <input
              required
              minLength={2}
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="e.g. Robert Johnson"
            />
          </label>
          <label className="field">
            Customer phone *
            <input
              required
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="e.g. 512-555-0199"
            />
            <small>Confirmation SMS will be sent here.</small>
          </label>
        </div>

        {matchedPastJob && (
          <div
            style={{
              padding: '10px 12px',
              borderRadius: 8,
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 10,
              flexWrap: 'wrap',
            }}
          >
            <div style={{ fontSize: 12, color: '#1e3a8a' }}>
              <strong style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Zap size={13} /> Repeat Customer Match: {matchedPastJob.customer_name}
              </strong>
              <span style={{ fontSize: 11, color: '#1d4ed8' }}>
                {matchedPastJob.delivery_address} ({matchedPastJob.zip}) · Last ordered{' '}
                {matchedPastJob.size_yards}yd
              </span>
            </div>
            <button
              type="button"
              onClick={() => applyPastJob(matchedPastJob)}
              style={{
                fontSize: 11,
                fontWeight: 700,
                padding: '5px 10px',
                borderRadius: 6,
                background: '#2563eb',
                color: '#ffffff',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Auto-Fill Details
            </button>
          </div>
        )}

        <div className="form-row">
          <label className="field" style={{ flex: 2 }}>
            Delivery street address *
            <input
              required
              minLength={5}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. 1420 South Lamar Blvd"
            />
          </label>
          <label className="field" style={{ flex: 1 }}>
            ZIP Code *
            <input
              required
              maxLength={5}
              pattern="\d{5}"
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              placeholder="78704"
            />
          </label>
        </div>

        <div className="form-row">
          <label className="field">
            Email (optional)
            <input
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              placeholder="customer@example.com"
            />
          </label>
          <label className="field">
            Dumpster size *
            <select
              value={sizeYards}
              onChange={(e) => handleSizeChange(Number(e.target.value))}
            >
              {availableSizes.map((s) => (
                <option key={s} value={s}>
                  {s} Yard ({data.pricing_rules.find((r) => r.size_yards === s)?.included_tons ?? 2} tons, {data.pricing_rules.find((r) => r.size_yards === s)?.included_days ?? 7} days)
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="form-row">
          <label className="field">
            Delivery date *
            <input
              type="date"
              required
              min={today()}
              value={deliveryDate}
              onChange={(e) => handleDeliveryChange(e.target.value)}
            />
          </label>
          <label className="field">
            Pickup date *
            <input
              type="date"
              required
              min={deliveryDate}
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
            />
            <small>{rule?.included_days || 7} days included in base rental.</small>
          </label>
        </div>

        <div className="form-row">
          <label className="field">
            Assign driver (optional)
            <select value={driverId} onChange={(e) => setDriverId(e.target.value)}>
              <option value="">Assign later</option>
              {drivers.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            Assign container (optional)
            <select value={containerId} onChange={(e) => setContainerId(e.target.value)}>
              <option value="">Assign later</option>
              {availableContainers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label} (in yard)
                </option>
              ))}
            </select>
            <small>{availableContainers.length} available {sizeYards}yd cans in yard.</small>
          </label>
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 13, fontWeight: 500 }}>
          <input
            type="checkbox"
            checked={boards}
            onChange={(e) => setBoards(e.target.checked)}
          />
          Add Protective Wood Boards Under Rails (+$19.00)
        </label>

        <label className="field">
          Placement instructions & notes
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Left side of driveway, close to garage, avoid sprinkler head."
          />
        </label>

        <div className="form-row">
          <label className="field" style={{ flex: 1 }}>
            Payment method *
            <select
              value={paymentType}
              onChange={(e) =>
                setPaymentType(e.target.value as 'card' | 'cash' | 'check' | 'net_30')
              }
            >
              <option value="card">💳 Credit / Debit Card (Stripe)</option>
              <option value="cash">💵 Cash on Delivery (Offline)</option>
              <option value="check">📝 Check (Offline)</option>
              <option value="net_30">📑 Net 30 Terms (Contractor Invoice)</option>
            </select>
            <small>
              {paymentType === 'card'
                ? 'Card charge processed or checkout link sent via Stripe.'
                : 'Offline balance collected by driver or invoiced.'}
            </small>
          </label>
        </div>

        {isBlockedByPlan && (
          <div
            style={{
              padding: '12px 14px',
              borderRadius: 8,
              background: '#fffbeb',
              border: '1px solid #fde68a',
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                color: '#92400e',
                fontWeight: 600,
                fontSize: 13,
              }}
            >
              <Lock size={15} />
              You&apos;ve Used All {FREE_PHONE_ORDER_LIMIT} Free Trial Phone Orders (
              {FREE_PHONE_ORDER_LIMIT}/{FREE_PHONE_ORDER_LIMIT} Used)
            </div>
            <p style={{ margin: 0, fontSize: 12, color: '#78350f', lineHeight: 1.5 }}>
              Upgrade to <strong>Starter ($29/mo · 14-day free trial)</strong> or{' '}
              <strong>Growth Fleet ($99/mo)</strong> in{' '}
              <Link
                href="/settings"
                style={{ color: '#b45309', textDecoration: 'underline', fontWeight: 600 }}
              >
                Settings
              </Link>{' '}
              to unlock unlimited $0-fee manual phone orders, offline Cash/Check/Net-30 logging,
              and 1-click container swaps.
            </p>
          </div>
        )}

        {calculatedQuote && (
          <div
            style={{
              padding: '10px 14px',
              background: 'var(--panel-subtle, #f8fafc)',
              borderRadius: 6,
              border: '1px solid var(--border, #e2e8f0)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Total Base Rental: {money(calculatedQuote.total)}</div>
              <div style={{ fontSize: 11, color: 'var(--muted, #64748b)' }}>
                Includes {rule.included_tons} tons · {rule.included_days} days · {money(rule.extra_day_cents)}/extra day
              </div>
            </div>
            <span className="pill" style={{ color: '#2563eb' }}>
              Instant Booking
            </span>
          </div>
        )}

        <div
          style={{
            padding: '10px 14px',
            borderRadius: 8,
            background: '#f0fdf4',
            border: '1px solid #bbf7d0',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 8,
            fontSize: 12,
            color: '#166534',
            lineHeight: 1.45,
          }}
        >
          <CheckCircle2 size={16} style={{ flexShrink: 0, marginTop: 1, color: '#16a34a' }} />
          <div>
            <strong>1-Click SMS Waiver &amp; Mobile Link:</strong> Saving this phone order
            automatically texts the customer a 1-tap mobile link to{' '}
            <code style={{ fontSize: 11, background: '#dcfce7', padding: '1px 4px', borderRadius: 4 }}>
              /agreement/[id]
            </code>{' '}
            to e-sign the damage waiver, view their reservation receipt, and request early pickup—no
            writing down credit card numbers on paper while driving.
          </div>
        </div>

        {error && (
          <div className="error-box" role="alert">
            {error}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
          <Button variant="ghost" type="button" onClick={onClose} disabled={busy}>
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            disabled={busy || isBlockedByPlan}
            title={
              isBlockedByPlan
                ? 'Free trial phone orders used — upgrade in Settings for unlimited $0-fee phone orders'
                : undefined
            }
          >
            {busy ? (
              <Loader2 size={14} className="spin" />
            ) : isBlockedByPlan ? (
              <Lock size={14} />
            ) : (
              <Phone size={14} />
            )}
            {isBlockedByPlan ? 'Upgrade Plan for Unlimited Phone Orders' : 'Book Phone Order'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
