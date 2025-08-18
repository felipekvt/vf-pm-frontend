'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AssetsPage() {
  const api = process.env.NEXT_PUBLIC_API_BASE!;
  const router = useRouter();

  const [assets, setAssets] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [assetLocation, setAssetLocation] = useState('');
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const token = () =>
    typeof window !== 'undefined' ? localStorage.getItem('vfpm_token') || '' : '';
  const headers = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token()}`,
  });

  async function load() {
    const A = await fetch(`${api}/api/assets`, { headers: headers() }).then((r) => r.json());
    setAssets(A);
  }

  useEffect(() => {
    if (!token()) {
      window.location.href = '/';
      return;
    }
    load().finally(() => setLoading(false));
  }, []);

  async function createAsset(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);

    // regras de UX no front (rápidas)
    if (!name || name.trim().length < 3) {
      setMsg('Informe um nome com pelo menos 3 caracteres.');
      return;
    }
    if (name.trim().length > 60) {
      setMsg('Nome muito longo (máx. 60 caracteres).');
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch(`${api}/api/assets`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({ name: name.trim(), location: assetLocation.trim() || null }),
      });

      if (!res.ok) {
        const err = await safeJson(res);
        throw new Error(err?.message || 'Erro ao criar ativo');
      }

      const created = await res.json(); // precisa retornar { id, ... }
      setName('');
      setAssetLocation('');

      // ✅ redireciona para a página de detalhe do ativo
      router.push(`/assets/${created.id}`);
    } catch (err: any) {
      setMsg(err.message || 'Erro ao criar ativo');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold">Ativos</h1>
          <p className="text-sm text-gray-600">Cadastre e gerencie seus ativos.</p>
        </div>
      </div>

      {/* Formulário nova cadastro */}
      <div className="card p-4">
        <form className="flex flex-col md:flex-row gap-2" onSubmit={createAsset}>
          <input
            className="input max-w-xs"
            placeholder="Nome do ativo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={60}
          />
          <input
            className="input max-w-xs"
            placeholder="Local (opcional)"
            value={assetLocation}
            onChange={(e) => setAssetLocation(e.target.value)}
            maxLength={80}
          />
          <button className="btn-primary" disabled={submitting}>
            {submitting ? 'Criando...' : '+ Cadastrar'}
          </button>
        </form>
        {msg && <div className="text-sm text-red-600 mt-2">{msg}</div>}
      </div>

      {/* Lista */}
      <div className="card p-4">
        {loading ? (
          <SkeletonList />
        ) : assets.length ? (
          <div className="overflow-hidden rounded-2xl border border-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-700">
                <tr>
                  <Th>Nome</Th>
                  <Th>Local</Th>
                  <Th>Criado em</Th>
                </tr>
              </thead>
              <tbody>
                {assets.map((a: any) => (
                  <tr key={a.id} className="border-t border-gray-200 hover:bg-gray-50/60">
                    <Td className="font-medium">
                      <Link href={`/assets/${a.id}`} className="hover:underline">
                        {a.name}
                      </Link>
                    </Td>
                    <Td>{a.location ?? '-'}</Td>
                    <Td>{a.createdAt ? new Date(a.createdAt).toLocaleDateString() : '-'}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState text="Nenhum ativo cadastrado ainda" />
        )}
      </div>
    </div>
  );
}

function Th({ children }: any) {
  return <th className="text-left font-medium px-3 py-2">{children}</th>;
}
function Td({ children, className = '' }: any) {
  return <td className={`px-3 py-2 ${className}`}>{children}</td>;
}
function SkeletonList() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-10 bg-gray-100 rounded-xl animate-pulse" />
      ))}
    </div>
  );
}
function EmptyState({ text }: { text: string }) {
  return <div className="p-6 text-center text-gray-600">{text}</div>;
}

async function safeJson(res: Response) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}
