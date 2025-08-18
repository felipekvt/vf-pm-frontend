// app/layout.tsx
import "./globals.css";
import Link from "next/link";
import HeaderBar from "../components/HeaderBar";

export const metadata = {
  title: "VF PM - Gestão de Manutenção",
  description: "Sistema de gestão de manutenção",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <div className="min-h-screen grid grid-cols-[260px_1fr]">
          {/* Sidebar */}
          <aside className="bg-white border-r border-gray-200 p-4 flex flex-col">
            <div className="mb-8 flex items-center gap-2">
              <div className="h-10 w-10 grid place-items-center rounded-xl bg-blue-600 text-white font-bold">
                V
              </div>
              <div className="font-semibold text-gray-900">VF PM</div>
            </div>

            <nav className="flex-1 space-y-1 text-sm">
              <NavItem href="/">📊 Dashboard</NavItem>
              <NavItem href="/assets">🏭 Ativos</NavItem>
              <NavItem href="/workorders">🛠 Ordens de Serviço</NavItem>
              <NavItem href="/plans">📅 Planos</NavItem>
              <NavItem href="/routes">🔍 Rotas de inspeção</NavItem>
              <NavItem href="/inventory">📦 Estoque</NavItem>
              <NavItem href="/reports">📑 Relatórios</NavItem>
            </nav>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <NavItem href="/admin">⚙️ Admin</NavItem>
            </div>
          </aside>

          {/* Conteúdo */}
          <div className="flex flex-col min-h-screen">
            <HeaderBar /> {/* componente client */}
            <main className="container-page flex-1">{children}</main>
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
      className="flex items-center gap-2 rounded-xl px-3 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition"
    >
      {children}
    </Link>
  );
}
