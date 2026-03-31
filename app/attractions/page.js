'use client'
import React, {useState, useEffect} from 'react'
import Link from 'next/link'

export default function page() {
    const [attractions, setAttractions] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchAttractions(){
            const res = await fetch('/api/attractions')
            const data = await res.json();
            console.log(data)
            setAttractions(data)
            setLoading(false)
        }
        fetchAttractions()
    }, [])

    if(loading) return <h1>Loading...</h1>

    return (
        <div>
            <h1>Attractions</h1>
            <div>
                <Link href='/attractions/new'>Create New Attraction</Link>
            </div>
            <ul>
                {attractions.map((item) =>(
                    <li key={item.id}>
                        <h2>{item.name}</h2>
                        <img src={item.coverimage} height={200}/>
                        <p>{item.detail}</p>
                        <a href={"/attractions/"+item.id}>Read more</a>
                    </li>
                ))}
            </ul>
        </div>
    )
}
