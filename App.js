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
  const [filteredTaskList, setFilteredTaskList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editTaskKey, setEditTaskKey] = useState(null); // New state for editing

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [searchQuery, taskList]);

  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      if (storedTasks !== null) {
        const parsedTasks = JSON.parse(storedTasks);
        setTaskList(parsedTasks);
        setFilteredTaskList(parsedTasks);
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

  const handleSearch = () => {
    if (searchQuery.trim()) {
      const filteredTasks = taskList.filter(item =>
        item.task.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredTaskList(filteredTasks);
    } else {
      setFilteredTaskList(taskList);
    }
  };

  const addOrEditTask = () => {
    if (task.trim()) {
      if (editTaskKey) {
        const updatedTasks = taskList.map(item =>
          item.key === editTaskKey ? { ...item, task, details } : item
        );
        setTaskList(updatedTasks);
        setEditTaskKey(null);
      } else {
        const newTask = { key: Math.random().toString(), task, completed: false, details };
        const updatedTasks = [...taskList, newTask];
        setTaskList(updatedTasks);
      }

      setTask('');
      setDetails('');
      saveTasks(taskList);
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

  const editTask = (task) => {
    setTask(task.task);
    setDetails(task.details);
    setEditTaskKey(task.key); // Set key to identify task being edited
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>My To-Do List</Text>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <TextInput 
          style={styles.searchInput}
          placeholder="Search tasks..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Task Input */}
      <View style={styles.inputContainer}>
        <TextInput 
          style={styles.taskInput}
          placeholder="Enter a task"
          value={task}
          onChangeText={setTask}
        />
      </View>

      {/* Details Input */}
      <View style={styles.inputContainer}>
        <TextInput 
          style={styles.detailsInput}
          placeholder="Enter task details"
          value={details}
          onChangeText={setDetails}
          multiline={true}
          numberOfLines={4}
        />
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={addOrEditTask}
          activeOpacity={0.8}
        >
          <Text style={styles.addButtonText}>{editTaskKey ? 'Edit' : 'Add'}</Text>
        </TouchableOpacity>
      </View>

      {/* Task List */}
      <FlatList 
        data={filteredTaskList}
        renderItem={({ item }) => (
          <View style={[styles.taskItem, { borderColor: item.completed ? '#28a745' : '#FFA62F' }]}>
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
                  style={styles.icon}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteTask(item.key)}>
                <Icon name="delete" size={30} color="#dc3545" style={styles.icon} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => editTask(item)}>
                <Icon name="edit" size={30} color="#FFA62F" style={styles.icon} />
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
    backgroundColor: '#91DDCF',
    padding: 20,
  },
  heading: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginVertical: 20,
    letterSpacing: 1,
  },
  searchContainer: {
    marginBottom: 20,
  },
  searchInput: {
    borderColor: '#FFA62F',
    borderWidth: 2,
    padding: 7,
    borderRadius: 8,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  taskInput: {
    borderColor: '#FFA62F',
    borderWidth: 2,
    padding: 15,
    flex: 1,
    marginRight: 2,
    borderRadius: 8,
    backgroundColor: '#fff',
    fontSize: 16,
    height: 50,
  },
  detailsInput: {
    borderColor: '#FFA62F',
    borderWidth: 2,
    padding: 15,
    flex: 1,
    marginRight: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
    fontSize: 16,
    textAlignVertical: 'top',
    height: 100,
  },
  addButton: {
    backgroundColor: '#FFA62F',
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
    padding: 11,
    marginVertical: 10,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    borderWidth: 2, 
  },
  taskText: {
    fontSize: 20,
    color: '#FFA62F',
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
  icon: {
    marginLeft: 2, 
  },
});
