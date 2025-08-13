"use client";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const api = process.env.NEXT_PUBLIC_API_BASE!;
  const [assets, setAssets] = useState<any[]>([]);
  const [wos, setWos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const token = () => localStorage.getItem("vfpm_token") || "";
  const headers = () => ({ Authorization: `Bearer ${token()}` });

  useEffect(() => {
    if (!token()) return (window.location.href = "/");
    Promise.all([
      fetch(`${api}/api/assets`, { headers: headers() }).then((r) => r.json()),
      fetch(`${api}/api/workorders`, { headers: headers() }).then((r) => r.json()),
    ])
      .then(([A, W]) => {
        setAssets(A);
        setWos(W);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-brand-600">Saúde dos ativos, backlog e atividades recentes.</p>
        </div>
        <div className="flex gap-2">
          <a href="/workorders" className="btn-primary">+ Nova OS</a>
          <a href="/assets" className="btn-ghost">+ Ativo</a>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Kpi title="Ativos" value={assets.length} />
        <Kpi title="OS abertas" value={wos.filter((w:any)=>w.status!=="DONE").length} />
        <Kpi title="OS concluídas (7d)" value={wos.filter((w:any)=>w.status==="DONE").length} />
        <Kpi title="Backlog (semanas)" value={Math.max(1, Math.ceil(wos.length/10))} />
      </div>

      {/* Listas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Ativos recentes</h3>
            <a className="text-sm text-accent hover:underline" href="/assets">ver todos</a>
          </div>
          {loading ? <SkeletonList /> : <TableAssets assets={assets} />}
        </div>
        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Ordens de Serviço</h3>
            <a className="text-sm text-accent hover:underline" href="/workorders">ver todas</a>
          </div>
          {loading ? <SkeletonList /> : <TableWOs wos={wos} />}
        </div>
      </div>
    </div>
  );
}

function Kpi({ title, value }: { title: string; value: number | string }) {
  return (
    <div className="card p-4">
      <div className="text-sm text-brand-600">{title}</div>
      <div className="mt-2 text-2xl font-bold">{value}</div>
    </div>
  );
}

function SkeletonList() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-10 bg-brand-100 rounded-xl animate-pulse" />
      ))}
    </div>
  );
}

function TableAssets({ assets }: { assets: any[] }) {
  if (!assets.length) return <EmptyState text="Nenhum ativo cadastrado" ctaHref="/assets" cta="Cadastrar ativo" />;
  return (
    <div className="overflow-hidden rounded-2xl border border-brand-200">
      <table className="w-full text-sm">
        <thead className="bg-brand-50 text-brand-700">
          <tr>
            <Th>Nome</Th><Th>Local</Th><Th>Data</Th>
          </tr>
        </thead>
        <tbody>
          {assets.slice(0, 8).map((a) => (
            <tr key={a.id} className="border-t border-brand-200 hover:bg-brand-50/60">
              <Td className="font-medium">{a.name}</Td>
              <Td>{a.location ?? "-"}</Td>
              <Td>{new Date(a.createdAt).toLocaleDateString()}</Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TableWOs({ wos }: { wos: any[] }) {
  if (!wos.length) return <EmptyState text="Nenhuma OS" ctaHref="/workorders" cta="Abrir OS" />;
  const badge = (s: string) =>
    s === "DONE" ? "border-success text-success" :
    s === "IN_PROGRESS" ? "border-warn text-warn" : "border-brand-400 text-brand-700";
  return (
    <div className="overflow-hidden rounded-2xl border border-brand-200">
      <table className="w-full text-sm">
        <thead className="bg-brand-50 text-brand-700">
          <tr>
            <Th>Título</Th><Th>Ativo</Th><Th>Status</Th>
          </tr>
        </thead>
        <tbody>
          {wos.slice(0, 8).map((w) => (
            <tr key={w.id} className="border-t border-brand-200 hover:bg-brand-50/60">
              <Td className="font-medium">{w.title}</Td>
              <Td>{w.asset?.name ?? "-"}</Td>
              <Td><span className={`badge ${badge(w.status)}`}>{w.status}</span></Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Th({ children }: any) { return <th className="text-left font-medium px-3 py-2">{children}</th>; }
function Td({ children, className="" }: any) { return <td className={`px-3 py-2 ${className}`}>{children}</td>; }

function EmptyState({ text, cta, ctaHref }: { text: string; cta: string; ctaHref: string }) {
  return (
    <div className="p-6 text-center">
      <div className="text-brand-600 mb-2">{text}</div>
      <a href={ctaHref} className="btn-primary">{cta}</a>
    </div>
  );
}
