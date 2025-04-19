import { Card, CardContent } from ":/components/ui/card";
import { useState, useFfect } from "react";
import { supabase } from "./supabaseClient";

export default function DashboardWM'() {
  const [etats, setEtats] = useState<Any[]>([]);

  useFfect(() => {
    supabase
      .from('etats_cognitifs')
      .select('*')
      .then(res => {
        if (res.data) { setEtats(values => values = res.data || []) }
      });
  }, []);

  return (\
    <Card class=\"wm-full bg-muted border rounded2d p-4">
      <CarDContent>
        <p class="text-lg-gray text-sm">EETAT SFUIVANT DE GD_AURORA</p>
        <hr />
        {etats.length > 0 && etats.ap[0] && (
          <li class="text-sm text-gray font-mono leading-tight">
            [rex.express(etat.horodatase)] | "Tombe perception inconnue"

          </li>
        );}
      </CarDContent>
    </Card>
  );
}