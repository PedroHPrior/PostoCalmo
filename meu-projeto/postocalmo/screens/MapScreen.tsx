import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity, SafeAreaView, Modal, Switch } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { theme } from '../constants/theme';

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

// Dados de exemplo dos postos
const postosExemplo = [
  {
    id: 1,
    nome: 'Posto Exemplo 1',
    lotacao: 100,
    latitude: -23.55052,
    longitude: -46.633308,
    distancia: '2km',
    tempoEspera: '20min'
  },
  {
    id: 2,
    nome: 'Posto Exemplo 2',
    lotacao: 40,
    latitude: -23.551,
    longitude: -46.632,
    distancia: '3km',
    tempoEspera: '15min'
  },
  {
    id: 3,
    nome: 'Posto Exemplo 3',
    lotacao: 0,
    latitude: -23.552,
    longitude: -46.631,
    distancia: '5km',
    tempoEspera: '0min'
  }
];

export default function MapScreen() {
  const [filtros, setFiltros] = useState({
    lotado: true,
    alta: true,
    media: true,
    baixa: true,
    distancia: 5, // km
  });

  const [modalFiltros, setModalFiltros] = useState(false);

  const postosFiltrados = postosExemplo.filter(posto => {
    if (posto.lotacao > 95 && !filtros.lotado) return false;
    if (posto.lotacao >= 65 && !filtros.alta) return false;
    if (posto.lotacao >= 30 && !filtros.media) return false;
    if (posto.lotacao < 30 && !filtros.baixa) return false;
    return true;
  });

  const notificacoesFiltradas = postosFiltrados.map(posto => ({
    id: posto.id,
    texto: `⚠️ ${posto.nome} com ${getLotacaoText(posto.lotacao)} Lotação`,
    subtexto: `${posto.distancia} de distância${posto.tempoEspera !== '0min' ? ` • Tempo de espera: ${posto.tempoEspera}` : ' • Sem fila'}`,
    lotacao: posto.lotacao
  }));

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Postos Disponíveis</Text>
        <Text style={styles.headerSubtitle}>Encontre o posto mais próximo de você</Text>
      </View>

      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: -23.55052,
          longitude: -46.633308,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        customMapStyle={[
          {
            featureType: "all",
            elementType: "labels.text.fill",
            stylers: [{ color: theme.colors.primary }]
          },
          {
            featureType: "all",
            elementType: "labels.text.stroke",
            stylers: [{ color: theme.colors.white }]
          }
        ]}
      >
        {postosFiltrados.map(posto => (
          <Marker 
            key={posto.id}
            coordinate={{ latitude: posto.latitude, longitude: posto.longitude }} 
            title={posto.nome}
            description={`Lotação: ${posto.lotacao}%`}
            pinColor={getLotacaoColor(posto.lotacao)}
          />
        ))}
      </MapView>

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
          {notificacoesFiltradas.map(notificacao => (
            <TouchableOpacity 
              key={notificacao.id}
              style={[styles.notificationItem, { borderLeftColor: getLotacaoColor(notificacao.lotacao) }]}
            >
              <View style={styles.notificationContent}>
                <Text style={styles.notificationText}>{notificacao.texto}</Text>
                <Text style={styles.notificationSubtext}>{notificacao.subtexto}</Text>
              </View>
              <View style={[styles.notificationBadge, { backgroundColor: getLotacaoColor(notificacao.lotacao) }]}>
                <Text style={styles.notificationBadgeText}>{getLotacaoText(notificacao.lotacao)}</Text>
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
              <Text style={styles.filterLabel}>Mostrar Postos Lotados</Text>
              <Switch
                value={filtros.lotado}
                onValueChange={(value) => setFiltros(prev => ({ ...prev, lotado: value }))}
                trackColor={{ false: theme.colors.lightGray, true: theme.colors.lotacao.lotado }}
              />
            </View>

            <View style={styles.filterItem}>
              <Text style={styles.filterLabel}>Mostrar Alta Lotação</Text>
              <Switch
                value={filtros.alta}
                onValueChange={(value) => setFiltros(prev => ({ ...prev, alta: value }))}
                trackColor={{ false: theme.colors.lightGray, true: theme.colors.lotacao.alta }}
              />
            </View>

            <View style={styles.filterItem}>
              <Text style={styles.filterLabel}>Mostrar Média Lotação</Text>
              <Switch
                value={filtros.media}
                onValueChange={(value) => setFiltros(prev => ({ ...prev, media: value }))}
                trackColor={{ false: theme.colors.lightGray, true: theme.colors.lotacao.media }}
              />
            </View>

            <View style={styles.filterItem}>
              <Text style={styles.filterLabel}>Mostrar Baixa Lotação</Text>
              <Switch
                value={filtros.baixa}
                onValueChange={(value) => setFiltros(prev => ({ ...prev, baixa: value }))}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  filterLabel: {
    ...theme.typography.body,
    color: theme.colors.primary,
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
