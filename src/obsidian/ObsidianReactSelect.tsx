import React from 'react';
import Select from 'react-select';
import reactSelectObsidianTheme from '@/helpers/reactSelect'

export default function ObsidianReactSelect() {

	const dummyOptions = [
		{ value: "1", label: "Alessandro" },
		{ value: "2", label: "Paola" },
		{ value: "3", label: "Massimiliano" },
		{ value: "4", label: "Giovanna" },
		{ value: "5", label: "Piero" },
		{ value: "6", label: "Cassandra" },
		{ value: "7", label: "Valeria" },
	]

	return (
		<div className="flex flex-col px-3 space-y-8">
			<div className="flex items-center w-full">
				<Select
					placeholder="Choose user"
					className="w-full"
					styles={reactSelectObsidianTheme}
					options={dummyOptions}
				/>
				<button className={`inline-flex items-center px-4 ml-3 py-2 h-full text-sm font-medium rounded-md shadow-sm cursor-pointer bg-transparent text-disabled border`} >
					Add
				</button>

			</div>
			<select className="self-start dropdown">
				<option value="sideway">Sideway</option>
				<option value="mixed">Mixed</option>
				<option value="upright">Upright</option>
			</select>

		</div>
	)

}