import { useEffect, useState } from 'react'

interface Stats {
  totalReservations: number
  blockedDates: number
  totalRevenue: number
  averagePrice: number
}

const StatsComponent = () => {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:5000/api/stats')
      const data = await response.json()
      if (data.success) {
        setStats(data.data)
      }
    } catch (err) {
      setError('Erro ao carregar estatísticas')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Carregando estatísticas...</div>
  }

  if (error) {
    return <div className="bg-red-100 text-red-700 p-4 rounded-lg">{error}</div>
  }

  if (!stats) {
    return <div className="text-center py-8">Nenhuma estatística disponível</div>
  }

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">📊 Dashboard de Estatísticas</h2>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total de Reservas */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold opacity-90">Total de Reservas</h3>
            <span className="text-3xl">📍</span>
          </div>
          <p className="text-5xl font-bold">{stats.totalReservations}</p>
          <p className="text-blue-100 text-sm mt-2">Reservas ativas</p>
        </div>

        {/* Datas Bloqueadas */}
        <div className="bg-gradient-to-br from-gray-500 to-gray-600 rounded-lg p-6 text-white shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold opacity-90">Datas Bloqueadas</h3>
            <span className="text-3xl">🔒</span>
          </div>
          <p className="text-5xl font-bold">{stats.blockedDates}</p>
          <p className="text-gray-100 text-sm mt-2">Datas indisponíveis</p>
        </div>

        {/* Receita Total */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold opacity-90">Receita Total</h3>
            <span className="text-3xl">💰</span>
          </div>
          <p className="text-5xl font-bold">€{stats.totalRevenue.toFixed(0)}</p>
          <p className="text-green-100 text-sm mt-2">De todas as reservas</p>
        </div>

        {/* Preço Médio */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold opacity-90">Preço Médio</h3>
            <span className="text-3xl">💵</span>
          </div>
          <p className="text-5xl font-bold">€{stats.averagePrice.toFixed(0)}</p>
          <p className="text-purple-100 text-sm mt-2">Por reserva</p>
        </div>
      </div>

      {/* Charts & Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ocupação */}
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg p-6 border-2 border-indigo-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4">📈 Taxa de Ocupação</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">Ocupação Mês</span>
                <span className="text-sm font-bold text-indigo-600">
                  {stats.totalReservations > 0 ? ((stats.totalReservations / 30) * 100).toFixed(0) : 0}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-indigo-600 h-3 rounded-full transition-all"
                  style={{
                    width: `${stats.totalReservations > 0 ? Math.min(((stats.totalReservations / 30) * 100), 100) : 0}%`
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Resumo Financeiro */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border-2 border-green-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4">💳 Resumo Financeiro</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-700">Receita Total:</span>
              <span className="font-bold text-green-600">€{stats.totalRevenue.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Preço Médio:</span>
              <span className="font-bold text-green-600">€{stats.averagePrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Reservas:</span>
              <span className="font-bold text-green-600">{stats.totalReservations}</span>
            </div>
            <div className="flex justify-between pt-3 border-t border-green-200">
              <span className="text-gray-700 font-semibold">Receita por Reserva:</span>
              <span className="font-bold text-green-600">€{stats.totalReservations > 0 ? (stats.totalRevenue / stats.totalReservations).toFixed(2) : '0.00'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-6 border-2 border-yellow-200">
        <h3 className="text-xl font-bold text-gray-800 mb-4">💡 Insights</h3>
        <ul className="space-y-2 text-gray-700">
          <li>✓ Total de reservas em sistema: <strong>{stats.totalReservations}</strong></li>
          <li>✓ Datas bloqueadas para manutenção: <strong>{stats.blockedDates}</strong></li>
          <li>✓ Receita total gerada: <strong>€{stats.totalRevenue.toFixed(2)}</strong></li>
          <li>✓ Preço médio por reserva: <strong>€{stats.averagePrice.toFixed(2)}</strong></li>
          <li>✓ Taxa de ocupação estimada: <strong>{stats.totalReservations > 0 ? ((stats.totalReservations / 30) * 100).toFixed(0) : 0}%</strong></li>
        </ul>
      </div>

      {/* Action Button */}
      <div className="flex gap-4">
        <button
          onClick={fetchStats}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold transition"
        >
          🔄 Atualizar Dados
        </button>
        <button
          onClick={() => window.print()}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-semibold transition"
        >
          🖨️ Imprimir Relatório
        </button>
      </div>
    </div>
  )
}

export default StatsComponent
