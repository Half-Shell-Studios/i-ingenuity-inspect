
import { Appearance } from "react-native";

export const BRAND_COLOUR_BLUE = '#2500fd';
export const BRAND_COLOUR_YELLOW = '#fff006';
export const BRAND_COLOUR_NAVY = '#151732';
export const BRAND_COLOUR_PURPLE = '#8e51ff';
export const BRAND_COLOUR_GREY = '#e5e5e5';
export const BRAND_COLOUR_DARK_GREY = '#7f7f7f';
export const BRAND_COLOUR_OFFWHITE = '#f5f5f5';
export const BRAND_COLOUR_WHITE = '#ffffff';

export const PRIMARY_COLOUR = BRAND_COLOUR_BLUE;
export const SECONDARY_COLOUR = BRAND_COLOUR_YELLOW;
export const ACCENT_COLOUR = BRAND_COLOUR_PURPLE;
export const SUCCESS_COLOUR = '#00c950';
export const WARNING_COLOUR = '#efb100';
export const ERROR_COLOUR = '#fb2c36';

export const BODY_TEXT_COLOUR = BRAND_COLOUR_NAVY;
export const PLACEHOLDER_TEXT_COLOUR = '#9ca3af';

export const darkModeActive = ( Appearance.getColorScheme() === 'dark' );