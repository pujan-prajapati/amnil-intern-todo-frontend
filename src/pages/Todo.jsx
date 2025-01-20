import React, { useEffect, useState } from "react";
import { Button, Form, Input } from "antd";
import { FaPen, FaPlus, FaTrash } from "react-icons/fa6";
import axios from "axios";
import { API_URL } from "../constants/constants";

export const Todo = () => {
  const [form] = Form.useForm();
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    getAllTodos();
  }, []);

  const getAllTodos = async () => {
    try {
      const response = await axios.get(`${API_URL}/todos`);
      setTodos(response.data.data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
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
    <section className="container bg-gray-50 my-10 py-5">
      <h1 className="text-center mb-10 font-bold text-4xl text-blue-600 underline">
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

          <Button htmlType="submit" type="primary">
            <FaPlus />
          </Button>
        </Form>
      </div>

      {/* Todos List */}
      <div className="max-w-[700px] mx-auto mt-8">
        {todos.map((todo, index) => (
          <div
            key={todo._id}
            className="rounded-md my-4 shadow-sm shadow-gray-200 bg-green-100 flex justify-between items-center p-3"
          >
            <p>
              {index + 1}. {todo.task}
            </p>
            <div className="flex gap-2">
              <Button type="primary">
                <FaPen />
              </Button>
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
