import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
        <header className="bg-white shadow-sm p-4">
          <h1 className="text-2xl font-bold text-primary">Gestion de Stock</h1>
        </header>
        <main className="flex-1 p-6">
          <Routes>
            <Route path="/" element={<p>Tableau de bord à venir...</p>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
