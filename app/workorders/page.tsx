// app/workorders/page.tsx
"use client";

import { useState } from "react";

interface WorkOrder {
  id: string;
  title: string;
  status: "Aberta" | "Em andamento" | "Concluída";
  priority: "Baixa" | "Média" | "Alta";
  equipment: string;
  createdAt: string;
}

export default function WorkOrdersPage() {
  const [orders, setOrders] = useState<WorkOrder[]>([
    {
      id: "WO-001",
      title: "Troca de rolamento",
      status: "Aberta",
      priority: "Alta",
      equipment: "Bomba de água #3",
      createdAt: "2025-08-10",
    },
    {
      id: "WO-002",
      title: "Lubrificação de motor",
      status: "Em andamento",
      priority: "Média",
      equipment: "Esteira principal",
      createdAt: "2025-08-12",
    },
  ]);

  const [newOrder, setNewOrder] = useState({
    title: "",
    equipment: "",
    priority: "Média",
  });

  const handleCreateOrder = () => {
    if (!newOrder.title || !newOrder.equipment) return;
    const order: WorkOrder = {
      id: `WO-${orders.length + 1}`.padStart(6, "0"),
      title: newOrder.title,
      status: "Aberta",
      priority: newOrder.priority as WorkOrder["priority"],
      equipment: newOrder.equipment,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setOrders([...orders, order]);
    setNewOrder({ title: "", equipment: "", priority: "Média" });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Ordens de Serviço</h1>

      {/* Formulário de criação */}
      <div className="card p-4 space-y-3">
        <h2 className="text-lg font-semibold">Nova Ordem</h2>
        <input
          type="text"
          placeholder="Título"
          value={newOrder.title}
          onChange={(e) => setNewOrder({ ...newOrder, title: e.target.value })}
          className="input"
        />
        <input
          type="text"
          placeholder="Equipamento"
          value={newOrder.equipment}
          onChange={(e) =>
            setNewOrder({ ...newOrder, equipment: e.target.value })
          }
          className="input"
        />
        <select
          value={newOrder.priority}
          onChange={(e) =>
            setNewOrder({ ...newOrder, priority: e.target.value })
          }
          className="input"
        >
          <option>Baixa</option>
          <option>Média</option>
          <option>Alta</option>
        </select>
        <button onClick={handleCreateOrder} className="btn-primary">
          Criar Ordem
        </button>
      </div>

      {/* Lista de OS */}
      <div className="card p-4">
        <h2 className="text-lg font-semibold mb-4">Lista de Ordens</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="py-2">ID</th>
              <th>Título</th>
              <th>Equipamento</th>
              <th>Prioridade</th>
              <th>Status</th>
              <th>Criada em</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b hover:bg-gray-50">
                <td className="py-2">{order.id}</td>
                <td>{order.title}</td>
                <td>{order.equipment}</td>
                <td>
                  <span
                    className={`badge ${
                      order.priority === "Alta"
                        ? "bg-red-100 border-red-400 text-red-600"
                        : order.priority === "Média"
                        ? "bg-yellow-100 border-yellow-400 text-yellow-600"
                        : "bg-green-100 border-green-400 text-green-600"
                    }`}
                  >
                    {order.priority}
                  </span>
                </td>
                <td>{order.status}</td>
                <td>{order.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
