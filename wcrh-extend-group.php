<?php

/**
 * Plugin Name:       WCRH Extend Core/Group
 * Description:       Add a custom options to the group block
 * Requires at least: 6.1
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            Gavin McGregor
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       wcrh-extend-group
 *
 * @package Wcrh
 */

defined('ABSPATH') || exit;

/**
 * Enqueue Editor scripts and styles.
 */

function extend_group_enqueue_block_editor_assets()
{
    $plugin_url  = untrailingslashit(plugin_dir_url(__FILE__));
    $asset_file  = include untrailingslashit(plugin_dir_path(__FILE__)) . '/build/index.asset.php';

    wp_enqueue_script(
        'extend-group-editor-scripts',
        $plugin_url . '/build/index.js',
        $asset_file['dependencies'],
        $asset_file['version']
    );
}
add_action('enqueue_block_editor_assets', 'extend_group_enqueue_block_editor_assets');

/**
 * Enqueue block styles 
 * (Applies to both frontend and Editor)
 */

function extend_group_block_styles()
{
    $plugin_path = untrailingslashit(plugin_dir_path(__FILE__));
    $plugin_url  = untrailingslashit(plugin_dir_url(__FILE__));

    wp_enqueue_block_style(
        'core/columns',
        array(
            'handle' => 'extend_group-block-styles',
            'src'    => $plugin_url . '/build/style.css',
            'ver'    => wp_get_theme()->get('Version'),
            'path'   => $plugin_path . '/build/style.css',
        )
    );
}
add_action('init', 'extend_group_block_styles');

/**
 * Add classes from editor to the frontend 
 */

function extend_group_render_block_columns($block_content, $block)
{
    if ($block['blockName'] !== 'core/group') {
        return $block_content;
    }

    $classes = array();
    $inline_styles = array();

    // Check Classes
    if (isset($block['attrs']['fullHeight']) && !empty($block['attrs']['fullHeight'])) {
        $classes[] = 'min-screen-height';
    }
    if (isset($block['attrs']['width']) && !empty($block['attrs']['width'])) {
        $classes[] = $block['attrs']['width'];
    }
    if (isset($block['attrs']['gridMobile']) && !empty($block['attrs']['gridMobile'])) {
        $classes[] = $block['attrs']['gridMobile'];
    }
    if (isset($block['attrs']['centerVert']) && !empty($block['attrs']['centerVert'])) {
        $classes[] = 'section-center-vert';
    }

    // Check Inline Styles
    if (isset($block['attrs']['customWidth']) && !empty($block['attrs']['customWidth'])) {
        $inline_styles['max-width'] = $block['attrs']['customWidth'] . $block['attrs']['widthUnit'];
    }
    if (isset($block['attrs']['marginAuto']) && !empty($block['attrs']['marginAuto'])) {
        $inline_styles['margin-left'] = 'auto';
        $inline_styles['margin-right'] = 'auto';
    }

    // If Neither
    if (empty($classes) && empty($inline_styles)) {
        return $block_content;
    }

    // Process the block content to add the classes
    if (class_exists('WP_HTML_Tag_Processor')) {
        $p = new WP_HTML_Tag_Processor($block_content);


        // Add Classes
        if ($p->next_tag()) {
            $p->add_class(implode(' ', $classes));
        }

        // Add inline styles
        // Build the inline styles string
        $style_string = '';
        foreach ($inline_styles as $property => $value) {
            $style_string .= $property . ':' . esc_attr($value) . '; ';
        }

        // Check for existing styles and concatenate
        $block_content = $p->get_updated_html();

        // Update the block_content with new inline styles
        if (preg_match('/style="([^"]*)"/', $block_content, $matches)) {
            // If a style attribute exists, append new styles
            $existing_styles = trim($matches[1]);
            $new_style = $existing_styles . '; ' . trim($style_string);
            $block_content = str_replace($matches[0], 'style="' . esc_attr($new_style) . '"', $block_content);
        } else {
            // If no style attribute exists, add it
            $block_content = preg_replace('/(<\w+)([^>]*>)/', '$1 style="' . esc_attr(trim($style_string)) . '"$2', $block_content, 1);
        }
    } else {
        $block_content = preg_replace('/(<\w+)([^>]*>)/', '$1 class="' . esc_attr(implode(' ', $classes)) . '"$2', $block_content, 1);
    }

    return $block_content;
}

add_filter('render_block', 'extend_group_render_block_columns', 10, 2);
