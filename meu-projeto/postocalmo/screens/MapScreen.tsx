import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity, SafeAreaView, Modal, Switch, ActivityIndicator, Alert } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { theme } from '../constants/theme';
import { API_URL } from '../constants/api';
import Slider from '@react-native-community/slider';

// Função auxiliar para determinar a cor baseada na lotação
const getLotacaoColor = (lotacao: number) => {
  if (lotacao > 95) return theme.colors.lotacao.lotado;
  if (lotacao >= 65) return theme.colors.lotacao.alta;
  if (lotacao >= 30) return theme.colors.lotacao.media;
  return theme.colors.lotacao.baixa;
};

// Função auxiliar para determinar o texto da lotação
const getLotacaoText = (lotacao: number) => {
  if (lotacao > 95) return 'Lotado';
  if (lotacao >= 65) return 'Alta';
  if (lotacao >= 30) return 'Média';
  return 'Baixa';
};

export default function MapScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [postos, setPostos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalFiltros, setModalFiltros] = useState(false);
  const [filtros, setFiltros] = useState({
    lotado: true,
    alta: true,
    media: true,
    baixa: true,
    distancia: 10, // km
  });
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permissão de localização negada.');
        setLoading(false);
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
    })();
  }, []);

  useEffect(() => {
    if (location) {
      fetchPostos();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, filtros]);

  const fetchPostos = async () => {
    setLoading(true);
    try {
      const lat = location?.coords.latitude;
      const lng = location?.coords.longitude;
      const radius = filtros.distancia * 1000;
      const res = await fetch(`${API_URL}/postos?lat=${lat}&lng=${lng}&radius=${radius}`);
      const data = await res.json();
      if (res.ok) {
        setPostos(data.postos);
      } else {
        setErrorMsg(data.message || 'Erro ao buscar postos.');
      }
    } catch (err) {
      setErrorMsg('Erro ao conectar ao servidor.');
    } finally {
      setLoading(false);
    }
  };

  // Função para obter a lotação do posto (exemplo: média dos serviços)
  const getPostoLotacao = (posto: any) => {
    if (!posto.services || posto.services.length === 0) return 0;
    // Supondo que cada serviço tem um campo waitingTime (quanto maior, mais lotado)
    // Aqui você pode adaptar para o seu critério de lotação
    const max = Math.max(...posto.services.map((s: any) => s.waitingTime || 0));
    if (max > 60) return 100; // lotado
    if (max >= 30) return 70; // alta
    if (max >= 10) return 40; // média
    return 10; // baixa
  };

  const postosFiltrados = postos.filter(posto => {
    const lotacao = getPostoLotacao(posto);
    if (lotacao > 95 && !filtros.lotado) return false;
    if (lotacao >= 65 && !filtros.alta) return false;
    if (lotacao >= 30 && !filtros.media) return false;
    if (lotacao < 30 && !filtros.baixa) return false;
    return true;
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Postos de Saúde Próximos</Text>
        <Text style={styles.headerSubtitle}>Encontre o posto mais próximo de você</Text>
      </View>

      {loading || !location ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={{ marginTop: 16, color: theme.colors.primary }}>Carregando mapa...</Text>
          {errorMsg ? <Text style={{ color: 'red', marginTop: 8 }}>{errorMsg}</Text> : null}
        </View>
      ) : (
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.09, // Aproxima para ~10km
            longitudeDelta: 0.09,
          }}
          region={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.09,
            longitudeDelta: 0.09,
          }}
          showsUserLocation
        >
          {postosFiltrados.map((posto, idx) => (
            <Marker
              key={posto._id || idx}
              coordinate={{
                latitude: posto.location.coordinates[1],
                longitude: posto.location.coordinates[0],
              }}
              title={posto.name}
              description={posto.address}
              pinColor={theme.colors.primary}
            />
          ))}
        </MapView>
      )}

      <View style={styles.notificationsContainer}>
        <View style={styles.notificationsHeader}>
          <Text style={styles.notificationsTitle}>Notificações</Text>
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => setModalFiltros(true)}
          >
            <Text style={styles.filterButtonText}>Filtrar</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.notifications}>
          {postosFiltrados.map((posto, idx) => (
            <TouchableOpacity 
              key={posto._id || idx}
              style={[styles.notificationItem, { borderLeftColor: theme.colors.primary }]}
            >
              <View style={styles.notificationContent}>
                <Text style={styles.notificationText}>{posto.name}</Text>
                <Text style={styles.notificationSubtext}>{posto.address}</Text>
              </View>
              <View style={[styles.notificationBadge, { backgroundColor: theme.colors.primary }]}> 
                <Text style={styles.notificationBadgeText}>Ver</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <Modal
        visible={modalFiltros}
        transparent
        animationType="slide"
        onRequestClose={() => setModalFiltros(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filtros</Text>
            <View style={styles.filterItem}>
              <Text style={styles.filterLabel}>Distância (km):</Text>
              <View style={styles.sliderContainer}>
                <Slider
                  style={styles.slider}
                  minimumValue={1}
                  maximumValue={20}
                  step={1}
                  value={filtros.distancia}
                  onValueChange={value => setFiltros(prev => ({ ...prev, distancia: value }))}
                  minimumTrackTintColor={theme.colors.primary}
                  maximumTrackTintColor={theme.colors.lightGray}
                  thumbTintColor={theme.colors.primary}
                />
                <Text style={styles.sliderValue}>{Math.round(filtros.distancia)} km</Text>
              </View>
            </View>
            <View style={styles.filterItem}>
              <Text style={styles.filterLabel}>Mostrar Postos Lotados</Text>
              <Switch
                value={filtros.lotado}
                onValueChange={value => setFiltros(prev => ({ ...prev, lotado: value }))}
                trackColor={{ false: theme.colors.lightGray, true: theme.colors.lotacao.lotado }}
              />
            </View>
            <View style={styles.filterItem}>
              <Text style={styles.filterLabel}>Mostrar Alta Lotação</Text>
              <Switch
                value={filtros.alta}
                onValueChange={value => setFiltros(prev => ({ ...prev, alta: value }))}
                trackColor={{ false: theme.colors.lightGray, true: theme.colors.lotacao.alta }}
              />
            </View>
            <View style={styles.filterItem}>
              <Text style={styles.filterLabel}>Mostrar Média Lotação</Text>
              <Switch
                value={filtros.media}
                onValueChange={value => setFiltros(prev => ({ ...prev, media: value }))}
                trackColor={{ false: theme.colors.lightGray, true: theme.colors.lotacao.media }}
              />
            </View>
            <View style={styles.filterItem}>
              <Text style={styles.filterLabel}>Mostrar Baixa Lotação</Text>
              <Switch
                value={filtros.baixa}
                onValueChange={value => setFiltros(prev => ({ ...prev, baixa: value }))}
                trackColor={{ false: theme.colors.lightGray, true: theme.colors.lotacao.baixa }}
              />
            </View>
            <TouchableOpacity 
              style={styles.modalButton}
              onPress={() => setModalFiltros(false)}
            >
              <Text style={styles.modalButtonText}>Aplicar Filtros</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.primary,
    borderBottomLeftRadius: theme.borderRadius.lg,
    borderBottomRightRadius: theme.borderRadius.lg,
    shadowColor: theme.colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerTitle: {
    ...theme.typography.h1,
    color: theme.colors.white,
    marginBottom: theme.spacing.xs,
    fontWeight: '700',
  },
  headerSubtitle: {
    ...theme.typography.body,
    color: theme.colors.white,
    opacity: 0.9,
    fontWeight: '500',
  },
  map: {
    width: '100%',
    height: Dimensions.get('window').height * 0.5,
  },
  notificationsContainer: {
    flex: 1,
    backgroundColor: theme.colors.white,
    borderTopLeftRadius: theme.borderRadius.lg,
    borderTopRightRadius: theme.borderRadius.lg,
    marginTop: -theme.spacing.lg,
    padding: theme.spacing.lg,
    shadowColor: theme.colors.black,
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  notificationsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  notificationsTitle: {
    ...theme.typography.h2,
    color: theme.colors.primary,
    fontWeight: '700',
  },
  filterButton: {
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.lightGray,
  },
  filterButtonText: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  notifications: {
    flex: 1,
  },
  notificationItem: {
    flexDirection: 'row',
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.lightGray,
    alignItems: 'center',
    borderLeftWidth: 4,
  },
  notificationContent: {
    flex: 1,
  },
  notificationText: {
    ...theme.typography.body,
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
    fontWeight: '600',
  },
  notificationSubtext: {
    ...theme.typography.caption,
    color: theme.colors.textLight,
  },
  notificationBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    marginLeft: theme.spacing.sm,
  },
  notificationBadgeText: {
    color: theme.colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    width: '80%',
    maxWidth: 400,
  },
  modalTitle: {
    ...theme.typography.h2,
    color: theme.colors.primary,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  filterItem: {
    flexDirection: 'column',
    marginBottom: theme.spacing.md,
  },
  filterLabel: {
    ...theme.typography.body,
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  slider: {
    flex: 1,
    height: 40,
  },
  sliderValue: {
    width: 60,
    textAlign: 'right',
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginLeft: theme.spacing.sm,
  },
  modalButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    marginTop: theme.spacing.md,
  },
  modalButtonText: {
    color: theme.colors.white,
    fontSize: theme.typography.body.fontSize,
    fontWeight: 'bold',
  },
});
