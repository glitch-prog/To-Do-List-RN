import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export const TodoItem = ({ route, navigation, text }: any) => {
  const [value, setValue] = useState<string>('');

  const handleOnChangeUpdate = (text: string) => {
    setValue(text);
  };
  return (
    <View>
      <Icon name="check" size={24} />
      <TouchableOpacity></TouchableOpacity>
      <TouchableOpacity
        style={styles.todoItem}
        onPress={() =>
          navigation.navigate('Todo Item', {
            text: text,
            // newText: handleOnPressEdit,
          })
        }
      >
        <Text>{text}</Text>
      </TouchableOpacity>
      <Icon name="pencil" />
    </View>
  );
};

const styles = StyleSheet.create({
  todoItem: {
    width: 300,
    borderWidth: 1,
    borderRadius: 5,
    padding: 15,
    borderColor: '#000000',
    backgroundColor: '#ffffff',
  },
});
