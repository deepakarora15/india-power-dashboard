import { useState } from 'react';
import { useMarketPlayers, MarketPlayer } from '@/hooks/useMarketPlayers';
import { useSectorFilter } from '@/hooks/useSectorFilter';
import { formatMW } from '@/utils/formatting';
import { getSourceColor } from '@/utils/colors';
import { ThermalPlayersSection } from '@/components/sections/ThermalPlayersSection';

export function MarketPlayersSection() {
  const { data, isLoading } = useMarketPlayers();
  const { sectorView } = useSectorFilter();
  const [selectedCompany, setSelectedCompany] = useState<MarketPlayer | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'non-fossil' | 'fossil'>(sectorView === 'fossil' ? 'fossil' : 'non-fossil');

  if (isLoading) {
    return <div className="animate-pulse h-96 bg-gray-200 rounded-xl" />;
  }

  if (!data) {
    return (
      <div className="icici-card p-6 border-l-4 border-icici-maroon">
        <p className="font-bold text-icici-maroon">Market Players — Data temporarily unavailable</p>
      </div>
    );
  }

  // Show Fossil tab content
  if (activeTab === 'fossil') {
    return (
      <div className="space-y-5">
        {/* Tab switcher */}
        <div className="flex gap-2">
          <button onClick={() => setActiveTab('non-fossil')} className="px-4 py-2 rounded-lg text-sm font-bold bg-white text-gray-600 border border-gray-200 hover:border-green-400 transition-all">
            🌿 Non-Fossil Players
          </button>
          <button onClick={() => setActiveTab('fossil')} className="px-4 py-2 rounded-lg text-sm font-bold bg-red-600 text-white shadow-md">
            🔥 Fossil / Thermal Players
          </button>
        </div>
        <ThermalPlayersSection />
      </div>
    );
  }

  const maxCapacity = data.companies[0]?.totalRECapacityMW || 1;

  const filteredCompanies = (filterType === 'all'
    ? data.companies
    : data.companies.filter((c) => {
        if (filterType === 'solar') return c.solarMW > c.windMW && c.solarMW > c.hydroMW;
        if (filterType === 'wind') return c.windMW > c.solarMW;
        if (filterType === 'psu') return c.ownership === 'central_psu';
        return true;
      })
  ).sort((a, b) => b.totalRECapacityMW - a.totalRECapacityMW);

  return (
    <div className="space-y-5">
      {/* Tab switcher */}
      <div className="flex gap-2">
        <button onClick={() => setActiveTab('non-fossil')} className="px-4 py-2 rounded-lg text-sm font-bold bg-green-600 text-white shadow-md">
          🌿 Non-Fossil Players
        </button>
        <button onClick={() => setActiveTab('fossil')} className="px-4 py-2 rounded-lg text-sm font-bold bg-white text-gray-600 border border-gray-200 hover:border-red-400 transition-all">
          🔥 Fossil / Thermal Players
        </button>
      </div>

      {/* National RE Summary */}
      <div className="icici-card p-5">
        <h3 className="text-sm font-bold text-gray-700 mb-1">
          India Renewable Energy — Market Overview
        </h3>
        <p className="text-[14px] text-gray-400 mb-4">
          Source: MNRE Physical Progress (mnre.gov.in) as on 30.06.2026
        </p>
        {/* RE Capacity Summary Bar */}
        <div className="grid grid-cols-2 laptop:grid-cols-5 gap-3 mb-4">
          <div className="p-3 rounded-lg bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 text-center">
            <div className="text-lg font-black text-amber-700">{(data.nationalRESummary.solarMW / 1000).toFixed(1)} GW</div>
            <div className="text-[14px] font-bold text-gray-500">☀️ Solar</div>
          </div>
          <div className="p-3 rounded-lg bg-gradient-to-br from-teal-50 to-blue-50 border border-teal-100 text-center">
            <div className="text-lg font-black text-teal-700">{(data.nationalRESummary.windMW / 1000).toFixed(1)} GW</div>
            <div className="text-[14px] font-bold text-gray-500">💨 Wind</div>
          </div>
          <div className="p-3 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 text-center">
            <div className="text-lg font-black text-blue-700">{(data.nationalRESummary.largeHydroMW / 1000).toFixed(1)} GW</div>
            <div className="text-[14px] font-bold text-gray-500">💧 Large Hydro</div>
          </div>
          <div className="p-3 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 text-center">
            <div className="text-lg font-black text-green-700">{(data.nationalRESummary.biomassMW / 1000).toFixed(1)} GW</div>
            <div className="text-[14px] font-bold text-gray-500">🌿 Biomass</div>
          </div>
          <div className="p-3 rounded-lg bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-100 text-center">
            <div className="text-lg font-black text-purple-700">{(data.nationalRESummary.nuclearMW / 1000).toFixed(1)} GW</div>
            <div className="text-[14px] font-bold text-gray-500">⚛️ Nuclear</div>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-icici-cream border border-gray-100 text-center">
          <span className="text-sm font-black text-gray-900">Total Non-Fossil: {(data.nationalRESummary.totalNonFossilMW / 1000).toFixed(1)} GW</span>
          <span className="text-xs text-gray-500 ml-2">(RE excl. Large Hydro: {(data.nationalRESummary.totalRECapacityMW / 1000).toFixed(1)} GW)</span>
        </div>
      </div>

      {/* Market Players List */}
      <div className="icici-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-gray-700">Top Renewable Energy Companies</h3>
            <p className="text-[14px] text-gray-400 mt-0.5">Ranked by operational RE capacity • Click company for details</p>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {[
            { id: 'all', label: 'All Players', icon: '🏢' },
            { id: 'solar', label: 'Solar-Led', icon: '☀️' },
            { id: 'wind', label: 'Wind-Led', icon: '💨' },
            { id: 'psu', label: 'PSU Only', icon: '🏛️' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterType(f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterType === f.id
                  ? 'bg-icici-maroon text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {f.icon} {f.label}
            </button>
          ))}
          <button
            onClick={() => {
              const headers = 'Rank,Company,Total RE (MW),Solar (MW),Wind (MW),Hydro (MW),Ownership,Listed,Notes\n';
              const rows = filteredCompanies.map((c, i) =>
                `${i+1},"${c.name}",${c.totalRECapacityMW},${c.solarMW},${c.windMW},${c.hydroMW || 0},"${c.ownership}","${c.listed}","${(c.notes || '').replace(/"/g, '""')}"`
              ).join('\n');
              const blob = new Blob([headers + rows], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a'); a.href = url; a.download = 'RE_Market_Players.csv'; a.click(); URL.revokeObjectURL(url);
            }}
            className="ml-auto px-3 py-1.5 rounded-lg text-xs font-bold bg-green-600 text-white hover:bg-green-700 transition-all"
          >
            📥 Download List
          </button>
        </div>

        {/* Company Cards */}
        <div className="space-y-3">
          {filteredCompanies.map((company, idx) => {
            const isSelected = selectedCompany?.rank === company.rank;
            const marketShare = ((company.totalRECapacityMW / data.nationalRESummary.totalRECapacityMW) * 100).toFixed(1);

            return (
              <div key={company.rank}>
                <div
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected ? 'bg-icici-cream border-icici-maroon shadow-md' : 'bg-gray-50 border-gray-100 hover:bg-gray-100'
                  }`}
                  onClick={() => setSelectedCompany(isSelected ? null : company)}
                >
                  <div className="flex items-center gap-3">
                    {/* Rank */}
                    <div className="w-7 h-7 rounded-full bg-icici-navy flex items-center justify-center text-white font-black text-[14px] flex-shrink-0">
                      {idx + 1}
                    </div>

                    {/* Name + Tags */}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-gray-800 truncate">{company.name}</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[14px] px-1.5 py-0.5 rounded bg-gray-200 text-gray-600 font-medium">{company.listed}</span>
                        <span className="text-[14px] text-gray-400">{marketShare}% national RE share</span>
                      </div>
                    </div>

                    {/* Capacity */}
                    <div className="text-right flex-shrink-0">
                      <div className="text-base font-black text-gray-900">{(company.totalRECapacityMW / 1000).toFixed(1)} GW</div>
                      <div className="text-[14px] text-gray-400">{formatMW(company.totalRECapacityMW)} MW</div>
                    </div>
                  </div>

                  {/* Source Mix Bar */}
                  <div className="flex rounded-lg overflow-hidden h-5 mt-3 border border-gray-200">
                    {company.solarMW > 0 && (
                      <div
                        className="flex items-center justify-center text-[14px] text-white font-bold"
                        style={{ width: `${(company.solarMW / company.totalRECapacityMW) * 100}%`, backgroundColor: getSourceColor('solar') }}
                      >
                        {(company.solarMW / company.totalRECapacityMW) * 100 >= 15 ? `☀️ ${((company.solarMW / company.totalRECapacityMW) * 100).toFixed(0)}%` : ''}
                      </div>
                    )}
                    {company.windMW > 0 && (
                      <div
                        className="flex items-center justify-center text-[14px] text-white font-bold"
                        style={{ width: `${(company.windMW / company.totalRECapacityMW) * 100}%`, backgroundColor: getSourceColor('wind') }}
                      >
                        {(company.windMW / company.totalRECapacityMW) * 100 >= 15 ? `💨 ${((company.windMW / company.totalRECapacityMW) * 100).toFixed(0)}%` : ''}
                      </div>
                    )}
                    {company.hydroMW > 0 && (
                      <div
                        className="flex items-center justify-center text-[14px] text-white font-bold"
                        style={{ width: `${(company.hydroMW / company.totalRECapacityMW) * 100}%`, backgroundColor: getSourceColor('large_hydro') }}
                      >
                        {(company.hydroMW / company.totalRECapacityMW) * 100 >= 15 ? `💧 ${((company.hydroMW / company.totalRECapacityMW) * 100).toFixed(0)}%` : ''}
                      </div>
                    )}
                  </div>

                  {/* Market share bar */}
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${(company.totalRECapacityMW / maxCapacity) * 100}%`, backgroundColor: '#B02A30' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Expanded Detail */}
                {isSelected && (
                  <div className="mt-2 p-4 rounded-xl bg-white border border-gray-200 shadow-sm">
                    <div className="grid grid-cols-1 laptop:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-xs font-bold text-gray-600 uppercase mb-2">Capacity Breakdown</h4>
                        <div className="space-y-2">
                          {company.solarMW > 0 && (
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getSourceColor('solar') }} />
                              <span className="text-xs text-gray-700 flex-1">☀️ Solar</span>
                              <span className="text-xs font-black">{formatMW(company.solarMW)} MW</span>
                              <span className="text-[14px] text-gray-400">({((company.solarMW / company.totalRECapacityMW) * 100).toFixed(1)}%)</span>
                            </div>
                          )}
                          {company.windMW > 0 && (
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getSourceColor('wind') }} />
                              <span className="text-xs text-gray-700 flex-1">💨 Wind</span>
                              <span className="text-xs font-black">{formatMW(company.windMW)} MW</span>
                              <span className="text-[14px] text-gray-400">({((company.windMW / company.totalRECapacityMW) * 100).toFixed(1)}%)</span>
                            </div>
                          )}
                          {company.hydroMW > 0 && (
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getSourceColor('large_hydro') }} />
                              <span className="text-xs text-gray-700 flex-1">💧 Hydro</span>
                              <span className="text-xs font-black">{formatMW(company.hydroMW)} MW</span>
                              <span className="text-[14px] text-gray-400">({((company.hydroMW / company.totalRECapacityMW) * 100).toFixed(1)}%)</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-gray-600 uppercase mb-2">Details</h4>
                        <div className="text-xs text-gray-600 space-y-1.5">
                          <p><span className="font-semibold">Ownership:</span> {company.ownership === 'central_psu' ? 'Central PSU' : 'Private'}</p>
                          <p><span className="font-semibold">Listing:</span> {company.listed}</p>
                          <p><span className="font-semibold">Note:</span> {company.notes}</p>
                        </div>
                        <div className="mt-3 p-2 rounded bg-gray-50 border border-gray-100">
                          <p className="text-[14px] text-gray-400"><span className="font-bold">Data Source:</span> {company.source}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Data Sources Footer */}
        <div className="mt-5 pt-4 border-t border-gray-200">
          <h4 className="text-[14px] font-bold text-gray-500 uppercase mb-2">Data Sources & Methodology</h4>
          <div className="text-[14px] text-gray-400 space-y-0.5">
            {data.dataSources.map((src, i) => (
              <p key={i}>• {src}</p>
            ))}
            <p className="mt-2 text-[14px] text-amber-600 font-medium">
              ⚠️ Note: Company-level data is sourced from corporate filings, press releases, and annual reports.
              Government sources (CEA/MNRE) report aggregate sector-wise data only, not company-wise.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


