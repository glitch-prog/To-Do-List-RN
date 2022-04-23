import Realm from 'realm';

const TaskSchema = {
  name: 'Task',
  properties: {
    _id: 'int',
    name: 'string',
    status: 'string?',
  },
  primaryKey: '_id',
};

(async () => {
  // use realm to interact with database
  const realm = await Realm.open({
    path: 'myrealm',
    schema: [TaskSchema],
  });

  // ### write records to database
  // realm.write(() => {
  //   task1 = realm.create("Task", {
  //     _id: 1,
  //     name: "go grocery shopping",
  //     dateCreated: Date.now(),
  //     status: "Open",
  //   });
  //   task2 = realm.create("Task", {
  //     _id: 2,
  //     name: "go exercise",
  //     dateCreated: Date.now(),
  //     status: "Open",
  //   });
  //   console.log(`created two tasks: ${task1.name} & ${task2.name}`);
  // });

  // ### read records from database
  const tasks = realm.objects('Task');
  console.log(
    `The lists of tasks are: ${tasks.map((task: any) => {
      return task.name + ' ' + task._id + '\n\r';
    })}`
  );

  // ### read ONE record from database
  // const myTask = realm.objectForPrimaryKey("Task", 1637096347792); // search for a realm object with a primary key that is an int.
  // console.log(`got task: ${myTask.name} & ${myTask._id}`);

  // ### modify ONE record from database
  // realm.write(() => {
  //   let myTask = realm.objectForPrimaryKey("Task", 1637096347792);
  //   console.log(`original task: ${myTask.name} & ${myTask._id} ${myTask.status}`);
  //   myTask.status = "Closed"
  // });

  // ### delete ONE record from database
  realm.write(() => {
    try {
      let myTask = realm.objectForPrimaryKey('Task', 1637096312440);
      realm.delete(myTask);
      console.log('deleted task ');
      // myTask = null;
    } catch (error) {
      console.log(error);
    }
  });
})();
