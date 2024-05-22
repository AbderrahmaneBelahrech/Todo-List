import React, { useRef, useState } from 'react';
import { Modal, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Animated, Easing, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PopupMenu1 = () => {
  const [visible, setVisible] = useState(false);
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0, width: 0 });
  const touchableRef = useRef(null);
  const scale = useRef(new Animated.Value(0)).current;

  const options = [
    { name: 'Edit', action: () => console.log('Editing'), icon: "create-outline", color: 'black'},
    { name: 'Move', action: () => console.log('Moving'), icon: "arrow-redo-circle-outline" , color: 'black'},
    { name: 'Delete', action: () => console.log('Deleting'), icon: "trash-outline", color: 'red' },
  ];

  const handlePress = () => {
    if (touchableRef.current) {
      touchableRef.current.measure((fx, fy, width, height, px, py) => {
        const screenWidth = Dimensions.get('window').width;
        const popupWidth = 165; // Define the popup width
        let leftPosition = px;

        if (px + popupWidth > screenWidth) {
          leftPosition = screenWidth - popupWidth;
        }

        setButtonPosition({ x: leftPosition, y: py + height - 22, width });
        resizeBox(1);
      });
    }
  };

  const resizeBox = (to) => {
    setVisible(to === 1);
    Animated.timing(scale, {
      toValue: to,
      duration: 200,
      useNativeDriver: true,
      easing: Easing.linear,
    }).start(() => {
      if (to === 0) setVisible(false);
    });
  };

  return (
    <>
      <TouchableOpacity ref={touchableRef} onPress={handlePress}>
        <Ionicons name="ellipsis-vertical" size={20} color="black" />
      </TouchableOpacity>
      <Modal transparent={true} visible={visible} >
        <SafeAreaView style={{ flex: 1 }} onTouchStart={() => resizeBox(0)}>
          <Animated.View style={[
            styles.popup,
            {
              transform: [{ scale }],
              top: buttonPosition.y,
              left: buttonPosition.x,
            }
          ]}>
            {options.map((option, index) => (
              <TouchableOpacity 
                key={index} 
                style={[styles.popupOption, { borderBottomWidth: index === options.length - 1 ? 0 : 1 }]}
                onPress={() => {
                    console.log(`Option selected: ${option.name}`);
                    option.action();
                    resizeBox(0);
                }}
              >
                <Text style={{color: option.color}}>{option.name}</Text>
                <Ionicons name={option.icon} size={20} color={option.color} style={{ marginLeft: 20 }} />
              </TouchableOpacity>
            ))}
          </Animated.View>
        </SafeAreaView>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  popup: {
    width: 130, 
    backgroundColor: 'white',
    paddingHorizontal: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    position: 'absolute',
  },
  popupOption: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray'
  }
});
export default PopupMenu1;
