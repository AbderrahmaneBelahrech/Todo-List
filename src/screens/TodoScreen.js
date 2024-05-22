import { Modal, StyleSheet, View, TouchableOpacity, Text, TextInput, Button, ActivityIndicator, FlatList, RefreshControl } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Ionicons, MaterialIcons, AntDesign } from '@expo/vector-icons'; // Make sure you have expo or the specific icon library installed
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Dropdown } from 'react-native-element-dropdown';
import PopupMenu from '../components/PopupMenu';

const priority = [
  { label: 'Low', value: 'LOW' },
  { label: 'Medium', value: 'MEDIUM' },
  { label: 'High', value: 'HIGH' },
];

const TodoScreen = ({route}) => {
  const { name, id } = route.params;
  const [refreshing, setRefreshing] = useState(false);
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newTask, setNewTask] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [emails, setEmails] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);

  useEffect(() => {
    fetchTasks();
    fetchGroups();
  }, []);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      // Fetch tasks as the owner
      const ownerResponse = await axios.get(`http://192.168.1.102:8080/api/tasks/user/${id}`);
      let ownerTasks = Array.isArray(ownerResponse.data) ? ownerResponse.data.filter(task => task.status === 'TO_DO') : [];
  
      // Fetch tasks as a group member
      const groupResponse = await axios.get(`http://192.168.1.102:8080/api/tasks/group/user/${id}`);
      let groupTasks = Array.isArray(groupResponse.data) ? groupResponse.data.filter(task => task.status === 'TO_DO') : [];
  
      // Combine tasks and remove duplicates
      const combinedTasks = [...ownerTasks, ...groupTasks];
      const uniqueTasks = combinedTasks.filter((task, index, self) => index === self.findIndex(t => t.id === task.id));
  
      setTasks(uniqueTasks);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      setTasks([]);
    } finally {
      setIsLoading(false);
    }
  };
  

  const fetchGroups = async () => {
    try {
      const response = await axios.get(`http://192.168.1.102:8080/api/user-groups/user/${id}`);
      setGroups(response.data);
    } catch (error) {
      console.error('Failed to fetch groups:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchTasks();
      await fetchGroups();
    } catch (error) {
      console.error(error);
    } finally {
      setRefreshing(false);
    }
  };

  const moveTaskToInProgress = async (task) => {
    try {
      const updatedTask = { ...task, status: 'IN_PROGRESS' };
      await axios.put(`http://192.168.1.102:8080/api/tasks/update/${task.id}`, updatedTask);
      fetchTasks();
    } catch (error) {
      Alert.alert("Error moving task");
    }
  };

  const onDeleteTask = async (taskId) => {
    try {
      await axios.delete(`http://192.168.1.102:8080/api/tasks/delete/${taskId}`);
      fetchTasks();
    } catch (error) {
      console.error(error);
      Alert.alert("Error deleting task");
    }
  };

  const handleAddTask = async () => {
    if (newTask.trim() && taskDescription.trim() && date) {
      try {
        const taskData = {
          name: newTask,
          description: taskDescription,
          dueDate: date.toISOString(),
          owner: { id: id },
          status: 'TO_DO',
          priority: value,
          userGroup: selectedGroup ? { id: selectedGroup } : null,
        };

        const response = await axios.post('http://192.168.1.102:8080/api/tasks', taskData);

        if (response.status === 200 || response.status === 201) {
          alert('Task added successfully!');
          fetchTasks();
        }
      } catch (error) {
        console.error('Failed to add task:', error);
        alert('Failed to add task!');
      }
      setModalVisible(false);
      setNewTask('');
      setTaskDescription('');
      setDate(new Date());
      setSelectedGroup(null);
      setValue(null);
    } else {
      alert('Please fill all fields.');
    }
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(currentDate);
    }
  };

  const calculateTimeLeft = (dueDate) => {
    const now = new Date();
    const startOfToday = new Date(now.setHours(0, 0, 0, 0));
    const due = new Date(dueDate);
    const startOfDueDate = new Date(due.setHours(0, 0, 0, 0));
    const timeLeft = due - now;

    if (timeLeft < 0) {
      return "Past due";
    }

    const dayDifference = (startOfDueDate - startOfToday) / (1000 * 60 * 60 * 24);

    if (dayDifference === 0) {
      return "Due today";
    } else if (dayDifference === 1) {
      return "Due tomorrow";
    }

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);

    return `${days}d ${hours}h ${minutes}m left`;
  };

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'HIGH':
        return { color: '#F6454A' };
      case 'MEDIUM':
        return { color: 'orange' };
      case 'LOW':
        return { color: '#5B9BFF' };
      default:
        return { color: 'black' };
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.taskCard,
        item.userGroup ? styles.groupTask : {},
        { borderLeftWidth: 4, borderLeftColor: getPriorityStyle(item.priority).color }
      ]}
      onPress={() => setSelectedTask(item)}
    >
      <View style={styles.taskDetails}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
          <Text style={styles.taskName}>{item.name}</Text>
          <Text style={[styles.taskPrio, getPriorityStyle(item.priority)]}>{item.priority}</Text>
        </View>
        <Text style={styles.taskDescription}>{item.description}</Text>
        <Text style={styles.dueTime}>{new Date(item.dueDate).toLocaleDateString()} | {new Date(item.dueDate).toLocaleTimeString()}</Text>
        {item.userGroup && <Text style={styles.groupName}><Text style={{color: '#aaa'}}>Group Name:</Text> {item.userGroup.name}</Text>}
      </View>
      <View style={styles.taskOptions}>
        {selectedTask && selectedTask.id === item.id && (
          <PopupMenu
            task={selectedTask}
            onClose={() => setSelectedTask(null)}
            onMoveTask={moveTaskToInProgress}
            onDeleteTask={onDeleteTask}
            isToDoScreen={true}
            isOwner={selectedTask.owner.id === id} // Check if the logged-in user is the owner
          />
        )}
        <Text style={calculateTimeLeft(item.dueDate) === "Past due" ? styles.pastDue : styles.timeLeft}>
          {calculateTimeLeft(item.dueDate)}
        </Text>
      </View>
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
        ListEmptyComponent={<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontWeight: 'bold' }}>No tasks to do</Text>
        </View>}
        contentContainerStyle={{ paddingBottom: 80 }}
        refreshControl={
          <RefreshControl
            colors={['#0066CC', '#0066CC']}
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        }
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
            <Dropdown
              value={value}
              setValue={setValue}
              data={priority}
              style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              labelField="label"
              valueField="value"
            
              placeholder={!isFocus ? 'Select priority' : '...'}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={item => {
                setValue(item.value);
                setIsFocus(false);
              }}
              renderLeftIcon={() => (
                <AntDesign
                  style={styles.icon}
                  color={isFocus ? 'blue' : 'black'}
                  name="Safety"
                  size={20}
                />
              )}
            />
            <Dropdown
              value={selectedGroup}
              setValue={setSelectedGroup}
              data={groups.map(group => ({ label: group.name, value: group.id }))}
              style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              labelField="label"
              valueField="value"
              placeholder={!isFocus ? 'Select group (optional)' : '...'}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={item => {
                setSelectedGroup(item.value);
                setIsFocus(false);
              }}
              renderLeftIcon={() => (
                <AntDesign
                  style={styles.icon}
                  color={isFocus ? 'blue' : 'black'}
                  name="Safety"
                  size={20}
                />
              )}
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
        <Text style={styles.fabText}>Add a new task</Text>
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
  dropdown: {
    width: '100%',
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 10
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  icon: {
    marginRight: 5,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  taskCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderLeftWidth: 5,
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
  groupTask: {
    backgroundColor: '#FFDAB9',
  },
  timeLeft: {
    fontSize: 12,
    color: '#0066CC',
    marginTop: 5,
    textAlign: 'right'
  },
  pastDue: {
    fontSize: 12,
    color: '#D32F2F',
    marginTop: 5,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  taskDetails: {
    flex: 5,
    justifyContent: 'center',
  },
  taskOptions: {
    justifyContent: 'center',
    paddingLeft: 10,
  },
  taskName: {
    fontSize: 16,
    marginRight: 10,
    fontWeight: 'bold',
  },
  taskPrio: {
    fontSize: 14,
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
  groupName: {
    fontSize: 12,
    color: '#0066CC',
    fontWeight: 'bold',
    marginTop: 5,
  },
  fab: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: 16,
    width: '50%',
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
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 10,
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
    marginBottom: 15,
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    textAlignVertical: 'top',
  },
  dateText: {
    fontSize: 16,
    color: '#4A90E2',
    marginBottom: 20,
    fontWeight: 'bold',
    padding: 10,
    backgroundColor: '#E7F1FF',
    borderRadius: 10,
    overflow: 'hidden',
    textAlign: 'center',
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
