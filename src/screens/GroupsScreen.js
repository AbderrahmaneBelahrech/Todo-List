import { StyleSheet, Text, View, FlatList, ActivityIndicator, TouchableOpacity, TextInput, Button, Modal } from 'react-native';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const GroupsScreen = ({ route }) => {
  const { id: userId } = route.params;

  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [userEmails, setUserEmails] = useState('');

  useEffect(() => {
    if (userId) {
      console.log('userId:', userId); // Debugging statement
      fetchGroups();
    } else {
      console.error('userId is undefined');
    }
  }, [userId]);

  const fetchGroups = async () => {
    try {
      const response = await axios.get(`http://192.168.1.102:8080/api/user-groups/user/${userId}`);
      setGroups(response.data);
    } catch (error) {
      console.error('Failed to fetch groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddGroup = async () => {
    try {
      const response = await axios.post(`http://192.168.1.102:8080/api/user-groups?userId=${userId}`, {
        name: newGroupName,
        userEmails: userEmails.split(',').map(email => email.trim()), // Split and trim emails
      });
      if (response.status === 200 || response.status === 201) {
        alert('Group added successfully!');
        fetchGroups(); // Reload the group list
      }
    } catch (error) {
      console.error('Failed to add group:', error);
      alert('Failed to add group!');
    }
    setModalVisible(false); // Close the modal after adding the group
    setNewGroupName(''); // Reset the input field
    setUserEmails(''); // Reset the emails field
  };

  const renderGroupItem = ({ item }) => (
    <View style={styles.groupItem}>
      <Ionicons name="people-circle" size={40} color="#4A90E2" style={styles.groupIcon} />
      <View style={styles.groupDetails}>
        <Text style={styles.groupName}>{item.name}</Text>
        <View style={styles.groupMembersContainer}>
          <MaterialIcons name="groups" size={24} color="#262626" style={styles.groupIconCard} />
          <Text style={styles.groupMembers}>{item.users.length} members</Text>
        </View>
        <Text style={styles.groupCreator}>
          Created by: <Text style={{ fontWeight: 'bold' }}>{item.createdBy ? item.createdBy.name : 'Unknown'}</Text>
        </Text>
        <FlatList
          data={item.users}
          renderItem={({ item: user }) => (
            <Text
              style={[
                styles.memberName,
                item.createdBy && user.id === item.createdBy.id ? styles.adminName : null,
              ]}
            >- {user.email}
              {item.createdBy && user.id === item.createdBy.id ? ' (Admin)' : ''}
            </Text>
          )}
          keyExtractor={(user) => user.id.toString()}
        />
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={groups}
        renderItem={renderGroupItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        ListEmptyComponent={<Text style={styles.emptyText}>No groups to show</Text>}
      />

      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>   
        <Ionicons name="add" size={24} color="white" />
        <Text style={styles.fabText}>Add a new group</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TextInput
              placeholder="Enter group name"
              value={newGroupName}
              onChangeText={setNewGroupName}
              style={styles.taskInput}
            />
            <TextInput
              placeholder="Enter user emails (comma-separated)"
              value={userEmails}
              onChangeText={setUserEmails}
              style={styles.taskInput}
            />
            <View style={styles.buttonsRow}>
              <Button title="Add Group" onPress={handleAddGroup} />
              <Button title="Cancel" onPress={() => setModalVisible(false)} color="#FF6347" />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default GroupsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F1F3',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 10,
    paddingBottom: 100, // Ensure enough space for the FAB
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  groupItem: {
    width: '48%', // Ensure it fits within two columns
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 15,
    marginVertical: 5,
    alignItems: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOpacity: 0.8,
    elevation: 2,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 5 },
    margin: 5,
  },
  groupIcon: {
    marginBottom: 10,
  },
  groupIconCard: {
    marginRight: 7,
  },
  groupDetails: {
    alignItems: 'center',
  },
  groupName: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  groupMembersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  groupMembers: {
    fontSize: 14,
    color: '#6e6e6e',
  },
  groupCreator: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
  },
  memberName: {
    fontSize: 12,
    color: '#4A4A4A',
    marginVertical: 2,
  },
  adminName: {
    color: '#F67B7B',
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#6e6e6e',
  },
  fab: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: 16,  // Make sure this positions the FAB above the padding of the FlatList
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
    marginBottom: 20, // Add margin to ensure space between FAB and cards
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
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
});
