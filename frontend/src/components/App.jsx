import React, { useState, useMemo } from 'react'
import { exportClientExcel } from '../utils/export'
export default function App(){
  const [clients] = useState([{id:'c1',name:'Entreprise ABC'},{id:'c2',name:'Société XYZ'}])
  const [articles] = useState([
    {id:'a1',client:'Entreprise ABC',reference:'REF-001',designation:'Palette de cartons',dateEntree:'2024-12-01',dateSortie:'',emplacement:'A-12',quantite:5,autresInfos:'Fragile'},
    {id:'a2',client:'Société XYZ',reference:'REF-002',designation:'Équipements',dateEntree:'2024-11-28',dateSortie:'2024-12-03',emplacement:'B-05',quantite:0,autresInfos:'Retrait'}
  ])
  const [selectedClient,setSelectedClient]=useState(clients[0].name)
  const filtered = useMemo(()=>articles.filter(a=>a.client===selectedClient),[articles,selectedClient])
  return (
    <div className="container">
      <aside className="sidebar">
        <div className="logo">MRDPS 27</div>
        <nav>
          <button className="nav-btn">Tableau de bord</button>
          <button className="nav-btn">Clients</button>
          <button className="nav-btn">Articles</button>
          <button className="nav-btn">Paramètres</button>
        </nav>
        <div className="copyright">© MRDPS 27</div>
      </aside>
      <main className="main">
        <header className="topbar">
          <h2>Gestion de stock — PRO</h2>
          <div>
            <select value={selectedClient} onChange={e=>setSelectedClient(e.target.value)}>
              {clients.map(c=> <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
            <button className="btn" onClick={()=>exportClientExcel(selectedClient, filtered)}>Export Excel</button>
          </div>
        </header>
        <section className="content">
          <table className="table">
            <thead><tr><th>Réf</th><th>Désignation</th><th>Qte</th><th>Emplacement</th></tr></thead>
            <tbody>{filtered.map(a=>(<tr key={a.id}><td>{a.reference}</td><td>{a.designation}</td><td>{a.quantite}</td><td>{a.emplacement}</td></tr>))}</tbody>
          </table>
        </section>
      </main>
    </div>
  )
}
