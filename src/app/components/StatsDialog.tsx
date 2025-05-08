"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export function StatsDialog({ statsUrl }: { statsUrl: string }) {
  const [open, setOpen] = useState(false);
  const [stats, setStats] = useState<{
    total_clicks: number;
    last_accessed: string;
    daily_clicks: Record<string, number>;
  } | null>(null);

  useEffect(() => {
    if (open && !stats) {
      axios.get(statsUrl).then((response) => {
        setStats({
          total_clicks: response.data.total_clicks,
          last_accessed: response.data.last_accessed,
          daily_clicks: response.data.daily_clicks,
        });
      });
    }
  }, [open]);

  const chartData = stats
    ? Object.entries(stats.daily_clicks).map(([date, count]) => ({
        date,
        count,
      }))
    : [];

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Ver Estatísticas
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Estatísticas de Acesso</DialogTitle>
          </DialogHeader>

          {stats && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-muted">
                  <p className="text-sm">Total de Cliques</p>
                  <p className="text-2xl font-bold">{stats.total_clicks}</p>
                </div>
                <div className="p-4 rounded-lg bg-muted">
                  <p className="text-sm">Último Acesso</p>
                  <p className="text-2xl font-bold">
                    {new Date(stats.last_accessed).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="#2563eb"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead className="text-right">Acessos</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {chartData.map(({ date, count }) => (
                    <TableRow key={date}>
                      <TableCell>{date}</TableCell>
                      <TableCell className="text-right">{count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
