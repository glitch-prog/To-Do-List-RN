import React, { useCallback, useLayoutEffect, useState } from 'react';
import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export const TodoItemScreen = ({ navigation, route }: any) => {
  const { text, description, id } = route.params;
  const [value, setValue] = useState<string>(description);
  const [isEdited, setIsEdited] = useState(false);

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

  const getRealmData = useCallback(async (id) => {
    const realm = await Realm.open({
      path: 'myrealm',
      schema: [TaskSchema2],
    });
    const selectedTask: any = realm.objectForPrimaryKey('Tasks1', id);
    console.log(selectedTask);
    setValue(selectedTask['subTasks']);
  }, []);

  const handleOnPressEdit = () => {
    setIsEdited(!isEdited);
  };

  const handleOnChangeText = (text: string) => {
    setValue(text);
  };

  const handleOnPressConfirmChanges = async () => {
    const realm = await Realm.open({
      path: 'myrealm',
      schema: [TaskSchema2],
    });
    console.log(realm.objectForPrimaryKey('Tasks1', id));
    realm.write(() => {
      let myTask: any = realm.objectForPrimaryKey('Tasks1', id);
      myTask['subTasks'] = value;
    });
    setIsEdited(!isEdited);
  };

  useLayoutEffect(() => {
    getRealmData(id);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.todoName}>{text}</Text>
      <TouchableOpacity onPress={handleOnPressEdit}>
        {isEdited ? (
          <View>
            <TextInput
              value={value}
              onChangeText={(text) => handleOnChangeText(text)}
            />
            <TouchableOpacity onPress={() => handleOnPressConfirmChanges()}>
              <Text>Confirm</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={styles.todoDescription}>{value}</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f7f7f7',
    display: 'flex',
    // flexDirection: 'row',
    alignItems: 'center',
  },
  todoName: {
    marginVertical: 26,
    fontSize: 30,
    color: '#000000',
  },
  todoDescription: { fontSize: 18 },
});
