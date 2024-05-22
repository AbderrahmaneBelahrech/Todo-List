import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer'
import { Ionicons } from '@expo/vector-icons'

const CustomDrawer = (props) => {
    const {email, name } = props;
  return (
    <View style={{ flex: 1, paddingTop: 20 }}>
        <View style={{flexDirection: 'row',  alignItems: 'center', paddingBottom: 15,marginBottom: 25, marginHorizontal: 10, borderBottomWidth: 1,borderBottomColor: '#ccc',}}>
            <Ionicons name="person-circle" size={50} color="gray" />
            <View style={{marginLeft: 10}}>
                <Text style={{ fontSize: 20, fontWeight: '700' }}>{name}</Text>
                <Text style={{ fontSize: 16, color: 'gray' }}>{email}</Text>
            </View>
        </View>
        <DrawerContentScrollView {...props}>
            <DrawerItemList {...props} />
        </DrawerContentScrollView>
    <TouchableOpacity onPress={() => props.navigation.replace('Login')}>
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10, marginBottom: 35, alignSelf: 'center', backgroundColor: '#F67B7B', borderRadius: 5,paddingHorizontal: 20, }}>
            <Ionicons name="log-out-outline" size={24} color="white" />
            <Text style={{ marginLeft: 10, fontSize: 16, color:"white" }}>Logout</Text>
        </View>
    </TouchableOpacity>
    </View>
  )
}

export default CustomDrawer

const styles = StyleSheet.create({})