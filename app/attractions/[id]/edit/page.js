'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

export default function page() {
    const {id} = useParams()
    const router = useRouter()
    const [form, setForm] = useState({
        name:'',detail:'',coverimage:'',latitude:'',longitude:''
    })
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState("")

    useEffect(()=>{
        (async ()=>{
            const res = await fetch('/api/attractions/'+id)
            const data = await res.json()
            if (res.ok){
                setForm({
                    name: data.name ?? "",
                    detail: data.detail ?? "",
                    coverimage: data.coverimage ?? "",
                    latitude: data.latitude ?? "",
                    longitude: data.longitude ?? ""
                })
            }else{
                setError(data.error || "Not Found")
            }
        })
        ();
    }, [id])

    const onChange = (e) => setForm({...form,[e.target.name]:e.target.value})

    async function onSubmit(e){
        e.preventDefault()
        setSaving(true)
        setError("")
        try{
            const res = await fetch('/api/attractions/'+id,{
                method: "PUT",
                headers: {"Content-Type":"application/json"},
                body: JSON.stringify({
                    ...form,
                    latitude: form.latitude ? Number(form.latitude) : null,
                    longitude: form.longitude ? Number(form.longitude) : null,
                })
            })
            const data = await res.json()
            if(!res.ok) throw new Error(data.error || "Update fail")
            router.push('/attractions/'+id)
        }catch(error){
            setError(error.message)
        }
        finally{
            setSaving(false)
        }
    }

    return (
        <div style={{maxWidth: 640, margin: "24px auto"}}>
        <h1>Edit Attraction</h1>
        <form onSubmit={onSubmit} style={{display: "grid", gap:12}}>
            <input name="name" placeholder='Name' value={form.name}
            onChange={onChange}/>
            <input name="coverimage" placeholder='Cover Image URL' value={form.coverimage}
            onChange={onChange}/>
            <textarea name="detail" placeholder='Detail' rows={4} value={form.detail}
            onChange={onChange}/>
            <input name="latitude" placeholder='Latitude' value={form.latitude}
            onChange={onChange}/>
            <input name="longitude" placeholder='Longitude' value={form.longitude}
            onChange={onChange}/>
            <button disabled={saving}>{saving ? "Saving" : "Save changes"}</button>
            {error && <div style={{color:"crimson"}}>{error}</div>}
        </form>
        <p><Link href={`/attractions/${id}`}>Cancel</Link></p>
    </div>
    )
}
