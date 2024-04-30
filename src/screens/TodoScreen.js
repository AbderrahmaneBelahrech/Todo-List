import { Modal, StyleSheet, View, TouchableOpacity, Text, TextInput, Button, ActivityIndicator, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'; // Make sure you have expo or the specific icon library installed
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';

const TodoScreen = () => {
  const [tasks, setTasks] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newTask, setNewTask] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://192.168.1.102:8080/api/tasks');
      const filteredTasks = response.data.filter(task => task.status === 'TO_DO');
      setTasks(filteredTasks);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTask = async () => {
    if (newTask.trim() && taskDescription.trim() && date) {
      // Logic to add the task
      try {
        const response = await axios.post('http://192.168.1.102:8080/api/tasks', {
          name: newTask,
          description: taskDescription,
          dueDate: date.toISOString(),
          status: 'TO_DO'
        });
        if (response.status === 200 || response.status === 201) {
          alert('Task added successfully!');
          fetchTasks(); // Reload the task list
        }
      } catch (error) {
        console.error('Failed to add task:', error);
        alert('Failed to add task!');
      }
      setModalVisible(false); // Close the modal after adding the task
      // Reset form fields
      setNewTask('');
      setTaskDescription('');
      setDate(new Date()); // Reset date to current
    } else {
      alert('Please fill all fields.');
    }
  };
  
  const showDatepicker = () => {
    setShowDatePicker(true); // Ensure this sets the picker to show
  };
  
  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date; // Use selected date or fallback to current
    setShowDatePicker(false); // Hide date picker
    if (selectedDate) {
      setDate(currentDate); // Update date only if selected
    }
  };


  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.taskCard}>
      <View style={styles.taskCheckbox}>
        <Ionicons name="checkbox-outline" size={24} color="#5DB075" />
      </View>
      <View style={styles.taskDetails}>
        <Text style={styles.taskName}>{item.name}</Text>
        <Text style={styles.taskDescription}>{item.description}</Text>
        <Text style={styles.dueTime}>{new Date(item.dueDate).toLocaleDateString()} | {new Date(item.dueDate).toLocaleTimeString()}</Text>
      </View>
      <TouchableOpacity style={styles.taskOptions}>
        <Ionicons name="ellipsis-vertical" size={20} color="black" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <FlatList
        data={tasks}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        ListEmptyComponent={<View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text style={{fontWeight: 'bold'}}>Not tasks to do</Text>
    </View>}
      />
      

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TextInput
              placeholder="Enter task name"
              value={newTask}
              onChangeText={setNewTask}
              style={styles.taskInput}
            />
            <TextInput
              placeholder="Enter description"
              value={taskDescription}
              onChangeText={setTaskDescription}
              style={styles.taskInput}
              multiline
            />
            <Text style={styles.dateText} key={date.toString()}>
              {date.toLocaleDateString()}
            </Text>
            <View style={styles.datePickerContainer}>
              <Button onPress={showDatepicker} title="Select Date" />
              {showDatePicker && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={date}
                  mode="date"
                  is24Hour={true}
                  display="default"
                  onChange={onChangeDate}
                  minimumDate={new Date()}
                />
              )}
              

            </View>
            <View style={styles.buttonsRow}>
              <Button title="Add Task" onPress={handleAddTask} />
              <Button title="Cancel" onPress={() => setModalVisible(false)} color="#FF6347" />
            </View>
          </View>
        </View>
      </Modal>

      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
    </View>
  )
}

export default TodoScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F1F3',
  },
  taskCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 8,
    marginVertical: 4,
    marginHorizontal: 16,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOpacity: 0.8,
    elevation: 6,
    shadowRadius: 15,
    shadowOffset: { width: 1, height: 13 },
  },
  taskCheckbox: {
    marginRight: 15,
    justifyContent: 'center',
  },
  taskDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  taskOptions: {
    justifyContent: 'center',
    padding: 10,
  },
  taskName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  taskDescription: {
    fontSize: 14,
    color: '#6e6e6e',
    marginVertical: 5,
  },
  dueTime: {
    fontSize: 12,
    color: '#aaa',
  },
  fab: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: 16,
    width: 56,
    height: 56,
    backgroundColor: '#0066CC',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    width: '90%',
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  taskInput: {
    width: '100%',
      // Ensures full width usage
    marginBottom: 15,
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    textAlignVertical: 'top',  // Aligns text to the top for multi-line input
  },
  dateText: {
    fontSize: 16,
    color: '#4A90E2',  // A pleasant blue tone, you can choose any color
    marginBottom: 20,
    fontWeight: 'bold',
    padding: 10,
    backgroundColor: '#E7F1FF',  // Light blue background for the date display
    borderRadius: 10,
    overflow: 'hidden',  // Ensures the background does not bleed outside the border radius
    textAlign: 'center',  // Centers the text
  },
  datePickerContainer: {
    marginBottom: 20,
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
});
