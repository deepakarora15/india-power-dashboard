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
    </div>
  );
}


