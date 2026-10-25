import type { ContractStory } from '$stylist/html/interface/contract/story';
import type { SlotStoryControl } from '$stylist/html/interface/slot/story-control';

const plain = (value: object) => {
	const prototype = Object.getPrototypeOf(value);
	return Array.isArray(value) || prototype === Object.prototype || prototype === null;
};

function infer(value: unknown): SlotStoryControl | null {
	if (typeof value === 'string') return { type: 'text' };
	if (typeof value === 'number') return { type: 'number' };
	if (typeof value === 'boolean') return { type: 'boolean' };
	if (typeof value === 'object' && value !== null && plain(value))
		return { type: 'json', example: value };
	return null;
}

/**
 * Controls of the story panel: the story's own controls first, then one inferred from the
 * value of every other arg (`args`, else the first preset that sets it). Strings, numbers
 * and booleans get their inputs, plain arrays and objects `json`; functions, snippets,
 * class instances and nullish values get none; `controls: { name: undefined }` hides an arg.
 */
export function resolveStoryControls(
	story: ContractStory
): { name: string; control: SlotStoryControl; auto: boolean }[] {
	const own = Object.entries(story.controls ?? {}).flatMap(([name, control]) =>
		control ? [{ name, control, auto: false }] : []
	);
	const values = new Map<string, unknown>();
	for (const source of [story.args, ...Object.values(story.presets ?? {})])
		for (const [name, value] of Object.entries(source ?? {}))
			if (!values.has(name) && value !== undefined) values.set(name, value);
	const inferred = [...values].flatMap(([name, value]) => {
		if (name in (story.controls ?? {})) return [];
		const control = infer(value);
		return control ? [{ name, control, auto: true }] : [];
	});
	return [...own, ...inferred];
}
