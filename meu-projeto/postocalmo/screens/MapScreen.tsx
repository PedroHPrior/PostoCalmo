import React from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default function MapScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Postos Disponíveis: 3</Text>

      <MapView
        style={styles.map}
        initialRegion={{
          latitude: -23.55052,
          longitude: -46.633308,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        <Marker coordinate={{ latitude: -23.55052, longitude: -46.633308 }} title="Posto Exemplo 1" />
        <Marker coordinate={{ latitude: -23.551, longitude: -46.632 }} title="Posto Exemplo 2" />
        <Marker coordinate={{ latitude: -23.552, longitude: -46.631 }} title="Posto Exemplo 3" />
      </MapView>

      <ScrollView style={styles.notifications}>
        <Text style={styles.notificationTitle}>Notificações</Text>
        <Text style={styles.notificationItem}>⚠️ Posto Próximo com Alta Prioridade</Text>
        <Text style={styles.notificationItem}>⚠️ Posto Exemplo 2 lotado</Text>
        <Text style={styles.notificationItem}>✔️ Posto Exemplo 3 disponível</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1e1e2f', padding: 10 },
  header: { fontSize: 18, color: '#fff', marginBottom: 8, textAlign: 'center' },
  map: { width: '100%', height: Dimensions.get('window').height * 0.5, borderRadius: 12 },
  notifications: { marginTop: 16, backgroundColor: '#2b2b3d', borderRadius: 12, padding: 12 },
  notificationTitle: { fontSize: 16, color: '#fff', marginBottom: 8 },
  notificationItem: { color: '#ccc', marginBottom: 4 },
});
