'use client';
import { useMemo, useState } from 'react';
import { Loader2, Phone } from 'lucide-react';
import { Modal } from './ui/dialog';
import { Button } from './ui/button';
import { api } from '@/lib/client';
import { addDays, money, today, type Job, type Workspace } from '@/lib/types';
import { quote } from '@/lib/pricing';

export function QuickOrderModal({
  open,
  onClose,
  data,
  reload,
  notify,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  data: Workspace;
  reload: () => Promise<void>;
  notify: (msg: string, error?: boolean) => void;
  onCreated?: (job: Job) => void;
}) {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [address, setAddress] = useState('');
  const [zip, setZip] = useState(data.pricing_rules[0]?.service_zips[0] || '78704');
  const [sizeYards, setSizeYards] = useState<10 | 20 | 30 | 40>(20);
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
  const [notes, setNotes] = useState('');
  const [boards, setBoards] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  // When size changes, re-sync pickup date to included days
  const handleSizeChange = (newSize: 10 | 20 | 30 | 40) => {
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
    const customerFee = data.organization.pricing_config?.customer_fee_enabled !== false;
    return quote(rule, deliveryDate, pickupDate, 100, {
      customerFee,
      boards,
    });
  }, [rule, deliveryDate, pickupDate, data.organization.pricing_config, boards]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');

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
              onChange={(e) => handleSizeChange(Number(e.target.value) as 10 | 20 | 30 | 40)}
            >
              {[10, 20, 30, 40].map((s) => (
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

        {error && (
          <div className="error-box" role="alert">
            {error}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
          <Button variant="ghost" type="button" onClick={onClose} disabled={busy}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={busy}>
            {busy ? <Loader2 size={14} className="spin" /> : <Phone size={14} />}
            Book Phone Order
          </Button>
        </div>
      </form>
    </Modal>
  );
}
