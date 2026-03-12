import { useState, useEffect } from 'react';
import type { ApiKeyInfo } from '../../store/types';
import { generateApiKey, revokeApiKey, listApiKeys } from '../../lib/api';

interface Props {
  onClose: () => void;
}

export default function SettingsModal({ onClose }: Props) {
  const [keys, setKeys] = useState<ApiKeyInfo[]>([]);
  const [newKey, setNewKey] = useState<string | null>(null);
  const [label, setLabel] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const pixelFont = "'Press Start 2P', monospace";

  useEffect(() => {
    listApiKeys().then(setKeys).catch(() => {});
  }, []);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const result = await generateApiKey(label || 'default');
      setNewKey(result.key);
      setLabel('');
      const updated = await listApiKeys();
      setKeys(updated);
    } catch {
      // silently fail
    }
    setIsGenerating(false);
  };

  const handleRevoke = async (keyId: string) => {
    await revokeApiKey(keyId);
    const updated = await listApiKeys();
    setKeys(updated);
  };

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(0,0,0,0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 55,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#1a1c2c',
          border: '3px solid #f7d87c',
          padding: '16px',
          width: '340px',
          maxHeight: '80%',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '8px', fontFamily: pixelFont, color: '#f7d87c' }}>SETTINGS</span>
          <span onClick={onClose} style={{ fontSize: '8px', fontFamily: pixelFont, color: '#e76f51', cursor: 'pointer' }}>X</span>
        </div>

        {/* API Keys section */}
        <div style={{ borderTop: '1px solid #2a2d4a', paddingTop: '8px' }}>
          <div style={{ fontSize: '6px', fontFamily: pixelFont, color: '#f5e6c8', marginBottom: '8px' }}>API KEYS</div>
          <div style={{ fontSize: '5px', fontFamily: pixelFont, color: '#888', marginBottom: '8px', lineHeight: '10px' }}>
            Use API keys to ingest tasks from external tools via POST /api/ingest
          </div>

          {/* New key display */}
          {newKey && (
            <div style={{ background: '#0a2a1a', border: '1px solid #38b764', padding: '8px', marginBottom: '8px' }}>
              <div style={{ fontSize: '5px', fontFamily: pixelFont, color: '#38b764', marginBottom: '4px' }}>NEW KEY (copy now - shown only once):</div>
              <div
                onClick={() => navigator.clipboard.writeText(newKey)}
                style={{
                  fontSize: '5px',
                  fontFamily: 'monospace',
                  color: '#f5e6c8',
                  wordBreak: 'break-all',
                  cursor: 'pointer',
                  padding: '4px',
                  background: '#1a1c2c',
                }}
              >
                {newKey}
              </div>
              <div style={{ fontSize: '4px', fontFamily: pixelFont, color: '#888', marginTop: '4px' }}>Click to copy</div>
            </div>
          )}

          {/* Generate new */}
          <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
            <input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="label"
              style={{
                flex: 1,
                fontSize: '6px',
                fontFamily: pixelFont,
                padding: '4px 6px',
                background: '#2a2d4a',
                border: '1px solid #4a5568',
                color: '#f5e6c8',
                outline: 'none',
              }}
            />
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              style={{
                fontSize: '5px',
                fontFamily: pixelFont,
                padding: '4px 8px',
                background: '#38b764',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {isGenerating ? '...' : 'NEW KEY'}
            </button>
          </div>

          {/* Key list */}
          {keys.map((k) => (
            <div
              key={k.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '4px 0',
                borderBottom: '1px solid #2a2d4a',
              }}
            >
              <div>
                <div style={{ fontSize: '5px', fontFamily: pixelFont, color: k.revokedAt ? '#666' : '#f5e6c8' }}>
                  {k.keyPrefix}... — {k.label}
                </div>
                <div style={{ fontSize: '4px', fontFamily: pixelFont, color: '#666' }}>
                  {k.revokedAt ? 'REVOKED' : k.lastUsedAt ? `Last used ${new Date(k.lastUsedAt).toLocaleDateString()}` : 'Never used'}
                </div>
              </div>
              {!k.revokedAt && (
                <span
                  onClick={() => handleRevoke(k.id)}
                  style={{ fontSize: '5px', fontFamily: pixelFont, color: '#e76f51', cursor: 'pointer' }}
                >
                  REVOKE
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
