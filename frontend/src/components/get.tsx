"use client";

import { useState, useEffect } from 'react';

interface Dog {
  firstname: string;
  lastname: string;
  location: string;
  username: string;
  email: string;
  password: string;
  createdAt: string | null;
}

export default function Get() {
  const [data, setData] = useState<Dog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch('http://localhost:3002/dog');
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const result = await res.json();
        console.log('Données reçues:', result);
        setData(result);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div>
        <h1>Liste des Utilisateurs</h1>
        <p>Chargement...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1>Liste des Utilisateurs</h1>
        <p style={{ color: 'red' }}>Erreur: {error}</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Liste des Utilisateurs</h1>
      <ul>
        {data.map((dog) => (
          <li key={dog.username}>
            <strong>{dog.firstname} {dog.lastname}</strong> 
            ({dog.username}) - {dog.email} - {dog.location}
          </li>
        ))}
      </ul>
      <p>✅ {data.length} utilisateurs chargés avec succès !</p>
    </div>
  );
}