import React, { useState, useEffect } from 'react';
import {
  Modal, View, Text, TextInput, TouchableOpacity,
  ScrollView, KeyboardAvoidingView, Platform, Alert
} from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import styles from './style';
import COLORS from '../../constants/colors';

const CONDICOES_OPTIONS = [
  { key: 'hipertensao', label: 'Hipertensão', icon: 'heartbeat', color: '#EF4444' },
  { key: 'diabetes',    label: 'Diabetes',    icon: 'tint',      color: '#F59E0B' },
];

const FORM_INICIAL = {
  nome:           '',
  dataNascimento: '',
  sexo:           'M',
  gestante:       false,
  condicoes:      [],
};

function formatDateInput(value) {
  const cleaned = value.replace(/\D/g, '');
  if (cleaned.length <= 2) return cleaned;
  if (cleaned.length <= 4) return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
  return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;
}

function calculateAge(dateString) {
  if (!dateString) return null;
  const parts = dateString.split('/');
  if (parts.length !== 3) return null;
  const birth = new Date(parts[2], parts[1] - 1, parts[0]);
  return Math.floor((Date.now() - birth.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
}

export default function MemberFormModal({ visible, editingMember, onClose, onSave }) {
  const [form, setForm] = useState(FORM_INICIAL);

  useEffect(() => {
    if (visible) {
      setForm(
        editingMember
          ? {
              nome:           editingMember.nome,
              dataNascimento: editingMember.dataNascimento,
              sexo:           editingMember.sexo,
              gestante:       editingMember.gestante || false,
              condicoes:      editingMember.condicoes || [],
            }
          : FORM_INICIAL
      );
    }
  }, [visible, editingMember]);

  function setField(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  function handleDateChange(value) {
    setField('dataNascimento', formatDateInput(value));
  }

  function toggleCondicao(key) {
    setForm(prev => ({
      ...prev,
      condicoes: prev.condicoes.includes(key)
        ? prev.condicoes.filter(c => c !== key)
        : [...prev.condicoes, key],
    }));
  }

  function handleSexoChange(sexo) {
    setForm(prev => ({ ...prev, sexo, gestante: false }));
  }

  function handleSubmit() {
    if (!form.nome.trim() || !form.dataNascimento) {
      Alert.alert('Atenção', 'Preencha nome e data de nascimento.');
      return;
    }
    const age = calculateAge(form.dataNascimento);
    if (age === null || age < 0 || age > 150) {
      Alert.alert('Atenção', 'Data de nascimento inválida. Use o formato DD/MM/AAAA.');
      return;
    }
    onSave({
      nome:           form.nome.trim(),
      dataNascimento: form.dataNascimento,
      sexo:           form.sexo,
      gestante:       form.sexo === 'F' ? form.gestante : false,
      condicoes:      form.condicoes,
    });
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalContainer}
      >
        {/* Header */}
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={26} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.modalHeaderTitle}>
            {editingMember ? 'Editar Membro' : 'Novo Membro'}
          </Text>
          <View style={{ width: 26 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.formContainer}
          keyboardShouldPersistTaps="handled"
        >
          {/* Nome */}
          <Text style={styles.formLabel}>NOME COMPLETO *</Text>
          <TextInput
            style={styles.formInput}
            value={form.nome}
            onChangeText={v => setField('nome', v)}
            placeholder="Ex: Maria Silva"
            placeholderTextColor={COLORS.grey}
          />

          {/* Data de nascimento */}
          <Text style={styles.formLabel}>DATA DE NASCIMENTO *</Text>
          <TextInput
            style={styles.formInput}
            value={form.dataNascimento}
            onChangeText={handleDateChange}
            placeholder="DD/MM/AAAA"
            placeholderTextColor={COLORS.grey}
            keyboardType="numeric"
            maxLength={10}
          />

          {/* Sexo */}
          <Text style={styles.formLabel}>SEXO</Text>
          <View style={styles.toggleRow}>
            <TouchableOpacity
              style={[styles.toggleBtn, form.sexo === 'M' && styles.toggleBtnActiveM]}
              onPress={() => handleSexoChange('M')}
            >
              <Ionicons name="male" size={18} color={form.sexo === 'M' ? '#fff' : '#3B82F6'} />
              <Text style={[styles.toggleBtnText, form.sexo === 'M' && styles.toggleBtnTextActive]}>
                Masculino
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleBtn, form.sexo === 'F' && styles.toggleBtnActiveF]}
              onPress={() => handleSexoChange('F')}
            >
              <Ionicons name="female" size={18} color={form.sexo === 'F' ? '#fff' : '#EC4899'} />
              <Text style={[styles.toggleBtnText, form.sexo === 'F' && styles.toggleBtnTextActive]}>
                Feminino
              </Text>
            </TouchableOpacity>
          </View>

          {/* Gestante */}
          {form.sexo === 'F' && (
            <>
              <Text style={styles.formLabel}>GESTANTE</Text>
              <View style={styles.toggleRow}>
                <TouchableOpacity
                  style={[styles.toggleBtn, form.gestante && { backgroundColor: '#EC4899', borderColor: '#EC4899' }]}
                  onPress={() => setField('gestante', true)}
                >
                  <Text style={[styles.toggleBtnText, form.gestante && styles.toggleBtnTextActive]}>Sim</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.toggleBtn, !form.gestante && { backgroundColor: COLORS.greyDark, borderColor: COLORS.greyDark }]}
                  onPress={() => setField('gestante', false)}
                >
                  <Text style={[styles.toggleBtnText, !form.gestante && styles.toggleBtnTextActive]}>Não</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {/* Condições de saúde */}
          <Text style={styles.formLabel}>CONDIÇÕES DE SAÚDE</Text>
          <View style={styles.conditionsGrid}>
            {CONDICOES_OPTIONS.map(opt => {
              const selected = form.condicoes.includes(opt.key);
              return (
                <TouchableOpacity
                  key={opt.key}
                  style={[
                    styles.conditionBtn,
                    selected && { backgroundColor: opt.color, borderColor: opt.color },
                  ]}
                  onPress={() => toggleCondicao(opt.key)}
                >
                  <FontAwesome5
                    name={opt.icon}
                    size={16}
                    color={selected ? '#fff' : opt.color}
                  />
                  <Text style={[styles.conditionBtnText, selected && { color: '#fff' }]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Salvar */}
          <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
            <Text style={styles.saveButtonText}>
              {editingMember ? 'SALVAR ALTERAÇÕES' : 'ADICIONAR MEMBRO'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}
