import React from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function RegisterScreen() {
  const navigation = useNavigation();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.panel}>
        <Text style={styles.title}>REGISTRO</Text>
        <TextInput placeholder="Email" style={styles.input} placeholderTextColor="#ccc" />
        <TextInput placeholder="Nome Completo" style={styles.input} placeholderTextColor="#ccc" />
        <TextInput placeholder="CPF / CNPJ" style={styles.input} placeholderTextColor="#ccc" />
        <TextInput placeholder="Senha" style={styles.input} secureTextEntry placeholderTextColor="#ccc" />
        <TextInput placeholder="Confirme a Senha" style={styles.input} secureTextEntry placeholderTextColor="#ccc" />
        <Button title="Registrar" onPress={() => navigation.navigate('Login')} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#1e1e2f', justifyContent: 'center', alignItems: 'center', padding: 16 },
  panel: { width: '100%', maxWidth: 400, backgroundColor: '#2b2b3d', padding: 24, borderRadius: 12 },
  title: { fontSize: 24, color: '#fff', marginBottom: 16, textAlign: 'center' },
  input: { backgroundColor: '#333', color: '#fff', padding: 12, marginVertical: 8, borderRadius: 8 },
});
