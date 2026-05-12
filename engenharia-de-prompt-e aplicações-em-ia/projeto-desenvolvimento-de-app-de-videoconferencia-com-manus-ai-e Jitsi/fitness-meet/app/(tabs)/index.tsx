import { ScrollView, Text, View, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useTreinos } from "@/lib/treinos-context";
import { useColors } from "@/hooks/use-colors";
import type { TipoMedalha } from "@/lib/treinos-context";

function formatarData(isoString: string, hora: string): string {
  const data = new Date(isoString);
  const hoje = new Date();
  const amanha = new Date(hoje);
  amanha.setDate(hoje.getDate() + 1);

  const isHoje = data.toDateString() === hoje.toDateString();
  const isAmanha = data.toDateString() === amanha.toDateString();

  if (isHoje) return `Hoje às ${hora}`;
  if (isAmanha) return `Amanhã às ${hora}`;

  return `${data.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })} às ${hora}`;
}

function corMedalha(medalha: TipoMedalha): string {
  switch (medalha) {
    case "platina": return "#E5E4E2";
    case "ouro": return "#FFD700";
    case "prata": return "#C0C0C0";
    case "bronze": return "#CD7F32";
  }
}

export default function HomeScreen() {
  const router = useRouter();
  const colors = useColors();
  const { agendamentos, historico, proximoAgendamento } = useTreinos();

  const totalConcluidos = historico.length;
  const totalAgendados = agendamentos.filter((a) => a.status === "agendado").length;
  const medalhasOuro = historico.filter((h) => h.medalha === "ouro" || h.medalha === "platina").length;

  const proximosAgendamentos = agendamentos
    .filter((a) => a.status === "agendado")
    .sort((a, b) => {
      const da = new Date(`${a.data.split("T")[0]}T${a.hora}`);
      const db = new Date(`${b.data.split("T")[0]}T${b.hora}`);
      return da.getTime() - db.getTime();
    })
    .slice(0, 3);

  return (
    <ScreenContainer containerClassName="bg-background">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.primary }]}>
          <View>
            <Text style={styles.headerGreeting}>Olá, Atleta! 💪</Text>
            <Text style={styles.headerSubtitle}>Pronto para treinar hoje?</Text>
          </View>
          <View style={[styles.avatarCircle, { backgroundColor: "rgba(255,255,255,0.25)" }]}>
            <IconSymbol name="dumbbell.fill" size={28} color="#fff" />
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.statNumber, { color: colors.primary }]}>{totalConcluidos}</Text>
            <Text style={[styles.statLabel, { color: colors.muted }]}>Treinos</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.statNumber, { color: colors.primary }]}>{totalAgendados}</Text>
            <Text style={[styles.statLabel, { color: colors.muted }]}>Agendados</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.statNumber, { color: "#FFD700" }]}>{medalhasOuro}</Text>
            <Text style={[styles.statLabel, { color: colors.muted }]}>Medalhas</Text>
          </View>
        </View>

        {/* Próximo Treino */}
        {proximoAgendamento ? (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Próximo Treino</Text>
            <View style={[styles.nextCard, { backgroundColor: colors.primary }]}>
              <View style={styles.nextCardContent}>
                <View style={[styles.nextCardIcon, { backgroundColor: "rgba(255,255,255,0.2)" }]}>
                  <IconSymbol name="dumbbell.fill" size={24} color="#fff" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.nextCardTitle}>{proximoAgendamento.nomeTreino}</Text>
                  <Text style={styles.nextCardSub}>
                    {formatarData(proximoAgendamento.data, proximoAgendamento.hora)}
                  </Text>
                  <Text style={styles.nextCardPersonal}>
                    👤 {proximoAgendamento.personalTrainer || "Personal Trainer"}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.startButton}
                onPress={() => router.push({ pathname: "/(tabs)/video", params: { agendamentoId: proximoAgendamento.id, sala: proximoAgendamento.salaJitsi } })}
              >
                <IconSymbol name="play.fill" size={18} color={colors.primary} />
                <Text style={[styles.startButtonText, { color: colors.primary }]}>Iniciar Treino</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Próximo Treino</Text>
            <View style={[styles.emptyCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <IconSymbol name="calendar.badge.plus" size={40} color={colors.muted} />
              <Text style={[styles.emptyText, { color: colors.muted }]}>Nenhum treino agendado</Text>
              <TouchableOpacity
                style={[styles.scheduleBtn, { backgroundColor: colors.primary }]}
                onPress={() => router.push("/(tabs)/agendamento")}
              >
                <Text style={styles.scheduleBtnText}>Agendar Treino</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Botão Treino Rápido */}
        <View style={styles.section}>
          <TouchableOpacity
            style={[styles.quickStartBtn, { backgroundColor: colors.foreground }]}
            onPress={() => router.push("/(tabs)/video")}
          >
            <IconSymbol name="video.fill" size={22} color={colors.background} />
            <Text style={[styles.quickStartText, { color: colors.background }]}>Iniciar Treino Rápido</Text>
          </TouchableOpacity>
        </View>

        {/* Próximos Agendamentos */}
        {proximosAgendamentos.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Próximos Agendamentos</Text>
              <TouchableOpacity onPress={() => router.push("/(tabs)/agendamento")}>
                <Text style={[styles.seeAll, { color: colors.primary }]}>Ver todos</Text>
              </TouchableOpacity>
            </View>
            {proximosAgendamentos.map((ag) => (
              <View key={ag.id} style={[styles.agCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <View style={[styles.agCardDot, { backgroundColor: colors.primary }]} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.agCardTitle, { color: colors.foreground }]}>{ag.nomeTreino}</Text>
                  <Text style={[styles.agCardSub, { color: colors.muted }]}>
                    {formatarData(ag.data, ag.hora)} · {ag.tipoTreino}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => router.push({ pathname: "/(tabs)/video", params: { agendamentoId: ag.id, sala: ag.salaJitsi } })}
                >
                  <IconSymbol name="play.fill" size={20} color={colors.primary} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Últimas Medalhas */}
        {historico.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Conquistas Recentes</Text>
              <TouchableOpacity onPress={() => router.push("/(tabs)/historico")}>
                <Text style={[styles.seeAll, { color: colors.primary }]}>Ver histórico</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -20 }} contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}>
              {historico.slice(0, 5).map((h) => (
                <View key={h.id} style={[styles.medalCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                  <View style={[styles.medalCircle, { backgroundColor: corMedalha(h.medalha) }]}>
                    <IconSymbol name="medal.fill" size={20} color="#fff" />
                  </View>
                  <Text style={[styles.medalCardTitle, { color: colors.foreground }]} numberOfLines={1}>{h.nomeTreino}</Text>
                  <Text style={[styles.medalCardSub, { color: colors.muted }]}>{h.medalha.charAt(0).toUpperCase() + h.medalha.slice(1)}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 24,
    paddingTop: 16,
  },
  headerGreeting: {
    fontSize: 26,
    fontWeight: "800",
    color: "#fff",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.85)",
    marginTop: 2,
  },
  avatarCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  statsRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 12,
    marginTop: 16,
  },
  statCard: {
    flex: 1,
    borderRadius: 14,
    padding: 14,
    alignItems: "center",
    borderWidth: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "800",
  },
  statLabel: {
    fontSize: 11,
    marginTop: 2,
    fontWeight: "500",
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  seeAll: {
    fontSize: 14,
    fontWeight: "600",
  },
  nextCard: {
    borderRadius: 18,
    padding: 18,
  },
  nextCardContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 14,
  },
  nextCardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  nextCardTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#fff",
  },
  nextCardSub: {
    fontSize: 13,
    color: "rgba(255,255,255,0.85)",
    marginTop: 2,
  },
  nextCardPersonal: {
    fontSize: 12,
    color: "rgba(255,255,255,0.75)",
    marginTop: 4,
  },
  startButton: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  startButtonText: {
    fontWeight: "700",
    fontSize: 15,
  },
  emptyCard: {
    borderRadius: 18,
    padding: 28,
    alignItems: "center",
    borderWidth: 1,
    borderStyle: "dashed",
    gap: 10,
  },
  emptyText: {
    fontSize: 15,
    fontWeight: "500",
  },
  scheduleBtn: {
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 24,
    marginTop: 4,
  },
  scheduleBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
  quickStartBtn: {
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  quickStartText: {
    fontSize: 16,
    fontWeight: "700",
  },
  agCard: {
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    marginBottom: 8,
    gap: 12,
  },
  agCardDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  agCardTitle: {
    fontSize: 15,
    fontWeight: "600",
  },
  agCardSub: {
    fontSize: 12,
    marginTop: 2,
  },
  medalCard: {
    borderRadius: 14,
    padding: 14,
    alignItems: "center",
    width: 100,
    borderWidth: 1,
    gap: 6,
  },
  medalCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  medalCardTitle: {
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
  medalCardSub: {
    fontSize: 11,
  },
});
