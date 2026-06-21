'use client';
import React, { useState } from 'react';
import { CheckCircle2, Copy } from 'lucide-react';

export default function CopyButton({ textToCopy }: { textToCopy: string }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button 
      onClick={copyToClipboard}
      className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-medium transition-colors ${copied ? 'bg-emerald-500 text-white' : 'bg-brand-600 hover:bg-brand-700 text-white'}`}
    >
      {copied ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
      {copied ? 'Message copié !' : 'Copier le message'}
    </button>
  );
}
