import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import TaskDetails from './TaskDetails'; // Import TaskDetails

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="TaskList" component={TaskListScreen} options={{ title: 'To-Do List' }} />
        <Stack.Screen name="TaskDetails" component={TaskDetails} options={{ title: 'Task Details' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function TaskListScreen({ navigation }) {
  const [task, setTask] = useState('');
  const [details, setDetails] = useState('');
  const [taskList, setTaskList] = useState([]);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      if (storedTasks !== null) {
        setTaskList(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.error('Failed to load tasks.');
    }
  };

  const saveTasks = async (tasks) => {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
    } catch (error) {
      console.error('Failed to save tasks.');
    }
  };

  const addTask = () => {
    if (task.trim()) {
      const newTask = { key: Math.random().toString(), task, completed: false, details };
      const updatedTasks = [...taskList, newTask];
      setTaskList(updatedTasks);
      setTask('');
      setDetails('');
      saveTasks(updatedTasks);
    }
  };

  const deleteTask = (taskKey) => {
    const updatedTasks = taskList.filter(item => item.key !== taskKey);
    setTaskList(updatedTasks);
    saveTasks(updatedTasks);
  };

  const toggleCompletion = (taskKey) => {
    const updatedTasks = taskList.map(item =>
      item.key === taskKey ? { ...item, completed: !item.completed } : item
    );
    setTaskList(updatedTasks);
    saveTasks(updatedTasks);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>My To-Do List</Text>

      <View style={styles.inputContainer}>
        <TextInput 
          style={styles.input} 
          placeholder="Enter a task"
          value={task}
          onChangeText={setTask}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput 
          style={styles.input} 
          placeholder="Enter task details"
          value={details}
          onChangeText={setDetails}
        />
        <TouchableOpacity style={styles.addButton} onPress={addTask}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      <FlatList 
        data={taskList}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            <TouchableOpacity onPress={() => navigation.navigate('TaskDetails', { task: item })}>
              <Text style={[styles.taskText, item.completed && styles.completedText]}>
                {item.task}
              </Text>
            </TouchableOpacity>
            <View style={styles.iconContainer}>
              <TouchableOpacity onPress={() => toggleCompletion(item.key)}>
                <Icon 
                  name={item.completed ? "check-circle" : "radio-button-unchecked"} 
                  size={30} 
                  color={item.completed ? '#28a745' : '#007BFF'} 
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteTask(item.key)}>
                <Icon name="delete" size={30} color="#dc3545" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        style={styles.list}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  heading: {
    fontSize: 32,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginVertical: 20,
    letterSpacing: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    borderColor: '#007BFF',
    borderWidth: 2,
    padding: 15,
    flex: 1,
    marginRight: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  list: {
    marginTop: 20,
  },
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  taskText: {
    fontSize: 18,
    color: '#333',
    flex: 1,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
