import { useEffect, useState } from 'react'

interface Reservation {
  id: string
  date: string
  status: 'available' | 'reserved' | 'blocked'
  guestName?: string
  guestEmail?: string
  guestPhone?: string
  nights: number
  totalPrice: number
  createdAt: string
}

const ReservationsList = () => {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newReservation, setNewReservation] = useState({
    date: '',
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    nights: 1,
    totalPrice: 0
  })

  useEffect(() => {
    fetchReservations()
  }, [])

  const fetchReservations = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:5000/api/reservations')
      const data = await response.json()
      if (data.success) {
        setReservations(data.data)
      }
    } catch (err) {
      setError('Erro ao carregar reservas')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateReservation = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('http://localhost:5000/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newReservation,
          nights: parseInt(newReservation.nights.toString()),
          totalPrice: parseFloat(newReservation.totalPrice.toString())
        })
      })
      const data = await response.json()
      if (data.success) {
        setNewReservation({
          date: '',
          guestName: '',
          guestEmail: '',
          guestPhone: '',
          nights: 1,
          totalPrice: 0
        })
        fetchReservations()
      }
    } catch (err) {
      setError('Erro ao criar reserva')
      console.error(err)
    }
  }

  const handleDeleteReservation = async (id: string) => {
    if (window.confirm('Tem certeza que deseja cancelar esta reserva?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/reservations/${id}`, {
          method: 'DELETE'
        })
        const data = await response.json()
        if (data.success) {
          fetchReservations()
        }
      } catch (err) {
        setError('Erro ao cancelar reserva')
        console.error(err)
      }
    }
  }

  if (loading) {
    return <div className="text-center py-8">Carregando reservas...</div>
  }

  return (
    <div className="space-y-8">
      {/* Formulário de Nova Reserva */}
      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg p-6 border-2 border-indigo-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">➕ Nova Reserva</h2>
        <form onSubmit={handleCreateReservation} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="date"
            value={newReservation.date}
            onChange={(e) => setNewReservation({ ...newReservation, date: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <input
            type="text"
            placeholder="Nome do Hóspede"
            value={newReservation.guestName}
            onChange={(e) => setNewReservation({ ...newReservation, guestName: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={newReservation.guestEmail}
            onChange={(e) => setNewReservation({ ...newReservation, guestEmail: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="tel"
            placeholder="Telefone"
            value={newReservation.guestPhone}
            onChange={(e) => setNewReservation({ ...newReservation, guestPhone: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="number"
            placeholder="Noites"
            value={newReservation.nights}
            onChange={(e) => setNewReservation({ ...newReservation, nights: parseInt(e.target.value) })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            min="1"
            required
          />
          <input
            type="number"
            placeholder="Preço Total"
            value={newReservation.totalPrice}
            onChange={(e) => setNewReservation({ ...newReservation, totalPrice: parseFloat(e.target.value) })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            min="0"
            step="0.01"
            required
          />
          <button
            type="submit"
            className="md:col-span-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold transition"
          >
            ✓ Criar Reserva
          </button>
        </form>
      </div>

      {/* Lista de Reservas */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">📋 Lista de Reservas ({reservations.length})</h2>
        
        {error && <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">{error}</div>}

        {reservations.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-600">Nenhuma reserva registrada</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reservations.map((res) => (
              <div
                key={res.id}
                className={`rounded-lg p-4 border-2 ${
                  res.status === 'reserved'
                    ? 'bg-blue-50 border-blue-200'
                    : res.status === 'blocked'
                    ? 'bg-gray-50 border-gray-200'
                    : 'bg-green-50 border-green-200'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-bold text-gray-800">📅 {res.date}</p>
                    <p className="text-sm text-gray-600">{res.guestName || 'Sem hóspede'}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    res.status === 'reserved' ? 'bg-blue-200 text-blue-800' :
                    res.status === 'blocked' ? 'bg-gray-200 text-gray-800' :
                    'bg-green-200 text-green-800'
                  }`}>
                    {res.status === 'reserved' ? '📍 Reservado' : res.status === 'blocked' ? '🔒 Bloqueado' : '✓ Disponível'}
                  </span>
                </div>

                {res.status === 'reserved' && (
                  <>
                    <p className="text-sm text-gray-600">
                      <strong>Noites:</strong> {res.nights}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Preço:</strong> €{res.totalPrice.toFixed(2)}
                    </p>
                    {res.guestEmail && (
                      <p className="text-sm text-gray-600 truncate">
                        <strong>Email:</strong> {res.guestEmail}
                      </p>
                    )}
                    {res.guestPhone && (
                      <p className="text-sm text-gray-600">
                        <strong>Tel:</strong> {res.guestPhone}
                      </p>
                    )}
                  </>
                )}

                {res.status === 'reserved' && (
                  <button
                    onClick={() => handleDeleteReservation(res.id)}
                    className="mt-3 w-full px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm font-semibold transition"
                  >
                    🗑️ Cancelar
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ReservationsList
