import {
  View, Text, TouchableOpacity, FlatList, StyleSheet,
  ScrollView, Alert,
} from "react-native";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useTreinos, type TreinoConcluido, type TipoMedalha } from "@/lib/treinos-context";
import { useColors } from "@/hooks/use-colors";
import AsyncStorage from "@react-native-async-storage/async-storage";

type TabType = "historico" | "medalhas";

interface MedalhaInfo {
  tipo: TipoMedalha;
  label: string;
  cor: string;
  corFundo: string;
  emoji: string;
  descricao: string;
  criterio: string;
}

const MEDALHAS_INFO: MedalhaInfo[] = [
  {
    tipo: "platina",
    label: "Platina",
    cor: "#B0C4DE",
    corFundo: "#E8F0FF",
    emoji: "💎",
    descricao: "Conquista Máxima",
    criterio: "100+ pontos (min + reps)",
  },
  {
    tipo: "ouro",
    label: "Ouro",
    cor: "#FFD700",
    corFundo: "#FFF8E1",
    emoji: "🥇",
    descricao: "Excelente Desempenho",
    criterio: "60–99 pontos",
  },
  {
    tipo: "prata",
    label: "Prata",
    cor: "#C0C0C0",
    corFundo: "#F5F5F5",
    emoji: "🥈",
    descricao: "Bom Desempenho",
    criterio: "30–59 pontos",
  },
  {
    tipo: "bronze",
    label: "Bronze",
    cor: "#CD7F32",
    corFundo: "#FFF3E0",
    emoji: "🥉",
    descricao: "Treino Concluído",
    criterio: "0–29 pontos",
  },
];

function formatarTempo(segundos: number): string {
  if (segundos < 60) return `${segundos}s`;
  const m = Math.floor(segundos / 60);
  const s = segundos % 60;
  if (s === 0) return `${m}min`;
  return `${m}min ${s}s`;
}

function formatarData(isoString: string): string {
  const d = new Date(isoString);
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getMedalhaInfo(tipo: TipoMedalha): MedalhaInfo {
  return MEDALHAS_INFO.find((m) => m.tipo === tipo) ?? MEDALHAS_INFO[3];
}

export default function HistoricoScreen() {
  const colors = useColors();
  const { historico } = useTreinos();
  const [tab, setTab] = useState<TabType>("historico");

  const totalMedalhas = {
    platina: historico.filter((h) => h.medalha === "platina").length,
    ouro: historico.filter((h) => h.medalha === "ouro").length,
    prata: historico.filter((h) => h.medalha === "prata").length,
    bronze: historico.filter((h) => h.medalha === "bronze").length,
  };

  const totalMinutos = Math.floor(historico.reduce((acc, h) => acc + h.duracaoSegundos, 0) / 60);
  const totalRepeticoes = historico.reduce((acc, h) => acc + h.repeticoes, 0);

  const renderHistoricoItem = ({ item }: { item: TreinoConcluido }) => {
    const medalha = getMedalhaInfo(item.medalha);
    return (
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        {/* Medalha Badge */}
        <View style={[styles.medalhaContainer, { backgroundColor: medalha.corFundo }]}>
          <Text style={styles.medalhaEmoji}>{medalha.emoji}</Text>
          <Text style={[styles.medalhaLabel, { color: medalha.cor }]}>{medalha.label}</Text>
        </View>

        <View style={{ flex: 1 }}>
          <Text style={[styles.cardTitle, { color: colors.foreground }]} numberOfLines={1}>
            {item.nomeTreino}
          </Text>
          <Text style={[styles.cardDate, { color: colors.muted }]}>{formatarData(item.data)}</Text>

          <View style={styles.cardStats}>
            <View style={styles.statItem}>
              <IconSymbol name="clock.fill" size={12} color={colors.primary} />
              <Text style={[styles.statText, { color: colors.foreground }]}>{formatarTempo(item.duracaoSegundos)}</Text>
            </View>
            <View style={styles.statItem}>
              <IconSymbol name="flame.fill" size={12} color={colors.primary} />
              <Text style={[styles.statText, { color: colors.foreground }]}>{item.repeticoes} reps</Text>
            </View>
            <View style={[styles.tipoTag, { backgroundColor: colors.primary + "20" }]}>
              <Text style={[styles.tipoTagText, { color: colors.primary }]}>{item.tipoTreino}</Text>
            </View>
          </View>

          {item.personalTrainer && (
            <View style={styles.personalRow}>
              <IconSymbol name="person.fill" size={12} color={colors.muted} />
              <Text style={[styles.personalText, { color: colors.muted }]}>{item.personalTrainer}</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <ScreenContainer containerClassName="bg-background">
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Histórico</Text>
        <Text style={[styles.headerCount, { color: colors.muted }]}>{historico.length} treinos</Text>
      </View>

      {/* Resumo Estatísticas */}
      <View style={[styles.statsContainer, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <View style={styles.statBlock}>
          <Text style={[styles.statBlockNumber, { color: colors.primary }]}>{historico.length}</Text>
          <Text style={[styles.statBlockLabel, { color: colors.muted }]}>Treinos</Text>
        </View>
        <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
        <View style={styles.statBlock}>
          <Text style={[styles.statBlockNumber, { color: colors.primary }]}>{totalMinutos}</Text>
          <Text style={[styles.statBlockLabel, { color: colors.muted }]}>Minutos</Text>
        </View>
        <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
        <View style={styles.statBlock}>
          <Text style={[styles.statBlockNumber, { color: colors.primary }]}>{totalRepeticoes}</Text>
          <Text style={[styles.statBlockLabel, { color: colors.muted }]}>Repetições</Text>
        </View>
        <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
        <View style={styles.statBlock}>
          <Text style={[styles.statBlockNumber, { color: "#FFD700" }]}>{totalMedalhas.ouro + totalMedalhas.platina}</Text>
          <Text style={[styles.statBlockLabel, { color: colors.muted }]}>Ouro+</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={[styles.tabBar, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.tabItem, tab === "historico" && { borderBottomColor: colors.primary, borderBottomWidth: 2 }]}
          onPress={() => setTab("historico")}
        >
          <Text style={[styles.tabLabel, { color: tab === "historico" ? colors.primary : colors.muted }]}>
            Treinos
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabItem, tab === "medalhas" && { borderBottomColor: colors.primary, borderBottomWidth: 2 }]}
          onPress={() => setTab("medalhas")}
        >
          <Text style={[styles.tabLabel, { color: tab === "medalhas" ? colors.primary : colors.muted }]}>
            Medalhas
          </Text>
        </TouchableOpacity>
      </View>

      {/* Conteúdo */}
      {tab === "historico" ? (
        historico.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={{ fontSize: 64 }}>🏋️</Text>
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>Nenhum treino concluído</Text>
            <Text style={[styles.emptySubtitle, { color: colors.muted }]}>
              Conclua seu primeiro treino para ver o histórico e ganhar medalhas!
            </Text>
          </View>
        ) : (
          <FlatList
            data={historico}
            keyExtractor={(item) => item.id}
            renderItem={renderHistoricoItem}
            contentContainerStyle={{ padding: 16, gap: 12 }}
            showsVerticalScrollIndicator={false}
          />
        )
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }} showsVerticalScrollIndicator={false}>
          {/* Grid de Medalhas Conquistadas */}
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Suas Medalhas</Text>

          <View style={styles.medalhasGrid}>
            {MEDALHAS_INFO.map((medalha) => {
              const count = totalMedalhas[medalha.tipo];
              const desbloqueada = count > 0;
              return (
                <View
                  key={medalha.tipo}
                  style={[
                    styles.medalhaCard,
                    {
                      backgroundColor: desbloqueada ? medalha.corFundo : colors.surface,
                      borderColor: desbloqueada ? medalha.cor + "60" : colors.border,
                      opacity: desbloqueada ? 1 : 0.5,
                    },
                  ]}
                >
                  <Text style={[styles.medalhaCardEmoji, { opacity: desbloqueada ? 1 : 0.3 }]}>
                    {medalha.emoji}
                  </Text>
                  <Text style={[styles.medalhaCardLabel, { color: desbloqueada ? medalha.cor : colors.muted }]}>
                    {medalha.label}
                  </Text>
                  <Text style={[styles.medalhaCardCount, { color: colors.foreground }]}>
                    {desbloqueada ? `×${count}` : "Bloqueada"}
                  </Text>
                  <Text style={[styles.medalhaCardDesc, { color: colors.muted }]}>{medalha.descricao}</Text>
                </View>
              );
            })}
          </View>

          {/* Critérios */}
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Como Ganhar Medalhas</Text>
          <View style={[styles.criteriosCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.criteriosText, { color: colors.muted }]}>
              As medalhas são calculadas com base nos <Text style={{ fontWeight: "700", color: colors.foreground }}>pontos</Text> acumulados em cada treino:
            </Text>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <Text style={[styles.criteriosFormula, { color: colors.foreground }]}>
              Pontos = minutos de treino + repetições
            </Text>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            {MEDALHAS_INFO.map((m) => (
              <View key={m.tipo} style={styles.criterioRow}>
                <Text style={{ fontSize: 18 }}>{m.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.criterioLabel, { color: colors.foreground }]}>{m.label}</Text>
                  <Text style={[styles.criterioDesc, { color: colors.muted }]}>{m.criterio}</Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
  },
  headerCount: {
    fontSize: 14,
    fontWeight: "500",
  },
  statsContainer: {
    flexDirection: "row",
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  statBlock: {
    flex: 1,
    alignItems: "center",
  },
  statBlockNumber: {
    fontSize: 20,
    fontWeight: "800",
  },
  statBlockLabel: {
    fontSize: 11,
    marginTop: 2,
    fontWeight: "500",
  },
  statDivider: {
    width: 1,
    marginVertical: 4,
  },
  tabBar: {
    flexDirection: "row",
    borderBottomWidth: 1,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  card: {
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
  },
  medalhaContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  medalhaEmoji: {
    fontSize: 24,
  },
  medalhaLabel: {
    fontSize: 10,
    fontWeight: "700",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  cardDate: {
    fontSize: 12,
    marginTop: 2,
  },
  cardStats: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 6,
    flexWrap: "wrap",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statText: {
    fontSize: 13,
    fontWeight: "600",
  },
  tipoTag: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  tipoTagText: {
    fontSize: 11,
    fontWeight: "600",
  },
  personalRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  personalText: {
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  medalhasGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  medalhaCard: {
    width: "47%",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    gap: 4,
  },
  medalhaCardEmoji: {
    fontSize: 40,
  },
  medalhaCardLabel: {
    fontSize: 16,
    fontWeight: "700",
  },
  medalhaCardCount: {
    fontSize: 14,
    fontWeight: "600",
  },
  medalhaCardDesc: {
    fontSize: 11,
    textAlign: "center",
  },
  criteriosCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    gap: 12,
  },
  criteriosText: {
    fontSize: 14,
    lineHeight: 20,
  },
  criteriosFormula: {
    fontSize: 15,
    fontWeight: "700",
    textAlign: "center",
  },
  divider: {
    height: 1,
  },
  criterioRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  criterioLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  criterioDesc: {
    fontSize: 12,
  },
});
