import React from 'react';
import { View, Text, Button, StyleSheet, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

const UserProfileScreen: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { username, location, fruit } = params;

  const handleLogout = () => {
    router.push('/');
  };

  const getCurrentDate = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Los meses comienzan desde 0
    const year = today.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Image source={require('../../assets/images/hoja2.png')} style={styles.image} />
        <Button title="Cerrar Sesion" onPress={handleLogout} color="#FF0000" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.text}>Locacion: {location}</Text>
        <Text style={styles.text}>Fruta: {fruit}</Text>
        <Text style={styles.text}>Fecha: {getCurrentDate()}</Text>
        <Text style={styles.text}>Operador: {username}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: '#E9E4E4',
    paddingHorizontal: 20,
  },
  textContainer: {
    alignItems: 'flex-start',
    marginBottom: -10,
  },
  text: {
    fontSize: 16,
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 10,
  },
  image: {
    width: '80%', // La imagen ocupará el 80% del ancho del contenedor
    height: undefined, // Permite que la altura se ajuste automáticamente
    aspectRatio: 1, // Mantiene la relación de aspecto 1:1
    alignSelf: 'center',
    marginBottom: 20,
  },
});

export default UserProfileScreen;
