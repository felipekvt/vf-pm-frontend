'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Dashboard() {
  const api = process.env.NEXT_PUBLIC_API_BASE!;
  const [assets, setAssets] = useState<any[]>([]);
  const [wos, setWos] = useState<any[]>([]);
  const token = () => (typeof window !== 'undefined' ? localStorage.getItem('vfpm_token') || '' : '');
  const headers = () => ({ Authorization: `Bearer ${token()}` });

  useEffect(() => {
    if (!token()) { window.location.href = '/'; return; }
    Promise.all([
      fetch(`${api}/api/assets`, { headers: headers() }).then(r=>r.json()),
      fetch(`${api}/api/workorders`, { headers: headers() }).then(r=>r.json()),
    ]).then(([A,W]) => { setAssets(A); setWos(W); });
  }, []);

  const open = wos.filter((x:any)=>x.status==='OPEN').length;
  const inprog = wos.filter((x:any)=>x.status==='IN_PROGRESS').length;
  const done = wos.filter((x:any)=>x.status==='DONE').length;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Visão geral</h1>

      {/* KPIs */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Kpi title="Ativos" value={assets.length} href="/assets" />
        <Kpi title="OS Abertas" value={open} href="/workorders" />
        <Kpi title="Em andamento" value={inprog} href="/workorders" />
        <Kpi title="Concluídas (30d)" value={done} href="/workorders" />
      </div>

      {/* Recentes */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="font-semibold">OS recentes</div>
            <Link href="/workorders" className="text-sm hover:underline">ver todas</Link>
          </div>
          <ul className="space-y-2">
            {wos.slice(0,5).map((w:any)=>(
              <li key={w.id} className="flex items-center justify-between">
                <Link href={`/workorders/${w.id}`} className="hover:underline">{w.title}</Link>
                <span className={`badge ${badge(w.status)}`}>{w.status}</span>
              </li>
            ))}
            {!wos.length && <div className="text-sm text-gray-600">Sem OS por enquanto.</div>}
          </ul>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="font-semibold">Ativos recentes</div>
            <Link href="/assets" className="text-sm hover:underline">ver todos</Link>
          </div>
          <ul className="space-y-2">
            {assets.slice(0,5).map((a:any)=>(
              <li key={a.id} className="flex items-center justify-between">
                <Link href={`/assets/${a.id}`} className="hover:underline">{a.name}</Link>
                <span className="text-xs text-gray-500">{a.location ?? '-'}</span>
              </li>
            ))}
            {!assets.length && <div className="text-sm text-gray-600">Sem ativos cadastrados.</div>}
          </ul>
        </div>
      </div>
    </div>
  );
}

function Kpi({ title, value, href }: { title: string; value: number; href: string }) {
  return (
    <Link href={href} className="card p-4 hover:bg-gray-50 transition">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-2xl font-bold">{value}</div>
    </Link>
  );
}

function badge(s: string) {
  return s==='DONE' ? 'border-green-500 text-green-600'
       : s==='IN_PROGRESS' ? 'border-amber-500 text-amber-600'
       : 'border-gray-400 text-gray-700';
}
