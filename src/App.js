import React, { useState, useEffect } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import DeleteIcon from "@material-ui/icons/Delete";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { auth, db } from "./firebase";

//58:04

export function App(props) {
  const [user, setUser] = useState(null);
  const [task, setTask] = useState([]);
  const [new_task, setNewTask] = useState("");
  const [priority, setPriority] = React.useState("");
  const [incomplete, setIncomplete] = useState([]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(u => {
      if (u) {
        setUser(u);
      } else {
        props.history.push("/");
      }
    });
    return unsubscribe;
  }, [props.history]);

  useEffect(() => {
    let unsubscribe;

    if (user) {
      unsubscribe = db
        .collection("users")
        .doc(user.uid)
        .collection("tasks")
        .onSnapshot(snapshot => {
          const updated_tasks = [];
          snapshot.forEach(doc => {
            const data = doc.data();
            updated_tasks.push({
              text: data.text,
              checked: data.checked,
              id: doc.id
            });
          });
          setTask(updated_tasks);
        });
    }
    return unsubscribe;
  }, [user, task, incomplete]);

  const handleChange = event => {
    setPriority(event.target.value);
  };

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        props.history.push("/");
      })
      .catch(error => {
        alert(error.message);
      });
  };

  const handleAddTask = () => {
    db.collection("users")
      .doc(user.uid)
      .collection("tasks")
      .add({ text: new_task, checked: false })
      .then(() => {
        setNewTask("");
      });
  };

  const handleDeleteTask = task_id => {
    db.collection("users")
      .doc(user.uid)
      .collection("tasks")
      .doc(task_id)
      .delete();
  };

  const handleCheckTask = (checked, task_id) => {
    db.collection("users")
      .doc(user.uid)
      .collection("tasks")
      .doc(task_id)
      .update({ checked: checked });
  };

  if (!user) {
    return <div />;
  }

  return (
    <div>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography
            variant="h6"
            color="inherit"
            style={{ flexGrow: 1, marginLeft: "30px" }}
          >
            To Do List
          </Typography>
          <Typography color="inherit" style={{ marginRight: "30px" }}>
            Hi! {user.email}
          </Typography>
          <Button color="inherit" onClick={handleSignOut}>
            Sign Out
          </Button>
        </Toolbar>
      </AppBar>
      <div
        style={{ display: "flex", justifyContent: "Center", marginTop: "30px" }}
      >
        <Paper style={{ padding: "30px", width: "700px" }}>
          <Typography variant="h6">To Do List</Typography>
          <div style={{ display: "flex", marginTop: "30px" }}>
            <TextField
              fullWidth={true}
              placeholder="Add a new task here"
              style={{ marginRight: "30px" }}
              value={new_task}
              onChange={e => {
                setNewTask(e.target.value);
              }}
            />
            <Button variant="contained" color="primary" onClick={handleAddTask}>
              Add
            </Button>
          </div>

          <div>Incomplete Tasks</div>

          <div>Completed Tasks</div>

          <div>
            <List>
              {task.map(value => {
                const labelid = `checkbox-list-label-${value}`;
                return (
                  <ListItem key={value.id}>
                    <ListItemIcon>
                      <Checkbox
                        checked={value.checked}
                        onChange={(e, checked) => {
                          handleCheckTask(checked, value.id);
                        }}
                        // checked={checked.indexOf(value) !== -1}
                        inputProps={{ "aria-labelledby": labelid }}
                      />
                    </ListItemIcon>
                    <ListItemText id={labelid} primary={value.text} />
                    <ListItemSecondaryAction>
                      <FormControl>
                        <InputLabel>Priority</InputLabel>
                        <Select
                          labelid="demo-simple-select-label"
                          id="demo-simple-select"
                          value={priority}
                          onChange={handleChange}
                        >
                          <MenuItem value={1}>Low</MenuItem>
                          <MenuItem value={2}>Medium</MenuItem>
                          <MenuItem value={3}>High</MenuItem>
                        </Select>
                      </FormControl>
                      <IconButton
                        onClick={() => {
                          handleDeleteTask(value.id);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                );
              })}
            </List>
          </div>
        </Paper>
      </div>
    </div>
  );
}
