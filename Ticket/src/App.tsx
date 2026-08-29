import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { TicketingManagerView } from './components/personas/TicketingManagerView';
import { EventPlannerView } from './components/personas/EventPlannerView';
import { AttendeeView } from './components/personas/AttendeeView';
import { VendorView } from './components/personas/VendorView';
import { SponsorView } from './components/personas/SponsorView';
import { ApplicationControlAgentView } from './components/personas/ApplicationControlAgentView';
import { WorkflowModal } from './components/common/WorkflowModal';

const MainContent: React.FC = () => {
  const { currentPersona } = useApp();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {currentPersona === 'ticketing_manager' && <TicketingManagerView />}
      {currentPersona === 'event_planner' && <EventPlannerView />}
      {currentPersona === 'attendee' && <AttendeeView />}
      {currentPersona === 'vendor' && <VendorView />}
      {currentPersona === 'sponsor' && <SponsorView />}
      {currentPersona === 'control_agent' && <ApplicationControlAgentView />}

      {/* Global Workflow Modal */}
      <WorkflowModal />
    </main>
  );
};

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
        <Header />
        <MainContent />
        <footer className="mt-auto border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="font-medium text-slate-600">
              Pega Blueprint BP-2418304 • Ticketing and Booking • Internet Service Provider (India)
            </p>
            <p className="font-mono text-[11px] text-slate-500">
              6 Personas • 1 Workflow • 6 Pega Data Objects
            </p>
          </div>
        </footer>
      </div>
    </AppProvider>
  );
}
