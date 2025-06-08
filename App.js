import React, { useState } from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  SafeAreaView,
} from 'react-native';

const AntennaApp = () => {
  const [measuredFreq, setMeasuredFreq] = useState('');
  const [targetFreq, setTargetFreq] = useState('');
  const [velocityFactor, setVelocityFactor] = useState('0.95');
  const [result, setResult] = useState(null);

  const calculateAntennaDifference = () => {
    // Validation des entrées
    const measuredFreqNum = parseFloat(measuredFreq);
    const targetFreqNum = parseFloat(targetFreq);
    const velocityFactorNum = parseFloat(velocityFactor);

    if (!measuredFreqNum || !targetFreqNum || !velocityFactorNum) {
      Alert.alert('Erreur', 'Veuillez saisir des valeurs numériques valides');
      return;
    }

    if (measuredFreqNum <= 0 || targetFreqNum <= 0 || velocityFactorNum <= 0) {
      Alert.alert('Erreur', 'Les valeurs doivent être positives');
      return;
    }

    if (velocityFactorNum > 1) {
      Alert.alert('Erreur', 'Le facteur de vélocité doit être ≤ 1.0');
      return;
    }

    // Constantes
    const speedOfLight = 299792458; // m/s
    
    // Calcul des longueurs d'onde en mètres
    const wavelengthMeasured = (speedOfLight * velocityFactorNum) / (measuredFreqNum * 1000000);
    const wavelengthTarget = (speedOfLight * velocityFactorNum) / (targetFreqNum * 1000000);
    
    // Longueur de chaque branche du dipôle (λ/2 divisé par 2 = λ/4)
    const lengthMeasured = wavelengthMeasured / 4;
    const lengthTarget = wavelengthTarget / 4;
    
    // Différence de longueur
    const difference = lengthMeasured - lengthTarget;
    
    setResult({
      measuredLength: lengthMeasured,
      targetLength: lengthTarget,
      difference: difference,
      wavelengthMeasured: wavelengthMeasured,
      wavelengthTarget: wavelengthTarget,
    });
  };

  const resetCalculation = () => {
    setMeasuredFreq('');
    setTargetFreq('');
    setVelocityFactor('0.95');
    setResult(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>📡 Ajusteur d'Antenne</Text>
          <Text style={styles.subtitle}>
            Calculez la différence de longueur entre deux fréquences (λ/2)
          </Text>
        </View>

        {/* Input Fields */}
        <View style={styles.inputSection}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Fréquence mesurée (MHz)</Text>
            <TextInput
              style={styles.input}
              value={measuredFreq}
              onChangeText={setMeasuredFreq}
              placeholder="Ex: 14.200"
              keyboardType="numeric"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Fréquence cible (MHz)</Text>
            <TextInput
              style={styles.input}
              value={targetFreq}
              onChangeText={setTargetFreq}
              placeholder="Ex: 14.150"
              keyboardType="numeric"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Facteur de vélocité du câble</Text>
            <TextInput
              style={styles.input}
              value={velocityFactor}
              onChangeText={setVelocityFactor}
              placeholder="Ex: 0.95"
              keyboardType="numeric"
              placeholderTextColor="#999"
            />
          </View>
        </View>

        {/* Buttons */}
        <View style={styles.buttonSection}>
          <TouchableOpacity style={styles.calculateButton} onPress={calculateAntennaDifference}>
            <Text style={styles.calculateButtonText}>📊 Calculer</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.resetButton} onPress={resetCalculation}>
            <Text style={styles.resetButtonText}>🔄 Reset</Text>
          </TouchableOpacity>
        </View>

        {/* Results */}
        {result && (
          <View style={styles.resultSection}>
            <Text style={styles.resultTitle}>📈 Résultats</Text>
            
            <View style={styles.resultCard}>
              <Text style={styles.resultLabel}>Longueur d'onde mesurée:</Text>
              <Text style={styles.resultValue}>
                {result.wavelengthMeasured.toFixed(3)} m
              </Text>
            </View>

            <View style={styles.resultCard}>
              <Text style={styles.resultLabel}>Longueur d'onde cible:</Text>
              <Text style={styles.resultValue}>
                {result.wavelengthTarget.toFixed(3)} m
              </Text>
            </View>

            <View style={styles.resultCard}>
              <Text style={styles.resultLabel}>Longueur branche mesurée (λ/4):</Text>
              <Text style={styles.resultValue}>
                {result.measuredLength.toFixed(3)} m ({(result.measuredLength * 100).toFixed(1)} cm)
              </Text>
            </View>

            <View style={styles.resultCard}>
              <Text style={styles.resultLabel}>Longueur branche cible (λ/4):</Text>
              <Text style={styles.resultValue}>
                {result.targetLength.toFixed(3)} m ({(result.targetLength * 100).toFixed(1)} cm)
              </Text>
            </View>

            <View style={[styles.resultCard, styles.differenceCard]}>
              <Text style={styles.resultLabel}>Différence de longueur:</Text>
              <Text style={[styles.resultValue, styles.differenceValue]}>
                {result.difference > 0 ? '+' : ''}{result.difference.toFixed(4)} m
              </Text>
              <Text style={[styles.resultValue, styles.differenceValue]}>
                ({result.difference > 0 ? '+' : ''}{(result.difference * 100).toFixed(2)} cm)
              </Text>
              <Text style={styles.adjustmentText}>
                {result.difference > 0 
                  ? '✂️ Raccourcir les branches de cette longueur' 
                  : '📏 Allonger les branches de cette longueur'}
              </Text>
            </View>
          </View>
        )}

        {/* Info Section */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>ℹ️ Informations</Text>
          <Text style={styles.infoText}>
            • Cette application calcule la différence de longueur nécessaire pour ajuster un dipôle λ/2
          </Text>
          <Text style={styles.infoText}>
            • Chaque branche du dipôle mesure λ/4 de la longueur d'onde
          </Text>
          <Text style={styles.infoText}>
            • Le facteur de vélocité typique est de 0.95 pour la plupart des câbles
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}; //AntennaApp

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    paddingVertical: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  inputSection: {
    marginBottom: 25,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#34495e',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    color: '#2c3e50',
  },
  buttonSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  calculateButton: {
    backgroundColor: '#3498db',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    flex: 0.48,
    alignItems: 'center',
  },
  calculateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resetButton: {
    backgroundColor: '#95a5a6',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    flex: 0.48,
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultSection: {
    marginBottom: 25,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
    textAlign: 'center',
  },
  resultCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  differenceCard: {
    backgroundColor: '#e8f5e8',
    borderLeftWidth: 4,
    borderLeftColor: '#27ae60',
  },
  resultLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 5,
  },
  resultValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  differenceValue: {
    fontSize: 18,
    color: '#27ae60',
  },
  adjustmentText: {
    fontSize: 14,
    color: '#e67e22',
    fontStyle: 'italic',
    marginTop: 5,
  },
  infoSection: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#3498db',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 5,
    lineHeight: 20,
  },
}); // styles

export default AntennaApp;

