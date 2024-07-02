import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Button, Alert, ToastAndroid, Platform } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useHarvesterContext } from '../HarvesterContext';

const HarvesterForm: React.FC = () => {
  const [nombre_cosechador, setNombreCosechador] = useState('');
  const [rut_cosechador, setRutCosechador] = useState('');
  const { addHarvester } = useHarvesterContext();

  const handleAddHarvester = () => {
    if (nombre_cosechador && rut_cosechador) {
      addHarvester({ nombre_cosechador, rut_cosechador });
      if (Platform.OS === 'android') {
        ToastAndroid.show('Nuevo usuario agregado', ToastAndroid.SHORT);
      } else {
        Alert.alert('Información', 'Nuevo usuario agregado');
      }
      setNombreCosechador('');
      setRutCosechador('');
    } else {
      Alert.alert('Error', 'Debe ingresar un nombre y un RUT');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Código QR</Text>
      <View style={styles.qrContainer}>
        <QRCode value={nombre_cosechador + ' ' + rut_cosechador} size={200} />
      </View>
      <Text style={styles.label}>Nombre</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingrese el nombre"
        value={nombre_cosechador}
        onChangeText={setNombreCosechador}
      />
      <Text style={styles.label}>RUT</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingrese el RUT"
        value={rut_cosechador}
        onChangeText={setRutCosechador}
      />
      <Button title="Agregar" onPress={handleAddHarvester} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  qrContainer: {
    marginVertical: 20,
  },
  label: {
    fontSize: 18,
    marginVertical: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    width: '100%',
    marginBottom: 20,
  },
});

export default HarvesterForm;