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
 * URL optionnelle pour une page « devis JLM seul » (sans header/footer), ex. ancien lien / embed.
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

	$devis_choice_path = $dir . '/assets/js/devis-choice.js';
	if ( is_readable( $devis_choice_path ) ) {
		wp_enqueue_script(
			'labienveillance-devis-choice',
			$theme_uri . '/assets/js/devis-choice.js',
			array(),
			(string) filemtime( $devis_choice_path ),
			true
		);
		wp_localize_script(
			'labienveillance-devis-choice',
			'labienveillanceDevisChoice',
			array(
				'monteUrl' => esc_url_raw( home_url( '/monte-escaliers/#devis-estimatif-en-ligne' ) ),
				'sdbUrl'   => esc_url_raw( home_url( '/salle-de-bain/#devis-estimatif-salle-de-bain' ) ),
			)
		);
	}

	wp_enqueue_script(
		'labienveillance-main',
		$theme_uri . '/assets/js/main.js',
		is_readable( $devis_choice_path ) ? array( 'labienveillance-devis-choice' ) : array(),
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
	if ( is_page_template( 'page-devis-monte-escalier.php' ) || is_page_template( 'page-monte-escaliers.php' ) ) {
		return true;
	}
	if ( is_page( 'monte-escaliers' ) ) {
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
 * URLs absolues des illustrations du devis monte-escalier.
 *
 * Toutes les photos sont servies par le thème dans
 * `assets/img/devis-monte-escalier/`. Le filtre `labienveillance_jlm_images`
 * permet de surcharger n'importe quelle clé pour pointer vers la médiathèque
 * WP (utile quand le client envoie des photos de chantiers réels).
 *
 * @return array<string,string> Map clé JS -> URL absolue.
 */
function labienveillance_jlm_image_urls(): array {
	$uri = get_template_directory_uri() . '/assets/img/devis-monte-escalier/';
	$map = array(
		'logo'             => 'logo-jlm.png',
		'type_droit'       => 'escalier-droit.jpg',
		'type_90'          => 'escalier-90.jpg',
		'type_180'         => 'escalier-180.jpg',
		'type_ext'         => 'escalier-exterieur.jpg',
		'marque_up'        => 'marque-up-stairlift.jpg',
		'marque_acorn'     => 'marque-acorn.png',
		'depart_std'       => 'depart-standard.jpg',
		'depart_rall'      => 'depart-rallonge.jpg',
		'depart_p90'       => 'depart-pivot-90.jpg',
		'depart_p180'      => 'depart-pivot-180.jpg',
		'obstacle_ex1'     => 'obstacle-exemple-1.jpg',
		'obstacle_ex2'     => 'obstacle-exemple-2.jpg',
		'obstacle_yes'     => 'obstacle-oui.jpg',
		'obstacle_no'      => 'obstacle-non.jpg',
		'rail_1'           => 'rail-exemple-1.jpg',
		'rail_2'           => 'rail-exemple-2.jpg',
		'rail_yes'         => 'rail-oui.jpg',
		'rail_no'          => 'rail-non.jpg',
		'arr_nez'          => 'arrivee-nez-marche.jpg',
		'arr_prol'         => 'arrivee-prolongement.jpg',
		'arr_90'           => 'arrivee-90.jpg',
		'arr_180'          => 'arrivee-180.jpg',
		'pivot_manuel'     => 'pivot-manuel.jpg',
		'pivot_elec'       => 'pivot-electrique.jpg',
		'garanties_photo'  => 'garanties.jpg',
		'aides_photo'      => 'aides.jpg',
	);
	$urls = array();
	foreach ( $map as $key => $filename ) {
		$urls[ $key ] = $uri . $filename;
	}
	$filtered = apply_filters( 'labienveillance_jlm_images', $urls );
	return is_array( $filtered ) ? $filtered : $urls;
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
	wp_enqueue_style(
		'labienveillance-jlm-fonts',
		'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Source+Sans+3:wght@400;600;700&display=swap',
		array(),
		null
	);

	$css_path = $dir . '/assets/css/jlm-lite-devis.css';
	if ( is_readable( $css_path ) ) {
		wp_enqueue_style(
			'labienveillance-jlm-devis',
			$uri . '/assets/css/jlm-lite-devis.css',
			array( 'labienveillance-jlm-fonts' ),
			(string) filemtime( $css_path )
		);
	}

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
			'images'       => labienveillance_jlm_image_urls(),
		)
	);
}
add_action( 'wp_enqueue_scripts', 'labienveillance_enqueue_jlm_devis', 35 );

/**
 * Devis estimatif salle de bain — vrai/faux pour conditionner l'enqueue.
 * Ne charge le configurateur que sur la page « salle-de-bain » (slug ou modèle).
 */
function labienveillance_should_load_devis_sdb(): bool {
	if ( ! is_singular( 'page' ) ) {
		return false;
	}
	if ( is_page_template( 'page-salle-de-bain.php' ) ) {
		return true;
	}
	return is_page( 'salle-de-bain' );
}

/**
 * Devis estimatif salle de bain — enqueue CSS + JS et injection de la config.
 *
 * La config par défaut est dans le JS lui-même ; on injecte ici uniquement les
 * surcharges client (URL contact, prix, hints, photos) via le filtre
 * `labienveillance_devis_sdb_config`.
 *
 * Format attendu pour le filtre (exemple) :
 *   add_filter( 'labienveillance_devis_sdb_config', function ( $cfg ) {
 *       $cfg['contactUrl']            = '/contact/';
 *       $cfg['prices']['solAntiderapant'] = 990;
 *       $cfg['photos']['avant_1']     = 'https://exemple.fr/wp-content/uploads/avant-1.jpg';
 *       $cfg['hints']['fenetre']      = 'Texte personnalisé du conseiller…';
 *       return $cfg;
 *   } );
 */
function labienveillance_enqueue_devis_sdb(): void {
	if ( ! labienveillance_should_load_devis_sdb() ) {
		return;
	}

	$dir = get_template_directory();
	$uri = get_template_directory_uri();

	$css_path = $dir . '/assets/css/devis-sdb.css';
	if ( is_readable( $css_path ) ) {
		wp_enqueue_style(
			'labienveillance-devis-sdb',
			$uri . '/assets/css/devis-sdb.css',
			array( 'labienveillance-main' ),
			(string) filemtime( $css_path )
		);
	}

	$js_path = $dir . '/assets/js/devis-sdb.js';
	if ( ! is_readable( $js_path ) ) {
		return;
	}

	wp_enqueue_script(
		'labienveillance-devis-sdb',
		$uri . '/assets/js/devis-sdb.js',
		array(),
		(string) filemtime( $js_path ),
		true
	);

	/**
	 * Photos par défaut servies par le thème (assets/img/sdb/). Le client peut
	 * surcharger n'importe quelle clé via le filtre `labienveillance_devis_sdb_config`
	 * pour pointer vers la médiathèque WP.
	 */
	$photo_map = array(
		'avant_1'           => 'sdb-avant-1.jpg',
		'apres_1'           => 'sdb-apres-1.jpg',
		'avant_2'           => 'sdb-avant-2.jpg',
		'apres_2'           => 'sdb-apres-2.jpg',
		'habillage_1'       => 'sdb-habillage-1.jpg',
		'habillage_2'       => 'sdb-habillage-2.jpg',
		'sol_1'             => 'sdb-sol-1.jpg',
		'sol_2'             => 'sdb-sol-2.jpg',
		'porte_coulissante' => 'sdb-porte-coulissante.jpg',
		'seche_serviettes'  => 'sdb-seche-serviettes.jpg',
		'proposition_sdb'   => 'sdb-proposition-renovation.jpg',
	);
	$default_photos = array();
	foreach ( $photo_map as $key => $filename ) {
		$default_photos[ $key ] = $uri . '/assets/img/sdb/' . $filename;
	}

	/**
	 * Surcharges client (prix, hints, photos, URL contact). Tout est optionnel ;
	 * les défauts ci-dessus + ceux du JS (DEFAULTS) sont utilisés sinon.
	 */
	$config = apply_filters(
		'labienveillance_devis_sdb_config',
		array(
			'contactUrl'   => labienveillance_page_url( 'contact' ) . '#demander-rdv',
			'contactLabel' => __( 'Envoyer mon projet à La Bienveillance', 'labienveillance' ),
			'photos'       => $default_photos,
		)
	);

	if ( ! is_array( $config ) ) {
		$config = array();
	}

	wp_add_inline_script(
		'labienveillance-devis-sdb',
		'window.LBV_DEVIS_SDB = ' . wp_json_encode( $config ) . ';',
		'before'
	);
}
add_action( 'wp_enqueue_scripts', 'labienveillance_enqueue_devis_sdb', 40 );

/**
 * Pré-remplissage du formulaire de contact depuis les querystrings du
 * configurateur (`?projet=devis-sdb&total=…&recap=…`).
 *
 * Chargé uniquement sur la page « contact ». Marche pour le formulaire CF7
 * comme pour le formulaire HTML statique de secours, en se calant sur les
 * `name="sujet"` et `name="message"` partagés.
 */
function labienveillance_enqueue_contact_prefill(): void {
	if ( ! is_singular( 'page' ) ) {
		return;
	}
	if ( ! is_page( 'contact' ) && ! is_page_template( 'page-contact.php' ) ) {
		return;
	}

	$dir  = get_template_directory();
	$uri  = get_template_directory_uri();
	$path = $dir . '/assets/js/contact-prefill.js';
	if ( ! is_readable( $path ) ) {
		return;
	}

	wp_enqueue_script(
		'labienveillance-contact-prefill',
		$uri . '/assets/js/contact-prefill.js',
		array(),
		(string) filemtime( $path ),
		true
	);
}
add_action( 'wp_enqueue_scripts', 'labienveillance_enqueue_contact_prefill', 42 );

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
 * Pages secondaires à exclure des moteurs (noindex, follow).
 *
 * `mentions-legales` : page publiée au go-live, doit rester hors index.
 * `parrainage` : page non créée par défaut (programme reporté), conservée
 * dans la liste de manière défensive — au cas où le client la publierait
 * un jour avant que le contenu ne soit finalisé.
 *
 * Si Yoast SEO est actif, **Yoast prime** et écrase ces directives via la métabox
 * « Avancé » de la page (Autoriser les moteurs… → Non). Configurer côté Yoast pour la prod.
 */
function labienveillance_robots_noindex( array $robots ): array {
	if ( is_page( array( 'mentions-legales', 'parrainage' ) ) ) {
		$robots['noindex']  = true;
		$robots['follow']   = true;
		$robots['noarchive'] = true;
		unset( $robots['index'], $robots['archive'] );
	}
	return $robots;
}
add_filter( 'wp_robots', 'labienveillance_robots_noindex' );

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
		'<li role="none"><a href="#devis-estimatif" role="menuitem" data-devis-modal aria-haspopup="dialog" class="nav__link--cta-devis">%1$s</a></li>',
		esc_html( __( 'Devis estimatif', 'labienveillance' ) )
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
