import { cssProp } from "@/utils";

const reactSelectObsidianTheme = {
	dropdownIndicator: (provided, state) => {
		return { ...provided, paddingBottom: 2, paddingTop: 2 };
	},
	control: (provided, state) => {
		return { ...provided, background: cssProp("--background-button"), borderColor: cssProp("--modal-border"), minHeight: "0", paddingTop: "0", paddingBottom: "0" };
	},
	valueContainer: (provided, state) => {
		return { ...provided, paddingTop: "0", paddingBottom: "0" };
	},
	container: (provided, state) => {
		return { ...provided, paddingTop: "0", paddingBottom: "0" };
	},
	singleValue: (provided, state) => {
		return { ...provided, color: cssProp("text-normal") };
	},
	placeholder: (provided, state) => {
		return { ...provided, paddingTop: "0", paddingBottom: "0", color: cssProp("--text-faint") };
	},
	input: (provided, state) => {
		return { ...provided, marginTop: "0", marginBottom: "0", color: cssProp("text-normal") };
	},
	menu: (provided, state) => {
		return { ...provided, background: cssProp("--background-button") };
	},
	option: (provided, state) => {
		let background = "inherit";
		let color = "inherit";
		if (state.isFocused) {
			background = cssProp("--background-tertiary");
		}
		if (state.isSelected) {
			background = cssProp("--background-secondary");
			color = cssProp("--text-normal");
		}
		return { ...provided, background, color };
	},
	indicatorSeparator: (styles) => ({
		...styles,
		minHeight: "0",
	}),
	indicatorsContainer: (styles) => ({
		...styles,
		minHeight: "0",
	}),
};

export default reactSelectObsidianTheme;
