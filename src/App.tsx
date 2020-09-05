import axios from "axios";
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Message } from 'primereact/message';
import React from 'react';
import * as Model from './model';

function App() {
	const themeState = localStorage.getItem('apiTesterTheme');
	const fieldURLState = localStorage.getItem('apiTesterURL');
	const fieldReqTypeState = localStorage.getItem('apiTesterReqType');
	const fieldTokenState = localStorage.getItem('apiTesterToken');
	const fieldBodyState = localStorage.getItem('apiTesterBody');

	// Input State
	const [theme, setTheme] = React.useState<Model.ThemeType>(themeState !== null ? themeState as Model.ThemeType : 'light');
	const [url, setURL] = React.useState<string>(fieldURLState !== null ? fieldURLState as string : 'http://localhost:10000/alive');
	const [reqType, setReqType] = React.useState<string>(fieldReqTypeState !== null ? fieldReqTypeState as string : 'GET');
	const [token, setToken] = React.useState<string>(fieldTokenState !== null ? fieldTokenState as string : '');
	const [body, setBody] = React.useState<string>(fieldBodyState !== null ? fieldBodyState as string : JSON.stringify({ username: "user", password: "pw" }, null, 4));
	// UI Effect
	const [isReloading, setIsReloading] = React.useState<boolean>(false);
	// Request Result
	const [result, setResult] = React.useState<Model.SimpleMap<any>>({});

	const changeCSS = () => {
		if (isReloading) {
			return;
		}

		let newTheme: Model.ThemeType = 'dark';
		if (theme === 'dark') {
			newTheme = 'light';
		}

		localStorage.setItem('apiTesterTheme', newTheme);
		setTheme(newTheme);
	};

	const reloadCSS = (type: string) => {
		const cssLink = document.getElementById(type + '-css');
		const cssTheme = 'mdc-' + theme + '-indigo';
		if (cssLink !== null) {
			const cssPath = window.location.origin + '/assets/' + cssTheme + '/' + type + '.css';
			cssLink.setAttribute('href', cssPath);
		}
	};

	React.useEffect(() => {
		reloadCSS('index');
		reloadCSS('theme');

		setIsReloading(true);
	}, [theme]);

	React.useEffect(() => {
		// This ensure all component is reloaded after CSS is changed
		if (isReloading) {
			setIsReloading(false);
		}
	}, [isReloading]);

	const submitAPI = () => {
		const api = axios.create({
			baseURL: url,
			validateStatus: () => true
		})

		let headers = {};
		if (token && token != "") {
			headers = {
				headers: {
					Authorization: "Bearer " + token
				}
			};
		}

		let params = JSON.parse(body);

		const finishResponse = (res: any) => {
			let paramString = JSON.stringify(params, null, 4);
			localStorage.setItem('apiTesterBody', paramString);
			setBody(paramString);

			setResult({
				status: res.status,
				data: res.data
			});
		}

		switch (reqType) {
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
				api.delete("", headers).then(res => finishResponse(res))
				break
		}
	};

	return (
		<div style={{ margin: "20px" }}>
			{!isReloading &&
				<div className="p-align-center">
					<h1>Kurogami API Tester</h1>
					<div className="p-grid">
						<div className="p-col">
							<Button className="p-button-sm"
								label={theme === 'light' ? 'Dark' : 'Light'}
								icon={"pi pi-circle-" + (theme === 'light' ? 'on' : 'off')}
								onClick={changeCSS} />
						</div>
						<div className="p-col-10 p-shadow-4">
							<div className="p-fluid">
								<div className="p-field p-grid">
									<label htmlFor="url" className="p-col-12 p-md-2">URL</label>
									<div className="p-col-12 p-md-8">
										<InputText id="url" style={{ margin: "0px 0px 5px 0px" }} type="text"
											value={url}
											onChange={(e) => {
												localStorage.setItem('apiTesterURL', e.currentTarget.value);
												setURL(e.currentTarget.value);
											}} />
									</div>
									<div className="p-col-12 p-md-2">
										<Dropdown
											optionLabel="key"
											options={[
												{ key: "GET", value: "GET" },
												{ key: "POST", value: "POST" },
												{ key: "PUT", value: "PUT" },
												{ key: "DELETE", value: "DELETE" }
											]}
											value={reqType}
											onChange={(e) => {
												localStorage.setItem('apiTesterReqType', e.value);
												setReqType(e.value);
											}} />
									</div>
								</div>
								<div className="p-field p-grid">
									<label htmlFor="token" className="p-col-12 p-md-2">Token</label>
									<div className="p-col-12 p-md-10">
										<InputText id="token" type="text"
											value={token}
											onChange={(e) => {
												localStorage.setItem('apiTesterToken', e.currentTarget.value);
												setToken(e.currentTarget.value);
											}} />
									</div>
								</div>
								<div className="p-field p-grid">
									<div className="p-col-12 p-md-6">
										<div className="p-field">
											Body (RAW)
										</div>
										<div className="p-field">
											<InputTextarea type="text"
												rows={10}
												value={body}
												onChange={(e) => {
													localStorage.setItem('apiTesterBody', e.currentTarget.value);
													setBody(e.currentTarget.value);
												}} />
										</div>
										<div className="p-field">
											<Button label="Submit" className="p-button-raised"
												onClick={submitAPI} />
										</div>
									</div>
									<div className="p-col-12 p-md-6">
										<div className="p-field">
											Result
										</div>
										{result &&
											<div className="p-field">
												{result.status >= 200 && result.status < 300 &&
													<Message severity="success" text={result.status} />
												}
												{(result.status < 200 || result.status >= 300) &&
													<Message severity="error" text={result.status} />
												}
											</div>
										}
										<div className="p-field">
											<InputTextarea type="text"
												rows={6}
												value={result ? JSON.stringify(result.data, null, 4) : ''}
											/>
										</div>
									</div>
								</div>
							</div>

						</div>
						<div className="p-col"></div>
					</div>
				</div>
			}
		</div>
	);
}

export default App;
