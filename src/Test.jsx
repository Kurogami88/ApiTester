import React, { Component } from "react"
import axios from "axios";

import Form from "react-bootstrap/Form"
import Col from "react-bootstrap/Col"

import "./Tester.css"

class Tester extends Component {
	constructor(props) {
		super(props)

		this.state = {
			url: "http://localhost:10000",
			token: "",
			data: "",
			res: {},
		}
	}
	
	handleSubmit = async event => {
		event.preventDefault();
		event.stopPropagation();
		const form = event.currentTarget;
		
		form.inputData.value = JSON.stringify(JSON.parse(form.inputData.value), null, 4)
		
		const api = axios.create({
			baseURL: form.url.value,
		})

		let params = JSON.parse(form.inputData.value);

		let headers = {};

		if (form.token.value) {
			headers = {
				headers: {
					Authorization: "Bearer " + form.token.value
				}
			}
		}

		let finishResponse = (res) => {
			this.setState({
				url: form.url.value,
				token: form.token.value,
				data: form.inputData.value,
				res: res
			})
		}

		switch (form.operation.value) {
			case "GET":
				api.get("", headers).then(res => finishResponse(res))
				break
			case "POST":
				api.post("", params, headers).then(res => finishResponse(res))
				break
			case "PUT":
				api.put("", params, headers).then(res => finishResponse(res))
				break
			case "DELETE":
				api.delete("", params, headers).then(res => finishResponse(res))
				break
		}
	}

	render() {
		let { url, token, data, res } = this.state
		data = JSON.stringify(data, null, 4)
		res = JSON.stringify(res, null, 4)

		return (
			<div className="dmtTestContainer">
				<br></br>
				<h1>API Tester</h1>
				<Form onSubmit={this.handleSubmit}>
					<Form.Row>
						<Col>
							<Form.Group as={Form.Row} controlId="url">
								<Form.Label column sm={2}>URL</Form.Label>
								<Col>
									<Form.Control type="text" defaultValue={url}/>
								</Col>
							</Form.Group>
						</Col>
					</Form.Row>
					<Form.Row>
						<Col>
							<Form.Group as={Form.Row} controlId="token">
								<Form.Label column sm={2}>Token</Form.Label>
								<Col>
									<Form.Control type="text" defaultValue={token}/>
								</Col>
							</Form.Group>
						</Col>
					</Form.Row>
					<Form.Row>
						<Col>
							<Form.Group as={Form.Row} controlId="operation">
								<Form.Label column sm={2}>Operation</Form.Label>
								<Col>
									<Form.Control as="select">
										<option>GET</option>
										<option>POST</option>
										<option>PUT</option>
										<option>DELETE</option>
									</Form.Control>
								</Col>
							</Form.Group>
						</Col>
					</Form.Row>
					<Form.Row>
						<Col>
							<Form.Group controlId="inputData">
								<Form.Label>Input</Form.Label>
								<Form.Control as="textarea" rows="9" defaultValue={data}/>
							</Form.Group>
						</Col>
						<Col>
							<Form.Group>
								<Form.Label>Output</Form.Label>
								<Form.Control as="textarea" rows="9" readOnly value={res}/>
							</Form.Group>
						</Col>
					</Form.Row>
					<button type="submit">Send</button>
				</Form>
			</div>
		)
	}

}

export default Tester