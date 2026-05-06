import { useState } from 'react'
import Calendar from './components/Calendar'
import ReservationsList from './components/ReservationsList'
import Stats from './components/Stats'

type Tab = 'calendar' | 'reservations' | 'stats'

function App() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [activeTab, setActiveTab] = useState<Tab>('calendar')

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'calendar', label: 'Calendário', icon: '🗓️' },
    { id: 'reservations', label: 'Reservas', icon: '📋' },
    { id: 'stats', label: 'Estatísticas', icon: '📊' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 to-blue-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-2">🏠 AL Calendário</h1>
            <p className="text-indigo-100 text-lg">Sistema de Reservas para Alojamento Local na Ilha da Madeira</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-lg font-semibold transition transform ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 shadow hover:shadow-lg hover:scale-105'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          {activeTab === 'calendar' && (
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">📅 Calendário de Reservas</h2>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <Calendar selectedDate={selectedDate} onDateSelect={setSelectedDate} />
                </div>
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border-2 border-green-200">
                    <p className="text-sm text-green-700 mb-1">Disponível</p>
                    <p className="text-2xl font-bold text-green-600">✓</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border-2 border-blue-200">
                    <p className="text-sm text-blue-700 mb-1">Reservado</p>
                    <p className="text-2xl font-bold text-blue-600">📍</p>
                  </div>
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border-2 border-gray-200">
                    <p className="text-sm text-gray-700 mb-1">Bloqueado</p>
                    <p className="text-2xl font-bold text-gray-600">🔒</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reservations' && (
            <ReservationsList />
          )}

          {activeTab === 'stats' && (
            <Stats />
          )}
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-gray-600 pb-8">
          <p>💡 AL Calendário © 2026 - Sistema de Reservas para Alojamento Local</p>
          <p className="text-sm mt-2">Desenvolvido com ❤️ por FGoncalves2026</p>
        </footer>
      </main>
    </div>
  )
}

export default App
