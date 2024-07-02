import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Modal, Button } from 'react-native';
import { Picker } from '@react-native-picker/picker';  // Importa el nuevo paquete
import { Link, useRouter } from 'expo-router';

const IndexScreen = () => {
  const router = useRouter();

  

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [location, setLocation] = useState('');
  const [fruit, setFruit] = useState('');

  const predefinedUser = {
    username: 'Admin',
    password: '12345'
  };

  const handleLogin = () => {
    if (username.trim() === '' || password.trim() === '') {
      alert('Por favor, complete ambos campos');
      return;
    }

    if (username === predefinedUser.username && password === predefinedUser.password) {
      setModalVisible(true);
    } else {
      alert('Usuario o contraseña incorrectos');
    }
  };

  const handleSaveSelection = () => {
    if (location && fruit) {
      setModalVisible(false);
      router.push({
        pathname: '/tabs',
        params: { username, location, fruit }
      });
    } else {
      alert('Por favor, seleccione una ubicación y una fruta');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/images/hoja.png')} style={styles.image} />
      <Text style={styles.mainTitle}>Bienvenido a AgroCheck</Text>
      <Text style={styles.title}>Iniciar Sesión</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Usuario</Text>
        <TextInput
          style={styles.input}
          placeholder="Ingrese su usuario"
          value={username}
          onChangeText={(text) => setUsername(text)}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Contraseña</Text>
        <TextInput
          style={styles.input}
          placeholder="Ingrese su contraseña"
          secureTextEntry={true}
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Iniciar Sesión</Text>
      </TouchableOpacity>
      <Link href="/registro">
        <Text style={styles.link}>¿No tienes una cuenta? Regístrate aquí</Text>
      </Link>

      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Seleccione Ubicación y Fruta</Text>
            <Text>Ubicación:</Text>
            <Picker
              selectedValue={location}
              style={styles.picker}
              onValueChange={(itemValue: string) => setLocation(itemValue)} // Especificar el tipo de itemValue
            >
              <Picker.Item label="Talca" value="ubicacion1" />
              <Picker.Item label="San javier" value="ubicacion2" />
              <Picker.Item label="Linares" value="ubicacion3" />
            </Picker>
            <Text>Fruta:</Text>
            <Picker
              selectedValue={fruit}
              style={styles.picker}
              onValueChange={(itemValue: string) => setFruit(itemValue)} // Especificar el tipo de itemValue
            >
              <Picker.Item label="Frambuesas" value="fruta1" />
              <Picker.Item label="Uvas" value="fruta2" />
              <Picker.Item label="Frutillas" value="fruta3" />
            </Picker>
            <Button title="Guardar" onPress={handleSaveSelection} />
            <Button title="Cancelar" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2ECC71',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  mainTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  input: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2ECC71',
  },
  link: {
    color: 'white',
    textAlign: 'center',
    marginTop: 20,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginBottom: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  picker: {
    height: 60,
    width: 250,
    marginBottom: 20,
  },
});

export default IndexScreen;
