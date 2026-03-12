import { useState } from 'react';
import { useDailyStore } from '../../store/dailyStore';
import { useGoalStore } from '../../store/goalStore';
import type { ProofType } from '../../store/types';

export default function ProofDialog() {
  const showProofDialog = useDailyStore((s) => s.showProofDialog);
  const closeProofDialog = useDailyStore((s) => s.closeProofDialog);
  const completeAssignment = useDailyStore((s) => s.completeAssignment);
  const taskPool = useGoalStore((s) => s.taskPool);

  const [proofType, setProofType] = useState<ProofType>('note');
  const [content, setContent] = useState('');
  const [screenshotError, setScreenshotError] = useState('');

  if (!showProofDialog) return null;

  const poolTask = taskPool.find((t) => t.id === showProofDialog);
  if (!poolTask) return null;

  const handleSubmitProof = () => {
    if (!content.trim()) return;
    completeAssignment(showProofDialog, {
      taskId: showProofDialog,
      type: proofType,
      content: content.trim(),
      submittedAt: Date.now(),
    });
    setContent('');
    setProofType('note');
  };

  const handleSkipProof = () => {
    completeAssignment(showProofDialog);
    setContent('');
    setProofType('note');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 500 * 1024) {
      setScreenshotError('File too large (max 500KB)');
      return;
    }
    setScreenshotError('');
    const reader = new FileReader();
    reader.onload = () => {
      setContent(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (!file) continue;
        if (file.size > 500 * 1024) {
          setScreenshotError('Pasted image too large (max 500KB)');
          return;
        }
        setScreenshotError('');
        const reader = new FileReader();
        reader.onload = () => {
          setContent(reader.result as string);
        };
        reader.readAsDataURL(file);
        break;
      }
    }
  };

  const pixelFont = "'Press Start 2P', monospace";

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.7)',
        zIndex: 70,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'fade-in 200ms ease-out',
      }}
    >
      <div
        style={{
          width: '280px',
          background: '#f5e6c8',
          border: '4px solid #8b6914',
          padding: '14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          imageRendering: 'pixelated',
        }}
        onPaste={handlePaste}
      >
        {/* Close button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span
            style={{ fontSize: '7px', fontFamily: pixelFont, color: '#2d1f15', userSelect: 'none', flex: 1 }}
          >
            {poolTask.title}
          </span>
          <span
            onClick={closeProofDialog}
            style={{ fontSize: '8px', fontFamily: pixelFont, color: '#e76f51', cursor: 'pointer', userSelect: 'none' }}
          >
            ✕
          </span>
        </div>

        {/* Proof type toggles */}
        <div style={{ display: 'flex', gap: '4px' }}>
          {(['note', 'url', 'screenshot'] as ProofType[]).map((type) => (
            <button
              key={type}
              onClick={() => { setProofType(type); setContent(''); setScreenshotError(''); }}
              style={{
                fontSize: '6px',
                fontFamily: pixelFont,
                color: proofType === type ? '#f5e6c8' : '#5a3a10',
                background: proofType === type ? '#5a3a10' : 'transparent',
                border: '2px solid #5a3a10',
                padding: '3px 6px',
                cursor: 'pointer',
                flex: 1,
              }}
            >
              {type.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Input area */}
        {proofType === 'note' && (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What did you do?"
            rows={3}
            style={{
              fontSize: '7px',
              fontFamily: pixelFont,
              color: '#2d1f15',
              background: '#fff8e7',
              border: '2px solid #8b6914',
              padding: '6px',
              resize: 'none',
              lineHeight: 1.6,
            }}
          />
        )}

        {proofType === 'url' && (
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="https://..."
            style={{
              fontSize: '7px',
              fontFamily: pixelFont,
              color: '#2d1f15',
              background: '#fff8e7',
              border: '2px solid #8b6914',
              padding: '6px',
            }}
          />
        )}

        {proofType === 'screenshot' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <input type="file" accept="image/*" onChange={handleFileChange} style={{ fontSize: '7px' }} />
            <span style={{ fontSize: '5px', fontFamily: pixelFont, color: '#8b6914', userSelect: 'none' }}>
              Or paste an image (max 500KB)
            </span>
            {screenshotError && (
              <span style={{ fontSize: '5px', fontFamily: pixelFont, color: '#e76f51', userSelect: 'none' }}>
                {screenshotError}
              </span>
            )}
            {content && (
              <img
                src={content}
                alt="proof"
                style={{ maxWidth: '100%', maxHeight: '80px', objectFit: 'contain', border: '1px solid #8b6914' }}
              />
            )}
          </div>
        )}

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
          <button
            onClick={handleSubmitProof}
            disabled={!content.trim()}
            style={{
              fontSize: '6px',
              fontFamily: pixelFont,
              color: '#1a1c2c',
              background: content.trim() ? '#38b764' : '#8b8b8b',
              border: '2px solid ' + (content.trim() ? '#2a8a4a' : '#666'),
              padding: '5px 10px',
              cursor: content.trim() ? 'pointer' : 'default',
            }}
          >
            SUBMIT PROOF
          </button>
          <button
            onClick={handleSkipProof}
            style={{
              fontSize: '6px',
              fontFamily: pixelFont,
              color: '#5a3a10',
              background: 'transparent',
              border: '2px solid #8b6914',
              padding: '5px 10px',
              cursor: 'pointer',
            }}
            title="No Gold • 25% XP"
          >
            SKIP PROOF
          </button>
        </div>
        <span
          style={{
            fontSize: '5px',
            fontFamily: pixelFont,
            color: '#8b6914',
            textAlign: 'center',
            userSelect: 'none',
          }}
        >
          Skip = No Gold • 25% XP
        </span>
      </div>
    </div>
  );
}
