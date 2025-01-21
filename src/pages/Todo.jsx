import { useEffect, useState } from "react";
import { Button, Checkbox, Form, Input, Modal } from "antd";
import { FaMagnifyingGlass, FaPen, FaPlus, FaTrash } from "react-icons/fa6";
import axios from "axios";
import { API_URL } from "../constants/constants";

export const Todo = () => {
  const [form] = Form.useForm();
  const [todos, setTodos] = useState([]);
  const [activeModalId, setActiveModalId] = useState(null);
  const [priority, setPriority] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const showModal = (id) => {
    const selectedTodo = todos.find((todo) => todo._id === id);

    setPriority(selectedTodo.priority || "");
    setIsCompleted(selectedTodo.completed || false);
    setActiveModalId(id);
  };
  const handleOk = async (taskId) => {
    try {
      // update todo
      const response = await axios.put(`${API_URL}/todos/${taskId}`, {
        priority,
        completed: isCompleted,
      });

      // Fetch all todos after updating
      const todosResponse = await axios.get(`${API_URL}/todos`);
      setTodos(todosResponse.data.data);

      setActiveModalId(null);
      return response.data.data;
    } catch (error) {
      console.log(error);
    }
  };
  const handleCancel = () => {
    setActiveModalId(null);
  };

  useEffect(() => {
    getAllTodos(searchTerm);
  }, [searchTerm]);

  const getAllTodos = async () => {
    try {
      const response = await axios.get(`${API_URL}/todos`, {
        params: { search: searchTerm },
      });
      setTodos(response.data.data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    getAllTodos(term);
  };

  const onFinish = async (values) => {
    try {
      const response = await axios.post(`${API_URL}/todos`, values);

      const newTodo = response.data.data;
      setTodos((prevTodos) => [...prevTodos, newTodo]);

      form.resetFields();
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}/todos/${id}`);
      setTodos(todos.filter((todo) => todo._id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="container shadow-md bg-gray-50 my-10 py-5">
      <h1 className="text-center mb-10 font-bold text-4xl text-orange-600 underline">
        My Todos
      </h1>

      {/* Input Form */}
      <div className="max-w-[700px] mx-auto">
        <Form
          form={form}
          className="flex gap-2 bg-white p-2 rounded-md shadow-sm shadow-gray-300"
          onFinish={onFinish}
        >
          <Form.Item
            className="mb-0 w-full"
            name="task"
            rules={[{ required: true, message: "Task is required" }]}
          >
            <Input
              placeholder="Enter task"
              className="border-none focus:ring-0 rounded-none"
            />
          </Form.Item>

          <Button htmlType="submit" type="primary" className="bg-orange-400">
            <FaPlus />
          </Button>
        </Form>
      </div>

      {/* Todos List */}
      <div className="max-w-[700px] mx-auto mt-8">
        {/* search input */}
        {todos.length !== 0 && (
          <div className="flex justify-end items-center mb-5">
            <Input
              value={searchTerm}
              onChange={handleSearch}
              placeholder="search"
              className="w-72  border-none rounded-none focus:ring-0 shadow-sm shadow-gray-300 p-2"
            />
            <FaMagnifyingGlass className="bg-green-400 w-10 h-10 p-3 text-white shadow-sm shadow-gray-300" />
          </div>
        )}

        {/* todo list */}
        {todos.length === 0 && (
          <p className="text-center italic text-orange-600">No Todos found</p>
        )}

        {todos.map((todo, index) => (
          <div
            key={todo._id}
            className={`
              ${
                todo.priority === "High"
                  ? "bg-green-50 shadow-green-200"
                  : todo.priority === "Medium"
                  ? "bg-blue-50 shadow-blue-200"
                  : todo.priority === "Low"
                  ? "bg-yellow-50 shadow-yellow-200"
                  : "bg-gray-100 shadow-gray-200"
              }
              rounded-sm my-4 shadow-sm  flex justify-between items-center p-3`}
          >
            <div
              className={`text-gray-600 flex gap-5 items-center ${
                todo.completed && "line-through"
              }`}
            >
              <h5 className="font-bold">{index + 1}.</h5>
              <p> {todo.task}</p>
            </div>
            <div className="flex gap-2">
              {/* edit todo*/}
              <Button type="primary" onClick={() => showModal(todo._id)}>
                <FaPen />
              </Button>
              <Modal
                title="Edit my todo"
                open={activeModalId === todo._id}
                onOk={() => handleOk(todo._id)}
                onCancel={handleCancel}
              >
                {/* priority */}
                <div className="flex my-5 justify-between">
                  <Button
                    type="primary"
                    className={`p-7 ${
                      priority === "High"
                        ? "bg-green-400 !text-white font-bold"
                        : "bg-green-200"
                    } text-gray-700 hover:!bg-green-400`}
                    onClick={() => setPriority("High")}
                  >
                    High Priority
                  </Button>
                  <Button
                    type="primary"
                    className={`p-7 ${
                      priority === "Medium"
                        ? "bg-blue-400 !text-white font-bold"
                        : "bg-blue-200"
                    } text-gray-700 hover:!bg-blue-400`}
                    onClick={() => setPriority("Medium")}
                  >
                    Medium Priority
                  </Button>
                  <Button
                    type="primary"
                    className={`p-7 ${
                      priority === "Low"
                        ? "bg-yellow-400 !text-white font-bold"
                        : "bg-yellow-200"
                    } text-gray-700 hover:!bg-yellow-400`}
                    onClick={() => setPriority("Low")}
                  >
                    Low Priority
                  </Button>
                </div>

                {/* complete task */}
                <Checkbox
                  checked={isCompleted}
                  onChange={(e) => setIsCompleted(e.target.checked)}
                >
                  Check to complete task
                </Checkbox>
              </Modal>

              {/* delete todo */}
              <Button
                type="primary"
                danger
                onClick={() => deleteTodo(todo._id)}
              >
                <FaTrash />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
