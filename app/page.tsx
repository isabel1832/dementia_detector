'use client';

import { useState } from 'react';

export default function Home() {
  const [topic, setTopic] = useState('');
  const [joke, setJoke] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    setJoke('');

    try {
      const res = await fetch('/api/groq', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic }),
      });

      const data = await res.json();

      if (res.ok) {
        setJoke(data.joke);
      } else {
        setJoke(data.error || 'Something went wrong');
      }
    } catch (err) {
      setJoke('Failed to connect to the server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ maxWidth: '500px', margin: '60px auto', padding: '0 20px', fontFamily: 'sans-serif' }}>
      <h1>AI Joke Generator</h1>
      <p style={{ color: '#666' }}>Enter a topic to generate a quick joke using Groq.</p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g., Coding, Coffee, Cats"
          style={{
            flex: 1,
            padding: '10px 14px',
            fontSize: '16px',
            border: '1px solid #ccc',
            borderRadius: '6px',
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '10px 18px',
            fontSize: '16px',
            backgroundColor: '#0070f3',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? 'Generating...' : 'Ask Groq'}
        </button>
      </form>

      {joke && (
        <div
          style={{
            marginTop: '24px',
            padding: '16px',
            backgroundColor: '#f5f5f5',
            borderRadius: '8px',
            borderLeft: '4px solid #0070f3',
          }}
        >
          <p style={{ margin: 0, fontSize: '18px', lineHeight: '1.5' }}>{joke}</p>
        </div>
      )}
    </main>
  );
}