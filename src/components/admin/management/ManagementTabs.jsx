import { useState } from 'react';
import { motion } from 'framer-motion';
import { StickyNote, Users, Wallet, Calendar } from 'lucide-react';
import NotesManager from './notes/NotesManager';
import ContactsManager from './contacts/ContactsManager';
import FinancesManager from './finances/FinancesManager';
import AgendaManager from './agenda/AgendaManager';

const ManagementTabs = () => {
  const [activeSubTab, setActiveSubTab] = useState('notes');

  const subTabs = [
    { id: 'notes', label: 'Notas', icon: StickyNote },
    { id: 'contacts', label: 'Contactos', icon: Users },
    { id: 'finances', label: 'Finanzas', icon: Wallet },
    { id: 'agenda', label: 'Agenda', icon: Calendar }
  ];

  return (
    <div>
      {/* Sub-navegación */}
      <div className="bg-white rounded-lg shadow-soft mb-6">
        <div className="flex overflow-x-auto scrollbar-hide space-x-1 p-1">
          {subTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`flex items-center justify-center min-w-fit px-4 py-2 rounded-md font-medium transition-colors text-sm ${
                  activeSubTab === tab.id
                    ? 'bg-accent text-white'
                    : 'text-gallery-600 hover:text-gallery-900 hover:bg-gallery-100'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                <span className="whitespace-nowrap">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Contenido */}
      <motion.div
        key={activeSubTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {activeSubTab === 'notes' && <NotesManager />}
        {activeSubTab === 'contacts' && <ContactsManager />}
        {activeSubTab === 'finances' && <FinancesManager />}
        {activeSubTab === 'agenda' && <AgendaManager />}
      </motion.div>
    </div>
  );
};

export default ManagementTabs;
