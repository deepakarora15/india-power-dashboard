import { useState } from 'react';
import { useCapacityData } from '@/hooks/useCapacityData';
import { useSectorFilter } from '@/hooks/useSectorFilter';
import { SectorStory } from '@/components/sections/SectorStory';
import { TimelineSection } from './TimelineSection';
import { getSourceColor } from '@/utils/colors';
import { formatSourceLabel, formatGW } from '@/utils/formatting';

export function IndustryOverview() {
  const { data, isLoading } = useCapacityData();
  const { sectorView, getSectorLabel, isSourceInView } = useSectorFilter();

  if (isLoading || !data) {
    return <div className="animate-pulse h-96 bg-gray-200 rounded-xl" />;
  }

  const filteredSources = data.bySource.filter((s) => isSourceInView(s.source));
  const filteredTotalGW = filteredSources.reduce((sum, s) => sum + s.capacityMW, 0) / 1000;
  const fossilGW = data.byCategory.find(c => c.category === 'fossil')?.capacityGW || 0;
  const nonFossilGW = data.byCategory.find(c => c.category === 'non_fossil')?.capacityGW || 0;
  const fossilPct = data.byCategory.find(c => c.category === 'fossil')?.percentageShare || 0;
  const nonFossilPct = data.byCategory.find(c => c.category === 'non_fossil')?.percentageShare || 0;

  return (
    <div className="space-y-5">
      {/* Top Row: Hero Stats + Source Bar in compact layout */}
      <div className="grid grid-cols-1 laptop:grid-cols-3 gap-4">
        {/* Left: Key Metric */}
        <div className="icici-card p-5 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 rounded-t-xl" style={{ background: sectorView === 'fossil' ? '#B02A30' : sectorView === 'non_fossil' ? '#005B75' : 'linear-gradient(90deg, #B02A30, #005B75)' }} />
          <p className="text-[14px] font-bold text-gray-500 uppercase tracking-wide">{getSectorLabel()}</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-4xl font-black text-gray-900">{formatGW(filteredTotalGW)}</span>
            <span className="text-base font-bold text-gray-400">GW</span>
          </div>
          <p className="text-[14px] text-gray-400 mt-1">Installed Capacity • {data.dataAsOf || 'FY24-25'}</p>
        </div>

        {/* Middle: Fossil vs Non-Fossil split (only when 'all') */}
        {sectorView === 'all' ? (
          <div className="icici-card p-5 flex flex-col justify-center">
            <p className="text-[14px] font-bold text-gray-500 uppercase tracking-wide mb-2">Energy Split</p>
            <div className="flex rounded-full overflow-hidden h-7 shadow-inner">
              <div className="flex items-center justify-center text-[14px] text-white font-bold" style={{ width: `${fossilPct}%`, backgroundColor: '#B02A30' }}>
                🔥 {fossilGW.toFixed(0)} GW ({fossilPct.toFixed(0)}%)
              </div>
              <div className="flex items-center justify-center text-[14px] text-white font-bold" style={{ width: `${nonFossilPct}%`, backgroundColor: '#005B75' }}>
                🌿 {nonFossilGW.toFixed(0)} GW ({nonFossilPct.toFixed(0)}%)
              </div>
            </div>
            <div className="flex justify-between text-[14px] text-gray-400 mt-1.5">
              <span>Fossil</span>
              <span>Non-Fossil</span>
            </div>
          </div>
        ) : (
          <div className="icici-card p-5 flex flex-col justify-center">
            <p className="text-[14px] font-bold text-gray-500 uppercase tracking-wide mb-2">Sources</p>
            <div className="flex rounded-lg overflow-hidden h-7 border border-gray-200">
              {filteredSources.sort((a, b) => b.capacityMW - a.capacityMW).slice(0, 4).map(s => {
                const pct = (s.capacityMW / (filteredTotalGW * 1000)) * 100;
                return (<div key={s.source} className="flex items-center justify-center text-[14px] text-white font-bold" style={{ width: `${pct}%`, backgroundColor: getSourceColor(s.source as any) }}>{pct >= 15 ? formatSourceLabel(s.source) : ''}</div>);
              })}
            </div>
          </div>
        )}

        {/* Right: Quick stats */}
        <div className="icici-card p-5 flex flex-col justify-center">
          <p className="text-[14px] font-bold text-gray-500 uppercase tracking-wide mb-2">Key Facts</p>
          <div className="grid grid-cols-2 gap-2">
            <div className="text-center p-2 rounded-lg bg-gray-50">
              <div className="text-sm font-black text-icici-maroon">22.5×</div>
              <div className="text-[14px] text-gray-400">Growth since 1975</div>
            </div>
            <div className="text-center p-2 rounded-lg bg-gray-50">
              <div className="text-sm font-black text-icici-navy">53.5%</div>
              <div className="text-[14px] text-gray-400">Private Sector</div>
            </div>
            <div className="text-center p-2 rounded-lg bg-gray-50">
              <div className="text-sm font-black text-green-700">1,752</div>
              <div className="text-[14px] text-gray-400">BU Generated</div>
            </div>
            <div className="text-center p-2 rounded-lg bg-gray-50">
              <div className="text-sm font-black text-amber-600">36</div>
              <div className="text-[14px] text-gray-400">States & UTs</div>
            </div>
          </div>
        </div>
      </div>

      {/* Source Breakdown — compact horizontal */}
      <div className="icici-card p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-bold text-gray-700">Source-wise Capacity</h3>
          <span className="text-[14px] text-gray-400">{data.dataSource}</span>
        </div>
        <div className="grid grid-cols-2 laptop:grid-cols-5 gap-2">
          {filteredSources.sort((a, b) => b.capacityMW - a.capacityMW).slice(0, 10).map(s => {
            const pct = (s.capacityMW / (filteredTotalGW * 1000)) * 100;
            return (
              <div key={s.source} className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 border border-gray-100">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: getSourceColor(s.source as any) }} />
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-bold text-gray-700 truncate">{formatSourceLabel(s.source)}</div>
                  <div className="text-[14px] text-gray-400">{(s.capacityMW / 1000).toFixed(1)} GW • {pct.toFixed(1)}%</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sector Story — compact */}
      <SectorStory />

      {/* Timeline Section */}
      <div className="icici-card p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1 h-5 rounded-full bg-icici-navy" />
          <h3 className="text-xs font-bold text-gray-700">Growth Journey & Future Outlook</h3>
        </div>
        <TimelineSection />
      </div>

      {/* Upcoming Company Capacity */}
      <UpcomingCapacityChart />
    </div>
  );
}

// Upcoming capacity data
const UPCOMING_DATA = [
  { name: 'Adani Green', current: 20.0, upcoming: 25.0, total: 45.0, type: 'Solar + Wind (Khavda 30 GW)', by: 'FY30', color: '#2E7D32' },
  { name: 'NTPC RE', current: 5.2, upcoming: 54.8, total: 60.0, type: 'Solar + Wind (pan-India)', by: 'FY32', color: '#1565C0' },
  { name: 'JSW Energy', current: 5.8, upcoming: 14.2, total: 20.0, type: 'Solar + Wind + Hydro', by: 'FY30', color: '#E65100' },
  { name: 'ReNew Energy', current: 11.0, upcoming: 7.0, total: 18.0, type: 'Solar + Wind + Hybrid', by: 'FY28', color: '#00838F' },
  { name: 'Tata Power RE', current: 6.7, upcoming: 8.3, total: 15.0, type: 'Solar + Wind', by: 'FY29', color: '#4527A0' },
  { name: 'Greenko', current: 9.2, upcoming: 5.8, total: 15.0, type: 'Pumped Hydro + RE', by: 'FY28', color: '#558B2F' },
  { name: 'NHPC', current: 7.2, upcoming: 8.5, total: 15.7, type: 'Hydro (Subansiri, Parbati)', by: 'FY30', color: '#0277BD' },
  { name: 'Adani Power', current: 16.0, upcoming: 4.0, total: 20.0, type: 'Coal (under construction)', by: 'FY27', color: '#B71C1C' },
  { name: 'Sembcorp India', current: 4.8, upcoming: 5.2, total: 10.0, type: 'Solar + Wind', by: 'FY28', color: '#6A1B9A' },
  { name: 'SJVN', current: 2.5, upcoming: 5.0, total: 7.5, type: 'Hydro + Solar (HP, Bihar)', by: 'FY29', color: '#00695C' },
];

function UpcomingCapacityChart() {
  const [hovered, setHovered] = useState<number | null>(null);
  const [clicked, setClicked] = useState<number | null>(null);
  const maxTotal = Math.max(...UPCOMING_DATA.map(d => d.total));

  return (
    <div className="icici-card p-5">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-1 h-5 rounded-full bg-icici-maroon" />
        <h3 className="text-sm font-bold text-gray-700">📈 Upcoming Capacity — Company Growth Pipeline</h3>
      </div>
      <p className="text-[12px] text-gray-400 mb-4 ml-3">Current operational + announced pipeline (GW) • Hover for details, click to expand</p>

      <div className="space-y-2.5">
        {UPCOMING_DATA.map((company, idx) => {
          const isHovered = hovered === idx;
          const isClicked = clicked === idx;
          const currentPct = (company.current / maxTotal) * 100;
          const upcomingPct = (company.upcoming / maxTotal) * 100;

          return (
            <div key={idx}>
              <div
                className={`p-3 rounded-xl border cursor-pointer transition-all duration-200 ${
                  isHovered || isClicked ? 'border-gray-300 shadow-md bg-gray-50' : 'border-gray-100 hover:border-gray-200'
                }`}
                onMouseEnter={() => setHovered(idx)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => setClicked(isClicked ? null : idx)}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-sm font-bold text-gray-800 w-32 truncate">{company.name}</span>
                  <div className="flex-1 flex items-center h-6 bg-gray-100 rounded-full overflow-hidden">
                    {/* Current bar */}
                    <div
                      className="h-full flex items-center justify-center text-[10px] text-white font-bold rounded-l-full transition-all duration-500"
                      style={{ width: `${currentPct}%`, backgroundColor: company.color }}
                    >
                      {currentPct > 12 ? `${company.current} GW` : ''}
                    </div>
                    {/* Upcoming bar (striped) */}
                    <div
                      className="h-full flex items-center justify-center text-[10px] font-bold rounded-r-full transition-all duration-500"
                      style={{
                        width: `${upcomingPct}%`,
                        backgroundColor: company.color,
                        opacity: 0.4,
                        backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(255,255,255,0.3) 3px, rgba(255,255,255,0.3) 6px)',
                      }}
                    >
                      {upcomingPct > 10 ? `+${company.upcoming}` : ''}
                    </div>
                  </div>
                  <span className="text-sm font-black text-gray-800 w-16 text-right">{company.total} GW</span>
                </div>

                {/* Hover tooltip */}
                {isHovered && !isClicked && (
                  <div className="text-[11px] text-gray-500 ml-[140px] animate-fadeIn">
                    Current: {company.current} GW → Target: {company.total} GW by {company.by} | {company.type}
                  </div>
                )}
              </div>

              {/* Expanded detail on click */}
              {isClicked && (
                <div className="ml-4 mt-1 p-3 rounded-lg bg-blue-50 border border-blue-200 animate-fadeIn">
                  <div className="grid grid-cols-4 gap-3 text-xs">
                    <div><span className="text-gray-500">Current:</span> <strong>{company.current} GW</strong></div>
                    <div><span className="text-gray-500">Pipeline:</span> <strong className="text-blue-700">+{company.upcoming} GW</strong></div>
                    <div><span className="text-gray-500">Target:</span> <strong className="text-green-700">{company.total} GW</strong></div>
                    <div><span className="text-gray-500">Timeline:</span> <strong>{company.by}</strong></div>
                  </div>
                  <p className="text-[11px] text-gray-600 mt-2">📋 {company.type}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-100">
        <div className="flex items-center gap-1.5"><div className="w-4 h-3 rounded bg-gray-600" /><span className="text-[11px] text-gray-500">Current Capacity</span></div>
        <div className="flex items-center gap-1.5"><div className="w-4 h-3 rounded bg-gray-400" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,0.4) 2px, rgba(255,255,255,0.4) 4px)' }} /><span className="text-[11px] text-gray-500">Upcoming / Pipeline</span></div>
        <span className="text-[10px] text-gray-400 ml-auto">Source: Company annual reports, SECI auction results, CEA pipeline</span>
      </div>
    </div>
  );
}


