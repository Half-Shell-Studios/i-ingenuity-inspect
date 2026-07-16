import { useState } from "react";
import { LayoutAnimation, Platform, StyleSheet, Text, TouchableOpacity, UIManager, View } from "react-native";

if( Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental ) {
	UIManager.setLayoutAnimationEnabledExperimental(true);
}

type Option = {
	label: string;
	value: string
};

export type SelectOption = Option;

type Props = {
	options: Option[];
	placeholder?: string;
	value?: string;
	onChange: (value: string) => void;
};

export default function InlineDropdown({ options, placeholder = "Select...", value, onChange }: Props) {
	const [ open, setOpen ] = useState( false );

	const selected = options.find( o => o.value === value );

	const toggle = () => {
		LayoutAnimation.configureNext( LayoutAnimation.Presets.easeInEaseOut );
		setOpen( prev => !prev );
	};

	const handleSelect = ( val: string ) => {
		onChange( val );
		toggle();
	};

	return (
		<View style={ styles.container }>
			<TouchableOpacity style={ styles.header } onPress={ toggle } activeOpacity={ 0.7 }>
				<Text style={[ styles.headerText, !selected && styles.placeholder ]}>
					{ selected ? selected.label : placeholder }
				</Text>
				<Text style={ styles.arrow }>{open ? "▲" : "▼"}</Text>
			</TouchableOpacity>

			{open && (
				<View style={ styles.list }>
					{options.map( option => (
					<TouchableOpacity key={ option.value } style={[ styles.item, option.value === value && styles.itemSelected ]} onPress={() => handleSelect( option.value )}>
						<Text style={ styles.itemText }>
							{ option.label }
						</Text>
					</TouchableOpacity>
					))}
				</View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		width: "100%",
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingVertical: 12,
		paddingHorizontal: 16,
		borderWidth: 1,
		borderColor: "#ccc",
		borderRadius: 8,
		backgroundColor: "#fff",
	},
	headerText: {
		fontSize: 16,
		color: "#111",
	},
	placeholder: {
		color: "#999",
	},
	arrow: {
		fontSize: 12,
		color: "#666",
	},
	list: {
		marginTop: 4,
		borderWidth: 1,
		borderColor: "#eee",
		borderRadius: 8,
		overflow: "hidden",
		backgroundColor: "#fff",
	},
	item: {
		paddingVertical: 12,
		paddingHorizontal: 16,
		borderBottomWidth: 1,
		borderBottomColor: "#f0f0f0",
	},
	itemSelected: {
		backgroundColor: "#f5f5ff",
	},
	itemText: {
		fontSize: 16,
		color: "#111",
	},
});