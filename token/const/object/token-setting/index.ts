import { TOKEN_ARCHITECTURE_SETTING } from '$stylist/token/const/object/architecture';
import { TOKEN_CALENDAR_SETTING } from '$stylist/token/const/object/calendar';
import { TOKEN_CANVAS_SETTING } from '$stylist/token/const/object/canvas';
import { TOKEN_CHART_SETTING } from '$stylist/token/const/object/chart';
import { TOKEN_COLOR_SETTING } from '$stylist/token/const/object/color';
import { TOKEN_CONTROL_SETTING } from '$stylist/token/const/object/control';
import { TOKEN_DEVICE_FRAME_SETTING } from '$stylist/token/const/object/device-frame';
import { TOKEN_FILE_SETTING } from '$stylist/token/const/object/file';
import { TOKEN_GEO_SETTING } from '$stylist/token/const/object/geo';
import { TOKEN_GRAPH_SETTING } from '$stylist/token/const/object/graph';
import { TOKEN_INTERACTION_SETTING } from '$stylist/token/const/object/interaction';
import { TOKEN_LAYOUT_SETTING } from '$stylist/token/const/object/layout';
import { TOKEN_LOCALIZATION_SETTING } from '$stylist/token/const/object/localization';
import { TOKEN_NOTIFICATION_SETTING } from '$stylist/token/const/object/notification';
import { TOKEN_SVG_SETTING } from '$stylist/token/const/object/svg';
import { TOKEN_DOMAIN_SETTING } from '$stylist/token/const/object/domain';
import { TOKEN_THEME_SETTING } from '$stylist/token/const/object/theme';
import { TOKEN_TYPOGRAPHY_SETTING } from '$stylist/token/const/object/typography';

export const TOKEN_SETTING = [
	...TOKEN_ARCHITECTURE_SETTING,
	...TOKEN_CALENDAR_SETTING,
	...TOKEN_CANVAS_SETTING,
	...TOKEN_CHART_SETTING,
	...TOKEN_COLOR_SETTING,
	...TOKEN_CONTROL_SETTING,
	...TOKEN_DEVICE_FRAME_SETTING,
	...TOKEN_FILE_SETTING,
	...TOKEN_GEO_SETTING,
	...TOKEN_GRAPH_SETTING,
	...TOKEN_INTERACTION_SETTING,
	...TOKEN_LAYOUT_SETTING,
	...TOKEN_LOCALIZATION_SETTING,
	...TOKEN_NOTIFICATION_SETTING,
	...TOKEN_SVG_SETTING,
	...TOKEN_DOMAIN_SETTING,
	...TOKEN_THEME_SETTING,
	...TOKEN_TYPOGRAPHY_SETTING
] as const;
