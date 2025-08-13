'use client';

export default function HeaderBar() {
  return (
    <div className="h-[64px] bg-white border-b border-gray-200 flex items-center px-6 justify-between">
      <div className="font-semibold">Manutenção</div>
      <div className="flex items-center gap-2">
        <a className="btn-ghost" href="/help">Ajuda</a>
        <button
          className="btn-ghost"
          onClick={() => {
            localStorage.removeItem('vfpm_token');
            window.location.href = '/';
          }}
        >
          Sair
        </button>
      </div>
    </div>
  );
}
