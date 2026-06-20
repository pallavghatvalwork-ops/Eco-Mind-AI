'use client';

// ===========================================
// Bill Analyzer — ECO MIND AI (Gemini Vision)
// ===========================================

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, Check, X, Sparkles, Zap, Eye } from 'lucide-react';
import { formatCO2 } from '@/lib/utils/formatters';
import { callGemini } from '@/lib/utils/gemini';
import { useAuth } from '@/contexts/AuthContext';

interface BillResult {
  provider: string;
  unitsConsumed: number;
  billingAmount: number;
  billingPeriod: string;
  carbonImpact: number;
}

export default function BillsPage() {
  const { user, updateUser } = useAuth();
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<BillResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileToBase64 = (f: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(f);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && ['application/pdf', 'image/png', 'image/jpeg'].includes(droppedFile.type)) {
      setFile(droppedFile);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) setFile(selected);
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const base64Data = await fileToBase64(file);
      const data = await callGemini('bill', { fileData: base64Data, mimeType: file.type });
      if (data && typeof data === 'object') {
        setResult(data);
        
        // Increment bills scanned count in Firestore
        updateUser({
          billScansCount: (user?.billScansCount || 0) + 1,
        });
      } else {
        throw new Error('Invalid response from AI');
      }
    } catch (err) {
      console.warn('Real Gemini Vision bill analysis failed:', err);
      setError('AI analysis is temporarily unavailable. Please try again later.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
          Bill <span className="text-gradient-eco">Analyzer</span>
        </h1>
        <p className="text-surface-400 text-sm mt-1">
          Upload electricity or utility bills — Gemini Vision extracts data and calculates emissions
        </p>
      </div>

      {/* Upload Area */}
      <div
        className={`glass-card-static p-10 text-center border-2 border-dashed transition-all ${
          isDragging ? 'border-eco-500/50 bg-eco-500/5' : 'border-white/10'
        }`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        {!file ? (
          <div>
            <Upload className="w-12 h-12 text-surface-500 mx-auto mb-4" />
            <p className="text-white font-medium mb-2">Drag & drop your bill here</p>
            <p className="text-surface-400 text-sm mb-4">Supports PDF, PNG, JPG</p>
            <label className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white gradient-eco rounded-xl cursor-pointer hover:shadow-lg hover:shadow-eco-500/20 transition-all">
              <FileText className="w-4 h-4" />
              Browse Files
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                className="hidden"
                onChange={handleFileSelect}
                aria-label="Select bill file"
              />
            </label>
          </div>
        ) : (
          <div>
            <div className="w-16 h-16 rounded-2xl bg-eco-500/10 border border-eco-500/20 mx-auto mb-4 flex items-center justify-center">
              <FileText className="w-8 h-8 text-eco-400" />
            </div>
            <p className="text-white font-medium">{file.name}</p>
            <p className="text-surface-400 text-sm mt-1">{(file.size / 1024).toFixed(1)} KB</p>
            <div className="flex items-center justify-center gap-3 mt-4">
              <button
                onClick={() => { setFile(null); setResult(null); }}
                className="flex items-center gap-1.5 px-4 py-2 text-sm text-surface-400 hover:text-white rounded-xl hover:bg-white/5 transition-colors"
              >
                <X className="w-4 h-4" />
                Remove
              </button>
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white gradient-eco rounded-xl disabled:opacity-50 hover:shadow-lg hover:shadow-eco-500/20 transition-all"
              >
                {isAnalyzing ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
                {isAnalyzing ? 'Analyzing with Gemini Vision...' : 'Analyze Bill'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.div
            className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-center space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div className="text-2xl">⚠️</div>
            <p className="text-sm font-semibold text-rose-400">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Analysis Result */}
      <AnimatePresence>
        {result && (
          <motion.div
            className="glass-card-static p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-2 mb-5">
              <Sparkles className="w-4 h-4 text-eco-400" />
              <h2 className="text-base font-semibold text-white">Extracted Data</h2>
              <span className="text-xs text-surface-500 ml-auto">via Gemini Vision</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Provider', value: result.provider, icon: '🏢' },
                { label: 'Units Consumed', value: `${result.unitsConsumed} kWh`, icon: '⚡' },
                { label: 'Billing Amount', value: `₹${result.billingAmount.toLocaleString()}`, icon: '💰' },
                { label: 'Period', value: result.billingPeriod, icon: '📅' },
              ].map((item, i) => (
                <div key={i} className="p-4 rounded-xl bg-white/3 border border-white/5">
                  <div className="text-xl mb-2">{item.icon}</div>
                  <p className="text-xs text-surface-400">{item.label}</p>
                  <p className="text-sm font-semibold text-white mt-0.5">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="p-5 rounded-xl bg-eco-500/5 border border-eco-500/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Zap className="w-6 h-6 text-eco-400" />
                <div>
                  <p className="text-sm text-surface-300">Estimated Carbon Impact</p>
                  <p className="text-xl font-bold text-white">{formatCO2(result.carbonImpact)}</p>
                </div>
              </div>
              <button className="flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold text-white gradient-eco rounded-xl hover:shadow-lg hover:shadow-eco-500/20 transition-all">
                <Check className="w-4 h-4" />
                Confirm & Save
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* How it works */}
      <div className="glass-card-static p-6">
        <h2 className="text-base font-semibold text-white mb-4">How It Works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { step: '1', title: 'Upload', desc: 'Drop your electricity or utility bill (PDF/Image)', icon: '📤' },
            { step: '2', title: 'AI Extracts', desc: 'Gemini Vision reads and extracts key data', icon: '🤖' },
            { step: '3', title: 'Calculate', desc: 'Carbon impact is calculated and added to your profile', icon: '📊' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-white/3">
              <div className="text-2xl">{item.icon}</div>
              <div>
                <p className="text-sm font-medium text-white">{item.title}</p>
                <p className="text-xs text-surface-400 mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
