import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const PopupMenu = ({ task, onClose, onMoveTask, onDeleteTask, isToDoScreen, isOwner }) => {
  const handleMove = () => {
    onMoveTask(task);
    onClose();
  };

  const handleDelete = () => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this task?",
      [
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel",
        },
        { text: "OK", onPress: () => onDeleteTask(task.id) },
      ]
    );
    onClose();
  };

  const moveText = isToDoScreen ? "Move to In Progress" : "Move to Done";
  const moveIcon = isToDoScreen ? "arrow-redo-circle-outline" : "checkmark-circle-outline";

  return (
    <Modal transparent={true} animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalBackground} onPress={onClose}>
        <View style={styles.popup}>
          {isOwner ? (
            <>
              <TouchableOpacity style={styles.popupOption} onPress={handleMove}>
                <Text>{moveText}</Text>
                <Ionicons
                  name={moveIcon}
                  size={20}
                  color="black"
                  style={{ marginLeft: 20 }}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.popupOption2} onPress={handleDelete}>
                <Text style={{ color: "red" }}>Delete</Text>
                <Ionicons
                  name="trash-outline"
                  size={20}
                  color="red"
                  style={{ marginLeft: 20 }}
                />
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.notOwnerMessage}>
              <Text style={{ color: "red", textAlign: "center" }}>You are not authorized to modify this task.</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  popup: {
    backgroundColor: "white",
    paddingHorizontal: 10,
    borderColor: "lightgray",
    borderWidth: 1,
    borderRadius: 10,
    elevation: 5,
    position: "absolute",
  },
  popupOption: {
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "lightgray",
  },
  popupOption2: {
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
    justifyContent: "space-between",
  },
  notOwnerMessage: {
    padding: 20,
  },
});

export default PopupMenu;
