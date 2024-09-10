import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function TaskDetails({ route }) {
  const { task } = route.params; // Get the task from the navigation params

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Task: {task.task}</Text>
      <Text style={styles.details}>Details: {task.details || 'No details available'}</Text>
      <Text style={styles.status}>Status: {task.completed ? 'Completed' : 'Pending'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
  },
  details: {
    fontSize: 18,
    color: '#333',
    marginBottom: 20,
  },
  status: {
    fontSize: 18,
    color: '#28a745',
  },
});
