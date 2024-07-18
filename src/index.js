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
		gridMobile: {
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

		const { attributes, setAttributes } = props;
		const { width, gridMobile, layout } = attributes;

		// Width options
		const widthOptions = [
			{ label: __("Please Select"), value: "" },
			{ label: __("Text Width (XS)"), value: "page-width-text" },
			{ label: __("Narrow Width (SM)"), value: "page-width-narrow" },
			{ label: __("Default Width (MD)"), value: "page-width-normal" },
			{ label: __("Extra Width (LG)"), value: "page-width-extra" },
			{ label: __("99% Width (XL)"), value: "page-width-99" },
			{ label: __("Full Width (XXL)"), value: "page-width-full" },
		];

		// Mob options
		const gridMobOptions = [
			{ label: __("Please Select"), value: "" },
			{ label: __("1 Column"), value: "mob-1-col" },
			{ label: __("2 Columns"), value: "mob-2-col" },
			{ label: __("No Change"), value: "mob-no-change" },
		];

		return (
			<>
				<BlockEdit {...props} />
				<InspectorControls>
					<PanelBody title={__("Settings")}>
						<Flex direction="column">
							<FlexItem>
								<SelectControl
									label={__("Group Width")}
									value={width || ""}
									options={widthOptions}
									onChange={(value) => setAttributes({ width: value })}
								/>
								<p>
									You can chose a maximum width for this group based on
									predesigned sizes.
								</p>
							</FlexItem>
							{layout?.type === "grid" && (
								<FlexItem>
									<SelectControl
										label={__("Mobile Columns")}
										value={gridMobile || ""}
										options={gridMobOptions}
										onChange={(value) => setAttributes({ gridMobile: value })}
									/>
									<p>
										You can chose to have the grid break into different columns
										on mobile.
									</p>
								</FlexItem>
							)}
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

		if ("core/group" !== name) {
			return <BlockListBlock {...props} />;
		}

		let newClasses = [];

		if (attributes?.width) {
			newClasses.push(attributes.width);
		}
		if (attributes?.gridMobile) {
			newClasses.push(attributes.gridMobile);
		}

		const classes = classnames(props?.className, ...newClasses);

		return <BlockListBlock {...props} className={classes} />;
	};
}

addFilter("editor.BlockListBlock", "wcrh-extend-group/add-classes", addClasses);
