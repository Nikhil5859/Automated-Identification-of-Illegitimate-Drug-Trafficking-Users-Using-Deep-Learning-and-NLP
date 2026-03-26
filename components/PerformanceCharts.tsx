
import React, { useState } from 'react';

// Realistic synthetic data for the research paper
const DATA = [
    { pct: 20,  cnnAcc: 68.5, nlpAcc: 74.2, multiAcc: 79.8, cnnF1: 0.65, nlpF1: 0.71, multiF1: 0.77 },
    { pct: 40,  cnnAcc: 73.1, nlpAcc: 79.5, multiAcc: 85.4, cnnF1: 0.70, nlpF1: 0.76, multiF1: 0.83 },
    { pct: 60,  cnnAcc: 77.4, nlpAcc: 83.1, multiAcc: 89.2, cnnF1: 0.75, nlpF1: 0.80, multiF1: 0.88 },
    { pct: 80,  cnnAcc: 80.8, nlpAcc: 85.6, multiAcc: 92.1, cnnF1: 0.79, nlpF1: 0.83, multiF1: 0.90 },
    { pct: 100, cnnAcc: 82.5, nlpAcc: 87.4, multiAcc: 94.6, cnnF1: 0.81, nlpF1: 0.85, multiF1: 0.93 },
];

const COLORS = {
    cnn: '#F87171',   // Red-400
    nlp: '#60A5FA',   // Blue-400
    multi: '#34D399', // Emerald-400
};

const ChartLegend = () => (
    <div className="flex justify-center space-x-6 mb-4 text-xs font-mono">
        <div className="flex items-center"><div className="w-3 h-3 rounded-full mr-2" style={{backgroundColor: COLORS.cnn}}></div>CNN-only</div>
        <div className="flex items-center"><div