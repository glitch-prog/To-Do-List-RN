import React, { useState } from 'react';
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
  const { text, description } = route.params;
  const [data, setData] = useState<any>([]);
  const [value, setValue] = useState('');
  const [open, setOpen] = useState(false);
  const [isEdited, setIsEdited] = useState(false);

  const handleOnPressEdit = () => {
    setIsEdited(!isEdited);
  };

  return (
    <View style={styles.container}>
      <View>
        <View>
          <Text style={styles.todo__name}>
            {JSON.stringify(text)
              .split('')
              .filter((el) => el != `"`)
              .join('')}
          </Text>

          <Text>{description}</Text>
          {isEdited ? (
            <View>
              <TextInput
                // multiline
                placeholder="What's on your mind?"
                // style={{ height: 200, padding: 10, backgroundColor: 'white' }}
                // value={isEdited}
                // onChangeText={(text) => handleOnChangeUpdate(text)}
              />
              <Button
                title="Done"
                onPress={() => {
                  // Pass and merge params back to home screen
                  navigation.navigate({
                    name: 'main',
                    params: { text: isEdited },
                    merge: true,
                  });
                }}
              />
            </View>
          ) : (
            <Icon name="pencil" size={12} onPress={handleOnPressEdit} />
          )}
        </View>

        <TouchableOpacity
          onPress={() => {
            setOpen(!open);
            console.log(open);
          }}
          // style={styles.create_btn}
        >
          <Text>create subTodo</Text>
        </TouchableOpacity>
        {open ? (
          <View>
            <TextInput onChangeText={(text) => setValue(text)} />
            <Button
              title="create"
              onPress={() => {
                setData([...data, { subtitle: value }]);
                console.log(data);
                setOpen(!open);
              }}
            />
          </View>
        ) : (
          <Text>Closed</Text>
        )}
        <View>
          <FlatList
            data={data}
            style={styles.subtitle_list}
            renderItem={({ item }) => (
              <View style={styles.subtitle_list_item}>
                {/* <Icon name="check" /> */}
                <Text>{item.subtitle}</Text>
              </View>
            )}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // container: {
  //   justifyContent: 'center',
  //   width: '70%',
  //   height: '80%',
  //   margin: 'auto',
  //   marginLeft: 'auto',
  //   marginRight: 'auto',
  // },
  container: {
    // width: '100%',
    // height: '100%',
    backgroundColor: '#f7f7f7',
    // display: 'flex',
    // justifyContent: 'center',
    // alignItems: 'center',
  },
});
