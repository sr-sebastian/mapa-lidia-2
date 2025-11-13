import { 
  Switch, 
  Route, 
  Router as WouterRouter // <-- 1. Importa el Router principal (y lo renombra)
} from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import CurriculumMap from "@/pages/curriculum-map";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    // --- INICIO DEL CAMBIO ---
    // 2. Envuelve tu Switch con el Router, pasándole el basename
    <WouterRouter base="/mapa-lidia-2/">
      <Switch>
        <Route path="/" component={CurriculumMap} />
        <Route component={NotFound} />
      </Switch>
    </WouterRouter>
    // --- FIN DEL CAMBIO ---
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
