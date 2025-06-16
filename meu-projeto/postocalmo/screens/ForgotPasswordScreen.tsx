import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, SafeAreaView, Image, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { theme } from '../constants/theme';

type MessageType = 'error' | 'success' | null;

export default function ForgotPasswordScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: MessageType }>({ text: '', type: null });

  const handleSendEmail = async () => {
    if (!email) {
      setMessage({ text: 'Por favor, insira seu e-mail', type: 'error' });
      return;
    }

    // Validação básica de e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage({ text: 'Por favor, insira um e-mail válido', type: 'error' });
      return;
    }

    setLoading(true);
    setMessage({ text: '', type: null });

    try {
      // Simulando o envio do e-mail
      await new Promise(resolve => setTimeout(resolve, 2000));

      setMessage({ 
        text: 'E-mail enviado com sucesso! Redirecionando...', 
        type: 'success' 
      });

      // Aguarda 2 segundos antes de redirecionar
      setTimeout(() => {
        navigation.navigate('Login');
      }, 2000);

    } catch (error) {
      setMessage({ 
        text: 'Não foi possível enviar o e-mail. Por favor, tente novamente.', 
        type: 'error' 
      });
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
          
          <Text style={styles.title}>Recuperar Senha</Text>
          <Text style={styles.subtitle}>Digite seu email para receber as instruções</Text>

          <View style={styles.form}>
            <TextInput 
              placeholder="Email" 
              style={[
                styles.input,
                message.type === 'error' && styles.inputError
              ]} 
              placeholderTextColor={theme.colors.textLight}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setMessage({ text: '', type: null });
              }}
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
              style={[
                styles.sendButton, 
                loading && styles.sendButtonDisabled,
                message.type === 'error' && styles.sendButtonError
              ]}
              onPress={handleSendEmail}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={theme.colors.white} />
              ) : (
                <Text style={styles.sendButtonText}>Enviar</Text>
              )}
            </TouchableOpacity>

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Lembrou sua senha? </Text>
              <TouchableOpacity 
                onPress={() => navigation.navigate('Login')}
                disabled={loading}
              >
                <Text style={styles.loginLink}>Voltar ao login</Text>
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
  inputError: {
    borderColor: theme.colors.lotacao.lotado,
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
    color: theme.colors.lotacao.lotado,
  },
  successText: {
    color: theme.colors.lotacao.baixa,
  },
  sendButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  sendButtonDisabled: {
    opacity: 0.7,
  },
  sendButtonError: {
    backgroundColor: theme.colors.lotacao.lotado,
  },
  sendButtonText: {
    color: theme.colors.white,
    fontSize: theme.typography.body.fontSize,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    color: theme.colors.textLight,
    fontSize: theme.typography.body.fontSize,
  },
  loginLink: {
    color: theme.colors.secondary,
    fontSize: theme.typography.body.fontSize,
    fontWeight: 'bold',
  },
}); 