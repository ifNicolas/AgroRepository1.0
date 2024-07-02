import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button, TouchableOpacity, Linking, FlatList, TextInput, Alert, Platform, ToastAndroid } from "react-native";
import { CameraView, Camera } from 'expo-camera';
import { useRouter } from 'expo-router';
import { useHarvesterContext } from '../HarvesterContext';
import QRCode from 'react-native-qrcode-svg';
import axios from 'axios';
import { Harvester } from '../HarvesterContext';  // Asegúrate de que la ruta sea correcta

export default function DashboardScreen() {
  const [hasPermission, setHasPermission] = useState<null | boolean>(null);
  const [scanned, setScanned] = useState(false);
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter(); 
  const { harvesters, setHarvesters } = useHarvesterContext();

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getCameraPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    setScanned(true);
    setScannedData(data);

    // Incrementa el contador de escaneos para el usuario específico
    setHarvesters((prevHarvesters: Harvester[]) =>
      prevHarvesters.map((harvester: Harvester) => {
        if (`${harvester.nombre_cosechador} ${harvester.rut_cosechador}` === data) {
          return { ...harvester, scanCount: (harvester.scanCount || 0) + 1 };
        }
        return harvester;
      })
    );
  };

  const handleOpenLink = () => {
    if (scannedData) {
      Linking.openURL(scannedData);
    }
  };

  const handleLogout = () => {
    router.push('(tabs)/close'); 
  };

  const handleAddHarvester = async (newHarvester: Harvester) => {
    try {
      const response = await axios.post('http://localhost:3000/api/crearCosechador', newHarvester);
      console.log('Data sent successfully:', response.data);
      setHarvesters((prevHarvesters: Harvester[]) => [...prevHarvesters, response.data]);
      if (Platform.OS === 'android') {
        ToastAndroid.show('Nuevo usuario agregado', ToastAndroid.SHORT);
      } else {
        Alert.alert('Información', 'Nuevo usuario agregado');
      }
    } catch (error) {
      console.error('Error sending data:', error);
      Alert.alert('Error', 'No se pudo agregar el cosechador');
    }
  };

  const renderItem = ({ item }: { item: Harvester }) => (
    <TouchableOpacity onPress={() => handleAddHarvester(item)}>
      <View style={styles.harvesterItem}>
        <View style={styles.harvesterInfo}>
          <Text>Nombre: {item.nombre_cosechador}</Text>
          <Text>RUT: {item.rut_cosechador}</Text>
          <Text>Scans: {item.scanCount || 0}</Text>
        </View>
        <QRCode value={`${item.nombre_cosechador} ${item.rut_cosechador}`} size={50} />
      </View>
    </TouchableOpacity>
  );

  const filteredHarvesters = harvesters.filter((harvester) =>
    harvester.nombre_cosechador.toLowerCase().includes(searchQuery.toLowerCase()) ||
    harvester.rut_cosechador.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Usuario</Text>
      </TouchableOpacity>
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        data={filteredHarvesters}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        style={{ marginTop: 30 }}
      />
      {scanned && (
        <View style={styles.fullScreenCamera}>
          <CameraView
            onBarcodeScanned={handleBarCodeScanned}
            barcodeScannerSettings={{
              barcodeTypes: ["qr", "pdf417"],
            }}
            style={StyleSheet.absoluteFill}
          />
          {scannedData && (
            <TouchableOpacity style={styles.linkButton} onPress={handleOpenLink}>
              <Text style={styles.linkText}>{scannedData}</Text>
            </TouchableOpacity>
          )}
          <Button title={"Devuélvete al inicio"} onPress={() => setScanned(false)} />
        </View>
      )}
      {!scanned && (
        <TouchableOpacity style={styles.scanButton} onPress={() => setScanned(true)}>
          <Text style={styles.scanButtonText}>Escanea el QR</Text>
        </TouchableOpacity>
      )}
      <Button title="Agregar Cosechador" onPress={() => handleAddHarvester({ nombre_cosechador: "jose castillo", rut_cosechador: "189872345" })} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  logoutButton: {
    position: 'absolute',
    top: 40,
    left: 5,
    padding: 6,
    backgroundColor: '#2ECC71',
    borderRadius: 5,
    // Asegura que el botón esté por encima de otros elementos
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  fullScreenCamera: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  linkButton: {
    marginVertical: 40,
    padding: 20,
    backgroundColor: "#007bff",
    borderRadius: 5,
    alignSelf: "center",
  },
  linkText: {
    color: "#fff",
    fontWeight: "bold",
  },
  scanButton: {
    position: 'absolute',
    bottom: 30, // Puedes ajustar esta posición para colocar el botón más abajo
    left: 20,
    padding: 15,
    backgroundColor: '#1A50D7',
    borderRadius: 5,
    width: '90%',
    alignSelf: 'center',
    alignItems: 'center',
  },
  scanButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  searchInput: {
    marginHorizontal: 75,
    marginTop: 35,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
  },
  harvesterItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  harvesterInfo: {
    flex: 1,
    marginRight: 10,
  },
});
