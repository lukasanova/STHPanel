import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DataProvider } from './context/DataProvider';
import { Layout } from './components/Layout';
import { TasksView } from './views/Tasks';
import { InvestorsView } from './views/Investors';
import { AchievementsView } from './views/Achievements';
import { ServicesView } from './views/Services';
import { ContactsView } from './views/Contacts';
import { NotesView } from './views/Notes';
import { EventsView } from './views/Events';
import { MeetingsView } from './views/Meetings';
import { CustomersView } from './views/Customers';
import { FinanceView } from './views/Finance';
import { ContractsView } from './views/Contracts';
import { PartnersView } from './views/Partners';
import { LibraryView } from './views/Library';
import { SocialStatsView } from './views/SocialStats';

const App: React.FC = () => {
  return (
    <DataProvider>
      <HashRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<TasksView />} />
            <Route path="/customers" element={<CustomersView />} />
            <Route path="/investors" element={<InvestorsView />} />
            <Route path="/achievements" element={<AchievementsView />} />
            <Route path="/meetings" element={<MeetingsView />} />
            <Route path="/services" element={<ServicesView />} />
            <Route path="/events" element={<EventsView />} />
            <Route path="/contacts" element={<ContactsView />} />
            <Route path="/notes" element={<NotesView />} />
            
            {/* New Routes */}
            <Route path="/finance" element={<FinanceView />} />
            <Route path="/contracts" element={<ContractsView />} />
            <Route path="/partners" element={<PartnersView />} />
            <Route path="/library" element={<LibraryView />} />
            <Route path="/social" element={<SocialStatsView />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </HashRouter>
    </DataProvider>
  );
};

export default App;