'use client';
import { useMemo, useState } from 'react';
import { Box, FileSpreadsheet, Loader2, Plus, Sparkles, Upload } from 'lucide-react';
import { Modal } from './ui/dialog';
import { Button } from './ui/button';
import { api } from '@/lib/client';
import type { Workspace } from '@/lib/types';

interface BulkContainerItem {
  label: string;
  size_yards: 10 | 20 | 30 | 40;
}

export function BulkContainerModal({
  open,
  onClose,
  data,
  reload,
  notify,
}: {
  open: boolean;
  onClose: () => void;
  data: Workspace;
  reload: () => Promise<void>;
  notify: (msg: string, error?: boolean) => void;
}) {
  const [tab, setTab] = useState<'generator' | 'csv'>('generator');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  // Generator State
  const [prefix, setPrefix] = useState('C-');
  const [startNum, setStartNum] = useState(1);
  const [digits, setDigits] = useState(3);
  const [count10, setCount10] = useState(2);
  const [count20, setCount20] = useState(6);
  const [count30, setCount30] = useState(4);
  const [count40, setCount40] = useState(2);

  // CSV / Paste State
  const [csvText, setCsvText] = useState('');
  const [defaultSize, setDefaultSize] = useState<10 | 20 | 30 | 40>(20);

  const existingLabels = useMemo(
    () => new Set(data.containers.map((c) => c.label.toLowerCase())),
    [data.containers],
  );

  const generatedItems = useMemo<BulkContainerItem[]>(() => {
    if (tab === 'generator') {
      const items: BulkContainerItem[] = [];
      let current = startNum;

      const addGroup = (count: number, size: 10 | 20 | 30 | 40) => {
        for (let i = 0; i < count; i++) {
          const numStr = String(current).padStart(digits, '0');
          items.push({
            label: `${prefix}${numStr}`,
            size_yards: size,
          });
          current++;
        }
      };

      addGroup(count10, 10);
      addGroup(count20, 20);
      addGroup(count30, 30);
      addGroup(count40, 40);
      return items;
    } else {
      // Parse CSV / paste lines
      const lines = csvText.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
      const items: BulkContainerItem[] = [];

      for (const line of lines) {
        // Support "Label, Size" or "Label \t Size" or just "Label"
        const parts = line.split(/[,\t]+/).map((p) => p.trim());
        if (!parts[0]) continue;
        const label = parts[0];
        let size: 10 | 20 | 30 | 40 = defaultSize;
        if (parts[1]) {
          const parsed = parseInt(parts[1], 10);
          if ([10, 20, 30, 40].includes(parsed)) {
            size = parsed as 10 | 20 | 30 | 40;
          }
        }
        items.push({ label, size_yards: size });
      }
      return items;
    }
  }, [tab, prefix, startNum, digits, count10, count20, count30, count40, csvText, defaultSize]);

  const conflicts = useMemo(() => {
    return generatedItems.filter((item) => existingLabels.has(item.label.toLowerCase()));
  }, [generatedItems, existingLabels]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) setCsvText(text);
    };
    reader.readAsText(file);
  };

  const handleSave = async () => {
    if (!generatedItems.length) {
      setError('Please add at least one container.');
      return;
    }
    if (conflicts.length > 0) {
      setError(`Container "${conflicts[0].label}" already exists. Change prefix or starting number.`);
      return;
    }

    setBusy(true);
    setError('');
    try {
      await api('/api/resources/bulk', {
        method: 'POST',
        body: JSON.stringify({ containers: generatedItems }),
      });
      await reload();
      notify(`Successfully added ${generatedItems.length} containers to your fleet.`);
      onClose();
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
      title="Add Fleet in Bulk"
      description="Quickly populate your container inventory from numbers or a spreadsheet."
    >
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <button
          type="button"
          className={`view-tab ${tab === 'generator' ? 'active' : ''}`}
          onClick={() => {
            setTab('generator');
            setError('');
          }}
          style={{ padding: '8px 14px' }}
        >
          <Sparkles size={13} style={{ marginRight: 6 }} />
          Fleet Generator
        </button>
        <button
          type="button"
          className={`view-tab ${tab === 'csv' ? 'active' : ''}`}
          onClick={() => {
            setTab('csv');
            setError('');
          }}
          style={{ padding: '8px 14px' }}
        >
          <FileSpreadsheet size={13} style={{ marginRight: 6 }} />
          CSV / Paste Import
        </button>
      </div>

      {tab === 'generator' ? (
        <div className="form-stack">
          <div className="form-row">
            <label className="field">
              Prefix
              <input
                value={prefix}
                onChange={(e) => setPrefix(e.target.value)}
                placeholder="e.g. GL- or C-"
                maxLength={10}
              />
              <small>Example: {prefix}001</small>
            </label>
            <label className="field">
              Start Number
              <input
                type="number"
                min="1"
                value={startNum}
                onChange={(e) => setStartNum(Math.max(1, parseInt(e.target.value, 10) || 1))}
              />
            </label>
            <label className="field">
              Padding Digits
              <input
                type="number"
                min="1"
                max="6"
                value={digits}
                onChange={(e) => setDigits(Math.max(1, parseInt(e.target.value, 10) || 1))}
              />
              <small>{digits} digits (e.g. 001)</small>
            </label>
          </div>

          <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--foreground, #222)' }}>
            Quantity by Dumpster Size
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
            <label className="field">
              10 Yard
              <input
                type="number"
                min="0"
                value={count10}
                onChange={(e) => setCount10(Math.max(0, parseInt(e.target.value, 10) || 0))}
              />
            </label>
            <label className="field">
              20 Yard
              <input
                type="number"
                min="0"
                value={count20}
                onChange={(e) => setCount20(Math.max(0, parseInt(e.target.value, 10) || 0))}
              />
            </label>
            <label className="field">
              30 Yard
              <input
                type="number"
                min="0"
                value={count30}
                onChange={(e) => setCount30(Math.max(0, parseInt(e.target.value, 10) || 0))}
              />
            </label>
            <label className="field">
              40 Yard
              <input
                type="number"
                min="0"
                value={count40}
                onChange={(e) => setCount40(Math.max(0, parseInt(e.target.value, 10) || 0))}
              />
            </label>
          </div>
        </div>
      ) : (
        <div className="form-stack">
          <div className="form-row">
            <label className="field" style={{ flex: 1 }}>
              Default Size (if not in CSV)
              <select
                value={defaultSize}
                onChange={(e) => setDefaultSize(Number(e.target.value) as 10 | 20 | 30 | 40)}
              >
                {[10, 20, 30, 40].map((s) => (
                  <option key={s} value={s}>
                    {s} Yard
                  </option>
                ))}
              </select>
            </label>
            <div style={{ alignSelf: 'flex-end', paddingBottom: 6 }}>
              <label className="btn" style={{ cursor: 'pointer', display: 'inline-flex' }}>
                <Upload size={13} style={{ marginRight: 6 }} />
                Upload CSV File
                <input
                  type="file"
                  accept=".csv,.txt"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
          </div>

          <label className="field">
            Paste Container List or CSV
            <textarea
              rows={5}
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              placeholder="C-101, 20&#10;C-102, 20&#10;C-103, 30&#10;C-104, 10"
              style={{ fontFamily: 'monospace', fontSize: 13 }}
            />
            <small>Format: &quot;Container Label, Size&quot; or one label per line.</small>
          </label>
        </div>
      )}

      {/* Preview Section */}
      <div
        style={{
          marginTop: 16,
          padding: '12px 14px',
          background: 'var(--panel-subtle, #f8fafc)',
          borderRadius: 8,
          border: '1px solid var(--border, #e2e8f0)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 13, fontWeight: 600 }}>
            Preview ({generatedItems.length} containers to add)
          </span>
          {conflicts.length > 0 && (
            <span style={{ fontSize: 12, color: '#dc2626', fontWeight: 600 }}>
              ⚠️ {conflicts.length} label conflict(s)
            </span>
          )}
        </div>

        {generatedItems.length > 0 ? (
          <div
            style={{
              maxHeight: 120,
              overflowY: 'auto',
              display: 'flex',
              flexWrap: 'wrap',
              gap: 6,
              marginTop: 10,
            }}
          >
            {generatedItems.slice(0, 30).map((item, idx) => {
              const hasConflict = existingLabels.has(item.label.toLowerCase());
              return (
                <span
                  key={idx}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    fontSize: 11,
                    padding: '3px 8px',
                    borderRadius: 4,
                    background: hasConflict ? '#fee2e2' : '#f1f5f9',
                    color: hasConflict ? '#991b1b' : '#334155',
                    border: `1px solid ${hasConflict ? '#fca5a5' : '#cbd5e1'}`,
                  }}
                >
                  <Box size={10} />
                  <strong>{item.label}</strong> ({item.size_yards}yd)
                </span>
              );
            })}
            {generatedItems.length > 30 && (
              <span style={{ fontSize: 11, color: '#64748b', alignSelf: 'center' }}>
                +{generatedItems.length - 30} more…
              </span>
            )}
          </div>
        ) : (
          <p style={{ margin: '8px 0 0', fontSize: 12, color: 'var(--muted, #64748b)' }}>
            No containers configured yet.
          </p>
        )}
      </div>

      {error && (
        <div className="error-box" role="alert" style={{ marginTop: 12 }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
        <Button variant="ghost" onClick={onClose} disabled={busy}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={() => void handleSave()}
          disabled={busy || !generatedItems.length || conflicts.length > 0}
        >
          {busy ? <Loader2 size={14} className="spin" /> : <Plus size={14} />}
          Add {generatedItems.length} Containers
        </Button>
      </div>
    </Modal>
  );
}
