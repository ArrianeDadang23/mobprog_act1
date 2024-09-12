import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function TaskDetails({ route }) {
  const { task } = route.params; // Get the task from the navigation params

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon name="assignment" size={30} color="#fff" />
        <Text style={styles.title}>Task Details</Text>
      </View>

      <View style={styles.taskContainer}>
        <Text style={styles.label}>Task:</Text>
        <Text style={styles.taskText}>{task.task}</Text>
      </View>

      <View style={styles.taskContainer}>
        <Text style={styles.label}>Details:</Text>
        <Text style={styles.detailsText}>
          {task.details ? task.details : 'No details available'}
        </Text>
      </View>

      <View style={styles.taskContainer}>
        <Text style={styles.label}>Status:</Text>
        <View style={styles.statusContainer}>
          <Icon
            name={task.completed ? 'check-circle' : 'hourglass-empty'}
            size={24}
            color={task.completed ? '#28a745' : '#ff9800'}
          />
          <Text style={styles.statusText}>
            {task.completed ? 'Completed' : 'Pending'}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#91DDCF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginLeft: 10,
  },
  taskContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#555',
  },
  taskText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    marginTop: 5,
  },
  detailsText: {
    fontSize: 18,
    color: '#666',
    marginTop: 5,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  statusText: {
    fontSize: 18,
    marginLeft: 10,
    fontWeight: '500',
  },
});
