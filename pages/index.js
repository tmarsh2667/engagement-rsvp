import { useEffect, useState } from 'react'

export default function Home(){

  const [guests,setGuests]=useState([]);
  const [responses,setResponses]=useState([]);
  const [search,setSearch]=useState('');
  const [selected,setSelected]=useState([]);
  const [tempStatus,setTempStatus]=useState({});
  const [tempDiet,setTempDiet]=useState({});
  const [step,setStep]=useState('search');

  const [admin,setAdmin]=useState(false);
  const [pass,setPass]=useState('');
  const [file,setFile]=useState(null);

  const load=async()=>{
    setGuests(await fetch('/api/guests').then(r=>r.json()));
    setResponses(await fetch('/api/responses').then(r=>r.json()));
  }

  useEffect(()=>{load()},[]);

  const respOf=n=>responses.find(r=>r.name===n);

  const filtered=guests.filter(g=>
    g.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
  <div className="center">
    <div className="card">

      <div style={{display:'flex',justifyContent:'space-between'}}>
        <h2>Connor & Tiana's Engagement</h2>
        <button onClick={()=>setAdmin(!admin)}>Admin</button>
      </div>

{/* ------------------ GUEST RSVP ------------------ */}

{!admin && (
<>
{step==='search' && (
<>
<input
  placeholder="Search your name..."
  value={search}
  onChange={e=>setSearch(e.target.value)}
/>

{filtered.map(g=>
  <div key={g.id}>
    <label>
      <input type="checkbox"
        onChange={e=>{
          if(e.target.checked)
            setSelected([...selected,g])
          else
            setSelected(selected.filter(x=>x.id!==g.id))
        }}
      /> {g.name}
    </label>
  </div>
)}

{!!selected.length && (
<button onClick={()=>{
  let s={},d={};
  selected.forEach(g=>{
    const ex=respOf(g.name);
    s[g.id]=ex?.status||'';
    d[g.id]=ex?.dietary||'';
  });
  setTempStatus(s);
  setTempDiet(d);
  setStep('details');
}}>
Continue
</button>
)}
</>
)}

{step==='details' && (
<>
{selected.map(g=>
  <div className="card-sm" key={g.id}>
    <b>{g.name}</b>

    <div className="row">
      <button
        className={'accept '+(tempStatus[g.id]==='Attending'?'active':'')}
        onClick={()=>setTempStatus({...tempStatus,[g.id]:'Attending'})}
      >Accept ✓</button>

      <button
        className={'decline '+(tempStatus[g.id]==='Declined'?'active':'')}
        onClick={()=>setTempStatus({...tempStatus,[g.id]:'Declined'})}
      >Decline ✗</button>
    </div>

    {tempStatus[g.id]==='Attending' && (
      <input
        placeholder="Dietary requirements"
        value={tempDiet[g.id]||''}
        onChange={e=>setTempDiet({...tempDiet,[g.id]:e.target.value})}
      />
    )}
  </div>
)}

<button onClick={async()=>{
  await Promise.all(selected.map(g=>
    fetch('/api/upsert',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        name:g.name,
        status:tempStatus[g.id],
        dietary:tempDiet[g.id]
      })
    })
  ));
  setStep('thanks');
  load();
}}>
Submit RSVP
</button>
</>
)}

{step==='thanks' && (
<>
<h3>Thanks for your RSVP</h3>
<button onClick={()=>{
  setSelected([]);
  setStep('search');
}}>
RSVP Another Guest
</button>
</>
)}

</>
)}

{/* ------------------ ADMIN PANEL ------------------ */}

{admin && (
<>
<input
  type="password"
  placeholder="Admin Password"
  value={pass}
  onChange={e=>setPass(e.target.value)}
/>

{pass==='engagement2026' && (
<>

<h3>Upload Guest CSV</h3>

<input type="file" onChange={e=>setFile(e.target.files[0])}/>

<button onClick={async()=>{
  if(!file) return;
  const txt=await file.text();
  const names=txt.split(/\r?\n/).map(x=>x.split(',')[0]).filter(Boolean);

  await fetch('/api/guests-bulk',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({names})
  });

  alert("Guests Uploaded!");
  load();
}}>
Upload
</button>

<br/><br/>

<a href="/api/export">Download Responses</a>

<h3>Responses</h3>

{responses.map((r,i)=>
  <div className="card-sm" key={i}>
    <b>{r.name}</b> — {r.status} • {r.dietary||'No dietary'}

    <div className="row">
      <button onClick={async()=>{
        await fetch('/api/force',{
          method:'POST',
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify({name:r.name,status:'Attending'})
        });
        load();
      }}>✓</button>

      <button onClick={async()=>{
        await fetch('/api/force',{
          method:'POST',
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify({name:r.name,status:'Declined'})
        });
        load();
      }}>✗</button>
    </div>
  </div>
)}

</>
)}
</>
)}

    </div>
  </div>
)
}
