import { useState } from 'react';

interface ThermalCompany {
  rank: number;
  name: string;
  totalThermalMW: number;
  coalMW: number;
  gasMW: number;
  ligniteMW: number;
  ownership: 'private' | 'central_psu' | 'state_psu';
  listed: string;
  notes: string;
}

const THERMAL_SUMMARY = {
  totalFossilGW: 243.87,
  coalGW: 211.5,
  gasGW: 24.9,
  ligniteGW: 6.7,
  dieselGW: 0.7,
  dataSource: 'Central Electricity Authority (cea.nic.in)',
  dataAsOf: '31 March 2025 (FY24-25)',
};

const THERMAL_COMPANIES: ThermalCompany[] = [
  { rank: 1, name: 'NTPC Ltd', totalThermalMW: 55000, coalMW: 48000, gasMW: 7000, ligniteMW: 0, ownership: 'central_psu', listed: 'BSE/NSE', notes: "India's largest power utility. 24 coal stations across India. Super-critical fleet." },
  { rank: 2, name: 'Adani Power Ltd', totalThermalMW: 16000, coalMW: 16000, gasMW: 0, ligniteMW: 0, ownership: 'private', listed: 'BSE/NSE', notes: 'Mundra (4,620 MW), Tiroda (3,300 MW), Kawai, Raipur, Raigarh. All supercritical.' },
  { rank: 3, name: 'Tata Power Company', totalThermalMW: 10200, coalMW: 8200, gasMW: 2000, ligniteMW: 0, ownership: 'private', listed: 'BSE/NSE', notes: 'Mundra UMPP (4,000 MW), Trombay, Maithon, Jojobera. Gas at Vizag.' },
  { rank: 4, name: 'MAHAGENCO', totalThermalMW: 9500, coalMW: 8800, gasMW: 700, ligniteMW: 0, ownership: 'state_psu', listed: 'State Govt (MH)', notes: 'Maharashtra state utility. Chandrapur, Bhusawal, Koradi, Nashik, Parli.' },
  { rank: 5, name: 'DVC (Damodar Valley Corp)', totalThermalMW: 7500, coalMW: 7500, gasMW: 0, ligniteMW: 0, ownership: 'central_psu', listed: 'Central PSU', notes: 'Operates in WB & Jharkhand. Mejia, Bokaro, Durgapur, Raghunathpur.' },
  { rank: 6, name: 'JSW Energy Ltd', totalThermalMW: 5500, coalMW: 5500, gasMW: 0, ligniteMW: 0, ownership: 'private', listed: 'BSE/NSE', notes: 'Ratnagiri (1,200 MW), Barmer (1,080 MW), Vijayanagar. Transitioning to RE.' },
  { rank: 7, name: 'GSECL (Gujarat)', totalThermalMW: 5200, coalMW: 4500, gasMW: 500, ligniteMW: 200, ownership: 'state_psu', listed: 'State Govt (GJ)', notes: 'Gujarat state genco. Wanakbori, Ukai, Gandhinagar, Sikka, Kutch Lignite.' },
  { rank: 8, name: 'NLC India Ltd', totalThermalMW: 5100, coalMW: 1440, gasMW: 0, ligniteMW: 3660, ownership: 'central_psu', listed: 'BSE/NSE', notes: "India's largest lignite operator. Neyveli TN complex. Also has coal at Talcher." },
  { rank: 9, name: 'TANGEDCO (Tamil Nadu)', totalThermalMW: 4700, coalMW: 4200, gasMW: 500, ligniteMW: 0, ownership: 'state_psu', listed: 'State Govt (TN)', notes: 'Mettur, Tuticorin, North Chennai thermal stations.' },
  { rank: 10, name: 'CESC Ltd (RP-Sanjiv Goenka)', totalThermalMW: 4400, coalMW: 4400, gasMW: 0, ligniteMW: 0, ownership: 'private', listed: 'BSE/NSE', notes: 'Kolkata distribution + Budge Budge, Titagarh, Haldia, Dhariwal (MP).' },
  { rank: 11, name: 'Vedanta (TSPL + Sterlite)', totalThermalMW: 3900, coalMW: 3900, gasMW: 0, ligniteMW: 0, ownership: 'private', listed: 'BSE/NSE', notes: 'Talwandi Sabo (1,980 MW Punjab), Jharsuguda CPP for aluminium smelter.' },
  { rank: 12, name: 'NHPC / THDC (Coal arm)', totalThermalMW: 3200, coalMW: 3200, gasMW: 0, ligniteMW: 0, ownership: 'central_psu', listed: 'BSE/NSE', notes: 'Newer coal allocations under CPSU scheme. Khurja, Buxar under construction.' },
  { rank: 13, name: 'Reliance Power', totalThermalMW: 3000, coalMW: 3000, gasMW: 0, ligniteMW: 0, ownership: 'private', listed: 'BSE/NSE', notes: 'Sasan UMPP (3,960 MW — one of largest). Financial stress in recent years.' },
  { rank: 14, name: 'KPCL (Karnataka)', totalThermalMW: 2800, coalMW: 2800, gasMW: 0, ligniteMW: 0, ownership: 'state_psu', listed: 'State Govt (KA)', notes: 'Raichur TPS (1,720 MW), Bellary TPS (1,000 MW).' },
  { rank: 15, name: 'Torrent Power', totalThermalMW: 2500, coalMW: 1200, gasMW: 1300, ligniteMW: 0, ownership: 'private', listed: 'BSE/NSE', notes: 'Gas-based SUGEN (1,148 MW Gujarat), DGEN (768 MW). Also coal at AMGEN.' },
  { rank: 16, name: 'Jindal Power Ltd (JPL)', totalThermalMW: 3400, coalMW: 3400, gasMW: 0, ligniteMW: 0, ownership: 'private', listed: 'BSE/NSE (Jindal Steel & Power)', notes: 'Tamnar TPS (3,400 MW) in Chhattisgarh. One of the largest private coal plants. O.P. Jindal Group.' },
  { rank: 17, name: 'Lalitpur Power Generation Co (LPGCL)', totalThermalMW: 1980, coalMW: 1980, gasMW: 0, ligniteMW: 0, ownership: 'private', listed: 'Unlisted (Bajaj Group)', notes: 'Lalitpur TPS (3x660 MW) in Uttar Pradesh. Supercritical technology. Supplies to UPPCL.' },
  { rank: 18, name: 'MB Power (Madhya Bharat Power)', totalThermalMW: 1320, coalMW: 1320, gasMW: 0, ligniteMW: 0, ownership: 'private', listed: 'Unlisted', notes: 'Anuppur TPS (2x660 MW) in Madhya Pradesh. Supercritical units. Part of Aditya Birla Group.' },
  { rank: 19, name: 'Jhabua Power Ltd', totalThermalMW: 600, coalMW: 600, gasMW: 0, ligniteMW: 0, ownership: 'private', listed: 'Unlisted', notes: 'Seoni TPS (600 MW) in Madhya Pradesh. Single unit plant supplying MP discom.' },
  { rank: 20, name: 'Jhajjar Power Ltd (CLP India)', totalThermalMW: 1320, coalMW: 1320, gasMW: 0, ligniteMW: 0, ownership: 'private', listed: 'Unlisted (Apraava Energy / CLP)', notes: 'Jhajjar TPS (2x660 MW) in Haryana. Supercritical. Formerly CLP India, now Apraava Energy.' },
  { rank: 21, name: 'Essar Power (Mahan/Salaya)', totalThermalMW: 2600, coalMW: 2400, gasMW: 200, ligniteMW: 0, ownership: 'private', listed: 'Unlisted (Essar Group)', notes: 'Mahan TPS (1,200 MW MP), Salaya (1,200 MW GJ). Some units under financial stress.' },
  { rank: 22, name: 'GMR Energy (Thermal)', totalThermalMW: 2200, coalMW: 1370, gasMW: 830, ligniteMW: 0, ownership: 'private', listed: 'BSE/NSE (GMR Infra)', notes: 'Warora TPS (600 MW MH), Kamalanga (1,050 MW Odisha). Gas at Rajahmundry (768 MW AP).' },
  { rank: 23, name: 'Lanco Infratech (Amarkantak/Anpara)', totalThermalMW: 2400, coalMW: 2400, gasMW: 0, ligniteMW: 0, ownership: 'private', listed: 'Delisted (NCLT)', notes: 'Amarkantak TPS (1,320 MW CG), Anpara C (1,000 MW UP). Under financial resolution/NCLT.' },
  { rank: 24, name: 'DB Power Ltd', totalThermalMW: 1200, coalMW: 1200, gasMW: 0, ligniteMW: 0, ownership: 'private', listed: 'Unlisted (Adani acquired)', notes: 'Janjgir-Champa TPS (2x600 MW) in Chhattisgarh. Acquired by Adani Group in 2022.' },
  { rank: 25, name: 'SKS Power Generation', totalThermalMW: 1200, coalMW: 1200, gasMW: 0, ligniteMW: 0, ownership: 'private', listed: 'Unlisted', notes: 'Binjkote TPS (2x600 MW) in Chhattisgarh. Supplies to Chhattisgarh discoms.' },
  { rank: 26, name: 'KSK Energy Ventures', totalThermalMW: 1800, coalMW: 1800, gasMW: 0, ligniteMW: 0, ownership: 'private', listed: 'BSE (under NCLT)', notes: 'Mahanadi TPS (3x600 MW) in Chhattisgarh. Under insolvency resolution.' },
  { rank: 27, name: 'APGENCO (Andhra Pradesh)', totalThermalMW: 4100, coalMW: 3610, gasMW: 490, ligniteMW: 0, ownership: 'state_psu', listed: 'State Govt (AP)', notes: 'Rayalaseema TPS, Kothagudem TPS, Sri Damodaram TPS. AP state generating company.' },
  { rank: 28, name: 'TSGENCO (Telangana)', totalThermalMW: 4600, coalMW: 4200, gasMW: 400, ligniteMW: 0, ownership: 'state_psu', listed: 'State Govt (TS)', notes: 'Ramagundam TPS, Kothagudem TPS, Bhadradri TPP (1,080 MW new supercritical).' },
  { rank: 29, name: 'WBPDCL (West Bengal)', totalThermalMW: 4200, coalMW: 4200, gasMW: 0, ligniteMW: 0, ownership: 'state_psu', listed: 'State Govt (WB)', notes: 'Santaldih, Bandel, Bakreswar, Kolaghat, Sagardighi TPS. West Bengal state genco.' },
  { rank: 30, name: 'CSPGCL (Chhattisgarh)', totalThermalMW: 3500, coalMW: 3500, gasMW: 0, ligniteMW: 0, ownership: 'state_psu', listed: 'State Govt (CG)', notes: 'Korba East & West, Hasdeo, Dr. Shyama Prasad TPS. Coal-rich state genco.' },
  { rank: 31, name: 'UPRVUNL (Uttar Pradesh)', totalThermalMW: 5400, coalMW: 5400, gasMW: 0, ligniteMW: 0, ownership: 'state_psu', listed: 'State Govt (UP)', notes: 'Obra, Anpara, Harduaganj, Parichha TPS. Largest state thermal fleet in India.' },
  { rank: 32, name: 'PSPCL (Punjab)', totalThermalMW: 2800, coalMW: 2800, gasMW: 0, ligniteMW: 0, ownership: 'state_psu', listed: 'State Govt (PB)', notes: 'Ropar TPS, Lehra Mohabbat TPS, GH TPS Bathinda. Punjab state utility.' },
  { rank: 33, name: 'RRVUNL (Rajasthan)', totalThermalMW: 3200, coalMW: 2200, gasMW: 0, ligniteMW: 1000, ownership: 'state_psu', listed: 'State Govt (RJ)', notes: 'Suratgarh TPS, Kota TPS, Barsingsar Lignite TPS. Rajasthan state genco.' },
  { rank: 34, name: 'Sembcorp Energy India (Thermal)', totalThermalMW: 2640, coalMW: 2640, gasMW: 0, ligniteMW: 0, ownership: 'private', listed: 'Unlisted (Sembcorp Singapore)', notes: 'TPCIL Krishnapatnam (2x800 MW) in Andhra Pradesh. One of newest supercritical plants.' },
  { rank: 35, name: 'IL&FS Tamil Nadu Power (ITPCL)', totalThermalMW: 1200, coalMW: 1200, gasMW: 0, ligniteMW: 0, ownership: 'private', listed: 'Unlisted (under resolution)', notes: 'Cuddalore TPS (2x600 MW) in Tamil Nadu. Under resolution after IL&FS crisis.' },
  { rank: 36, name: 'Coastal Energen (formerly TANGEDCO JV)', totalThermalMW: 1200, coalMW: 1200, gasMW: 0, ligniteMW: 0, ownership: 'private', listed: 'Unlisted', notes: 'Tuticorin TPS expansion (2x600 MW). Imported coal-based in Tamil Nadu coast.' },
  { rank: 37, name: 'Bharat Aluminium (BALCO) CPP', totalThermalMW: 1370, coalMW: 1370, gasMW: 0, ligniteMW: 0, ownership: 'private', listed: 'Vedanta Group', notes: 'Captive power for BALCO aluminium smelter in Korba, Chhattisgarh. Vedanta subsidiary.' },
  { rank: 38, name: 'Hindalco (Aditya Birla) CPP', totalThermalMW: 2500, coalMW: 2500, gasMW: 0, ligniteMW: 0, ownership: 'private', listed: 'BSE/NSE', notes: 'Captive coal plants at Renusagar (UP), Hirakud (Odisha) for aluminium smelting.' },
  { rank: 39, name: 'SAIL (Steel Authority) CPP', totalThermalMW: 2000, coalMW: 2000, gasMW: 0, ligniteMW: 0, ownership: 'central_psu', listed: 'BSE/NSE', notes: 'Captive power plants at Bhilai, Bokaro, Durgapur, Rourkela steel plants.' },
  { rank: 40, name: 'NALCO (Aluminium) CPP', totalThermalMW: 1200, coalMW: 1200, gasMW: 0, ligniteMW: 0, ownership: 'central_psu', listed: 'BSE/NSE', notes: 'Captive thermal plant (1,200 MW) at Angul, Odisha for aluminium smelter.' },
  { rank: 41, name: 'Rattan India Power (Amravati)', totalThermalMW: 1350, coalMW: 1350, gasMW: 0, ligniteMW: 0, ownership: 'private', listed: 'BSE/NSE', notes: 'Amravati TPS (1,350 MW) in Maharashtra. Supercritical units. Supplies MSEDCL.' },
  { rank: 42, name: 'Rattan India Nasik Power', totalThermalMW: 1200, coalMW: 1200, gasMW: 0, ligniteMW: 0, ownership: 'private', listed: 'BSE/NSE', notes: 'Nasik TPS (5x270 MW) in Maharashtra. Formerly Indiabulls Power.' },
  { rank: 43, name: 'ACB India (Chandrapur)', totalThermalMW: 1200, coalMW: 1200, gasMW: 0, ligniteMW: 0, ownership: 'private', listed: 'Unlisted', notes: 'Chandrapur TPP (2x600 MW) in Maharashtra. Indo-Chinese JV. Supplies MSEDCL.' },
  { rank: 44, name: 'Wardha Power Company', totalThermalMW: 540, coalMW: 540, gasMW: 0, ligniteMW: 0, ownership: 'private', listed: 'Unlisted (Butibori Group)', notes: 'Wardha Warora TPS (540 MW) in Maharashtra. Supplies industrial consumers in Vidarbha.' },
  { rank: 45, name: 'EMCO Energy (Warora)', totalThermalMW: 600, coalMW: 600, gasMW: 0, ligniteMW: 0, ownership: 'private', listed: 'Unlisted', notes: 'Warora TPS (600 MW) in Maharashtra. Supplies MSEDCL under long-term PPA.' },
  { rank: 46, name: 'OPGC (Odisha Power)', totalThermalMW: 2400, coalMW: 2400, gasMW: 0, ligniteMW: 0, ownership: 'state_psu', listed: 'State Govt (OD) + AES', notes: 'IB Valley TPS (2x660 MW new + 2x210 MW old) at Banharpali, Odisha. JV with AES Corp.' },
  { rank: 47, name: 'HPGCL (Haryana)', totalThermalMW: 3200, coalMW: 3200, gasMW: 0, ligniteMW: 0, ownership: 'state_psu', listed: 'State Govt (HR)', notes: 'Panipat TPS, Khedar TPS, Hisar TPS, Yamunanagar TPS. Haryana state genco.' },
  { rank: 48, name: 'MPPGCL (Madhya Pradesh)', totalThermalMW: 4600, coalMW: 4600, gasMW: 0, ligniteMW: 0, ownership: 'state_psu', listed: 'State Govt (MP)', notes: 'Satpura, Sanjay Gandhi, Amarkantak, Birsinghpur TPS. MP state generating company.' },
  { rank: 49, name: 'BSPHCL (Bihar)', totalThermalMW: 1600, coalMW: 1600, gasMW: 0, ligniteMW: 0, ownership: 'state_psu', listed: 'State Govt (BR)', notes: 'Kanti TPS, Muzaffarpur TPS, Barauni TPS. Bihar state power company.' },
  { rank: 50, name: 'OHPC + OPGC Combined (Odisha)', totalThermalMW: 800, coalMW: 800, gasMW: 0, ligniteMW: 0, ownership: 'state_psu', listed: 'State Govt (OD)', notes: 'Talcher Old TPS (460 MW) and other legacy units in Odisha.' },
  { rank: 51, name: 'Jaypee Power Ventures (JP Group)', totalThermalMW: 1500, coalMW: 1500, gasMW: 0, ligniteMW: 0, ownership: 'private', listed: 'Unlisted (under stress)', notes: 'Nigrie TPS (660 MW MP), Bara TPS (1,320 MW UP — under NCLT). JP Group.' },
  { rank: 52, name: 'Coastal Gujarat Power (Tata Mundra UMPP)', totalThermalMW: 4150, coalMW: 4150, gasMW: 0, ligniteMW: 0, ownership: 'private', listed: 'BSE/NSE (Tata Power sub)', notes: 'Mundra UMPP (5x830 MW) — India first UMPP. Imported coal. Tariff disputes with GJ discom.' },
  { rank: 53, name: 'Sasan Power (Reliance UMPP)', totalThermalMW: 3960, coalMW: 3960, gasMW: 0, ligniteMW: 0, ownership: 'private', listed: 'BSE/NSE (Reliance Power)', notes: 'Sasan UMPP (6x660 MW) in MP — one of worlds largest pithead plants. Integrated coal mine.' },
  { rank: 54, name: 'BGR Energy Systems', totalThermalMW: 1000, coalMW: 1000, gasMW: 0, ligniteMW: 0, ownership: 'private', listed: 'BSE/NSE', notes: 'EPC + IPP company. Owns thermal assets. Major boiler and turbine supplier to power sector.' },
  { rank: 55, name: 'KSK Mahanadi Power (Akaltara)', totalThermalMW: 1200, coalMW: 1200, gasMW: 0, ligniteMW: 0, ownership: 'private', listed: 'Under NCLT', notes: 'Akaltara TPS (2x600 MW) in Chhattisgarh. Currently under insolvency resolution.' },
  { rank: 56, name: 'East Coast Energy (Srikakulam)', totalThermalMW: 1320, coalMW: 1320, gasMW: 0, ligniteMW: 0, ownership: 'private', listed: 'Unlisted', notes: 'Srikakulam TPS (2x660 MW) in Andhra Pradesh. Imported coal based. Supplies AP discoms.' },
  { rank: 57, name: 'Ind-Barath Energy (Utkal)', totalThermalMW: 700, coalMW: 700, gasMW: 0, ligniteMW: 0, ownership: 'private', listed: 'Unlisted (under NCLT)', notes: 'Utkal TPS in Odisha and Tuticorin in TN. Under financial stress.' },
  { rank: 58, name: 'Meenakshi Energy Ltd', totalThermalMW: 1000, coalMW: 1000, gasMW: 0, ligniteMW: 0, ownership: 'private', listed: 'Unlisted', notes: 'Nellore TPS (2x500 MW) in Andhra Pradesh. Imported coal. Supplies AP and TN.' },
  { rank: 59, name: 'OPG Power Ventures', totalThermalMW: 450, coalMW: 450, gasMW: 0, ligniteMW: 0, ownership: 'private', listed: 'LSE London', notes: 'Chennai-based. Coal TPS in Tamil Nadu. Listed on London Stock Exchange (AIM).' },
  { rank: 60, name: 'Athena Chhattisgarh Power', totalThermalMW: 1200, coalMW: 1200, gasMW: 0, ligniteMW: 0, ownership: 'private', listed: 'Unlisted', notes: 'Sipat area TPS (2x600 MW) in Chhattisgarh. Supplies state discoms.' },
];

type Filter = 'all' | 'coal-led' | 'gas-led' | 'psu';

export function ThermalPlayersSection() {
  const [filter, setFilter] = useState<Filter>('all');
  const [expanded, setExpanded] = useState<number | null>(null);

  const filteredCompanies = THERMAL_COMPANIES.filter(c => {
    if (filter === 'coal-led') return c.coalMW > c.gasMW && c.coalMW > c.ligniteMW;
    if (filter === 'gas-led') return c.gasMW > 1000;
    if (filter === 'psu') return c.ownership !== 'private';
    return true;
  }).sort((a, b) => b.totalThermalMW - a.totalThermalMW);

  const getOwnershipColor = (o: string) => {
    if (o === 'central_psu') return '#1565C0';
    if (o === 'state_psu') return '#7B1FA2';
    return '#E65100';
  };

  const getOwnershipLabel = (o: string) => {
    if (o === 'central_psu') return '🏛️ Central PSU';
    if (o === 'state_psu') return '🏢 State PSU';
    return '🏭 Private';
  };

  return (
    <div className="space-y-5">
      {/* Market Overview */}
      <div className="icici-card p-5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-icici-maroon via-[#E65100] to-[#F99D27]" />
        <h3 className="text-base font-black text-gray-800 mt-1">India Thermal Power — Market Overview</h3>
        <p className="text-xs text-gray-500">Source: {THERMAL_SUMMARY.dataSource} as on {THERMAL_SUMMARY.dataAsOf}</p>

        <div className="grid grid-cols-2 laptop:grid-cols-5 gap-3 mt-4">
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-center">
            <div className="text-xl font-black text-red-700">{THERMAL_SUMMARY.coalGW} GW</div>
            <div className="text-xs text-gray-500 font-semibold">🔥 Coal</div>
          </div>
          <div className="p-3 rounded-xl bg-orange-50 border border-orange-200 text-center">
            <div className="text-xl font-black text-orange-700">{THERMAL_SUMMARY.gasGW} GW</div>
            <div className="text-xs text-gray-500 font-semibold">🔶 Gas</div>
          </div>
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-center">
            <div className="text-xl font-black text-amber-700">{THERMAL_SUMMARY.ligniteGW} GW</div>
            <div className="text-xs text-gray-500 font-semibold">🟤 Lignite</div>
          </div>
          <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-center">
            <div className="text-xl font-black text-gray-600">{THERMAL_SUMMARY.dieselGW} GW</div>
            <div className="text-xs text-gray-500 font-semibold">⛽ Diesel</div>
          </div>
          <div className="p-3 rounded-xl bg-gradient-to-br from-red-50 to-orange-50 border border-red-300 text-center laptop:col-span-1 col-span-2">
            <div className="text-xl font-black text-red-800">{THERMAL_SUMMARY.totalFossilGW} GW</div>
            <div className="text-xs text-gray-600 font-semibold">Total Fossil</div>
          </div>
        </div>

        <div className="mt-3 flex rounded-xl overflow-hidden h-7 border border-gray-200">
          <div className="flex items-center justify-center text-white text-[11px] font-bold bg-[#B02A30]" style={{ width: `${(211.5/243.87)*100}%` }}>Coal 86.7%</div>
          <div className="flex items-center justify-center text-white text-[11px] font-bold bg-[#F99D27]" style={{ width: `${(24.9/243.87)*100}%` }}>Gas 10.2%</div>
          <div className="flex items-center justify-center text-white text-[10px] font-bold bg-[#795548]" style={{ width: `${(6.7/243.87)*100}%` }}>Lig</div>
        </div>
      </div>

      {/* Filter + Companies */}
      <div className="icici-card p-5">
        <h3 className="text-base font-black text-gray-800 mb-1">Top Thermal Power Companies</h3>
        <p className="text-xs text-gray-500 mb-4">Ranked by operational thermal capacity • Click company for details</p>

        {/* Filter buttons + Download */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {([
            { id: 'all' as Filter, label: '🔥 All Players', color: 'bg-red-600' },
            { id: 'coal-led' as Filter, label: '🏭 Coal-Led', color: 'bg-gray-600' },
            { id: 'gas-led' as Filter, label: '🔶 Gas Players', color: 'bg-orange-600' },
            { id: 'psu' as Filter, label: '🏛️ PSU Only', color: 'bg-blue-600' },
          ]).map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filter === f.id ? `${f.color} text-white shadow-md` : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-400'
              }`}
            >
              {f.label}
            </button>
          ))}
          <button
            onClick={() => {
              const headers = 'Rank,Company,Total MW,Coal MW,Gas MW,Lignite MW,Ownership,Listed,Notes\n';
              const rows = filteredCompanies.map((c, i) =>
                `${i+1},"${c.name}",${c.totalThermalMW},${c.coalMW},${c.gasMW},${c.ligniteMW},"${c.ownership}","${c.listed}","${c.notes.replace(/"/g, '""')}"`
              ).join('\n');
              const blob = new Blob([headers + rows], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'Thermal_Power_Companies.csv';
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="ml-auto px-3 py-1.5 rounded-lg text-xs font-bold bg-green-600 text-white hover:bg-green-700 transition-all"
          >
            📥 Download List
          </button>
        </div>

        {/* Companies list */}
        <div className="space-y-2.5">
          {filteredCompanies.map((company, idx) => {
            const isExpanded = expanded === company.rank;
            const coalPct = company.totalThermalMW > 0 ? (company.coalMW / company.totalThermalMW) * 100 : 0;
            const gasPct = company.totalThermalMW > 0 ? (company.gasMW / company.totalThermalMW) * 100 : 0;
            const ligPct = company.totalThermalMW > 0 ? (company.ligniteMW / company.totalThermalMW) * 100 : 0;

            return (
              <div
                key={company.rank}
                onClick={() => setExpanded(isExpanded ? null : company.rank)}
                className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                  isExpanded ? 'border-red-300 bg-red-50/50 shadow-md' : 'border-gray-100 bg-white hover:border-gray-300 hover:shadow-sm'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Rank */}
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-black text-xs flex-shrink-0" style={{ backgroundColor: getOwnershipColor(company.ownership) }}>
                    #{idx + 1}
                  </div>

                  {/* Company info */}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-gray-800">{company.name}</div>
                    <div className="text-[11px] text-gray-400">{getOwnershipLabel(company.ownership)} • {company.listed}</div>
                  </div>

                  {/* Capacity */}
                  <div className="text-right flex-shrink-0">
                    <div className="text-base font-black text-red-700">{(company.totalThermalMW / 1000).toFixed(1)} GW</div>
                    <div className="text-[10px] text-gray-400">Total Thermal</div>
                  </div>

                  {/* Source mix mini bar */}
                  <div className="w-20 flex-shrink-0 hidden laptop:block">
                    <div className="flex rounded-full overflow-hidden h-4 border border-gray-200">
                      {coalPct > 0 && <div className="bg-[#B02A30]" style={{ width: `${coalPct}%` }} />}
                      {gasPct > 0 && <div className="bg-[#F99D27]" style={{ width: `${gasPct}%` }} />}
                      {ligPct > 0 && <div className="bg-[#795548]" style={{ width: `${ligPct}%` }} />}
                    </div>
                    <div className="flex justify-between text-[8px] text-gray-400 mt-0.5">
                      <span>Coal</span><span>Gas</span>
                    </div>
                  </div>
                </div>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-gray-200 animate-fadeIn">
                    <div className="grid grid-cols-3 gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-white border border-gray-100 text-center">
                        <div className="text-sm font-black text-red-700">{(company.coalMW / 1000).toFixed(1)} GW</div>
                        <div className="text-[10px] text-gray-500">🔥 Coal</div>
                      </div>
                      <div className="p-2 rounded-lg bg-white border border-gray-100 text-center">
                        <div className="text-sm font-black text-orange-600">{(company.gasMW / 1000).toFixed(1)} GW</div>
                        <div className="text-[10px] text-gray-500">🔶 Gas</div>
                      </div>
                      <div className="p-2 rounded-lg bg-white border border-gray-100 text-center">
                        <div className="text-sm font-black text-amber-700">{(company.ligniteMW / 1000).toFixed(1)} GW</div>
                        <div className="text-[10px] text-gray-500">🟤 Lignite</div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600">{company.notes}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
