// TaskActionModal.js
import React from 'react';
import { Modal, View, Text, Button, StyleSheet } from 'react-native';


const TaskActionModal = ({ visible, onClose, task, onEdit, onChangeStatus, onDelete }) => {
    if (!task) return null;

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.modalText}>Select Action for {task.name}</Text>
                    <Button title="Edit Task" onPress={() => onEdit(task)} />
                    <Button title="Change Status" onPress={() => onChangeStatus(task)} />
                    <Button title="Delete Task" onPress={() => onDelete(task)} />
                    <Button title="Cancel" onPress={onClose} color="#FF6347" />
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
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
    modalText: {
        marginBottom: 15,
        textAlign: 'center'
    }
});

export default TaskActionModal;
