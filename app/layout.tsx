import "./globals.css";
import Link from "next/link";
import HeaderBar from "./components/HeaderBar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <div className="min-h-screen grid grid-cols-[260px_1fr]">
          {/* Sidebar (server ok, sem onClick) */}
          <aside className="bg-white border-r border-gray-200 p-4 sticky top-0 h-screen">
            <div className="mb-6 flex items-center gap-2">
              <div className="h-9 w-9 grid place-items-center rounded-xl bg-gray-900 text-white font-bold">V</div>
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
              <div className="mt-6 pt-6 border-t border-gray-200">
                <NavItem href="/admin">Admin</NavItem>
              </div>
            </nav>
          </aside>

          {/* Conteúdo */}
          <div className="min-h-screen flex flex-col">
            <HeaderBar />  {/* componente client com onClick */}
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
      className="flex items-center gap-2 rounded-xl px-3 py-2 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
    >
      {children}
    </Link>
  );
}
