'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useMemo, useState } from 'react';
import { notFound, useParams } from 'next/navigation';

type ChecklistItem = { id: string; text: string; done: boolean };
type WO = { id: string; title: string; status: 'OPEN'|'IN_PROGRESS'|'DONE'; asset?: { id?: string; name?: string }; checklist?: ChecklistItem[]; comments?: { id:string; text:string; createdAt?:string }[] };

export default function WorkOrderDetail() {
  const api = process.env.NEXT_PUBLIC_API_BASE!;
  const { id } = useParams<{ id: string }>();
  const [wo, setWo] = useState<WO | null>(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);
  const [newItem, setNewItem] = useState('');
  const [comment, setComment] = useState('');

  const token = () => (typeof window !== 'undefined' ? localStorage.getItem('vfpm_token') || '' : '');
  const headers = () => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` });

  async function load() {
    // tenta endpoint de detalhe; se 404, carrega a lista e filtra
    const res = await fetch(`${api}/api/workorders/${id}`, { headers: headers() });
    if (res.ok) { setWo(await res.json()); return; }
    const list = await fetch(`${api}/api/workorders`, { headers: headers() }).then(r => r.json());
    setWo(list.find((x:WO)=>x.id===id) || null);
  }

  useEffect(() => {
    if (!token()) { window.location.href = '/'; return; }
    load().finally(()=>setLoading(false));
  }, [id]);

  const statusColor = useMemo(()=> wo?.status==='DONE'?'border-green-500 text-green-600': wo?.status==='IN_PROGRESS'?'border-amber-500 text-amber-600':'border-gray-400 text-gray-700', [wo]);

  async function changeStatus(next: WO['status']) {
    try {
      setMsg(null);
      await fetch(`${api}/api/workorders/${id}`, { method: 'PATCH', headers: headers(), body: JSON.stringify({ status: next }) });
      await load();
    } catch (err:any) { setMsg(err.message || 'Erro ao atualizar status'); }
  }

  async function addChecklist(e: React.FormEvent) {
    e.preventDefault();
    if (!newItem) return;
    try {
      await fetch(`${api}/api/workorders/${id}/checklist`, { method: 'POST', headers: headers(), body: JSON.stringify({ text: newItem }) });
      setNewItem(''); await load();
    } catch (err:any) { setMsg(err.message || 'Erro ao adicionar item'); }
  }

  async function toggleChecklist(itemId: string, done: boolean) {
    try {
      await fetch(`${api}/api/workorders/${id}/checklist/${itemId}`, { method: 'PATCH', headers: headers(), body: JSON.stringify({ done }) });
      await load();
    } catch (err:any) { setMsg(err.message || 'Erro ao atualizar item'); }
  }

  async function addComment(e: React.FormEvent) {
    e.preventDefault();
    if (!comment) return;
    try {
      await fetch(`${api}/api/workorders/${id}/comments`, { method: 'POST', headers: headers(), body: JSON.stringify({ text: comment }) });
      setComment(''); await load();
    } catch (err:any) { setMsg(err.message || 'Erro ao comentar'); }
  }

  if (loading) return <div className="space-y-3"><div className="h-10 bg-gray-100 rounded-xl animate-pulse" /><div className="h-40 bg-gray-100 rounded-xl animate-pulse" /></div>;
  if (!wo) return notFound();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <div className="text-sm text-gray-600">OS #{wo.id.slice(0,6)}</div>
          <h1 className="text-2xl font-bold">{wo.title}</h1>
          <div className="mt-1 text-sm text-gray-600">Ativo: <span className="font-medium">{wo.asset?.name ?? '-'}</span></div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`badge ${statusColor}`}>{wo.status}</span>
          {wo.status !== 'OPEN' && <button className="btn-ghost" onClick={()=>changeStatus('OPEN')}>Reabrir</button>}
          {wo.status === 'OPEN' && <button className="btn-primary" onClick={()=>changeStatus('IN_PROGRESS')}>Iniciar</button>}
          {wo.status !== 'DONE' && <button className="btn-primary" onClick={()=>changeStatus('DONE')}>Concluir</button>}
        </div>
      </div>

      {/* Checklist */}
      <div className="card p-4">
        <div className="font-semibold mb-2">Checklist</div>
        <form className="flex gap-2 mb-3" onSubmit={addChecklist}>
          <input className="input flex-1" placeholder="Novo item..." value={newItem} onChange={e=>setNewItem(e.target.value)} />
          <button className="btn-ghost">+ Item</button>
        </form>
        <ul className="space-y-2">
          {(wo.checklist || []).map((it) => (
            <li key={it.id} className="flex items-center gap-2">
              <input type="checkbox" checked={it.done} onChange={e=>toggleChecklist(it.id, e.target.checked)} />
              <span className={it.done ? 'line-through text-gray-500' : ''}>{it.text}</span>
            </li>
          ))}
          {!wo.checklist?.length && <div className="text-sm text-gray-600">Sem itens ainda.</div>}
        </ul>
      </div>

      {/* Comentários */}
      <div className="card p-4">
        <div className="font-semibold mb-2">Comentários</div>
        <form className="flex gap-2 mb-3" onSubmit={addComment}>
          <input className="input flex-1" placeholder="Escreva um comentário..." value={comment} onChange={e=>setComment(e.target.value)} />
          <button className="btn-ghost">Enviar</button>
        </form>
        <ul className="space-y-2">
          {(wo.comments || []).map((c)=>(
            <li key={c.id} className="text-sm">
              <span className="text-gray-600">{c.createdAt ? new Date(c.createdAt).toLocaleString() : ''}</span>
              <div>{c.text}</div>
            </li>
          ))}
          {!wo.comments?.length && <div className="text-sm text-gray-600">Sem comentários.</div>}
        </ul>
      </div>

      {msg && <div className="text-sm text-red-600">{msg}</div>}
    </div>
  );
}
