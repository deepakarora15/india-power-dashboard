import { useState } from 'react';
import { useSectorFilter } from '@/hooks/useSectorFilter';

type RiskSource = 'coal' | 'wind' | 'solar';

export function RiskAnalysis() {
  const { sectorView } = useSectorFilter();
  const [activeSource, setActiveSource] = useState<RiskSource>('coal');
  const [activeTab, setActiveTab] = useState<'insurable' | 'framework' | 'emerging-tech' | 'non-insurable' | 'best-practices'>('insurable');

  // Determine available sources based on sector view
  const sources: { id: RiskSource; label: string; icon: string; color: string }[] = [];
  if (sectorView === 'all' || sectorView === 'fossil') {
    sources.push({ id: 'coal', label: 'Coal / Thermal', icon: '🏭', color: '#B02A30' });
  }
  if (sectorView === 'all' || sectorView === 'non_fossil') {
    sources.push({ id: 'wind', label: 'Wind', icon: '💨', color: '#005B75' });
    sources.push({ id: 'solar', label: 'Solar', icon: '☀️', color: '#F99D27' });
  }

  // Reset active source if not in current view
  if (!sources.find(s => s.id === activeSource) && sources.length > 0) {
    setActiveSource(sources[0].id);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="icici-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-icici-maroon to-icici-navy flex items-center justify-center text-xl">🛡️</div>
          <div>
            <h2 className="text-base font-black text-gray-800">Risk Analysis — Power Sector</h2>
            <p className="text-[14px] text-gray-400">Insurable & Non-Insurable risks • Material Damage (AOG & Non-AOG) • Best Practices</p>
          </div>
        </div>

        {/* Source Selector */}
        <div className="flex gap-2 mb-4">
          {sources.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSource(s.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeSource === s.id ? 'text-white shadow-lg scale-105' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              style={activeSource === s.id ? { backgroundColor: s.color } : {}}
            >
              <span className="text-base">{s.icon}</span>
              <span>{s.label}</span>
            </button>
          ))}
        </div>

        {/* Visual Banner Image */}
        <div className="mb-4 rounded-xl overflow-hidden h-32 relative">
          {activeSource === 'coal' && <img src="https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=900&h=200&fit=crop" alt="Thermal Power Plant" className="w-full h-full object-cover" />}
          {activeSource === 'wind' && <img src="https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?w=900&h=200&fit=crop" alt="Wind Turbines" className="w-full h-full object-cover" />}
          {activeSource === 'solar' && <img src="https://images.unsplash.com/photo-1509391366360-2e959784a276?w=900&h=200&fit=crop" alt="Solar Panels" className="w-full h-full object-cover" />}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center px-6">
            <div>
              <p className="text-white text-sm font-black">{activeSource === 'coal' ? '🏭 Coal / Thermal Power Risk Profile' : activeSource === 'wind' ? '💨 Wind Energy Risk Profile' : '☀️ Solar Energy Risk Profile'}</p>
              <p className="text-white/70 text-[14px] mt-1">{activeSource === 'coal' ? 'Boilers, turbines, transformers — high value, long lead times' : activeSource === 'wind' ? 'Blades, gearboxes, towers — exposed to weather extremes' : 'Modules, inverters, trackers — hail & storm vulnerability'}</p>
            </div>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1 flex-wrap">
          {[
            { id: 'insurable' as const, label: '🛡️ Insurable Risks' },
            { id: 'framework' as const, label: '📐 Risk Framework' },
            ...[{ id: 'emerging-tech' as const, label: '🔬 Emerging Tech' }],
            { id: 'non-insurable' as const, label: '⚠️ Non-Insurable' },
            { id: 'best-practices' as const, label: '✅ Best Practices' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === tab.id ? 'bg-white text-icici-maroon shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {activeTab === 'insurable' && <InsurableRisks source={activeSource} />}
      {activeTab === 'framework' && <RiskFramework source={activeSource} />}
      {activeTab === 'emerging-tech' && <EmergingTechRisks source={activeSource} />}
      {activeTab === 'non-insurable' && <NonInsurableRisks source={activeSource} />}
      {activeTab === 'best-practices' && <BestPractices source={activeSource} />}
    </div>
  );
}

function InsurableRisks({ source }: { source: RiskSource }) {
  if (source === 'coal') return <CoalInsurableRisks />;
  if (source === 'wind') return <WindInsurableRisks />;
  return <SolarInsurableRisks />;
}

function RiskFramework({ source }: { source: RiskSource }) {
  const sourceLabel = source === 'coal' ? 'Coal/Thermal' : source === 'wind' ? 'Wind' : 'Solar';

  // Probability-Impact Matrix Data per source
  const riskMatrix: Record<RiskSource, { risk: string; prob: string; impact: string; score: string; emv: string; strategy: string; strategyUrl: string; strategyTooltip: string; owner: string; trigger: string }[]> = {
    coal: [
      { risk: 'Boiler Tube Failure', prob: 'High (70%)', impact: 'High', score: '9/9', emv: '₹84 Cr', strategy: 'Mitigate', strategyUrl: 'https://www.power-eng.com/coal/boiler-tube-failure-root-cause-analysis/', strategyTooltip: 'Regular ultrasonic tube thickness mapping + condition-based replacement of eroded sections before failure occurs. Reduces tube burst frequency by 60%.', owner: 'Plant Head', trigger: 'Tube wall thickness < 3mm' },
      { risk: 'Turbine Blade Failure', prob: 'Low (15%)', impact: 'Critical', score: '5/9', emv: '₹52 Cr', strategy: 'Transfer (Insurance)', strategyUrl: 'https://www.fmglobal.com/research-and-resources/research-and-testing/research-technical-reports', strategyTooltip: 'Transfer residual risk to insurer via Machinery Breakdown + BI cover. Ensure sum insured covers full rotor replacement cost + 18 months lost revenue.', owner: 'CRO', trigger: 'Vibration exceeds 4mm/s' },
      { risk: 'Cyclone / Flood (Coastal)', prob: 'Medium (30%)', impact: 'High', score: '6/9', emv: '₹75 Cr', strategy: 'Mitigate + Transfer', strategyUrl: 'https://mausam.imd.gov.in/imd_latest/contents/cyclone.php', strategyTooltip: 'Install flood protection barriers + elevate critical equipment. Transfer residual exposure via Property All Risk policy with adequate flood sublimit.', owner: 'O&M Head', trigger: 'IMD cyclone warning' },
      { risk: 'Transformer Explosion', prob: 'Medium (25%)', impact: 'High', score: '6/9', emv: '₹20 Cr', strategy: 'Transfer (Insurance)', strategyUrl: 'https://electrical-engineering-portal.com/dissolved-gas-analysis-dga-of-transformer-oil', strategyTooltip: 'DGA (Dissolved Gas Analysis) — monthly oil sampling detects incipient faults by measuring gases like hydrogen & acetylene. Predicts 90% of failures 6-12 months in advance.', owner: 'Electrical Head', trigger: 'DGA values exceeding norms' },
      { risk: 'Coal Mill Fire', prob: 'High (50%)', impact: 'Medium', score: '6/9', emv: '₹15 Cr', strategy: 'Mitigate', strategyUrl: 'https://www.power-eng.com/coal/preventing-coal-fires-in-power-plants/', strategyTooltip: 'Install CO monitoring in coal mills + maintain mill outlet temperature below 90°C. Inert gas suppression system for early-stage fire containment.', owner: 'Fuel Mgmt', trigger: 'Mill outlet temp > 90°C' },
      { risk: 'Regulatory (Emission Norms)', prob: 'High (80%)', impact: 'Medium', score: '6/9', emv: '₹200 Cr (FGD capex)', strategy: 'Acceptance', strategyUrl: 'https://cpcb.nic.in/', strategyTooltip: 'FGD (Flue Gas Desulphurization) installation mandated by CPCB. Budget ₹200 Cr capex per unit. Accept regulatory timeline risk and plan compliance schedule.', owner: 'CEO/Board', trigger: 'CPCB compliance deadline' },
    ],
    wind: [
      { risk: 'Cyclone Blade Damage', prob: 'Medium (25%)', impact: 'Critical', score: '7/9', emv: '₹45 Cr', strategy: 'Transfer (Insurance)', strategyUrl: 'https://www.gcube-insurance.com/news/insights/', strategyTooltip: 'Property All Risk policy with named storm sublimit. Ensure adequate reinstatement cover for multiple WTG losses in single cyclone event. GCube specialist wind cover recommended.', owner: 'Asset Manager', trigger: 'IMD wind warning > 120 kmph' },
      { risk: 'Lightning Strike', prob: 'High (60%)', impact: 'Medium', score: '6/9', emv: '₹8 Cr', strategy: 'Mitigate (LPS upgrade)', strategyUrl: 'https://www.windpowerengineering.com/lightning-protection-for-wind-turbines-a-complete-guide/', strategyTooltip: 'LPS (Lightning Protection System) upgrade — install enhanced blade tip receptors + down-conductors that safely channel lightning current to ground. Reduces blade damage claims by 70%.', owner: 'O&M Head', trigger: 'Monsoon onset / thunderstorm alert' },
      { risk: 'Gearbox Failure', prob: 'Medium (35%)', impact: 'High', score: '6/9', emv: '₹12 Cr', strategy: 'Mitigate + Transfer', strategyUrl: 'https://www.nrel.gov/wind/gearbox-reliability.html', strategyTooltip: 'Monthly oil particle analysis to detect bearing wear early. Transfer residual risk via Machinery Breakdown cover with agreed gearbox replacement methodology.', owner: 'Technical Head', trigger: 'Oil particle count > threshold' },
      { risk: 'Blade Fatigue/Erosion', prob: 'High (50%)', impact: 'Medium', score: '6/9', emv: '₹6 Cr', strategy: 'Mitigate (LEP coatings)', strategyUrl: 'https://www.compositesworld.com/articles/leading-edge-protection-for-wind-turbine-blades', strategyTooltip: 'LEP (Leading Edge Protection) — apply erosion-resistant coatings/tapes to blade tips. Prevents rain/sand erosion that leads to structural delamination. Extends blade life by 5-8 years.', owner: 'O&M Head', trigger: 'Blade inspection report findings' },
      { risk: 'Crane Unavailability (BI)', prob: 'High (70%)', impact: 'High', score: '9/9', emv: '₹18 Cr', strategy: 'Mitigate (pre-booking)', strategyUrl: 'https://www.windpowermonthly.com/article/1525419/crane-logistics-key-reducing-downtime', strategyTooltip: 'Pre-book crane through annual retainer agreement. In India, large cranes (500T+) have 3-6 month wait. Pre-booking reduces BI claim duration by 50%.', owner: 'Procurement', trigger: 'Any major component failure' },
      { risk: 'Grid Curtailment', prob: 'Medium (40%)', impact: 'Medium', score: '4/9', emv: '₹5 Cr/yr', strategy: 'Acceptance', strategyUrl: 'https://posoco.in/reports/monthly-reports/', strategyTooltip: 'Grid curtailment is a regulatory/commercial risk not covered by insurance. Accept with contingency budget. Monitor POSOCO/SLDC dispatch orders for pattern analysis.', owner: 'Commercial', trigger: 'SLDC curtailment order' },
    ],
    solar: [
      { risk: 'Hailstorm Module Damage', prob: 'Medium (30%)', impact: 'Critical', score: '7/9', emv: '₹60 Cr', strategy: 'Transfer (Insurance)', strategyUrl: 'https://www.pv-magazine.com/2025/12/22/building-resilience-amid-intensifying-weather-events/', strategyTooltip: 'Transfer via Property All Risk with adequate hail sublimit. Consider parametric hail cover (Swiss Re model) triggered by radar data for faster payout within 72 hours.', owner: 'Asset Manager', trigger: 'IMD hail warning / radar alert' },
      { risk: 'Cyclone/Windstorm', prob: 'Medium (25%)', impact: 'High', score: '6/9', emv: '₹35 Cr', strategy: 'Mitigate (stow) + Transfer', strategyUrl: 'https://www.solarpowerworldonline.com/2023/06/how-solar-trackers-protect-against-high-winds/', strategyTooltip: 'Auto-stow system rotates tracker modules to face ground during storm warnings. Reduces cyclone damage by 40%. Requires redundant communication + manual override capability.', owner: 'O&M Head', trigger: 'Wind speed > 100 kmph forecast' },
      { risk: 'Inverter Failure', prob: 'High (45%)', impact: 'Medium', score: '6/9', emv: '₹8 Cr', strategy: 'Mitigate (redundancy)', strategyUrl: 'https://www.solarpowerworldonline.com/2022/09/string-inverters-vs-central-inverters/', strategyTooltip: 'Use string inverters instead of single central inverter — distributes failure risk. If one string inverter fails, only 100kW affected vs 1-4 MW for central inverter failure.', owner: 'Electrical Head', trigger: 'Inverter efficiency drop > 2%' },
      { risk: 'DC Arc Flash / Fire', prob: 'Low (15%)', impact: 'High', score: '4/9', emv: '₹12 Cr', strategy: 'Mitigate (IR scanning)', strategyUrl: 'https://www.solarpowerworldonline.com/2021/07/prevent-arc-flash-fires-at-solar-installations/', strategyTooltip: 'Annual infrared thermography scanning of all DC connectors and junction boxes. Detects hot spots (resistance anomalies) before they escalate to arc flash fires.', owner: 'O&M Head', trigger: 'Thermal scan hotspot > 20°C delta' },
      { risk: 'Module Supply (BCD/ALMM)', prob: 'Medium (40%)', impact: 'Medium', score: '4/9', emv: '₹10 Cr (schedule delay)', strategy: 'Avoidance (domestic sourcing)', strategyUrl: 'https://mnre.gov.in/en/physical-progress/', strategyTooltip: 'Avoid import dependency by sourcing ALMM-listed domestic modules. Eliminates 40% BCD cost and 2-month import delay that extends BI claims.', owner: 'Procurement', trigger: 'Policy gazette notification' },
      { risk: 'DISCOM Payment Delay', prob: 'High (60%)', impact: 'Medium', score: '6/9', emv: '₹25 Cr (working capital)', strategy: 'Acceptance + Hedge', strategyUrl: 'https://www.praapti.in/', strategyTooltip: 'DISCOM payment delays (60-180 days common) are a commercial risk. Accept with working capital buffer. Monitor via PRAAPTI portal. Consider payment security mechanisms (LC/escrow) in PPA.', owner: 'CFO', trigger: 'Payment > 90 days overdue' },
    ],
  };

  // Case studies per source
  const caseStudies: Record<RiskSource, { title: string; location: string; date: string; loss: string; rootCause: string; impact: string; lessons: string[]; benchmark: string }> = {
    coal: {
      title: 'NTPC Unchahar Unit-6 Boiler Explosion',
      location: 'Unchahar, Uttar Pradesh',
      date: 'November 2017',
      loss: '₹150+ Cr (MD + BI combined)',
      rootCause: 'High-pressure steam line rupture due to tube erosion. Accumulated ash deposits caused localized overheating beyond design limits.',
      impact: '500 MW unit offline for 8 months. 26 fatalities. Regulatory scrutiny triggered industry-wide boiler inspection mandate.',
      lessons: [
        'Condition-based maintenance (CBM) with regular tube thickness mapping is critical',
        'Ash blower maintenance schedule directly correlates with tube life',
        'BI indemnity period of 12 months proved adequate for this loss',
        'Pre-agreed repair methodology with OEM (BHEL) accelerated restoration',
      ],
      benchmark: 'Post-event, NTPC invested ₹2,400 Cr in fleet-wide boiler health monitoring systems. Industry benchmark: FM Global recommends annual tube thickness surveys for units > 15 years old.',
    },
    wind: {
      title: 'Cyclone Tauktae — Gujarat Wind Farm Portfolio Damage',
      location: 'Kutch & Jamnagar, Gujarat',
      date: 'May 2021',
      loss: '₹180 Cr (across multiple developers)',
      rootCause: 'Extremely severe cyclonic storm with sustained winds of 185 kmph — beyond design wind speed (Class IIA: 52 m/s) for most installed turbines.',
      impact: '78 WTGs damaged (blade failures, tower buckling, nacelle rotation). 450 MW offline for 4–12 months. Crane mobilization delayed due to damaged access roads.',
      lessons: [
        'Coastal Gujarat sites need Class IA turbines (designed for 70 m/s)',
        'Crane pre-booking contracts essential — 6-month wait post-event',
        'Portfolio-level insurance with named storm sublimits required adequate reinstatement',
        'Blade inventory at regional depots reduced restoration time by 2 months for prepared operators',
      ],
      benchmark: 'GCube (specialist wind insurer) reported 2021 as the costliest cyclone year for Indian wind, with industry losses exceeding ₹500 Cr. Global benchmark: IEC 61400-1 Class IA design standard now recommended for all Indian coastal sites.',
    },
    solar: {
      title: 'Rajasthan Hailstorm — Bhadla/Fatehgarh Solar Parks',
      location: 'Jaisalmer & Jodhpur, Rajasthan',
      date: 'March 2023',
      loss: '₹350+ Cr (multi-developer, 600+ MW affected)',
      rootCause: 'Unusually large hailstones (40–60 mm diameter) with wind-driven impact. Modules shattered despite meeting IEC 61215 hail test (25 mm at 23 m/s).',
      impact: '600+ MW capacity damaged across 5 developers. 30–80% module replacement needed per site. Module supply constrained due to BCD import restrictions. Full restoration took 6–9 months.',
      lessons: [
        'IEC hail test (25 mm) is inadequate for Indian conditions — need 40 mm+ qualification',
        'Tracker auto-stow systems reduced damage by 40% where deployed (modules face ground during storm)',
        'BCD made module replacement 40% costlier and 2 months slower than pre-BCD era',
        'Electroluminescence (EL) imaging essential to detect hidden micro-cracks post-hail (visual inspection misses 30% of damage)',
      ],
      benchmark: 'Munich Re classified Indian solar hail as an emerging "secondary peril" in their 2024 NatCat report. Industry benchmark: Swiss Re now offers parametric hail covers triggered by radar data, paying within 72 hours of event confirmation.',
    },
  };

  const matrix = riskMatrix[source];
  const cs = caseStudies[source];

  return (
    <div className="space-y-5">
      {/* Framework Header */}
      <div className="icici-card p-5 border-l-4 border-icici-navy">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-xl">📐</span>
          <div>
            <h3 className="text-sm font-black text-gray-800">Risk Assessment Framework — ISO 31000 Aligned</h3>
            <p className="text-[14px] text-gray-400">Systematic identification, analysis, evaluation & treatment of risks • {sourceLabel}</p>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-5 gap-2 text-center text-[14px]">
          {['Identify', 'Analyze', 'Evaluate', 'Treat', 'Monitor'].map((step, i) => (
            <div key={step} className="p-2 rounded-lg bg-icici-navy/5 border border-icici-navy/20">
              <div className="font-black text-icici-navy">{i + 1}. {step}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Probability-Impact Matrix */}
      <div className="icici-card p-5">
        <h3 className="text-sm font-black text-gray-800 mb-1">Probability × Impact Matrix — {sourceLabel}</h3>
        <p className="text-[14px] text-gray-400 mb-4">Quantitative assessment with Expected Monetary Value (EMV) = Probability × Financial Impact</p>

        {/* Visual 3x3 Matrix */}
        <div className="mb-4 grid grid-cols-4 gap-0 text-[14px] font-bold text-center" style={{ width: '280px' }}>
          <div className="p-1" />
          <div className="p-2 bg-green-50 border border-green-200 rounded-tl">Low Impact</div>
          <div className="p-2 bg-amber-50 border border-amber-200">Med Impact</div>
          <div className="p-2 bg-red-50 border border-red-200 rounded-tr">High Impact</div>
          <div className="p-2 bg-red-50 border border-red-200 rounded-tl text-red-700">High Prob</div>
          <div className="p-2 bg-amber-100 border border-amber-200">3</div>
          <div className="p-2 bg-orange-100 border border-orange-200">6</div>
          <div className="p-2 bg-red-200 border border-red-300 text-red-800">9</div>
          <div className="p-2 bg-amber-50 border border-amber-200 text-amber-700">Med Prob</div>
          <div className="p-2 bg-green-100 border border-green-200">2</div>
          <div className="p-2 bg-amber-100 border border-amber-200">4</div>
          <div className="p-2 bg-orange-100 border border-orange-200">6</div>
          <div className="p-2 bg-green-50 border border-green-200 rounded-bl text-green-700">Low Prob</div>
          <div className="p-2 bg-green-50 border border-green-200">1</div>
          <div className="p-2 bg-green-100 border border-green-200">2</div>
          <div className="p-2 bg-amber-100 border border-amber-200 rounded-br">3</div>
        </div>

        {/* Risk Register Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-[14px] border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b-2 border-gray-200">
                <th className="text-left p-2 font-bold text-gray-600">Risk Event</th>
                <th className="text-center p-2 font-bold text-gray-600">Probability</th>
                <th className="text-center p-2 font-bold text-gray-600">Impact</th>
                <th className="text-center p-2 font-bold text-gray-600">Score</th>
                <th className="text-center p-2 font-bold text-gray-600">EMV</th>
                <th className="text-center p-2 font-bold text-gray-600">Strategy</th>
                <th className="text-left p-2 font-bold text-gray-600">Owner</th>
                <th className="text-left p-2 font-bold text-gray-600">Trigger Event</th>
              </tr>
            </thead>
            <tbody>
              {matrix.map((r, i) => (
                <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-2 font-bold text-gray-800">{r.risk}</td>
                  <td className="p-2 text-center"><span className={`px-1.5 py-0.5 rounded text-[14px] font-bold ${r.prob.includes('High') ? 'bg-red-100 text-red-700' : r.prob.includes('Medium') ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>{r.prob}</span></td>
                  <td className="p-2 text-center font-bold">{r.impact}</td>
                  <td className="p-2 text-center font-black text-icici-maroon">{r.score}</td>
                  <td className="p-2 text-center font-black text-icici-navy">{r.emv}</td>
                  <td className="p-2 text-center relative group">
                    <a href={r.strategyUrl} target="_blank" rel="noopener noreferrer" className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 text-[14px] font-bold hover:bg-blue-100 hover:underline inline-block cursor-pointer">
                      {r.strategy} ↗
                    </a>
                    {r.strategyTooltip && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-gray-900 text-white text-[14px] rounded-lg shadow-xl z-50 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        <span className="font-bold text-icici-orange">How it works:</span> {r.strategyTooltip}
                        <span className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
                      </div>
                    )}
                  </td>
                  <td className="p-2 text-gray-600">{r.owner}</td>
                  <td className="p-2 text-gray-500 text-[14px]">{r.trigger}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Case Study */}
      <div className="icici-card p-5 border-l-4 border-amber-400">
        <h3 className="text-sm font-black text-gray-800 mb-1">📋 Case Study — {cs.title}</h3>
        <div className="flex items-center gap-3 text-[14px] text-gray-500 mb-3">
          <span>📍 {cs.location}</span>
          <span>📅 {cs.date}</span>
          <span className="font-bold text-icici-maroon">💰 Loss: {cs.loss}</span>
        </div>

        <div className="grid grid-cols-1 laptop:grid-cols-2 gap-4 mb-4">
          <div className="p-3 rounded-lg bg-red-50 border border-red-100">
            <h4 className="text-[14px] font-bold text-red-800 uppercase mb-1">Root Cause</h4>
            <p className="text-[14px] text-gray-700 leading-relaxed">{cs.rootCause}</p>
          </div>
          <div className="p-3 rounded-lg bg-amber-50 border border-amber-100">
            <h4 className="text-[14px] font-bold text-amber-800 uppercase mb-1">Operational Impact</h4>
            <p className="text-[14px] text-gray-700 leading-relaxed">{cs.impact}</p>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-green-50 border border-green-100 mb-3">
          <h4 className="text-[14px] font-bold text-green-800 uppercase mb-2">Key Lessons Learned</h4>
          <ul className="space-y-1">
            {cs.lessons.map((l, i) => (
              <li key={i} className="text-[14px] text-gray-700 flex items-start gap-1.5">
                <span className="text-green-600 mt-0.5 flex-shrink-0">✓</span>
                <span>{l}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-3 rounded-lg bg-blue-50 border border-blue-100">
          <h4 className="text-[14px] font-bold text-blue-800 uppercase mb-1">Industry Benchmark</h4>
          <p className="text-[14px] text-gray-700 leading-relaxed">{cs.benchmark}</p>
        </div>
      </div>

      {/* Claims Learnings & Industry Benchmarks */}
      <div className="icici-card p-5 border-l-4 border-icici-navy">
        <h3 className="text-sm font-black text-gray-800 mb-1">📊 Claims Learnings & Industry Benchmarks</h3>
        <p className="text-[14px] text-gray-400 mb-4">Authenticated data from global insurers and loss adjusters</p>

        {/* Global Benchmark Stats */}
        <div className="grid grid-cols-2 laptop:grid-cols-4 gap-3 mb-4">
          <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-center">
            <div className="text-lg font-black text-red-700">$3.7B</div>
            <div className="text-[14px] text-gray-500">FM Global: Power losses 2021–25 (427 events globally)</div>
          </div>
          <div className="p-3 rounded-lg bg-amber-50 border border-amber-100 text-center">
            <div className="text-lg font-black text-amber-700">54%</div>
            <div className="text-[14px] text-gray-500">GCube: Solar loss costs from hail (only 1.4% of claims by volume)</div>
          </div>
          <div className="p-3 rounded-lg bg-blue-50 border border-blue-100 text-center">
            <div className="text-lg font-black text-blue-700">$58M</div>
            <div className="text-[14px] text-gray-500">Average hail claim per solar event (GCube 2018–2023)</div>
          </div>
          <div className="p-3 rounded-lg bg-purple-50 border border-purple-100 text-center">
            <div className="text-lg font-black text-purple-700">18 mo</div>
            <div className="text-[14px] text-gray-500">Average turbine rotor replacement lead time (FM Global)</div>
          </div>
        </div>

        {/* Claims Learnings per source */}
        <ClaimsLearnings source={source} />
      </div>

      {/* Additional Case Studies */}
      <div className="icici-card p-5">
        <h3 className="text-sm font-black text-gray-800 mb-3">📋 Additional Case Studies — {source === 'coal' ? 'Coal/Thermal' : source === 'wind' ? 'Wind' : 'Solar'}</h3>
        <AdditionalCaseStudies source={source} />
      </div>

      {/* Mitigation Strategy Summary */}
      <div className="icici-card p-5">
        <h3 className="text-sm font-black text-gray-800 mb-3">Mitigation Strategy Framework (PMBOK)</h3>
        <div className="grid grid-cols-2 laptop:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-center">
            <div className="text-lg mb-1">🚫</div>
            <div className="text-[14px] font-black text-red-800">AVOID</div>
            <div className="text-[14px] text-gray-600 mt-1">Eliminate the risk by changing plan/scope</div>
            <div className="text-[14px] text-gray-400 mt-1 italic">e.g., Don't build in flood zone</div>
          </div>
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-center">
            <div className="text-lg mb-1">🛡️</div>
            <div className="text-[14px] font-black text-amber-800">MITIGATE</div>
            <div className="text-[14px] text-gray-600 mt-1">Reduce probability or impact through controls</div>
            <div className="text-[14px] text-gray-400 mt-1 italic">e.g., Install hail early warning + auto-stow</div>
          </div>
          <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-center">
            <div className="text-lg mb-1">🔄</div>
            <div className="text-[14px] font-black text-blue-800">TRANSFER</div>
            <div className="text-[14px] text-gray-600 mt-1">Shift risk to third party (insurance/contract)</div>
            <div className="text-[14px] text-gray-400 mt-1 italic">e.g., Property All Risk + BI cover</div>
          </div>
          <div className="p-3 rounded-xl bg-green-50 border border-green-200 text-center">
            <div className="text-lg mb-1">✅</div>
            <div className="text-[14px] font-black text-green-800">ACCEPT</div>
            <div className="text-[14px] text-gray-600 mt-1">Acknowledge risk with contingency budget</div>
            <div className="text-[14px] text-gray-400 mt-1 italic">e.g., Regulatory change — budget for compliance</div>
          </div>
        </div>
      </div>

      {/* Technical Glossary */}
      <div className="icici-card p-5">
        <h3 className="text-sm font-black text-gray-800 mb-3">📖 Technical Glossary — Click any term to learn</h3>
        <div className="grid grid-cols-2 laptop:grid-cols-3 gap-2">
          {Object.entries(GLOSSARY).map(([term, def]) => (
            <div key={term} className="p-2 rounded-lg bg-gray-50 border border-gray-100 group cursor-help relative">
              <div className="text-[14px] font-black text-icici-navy">{term}</div>
              <div className="text-[14px] text-gray-500 line-clamp-2">{def.split('—')[0]}</div>
              <div className="absolute bottom-full left-0 mb-1 w-72 p-3 bg-gray-900 text-white text-[14px] rounded-lg shadow-xl z-50 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <span className="font-bold text-icici-orange">{term}</span>: {def}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CoalInsurableRisks() {
  return (
    <div className="space-y-4">
      {/* AOG Perils */}
      <div className="icici-card p-5 border-l-4 border-red-400">
        <h3 className="text-sm font-black text-gray-800 mb-1">🌪️ Act of God (AOG) Perils — Material Damage</h3>
        <p className="text-[14px] text-gray-400 mb-4">Natural catastrophes causing physical damage to plant & machinery</p>
        <div className="space-y-3">
          <RiskCard
            title="Flood / Cyclone Damage"
            severity="high"
            description="Coastal plants (Mundra, Tuticorin) exposed to cyclonic storms. Inland plants near rivers face flooding of coal yards, ash ponds, and cooling systems."
            impactAreas={['Boiler damage from water ingress', 'Coal stockpile washing away', 'Ash pond breach (environmental liability)', 'Cooling tower structural damage']}
            typicalClaim="₹50–500 Cr per event"
          />
          <RiskCard
            title="Earthquake"
            severity="medium"
            description="Plants in seismic zones (Gujarat, NE India). Foundation damage to boiler structures, chimney collapse, turbine misalignment."
            impactAreas={['Boiler drum displacement', 'Turbine foundation cracks', 'Chimney/stack collapse', 'Coal handling plant derailment']}
            typicalClaim="₹100–1,000 Cr (rare but catastrophic)"
          />
          <RiskCard
            title="Lightning"
            severity="medium"
            description="Transformer damage, control system failures. Outdoor switchyard equipment particularly vulnerable."
            impactAreas={['Transformer burnout', 'Switchgear failure', 'DCS/PLC damage', 'Fire following lightning']}
            typicalClaim="₹5–50 Cr per transformer"
          />
          <RiskCard
            title="Storm / Windstorm"
            severity="medium"
            description="Damage to coal handling conveyors, crusher house roofing, cooling tower fills."
            impactAreas={['Conveyor belt damage', 'Roof sheeting loss', 'Cooling tower fill collapse', 'Transmission line tower failure']}
            typicalClaim="₹10–100 Cr"
          />
        </div>
      </div>

      {/* Non-AOG Perils */}
      <div className="icici-card p-5 border-l-4 border-orange-400">
        <h3 className="text-sm font-black text-gray-800 mb-1">🔧 Non-AOG Perils — Material Damage</h3>
        <p className="text-[14px] text-gray-400 mb-4">Man-made / operational failures causing physical damage</p>
        <div className="space-y-3">
          <RiskCard
            title="Boiler Explosion / Tube Failure"
            severity="high"
            description="Most frequent large loss in thermal plants. Superheater/reheater tube erosion, drum weld failures. Typically 3–6 months downtime."
            impactAreas={['Boiler tube burst (erosion/corrosion)', 'Drum weld failure', 'Economizer leak', 'Steam line rupture']}
            typicalClaim="₹20–200 Cr + BI losses"
          />
          <RiskCard
            title="Turbine Failure"
            severity="high"
            description="Blade failure, bearing seizure, rotor damage. Long lead time for replacement (12–18 months). Single largest loss potential."
            impactAreas={['LP/HP blade failure', 'Rotor rub / misalignment', 'Generator winding burnout', 'Bearing seizure']}
            typicalClaim="₹100–500 Cr (incl. BI)"
          />
          <RiskCard
            title="Fire & Explosion"
            severity="high"
            description="Coal dust explosion, oil fire in turbine hall, cable gallery fire, hydrogen fire in generator."
            impactAreas={['Coal mill fire/explosion', 'Turbine oil fire', 'Cable gallery fire', 'Hydrogen system leak/explosion']}
            typicalClaim="₹50–300 Cr"
          />
          <RiskCard
            title="Transformer Failure"
            severity="medium"
            description="Internal fault, winding failure, bushing flashover. 12–18 month replacement lead time."
            impactAreas={['Winding insulation breakdown', 'Bushing failure', 'Tap changer malfunction', 'Oil fire/explosion']}
            typicalClaim="₹15–80 Cr per unit"
          />
          <RiskCard
            title="Machinery Breakdown"
            severity="medium"
            description="BFP, ID/FD fans, ESP, coal crusher, mills. High-speed rotating equipment failures."
            impactAreas={['Boiler feed pump seizure', 'ID/FD fan blade failure', 'Coal mill gearbox failure', 'ESP rapper damage']}
            typicalClaim="₹5–50 Cr"
          />
        </div>
      </div>

      {/* Business Interruption */}
      <div className="icici-card p-5 border-l-4 border-purple-400">
        <h3 className="text-sm font-black text-gray-800 mb-1">📉 Business Interruption / Loss of Profit</h3>
        <p className="text-[14px] text-gray-400 mb-4">Revenue loss following insured material damage event</p>
        <div className="p-3 rounded-lg bg-purple-50 border border-purple-100 text-[14px] text-gray-700">
          <p className="font-bold mb-1">Key Factors:</p>
          <ul className="space-y-1 list-disc list-inside">
            <li>Indemnity period: typically 12–24 months for thermal plants</li>
            <li>Daily revenue exposure: ₹2–5 Cr per 500 MW unit</li>
            <li>Interdependency: shared coal handling, common water system</li>
            <li>Long lead times: turbine rotors (18 months), generators (12 months)</li>
            <li>PPA penalties for non-supply to grid</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function WindInsurableRisks() {
  return (
    <div className="space-y-4">
      <div className="icici-card p-5 border-l-4 border-teal-400">
        <h3 className="text-sm font-black text-gray-800 mb-1">🌪️ Act of God (AOG) Perils — Material Damage</h3>
        <p className="text-[14px] text-gray-400 mb-4">Natural catastrophes affecting wind turbine generators (WTGs)</p>
        <div className="space-y-3">
          <RiskCard
            title="Cyclone / Extreme Windstorm"
            severity="high"
            description="Winds exceeding design speed (typically 52–59 m/s). Blade damage, tower buckling, nacelle destruction. Coastal Gujarat & TN most exposed."
            impactAreas={['Blade root crack/delamination', 'Tower buckling at base', 'Nacelle detachment', 'Yaw system failure', 'Multiple WTG losses in single event']}
            typicalClaim="₹5–15 Cr per WTG; ₹50–200 Cr for portfolio"
          />
          <RiskCard
            title="Lightning Strike"
            severity="high"
            description="Most frequent AOG peril for wind. Blade tip damage (most common), control panel damage, gearbox bearing pitting from electrical discharge."
            impactAreas={['Blade tip receptor burn', 'Full blade delamination from strike', 'SCADA/control system damage', 'Generator winding failure']}
            typicalClaim="₹50 Lakh–5 Cr per WTG"
          />
          <RiskCard
            title="Flood / Landslide"
            severity="medium"
            description="Access road washout, foundation undermining (hill sites), substation flooding. Particularly relevant for hilly terrain sites (MH, KA)."
            impactAreas={['Foundation scour/undermining', 'Substation flooding', 'Internal road damage (access loss)', 'Cable trench damage']}
            typicalClaim="₹5–30 Cr per site"
          />
        </div>
      </div>

      <div className="icici-card p-5 border-l-4 border-orange-400">
        <h3 className="text-sm font-black text-gray-800 mb-1">🔧 Non-AOG Perils — Material Damage</h3>
        <p className="text-[14px] text-gray-400 mb-4">Operational/mechanical failures in wind turbines</p>
        <div className="space-y-3">
          <RiskCard
            title="Gearbox Failure"
            severity="high"
            description="Most expensive component failure. Bearing fatigue, gear tooth pitting, oil contamination. Especially in older geared turbines (sub-2 MW class)."
            impactAreas={['Main bearing failure', 'Planetary gear damage', 'High-speed shaft failure', 'Oil system contamination']}
            typicalClaim="₹1.5–4 Cr per WTG (replacement + crane)"
          />
          <RiskCard
            title="Blade Failure (Non-AOG)"
            severity="high"
            description="Leading edge erosion, root joint fatigue, structural delamination. Larger blades (70m+) on newer turbines more susceptible to fatigue."
            impactAreas={['Leading edge erosion (sand/rain)', 'Root joint debonding', 'Spar cap delamination', 'Trailing edge split']}
            typicalClaim="₹80 Lakh–3 Cr per blade"
          />
          <RiskCard
            title="Generator / Electrical Failure"
            severity="medium"
            description="Winding insulation breakdown, slip ring damage (DFIG), converter failure. Humid coastal environments accelerate degradation."
            impactAreas={['Stator winding burnout', 'Converter/inverter failure', 'Slip ring wear (DFIG)', 'Transformer failure (pad-mount)']}
            typicalClaim="₹50 Lakh–2 Cr per WTG"
          />
          <RiskCard
            title="Foundation Defect"
            severity="low"
            description="Grouting failure, anchor bolt fatigue, concrete cracking. Rare but catastrophic — can lead to tower collapse."
            impactAreas={['Anchor bolt loosening', 'Grout gap formation', 'Concrete spalling', 'Tower tilt beyond tolerance']}
            typicalClaim="₹3–10 Cr (tower collapse scenario)"
          />
        </div>
      </div>

      <div className="icici-card p-5 border-l-4 border-purple-400">
        <h3 className="text-sm font-black text-gray-800 mb-1">📉 Business Interruption</h3>
        <p className="text-[14px] text-gray-400 mb-4">Revenue loss from WTG downtime following insured damage</p>
        <div className="p-3 rounded-lg bg-purple-50 border border-purple-100 text-[14px] text-gray-700">
          <p className="font-bold mb-1">Key Factors:</p>
          <ul className="space-y-1 list-disc list-inside">
            <li>Crane availability: 3–6 months wait for large cranes in India</li>
            <li>Blade lead time: 4–8 months for modern 70m+ blades</li>
            <li>Gearbox lead time: 6–12 months (often refurbished)</li>
            <li>Seasonal wind loss: if repair misses monsoon season, full year revenue lost</li>
            <li>Daily revenue per 3 MW WTG: ₹1.5–3 Lakh (at 28% CUF)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function SolarInsurableRisks() {
  return (
    <div className="space-y-4">
      <div className="icici-card p-5 border-l-4 border-amber-400">
        <h3 className="text-sm font-black text-gray-800 mb-1">🌪️ Act of God (AOG) Perils — Material Damage</h3>
        <p className="text-[14px] text-gray-400 mb-4">Natural catastrophes affecting solar PV plants</p>
        <div className="space-y-3">
          <RiskCard
            title="Cyclone / Windstorm"
            severity="high"
            description="Module blowoff, tracker structure collapse, mounting structure buckling. Ground-mount plants in RJ/GJ/AP/TN exposed."
            impactAreas={['Module blowoff (clamp failure)', 'Tracker torque tube buckling', 'Mounting structure torsion', 'Perimeter fence collapse causing module damage']}
            typicalClaim="₹10–100 Cr for large parks"
          />
          <RiskCard
            title="Hailstorm"
            severity="high"
            description="Glass breakage on modules. Large hailstones (>25mm) can destroy entire arrays. Rajasthan, MP, UP prone. Emerged as top peril post-2020."
            impactAreas={['Module glass shattering', 'Cell micro-cracks (hidden damage)', 'Inverter housing damage', 'Junction box/connector damage']}
            typicalClaim="₹20–200 Cr (can damage 30–80% of modules in severe event)"
          />
          <RiskCard
            title="Flood"
            severity="medium"
            description="Substation inundation, cable trench flooding, module submersion (ground-mount). Low-lying sites in river plains most vulnerable."
            impactAreas={['Inverter/transformer submersion', 'Cable insulation breakdown', 'Module hotspot from water ingress', 'Road access loss delaying repairs']}
            typicalClaim="₹5–50 Cr"
          />
          <RiskCard
            title="Lightning"
            severity="medium"
            description="Inverter damage, string fuse burnout, module bypass diode failure. Large open-field installations act as lightning collectors."
            impactAreas={['Central/string inverter failure', 'Combiner box burnout', 'Module bypass diode damage', 'SCADA/monitoring system failure']}
            typicalClaim="₹1–10 Cr per event"
          />
        </div>
      </div>

      <div className="icici-card p-5 border-l-4 border-orange-400">
        <h3 className="text-sm font-black text-gray-800 mb-1">🔧 Non-AOG Perils — Material Damage</h3>
        <p className="text-[14px] text-gray-400 mb-4">Operational/defect-driven failures in solar plants</p>
        <div className="space-y-3">
          <RiskCard
            title="Inverter Failure"
            severity="high"
            description="IGBT failure, capacitor degradation, firmware malfunction. Central inverters (1–4 MW) are single points of failure for large string arrays."
            impactAreas={['IGBT module burnout', 'DC bus capacitor failure', 'Grid-tie relay malfunction', 'Cooling fan failure → thermal runaway']}
            typicalClaim="₹50 Lakh–5 Cr per inverter"
          />
          <RiskCard
            title="Fire"
            severity="medium"
            description="DC arc flash (connector failure), combiner box fire, inverter room fire. Dry vegetation around modules accelerates spread."
            impactAreas={['DC arc flash at connector', 'Combiner box thermal runaway', 'Module hotspot → backsheet fire', 'Cable tray fire']}
            typicalClaim="₹5–50 Cr (rapid spread in module arrays)"
          />
          <RiskCard
            title="Tracker / Structure Failure"
            severity="medium"
            description="Motor failure, drive mechanism jam, software malfunction causing modules to face wrong angle or stow failure during storm."
            impactAreas={['Slew drive failure', 'Controller software bug (wrong stow)', 'Torque tube corrosion/fatigue', 'Bearing seizure']}
            typicalClaim="₹2–20 Cr"
          />
          <RiskCard
            title="Module Defect (Latent)"
            severity="low"
            description="PID (Potential Induced Degradation), snail trails, backsheet cracking, cell micro-cracks. Often manufacturer warranty issue but can escalate."
            impactAreas={['PID (performance loss)', 'Hot-spot cell failure → fire', 'Backsheet delamination', 'Connector failure → arc']}
            typicalClaim="₹1–10 Cr (warranty dispute common)"
          />
        </div>
      </div>

      <div className="icici-card p-5 border-l-4 border-purple-400">
        <h3 className="text-sm font-black text-gray-800 mb-1">📉 Business Interruption</h3>
        <p className="text-[14px] text-gray-400 mb-4">Revenue loss following insured damage to solar plant</p>
        <div className="p-3 rounded-lg bg-purple-50 border border-purple-100 text-[14px] text-gray-700">
          <p className="font-bold mb-1">Key Factors:</p>
          <ul className="space-y-1 list-disc list-inside">
            <li>Module replacement: 2–4 months (domestic), 4–6 months (import with BCD)</li>
            <li>Inverter replacement: 1–3 months (string), 3–6 months (central)</li>
            <li>Daily revenue per 100 MW: ₹25–35 Lakh (at 18–22% CUF)</li>
            <li>Seasonal impact: damage in Oct–Mar loses peak generation months</li>
            <li>Partial loss common: 20–50% capacity affected, rest operational</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function ClaimsLearnings({ source }: { source: RiskSource }) {
  const learnings: Record<RiskSource, { title: string; learning: string; action: string; source: string }[]> = {
    coal: [
      { title: 'BI exceeds MD in 70% of turbine claims', learning: 'Business Interruption loss (revenue loss during repair) is typically 2–3× the Material Damage cost for turbine failures due to 12–18 month replacement lead times.', action: 'Ensure BI indemnity period covers at least 24 months. Pre-agree expediting costs clause.', source: 'FM Global Power Generation Loss Report 2025' },
      { title: 'Boiler tube failures are predictable', learning: 'NTPC data shows 85% of tube failures occur in units > 15 years old at locations with known erosion patterns. Condition monitoring reduces frequency by 60%.', action: 'Mandate annual ultrasonic tube thickness survey. Flag zones with < 3.5mm wall thickness.', source: 'NTPC O&M Best Practices Manual; BHEL Technical Advisory' },
      { title: 'Vedanta Singhitarai 2025 — maintenance lapse', learning: 'Boiler explosion killed 25 workers in April 2025. Root cause: negligence in equipment upkeep and operational lapses causing sudden pressure fluctuations.', action: 'Risk surveys must verify maintenance schedules. Lack of CBM = higher premium loading.', source: 'Business Standard Jul 2026; AIR Newsonair' },
      { title: 'Transformer DGA saves 90% of failures', learning: 'Dissolved Gas Analysis (DGA) sampling at monthly intervals can predict 90% of transformer failures 6–12 months in advance.', action: 'Insist on DGA reports as pre-renewal condition. Flag hydrogen + acetylene rise trends.', source: 'IEEE C57.104 Standard; CIGRE TB 771' },
      { title: 'Coal mill fires — most underreported peril', learning: 'Mill fires account for 30% of thermal plant fire incidents but < 5% of insured claims (often absorbed in maintenance budget). When they escalate, losses reach ₹50+ Cr.', action: 'Include mill fire detection (CO monitoring) in risk improvement recommendations.', source: 'Allianz AGCS Power Risk Report 2024' },
    ],
    wind: [
      { title: 'Crane availability is the #1 BI driver', learning: 'In 85% of major component failures (gearbox, generator, blade root), the actual repair takes 2–4 weeks but crane wait time adds 3–6 months. This dominates BI claims.', action: 'Recommend crane pre-booking contracts. Consider crane availability sublimit in BI wording.', source: 'GCube Renewable Energy Claims Report 2024' },
      { title: 'Lightning — frequency vs severity disconnect', learning: 'Lightning causes 45% of wind claims by NUMBER but only 12% by VALUE. Most are blade tip receptor burns (₹50 Lakh). However, 5% escalate to full blade replacement (₹3 Cr).', action: 'Deductibles should be calibrated to blade tip repair cost (₹50L) not full blade cost.', source: 'GCube Global Wind Claims Database 2018–2023' },
      { title: 'Serial defects — gearbox bearing patterns', learning: 'Certain turbine models (sub-2MW, specific gearbox OEMs) show systematic bearing failures at 8–12 year mark. Portfolio-level exposure can reach ₹100+ Cr for 100+ turbines.', action: 'Assess fleet composition during underwriting. Serial defect exclusions need careful wording.', source: 'DNV Turbine Advisory; Vestas & Gamesa service bulletins' },
      { title: 'Cyclone Tauktae exposed design class inadequacy', learning: '78 WTGs damaged in 2021 because most Gujarat coastal turbines were Class IIA (52 m/s) not Class IA (70 m/s). The ₹500 Cr industry loss was largely avoidable with correct design class.', action: 'Check design wind speed class in survey reports for coastal sites. Class IIA on coast = red flag.', source: 'GCube India Cyclone Report 2021; IEC 61400-1' },
      { title: 'Repowering creates transition risk', learning: 'Old sub-MW turbines (1990s vintage) have no spares availability. OEMs have exited. Sites are stuck between old non-functional turbines and repowering regulatory delays.', action: 'Legacy fleet (>20 years) should have declining reinstatement cover or actual cash value clause.', source: 'MNRE Repowering Policy 2024; Industry consultations' },
    ],
    solar: [
      { title: 'Hail: 1.4% of claims, 54% of costs', learning: 'GCube data (2018–2023) shows hail is only 1.4% of solar claims by volume but an extraordinary 54.2% of total incurred costs. Average hail claim: $58.4 million.', action: 'Hail sublimits must be adequate — not a token amount. Parametric hail triggers (radar-based) enable faster payouts.', source: 'GCube Insurance Solar Claims Report Dec 2023; pv-magazine' },
      { title: 'IEC 61215 hail test is inadequate for India', learning: 'Standard IEC test uses 25mm ice ball at 23 m/s. Indian hailstorms produce 40–60mm stones at 30+ m/s. Modules passing IEC test still shatter in real events.', action: 'Require enhanced hail testing (40mm+) in procurement specs. Tracker auto-stow reduces damage 40%.', source: 'MDPI Technologies Journal 2025; TÜV Rheinland advisory' },
      { title: 'Hidden micro-cracks = delayed degradation', learning: 'Post-hail visual inspection misses 30% of damage. Modules with micro-cracks show normal output initially but degrade rapidly over 6–12 months (hotspots → fire risk).', action: 'Mandate EL imaging within 48 hours of hail event. Claim should include latent damage provision.', source: 'Fraunhofer ISE; RETC Module Reliability Report 2024' },
      { title: 'BCD (40% import duty) extends BI by 2 months', learning: 'Post-2022, module replacement for claims takes 2 months longer due to Basic Customs Duty on imports + ALMM compliance for domestic modules. This adds ₹5–10 Cr to BI claims for large plants.', action: 'Factor BCD/ALMM delay into BI indemnity period assessment. Domestic sourcing agreements help.', source: 'MNRE ALMM Order 2023; Industry feedback' },
      { title: 'DC arc flash — silent killer', learning: 'DC connector failures cause arc flash that ignites module backsheets. Fire spreads rapidly in dry Rajasthan/Gujarat conditions. A single connector failure can destroy 5–20 MW of modules in minutes.', action: 'Thermal IR scanning of connectors annually. String-level monitoring detects resistance anomalies early.', source: 'Energies Media Jun 2025; BRE National Solar Centre UK' },
    ],
  };

  return (
    <div className="space-y-2">
      {learnings[source].map((l, i) => (
        <div key={i} className="p-3 rounded-lg bg-white border border-gray-200">
          <div className="flex items-start gap-2">
            <span className="text-sm mt-0.5">💡</span>
            <div className="flex-1">
              <h4 className="text-[14px] font-black text-gray-800">{l.title}</h4>
              <p className="text-[14px] text-gray-600 mt-1 leading-relaxed">{l.learning}</p>
              <div className="mt-2 p-2 rounded bg-green-50 border border-green-100">
                <span className="text-[14px] font-bold text-green-700">Action: </span>
                <span className="text-[14px] text-green-800">{l.action}</span>
              </div>
              <p className="text-[14px] text-gray-400 mt-1 italic">Source: {l.source}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function AdditionalCaseStudies({ source }: { source: RiskSource }) {
  const cases: Record<RiskSource, { title: string; date: string; loss: string; summary: string; keyLearning: string; url: string | null }[]> = {
    coal: [
      { title: 'Vedanta Singhitarai Boiler Blast — Chhattisgarh', date: 'April 2025', loss: '25 fatalities, ₹200+ Cr', summary: 'Boiler pressure fluctuation due to maintenance negligence caused catastrophic explosion. FIR filed against company chairman. Industrial safety overhaul mandated across all Vedanta plants.', keyLearning: 'Maintenance audit compliance must be a pre-condition for cover. Lack of CBM systems = increased moral hazard.', url: 'https://www.business-standard.com/india-news/industrial-accidents-claimed-196-lives-in-17-months-chhattisgarh-govt-126071700126_1.html' },
      { title: 'NTPC Unchahar Boiler Explosion — Uttar Pradesh', date: 'November 2017', loss: '38 fatalities, ₹300+ Cr (MD + BI)', summary: 'Flue gas and steam escaped from a duct at 20m elevation due to boiler tube rupture. 38 killed, 100+ injured. Safety norms violated — boiler operations went wrong during pressure buildup.', keyLearning: 'Post-overhaul startup is highest-risk period. Pre-agreed OEM supervision for boiler work. BI indemnity must cover 12+ months.', url: 'https://indianexpress.com/article/india/ntpc-blast-raebareli-uttar-pradesh-early-probe-show-safety-norms-violated-boiler-ops-went-wrong-4920144/' },
      { title: 'Sipat STPS Generator Winding Failure', date: '2020', loss: '₹180 Cr (incl 14 months BI)', summary: 'Stator winding insulation breakdown in 660 MW unit. Root cause: moisture ingress during monsoon maintenance outage. Generator rewinding took 14 months (COVID supply chain delays).', keyLearning: 'Maintenance-period exposures (outage/turnaround risks) need specific cover. COVID-era claims highlighted supply chain BI exposure.', url: null },
    ],
    wind: [
      { title: 'Suzlon S111 Blade Serial Defect — Pan-India', date: '2019–2021', loss: '₹400+ Cr (fleet-wide)', summary: 'Systematic root joint debonding in Suzlon S111 (2.1 MW) blades across 200+ turbines. Manufacturing defect in adhesive bonding. Required blade replacement program spanning 3 years.', keyLearning: 'Serial defect clauses in insurance policies are critical for fleet operators. OEM warranty alone was insufficient to cover the full replacement cost + BI.', url: null },
      { title: 'Cyclone Amphan — West Bengal Wind Damage', date: 'May 2020', loss: '₹60 Cr', summary: 'Category 5 cyclone damaged 22 WTGs in Digha-Contai corridor. Tower buckling (3), blade root failures (15), yaw failures (4). Access roads destroyed delayed crane arrival by 4 months.', keyLearning: 'Road damage = invisible BI multiplier. Pre-event logistics planning (crane staging, road repair budget) should be part of ERM.', url: null },
      { title: 'ReNew Energy Gearbox Campaign — Rajasthan', date: '2022', loss: '₹45 Cr (25 units)', summary: '25 gearboxes failed within 6 months on same turbine model (Gamesa G97) at same site. Oil contamination from supplier batch defect. Required complete gearbox fleet replacement.', keyLearning: 'Oil analysis reports are the "blood test" for gearboxes. Monthly sampling with trend analysis catches contamination before failure.', url: null },
    ],
    solar: [
      { title: 'Rajasthan Multi-Park Hailstorm', date: 'March 2023', loss: '₹350+ Cr (5 developers)', summary: '40–60mm hailstones destroyed modules across 600+ MW in Bhadla-Fatehgarh corridor. Developers included Adani, ACME, Azure, SB Energy. Module supply constrained by BCD, extending restoration to 9 months.', keyLearning: 'Co-insurance/self-retention layers for hail need review. Industry moving toward parametric triggers (radar data) for faster settlement.', url: 'https://www.pv-magazine.com/2025/12/22/building-resilience-amid-intensifying-weather-events/' },
      { title: 'Gujarat Solar Park — Tracker Stow Failure in Cyclone Biparjoy', date: 'June 2023', loss: '₹80 Cr', summary: 'Tracker software failed to execute stow command during cyclone approach (communication tower damaged). Modules facing upward took full wind load. 200 MW array extensively damaged.', keyLearning: 'Tracker stow reliability is a critical control. Manual override capability and redundant communication essential. This is now a survey focus area.', url: null },
      { title: 'Tamil Nadu Solar — DC Arc Flash Fire', date: 'February 2024', loss: '₹25 Cr', summary: 'MC4 connector failure on a 50 MW plant caused DC arc flash. Fire spread through dry scrubland to adjacent module strings. 8 MW of modules destroyed in 90 minutes before fire service arrived.', keyLearning: 'Vegetation management (fire breaks) is as important as electrical maintenance. String-level monitoring can detect resistance anomalies that precede arc faults.', url: 'https://energiesmedia.com/india-solar-industry-storm-damage-energy/' },
    ],
  };

  return (
    <div className="space-y-3">
      {cases[source].map((c, i) => (
        <div key={i} className="p-4 rounded-xl border border-gray-200 bg-white">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-gray-800">
              {c.url ? (
                <a href={c.url} target="_blank" rel="noopener noreferrer" className="hover:text-icici-maroon hover:underline">{c.title} ↗</a>
              ) : c.title}
            </h4>
            <div className="flex items-center gap-2 text-[14px]">
              <span className="text-gray-500">📅 {c.date}</span>
              <span className="font-bold text-red-600">💰 {c.loss}</span>
            </div>
          </div>
          <p className="text-[14px] text-gray-600 leading-relaxed mb-2">{c.summary}</p>
          <div className="flex items-center justify-between">
            <div className="flex-1 p-2 rounded-lg bg-blue-50 border border-blue-100">
              <span className="text-[14px] font-bold text-blue-800">🔑 Key Learning: </span>
              <span className="text-[14px] text-blue-700">{c.keyLearning}</span>
            </div>
            {c.url && (
              <a href={c.url} target="_blank" rel="noopener noreferrer" className="ml-3 text-[14px] font-bold text-icici-maroon hover:underline whitespace-nowrap flex-shrink-0">
                Read Full Article →
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function EmergingTechRisks({ source }: { source: RiskSource }) {
  // Technologies relevant per source
  const techBySource: Record<RiskSource, string[]> = {
    coal: ['Digital Twin & Predictive Maintenance', 'Smart Grids & Microgrids', 'Carbon Capture & Storage (CCS)'],
    wind: ['Battery Energy Storage Systems (BESS)', 'Digital Twin & Predictive Maintenance', 'Hybrid Renewable Systems'],
    solar: ['Battery Energy Storage Systems (BESS)', 'Green Hydrogen Production', 'Hybrid Renewable Systems', 'Smart Grids & Microgrids'],
  };

  const allTechData = [
    {
      title: 'Battery Energy Storage Systems (BESS)',
      icon: '🔋',
      color: '#B02A30',
      purpose: 'Store energy generated from renewables (solar, wind) for use when generation is low.',
      useCases: 'Grid balancing, frequency regulation, energy arbitrage, peak shaving.',
      risks: ['Fire/Explosion Risk (thermal runaway)', 'Environmental Risk (hazardous materials)', 'Cybersecurity threats', 'Business Interruption (single point of failure)'],
      insurance: ['Developing bespoke BESS insurance policies (property, casualty, cyber)', 'Underwriting based on battery chemistry (LFP vs NMC), cooling systems, location, safety standards (UL 9540A)', 'Key concern: Thermal runaway propagation — can destroy entire facility in hours'],
    },
    {
      title: 'Green Hydrogen Production',
      icon: '💧',
      color: '#005B75',
      purpose: 'Produced using electrolysis powered by renewable energy (solar/wind).',
      useCases: 'Decarbonizing heavy industry, shipping, aviation. India targeting 5 MMTPA by 2030.',
      risks: ['Explosion & Flammability Risks (H2 is highly explosive)', 'Novel Infrastructure Needs (no established standards)', 'High CAPEX Projects (₹4-5 Cr/MW electrolyser)', 'Technology maturity risk'],
      insurance: ['Still an emerging insurance market — underwriters are cautious', 'Development of pilot policies for small-scale projects', 'Key gap: No standard policy wording exists yet. Bespoke manuscript covers needed.'],
    },
    {
      title: 'Digital Twin & Predictive Maintenance',
      icon: '🖥️',
      color: '#7B1FA2',
      purpose: 'Virtual replica of physical asset/system used for simulation and real-time monitoring.',
      useCases: 'Using IoT and AI to predict failures and plan maintenance proactively. NTPC, Adani deploying across fleets.',
      risks: ['Data Integrity issues', 'Cybersecurity vulnerabilities', 'Liability Issues (who is responsible if digital twin gives wrong prediction?)'],
      insurance: ['Technology E&O coverage for digital twin software vendors', 'Enhancing machinery breakdown policies with predictive analytics-based endorsements', 'Opportunity: Reduced claims frequency = NCD benefits for clients using digital twins'],
    },
    {
      title: 'Hybrid Renewable Systems',
      icon: '⚡',
      color: '#F99D27',
      purpose: 'Combining two or more renewable energy sources (e.g., solar + wind, solar + battery).',
      useCases: 'Improve reliability and efficiency of power supply. Round-the-clock RE delivery.',
      risks: ['Complex System Integration risks', 'Power Management failures', 'Project Financing Complexity', 'Interface risks between different OEMs'],
      insurance: ['Multi-peril policies covering hybrid systems', 'Parametric insurance for hybrid projects in remote/off-grid locations', 'Tailored coverages for engineering (EAR/CAR) during phased construction'],
    },
    {
      title: 'Smart Grids & Microgrids',
      icon: '🔌',
      color: '#0F766E',
      purpose: 'Smart grids use real-time data, automation, and AI for dynamic energy distribution.',
      useCases: 'Microgrids are localized energy networks that can disconnect from the main grid. Critical for industrial parks, islands.',
      risks: ['Cyber Risk (connected infrastructure)', 'Grid Interoperability Issues', 'Regulatory Uncertainty', 'Revenue model risk for microgrid operators'],
      insurance: ['Cyber risk insurance specifically for grid technologies', 'Usage-based insurance models with smart meter data', 'Opportunity: Parametric covers for grid outage events'],
    },
    {
      title: 'Carbon Capture & Storage (CCS)',
      icon: '🏭',
      color: '#4B5563',
      purpose: 'Capturing CO2 emissions from coal/gas plants and storing underground or utilizing industrially.',
      useCases: 'Extending life of thermal assets while meeting emission targets. NTPC piloting at Vindhyachal.',
      risks: ['Leakage from storage sites (long-term liability)', 'High CAPEX with uncertain economics', 'Regulatory framework still evolving in India', 'Technology scale-up risk'],
      insurance: ['Environmental liability covers for CO2 leakage', 'Construction All Risk during CCS plant build', 'Long-tail liability policies (30+ year storage monitoring)', 'Key gap: Who insures 100-year storage liability?'],
    },
  ];

  const relevantTechs = allTechData.filter(t => techBySource[source].includes(t.title));

  const sharedOwnershipChallenges = [
    { challenge: 'Asset Ownership Ambiguity', description: 'Joint ventures or multi-entity ownership complicates insurable interest and policy structuring.', solution: 'ELP & Legal Review: Develop a risk-based ownership matrix and align insurance contracts accordingly. Cross-Stakeholder Alignment Workshops.' },
    { challenge: 'DSU & BI Exposure', description: 'Delays in one segment can impact revenue across the entire project due to integrated infrastructure.', solution: 'DSPP: Digital Scheduling and Planning of Projects — proactive planning and alert systems to prevent delays and minimize DSU impact.' },
    { challenge: 'Interface Risks', description: 'Multiple contractors/vendors increase coordination complexity and claims potential.', solution: 'Skill Refreshment Program (SRP): Train all contractors/vendors on safety, project protocols. ELP Framework: Map contractor interfaces with clear safety protocols.' },
    { challenge: 'Shared/Common Infrastructure', description: 'Substations, grid connections, and access roads often serve multiple projects or phases.', solution: 'Cross-Stakeholder Risk Allocation Framework: Use tailored insurance clauses clearly defining shared asset responsibilities. Fire Adequacy Check with real-time IoT monitoring.' },
    { challenge: 'Partial Commencement', description: 'Phased commissioning leads to overlapping construction and operational risks.', solution: 'DSPP: Track commissioning phases in real-time, ensuring insurance policies are aligned with dynamic project status. Drone Solutions for rapid surveillance.' },
  ];

  const insuranceProducts: Record<RiskSource, { mdCover: string[]; biCover: string[]; keyProducts: string[]; industrySpecific: string[] }> = {
    coal: {
      mdCover: ['Obsolete Part/equipment clause', 'OEM Clause', 'Waiver of Under Insurance', 'Margin Clause', 'Capital Additions', 'Destruction of Sound Property clause', 'Additional Custom Duty', 'Immediate Repair clause', 'Minor Works', 'Expediting expenses (Air & Express Freight)', 'Accidental Damage', 'Serial Loss clause'],
      biCover: ['Customer Premises Extension', 'Additional Increased Cost of Working', 'Prevention of Access', 'Contingent BI'],
      keyProducts: ['Workers Compensation', 'Comprehensive General Liability', 'Business Interruption Losses', 'Mega Risk Policy', 'Fire & Allied Perils'],
      industrySpecific: ['Inspection and overhauling of boilers', 'Overhauling of steam, water and gas turbines and turbo-generator sets', 'Overhauling of electric motors and generators above 1,000 kW', 'Refractory materials and/or masonry in industrial furnaces and boilers', 'Catalysts, Lining, Refractory and Consumable', 'Components along the hot-gas path of gas turbines', 'Repairs to combustion engines (diesel, gas engines)', 'Rewinding of electric machines (motors, generators, transformers)', 'Shut down/start up costs', 'Flue gas purification plants', 'Land and Water Contaminant Cleanup, Removal and Disposal', 'Fire Extinguishing expenses'],
    },
    wind: {
      mdCover: ['Obsolete Part/equipment clause', 'OEM Clause', 'Waiver of Under Insurance', 'Margin Clause', 'Capital Additions', 'Additional Custom Duty', 'Immediate Repair clause', 'Minor Works', 'Expediting expenses (Air & Express Freight)', 'Temporary Removal for repair/refurbishment', 'Accidental Damage', '72 Hours Clause'],
      biCover: ['Customer Premises Extension', 'Additional Increased Cost of Working', 'Prevention of Access', 'Contingent BI'],
      keyProducts: ['Windmill Package Insurance Policy', 'Product Liability', 'Cyber Insurance', 'Burglary & Theft Policy', 'Workers Compensation', 'Comprehensive General Liability'],
      industrySpecific: ['Blade repair/replacement coverage', 'Crane hire costs for major component replacement', 'Serial defect extension', 'Gearbox and main bearing replacement', 'Lightning Protection System (LPS) damage cover', 'Foundation defect coverage', 'Cable and internal road reinstatement', 'Offshore wind specific: Jack-up barge hire, subsea cable repair'],
    },
    solar: {
      mdCover: ['Obsolete Part/equipment clause', 'OEM Clause', 'Waiver of Under Insurance', 'Margin Clause', 'Capital Additions', 'Additional Custom Duty', 'Immediate Repair clause', 'Minor Works', 'Expediting expenses (Air & Express Freight)', 'Temporary Removal for repair/refurbishment', 'Accidental Damage', '72 Hours Clause'],
      biCover: ['Customer Premises Extension', 'Additional Increased Cost of Working', 'Prevention of Access', 'Contingent BI'],
      keyProducts: ['Photovoltaic Panel Warranty Insurance', 'Cyber Insurance', 'Burglary & Theft Policy', 'Product Liability', 'Workers Compensation', 'Comprehensive General Liability'],
      industrySpecific: ['Module degradation/performance warranty cover', 'Hail damage sublimit (enhanced)', 'Tracker mechanism failure cover', 'Inverter replacement coverage', 'DC arc flash & fire extension', 'Theft of modules/cables', 'EL imaging and IV curve testing post-event costs', 'BCD/ALMM compliance delay cover (schedule impact)', 'Vegetation management and fire break maintenance'],
    },
  };

  return (
    <div className="space-y-5">
      {/* Emerging Technologies */}
      <div className="icici-card p-5">
        <h3 className="text-sm font-black text-gray-800 mb-1">🔬 New Technologies & Insurer Preparedness</h3>
        <p className="text-[14px] text-gray-400 mb-4">Exploring innovations in clean energy and the evolving role of insurers</p>
        <div className="space-y-4">
          {relevantTechs.map((tech) => (
            <div key={tech.title} className="p-4 rounded-xl border border-gray-200 bg-white">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{tech.icon}</span>
                <h4 className="text-xs font-black text-gray-800">{tech.title}</h4>
              </div>
              <div className="grid grid-cols-1 laptop:grid-cols-3 gap-3 text-[14px]">
                <div>
                  <p className="font-bold text-gray-600 mb-1">Purpose & Use Cases</p>
                  <p className="text-gray-500">{tech.purpose}</p>
                  <p className="text-gray-500 mt-1">{tech.useCases}</p>
                </div>
                <div>
                  <p className="font-bold text-red-700 mb-1">Key Risks</p>
                  <ul className="space-y-0.5">{tech.risks.map((r, i) => <li key={i} className="text-gray-600 flex items-start gap-1"><span className="text-red-500">▸</span>{r}</li>)}</ul>
                </div>
                <div>
                  <p className="font-bold text-green-700 mb-1">Insurance Approach</p>
                  <ul className="space-y-0.5">{tech.insurance.map((r, i) => <li key={i} className="text-gray-600 flex items-start gap-1"><span className="text-green-500">✓</span>{r}</li>)}</ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Shared Ownership Challenges — relevant for Wind & Solar (multi-developer parks) */}
      {(source === 'wind' || source === 'solar') && (
      <div className="icici-card p-5">
        <h3 className="text-sm font-black text-gray-800 mb-1">🏗️ Challenges & Solutions — Shared Ownership & Partial Commencement</h3>
        <p className="text-[14px] text-gray-400 mb-4">Common in large RE parks with multiple developers sharing infrastructure</p>
        <div className="space-y-3">
          {sharedOwnershipChallenges.map((item) => (
            <div key={item.challenge} className="p-3 rounded-xl border border-gray-200 grid grid-cols-1 laptop:grid-cols-3 gap-3">
              <div>
                <span className="text-[14px] font-black text-red-700">{item.challenge}</span>
                <p className="text-[14px] text-gray-500 mt-1">{item.description}</p>
              </div>
              <div className="laptop:col-span-2">
                <span className="text-[14px] font-bold text-green-700">Solution:</span>
                <p className="text-[14px] text-gray-600 mt-0.5">{item.solution}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      )}

      {/* Insurance Products & Add-ons */}
      <div className="icici-card p-5">
        <h3 className="text-sm font-black text-gray-800 mb-1">📋 Insurance Products & Key Add-ons — {source === 'coal' ? 'Thermal Power' : source === 'wind' ? 'Wind Energy' : 'Solar Energy'}</h3>
        <p className="text-[14px] text-gray-400 mb-4">Coverages offered for the {source === 'coal' ? 'thermal power' : 'renewable energy'} sector</p>
        <div className="grid grid-cols-1 laptop:grid-cols-2 gap-4 mb-4">
          <div className="p-3 rounded-xl bg-red-50 border border-red-100">
            <h4 className="text-[14px] font-black text-red-800 mb-2">Material Damage Add-ons</h4>
            <ul className="space-y-1">{insuranceProducts[source].mdCover.map((item, i) => <li key={i} className="text-[14px] text-gray-700 flex items-start gap-1"><span className="text-red-400">•</span>{item}</li>)}</ul>
          </div>
          <div className="p-3 rounded-xl bg-blue-50 border border-blue-100">
            <h4 className="text-[14px] font-black text-blue-800 mb-2">Business Interruption Add-ons</h4>
            <ul className="space-y-1">{insuranceProducts[source].biCover.map((item, i) => <li key={i} className="text-[14px] text-gray-700 flex items-start gap-1"><span className="text-blue-400">•</span>{item}</li>)}</ul>
            <h4 className="text-[14px] font-black text-blue-800 mb-2 mt-4">Key Products</h4>
            <ul className="space-y-1">{insuranceProducts[source].keyProducts.map((item, i) => <li key={i} className="text-[14px] text-gray-700 flex items-start gap-1"><span className="text-blue-400">•</span>{item}</li>)}</ul>
          </div>
        </div>
        <div className="p-3 rounded-xl bg-amber-50 border border-amber-100">
          <h4 className="text-[14px] font-black text-amber-800 mb-2">⚙️ Industry-Specific Add-ons — {source === 'coal' ? 'Thermal' : source === 'wind' ? 'Wind' : 'Solar'}</h4>
          <div className="grid grid-cols-1 tablet:grid-cols-2 gap-x-4">
            {insuranceProducts[source].industrySpecific.map((item, i) => <div key={i} className="text-[14px] text-gray-700 flex items-start gap-1 py-0.5"><span className="text-amber-500">▸</span>{item}</div>)}
          </div>
        </div>
      </div>
    </div>
  );
}

function NonInsurableRisks({ source }: { source: RiskSource }) {
  const risks: Record<RiskSource, { title: string; items: string[] }[]> = {
    coal: [
      { title: 'Regulatory & Policy', items: ['Coal allocation cancellation / auction loss', 'Emission norms tightening (FGD mandate delays)', 'Carbon tax / carbon border adjustment', 'Plant retirement orders by Govt/CERC'] },
      { title: 'Fuel Supply', items: ['Coal India supply shortfall / rake shortage', 'Imported coal price volatility', 'Port congestion / logistics disruption', 'Coal quality deterioration (high ash)'] },
      { title: 'Financial / Market', items: ['PPA renegotiation by DISCOMs', 'Merit order dispatch reduction (RE priority)', 'Stranded asset risk (thermal economics declining)', 'Credit rating downgrade of off-taker DISCOM'] },
      { title: 'Transition Risk', items: ['ESG-driven lending restrictions', 'Investor divestment pressure', 'Carbon disclosure requirements', 'Just Transition mandates'] },
    ],
    wind: [
      { title: 'Resource Risk', items: ['Wind speed variability (below P50 projections)', 'Climate change impact on wind patterns', 'Wake effects from nearby wind farms', 'Turbulence-induced fatigue (uninsurable)'] },
      { title: 'Regulatory & Grid', items: ['Curtailment by SLDC / grid operator', 'Must-run status dilution', 'Change in RE policy / tariff revision', 'Land lease disputes / encroachment'] },
      { title: 'Technology Obsolescence', items: ['Older sub-MW turbines becoming uneconomical', 'Spare parts unavailability for legacy turbines', 'OEM exit from India market', 'Repowering regulatory uncertainty'] },
      { title: 'Counterparty', items: ['DISCOM payment delays (6–12 months common)', 'PPA enforcement challenges', 'Open access regulatory changes', 'Banking/wheeling charge increases'] },
    ],
    solar: [
      { title: 'Resource & Degradation', items: ['Soiling losses (dust, bird droppings)', 'Module degradation beyond warranty (LID, PID)', 'Irradiation variability vs P50 estimates', 'Shading from new construction / vegetation'] },
      { title: 'Regulatory & Trade', items: ['BCD / ALMM policy changes', 'Module import restrictions', 'Land use change / agricultural zoning', 'GST rate changes on components'] },
      { title: 'Counterparty & Grid', items: ['DISCOM payment delays / default', 'Grid curtailment (daytime oversupply)', 'Open access charge escalation', 'C&I customer contract termination'] },
      { title: 'Technology & Supply Chain', items: ['Module supply disruption (China dependency)', 'Inverter OEM bankruptcy / exit', 'Cell technology shift (PERC → TOPCon → HJT)', 'Tracker vendor default'] },
    ],
  };

  return (
    <div className="icici-card p-5">
      <h3 className="text-sm font-black text-gray-800 mb-1">⚠️ Non-Insurable Risks — {source === 'coal' ? 'Coal/Thermal' : source === 'wind' ? 'Wind' : 'Solar'}</h3>
      <p className="text-[14px] text-gray-400 mb-4">Risks not typically covered under standard property/engineering insurance policies</p>
      <div className="grid grid-cols-1 laptop:grid-cols-2 gap-4">
        {risks[source].map((category) => (
          <div key={category.title} className="p-3 rounded-xl bg-gray-50 border border-gray-200">
            <h4 className="text-xs font-bold text-gray-700 mb-2">{category.title}</h4>
            <ul className="space-y-1">
              {category.items.map((item, i) => (
                <li key={i} className="text-[14px] text-gray-600 flex items-start gap-1.5">
                  <span className="text-amber-500 mt-0.5">▸</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function BestPractices({ source }: { source: RiskSource }) {
  const practices: Record<RiskSource, { category: string; indian: string[]; international: string[] }[]> = {
    coal: [
      {
        category: 'Risk Engineering & Loss Prevention',
        indian: ['NTPC\'s Condition Monitoring System for turbines (vibration analysis)', 'Tata Power\'s AI-based boiler tube life prediction', 'Adani\'s drone-based stack inspection program'],
        international: ['Allianz AGCS Thermal Power Plant Risk Assessment Framework', 'FM Global HPR (Highly Protected Risk) standards for power plants', 'Munich Re NatCat modeling for coastal plant flood exposure'],
      },
      {
        category: 'Insurance Structuring',
        indian: ['Multi-year policies for large fleets (NTPC model)', 'Agreed sum insured based on reinstatement value not book value', 'Extended indemnity period (24 months) for critical spares'],
        international: ['Parametric covers for business interruption (UK market)', 'Wrap-up programs for construction-to-operation transition', 'Captive insurance programs for large generators (Enel, RWE model)'],
      },
      {
        category: 'Claims Management',
        indian: ['Pre-agreed OEM repair protocols to expedite claims', 'Independent loss adjuster panels (pre-appointed)', 'Annual asset revaluation to avoid underinsurance'],
        international: ['24/7 major loss response teams (Zurich, AXA XL model)', 'Forensic engineering partnerships (Jensen Hughes, Envista)', 'Pre-loss agreements on repair vs replacement methodology'],
      },
    ],
    wind: [
      {
        category: 'Risk Engineering & Loss Prevention',
        indian: ['Suzlon\'s SCADA-based predictive maintenance (Drive-Train monitoring)', 'Inox Wind\'s LPS (Lightning Protection System) upgrade program', 'ReNew\'s drone blade inspection (annual thermal + visual)'],
        international: ['GCube\'s serial defect cover (for systemic blade/gearbox issues)', 'DNV Turbine Advisory — independent design review', 'Vestas Online SCADA — real-time condition monitoring + risk alerts'],
      },
      {
        category: 'Insurance Structuring',
        indian: ['Portfolio-level covers with NCD (No Claim Discount) structures', 'Operational All Risk (OAR) with dedicated WTG wordings', 'Separate MLOP (Machine Loss of Profit) trigger for seasonal loss'],
        international: ['Named windstorm sublimits with reinstatement (Caribbean model)', 'Extended warranty insurance bridging OEM gaps (GCube, Allianz)', 'Blade failure cover with 72-hr waiting period deductible (not annual)'],
      },
      {
        category: 'Claims Best Practices',
        indian: ['Crane pre-booking agreements (advance reservation for claims)', 'Regional spare blade/gearbox depots', 'Photo/video documentation within 24 hrs of loss event'],
        international: ['Concurrent delay protocols (weather vs repair timeline)', 'Independent met mast data for BI validation', 'Pre-agreed blade repair specifications (repair vs replace threshold)'],
      },
    ],
    solar: [
      {
        category: 'Risk Engineering & Loss Prevention',
        indian: ['Adani Green\'s hail early warning system + auto-stow for trackers', 'Tata Power\'s thermal drone inspection (hotspot detection)', 'Avaada\'s module-level monitoring (string-level inverter data analytics)'],
        international: ['Munich Re Solar Risk Assessment Tool (NatCat exposure scoring)', 'TÜV Rheinland module quality auditing (pre-procurement)', 'RETC (Renewable Energy Test Center) — independent module testing'],
      },
      {
        category: 'Insurance Structuring',
        indian: ['Agreed hail sublimits with co-insurance / self-retention layers', 'Defects Liability Period (DLP) covers during EPC-to-O&M transition', 'Technology-specific deductibles (tracker vs fixed-tilt differentiated)'],
        international: ['Parametric hail covers triggered by radar data (Swiss Re model)', 'Solar Revenue Put (SRP) — guaranteed yield cover (US market)', 'Module warranty insurance (insuring OEM warranty obligation)'],
      },
      {
        category: 'Claims Best Practices',
        indian: ['IV curve tracing within 48 hrs post-event (quantifies hidden damage)', 'Electroluminescence (EL) imaging for micro-crack detection', 'Pre-agreed module replacement specifications (same wattage class)'],
        international: ['Pre-loss engineering surveys with hail vulnerability mapping', 'Rapid loss assessment protocols using satellite imagery', 'Independent energy yield modeling for BI claims (Solargis, Meteonorm)'],
      },
    ],
  };

  return (
    <div className="space-y-4">
      {practices[source].map((section) => (
        <div key={section.category} className="icici-card p-5">
          <h3 className="text-sm font-black text-gray-800 mb-3">✅ {section.category}</h3>
          <div className="grid grid-cols-1 laptop:grid-cols-2 gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-icici-cream to-white border border-gray-100">
              <h4 className="text-[14px] font-bold text-icici-maroon uppercase mb-2">🇮🇳 Indian Market Practices</h4>
              <ul className="space-y-1.5">
                {section.indian.map((item, i) => (
                  <li key={i} className="text-[14px] text-gray-700 flex items-start gap-1.5">
                    <span className="text-green-600 mt-0.5 flex-shrink-0">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-50 to-white border border-blue-100">
              <h4 className="text-[14px] font-bold text-icici-navy uppercase mb-2">🌍 International Best Practices</h4>
              <ul className="space-y-1.5">
                {section.international.map((item, i) => (
                  <li key={i} className="text-[14px] text-gray-700 flex items-start gap-1.5">
                    <span className="text-blue-600 mt-0.5 flex-shrink-0">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Technical Glossary - inline tooltip for technical terms
const GLOSSARY: Record<string, string> = {
  'LPS': 'Lightning Protection System — captures lightning current and conducts it safely to ground, protecting blade structure and electronics',
  'CBM': 'Condition-Based Maintenance — maintenance triggered by actual equipment condition (vibration, temperature, oil analysis) rather than fixed schedules',
  'DGA': 'Dissolved Gas Analysis — oil sampling technique that detects incipient transformer faults by measuring gases dissolved in insulating oil',
  'PLF': 'Plant Load Factor — ratio of actual generation to maximum possible generation, expressed as %. Higher = more efficient utilization',
  'CUF': 'Capacity Utilization Factor — same as PLF but used for renewable sources. Solar CUF ~18% means generating equivalent of 4.3 hours at full capacity per day',
  'BI': 'Business Interruption — insurance cover for revenue loss during the period a plant cannot operate due to an insured material damage event',
  'EMV': 'Expected Monetary Value — risk quantification = Probability × Financial Impact. Used in ISO 31000 for risk prioritization',
  'AOG': 'Act of God — natural catastrophe perils (flood, cyclone, earthquake, lightning) beyond human control',
  'FGD': 'Flue Gas Desulphurization — pollution control equipment that removes SO2 from coal plant exhaust. Mandated by CPCB for all Indian coal plants',
  'SCADA': 'Supervisory Control and Data Acquisition — remote monitoring system for wind turbines and solar plants that tracks performance in real-time',
  'EL Imaging': 'Electroluminescence Imaging — diagnostic technique using infrared cameras to detect micro-cracks in solar cells invisible to naked eye',
  'LEP': 'Leading Edge Protection — coatings or tapes applied to wind turbine blade tips to prevent erosion from rain, sand, and insects',
  'DFIG': 'Doubly-Fed Induction Generator — most common wind turbine generator type. Has slip rings that wear and require maintenance',
  'BCD': 'Basic Customs Duty — 40% import duty on solar modules/cells imposed by India in 2022 to promote domestic manufacturing',
  'ALMM': 'Approved List of Models and Manufacturers — MNRE list of approved solar modules for government projects. Only listed modules can be used',
  'MC4': 'Multi-Contact 4mm — standard DC connector used in solar panel wiring. Loose/damaged MC4 connectors are the primary cause of DC arc flash fires',
  'HPR': 'Highly Protected Risk — FM Global standard for assets with superior loss prevention measures, qualifying for better insurance terms',
  'OAR': 'Operational All Risk — insurance policy covering all risks of physical loss/damage during the operational phase of a power plant',
  'MLOP': 'Machine Loss of Profit — specific BI cover triggered by machinery breakdown (non-AOG peril), as distinct from fire/natural peril BI',
  'NCD': 'No Claim Discount — premium reduction offered for claim-free years. Typically 5–10% per year, cumulative up to 30–40%',
};

function TechTerm({ term }: { term: string }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const definition = GLOSSARY[term];
  if (!definition) return <span className="font-bold">{term}</span>;

  return (
    <span className="relative inline-block">
      <button
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={() => setShowTooltip(!showTooltip)}
        className="font-bold text-icici-navy underline decoration-dotted underline-offset-2 cursor-help"
      >
        {term} ℹ️
      </button>
      {showTooltip && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-gray-900 text-white text-[14px] rounded-lg shadow-xl z-50 leading-relaxed">
          <span className="font-bold text-icici-orange">{term}</span>: {definition}
          <span className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
        </span>
      )}
    </span>
  );
}

// Export TechTerm for use in other components if needed
export { TechTerm, GLOSSARY };

function RiskCard({ title, severity, description, impactAreas, typicalClaim }: {
  title: string;
  severity: 'high' | 'medium' | 'low';
  description: string;
  impactAreas: string[];
  typicalClaim: string;
}) {
  const severityConfig = {
    high: { label: 'HIGH', bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200' },
    medium: { label: 'MEDIUM', bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200' },
    low: { label: 'LOW', bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' },
  };
  const sev = severityConfig[severity];

  return (
    <div className={`p-3 rounded-xl border ${sev.border} bg-white`}>
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-bold text-gray-800">{title}</h4>
        <div className="flex items-center gap-2">
          <span className={`text-[14px] px-2 py-0.5 rounded-full font-black ${sev.bg} ${sev.text}`}>{sev.label}</span>
          <span className="text-[14px] font-bold text-gray-500">Typical: {typicalClaim}</span>
        </div>
      </div>
      <p className="text-[14px] text-gray-600 mb-2">{description}</p>
      <div className="flex flex-wrap gap-1.5">
        {impactAreas.map((area, i) => (
          <span key={i} className="text-[14px] px-2 py-0.5 rounded bg-gray-100 text-gray-600 font-medium">
            {area}
          </span>
        ))}
      </div>
    </div>
  );
}


