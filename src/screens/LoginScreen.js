import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Alert, StatusBar } from 'react-native';
import axios from 'axios';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');  
    const [password, setPassword] = useState('');
 
    const handleLogin = () => {
      axios.post('http://192.168.1.102:8080/api/users/login', {
        email: email,
        password: password
      })
      .then(response => {
        if (response.status === 200) {
          Alert.alert("Login Successful", "Welcome, " + response.data.name + "!");
          navigation.replace("Home", {name: response.data.name, id: response.data.id, email: response.data.email}); // Adjust as necessary
        } else {
          Alert.alert("Login Failed", "Please check your credentials.");
        }
      })
      .catch(error => {
        // Here you can add more nuanced error checks
        if (error.response) {
          // The server responded with a status outside the 2xx range
          Alert.alert("Login Failed", error.response.data || "Please check your credentials.");
        } else if (error.request) {
          // The request was made but no response was received
          Alert.alert("Network Error", "No response from server");
        } else {
          // Something happened in setting up the request
          Alert.alert("Error", "Login request could not be made: " + error.message);
        }
      });
    };
    
  

    return (
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <StatusBar barStyle='default'/>
            <View style={styles.card}>
                <Image
                    source={require('../../assets/icon.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
                <Text style={styles.header}>Sign in</Text>
                <Text style={styles.subHeader}>
                    Don't have an account yet?
                    {' '}
                    <Text style={styles.link} onPress={() => navigation.navigate('Signup')}>Sign up here</Text>
                </Text>
                <Text style={styles.orStyle}>Or</Text>
                <View style={styles.form}>
                  
                    <TextInput 
                        style={styles.input} 
                        placeholder="Email address" 
                        keyboardType="email-address"
                        textContentType="emailAddress"
                        placeholderTextColor="#666" 
                        value={email}
                        onChangeText={setEmail}
                    />
                    <TextInput 
                        style={styles.input} 
                        placeholder="Password" 
                        secureTextEntry={true}
                        textContentType="password"
                        placeholderTextColor="#666"
                        autoCapitalize='none'
                        value={password}
                        onChangeText={setPassword}
                    />
                    <TouchableOpacity style={styles.signInButton} onPress={handleLogin}>
                        <Text style={styles.signInButtonText}>Sign in</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#f9f9f9',
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    logo: {
        width: 100,
        height: 100,
        alignSelf: 'center',
        marginTop: 20,
        marginBottom: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
    },
    subHeader: {
        marginTop: 10,
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },
    link: {
        color: '#0066cc',
        fontWeight: 'bold',
    },
    orStyle: {
        alignSelf: 'center',
        color: '#aaa',
        marginTop: 20,
        marginBottom: 20,
    },
    form: {
        width: '100%',
    },
    
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        fontSize: 16,
    },
    signInButton: {
        padding: 10,
        backgroundColor: '#0066cc',
        borderRadius: 5,
    },
    signInButtonText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
    },
});
