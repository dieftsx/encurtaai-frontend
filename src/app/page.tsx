import { ShortenerForm } from "@/app/components/ShortenerForm";
//import { StatsDialog } from "@/components/stats-dialog";
//import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
//import { useToast } from "@/components/ui/use-toast";

export default function Home() {
  return (
    <main className="min-h-screen p-8 md:p-24">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          URL Shortener Pro
        </h1>

        <ShortenerForm />

        <footer className="mt-16 text-center text-sm text-muted-foreground">
          <p>Links expiram automaticamente após 7 dias</p>
          <p>Limite de 10 requisições por minuto</p>
        </footer>

        <Toaster position="top-center" richColors />
      </div>
    </main>
  );
}
