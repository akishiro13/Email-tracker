import React, { useState } from 'react';
import { Search, Mail, AlertCircle, Loader2, Check, X } from 'lucide-react';
import md5 from 'md5';

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
    const hash = md5(email.trim().toLowerCase());
    return {
      service: 'Gravatar',
      found: true,
      url: `https://www.gravatar.com/${hash}`,
      details: 'Gravatar peut exister – Vérifiez manuellement',
    };
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

      const emailEncoded = encodeURIComponent(email);

      // Gravatar
      results.push(checkGravatar(email));

      // TruePeopleSearch (via Google site search)
      results.push({
        service: 'TruePeopleSearch (Email Lookup)',
        found: false,
        url: `https://truepeoplesearch.net/email-lookup`,
        details: 'Recherche manuelle à faire sur le site avec l’email',
      });      

      // Autres services
      results.push({
        service: 'Intelligence X',
        found: false,
        url: `https://intelx.io/?s=${emailEncoded}&f=email`,
        details: 'Recherche dans les données publiques',
      });

      results.push({
        service: 'DeHashed',
        found: false,
        url: `https://www.dehashed.com/search?query=${emailEncoded}`,
        details: 'Recherche dans les bases de données',
      });

      results.push({
        service: 'LeakCheck',
        found: false,
        url: `https://leakcheck.io/search?query=${emailEncoded}`,
        details: 'Fuites de données – Vérification manuelle',
      });

      results.push({
        service: 'Hunter.io',
        found: false,
        url: `https://hunter.io/search/${emailEncoded}`,
        details: 'Email professionnel (domaine)',
      });

      results.push({
        service: 'Social Searcher',
        found: false,
        url: `https://www.social-searcher.com/google-social-search/?q=${emailEncoded}`,
        details: 'Réseaux sociaux publics',
      });

      results.push({
        service: "That'sThem",
        found: false,
        url: `https://thatsthem.com/email/${emailEncoded}`,
        details: 'Recherche dans les bases de données US',
      });

      results.push({
        service: 'BeenVerified',
        found: false,
        url: `https://www.beenverified.com/email/${emailEncoded}`,
        details: 'Recherche d’identité liée à l’email',
      });

      results.push({
        service: 'Pipl',
        found: false,
        url: `https://pipl.com/search/?q=${emailEncoded}&l=&in=5`,
        details: 'Profil public lié à l’email',
      });

      setResults(results);
    } catch (error) {
      console.error('Erreur globale:', error);
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
            Recherche d’Informations par Email (Gratuit)
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

          {!isSearching && results.length > 0 && (
            <div className="mt-6 text-center text-sm text-gray-500">
              <p>Ces outils sont gratuits et basés sur des recherches publiques.</p>
              <p className="mt-1">
                Supprimer vos comptes :{' '}
                <a
                  href="https://justdeleteme.xyz"
                  className="text-indigo-600"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  JustDeleteMe
                </a>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
