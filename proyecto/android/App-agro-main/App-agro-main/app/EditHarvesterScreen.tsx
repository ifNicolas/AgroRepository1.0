import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useHarvesterContext } from './HarvesterContext';

type Harvester = {
  nombre_cosechador: string;
  rut_cosechador: string;
};

const EditHarvesterScreen: React.FC = () => {
  const router = useRouter();
  const { nombre_cosechador: initialName, rut_cosechador: initialRut } = useLocalSearchParams<{ nombre_cosechador: string, rut_cosechador: string }>();
  const [nombre_cosechador, setNombreCosechador] = useState(initialName);
  const [rut_cosechador, setRutCosechador] = useState(initialRut);
  const { updateHarvester } = useHarvesterContext();

  const handleSave = () => {
    if (nombre_cosechador && rut_cosechador) {
      updateHarvester({ nombre_cosechador, rut_cosechador });
      Alert.alert('Información', 'Usuario actualizado');
      
      router.back();
    } else {
      Alert.alert('Error', 'Debe ingresar un nombre y un RUT');
    }
  };

  return (
    <View style={styles.container}>
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
      <Button title="Guardar" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    backgroundColor: 'white',
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

export default EditHarvesterScreen;
