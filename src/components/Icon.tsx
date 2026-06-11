import React from 'react'
import { SvgProps } from 'react-native-svg'

type IconProps = SvgProps & {
	icon: React.FC<SvgProps>
}

function Icon({ icon: IconComponent, ...props }: IconProps) {
	const defaultProps: SvgProps = {
		width: 24,
		height: 24,
		stroke: '#000000',
		strokeWidth: 6,
	}

	return <IconComponent {...defaultProps} {...props} />
}

export default Icon