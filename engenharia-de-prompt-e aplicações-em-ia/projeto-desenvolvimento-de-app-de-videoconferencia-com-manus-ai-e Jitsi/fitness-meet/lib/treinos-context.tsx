import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type TipoTreino = "Musculação" | "Cardio" | "Funcional" | "Yoga" | "HIIT" | "Pilates" | "Outro";

export type TipoMedalha = "bronze" | "prata" | "ouro" | "platina";

export interface Agendamento {
  id: string;
  nomeTreino: string;
  data: string; // ISO string
  hora: string; // HH:MM
  personalTrainer: string;
  tipoTreino: TipoTreino;
  salaJitsi: string;
  status: "agendado" | "em_andamento" | "concluido";
}

export interface TreinoConcluido {
  id: string;
  agendamentoId?: string;
  nomeTreino: string;
  data: string; // ISO string
  duracaoSegundos: number;
  repeticoes: number;
  tipoTreino: TipoTreino;
  personalTrainer: string;
  medalha: TipoMedalha;
}

function calcularMedalha(duracaoSegundos: number, repeticoes: number): TipoMedalha {
  const pontos = Math.floor(duracaoSegundos / 60) + repeticoes;
  if (pontos >= 100) return "platina";
  if (pontos >= 60) return "ouro";
  if (pontos >= 30) return "prata";
  return "bronze";
}

interface TreinosContextType {
  agendamentos: Agendamento[];
  historico: TreinoConcluido[];
  adicionarAgendamento: (ag: Omit<Agendamento, "id" | "status">) => void;
  removerAgendamento: (id: string) => void;
  iniciarTreino: (id: string) => void;
  concluirTreino: (agendamentoId: string, duracaoSegundos: number, repeticoes: number) => TreinoConcluido;
  concluirTreinoRapido: (dados: { nomeTreino: string; tipoTreino: TipoTreino; personalTrainer: string; salaJitsi: string; duracaoSegundos: number; repeticoes: number }) => TreinoConcluido;
  proximoAgendamento: Agendamento | null;
}

const TreinosContext = createContext<TreinosContextType | null>(null);

const STORAGE_AGENDAMENTOS = "@fitmeet:agendamentos";
const STORAGE_HISTORICO = "@fitmeet:historico";

export function TreinosProvider({ children }: { children: React.ReactNode }) {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [historico, setHistorico] = useState<TreinoConcluido[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const [ags, hist] = await Promise.all([
          AsyncStorage.getItem(STORAGE_AGENDAMENTOS),
          AsyncStorage.getItem(STORAGE_HISTORICO),
        ]);
        if (ags) setAgendamentos(JSON.parse(ags));
        if (hist) setHistorico(JSON.parse(hist));
      } catch (e) {
        console.error("Erro ao carregar dados:", e);
      }
    })();
  }, []);

  const salvarAgendamentos = useCallback(async (lista: Agendamento[]) => {
    setAgendamentos(lista);
    await AsyncStorage.setItem(STORAGE_AGENDAMENTOS, JSON.stringify(lista));
  }, []);

  const salvarHistorico = useCallback(async (lista: TreinoConcluido[]) => {
    setHistorico(lista);
    await AsyncStorage.setItem(STORAGE_HISTORICO, JSON.stringify(lista));
  }, []);

  const adicionarAgendamento = useCallback((ag: Omit<Agendamento, "id" | "status">) => {
    const novo: Agendamento = {
      ...ag,
      id: Date.now().toString(),
      status: "agendado",
    };
    salvarAgendamentos([...agendamentos, novo]);
  }, [agendamentos, salvarAgendamentos]);

  const removerAgendamento = useCallback((id: string) => {
    salvarAgendamentos(agendamentos.filter((a) => a.id !== id));
  }, [agendamentos, salvarAgendamentos]);

  const iniciarTreino = useCallback((id: string) => {
    const updated = agendamentos.map((a) =>
      a.id === id ? { ...a, status: "em_andamento" as const } : a
    );
    salvarAgendamentos(updated);
  }, [agendamentos, salvarAgendamentos]);

  const concluirTreino = useCallback((agendamentoId: string, duracaoSegundos: number, repeticoes: number): TreinoConcluido => {
    const ag = agendamentos.find((a) => a.id === agendamentoId);
    const medalha = calcularMedalha(duracaoSegundos, repeticoes);
    const concluido: TreinoConcluido = {
      id: Date.now().toString(),
      agendamentoId,
      nomeTreino: ag?.nomeTreino ?? "Treino",
      data: new Date().toISOString(),
      duracaoSegundos,
      repeticoes,
      tipoTreino: ag?.tipoTreino ?? "Outro",
      personalTrainer: ag?.personalTrainer ?? "",
      medalha,
    };
    const updatedAgs = agendamentos.map((a) =>
      a.id === agendamentoId ? { ...a, status: "concluido" as const } : a
    );
    salvarAgendamentos(updatedAgs);
    salvarHistorico([concluido, ...historico]);
    return concluido;
  }, [agendamentos, historico, salvarAgendamentos, salvarHistorico]);

  const concluirTreinoRapido = useCallback((dados: { nomeTreino: string; tipoTreino: TipoTreino; personalTrainer: string; salaJitsi: string; duracaoSegundos: number; repeticoes: number }): TreinoConcluido => {
    const medalha = calcularMedalha(dados.duracaoSegundos, dados.repeticoes);
    const concluido: TreinoConcluido = {
      id: Date.now().toString(),
      nomeTreino: dados.nomeTreino,
      data: new Date().toISOString(),
      duracaoSegundos: dados.duracaoSegundos,
      repeticoes: dados.repeticoes,
      tipoTreino: dados.tipoTreino,
      personalTrainer: dados.personalTrainer,
      medalha,
    };
    salvarHistorico([concluido, ...historico]);
    return concluido;
  }, [historico, salvarHistorico]);

  const proximoAgendamento = agendamentos
    .filter((a) => a.status === "agendado")
    .sort((a, b) => {
      const da = new Date(`${a.data.split("T")[0]}T${a.hora}`);
      const db = new Date(`${b.data.split("T")[0]}T${b.hora}`);
      return da.getTime() - db.getTime();
    })[0] ?? null;

  return (
    <TreinosContext.Provider
      value={{
        agendamentos,
        historico,
        adicionarAgendamento,
        removerAgendamento,
        iniciarTreino,
        concluirTreino,
        concluirTreinoRapido,
        proximoAgendamento,
      }}
    >
      {children}
    </TreinosContext.Provider>
  );
}

export function useTreinos() {
  const ctx = useContext(TreinosContext);
  if (!ctx) throw new Error("useTreinos deve ser usado dentro de TreinosProvider");
  return ctx;
}
