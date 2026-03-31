import React, { useState, useEffect } from 'react';
import {
  Modal, View, Text, TextInput, TouchableOpacity, ScrollView,
  KeyboardAvoidingView, Platform, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { updateVisit } from '../../controllers/visitsController';
import styles from './style';

const TIPOS_DE_VISITA = ['Rotina', 'Busca Ativa', 'Urgência'];

export default function VisitEditModal({ visible, editingVisit, onClose, onSaved }) {
  const [form, setForm] = useState({
    tipoVisita: 'Rotina',
    motivo:     '',
    pressao:    '',
  });

  useEffect(() => {
    if (visible && editingVisit) {
      setForm({
        tipoVisita: editingVisit.tipoVisita || 'Rotina',
        motivo:     editingVisit.motivo     || '',
        pressao:    editingVisit.pressao    || '',
      });
    }
  }, [visible, editingVisit]);

  function setField(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    try {
      await updateVisit(editingVisit.id, {
        tipoVisita: form.tipoVisita,
        motivo:     form.motivo,
        pressao:    form.pressao,
      });
      onSaved();
      Alert.alert('Sucesso', 'Visita atualizada!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar.');
    }
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
        <View style={styles.headerVisita}>
          <View style={styles.headerContentVisita}>
            <TouchableOpacity style={styles.backButtonVisita} onPress={onClose}>
              <Ionicons name="chevron-back" size={28} color="#fff" />
            </TouchableOpacity>
            <View>
              <Text style={styles.titleVisita}>Editar Visita</Text>
              <Text style={styles.subtitleVisita}>{editingVisit?.paciente}</Text>
            </View>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContentVisita}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.cardVisita}>

            {/* Tipo de visita */}
            <View style={styles.inputGroupVisita}>
              <Text style={styles.labelVisita}>TIPO DE VISITA</Text>
              <View style={styles.radioGroup}>
                {TIPOS_DE_VISITA.map(tipo => (
                  <TouchableOpacity
                    key={tipo}
                    style={[
                      styles.radioButton,
                      form.tipoVisita === tipo && styles.radioButtonActive,
                    ]}
                    onPress={() => setField('tipoVisita', tipo)}
                  >
                    <Text style={[
                      styles.radioText,
                      form.tipoVisita === tipo && styles.radioTextActive,
                    ]}>
                      {tipo}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Paciente */}
            <View style={styles.inputGroupVisita}>
              <Text style={styles.labelVisita}>PACIENTE</Text>
              <View style={[styles.inputContainerVisita, { backgroundColor: '#f0f0f0' }]}>
                <Text style={[styles.inputTextVisita, { color: '#999' }]}>
                  {editingVisit?.paciente}
                </Text>
              </View>
            </View>

            {/* Motivo */}
            <View style={styles.inputGroupVisita}>
              <Text style={styles.labelVisita}>MOTIVO</Text>
              <View style={styles.inputContainerVisita}>
                <TextInput
                  style={styles.inputInnerVisita}
                  placeholder="Ex: Acompanhamento mensal"
                  placeholderTextColor="#999"
                  value={form.motivo}
                  onChangeText={v => setField('motivo', v)}
                />
              </View>
            </View>

            {/* Pressão */}
            <View style={styles.inputGroupVisita}>
              <Text style={styles.labelVisita}>PRESSÃO ARTERIAL</Text>
              <View style={styles.inputContainerVisita}>
                <TextInput
                  style={styles.inputInnerVisita}
                  placeholder="Ex: 120/80"
                  placeholderTextColor="#999"
                  value={form.pressao}
                  onChangeText={v => setField('pressao', v)}
                  keyboardType="numeric"
                />
              </View>
            </View>

          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>SALVAR ALTERAÇÕES</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}
