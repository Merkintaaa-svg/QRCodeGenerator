import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Image, ActivityIndicator, Platform, Alert } from 'react-native';
import axios from 'axios';
import RNFS from 'react-native-fs';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';

const QRCodeGenerator: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('https://literate-mudfish-growing.ngrok-free.app/api/generate/', 
        new URLSearchParams({ text }), 
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );
      
      setQrUrl(`https://literate-mudfish-growing.ngrok-free.app${response.data.url}`);
    } catch (err) {
      setError('Error generating QR code');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!qrUrl) return;

    // Request permission to access storage
    const permission = Platform.select({
      android: PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
      ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
    });

    if (permission) {
      const result = await request(permission);
      if (result === RESULTS.GRANTED) {
        try {
          const downloadDest = `${RNFS.ExternalDirectoryPath}/QRCode.png`;
          const downloadResult = await RNFS.downloadFile({
            fromUrl: qrUrl,
            toFile: downloadDest,
          }).promise;

          if (downloadResult.statusCode === 200) {
            Alert.alert('Download successful', `QR Code downloaded to: ${downloadDest}`);
          } else {
            Alert.alert('Download failed', 'Something went wrong during the download.');
          }
        } catch (err) {
          Alert.alert('Error', 'Error downloading the QR code.');
        }
      } else {
        Alert.alert('Permission Denied', 'You need to grant storage permissions to download files.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>QR Code Generator</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter text here"
        value={text}
        onChangeText={setText}
      />
      <Button title="Generate QR Code" onPress={handleGenerate} />
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {error && <Text style={styles.error}>{error}</Text>}
      {qrUrl && !loading && !error && (
        <View style={styles.qrContainer}>
          <Image source={{ uri: qrUrl }} style={styles.qrImage} />
          <Button title="Download QR Code" onPress={handleDownload} />
          <Text>Qrcode removes after 1min</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 20,
    width: '100%',
    paddingHorizontal: 10,
  },
  qrContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  qrImage: {
    width: 200,
    height: 200,
  },
  error: {
    color: 'red',
    marginTop: 20,
  },
});

export default QRCodeGenerator;
