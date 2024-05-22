// Task.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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


const Task = ({ task, onOptionsPress, getPriorityStyle }) => {
    return (
        <TouchableOpacity style={[styles.taskCard, { borderLeftWidth: 4, borderLeftColor: getPriorityStyle(task.priority).color }]}>
            <View style={styles.taskDetails}>
                <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}> 
                    <Text style={styles.taskName}>{task.name}</Text>
                    <Text style={[styles.taskPrio, getPriorityStyle(task.priority)]}>{task.priority}</Text>
                </View>
                <Text style={styles.taskDescription}>{task.description}</Text>
                <Text style={styles.dueTime}>{new Date(task.dueDate).toLocaleDateString()} | {new Date(task.dueDate).toLocaleTimeString()}</Text>
            </View>
            <View style={styles.taskOptions}>
                <TouchableOpacity >
                <Ionicons name="ellipsis-vertical" size={20} color="black" />
                </TouchableOpacity>
                <Text style={calculateTimeLeft(task.dueDate) === "Past due" ? styles.pastDue : styles.timeLeft}>
                {calculateTimeLeft(task.dueDate)}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
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
    timeLeft: {
        fontSize: 12,
        color: '#0066CC', // Color for tasks that are due soon or now
        marginTop: 5,
        textAlign: 'right'
      },
      pastDue: {
        fontSize: 12,
        color: '#D32F2F', // Red color to indicate urgency for past due tasks
        marginTop: 5,
        textAlign: 'center',
        fontWeight: 'bold', // Make it bold to catch attention
      },
    taskDetails: {
        flex: 5,
        justifyContent: 'center',
      },
      taskOptions: {
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        flex: 1
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
});

export default Task;
