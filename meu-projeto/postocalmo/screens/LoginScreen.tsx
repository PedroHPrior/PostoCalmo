import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, SafeAreaView, Image, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { theme } from '../constants/theme';
import { API_URL } from '../constants/api';

type MessageType = 'error' | 'success' | null;

export default function LoginScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: MessageType }>({ text: '', type: null });

  const handleLogin = async () => {
    if (!email || !password) {
      setMessage({ text: 'Preencha todos os campos.', type: 'error' });
      return;
    }
    setLoading(true);
    setMessage({ text: '', type: null });
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (response.ok) {
        setMessage({ text: data.message || 'Login realizado com sucesso!', type: 'success' });
        setTimeout(() => {
          navigation.navigate('Map');
        }, 1500);
      } else {
        setMessage({ text: data.message || 'Email ou senha inválidos.', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Não foi possível conectar ao servidor. Verifique sua conexão ou tente novamente.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.formContainer}>
          <Image 
            source={require('../assets/logo.jpg')}
            style={styles.logo}
            resizeMode="contain"
          />
          
          <Text style={styles.title}>Bem-vindo ao PostoCalmo</Text>
          <Text style={styles.subtitle}>Faça login para continuar</Text>

          <View style={styles.form}>
            <TextInput 
              placeholder="Email" 
              style={styles.input} 
              placeholderTextColor={theme.colors.textLight}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              editable={!loading}
            />
            <TextInput 
              placeholder="Senha" 
              style={styles.input} 
              secureTextEntry 
              placeholderTextColor={theme.colors.textLight}
              value={password}
              onChangeText={setPassword}
              editable={!loading}
            />

            {message.text ? (
              <View style={[
                styles.messageContainer,
                message.type === 'error' ? styles.errorContainer : styles.successContainer
              ]}>
                <Text style={[
                  styles.messageText,
                  message.type === 'error' ? styles.errorText : styles.successText
                ]}>
                  {message.text}
                </Text>
              </View>
            ) : null}

            <TouchableOpacity 
              style={styles.forgotPassword}
              onPress={() => navigation.navigate('ForgotPassword')}
              disabled={loading}
            >
              <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.loginButton, loading && styles.loginButtonDisabled]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={theme.colors.white} />
              ) : (
                <Text style={styles.loginButtonText}>Entrar</Text>
              )}
            </TouchableOpacity>

            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Não tem uma conta? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')} disabled={loading}>
                <Text style={styles.registerLink}>Registre-se</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    padding: theme.spacing.lg,
    justifyContent: 'center',
  },
  formContainer: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    shadowColor: theme.colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logo: {
    width: 200,
    height: 100,
    alignSelf: 'center',
    marginBottom: theme.spacing.xl,
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textLight,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  form: {
    width: '100%',
  },
  input: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    fontSize: theme.typography.body.fontSize,
    borderWidth: 1,
    borderColor: theme.colors.lightGray,
  },
  messageContainer: {
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
  },
  errorContainer: {
    backgroundColor: '#FFE5E5',
  },
  successContainer: {
    backgroundColor: '#E5FFE5',
  },
  messageText: {
    ...theme.typography.body,
    textAlign: 'center',
  },
  errorText: {
    color: theme.colors.lotacao?.lotado || '#B00020',
  },
  successText: {
    color: theme.colors.lotacao?.baixa || '#007E33',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: theme.spacing.lg,
  },
  forgotPasswordText: {
    color: theme.colors.secondary,
    fontSize: theme.typography.caption.fontSize,
  },
  loginButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: theme.colors.white,
    fontSize: theme.typography.body.fontSize,
    fontWeight: 'bold',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    color: theme.colors.textLight,
    fontSize: theme.typography.body.fontSize,
  },
  registerLink: {
    color: theme.colors.secondary,
    fontSize: theme.typography.body.fontSize,
    fontWeight: 'bold',
  },
});
