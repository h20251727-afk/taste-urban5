/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Search, MapPin, Utensils, Star, Loader2, Sparkles, ChefHat } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface Restaurant {
  name: string;
  category: string;
  signatureMenu: string;
  reason: string;
  location: string;
}

export default function App() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Restaurant[] | null>(null);

  const presetTags = [
    '성수동', 
    '연남동', 
    '부산 광안리', 
    '제주 애월', 
    '이태원',
    '을지로'
  ];

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setQuery(searchQuery);
    setResults(null);
    try {
      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery }),
      });
      if (!response.ok) throw new Error('API Error');
      const data = await response.json();
      setResults(data);
    } catch (err) {
      console.error(err);
      alert('맛집 정보를 가져오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-orange-200">
      <main className="max-w-2xl mx-auto px-6 py-12 md:py-20">
        <header className="mb-10 text-center">
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center justify-center space-x-2 bg-orange-50 text-orange-600 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI 맞춤 가이드</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-slate-900 flex items-center justify-center gap-3"
          >
            지역 맛집 찾기 <ChefHat className="w-10 h-10 text-orange-500" />
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 mt-2 max-w-md mx-auto"
          >
            원하는 지역명이나 키워드를 검색해보세요.<br />
            해당 지역의 소문난 맛집들을 찾아드립니다.
          </motion.p>
        </header>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="relative mb-10 z-10"
        >
          <input
            type="text"
            className="w-full bg-slate-100 border-none rounded-full py-4 flex pl-14 pr-24 focus:ring-2 focus:ring-orange-500 focus:outline-none text-sm transition-all"
            placeholder="예) 강남역, 부산 해운대, 성수동 카페..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
          />
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <button 
            onClick={() => handleSearch(query)}
            disabled={loading || !query.trim()}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-orange-500 text-white px-5 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider disabled:opacity-50 transition-colors hover:bg-orange-600 active:bg-orange-700"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin mx-1" /> : '찾기'}
          </button>
        </motion.div>

        <AnimatePresence mode="wait">
          {!results && !loading && (
            <motion.div 
              key="presets"
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-2 justify-center"
            >
              {presetTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    setQuery(tag);
                    handleSearch(tag);
                  }}
                  className="bg-white border border-slate-200 text-slate-600 px-4 py-1.5 rounded-full text-xs font-semibold hover:border-orange-400 hover:text-orange-500 transition-all hover:shadow-sm"
                >
                  #{tag}
                </button>
              ))}
            </motion.div>
          )}

          {loading && (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-20 flex flex-col items-center justify-center space-y-5 text-orange-500"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-orange-100 rounded-full blur-xl opacity-50 animate-pulse"></div>
                <ChefHat className="w-16 h-16 animate-bounce relative z-10" />
              </div>
              <p className="font-semibold text-slate-500 text-sm animate-pulse">맛있는 곳을 찾는 중입니다...</p>
            </motion.div>
          )}

          {results && !loading && (
            <motion.div 
              key="results"
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-bold mb-6 flex items-center text-slate-900 border-b border-slate-200 pb-3 tracking-tight">
                <Star className="w-5 h-5 mr-2 text-orange-500 fill-current" />
                추천된 맛집 리스트
              </h2>
              
              <div className="grid gap-6">
                {results.map((res, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative overflow-hidden group"
                  >
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-bold text-slate-900 pr-4">{res.name}</h3>
                        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md text-[10px] uppercase font-bold whitespace-nowrap">
                          {res.category}
                        </span>
                      </div>
                      
                      <div className="space-y-2 mb-4 text-xs mt-1 text-slate-500">
                        <div className="flex items-center">
                          <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />
                          <span>{res.location}</span>
                        </div>
                        <div className="flex items-center">
                          <Utensils className="w-3.5 h-3.5 mr-1 text-orange-400" />
                          <span>대표 메뉴: <span className="font-medium text-slate-700">{res.signatureMenu}</span></span>
                        </div>
                      </div>
                      
                      <div className="pt-3 border-t border-slate-100">
                        <p className="text-xs text-slate-600 leading-relaxed font-medium">
                          {res.reason}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
