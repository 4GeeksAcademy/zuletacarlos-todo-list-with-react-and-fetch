import React, { useState, useEffect } from "react";

const Home = () => {
	const [task, setTask] = useState("");
	const [list, setList] = useState([]);

	const USER = "Carlos";
	const API_USERS = `https://playground.4geeks.com/todo/users/${USER}`;
	const API_TODOS = `https://playground.4geeks.com/todo/todos/${USER}`;

	const createUser = () => {
		fetch(API_USERS, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify([])
		})
			.then(resp => {
				console.log("usuario creado exitosamente");
				getTasks();
			})
			.catch(error => console.log(error));
	};

	const getTasks = () => {
		fetch(API_USERS)
			.then((resp) => {
				console.log(resp.status);
				if (resp.status === 404) {
					createUser();
					return null;
				}
				return resp.json();
			})
			.then((data) => {
				if (data) {
					setList(data.todos);
				}
			})
			.catch(error => console.log(error));
	};

	useEffect(() => {
		getTasks();
	}, []);

	const addTask = (e) => {
		if (e.key === "Enter" && task.trim() !== "") {
			fetch(API_TODOS, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					label: task.trim(),
					is_done: false
				})
			}).then(() => {
				setTask("");
				getTasks();
			});
		}
	};

	const deleteTask = (id) => {
		fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
			method: "DELETE"
		}).then(() => getTasks());
	};

	const clearAll = () => {
		fetch(API_USERS, { method: "DELETE" })
			.then(() => {
				createUser();
				setList([]);
			});
	};

	return (
		<div className="todo-container">
			<h1 className="title">todos</h1>

			<input
				type="text"
				className="input-box"
				placeholder="What needs to be done?"
				value={task}
				onChange={(e) => setTask(e.target.value)}
				onKeyDown={addTask}
			/>

			<ul className="todo-list">
				{list.length === 0 ? (
					<li className="todo-item text-muted">Nothing to do — add a task</li>
				) : (
					list.map((item) => (
						<li key={item.id} className="todo-item">
							{item.label}
							<span className="delete" onClick={() => deleteTask(item.id)}>
								✖
							</span>
						</li>
					))
				)}
			</ul>

			<div className="footer-count">
				{list.length} item{list.length !== 1 ? "s" : ""} left
			</div>

			<button className="btn btn-danger mt-3" onClick={clearAll}>
				Delete all tasks
			</button>
		</div>
	);
};

export default Home;