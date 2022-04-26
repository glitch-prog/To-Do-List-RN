import React, { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { NetworkConsumer } from 'react-native-offline';
import { TodoItem } from './TodoItem/TodoItem';
import Realm from 'realm';
import Icon from 'react-native-vector-icons/FontAwesome';

export const TodoListScreen = ({ navigation, route }: any) => {
  const [checked, setChecked] = useState<boolean>();
  const [text, setText] = useState('');
  const [isEdited, setIsEdited] = useState(false);
  const [newText, setNewText] = useState<string>('');

  const TaskSchema2 = {
    name: 'Tasks1',
    properties: {
      _id: 'int',
      name: 'string',
      status: 'string',
      isEdited: 'int',
      subTasks: 'string',
    },
    primaryKey: '_id',
  };

  const getTodosFromStore = useCallback(async () => {
    const realm = await Realm.open({
      path: 'myrealm',
      schema: [TaskSchema2],
    });
    const tasks = realm.objects('Tasks1');
    console.log(typeof tasks);
    setListOfItems([...tasks]);
  }, []);

  const onChange = (text: string) => {
    setText(text);
  };

  const handleOnPressSetChecked = async (id: number) => {
    const realm = await Realm.open({
      path: 'myrealm',
      schema: [TaskSchema2],
    });
    realm.write(() => {
      let myTask: any = realm.objectForPrimaryKey('Tasks1', id);
      myTask ? console.log(myTask['status']) : console.log('null');
      myTask['status'] == 'checked'
        ? (myTask['status'] = 'unchecked')
        : (myTask['status'] = 'checked');
    });
    const tasks = realm.objects('Tasks1');
    setListOfItems([...tasks]);
  };

  const handleOnPressEdit = async (id: number) => {
    const realm = await Realm.open({
      path: 'myrealm',
      schema: [TaskSchema2],
    });
    realm.write(() => {
      let myTask: any = realm.objectForPrimaryKey('Tasks1', id);
      myTask ? console.log(myTask['name']) : console.log('null');
      myTask['name'] = newText;
      myTask['isEdited'] = 0;
    });
    const tasks = realm.objects('Tasks1');
    setListOfItems([...tasks]);
  };

  const [listOfItems, setListOfItems] = useState<any>([]);

  const handleOnClickAddTodo = async (text: string) => {
    const filteredText = text
      .split('')
      .filter((el) => el != ' ')
      .join('');
    if (filteredText) {
      const newTodo = {
        _id: Date.now(),
        name: text,
        dateCreated: Date.now(),
        status: 'unchecked',
        isEdited: 0,
        subTasks: 'Add description!!!',
      };
      const realm = await Realm.open({
        path: 'myrealm',
        schema: [TaskSchema2],
      });
      realm.write(() => {
        realm.create('Tasks1', newTodo);
      });
      setListOfItems((list: any) => [newTodo, ...list]);
    }
  };

  const handleOnPressDelete = async (id: number) => {
    const realm = await Realm.open({
      path: 'myrealm',
      schema: [TaskSchema2],
    });
    realm.write(() => {
      try {
        let myTask = realm.objectForPrimaryKey('Tasks1', id);
        realm.delete(myTask);
        console.log('deleted task ');
        // myTask = null;
        const tasks = realm.objects('Tasks1');
        setListOfItems([...tasks]);
      } catch (error) {
        console.log(error);
      }
    });
  };

  const handleOnPressSetIsEdited = async (id: number) => {
    const realm = await Realm.open({
      path: 'myrealm',
      schema: [TaskSchema2],
    });
    realm.write(() => {
      let myTask: any = realm.objectForPrimaryKey('Tasks1', id);
      myTask ? console.log(myTask['name']) : console.log('null');
      myTask['isEdited'] = 1;
    });
    const tasks = realm.objects('Tasks1');
    setListOfItems([...tasks]);
  };

  useLayoutEffect(() => {
    getTodosFromStore();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Tasks</Text>

      <TextInput
        style={styles.searchInput}
        onChangeText={onChange}
        placeholder="Write your task here..."
      />
      <TouchableOpacity
        onPress={() => handleOnClickAddTodo(text)}
        style={styles.btnAdd}
      >
        <Text style={{ color: '#ffffff' }}>+ Add new task</Text>
      </TouchableOpacity>

      <FlatList
        data={listOfItems}
        renderItem={({ item }) => (
          <View style={styles.todoItem}>
            <TouchableOpacity
              style={styles.checkbox}
              onPress={() => handleOnPressSetChecked(item._id)}
            >
              {item.status == 'checked' ? (
                <Icon name="check" size={22} />
              ) : null}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('Todo Item', {
                  text: item.name,
                  description: item.subTasks,
                  id: item._id,
                  // newText: handleOnPressEdit,
                })
              }
            >
              {item.isEdited ? (
                <View>
                  <TextInput
                    value={newText}
                    onChangeText={(text) => setNewText(text)}
                  />
                  <TouchableOpacity onPress={() => handleOnPressEdit(item._id)}>
                    <Text>Confirm</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <Text style={styles.todoItemText}>{item.name}</Text>
              )}
            </TouchableOpacity>

            <View style={styles.btnWrapper}>
              <TouchableOpacity
                onPress={() => {
                  setNewText(item.name);
                  handleOnPressSetIsEdited(item._id);
                }}
              >
                <Icon name="pencil" size={22} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  handleOnPressDelete(item._id);
                }}
              >
                <Icon name="trash" size={22} />
              </TouchableOpacity>
            </View>
          </View>
        )}
        keyExtractor={(item) => item._id}
      />
      <NetworkConsumer>
        {({ isConnected }) =>
          isConnected ? <Text>Connected</Text> : <Text>Disconnected</Text>
        }
      </NetworkConsumer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f7f7f7',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  title: {
    marginVertical: 26,
    fontSize: 30,
    color: '#000000',
  },

  todoItem: {
    display: 'flex',
    minWidth: '100%',
    maxWidth: '80%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 5,
    padding: 16,
    backgroundColor: '#ffffff',
    marginBottom: 6,
  },

  todoItemText: {
    color: '#000000',
    fontSize: 16,
  },

  searchInput: {
    width: '80%',
    padding: 16,
    backgroundColor: '#EDEDED',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginBottom: 16,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 1,
    borderColor: '#000000',
  },

  btnWrapper: {
    width: 50,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  btnAdd: {
    width: '80%',
    paddingVertical: 13,
    backgroundColor: '#2063E7',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 24,
  },
});
