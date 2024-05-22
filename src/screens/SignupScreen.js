import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Alert, StatusBar } from 'react-native';

const SignUpScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState(''); 

    const handleSignUp = () => {
      if (password !== confirmPassword) {
          Alert.alert("Passwords do not match");
          return;
      }
  
      // Assuming your backend requires name and phone as well
      fetch('http://192.168.1.102:8080/api/users/signup', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              name: name, // Ensure you're collecting and sending 'name'
              email: email,
              password: password,
              phone: phone, // Ensure you're collecting and sending 'phone'
          })})
          .then(response => {
              if (!response.ok) {
                  throw new Error('Signup failed');
              }
              return response.json();
          })
          .then(data => {
              // Assuming 'data' object doesn't directly contain a 'status' field
              // Success handling can be assumed if no exception was thrown
              Alert.alert("Signup Successful", "You are now registered!");
              navigation.navigate('Login');
          })
          .catch(error => {
              console.error('Error:', error);
              Alert.alert("Signup Error", "An error occurred during signup. " + error.message);
          });
        }
    return (
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <StatusBar barStyle='default'/>
            <View style={styles.card}>
                <Image
                    source={require('../../assets/icon.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
                <Text style={styles.header}>Sign up</Text>
                <Text style={styles.subHeader}>
                    Already have an account?
                    {' '}
                    <Text style={styles.link} onPress={() => navigation.goBack()}>Sign in here</Text>
                </Text>

                <Text style={styles.orStyle}>Or</Text>

                <View style={styles.form}>
                <TextInput 
                  style={styles.input}
                  placeholder="Full Name"
                  keyboardType="default"
                  textContentType="name"
                  placeholderTextColor="#666" 
                  value={name}
                  onChangeText={setName}
                  autoCapitalize='words'
              />
                    <TextInput 
                        style={styles.input}
                        placeholder="Email address"
                        keyboardType="email-address"
                        textContentType="emailAddress"
                        placeholderTextColor="#666"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize='none'
                    />
                    <TextInput 
                      style={styles.input}
                      placeholder="Phone Number"
                      keyboardType="phone-pad"
                      textContentType="telephoneNumber"
                      placeholderTextColor="#666" 
                      value={phone}
                      onChangeText={setPhone}
                      
                  />
                    <TextInput 
                        style={styles.input}
                        placeholder="Password"
                        secureTextEntry={true}
                        textContentType="password"
                        placeholderTextColor="#666"
                        value={password}
                        onChangeText={setPassword}
                        autoCapitalize='none'
                    />
                    <TextInput 
                        style={styles.input}
                        placeholder="Confirm Password"
                        secureTextEntry={true}
                        textContentType="password"
                        placeholderTextColor="#666"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        autoCapitalize='none'
                    />
                    <TouchableOpacity style={styles.signInButton} onPress={handleSignUp}>
                        <Text style={styles.signInButtonText}>Sign up</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}

export default SignUpScreen;

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
    nameText:{
      borderWidth: 1,
      borderColor: '#ddd',
      padding: 10,
      borderRadius: 5,
      marginBottom: 10,
      fontSize: 16,
      flex: 1
    },
    name:{
      width: "100%",
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
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
