"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function page() {
  const { id } = useParams()
  const router = useRouter()
  const [attraction, setAttraction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState("") 

  async function onDelete(){
    if(!confirm('Delete this attraction?')) return
    setDeleting(true)
    setError("")
    try{
      const res = await fetch('/api/attractions/'+id,{method:'DELETE'})
      const data = await res.json()
      if(!res.ok) throw new Error(data.error || "Delete failed")
      router.push('/attractions')
    }catch(error){
      setError(error.message)
    }finally{
      setDeleting(false)
    }
  }

  useEffect(() => {
    async function fetchAttraction() {
        console.log(id)
        const res = await fetch(`/api/attractions/${id}`);
        if (res.ok) {
            const data = await res.json();
            console.log(data)
            setAttraction(data);
        }
        setLoading(false);
    }
    fetchAttraction();
  }, [])

  if (loading) return <div>Loading...</div>
  if (!attraction) return <div>Not found.</div>

  return (
    <div>
      <h1>{attraction.name}</h1>
      <img src={attraction.coverimage} />
      <p>{attraction.detail}</p>
      <p>Latitute: {attraction.latitude}</p>
      <p>Longitude: {attraction.longitude}</p>
      <div style={{ display:'flex', gap:12, marginTop:12}}>
        <Link href={`/attractions/${id}/edit`}>Edit</Link>
        <button onClick={onDelete} disabled={deleting}>{deleting ? "Deleting" : "Delete"}</button>
        <a href='/attractions'>Back</a>
      </div>
      {error && <div style={{ color:'crimson', marginTop:8}}>{error}</div>}
    </div>
  )
}

