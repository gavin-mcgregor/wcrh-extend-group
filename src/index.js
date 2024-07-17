/**
 * External dependencies
 */
import classnames from "classnames";

/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";
import { addFilter } from "@wordpress/hooks";
import { InspectorControls } from "@wordpress/block-editor";
import {
	PanelBody,
	SelectControl,
	Flex,
	FlexItem,
} from "@wordpress/components";

/**
 * Add the attribute needed for reversing column direction on mobile.
 *
 * @since 0.1.0
 * @param {Object} settings
 */
function addAttributes(settings) {
	if ("core/group" !== settings.name) {
		return settings;
	}

	// Add the attribute.
	const newAttributes = {
		width: {
			type: "string",
			default: false,
		},
	};

	const newSettings = {
		...settings,
		attributes: {
			...settings.attributes,
			...newAttributes,
		},
	};

	return newSettings;
}

addFilter(
	"blocks.registerBlockType",
	"wcrh-extend-group/add-attributes",
	addAttributes
);

/**
 * Filter the BlockEdit object and add icon inspector controls to button blocks.
 *
 * @since 0.1.0
 * @param {Object} BlockEdit
 */
function addInspectorControls(BlockEdit) {
	return (props) => {
		if (props.name !== "core/group") {
			return <BlockEdit {...props} />;
		}

		// Width options
		const widthOptions = [
			{ label: __("Please Select"), value: "", disabled: true },
			{ label: __("Normal Width"), value: "page-width-normal" },
			{ label: __("Extra Width"), value: "page-width-extra" },
			{ label: __("99% Width"), value: "page-width-99" },
			{ label: __("Full Width"), value: "page-width-full" },
		];

		const { attributes, setAttributes } = props;
		const { width } = attributes;

		return (
			<>
				<BlockEdit {...props} />
				<InspectorControls>
					<PanelBody title={__("Settings")}>
						<Flex direction="column">
							<FlexItem>
								<SelectControl
									label={__("Spacer Width")}
									value={width || ""}
									options={widthOptions}
									onChange={(value) => setAttributes({ width: value })}
								/>
							</FlexItem>
						</Flex>
					</PanelBody>
				</InspectorControls>
			</>
		);
	};
}

addFilter(
	"editor.BlockEdit",
	"wcrh-extend-group/add-inspector-controls",
	addInspectorControls
);

/**
 * Add icon and position classes in the Editor.
 *
 * @since 0.1.0
 * @param {Object} BlockListBlock
 */
function addClasses(BlockListBlock) {
	return (props) => {
		const { name, attributes } = props;

		if ("core/group" !== name || !attributes?.width) {
			return <BlockListBlock {...props} />;
		}

		const classes = classnames(props?.className, attributes.width);

		return <BlockListBlock {...props} className={classes} />;
	};
}

addFilter("editor.BlockListBlock", "wcrh-extend-group/add-classes", addClasses);
