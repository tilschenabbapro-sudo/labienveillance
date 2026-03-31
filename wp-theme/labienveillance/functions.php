<?php
/**
 * La Bienveillance — fonctions du thème
 *
 * @package Labienveillance
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'LABIENVEILANCE_VERSION', '0.1.0' );
define( 'LABIENVEILANCE_GTM_ID', 'GTM-NZVHPJ3Z' );

/**
 * ID conteneur Google Tag Manager. Filtre : retourner une chaîne vide pour désactiver.
 */
function labienveillance_gtm_container_id(): string {
	$id = apply_filters( 'labienveillance_gtm_container_id', LABIENVEILANCE_GTM_ID );
	return is_string( $id ) ? trim( $id ) : '';
}

/**
 * Google Tag Manager — script dans le &lt;head&gt;.
 */
function labienveillance_gtm_head(): void {
	$id = labienveillance_gtm_container_id();
	if ( '' === $id ) {
		return;
	}
	?>
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','<?php echo esc_js( $id ); ?>');</script>
<!-- End Google Tag Manager -->
	<?php
}
add_action( 'wp_head', 'labienveillance_gtm_head', 1 );

/**
 * Google Tag Manager — iframe noscript juste après &lt;body&gt; (via wp_body_open).
 */
function labienveillance_gtm_noscript(): void {
	$id = labienveillance_gtm_container_id();
	if ( '' === $id ) {
		return;
	}
	$url = 'https://www.googletagmanager.com/ns.html?id=' . rawurlencode( $id );
	?>
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="<?php echo esc_url( $url ); ?>"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
	<?php
}
add_action( 'wp_body_open', 'labienveillance_gtm_noscript', 1 );

/**
 * URL d’une image du dossier assets/img/
 */
function labienveillance_img( string $filename ): string {
	return esc_url( get_theme_file_uri( 'assets/img/' . ltrim( $filename, '/' ) ) );
}

/**
 * Lien vers une page par slug (permaliens « %postname% »).
 */
function labienveillance_page_url( string $slug ): string {
	$slug = trim( $slug, '/' );
	if ( '' === $slug ) {
		return esc_url( home_url( '/' ) );
	}
	return esc_url( home_url( '/' . $slug . '/' ) );
}

/**
 * URL à utiliser pour l’iframe « devis JLM » : uniquement l’outil, sans header/footer du site.
 * 1) Filtre labienveillance_devis_iframe_url si renseigné.
 * 2) Sinon première page publiée au modèle « Embed — Devis JLM seul ».
 * 3) Sinon fichier statique à la racine /devis-embed.html (à déployer avec js/jlm-lite-devis.js).
 */
function labienveillance_get_devis_embed_url(): string {
	$custom = apply_filters( 'labienveillance_devis_iframe_url', null );
	if ( is_string( $custom ) && '' !== trim( $custom ) ) {
		return esc_url( $custom );
	}

	$q = new WP_Query(
		array(
			'post_type'              => 'page',
			'posts_per_page'         => 1,
			'post_status'            => 'publish',
			'no_found_rows'          => true,
			'ignore_sticky_posts'    => true,
			'update_post_meta_cache' => false,
			'update_post_term_cache' => false,
			'meta_key'               => '_wp_page_template',
			'meta_value'             => 'page-embed-devis-jlm.php',
			'fields'                 => 'ids',
		)
	);

	if ( $q->have_posts() ) {
		return esc_url( get_permalink( (int) $q->posts[0] ) );
	}

	return esc_url( home_url( '/devis-embed.html' ) );
}

/**
 * Thème clair / sombre : script dans le <head> pour éviter un flash de fond clair.
 */
function labienveillance_theme_init_script(): void {
	$dir  = get_template_directory();
	$uri  = get_template_directory_uri();
	$path = $dir . '/assets/js/theme-init.js';
	if ( ! is_readable( $path ) ) {
		return;
	}
	wp_enqueue_script(
		'labienveillance-theme-init',
		$uri . '/assets/js/theme-init.js',
		array(),
		(string) filemtime( $path ),
		false
	);
}
add_action( 'wp_enqueue_scripts', 'labienveillance_theme_init_script', 3 );

/**
 * Enqueue styles & scripts (identique à la maquette statique).
 */
function labienveillance_assets(): void {
	$theme_uri = get_template_directory_uri();
	$dir       = get_template_directory();

	wp_enqueue_style(
		'labienveillance-fonts',
		'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Source+Sans+3:wght@300;400;500;600;700&display=swap',
		array(),
		null
	);

	$css_path = $dir . '/assets/css/style.css';
	wp_enqueue_style(
		'labienveillance-main',
		$theme_uri . '/assets/css/style.css',
		array( 'labienveillance-fonts' ),
		file_exists( $css_path ) ? (string) filemtime( $css_path ) : LABIENVEILANCE_VERSION
	);

	wp_enqueue_script(
		'labienveillance-main',
		$theme_uri . '/assets/js/main.js',
		array(),
		file_exists( $dir . '/assets/js/main.js' ) ? (string) filemtime( $dir . '/assets/js/main.js' ) : LABIENVEILANCE_VERSION,
		true
	);
}
add_action( 'wp_enqueue_scripts', 'labienveillance_assets' );

/**
 * Menus WP : le HTML utilise <nav class="nav"><a>…</a></nav> ; WordPress sort des <ul><li>.
 */
function labienveillance_nav_wp_compat_css(): void {
	$css = '
		.nav > ul { display: flex; flex-wrap: wrap; align-items: center; gap: 0.05rem; list-style: none; margin: 0; padding: 0; }
		.nav li { margin: 0; padding: 0; list-style: none; }
	';
	wp_add_inline_style( 'labienveillance-main', $css );
}
add_action( 'wp_enqueue_scripts', 'labienveillance_nav_wp_compat_css', 25 );

/**
 * Pages sur lesquelles charger l’outil devis JLM (admin-ajax jlm_get_config / jlm_save_config côté site).
 */
function labienveillance_should_load_jlm_devis(): bool {
	if ( ! is_singular( 'page' ) ) {
		return false;
	}
	if ( is_page_template( 'page-devis-monte-escalier.php' ) ) {
		return true;
	}
	$slugs = array(
		'devis-estimatif',
		'devis-estimatif-monte-escalier',
		'elementor-1985',
	);
	return is_page( $slugs );
}

/**
 * Script devis estimatif (extrait de la page Elementor actuelle).
 */
function labienveillance_enqueue_jlm_devis(): void {
	if ( ! labienveillance_should_load_jlm_devis() ) {
		return;
	}
	$dir  = get_template_directory();
	$uri  = get_template_directory_uri();
	$path = $dir . '/assets/js/jlm-lite-devis.js';
	if ( ! is_readable( $path ) ) {
		return;
	}
	wp_enqueue_script(
		'labienveillance-jlm-devis',
		$uri . '/assets/js/jlm-lite-devis.js',
		array(),
		(string) filemtime( $path ),
		true
	);
	wp_localize_script(
		'labienveillance-jlm-devis',
		'labienveillanceJlm',
		array(
			'ajaxUrl'      => admin_url( 'admin-ajax.php' ),
			'contactUrl'   => home_url( '/contact/' ),
			'contactLabel' => __( 'CONTACTEZ-NOUS', 'labienveillance' ),
		)
	);
}
add_action( 'wp_enqueue_scripts', 'labienveillance_enqueue_jlm_devis', 35 );

/**
 * Prise en charge du thème.
 */
function labienveillance_setup(): void {
	load_theme_textdomain( 'labienveillance', get_template_directory() . '/languages' );
	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support(
		'html5',
		array( 'search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script' )
	);
	add_theme_support( 'custom-logo', array( 'height' => 80, 'width' => 240, 'flex-height' => true, 'flex-width' => true ) );

	register_nav_menus(
		array(
			'primary' => __( 'Menu principal', 'labienveillance' ),
		)
	);
}
add_action( 'after_setup_theme', 'labienveillance_setup' );

/**
 * Conserver l’alignement header si logo personnalisé.
 */
function labienveillance_custom_logo_link_class( string $html ): string {
	return str_replace( 'class="custom-logo-link"', 'class="custom-logo-link header__logo"', $html );
}
add_filter( 'get_custom_logo', 'labienveillance_custom_logo_link_class' );

/**
 * Menu par défaut si aucun menu n’est assigné à « primary ».
 */
function labienveillance_nav_fallback(): void {
	echo '<nav class="nav" aria-label="' . esc_attr__( 'Navigation principale', 'labienveillance' ) . '">';
	echo '<ul class="nav__list" role="menubar">';

	$home_url = labienveillance_page_url( '' );
	$home_act = is_front_page() ? ' class="active"' : '';
	printf(
		'<li role="none"><a href="%s" role="menuitem"%s>%s</a></li>',
		esc_url( $home_url ),
		$home_act, // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		esc_html( __( 'Accueil', 'labienveillance' ) )
	);

	$services_active = is_page( array( 'monte-escaliers', 'salle-de-bain', 'amenagements' ) );
	$trail_class     = $services_active ? 'menu-item-has-children active-trail' : 'menu-item-has-children';
	printf( '<li class="%s" role="none">', esc_attr( $trail_class ) );
	echo '<button type="button" class="nav__dropdown-toggle" aria-expanded="false" aria-haspopup="true" aria-controls="nav-submenu-services" id="nav-btn-services">';
	echo esc_html__( 'Nos services', 'labienveillance' );
	echo '</button>';
	echo '<ul class="sub-menu" id="nav-submenu-services" role="menu">';
	$services = array(
		array( 'monte-escaliers', __( 'Monte-escaliers', 'labienveillance' ) ),
		array( 'salle-de-bain', __( 'Salle de bain', 'labienveillance' ) ),
		array( 'amenagements', __( 'Aménagements', 'labienveillance' ) ),
	);
	foreach ( $services as $row ) {
		$u   = labienveillance_page_url( $row[0] );
		$act = is_page( $row[0] ) ? ' class="active"' : '';
		printf(
			'<li role="none"><a href="%s" role="menuitem"%s>%s</a></li>',
			esc_url( $u ),
			$act, // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			esc_html( $row[1] )
		);
	}
	echo '</ul></li>';

	printf(
		'<li role="none"><a href="%s" role="menuitem" class="nav__link--cta-devis">%s</a></li>',
		esc_url( home_url( '/#devis-estimatif-en-ligne' ) ),
		esc_html( __( 'Devis en ligne', 'labienveillance' ) )
	);

	$rest = array(
		array( 'conseils', __( 'Conseils & Santé', 'labienveillance' ) ),
		array( 'aides-financieres', __( 'Aides', 'labienveillance' ) ),
		array( 'contact', __( 'Contact', 'labienveillance' ) ),
	);
	foreach ( $rest as $item ) {
		$url    = labienveillance_page_url( $item[0] );
		$active = is_page( $item[0] ) ? ' class="active"' : '';
		printf(
			'<li role="none"><a href="%s" role="menuitem"%s>%s</a></li>',
			esc_url( $url ),
			$active, // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			esc_html( $item[1] )
		);
	}

	echo '</ul></nav>';
}
