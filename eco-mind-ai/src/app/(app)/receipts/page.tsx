'use client';

// ===========================================
// Receipt Scanner — ECO MIND AI (Gemini Vision)
// ===========================================

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScanLine, Upload, FileText, Sparkles, ShoppingCart, Leaf, AlertTriangle } from 'lucide-react';
import { formatCO2 } from '@/lib/utils/formatters';
import { callGemini } from '@/lib/utils/gemini';
import { useAuth } from '@/contexts/AuthContext';

interface ScannedItem {
  name: string;
  category: string;
  carbonKg: number;
  rating: 'low' | 'medium' | 'high';
}

interface ScanResult {
  items: ScannedItem[];
  totalCarbonKg: number;
  recommendations: string[];
}

export default function ReceiptsPage() {
  const { user, updateUser } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileToBase64 = (f: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(f);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) setFile(selected);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) setFile(f);
  }, []);

  const handleScan = async () => {
    if (!file) return;
    setIsScanning(true);
    setError(null);
    setResult(null);

    try {
      const base64Data = await fileToBase64(file);
      const data = await callGemini('receipt', { fileData: base64Data, mimeType: file.type });
      if (data && data.isFallback) {
        throw new Error('AI analysis is temporarily unavailable. Please try again later.');
      }
      if (data && Array.isArray(data.items)) {
        const items = data.items.map((item: any) => ({
          name: item.name,
          category: item.impactRating === 'high' ? 'High Impact Item' : item.impactRating === 'medium' ? 'Medium Impact Item' : 'Sustainable Choice',
          carbonKg: Number(item.estimatedCarbonKg || 0),
          rating: item.impactRating || 'low',
        }));
        const total = items.reduce((acc: number, curr: any) => acc + curr.carbonKg, 0);
        
        const recommendations = typeof data.recommendation === 'string'
          ? data.recommendation.split('. ').filter(Boolean).map((s: string) => s.trim().replace(/\.$/, ''))
          : Array.isArray(data.recommendation)
            ? data.recommendation
            : ['Switch to lower-emission alternatives where possible'];

        setResult({
          items,
          totalCarbonKg: total,
          recommendations,
        });

        // Increment receipt scans count in Firestore
        updateUser({
          receiptScansCount: (user?.receiptScansCount || 0) + 1,
        });
      } else {
        throw new Error('Invalid format returned by Gemini Vision');
      }
    } catch (err) {
      console.warn('Real Gemini Vision receipt analysis failed:', err);
      setError('AI analysis is temporarily unavailable. Please try again later.');
    } finally {
      setIsScanning(false);
    }
  };

  const ratingColors = { low: '#22c55e', medium: '#f59e0b', high: '#ef4444' };
  const ratingLabels = { low: 'Low Impact', medium: 'Medium Impact', high: 'High Impact' };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
          Receipt <span className="text-gradient-eco">Scanner</span>
        </h1>
        <p className="text-surface-400 text-sm mt-1">
          Upload shopping receipts — AI identifies items and estimates carbon impact
        </p>
      </div>

      {/* Upload */}
      <div
        className="glass-card-static p-10 text-center border-2 border-dashed border-white/10 hover:border-eco-500/30 transition-all cursor-pointer"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        {!file ? (
          <div>
            <ScanLine className="w-12 h-12 text-surface-500 mx-auto mb-4" />
            <p className="text-white font-medium mb-2">Upload a receipt to scan</p>
            <p className="text-surface-400 text-sm mb-4">Grocery bills, restaurant receipts, shopping receipts</p>
            <label className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white gradient-eco rounded-xl cursor-pointer">
              <Upload className="w-4 h-4" />
              Choose File
              <input type="file" accept=".png,.jpg,.jpeg,.pdf" className="hidden" onChange={handleFileSelect} />
            </label>
          </div>
        ) : (
          <div>
            <FileText className="w-12 h-12 text-eco-400 mx-auto mb-3" />
            <p className="text-white font-medium">{file.name}</p>
            <div className="flex items-center justify-center gap-3 mt-4">
              <button onClick={() => { setFile(null); setResult(null); }} className="px-4 py-2 text-sm text-surface-400 hover:text-white rounded-xl hover:bg-white/5 transition-colors">
                Remove
              </button>
              <button onClick={handleScan} disabled={isScanning} className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white gradient-eco rounded-xl disabled:opacity-50">
                {isScanning ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <ScanLine className="w-4 h-4" />}
                {isScanning ? 'Scanning...' : 'Scan Receipt'}
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

      {/* Results */}
      <AnimatePresence>
        {result && (
          <motion.div className="space-y-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* Summary */}
            <div className="glass-card-static p-6">
              <div className="flex items-center gap-2 mb-4">
                <ShoppingCart className="w-5 h-5 text-eco-400" />
                <h2 className="text-base font-semibold text-white">Scanned Items ({result.items.length})</h2>
                <span className="ml-auto text-sm font-semibold text-white">Total: {formatCO2(result.totalCarbonKg)}</span>
              </div>

              <div className="space-y-2">
                {result.items.map((item, i) => (
                  <motion.div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/3 border border-white/5"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <div className="w-2 h-8 rounded-full" style={{ backgroundColor: ratingColors[item.rating] }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white">{item.name}</p>
                      <p className="text-xs text-surface-500">{item.category}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-medium" style={{ color: ratingColors[item.rating] }}>{formatCO2(item.carbonKg)}</p>
                      <p className="text-[10px]" style={{ color: ratingColors[item.rating] }}>{ratingLabels[item.rating]}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="glass-card-static p-6">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-eco-400" />
                <h2 className="text-base font-semibold text-white">AI Recommendations</h2>
              </div>
              <div className="space-y-3">
                {result.recommendations.map((rec, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-eco-500/5 border border-eco-500/10">
                    <Leaf className="w-4 h-4 text-eco-400 mt-0.5 shrink-0" />
                    <p className="text-sm text-surface-300">{rec}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
