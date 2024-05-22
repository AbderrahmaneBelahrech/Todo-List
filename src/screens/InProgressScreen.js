import { Modal, StyleSheet, View, TouchableOpacity, Text, ActivityIndicator, FlatList, RefreshControl } from 'react-native';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PopupMenu from '../components/PopupMenu';

const priority = [
  { label: 'Low', value: '1' },
  { label: 'Medium', value: '2' },
  { label: 'High', value: '3' },
];

const InProgressScreen = ({ route }) => {
  const { id } = route.params;
  const [refreshing, setRefreshing] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const handleTaskOptionsPress = (task) => {
    setSelectedTask(task);
  };

  const onDeleteTask = async (taskId) => {
    try {
      await axios.delete(`http://192.168.1.102:8080/api/tasks/delete/${taskId}`);
      fetchTasks(); // Refresh the list
    } catch (error) {
      console.error(error);
      Alert.alert("Error deleting task");
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
            onMoveTask={moveTaskToDone}
            onDeleteTask={onDeleteTask}
            isToDoScreen={false}
            isOwner={selectedTask.owner.id === id} // Check if the logged-in user is the owner
          />
        )}
        <Text style={calculateTimeLeft(item.dueDate) === "Past due" ? styles.pastDue : styles.timeLeft}>
          {calculateTimeLeft(item.dueDate)}
        </Text>
      </View>
    </TouchableOpacity>
  );
  

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      // Fetch tasks as the owner
      const ownerResponse = await axios.get(`http://192.168.1.102:8080/api/tasks/user/${id}`);
      let ownerTasks = Array.isArray(ownerResponse.data) ? ownerResponse.data.filter(task => task.status === 'IN_PROGRESS') : [];
  
      // Fetch tasks as a group member
      const groupResponse = await axios.get(`http://192.168.1.102:8080/api/tasks/group/user/${id}`);
      let groupTasks = Array.isArray(groupResponse.data) ? groupResponse.data.filter(task => task.status === 'IN_PROGRESS') : [];
  
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
  
  

  const moveTaskToDone = async (task) => {
    try {
      const updatedTask = { ...task, status: 'DONE' };
      await axios.put(`http://192.168.1.102:8080/api/tasks/update/${task.id}`, updatedTask);
      fetchTasks(); // Refresh the list
    } catch (error) {
      console.error("Error moving task to Done:", error);
      Alert.alert("Error moving task");
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchTasks();
    } catch (error) {
      console.error(error);
    } finally {
      setRefreshing(false);
    }
  };

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
          <Text style={{ fontWeight: 'bold' }}>No tasks in progress</Text>
        </View>}
        refreshControl={
          <RefreshControl
            colors={['#0066CC', '#0066CC']}
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        }
      />
    </View>
  );
};

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
  groupTask: {
    backgroundColor: '#FFDAB9',
  },
  taskDetails: {
    flex: 1,
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
});

export default InProgressScreen;
