import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  Alert, KeyboardAvoidingView, Platform
} from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import * as visitController from '../../controllers/visitsController';
import styles from './style';
import COLORS from '../../constants/colors';

 
const tiposDeVisita = [
  { key: 'Rotina', label: 'Rotina', icon: 'calendar-outline', color: COLORS.primary },
  { key: 'Busca Ativa', label: 'Busca Ativa', icon: 'search', color: '#7C3AED' },
  { key: 'Urgência', label: 'Urgência', icon: 'alert-circle', color: COLORS.danger },
];
 
export default function NewVisitScreen({ route, navigation }) {
  const { user } = useAuth();
  const { familyId, familyName, members = [] } = route.params;
 
  const [tipoVisita, setTipoVisita] = useState('Rotina');
  const [membroSelecionado, setMembroSelecionado] = useState('Família');
  const [motivo, setMotivo] = useState('');
  const [pressao, setPressao] = useState('');
  const [glicemia, setGlicemia] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [dataVisita, setDataVisita] = useState('');
  const [saving, setSaving] = useState(false);
 
  // Preenche data de hoje automaticamente
  useEffect(() => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    setDataVisita(`${dd}/${mm}/${yyyy}`);
  }, []);
 
  function formatDateInput(value) {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 2) return cleaned;
    if (cleaned.length <= 4) return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;
  }
 
  // Monta lista de opções de membros: "Família" + nomes individuais
  const membroOptions = ['Família', ...members.map(m => m.nome)];
 
  const selectedTipo = tiposDeVisita.find(t => t.key === tipoVisita);
 
  async function handleSave() {
    if (!motivo.trim()) {
      Alert.alert('Atenção', 'Informe o motivo da visita.');
      return;
    }
 
    setSaving(true);
    try {
      await visitController.createVisit(
        {
          familyId,
          familyName,
          paciente: membroSelecionado,
          tipoVisita,
          motivo: motivo.trim(),
          pressao: pressao.trim(),
          glicemia: glicemia.trim(),
          observacoes: observacoes.trim(),
          dataVisita,
        },
        user.uid
      );
      Alert.alert('Sucesso', 'Visita registrada com sucesso!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Erro', error.message);
    } finally {
      setSaving(false);
    }
  }
 
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Nova Visita</Text>
          <Text style={styles.headerSubtitle} numberOfLines={1}>{familyName}</Text>
        </View>
        <View style={{ width: 36 }} />
      </View>
 
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
 
        {/* TIPO DE VISITA */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>TIPO DE VISITA</Text>
          <View style={styles.tipoRow}>
            {tiposDeVisita.map(tipo => {
              const active = tipoVisita === tipo.key;
              return (
                <TouchableOpacity
                  key={tipo.key}
                  style={[
                    styles.tipoBtn,
                    active && { backgroundColor: tipo.color, borderColor: tipo.color }
                  ]}
                  onPress={() => setTipoVisita(tipo.key)}
                >
                  <Ionicons
                    name={tipo.icon}
                    size={14}
                    color={active ? '#fff' : tipo.color}
                  />
                  <Text style={[styles.tipoBtnText, active && { color: '#fff' }]}>
                    {tipo.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
 
        {/* MEMBRO VISITADO */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>MEMBRO VISITADO</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.membroRow}>
              {membroOptions.map((nome, idx) => {
                const active = membroSelecionado === nome;
                return (
                  <TouchableOpacity
                    key={`membro-${idx}`}
                    style={[styles.membroChip, active && styles.membroChipActive]}
                    onPress={() => setMembroSelecionado(nome)}
                  >
                    <Ionicons
                      name={nome === 'Família' ? 'people' : 'person'}
                      size={13}
                      color={active ? '#fff' : COLORS.primary}
                    />
                    <Text style={[styles.membroChipText, active && { color: '#fff' }]}>
                      {nome}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </View>
 
        {/* DADOS DA VISITA */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>DADOS DA VISITA</Text>
 
          <Text style={styles.fieldLabel}>MOTIVO *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Acompanhamento mensal"
            placeholderTextColor={COLORS.grey}
            value={motivo}
            onChangeText={setMotivo}
            multiline
          />
 
          <Text style={styles.fieldLabel}>DATA DA VISITA</Text>
          <TextInput
            style={styles.input}
            placeholder="DD/MM/AAAA"
            placeholderTextColor={COLORS.grey}
            value={dataVisita}
            onChangeText={v => setDataVisita(formatDateInput(v))}
            keyboardType="numeric"
            maxLength={10}
          />
        </View>
 
        {/* SINAIS VITAIS */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>SINAIS VITAIS (opcional)</Text>
          <View style={styles.vitaisRow}>
            <View style={styles.vitaisField}>
              <View style={styles.vitaisLabelRow}>
                <FontAwesome5 name="heartbeat" size={12} color={COLORS.danger} />
                <Text style={styles.fieldLabel}> PRESSÃO ARTERIAL</Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="Ex: 120/80"
                placeholderTextColor={COLORS.grey}
                value={pressao}
                onChangeText={setPressao}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.vitaisField}>
              <View style={styles.vitaisLabelRow}>
                <FontAwesome5 name="tint" size={12} color={COLORS.warning} />
                <Text style={styles.fieldLabel}> GLICEMIA</Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="Ex: 100 mg/dL"
                placeholderTextColor={COLORS.grey}
                value={glicemia}
                onChangeText={setGlicemia}
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>
 
        {/* OBSERVAÇÕES */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>OBSERVAÇÕES</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Anotações adicionais sobre a visita..."
            placeholderTextColor={COLORS.grey}
            value={observacoes}
            onChangeText={setObservacoes}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
 
        {/* BOTÃO SALVAR */}
        <TouchableOpacity
          style={[styles.saveButton, saving && { opacity: 0.7 }]}
          onPress={handleSave}
          disabled={saving}
        >
          <Ionicons name="checkmark-circle" size={20} color="#fff" />
          <Text style={styles.saveButtonText}>
            {saving ? 'SALVANDO...' : 'SALVAR VISITA'}
          </Text>
        </TouchableOpacity>
 
      </ScrollView>
    </KeyboardAvoidingView>
  );
}