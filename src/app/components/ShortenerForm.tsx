"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toast, useSonner } from "sonner";
import { StatsDialog } from "@/app/components/StatsDialog";

type FormData = {
  url: string;
  expires: string;
};

export function ShortenerForm() {
  const { register, handleSubmit, control } = useForm<FormData>();
  const [result, setResult] = useState<{
    shortUrl: string;
    statsUrl: string;
    expires: Date;
  } | null>(null);
  const { toast } = useSonner();

  const onSubmit = async (data: FormData) => {
    try {
      const response = await axios.post("http://localhost:8000/api/shorten", {
        url: data.url,
        expires_at: data.expires,
      });

      setResult({
        shortUrl: response.data.short_url,
        statsUrl: response.data.stats_url,
        expires: new Date(response.data.expires_at),
      });

      toast({
        title: "URL encurtada com sucesso!",
        description: "Link copiado para a área de transferência",
      });

      navigator.clipboard.writeText(response.data.short_url);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: axios.isAxiosError(error)
          ? error.response?.data.error
          : "Falha ao encurtar URL",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold">Novo link</h2>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url">URL original</Label>
            <Input
              {...register("url", { required: true })}
              id="url"
              placeholder="https://exemplo.com/url-longa"
              type="url"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Expira em</Label>
            <Select {...register("expires")} defaultValue="168h">
              <SelectTrigger>
                <SelectValue placeholder="Selecione a duração" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">1 Hora</SelectItem>
                <SelectItem value="24h">1 Dia</SelectItem>
                <SelectItem value="168h">1 Semana</SelectItem>
                <SelectItem value="720h">30 Dias</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full">
            Encurtar URL
          </Button>
        </form>

        {result && (
          <div className="mt-6 space-y-4">
            <div className="p-4 rounded-lg bg-muted">
              <p className="text-sm font-medium break-all">{result.shortUrl}</p>
              <p className="text-sm text-muted-foreground">
                Expira em: {new Date(result.expires).toLocaleDateString()}
              </p>
            </div>

            <StatsDialog statsUrl={result.statsUrl} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
