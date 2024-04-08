import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Modal, Button } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const TaskItem = ({ item, index, onEdit, onDelete }) => (
  <View style={styles.task}>
    <Text style={styles.itemList}>{item}</Text>
    <View style={styles.taskButtons}>
      <TouchableOpacity onPress={() => onEdit(index)}>
        <Icon name="edit" size={24} color="#fca311" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onDelete(index)} style={{ marginLeft: 10 }}>
        <Icon name="delete" size={24} color="#d90429" />
      </TouchableOpacity>
    </View>
  </View>
);

const TaskInput = ({ task, setTask, onAdd }) => (
  <View style={styles.addTaskRow}>
    <TextInput
      style={styles.input}
      placeholder="Enter task"
      value={task}
      onChangeText={setTask}
    />
    <TouchableOpacity
      style={styles.addButton}
      onPress={onAdd}>
      <Icon name="add" size={24} color="white" />
    </TouchableOpacity>
  </View>
);

const EditTaskModal = ({ visible, onClose, initialTask, onSave }) => {
  const [editedTask, setEditedTask] = useState('');

  useEffect(() => {
    if (visible) {
      setEditedTask(initialTask);
    }
  }, [initialTask, visible]);

  const handleSave = () => {
    onSave(editedTask);
    onClose();
    setEditedTask('');
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalView}>
          <TextInput
            style={styles.modalTextInput}
            onChangeText={setEditedTask}
            value={editedTask}
            placeholder="Edit task"
          />
          <Button title="Save" onPress={handleSave} color="#2b2d42" />
        </View>
      </View>
    </Modal>
  );
};

const App = () => {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editIndex, setEditIndex] = useState(-1);

  const handleAddTask = useCallback(() => {
    if (!task) return;
    const updatedTasks = [...tasks];
    if (editIndex !== -1) {
      updatedTasks[editIndex] = task;
      setEditIndex(-1);
    } else {
      updatedTasks.push(task);
    }
    setTasks(updatedTasks);
    setTask('');
  }, [task, tasks, editIndex]);

  const handleEditTask = useCallback((index) => {
    setEditIndex(index);
    setTask('');
    setModalVisible(true);
  }, []);
  

  const handleDeleteTask = useCallback((index) => {
    setTasks(currentTasks => currentTasks.filter((_, idx) => idx !== index));
  }, []);

  const saveEditedTask = useCallback((editedTask) => {
    const updatedTasks = [...tasks];
    if (editIndex !== -1) {
      updatedTasks[editIndex] = editedTask;
      setTasks(updatedTasks);
      setEditIndex(-1);
    }
    setModalVisible(false);
  }, [tasks, editIndex]);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Simple ToDo App</Text>
      <FlatList
        data={tasks}
        renderItem={({ item, index }) => (
          <TaskItem item={item} index={index} onEdit={handleEditTask} onDelete={handleDeleteTask} />
        )}
        keyExtractor={(_, index) => `task-${index}`}
      />
      <TaskInput task={task} setTask={setTask} onAdd={handleAddTask} />
      <EditTaskModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        task={task}
        onSave={saveEditedTask}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 40,
    marginTop: 40,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#2b2d42',
  },
  addTaskRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#2b2d42',
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#edf2f4',
    marginRight: 10,
  },
  addButton: {
    backgroundColor: '#2b2d42',
    padding: 10,
    borderRadius: 10,
    height: 50,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  task: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#edf2f4',
  },
  itemList: {
    fontSize: 16,
    color: '#333333',
    flexShrink: 1,
  },
  taskButtons: {
    flexDirection: 'row',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTextInput: {
    width: '100%',
    marginBottom: 15,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#2b2d42',
  },
});

export default App;