import React, { useState } from 'react';
import { Search, Mail, AlertCircle, Loader2, Check, X } from 'lucide-react';

interface SearchResult {
  service: string;
  found: boolean;
  url?: string;
  details?: string;
}

function App() {
  const [email, setEmail] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [error, setError] = useState('');

  const checkGravatar = (email: string): SearchResult => {
    const hash = require('md5')(email.trim().toLowerCase());
    const url = `https://www.gravatar.com/${hash}`;
    return {
      service: 'Gravatar',
      found: true,
      url,
      details: 'Profil public trouvé'
    };
  };

  const checkHIBP = async (email: string): Promise<SearchResult> => {
    try {
      const response = await fetch(
        `https://haveibeenpwned.com/api/v3/breachedaccount/${encodeURIComponent(email)}`,
        {
          headers: {
            'hibp-api-key': 'YOUR_HIBP_API_KEY' // Remplacez par votre clé gratuite
          }
        }
      );

      if (response.status === 404) {
        return {
          service: 'Have I Been Pwned',
          found: false,
          details: 'Aucune fuite de données trouvée'
        };
      }

      const data = await response.json();
      return {
        service: 'Have I Been Pwned',
        found: true,
        details: `Trouvé dans ${data.length} fuites de données`
      };
    } catch (error) {
      return {
        service: 'Have I Been Pwned',
        found: false,
        details: 'Erreur de vérification'
      };
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('Veuillez entrer une adresse email');
      return;
    }
  
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Veuillez entrer une adresse email valide');
      return;
    }
  
    setIsSearching(true);
    setError('');
    setResults([]);
  
    try {
      const results: SearchResult[] = [];
      
      // 1. Gravatar (toujours synchrone)
      results.push(checkGravatar(email));
      
      // 2. Have I Been Pwned (avec gestion d'erreur détaillée)
      try {
        const hibpResult = await checkHIBP(email);
        results.push(hibpResult);
      } catch (hibpError) {
        results.push({
          service: 'Have I Been Pwned',
          found: false,
          details: 'Service temporairement indisponible'
        });
      }
  
      // 3. Optionnel : Ajouter d'autres services ici
      results.push({
        service: 'Google (recherche manuelle)',
        found: false,
        url: `https://www.google.com/search?q=${encodeURIComponent(`site:twitter.com OR site:facebook.com OR site:linkedin.com "${email}"`)}`,
        details: 'Effectuer une recherche manuelle'
      });
  
      setResults(results);
    } catch (error) {
      console.error('Erreur globale:', error); // Debug
      setError('Erreur lors de la recherche - Voir la console pour les détails');
    } finally {
      setIsSearching(false);
    }
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
                className="p-4 bg-white rounded-lg shadow-md"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    {result.found ? (
                      <Check className="w-5 h-5 text-green-500" />
                    ) : (
                      <X className="w-5 h-5 text-red-500" />
                    )}
                    <span className="font-medium">{result.service}</span>
                  </div>
                  {result.url && (
                    <a
                      href={result.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-800 text-sm"
                    >
                      Vérifier
                    </a>
                  )}
                </div>
                {result.details && (
                  <p className="text-gray-600 text-sm mt-1">{result.details}</p>
                )}
              </div>
            ))}
          </div>

          {isSearching && results.length === 0 && (
            <div className="text-center mt-8">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-indigo-600" />
              <p className="mt-2 text-gray-600">Recherche en cours...</p>
            </div>
          )}

          {!isSearching && results.length > 0 && (
            <div className="mt-6 text-center text-sm text-gray-500">
              <p>Ces résultats proviennent de sources publiques et légales.</p>
              <p className="mt-1">Pour supprimer vos comptes, visitez <a href="https://justdeleteme.xyz" className="text-indigo-600" target="_blank" rel="noopener">JustDeleteMe</a>.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;