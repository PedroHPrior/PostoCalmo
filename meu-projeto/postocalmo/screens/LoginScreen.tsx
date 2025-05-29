import React from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

export default function LoginScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      <View style={styles.panel}>
        <Text style={styles.title}>LOGIN</Text>
        <TextInput placeholder="Usuário" style={styles.input} placeholderTextColor="#ccc" />
        <TextInput placeholder="Senha" style={styles.input} secureTextEntry placeholderTextColor="#ccc" />
        <Button title="Entrar" onPress={() => navigation.navigate('Map')} />
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.link}>Registre-se</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1e1e2f', justifyContent: 'center', alignItems: 'center' },
  panel: { width: '80%', backgroundColor: '#2b2b3d', padding: 24, borderRadius: 12 },
  title: { fontSize: 24, color: '#fff', marginBottom: 16, textAlign: 'center' },
  input: { backgroundColor: '#333', color: '#fff', padding: 12, marginVertical: 8, borderRadius: 8 },
  link: { marginTop: 12, color: 'lightgreen', textAlign: 'center' },
});
