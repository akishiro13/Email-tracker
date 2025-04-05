import React, { useState } from 'react';
import { Search, Mail, AlertCircle, Loader2 } from 'lucide-react';

interface SearchResult {
  service: string;
  found: boolean;
  url?: string;
}

function App() {
  const [email, setEmail] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Veuillez entrer une adresse email');
      return;
    }

    setIsSearching(true);
    setError('');
    
    // Simulation de recherche (dans un vrai cas, on appellerait des API)
    setTimeout(() => {
      const mockResults: SearchResult[] = [
        { service: 'GitHub', found: true, url: 'https://github.com' },
        { service: 'Twitter', found: true, url: 'https://twitter.com' },
        { service: 'LinkedIn', found: false },
        { service: 'Facebook', found: true, url: 'https://facebook.com' },
      ];
      setResults(mockResults);
      setIsSearching(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8 text-indigo-900">
            Recherche de Comptes par Email
          </h1>

          <form onSubmit={handleSearch} className="mb-8">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Entrez une adresse email"
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                disabled={isSearching}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 flex items-center gap-2"
              >
                {isSearching ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Search className="w-5 h-5" />
                )}
                Rechercher
              </button>
            </div>
          </form>

          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          )}

          <div className="space-y-4">
            {results.map((result, index) => (
              <div
                key={index}
                className="p-4 bg-white rounded-lg shadow-md flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${result.found ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="font-medium">{result.service}</span>
                </div>
                {result.found && result.url && (
                  <a
                    href={result.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-800"
                  >
                    Voir le profil
                  </a>
                )}
              </div>
            ))}
          </div>

          {isSearching && (
            <div className="text-center mt-8">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-indigo-600" />
              <p className="mt-2 text-gray-600">Recherche en cours...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;