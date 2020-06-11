<?php

/**
 * React Plugin
 *
 *
 * @package   React Plugin
 * @author    RP
 * @wordpress-plugin
 * Plugin Name:       My React Plugin
 * Description:       Basic tutorial on React usage
 * Version:           1.0.0
 * Author:            RP
 * Text Domain:       my-react-plugin
 */

namespace BSF\ReactPlugin;

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
    die;
}

define( 'REACT_PLUGIN_VERSION', '1.0.0' );

spl_autoload_register(function ($class) {

    $prefix = __NAMESPACE__;
    $base_dir = __DIR__ . '/includes/';
    $len = strlen($prefix);
    if (strncmp($prefix, $class, $len) !== 0) {
        return;
    }
    $relative_class = substr($class, $len);
    $file = $base_dir . str_replace('\\', '/', $relative_class) . '.php';
    if (file_exists($file)) {
        require $file;
    }
});

function init() {
    Plugin::get_instance();
    Shortcode::get_instance();
    Admin::get_instance();
    Endpoint\Admin::get_instance();
    Endpoint\Submission::get_instance();
}
add_action( 'plugins_loaded', 'BSF\ReactPlugin\init' );
