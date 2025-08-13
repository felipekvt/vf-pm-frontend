import "./globals.css";
import Link from "next/link";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <div className="min-h-screen grid grid-cols-[260px_1fr]">
          {/* Sidebar */}
          <aside className="bg-white border-r border-brand-200 p-4 sticky top-0 h-screen">
            <div className="mb-6 flex items-center gap-2">
              <div className="h-9 w-9 grid place-items-center rounded-xl bg-brand-900 text-white font-bold">V</div>
              <div className="font-semibold">VF PM</div>
            </div>
            <nav className="space-y-1 text-sm">
              <NavItem href="/">Dashboard</NavItem>
              <NavItem href="/assets">Ativos</NavItem>
              <NavItem href="/workorders">Ordens de Serviço</NavItem>
              <NavItem href="/plans">Planos</NavItem>
              <NavItem href="/routes">Rotas de inspeção</NavItem>
              <NavItem href="/inventory">Estoque</NavItem>
              <NavItem href="/reports">Relatórios</NavItem>
              <div className="mt-6 pt-6 border-t border-brand-200">
                <NavItem href="/admin">Admin</NavItem>
              </div>
            </nav>
          </aside>

          {/* Conteúdo */}
          <div className="min-h-screen flex flex-col">
            <header className="h-[64px] bg-white border-b border-brand-200 flex items-center px-6 justify-between">
              <div className="font-semibold">Manutenção</div>
              <div className="flex items-center gap-2">
                <button className="btn-ghost">Ajuda</button>
                <button
                  className="btn-ghost"
                  onClick={() => {
                    localStorage.removeItem("vfpm_token");
                    window.location.href = "/";
                  }}
                >
                  Sair
                </button>
              </div>
            </header>
            <main className="container-page">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}

function NavItem({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 rounded-xl px-3 py-2 text-brand-700 hover:bg-brand-50 hover:text-brand-900"
    >
      {children}
    </Link>
  );
}
