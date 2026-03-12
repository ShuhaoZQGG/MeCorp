import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';

type Mode = 'signin' | 'signup';

export default function LoginScreen() {
  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');

  const { signIn, signUp, error, loading, migrating } = useAuthStore();

  const pixelFont = "'Press Start 2P', monospace";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (mode === 'signin') {
      await signIn(email, password);
    } else {
      await signUp(email, password, displayName);
    }
  };

  const toggleMode = () => {
    setMode((prev) => (prev === 'signin' ? 'signup' : 'signin'));
  };

  // ---------------------------------------------------------------------------
  // Styles
  // ---------------------------------------------------------------------------
  const containerStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    background: '#1a1c2c',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: pixelFont,
    padding: '16px',
  };

  const panelStyle: React.CSSProperties = {
    background: '#f5e6c8',
    border: '4px solid #8b6914',
    padding: '32px 28px',
    width: '100%',
    maxWidth: '400px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    imageRendering: 'pixelated',
    // Pixel-art double-border effect via box-shadow
    boxShadow: 'inset 0 0 0 2px #c8a84b, 4px 4px 0px #3a2a00',
  };

  const headingStyle: React.CSSProperties = {
    fontSize: '9px',
    color: '#3a2a00',
    textAlign: 'center',
    lineHeight: '1.8',
    letterSpacing: '0.05em',
    textShadow: '1px 1px 0 #c8a84b',
  };

  const dividerStyle: React.CSSProperties = {
    height: '2px',
    background: '#8b6914',
    margin: '0 -4px',
  };

  const fieldGroupStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '6px',
    color: '#5a3e00',
    letterSpacing: '0.08em',
    userSelect: 'none',
  };

  const inputStyle: React.CSSProperties = {
    background: '#1a1c2c',
    border: '2px solid #8b6914',
    padding: '10px 12px',
    fontSize: '8px',
    color: '#f7d87c',
    fontFamily: pixelFont,
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
    letterSpacing: '0.05em',
  };

  const formStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  };

  const submitButtonStyle: React.CSSProperties = {
    background: loading ? '#c8a84b' : '#f7d87c',
    border: '3px solid #8b6914',
    padding: '12px',
    fontSize: '8px',
    color: '#1a1c2c',
    fontFamily: pixelFont,
    cursor: loading ? 'not-allowed' : 'pointer',
    width: '100%',
    letterSpacing: '0.05em',
    userSelect: 'none',
    marginTop: '4px',
    boxShadow: loading ? 'none' : '3px 3px 0px #8b6914',
    transition: 'box-shadow 80ms ease, background 80ms ease',
    opacity: loading ? 0.7 : 1,
  };

  const errorStyle: React.CSSProperties = {
    fontSize: '6px',
    color: '#c0392b',
    background: '#fde8e8',
    border: '2px solid #c0392b',
    padding: '8px 10px',
    lineHeight: '1.8',
    letterSpacing: '0.04em',
    wordBreak: 'break-word',
  };

  const toggleAreaStyle: React.CSSProperties = {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    alignItems: 'center',
  };

  const toggleLabelStyle: React.CSSProperties = {
    fontSize: '6px',
    color: '#5a3e00',
    letterSpacing: '0.05em',
  };

  const toggleButtonStyle: React.CSSProperties = {
    background: 'transparent',
    border: 'none',
    fontSize: '6px',
    color: '#8b6914',
    fontFamily: pixelFont,
    cursor: 'pointer',
    textDecoration: 'underline',
    padding: 0,
    letterSpacing: '0.05em',
  };

  const migratingStyle: React.CSSProperties = {
    fontSize: '6px',
    color: '#5a3e00',
    background: '#fef3cd',
    border: '2px solid #c8a84b',
    padding: '8px 10px',
    lineHeight: '1.8',
    textAlign: 'center',
    letterSpacing: '0.04em',
  };

  const isSignup = mode === 'signup';

  return (
    <div style={containerStyle}>
      <div style={panelStyle}>

        {/* Header */}
        <div>
          <div style={headingStyle}>
            {isSignup ? 'ME CORP.' : 'ME CORP.'}
          </div>
          <div style={{ ...headingStyle, fontSize: '7px', marginTop: '6px' }}>
            {isSignup ? 'EMPLOYMENT APPLICATION' : 'EMPLOYEE LOGIN'}
          </div>
        </div>

        <div style={dividerStyle} />

        {/* Migration notice */}
        {migrating && (
          <div style={migratingStyle}>
            TRANSFERRING LOCAL DATA...
          </div>
        )}

        {/* Error display */}
        {error && (
          <div style={errorStyle}>
            ERROR: {error.toUpperCase()}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={formStyle} noValidate>

          {isSignup && (
            <div style={fieldGroupStyle}>
              <label style={labelStyle} htmlFor="mecorp-displayname">
                EMPLOYEE NAME
              </label>
              <input
                id="mecorp-displayname"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="YOUR NAME"
                required
                disabled={loading}
                autoComplete="name"
                style={inputStyle}
              />
            </div>
          )}

          <div style={fieldGroupStyle}>
            <label style={labelStyle} htmlFor="mecorp-email">
              EMPLOYEE ID (EMAIL)
            </label>
            <input
              id="mecorp-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="EMAIL ADDRESS"
              required
              disabled={loading}
              autoComplete={isSignup ? 'email' : 'username'}
              style={inputStyle}
            />
          </div>

          <div style={fieldGroupStyle}>
            <label style={labelStyle} htmlFor="mecorp-password">
              ACCESS CODE (PASSWORD)
            </label>
            <input
              id="mecorp-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={loading}
              autoComplete={isSignup ? 'new-password' : 'current-password'}
              style={inputStyle}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={submitButtonStyle}
            onMouseEnter={(e) => {
              if (!loading) {
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '1px 1px 0px #8b6914';
                (e.currentTarget as HTMLButtonElement).style.transform = 'translate(2px,2px)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '3px 3px 0px #8b6914';
                (e.currentTarget as HTMLButtonElement).style.transform = 'translate(0,0)';
              }
            }}
          >
            {loading
              ? 'PROCESSING...'
              : isSignup
              ? 'SUBMIT APPLICATION'
              : 'CLOCK IN'}
          </button>
        </form>

        <div style={dividerStyle} />

        {/* Mode toggle */}
        <div style={toggleAreaStyle}>
          <span style={toggleLabelStyle}>
            {isSignup
              ? 'ALREADY AN EMPLOYEE?'
              : 'NEW TO ME CORP.?'}
          </span>
          <button
            type="button"
            onClick={toggleMode}
            disabled={loading}
            style={toggleButtonStyle}
          >
            {isSignup ? 'SIGN IN' : 'APPLY NOW'}
          </button>
        </div>

      </div>
    </div>
  );
}
