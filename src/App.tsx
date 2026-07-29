import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { useFilterStore } from '@/store/filterStore';
import { useAuthStore } from '@/store/authStore';
import { LoginPage } from '@/components/LoginPage';
import { AppShell } from '@/components/layout/AppShell';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { SectionErrorBoundary } from '@/components/common/SectionErrorBoundary';
import { CapacityOverview } from '@/components/sections/CapacityOverview';
import { IndustryOverview } from '@/components/sections/IndustryOverview';
import { GenerationSection } from '@/components/sections/GenerationSection';
import { OwnershipSection } from '@/components/sections/OwnershipSection';
import { TimelineSection } from '@/components/sections/TimelineSection';
import { RiskAnalysis } from '@/components/sections/RiskAnalysis';
import { MarketPlayersSection } from '@/components/sections/MarketPlayersSection';
import { AuditLogsSection } from '@/components/sections/AuditLogsSection';
import { NewsSection } from '@/components/sections/NewsSection';
import { DownloadsSection } from '@/components/sections/DownloadsSection';
import { GeographySection } from '@/components/sections/GeographySection';
import { QuizSection } from '@/components/sections/QuizSection';

function DashboardContent() {
  const activeSection = useFilterStore((s) => s.activeSection);
  const role = useAuthStore((s) => s.role);

  const renderSection = () => {
    switch (activeSection) {
      case 'downloads':
        if (role !== 'admin') {
          return (
            <div className="icici-card p-6 text-center">
              <p className="text-sm font-bold text-gray-600">🔒 Downloads are available for Admin users only.</p>
              <p className="text-xs text-gray-400 mt-1">Contact your administrator for access.</p>
            </div>
          );
        }
        return (
          <SectionErrorBoundary sectionName="Downloads">
            <DownloadsSection />
          </SectionErrorBoundary>
        );
      case 'audit-logs':
        if (role !== 'admin') {
          return (
            <div className="icici-card p-6 text-center">
              <p className="text-sm font-bold text-gray-600">🔒 Audit Logs are available for Admin users only.</p>
            </div>
          );
        }
        return (
          <SectionErrorBoundary sectionName="Audit Logs">
            <AuditLogsSection />
          </SectionErrorBoundary>
        );
      case 'industry-overview':
        return (
          <SectionErrorBoundary sectionName="Industry Overview">
            <IndustryOverview />
          </SectionErrorBoundary>
        );
      case 'overview':
        return (
          <SectionErrorBoundary sectionName="Capacity Overview">
            <CapacityOverview />
          </SectionErrorBoundary>
        );
      case 'generation':
        return (
          <SectionErrorBoundary sectionName="Generation">
            <GenerationSection />
          </SectionErrorBoundary>
        );
      case 'ownership':
        return (
          <SectionErrorBoundary sectionName="Ownership">
            <OwnershipSection />
          </SectionErrorBoundary>
        );
      case 'energy-source':
        return (
          <SectionErrorBoundary sectionName="Capacity Overview">
            <CapacityOverview />
          </SectionErrorBoundary>
        );
      case 'timeline':
        return (
          <SectionErrorBoundary sectionName="Timeline">
            <TimelineSection />
          </SectionErrorBoundary>
        );
      case 'projections':
        return (
          <SectionErrorBoundary sectionName="Timeline">
            <TimelineSection />
          </SectionErrorBoundary>
        );
      case 'market-players':
        return (
          <SectionErrorBoundary sectionName="Market Players">
            <MarketPlayersSection />
          </SectionErrorBoundary>
        );
      case 'risks':
        return (
          <SectionErrorBoundary sectionName="Risk Analysis">
            <RiskAnalysis />
          </SectionErrorBoundary>
        );
      case 'geography':
        return (
          <SectionErrorBoundary sectionName="Geography">
            <GeographySection />
          </SectionErrorBoundary>
        );
      case 'news':
        return (
          <SectionErrorBoundary sectionName="News">
            <NewsSection />
          </SectionErrorBoundary>
        );
      case 'quiz':
        return (
          <SectionErrorBoundary sectionName="Power Quiz">
            <QuizSection />
          </SectionErrorBoundary>
        );
      default:
        return (
          <SectionErrorBoundary sectionName="Capacity Overview">
            <CapacityOverview />
          </SectionErrorBoundary>
        );
    }
  };

  return (
    <AppShell>
      <Breadcrumbs />
      {renderSection()}
    </AppShell>
  );
}

function App() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

  return (
    <QueryClientProvider client={queryClient}>
      {isLoggedIn ? <DashboardContent /> : <LoginPage />}
    </QueryClientProvider>
  );
}

export default App;


