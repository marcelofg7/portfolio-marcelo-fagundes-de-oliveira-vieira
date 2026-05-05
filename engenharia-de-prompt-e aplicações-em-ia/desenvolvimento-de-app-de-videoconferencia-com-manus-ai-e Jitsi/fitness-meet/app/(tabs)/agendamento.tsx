import {
  View, Text, TouchableOpacity, FlatList, StyleSheet,
  Modal, TextInput, ScrollView, Alert, Platform,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useTreinos, type Agendamento, type TipoTreino } from "@/lib/treinos-context";
import { useColors } from "@/hooks/use-colors";

const TIPOS_TREINO: TipoTreino[] = ["Musculação", "Cardio", "Funcional", "Yoga", "HIIT", "Pilates", "Outro"];

function formatarDataHora(data: string, hora: string): string {
  const d = new Date(data);
  return `${d.toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "short" })} às ${hora}`;
}

function statusLabel(status: Agendamento["status"]): { label: string; color: string } {
  switch (status) {
    case "agendado": return { label: "Agendado", color: "#3B82F6" };
    case "em_andamento": return { label: "Em andamento", color: "#F59E0B" };
    case "concluido": return { label: "Concluído", color: "#22C55E" };
  }
}

interface FormData {
  nomeTreino: string;
  data: string;
  hora: string;
  personalTrainer: string;
  tipoTreino: TipoTreino;
  salaJitsi: string;
}

function gerarSalaAleatoria(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  return "fitmeet-" + Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

function getDataHoje(): string {
  return new Date().toISOString().split("T")[0];
}

function getHoraAtual(): string {
  const now = new Date();
  const h = now.getHours().toString().padStart(2, "0");
  const m = now.getMinutes().toString().padStart(2, "0");
  return `${h}:${m}`;
}

export default function AgendamentoScreen() {
  const router = useRouter();
  const colors = useColors();
  const { agendamentos, adicionarAgendamento, removerAgendamento } = useTreinos();

  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState<FormData>({
    nomeTreino: "",
    data: getDataHoje(),
    hora: getHoraAtual(),
    personalTrainer: "",
    tipoTreino: "Musculação",
    salaJitsi: gerarSalaAleatoria(),
  });

  const agendamentosOrdenados = [...agendamentos].sort((a, b) => {
    const da = new Date(`${a.data.split("T")[0]}T${a.hora}`);
    const db = new Date(`${b.data.split("T")[0]}T${b.hora}`);
    return da.getTime() - db.getTime();
  });

  function abrirModal() {
    setForm({
      nomeTreino: "",
      data: getDataHoje(),
      hora: getHoraAtual(),
      personalTrainer: "",
      tipoTreino: "Musculação",
      salaJitsi: gerarSalaAleatoria(),
    });
    setModalVisible(true);
  }

  function salvarAgendamento() {
    if (!form.nomeTreino.trim()) {
      Alert.alert("Campo obrigatório", "Informe o nome do treino.");
      return;
    }
    if (!form.data.match(/^\d{4}-\d{2}-\d{2}$/)) {
      Alert.alert("Data inválida", "Use o formato AAAA-MM-DD.");
      return;
    }
    if (!form.hora.match(/^\d{2}:\d{2}$/)) {
      Alert.alert("Hora inválida", "Use o formato HH:MM.");
      return;
    }
    adicionarAgendamento({
      nomeTreino: form.nomeTreino.trim(),
      data: new Date(form.data).toISOString(),
      hora: form.hora,
      personalTrainer: form.personalTrainer.trim() || "Personal Trainer",
      tipoTreino: form.tipoTreino,
      salaJitsi: form.salaJitsi.trim() || gerarSalaAleatoria(),
    });
    setModalVisible(false);
  }

  function confirmarRemover(id: string, nome: string) {
    Alert.alert(
      "Remover Agendamento",
      `Deseja remover "${nome}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Remover", style: "destructive", onPress: () => removerAgendamento(id) },
      ]
    );
  }

  const renderItem = ({ item }: { item: Agendamento }) => {
    const st = statusLabel(item.status);
    return (
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={styles.cardHeader}>
          <View style={[styles.tipoTag, { backgroundColor: colors.primary + "20" }]}>
            <Text style={[styles.tipoTagText, { color: colors.primary }]}>{item.tipoTreino}</Text>
          </View>
          <View style={[styles.statusTag, { backgroundColor: st.color + "20" }]}>
            <Text style={[styles.statusTagText, { color: st.color }]}>{st.label}</Text>
          </View>
        </View>
        <Text style={[styles.cardTitle, { color: colors.foreground }]}>{item.nomeTreino}</Text>
        <View style={styles.cardRow}>
          <IconSymbol name="clock.fill" size={14} color={colors.muted} />
          <Text style={[styles.cardMeta, { color: colors.muted }]}>{formatarDataHora(item.data, item.hora)}</Text>
        </View>
        <View style={styles.cardRow}>
          <IconSymbol name="person.fill" size={14} color={colors.muted} />
          <Text style={[styles.cardMeta, { color: colors.muted }]}>{item.personalTrainer}</Text>
        </View>
        <View style={styles.cardRow}>
          <IconSymbol name="video.fill" size={14} color={colors.muted} />
          <Text style={[styles.cardMeta, { color: colors.muted }]} numberOfLines={1}>Sala: {item.salaJitsi}</Text>
        </View>
        <View style={styles.cardActions}>
          {item.status !== "concluido" && (
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: colors.primary }]}
              onPress={() => router.push({ pathname: "/(tabs)/video", params: { agendamentoId: item.id, sala: item.salaJitsi } })}
            >
              <IconSymbol name="play.fill" size={14} color="#fff" />
              <Text style={styles.actionBtnText}>Iniciar</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: colors.error + "20" }]}
            onPress={() => confirmarRemover(item.id, item.nomeTreino)}
          >
            <IconSymbol name="trash.fill" size={14} color={colors.error} />
            <Text style={[styles.actionBtnText, { color: colors.error }]}>Remover</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <ScreenContainer containerClassName="bg-background">
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Agendamentos</Text>
        <TouchableOpacity
          style={[styles.addBtn, { backgroundColor: colors.primary }]}
          onPress={abrirModal}
        >
          <IconSymbol name="plus" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {agendamentosOrdenados.length === 0 ? (
        <View style={styles.emptyContainer}>
          <IconSymbol name="calendar.badge.plus" size={64} color={colors.muted} />
          <Text style={[styles.emptyTitle, { color: colors.foreground }]}>Nenhum treino agendado</Text>
          <Text style={[styles.emptySubtitle, { color: colors.muted }]}>
            Toque no "+" para agendar seu primeiro treino
          </Text>
          <TouchableOpacity
            style={[styles.emptyBtn, { backgroundColor: colors.primary }]}
            onPress={abrirModal}
          >
            <Text style={styles.emptyBtnText}>Agendar Treino</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={agendamentosOrdenados}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16, gap: 12 }}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Modal de Criação */}
      <Modal visible={modalVisible} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setModalVisible(false)}>
        <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <IconSymbol name="xmark.circle.fill" size={28} color={colors.muted} />
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: colors.foreground }]}>Novo Agendamento</Text>
            <TouchableOpacity onPress={salvarAgendamento}>
              <Text style={[styles.modalSave, { color: colors.primary }]}>Salvar</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20, gap: 16 }} keyboardShouldPersistTaps="handled">
            <View>
              <Text style={[styles.fieldLabel, { color: colors.foreground }]}>Nome do Treino *</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.foreground }]}
                placeholder="Ex: Treino de Peito e Tríceps"
                placeholderTextColor={colors.muted}
                value={form.nomeTreino}
                onChangeText={(v) => setForm((f) => ({ ...f, nomeTreino: v }))}
                returnKeyType="next"
              />
            </View>

            <View style={{ flexDirection: "row", gap: 12 }}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.fieldLabel, { color: colors.foreground }]}>Data (AAAA-MM-DD)</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.foreground }]}
                  placeholder="2025-01-15"
                  placeholderTextColor={colors.muted}
                  value={form.data}
                  onChangeText={(v) => setForm((f) => ({ ...f, data: v }))}
                  keyboardType="numbers-and-punctuation"
                  returnKeyType="next"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.fieldLabel, { color: colors.foreground }]}>Hora (HH:MM)</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.foreground }]}
                  placeholder="07:00"
                  placeholderTextColor={colors.muted}
                  value={form.hora}
                  onChangeText={(v) => setForm((f) => ({ ...f, hora: v }))}
                  keyboardType="numbers-and-punctuation"
                  returnKeyType="next"
                />
              </View>
            </View>

            <View>
              <Text style={[styles.fieldLabel, { color: colors.foreground }]}>Personal Trainer</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.foreground }]}
                placeholder="Nome do personal trainer"
                placeholderTextColor={colors.muted}
                value={form.personalTrainer}
                onChangeText={(v) => setForm((f) => ({ ...f, personalTrainer: v }))}
                returnKeyType="next"
              />
            </View>

            <View>
              <Text style={[styles.fieldLabel, { color: colors.foreground }]}>Tipo de Treino</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 8 }}>
                <View style={{ flexDirection: "row", gap: 8 }}>
                  {TIPOS_TREINO.map((tipo) => (
                    <TouchableOpacity
                      key={tipo}
                      style={[
                        styles.tipoChip,
                        {
                          backgroundColor: form.tipoTreino === tipo ? colors.primary : colors.surface,
                          borderColor: form.tipoTreino === tipo ? colors.primary : colors.border,
                        },
                      ]}
                      onPress={() => setForm((f) => ({ ...f, tipoTreino: tipo }))}
                    >
                      <Text style={[styles.tipoChipText, { color: form.tipoTreino === tipo ? "#fff" : colors.foreground }]}>
                        {tipo}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

            <View>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={[styles.fieldLabel, { color: colors.foreground }]}>ID da Sala Jitsi</Text>
                <TouchableOpacity onPress={() => setForm((f) => ({ ...f, salaJitsi: gerarSalaAleatoria() }))}>
                  <Text style={[styles.generateLink, { color: colors.primary }]}>Gerar novo</Text>
                </TouchableOpacity>
              </View>
              <TextInput
                style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.foreground }]}
                placeholder="nome-da-sala"
                placeholderTextColor={colors.muted}
                value={form.salaJitsi}
                onChangeText={(v) => setForm((f) => ({ ...f, salaJitsi: v }))}
                autoCapitalize="none"
                returnKeyType="done"
              />
              <Text style={[styles.fieldHint, { color: colors.muted }]}>
                Compartilhe este ID com seu personal trainer para entrar na mesma sala.
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.saveBtn, { backgroundColor: colors.primary }]}
              onPress={salvarAgendamento}
            >
              <IconSymbol name="checkmark.circle.fill" size={20} color="#fff" />
              <Text style={styles.saveBtnText}>Confirmar Agendamento</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
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
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
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
  emptyBtn: {
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 28,
    marginTop: 8,
  },
  emptyBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    gap: 8,
  },
  cardHeader: {
    flexDirection: "row",
    gap: 8,
  },
  tipoTag: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tipoTagText: {
    fontSize: 12,
    fontWeight: "600",
  },
  statusTag: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusTagText: {
    fontSize: 12,
    fontWeight: "600",
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "700",
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  cardMeta: {
    fontSize: 13,
  },
  cardActions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
  },
  actionBtn: {
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  actionBtnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 13,
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
  modalSave: {
    fontSize: 16,
    fontWeight: "700",
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
  generateLink: {
    fontSize: 13,
    fontWeight: "600",
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
    marginTop: 8,
  },
  saveBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
