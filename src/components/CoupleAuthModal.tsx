import React, { useState } from 'react';
import { WeddingData } from '../types/wedding';
import { Lock, ShieldCheck, Heart, KeyRound, AlertCircle, X, Check } from 'lucide-react';

interface CoupleAuthModalProps {
  wedding: WeddingData;
  isOpen: boolean;
  onClose: () => void;
  onAuthenticated: () => void;
}

export const CoupleAuthModal: React.FC<CoupleAuthModalProps> = ({
  wedding,
  isOpen,
  onClose,
  onAuthenticated
}) => {
  const [credentialInput, setCredentialInput] = useState('');
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  // Expected names
  const p1First = wedding.partner1.split(' ')[0] || wedding.partner1;
  const p2First = wedding.partner2.split(' ')[0] || wedding.partner2;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const inputClean = credentialInput.trim().toLowerCase();
    const p1Clean = p1First.toLowerCase();
    const p2Clean = p2First.toLowerCase();

    // Check if input matches both first names (e.g. "sarah & james", "james & sarah", "alex & anna", etc.)
    const matchesCoupleNames =
      (inputClean.includes(p1Clean) && inputClean.includes(p2Clean)) ||
      (inputClean.includes('alex') && inputClean.includes('anna')) ||
      inputClean === `${p1Clean} & ${p2Clean}` ||
      inputClean === `${p1Clean} and ${p2Clean}`;

    // Passcode check (allow 2027 or love or empty if names match closely)
    const validPasscode = !passcode || passcode.trim() === '2027' || passcode.trim().length >= 4;

    if (matchesCoupleNames && validPasscode) {
      setIsSuccess(true);
      setTimeout(() => {
        onAuthenticated();
        onClose();
        setIsSuccess(false);
      }, 700);
    } else if (!matchesCoupleNames) {
      setError(
        `Invalid couple credential. Please enter both partner first names (e.g. "${p1First} & ${p2First}" or "Alex & Anna").`
      );
    } else {
      setError('Invalid PIN passcode. Please enter 2027.');
    }
  };

  const handleQuickDemoFill = () => {
    setCredentialInput(`${p1First} & ${p2First}`);
    setPasscode('2027');
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1C1B18]/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#FAF7F0] rounded-sm max-w-md w-full shadow-2xl p-6 sm:p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-neutral-800 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          title="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-full bg-[#B59A72]/15 text-[#8C6D45] flex items-center justify-center mx-auto mb-3">
            <Lock className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-editorial uppercase tracking-[0.25em] text-[#8C6D45] font-semibold block mb-1">
            Couple Restricted Area
          </span>
          <h2 className="font-editorial text-2xl sm:text-3xl font-normal text-[#292722]">
            Couple Admin Sign In
          </h2>
          <p className="text-xs text-[#5A554E] mt-1.5 leading-relaxed">
            Restricted to the couple. Sign in to customize invitation stationery, confirm or decline guests &amp; plus-ones, curate the DJ playlist, or manage your wedding data.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 text-rose-800 text-xs rounded-xs flex items-start gap-2 shadow-xs">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {isSuccess && (
          <div className="mb-4 p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xs flex items-center gap-2 shadow-xs">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Identity confirmed! Welcome back, {p1First} &amp; {p2First}.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold uppercase tracking-wider text-[#292722] mb-1.5">
              Assigned Couple Credential <span className="text-[#8C6D45]">*</span>
            </label>
            <input
              type="text"
              required
              value={credentialInput}
              onChange={(e) => setCredentialInput(e.target.value)}
              placeholder={`e.g. ${p1First} & ${p2First} or Alex & Anna`}
              className="w-full px-3.5 py-3 text-sm bg-white rounded-xs text-[#292722] shadow-xs focus:outline-hidden focus:ring-1 focus:ring-[#8C6D45]"
            />
            <span className="text-[10px] text-neutral-500 mt-1 block">
              Format: Both partners&apos; first names joined by &amp; (e.g. &ldquo;{p1First} &amp; {p2First}&rdquo;)
            </span>
          </div>

          <div>
            <label className="block font-semibold uppercase tracking-wider text-[#292722] mb-1.5">
              Admin Passcode / PIN
            </label>
            <div className="relative">
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="2027"
                className="w-full px-3.5 py-3 text-sm bg-white rounded-xs text-[#292722] shadow-xs focus:outline-hidden focus:ring-1 focus:ring-[#8C6D45]"
              />
              <KeyRound className="w-4 h-4 text-[#8C6D45] absolute right-3 top-3.5 opacity-60" />
            </div>
            <span className="text-[10px] text-neutral-500 mt-1 block">
              Standard administrative PIN: <strong className="text-[#292722]">2027</strong>
            </span>
          </div>

          <div className="pt-2 space-y-2">
            <button
              type="submit"
              className="w-full py-3.5 bg-[#292722] hover:bg-[#8C6D45] text-white text-xs font-semibold uppercase tracking-wider rounded-xs transition-colors shadow-sm flex items-center justify-center gap-2 min-h-[44px]"
            >
              <ShieldCheck className="w-4 h-4 text-[#B59A72]" />
              <span>Sign In as Couple Admin</span>
            </button>

            <button
              type="button"
              onClick={handleQuickDemoFill}
              className="w-full py-2 px-3 bg-white hover:bg-neutral-100 text-[#8C6D45] text-[10px] font-medium rounded-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs"
            >
              <KeyRound className="w-3 h-3" />
              <span>Autofill Assigned Credential ({p1First} &amp; {p2First})</span>
            </button>
          </div>
        </form>

        <div className="mt-5 pt-4 text-center text-[11px] text-neutral-500">
          Guests do not require credentials — guests can access the wedding microsite and book/generate invitations freely.
        </div>
      </div>
    </div>
  );
};
