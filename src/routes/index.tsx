import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-5xl font-bold">Lineguessr</h1>
      <p className="text-sm text-gray-500">Trouvez la ligne qui passe à cet arrêt dans le temps imparti</p>
      <Link to="/game" className="bg-blue-500 text-white p-2 text-2xl font-bold rounded-md hover:bg-blue-600 hover:cursor-pointer mt-2">
        Lancer le jeu
      </Link>
    </div>
  )
}
