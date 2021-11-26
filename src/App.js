import React, { useRef, useEffect, useState } from "react";
import "./styles.css";
import { mockList } from "./mockData.js";
import Badge from "./components/Badge";
import ContentEditable from "react-contenteditable";

export default function App() {
  const getLocalItems = () => {
    let mockItems = localStorage.getItem("todoItems");
    if (mockItems) {
      return JSON.parse(mockItems);
    }
    return mockList;
  };
  const text = useRef("");

  const [inputData, setInputData] = useState("");
  const [items, setItems] = useState(getLocalItems());
  let [checkStatus, setCheckStatus] = useState(false);
  let [count, setCount] = useState(mockList.length);
  let [pendingItem, setPendingItem] = useState(() => {
    let pendingTodos = mockList.filter((item) => {
      return item.isComplete !== true;
    });
    return pendingTodos.length;
  });

  useEffect(() => {
    localStorage.setItem("todoItems", JSON.stringify(items));
  }, [items]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (inputData) {
        setItems([
          ...items,
          { id: Math.random(), title: inputData, isComplete: false },
        ]);
        setInputData("");
        setCount(count + 1);
        setPendingItem(pendingItem + 1);
      }
    }
  };

  const deleteItem = (id) => {
    const updateItems = items.filter((ele, index) => {
      return id !== ele.id;
    });
    setItems(updateItems);
    setCount(count - 1);
    setPendingItem(pendingItem - 1);
  };

  const clearComplete = (e) => {
    const updateItems = items.filter((ele, index) => {
      return ele.isComplete !== true;
    });
    setItems(updateItems);
  };

  const seeAllActive = (e) => {
    const updateItems = items.filter((ele, index) => {
      return ele.isComplete !== true;
    });
    setItems(updateItems);
  };

  const markAsComplete = (id) => {
    setItems(
      items.map((todo) => {
        if (todo.id === id) {
          if (!todo.isComplete) {
            setPendingItem(pendingItem - 1);
          } else {
            setPendingItem(pendingItem + 1);
          }
          return {
            ...todo,
            isComplete: !todo.isComplete,
          };
        }
        return todo;
      })
    );
  };

  const checkAll = (e) => {
    setItems(
      items.map((todo) => {
        return {
          ...todo,
          isComplete: !checkStatus,
        };
      })
    );
    setCheckStatus(!checkStatus);
    if (checkStatus) setPendingItem(items.length);
    else setPendingItem(0);
  };

  return (
    <div className="container mt-5">
      <div className="border rounded p-3 col-md-5 mx-auto card">
        <h3 className="fw-bold mb-1">React Todo App</h3>
        <div className="mb-2">
          <Badge color="primary" text="Bootstrap" />
          <Badge color="info" text="Add / Edit / Delete" />
          <Badge color="warning" text="Local Storage" />
          <Badge color="success" text="Mark as Complete" />
        </div>
        <form action="#">
          <input
            type="text"
            value={inputData}
            onKeyDown={handleKeyDown}
            onChange={(e) => setInputData(e.target.value)}
            className="form-control"
            placeholder="What do you need to do ? "
          />
        </form>

        <ul className="mt-3 no-bullets ps-2 pe-2">
          {items.map((todo, index) => (
            <li key={index}>
              <div className="d-flex justify-content-between">
                <div>
                  <input
                    type="checkbox"
                    checked={todo.isComplete || checkStatus}
                    onChange={() => markAsComplete(todo.id)}
                  />
                  <span
                    className={
                      todo.isComplete ? "ms-3 mark_as_complete" : "ms-3"
                    }
                  >
                    <ContentEditable
                      html={todo.title}
                      tagName="span"
                      onChange={(e) => {
                        items.map((item) => {
                          if (item.id === todo.id) {
                            item.title = e.target.value;
                          }
                        });
                        setItems(items);
                      }}
                    />
                  </span>
                </div>
                <i
                  className="fas fa-times"
                  onClick={() => deleteItem(todo.id)}
                ></i>
              </div>
            </li>
          ))}
        </ul>
        <hr />
        <div className="d-flex justify-content-between">
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={checkAll}
          >
            Check all
          </button>
          <span>
            {pendingItem} Items Remaining Out of {count}
          </span>
        </div>
        <hr />
        <div className="d-flex justify-content-between">
          <div>
            <button className="btn btn-sm btn-outline-secondary">All</button>
            <button className="btn btn-sm ">Active</button>
            <button className="btn btn-sm">Complete</button>
          </div>
          <div>
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={clearComplete}
            >
              Clear Complete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
