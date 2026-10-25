import { untrack } from 'svelte';
import { ClassNamesManager } from '$stylist/layout/class/manager/class-names';
import type { RecipeMockDataSelector } from '$stylist/development/interface/recipe/mock-data-selector';
import type { SlotMockDataSelectorSelection } from '$stylist/development/interface/slot/mock-data-selector-selection';
import type { TokenIconName } from '$stylist/svg/type/alias/icon-name';

export function createMockDataSelectorState(getProps: () => RecipeMockDataSelector) {
	const props = $derived(getProps());
	const Database: TokenIconName = 'cabinet-database';
	const Shuffle: TokenIconName = 'zap';
	const Download: TokenIconName = 'download';
	const Upload: TokenIconName = 'upload';
	const Search: TokenIconName = 'search';
	const Filter: TokenIconName = 'filter';

	let selections = $state<SlotMockDataSelectorSelection[]>(
		untrack(() => props.initialSelections) ?? []
	);
	let searchQuery = $state('');
	let selectedTags = $state<string[]>([]);
	let availableTags = $state<string[]>([]);

	const schemas = $derived(props.schemas ?? []);
	const title = $derived(props.title ?? 'Mock Data Selector');
	const description = $derived(
		props.description ?? 'Select mock data schemas to generate sample data'
	);
	const allowMultipleSelections = $derived(props.allowMultipleSelections ?? true);
	const allowFieldSelection = $derived(props.allowFieldSelection ?? true);
	const allowCustomCount = $derived(props.allowCustomCount ?? true);
	const showSearch = $derived(props.showSearch ?? true);
	const showTagsFilter = $derived(props.showTagsFilter ?? true);
	const className = $derived(props.class ?? '');
	const headerClass = $derived(props.headerClass ?? '');
	const selectorClass = $derived(props.selectorClass ?? '');
	const previewClass = $derived(props.previewClass ?? '');
	const footerClass = $derived(props.footerClass ?? '');

	const containerClass = $derived(
		ClassNamesManager.merge(
			'c-mock-data-selector bg-[--color-background-primary] rounded-lg border border-[--color-border-primary] p-6',
			className
		)
	);
	const headerComputedClass = $derived.by(() => {
		const header = 'mb-6';
		return headerClass ? `${header} ${headerClass}` : header;
	});
	const footerComputedClass = $derived.by(() => {
		const footer = 'mt-6 flex justify-end gap-3';
		return footerClass ? `${footer} ${footerClass}` : footer;
	});

	// Initialize tags
	$effect(() => {
		const tagsSet = new Set<string>();
		schemas.forEach((schema) => {
			schema.tags.forEach((tag: string) => tagsSet.add(tag));
		});
		availableTags = Array.from(tagsSet).sort();
	});

	function addSelection(schemaId: string) {
		const schema = schemas.find((s) => s.id === schemaId);
		const newSelection: SlotMockDataSelectorSelection = {
			schemaId,
			count: 5,
			selectedFields: allowFieldSelection
				? schema?.fields.map((f: { name: string }) => f.name)
				: undefined
		};

		if (allowMultipleSelections) {
			selections = [...selections, newSelection];
		} else {
			selections = [newSelection];
		}

		if (props.onSelectionChange) {
			props.onSelectionChange(selections);
		}
	}

	function removeSelection(index: number) {
		selections = selections.filter((_, i) => i !== index);
		if (props.onSelectionChange) {
			props.onSelectionChange(selections);
		}
	}

	function updateCount(index: number, count: number) {
		if (count >= 0) {
			selections[index] = { ...selections[index], count };
			if (props.onSelectionChange) {
				props.onSelectionChange(selections);
			}
		}
	}

	function toggleField(index: number, fieldName: string) {
		if (!allowFieldSelection || !selections[index].selectedFields) return;

		const fieldIndex = selections[index].selectedFields!.indexOf(fieldName);
		if (fieldIndex > -1) {
			selections[index].selectedFields!.splice(fieldIndex, 1);
		} else {
			selections[index].selectedFields!.push(fieldName);
		}

		if (props.onSelectionChange) {
			props.onSelectionChange(selections);
		}
	}

	function loadMockData() {
		if (props.onLoadMockData) {
			props.onLoadMockData(selections);
		}
	}

	function toggleTag(tag: string) {
		if (selectedTags.includes(tag)) {
			selectedTags = selectedTags.filter((t) => t !== tag);
		} else {
			selectedTags = [...selectedTags, tag];
		}
	}

	function getFilteredSchemas() {
		return schemas.filter((schema) => {
			if (
				searchQuery &&
				!schema.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
				!schema.description.toLowerCase().includes(searchQuery.toLowerCase())
			) {
				return false;
			}
			if (selectedTags.length > 0 && !selectedTags.every((tag) => schema.tags.includes(tag))) {
				return false;
			}
			return true;
		});
	}

	function getSampleData(schemaId: string, count: number, fields?: string[]) {
		const schema = schemas.find((s) => s.id === schemaId);
		if (!schema) return [];

		const result = [];
		for (let i = 0; i < count; i++) {
			const item: any = {};
			const fieldsToUse =
				fields && fields.length > 0 ? fields : schema.fields.map((f: { name: string }) => f.name);

			schema.fields
				.filter((f: { name: string }) => fieldsToUse.includes(f.name))
				.forEach((field: any) => {
					switch (field.type) {
						case 'string':
							item[field.name] = field.example || `${field.name}_${i}`;
							break;
						case 'number':
							item[field.name] = Math.floor(Math.random() * 100);
							break;
						case 'boolean':
							item[field.name] = Math.random() > 0.5;
							break;
						case 'date':
							item[field.name] = new Date(
								Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)
							)
								.toISOString()
								.split('T')[0];
							break;
						case 'email':
							item[field.name] = `user${i}@example.com`;
							break;
						case 'id':
							item[field.name] = `id_${i}`;
							break;
						default:
							item[field.name] = `value_${i}`;
					}
				});

			result.push(item);
		}

		return result;
	}

	const restProps = $derived.by(() => {
		const {
			class: _className,
			headerClass: _headerClass,
			selectorClass: _selectorClass,
			previewClass: _previewClass,
			footerClass: _footerClass,
			schemas: _schemas,
			initialSelections: _initial,
			title: _title,
			description: _desc,
			allowMultipleSelections: _multi,
			allowFieldSelection: _field,
			allowCustomCount: _count,
			showSearch: _search,
			showTagsFilter: _tags,
			onSelectionChange: _onSelection,
			onLoadMockData: _onLoad,
			...rest
		} = props;
		return rest;
	});

	return {
		get Database() {
			return Database;
		},
		get Shuffle() {
			return Shuffle;
		},
		get Download() {
			return Download;
		},
		get Upload() {
			return Upload;
		},
		get Search() {
			return Search;
		},
		get Filter() {
			return Filter;
		},
		get selections() {
			return selections;
		},
		get searchQuery() {
			return searchQuery;
		},
		set searchQuery(v: string) {
			searchQuery = v;
		},
		get selectedTags() {
			return selectedTags;
		},
		get availableTags() {
			return availableTags;
		},
		get schemas() {
			return schemas;
		},
		get title() {
			return title;
		},
		get description() {
			return description;
		},
		get allowMultipleSelections() {
			return allowMultipleSelections;
		},
		get allowFieldSelection() {
			return allowFieldSelection;
		},
		get allowCustomCount() {
			return allowCustomCount;
		},
		get showSearch() {
			return showSearch;
		},
		get showTagsFilter() {
			return showTagsFilter;
		},
		get className() {
			return className;
		},
		get headerClass() {
			return headerClass;
		},
		get selectorClass() {
			return selectorClass;
		},
		get previewClass() {
			return previewClass;
		},
		get footerClass() {
			return footerClass;
		},
		get containerClass() {
			return containerClass;
		},
		get headerComputedClass() {
			return headerComputedClass;
		},
		get footerComputedClass() {
			return footerComputedClass;
		},
		addSelection,
		removeSelection,
		updateCount,
		toggleField,
		loadMockData,
		toggleTag,
		getFilteredSchemas,
		getSampleData,
		get restProps() {
			return restProps;
		}
	};
}
