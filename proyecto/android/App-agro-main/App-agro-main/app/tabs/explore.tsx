import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, Switch, TouchableOpacity, Modal, TextInput, Button } from 'react-native';

interface Bin {
  id: string;
  name: string;
  completed: boolean;
  percentage: number | null;
}

const binData: Bin[] = [
  { id: '1', name: 'Bin 1', completed: false, percentage: null },
  { id: '2', name: 'Bin 2', completed: false, percentage: null },
 
  
];

export default function App() {
  const [bins, setBins] = useState<Bin[]>(binData);
  const [modalVisible, setModalVisible] = useState(false);
  const [newBinName, setNewBinName] = useState('');
  const [newBinCompleted, setNewBinCompleted] = useState(false);
  const [newBinPercentage, setNewBinPercentage] = useState<number | null>(null);

  const handleCompletionToggle = (id: string): void => {
    setBins(bins.map(bin => 
      bin.id === id 
        ? { ...bin, completed: !bin.completed, percentage: bin.completed ? null : bin.percentage } 
        : bin
    ));
  };

  const handlePercentageSelection = (id: string, percentage: number): void => {
    setBins(bins.map(bin => 
      bin.id === id 
        ? { ...bin, percentage } 
        : bin
    ));
  };

  const addNewBin = () => {
    if (newBinName === '') return;
    const newBin: Bin = {
      id: (bins.length + 1).toString(),
      name: newBinName,
      completed: newBinCompleted,
      percentage: newBinCompleted ? null : newBinPercentage
    };
    setBins([...bins, newBin]);
    setModalVisible(false);
    setNewBinName('');
    setNewBinCompleted(false);
    setNewBinPercentage(null);
  };

  const renderItem = ({ item }: { item: Bin }) => (
    <View style={styles.item}>
      <Text style={styles.title}>{item.name}</Text>
      <Switch
        onValueChange={() => handleCompletionToggle(item.id)}
        value={item.completed}
        trackColor={{ false: "#767577", true: "#2ECC71" }}
        thumbColor={item.completed ? "#2ECC71" : "#f4f3f4"}
      />
      {!item.completed && (
        <View style={styles.percentageContainer}>
          <TouchableOpacity onPress={() => handlePercentageSelection(item.id, 0.8)}>
            <Text style={[styles.percentageButton, item.percentage === 0.8 && styles.selected]}>80%</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handlePercentageSelection(item.id, 0.5)}>
            <Text style={[styles.percentageButton, item.percentage === 0.5 && styles.selected]}>50%</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handlePercentageSelection(item.id, 0.3)}>
            <Text style={[styles.percentageButton, item.percentage === 0.3 && styles.selected]}>30%</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={bins}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>Agregar Bin</Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Agregar Nuevo Bin</Text>
          <TextInput
            style={styles.input}
            placeholder="Nombre del Bin"
            value={newBinName}
            onChangeText={setNewBinName}
          />
          <View style={styles.switchContainer}>
            <Text>Completado</Text>
            <Switch
              onValueChange={setNewBinCompleted}
              value={newBinCompleted}
              trackColor={{ false: "#767577", true: "#2ECC71" }}
              thumbColor={newBinCompleted ? "#2ECC71" : "#f4f3f4"}
            />
          </View>
          {!newBinCompleted && (
            <View style={styles.percentageContainer}>
              <TouchableOpacity onPress={() => setNewBinPercentage(0.8)}>
                <Text style={[styles.percentageButton, newBinPercentage === 0.8 && styles.selected]}>80%</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setNewBinPercentage(0.5)}>
                <Text style={[styles.percentageButton, newBinPercentage === 0.5 && styles.selected]}>50%</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setNewBinPercentage(0.3)}>
                <Text style={[styles.percentageButton, newBinPercentage === 0.3 && styles.selected]}>30%</Text>
              </TouchableOpacity>
            </View>
          )}
          <Button title="Agregar" onPress={addNewBin} />
          <Button title="Cancelar" onPress={() => setModalVisible(false)} color="#ff5c5c" />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
  },
  item: {
    backgroundColor: '#2ECC71',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 5,
    width: '90%',
    alignSelf: 'center',
  },
  title: {
    fontSize: 20,
    color: '#fff',
  },
  percentageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  percentageButton: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#fff',
    color: '#fff',
    textAlign: 'center',
  },
  selected: {
    backgroundColor: '#D7281A',
  },
  addButton: {
    backgroundColor: '#1A50D7',
    padding: 15,
    borderRadius: 5,
    position: 'absolute',
    bottom: 30,
    width: '90%',
    alignSelf: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    marginBottom: 15,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 15,
  },
});
