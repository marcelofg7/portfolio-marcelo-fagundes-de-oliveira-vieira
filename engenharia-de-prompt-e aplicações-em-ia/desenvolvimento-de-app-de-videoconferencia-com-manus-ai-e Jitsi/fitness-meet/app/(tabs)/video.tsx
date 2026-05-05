import {
  View, Text, TouchableOpacity, StyleSheet, Modal,
  TextInput, ScrollView, Alert, Platform, StatusBar,
} from "react-native";
import { useState, useEffect, useRef, useCallback } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { WebView } from "react-native-webview";
import { useKeepAwake } from "expo-keep-awake";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useTreinos, type TipoTreino } from "@/lib/treinos-context";
import { useColors } from "@/hooks/use-colors";
import * as Haptics from "expo-haptics";

const TIPOS_TREINO: TipoTreino[] = ["Musculação", "Cardio", "Funcional", "Yoga", "HIIT", "Pilates", "Outro"];

function formatarTempo(segundos: number): string {
  const m = Math.floor(segundos / 60).toString().padStart(2, "0");
  const s = (segundos % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function gerarSalaAleatoria(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  return "fitmeet-" + Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

export default function VideoScreen() {
  useKeepAwake();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const params = useLocalSearchParams<{ agendamentoId?: string; sala?: string }>();
  const { agendamentos, concluirTreino, concluirTreinoRapido } = useTreinos();

  const agendamento = params.agendamentoId
    ? agendamentos.find((a) => a.id === params.agendamentoId)
    : null;

  const [sala, setSala] = useState(params.sala || agendamento?.salaJitsi || "");
  const [salaInput, setSalaInput] = useState(sala);
  const [salaConfirmada, setSalaConfirmada] = useState(!!sala);

  // Cronômetro
  const [cronometroAtivo, setCronometroAtivo] = useState(false);
  const [segundos, setSegundos] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Contador de repetições
  const [repeticoes, setRepeticoes] = useState(0);

  // Modal de finalização
  const [modalFinalizar, setModalFinalizar] = useState(false);
  const [tipoTreinoRapido, setTipoTreinoRapido] = useState<TipoTreino>("Musculação");
  const [nomeTreinoRapido, setNomeTreinoRapido] = useState("Treino Rápido");
  const [personalRapido, setPersonalRapido] = useState("");

  // Modal de configuração da sala (quando não há sala definida)
  const [modalSala, setModalSala] = useState(!sala);

  useEffect(() => {
    if (cronometroAtivo) {
      intervalRef.current = setInterval(() => {
        setSegundos((s) => s + 1);
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [cronometroAtivo]);

  const toggleCronometro = useCallback(() => {
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCronometroAtivo((v) => !v);
  }, []);

  const zerarCronometro = useCallback(() => {
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setCronometroAtivo(false);
    setSegundos(0);
  }, []);

  const incrementarRep = useCallback(() => {
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setRepeticoes((r) => r + 1);
  }, []);

  const decrementarRep = useCallback(() => {
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setRepeticoes((r) => Math.max(0, r - 1));
  }, []);

  function confirmarSala() {
    const s = salaInput.trim() || gerarSalaAleatoria();
    setSala(s);
    setSalaInput(s);
    setSalaConfirmada(true);
    setModalSala(false);
  }

  function abrirModalFinalizar() {
    setCronometroAtivo(false);
    setModalFinalizar(true);
  }

  function finalizarTreino() {
    let concluido;
    if (agendamento) {
      concluido = concluirTreino(agendamento.id, segundos, repeticoes);
    } else {
      concluido = concluirTreinoRapido({
        nomeTreino: nomeTreinoRapido || "Treino Rápido",
        tipoTreino: tipoTreinoRapido,
        personalTrainer: personalRapido || "Personal Trainer",
        salaJitsi: sala,
        duracaoSegundos: segundos,
        repeticoes,
      });
    }
    setModalFinalizar(false);
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    Alert.alert(
      "🏅 Treino Concluído!",
      `Parabéns! Você ganhou uma medalha de ${concluido.medalha.toUpperCase()}!\n\nTempo: ${formatarTempo(segundos)}\nRepetições: ${repeticoes}`,
      [{ text: "Ver Histórico", onPress: () => router.push("/(tabs)/historico") }]
    );
  }

  const jitsiUrl = sala
    ? `https://meet.jit.si/${encodeURIComponent(sala)}#config.startWithAudioMuted=false&config.startWithVideoMuted=false&config.prejoinPageEnabled=false&config.disableDeepLinking=true&interfaceConfig.SHOW_JITSI_WATERMARK=false&interfaceConfig.TOOLBAR_BUTTONS=["microphone","camera","hangup","chat","fullscreen"]`
    : "";

  const topOffset = insets.top + (Platform.OS === "android" ? (StatusBar.currentHeight ?? 0) : 0);

  return (
    <View style={[styles.container, { backgroundColor: "#000" }]}>
      {/* Jitsi WebView - Tela principal */}
      {salaConfirmada && sala ? (
        <WebView
          source={{ uri: jitsiUrl }}
          style={[StyleSheet.absoluteFill, { zIndex: 1 }]}
          pointerEvents="none"
          allowsInlineMediaPlayback
          mediaPlaybackRequiresUserAction={false}
          javaScriptEnabled
          domStorageEnabled
          startInLoadingState
          renderLoading={() => (
            <View style={[StyleSheet.absoluteFill, styles.loadingContainer]}>
              <IconSymbol name="video.fill" size={48} color={colors.primary} />
              <Text style={styles.loadingText}>Conectando à sala...</Text>
              <Text style={styles.loadingSubtext}>{sala}</Text>
            </View>
          )}
        />
      ) : (
        <View style={[StyleSheet.absoluteFill, styles.loadingContainer]}>
          <IconSymbol name="video.fill" size={64} color={colors.primary} />
          <Text style={styles.loadingText}>FitMeet</Text>
          <Text style={styles.loadingSubtext}>Configure a sala para iniciar</Text>
          <TouchableOpacity
            style={[styles.configBtn, { backgroundColor: colors.primary }]}
            onPress={() => setModalSala(true)}
          >
            <Text style={styles.configBtnText}>Configurar Sala</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Overlay Superior - Cronômetro + Contador */}
      <View style={[styles.overlayTop, { top: topOffset + 8, left: 12, right: 12 }]} pointerEvents="box-none">
        {/* Cronômetro */}
        <View style={styles.overlayCard}>
          <Text style={styles.overlayLabel}>⏱ Cronômetro</Text>
          <Text style={styles.timerDisplay}>{formatarTempo(segundos)}</Text>
          <View style={styles.timerButtons}>
            <TouchableOpacity
              style={[styles.timerBtn, { backgroundColor: cronometroAtivo ? "#F59E0B" : "#22C55E" }]}
              onPress={toggleCronometro}
            >
              <IconSymbol name={cronometroAtivo ? "pause.fill" : "play.fill"} size={14} color="#fff" />
              <Text style={styles.timerBtnText}>{cronometroAtivo ? "Pausar" : "Iniciar"}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.timerBtn, { backgroundColor: "#6B7280" }]}
              onPress={zerarCronometro}
            >
              <IconSymbol name="arrow.counterclockwise" size={14} color="#fff" />
              <Text style={styles.timerBtnText}>Zerar</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Contador de Repetições */}
        <View style={styles.overlayCard}>
          <Text style={styles.overlayLabel}>🔁 Repetições</Text>
          <Text style={styles.repDisplay}>{repeticoes}</Text>
          <View style={styles.repButtons}>
            <TouchableOpacity
              style={[styles.repBtn, { backgroundColor: "#EF4444" }]}
              onPress={decrementarRep}
            >
              <IconSymbol name="minus" size={18} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.repBtn, { backgroundColor: "#22C55E" }]}
              onPress={incrementarRep}
            >
              <IconSymbol name="plus" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Botão Finalizar Treino */}
      <View style={[styles.overlayBottom, { bottom: insets.bottom + 80 }]} pointerEvents="box-none">
        <TouchableOpacity
          style={styles.finalizarBtn}
          onPress={abrirModalFinalizar}
        >
          <IconSymbol name="stop.fill" size={18} color="#fff" />
          <Text style={styles.finalizarBtnText}>Finalizar Treino</Text>
        </TouchableOpacity>
      </View>

      {/* Modal de Configuração da Sala */}
      <Modal visible={modalSala} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => salaConfirmada && setModalSala(false)}>
        <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
            {salaConfirmada && (
              <TouchableOpacity onPress={() => setModalSala(false)}>
                <IconSymbol name="xmark.circle.fill" size={28} color={colors.muted} />
              </TouchableOpacity>
            )}
            <Text style={[styles.modalTitle, { color: colors.foreground }]}>Configurar Sala</Text>
            <View style={{ width: 28 }} />
          </View>
          <ScrollView contentContainerStyle={{ padding: 24, gap: 20 }}>
            <View style={[styles.salaInfoCard, { backgroundColor: colors.primary + "15", borderColor: colors.primary + "40" }]}>
              <IconSymbol name="video.fill" size={32} color={colors.primary} />
              <Text style={[styles.salaInfoTitle, { color: colors.foreground }]}>Sala de Videoconferência</Text>
              <Text style={[styles.salaInfoText, { color: colors.muted }]}>
                Informe o ID da sala para entrar. Compartilhe o mesmo ID com seu personal trainer para se conectar.
              </Text>
            </View>
            <View>
              <Text style={[styles.fieldLabel, { color: colors.foreground }]}>ID da Sala Jitsi Meet</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.foreground }]}
                placeholder="Ex: fitmeet-meutreino123"
                placeholderTextColor={colors.muted}
                value={salaInput}
                onChangeText={setSalaInput}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="done"
                onSubmitEditing={confirmarSala}
              />
              <Text style={[styles.fieldHint, { color: colors.muted }]}>
                Deixe em branco para gerar uma sala aleatória.
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.saveBtn, { backgroundColor: colors.primary }]}
              onPress={confirmarSala}
            >
              <IconSymbol name="video.fill" size={20} color="#fff" />
              <Text style={styles.saveBtnText}>Entrar na Sala</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>

      {/* Modal de Finalizar Treino */}
      <Modal visible={modalFinalizar} animationType="fade" transparent onRequestClose={() => setModalFinalizar(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.finalizarModal, { backgroundColor: colors.surface }]}>
            <Text style={[styles.finalizarTitle, { color: colors.foreground }]}>🏁 Finalizar Treino</Text>
            <Text style={[styles.finalizarSubtitle, { color: colors.muted }]}>
              Resumo da sessão
            </Text>

            <View style={[styles.resumoCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <View style={styles.resumoRow}>
                <Text style={[styles.resumoLabel, { color: colors.muted }]}>⏱ Tempo Total</Text>
                <Text style={[styles.resumoValue, { color: colors.foreground }]}>{formatarTempo(segundos)}</Text>
              </View>
              <View style={[styles.resumoDivider, { backgroundColor: colors.border }]} />
              <View style={styles.resumoRow}>
                <Text style={[styles.resumoLabel, { color: colors.muted }]}>🔁 Repetições</Text>
                <Text style={[styles.resumoValue, { color: colors.foreground }]}>{repeticoes}</Text>
              </View>
            </View>

            {!agendamento && (
              <View style={{ gap: 12, width: "100%" }}>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.foreground }]}
                  placeholder="Nome do treino"
                  placeholderTextColor={colors.muted}
                  value={nomeTreinoRapido}
                  onChangeText={setNomeTreinoRapido}
                />
                <TextInput
                  style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.foreground }]}
                  placeholder="Personal trainer (opcional)"
                  placeholderTextColor={colors.muted}
                  value={personalRapido}
                  onChangeText={setPersonalRapido}
                />
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={{ flexDirection: "row", gap: 8 }}>
                    {TIPOS_TREINO.map((tipo) => (
                      <TouchableOpacity
                        key={tipo}
                        style={[
                          styles.tipoChip,
                          {
                            backgroundColor: tipoTreinoRapido === tipo ? colors.primary : colors.surface,
                            borderColor: tipoTreinoRapido === tipo ? colors.primary : colors.border,
                          },
                        ]}
                        onPress={() => setTipoTreinoRapido(tipo)}
                      >
                        <Text style={[styles.tipoChipText, { color: tipoTreinoRapido === tipo ? "#fff" : colors.foreground }]}>
                          {tipo}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>
            )}

            <View style={styles.finalizarActions}>
              <TouchableOpacity
                style={[styles.cancelBtn, { borderColor: colors.border }]}
                onPress={() => setModalFinalizar(false)}
              >
                <Text style={[styles.cancelBtnText, { color: colors.muted }]}>Continuar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.confirmBtn, { backgroundColor: colors.error }]}
                onPress={finalizarTreino}
              >
                <IconSymbol name="checkmark.circle.fill" size={18} color="#fff" />
                <Text style={styles.confirmBtnText}>Finalizar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    backgroundColor: "#0D0D1A",
  },
  loadingText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
  },
  loadingSubtext: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 14,
  },
  configBtn: {
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 28,
    marginTop: 8,
  },
  configBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
  overlayTop: {
    position: "absolute",
    flexDirection: "row",
    gap: 8,
    zIndex: 10,
    elevation: 20,
  },
  overlayCard: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.75)",
    borderRadius: 14,
    padding: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  overlayLabel: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 11,
    fontWeight: "600",
    marginBottom: 4,
  },
  timerDisplay: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "800",
    fontVariant: ["tabular-nums"],
    letterSpacing: 1,
  },
  timerButtons: {
    flexDirection: "row",
    gap: 6,
    marginTop: 6,
  },
  timerBtn: {
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    pointerEvents: "auto",
  },
  timerBtnText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
  },
  repDisplay: {
    color: "#fff",
    fontSize: 36,
    fontWeight: "800",
    fontVariant: ["tabular-nums"],
  },
  repButtons: {
    flexDirection: "row",
    gap: 10,
    marginTop: 6,
  },
  repBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    pointerEvents: "auto",
  },
  overlayBottom: {
    position: "absolute",
    left: 20,
    right: 20,
    zIndex: 10,
    elevation: 20,
  },
  finalizarBtn: {
    backgroundColor: "#EF4444",
    borderRadius: 16,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    shadowColor: "#EF4444",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 25,
    pointerEvents: "auto",
  },
  finalizarBtnText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  salaInfoCard: {
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
  },
  salaInfoTitle: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
  salaInfoText: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
  },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
  },
  fieldHint: {
    fontSize: 12,
    marginTop: 4,
    lineHeight: 16,
  },
  saveBtn: {
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  saveBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
    padding: 16,
    paddingBottom: 32,
  },
  finalizarModal: {
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    gap: 16,
  },
  finalizarTitle: {
    fontSize: 22,
    fontWeight: "800",
  },
  finalizarSubtitle: {
    fontSize: 14,
    marginTop: -8,
  },
  resumoCard: {
    width: "100%",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    gap: 12,
  },
  resumoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  resumoLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
  resumoValue: {
    fontSize: 18,
    fontWeight: "700",
  },
  resumoDivider: {
    height: 1,
  },
  tipoChip: {
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
  },
  tipoChipText: {
    fontSize: 13,
    fontWeight: "600",
  },
  finalizarActions: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  cancelBtn: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
  },
  cancelBtnText: {
    fontWeight: "600",
    fontSize: 15,
  },
  confirmBtn: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  confirmBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
});
